import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// GET /api/transporteur/pb-transport?page=1&limit=20&depart=...&destination=...&status=ACTIVE
// - TRANSPORTEUR : ses propres annonces
// - CLIENT       : toutes les annonces ACTIVE (lecture publique)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const auth = await requireAuth(req, res, ["TRANSPORTEUR", "CLIENT"]);
  if (!auth) return;

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const skip = (page - 1) * limit;

  const depart = req.query.depart as string | undefined;
  const destination = req.query.destination as string | undefined;
  const status = req.query.status as string | undefined;

  try {
    const where: Record<string, unknown> = {};

    if (auth.role === "TRANSPORTEUR") {
      // Filtrer uniquement les annonces du transporteur connecté
      const transporteur = await prisma.transporteur.findUnique({
        where: { utilisateur_id: Number(auth.id) },
        include: { transports: { select: { id_transport: true } } },
      });

      if (!transporteur) {
        return res
          .status(404)
          .json({ error: "Profil transporteur introuvable." });
      }

      const transportIds = transporteur.transports.map((t) => t.id_transport);
      where.transport_id = { in: transportIds };
      if (status) where.status = status;
    } else {
      // CLIENT : uniquement les annonces actives, toutes confondues
      where.status = "ACTIVE";
    }

    if (depart) where.depart = { contains: depart, mode: "insensitive" };
    if (destination)
      where.destination = { contains: destination, mode: "insensitive" };

    const [total, annonces] = await Promise.all([
      prisma.pbTransport.count({ where }),
      prisma.pbTransport.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id_pb_transport: "desc" },
        include: {
          transport: {
            select: {
              marque: true,
              type: true,
              immatriculation: true,
              images: true,
              transporteur: {
                select: {
                  utilisateur: {
                    select: { nom: true, prenom: true, phone: true },
                  },
                },
              },
            },
          },
          _count: { select: { reservations: true } },
        },
      }),
    ]);

    return res.status(200).json({
      data: annonces,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/transporteur/pb-transport]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

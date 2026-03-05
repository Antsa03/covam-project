import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// GET /api/transporteur/reservation?page=1&limit=20&status=...
// Liste les réservations reçues pour les annonces du transporteur connecté
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const auth = await requireAuth(req, res, ["TRANSPORTEUR"]);
  if (!auth) return;

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  const status = req.query.status as string | undefined;

  try {
    const transporteur = await prisma.transporteur.findUnique({
      where: { utilisateur_id: Number(auth.id) },
      include: {
        transports: {
          select: { pb_transports: { select: { id_pb_transport: true } } },
        },
      },
    });

    if (!transporteur) {
      return res
        .status(404)
        .json({ error: "Profil transporteur introuvable." });
    }

    const pbTransportIds = transporteur.transports.flatMap((t) =>
      t.pb_transports.map((pb) => pb.id_pb_transport),
    );

    const where: Record<string, unknown> = {
      pb_transport_id: { in: pbTransportIds },
    };
    if (status) where.status = status;

    const [total, reservations] = await Promise.all([
      prisma.transportReservation.count({ where }),
      prisma.transportReservation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date_reservation: "desc" },
        include: {
          client: {
            include: {
              utilisateur: {
                select: { nom: true, prenom: true, phone: true, email: true },
              },
            },
          },
          pb_transport: {
            select: { depart: true, destination: true, prix_par_kilo: true },
          },
          payement: { select: { status: true, prix: true } },
          cargo_reservation: { select: { status: true, prix: true } },
        },
      }),
    ]);

    return res.status(200).json({
      data: reservations,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/transporteur/reservation]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

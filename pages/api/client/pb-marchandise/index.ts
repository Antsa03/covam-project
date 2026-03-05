import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// GET /api/client/pb-marchandise?page=1&limit=20&depart=...&destination=...&status=...
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const auth = await requireAuth(req, res, ["CLIENT"]);
  if (!auth) return;

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const skip = (page - 1) * limit;

  const depart = req.query.depart as string | undefined;
  const destination = req.query.destination as string | undefined;
  const status = req.query.status as string | undefined;

  try {
    const client = await prisma.client.findUnique({
      where: { utilisateur_id: Number(auth.id) },
    });

    if (!client) {
      return res.status(404).json({ error: "Profil client introuvable." });
    }

    const where: Record<string, unknown> = { client_id: client.id_client };
    if (depart) where.depart = { contains: depart, mode: "insensitive" };
    if (destination)
      where.destination = { contains: destination, mode: "insensitive" };
    if (status) where.status = status;

    const [total, annonces] = await Promise.all([
      prisma.pbMarchandise.count({ where }),
      prisma.pbMarchandise.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date_creation: "desc" },
      }),
    ]);

    return res.status(200).json({
      data: annonces,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/client/pb-marchandise]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

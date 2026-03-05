import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// GET /api/transporteur/transport?page=1&limit=20
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

  try {
    const transporteur = await prisma.transporteur.findUnique({
      where: { utilisateur_id: Number(auth.id) },
    });

    if (!transporteur) {
      return res
        .status(404)
        .json({ error: "Profil transporteur introuvable." });
    }

    const where = { transporteur_id: transporteur.id_transporteur };

    const [total, transports] = await Promise.all([
      prisma.transport.count({ where }),
      prisma.transport.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id_transport: "desc" },
        include: { pb_transports: true },
      }),
    ]);

    return res.status(200).json({
      data: transports,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/transporteur/transport]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

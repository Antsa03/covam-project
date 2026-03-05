import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// GET /api/admin/transport?page=1&limit=20&search=...
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const auth = await requireAuth(req, res, ["ADMIN"]);
  if (!auth) return;

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  const search = req.query.search as string | undefined;

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { marque: { contains: search, mode: "insensitive" } },
      { immatriculation: { contains: search, mode: "insensitive" } },
      { type: { contains: search, mode: "insensitive" } },
      {
        transporteur: {
          utilisateur: {
            OR: [
              { nom: { contains: search, mode: "insensitive" } },
              { prenom: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      },
    ];
  }

  try {
    const [total, items] = await Promise.all([
      prisma.transport.count({ where }),
      prisma.transport.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id_transport: "desc" },
        include: {
          transporteur: {
            include: {
              utilisateur: {
                select: { nom: true, prenom: true, email: true, phone: true },
              },
            },
          },
          _count: { select: { pb_transports: true } },
        },
      }),
    ]);

    return res.status(200).json({
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/admin/transport]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

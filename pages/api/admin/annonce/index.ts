import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// GET /api/admin/annonce?page=1&limit=20&status=ACTIVE
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
  const status = req.query.status as string | undefined;

  const where: Record<string, unknown> = {};
  if (status && ["ACTIVE", "INACTIVE", "PENDING"].includes(status)) {
    where.status = status;
  }

  try {
    const [total, items] = await Promise.all([
      prisma.pbTransport.count({ where }),
      prisma.pbTransport.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id_pb_transport: "desc" },
        include: {
          transport: {
            include: {
              transporteur: {
                include: {
                  utilisateur: {
                    select: { nom: true, prenom: true, email: true },
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
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/admin/annonce]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// GET /api/admin/payement?page=1&limit=20&status=...
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
  if (status && ["PENDING", "PAID", "FAILED", "REFUNDED"].includes(status)) {
    where.status = status;
  }

  try {
    const [total, items] = await Promise.all([
      prisma.payement.count({ where }),
      prisma.payement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date_payement: "desc" },
        include: {
          reservation: {
            select: {
              label: true,
              depart: true,
              destination: true,
              client: {
                include: {
                  utilisateur: { select: { nom: true, prenom: true } },
                },
              },
            },
          },
          cargo_reservation: {
            select: {
              id_cargo_reservation: true,
              reservation: {
                select: {
                  label: true,
                  depart: true,
                  destination: true,
                  client: {
                    include: {
                      utilisateur: { select: { nom: true, prenom: true } },
                    },
                  },
                },
              },
            },
          },
        },
      }),
    ]);

    return res.status(200).json({
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/admin/payement]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

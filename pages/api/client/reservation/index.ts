import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// GET /api/client/reservation?page=1&limit=20&status=...
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
  const status = req.query.status as string | undefined;

  try {
    const client = await prisma.client.findUnique({
      where: { utilisateur_id: Number(auth.id) },
    });

    if (!client) {
      return res.status(404).json({ error: "Profil client introuvable." });
    }

    const where: Record<string, unknown> = { client_id: client.id_client };
    if (status) where.status = status;

    const [total, reservations] = await Promise.all([
      prisma.transportReservation.count({ where }),
      prisma.transportReservation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date_reservation: "desc" },
        include: {
          pb_transport: {
            include: {
              transport: {
                include: {
                  transporteur: {
                    include: {
                      utilisateur: {
                        select: { nom: true, prenom: true, phone: true },
                      },
                    },
                  },
                },
              },
            },
          },
          payement: {
            select: { status: true, prix: true, date_payement: true },
          },
          cargo_reservation: { select: { status: true, prix: true } },
        },
      }),
    ]);

    return res.status(200).json({
      data: reservations,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/client/reservation]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

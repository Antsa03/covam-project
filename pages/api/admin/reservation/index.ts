import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// GET /api/admin/reservation?page=1&limit=20&status=PENDING&search=...
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
  const search = req.query.search as string | undefined;

  const where: Record<string, unknown> = {};
  if (
    status &&
    ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].includes(status)
  ) {
    where.status = status;
  }
  if (search) {
    where.OR = [
      { label: { contains: search, mode: "insensitive" } },
      { depart: { contains: search, mode: "insensitive" } },
      { destination: { contains: search, mode: "insensitive" } },
      {
        client: {
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
                select: { nom: true, prenom: true, email: true, phone: true },
              },
            },
          },
          pb_transport: {
            select: {
              depart: true,
              destination: true,
              prix_par_kilo: true,
              transport: {
                select: { marque: true, immatriculation: true },
              },
            },
          },
          cargo_reservation: { select: { prix: true, status: true } },
          payement: { select: { status: true, prix: true } },
        },
      }),
    ]);

    return res.status(200).json({
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/admin/reservation]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

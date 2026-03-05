import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// GET /api/admin/user?page=1&limit=20&role=CLIENT|TRANSPORTEUR&search=...
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
  const role = req.query.role as string | undefined;
  const search = req.query.search as string | undefined;

  const where: Record<string, unknown> = {};

  if (role && ["CLIENT", "TRANSPORTEUR"].includes(role)) {
    where.role = role;
  }

  if (search) {
    where.OR = [
      { nom: { contains: search, mode: "insensitive" } },
      { prenom: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { cin: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [total, utilisateurs] = await Promise.all([
      prisma.utilisateur.count({ where }),
      prisma.utilisateur.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date_creation: "desc" },
        select: {
          id_utilisateur: true,
          nom: true,
          prenom: true,
          cin: true,
          phone: true,
          adresse: true,
          city: true,
          date_naissance: true,
          email: true,
          role: true,
          date_creation: true,
          date_mise_a_jour: true,
          transporteur: { select: { id_transporteur: true } },
          client: { select: { id_client: true, image: true } },
        },
      }),
    ]);

    return res.status(200).json({
      data: utilisateurs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/user]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

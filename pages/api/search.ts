import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 50;

/**
 * GET /api/search
 *
 * Query params:
 *   depart       – city of departure (optional)
 *   destination  – city of arrival  (optional)
 *   page         – page number, 1-based (default: 1)
 *   limit        – results per page  (default: 6, max: 50)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const depart = typeof req.query.depart === "string" ? req.query.depart.trim() : undefined;
  const destination = typeof req.query.destination === "string" ? req.query.destination.trim() : undefined;

  const rawPage = parseInt(req.query.page as string, 10);
  const rawLimit = parseInt(req.query.limit as string, 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const limit = isNaN(rawLimit) || rawLimit < 1 ? DEFAULT_LIMIT : Math.min(rawLimit, MAX_LIMIT);
  const skip = (page - 1) * limit;

  try {
    const where = {
      status: "ACTIVE" as const,
      ...(depart ? { depart: { contains: depart, mode: "insensitive" as const } } : {}),
      ...(destination ? { destination: { contains: destination, mode: "insensitive" as const } } : {}),
    };

    const [total, annonces] = await Promise.all([
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
                    select: {
                      nom: true,
                      prenom: true,
                      city: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
    ]);

    const hasMore = skip + annonces.length < total;

    return res.status(200).json({
      data: annonces,
      total,
      page,
      limit,
      hasMore,
    });
  } catch (error) {
    console.error("[GET /api/search]", error);
    return res.status(500).json({ error: "Une erreur est survenue." });
  }
}

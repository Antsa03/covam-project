import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { requireAuth } from "../../../lib/middleware";

// GET /api/auth/posts-quota
// Returns the monthly post count for PARTICULIER users
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const auth = await requireAuth(req, res, ["PARTICULIER"]);
  if (!auth) return;

  try {
    const client = await prisma.client.findUnique({
      where: { utilisateur_id: Number(auth.id) },
      select: { id_client: true },
    });

    if (!client) {
      return res.status(404).json({ error: "Profil introuvable." });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const postsThisMonth = await prisma.pbMarchandise.count({
      where: {
        client_id: client.id_client,
        date_creation: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    return res.status(200).json({
      data: {
        postsThisMonth,
        monthlyLimit: null,
        remaining: null,
      },
    });
  } catch (error) {
    console.error("[GET /api/auth/posts-quota]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

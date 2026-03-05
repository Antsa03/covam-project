import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// GET /api/admin/stats
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const auth = await requireAuth(req, res, ["ADMIN"]);
  if (!auth) return;

  try {
    const [
      totalClients,
      totalTransporteurs,
      totalTransports,
      totalAnnonces,
      annonceActives,
      totalReservations,
      pendingReservations,
      totalPaiements,
      pendingPaiements,
      revenuTotal,
      totalMarchandises,
    ] = await Promise.all([
      prisma.client.count(),
      prisma.transporteur.count(),
      prisma.transport.count(),
      prisma.pbTransport.count(),
      prisma.pbTransport.count({ where: { status: "ACTIVE" } }),
      prisma.transportReservation.count(),
      prisma.transportReservation.count({ where: { status: "PENDING" } }),
      prisma.payement.count(),
      prisma.payement.count({ where: { status: "PENDING" } }),
      prisma.payement.aggregate({
        _sum: { prix: true },
        where: { status: "PAID" },
      }),
      prisma.pbMarchandise.count(),
    ]);

    return res.status(200).json({
      totalClients,
      totalTransporteurs,
      totalTransports,
      totalAnnonces,
      annonceActives,
      totalReservations,
      pendingReservations,
      totalPaiements,
      pendingPaiements,
      revenuTotal: revenuTotal._sum.prix ?? 0,
      totalMarchandises,
    });
  } catch (error) {
    console.error("[GET /api/admin/stats]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

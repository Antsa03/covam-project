import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// DELETE /api/client/reservation/delete?id=<id_reservation>
// Seules les réservations en attente (PENDING) peuvent être supprimées
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const auth = await requireAuth(req, res, ["CLIENT"]);
  if (!auth) return;

  const id = Number(req.query.id);
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "ID réservation invalide." });
  }

  try {
    const client = await prisma.client.findUnique({
      where: { utilisateur_id: Number(auth.id) },
    });

    if (!client) {
      return res.status(404).json({ error: "Profil client introuvable." });
    }

    const reservation = await prisma.transportReservation.findUnique({
      where: { id_reservation: id },
    });

    if (!reservation) {
      return res.status(404).json({ error: "Réservation introuvable." });
    }

    if (reservation.client_id !== client.id_client) {
      return res.status(403).json({ error: "Accès refusé." });
    }

    if (reservation.status !== "PENDING") {
      return res.status(400).json({
        error: "Seules les réservations en attente peuvent être supprimées.",
      });
    }

    await prisma.transportReservation.delete({ where: { id_reservation: id } });

    return res
      .status(200)
      .json({ message: "Réservation supprimée avec succès." });
  } catch (error) {
    console.error("[DELETE /api/client/reservation/delete]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

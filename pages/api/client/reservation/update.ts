import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// PUT /api/client/reservation/update?id=<id_reservation>
// Le client ne peut qu'annuler sa réservation
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const auth = await requireAuth(req, res, ["CLIENT"]);
  if (!auth) return;

  const id = Number(req.query.id);
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "ID réservation invalide." });
  }

  const { status } = req.body;
  if (status !== "CANCELLED") {
    return res
      .status(400)
      .json({
        error:
          "Un client ne peut que annuler une réservation (status: CANCELLED).",
      });
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

    if (reservation.status === "COMPLETED") {
      return res
        .status(400)
        .json({
          error: "Impossible d'annuler une réservation déjà complétée.",
        });
    }

    const updated = await prisma.transportReservation.update({
      where: { id_reservation: id },
      data: { status: "CANCELLED" },
    });

    return res.status(200).json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/client/reservation/update]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

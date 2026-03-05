import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// PUT /api/transporteur/reservation/update?id=<id_reservation>
// Le transporteur peut confirmer, compléter ou annuler une réservation
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const auth = await requireAuth(req, res, ["TRANSPORTEUR"]);
  if (!auth) return;

  const id = Number(req.query.id);
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "ID réservation invalide." });
  }

  const { status } = req.body;
  const allowedStatuses = ["CONFIRMED", "COMPLETED", "CANCELLED"];
  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({
      error: `Statut invalide. Valeurs acceptées : ${allowedStatuses.join(", ")}.`,
    });
  }

  try {
    const transporteur = await prisma.transporteur.findUnique({
      where: { utilisateur_id: Number(auth.id) },
    });

    if (!transporteur) {
      return res
        .status(404)
        .json({ error: "Profil transporteur introuvable." });
    }

    const reservation = await prisma.transportReservation.findUnique({
      where: { id_reservation: id },
      include: {
        pb_transport: {
          include: {
            transport: { select: { transporteur_id: true } },
          },
        },
      },
    });

    if (!reservation) {
      return res.status(404).json({ error: "Réservation introuvable." });
    }

    if (
      reservation.pb_transport.transport.transporteur_id !==
      transporteur.id_transporteur
    ) {
      return res.status(403).json({ error: "Accès refusé." });
    }

    const updated = await prisma.transportReservation.update({
      where: { id_reservation: id },
      data: { status },
    });

    return res.status(200).json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/transporteur/reservation/update]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

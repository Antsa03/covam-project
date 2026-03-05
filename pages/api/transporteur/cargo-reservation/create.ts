import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// POST /api/transporteur/cargo-reservation/create
// Le transporteur crée une cargo réservation pour une réservation confirmée
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const auth = await requireAuth(req, res, ["TRANSPORTEUR"]);
  if (!auth) return;

  const { reservation_id, prix } = req.body;

  if (!reservation_id || prix == null) {
    return res
      .status(400)
      .json({ error: "reservation_id et prix sont obligatoires." });
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
      where: { id_reservation: Number(reservation_id) },
      include: {
        pb_transport: {
          include: { transport: { select: { transporteur_id: true } } },
        },
        cargo_reservation: true,
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

    if (reservation.cargo_reservation) {
      return res
        .status(409)
        .json({ error: "Une réservation cargo existe déjà." });
    }

    const cargoReservation = await prisma.cargoReservation.create({
      data: {
        prix: Number(prix),
        status: "PENDING",
        reservation_id: Number(reservation_id),
      },
    });

    return res.status(201).json({ data: cargoReservation });
  } catch (error) {
    console.error("[POST /api/transporteur/cargo-reservation/create]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

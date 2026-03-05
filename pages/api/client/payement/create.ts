import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// POST /api/client/payement/create
// Le client crée un paiement pour une réservation transport ou cargo
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const auth = await requireAuth(req, res, ["CLIENT"]);
  if (!auth) return;

  const { reservation_id, cargo_reservation_id, prix, num_telephone } =
    req.body;

  if (
    (!reservation_id && !cargo_reservation_id) ||
    prix == null ||
    !num_telephone
  ) {
    return res.status(400).json({
      error:
        "reservation_id ou cargo_reservation_id, prix et num_telephone sont obligatoires.",
    });
  }

  if (reservation_id && cargo_reservation_id) {
    return res.status(400).json({
      error:
        "Un paiement ne peut être lié qu'à une seule réservation à la fois.",
    });
  }

  try {
    const client = await prisma.client.findUnique({
      where: { utilisateur_id: Number(auth.id) },
    });

    if (!client) {
      return res.status(404).json({ error: "Profil client introuvable." });
    }

    if (reservation_id) {
      const reservation = await prisma.transportReservation.findUnique({
        where: { id_reservation: Number(reservation_id) },
      });
      if (!reservation || reservation.client_id !== client.id_client) {
        return res
          .status(403)
          .json({ error: "Accès refusé à cette réservation." });
      }
      const existing = await prisma.payement.findUnique({
        where: { reservation_id: Number(reservation_id) },
      });
      if (existing) {
        return res
          .status(409)
          .json({ error: "Un paiement existe déjà pour cette réservation." });
      }
    }

    if (cargo_reservation_id) {
      const cargo = await prisma.cargoReservation.findUnique({
        where: { id_cargo_reservation: Number(cargo_reservation_id) },
        include: { reservation: true },
      });
      if (!cargo || cargo.reservation.client_id !== client.id_client) {
        return res
          .status(403)
          .json({ error: "Accès refusé à cette cargo réservation." });
      }
      const existing = await prisma.payement.findUnique({
        where: { cargo_reservation_id: Number(cargo_reservation_id) },
      });
      if (existing) {
        return res.status(409).json({
          error: "Un paiement existe déjà pour cette cargo réservation.",
        });
      }
    }

    const payement = await prisma.payement.create({
      data: {
        prix: Number(prix),
        num_telephone,
        status: "PENDING",
        ...(reservation_id && { reservation_id: Number(reservation_id) }),
        ...(cargo_reservation_id && {
          cargo_reservation_id: Number(cargo_reservation_id),
        }),
      },
    });

    return res.status(201).json({ data: payement });
  } catch (error) {
    console.error("[POST /api/client/payement/create]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

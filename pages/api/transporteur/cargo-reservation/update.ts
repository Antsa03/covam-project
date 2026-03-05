import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// PUT /api/transporteur/cargo-reservation/update?id=<id_cargo_reservation>
// Le transporteur peut modifier le statut et le prix d'une cargo réservation
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
    return res.status(400).json({ error: "ID cargo-réservation invalide." });
  }

  const { status, prix } = req.body;
  const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: "Statut invalide." });
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

    const cargo = await prisma.cargoReservation.findUnique({
      where: { id_cargo_reservation: id },
      include: {
        reservation: {
          include: {
            pb_transport: {
              include: { transport: { select: { transporteur_id: true } } },
            },
          },
        },
      },
    });

    if (!cargo) {
      return res.status(404).json({ error: "Cargo réservation introuvable." });
    }

    if (
      cargo.reservation.pb_transport.transport.transporteur_id !==
      transporteur.id_transporteur
    ) {
      return res.status(403).json({ error: "Accès refusé." });
    }

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (prix != null) updateData.prix = Number(prix);

    const updated = await prisma.cargoReservation.update({
      where: { id_cargo_reservation: id },
      data: updateData,
    });

    return res.status(200).json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/transporteur/cargo-reservation/update]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

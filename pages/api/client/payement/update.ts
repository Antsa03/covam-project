import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// PUT /api/client/payement/update?id=<id_payement>
// Le client peut mettre à jour le statut de son paiement
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const auth = await requireAuth(req, res, ["CLIENT", "PARTICULIER"]);
  if (!auth) return;

  const id = Number(req.query.id);
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "ID paiement invalide." });
  }

  const { status } = req.body;
  const validStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: "Statut invalide." });
  }

  try {
    const client = await prisma.client.findUnique({
      where: { utilisateur_id: Number(auth.id) },
    });

    if (!client) {
      return res.status(404).json({ error: "Profil client introuvable." });
    }

    const payement = await prisma.payement.findUnique({
      where: { id_payement: id },
      include: {
        reservation: { select: { client_id: true } },
        cargo_reservation: {
          include: { reservation: { select: { client_id: true } } },
        },
      },
    });

    if (!payement) {
      return res.status(404).json({ error: "Paiement introuvable." });
    }

    const clientId =
      payement.reservation?.client_id ??
      payement.cargo_reservation?.reservation.client_id;

    if (clientId !== client.id_client) {
      return res.status(403).json({ error: "Accès refusé." });
    }

    const updated = await prisma.payement.update({
      where: { id_payement: id },
      data: { status },
    });

    return res.status(200).json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/client/payement/update]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

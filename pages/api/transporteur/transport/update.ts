import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// PUT /api/transporteur/transport/update?id=<id_transport>
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
    return res.status(400).json({ error: "ID transport invalide." });
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

    const existing = await prisma.transport.findUnique({
      where: { id_transport: id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Transport introuvable." });
    }

    if (existing.transporteur_id !== transporteur.id_transporteur) {
      return res.status(403).json({ error: "Accès refusé." });
    }

    const { description, marque, immatriculation, type, images } = req.body;
    const updateData: Record<string, unknown> = {};
    if (description) updateData.description = description;
    if (marque) updateData.marque = marque;
    if (immatriculation) updateData.immatriculation = immatriculation;
    if (type) updateData.type = type;
    if (images) updateData.images = images;

    const updated = await prisma.transport.update({
      where: { id_transport: id },
      data: updateData,
    });

    return res.status(200).json({ data: updated });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Immatriculation déjà utilisée." });
    }
    console.error("[PUT /api/transporteur/transport/update]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

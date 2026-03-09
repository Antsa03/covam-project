import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// PUT /api/client/pb-marchandise/update?id=<id_pb_marchandise>
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
    return res
      .status(400)
      .json({ error: "ID annonce de marchandise invalide." });
  }

  try {
    const client = await prisma.client.findUnique({
      where: { utilisateur_id: Number(auth.id) },
    });

    if (!client) {
      return res.status(404).json({ error: "Profil client introuvable." });
    }

    const existing = await prisma.pbMarchandise.findUnique({
      where: { id_pb_marchandise: id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Annonce introuvable." });
    }

    if (existing.client_id !== client.id_client) {
      return res.status(403).json({ error: "Accès refusé." });
    }

    const {
      label,
      category,
      fragile,
      poids,
      dimension,
      date_depart,
      depart,
      destination,
      nom_recepteur,
      tel_recepteur,
      status,
    } = req.body;

    const updateData: Record<string, unknown> = {};
    if (label) updateData.label = label;
    if (category) updateData.category = category;
    if (fragile != null) updateData.fragile = Boolean(fragile);
    if (poids != null) updateData.poids = Number(poids);
    if (dimension != null) updateData.dimension = Number(dimension);
    if (date_depart) updateData.date_depart = new Date(date_depart);
    if (depart) updateData.depart = depart;
    if (destination) updateData.destination = destination;
    if (nom_recepteur) updateData.nom_recepteur = nom_recepteur;
    if (tel_recepteur) updateData.tel_recepteur = tel_recepteur;
    if (status) updateData.status = status;

    const updated = await prisma.pbMarchandise.update({
      where: { id_pb_marchandise: id },
      data: updateData,
    });

    return res.status(200).json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/client/pb-marchandise/update]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

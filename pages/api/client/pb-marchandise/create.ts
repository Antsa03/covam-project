import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// POST /api/client/pb-marchandise/create
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const auth = await requireAuth(req, res, ["CLIENT"]);
  if (!auth) return;

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

  if (
    !label ||
    !category ||
    fragile == null ||
    !poids ||
    !dimension ||
    !date_depart ||
    !depart ||
    !destination ||
    !nom_recepteur ||
    !tel_recepteur
  ) {
    return res
      .status(400)
      .json({ error: "Tous les champs obligatoires sont manquants." });
  }

  const validCategories = [
    "STANDARD",
    "FRAGILE",
    "PERISHABLE",
    "HAZARDOUS",
    "OVERSIZED",
  ];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: "Catégorie invalide." });
  }

  try {
    const client = await prisma.client.findUnique({
      where: { utilisateur_id: Number(auth.id) },
    });

    if (!client) {
      return res.status(404).json({ error: "Profil client introuvable." });
    }

    const pbMarchandise = await prisma.pbMarchandise.create({
      data: {
        label,
        category,
        fragile: Boolean(fragile),
        poids: Number(poids),
        dimension: Number(dimension),
        date_depart: new Date(date_depart),
        depart,
        destination,
        nom_recepteur,
        tel_recepteur,
        status: status ?? "PENDING",
        client_id: client.id_client,
      },
    });

    return res.status(201).json({ data: pbMarchandise });
  } catch (error) {
    console.error("[POST /api/client/pb-marchandise/create]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

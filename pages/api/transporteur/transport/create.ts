import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// POST /api/transporteur/transport/create
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const auth = await requireAuth(req, res, ["TRANSPORTEUR"]);
  if (!auth) return;

  const { description, marque, immatriculation, type, images } = req.body;

  if (!description || !marque || !immatriculation || !type || !images) {
    return res
      .status(400)
      .json({ error: "Tous les champs sont obligatoires." });
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

    const transport = await prisma.transport.create({
      data: {
        description,
        marque,
        immatriculation,
        type,
        images,
        transporteur_id: transporteur.id_transporteur,
      },
    });

    return res.status(201).json({ data: transport });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "Immatriculation déjà enregistrée." });
    }
    console.error("[POST /api/transporteur/transport/create]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

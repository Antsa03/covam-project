import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// POST /api/transporteur/pb-transport/create
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const auth = await requireAuth(req, res, ["TRANSPORTEUR"]);
  if (!auth) return;

  const {
    transport_id,
    depart,
    destination,
    capacite_transport,
    prix_par_kilo,
    prix_fragile_par_kilo,
    status,
  } = req.body;

  if (
    !transport_id ||
    !depart ||
    !destination ||
    capacite_transport == null ||
    prix_par_kilo == null ||
    prix_fragile_par_kilo == null
  ) {
    return res
      .status(400)
      .json({ error: "Tous les champs obligatoires sont manquants." });
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

    const transport = await prisma.transport.findUnique({
      where: { id_transport: Number(transport_id) },
    });

    if (
      !transport ||
      transport.transporteur_id !== transporteur.id_transporteur
    ) {
      return res
        .status(403)
        .json({ error: "Transport introuvable ou accès refusé." });
    }

    const pbTransport = await prisma.pbTransport.create({
      data: {
        depart,
        destination,
        capacite_transport: Number(capacite_transport),
        prix_par_kilo: Number(prix_par_kilo),
        prix_fragile_par_kilo: Number(prix_fragile_par_kilo),
        status: status ?? "PENDING",
        transport_id: Number(transport_id),
      },
    });

    return res.status(201).json({ data: pbTransport });
  } catch (error) {
    console.error("[POST /api/transporteur/pb-transport/create]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

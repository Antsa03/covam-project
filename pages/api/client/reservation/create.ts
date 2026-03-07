import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// POST /api/client/reservation/create
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
    pb_transport_id,
    category,
    fragile,
    poids,
    dimension,
    date_depart,
    depart,
    destination,
    nom_recepteur,
    tel_recepteur,
    label,
  } = req.body;

  if (
    !pb_transport_id ||
    !category ||
    fragile == null ||
    !poids ||
    !dimension ||
    !date_depart ||
    !depart ||
    !destination ||
    !nom_recepteur ||
    !tel_recepteur ||
    !label
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

    const pbTransport = await prisma.pbTransport.findUnique({
      where: { id_pb_transport: Number(pb_transport_id) },
    });

    if (!pbTransport || pbTransport.status !== "ACTIVE") {
      return res
        .status(404)
        .json({ error: "Annonce introuvable ou inactive." });
    }

    // Use values from DB as authoritative source for depart/destination
    const departFinal = (depart as string) || pbTransport.depart;
    const destinationFinal = (destination as string) || pbTransport.destination;

    const reservation = await prisma.transportReservation.create({
      data: {
        category,
        fragile: Boolean(fragile),
        poids: Number(poids),
        dimension: Number(dimension),
        date_depart: new Date(date_depart),
        depart: departFinal,
        destination: destinationFinal,
        nom_recepteur,
        tel_recepteur,
        label,
        status: "PENDING",
        pb_transport_id: Number(pb_transport_id),
        client_id: client.id_client,
      },
      include: {
        pb_transport: {
          include: {
            transport: {
              include: {
                transporteur: {
                  include: {
                    utilisateur: {
                      select: { nom: true, prenom: true, phone: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return res.status(201).json({ data: reservation });
  } catch (error) {
    console.error("[POST /api/client/reservation/create]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

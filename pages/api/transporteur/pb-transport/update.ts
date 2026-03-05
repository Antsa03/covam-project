import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// PUT /api/transporteur/pb-transport/update?id=<id_pb_transport>
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
    return res.status(400).json({ error: "ID annonce invalide." });
  }

  try {
    const transporteur = await prisma.transporteur.findUnique({
      where: { utilisateur_id: Number(auth.id) },
      include: { transports: { select: { id_transport: true } } },
    });

    if (!transporteur) {
      return res
        .status(404)
        .json({ error: "Profil transporteur introuvable." });
    }

    const existing = await prisma.pbTransport.findUnique({
      where: { id_pb_transport: id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Annonce introuvable." });
    }

    const ownsTransport = transporteur.transports.some(
      (t) => t.id_transport === existing.transport_id,
    );

    if (!ownsTransport) {
      return res.status(403).json({ error: "Accès refusé." });
    }

    const {
      depart,
      destination,
      capacite_transport,
      prix_par_kilo,
      prix_fragile_par_kilo,
      status,
    } = req.body;

    const updateData: Record<string, unknown> = {};
    if (depart) updateData.depart = depart;
    if (destination) updateData.destination = destination;
    if (capacite_transport != null)
      updateData.capacite_transport = Number(capacite_transport);
    if (prix_par_kilo != null) updateData.prix_par_kilo = Number(prix_par_kilo);
    if (prix_fragile_par_kilo != null)
      updateData.prix_fragile_par_kilo = Number(prix_fragile_par_kilo);
    if (status) updateData.status = status;

    const updated = await prisma.pbTransport.update({
      where: { id_pb_transport: id },
      data: updateData,
    });

    return res.status(200).json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/transporteur/pb-transport/update]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

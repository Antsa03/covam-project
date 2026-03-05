import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// DELETE /api/transporteur/pb-transport/delete?id=<id_pb_transport>
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE") {
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

    await prisma.pbTransport.delete({ where: { id_pb_transport: id } });

    return res.status(200).json({ message: "Annonce supprimée avec succès." });
  } catch (error) {
    console.error("[DELETE /api/transporteur/pb-transport/delete]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

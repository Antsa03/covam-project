import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// DELETE /api/transporteur/transport/delete?id=<id_transport>
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

    await prisma.transport.delete({ where: { id_transport: id } });

    return res.status(200).json({ message: "Transport supprimé avec succès." });
  } catch (error) {
    console.error("[DELETE /api/transporteur/transport/delete]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

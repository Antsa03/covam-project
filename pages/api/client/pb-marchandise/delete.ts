import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// DELETE /api/client/pb-marchandise/delete?id=<id_pb_marchandise>
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const auth = await requireAuth(req, res, ["CLIENT"]);
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

    if (existing.status === "ACTIVE") {
      return res.status(400).json({
        error:
          "Impossible de supprimer une annonce active. Désactivez-la d'abord.",
      });
    }

    await prisma.pbMarchandise.delete({ where: { id_pb_marchandise: id } });

    return res.status(200).json({ message: "Annonce supprimée avec succès." });
  } catch (error) {
    console.error("[DELETE /api/client/pb-marchandise/delete]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

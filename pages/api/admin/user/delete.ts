import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// DELETE /api/admin/user/delete?id=<id_utilisateur>
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const auth = await requireAuth(req, res, ["ADMIN"]);
  if (!auth) return;

  const id = Number(req.query.id);
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "ID utilisateur invalide." });
  }

  // Seul l'admin ou l'utilisateur lui-même peut supprimer le compte
  if (auth.id !== String(id) && auth.role !== "ADMIN") {
    return res.status(403).json({ error: "Accès refusé." });
  }

  try {
    const existing = await prisma.utilisateur.findUnique({
      where: { id_utilisateur: id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Utilisateur introuvable." });
    }

    await prisma.utilisateur.delete({ where: { id_utilisateur: id } });

    return res
      .status(200)
      .json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    console.error("[DELETE /api/admin/user/delete]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

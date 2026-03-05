import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// PUT /api/admin/user/update?id=<id_utilisateur>
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const auth = await requireAuth(req, res, ["ADMIN"]);
  if (!auth) return;

  const id = Number(req.query.id);
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "ID utilisateur invalide." });
  }

  const {
    nom,
    prenom,
    phone,
    adresse,
    city,
    date_naissance,
    email,
    mot_de_passe,
  } = req.body;

  try {
    const existing = await prisma.utilisateur.findUnique({
      where: { id_utilisateur: id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Utilisateur introuvable." });
    }

    // Un utilisateur non-admin ne peut modifier que son propre profil
    if (auth.id !== String(id) && auth.role !== "ADMIN") {
      return res.status(403).json({ error: "Accès refusé." });
    }

    const updateData: Record<string, unknown> = {};
    if (nom) updateData.nom = nom;
    if (prenom) updateData.prenom = prenom;
    if (phone) updateData.phone = phone;
    if (adresse) updateData.adresse = adresse;
    if (city) updateData.city = city;
    if (date_naissance) updateData.date_naissance = new Date(date_naissance);
    if (email) updateData.email = email;
    if (mot_de_passe) {
      updateData.mot_de_passe = await bcrypt.hash(mot_de_passe, 12);
    }

    const updated = await prisma.utilisateur.update({
      where: { id_utilisateur: id },
      data: updateData,
      select: {
        id_utilisateur: true,
        nom: true,
        prenom: true,
        cin: true,
        phone: true,
        adresse: true,
        city: true,
        date_naissance: true,
        email: true,
        role: true,
        date_mise_a_jour: true,
      },
    });

    return res.status(200).json({ data: updated });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Email déjà utilisé." });
    }
    console.error("[PUT /api/admin/user/update]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

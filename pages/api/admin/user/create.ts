import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// POST /api/admin/user/create
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const auth = await requireAuth(req, res, ["ADMIN"]);
  if (!auth) return;

  const {
    nom,
    prenom,
    cin,
    phone,
    adresse,
    city,
    date_naissance,
    email,
    mot_de_passe,
    role,
  } = req.body;

  if (
    !nom ||
    !prenom ||
    !cin ||
    !phone ||
    !adresse ||
    !city ||
    !date_naissance ||
    !email ||
    !mot_de_passe ||
    !role
  ) {
    return res
      .status(400)
      .json({ error: "Tous les champs sont obligatoires." });
  }

  if (!["CLIENT", "TRANSPORTEUR"].includes(role)) {
    return res.status(400).json({ error: "Rôle invalide." });
  }

  try {
    const existing = await prisma.utilisateur.findFirst({
      where: { OR: [{ email }, { cin }] },
    });

    if (existing) {
      return res.status(409).json({ error: "Email ou CIN déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 12);

    const utilisateur = await prisma.utilisateur.create({
      data: {
        nom,
        prenom,
        cin,
        phone,
        adresse,
        city,
        date_naissance: new Date(date_naissance),
        email,
        mot_de_passe: hashedPassword,
        role,
      },
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
        date_creation: true,
      },
    });

    // Créer le sous-profil selon le rôle
    if (role === "TRANSPORTEUR") {
      await prisma.transporteur.create({
        data: { utilisateur_id: utilisateur.id_utilisateur },
      });
    } else if (role === "CLIENT") {
      await prisma.client.create({
        data: { utilisateur_id: utilisateur.id_utilisateur },
      });
    }

    return res.status(201).json({ data: utilisateur });
  } catch (error) {
    console.error("[POST /api/admin/user/create]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

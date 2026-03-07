import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";

// POST /api/auth/register
// Route publique — inscription d'un CLIENT ou TRANSPORTEUR
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

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

  if (!["CLIENT", "TRANSPORTEUR", "PARTICULIER"].includes(role)) {
    return res.status(400).json({
      error: "Rôle invalide. Valeurs acceptées : CLIENT, TRANSPORTEUR, PARTICULIER.",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Format d'email invalide." });
  }

  if (mot_de_passe.length < 8) {
    return res
      .status(400)
      .json({ error: "Le mot de passe doit contenir au moins 8 caractères." });
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
    } else if (role === "CLIENT" || role === "PARTICULIER") {
      const image =
        typeof req.body.image === "string" && req.body.image
          ? req.body.image
          : null;
      await prisma.client.create({
        data: { utilisateur_id: utilisateur.id_utilisateur, image },
      });
    }

    return res.status(201).json({ data: utilisateur });
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

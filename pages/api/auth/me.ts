import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { requireAuth } from "../../../lib/middleware";
import bcrypt from "bcryptjs";

// GET /api/auth/me  — profil complet de l'utilisateur connecté
// PUT /api/auth/me  — mise à jour du profil / mot de passe
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const auth = await requireAuth(req, res);
  if (!auth) return;

  try {
    // ── GET ──────────────────────────────────────────────────────────────────
    if (req.method === "GET") {
      if (auth.role === "ADMIN") {
        const admin = await prisma.admin.findUnique({
          where: { nom_utilisateur: auth.id },
        });
        if (!admin)
          return res.status(404).json({ error: "Administrateur introuvable." });
        return res.status(200).json({
          data: { nom_utilisateur: admin.nom_utilisateur, role: "ADMIN" },
        });
      }

      const utilisateur = await prisma.utilisateur.findUnique({
        where: { id_utilisateur: Number(auth.id) },
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
          date_mise_a_jour: true,
          transporteur: {
            select: {
              id_transporteur: true,
              transports: {
                select: {
                  id_transport: true,
                  marque: true,
                  type: true,
                  immatriculation: true,
                },
              },
            },
          },
          client: { select: { id_client: true, image: true } },
        },
      });

      if (!utilisateur)
        return res.status(404).json({ error: "Utilisateur introuvable." });

      // For PARTICULIER, compute monthly post count
      let postsThisMonth: number | undefined;
      if (utilisateur.role === "PARTICULIER") {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        const clientRecord = utilisateur.client;
        if (clientRecord) {
          postsThisMonth = await prisma.pbMarchandise.count({
            where: {
              client_id: clientRecord.id_client,
              date_creation: { gte: startOfMonth, lte: endOfMonth },
            },
          });
        } else {
          postsThisMonth = 0;
        }
      }

      return res.status(200).json({
        data: postsThisMonth !== undefined
          ? { ...utilisateur, postsThisMonth }
          : utilisateur,
      });
    }

    // ── PUT ──────────────────────────────────────────────────────────────────
    if (req.method === "PUT") {
      const {
        nom,
        prenom,
        phone,
        adresse,
        city,
        currentPassword,
        newPassword,
      } = req.body ?? {};

      if (auth.role === "ADMIN") {
        if (currentPassword && newPassword) {
          const admin = await prisma.admin.findUnique({
            where: { nom_utilisateur: auth.id },
          });
          if (!admin)
            return res
              .status(404)
              .json({ error: "Administrateur introuvable." });
          const valid = await bcrypt.compare(
            currentPassword,
            admin.mot_de_passe,
          );
          if (!valid)
            return res
              .status(400)
              .json({ error: "Mot de passe actuel incorrect." });
          const hashed = await bcrypt.hash(newPassword, 10);
          await prisma.admin.update({
            where: { nom_utilisateur: auth.id },
            data: { mot_de_passe: hashed },
          });
        }
        return res.status(200).json({ message: "Profil mis à jour." });
      }

      // CLIENT / TRANSPORTEUR
      const utilisateur = await prisma.utilisateur.findUnique({
        where: { id_utilisateur: Number(auth.id) },
      });
      if (!utilisateur)
        return res.status(404).json({ error: "Utilisateur introuvable." });

      const updateData: Record<string, unknown> = {};
      if (nom) updateData.nom = nom;
      if (prenom) updateData.prenom = prenom;
      if (phone) updateData.phone = phone;
      if (adresse) updateData.adresse = adresse;
      if (city) updateData.city = city;

      // Update client profile image
      if ((auth.role === "CLIENT" || auth.role === "PARTICULIER") && req.body?.image !== undefined) {
        await prisma.client.updateMany({
          where: { utilisateur_id: Number(auth.id) },
          data: { image: req.body.image },
        });
      }

      if (currentPassword && newPassword) {
        const valid = await bcrypt.compare(
          currentPassword,
          utilisateur.mot_de_passe,
        );
        if (!valid)
          return res
            .status(400)
            .json({ error: "Mot de passe actuel incorrect." });
        updateData.mot_de_passe = await bcrypt.hash(newPassword, 10);
      }

      const updated = await prisma.utilisateur.update({
        where: { id_utilisateur: Number(auth.id) },
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
        },
      });

      return res.status(200).json({ data: updated });
    }

    return res.status(405).json({ error: "Méthode non autorisée." });
  } catch (error) {
    console.error("[/api/auth/me]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

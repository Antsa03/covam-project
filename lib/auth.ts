import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        // "email" sert aussi de champ nom_utilisateur pour les admins
        email: { label: "Email / Nom d'utilisateur", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Identifiant et mot de passe requis.");
        }

        const isEmail = credentials.email.includes("@");

        // ── Connexion Admin ───────────────────────────────────────────────
        if (!isEmail) {
          const admin = await prisma.admin.findUnique({
            where: { nom_utilisateur: credentials.email },
          });

          if (!admin) {
            throw new Error("Aucun administrateur trouvé avec ce nom.");
          }

          const passwordValid = await bcrypt.compare(
            credentials.password,
            admin.mot_de_passe,
          );

          if (!passwordValid) {
            throw new Error("Mot de passe incorrect.");
          }

          return {
            id: admin.nom_utilisateur,
            email: null,
            name: admin.nom_utilisateur,
            role: "ADMIN" as const,
          };
        }

        // ── Connexion Utilisateur (CLIENT / TRANSPORTEUR) ────────────────
        const utilisateur = await prisma.utilisateur.findUnique({
          where: { email: credentials.email },
        });

        if (!utilisateur) {
          throw new Error("Aucun compte trouvé avec cet email.");
        }

        const passwordValid = await bcrypt.compare(
          credentials.password,
          utilisateur.mot_de_passe,
        );

        if (!passwordValid) {
          throw new Error("Mot de passe incorrect.");
        }

        // Fetch profile image for CLIENT
        let image: string | null = null;
        if (utilisateur.role === "CLIENT") {
          const client = await prisma.client.findUnique({
            where: { utilisateur_id: utilisateur.id_utilisateur },
            select: { image: true },
          });
          image = client?.image ?? null;
        }

        return {
          id: String(utilisateur.id_utilisateur),
          email: utilisateur.email,
          name: `${utilisateur.prenom} ${utilisateur.nom}`,
          role: utilisateur.role,
          image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session: sessionUpdate }) {
      if (user) {
        token.id = user.id;
        token.role = (
          user as { role: "CLIENT" | "TRANSPORTEUR" | "ADMIN" }
        ).role;
        token.image = (user as { image?: string | null }).image ?? null;
      }
      // Allow client-side session.update({ image }) to refresh the token
      if (trigger === "update" && sessionUpdate?.image !== undefined) {
        token.image = sessionUpdate.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "CLIENT" | "TRANSPORTEUR" | "ADMIN";
        session.user.image = (token.image as string | null) ?? null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

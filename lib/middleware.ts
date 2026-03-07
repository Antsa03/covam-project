import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

type Role = "CLIENT" | "TRANSPORTEUR" | "ADMIN" | "PARTICULIER";

/**
 * Vérifie que la requête est authentifiée.
 * Optionnellement, vérifie qu'un rôle spécifique est présent.
 */
export async function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedRoles?: Role[],
): Promise<{ id: string; role: Role } | null> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    res.status(401).json({ error: "Non authentifié." });
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(token.role as Role)) {
    res.status(403).json({ error: "Accès refusé." });
    return null;
  }

  return { id: token.id as string, role: token.role as Role };
}

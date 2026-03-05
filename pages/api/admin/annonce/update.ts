import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { requireAuth } from "../../../../lib/middleware";

// PUT /api/admin/annonce/update?id=<id>
// Body: { status: "ACTIVE" | "INACTIVE" | "PENDING" }
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
    return res.status(400).json({ error: "ID invalide." });
  }

  const { status } = req.body as { status?: string };
  if (!status || !["ACTIVE", "INACTIVE", "PENDING"].includes(status)) {
    return res.status(400).json({ error: "Statut invalide." });
  }

  try {
    const updated = await prisma.pbTransport.update({
      where: { id_pb_transport: id },
      data: { status: status as "ACTIVE" | "INACTIVE" | "PENDING" },
    });

    return res.status(200).json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/admin/annonce/update]", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

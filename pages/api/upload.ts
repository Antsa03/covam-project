import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { requireAuth } from "../../lib/middleware";

export const config = {
  api: { bodyParser: false },
};

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

// POST /api/upload?folder=transports|profiles|misc
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const auth = await requireAuth(req, res);
  if (!auth) return;

  // Whitelist allowed folder names to prevent path traversal
  const ALLOWED_FOLDERS = ["transports", "profiles", "misc"] as const;
  type AllowedFolder = (typeof ALLOWED_FOLDERS)[number];

  const rawFolder = (req.query.folder as string) ?? "misc";
  const folder: AllowedFolder = ALLOWED_FOLDERS.includes(
    rawFolder as AllowedFolder,
  )
    ? (rawFolder as AllowedFolder)
    : "misc";

  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: MAX_SIZE,
    maxFiles: 1,
    filename: (_name, ext) =>
      `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`,
    filter: ({ mimetype }) => !!mimetype && ALLOWED_MIME.includes(mimetype),
  });

  try {
    const [, files] = await form.parse(req);
    const fileEntry = files.file;
    const file = Array.isArray(fileEntry) ? fileEntry[0] : fileEntry;

    if (!file) {
      return res
        .status(400)
        .json({
          error:
            "Aucun fichier reçu ou type non autorisé (JPEG/PNG/WebP uniquement).",
        });
    }

    const relativePath = `/uploads/${folder}/${path.basename(file.filepath)}`;
    return res.status(200).json({ url: relativePath });
  } catch (error) {
    console.error("[POST /api/upload]", error);
    return res.status(500).json({ error: "Erreur lors du téléversement." });
  }
}

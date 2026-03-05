"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  /** Current image path / URL */
  value?: string;
  /** Called with the new public path after a successful upload, or "" on clear */
  onChange: (url: string) => void;
  /** Subdirectory on the server: "transports" | "profiles" | "misc" */
  folder?: "transports" | "profiles" | "misc";
  label?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = "misc",
  label = "Choisir une image",
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/upload?folder=${folder}`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json?.error ?? "Erreur lors du téléversement");
      }

      onChange(json.url as string);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploading(false);
      // Reset native input so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Preview */}
      {value ? (
        <div className="relative w-full h-48 rounded-md overflow-hidden border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Aperçu"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            aria-label="Supprimer l'image"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-24 rounded-md border border-dashed bg-muted/40 text-muted-foreground">
          <ImageIcon className="h-8 w-8" />
        </div>
      )}

      {/* Hidden native file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Trigger button */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        {uploading ? "Téléversement en cours…" : label}
      </Button>
    </div>
  );
}

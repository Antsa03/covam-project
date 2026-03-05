"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { SingleResponse, Utilisateur } from "@/types";

export type ProfileData =
  | (Utilisateur & {
      transporteur?: {
        id_transporteur: number;
        transports: {
          id_transport: number;
          marque: string;
          type: string;
          immatriculation: string;
        }[];
      } | null;
      client?: { id_client: number; image?: string | null } | null;
    })
  | { nom_utilisateur: string; role: "ADMIN" };

export interface UpdateProfilePayload {
  nom?: string;
  prenom?: string;
  phone?: string;
  adresse?: string;
  city?: string;
  image?: string;
  currentPassword?: string;
  newPassword?: string;
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get<SingleResponse<ProfileData>>("/api/auth/me"),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      api.put<SingleResponse<ProfileData>>("/api/auth/me", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profil mis à jour avec succès.");
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Erreur lors de la mise à jour.");
    },
  });
}

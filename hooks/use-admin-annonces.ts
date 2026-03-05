"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PaginatedResponse, StatusPublication } from "@/types";
import { toast } from "sonner";

interface AdminAnnonce {
  id_pb_transport: number;
  depart: string;
  destination: string;
  capacite_transport: number;
  status: StatusPublication;
  prix_par_kilo: number;
  prix_fragile_par_kilo: number;
  transport: {
    id_transport: number;
    marque: string;
    immatriculation: string;
    type: string;
    transporteur: {
      utilisateur: { nom: string; prenom: string; email: string };
    };
  };
  _count: { reservations: number };
}

interface ListParams {
  page?: number;
  limit?: number;
  status?: string;
}

export function useAdminAnnonces(params: ListParams = {}) {
  const { page = 1, limit = 20, status } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) query.set("status", status);

  return useQuery({
    queryKey: ["admin-annonces", params],
    queryFn: () =>
      api.get<PaginatedResponse<AdminAnnonce>>(`/api/admin/annonce?${query}`),
  });
}

export function useUpdateAnnonceStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: StatusPublication }) =>
      api.put(`/api/admin/annonce/update?id=${id}`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-annonces"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Statut de l'annonce mis à jour.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

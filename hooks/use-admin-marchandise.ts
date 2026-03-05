"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  PaginatedResponse,
  StatusPublication,
  CargoCategory,
} from "@/types";

interface AdminMarchandise {
  id_pb_marchandise: number;
  label: string;
  category: CargoCategory;
  fragile: boolean;
  poids: number;
  dimension: number;
  status: StatusPublication;
  date_depart: string;
  depart: string;
  destination: string;
  nom_recepteur: string;
  tel_recepteur: string;
  date_creation: string;
  client: {
    utilisateur: { nom: string; prenom: string; email: string; phone: string };
  };
}

interface ListParams {
  page?: number;
  limit?: number;
  status?: string;
}

export function useAdminMarchandises(params: ListParams = {}) {
  const { page = 1, limit = 20, status } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) query.set("status", status);

  return useQuery({
    queryKey: ["admin-marchandises", params],
    queryFn: () =>
      api.get<PaginatedResponse<AdminMarchandise>>(
        `/api/admin/marchandise?${query}`,
      ),
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PaginatedResponse, StatusPayement } from "@/types";

interface AdminPayement {
  id_payement: number;
  date_payement: string;
  status: StatusPayement;
  prix: number;
  num_telephone: string;
  reservation_id?: number | null;
  cargo_reservation_id?: number | null;
  reservation?: {
    label: string;
    depart: string;
    destination: string;
    client: { utilisateur: { nom: string; prenom: string } };
  } | null;
  cargo_reservation?: {
    id_cargo_reservation: number;
    reservation?: {
      label: string;
      depart: string;
      destination: string;
      client: { utilisateur: { nom: string; prenom: string } };
    } | null;
  } | null;
}

interface ListParams {
  page?: number;
  limit?: number;
  status?: string;
}

export function useAdminPayements(params: ListParams = {}) {
  const { page = 1, limit = 20, status } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) query.set("status", status);

  return useQuery({
    queryKey: ["admin-payements", params],
    queryFn: () =>
      api.get<PaginatedResponse<AdminPayement>>(`/api/admin/payement?${query}`),
  });
}

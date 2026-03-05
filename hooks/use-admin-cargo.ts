"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PaginatedResponse, StatusReservation } from "@/types";

interface AdminCargo {
  id_cargo_reservation: number;
  status: StatusReservation;
  date_reservation: string;
  prix: number;
  reservation_id: number;
  reservation?: {
    label: string;
    depart: string;
    destination: string;
    poids: number;
    client: {
      utilisateur: { nom: string; prenom: string; email: string };
    };
  } | null;
  payement?: { status: string; prix: number } | null;
}

interface ListParams {
  page?: number;
  limit?: number;
  status?: string;
}

export function useAdminCargo(params: ListParams = {}) {
  const { page = 1, limit = 20, status } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) query.set("status", status);

  return useQuery({
    queryKey: ["admin-cargo", params],
    queryFn: () =>
      api.get<PaginatedResponse<AdminCargo>>(
        `/api/admin/cargo-reservation?${query}`,
      ),
  });
}

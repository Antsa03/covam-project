"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/types";

interface AdminTransport {
  id_transport: number;
  marque: string;
  immatriculation: string;
  type: string;
  images: string;
  description: string;
  transporteur: {
    id_transporteur: number;
    utilisateur: { nom: string; prenom: string; email: string; phone: string };
  };
  _count: { pb_transports: number };
}

interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useAdminTransports(params: ListParams = {}) {
  const { page = 1, limit = 20, search } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search) query.set("search", search);

  return useQuery({
    queryKey: ["admin-transports", params],
    queryFn: () =>
      api.get<PaginatedResponse<AdminTransport>>(
        `/api/admin/transport?${query}`,
      ),
  });
}

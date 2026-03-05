"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Payement, PaginatedResponse } from "@/types";
import { toast } from "sonner";

interface ListParams {
  page?: number;
  limit?: number;
  status?: string;
}

export function usePayements(params: ListParams = {}) {
  const { page = 1, limit = 20, status } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) query.set("status", status);

  return useQuery({
    queryKey: ["payements", params],
    queryFn: () =>
      api.get<PaginatedResponse<Payement>>(`/api/client/payement?${query}`),
  });
}

export function useCreatePayement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post("/api/client/payement/create", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payements"] });
      qc.invalidateQueries({ queryKey: ["client-reservations"] });
      toast.success("Paiement créé avec succès.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdatePayement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.put(`/api/client/payement/update?id=${id}`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payements"] });
      toast.success("Statut du paiement mis à jour.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

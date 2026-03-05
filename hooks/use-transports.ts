"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Transport, PaginatedResponse } from "@/types";
import { toast } from "sonner";

interface ListParams {
  page?: number;
  limit?: number;
}

export function useTransports(params: ListParams = {}) {
  const { page = 1, limit = 20 } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return useQuery({
    queryKey: ["transports", params],
    queryFn: () =>
      api.get<PaginatedResponse<Transport>>(
        `/api/transporteur/transport?${query}`,
      ),
  });
}

export function useCreateTransport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post("/api/transporteur/transport/create", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transports"] });
      toast.success("Transport créé avec succès.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateTransport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Record<string, unknown> & { id: number }) =>
      api.put(`/api/transporteur/transport/update?id=${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transports"] });
      toast.success("Transport mis à jour.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteTransport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/api/transporteur/transport/delete?id=${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transports"] });
      toast.success("Transport supprimé.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

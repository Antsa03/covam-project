"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PbTransport, PaginatedResponse } from "@/types";
import { toast } from "sonner";

interface ListParams {
  page?: number;
  limit?: number;
  depart?: string;
  destination?: string;
  role?: "transporteur" | "public";
}

/** Used by transporteur (own announcements) */
export function usePbTransports(params: ListParams = {}) {
  const { page = 1, limit = 20, depart, destination } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (depart) query.set("depart", depart);
  if (destination) query.set("destination", destination);

  const isTransporteur = params.role === "transporteur" || !params.role;
  const url = isTransporteur
    ? `/api/transporteur/pb-transport?${query}`
    : `/api/client/annonces?${query}`; // if public listing in future

  return useQuery({
    queryKey: ["pb-transports", params],
    queryFn: () => api.get<PaginatedResponse<PbTransport>>(url),
  });
}

/** Used by CLIENT to browse active announcements */
export function usePublicPbTransports(
  params: { page?: number; depart?: string; destination?: string } = {},
) {
  const { page = 1, depart, destination } = params;
  const query = new URLSearchParams({ page: String(page), status: "ACTIVE" });
  if (depart) query.set("depart", depart);
  if (destination) query.set("destination", destination);

  return useQuery({
    queryKey: ["pb-transports-public", params],
    queryFn: () =>
      api.get<PaginatedResponse<PbTransport>>(
        `/api/transporteur/pb-transport?${query}`,
      ),
  });
}

export function useCreatePbTransport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post("/api/transporteur/pb-transport/create", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pb-transports"] });
      toast.success("Annonce créée avec succès.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdatePbTransport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Record<string, unknown> & { id: number }) =>
      api.put(`/api/transporteur/pb-transport/update?id=${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pb-transports"] });
      toast.success("Annonce mise à jour.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeletePbTransport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/api/transporteur/pb-transport/delete?id=${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pb-transports"] });
      toast.success("Annonce supprimée.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

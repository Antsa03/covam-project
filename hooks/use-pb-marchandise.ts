"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PbMarchandise, PaginatedResponse } from "@/types";
import { toast } from "sonner";

interface ListParams {
  page?: number;
  limit?: number;
  depart?: string;
  destination?: string;
  status?: string;
}

export function usePbMarchandise(params: ListParams = {}) {
  const { page = 1, limit = 20, depart, destination, status } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (depart) query.set("depart", depart);
  if (destination) query.set("destination", destination);
  if (status) query.set("status", status);

  return useQuery({
    queryKey: ["pb-marchandise", params],
    queryFn: () =>
      api.get<PaginatedResponse<PbMarchandise>>(
        `/api/client/pb-marchandise?${query}`,
      ),
  });
}

export function useCreatePbMarchandise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post("/api/client/pb-marchandise/create", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pb-marchandise"] });
      toast.success("Annonce de marchandise créée.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdatePbMarchandise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Record<string, unknown> & { id: number }) =>
      api.put(`/api/client/pb-marchandise/update?id=${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pb-marchandise"] });
      toast.success("Annonce de marchandise mise à jour.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeletePbMarchandise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/api/client/pb-marchandise/delete?id=${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pb-marchandise"] });
      toast.success("Annonce supprimée.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

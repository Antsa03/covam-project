"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Utilisateur, PaginatedResponse } from "@/types";
import { toast } from "sonner";

interface ListParams {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}

export function useAdminUsers(params: ListParams = {}) {
  const { page = 1, limit = 20, role, search } = params;

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (role) query.set("role", role);
  if (search) query.set("search", search);

  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () =>
      api.get<PaginatedResponse<Utilisateur>>(`/api/admin/user?${query}`),
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post("/api/admin/user/create", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Utilisateur créé avec succès.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Record<string, unknown> & { id: number }) =>
      api.put(`/api/admin/user/update?id=${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Utilisateur mis à jour.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/admin/user/delete?id=${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Utilisateur supprimé.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { TransportReservation, PaginatedResponse } from "@/types";
import { toast } from "sonner";

interface ListParams {
  page?: number;
  limit?: number;
  status?: string;
}

/** Transporteur side */
export function useTransporteurReservations(params: ListParams = {}) {
  const { page = 1, limit = 20, status } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) query.set("status", status);

  return useQuery({
    queryKey: ["transporteur-reservations", params],
    queryFn: () =>
      api.get<PaginatedResponse<TransportReservation>>(
        `/api/transporteur/reservation?${query}`,
      ),
  });
}

/** Client side */
export function useClientReservations(params: ListParams = {}) {
  const { page = 1, limit = 20, status } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) query.set("status", status);

  return useQuery({
    queryKey: ["client-reservations", params],
    queryFn: () =>
      api.get<PaginatedResponse<TransportReservation>>(
        `/api/client/reservation?${query}`,
      ),
  });
}

export function useCreateReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post("/api/client/reservation/create", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["client-reservations"] });
      qc.invalidateQueries({ queryKey: ["pb-transports-public"] });
      toast.success("Réservation créée avec succès.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateTransporteurReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.put(`/api/transporteur/reservation/update?id=${id}`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transporteur-reservations"] });
      toast.success("Statut mis à jour.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useCancelClientReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.put(`/api/client/reservation/update?id=${id}`, {
        status: "CANCELLED",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["client-reservations"] });
      toast.success("Réservation annulée.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteClientReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/api/client/reservation/delete?id=${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["client-reservations"] });
      toast.success("Réservation supprimée.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

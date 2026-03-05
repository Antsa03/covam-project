"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CargoReservation, PaginatedResponse } from "@/types";
import { toast } from "sonner";

interface ListParams {
  page?: number;
  limit?: number;
  status?: string;
}

/** Transporteur side */
export function useTransporteurCargoReservations(params: ListParams = {}) {
  const { page = 1, limit = 20, status } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) query.set("status", status);

  return useQuery({
    queryKey: ["transporteur-cargo", params],
    queryFn: () =>
      api.get<PaginatedResponse<CargoReservation>>(
        `/api/transporteur/cargo-reservation?${query}`,
      ),
  });
}

/** Client side */
export function useClientCargoReservations(params: ListParams = {}) {
  const { page = 1, limit = 20, status } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) query.set("status", status);

  return useQuery({
    queryKey: ["client-cargo", params],
    queryFn: () =>
      api.get<PaginatedResponse<CargoReservation>>(
        `/api/client/cargo-reservation?${query}`,
      ),
  });
}

export function useCreateCargoReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post("/api/transporteur/cargo-reservation/create", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transporteur-cargo"] });
      toast.success("Cargo réservation créée.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateCargoReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      prix,
    }: {
      id: number;
      status?: string;
      prix?: number;
    }) =>
      api.put(`/api/transporteur/cargo-reservation/update?id=${id}`, {
        status,
        prix,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transporteur-cargo"] });
      toast.success("Cargo réservation mise à jour.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

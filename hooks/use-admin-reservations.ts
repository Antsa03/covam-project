"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PaginatedResponse, StatusReservation } from "@/types";
import { toast } from "sonner";

interface AdminReservation {
  id_reservation: number;
  date_reservation: string;
  category: string;
  fragile: boolean;
  poids: number;
  dimension: number;
  date_depart: string;
  depart: string;
  destination: string;
  nom_recepteur: string;
  tel_recepteur: string;
  label: string;
  status: StatusReservation;
  pb_transport_id: number;
  client_id: number;
  client: {
    utilisateur: { nom: string; prenom: string; email: string; phone: string };
  };
  pb_transport?: {
    depart: string;
    destination: string;
    prix_par_kilo: number;
    transport: { marque: string; immatriculation: string };
  } | null;
  cargo_reservation?: { prix: number; status: string } | null;
  payement?: { status: string; prix: number } | null;
}

interface ListParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export function useAdminReservations(params: ListParams = {}) {
  const { page = 1, limit = 20, status, search } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) query.set("status", status);
  if (search) query.set("search", search);

  return useQuery({
    queryKey: ["admin-reservations", params],
    queryFn: () =>
      api.get<PaginatedResponse<AdminReservation>>(
        `/api/admin/reservation?${query}`,
      ),
  });
}

export function useUpdateReservationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: StatusReservation }) =>
      api.put(`/api/admin/reservation/update?id=${id}`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reservations"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Statut de la réservation mis à jour.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

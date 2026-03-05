"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface AdminStats {
  totalClients: number;
  totalTransporteurs: number;
  totalTransports: number;
  totalAnnonces: number;
  annonceActives: number;
  totalReservations: number;
  pendingReservations: number;
  totalPaiements: number;
  pendingPaiements: number;
  revenuTotal: number;
  totalMarchandises: number;
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.get<AdminStats>("/api/admin/stats"),
  });
}

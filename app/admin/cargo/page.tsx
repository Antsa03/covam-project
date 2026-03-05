"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { useAdminCargo } from "@/hooks/use-admin-cargo";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type AdminCargo = {
  id_cargo_reservation: number;
  status: string;
  date_reservation: string;
  prix: number;
  reservation_id: number;
  reservation?: {
    label: string;
    depart: string;
    destination: string;
    poids: number;
    client: {
      utilisateur: { nom: string; prenom: string; email: string };
    };
  } | null;
  payement?: { status: string; prix: number } | null;
};

export default function AdminCargoPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();

  const { data, isLoading } = useAdminCargo({ page, status });

  const columns = [
    {
      key: "id",
      header: "ID",
      cell: (r: AdminCargo) => `#${r.id_cargo_reservation}`,
    },
    {
      key: "ref",
      header: "Réservation",
      cell: (r: AdminCargo) => (
        <span className="text-sm font-medium">
          {r.reservation?.label ?? `#${r.reservation_id}`}
        </span>
      ),
    },
    {
      key: "trajet",
      header: "Trajet",
      cell: (r: AdminCargo) =>
        r.reservation
          ? `${r.reservation.depart} → ${r.reservation.destination}`
          : "—",
      className: "hidden md:table-cell",
    },
    {
      key: "client",
      header: "Client",
      cell: (r: AdminCargo) =>
        r.reservation?.client
          ? `${r.reservation.client.utilisateur.prenom} ${r.reservation.client.utilisateur.nom}`
          : "—",
      className: "hidden lg:table-cell",
    },
    {
      key: "poids",
      header: "Poids",
      cell: (r: AdminCargo) =>
        r.reservation ? `${r.reservation.poids} kg` : "—",
      className: "hidden lg:table-cell",
    },
    {
      key: "prix",
      header: "Prix",
      cell: (r: AdminCargo) => (
        <span className="font-semibold">
          {r.prix.toLocaleString("fr-FR")} Ar
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      cell: (r: AdminCargo) =>
        format(new Date(r.date_reservation), "dd MMM yyyy", { locale: fr }),
      className: "hidden md:table-cell",
    },
    {
      key: "status",
      header: "Statut",
      cell: (r: AdminCargo) => (
        <StatusBadge status={r.status as import("@/types").StatusReservation} />
      ),
    },
    {
      key: "paiement",
      header: "Paiement",
      cell: (r: AdminCargo) =>
        r.payement ? (
          <StatusBadge
            status={r.payement.status as import("@/types").StatusPayement}
          />
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
      className: "hidden md:table-cell",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cargo réservations"
        description="Toutes les réservations cargo de la plateforme."
      />

      <Select
        value={status ?? "ALL"}
        onValueChange={(v) => {
          setStatus(v === "ALL" ? undefined : v);
          setPage(1);
        }}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Tous les statuts" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Tous les statuts</SelectItem>
          <SelectItem value="PENDING">En attente</SelectItem>
          <SelectItem value="CONFIRMED">Confirmé</SelectItem>
          <SelectItem value="COMPLETED">Terminé</SelectItem>
          <SelectItem value="CANCELLED">Annulé</SelectItem>
        </SelectContent>
      </Select>

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Aucune cargo réservation trouvée."
        page={page}
        totalPages={data?.meta.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

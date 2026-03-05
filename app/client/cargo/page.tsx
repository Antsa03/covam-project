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
import { useClientCargoReservations } from "@/hooks/use-cargo-reservations";
import type { CargoReservation } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function ClientCargoPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();

  const { data, isLoading } = useClientCargoReservations({ page, status });

  const columns = [
    {
      key: "id",
      header: "ID",
      cell: (r: CargoReservation) => `#${r.id_cargo_reservation}`,
    },
    {
      key: "reservation",
      header: "Réservation liée",
      cell: (r: CargoReservation) => (
        <span className="text-sm">
          {r.reservation?.label ?? `#${r.reservation_id}`}
        </span>
      ),
    },
    {
      key: "trajet",
      header: "Trajet",
      cell: (r: CargoReservation) =>
        r.reservation
          ? `${r.reservation.depart} → ${r.reservation.destination}`
          : "—",
      className: "hidden md:table-cell",
    },
    {
      key: "prix",
      header: "Prix",
      cell: (r: CargoReservation) => (
        <span className="font-semibold">
          {r.prix.toLocaleString("fr-FR")} Ar
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      cell: (r: CargoReservation) =>
        format(new Date(r.date_reservation), "dd MMM yyyy", { locale: fr }),
      className: "hidden md:table-cell",
    },
    {
      key: "status",
      header: "Statut",
      cell: (r: CargoReservation) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mes cargo réservations"
        description="Suivez vos réservations cargo associées à vos transports."
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
          <SelectItem value="ALL">Tous</SelectItem>
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
        emptyMessage="Aucune cargo réservation."
        page={page}
        totalPages={data?.meta.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

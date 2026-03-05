"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { ReservationDetailModal } from "./_components/reservation-detail-modal";
import { useTransporteurReservations } from "@/hooks/use-reservations";
import type { TransportReservation } from "@/types";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function TransporteurReservationsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();
  const [selected, setSelected] = useState<TransportReservation | null>(null);

  const { data, isLoading } = useTransporteurReservations({ page, status });

  const columns = [
    {
      key: "label",
      header: "Référence",
      cell: (r: TransportReservation) => (
        <span className="font-medium">{r.label}</span>
      ),
    },
    {
      key: "trajet",
      header: "Trajet",
      cell: (r: TransportReservation) => (
        <span className="text-sm">
          {r.depart} → {r.destination}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date départ",
      cell: (r: TransportReservation) =>
        format(new Date(r.date_depart), "dd MMM yyyy", { locale: fr }),
      className: "hidden md:table-cell",
    },
    {
      key: "poids",
      header: "Poids",
      cell: (r: TransportReservation) => `${r.poids} kg`,
      className: "hidden lg:table-cell",
    },
    {
      key: "status",
      header: "Statut",
      cell: (r: TransportReservation) => <StatusBadge status={r.status} />,
    },
    {
      key: "actions",
      header: "",
      cell: (r: TransportReservation) => (
        <Button variant="ghost" size="icon" onClick={() => setSelected(r)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
      className: "w-10",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Réservations"
        description="Consultez et gérez les réservations de vos annonces."
      />

      <div className="flex items-center gap-3">
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
      </div>

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Aucune réservation trouvée."
        page={page}
        totalPages={data?.meta.totalPages}
        onPageChange={setPage}
      />

      {selected && (
        <ReservationDetailModal
          open={!!selected}
          onOpenChange={(o) => !o && setSelected(null)}
          reservation={selected}
        />
      )}
    </div>
  );
}

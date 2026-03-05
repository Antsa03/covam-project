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
import { CargoFormModal } from "./_components/cargo-form-modal";
import {
  useTransporteurCargoReservations,
  useCreateCargoReservation,
  useUpdateCargoReservation,
} from "@/hooks/use-cargo-reservations";
import { useTransporteurReservations } from "@/hooks/use-reservations";
import type { CargoReservation } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export default function TransporteurCargoPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = useTransporteurCargoReservations({
    page,
    status,
  });
  const { data: reservations } = useTransporteurReservations();
  const create = useCreateCargoReservation();
  const update = useUpdateCargoReservation();

  const columns = [
    {
      key: "id",
      header: "ID",
      cell: (r: CargoReservation) => `#${r.id_cargo_reservation}`,
    },
    {
      key: "label",
      header: "Réservation",
      cell: (r: CargoReservation) => (
        <span className="text-sm">
          {r.reservation?.label ?? `#${r.reservation_id}`}
        </span>
      ),
    },
    {
      key: "prix",
      header: "Prix",
      cell: (r: CargoReservation) => `${r.prix.toLocaleString()} Ar`,
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
    {
      key: "actions",
      header: "",
      cell: (r: CargoReservation) =>
        r.status !== "COMPLETED" && r.status !== "CANCELLED" ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {r.status === "PENDING" && (
                <DropdownMenuItem
                  onClick={() =>
                    update.mutate({
                      id: r.id_cargo_reservation,
                      status: "CONFIRMED",
                    })
                  }
                >
                  Confirmer
                </DropdownMenuItem>
              )}
              {r.status === "CONFIRMED" && (
                <DropdownMenuItem
                  onClick={() =>
                    update.mutate({
                      id: r.id_cargo_reservation,
                      status: "COMPLETED",
                    })
                  }
                >
                  Terminer
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-destructive"
                onClick={() =>
                  update.mutate({
                    id: r.id_cargo_reservation,
                    status: "CANCELLED",
                  })
                }
              >
                Annuler
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null,
      className: "w-10",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cargo réservations"
        description="Gérez les réservations cargo liées à vos transports."
        action={{ label: "Nouvelle cargo", onClick: () => setCreateOpen(true) }}
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

      <CargoFormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        reservations={reservations?.data ?? []}
        onSubmit={async (d) => {
          await create.mutateAsync(d);
          setCreateOpen(false);
        }}
        isLoading={create.isPending}
      />
    </div>
  );
}

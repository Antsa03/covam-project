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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ReservationDetailModal } from "./_components/reservation-detail-modal";
import {
  useClientReservations,
  useCancelClientReservation,
  useDeleteClientReservation,
} from "@/hooks/use-reservations";
import type { TransportReservation } from "@/types";
import { Eye, MoreHorizontal, Trash2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function ClientReservationsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();
  const [selected, setSelected] = useState<TransportReservation | null>(null);
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useClientReservations({ page, status });
  const cancel = useCancelClientReservation();
  const remove = useDeleteClientReservation();

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
      header: "Date",
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelected(r)}>
              <Eye className="mr-2 h-4 w-4" />
              Voir les détails
            </DropdownMenuItem>
            {r.status === "PENDING" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-orange-600"
                  onClick={() => setCancelId(r.id_reservation)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Annuler
                </DropdownMenuItem>
              </>
            )}
            {r.status === "CANCELLED" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setDeleteId(r.id_reservation)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-10",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mes réservations"
        description="Suivez l'état de vos réservations de transport."
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
        emptyMessage="Aucune réservation."
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

      <ConfirmDialog
        open={!!cancelId}
        onOpenChange={(o) => !o && setCancelId(null)}
        title="Annuler la réservation ?"
        description="Cette action est irréversible."
        confirmLabel="Annuler la réservation"
        destructive
        onConfirm={async () => {
          if (cancelId) await cancel.mutateAsync(cancelId);
          setCancelId(null);
        }}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Supprimer la réservation ?"
        description="La réservation sera définitivement supprimée."
        confirmLabel="Supprimer"
        destructive
        onConfirm={async () => {
          if (deleteId) await remove.mutateAsync(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}

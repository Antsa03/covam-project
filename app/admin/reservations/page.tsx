"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
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
import {
  useAdminReservations,
  useUpdateReservationStatus,
} from "@/hooks/use-admin-reservations";
import type { StatusReservation } from "@/types";
import { MoreHorizontal, CheckCircle, XCircle, Flag } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type AdminReservation = {
  id_reservation: number;
  date_reservation: string;
  poids: number;
  date_depart: string;
  depart: string;
  destination: string;
  label: string;
  status: StatusReservation;
  client: {
    utilisateur: { nom: string; prenom: string; email: string; phone: string };
  };
  cargo_reservation?: { prix: number; status: string } | null;
  payement?: { status: string; prix: number } | null;
};

export default function AdminReservationsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useAdminReservations({ page, status, search });
  const updateStatus = useUpdateReservationStatus();

  const columns = [
    {
      key: "label",
      header: "Référence",
      cell: (r: AdminReservation) => (
        <span className="font-medium">{r.label}</span>
      ),
    },
    {
      key: "trajet",
      header: "Trajet",
      cell: (r: AdminReservation) => (
        <span className="text-sm">
          {r.depart} → {r.destination}
        </span>
      ),
    },
    {
      key: "client",
      header: "Client",
      cell: (r: AdminReservation) => (
        <div>
          <p className="text-sm font-medium">
            {r.client.utilisateur.prenom} {r.client.utilisateur.nom}
          </p>
          <p className="text-xs text-muted-foreground">
            {r.client.utilisateur.phone}
          </p>
        </div>
      ),
      className: "hidden md:table-cell",
    },
    {
      key: "date",
      header: "Date départ",
      cell: (r: AdminReservation) =>
        format(new Date(r.date_depart), "dd MMM yyyy", { locale: fr }),
      className: "hidden lg:table-cell",
    },
    {
      key: "poids",
      header: "Poids",
      cell: (r: AdminReservation) => `${r.poids} kg`,
      className: "hidden lg:table-cell",
    },
    {
      key: "prix",
      header: "Prix cargo",
      cell: (r: AdminReservation) =>
        r.cargo_reservation
          ? `${r.cargo_reservation.prix.toLocaleString()} Ar`
          : "—",
      className: "hidden md:table-cell",
    },
    {
      key: "status",
      header: "Statut",
      cell: (r: AdminReservation) => <StatusBadge status={r.status} />,
    },
    {
      key: "actions",
      header: "",
      cell: (r: AdminReservation) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {r.status === "PENDING" && (
              <DropdownMenuItem
                onClick={() =>
                  updateStatus.mutate({
                    id: r.id_reservation,
                    status: "CONFIRMED",
                  })
                }
              >
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Confirmer
              </DropdownMenuItem>
            )}
            {r.status === "CONFIRMED" && (
              <DropdownMenuItem
                onClick={() =>
                  updateStatus.mutate({
                    id: r.id_reservation,
                    status: "COMPLETED",
                  })
                }
              >
                <Flag className="mr-2 h-4 w-4 text-blue-500" />
                Marquer terminé
              </DropdownMenuItem>
            )}
            {(r.status === "PENDING" || r.status === "CONFIRMED") && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() =>
                    updateStatus.mutate({
                      id: r.id_reservation,
                      status: "CANCELLED",
                    })
                  }
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Annuler
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
        title="Réservations"
        description="Toutes les réservations de transport sur la plateforme."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Rechercher par référence, trajet, client…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
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
    </div>
  );
}

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  useAdminAnnonces,
  useUpdateAnnonceStatus,
} from "@/hooks/use-admin-annonces";
import type { StatusPublication } from "@/types";
import { MoreHorizontal, CheckCircle, XCircle, Clock } from "lucide-react";

type AdminAnnonce = {
  id_pb_transport: number;
  depart: string;
  destination: string;
  capacite_transport: number;
  status: StatusPublication;
  prix_par_kilo: number;
  prix_fragile_par_kilo: number;
  transport: {
    marque: string;
    immatriculation: string;
    type: string;
    transporteur: {
      utilisateur: { nom: string; prenom: string; email: string };
    };
  };
  _count: { reservations: number };
};

export default function AdminAnnoncesPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();

  const { data, isLoading } = useAdminAnnonces({ page, status });
  const updateStatus = useUpdateAnnonceStatus();

  const columns = [
    {
      key: "trajet",
      header: "Trajet",
      cell: (r: AdminAnnonce) => (
        <div className="font-medium">
          {r.depart} → {r.destination}
        </div>
      ),
    },
    {
      key: "transport",
      header: "Transport",
      cell: (r: AdminAnnonce) => (
        <div>
          <p className="text-sm">{r.transport.marque}</p>
          <p className="text-xs text-muted-foreground">
            {r.transport.immatriculation}
          </p>
        </div>
      ),
      className: "hidden md:table-cell",
    },
    {
      key: "transporteur",
      header: "Transporteur",
      cell: (r: AdminAnnonce) => (
        <span className="text-sm">
          {r.transport.transporteur.utilisateur.prenom}{" "}
          {r.transport.transporteur.utilisateur.nom}
        </span>
      ),
      className: "hidden lg:table-cell",
    },
    {
      key: "prix",
      header: "Prix/kg",
      cell: (r: AdminAnnonce) => (
        <span className="text-sm">{r.prix_par_kilo.toLocaleString()} Ar</span>
      ),
    },
    {
      key: "capacite",
      header: "Capacité",
      cell: (r: AdminAnnonce) => `${r.capacite_transport} kg`,
      className: "hidden lg:table-cell",
    },
    {
      key: "reservations",
      header: "Réservations",
      cell: (r: AdminAnnonce) => r._count.reservations,
      className: "hidden md:table-cell",
    },
    {
      key: "status",
      header: "Statut",
      cell: (r: AdminAnnonce) => <StatusBadge status={r.status} />,
    },
    {
      key: "actions",
      header: "",
      cell: (r: AdminAnnonce) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {r.status !== "ACTIVE" && (
              <DropdownMenuItem
                onClick={() =>
                  updateStatus.mutate({
                    id: r.id_pb_transport,
                    status: "ACTIVE",
                  })
                }
              >
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Activer
              </DropdownMenuItem>
            )}
            {r.status !== "PENDING" && (
              <DropdownMenuItem
                onClick={() =>
                  updateStatus.mutate({
                    id: r.id_pb_transport,
                    status: "PENDING",
                  })
                }
              >
                <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                En attente
              </DropdownMenuItem>
            )}
            {r.status !== "INACTIVE" && (
              <DropdownMenuItem
                onClick={() =>
                  updateStatus.mutate({
                    id: r.id_pb_transport,
                    status: "INACTIVE",
                  })
                }
              >
                <XCircle className="mr-2 h-4 w-4 text-destructive" />
                Désactiver
              </DropdownMenuItem>
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
        title="Annonces"
        description="Toutes les annonces de transport publiées sur la plateforme."
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
          <SelectItem value="ACTIVE">Actif</SelectItem>
          <SelectItem value="PENDING">En attente</SelectItem>
          <SelectItem value="INACTIVE">Inactif</SelectItem>
        </SelectContent>
      </Select>

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Aucune annonce trouvée."
        page={page}
        totalPages={data?.meta.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

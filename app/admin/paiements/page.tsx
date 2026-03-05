"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { useAdminPayements } from "@/hooks/use-admin-payements";
import type { StatusPayement } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type AdminPayement = {
  id_payement: number;
  date_payement: string;
  status: StatusPayement;
  prix: number;
  num_telephone: string;
  reservation_id?: number | null;
  cargo_reservation_id?: number | null;
  reservation?: {
    label: string;
    depart: string;
    destination: string;
    client: { utilisateur: { nom: string; prenom: string } };
  } | null;
  cargo_reservation?: {
    id_cargo_reservation: number;
    reservation?: {
      label: string;
      depart: string;
      destination: string;
      client: { utilisateur: { nom: string; prenom: string } };
    } | null;
  } | null;
};

function getPayementInfo(r: AdminPayement) {
  if (r.reservation) {
    return {
      label: r.reservation.label,
      trajet: `${r.reservation.depart} → ${r.reservation.destination}`,
      client: `${r.reservation.client.utilisateur.prenom} ${r.reservation.client.utilisateur.nom}`,
      type: "Réservation",
    };
  }
  if (r.cargo_reservation?.reservation) {
    const res = r.cargo_reservation.reservation;
    return {
      label: res.label,
      trajet: `${res.depart} → ${res.destination}`,
      client: `${res.client.utilisateur.prenom} ${res.client.utilisateur.nom}`,
      type: "Cargo",
    };
  }
  return { label: "—", trajet: "—", client: "—", type: "—" };
}

export default function AdminPaiementsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();

  const { data, isLoading } = useAdminPayements({ page, status });

  const columns = [
    {
      key: "id",
      header: "ID",
      cell: (r: AdminPayement) => `#${r.id_payement}`,
    },
    {
      key: "montant",
      header: "Montant",
      cell: (r: AdminPayement) => (
        <span className="font-semibold">
          {r.prix.toLocaleString("fr-FR")} Ar
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      cell: (r: AdminPayement) => {
        const info = getPayementInfo(r);
        return (
          <Badge variant="outline" className="text-xs">
            {info.type}
          </Badge>
        );
      },
    },
    {
      key: "reference",
      header: "Référence",
      cell: (r: AdminPayement) => {
        const info = getPayementInfo(r);
        return (
          <div>
            <p className="text-sm font-medium">{info.label}</p>
            <p className="text-xs text-muted-foreground">{info.trajet}</p>
          </div>
        );
      },
      className: "hidden md:table-cell",
    },
    {
      key: "client",
      header: "Client",
      cell: (r: AdminPayement) => {
        const info = getPayementInfo(r);
        return <span className="text-sm">{info.client}</span>;
      },
      className: "hidden lg:table-cell",
    },
    {
      key: "telephone",
      header: "Téléphone",
      cell: (r: AdminPayement) => (
        <span className="text-sm">{r.num_telephone}</span>
      ),
      className: "hidden lg:table-cell",
    },
    {
      key: "date",
      header: "Date",
      cell: (r: AdminPayement) =>
        format(new Date(r.date_payement), "dd MMM yyyy", { locale: fr }),
      className: "hidden md:table-cell",
    },
    {
      key: "status",
      header: "Statut",
      cell: (r: AdminPayement) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Paiements"
        description="Tous les paiements enregistrés sur la plateforme."
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
          <SelectItem value="PAID">Payé</SelectItem>
          <SelectItem value="FAILED">Échoué</SelectItem>
          <SelectItem value="REFUNDED">Remboursé</SelectItem>
        </SelectContent>
      </Select>

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Aucun paiement trouvé."
        page={page}
        totalPages={data?.meta.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

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
import { useAdminMarchandises } from "@/hooks/use-admin-marchandise";
import type { StatusPublication, CargoCategory } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const CATEGORY_LABELS: Record<CargoCategory, string> = {
  STANDARD: "Standard",
  FRAGILE: "Fragile",
  PERISHABLE: "Périssable",
  HAZARDOUS: "Dangereux",
  OVERSIZED: "Volumineux",
};

type AdminMarchandise = {
  id_pb_marchandise: number;
  label: string;
  category: CargoCategory;
  fragile: boolean;
  poids: number;
  dimension: number;
  status: StatusPublication;
  date_depart: string;
  depart: string;
  destination: string;
  nom_recepteur: string;
  tel_recepteur: string;
  date_creation: string;
  client: {
    utilisateur: { nom: string; prenom: string; email: string; phone: string };
  };
};

export default function AdminMarchandisesPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();

  const { data, isLoading } = useAdminMarchandises({ page, status });

  const columns = [
    {
      key: "label",
      header: "Marchandise",
      cell: (r: AdminMarchandise) => (
        <div>
          <p className="font-medium">{r.label}</p>
          <p className="text-xs text-muted-foreground">
            {r.depart} → {r.destination}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Catégorie",
      cell: (r: AdminMarchandise) => (
        <Badge variant="outline" className="text-xs">
          {CATEGORY_LABELS[r.category] ?? r.category}
        </Badge>
      ),
    },
    {
      key: "poids",
      header: "Poids / Dim.",
      cell: (r: AdminMarchandise) => (
        <span className="text-sm">
          {r.poids} kg · {r.dimension} m³
        </span>
      ),
      className: "hidden md:table-cell",
    },
    {
      key: "client",
      header: "Client",
      cell: (r: AdminMarchandise) => (
        <div>
          <p className="text-sm font-medium">
            {r.client.utilisateur.prenom} {r.client.utilisateur.nom}
          </p>
          <p className="text-xs text-muted-foreground">
            {r.client.utilisateur.phone}
          </p>
        </div>
      ),
      className: "hidden lg:table-cell",
    },
    {
      key: "recepteur",
      header: "Récepteur",
      cell: (r: AdminMarchandise) => (
        <div>
          <p className="text-sm">{r.nom_recepteur}</p>
          <p className="text-xs text-muted-foreground">{r.tel_recepteur}</p>
        </div>
      ),
      className: "hidden lg:table-cell",
    },
    {
      key: "date",
      header: "Date départ",
      cell: (r: AdminMarchandise) =>
        format(new Date(r.date_depart), "dd MMM yyyy", { locale: fr }),
      className: "hidden md:table-cell",
    },
    {
      key: "status",
      header: "Statut",
      cell: (r: AdminMarchandise) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marchandises"
        description="Toutes les annonces de marchandises publiées par les clients."
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
        emptyMessage="Aucune marchandise trouvée."
        page={page}
        totalPages={data?.meta.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

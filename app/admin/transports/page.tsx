"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { useAdminTransports } from "@/hooks/use-admin-transports";
import { Truck } from "lucide-react";

type AdminTransport = {
  id_transport: number;
  marque: string;
  immatriculation: string;
  type: string;
  description: string;
  transporteur: {
    utilisateur: { nom: string; prenom: string; email: string; phone: string };
  };
  _count: { pb_transports: number };
};

export default function AdminTransportsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useAdminTransports({ page, search });

  const columns = [
    {
      key: "vehicle",
      header: "Véhicule",
      cell: (r: AdminTransport) => (
        <div>
          <p className="font-medium">{r.marque}</p>
          <p className="text-xs text-muted-foreground">{r.type}</p>
        </div>
      ),
    },
    {
      key: "immat",
      header: "Immatriculation",
      cell: (r: AdminTransport) => (
        <Badge variant="outline">{r.immatriculation}</Badge>
      ),
    },
    {
      key: "transporteur",
      header: "Transporteur",
      cell: (r: AdminTransport) => (
        <div>
          <p className="text-sm font-medium">
            {r.transporteur.utilisateur.prenom} {r.transporteur.utilisateur.nom}
          </p>
          <p className="text-xs text-muted-foreground">
            {r.transporteur.utilisateur.email}
          </p>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Téléphone",
      cell: (r: AdminTransport) => (
        <span className="text-sm">{r.transporteur.utilisateur.phone}</span>
      ),
      className: "hidden md:table-cell",
    },
    {
      key: "annonces",
      header: "Annonces",
      cell: (r: AdminTransport) => (
        <Badge variant="secondary">{r._count.pb_transports}</Badge>
      ),
    },
    {
      key: "desc",
      header: "Description",
      cell: (r: AdminTransport) => (
        <span className="text-xs text-muted-foreground line-clamp-1">
          {r.description}
        </span>
      ),
      className: "hidden lg:table-cell",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transports"
        description="Tous les véhicules enregistrés sur la plateforme."
      />

      <div className="flex items-center gap-3">
        <Input
          placeholder="Rechercher par marque, immatriculation, transporteur…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
        {data && (
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Truck className="h-4 w-4" />
            {data.meta.total} transport(s)
          </span>
        )}
      </div>

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Aucun transport trouvé."
        page={page}
        totalPages={data?.meta.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

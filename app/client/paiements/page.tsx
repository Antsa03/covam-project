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
import { PaiementFormModal } from "./_components/paiement-form-modal";
import { usePayements, useCreatePayement } from "@/hooks/use-payements";
import { useClientReservations } from "@/hooks/use-reservations";
import type { Payement } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CreditCard } from "lucide-react";

export default function PaiementsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = usePayements({ page, status });
  const { data: reservations } = useClientReservations();
  const create = useCreatePayement();

  const columns = [
    {
      key: "id",
      header: "ID",
      cell: (r: Payement) => (
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="font-medium">#{r.id_payement}</span>
        </div>
      ),
    },
    {
      key: "reservation",
      header: "Réservation",
      cell: (r: Payement) => (
        <span className="text-sm">#{r.reservation_id}</span>
      ),
    },
    {
      key: "montant",
      header: "Montant",
      cell: (r: Payement) => (
        <span className="font-semibold">
          {r.prix.toLocaleString("fr-FR")} Ar
        </span>
      ),
    },
    {
      key: "telephone",
      header: "N° téléphone",
      cell: (r: Payement) => r.num_telephone,
      className: "hidden md:table-cell",
    },
    {
      key: "date",
      header: "Date",
      cell: (r: Payement) =>
        format(new Date(r.date_payement), "dd MMM yyyy", { locale: fr }),
      className: "hidden md:table-cell",
    },
    {
      key: "status",
      header: "Statut",
      cell: (r: Payement) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mes paiements"
        description="Consultez l'historique de vos paiements."
        action={{
          label: "Nouveau paiement",
          onClick: () => setCreateOpen(true),
        }}
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
          <SelectItem value="COMPLETED">Payé</SelectItem>
          <SelectItem value="FAILED">Échoué</SelectItem>
          <SelectItem value="REFUNDED">Remboursé</SelectItem>
        </SelectContent>
      </Select>

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Aucun paiement enregistré."
        page={page}
        totalPages={data?.meta.totalPages}
        onPageChange={setPage}
      />

      <PaiementFormModal
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

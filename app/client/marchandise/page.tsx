"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { MarchandiseFormModal } from "./_components/marchandise-form-modal";
import {
  usePbMarchandise,
  useCreatePbMarchandise,
  useUpdatePbMarchandise,
  useDeletePbMarchandise,
} from "@/hooks/use-pb-marchandise";
import type { PbMarchandise } from "@/types";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export default function MarchandisePage() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<PbMarchandise | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = usePbMarchandise({ page });
  const create = useCreatePbMarchandise();
  const update = useUpdatePbMarchandise();
  const remove = useDeletePbMarchandise();

  const columns = [
    {
      key: "label",
      header: "Label",
      cell: (r: PbMarchandise) => (
        <span className="font-medium">{r.label}</span>
      ),
    },
    {
      key: "trajet",
      header: "Trajet",
      cell: (r: PbMarchandise) => `${r.depart} → ${r.destination}`,
    },
    {
      key: "category",
      header: "Catégorie",
      cell: (r: PbMarchandise) => r.category,
    },
    {
      key: "poids",
      header: "Poids",
      cell: (r: PbMarchandise) => `${r.poids} kg`,
    },
    {
      key: "dimension",
      header: "Dimension",
      cell: (r: PbMarchandise) => `${r.dimension} m³`,
      className: "hidden md:table-cell",
    },
    {
      key: "status",
      header: "Statut",
      cell: (r: PbMarchandise) => <StatusBadge status={r.status} />,
      className: "hidden lg:table-cell",
    },
    {
      key: "actions",
      header: "",
      cell: (r: PbMarchandise) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditItem(r)}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setDeleteId(r.id_pb_marchandise)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-10",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mes marchandises"
        description="Gérez vos annonces de marchandise disponibles à l'envoi."
        action={{
          label: "Ajouter une marchandise",
          onClick: () => setCreateOpen(true),
        }}
      />

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Aucune marchandise enregistrée."
        page={page}
        totalPages={data?.meta.totalPages}
        onPageChange={setPage}
      />

      <MarchandiseFormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={async (d) => {
          await create.mutateAsync(d);
          setCreateOpen(false);
        }}
        isLoading={create.isPending}
      />

      {editItem && (
        <MarchandiseFormModal
          open={!!editItem}
          onOpenChange={(o) => !o && setEditItem(null)}
          initialData={editItem}
          onSubmit={async (d) => {
            await update.mutateAsync(
              d as Parameters<typeof update.mutateAsync>[0],
            );
            setEditItem(null);
          }}
          isLoading={update.isPending}
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Supprimer la marchandise ?"
        description="Cette marchandise sera définitivement supprimée."
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

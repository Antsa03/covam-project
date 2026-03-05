"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/shared/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { TransportFormModal } from "./_components/transport-form-modal";
import {
  useTransports,
  useCreateTransport,
  useUpdateTransport,
  useDeleteTransport,
} from "@/hooks/use-transports";
import type { Transport } from "@/types";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Truck,
  ChevronLeft,
  ChevronRight,
  ImageOff,
} from "lucide-react";

function TransportCard({
  transport,
  onEdit,
  onDelete,
}: {
  transport: Transport;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-44 bg-muted shrink-0">
        {transport.images ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={transport.images}
            alt={`${transport.marque} – ${transport.type}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-10 w-10" />
          </div>
        )}
        {/* Immatriculation badge */}
        <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs font-mono text-white">
          {transport.immatriculation}
        </span>
      </div>

      <CardContent className="flex-1 p-4 space-y-1">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-primary shrink-0" />
          <span className="font-semibold leading-tight">
            {transport.marque}
          </span>
          <span className="text-xs text-muted-foreground">
            · {transport.type}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {transport.description}
        </p>
      </CardContent>

      <CardFooter className="p-3 pt-0 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4 mr-1" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}

function TransportCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col">
      <Skeleton className="h-44 w-full rounded-none" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-end">
        <Skeleton className="h-8 w-24" />
      </CardFooter>
    </Card>
  );
}

export default function TransportsPage() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Transport | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useTransports({ page });
  const create = useCreateTransport();
  const update = useUpdateTransport();
  const remove = useDeleteTransport();

  const totalPages = data?.meta.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mes transports"
        description="Gérez vos véhicules de transport."
        action={{
          label: "Ajouter un transport",
          onClick: () => setCreateOpen(true),
        }}
      />

      {/* Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <TransportCardSkeleton key={i} />
          ))
        ) : data?.data.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <Truck className="h-12 w-12 opacity-30" />
            <p className="text-sm">Aucun transport enregistré.</p>
          </div>
        ) : (
          data?.data.map((t) => (
            <TransportCard
              key={t.id_transport}
              transport={t}
              onEdit={() => setEditItem(t)}
              onDelete={() => setDeleteId(t.id_transport)}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <TransportFormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={async (d) => {
          await create.mutateAsync(d);
          setCreateOpen(false);
        }}
        isLoading={create.isPending}
      />

      {editItem && (
        <TransportFormModal
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
        title="Supprimer le transport ?"
        description="Les annonces liées à ce transport seront également supprimées."
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

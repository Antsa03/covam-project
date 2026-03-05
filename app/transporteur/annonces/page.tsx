"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { AnnonceFormModal } from "./_components/annonce-form-modal";
import {
  usePbTransports,
  useCreatePbTransport,
  useUpdatePbTransport,
  useDeletePbTransport,
} from "@/hooks/use-pb-transports";
import { useTransports } from "@/hooks/use-transports";
import type { PbTransport } from "@/types";
import {
  MapPin,
  Weight,
  Truck,
  ArrowRight,
  ImageOff,
  Pencil,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const VILLES = [
  "Antananarivo",
  "Toamasina",
  "Mahajanga",
  "Fianarantsoa",
  "Toliara",
  "Antsiranana",
  "Antsirabe",
  "Morondava",
  "Ambositra",
  "Nosy Be",
];

const ALL = "__all__";

function AnnonceCard({
  annonce,
  onEdit,
  onDelete,
}: {
  annonce: PbTransport;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const image = annonce.transport
    ? (annonce.transport as PbTransport["transport"] & { images?: string })
        ?.images
    : undefined;

  return (
    <Card className="overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-40 bg-muted shrink-0">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={`${annonce.transport?.marque ?? "Transport"}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-10 w-10 opacity-40" />
          </div>
        )}
        {/* Status badge overlay */}
        <div className="absolute top-2 right-2">
          <StatusBadge status={annonce.status} />
        </div>
      </div>

      <CardContent className="flex-1 p-4 space-y-3">
        {/* Trajet */}
        <div className="flex items-center gap-2 font-semibold text-base">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          <span>{annonce.depart}</span>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <span>{annonce.destination}</span>
        </div>

        {/* Véhicule */}
        {annonce.transport && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Truck className="h-3.5 w-3.5 shrink-0" />
            {annonce.transport.marque} · {annonce.transport.type} ·{" "}
            {annonce.transport.immatriculation}
          </div>
        )}

        {/* Prix */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-md bg-muted px-3 py-2">
            <p className="text-xs text-muted-foreground mb-0.5">Prix / kg</p>
            <p className="font-semibold">
              {annonce.prix_par_kilo.toLocaleString()} Ar
            </p>
          </div>
          <div className="rounded-md bg-muted px-3 py-2">
            <p className="text-xs text-muted-foreground mb-0.5">Fragile / kg</p>
            <p className="font-semibold">
              {annonce.prix_fragile_par_kilo.toLocaleString()} Ar
            </p>
          </div>
        </div>

        {/* Capacité + réservations */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Weight className="h-3.5 w-3.5 shrink-0" />
            Capacité :{" "}
            <span className="font-medium text-foreground">
              {annonce.capacite_transport} kg
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 shrink-0" />
            <span>{annonce._count?.reservations ?? 0} rés.</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5 mr-1.5" />
          Modifier
        </Button>
        <Button variant="destructive" size="icon" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function AnnonceCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col">
      <Skeleton className="h-40 w-full rounded-none" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-14 rounded-md" />
          <Skeleton className="h-14 rounded-md" />
        </div>
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="p-3 pt-0 flex gap-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-9" />
      </CardFooter>
    </Card>
  );
}

export default function AnnoncesPage() {
  const [page, setPage] = useState(1);
  const [filterDepart, setFilterDepart] = useState(ALL);
  const [filterStatus, setFilterStatus] = useState(ALL);
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<PbTransport | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = usePbTransports({ page, role: "transporteur" });
  const { data: transportsData } = useTransports();
  const create = useCreatePbTransport();
  const update = useUpdatePbTransport();
  const remove = useDeletePbTransport();

  const filtered = useMemo(() => {
    let items = data?.data ?? [];
    if (filterDepart !== ALL)
      items = items.filter((a) => a.depart === filterDepart);
    if (filterStatus !== ALL)
      items = items.filter((a) => a.status === filterStatus);
    return items;
  }, [data?.data, filterDepart, filterStatus]);

  const totalPages = data?.meta.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mes annonces"
        description="Publiez et gérez vos annonces de transport."
        action={{
          label: "Nouvelle annonce",
          onClick: () => setCreateOpen(true),
        }}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={filterDepart} onValueChange={setFilterDepart}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Ville de départ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Tous les départs</SelectItem>
            {VILLES.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Tous les statuts</SelectItem>
            <SelectItem value="ACTIVE">Actif</SelectItem>
            <SelectItem value="PENDING">En attente</SelectItem>
            <SelectItem value="INACTIVE">Inactif</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <AnnonceCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <ImageOff className="h-12 w-12 mb-3 opacity-30" />
          <p>Aucune annonce publiée.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((annonce) => (
            <AnnonceCard
              key={annonce.id_pb_transport}
              annonce={annonce}
              onEdit={() => setEditItem(annonce)}
              onDelete={() => setDeleteId(annonce.id_pb_transport)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <AnnonceFormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        transports={transportsData?.data ?? []}
        onSubmit={async (d) => {
          await create.mutateAsync(d);
          setCreateOpen(false);
        }}
        isLoading={create.isPending}
      />

      {editItem && (
        <AnnonceFormModal
          open={!!editItem}
          onOpenChange={(o) => !o && setEditItem(null)}
          initialData={editItem}
          transports={transportsData?.data ?? []}
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
        title="Supprimer l'annonce ?"
        description="Les réservations associées ne seront pas supprimées."
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

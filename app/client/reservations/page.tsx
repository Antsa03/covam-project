"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ReservationDetailModal } from "./_components/reservation-detail-modal";
import {
  useClientReservations,
  useCancelClientReservation,
  useDeleteClientReservation,
} from "@/hooks/use-reservations";
import type { TransportReservation } from "@/types";
import {
  Eye,
  MoreHorizontal,
  Trash2,
  XCircle,
  MapPin,
  ArrowRight,
  Weight,
  CalendarDays,
  PackageCheck,
  Truck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

function ReservationCard({
  r,
  onView,
  onCancel,
  onDelete,
}: {
  r: TransportReservation;
  onView: () => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const transportImage = (
    r.pb_transport?.transport as { images?: string } | undefined
  )?.images;

  const transporteurUser = r.pb_transport?.transport?.transporteur?.utilisateur;
  const initials = transporteurUser
    ? `${transporteurUser.prenom?.[0] ?? ""}${transporteurUser.nom?.[0] ?? ""}`.toUpperCase()
    : "T";

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar transporteur + véhicule */}
          <div className="flex items-center gap-3 sm:w-44 shrink-0">
            <Avatar className="h-16 w-16 shrink-0">
              <AvatarImage src={transportImage ?? undefined} />
              <AvatarFallback>
                <Truck className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              {r.pb_transport?.transport && (
                <p className="font-semibold text-sm leading-tight truncate">
                  {r.pb_transport.transport.marque}
                </p>
              )}
              {transporteurUser && (
                <p className="text-xs text-muted-foreground truncate">
                  {transporteurUser.prenom} {transporteurUser.nom}
                </p>
              )}
              {transporteurUser?.phone && (
                <p className="text-xs text-muted-foreground">
                  {transporteurUser.phone}
                </p>
              )}
            </div>
          </div>

          <Separator orientation="vertical" className="hidden sm:block h-14" />

          {/* Infos réservation */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2 text-sm min-w-0">
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
                <MapPin className="h-3 w-3" /> Trajet
              </p>
              <p className="font-medium flex items-center gap-1 flex-wrap">
                {r.depart}
                <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                {r.destination}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
                <CalendarDays className="h-3 w-3" /> Date départ
              </p>
              <p className="font-medium">
                {format(new Date(r.date_depart), "dd MMM yyyy", { locale: fr })}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
                <Weight className="h-3 w-3" /> Poids
              </p>
              <p className="font-medium">{r.poids} kg</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
                <PackageCheck className="h-3 w-3" /> Prix cargo
              </p>
              <p className="font-medium">
                {r.cargo_reservation
                  ? `${r.cargo_reservation.prix.toLocaleString()} Ar`
                  : "—"}
              </p>
            </div>
          </div>

          {/* Status + Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={r.status} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onView}>
                  <Eye className="mr-2 h-4 w-4" />
                  Voir les détails
                </DropdownMenuItem>
                {r.status === "PENDING" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-orange-600"
                      onClick={onCancel}
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
                      onClick={onDelete}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Référence */}
        <div className="flex items-center gap-2 text-sm border-t pt-2">
          <p className="text-xs text-muted-foreground">Référence :</p>
          <p className="font-mono text-sm font-medium">{r.label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ReservationCardSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="flex items-center gap-4 p-4">
        <Skeleton className="h-16 w-16 rounded-full shrink-0" />
        <div className="space-y-1.5 w-44 shrink-0 hidden sm:block">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-36" />
        </div>
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
        <Skeleton className="h-6 w-20 shrink-0" />
        <Skeleton className="h-8 w-8 shrink-0" />
      </CardContent>
    </Card>
  );
}

export default function ClientReservationsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();
  const [selected, setSelected] = useState<TransportReservation | null>(null);
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useClientReservations({ page, status });
  const cancel = useCancelClientReservation();
  const remove = useDeleteClientReservation();
  const totalPages = data?.meta.totalPages ?? 1;

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
        <SelectTrigger className="w-full sm:w-48">
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

      {/* Liste des cartes */}
      <div className="flex flex-col gap-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <ReservationCardSkeleton key={i} />
          ))
        ) : data?.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <PackageCheck className="h-12 w-12 mb-3 opacity-30" />
            <p>Aucune réservation.</p>
          </div>
        ) : (
          data?.data.map((r) => (
            <ReservationCard
              key={r.id_reservation}
              r={r}
              onView={() => setSelected(r)}
              onCancel={() => setCancelId(r.id_reservation)}
              onDelete={() => setDeleteId(r.id_reservation)}
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

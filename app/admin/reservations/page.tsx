"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
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
import {
  useAdminReservations,
  useUpdateReservationStatus,
} from "@/hooks/use-admin-reservations";
import type { StatusReservation } from "@/types";
import {
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Flag,
  MapPin,
  ArrowRight,
  Weight,
  CalendarDays,
  PackageCheck,
  ChevronLeft,
  ChevronRight,
  Truck,
  User,
} from "lucide-react";
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
    image?: string | null;
    utilisateur: { nom: string; prenom: string; email: string; phone: string };
  };
  pb_transport?: {
    transport?: {
      marque: string;
      immatriculation: string;
      images?: string | null;
      transporteur?: {
        utilisateur: {
          nom: string;
          prenom: string;
          phone: string;
          email: string;
        };
      };
    } | null;
  } | null;
  cargo_reservation?: { prix: number; status: string } | null;
  payement?: { status: string; prix: number } | null;
};

function ReservationCard({
  r,
  onStatusChange,
  isPending,
}: {
  r: AdminReservation;
  onStatusChange: (id: number, status: StatusReservation) => void;
  isPending: boolean;
}) {
  const clientInitials =
    `${r.client.utilisateur.prenom[0] ?? ""}${r.client.utilisateur.nom[0] ?? ""}`.toUpperCase();
  const transport = r.pb_transport?.transport;
  const transporteurUser = transport?.transporteur?.utilisateur;
  const transporteurInitials = transporteurUser
    ? `${transporteurUser.prenom[0] ?? ""}${transporteurUser.nom[0] ?? ""}`.toUpperCase()
    : "T";

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar transport + transporteur */}
          <div className="flex flex-col gap-1 sm:w-44 shrink-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Transporteur
            </span>
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16 shrink-0">
                <AvatarImage src={transport?.images ?? undefined} />
                <AvatarFallback>
                  <Truck className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                {transport && (
                  <p className="font-semibold text-sm leading-tight truncate">
                    {transport.marque}
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
          </div>

          <Separator orientation="vertical" className="hidden sm:block h-14" />

          {/* Avatar + client */}
          <div className="flex flex-col gap-1 sm:w-44 shrink-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Client
            </span>
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16 shrink-0">
                <AvatarImage src={r.client.image ?? undefined} />
                <AvatarFallback>{clientInitials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold text-sm leading-tight truncate">
                  {r.client.utilisateur.prenom} {r.client.utilisateur.nom}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {r.client.utilisateur.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {r.client.utilisateur.phone}
                </p>
              </div>
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
                <Button variant="ghost" size="icon" disabled={isPending}>
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {r.status === "PENDING" && (
                  <DropdownMenuItem
                    onClick={() =>
                      onStatusChange(r.id_reservation, "CONFIRMED")
                    }
                  >
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Confirmer
                  </DropdownMenuItem>
                )}
                {r.status === "CONFIRMED" && (
                  <DropdownMenuItem
                    onClick={() =>
                      onStatusChange(r.id_reservation, "COMPLETED")
                    }
                  >
                    <Flag className="mr-2 h-4 w-4 text-primary" />
                    Marquer terminé
                  </DropdownMenuItem>
                )}
                {(r.status === "PENDING" || r.status === "CONFIRMED") && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() =>
                        onStatusChange(r.id_reservation, "CANCELLED")
                      }
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Annuler
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
        <div className="space-y-1.5 w-44 shrink-0">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex-1 grid grid-cols-4 gap-4">
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

export default function AdminReservationsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useAdminReservations({ page, status, search });
  const updateStatus = useUpdateReservationStatus();
  const totalPages = data?.meta.totalPages ?? 1;

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

      {/* Liste des cartes */}
      <div className="flex flex-col gap-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <ReservationCardSkeleton key={i} />
          ))
        ) : data?.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <PackageCheck className="h-12 w-12 mb-3 opacity-30" />
            <p>Aucune réservation trouvée.</p>
          </div>
        ) : (
          data?.data.map((r) => (
            <ReservationCard
              key={r.id_reservation}
              r={r}
              onStatusChange={(id, s) => updateStatus.mutate({ id, status: s })}
              isPending={updateStatus.isPending}
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
    </div>
  );
}

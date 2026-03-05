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
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ReservationDetailModal } from "./_components/reservation-detail-modal";
import { useTransporteurReservations } from "@/hooks/use-reservations";
import type { TransportReservation, StatusReservation } from "@/types";
import {
  Eye,
  MapPin,
  ArrowRight,
  Weight,
  CalendarDays,
  PackageCheck,
  ChevronLeft,
  ChevronRight,
  Truck,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type TransporteurReservation = TransportReservation & {
  client?: {
    image?: string | null;
    utilisateur: { nom: string; prenom: string; phone: string; email: string };
  };
};

function ReservationCard({
  r,
  onView,
}: {
  r: TransporteurReservation;
  onView: () => void;
}) {
  const prenom = r.client?.utilisateur.prenom ?? "";
  const nom = r.client?.utilisateur.nom ?? "";
  const initials = `${prenom[0] ?? ""}${nom[0] ?? ""}`.toUpperCase();

  const transportImage = (
    r.pb_transport?.transport as { images?: string } | undefined
  )?.images;
  const transport = r.pb_transport?.transport;

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Transport */}
          <div className="flex flex-col gap-1 sm:w-44 shrink-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Transport
            </span>
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16 shrink-0">
                <AvatarImage src={transportImage ?? undefined} />
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
                {transport?.immatriculation && (
                  <p className="text-xs text-muted-foreground font-mono">
                    {transport.immatriculation}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator orientation="vertical" className="hidden sm:block h-14" />

          {/* Client */}
          <div className="flex flex-col gap-1 sm:w-44 shrink-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Client
            </span>
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16 shrink-0">
                <AvatarImage src={r.client?.image ?? undefined} />
                <AvatarFallback>{initials || "?"}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold text-sm leading-tight truncate">
                  {prenom} {nom}
                </p>
                {r.client?.utilisateur.email && (
                  <p className="text-xs text-muted-foreground truncate">
                    {r.client.utilisateur.email}
                  </p>
                )}
                {r.client?.utilisateur.phone && (
                  <p className="text-xs text-muted-foreground">
                    {r.client.utilisateur.phone}
                  </p>
                )}
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

          {/* Status + Action */}
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={r.status} />
            <Button variant="ghost" size="icon" onClick={onView}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">Voir les détails</span>
            </Button>
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
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-3 w-20" />
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

export default function TransporteurReservationsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();
  const [selected, setSelected] = useState<TransportReservation | null>(null);

  const { data, isLoading } = useTransporteurReservations({ page, status });
  const totalPages = data?.meta.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Réservations"
        description="Consultez et gérez les réservations de vos annonces."
      />

      <div className="flex items-center gap-3">
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
          (data?.data as TransporteurReservation[])?.map((r) => (
            <ReservationCard
              key={r.id_reservation}
              r={r}
              onView={() => setSelected(r)}
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
    </div>
  );
}

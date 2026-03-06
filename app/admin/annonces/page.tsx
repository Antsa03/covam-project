"use client";

import { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  useAdminAnnonces,
  useUpdateAnnonceStatus,
} from "@/hooks/use-admin-annonces";
import type { StatusPublication } from "@/types";
import {
  MapPin,
  Weight,
  Truck,
  ArrowRight,
  ImageOff,
  Users,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  User,
} from "lucide-react";

type AdminAnnonce = {
  id_pb_transport: number;
  depart: string;
  destination: string;
  capacite_transport: number;
  status: StatusPublication;
  prix_par_kilo: number;
  prix_fragile_par_kilo: number;
  transport: {
    marque: string;
    immatriculation: string;
    type: string;
    images?: string;
    transporteur: {
      utilisateur: { nom: string; prenom: string; email: string };
    };
  };
  _count: { reservations: number };
};

function AnnonceCard({
  annonce,
  onStatusChange,
  isPending,
}: {
  annonce: AdminAnnonce;
  onStatusChange: (id: number, status: StatusPublication) => void;
  isPending: boolean;
}) {
  const image = annonce.transport?.images;

  return (
    <Card className="overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-40 bg-muted shrink-0">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={annonce.transport?.marque ?? "Transport"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-10 w-10 opacity-40" />
          </div>
        )}
        {/* Status badge + actions overlay */}
        <div className="absolute top-2 left-2">
          <StatusBadge status={annonce.status} />
        </div>
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7 opacity-90"
                disabled={isPending}
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {annonce.status !== "ACTIVE" && (
                <DropdownMenuItem
                  onClick={() =>
                    onStatusChange(annonce.id_pb_transport, "ACTIVE")
                  }
                >
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Activer
                </DropdownMenuItem>
              )}
              {annonce.status !== "PENDING" && (
                <DropdownMenuItem
                  onClick={() =>
                    onStatusChange(annonce.id_pb_transport, "PENDING")
                  }
                >
                  <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                  En attente
                </DropdownMenuItem>
              )}
              {annonce.status !== "INACTIVE" && (
                <DropdownMenuItem
                  onClick={() =>
                    onStatusChange(annonce.id_pb_transport, "INACTIVE")
                  }
                >
                  <XCircle className="mr-2 h-4 w-4 text-destructive" />
                  Désactiver
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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

        {/* Transporteur */}
        {annonce.transport?.transporteur?.utilisateur && (
          <div className="flex items-center gap-2 rounded-md border border-dashed px-3 py-2 text-sm">
            <User className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="font-medium">
              {annonce.transport.transporteur.utilisateur.prenom}{" "}
              {annonce.transport.transporteur.utilisateur.nom}
            </span>
            <span className="text-muted-foreground truncate">
              · {annonce.transport.transporteur.utilisateur.email}
            </span>
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
            <span>{annonce._count.reservations} rés.</span>
          </div>
        </div>
      </CardContent>
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
        <Skeleton className="h-10 w-full rounded-md" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-14 rounded-md" />
          <Skeleton className="h-14 rounded-md" />
        </div>
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}

export default function AdminAnnoncesPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();

  const { data, isLoading } = useAdminAnnonces({ page, status });
  const updateStatus = useUpdateAnnonceStatus();
  const totalPages = data?.meta.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Annonces"
        description="Toutes les annonces de transport publiées sur la plateforme."
      />

      {/* Filtre */}
      <div className="flex flex-wrap gap-3">
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
      </div>

      {/* Grille */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <AnnonceCardSkeleton key={i} />
          ))}
        </div>
      ) : data?.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Truck className="h-12 w-12 mb-3 opacity-30" />
          <p>Aucune annonce trouvée.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.data.map((annonce) => (
            <AnnonceCard
              key={annonce.id_pb_transport}
              annonce={annonce}
              onStatusChange={(id, s) => updateStatus.mutate({ id, status: s })}
              isPending={updateStatus.isPending}
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

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { useAdminTransports } from "@/hooks/use-admin-transports";
import {
  Truck,
  ImageOff,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Mail,
  Megaphone,
} from "lucide-react";

type AdminTransport = {
  id_transport: number;
  marque: string;
  immatriculation: string;
  type: string;
  images: string;
  description: string;
  transporteur: {
    utilisateur: { nom: string; prenom: string; email: string; phone: string };
  };
  _count: { pb_transports: number };
};

function TransportCard({ transport }: { transport: AdminTransport }) {
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
            <ImageOff className="h-10 w-10 opacity-40" />
          </div>
        )}
        {/* Immatriculation overlay */}
        <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs font-mono text-white">
          {transport.immatriculation}
        </span>
        {/* Annonces count overlay */}
        <Badge
          variant="secondary"
          className="absolute top-2 right-2 flex items-center gap-1"
        >
          <Megaphone className="h-3 w-3" />
          {transport._count.pb_transports} annonce
          {transport._count.pb_transports !== 1 ? "s" : ""}
        </Badge>
      </div>

      <CardContent className="flex-1 p-4 space-y-3">
        {/* Marque + type */}
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-primary shrink-0" />
          <span className="font-semibold">{transport.marque}</span>
          <span className="text-xs text-muted-foreground">
            · {transport.type}
          </span>
        </div>

        {/* Description */}
        {transport.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {transport.description}
          </p>
        )}

        {/* Transporteur */}
        <div className="rounded-md border border-dashed px-3 py-2 space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="font-medium">
              {transport.transporteur.utilisateur.prenom}{" "}
              {transport.transporteur.utilisateur.nom}
            </span>
          </div>
          {transport.transporteur.utilisateur.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {transport.transporteur.utilisateur.email}
              </span>
            </div>
          )}
          {transport.transporteur.utilisateur.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span>{transport.transporteur.utilisateur.phone}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function TransportCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col">
      <Skeleton className="h-44 w-full rounded-none" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <div className="rounded-md border border-dashed px-3 py-2 space-y-2">
          <Skeleton className="h-3.5 w-1/2" />
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3.5 w-1/3" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminTransportsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useAdminTransports({ page, search });
  const totalPages = data?.meta.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transports"
        description="Tous les véhicules enregistrés sur la plateforme."
      />

      {/* Recherche */}
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

      {/* Grille */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <TransportCardSkeleton key={i} />
          ))}
        </div>
      ) : data?.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Truck className="h-12 w-12 mb-3 opacity-30" />
          <p>Aucun transport trouvé.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data?.data.map((t) => (
            <TransportCard key={t.id_transport} transport={t} />
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

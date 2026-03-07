"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import { BookModal } from "./_components/book-modal";
import { usePublicPbTransports, usePbTransportById } from "@/hooks/use-pb-transports";
import { useCreateReservation } from "@/hooks/use-reservations";
import type { PbTransport } from "@/types";
import {
  MapPin,
  Weight,
  Truck,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  ArrowRight,
  User,
  Phone,
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
  onBook,
}: {
  annonce: PbTransport;
  onBook: () => void;
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
            {annonce.transport.marque} · {annonce.transport.type}
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
            {annonce.transport.transporteur.utilisateur.phone && (
              <>
                <span className="text-muted-foreground">·</span>
                <Phone className="h-3 w-3 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {annonce.transport.transporteur.utilisateur.phone}
                </span>
              </>
            )}
          </div>
        )}

        {/* Prix & capacité */}
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

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Weight className="h-3.5 w-3.5 shrink-0" />
          Capacité :{" "}
          <span className="font-medium text-foreground">
            {annonce.capacite_transport} kg
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0">
        <Button className="w-full" onClick={onBook}>
          Réserver
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
        <Skeleton className="h-4 w-2/5" />
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}

export default function ClientAnnoncesPage() {
  return (
    <Suspense fallback={<div className="space-y-6"><div className="h-10 w-64 bg-muted animate-pulse rounded" /></div>}>
      <ClientAnnoncesContent />
    </Suspense>
  );
}

function ClientAnnoncesContent() {
  const searchParams = useSearchParams();
  const bookIdParam = searchParams.get("book");
  const bookId = bookIdParam ? parseInt(bookIdParam, 10) : null;

  const [page, setPage] = useState(1);
  const [depart, setDepart] = useState("");
  const [destination, setDestination] = useState("");
  const [search, setSearch] = useState<{
    depart?: string;
    destination?: string;
  }>({});
  const [selected, setSelected] = useState<PbTransport | null>(null);
  const [autoOpened, setAutoOpened] = useState(false);

  const { data, isLoading } = usePublicPbTransports({ page, ...search });
  const { data: bookTarget } = usePbTransportById(autoOpened ? null : bookId);
  const create = useCreateReservation();
  const totalPages = data?.meta.totalPages ?? 1;

  // Auto-open modal when coming from landing page "Réserver" button
  useEffect(() => {
    if (autoOpened || !bookId) return;
    if (bookTarget) {
      setSelected(bookTarget);
      setAutoOpened(true);
      return;
    }
    // Fallback: search in current page data
    if (data) {
      const found = data.data.find((a) => a.id_pb_transport === bookId);
      if (found) {
        setSelected(found);
        setAutoOpened(true);
      }
    }
  }, [bookTarget, data, bookId, autoOpened]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Annonces disponibles"
        description="Recherchez un transport et réservez votre envoi."
      />

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-medium">
            Départ
          </span>
          <Select
            value={depart || ALL}
            onValueChange={(v) => setDepart(v === ALL ? "" : v)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Toutes les villes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Toutes les villes</SelectItem>
              {VILLES.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-medium">
            Destination
          </span>
          <Select
            value={destination || ALL}
            onValueChange={(v) => setDestination(v === ALL ? "" : v)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Toutes les villes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Toutes les villes</SelectItem>
              {VILLES.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => {
            setSearch({
              depart: depart || undefined,
              destination: destination || undefined,
            });
            setPage(1);
          }}
        >
          Rechercher
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setDepart("");
            setDestination("");
            setSearch({});
            setPage(1);
          }}
        >
          Réinitialiser
        </Button>
      </div>

      {/* Grille */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <AnnonceCardSkeleton key={i} />
          ))
        ) : data?.data.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <Truck className="h-12 w-12 opacity-30" />
            <p className="text-sm">
              Aucune annonce disponible pour ces critères.
            </p>
          </div>
        ) : (
          data?.data.map((a) => (
            <AnnonceCard
              key={a.id_pb_transport}
              annonce={a}
              onBook={() => setSelected(a)}
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
        <BookModal
          open={!!selected}
          onOpenChange={(o) => !o && setSelected(null)}
          annonce={selected}
          onSubmit={async (d) => {
            await create.mutateAsync({
              ...d,
              depart: selected.depart,
              destination: selected.destination,
            });
            setSelected(null);
          }}
          isLoading={create.isPending}
        />
      )}
    </div>
  );
}

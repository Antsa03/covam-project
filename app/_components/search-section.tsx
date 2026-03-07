"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  MapPin,
  Search,
  Truck,
  Scale,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  PackageSearch,
  Banknote,
  CalendarDays,
  Check,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchResult {
  id_pb_transport: number;
  depart: string;
  destination: string;
  capacite_transport: number;
  prix_par_kilo: number;
  prix_fragile_par_kilo: number;
  transport: {
    id_transport: number;
    marque: string;
    type: string;
    immatriculation: string;
    images: string;
    transporteur_id: number;
    transporteur?: {
      id_transporteur: number;
      utilisateur?: { nom: string; prenom: string; city: string };
    };
  };
}

interface SearchResponse {
  data: SearchResult[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

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

const LIMIT = 6;
const PREVIEW_LIMIT = 4;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the first image path from a potentially comma-separated list. */
function firstImage(images: string): string {
  return images.split(",")[0].trim();
}

/** Generates initials from first + last name. */
function initials(prenom: string, nom: string): string {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
}

/** Deterministic hue from a string for consistent avatar colours. */
function avatarHue(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0xffffff;
  return h % 360;
}

// ─── Ville Combobox ───────────────────────────────────────────────────────────

function VilleCombobox({
  value,
  onChange,
  placeholder = "Toutes les villes",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className="w-full flex items-center justify-between gap-2 text-sm bg-transparent outline-none cursor-pointer"
        >
          <span className={value ? "text-slate-800 font-medium" : "text-slate-400"}>
            {value || placeholder}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0 rounded-xl border border-slate-200 shadow-lg shadow-slate-200/60" align="start">
        <Command>
          <CommandInput placeholder="Rechercher…" className="h-9 text-sm" />
          <CommandList>
            <CommandEmpty className="text-xs text-slate-400 py-4 text-center">
              Aucun résultat
            </CommandEmpty>
            <CommandGroup>
              {/* “All cities” reset option */}
              <CommandItem
                value="__all__"
                onSelect={() => { onChange(""); setOpen(false); }}
                className="text-slate-400 text-sm"
              >
                <Check className={`mr-2 h-4 w-4 ${value === "" ? "opacity-100 text-blue-600" : "opacity-0"}`} />
                {placeholder}
              </CommandItem>
              {VILLES.map((v) => (
                <CommandItem
                  key={v}
                  value={v}
                  onSelect={(current) => {
                    onChange(current === value ? "" : current);
                    setOpen(false);
                  }}
                  className="text-sm"
                >
                  <Check className={`mr-2 h-4 w-4 ${value === v ? "opacity-100 text-blue-600" : "opacity-0"}`} />
                  {v}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ─── Result Card ──────────────────────────────────────────────────────────────

function AnnonceCard({ annonce }: { annonce: SearchResult }) {
  const user = annonce.transport?.transporteur?.utilisateur;
  const vehicleImage = firstImage(annonce.transport.images);
  const hue = user ? avatarHue(user.prenom + user.nom) : 220;
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="flex items-stretch gap-0">

        {/* ── Vehicle thumbnail ── */}
        <div className="relative w-24 shrink-0 bg-slate-100 flex items-center justify-center">
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={vehicleImage}
              alt={`${annonce.transport.marque} ${annonce.transport.type}`}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : null}
          {/* Fallback icon — always mounted, visible only when image absent */}
          <Truck className="h-8 w-8 text-slate-300" />
        </div>

        {/* ── Main content ── */}
        <div className="flex flex-1 flex-col sm:flex-row items-stretch divide-y sm:divide-y-0 sm:divide-x divide-slate-100">

          {/* Route + poster */}
          <div className="flex-1 flex flex-col justify-between px-6 py-5 gap-4">
            {/* Route */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-sm font-bold text-slate-800 leading-tight">
                  {annonce.depart}
                </span>
              </div>
              <div className="flex-1 h-px bg-slate-200 min-w-4" />
              <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="flex-1 h-px bg-slate-200 min-w-4" />
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
                <span className="text-sm font-bold text-blue-700 leading-tight">
                  {annonce.destination}
                </span>
              </div>
            </div>

            {/* Transporteur profile */}
            {user ? (
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 select-none"
                  style={{ background: `hsl(${hue} 55% 48%)` }}
                >
                  {initials(user.prenom, user.nom)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 leading-tight truncate">
                    {user.prenom} {user.nom}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Truck className="h-3 w-3 text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-400 truncate">
                      {annonce.transport.marque} · {annonce.transport.type}
                    </span>
                    {user.city && (
                      <>
                        <span className="text-slate-200">·</span>
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="text-xs text-slate-400 truncate">
                          {user.city}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Truck className="h-3.5 w-3.5 shrink-0" />
                <span>{annonce.transport.marque} · {annonce.transport.type}</span>
              </div>
            )}
          </div>

          {/* Stats + CTA */}
          <div className="flex sm:flex-col items-center sm:items-stretch justify-between sm:justify-center gap-0 sm:gap-0 px-6 py-5 sm:w-48 shrink-0">
            {/* Stats */}
            <div className="flex sm:flex-col gap-5 sm:gap-4">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-2">
                  <Scale className="h-3 w-3" /> Poids dispo
                </span>
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1 text-sm font-bold">
                  {annonce.capacite_transport} t
                </span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                  <Banknote className="h-3 w-3" /> Prix / kg
                </span>
                <p className="text-xl font-extrabold text-slate-900 leading-none">
                  {annonce.prix_par_kilo.toLocaleString()}
                  <span className="text-xs font-medium text-slate-400 ml-1">Ar</span>
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="hidden sm:block mt-6">
              <Button
                asChild
                size="sm"
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-none h-12 text-[11px] tracking-[0.2em] uppercase font-semibold shadow-none transition-all duration-300"
              >
                <Link href="/auth/login">Réserver</Link>
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile CTA */}
      <div className="sm:hidden px-6 pb-5">
        <Button
          asChild
          size="sm"
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-none h-12 text-[11px] tracking-[0.2em] uppercase font-semibold shadow-none transition-all duration-300"
        >
          <Link href="/auth/login">Réserver ce trajet</Link>
        </Button>
      </div>
    </div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="flex items-stretch">
        <div className="w-24 shrink-0 bg-slate-100" style={{ minHeight: 112 }} />
        <div className="flex flex-1 flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="flex-1 px-6 py-5 flex flex-col justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-4 w-24 bg-slate-100 rounded" />
              <div className="flex-1 h-px bg-slate-100" />
              <div className="h-4 w-24 bg-slate-100 rounded" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="h-3.5 w-32 bg-slate-100 rounded" />
                <div className="h-3 w-44 bg-slate-100 rounded" />
              </div>
            </div>
          </div>
          <div className="px-6 py-5 sm:w-48 shrink-0 flex sm:flex-col gap-5 sm:gap-4">
            <div className="h-10 w-16 bg-slate-100 rounded" />
            <div className="h-10 w-16 bg-slate-100 rounded" />
            <div className="hidden sm:block mt-auto h-9 w-full bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
// ─── Pagination Bar ────────────────────────────────────────────────────────────────────

function PaginationBar({
  page,
  totalPages,
  onPage,
  loading = false,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
  loading?: boolean;
}) {
  if (totalPages <= 1) return null;

  const items: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      items.push(i);
    } else if (i === page - 2 || i === page + 2) {
      items.push("…");
    }
  }
  const visible = items.filter(
    (item, i) => !(item === "…" && items[i - 1] === "…"),
  );

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      {/* Prev */}
      <button
        onClick={() => onPage(page - 1)}
        disabled={page <= 1 || loading}
        className="flex items-center gap-1.5 px-3 h-9 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium hover:border-slate-300 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Précédent</span>
      </button>

      {/* Pages */}
      <div className="flex items-center gap-1">
        {visible.map((item, i) =>
          item === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm select-none"
            >
              ···
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPage(item as number)}
              disabled={loading}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed ${
                item === page
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-105"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              {item}
            </button>
          ),
        )}
      </div>

      {/* Next */}
      <button
        onClick={() => onPage(page + 1)}
        disabled={page >= totalPages || loading}
        className="flex items-center gap-1.5 px-3 h-9 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium hover:border-slate-300 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
      >
        <span className="hidden sm:inline">Suivant</span>
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
// ─── Main Component ───────────────────────────────────────────────────────────

export function SearchSection() {
  const [depart, setDepart] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [preview, setPreview] = useState<SearchResult[]>([]);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [previewPage, setPreviewPage] = useState(1);
  const [previewTotal, setPreviewTotal] = useState(0);

  // Load preview trips — refetches whenever previewPage changes
  useEffect(() => {
    setPreviewLoading(true);
    (async () => {
      try {
        const res = await fetch(
          `/api/search?page=${previewPage}&limit=${PREVIEW_LIMIT}`,
        );
        if (!res.ok) return;
        const json: SearchResponse = await res.json();
        setPreview(json.data);
        setPreviewTotal(json.total);
      } catch {
        // silently ignore
      } finally {
        setPreviewLoading(false);
      }
    })();
  }, [previewPage]);

  const buildUrl = (p: number) => {
    const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) });
    if (depart) params.set("depart", depart);
    if (destination) params.set("destination", destination);
    if (date) params.set("date", date);
    return `/api/search?${params.toString()}`;
  };

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setSearched(true);
      setPage(1);
      try {
        const res = await fetch(buildUrl(1));
        if (!res.ok) throw new Error("Erreur du serveur");
        const json: SearchResponse = await res.json();
        setResults(json.data);
        setTotal(json.total);
      } catch {
        setResults([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [depart, destination, date],
  );

  const goToPage = async (p: number) => {
    if (p === page) return;
    setPage(p);
    setLoading(true);
    try {
      const res = await fetch(buildUrl(p));
      if (!res.ok) throw new Error("Erreur du serveur");
      const json: SearchResponse = await res.json();
      setResults(json.data);
      setTotal(json.total);
    } catch {
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Search bar ── */}
      <form
        onSubmit={handleSearch}
        className="w-full max-w-5xl bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row">
          {/* Départ */}
          <div className="flex-1 flex items-center gap-3 px-7 py-5 sm:border-r border-slate-100">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
                Départ
              </label>
              <VilleCombobox value={depart} onChange={setDepart} label="Départ" />
            </div>
          </div>

          {/* Destination */}
          <div className="flex-1 flex items-center gap-3 px-7 py-5 sm:border-r border-slate-100">
            <MapPin className="h-4 w-4 text-blue-400 shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
                Destination
              </label>
              <VilleCombobox value={destination} onChange={setDestination} label="Destination" />
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-3 px-7 py-5 sm:border-r border-slate-100 sm:w-52 shrink-0">
            <CalendarDays className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex flex-col w-full">
              <label
                htmlFor="search-date"
                className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5"
              >
                Date
              </label>
              <input
                id="search-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-sm text-slate-800 bg-transparent outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center px-3 py-3">
            <Button
              type="submit"
              disabled={loading}
              size="default"
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-5 rounded-xl disabled:opacity-70 gap-2 hover:shadow-[0_0_40px_-10px_rgba(33,71,170,0.6)] transition-all duration-300"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Rechercher</span>
            </Button>
          </div>
        </div>
      </form>

      {/* ── Preview — shown before any search ── */}
      {!searched && (
        <div className="w-full max-w-5xl mt-16">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              Trajets disponibles en ce moment
            </p>
            {!previewLoading && previewTotal > 0 && (
              <span className="text-xs text-slate-400">
                {previewTotal} trajet{previewTotal > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-4">
            {previewLoading
              ? [...Array(PREVIEW_LIMIT)].map((_, i) => <SkeletonCard key={i} />)
              : preview.length > 0
                ? preview.map((a) => (
                    <AnnonceCard key={a.id_pb_transport} annonce={a} />
                  ))
                : null}
          </div>
          <PaginationBar
            page={previewPage}
            totalPages={Math.ceil(previewTotal / PREVIEW_LIMIT)}
            onPage={setPreviewPage}
            loading={previewLoading}
          />
        </div>
      )}

      {/* ── Search Results ── */}
      {searched && (
        <section className="w-full max-w-5xl mt-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {loading
                  ? "Recherche en cours…"
                  : total === 0
                    ? "Aucun résultat trouvé"
                    : `${total} trajet${total > 1 ? "s" : ""} disponible${total > 1 ? "s" : ""}`}
              </h2>
              {!loading && (depart || destination) && (
                <p className="text-sm text-slate-500 mt-1">
                  {depart && destination
                    ? `${depart} → ${destination}`
                    : depart
                      ? `Depuis ${depart}`
                      : `Vers ${destination}`}
                </p>
              )}
            </div>
            {!loading && total > 0 && (
              <span className="text-xs text-slate-400">
                {results.length} / {total}
              </span>
            )}
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="flex flex-col gap-4">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && total === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <PackageSearch className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium mb-2">
                Aucun trajet trouvé pour cette sélection.
              </p>
              <p className="text-slate-400 text-sm">
                Essayez d&apos;autres villes ou laissez les champs vides pour tout afficher.
              </p>
            </div>
          )}

          {/* Cards */}
          {!loading && results.length > 0 && (
            <div className="flex flex-col gap-4">
              {results.map((a) => (
                <AnnonceCard key={a.id_pb_transport} annonce={a} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > 0 && (
            <PaginationBar
              page={page}
              totalPages={Math.ceil(total / LIMIT)}
              onPage={goToPage}
              loading={loading}
            />
          )}
        </section>
      )}
    </>
  );
}

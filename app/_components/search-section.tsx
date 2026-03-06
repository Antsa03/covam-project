"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Search,
  Truck,
  Weight,
  ArrowRight,
  ChevronDown,
  Loader2,
  PackageSearch,
  Banknote,
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
    marque: string;
    type: string;
    immatriculation: string;
    images?: string;
    transporteur?: {
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

// ─── Result Card ──────────────────────────────────────────────────────────────

function AnnonceCard({ annonce }: { annonce: SearchResult }) {
  const transporteur = annonce.transport?.transporteur?.utilisateur;

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all duration-200 flex flex-col sm:flex-row sm:items-center">
      {/* Route + vehicle */}
      <div className="flex-1 flex flex-col gap-1 px-5 py-4 sm:border-r border-slate-100">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="text-sm font-semibold text-slate-800">
              {annonce.depart}
            </span>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span className="text-sm font-semibold text-blue-700">
              {annonce.destination}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Truck className="h-3 w-3 shrink-0" />
          <span>
            {annonce.transport.marque} · {annonce.transport.type}
          </span>
          {transporteur && (
            <>
              <span className="text-slate-200">·</span>
              <span>
                {transporteur.prenom} {transporteur.nom}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-5 px-5 py-3 sm:py-4 sm:border-r border-slate-100 shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
            <Weight className="h-3 w-3" /> Poids dispo
          </span>
          <span className="text-sm font-bold text-slate-800">
            {annonce.capacite_transport}{" "}
            <span className="text-xs font-normal text-slate-500">t</span>
          </span>
        </div>
        <div className="w-px h-7 bg-slate-100" />
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
            <Banknote className="h-3 w-3" /> Prix / kg
          </span>
          <span className="text-sm font-bold text-slate-800">
            {annonce.prix_par_kilo.toLocaleString()}{" "}
            <span className="text-xs font-normal text-slate-500">Ar</span>
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4 sm:py-4 shrink-0">
        <Button
          asChild
          size="sm"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 text-xs font-semibold"
        >
          <Link href="/auth/register">Réserver</Link>
        </Button>
      </div>
    </div>
  );
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center animate-pulse">
      <div className="flex-1 px-5 py-4 sm:border-r border-slate-100 space-y-2">
        <div className="h-4 w-44 bg-slate-100 rounded" />
        <div className="h-3 w-28 bg-slate-100 rounded" />
      </div>
      <div className="flex items-center gap-5 px-5 py-3 sm:py-4 sm:border-r border-slate-100">
        <div className="h-9 w-16 bg-slate-100 rounded" />
        <div className="h-9 w-16 bg-slate-100 rounded" />
      </div>
      <div className="px-4 pb-4 sm:py-4">
        <div className="h-8 w-20 bg-slate-100 rounded-lg" />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SearchSection() {
  const [depart, setDepart] = useState("");
  const [destination, setDestination] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searched, setSearched] = useState(false);
  const [preview, setPreview] = useState<SearchResult[]>([]);
  const [previewLoading, setPreviewLoading] = useState(true);

  // Auto-load a preview of live trips on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/search?page=1&limit=${PREVIEW_LIMIT}`);
        if (!res.ok) return;
        const json: SearchResponse = await res.json();
        setPreview(json.data);
      } catch {
        // silently ignore
      } finally {
        setPreviewLoading(false);
      }
    })();
  }, []);

  const buildUrl = (p: number) => {
    const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) });
    if (depart) params.set("depart", depart);
    if (destination) params.set("destination", destination);
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
        setHasMore(json.hasMore);
        setPage(1);
      } catch {
        setResults([]);
        setTotal(0);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [depart, destination],
  );

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const res = await fetch(buildUrl(nextPage));
      if (!res.ok) throw new Error("Erreur du serveur");
      const json: SearchResponse = await res.json();
      setResults((prev) => [...prev, ...json.data]);
      setHasMore(json.hasMore);
      setPage(nextPage);
    } catch {
      // silently ignore
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <>
      {/* ── Search bar ── */}
      <form
        onSubmit={handleSearch}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row">
          {/* Départ */}
          <div className="flex-1 flex items-center gap-3 px-5 py-4 sm:border-r border-slate-100">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
                Départ
              </label>
              <div className="relative">
                <select
                  value={depart}
                  onChange={(e) => setDepart(e.target.value)}
                  className="w-full text-sm text-slate-800 bg-transparent outline-none appearance-none pr-5 cursor-pointer"
                >
                  <option value="">Toutes les villes</option>
                  {VILLES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Destination */}
          <div className="flex-1 flex items-center gap-3 px-5 py-4 sm:border-r border-slate-100">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
                Destination
              </label>
              <div className="relative">
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full text-sm text-slate-800 bg-transparent outline-none appearance-none pr-5 cursor-pointer"
                >
                  <option value="">Toutes les villes</option>
                  {VILLES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center p-2 sm:p-3">
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-5 rounded-xl disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">Rechercher</span>
            </Button>
          </div>
        </div>
      </form>

      {/* ── Preview — shown before any search ── */}
      {!searched && (
        <div className="w-full max-w-3xl mt-6">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Trajets disponibles en ce moment
          </p>
          <div className="flex flex-col gap-3">
            {previewLoading
              ? [...Array(PREVIEW_LIMIT)].map((_, i) => <SkeletonRow key={i} />)
              : preview.length > 0
                ? preview.map((a) => (
                    <AnnonceCard key={a.id_pb_transport} annonce={a} />
                  ))
                : null}
          </div>
        </div>
      )}

      {/* ── Search Results ── */}
      {searched && (
        <section className="w-full max-w-3xl mt-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {loading
                  ? "Recherche en cours…"
                  : total === 0
                    ? "Aucun résultat trouvé"
                    : `${total} trajet${total > 1 ? "s" : ""} disponible${total > 1 ? "s" : ""}`}
              </h2>
              {!loading && (depart || destination) && (
                <p className="text-sm text-slate-500 mt-0.5">
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
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && total === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                <PackageSearch className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium text-sm mb-1">
                Aucun trajet trouvé pour cette sélection.
              </p>
              <p className="text-slate-400 text-xs">
                Essayez d&apos;autres villes ou laissez les champs vides pour tout afficher.
              </p>
            </div>
          )}

          {/* Cards */}
          {!loading && results.length > 0 && (
            <div className="flex flex-col gap-3">
              {results.map((a) => (
                <AnnonceCard key={a.id_pb_transport} annonce={a} />
              ))}
            </div>
          )}

          {/* Load more */}
          {!loading && hasMore && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={loadingMore}
                onClick={handleLoadMore}
                className="border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg px-6 text-xs font-medium"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                    Chargement…
                  </>
                ) : (
                  <>
                    Voir plus
                    <ChevronDown className="ml-2 h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </div>
          )}
        </section>
      )}
    </>
  );
}

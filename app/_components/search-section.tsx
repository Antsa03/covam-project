"use client";

import { useState, useCallback } from "react";
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

// ─── Result Card ──────────────────────────────────────────────────────────────

function AnnonceCard({ annonce }: { annonce: SearchResult }) {
  const transporteur = annonce.transport?.transporteur?.utilisateur;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Header gradient */}
      <div className="h-2 bg-linear-to-r from-blue-500 to-indigo-600" />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Route */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5">
            <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span className="text-sm font-semibold text-blue-700">
              {annonce.depart}
            </span>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-300 shrink-0" />
          <div className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5">
            <MapPin className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span className="text-sm font-semibold text-indigo-700">
              {annonce.destination}
            </span>
          </div>
        </div>

        {/* Vehicle info */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Truck className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="font-medium">{annonce.transport.marque}</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-500">{annonce.transport.type}</span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Weight className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Capacité
              </span>
            </div>
            <p className="text-lg font-extrabold text-slate-800">
              {annonce.capacite_transport}
              <span className="text-sm font-medium text-slate-500 ml-1">t</span>
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Prix / kg
              </span>
            </div>
            <p className="text-lg font-extrabold text-slate-800">
              {annonce.prix_par_kilo.toLocaleString()}
              <span className="text-xs font-medium text-slate-500 ml-1">Ar</span>
            </p>
          </div>
        </div>

        {/* Transporteur */}
        {transporteur && (
          <p className="text-xs text-slate-500 truncate">
            Par{" "}
            <span className="font-semibold text-slate-700">
              {transporteur.prenom} {transporteur.nom}
            </span>
            {transporteur.city && (
              <> · {transporteur.city}</>
            )}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 pb-5">
        <Button
          asChild
          size="sm"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl"
        >
          <Link href="/auth/register">
            Réserver maintenant <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </Button>
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

      {/* ── Search Results ── */}
      {searched && (
        <section className="w-full max-w-6xl mt-14 px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
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
              <span className="text-sm text-slate-400">
                {results.length} / {total}
              </span>
            )}
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3 animate-pulse"
                >
                  <div className="h-2 w-full bg-slate-100 rounded-full" />
                  <div className="flex gap-2">
                    <div className="h-8 w-28 bg-slate-100 rounded-full" />
                    <div className="h-8 w-28 bg-slate-100 rounded-full" />
                  </div>
                  <div className="h-4 w-40 bg-slate-100 rounded" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-16 bg-slate-100 rounded-xl" />
                    <div className="h-16 bg-slate-100 rounded-xl" />
                  </div>
                  <div className="h-9 bg-slate-100 rounded-xl" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && total === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <PackageSearch className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium mb-1">
                Aucun trajet trouvé pour cette sélection.
              </p>
              <p className="text-slate-400 text-sm">
                Essayez d&apos;autres villes ou laissez les champs vides pour tout afficher.
              </p>
            </div>
          )}

          {/* Cards */}
          {!loading && results.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((a) => (
                <AnnonceCard key={a.id_pb_transport} annonce={a} />
              ))}
            </div>
          )}

          {/* Load more */}
          {!loading && hasMore && (
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                size="lg"
                disabled={loadingMore}
                onClick={handleLoadMore}
                className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 rounded-xl px-8 font-semibold"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Chargement…
                  </>
                ) : (
                  <>
                    Voir plus de trajets
                    <ChevronDown className="ml-2 h-4 w-4" />
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

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminStats } from "@/hooks/use-admin-stats";
import {
  Users,
  Truck,
  Megaphone,
  CalendarCheck,
  CreditCard,
  Package,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react";

type StatColor =
  | "blue"
  | "indigo"
  | "cyan"
  | "emerald"
  | "amber"
  | "rose"
  | "violet";

const colorMap: Record<StatColor, { bg: string; icon: string; ring: string }> =
  {
    blue: {
      bg: "bg-primary/10",
      icon: "text-primary",
      ring: "ring-primary/20",
    },
    indigo: {
      bg: "bg-primary/10",
      icon: "text-primary",
      ring: "ring-primary/20",
    },
    cyan: {
      bg: "bg-primary/10",
      icon: "text-primary",
      ring: "ring-primary/20",
    },
    emerald: {
      bg: "bg-emerald-50",
      icon: "text-emerald-600",
      ring: "ring-emerald-100",
    },
    amber: {
      bg: "bg-amber-50",
      icon: "text-amber-600",
      ring: "ring-amber-100",
    },
    rose: { bg: "bg-rose-50", icon: "text-rose-600", ring: "ring-rose-100" },
    violet: {
      bg: "bg-violet-50",
      icon: "text-violet-600",
      ring: "ring-violet-100",
    },
  };

function StatCard({
  icon,
  title,
  value,
  sub,
  isLoading,
  color = "blue",
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number | undefined;
  sub?: string;
  isLoading: boolean;
  color?: StatColor;
}) {
  const c = colorMap[color];
  return (
    <Card className="relative overflow-hidden border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              {title}
            </p>
            {isLoading ? (
              <Skeleton className="h-8 w-24 rounded-lg" />
            ) : (
              <p className="text-3xl font-bold text-slate-900 leading-none">
                {value ?? 0}
              </p>
            )}
            {sub && !isLoading && (
              <p className="text-xs text-slate-400 mt-1.5">{sub}</p>
            )}
          </div>
          <div
            className={`w-10 h-10 rounded-xl ${c.bg} ring-1 ${c.ring} flex items-center justify-center shrink-0 ml-3`}
          >
            <span className={c.icon}>{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3 pb-5 border-b border-slate-100">
        <div className="mt-0.5 h-8 w-1 rounded-full bg-primary shrink-0" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Tableau de bord
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Vue d&apos;ensemble de la plateforme Covam.
          </p>
        </div>
      </div>

      {/* Row 1 — Utilisateurs & Transports */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Utilisateurs & Réseau
        </p>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Users className="h-4 w-4" />}
            title="Clients"
            value={stats?.totalClients}
            isLoading={isLoading}
            color="blue"
          />
          <StatCard
            icon={<Users className="h-4 w-4" />}
            title="Transporteurs"
            value={stats?.totalTransporteurs}
            isLoading={isLoading}
            color="indigo"
          />
          <StatCard
            icon={<Truck className="h-4 w-4" />}
            title="Transports"
            value={stats?.totalTransports}
            isLoading={isLoading}
            color="cyan"
          />
          <StatCard
            icon={<Megaphone className="h-4 w-4" />}
            title="Annonces actives"
            value={stats?.annonceActives}
            sub={`sur ${stats?.totalAnnonces ?? 0} au total`}
            isLoading={isLoading}
            color="emerald"
          />
        </div>
      </div>

      {/* Row 2 — Activité & Revenus */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Activité & Revenus
        </p>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<CalendarCheck className="h-4 w-4" />}
            title="Réservations"
            value={stats?.totalReservations}
            isLoading={isLoading}
            color="amber"
          />
          <StatCard
            icon={<Clock className="h-4 w-4" />}
            title="En attente"
            value={stats?.pendingReservations}
            sub="réservations à traiter"
            isLoading={isLoading}
            color="rose"
          />
          <StatCard
            icon={<Package className="h-4 w-4" />}
            title="Marchandises"
            value={stats?.totalMarchandises}
            isLoading={isLoading}
            color="violet"
          />
          <StatCard
            icon={<TrendingUp className="h-4 w-4" />}
            title="Revenu total"
            value={
              stats
                ? `${stats.revenuTotal.toLocaleString("fr-FR")} Ar`
                : undefined
            }
            sub={`${stats?.pendingPaiements ?? 0} paiement(s) en attente`}
            isLoading={isLoading}
            color="emerald"
          />
        </div>
      </div>

      {/* Paiements summary */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center">
              <CreditCard className="h-3.5 w-3.5 text-primary" />
            </div>
            Résumé des paiements
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="flex gap-6">
              <Skeleton className="h-14 w-28 rounded-lg" />
              <Skeleton className="h-14 w-28 rounded-lg" />
              <Skeleton className="h-14 w-28 rounded-lg" />
            </div>
          ) : (
            <div className="flex flex-wrap gap-8">
              <div className="flex flex-col gap-0.5">
                <p className="text-xs text-slate-500 font-medium">Total</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats?.totalPaiements ?? 0}
                </p>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-xs text-slate-500 font-medium">En attente</p>
                <p className="text-2xl font-bold text-amber-600">
                  {stats?.pendingPaiements ?? 0}
                </p>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-xs text-slate-500 font-medium">
                  Revenu encaissé
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold text-emerald-600">
                    {stats?.revenuTotal.toLocaleString("fr-FR") ?? 0} Ar
                  </p>
                  <ArrowUpRight className="h-4 w-4 text-emerald-500 mb-0.5" />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { useClientReservations } from "@/hooks/use-reservations";
import { usePayements } from "@/hooks/use-payements";
import { useClientCargoReservations } from "@/hooks/use-cargo-reservations";
import { CalendarCheck, CreditCard, BoxIcon, MapPin } from "lucide-react";

type StatColor = "blue" | "amber" | "emerald";
const colorMap: Record<StatColor, { bg: string; icon: string; ring: string }> =
  {
    blue: { bg: "bg-blue-50", icon: "text-blue-600", ring: "ring-blue-100" },
    amber: {
      bg: "bg-amber-50",
      icon: "text-amber-600",
      ring: "ring-amber-100",
    },
    emerald: {
      bg: "bg-emerald-50",
      icon: "text-emerald-600",
      ring: "ring-emerald-100",
    },
  };

function StatCard({
  icon,
  title,
  value,
  isLoading,
  color = "blue",
}: {
  icon: React.ReactNode;
  title: string;
  value: number | undefined;
  isLoading: boolean;
  color?: StatColor;
}) {
  const c = colorMap[color];
  return (
    <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              {title}
            </p>
            {isLoading ? (
              <Skeleton className="h-8 w-16 rounded-lg" />
            ) : (
              <p className="text-3xl font-bold text-slate-900">{value ?? 0}</p>
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

export default function ClientDashboard() {
  const { data: reservations, isLoading: l1 } = useClientReservations();
  const { data: payements, isLoading: l2 } = usePayements();
  const { data: cargo, isLoading: l3 } = useClientCargoReservations();

  const pending =
    payements?.data.filter((p) => p.status === "PENDING").length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3 pb-5 border-b border-slate-100">
        <div className="mt-0.5 h-8 w-1 rounded-full bg-blue-600 shrink-0" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Mon espace
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Suivez vos expéditions et paiements.
          </p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <StatCard
          icon={<CalendarCheck className="h-4 w-4" />}
          title="Mes réservations"
          value={reservations?.meta.total}
          isLoading={l1}
          color="blue"
        />
        <StatCard
          icon={<CreditCard className="h-4 w-4" />}
          title="Paiements en attente"
          value={pending}
          isLoading={l2}
          color="amber"
        />
        <StatCard
          icon={<BoxIcon className="h-4 w-4" />}
          title="Cargo réservations"
          value={cargo?.meta.total}
          isLoading={l3}
          color="emerald"
        />
      </div>

      {!l1 && reservations?.data && reservations.data.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Dernières réservations
          </h2>
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            {reservations.data.slice(0, 5).map((r, i, arr) => (
              <div
                key={r.id_reservation}
                className={`flex items-center justify-between px-4 py-3.5 hover:bg-blue-50/40 transition-colors ${
                  i < arr.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <MapPin className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {r.label}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {r.depart} → {r.destination}
                    </p>
                  </div>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

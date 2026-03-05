import type {
  StatusPublication,
  StatusReservation,
  StatusPayement,
} from "@/types";

type Status = StatusPublication | StatusReservation | StatusPayement;

const CONFIG: Record<
  Status,
  { label: string; dot: string; bg: string; text: string }
> = {
  ACTIVE: {
    label: "Actif",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  INACTIVE: {
    label: "Inactif",
    dot: "bg-zinc-400",
    bg: "bg-zinc-100",
    text: "text-zinc-600",
  },
  PENDING: {
    label: "En attente",
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  CONFIRMED: {
    label: "Confirmé",
    dot: "bg-primary",
    bg: "bg-primary/10",
    text: "text-primary",
  },
  CANCELLED: {
    label: "Annulé",
    dot: "bg-red-500",
    bg: "bg-red-50",
    text: "text-red-700",
  },
  COMPLETED: {
    label: "Terminé",
    dot: "bg-violet-500",
    bg: "bg-violet-50",
    text: "text-violet-700",
  },
  PAID: {
    label: "Payé",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  FAILED: {
    label: "Échoué",
    dot: "bg-red-500",
    bg: "bg-red-50",
    text: "text-red-700",
  },
  REFUNDED: {
    label: "Remboursé",
    dot: "bg-sky-500",
    bg: "bg-sky-50",
    text: "text-sky-700",
  },
};

export function StatusBadge({ status }: { status: Status }) {
  const cfg = CONFIG[status] ?? {
    label: status,
    dot: "bg-zinc-400",
    bg: "bg-zinc-100",
    text: "text-zinc-600",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

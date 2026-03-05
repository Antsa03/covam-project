"use client";

import { AppModal } from "@/components/shared/app-modal";
import { StatusBadge } from "@/components/shared/status-badge";
import { Separator } from "@/components/ui/separator";
import type { TransportReservation } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}

interface ReservationDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: TransportReservation;
}

export function ReservationDetailModal({
  open,
  onOpenChange,
  reservation,
}: ReservationDetailModalProps) {
  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title="Détail de la réservation"
      description={`Réservation ${reservation.label}`}
    >
      <div className="divide-y">
        <Row label="Référence" value={reservation.label} />
        <Row
          label="Statut"
          value={<StatusBadge status={reservation.status} />}
        />
        <Row
          label="Trajet"
          value={`${reservation.depart} → ${reservation.destination}`}
        />
        <Row
          label="Date départ"
          value={format(new Date(reservation.date_depart), "PPP", {
            locale: fr,
          })}
        />
        <Row label="Catégorie" value={reservation.category} />
        <Row label="Poids" value={`${reservation.poids} kg`} />
        <Row label="Dimension" value={`${reservation.dimension} m³`} />
        <Row label="Fragile" value={reservation.fragile ? "Oui" : "Non"} />
      </div>

      {reservation.cargo_reservation && (
        <>
          <Separator className="my-4" />
          <h3 className="text-sm font-semibold mb-2">Cargo associé</h3>
          <div className="divide-y">
            <Row
              label="ID cargo"
              value={`#${reservation.cargo_reservation.id_cargo_reservation}`}
            />
            <Row
              label="Prix"
              value={`${reservation.cargo_reservation.prix.toLocaleString()} Ar`}
            />
            <Row
              label="Statut cargo"
              value={
                <StatusBadge status={reservation.cargo_reservation.status} />
              }
            />
          </div>
        </>
      )}
    </AppModal>
  );
}

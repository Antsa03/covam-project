"use client";

import { AppModal } from "@/components/shared/app-modal";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUpdateTransporteurReservation } from "@/hooks/use-reservations";
import type { TransportReservation } from "@/types";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

function ItemRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="text-sm text-muted-foreground shrink-0 min-w-25">
        {label}
      </span>
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
  const update = useUpdateTransporteurReservation();

  const actions: {
    status: string;
    label: string;
    variant: "default" | "destructive" | "secondary";
  }[] = [
    { status: "CONFIRMED", label: "Confirmer", variant: "default" },
    { status: "COMPLETED", label: "Terminer", variant: "secondary" },
    { status: "CANCELLED", label: "Annuler", variant: "destructive" },
  ];

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title="Détail de la réservation"
      description={`Réservation #${reservation.id_reservation}`}
    >
      <div className="divide-y">
        <ItemRow label="Référence" value={reservation.label} />
        <ItemRow
          label="Statut"
          value={<StatusBadge status={reservation.status} />}
        />
        <ItemRow
          label="Trajet"
          value={`${reservation.depart} → ${reservation.destination}`}
        />
        <ItemRow
          label="Date départ"
          value={format(new Date(reservation.date_depart), "PPP", {
            locale: fr,
          })}
        />
        <ItemRow label="Catégorie" value={reservation.category} />
        <ItemRow label="Poids" value={`${reservation.poids} kg`} />
        <ItemRow label="Dimension" value={`${reservation.dimension} m`} />
        <ItemRow label="Fragile" value={reservation.fragile ? "Oui" : "Non"} />
        <ItemRow
          label="Récepteur"
          value={`${reservation.nom_recepteur} — ${reservation.tel_recepteur}`}
        />
      </div>

      {reservation.status !== "COMPLETED" &&
        reservation.status !== "CANCELLED" && (
          <>
            <Separator className="my-4" />
            <div className="flex flex-wrap gap-2 justify-end">
              {actions
                .filter((a) => a.status !== reservation.status)
                .map((action) => (
                  <Button
                    key={action.status}
                    variant={action.variant}
                    size="sm"
                    disabled={update.isPending}
                    className={
                      action.variant === "default"
                        ? "bg-primary hover:bg-primary/90"
                        : undefined
                    }
                    onClick={() =>
                      update.mutate(
                        {
                          id: reservation.id_reservation,
                          status: action.status,
                        },
                        { onSuccess: () => onOpenChange(false) },
                      )
                    }
                  >
                    {update.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {action.label}
                  </Button>
                ))}
            </div>
          </>
        )}
    </AppModal>
  );
}

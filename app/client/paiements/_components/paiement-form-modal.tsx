"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AppModal } from "@/components/shared/app-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { TransportReservation } from "@/types";

const schema = z.object({
  reservation_id: z.coerce.number().min(1, "Requis"),
  prix: z.coerce.number().positive("Doit être positif"),
  num_telephone: z.string().min(8, "Numéro invalide"),
});

type FormData = z.infer<typeof schema>;

interface PaiementFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservations: TransportReservation[];
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading: boolean;
}

export function PaiementFormModal({
  open,
  onOpenChange,
  reservations,
  onSubmit,
  isLoading,
}: PaiementFormModalProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { reservation_id: 0, prix: 0, num_telephone: "" },
  });

  async function handleSubmit(values: FormData) {
    await onSubmit(values);
    onOpenChange(false);
    form.reset();
  }

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title="Effectuer un paiement"
      size="sm"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="reservation_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Réservation <span className="text-red-500 ml-0.5">*</span>
                </FormLabel>
                <FormControl>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    <option value={0}>Choisissez une réservation</option>
                    {reservations
                      .filter((r) => r.status === "CONFIRMED")
                      .map((r) => (
                        <option key={r.id_reservation} value={r.id_reservation}>
                          #{r.id_reservation} — {r.label}
                        </option>
                      ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Montant (Ar) <span className="text-red-500 ml-0.5">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    className="h-10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="num_telephone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  N° téléphone paiement{" "}
                  <span className="text-red-500 ml-0.5">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="h-10"
                    placeholder="+261 34 XX XXX XX"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 mt-2 border-t">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Payer
            </Button>
          </div>
        </form>
      </Form>
    </AppModal>
  );
}

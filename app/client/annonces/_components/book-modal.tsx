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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import type { PbTransport } from "@/types";

const schema = z.object({
  pb_transport_id: z.coerce.number().min(1, "Requis"),
  label: z.string().min(1, "Requis"),
  date_depart: z.string().min(1, "Requis"),
  category: z.string().min(1, "Requis"),
  poids: z.coerce.number().positive("Doit être positif"),
  dimension: z.coerce.number().positive("Doit être positif"),
  fragile: z.boolean(),
  nom_recepteur: z.string().min(1, "Requis"),
  tel_recepteur: z.string().min(8, "Numéro invalide"),
});

type FormData = z.infer<typeof schema>;

interface BookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  annonce: PbTransport;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading: boolean;
}

export function BookModal({
  open,
  onOpenChange,
  annonce,
  onSubmit,
  isLoading,
}: BookModalProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      pb_transport_id: annonce.id_pb_transport,
      label: "",
      date_depart: "",
      category: "",
      poids: 0,
      dimension: 0,
      fragile: false,
      nom_recepteur: "",
      tel_recepteur: "",
    },
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
      title="Réserver ce transport"
      description={`${annonce.depart} → ${annonce.destination} • ${annonce.prix_par_kilo} Ar/kg`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Référence (nom colis)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Télévision 55 pouces" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date_depart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date départ</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Catégorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="STANDARD">Standard</SelectItem>
                      <SelectItem value="FRAGILE">Fragile</SelectItem>
                      <SelectItem value="PERISHABLE">Périssable</SelectItem>
                      <SelectItem value="HAZARDOUS">Dangereux</SelectItem>
                      <SelectItem value="OVERSIZED">Hors gabarit</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="poids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poids (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dimension"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dimension (m³)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="fragile"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="cursor-pointer">
                  Marchandise fragile
                </FormLabel>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nom_recepteur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du récepteur</FormLabel>
                  <FormControl>
                    <Input placeholder="Mohamed Diallo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tel_recepteur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tél. récepteur</FormLabel>
                  <FormControl>
                    <Input placeholder="+221 77 xxx xx xx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmer la réservation
            </Button>
          </div>
        </form>
      </Form>
    </AppModal>
  );
}

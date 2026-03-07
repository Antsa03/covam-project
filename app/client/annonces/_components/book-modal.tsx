"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMemo, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Weight,
  Banknote,
  MapPin,
  ArrowRight,
  CalendarDays,
  AlertTriangle,
} from "lucide-react";
import type { PbTransport } from "@/types";

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
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const maxPoids = annonce.capacite_transport;

  const schema = useMemo(
    () =>
      z.object({
        pb_transport_id: z.coerce.number().min(1),
        label: z.string().min(1, "Requis"),
        date_depart: z
          .string()
          .min(1, "Requis")
          .refine((d) => d >= today, "La date ne peut pas être dans le passé"),
        category: z.string().min(1, "Requis"),
        poids: z.coerce
          .number({ invalid_type_error: "Requis" })
          .positive("Doit être > 0")
          .max(maxPoids, `Maximum ${maxPoids} kg disponible`),
        dimension: z.coerce
          .number({ invalid_type_error: "Requis" })
          .positive("Doit être > 0"),
        fragile: z.boolean(),
        nom_recepteur: z.string().min(1, "Requis"),
        tel_recepteur: z.string().min(8, "Numéro invalide"),
      }),
    [today, maxPoids],
  );

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      pb_transport_id: annonce.id_pb_transport,
      label: "",
      date_depart: today,
      category: "",
      poids: "" as unknown as number,
      dimension: "" as unknown as number,
      fragile: false,
      nom_recepteur: "",
      tel_recepteur: "",
    },
  });

  // Reset form whenever the modal opens (or opens for a different annonce)
  useEffect(() => {
    if (open) {
      form.reset({
        pb_transport_id: annonce.id_pb_transport,
        label: "",
        date_depart: today,
        category: "",
        poids: "" as unknown as number,
        dimension: "" as unknown as number,
        fragile: false,
        nom_recepteur: "",
        tel_recepteur: "",
      });
    }
  }, [open, annonce.id_pb_transport]); // eslint-disable-line react-hooks/exhaustive-deps

  const watchedPoids = useWatch({ control: form.control, name: "poids" });
  const watchedFragile = useWatch({ control: form.control, name: "fragile" });

  const prixParKilo = watchedFragile
    ? annonce.prix_fragile_par_kilo
    : annonce.prix_par_kilo;
  const poidsNum = Number(watchedPoids) || 0;
  const totalEstime = poidsNum * prixParKilo;
  const poidsDepasse = poidsNum > maxPoids;

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
      size="lg"
    >
      {/* Route + capacity banner */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-2.5 rounded-lg bg-muted/60 text-sm mb-1">
        <div className="flex items-center gap-1.5 font-semibold">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          {annonce.depart}
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          {annonce.destination}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="secondary" className="text-xs font-medium gap-1">
            <Weight className="h-3 w-3" />
            {maxPoids} kg dispo
          </Badge>
          <Badge variant="secondary" className="text-xs font-medium gap-1">
            <Banknote className="h-3 w-3" />
            {annonce.prix_par_kilo.toLocaleString()} Ar/kg
          </Badge>
          {annonce.prix_fragile_par_kilo !== annonce.prix_par_kilo && (
            <Badge variant="outline" className="text-xs font-medium gap-1 text-amber-600 border-amber-200 bg-amber-50">
              <AlertTriangle className="h-3 w-3" />
              Fragile : {annonce.prix_fragile_par_kilo.toLocaleString()} Ar/kg
            </Badge>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-1">
          {/* Label */}
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Référence (nom du colis){" "}
                  <span className="text-red-500 ml-0.5">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="h-10"
                    placeholder="Ex : Télévision 55 pouces"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date départ — pre-filled with today, min = today */}
            <FormField
              control={form.control}
              name="date_depart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                    Date de départ{" "}
                    <span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="h-10"
                      min={today}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Catégorie — syncs with fragile */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Catégorie{" "}
                    <span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Sync fragile checkbox with FRAGILE category
                      form.setValue("fragile", value === "FRAGILE", { shouldValidate: false });
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une catégorie" />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Poids — max = capacite_transport */}
            <FormField
              control={form.control}
              name="poids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Weight className="h-3.5 w-3.5 text-muted-foreground" />
                    Poids (kg){" "}
                    <span className="text-red-500 ml-0.5">*</span>
                    <span className="ml-auto text-xs font-normal text-muted-foreground">
                      max {maxPoids} kg
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max={maxPoids}
                      className={`h-10 ${poidsDepasse ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                      placeholder={`0.1 – ${maxPoids} kg`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dimension */}
            <FormField
              control={form.control}
              name="dimension"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Dimension (m³){" "}
                    <span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      className="h-10"
                      placeholder="Ex : 0.50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Fragile — syncs with category */}
          <FormField
            control={form.control}
            name="fragile"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2.5 space-y-0 rounded-md border px-3 py-2.5 bg-muted/30">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      // Sync category when toggling fragile
                      const currentCategory = form.getValues("category");
                      if (checked) {
                        form.setValue("category", "FRAGILE", { shouldValidate: false });
                      } else if (currentCategory === "FRAGILE") {
                        form.setValue("category", "", { shouldValidate: false });
                      }
                    }}
                  />
                </FormControl>
                <div className="leading-none">
                  <FormLabel className="cursor-pointer font-medium">
                    Marchandise fragile
                  </FormLabel>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Applique le tarif fragile : {annonce.prix_fragile_par_kilo.toLocaleString()} Ar/kg
                  </p>
                </div>
              </FormItem>
            )}
          />

          {/* Live price summary */}
          <div className="rounded-lg border bg-muted/20 px-4 py-3 space-y-2 text-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Banknote className="h-3.5 w-3.5" />
                Tarif appliqué{watchedFragile ? " (fragile)" : ""}
              </span>
              <span className="font-semibold text-foreground">
                {prixParKilo.toLocaleString()} Ar / kg
              </span>
            </div>
            {poidsNum > 0 && !poidsDepasse && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {poidsNum} kg × {prixParKilo.toLocaleString()} Ar
                  </span>
                  <span className="font-bold text-primary text-base">
                    {totalEstime.toLocaleString()} Ar
                  </span>
                </div>
              </>
            )}
            {poidsDepasse && (
              <div className="flex items-center gap-1.5 text-red-500 text-xs font-medium">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                Le poids dépasse la capacité disponible ({maxPoids} kg)
              </div>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nom_recepteur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nom du récepteur{" "}
                    <span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-10"
                      placeholder="Ravo Rakoto"
                      {...field}
                    />
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
                  <FormLabel>
                    Tél. récepteur{" "}
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
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2 mt-1 border-t">
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
              disabled={isLoading || poidsDepasse}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmer la réservation
            </Button>
          </div>
        </form>
      </Form>
    </AppModal>
  );
}


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
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Référence (nom colis){" "}
                  <span className="text-red-500 ml-0.5">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="h-10"
                    placeholder="Ex : Télévision 55 pouces"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date_depart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Date départ <span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" className="h-10" {...field} />
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
                  <FormLabel>
                    Catégorie <span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="poids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Poids (kg) <span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
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
              name="dimension"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Dimension (m³){" "}
                    <span className="text-red-500 ml-0.5">*</span>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nom_recepteur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nom du récepteur{" "}
                    <span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-10"
                      placeholder="Ravo Rakoto"
                      {...field}
                    />
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
                  <FormLabel>
                    Tél. récepteur{" "}
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
          </div>

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
              Confirmer la réservation
            </Button>
          </div>
        </form>
      </Form>
    </AppModal>
  );
}

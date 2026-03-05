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
import { Loader2 } from "lucide-react";
import type { PbTransport, Transport } from "@/types";

const schema = z.object({
  transport_id: z.coerce.number().min(1, "Requis"),
  depart: z.string().min(1, "Requis"),
  destination: z.string().min(1, "Requis"),
  capacite_transport: z.coerce.number().positive("Doit être positif"),
  prix_par_kilo: z.coerce.number().positive("Doit être positif"),
  prix_fragile_par_kilo: z.coerce.number().positive("Doit être positif"),
  status: z.enum(["ACTIVE", "INACTIVE", "PENDING"]),
});

type FormData = z.infer<typeof schema>;

interface AnnonceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: PbTransport;
  transports: Transport[];
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading: boolean;
}

export function AnnonceFormModal({
  open,
  onOpenChange,
  initialData,
  transports,
  onSubmit,
  isLoading,
}: AnnonceFormModalProps) {
  const isEdit = !!initialData;
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      transport_id: initialData?.transport_id ?? 0,
      depart: initialData?.depart ?? "",
      destination: initialData?.destination ?? "",
      capacite_transport: initialData?.capacite_transport ?? 0,
      prix_par_kilo: initialData?.prix_par_kilo ?? 0,
      prix_fragile_par_kilo: initialData?.prix_fragile_par_kilo ?? 0,
      status: (initialData?.status as FormData["status"]) ?? "PENDING",
    },
  });

  async function handleSubmit(values: FormData) {
    const payload = isEdit
      ? { id: initialData!.id_pb_transport, ...values }
      : values;
    await onSubmit(payload);
    onOpenChange(false);
    form.reset();
  }

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Modifier l'annonce" : "Nouvelle annonce de transport"}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="transport_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Véhicule <span className="text-red-500 ml-0.5">*</span>
                </FormLabel>
                <Select
                  onValueChange={(v) => field.onChange(Number(v))}
                  defaultValue={field.value ? String(field.value) : undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisissez un transport" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {transports.map((t) => (
                      <SelectItem
                        key={t.id_transport}
                        value={String(t.id_transport)}
                      >
                        {t.marque} — {t.immatriculation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="depart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Départ <span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-10"
                      placeholder="Antananarivo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Destination <span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-10"
                      placeholder="Toamasina"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="capacite_transport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Capacité (kg) <span className="text-red-500 ml-0.5">*</span>
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
              name="prix_par_kilo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Prix/kg (Ar) <span className="text-red-500 ml-0.5">*</span>
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
              name="prix_fragile_par_kilo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Prix fragile/kg (Ar){" "}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Statut <span className="text-red-500 ml-0.5">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Actif</SelectItem>
                    <SelectItem value="PENDING">En attente</SelectItem>
                    <SelectItem value="INACTIVE">Inactif</SelectItem>
                  </SelectContent>
                </Select>
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
              {isEdit ? "Mettre à jour" : "Créer"}
            </Button>
          </div>
        </form>
      </Form>
    </AppModal>
  );
}

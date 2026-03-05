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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { PbMarchandise } from "@/types";

const schema = z.object({
  label: z.string().min(1, "Requis"),
  category: z.string().min(1, "Requis"),
  poids: z.coerce.number().positive("Doit être positif"),
  dimension: z.coerce.number().positive("Doit être positif"),
  fragile: z.boolean(),
  date_depart: z.string().min(1, "Requis"),
  depart: z.string().min(1, "Requis"),
  destination: z.string().min(1, "Requis"),
  nom_recepteur: z.string().min(1, "Requis"),
  tel_recepteur: z.string().min(8, "Numéro invalide"),
  status: z.enum(["ACTIVE", "INACTIVE", "PENDING"]),
});

type FormData = z.infer<typeof schema>;

interface MarchandiseFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: PbMarchandise;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading: boolean;
}

export function MarchandiseFormModal({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isLoading,
}: MarchandiseFormModalProps) {
  const isEdit = !!initialData;
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      label: initialData?.label ?? "",
      category: initialData?.category ?? "",
      poids: initialData?.poids ?? 0,
      dimension: initialData?.dimension ?? 0,
      fragile: initialData?.fragile ?? false,
      date_depart: initialData?.date_depart?.slice(0, 10) ?? "",
      depart: initialData?.depart ?? "",
      destination: initialData?.destination ?? "",
      nom_recepteur: initialData?.nom_recepteur ?? "",
      tel_recepteur: initialData?.tel_recepteur ?? "",
      status: (initialData?.status as FormData["status"]) ?? "PENDING",
    },
  });

  async function handleSubmit(values: FormData) {
    const payload = isEdit
      ? { id: initialData!.id_pb_marchandise, ...values }
      : values;
    await onSubmit(payload);
    onOpenChange(false);
    form.reset();
  }

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Modifier la marchandise" : "Publier une marchandise"}
      description="Publiez une demande de transport pour votre marchandise."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description / label</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Télé 42 pouces" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
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
                      <SelectItem value="ELECTRONIQUE">Électronique</SelectItem>
                      <SelectItem value="ALIMENTAIRE">Alimentaire</SelectItem>
                      <SelectItem value="VETEMENT">Vêtement</SelectItem>
                      <SelectItem value="MOBILIER">Mobilier</SelectItem>
                      <SelectItem value="AUTRE">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date_depart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date souhaitée</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
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

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="depart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ville départ</FormLabel>
                  <FormControl>
                    <Input placeholder="Dakar" {...field} />
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
                  <FormLabel>Destination</FormLabel>
                  <FormControl>
                    <Input placeholder="Thiès" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nom_recepteur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom récepteur</FormLabel>
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

          <div className="flex items-center gap-6">
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
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Statut</FormLabel>
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
              {isEdit ? "Mettre à jour" : "Ajouter"}
            </Button>
          </div>
        </form>
      </Form>
    </AppModal>
  );
}

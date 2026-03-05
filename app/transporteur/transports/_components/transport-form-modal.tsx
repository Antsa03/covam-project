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
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/shared/image-upload";
import type { Transport } from "@/types";

const schema = z.object({
  marque: z.string().min(1, "Requis"),
  type: z.string().min(1, "Requis"),
  immatriculation: z.string().min(1, "Requis"),
  description: z.string().min(1, "Requis"),
  images: z.string().min(1, "Veuillez téléverser une image"),
});

type FormData = z.infer<typeof schema>;

interface TransportFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Transport;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading: boolean;
}

export function TransportFormModal({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isLoading,
}: TransportFormModalProps) {
  const isEdit = !!initialData;
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      marque: initialData?.marque ?? "",
      type: initialData?.type ?? "",
      immatriculation: initialData?.immatriculation ?? "",
      description: initialData?.description ?? "",
      images: initialData?.images ?? "",
    },
  });

  async function handleSubmit(values: FormData) {
    const payload = isEdit
      ? { id: initialData!.id_transport, ...values }
      : values;
    await onSubmit(payload);
    onOpenChange(false);
    form.reset();
  }

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Modifier le transport" : "Nouveau transport"}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="marque"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marque</FormLabel>
                  <FormControl>
                    <Input placeholder="Mercedes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Camion, Van…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="immatriculation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Immatriculation</FormLabel>
                <FormControl>
                  <Input placeholder="AB-1234-CD" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photo du véhicule</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    folder="transports"
                    label="Téléverser une photo"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
              {isEdit ? "Mettre à jour" : "Créer"}
            </Button>
          </div>
        </form>
      </Form>
    </AppModal>
  );
}

"use client";

import { useState } from "react";
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
import type { Utilisateur } from "@/types";

const baseSchema = {
  nom: z.string().min(1, "Requis"),
  prenom: z.string().min(1, "Requis"),
  cin: z.string().min(1, "Requis"),
  phone: z.string().min(1, "Requis"),
  adresse: z.string().min(1, "Requis"),
  city: z.string().min(1, "Requis"),
  date_naissance: z.string().min(1, "Requis"),
  email: z.string().email("Email invalide"),
  role: z.enum(["CLIENT", "TRANSPORTEUR"]),
};

const createSchema = z.object({
  ...baseSchema,
  mot_de_passe: z.string().min(8, "8 caractères minimum"),
});

const editSchema = z.object({
  ...baseSchema,
  mot_de_passe: z.string().optional(),
});

type CreateData = z.infer<typeof createSchema>;
type EditData = z.infer<typeof editSchema>;

interface UserFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Utilisateur;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading: boolean;
}

export function UserFormModal({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isLoading,
}: UserFormModalProps) {
  const isEdit = !!initialData;

  const form = useForm<CreateData | EditData>({
    resolver: zodResolver(isEdit ? editSchema : createSchema),
    defaultValues: {
      nom: initialData?.nom ?? "",
      prenom: initialData?.prenom ?? "",
      cin: initialData?.cin ?? "",
      phone: initialData?.phone ?? "",
      adresse: initialData?.adresse ?? "",
      city: initialData?.city ?? "",
      date_naissance: initialData?.date_naissance
        ? new Date(initialData.date_naissance).toISOString().split("T")[0]
        : "",
      email: initialData?.email ?? "",
      role: (initialData?.role as "CLIENT" | "TRANSPORTEUR") ?? "CLIENT",
      mot_de_passe: "",
    },
  });

  async function handleSubmit(values: CreateData | EditData) {
    const payload: Record<string, unknown> = { ...values };
    if (isEdit) {
      payload.id = initialData!.id_utilisateur;
      if (!payload.mot_de_passe) delete payload.mot_de_passe;
    }
    await onSubmit(payload);
    if (!isLoading) {
      onOpenChange(false);
      form.reset();
    }
  }

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Modifier l'utilisateur" : "Nouveau utilisateur"}
      description={
        isEdit
          ? "Modifiez les informations de l'utilisateur."
          : "Créez un nouvel utilisateur sur la plateforme."
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CIN</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="adresse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ville</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date_naissance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date naissance</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mot_de_passe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {isEdit ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={
                      isEdit
                        ? "Laisser vide pour ne pas changer"
                        : "8 caractères minimum"
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rôle</FormLabel>
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
                    <SelectItem value="CLIENT">Client</SelectItem>
                    <SelectItem value="TRANSPORTEUR">Transporteur</SelectItem>
                  </SelectContent>
                </Select>
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

"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProfile, useUpdateProfile, usePostsQuota } from "@/hooks/use-account";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Calendar,
  IdCard,
  Truck,
  CheckCircle2,
  Camera,
  Loader2,
  FileText,
} from "lucide-react";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  nom: z.string().min(2, "Minimum 2 caractères"),
  prenom: z.string().min(2, "Minimum 2 caractères"),
  phone: z.string().min(8, "Numéro invalide"),
  adresse: z.string().min(3, "Adresse trop courte"),
  city: z.string().min(2, "Ville invalide"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Requis"),
    newPassword: z.string().min(6, "Minimum 6 caractères"),
    confirmPassword: z.string().min(1, "Requis"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

// ─── Role badge ────────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<string, { label: string; color: string }> = {
  ADMIN: {
    label: "Administrateur",
    color: "bg-rose-100 text-rose-700 border-rose-200",
  },
  TRANSPORTEUR: {
    label: "Transporteur",
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
  },
  CLIENT: {
    label: "Client",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  PARTICULIER: {
    label: "Particulier",
    color: "bg-violet-100 text-violet-700 border-violet-200",
  },
};

// ─── Field component ──────────────────────────────────────────────────────────

function Field({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | undefined;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide leading-tight">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-800 mt-0.5 truncate">
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}

// ─── Password eye toggle ──────────────────────────────────────────────────────

function PasswordInput({
  id,
  placeholder,
  registration,
  error,
}: {
  id: string;
  placeholder?: string;
  registration: ReturnType<ReturnType<typeof useForm>["register"]>;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1">
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="pr-10 h-10 bg-slate-50 border-slate-200 focus:bg-white"
          {...registration}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          onClick={() => setShow((v) => !v)}
          tabIndex={-1}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
// ─── Posts Quota Widget (Particulier) ──────────────────────────────────────────────

function PostsQuotaWidget() {
  const { data, isLoading } = usePostsQuota();

  if (isLoading) {
    return <div className="w-48 h-18 rounded-2xl bg-slate-100 animate-pulse" />;
  }

  const used = data?.data?.postsThisMonth ?? 0;
  const total = data?.data?.monthlyLimit ?? 4;
  const remaining = Math.max(0, total - used);
  const pct = Math.min(100, Math.round((used / total) * 100));

  const palette =
    remaining === 0
      ? { bar: "bg-red-500", wrap: "bg-red-50 border-red-200", text: "text-red-700", sub: "text-red-500" }
      : remaining === 1
      ? { bar: "bg-amber-500", wrap: "bg-amber-50 border-amber-200", text: "text-amber-800", sub: "text-amber-600" }
      : { bar: "bg-violet-500", wrap: "bg-violet-50 border-violet-200", text: "text-violet-800", sub: "text-violet-500" };

  return (
    <div className={`rounded-2xl border px-4 py-3 w-52 shrink-0 ${palette.wrap}`}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <FileText className={`h-3.5 w-3.5 ${palette.text}`} />
          <span className={`text-[11px] font-bold uppercase tracking-widest ${palette.text}`}>
            Publications
          </span>
        </div>
        <span className={`text-sm font-extrabold ${palette.text}`}>
          {used}
          <span className="text-xs font-normal opacity-50">/{total}</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${palette.bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Sub-label */}
      <p className={`text-[10px] mt-1.5 font-medium ${palette.sub}`}>
        {remaining === 0
          ? "Limite atteinte ce mois"
          : `${remaining} publication${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""} ce mois`}
      </p>
    </div>
  );
}
// ─── Main component ───────────────────────────────────────────────────────────

export function AccountPage() {
  const { data: session, update: updateSession } = useSession();
  const { data: profileRes, isLoading } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const role = session?.user?.role ?? "CLIENT";
  const roleMeta = ROLE_CONFIG[role] ?? ROLE_CONFIG.CLIENT;
  const isAdmin = role === "ADMIN";
  const isClient = role === "CLIENT" || role === "PARTICULIER";
  const isParticulier = role === "PARTICULIER";

  const profile = profileRes?.data as Record<string, unknown> | undefined;

  // ── Avatar upload state (CLIENT only) ─────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (profile && isClient) {
      const clientData = profile.client as Record<string, unknown> | null;
      const img = clientData?.image as string | null | undefined;
      if (img) setAvatarUrl(img);
    }
  }, [profile, isClient]);

  const handleAvatarClick = () => {
    if (isClient) fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload?folder=profiles", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? "Erreur de téléversement");
      }
      const { url } = (await res.json()) as { url: string };
      setAvatarUrl(url);
      updateProfile({ image: url });
      // Refresh the next-auth session so avatars everywhere update immediately
      await updateSession({ image: url });
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Erreur de téléversement",
      );
    } finally {
      setUploadingAvatar(false);
      // Reset input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "U";

  // ── Profile form ────────────────────────────────────────────────────────────
  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { nom: "", prenom: "", phone: "", adresse: "", city: "" },
  });

  useEffect(() => {
    if (profile && !isAdmin) {
      profileForm.reset({
        nom: String(profile.nom ?? ""),
        prenom: String(profile.prenom ?? ""),
        phone: String(profile.phone ?? ""),
        adresse: String(profile.adresse ?? ""),
        city: String(profile.city ?? ""),
      });
    }
  }, [profile, isAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Password form ───────────────────────────────────────────────────────────
  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSaveProfile = (values: ProfileForm) => {
    updateProfile(values, {
      onSuccess: () => profileForm.reset(values),
    });
  };

  const onSavePassword = (values: PasswordForm) => {
    updateProfile(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      { onSuccess: () => passwordForm.reset() },
    );
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start gap-3 pb-5 border-b border-slate-100">
        <div className="mt-0.5 h-8 w-1 rounded-full bg-primary shrink-0" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Mon compte
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Gérez vos informations personnelles et votre sécurité
          </p>
        </div>
      </div>

      {/* Profile hero card */}
      <Card className="border-0 shadow-sm bg-white overflow-hidden">
        <div className="h-20 bg-linear-to-r from-primary to-primary/80" />
        <CardContent className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
            {/* Avatar */}
            <div className="relative">
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={!isClient || uploadingAvatar}
                className="relative group focus:outline-none"
                title={isClient ? "Changer la photo de profil" : undefined}
              >
                <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
                  <AvatarImage
                    src={avatarUrl ?? undefined}
                    alt="Photo de profil"
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl font-bold bg-primary text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {isClient && (
                  <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {uploadingAvatar ? (
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    ) : (
                      <Camera className="h-6 w-6 text-white" />
                    )}
                  </div>
                )}
              </button>
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-400 ring-2 ring-white pointer-events-none" />
              {/* Hidden file input */}
              {isClient && (
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              )}
            </div>
            {/* Name + role */}
            <div className="flex-1 min-w-0 sm:pb-1">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-56" />
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-slate-900 truncate">
                    {isAdmin
                      ? String(
                          profile?.nom_utilisateur ??
                            session?.user?.name ??
                            "—",
                        )
                      : `${profile?.prenom ?? ""} ${profile?.nom ?? ""}`.trim() ||
                        session?.user?.name}
                  </h2>
                  <p className="text-sm text-slate-500 truncate">
                    {session?.user?.email ?? "—"}
                  </p>
                </>
              )}
            </div>
            {/* Role badge + quota */}
            <div className="flex flex-col items-end gap-3 shrink-0">
              <div
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${roleMeta.color}`}
              >
                <Shield className="h-3 w-3" />
                {roleMeta.label}
              </div>
              {isParticulier && <PostsQuotaWidget />}
            </div>
          </div>

          {/* Quick info strip (non-admin) */}
          {!isAdmin && !isLoading && profile && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-x-6">
              <Field
                label="CIN"
                value={String(profile.cin ?? "—")}
                icon={<IdCard className="h-4 w-4" />}
              />
              <Field
                label="Téléphone"
                value={String(profile.phone ?? "—")}
                icon={<Phone className="h-4 w-4" />}
              />
              <Field
                label="Ville"
                value={String(profile.city ?? "—")}
                icon={<Building2 className="h-4 w-4" />}
              />
              <Field
                label="Membre depuis"
                value={
                  profile.date_creation
                    ? new Date(
                        String(profile.date_creation),
                      ).toLocaleDateString("fr-FR", {
                        month: "short",
                        year: "numeric",
                      })
                    : "—"
                }
                icon={<Calendar className="h-4 w-4" />}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Informations personnelles (non-admin only) ── */}
        {!isAdmin && (
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                <form
                  onSubmit={profileForm.handleSubmit(onSaveProfile)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="prenom"
                        className="text-xs font-semibold text-slate-600"
                      >
                        Prénom
                      </Label>
                      <Input
                        id="prenom"
                        className="h-10 bg-slate-50 border-slate-200 focus:bg-white"
                        {...profileForm.register("prenom")}
                      />
                      {profileForm.formState.errors.prenom && (
                        <p className="text-xs text-red-500">
                          {profileForm.formState.errors.prenom.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="nom"
                        className="text-xs font-semibold text-slate-600"
                      >
                        Nom
                      </Label>
                      <Input
                        id="nom"
                        className="h-10 bg-slate-50 border-slate-200 focus:bg-white"
                        {...profileForm.register("nom")}
                      />
                      {profileForm.formState.errors.nom && (
                        <p className="text-xs text-red-500">
                          {profileForm.formState.errors.nom.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="phone"
                      className="text-xs font-semibold text-slate-600"
                    >
                      Téléphone
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="phone"
                        className="h-10 pl-9 bg-slate-50 border-slate-200 focus:bg-white"
                        {...profileForm.register("phone")}
                      />
                    </div>
                    {profileForm.formState.errors.phone && (
                      <p className="text-xs text-red-500">
                        {profileForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="city"
                      className="text-xs font-semibold text-slate-600"
                    >
                      Ville
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="city"
                        className="h-10 pl-9 bg-slate-50 border-slate-200 focus:bg-white"
                        {...profileForm.register("city")}
                      />
                    </div>
                    {profileForm.formState.errors.city && (
                      <p className="text-xs text-red-500">
                        {profileForm.formState.errors.city.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="adresse"
                      className="text-xs font-semibold text-slate-600"
                    >
                      Adresse
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="adresse"
                        className="h-10 pl-9 bg-slate-50 border-slate-200 focus:bg-white"
                        {...profileForm.register("adresse")}
                      />
                    </div>
                    {profileForm.formState.errors.adresse && (
                      <p className="text-xs text-red-500">
                        {profileForm.formState.errors.adresse.message}
                      </p>
                    )}
                  </div>

                  {/* Read-only fields */}
                  <Separator className="my-1" />
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-600">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        value={session?.user?.email ?? ""}
                        readOnly
                        className="h-10 pl-9 bg-slate-100 border-slate-200 text-slate-500 cursor-default"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      L&apos;email ne peut pas être modifié.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-primary hover:bg-primary/90 text-white h-10 font-semibold"
                  >
                    {isPending
                      ? "Enregistrement…"
                      : "Enregistrer les modifications"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        )}

        {/* ── Sécurité — change password ── */}
        <Card
          className={`border-0 shadow-sm bg-white ${isAdmin ? "lg:col-span-2 max-w-lg" : ""}`}
        >
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                <Lock className="h-3.5 w-3.5 text-amber-600" />
              </div>
              Sécurité — Changer le mot de passe
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <form
              onSubmit={passwordForm.handleSubmit(onSavePassword)}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label
                  htmlFor="currentPassword"
                  className="text-xs font-semibold text-slate-600"
                >
                  Mot de passe actuel
                </Label>
                <PasswordInput
                  id="currentPassword"
                  placeholder="••••••••"
                  registration={passwordForm.register("currentPassword")}
                  error={passwordForm.formState.errors.currentPassword?.message}
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="newPassword"
                  className="text-xs font-semibold text-slate-600"
                >
                  Nouveau mot de passe
                </Label>
                <PasswordInput
                  id="newPassword"
                  placeholder="Minimum 6 caractères"
                  registration={passwordForm.register("newPassword")}
                  error={passwordForm.formState.errors.newPassword?.message}
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="confirmPassword"
                  className="text-xs font-semibold text-slate-600"
                >
                  Confirmer le mot de passe
                </Label>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="Répétez le nouveau mot de passe"
                  registration={passwordForm.register("confirmPassword")}
                  error={passwordForm.formState.errors.confirmPassword?.message}
                />
              </div>

              {/* Tips */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 space-y-1.5">
                <p className="text-xs font-semibold text-slate-600">
                  Conseils de sécurité
                </p>
                {[
                  "Minimum 6 caractères",
                  "Utilisez des lettres, chiffres et symboles",
                  "Évitez les mots de passe réutilisés",
                ].map((tip) => (
                  <div key={tip} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <p className="text-xs text-slate-500">{tip}</p>
                  </div>
                ))}
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white h-10 font-semibold"
              >
                {isPending
                  ? "Enregistrement…"
                  : "Mettre à jour le mot de passe"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* ── Transporteur extra info ── */}
        {role === "TRANSPORTEUR" &&
          !isLoading &&
          profile != null &&
          (profile as Record<string, unknown>).transporteur != null && (
            <Card className="border-0 shadow-sm bg-white lg:col-span-2">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Truck className="h-3.5 w-3.5 text-primary" />
                  </div>
                  Mes transports enregistrés
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {(() => {
                  const transports = (
                    (profile as Record<string, unknown>).transporteur as Record<
                      string,
                      unknown
                    >
                  )?.transports as Array<Record<string, unknown>> | undefined;
                  if (!transports?.length) {
                    return (
                      <p className="text-sm text-slate-400 text-center py-6">
                        Aucun transport enregistré.
                      </p>
                    );
                  }
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {transports.map((t) => (
                        <div
                          key={String(t.id_transport)}
                          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                        >
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Truck className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {String(t.marque)} — {String(t.type)}
                            </p>
                            <p className="text-xs text-slate-500 font-mono">
                              {String(t.immatriculation)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
}

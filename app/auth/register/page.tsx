"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { ImageUpload } from "@/components/shared/image-upload";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Eye, EyeOff, Loader2 } from "lucide-react";

const schema = z.object({
  nom: z.string().min(1, "Nom requis"),
  prenom: z.string().min(1, "Prénom requis"),
  cin: z.string().min(1, "CIN requis"),
  phone: z.string().min(1, "Téléphone requis"),
  adresse: z.string().min(1, "Adresse requise"),
  city: z.string().min(1, "Ville requise"),
  date_naissance: z.string().min(1, "Date de naissance requise"),
  email: z.string().email("Email invalide"),
  mot_de_passe: z.string().min(8, "8 caractères minimum"),
  role: z.enum(["CLIENT", "TRANSPORTEUR"], { required_error: "Rôle requis" }),
  image: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nom: "",
      prenom: "",
      cin: "",
      phone: "",
      adresse: "",
      city: "",
      date_naissance: "",
      email: "",
      mot_de_passe: "",
      image: "",
    },
  });

  const watchedRole = form.watch("role");

  async function onSubmit(values: FormData) {
    setLoading(true);
    try {
      await api.post("/api/auth/register", values);
      toast.success("Compte créé ! Vous pouvez maintenant vous connecter.");
      router.push(callbackUrl ? `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/auth/login");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 rounded-none bg-white my-6">
      <CardHeader className="pb-8 pt-10 px-10 text-center">
        <CardTitle className="text-3xl font-light tracking-tight text-slate-900">
          Créer un compte
        </CardTitle>
        <CardDescription className="text-sm text-slate-500 mt-2 tracking-wide uppercase font-medium">
          REJOIGNEZ LA PLATEFORME COVAM
        </CardDescription>
      </CardHeader>
      <CardContent className="px-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
          >
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem className="relative pt-4">
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-widest absolute top-0 left-0 transition-all">
                    Nom <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Votre nom"
                      className="peer h-10 px-0 text-base bg-transparent border-0 border-b border-slate-300 rounded-none focus-visible:ring-0 focus-visible:border-slate-900 focus-visible:shadow-none hover:border-slate-400 transition-all placeholder:text-slate-300 placeholder:font-light"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem className="relative pt-4">
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-widest absolute top-0 left-0 transition-all">
                    Prénom <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Votre prénom"
                      className="peer h-10 px-0 text-base bg-transparent border-0 border-b border-slate-300 rounded-none focus-visible:ring-0 focus-visible:border-slate-900 focus-visible:shadow-none hover:border-slate-400 transition-all placeholder:text-slate-300 placeholder:font-light"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cin"
              render={({ field }) => (
                <FormItem className="relative pt-4">
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-widest absolute top-0 left-0 transition-all">
                    CIN <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Numéro de CIN"
                      className="peer h-10 px-0 text-base bg-transparent border-0 border-b border-slate-300 rounded-none focus-visible:ring-0 focus-visible:border-slate-900 focus-visible:shadow-none hover:border-slate-400 transition-all placeholder:text-slate-300 placeholder:font-light"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="relative pt-4">
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-widest absolute top-0 left-0 transition-all">
                    Téléphone <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+212 ..."
                      className="peer h-10 px-0 text-base bg-transparent border-0 border-b border-slate-300 rounded-none focus-visible:ring-0 focus-visible:border-slate-900 focus-visible:shadow-none hover:border-slate-400 transition-all placeholder:text-slate-300 placeholder:font-light"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="relative pt-4">
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-widest absolute top-0 left-0 transition-all">
                    Email <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="exemple@covam.com"
                      className="peer h-10 px-0 text-base bg-transparent border-0 border-b border-slate-300 rounded-none focus-visible:ring-0 focus-visible:border-slate-900 focus-visible:shadow-none hover:border-slate-400 transition-all placeholder:text-slate-300 placeholder:font-light"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mot_de_passe"
              render={({ field }) => (
                <FormItem className="relative pt-4">
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-widest absolute top-0 left-0 transition-all">
                    Mot de passe <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="8 caractères minimum"
                        className="peer h-10 px-0 text-base bg-transparent border-0 border-b border-slate-300 rounded-none focus-visible:ring-0 focus-visible:border-slate-900 focus-visible:shadow-none hover:border-slate-400 transition-all placeholder:text-slate-300 placeholder:font-light pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 hover:text-slate-900 transition-colors"
                        tabIndex={-1}
                        aria-label={showPassword ? "Cacher" : "Montrer"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 stroke-1" />
                        ) : (
                          <Eye className="h-4 w-4 stroke-1" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="relative pt-4">
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-widest absolute top-0 left-0 transition-all">
                    Ville <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Votre ville"
                      className="peer h-10 px-0 text-base bg-transparent border-0 border-b border-slate-300 rounded-none focus-visible:ring-0 focus-visible:border-slate-900 focus-visible:shadow-none hover:border-slate-400 transition-all placeholder:text-slate-300 placeholder:font-light"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date_naissance"
              render={({ field }) => (
                <FormItem className="relative pt-4">
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-widest absolute top-0 left-0 transition-all">
                    Date de naissance <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="peer h-10 px-0 text-base bg-transparent border-0 border-b border-slate-300 rounded-none focus-visible:ring-0 focus-visible:border-slate-900 focus-visible:shadow-none hover:border-slate-400 transition-all placeholder:text-transparent focus:placeholder:text-slate-300 text-slate-600"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adresse"
              render={({ field }) => (
                <FormItem className="md:col-span-2 relative pt-4">
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-widest absolute top-0 left-0 transition-all">
                    Adresse complète <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Votre adresse détaillée"
                      className="peer h-10 px-0 text-base bg-transparent border-0 border-b border-slate-300 rounded-none focus-visible:ring-0 focus-visible:border-slate-900 focus-visible:shadow-none hover:border-slate-400 transition-all placeholder:text-slate-300 placeholder:font-light"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="md:col-span-2 pt-2">
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Je suis <span className="text-red-400">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 px-0 text-base bg-transparent border-0 border-b border-slate-300 rounded-none focus:ring-0 focus:border-slate-900 focus:shadow-none hover:border-slate-400 transition-all font-light">
                        <SelectValue placeholder="Choisissez un rôle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CLIENT">Client</SelectItem>
                      <SelectItem value="TRANSPORTEUR">Transporteur</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            {watchedRole === "CLIENT" && (
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 pt-2">
                    <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                      Photo de profil{" "}
                      <span className="text-slate-400 font-normal">
                        (optionnelle)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        folder="profiles"
                        label="Téléverser une photo de profil"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            )}
            <Button
              type="submit"
              className="w-full h-14 mt-6 rounded-none bg-primary text-white hover:bg-primary/90 text-sm tracking-[0.2em] font-medium uppercase transition-colors md:col-span-2 shadow-none"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Créer mon compte
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pb-10 pt-6 px-10 text-center border-t border-slate-50 mt-4">
        <p className="text-sm text-slate-500 tracking-wide">
          Déjà inscrit ?{" "}
          <Link
            href={callbackUrl ? `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/auth/login"}
            className="text-slate-900 font-semibold hover:underline underline-offset-4 decoration-1 transition-all"
          >
            Se connecter
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

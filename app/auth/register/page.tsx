"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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
      router.push("/auth/login");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl shadow-lg border-0 bg-white my-2">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-2xl font-bold text-slate-900">
          Créer un compte
        </CardTitle>
        <CardDescription className="text-slate-500">
          Remplissez le formulaire pour rejoindre la plateforme Covam.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3"
          >
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Nom <span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 px-0 bg-transparent border-0 border-b-2 border-slate-200 rounded-none focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-none hover:border-slate-300 transition-all placeholder:text-slate-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Prénom <span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 px-0 bg-transparent border-0 border-b-2 border-slate-200 rounded-none focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-none hover:border-slate-300 transition-all placeholder:text-slate-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    CIN <span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 px-0 bg-transparent border-0 border-b-2 border-slate-200 rounded-none focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-none hover:border-slate-300 transition-all placeholder:text-slate-300"
                      {...field}
                    />
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
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Téléphone <span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 px-0 bg-transparent border-0 border-b-2 border-slate-200 rounded-none focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-none hover:border-slate-300 transition-all placeholder:text-slate-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Email <span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="h-10 px-0 bg-transparent border-0 border-b-2 border-slate-200 rounded-none focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-none hover:border-slate-300 transition-all placeholder:text-slate-300"
                      {...field}
                    />
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
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Mot de passe <span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="8 caractères minimum"
                        className="h-10 px-0 bg-transparent border-0 border-b-2 border-slate-200 rounded-none focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-none hover:border-slate-300 transition-all placeholder:text-slate-300 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 transition-colors"
                        tabIndex={-1}
                        aria-label={showPassword ? "Cacher" : "Montrer"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Ville <span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 px-0 bg-transparent border-0 border-b-2 border-slate-200 rounded-none focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-none hover:border-slate-300 transition-all placeholder:text-slate-300"
                      {...field}
                    />
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
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Date de naissance{" "}
                    <span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="h-10 px-0 bg-transparent border-0 border-b-2 border-slate-200 rounded-none focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-none hover:border-slate-300 transition-all placeholder:text-slate-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adresse"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Adresse <span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 px-0 bg-transparent border-0 border-b-2 border-slate-200 rounded-none focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-none hover:border-slate-300 transition-all placeholder:text-slate-300"
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
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Je suis <span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 px-0 bg-transparent border-0 border-b-2 border-slate-200 rounded-none focus:ring-0 focus:border-primary focus:shadow-none hover:border-slate-300 transition-all">
                        <SelectValue placeholder="Choisissez un rôle" />
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
            {watchedRole === "CLIENT" && (
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Photo de profil{" "}
                      <span className="text-slate-400 text-xs">
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button
              type="submit"
              className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-semibold mt-1 md:col-span-2"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer mon compte
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center text-sm pt-0 pb-4">
        <span className="text-slate-500">Déjà inscrit ?&nbsp;</span>
        <Link
          href="/auth/login"
          className="font-semibold text-primary hover:text-primary/80 underline-offset-4 hover:underline"
        >
          Se connecter
        </Link>
      </CardFooter>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const schema = z.object({
  email: z.string().min(1, "Identifiant requis"),
  password: z.string().min(1, "Mot de passe requis"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormData) {
    setLoading(true);
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      toast.error(
        result.error === "CredentialsSignin"
          ? "Identifiant ou mot de passe incorrect."
          : result.error,
      );
      return;
    }

    // Redirect based on role — the session will contain the role after sign-in
    const res = await fetch("/api/auth/me");
    const json = await res.json().catch(() => null);
    const role = json?.data?.role ?? "CLIENT";

    if (role === "ADMIN") router.push("/admin/users");
    else if (role === "TRANSPORTEUR") router.push("/transporteur/dashboard");
    else router.push("/client/dashboard");
  }

  return (
    <Card className="w-full max-w-lg shadow-xl border-0 bg-white">
      <CardHeader className="pb-5 pt-8 px-8">
        <CardTitle className="text-3xl font-bold text-slate-900">
          Bon retour !
        </CardTitle>
        <CardDescription className="text-base text-slate-500 mt-1">
          Entrez votre email (ou nom d&apos;utilisateur admin) pour vous
          connecter.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    Email / Nom d&apos;utilisateur{" "}
                    <span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="exemple@covam.com"
                      className="h-12 text-base bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    Mot de passe <span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-12 text-base bg-slate-50 border-slate-200 focus:bg-white transition-colors pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 transition-colors"
                        tabIndex={-1}
                        aria-label={
                          showPassword
                            ? "Cacher le mot de passe"
                            : "Montrer le mot de passe"
                        }
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
            <Button
              type="submit"
              className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-white font-semibold mt-2"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Se connecter
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center text-sm pt-2 pb-8 px-8">
        <span className="text-slate-500">Pas encore de compte ?&nbsp;</span>
        <Link
          href="/auth/register"
          className="font-semibold text-primary hover:text-primary/80 underline-offset-4 hover:underline"
        >
          Créer un compte
        </Link>
      </CardFooter>
    </Card>
  );
}

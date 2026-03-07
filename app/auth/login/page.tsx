"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
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

const InputField = "h-12 px-0 text-base bg-transparent border-0 border-b-2 border-slate-200 rounded-none focus-visible:ring-0 focus-visible:border-slate-900 focus-visible:shadow-none hover:border-slate-400 transition-all placeholder:text-slate-300"

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") ?? null;
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

    if (callbackUrl && role === "CLIENT") {
      router.push(callbackUrl);
    } else if (role === "ADMIN") {
      router.push("/admin/users");
    } else if (role === "TRANSPORTEUR") {
      router.push("/transporteur/dashboard");
    } else {
      router.push(callbackUrl && role === "CLIENT" ? callbackUrl : "/client/dashboard");
    }
  }

  return (
    <Card className="w-full max-w-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 rounded-none bg-white">
      <CardHeader className="pb-8 pt-10 px-10 text-center">
        <CardTitle className="text-3xl font-light tracking-tight text-slate-900">
          Bon retour
        </CardTitle>
        <CardDescription className="text-sm text-slate-500 mt-2 tracking-wide uppercase font-medium">
          CONNECTEZ-VOUS À VOTRE COMPTE
        </CardDescription>
      </CardHeader>
      <CardContent className="px-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="relative pt-4">
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-widest absolute top-0 left-0 transition-all">
                    Identifiant
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="exemple@covam.com"
                      className="peer h-12 px-0 text-base bg-transparent border-0 border-b-2 border-slate-200 rounded-none focus-visible:ring-0 focus-visible:border-slate-900 focus-visible:shadow-none hover:border-slate-300 transition-all placeholder:text-slate-300 placeholder:font-light"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs pt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative pt-4">
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-widest absolute top-0 left-0 transition-all">
                    Mot de passe
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="peer h-12 px-0 text-base bg-transparent border-0 border-b-2 border-slate-200 rounded-none focus-visible:ring-0 focus-visible:border-slate-900 focus-visible:shadow-none hover:border-slate-300 transition-all placeholder:text-slate-300 placeholder:font-light pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 hover:text-slate-900 transition-colors"
                        tabIndex={-1}
                        aria-label={
                          showPassword
                            ? "Cacher le mot de passe"
                            : "Montrer le mot de passe"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 stroke-1" />
                        ) : (
                          <Eye className="h-5 w-5 stroke-1" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs pt-1" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-14 mt-8 rounded-none bg-primary text-white hover:bg-primary/90 text-sm tracking-[0.2em] font-medium uppercase transition-colors"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Se connecter
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pb-10 pt-6 px-10 text-center border-t border-slate-50 mt-4">
        <p className="text-sm text-slate-500 tracking-wide">
          Pas encore de compte ?{" "}
          <Link
            href={callbackUrl ? `/auth/register?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/auth/register"}
            className="text-slate-900 font-semibold hover:underline underline-offset-4 decoration-1 transition-all"
          >
            Créer un compte
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <LoginForm />
    </Suspense>
  );
}

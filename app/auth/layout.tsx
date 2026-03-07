import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const benefits = [
  "Mise en relation rapide avec des transporteurs fiables",
  "Suivi de vos livraisons en temps réel",
  "Paiements sécurisés et transparents",
  "Couverture nationale étendue",
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left — branding panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-12 bg-slate-950">
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-900 to-slate-950 opacity-90" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-20 right-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-56 h-56 bg-indigo-600/10 rounded-full blur-3xl" />

        {/* Logo */}
        <Link href="/" className="relative w-fit">
          <Image
            src="/img/covam.png"
            alt="Covam"
            width={140}
            height={44}
            className="h-28 w-auto object-contain brightness-0 invert"
          />
        </Link>

        {/* Main content */}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
            La plateforme qui simplifie
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-white to-white/70">
              le transport de marchandises
            </span>
          </h2>
          <p className="text-white/70 mb-8 leading-relaxed">
            Connectez-vous avec des transporteurs fiables ou proposez vos
            services de transport sur toute la plateforme nationale.
          </p>
          <ul className="space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-white/80">
                <CheckCircle2 className="h-5 w-5 text-white/90 shrink-0 mt-0.5" />
                <span className="text-sm">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="relative text-xs text-white/50">
          © {new Date().getFullYear()} Covam. Tous droits réservés.
        </p>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background overflow-y-auto">
        {/* Mobile logo */}
        <Link href="/" className="mb-8 lg:hidden">
          <Image
            src="/img/covam.png"
            alt="Covam"
            width={120}
            height={40}
            className="h-10 w-auto object-contain"
          />
        </Link>
        {children}
      </div>
    </div>
  );
}

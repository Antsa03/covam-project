"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Phone, Mail } from "lucide-react";
import Image from "next/image";

const VILLES = [
  "Antananarivo",
  "Toamasina",
  "Mahajanga",
  "Fianarantsoa",
  "Toliara",
  "Antsiranana",
  "Antsirabe",
  "Morondava",
  "Ambositra",
  "Nosy Be",
];

export default function HomePage() {
  const router = useRouter();
  const [depart, setDepart] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-[#eff1f6]">
      {/* ── Navbar ── */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/img/covam.png"
              alt="Covam"
              width={130}
              height={40}
              className="h-16 w-auto object-contain"
            />
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a
              href="#comment-ca-marche"
              className="hover:text-primary transition-colors"
            >
              Comment ça marche
            </a>
            <a href="#contact" className="hover:text-primary transition-colors">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/auth/login">Se connecter</Link>
            </Button>
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Link href="/auth/register">S&apos;inscrire</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <main className="flex flex-col items-center justify-center px-4 pt-20 pb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-[2.8rem] font-extrabold text-[#0D1B3E] text-center tracking-wide uppercase leading-tight mb-3">
          Bienvenue sur notre plateforme de transport
        </h1>
        <p className="text-2xl sm:text-3xl font-extrabold text-primary text-center uppercase tracking-wider mb-4">
          Simplifions vos expéditions
        </p>
        <p className="text-slate-500 text-center max-w-xl mb-10 text-sm leading-relaxed">
          Votre partenaire fiable pour tous vos besoins en transport à
          Madagascar. Découvrez notre service de mise en relation efficace et
          sécurisé.
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white rounded-xl shadow-md px-4 py-3 w-full max-w-3xl"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0 sm:border-r border-slate-200 sm:pr-3">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              className="flex-1 text-sm text-slate-700 bg-transparent border-none outline-none py-1 cursor-pointer"
              value={depart}
              onChange={(e) => setDepart(e.target.value)}
            >
              <option value="">Départ</option>
              {VILLES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-0 sm:border-r border-slate-200 sm:pr-3">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              className="flex-1 text-sm text-slate-700 bg-transparent border-none outline-none py-1 cursor-pointer"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option value="">Destination</option>
              {VILLES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="date"
              className="flex-1 text-sm text-slate-700 bg-transparent border-none outline-none py-1"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white font-bold px-8 uppercase tracking-wide shrink-0"
          >
            Rechercher
          </Button>
        </form>

        {/* Truck illustrations */}
        <div className="mt-14 flex items-end gap-8 sm:gap-16">
          <Image src="/img/camion.png" alt="Camion" width={500} height={500} />
        </div>
      </main>

      {/* ── How it works ── */}
      <section id="comment-ca-marche" className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold text-[#0D1B3E] uppercase tracking-wide mb-2">
            Comment ça marche
          </h2>
          <p className="text-primary font-semibold mb-12 uppercase tracking-wider text-sm">
            En quatre étapes simples
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                n: "01",
                title: "Créez un compte",
                desc: "Inscrivez-vous gratuitement en tant que client ou transporteur.",
              },
              {
                n: "02",
                title: "Trouvez un trajet",
                desc: "Parcourez les annonces disponibles et choisissez selon vos besoins.",
              },
              {
                n: "03",
                title: "Réservez",
                desc: "Indiquez vos marchandises et confirmez la réservation en ligne.",
              },
              {
                n: "04",
                title: "Suivez et payez",
                desc: "Suivez l'avancement et réglez directement depuis votre tableau de bord.",
              },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm mb-3">
                  {n}
                </div>
                <h3 className="font-semibold text-[#0D1B3E] mb-1">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-white px-8"
            >
              <Link href="/auth/register">Je démarre maintenant</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary text-primary hover:bg-primary/5 px-8"
            >
              <Link href="/auth/login">Se connecter</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" className="bg-[#0D1B3E] text-white/70">
        {/* orange accent bar */}
        <div className="h-1 w-full bg-linear-to-r from-secondary/80 via-secondary to-secondary/40" />

        <div className="max-w-5xl mx-auto px-4 pt-14 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/10">
            {/* Brand */}
            <div>
              <Image
                src="/img/covam.png"
                alt="Covam"
                width={120}
                height={38}
                className="h-12 w-auto object-contain brightness-0 invert mb-5"
              />
              <p className="text-sm leading-relaxed text-white/55 max-w-xs">
                COVAM est né d&apos;un constat simple : trouver un transporteur
                fiable à Madagascar prend trop de temps. On a voulu changer ça.
              </p>
              <div className="mt-6 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-xs text-white/40 uppercase tracking-widest">
                  Madagascar
                </span>
              </div>
            </div>

            {/* Liens */}
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-5 h-0.5 bg-secondary rounded-full inline-block" />
                Liens rapides
              </h4>
              <ul className="space-y-3 text-sm">
                {[
                  { href: "/auth/register", label: "S\u2019inscrire" },
                  { href: "/auth/login", label: "Se connecter" },
                  {
                    href: "#comment-ca-marche",
                    label: "Comment \u00e7a marche",
                  },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="flex items-center gap-2 text-white/55 hover:text-white hover:translate-x-1 transition-all duration-200 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary/60 group-hover:bg-secondary transition-colors shrink-0" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-5 h-0.5 bg-secondary rounded-full inline-block" />
                Nous contacter
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Mail className="h-3.5 w-3.5 text-white/80" />
                  </div>
                  <span className="text-white/60">contact@covam.mg</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Phone className="h-3.5 w-3.5 text-white/80" />
                  </div>
                  <span className="text-white/60">+261 XX XX XXX XX</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/35">
            <span>
              © {new Date().getFullYear()} Covam. Tous droits réservés.
            </span>
            <span className="uppercase tracking-widest">
              Plateforme de transport · Madagascar
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

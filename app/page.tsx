import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/shared/landing-navbar";
import { SearchSection } from "./_components/search-section";
import {
  Truck,
  Package,
  Shield,
  MapPin,
  Users,
  CheckCircle2,
  BarChart3,
  Globe,
  Zap,
  ChevronRight,
  Phone,
  Mail,
  Star,
  Sparkles,
} from "lucide-react";

const stats = [
  { label: "Transporteurs inscrits", value: "120+", icon: Truck, desc: "sur tout Madagascar" },
  { label: "Clients satisfaits", value: "400+", icon: Users, desc: "expéditeurs actifs" },
  { label: "Livraisons effectuées", value: "1 800+", icon: Package, desc: "en toute sécurité" },
  { label: "Villes desservies", value: "10+", icon: MapPin, desc: "grands axes couverts" },
];

const featureAccent = {
  color: "text-blue-400",
  iconBg: "rgba(96,165,250,0.10)",
  iconBorder: "rgba(96,165,250,0.18)",
  lineGradient: "linear-gradient(90deg, transparent 0%, rgba(96,165,250,0.80) 50%, transparent 100%)",
  cornerGlow: "rgba(96,165,250,0.12)",
  bottomEdge: "rgba(96,165,250,0.55)",
};

const features = [
  {
    icon: Zap,
    title: "Trouvez un transporteur vite",
    description:
      "Plus besoin de passer des heures à appeler. En quelques clics, vous voyez les trajets disponibles et vous réservez.",
    ...featureAccent,
  },
  {
    icon: Shield,
    title: "Paiements en toute confiance",
    description:
      "Le paiement ne part que quand la livraison est confirmée. Pas de stress, pas de mauvaises surprises.",
    ...featureAccent,
  },
  {
    icon: BarChart3,
    title: "Gardez un œil sur vos colis",
    description:
      "Date de départ, statut de la réservation, historique — tout est dans votre tableau de bord, accessible où vous êtes.",
    ...featureAccent,
  },
  {
    icon: Globe,
    title: "Trajets partout à Madagascar",
    description:
      "Antananarivo, Toamasina, Mahajanga, Fianarantsoa… les transporteurs couvrent les grands axes comme les régions.",
    ...featureAccent,
  },
];

const clientSteps = [
  {
    step: "01",
    title: "Créez votre compte",
    desc: "Ça prend deux minutes. Nom, email, mot de passe — c'est tout pour commencer.",
  },
  {
    step: "02",
    title: "Parcourez les annonces",
    desc: "Filtrez par ville de départ ou de destination, comparez les prix et les capacités disponibles.",
  },
  {
    step: "03",
    title: "Réservez un trajet",
    desc: "Indiquez le poids, la nature et les détails de votre marchandise, puis confirmez la réservation.",
  },
  {
    step: "04",
    title: "Suivez et payez",
    desc: "Restez au courant de l'avancement et réglez directement depuis votre espace client.",
  },
];

const transporteurSteps = [
  {
    step: "01",
    title: "Créez votre profil",
    desc: "Enregistrez vos informations, ajoutez votre ou vos véhicules avec les photos et l'immatriculation.",
  },
  {
    step: "02",
    title: "Publiez vos annonces",
    desc: "Pour chaque trajet prévu, indiquez le départ, la destination, la capacité disponible et votre tarif au kilo.",
  },
  {
    step: "03",
    title: "Recevez des demandes",
    desc: "Les clients trouvent votre annonce, réservent et vous êtes notifié par la plateforme.",
  },
  {
    step: "04",
    title: "Livrez et encaissez",
    desc: "Confirmez la livraison et recevez votre paiement directement depuis votre tableau de bord.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ── Navbar ── */}
      <LandingNavbar />

      {/* ── Hero ── */}
      <section className="flex flex-col items-center justify-center px-4 pt-36 pb-16 bg-linear-to-b from-white to-slate-50">
        <span 
          className="relative inline-flex items-center gap-2.5 rounded-full px-6 py-1.5 text-[0.65rem] sm:text-xs font-bold tracking-[0.2em] uppercase mb-8 transition-transform hover:scale-105 duration-300 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] group cursor-default"
          style={{
            background: "linear-gradient(145deg, #1e3a8a 0%, #2563eb 100%)",
            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.3), 0 4px 24px -6px rgba(37, 99, 235, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          {/* Dust & light effects */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-50 mix-blend-overlay rounded-full overflow-hidden"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 0%, rgba(147,197,253,0.8) 0%, transparent 60%)",
            }}
          />
          <MapPin className="relative z-10 h-3.5 w-3.5 text-blue-200 drop-shadow-[0_0_8px_rgba(147,197,253,0.8)] shrink-0" />
          <span className="relative z-10 text-blue-50 drop-shadow-sm font-semibold">
            Plateforme de transport <span className="text-blue-300 font-black px-1">·</span> Madagascar
          </span>
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-[3rem] font-extrabold text-center tracking-tight leading-tight mb-6 max-w-3xl"
          style={{ color: "#2d3748" }}
        >
          Expédiez vos marchandises en toute{" "}
          <span className="text-blue-600">simplicité</span>
        </h1>
        <p className="text-slate-500 text-center max-w-xl mb-14 text-base leading-relaxed">
          Trouvez un transporteur fiable sur les grands axes malgaches. Comparez
          les trajets, réservez en ligne et suivez vos colis en temps réel.
        </p>

        {/* Functional search + results */}
        <SearchSection />

        {/* Trust markers */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {[
            "Inscription gratuite",
            "Aucune commission cachée",
            "Transporteurs vérifiés",
          ].map((text) => (
            <span
              key={text}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 text-sm font-medium"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              {text}
            </span>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/[0.06] shadow-xl">
            {stats.map(({ label, value, icon: Icon, desc }) => (
              <div
                key={label}
                className="group flex flex-col items-center text-center px-6 py-10 bg-zinc-950 hover:bg-zinc-900 transition-colors duration-300"
              >
                {/* icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-5 bg-white/[0.04] border border-white/[0.07] transition-all duration-300">
                  <Icon className="h-5 w-5 text-indigo-400" />
                </div>

                {/* value */}
                <div className="text-4xl font-extrabold tracking-tight mb-1 text-white">
                  {value}
                </div>

                {/* label */}
                <p className="text-sm font-semibold text-zinc-300 mb-1">{label}</p>

                {/* desc */}
                <p className="text-xs text-zinc-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="fonctionnalites" className="py-28 bg-zinc-950 relative overflow-hidden">
        {/* Ambient background glows */}
        <div aria-hidden className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute -top-32 left-1/4 w-130 h-105 rounded-full bg-blue-700/10 blur-[110px]" />
          <div className="absolute bottom-0 right-1/4 w-120 h-100 rounded-full bg-violet-700/10 blur-[110px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-225 h-75 bg-indigo-900/10 blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 text-blue-400 text-xs font-semibold px-4 py-1.5 tracking-widest uppercase mb-5">
              <Sparkles className="h-3 w-3" />
              Ce que vous y trouvez
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">
              Simple, pas compliqué
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              On a conçu Covam pour que n&apos;importe qui puisse s&apos;y
              retrouver dès la première utilisation.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, description, color, iconBg, iconBorder, lineGradient, cornerGlow, bottomEdge }, idx) => (
              <div
                key={title}
                className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-500 bg-white/[2.5] hover:bg-white/[4.5] border border-white/7 hover:border-white/[11]"
              >
                {/* Corner glow on hover */}
                <div
                  aria-hidden
                  className="absolute -top-12 -left-12 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: cornerGlow }}
                />

                {/* Inner content */}
                <div className="relative flex flex-col flex-1 p-7">
                  {/* Top: icon + index number */}
                  <div className="flex items-center justify-between mb-7">
                    <div
                      className="flex items-center justify-center w-12 h-12 rounded-xl transition-transform duration-300 group-hover:scale-110"
                      style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
                    >
                      <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                    <span
                      className="text-5xl font-black leading-none tabular-nums select-none"
                      style={{ color: "rgba(255,255,255,0.05)" }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* ── Separator line with animated light sweep ── */}
                  <div className="relative h-px mb-7 overflow-hidden">
                    {/* Base line */}
                    <div className="absolute inset-0" style={{ background: "rgba(255,255,255,0.07)" }} />
                    {/* Animated glow sweep */}
                    <div
                      className="absolute top-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700 ease-out"
                      style={{ background: lineGradient }}
                    />
                  </div>

                  {/* Text content */}
                  <div className="flex-1">
                    <h3 className="text-[15px] font-bold text-white mb-3 leading-snug">
                      {title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>

                {/* Bottom edge glow on hover */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: bottomEdge }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="comment-ca-marche" className="py-24 bg-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mt-32 -mr-32 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-32 -ml-32 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-blue-50/80 text-blue-600 text-xs font-semibold px-4 py-1.5 tracking-widest uppercase mb-4 shadow-xs border border-blue-100/50">
              Comment ça marche
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight">
              En quatre étapes <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">chrono</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Que vous envoyiez un colis ou que vous proposiez vos services, le
              parcours est court et clair.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Client steps */}
            <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_60px_-15px_rgba(59,130,246,0.1)] transition-all duration-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-blue-50 to-transparent rounded-full blur-3xl opacity-50 -z-10 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="inline-flex items-center gap-2.5 bg-blue-50 text-blue-700 rounded-2xl px-5 py-2.5 text-sm font-bold mb-10 border border-blue-100/50">
                <Users className="h-4.5 w-4.5" />
                Pour les clients
              </div>
              
              <div className="space-y-8 relative">
                {/* Connecting line */}
                <div className="absolute left-[1.35rem] top-8 bottom-8 w-px bg-linear-to-b from-blue-100 via-blue-100/50 to-transparent -z-10" />
                
                {clientSteps.map(({ step, title, desc }, idx) => (
                  <div key={step} className="flex gap-6 relative group/step">
                    <div className="shrink-0 w-11 h-11 bg-white border-2 border-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-extrabold text-sm shadow-sm group-hover/step:border-blue-500 group-hover/step:bg-blue-50 transition-colors duration-300">
                      {step}
                    </div>
                    <div className="pt-2">
                      <h4 className="text-base font-bold text-slate-900 mb-2 group-hover/step:text-blue-600 transition-colors duration-300">{title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button
                asChild
                size="lg"
                className="mt-12 bg-slate-950 hover:bg-black text-white hover:text-white shadow-xl shadow-slate-900/10 rounded-2xl px-8 w-full sm:w-auto font-semibold hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)] transition-all duration-300"
              >
                <Link href="/auth/register">
                  Je suis client <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Transporteur steps */}
            <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_60px_-15px_rgba(79,70,229,0.1)] transition-all duration-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-indigo-50 to-transparent rounded-full blur-3xl opacity-50 -z-10 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="inline-flex items-center gap-2.5 bg-indigo-50 text-indigo-700 rounded-2xl px-5 py-2.5 text-sm font-bold mb-10 border border-indigo-100/50">
                <Truck className="h-4.5 w-4.5" />
                Pour les transporteurs
              </div>
              
              <div className="space-y-8 relative">
                {/* Connecting line */}
                <div className="absolute left-[1.35rem] top-8 bottom-8 w-px bg-linear-to-b from-indigo-100 via-indigo-100/50 to-transparent -z-10" />
                
                {transporteurSteps.map(({ step, title, desc }, idx) => (
                  <div key={step} className="flex gap-6 relative group/step">
                    <div className="shrink-0 w-11 h-11 bg-white border-2 border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-extrabold text-sm shadow-sm group-hover/step:border-indigo-500 group-hover/step:bg-indigo-50 transition-colors duration-300">
                      {step}
                    </div>
                    <div className="pt-2">
                      <h4 className="text-base font-bold text-slate-900 mb-2 group-hover/step:text-indigo-600 transition-colors duration-300">{title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button
                asChild
                size="lg"
                className="mt-12 bg-slate-950 hover:bg-black text-white hover:text-white shadow-xl shadow-slate-900/10 rounded-2xl px-8 w-full sm:w-auto font-semibold hover:shadow-[0_0_30px_-5px_rgba(79,70,229,0.4)] transition-all duration-300"
              >
                <Link href="/auth/register">
                  Je suis transporteur <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-amber-100 text-amber-700 text-xs font-semibold px-4 py-1.5 tracking-widest uppercase mb-4">
              Ils nous font confiance
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
              Ce qu&apos;ils en disent
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Harisoa R.",
                role: "Commerçante, Antananarivo",
                quote:
                  "J'envoie des marchandises chaque semaine à Toamasina. Avant Covam, je passais des heures à trouver un camion. Maintenant c'est réglé en 5 minutes.",
                stars: 5,
              },
              {
                name: "Jean-Pierre M.",
                role: "Transporteur, Fianarantsoa",
                quote:
                  "La plateforme m'a permis de remplir mes camions même pour les petits trajets. Mon chiffre d'affaires a grimpé de 40% en trois mois.",
                stars: 5,
              },
              {
                name: "Voahangy T.",
                role: "Importatrice, Mahajanga",
                quote:
                  "Le suivi des réservations et le paiement sécurisé, c'est exactement ce dont on avait besoin. Je ne peux plus m'en passer.",
                stars: 5,
              },
            ].map(({ name, role, quote, stars }) => (
              <div
                key={name}
                className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-6">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{name}</div>
                    <div className="text-xs text-slate-500">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1.5px, transparent 1.5px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="absolute -top-20 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 right-1/3 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 tracking-tight">
            Prêt à essayer ?
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-xl mx-auto leading-relaxed">
            L&apos;inscription ne prend pas plus de deux minutes. Pas de carte
            bancaire, pas d&apos;engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 shadow-2xl font-bold px-9 text-base rounded-xl"
            >
              <Link href="/auth/register">Je démarre maintenant</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/30 text-white bg-white/10 hover:bg-white/20 px-9 text-base rounded-xl backdrop-blur-sm"
            >
              <Link href="/auth/login">Se connecter</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" className="bg-zinc-950 text-white/70">

        {/* top accent line */}
        <div className="h-px w-full bg-white/[0.06]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">

          {/* Brand + tagline */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-10">
            <div>
              <p className="text-3xl font-extrabold text-white tracking-tight leading-none mb-2">
                COVAM
              </p>
              <p className="text-sm text-white/40 max-w-xs leading-relaxed">
                La plateforme qui connecte les expéditeurs et les transporteurs
                sur tous les grands axes de Madagascar.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-white/30 uppercase tracking-widest">Actif · Madagascar</span>
            </div>
          </div>

          {/* separator */}
          <div className="h-px bg-white/[0.06] mb-10" />

          {/* 3-col links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pb-10">

            {/* Plateforme */}
            <div>
              <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-5">
                Plateforme
              </h4>
              <ul className="space-y-3 text-sm">
                {[
                  { href: "/auth/register", label: "Créer un compte" },
                  { href: "/auth/login", label: "Se connecter" },
                  { href: "#comment-ca-marche", label: "Comment ça marche" },
                  { href: "#fonctionnalites", label: "Fonctionnalités" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="text-white/45 hover:text-white transition-colors duration-200"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Utilisateurs */}
            <div>
              <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-5">
                Utilisateurs
              </h4>
              <ul className="space-y-3 text-sm">
                {[
                  { href: "/client/dashboard", label: "Espace client" },
                  { href: "/transporteur/dashboard", label: "Espace transporteur" },
                  { href: "/auth/register", label: "Inscription gratuite" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="text-white/45 hover:text-white transition-colors duration-200"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-5">
                Contact
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.07] flex items-center justify-center shrink-0">
                    <Mail className="h-3.5 w-3.5 text-white/50" />
                  </div>
                  <span className="text-white/45">contact@covam.mg</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.07] flex items-center justify-center shrink-0">
                    <Phone className="h-3.5 w-3.5 text-white/50" />
                  </div>
                  <span className="text-white/45">+261 XX XX XXX XX</span>
                </li>
              </ul>
            </div>
          </div>

          {/* separator */}
          <div className="h-px bg-white/[0.06] mb-6" />

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/25">
            <span>© {new Date().getFullYear()} Covam — Tous droits réservés.</span>
            <span className="uppercase tracking-widest">Plateforme de transport · Madagascar</span>
          </div>

        </div>
      </footer>
    </div>
  );
}

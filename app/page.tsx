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
      <section className="py-20 bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.03] rounded-3xl overflow-hidden border border-white/[0.04] shadow-2xl">
            {stats.map(({ label, value, icon: Icon, desc }) => (
              <div
                key={label}
                className="group flex flex-col items-center text-center px-6 py-10 bg-slate-900/90 hover:bg-slate-800 transition-colors duration-300 backdrop-blur-sm"
              >
                {/* icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-5 bg-white/[0.04] border border-white/[0.07] transition-all duration-300 shadow-inner">
                  <Icon className="h-5 w-5 text-blue-400 group-hover:text-blue-300 group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.5)] transition-all" />
                </div>

                {/* value */}
                <div className="text-4xl font-extrabold tracking-tight mb-1 text-white">
                  {value}
                </div>

                {/* label */}
                <p className="text-sm font-semibold text-slate-300 mb-1">{label}</p>

                {/* desc */}
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="fonctionnalites" className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Ambient background glows */}
        <div aria-hidden className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute -top-32 left-1/4 w-130 h-105 rounded-full bg-blue-600/10 blur-[110px]" />
          <div className="absolute bottom-0 right-1/4 w-120 h-100 rounded-full bg-indigo-600/10 blur-[110px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-225 h-75 bg-blue-900/15 blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-300 text-xs font-semibold px-4 py-1.5 tracking-widest uppercase mb-5">
              <Sparkles className="h-3 w-3" />
              Ce que vous y trouvez
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 tracking-tight">
              Simple, pas compliqué
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              On a conçu Covam pour que n&apos;importe qui puisse s&apos;y
              retrouver dès la première utilisation.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, description, color, iconBg, iconBorder, lineGradient, cornerGlow, bottomEdge }, idx) => (
              <div
                key={title}
                className="group relative flex flex-col rounded-[1.5rem] overflow-hidden transition-all duration-500 bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700 hover:border-slate-600 backdrop-blur-sm"
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
                      className="flex items-center justify-center w-12 h-12 rounded-[1rem] transition-transform duration-300 group-hover:scale-110 shadow-inner"
                      style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
                    >
                      <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                    <span
                      className="text-5xl font-black leading-none tabular-nums select-none"
                      style={{ color: "rgba(255,255,255,0.03)" }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* ── Separator line with animated light sweep ── */}
                  <div className="relative h-px mb-7 overflow-hidden rounded-full">
                    {/* Base line */}
                    <div className="absolute inset-0 bg-slate-700/50" />
                    {/* Animated glow sweep */}
                    <div
                      className="absolute top-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700 ease-out"
                      style={{ background: lineGradient }}
                    />
                  </div>

                  {/* Text content */}
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-white mb-3 leading-snug">
                      {title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block border border-slate-200 text-slate-600 text-xs font-bold px-4 py-1.5 tracking-[0.2em] uppercase mb-4 shadow-sm bg-white">
              Comment ça marche
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight">
              En quatre étapes chrono
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Que vous envoyiez un colis ou que vous proposiez vos services, le
              parcours est court et clair.
            </p>
          </div>

          {/* Unified Square Line Layout Container */}
          <div className="grid lg:grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            {/* Client Section */}
            <div className="bg-white hover:bg-slate-50/50 transition-colors duration-500 flex flex-col">
              <div className="p-8 sm:p-10 bg-blue-50/30 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs"><Users className="h-5 w-5" /></span>
                  Pour les clients
                </h3>
                <span className="text-xs font-bold tracking-widest text-slate-400 uppercase hidden sm:block">Envoyer</span>
              </div>
              
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200">
                {clientSteps.map(({ step, title, desc }, idx) => (
                  <div key={step} className="bg-white p-8 flex flex-col hover:bg-blue-50/30 transition-colors duration-300 group">
                    <div className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-700 font-extrabold text-xs mb-6 shadow-sm group-hover:border-blue-300 group-hover:text-blue-600 group-hover:shadow-blue-100 transition-all">
                      {step}
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="p-6 sm:p-8 bg-white border-t border-slate-200 mt-auto">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-slate-900 hover:bg-blue-600 text-white shadow-xl shadow-slate-900/10 hover:shadow-blue-600/20 rounded-xl transition-all duration-300"
                >
                  <Link href="/auth/register">
                    Je suis client <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Transporteur Section */}
            <div className="bg-white hover:bg-slate-50/50 transition-colors duration-500 flex flex-col">
              <div className="p-8 sm:p-10 bg-indigo-50/30 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs"><Truck className="h-5 w-5" /></span>
                  Pour les transporteurs
                </h3>
                <span className="text-xs font-bold tracking-widest text-slate-400 uppercase hidden sm:block">Transporter</span>
              </div>
              
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200">
                {transporteurSteps.map(({ step, title, desc }) => (
                  <div key={step} className="bg-white p-8 flex flex-col hover:bg-indigo-50/30 transition-colors duration-300 group">
                    <div className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-700 font-extrabold text-xs mb-6 shadow-sm group-hover:border-indigo-300 group-hover:text-indigo-600 group-hover:shadow-indigo-100 transition-all">
                      {step}
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="p-6 sm:p-8 bg-white border-t border-slate-200 mt-auto">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-slate-900 hover:bg-indigo-600 text-white shadow-xl shadow-slate-900/10 hover:shadow-indigo-600/20 rounded-xl transition-all duration-300"
                >
                  <Link href="/auth/register">
                    Je suis transporteur <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block border border-slate-200 text-slate-600 text-xs font-bold px-4 py-1.5 tracking-[0.2em] uppercase mb-4 shadow-sm bg-white">
              Ils nous font confiance
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Ce qu&apos;ils en disent
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            {[
              {
                name: "Harisoa R.",
                role: "Commerçante, Antananarivo",
                quote:
                  "J'envoie des marchandises chaque semaine à Toamasina. Avant Covam, je passais des heures à trouver un camion. Maintenant c'est réglé en 5 minutes.",
                stars: 5,
                colorHover: "hover:bg-amber-50/50"
              },
              {
                name: "Jean-Pierre M.",
                role: "Transporteur, Fianarantsoa",
                quote:
                  "La plateforme m'a permis de remplir mes camions même pour les petits trajets. Mon chiffre d'affaires a grimpé de 40% en trois mois.",
                stars: 5,
                colorHover: "hover:bg-blue-50/50"
              },
              {
                name: "Voahangy T.",
                role: "Importatrice, Mahajanga",
                quote:
                  "Le suivi des réservations et le paiement sécurisé, c'est exactement ce dont on avait besoin. Je ne peux plus m'en passer.",
                stars: 5,
                colorHover: "hover:bg-emerald-50/50"
              },
            ].map(({ name, role, quote, stars, colorHover }) => (
              <div
                key={name}
                className={`bg-white p-8 sm:p-10 flex flex-col justify-between ${colorHover} transition-colors duration-500 group`}
              >
                <div>
                  <div className="flex gap-1 mb-8">
                    {Array.from({ length: stars }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-slate-300 text-slate-300 group-hover:fill-amber-400 group-hover:text-amber-400 transition-colors duration-300"
                      />
                    ))}
                  </div>
                  <p className="text-slate-700 text-base leading-relaxed mb-10 font-medium">
                    &ldquo;{quote}&rdquo;
                  </p>
                </div>
                
                <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-lg group-hover:bg-slate-900 group-hover:border-slate-900 group-hover:text-white transition-all duration-300">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{name}</div>
                    <div className="text-xs text-slate-500 font-medium tracking-wide uppercase mt-0.5">{role}</div>
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

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
} from "lucide-react";

const stats = [
  { label: "Transporteurs inscrits", value: "120+", icon: Truck },
  { label: "Clients", value: "400+", icon: Users },
  { label: "Livraisons effectuées", value: "1 800+", icon: Package },
  { label: "Villes desservies", value: "10+", icon: MapPin },
];

const features = [
  {
    icon: Zap,
    title: "Trouvez un transporteur vite",
    description:
      "Plus besoin de passer des heures à appeler. En quelques clics, vous voyez les trajets disponibles et vous réservez.",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: Shield,
    title: "Paiements en toute confiance",
    description:
      "Le paiement ne part que quand la livraison est confirmée. Pas de stress, pas de mauvaises surprises.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: BarChart3,
    title: "Gardez un œil sur vos colis",
    description:
      "Date de départ, statut de la réservation, historique — tout est dans votre tableau de bord, accessible où vous êtes.",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    icon: Globe,
    title: "Trajets partout à Madagascar",
    description:
      "Antananarivo, Toamasina, Mahajanga, Fianarantsoa… les transporteurs couvrent les grands axes comme les régions.",
    color: "text-violet-500",
    bg: "bg-violet-50",
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
      <section className="flex flex-col items-center justify-center px-4 pt-20 pb-8 bg-linear-to-b from-white to-slate-50">
        <span className="inline-block rounded-full bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 tracking-widest uppercase mb-5">
          Plateforme de transport · Madagascar
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-[3rem] font-extrabold text-slate-900 text-center tracking-tight leading-tight mb-4 max-w-3xl">
          Expédiez vos marchandises en toute{" "}
          <span className="text-blue-600">simplicité</span>
        </h1>
        <p className="text-slate-500 text-center max-w-xl mb-10 text-base leading-relaxed">
          Trouvez un transporteur fiable sur les grands axes malgaches. Comparez
          les trajets, réservez en ligne et suivez vos colis en temps réel.
        </p>

        {/* Functional search + results */}
        <SearchSection />

        {/* Trust markers */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-slate-400 text-sm">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Inscription gratuite
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Aucune commission cachée
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Transporteurs vérifiés
          </span>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 bg-white border-t border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center group">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 group-hover:bg-blue-100 rounded-2xl mb-3 transition-colors">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>
                <div className="text-4xl font-extrabold text-slate-900 mb-1 tracking-tight">
                  {value}
                </div>
                <div className="text-sm text-slate-500 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="fonctionnalites" className="py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 tracking-widest uppercase mb-4">
              Ce que vous y trouvez
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-5 tracking-tight">
              Simple, pas compliqué
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              On a conçu Covam pour que n&apos;importe qui puisse s&apos;y
              retrouver dès la première utilisation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description, color, bg }) => (
              <div
                key={title}
                className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100/80 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
              >
                <div
                  className={`inline-flex items-center justify-center w-13 h-13 ${bg} rounded-2xl mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2.5">
                  {title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="comment-ca-marche" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 tracking-widest uppercase mb-4">
              Comment ça marche
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-5 tracking-tight">
              En quatre étapes chrono
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Que vous envoyiez un colis ou que vous proposiez vos services, le
              parcours est court et clair.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Client steps */}
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-3xl p-9">
              <div className="inline-flex items-center gap-2 bg-blue-600 text-white rounded-xl px-4 py-2 text-sm font-semibold mb-8 shadow-md shadow-blue-500/30">
                <Users className="h-4 w-4" />
                Pour les clients
              </div>
              <div className="space-y-7">
                {clientSteps.map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-5">
                    <div className="shrink-0 w-11 h-11 bg-white border border-blue-100 rounded-full flex items-center justify-center text-blue-700 font-extrabold text-xs shadow-sm">
                      {step}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                asChild
                className="mt-9 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 rounded-xl px-6"
              >
                <Link href="/auth/register">
                  Je suis client <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Transporteur steps */}
            <div className="bg-linear-to-br from-indigo-50 to-violet-50 rounded-3xl p-9">
              <div className="inline-flex items-center gap-2 bg-indigo-600 text-white rounded-xl px-4 py-2 text-sm font-semibold mb-8 shadow-md shadow-indigo-500/30">
                <Truck className="h-4 w-4" />
                Pour les transporteurs
              </div>
              <div className="space-y-7">
                {transporteurSteps.map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-5">
                    <div className="shrink-0 w-11 h-11 bg-white border border-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-extrabold text-xs shadow-sm">
                      {step}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                asChild
                className="mt-9 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 rounded-xl px-6"
              >
                <Link href="/auth/register">
                  Je suis transporteur <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-28 bg-slate-50">
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
      <section className="py-28 relative overflow-hidden">
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
      <footer id="contact" className="bg-[#0D1B3E] text-white/70">
        <div className="h-1 w-full bg-linear-to-r from-blue-500/80 via-blue-500 to-blue-500/40" />

        <div className="max-w-5xl mx-auto px-4 pt-14 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/10">
            {/* Brand */}
            <div>
              <p className="text-2xl font-extrabold text-white mb-3 tracking-tight">
                COVAM
              </p>
              <p className="text-sm leading-relaxed text-white/55 max-w-xs">
                COVAM est né d&apos;un constat simple : trouver un transporteur
                fiable à Madagascar prend trop de temps. On a voulu changer ça.
              </p>
              <div className="mt-6 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-xs text-white/40 uppercase tracking-widest">
                  Madagascar
                </span>
              </div>
            </div>

            {/* Liens */}
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">
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
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60 group-hover:bg-blue-400 transition-colors shrink-0" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">
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
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.08] tracking-tight mb-5">
            Envoyez votre colis
            <span className="block text-blue-600">partout à Madagascar</span>
          </h1>
          <p className="max-w-xl mx-auto text-lg text-slate-500 mb-10 leading-relaxed">
            Trouvez un transporteur de confiance, comparez les trajets et réservez en quelques clics.
          </p>

          {/* ── Search card ── */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-2">
              <div className="flex flex-col sm:flex-row items-stretch divide-y sm:divide-y-0 sm:divide-x divide-slate-100">

                {/* Départ */}
                <div className="flex-1 flex items-center gap-3 px-5 py-4">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <div className="flex flex-col items-start w-full">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
                      Départ
                    </label>
                    <input
                      type="text"
                      placeholder="D'où partez-vous ?"
                      className="w-full text-sm text-slate-800 placeholder:text-slate-400 bg-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Destination */}
                <div className="flex-1 flex items-center gap-3 px-5 py-4">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <div className="flex flex-col items-start w-full">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
                      Destination
                    </label>
                    <input
                      type="text"
                      placeholder="Où livrer ?"
                      className="w-full text-sm text-slate-800 placeholder:text-slate-400 bg-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="flex-1 flex items-center gap-3 px-5 py-4">
                  <CalendarDays className="h-4 w-4 text-slate-400 shrink-0" />
                  <div className="flex flex-col items-start w-full">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full text-sm text-slate-800 bg-transparent outline-none scheme-light"
                    />
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center p-2">
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-5 rounded-xl"
                  >
                    <Link href="/auth/register" className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Rechercher
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Trust markers */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-slate-400 text-sm">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Inscription gratuite
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Aucune commission cachée
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Transporteurs vérifiés
              </span>
            </div>
=======
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
>>>>>>> d3d7c4609e23314e54ab3d6ecd32b4e12b6f3987
          </div>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white font-bold px-8 uppercase tracking-wide shrink-0"
          >
            Rechercher
          </Button>
        </form>

<<<<<<< HEAD
      {/* ── Stats ── */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center group">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 group-hover:bg-blue-100 rounded-2xl mb-3 transition-colors">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>
                <div className="text-4xl font-extrabold text-slate-900 mb-1 tracking-tight">
                  {value}
                </div>
                <div className="text-sm text-slate-500 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="fonctionnalites" className="py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 tracking-widest uppercase mb-4">
              Ce que vous y trouvez
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-5 tracking-tight">
              Simple, pas compliqué
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              On a conçu Covam pour que n&apos;importe qui puisse s&apos;y retrouver dès la première utilisation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description, color, bg }) => (
              <div
                key={title}
                className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100/80 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
              >
                <div
                  className={`inline-flex items-center justify-center w-13 h-13 ${bg} rounded-2xl mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2.5">
                  {title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="comment-ca-marche" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 tracking-widest uppercase mb-4">
              Comment ça marche
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-5 tracking-tight">
              En quatre étapes chrono
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Que vous envoyiez un colis ou que vous proposiez vos services, le parcours est court et clair.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Client steps */}
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-3xl p-9">
              <div className="inline-flex items-center gap-2 bg-blue-600 text-white rounded-xl px-4 py-2 text-sm font-semibold mb-8 shadow-md shadow-blue-500/30">
                <Users className="h-4 w-4" />
                Pour les clients
              </div>
              <div className="space-y-7">
                {clientSteps.map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-5">
                    <div className="shrink-0 w-11 h-11 bg-white border border-blue-100 rounded-full flex items-center justify-center text-blue-700 font-extrabold text-xs shadow-sm">
                      {step}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">
                        {title}
                      </h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                asChild
                className="mt-9 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 rounded-xl px-6"
              >
                <Link href="/auth/register">
                  Je suis client <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Transporteur steps */}
            <div className="bg-linear-to-br from-indigo-50 to-violet-50 rounded-3xl p-9">
              <div className="inline-flex items-center gap-2 bg-indigo-600 text-white rounded-xl px-4 py-2 text-sm font-semibold mb-8 shadow-md shadow-indigo-500/30">
                <Truck className="h-4 w-4" />
                Pour les transporteurs
              </div>
              <div className="space-y-7">
                {transporteurSteps.map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-5">
                    <div className="shrink-0 w-11 h-11 bg-white border border-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-extrabold text-xs shadow-sm">
                      {step}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">
                        {title}
                      </h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                asChild
                className="mt-9 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 rounded-xl px-6"
              >
                <Link href="/auth/register">
                  Je suis transporteur <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-28 bg-slate-50">
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
                quote: "J'envoie des marchandises chaque semaine à Toamasina. Avant Covam, je passais des heures à trouver un camion. Maintenant c'est réglé en 5 minutes.",
                stars: 5,
              },
              {
                name: "Jean-Pierre M.",
                role: "Transporteur, Fianarantsoa",
                quote: "La plateforme m'a permis de remplir mes camions même pour les petits trajets. Mon chiffre d'affaires a grimpé de 40% en trois mois.",
                stars: 5,
              },
              {
                name: "Voahangy T.",
                role: "Importatrice, Mahajanga",
                quote: "Le suivi des réservations et le paiement sécurisé, c'est exactement ce dont on avait besoin. Je ne peux plus m'en passer.",
                stars: 5,
              },
            ].map(({ name, role, quote, stars }) => (
              <div
                key={name}
                className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-6">&ldquo;{quote}&rdquo;</p>
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
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)",
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
            L&apos;inscription ne prend pas plus de deux minutes. Pas de carte bancaire, pas d&apos;engagement.
=======
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
>>>>>>> d3d7c4609e23314e54ab3d6ecd32b4e12b6f3987
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
<<<<<<< HEAD
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 shadow-2xl font-bold px-9 text-base rounded-xl"
=======
              className="bg-primary hover:bg-primary/90 text-white px-8"
>>>>>>> d3d7c4609e23314e54ab3d6ecd32b4e12b6f3987
            >
              <Link href="/auth/register">Je démarre maintenant</Link>
            </Button>
            <Button
              asChild
              variant="outline"
<<<<<<< HEAD
              className="border-white/30 text-white bg-white/10 hover:bg-white/20 px-9 text-base rounded-xl backdrop-blur-sm"
=======
              className="border-primary text-primary hover:bg-primary/5 px-8"
>>>>>>> d3d7c4609e23314e54ab3d6ecd32b4e12b6f3987
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

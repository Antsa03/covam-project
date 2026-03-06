import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Truck,
  Package,
  Shield,
  MapPin,
  Users,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Globe,
  Zap,
  ChevronRight,
  Phone,
  Mail,
  Search,
  CalendarDays,
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
    desc: "Dès qu'un client réserve sur une de vos annonces, vous êtes notifié et vous pouvez confirmer.",
  },
  {
    step: "04",
    title: "Effectuez le transport",
    desc: "Livrez la marchandise et clôturez la réservation. Le paiement est enregistré dans votre espace.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar ── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg p-1.5">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Covam</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a
              href="#fonctionnalites"
              className="hover:text-blue-600 transition-colors"
            >
              Fonctionnalités
            </a>
            <a
              href="#comment-ca-marche"
              className="hover:text-blue-600 transition-colors"
            >
              Comment ça marche
            </a>
            <a
              href="#contact"
              className="hover:text-blue-600 transition-colors"
            >
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/auth/login">Se connecter</Link>
            </Button>
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Link href="/auth/register">
                S&apos;inscrire <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative pt-16 min-h-[92vh] flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-linear-to-br from-[#0f172a] via-[#0d2b5e] to-[#0c1a4e]" />
        {/* Mesh grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        {/* Glow orbs */}
        <div className="absolute -top-10 left-1/4 w-150 h-150 bg-blue-600/25 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-100 h-100 bg-indigo-500/20 rounded-full blur-[100px]" />
        <div className="absolute top-40 right-10 w-70 h-70 bg-cyan-400/10 rounded-full blur-[80px]" />

        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm text-blue-200 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            🇲🇬 Plateforme malgache de transport de marchandises
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-extrabold text-white leading-[1.08] tracking-tight mb-6">
            Envoyez votre marchandise
            <span className="block mt-1 text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-cyan-300 to-sky-400">
              partout à Madagascar
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-300/90 mb-12 leading-relaxed">
            Trouvez un transporteur de confiance en quelques clics. Comparez les trajets, réservez et suivez votre colis en temps réel.
          </p>

          {/* ── Search card ── */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.45)] p-2 sm:p-2.5">
              <div className="flex flex-col sm:flex-row items-stretch gap-0 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                {/* Départ */}
                <div className="flex-1 flex items-center gap-3 px-4 py-3.5 group">
                  <MapPin className="h-5 w-5 text-blue-500 shrink-0" />
                  <div className="flex flex-col items-start w-full">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
                      Départ
                    </label>
                    <input
                      type="text"
                      placeholder="D'où partez-vous ?"
                      className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Destination */}
                <div className="flex-1 flex items-center gap-3 px-4 py-3.5 group">
                  <MapPin className="h-5 w-5 text-indigo-500 shrink-0" />
                  <div className="flex flex-col items-start w-full">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
                      Destination
                    </label>
                    <input
                      type="text"
                      placeholder="Où livrer ?"
                      className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="flex-1 flex items-center gap-3 px-4 py-3.5 group">
                  <CalendarDays className="h-5 w-5 text-blue-400 shrink-0" />
                  <div className="flex flex-col items-start w-full">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-transparent outline-none scheme-light"
                    />
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-center p-2 sm:pl-2">
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold px-7 py-6 rounded-xl shadow-lg shadow-blue-600/40 transition-all duration-200 hover:shadow-blue-500/50 hover:-translate-y-px"
                  >
                    <Link href="/auth/register" className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Rechercher
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Trust markers */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-2.5 text-slate-400 text-sm">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Inscription gratuite
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Aucune commission cachée
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Transporteurs vérifiés
              </span>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 inset-x-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="white"/>
          </svg>
        </div>
      </section>

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
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 shadow-2xl font-bold px-9 text-base rounded-xl"
            >
              <Link href="/auth/register">Créer un compte gratuit</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 text-white bg-white/10 hover:bg-white/20 px-9 text-base rounded-xl backdrop-blur-sm"
            >
              <Link href="/auth/login">Se connecter</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" className="bg-slate-950 text-slate-400 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-600 rounded-lg p-1.5">
                  <Truck className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Covam</span>
              </div>
              <p className="text-sm leading-relaxed">
                Covam est né d&apos;un constat simple : trouver un transporteur
                fiable à Madagascar prend trop de temps. On a voulu changer ça.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-10">
              <div>
                <h4 className="text-white font-semibold mb-4 text-sm">
                  Plateforme
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/auth/register"
                      className="hover:text-white transition-colors"
                    >
                      S&apos;inscrire
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth/login"
                      className="hover:text-white transition-colors"
                    >
                      Se connecter
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#fonctionnalites"
                      className="hover:text-white transition-colors"
                    >
                      Fonctionnalités
                    </a>
                  </li>
                  <li>
                    <a
                      href="#comment-ca-marche"
                      className="hover:text-white transition-colors"
                    >
                      Comment ça marche
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4 text-sm">
                  Contact
                </h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    contact@covam.com
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    +261 XX XX XXX XX
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 text-sm text-center">
            © {new Date().getFullYear()} Covam. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}

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
      <section className="flex flex-col items-center justify-center px-4 pt-36 pb-16 bg-linear-to-b from-white to-slate-50">
        <span className="relative inline-flex items-center gap-2 rounded-full px-5 py-1.5 text-xs font-semibold tracking-widest uppercase mb-8 text-white/90 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 2px 12px rgba(0,0,0,0.3)",
          }}
        >
          {/* dust layer */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(99,102,241,0.35) 0%, transparent 55%), radial-gradient(circle at 80% 70%, rgba(59,130,246,0.25) 0%, transparent 50%), radial-gradient(circle at 55% 10%, rgba(255,255,255,0.06) 0%, transparent 40%)",
            }}
          />
          <Sparkles className="h-3 w-3 text-blue-400 shrink-0" />
          Plateforme de transport · Madagascar
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
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-slate-400 text-sm">
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
      <section className="py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #09090b 0%, #111117 50%, #09090b 100%)" }}
      >
        {/* ambient dust */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(234,179,8,0.07) 0%, transparent 70%)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-32 rounded-full blur-3xl" style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.02) 0%, transparent 70%)" }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {stats.map(({ label, value, icon: Icon, desc }) => (
              <div
                key={label}
                className="group flex flex-col items-center text-center px-6 py-10 bg-white/[0.025] hover:bg-white/[0.055] transition-colors duration-300"
              >
                {/* icon */}
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-5 transition-all duration-300"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <Icon className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                </div>

                {/* value */}
                <div
                  className="text-4xl font-extrabold tracking-tight mb-1"
                  style={{
                    background: "linear-gradient(135deg, #ffffff 20%, #a1a1aa 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {value}
                </div>

                {/* label */}
                <p className="text-sm font-semibold mb-1" style={{ color: "#d4d4d8" }}>{label}</p>

                {/* desc */}
                <p className="text-xs" style={{ color: "#52525b" }}>{desc}</p>
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

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-blue-950 to-indigo-950" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-24 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30 text-sm px-4 py-1">
            🇲🇬 Plateforme malgache de transport de marchandises
          </Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6">
            Vous avez une
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300">
              marchandise à envoyer ?
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed">
            Covam met en relation des{" "}
            <strong className="text-white">expéditeurs</strong> et des{" "}
            <strong className="text-white">transporteurs</strong> à travers
            Madagascar. Que ce soit une caisse, des sacs de riz ou du matériel,
            trouvez le bon transport au bon prix.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/30 px-8 text-base"
            >
              <Link href="/auth/register">
                Commencer gratuitement <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 text-white bg-white/5 hover:bg-white/15 px-8 text-base"
            >
              <Link href="/auth/login">Se connecter</Link>
            </Button>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-slate-400 text-sm">
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
              Réseau de transporteurs vérifiés
            </span>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-14 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-3">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">
                  {value}
                </div>
                <div className="text-sm text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="fonctionnalites" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
              Ce que vous y trouvez
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Simple, pas compliqué
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              On a conçu Covam pour que quelqu&apos;un qui n&apos;a jamais
              utilisé ce genre d&apos;application puisse s&apos;y retrouver dès
              la première fois.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description, color, bg }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 ${bg} rounded-xl mb-4`}
                >
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">
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
      <section id="comment-ca-marche" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
              Comment ça marche
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              En quatre étapes chrono
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Que vous envoyiez un colis ou que vous proposiez vos services de
              transport, le parcours est le même : court et clair.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Client steps */}
            <div className="bg-slate-50 rounded-3xl p-8">
              <div className="inline-flex items-center gap-2 bg-blue-600 text-white rounded-xl px-4 py-2 text-sm font-semibold mb-8">
                <Users className="h-4 w-4" />
                Pour les clients
              </div>
              <div className="space-y-6">
                {clientSteps.map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">
                      {step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">
                        {title}
                      </h4>
                      <p className="text-sm text-slate-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                asChild
                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Link href="/auth/register">
                  Je suis client <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Transporteur steps */}
            <div className="bg-indigo-50 rounded-3xl p-8">
              <div className="inline-flex items-center gap-2 bg-indigo-600 text-white rounded-xl px-4 py-2 text-sm font-semibold mb-8">
                <Truck className="h-4 w-4" />
                Pour les transporteurs
              </div>
              <div className="space-y-6">
                {transporteurSteps.map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs">
                      {step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">
                        {title}
                      </h4>
                      <p className="text-sm text-slate-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                asChild
                className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Link href="/auth/register">
                  Je suis transporteur <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 50%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Prêt à essayer ?
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
            L&apos;inscription ne prend pas plus de deux minutes. Pas de carte
            bancaire, pas d&apos;engagement — vous pouvez supprimer votre compte
            à tout moment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 shadow-xl font-semibold px-8 text-base"
            >
              <Link href="/auth/register">Créer un compte gratuit</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 text-white bg-white/10 hover:bg-white/20 px-8 text-base"
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

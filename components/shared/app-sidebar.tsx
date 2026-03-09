"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { usePostsQuota } from "@/hooks/use-account";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Truck,
  LayoutDashboard,
  Users,
  Package,
  CalendarCheck,
  LogOut,
  Megaphone,
  CreditCard,
  BoxIcon,
  Shield,
  UserCircle,
} from "lucide-react";

type NavItem = { label: string; href: string; icon: React.ReactNode };
type NavGroup = { title: string; items: NavItem[] };

const NAV: Record<string, NavGroup[]> = {
  ADMIN: [
    {
      title: "Principal",
      items: [
        {
          label: "Tableau de bord",
          href: "/admin/dashboard",
          icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
          label: "Mon compte",
          href: "/admin/compte",
          icon: <UserCircle className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Gestion",
      items: [
        {
          label: "Utilisateurs",
          href: "/admin/users",
          icon: <Users className="h-4 w-4" />,
        },
        {
          label: "Transports",
          href: "/admin/transports",
          icon: <Truck className="h-4 w-4" />,
        },
        {
          label: "Annonces",
          href: "/admin/annonces",
          icon: <Megaphone className="h-4 w-4" />,
        },
        {
          label: "Réservations",
          href: "/admin/reservations",
          icon: <CalendarCheck className="h-4 w-4" />,
        },
        {
          label: "Cargo",
          href: "/admin/cargo",
          icon: <BoxIcon className="h-4 w-4" />,
        },
        {
          label: "Paiements",
          href: "/admin/paiements",
          icon: <CreditCard className="h-4 w-4" />,
        },
        {
          label: "Marchandises",
          href: "/admin/marchandise",
          icon: <Package className="h-4 w-4" />,
        },
      ],
    },
  ],
  TRANSPORTEUR: [
    {
      title: "Principal",
      items: [
        {
          label: "Tableau de bord",
          href: "/transporteur/dashboard",
          icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
          label: "Mon compte",
          href: "/transporteur/compte",
          icon: <UserCircle className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Mes services",
      items: [
        {
          label: "Mes transports",
          href: "/transporteur/transports",
          icon: <Truck className="h-4 w-4" />,
        },
        {
          label: "Mes annonces",
          href: "/transporteur/annonces",
          icon: <Megaphone className="h-4 w-4" />,
        },
        {
          label: "Réservations",
          href: "/transporteur/reservations",
          icon: <CalendarCheck className="h-4 w-4" />,
        },
        {
          label: "Cargo",
          href: "/transporteur/cargo",
          icon: <BoxIcon className="h-4 w-4" />,
        },
      ],
    },
  ],
  CLIENT: [
    {
      title: "Principal",
      items: [
        {
          label: "Tableau de bord",
          href: "/client/dashboard",
          icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
          label: "Mon compte",
          href: "/client/compte",
          icon: <UserCircle className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Mes services",
      items: [
        {
          label: "Annonces",
          href: "/client/annonces",
          icon: <Megaphone className="h-4 w-4" />,
        },
        {
          label: "Mes réservations",
          href: "/client/reservations",
          icon: <CalendarCheck className="h-4 w-4" />,
        },
        {
          label: "Mes marchandises",
          href: "/client/marchandise",
          icon: <Package className="h-4 w-4" />,
        },
        {
          label: "Mes paiements",
          href: "/client/paiements",
          icon: <CreditCard className="h-4 w-4" />,
        },
        {
          label: "Cargo",
          href: "/client/cargo",
          icon: <BoxIcon className="h-4 w-4" />,
        },
      ],
    },
  ],
  PARTICULIER: [
    {
      title: "Principal",
      items: [
        {
          label: "Tableau de bord",
          href: "/client/dashboard",
          icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
          label: "Mon compte",
          href: "/client/compte",
          icon: <UserCircle className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Mes services",
      items: [
        {
          label: "Annonces",
          href: "/client/annonces",
          icon: <Megaphone className="h-4 w-4" />,
        },
        {
          label: "Mes réservations",
          href: "/client/reservations",
          icon: <CalendarCheck className="h-4 w-4" />,
        },
        {
          label: "Mes marchandises",
          href: "/client/marchandise",
          icon: <Package className="h-4 w-4" />,
        },
        {
          label: "Mes paiements",
          href: "/client/paiements",
          icon: <CreditCard className="h-4 w-4" />,
        },
        {
          label: "Cargo",
          href: "/client/cargo",
          icon: <BoxIcon className="h-4 w-4" />,
        },
      ],
    },
  ],
};

const ROLE_META: Record<string, { label: string; color: string }> = {
  ADMIN: {
    label: "Administrateur",
    color: "bg-rose-50 text-rose-600 border-rose-200",
  },
  TRANSPORTEUR: {
    label: "Transporteur",
    color: "bg-primary/10 text-primary border-primary/20",
  },
  CLIENT: {
    label: "Client",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  PARTICULIER: {
    label: "Particulier",
    color: "bg-violet-50 text-violet-700 border-violet-200",
  },
};

// Ferme automatiquement la sidebar mobile lors d'un changement de route
function NavAutoClose() {
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();
  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);
  return null;
}

interface AppSidebarProps {
  children: React.ReactNode;
}

export function AppSidebar({ children }: AppSidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname() ?? "";
  const role = session?.user?.role ?? "CLIENT";
  const isParticulier = role === "PARTICULIER";
  const { data: quotaData } = usePostsQuota();
  const groups = NAV[role] ?? [];
  const compteHref =
    role === "ADMIN"
      ? "/admin/compte"
      : role === "TRANSPORTEUR"
        ? "/transporteur/compte"
        : "/client/compte";
  const roleMeta = ROLE_META[role];
  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "U";

  return (
    <SidebarProvider>
      <NavAutoClose />
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="icon">
          {/* ── Header ─────────────────────────────── */}
          <SidebarHeader className="pb-4 pt-5 px-3 border-b border-sidebar-border">
            {/* Logo row */}
            <div className="flex items-center px-1">
              <Image
                src="/img/covam.png"
                alt="Covam"
                width={120}
                height={36}
                className="h-20 w-auto object-contain group-data-[collapsible=icon]:hidden"
              />
              <Image
                src="/img/covam.png"
                alt="Covam"
                width={32}
                height={32}
                className="h-8 w-8 object-contain hidden group-data-[collapsible=icon]:block"
              />
            </div>
            {/* Role chip */}
            <div
              className={cn(
                "mt-3 mx-1 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                "border w-fit group-data-[collapsible=icon]:hidden",
                roleMeta.color,
              )}
            >
              <Shield className="h-3 w-3" />
              {roleMeta.label}
            </div>
          </SidebarHeader>

          {/* ── Nav ─────────────────────────────────── */}
          <SidebarContent className="px-2 py-3">
            {groups.map((group, gi) => (
              <SidebarGroup key={group.title} className={gi > 0 ? "mt-2" : ""}>
                <SidebarGroupLabel className="text-sidebar-foreground/30 text-[10px] font-bold uppercase tracking-[0.13em] px-2 mb-1 group-data-[collapsible=icon]:hidden">
                  {group.title}
                </SidebarGroupLabel>
                <SidebarMenu className="gap-0.5">
                  {group.items.map((item) => {
                    const active = pathname.startsWith(item.href);
                    return (
                      <SidebarMenuItem key={item.href} className="relative">
                        {/* Active left indicator */}
                        {active && (
                          <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.75 rounded-r-full bg-sidebar-primary group-data-[collapsible=icon]:hidden" />
                        )}
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={item.label}
                          className={cn(
                            "rounded-lg h-9 transition-all duration-150 group-data-[collapsible=icon]:justify-center",
                            active
                              ? "bg-sidebar-primary/15 text-sidebar-primary hover:bg-sidebar-primary/20 data-[active=true]:bg-sidebar-primary/15 data-[active=true]:text-sidebar-primary"
                              : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                          )}
                        >
                          <Link href={item.href}>
                            <span
                              className={cn(
                                "flex items-center justify-center h-6 w-6 rounded-md shrink-0 transition-colors",
                                "group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4 group-data-[collapsible=icon]:rounded-none group-data-[collapsible=icon]:bg-transparent!",
                                active
                                  ? "bg-sidebar-primary/15 text-sidebar-primary"
                                  : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80",
                              )}
                            >
                              {item.icon}
                            </span>
                            <span className="text-sm font-medium">
                              {item.label}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroup>
            ))}
          </SidebarContent>

          {/* ── Footer ──────────────────────────────── */}
          <SidebarFooter className="p-3 border-t border-sidebar-border">
            {/* Profile card */}
            <Link href={compteHref} className="flex items-center gap-2.5 rounded-xl bg-sidebar-accent/60 border border-sidebar-border px-3 py-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2 hover:bg-sidebar-accent transition-colors">
              <div className="relative shrink-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={session?.user?.image ?? undefined}
                    alt={session?.user?.name ?? ""}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-xs bg-sidebar-primary text-white font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-sidebar" />
              </div>
              <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="text-xs font-semibold text-sidebar-foreground truncate leading-tight">
                  {session?.user?.name}
                </p>
                <p className="text-[10px] text-sidebar-foreground/40 truncate leading-tight mt-0.5">
                  {session?.user?.email}
                </p>
              </div>
            </Link>
            {/* Logout */
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="mt-1.5 flex items-center gap-2 w-full rounded-lg px-3 py-2 text-xs font-medium text-sidebar-foreground/50 hover:text-rose-500 hover:bg-rose-50 transition-colors group-data-[collapsible=icon]:justify-center"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">
                Déconnexion
              </span>
            </button>
          </SidebarFooter>
        </Sidebar>

        {/* ── Main area ───────────────────────────── */}
        <div className="flex flex-1 flex-col min-w-0">
          <header className="flex h-14 items-center border-b px-4 gap-3 sticky top-0 bg-background/95 backdrop-blur-sm z-10 shadow-sm">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
            <div className="h-5 w-px bg-border" />
            <div className="flex flex-1 items-center gap-2 min-w-0">
              <span className="text-sm font-semibold text-foreground/80">
                {role === "ADMIN"
                  ? "Administration"
                  : role === "TRANSPORTEUR"
                    ? "Espace Transporteur"
                    : role === "PARTICULIER"
                      ? "Espace Particulier"
                      : "Espace Client"}
              </span>
            </div>
            {/* Quota pill – Particulier only (disabled) */}
            {/* {false && isParticulier && quotaData && quotaData.data ? (() => {
              const used = quotaData.data.postsThisMonth ?? 0;
              const total = quotaData.data?.monthlyLimit ?? 4;
              const remaining = Math.max(0, total - used);
              const pct = Math.min(100, Math.round((used / total) * 100));
              const color =
                remaining === 0
                  ? { ring: "ring-red-300", bar: "bg-red-500", text: "text-red-600", bg: "bg-red-50" }
                  : remaining === 1
                  ? { ring: "ring-amber-300", bar: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" }
                  : { ring: "ring-blue-300", bar: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50" };
              return (
                <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 border ring-1 ${color.ring} ${color.bg} shrink-0`}>
                  <div className="w-14 h-1.5 rounded-full bg-black/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color.bar} transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className={`text-[11px] font-semibold leading-none ${color.text} whitespace-nowrap`}>
                    {remaining === 0
                      ? "0 annonce restante ce mois"
                      : `${remaining} annonce${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""} ce mois`}
                  </span>
                </div>
              );
            })()} */}
            {/* Avatar shortcut top-right */}
            <Link href={compteHref} className="relative shrink-0">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={session?.user?.image ?? undefined}
                  alt={session?.user?.name ?? ""}
                  className="object-cover"
                />
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-background" />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

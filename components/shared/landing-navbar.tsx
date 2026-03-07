"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Truck, ArrowRight } from "lucide-react";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-white/60 shadow-[0_4px_30px_rgba(0,0,0,0.05)] supports-[backdrop-filter]:bg-white/80"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-1.5">
            <Truck className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">
            Covam
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-[0.92rem] font-semibold text-slate-800 tracking-tight">
          <a href="#fonctionnalites" className="hover:text-primary transition-colors">
            Fonctionnalités
          </a>
          <a href="#comment-ca-marche" className="hover:text-primary transition-colors">
            Comment ça marche
          </a>
          <a href="#contact" className="hover:text-primary transition-colors">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            asChild
            className="hidden sm:flex text-slate-800 font-semibold tracking-tight hover:text-primary hover:bg-primary/5"
          >
            <Link href="/auth/login">Se connecter</Link>
          </Button>
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/25 hover:shadow-[0_0_40px_-10px_rgba(33,71,170,0.6)] transition-all duration-300"
          >
            <Link href="/auth/register">
              S&apos;inscrire <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

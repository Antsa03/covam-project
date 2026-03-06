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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 rounded-lg p-1.5">
            <Truck className="h-5 w-5 text-white" />
          </div>
          <span
            className={`text-xl font-bold transition-colors duration-300 ${
              scrolled ? "text-slate-900" : "text-white"
            }`}
          >
            Covam
          </span>
        </div>

        <nav
          className={`hidden md:flex items-center gap-8 text-sm font-medium transition-colors duration-300 ${
            scrolled ? "text-slate-600" : "text-white/80"
          }`}
        >
          <a
            href="#fonctionnalites"
            className={`transition-colors ${
              scrolled ? "hover:text-blue-600" : "hover:text-white"
            }`}
          >
            Fonctionnalités
          </a>
          <a
            href="#comment-ca-marche"
            className={`transition-colors ${
              scrolled ? "hover:text-blue-600" : "hover:text-white"
            }`}
          >
            Comment ça marche
          </a>
          <a
            href="#contact"
            className={`transition-colors ${
              scrolled ? "hover:text-blue-600" : "hover:text-white"
            }`}
          >
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            asChild
            className={`hidden sm:flex transition-colors duration-300 ${
              scrolled
                ? "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                : "text-white/90 hover:text-white hover:bg-white/10"
            }`}
          >
            <Link href="/auth/login">Se connecter</Link>
          </Button>
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30"
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

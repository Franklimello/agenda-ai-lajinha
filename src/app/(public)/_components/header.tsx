"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LogIn, Menu } from "lucide-react";
import { useState } from "react";
import { useFirebaseSession } from "@/lib/use-firebase-session";

export function Header() {
  const { user, status } = useFirebaseSession();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [{ href: "#profissionais", label: "Profissionais" }];

  // 🔹 Links de navegação reutilizáveis (desktop e mobile)
  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Button
          key={item.href}
          asChild
          variant="ghost"
          className="text-zinc-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <Link href={item.href}>{item.label}</Link>
        </Button>
      ))}

      {/* Sessão de login / dashboard */}
      {status === "loading" ? (
        <></>
      ) : user ? (
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
        >
          Acessar painel
        </Link>
      ) : (
        <Button
          variant="default"
          asChild
          className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 transition-colors"
        >
          <Link href="/login">
            <LogIn className="w-4 h-4" />
            Portal do profissional
          </Link>
        </Button>
      )}
    </>
  );

  return (
    <header className="fixed top-0 right-0 left-0 z-[999] py-4 px-6 bg-white shadow-sm">
      {/* Container centralizado com espaçamento entre os elementos */}
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Marca */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-3xl font-extrabold tracking-tight text-zinc-900 hover:text-zinc-800 transition-colors select-none"
        >
          <span>Agenda</span>
          <span className="text-zinc-900">ai</span>
          <span className="text-emerald-500">lajinha</span>
        </Link>

        {/* Navegação (visível apenas em telas médias pra cima) */}
        <nav className="hidden md:flex items-center space-x-4">
          <NavLinks />
        </nav>

        {/* Menu lateral (mobile) */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          {/* Botão que abre o menu lateral */}
          <SheetTrigger asChild className="md:hidden">
            <Button
              className="text-black hover:bg-transparent"
              variant="ghost"
              size="icon"
            >
              <Menu className="w-7 h-7" />
            </Button>
          </SheetTrigger>

          {/* Conteúdo do menu lateral */}
          <SheetContent
            side="right"
            className="w-[240px] sm:w-[300px] z-[9999] p-6 bg-white flex flex-col justify-between"
          >
            {/* Cabeçalho do menu */}
            <div>
              <SheetHeader className="mb-4">
                <SheetTitle className="text-lg font-semibold text-zinc-900">
                  Menu
                </SheetTitle>
                <SheetDescription className="text-sm text-zinc-500">
                  Veja nossos links
                </SheetDescription>
              </SheetHeader>

              {/* Navegação principal */}
              <nav className="flex flex-col space-y-4 mt-6">
                <NavLinks />
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

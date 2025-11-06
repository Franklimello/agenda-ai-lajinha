"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { handleLogout } from "../_actions/logout";
import clsx from "clsx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  Banknote,
  Bell,
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  Folder,
  Home,
  List,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../../../public/logo-odonto.png";

export function SidebarDashboar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);

  async function onLogout() {
    try {
      // Fazer logout no Firebase Auth (cliente)
      if (typeof window !== "undefined") {
        try {
          const { signOut } = await import("firebase/auth");
          const { auth } = await import("@/lib/firebase");
          if (auth) {
            await signOut(auth);
          }
        } catch (error) {
          console.error("Erro ao fazer logout do Firebase:", error);
        }
      }

      // Deletar cookies no servidor e redirecionar
      await handleLogout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo com erro, tentar redirecionar
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* ==========================
          SIDEBAR FIXA (DESKTOP)
         ========================== */}
      <aside
        className={clsx(
          "flex flex-col border-r bg-background transition-all duration-300 p-4 h-screen fixed top-0 left-0 z-40 overflow-y-auto",
          {
            "w-20": isCollapsed, // recolhida
            "w-64": !isCollapsed, // expandida
            "hidden md:flex": true, // oculta no mobile, fixa no desktop
          }
        )}
      >
        {/* LOGO */}
        <div className="mb-6 mt-4">
          {!isCollapsed && (
            <div className="flex flex-col items-start gap-2">
              <Image
                src={Logo}
                alt="logo do site"
                priority
                quality={100}
                style={{ width: "auto", height: "auto" }}
              />
              <h2 className="text-lg font-bold text-gray-900">
                Agenda ai <span className="text-emerald-500">lajinha</span>
              </h2>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center">
              <div className="text-xs font-bold text-gray-900 text-center leading-tight">
                Agenda
                <br />
                <span className="text-emerald-500">ai</span>
              </div>
            </div>
          )}
        </div>

        {/* BOTÃO DE RECOLHER / EXPANDIR */}
        <Button
          className="bg-gray-100 hover:bg-gray-50 text-zinc-900 self-end mb-2"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {!isCollapsed ? (
            <ChevronLeft className="w-12 h-12" />
          ) : (
            <ChevronRight className="w-12 h-12" />
          )}
        </Button>

        {/* ==========================
            MODO RECOLHIDO
           ========================== */}
        {isCollapsed && (
          <div className="flex flex-col flex-1">
            <nav className="flex flex-col gap-1 overflow-hidden mt-2">
              <SidebarLink
                href="/"
                label="Início"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<Home className="w-5 h-5" />}
              />
              <SidebarLink
                href="/dashboard"
                label="Agendamentos"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<CalendarCheck2 className="w-5 h-5" />}
              />
              <SidebarLink
                href="/dashboard/service"
                label="Serviços"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<Folder className="w-5 h-5" />}
              />
              <SidebarLink
                href="/dashboard/reminders"
                label="Lembretes"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<Bell className="w-5 h-5" />}
              />
              <SidebarLink
                href="/dashboard/profile"
                label="Meu Perfil"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<Settings className="w-5 h-5" />}
              />
              <SidebarLink
                href="/dashboard/plans"
                label="Planos"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<Banknote className="w-5 h-5" />}
              />
            </nav>
            
            {/* Botão de Logout no modo recolhido */}
            <div className="mt-auto pt-4 border-t">
              <Button
                onClick={onLogout}
                variant="ghost"
                className="w-full justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* ==========================
            MODO EXPANDIDO
           ========================== */}
        <Collapsible open={!isCollapsed}>
          <CollapsibleContent>
            <nav className="flex flex-col gap-1 overflow-hidden">
              <span className="text-sm text-gray-400 font-medium mt-1 uppercase">
                Navegação
              </span>

              <SidebarLink
                href="/"
                label="Voltar para Home"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<Home className="w-5 h-5" />}
              />

              <span className="text-sm text-gray-400 font-medium mt-1 uppercase">
                Painel
              </span>

              <SidebarLink
                href="/dashboard"
                label="Agendamentos"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<CalendarCheck2 className="w-5 h-5" />}
              />
              <SidebarLink
                href="/dashboard/service"
                label="Serviços"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<Folder className="w-5 h-5" />}
              />
              <SidebarLink
                href="/dashboard/reminders"
                label="Lembretes"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<Bell className="w-5 h-5" />}
              />

              <span className="text-sm text-gray-400 font-medium mt-1 uppercase">
                Configurações
              </span>

              <SidebarLink
                href="/dashboard/profile"
                label="Meu Perfil"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<Settings className="w-5 h-5" />}
              />
              <SidebarLink
                href="/dashboard/plans"
                label="Planos"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<Banknote className="w-5 h-5" />}
              />
            </nav>
          </CollapsibleContent>
        </Collapsible>

        {/* Informações do Usuário e Logout */}
        <div className="mt-auto pt-4 border-t">
          {session?.user && (
            <div className={clsx("mb-3", { "px-2": isCollapsed })}>
              {!isCollapsed && (
                <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "Usuário"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {session.user.name || "Usuário"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
              )}
              {isCollapsed && session.user.image && (
                <div className="flex justify-center">
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "Usuário"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>
              )}
            </div>
          )}
          
          <Button
            onClick={onLogout}
            variant="ghost"
            className={clsx(
              "w-full text-red-600 hover:text-red-700 hover:bg-red-50",
              {
                "justify-center": isCollapsed,
                "justify-start": !isCollapsed,
              }
            )}
          >
            <LogOut className={clsx("w-5 h-5", { "mr-3": !isCollapsed })} />
            {!isCollapsed && <span>Sair</span>}
          </Button>
        </div>
      </aside>

      {/* ==========================
          CONTEÚDO PRINCIPAL
         ========================== */}
      <div
        className={clsx("flex flex-1 flex-col transition-all duration-300", {
          "md:ml-20": isCollapsed, // quando o menu está recolhido
          "md:ml-64": !isCollapsed, // quando o menu está aberto
        })}
      >
        {/* HEADER MOBILE */}
        <header className="md:hidden flex items-center justify-between px-4 border-b shadow-sm md:px-6 h-16 z-10 sticky top-0 bg-white/95 backdrop-blur-sm">
          <Sheet>
            <div className="flex items-center gap-4">
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden hover:bg-blue-50 border-gray-200 transition-colors"
                  onClick={() => setIsCollapsed(false)}
                >
                  <List className="w-5 h-5 text-gray-700" />
                </Button>
              </SheetTrigger>

              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Menu Agenda ai lajinha
              </h1>
            </div>

            {/* MENU MOBILE */}
            <SheetContent side="right" className="sm:max-w-xs bg-white border-l border-gray-200">
              <SheetHeader className="text-left mb-6">
                <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Agenda ai lajinha
                </SheetTitle>
                <SheetDescription className="text-gray-600">
                  Menu administrativo
                </SheetDescription>
              </SheetHeader>

              <nav className="grid gap-2 text-base">
                <SidebarLink
                  href="/"
                  label="Voltar para Home"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  icon={<Home className="w-5 h-5" />}
                />
                <SidebarLink
                  href="/dashboard"
                  label="Agendamentos"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  icon={<CalendarCheck2 className="w-5 h-5" />}
                />
                <SidebarLink
                  href="/dashboard/service"
                  label="Serviços"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  icon={<Folder className="w-5 h-5" />}
                />
                <SidebarLink
                  href="/dashboard/reminders"
                  label="Lembretes"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  icon={<Bell className="w-5 h-5" />}
                />
                <SidebarLink
                  href="/dashboard/profile"
                  label="Meu Perfil"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  icon={<Settings className="w-5 h-5" />}
                />
                <SidebarLink
                  href="/dashboard/plans"
                  label="Planos"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  icon={<Banknote className="w-5 h-5" />}
                />
              </nav>

              {/* Informações do Usuário e Logout no Mobile */}
              {session?.user && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50 mb-3">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "Usuário"}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {session.user.name || "Usuário"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={onLogout}
                    variant="ghost"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 justify-start"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span>Sair</span>
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </header>

        {/* CONTEÚDO DINÂMICO */}
        <main className="flex-1 py-6 px-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

/* ==========================
   COMPONENTE LINK DO MENU
   ========================== */
interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  pathname: string;
  isCollapsed: boolean;
}

function SidebarLink({
  href,
  icon,
  label,
  pathname,
  isCollapsed,
}: SidebarLinkProps) {
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <div
        className={clsx(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium",
          {
            "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-200 scale-[1.02]": isActive,
            "text-gray-700 hover:bg-gray-100 hover:text-blue-600 hover:scale-[1.01]": !isActive,
          }
        )}
      >
        <span
          className={clsx("transition-transform duration-200", {
            "scale-110": isActive,
          })}
        >
          {icon}
        </span>
        {!isCollapsed && <span className="text-sm">{label}</span>}
      </div>
    </Link>
  );
}

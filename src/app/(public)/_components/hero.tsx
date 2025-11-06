"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      </div>

      <div className="container relative mx-auto px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 lg:px-8 lg:pt-32">
        <main className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          {/* Conteúdo de texto */}
          <article className="flex-1 space-y-8 max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center mt-4 gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Plataforma confiável para profissionais
            </div>

            {/* Título principal */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
              Encontre os melhores{" "}
              <span className="text-emerald-600 relative">
                profissionais
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="8"
                  viewBox="0 0 200 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 5.5C50 2.5 150 2.5 199 5.5"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-emerald-300"
                  />
                </svg>
              </span>{" "}
              em um único lugar!
            </h1>

            {/* Descrição */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Somos uma plataforma para profissionais de todos os tipos com foco em
              agilizar agendamentos de forma simplificada e organizada.
            </p>

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <Button 
                asChild
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Link href="#profissionais">
                  Encontre um profissional
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-2 border-gray-300 hover:border-emerald-600 hover:text-emerald-600 px-8 py-6 text-base font-semibold rounded-xl transition-all duration-300"
              >
                <Link href="#sobre">
                  Saiba mais
                </Link>
              </Button>
            </div>

            {/* Estatísticas */}
            
          </article>

        </main>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}
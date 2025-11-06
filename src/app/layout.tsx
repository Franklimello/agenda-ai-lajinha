import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionAuthProvider } from "@/components/session-ajth";
import { FirebaseAuthProvider } from "@/components/firebase-auth-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agenda ai lajinha - Sistema de Agendamento",
  description: "Plataforma para profissionais de todos os tipos com foco em agilizar agendamentos de forma simplificada e organizada.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" translate="no" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionAuthProvider>
          <FirebaseAuthProvider>
            {children}
          </FirebaseAuthProvider>
        </SessionAuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

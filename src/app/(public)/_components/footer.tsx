import Link from "next/link";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer id="sobre" className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Conteúdo principal do footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* Sobre */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-bold">Sobre Nós</h3>
            <p className="text-sm leading-relaxed">
              Plataforma para profissionais de todos os tipos com foco em agilizar
              agendamentos de forma simplificada e organizada.
            </p>
          </div>

          
          {/* Contato */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-bold">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <a
                  href="mailto:contato@agendaailajinha.com"
                  className="hover:text-emerald-400 transition-colors"
                >
                  contato@agendaailajinha.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <a
                  href="tel:+5531999999999"
                  className="hover:text-emerald-400 transition-colors"
                >
                  (31) 99999-9999
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>Lajinha-MG, Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-800" />

        {/* Copyright */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} Agenda ai lajinha. Todos os direitos
            reservados. Feito com{" "}
            <Heart className="w-4 h-4 text-red-500 fill-red-500" /> em Brasil
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/termos"
              className="hover:text-emerald-400 transition-colors"
            >
              Termos
            </Link>
            <span>•</span>
            <Link
              href="/privacidade"
              className="hover:text-emerald-400 transition-colors"
            >
              Privacidade
            </Link>
            <span>•</span>
            <Link
              href="/cookies"
              className="hover:text-emerald-400 transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
import Image from "next/image";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import fotoImg from "../../../../public/foto1.png";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Professional {
  id: string;
  name: string | null;
  address: string | null;
  phone: string | null;
  email: string;
  image: string | null;
  services: {
    id: string;
    name: string;
    price: number;
    duration: number;
  }[];
}

interface ProfissionaisProps {
  professionals: Professional[];
}

export function Profissionais({ professionals }: ProfissionaisProps) {
  if (professionals.length === 0) {
    return (
      <section id="profissionais" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-12 font-bold">
            Profissionais disponíveis
          </h2>
          <p className="text-center text-muted-foreground">
            Nenhum profissional disponível no momento.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="profissionais" className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl text-center mb-12 font-bold">
          Profissionais disponíveis
        </h2>
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {professionals.map((professional) => (
            <Card key={professional.id} className="overflow-hidden p-0">
              <CardContent className="p-0">
                <div>
                  <div className="relative h-48">
                    {professional.image ? (
                      <Image
                        src={professional.image}
                        alt={professional.name || "Profissional"}
                        fill
                        className="object-cover"
                        unoptimized={professional.image.startsWith("http") || professional.image.startsWith("/")}
                      />
                    ) : (
                      <Image
                        src={fotoImg}
                        alt={professional.name || "Profissional"}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {professional.name || "Profissional"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {professional.address || "Endereço não informado"}
                      </p>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  </div>
                  <Link
                    href={`/profissional/${professional.id}`}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center py-2 rounded-md text-sm font-medium md:text-base"
                  >
                    Agendar horario
                    <ArrowRight />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </section>
  );
}
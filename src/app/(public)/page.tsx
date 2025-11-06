import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { Hero } from "./_components/hero";
import { Profissionais } from "./_components/profissionais";
import { getProfessionals } from "./_data-access/get-professionals";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const professionals = await getProfessionals();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div>
        <Hero />
        <Profissionais professionals={professionals} />
        <Footer />
      </div>
    </div>
  );
}

import { getProfessionalData } from "./_data-access/get-professional-data";
import { notFound } from "next/navigation";
import { ProfessionalProfile } from "./_components/professional-profile";
import { Header } from "../../_components/header";
import { Footer } from "../../_components/footer";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfessionalPage({ params }: PageProps) {
  const { id } = await params;
  const professional = await getProfessionalData(id);

  if (!professional) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">
        <ProfessionalProfile professional={professional} />
      </div>
      <Footer />
    </div>
  );
}


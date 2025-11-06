import {getSession} from "@/lib/getSession"
import { redirect } from "next/navigation"
import { getUserData } from "./_data-access/get-info-user"
import { ProfileContent } from "./_components/profile"
import { getUserSubscription } from "../plans/_data-access/get-plans"
import { SubscriptionBlock } from "../_components/subscription-block"
import { checkOnboardingStatus } from "../_utils/check-onboarding"

export const dynamic = 'force-dynamic';

export default async  function Profile(){

    const session = await getSession()

        if(!session){
            redirect("/")
        }

        // Verificar se tem subscription ativa
        const subscription = await getUserSubscription()
        const hasActivePlan = subscription && subscription.status.toLowerCase() === "active"

        if(!hasActivePlan){
            return (
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">Meu Perfil</h1>
                        <p className="text-muted-foreground mt-1">Gerencie suas informações pessoais</p>
                    </div>
                    <SubscriptionBlock 
                        title="Plano Necessário para Editar Perfil"
                        message="Você precisa ter um plano ativo para editar seu perfil. Assine um plano para começar a configurar suas informações."
                    />
                </div>
            )
        }

        const user = await getUserData({userId: session.user.id});

        if(!user){
            redirect("/")
        }

        // Verificar se perfil está completo e redirecionar para dashboard se estiver
        const onboardingStatus = await checkOnboardingStatus();
        
        if (onboardingStatus?.hasActivePlan && onboardingStatus.hasCompleteProfile) {
            // Tem plano e perfil completo, pode acessar dashboard
            // Mas deixar acessar o perfil para editar se quiser
        }

    return(
        <ProfileContent user={user}/>
    )
}
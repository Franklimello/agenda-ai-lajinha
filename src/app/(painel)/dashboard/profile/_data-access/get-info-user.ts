"use server"

import { adminDb } from "@/lib/firebase-admin"
import { getSession } from "@/lib/getSession"

interface GetUserDataProps {
    userId?: string
}

export async function getUserData({userId}:GetUserDataProps = {}){
    try {
        // Se não forneceu userId, buscar da sessão
        if (!userId) {
            const session = await getSession();
            if (!session?.user?.id) {
                return null;
            }
            userId = session.user.id;
        }
        
        if (!adminDb) {
            console.error("Firebase Admin não configurado");
            return null;
        }
        
        const userDoc = await adminDb.collection("users").doc(userId).get();
        
        if(!userDoc.exists){
            return null
        }
        
        const userData = userDoc.data();
        const subscriptionDoc = await adminDb.collection("subscriptions")
            .where("userId", "==", userId)
            .limit(1)
            .get();
        
        let subscription = null;
        if (!subscriptionDoc.empty) {
            const subData = subscriptionDoc.docs[0].data();
            subscription = {
                id: subscriptionDoc.docs[0].id,
                userId: subData.userId,
                plan: subData.plan,
                status: subData.status,
                priceId: subData.priceId,
                createdAt: subData.createdAt?.toDate 
                    ? subData.createdAt.toDate().toISOString() 
                    : subData.createdAt instanceof Date 
                    ? subData.createdAt.toISOString()
                    : null,
                updatedAt: subData.updatedAt?.toDate 
                    ? subData.updatedAt.toDate().toISOString() 
                    : subData.updatedAt instanceof Date 
                    ? subData.updatedAt.toISOString()
                    : null,
            };
        }
        
        // Converter Timestamps do userData também
        const userDataSerialized = {
            ...userData,
            createdAt: userData.createdAt?.toDate 
                ? userData.createdAt.toDate().toISOString() 
                : userData.createdAt instanceof Date 
                ? userData.createdAt.toISOString()
                : null,
            updatedAt: userData.updatedAt?.toDate 
                ? userData.updatedAt.toDate().toISOString() 
                : userData.updatedAt instanceof Date 
                ? userData.updatedAt.toISOString()
                : null,
        };
        
        return {
            id: userDoc.id,
            ...userDataSerialized,
            subscription
        };
    } catch (error) {
        console.log(error)
        return null
    }
}

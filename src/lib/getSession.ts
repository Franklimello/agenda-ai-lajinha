// src/lib/getSession.ts
// Migrado para Firebase Auth
import { getSession as getFirebaseSession } from "./getSession-firebase";

export async function getSession() {
    return await getFirebaseSession();
}

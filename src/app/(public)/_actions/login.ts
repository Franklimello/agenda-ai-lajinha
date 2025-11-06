"use server"

import {signIn} from "@/lib/auth"

export async function handleRegister(provider: "github" | "google"){
    await signIn(provider, { redirectTo: "/dashboard" })
}
#!/bin/bash

# Script para configurar variáveis de ambiente no Vercel
# Uso: ./scripts/setup-vercel-env.sh

echo "🚀 Configurando variáveis de ambiente no Vercel..."
echo ""

# Firebase - Client SDK
echo "📦 Configurando Firebase Client SDK..."
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production
vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID production

# Firebase - Admin SDK
echo "🔐 Configurando Firebase Admin SDK..."
vercel env add FIREBASE_SERVICE_ACCOUNT production

# Stripe
echo "💳 Configurando Stripe..."
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_PRICE_ID_PROFESSIONAL production
vercel env add STRIPE_WEBHOOK_SECRET production

# App URL (será atualizado após primeiro deploy)
echo "🌐 Configurando App URL..."
vercel env add NEXT_PUBLIC_APP_URL production

echo ""
echo "✅ Variáveis de ambiente configuradas!"
echo "⚠️  Lembre-se de atualizar NEXT_PUBLIC_APP_URL após o primeiro deploy"
echo "   Exemplo: https://agenda-ai-lajinha.vercel.app"


#!/bin/bash

echo "════════════════════════════════════════════════════════════"
echo "🔍 DIAGNOSTIC COMPLET DU BOT DISCORD - DOUBLONS & ERREURS"
echo "════════════════════════════════════════════════════════════"
echo ""

# 1. Vérifier les doublons de fichiers
echo "📁 RECHERCHE DE DOUBLONS..."
echo "───────────────────────────────────────────────────────────"

echo "🔎 Fichiers clear.js :"
find /media/evnoxay/Evnoxay/Bot\ discord/bot -name "clear.js" -type f 2>/dev/null | nl

echo ""
echo "🔎 Fichiers adminrole.js :"
find /media/evnoxay/Evnoxay/Bot\ discord/bot -name "adminrole.js" -type f 2>/dev/null | nl

echo ""
echo "🔎 Fichiers interactionCreate.js :"
find /media/evnoxay/Evnoxay/Bot\ discord/bot -name "interactionCreate.js" -type f 2>/dev/null | nl

echo ""
echo "🔎 Fichiers ready.js :"
find /media/evnoxay/Evnoxay/Bot\ discord/bot -name "ready.js" -type f 2>/dev/null | nl

echo ""
echo "🔎 Fichiers serverConfig.json :"
find /media/evnoxay/Evnoxay/Bot\ discord -name "serverConfig.json" -type f 2>/dev/null | nl

echo ""
echo "🔎 Fichiers admins.json :"
find /media/evnoxay/Evnoxay/Bot\ discord -name "admins.json" -type f 2>/dev/null | nl

# 2. Vérifier voiceChannelManager
echo ""
echo "📦 VÉRIFICATION DÉPENDANCES..."
echo "───────────────────────────────────────────────────────────"
if [ -f "/media/evnoxay/Evnoxay/Bot discord/bot/utils/voiceChannelManager.js" ]; then
    echo "✅ voiceChannelManager.js existe"
else
    echo "❌ voiceChannelManager.js MANQUANT"
fi

# 3. Compter les fichiers de commandes
echo ""
echo "📊 STRUCTURE COMMANDES..."
echo "───────────────────────────────────────────────────────────"
echo "Total fichiers .js dans /bot/commands :"
find /media/evnoxay/Evnoxay/Bot\ discord/bot/commands -name "*.js" -type f | wc -l

echo ""
echo "Total fichiers .js dans /bot/events :"
find /media/evnoxay/Evnoxay/Bot\ discord/bot/events -name "*.js" -type f | wc -l

echo ""
echo "Total fichiers .js dans /bot/utils :"
find /media/evnoxay/Evnoxay/Bot\ discord/bot/utils -name "*.js" -type f | wc -l

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ DIAGNOSTIC TERMINÉ"
echo "════════════════════════════════════════════════════════════"

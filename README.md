# 🎤 Discord Voice Bot

Bot Discord pour créer et gérer des salons vocaux personnalisés!

## 🌟 Fonctionnalités

- ✅ Création automatique de salons vocaux
- ✅ Gestion complète des permissions
- ✅ Mode privé/public
- ✅ Verrouillage de salons
- ✅ Transfert de propriété
- ✅ Suppression automatique des salons vides
- ✅ Structure modulaire extensible

## 📋 Prérequis

- Node.js v18+
- npm

## 🚀 Installation Rapide

```bash
npm install
cp .env.example .env
# Remplissez le fichier .env
npm start
```

## 📁 Structure

```
discord-voice-bot/
├── bot/
│   ├── config.js
│   ├── index.js
│   ├── events/
│   └── commands/
├── features/
└── package.json
```

## 💬 Commandes

- `/kick` - Expulser
- `/private` - Rendre privé
- `/public` - Rendre public
- `/rename` - Renommer
- `/adduser` - Ajouter à liste blanche
- `/removeuser` - Retirer de liste blanche
- `/lock` - Verrouiller
- `/unlock` - Déverrouiller
- `/claim` - Revendiquer
- `/transfer` - Transférer
- `/disband` - Supprimer
- `/channelinfo` - Voir infos

## 🔧 Configuration .env

```
DISCORD_TOKEN=votre_token
CLIENT_ID=votre_client_id
GUILD_ID=votre_guild_id
CREATOR_CHANNEL_ID=id_du_salon_creation
```

## 📝 Licence

MIT
# bot
# bot
# bot

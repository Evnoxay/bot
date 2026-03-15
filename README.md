# DarwinBot

DarwinBot est un bot Discord Node.js (CommonJS) orienté gestion automatique de salons vocaux temporaires, commandes slash vocales, permissions admin granulaires et assistant web local de configuration.

## Fonctionnalités
- Création auto de salon vocal temporaire (`🎤 {displayName}`) depuis un salon créateur.
- Transfert auto de propriété si l'owner quitte le salon.
- Suppression auto des salons gérés vides.
- Commandes vocales: `/lock`, `/unlock`, `/rename`, `/limit`, `/adduser`, `/removeuser`, `/kick`, `/transfer`, `/disband`.
- Panneau vocal message: `!vocpanel`, `!panelvoc`, `!voicepanel` (menu + boutons + modales).
- Permissions admin par commande: `/adminrole`, `/adminrolelist`.
- Modération/utilitaires: `/clear`, `/pic`, `/banner`.
- Setup web local: status, preview, defaults, logs live, setup `.env`.
- Outils qualité: `doctor` + `verify`.

## Installation rapide
```bash
npm install
cp .env.example .env
npm run setup
```
Puis ouvrir `http://localhost:3210` pour configurer le bot.

## Configuration `.env`
Variables attendues:
- `DISCORD_TOKEN`
- `CLIENT_ID`
- `GUILD_ID`
- `CREATOR_VOICE_CHANNEL_ID`
- `CATEGORY_ID`
- `DEBUG` (optionnel)

## Utilisation setup web
- Lancez `npm run setup`.
- Remplissez le formulaire.
- Le setup valide les IDs Discord (6 à 25 chiffres).
- Le setup génère une preview contenant le lien OAuth2.

## Commandes slash
### Vocales
`/lock`, `/unlock`, `/rename nom:<texte>`, `/limit nombre:<0..99>`, `/adduser utilisateur:<membre>`, `/removeuser utilisateur:<membre>`, `/kick utilisateur:<id|mention>`, `/transfer utilisateur:<id|mention>`, `/disband`

### Admin
`/adminrole`, `/adminrolelist`

### Modération / utilitaires
`/clear nombre:<1..100>`, `/pic`, `/banner`

## Scripts npm
- `npm start` : démarre DarwinBot.
- `npm run dev` : mode développement avec nodemon.
- `npm run setup` : assistant web local.
- `npm run doctor` : checks environnement.
- `npm run verify` : audit structure/config.

## Debug rapide
- Crash au boot: vérifier `.env`, format IDs, permissions bot.
- Commandes absentes: vérifier `CLIENT_ID/GUILD_ID` et redémarrer.
- Voice auto KO: vérifier `CREATOR_VOICE_CHANNEL_ID`, `CATEGORY_ID` et permissions `Manage Channels/Move Members`.
- Permissions admin KO: vérifier `bot/data/serverConfig.json`.

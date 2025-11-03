// bot/utils/configManager.js - Gestion centralisée des configs

const fs = require('fs');
const path = require('path');

// Utilise le chemin correct : bot/data/serverConfig.json
const CONFIG_PATH = path.join(__dirname, '../../data/serverConfig.json');
let configCache = null;
let lastLoadTime = 0;
const CACHE_TTL = 5000; // Cache 5 secondes

/**
 * Crée le dossier data s'il n'existe pas
 */
function ensureConfigDir() {
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Charge la config depuis le fichier JSON avec cache
 */
function loadConfig() {
  const now = Date.now();
  
  // Retourner cache si valide
  if (configCache && (now - lastLoadTime) < CACHE_TTL) {
    return configCache;
  }

  ensureConfigDir();

  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      configCache = {};
      return configCache;
    }
    
    const data = fs.readFileSync(CONFIG_PATH, 'utf8');
    configCache = JSON.parse(data);
    lastLoadTime = now;
    return configCache;
  } catch (error) {
    console.error('❌ Erreur lecture config:', error);
    return {};
  }
}

/**
 * Sauvegarde la config dans le fichier JSON
 */
function saveConfig(config) {
  try {
    ensureConfigDir();
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    configCache = config;
    lastLoadTime = Date.now();
    return true;
  } catch (error) {
    console.error('❌ Erreur sauvegarde config:', error);
    return false;
  }
}

/**
 * Récupère les permissions d'une commande
 */
function getCommandPermissions(guildId, commandName) {
  const config = loadConfig();
  return config[guildId]?.commandPermissions?.[commandName] || [];
}

/**
 * Définit les permissions d'une commande
 */
function setCommandPermissions(guildId, commandName, roleIds) {
  const config = loadConfig();
  
  if (!config[guildId]) {
    config[guildId] = { commandPermissions: {} };
  }
  
  if (roleIds.length === 0) {
    delete config[guildId].commandPermissions[commandName];
  } else {
    config[guildId].commandPermissions[commandName] = roleIds;
  }
  
  return saveConfig(config);
}

/**
 * Supprime les permissions d'une commande
 */
function deleteCommandPermissions(guildId, commandName) {
  return setCommandPermissions(guildId, commandName, []);
}

/**
 * Récupère la config complète d'un serveur
 */
function getGuildConfig(guildId) {
  const config = loadConfig();
  return config[guildId] || {};
}

/**
 * Invalide le cache
 */
function invalidateCache() {
  configCache = null;
  lastLoadTime = 0;
}

module.exports = {
  loadConfig,
  saveConfig,
  getCommandPermissions,
  setCommandPermissions,
  deleteCommandPermissions,
  getGuildConfig,
  invalidateCache,
};
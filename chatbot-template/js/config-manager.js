/**
 * Configuration Manager untuk Personalisasi Chatbot
 * Manages bot settings, webhook URLs, UI preferences, and persistence
 *
 * Features:
 * - Centralized configuration management
 * - localStorage persistence with fallback handling
 * - Event-driven updates for real-time UI changes
 * - Webhook URL management (input/output)
 * - Bot persona and UI customization
 *
 * Usage: window.ConfigManager.getConfig() / saveConfig(config)
 */

class ConfigManager {
  constructor() {
    this.configKey = "chatbot_config";
    this.defaultConfig = {
      botName: "Arya",
      botDescription: "AI Assistant yang siap membantu Anda",
      botAvatar: "🤖",
      userAvatar: "👤",
      theme: "default",
      webhook: {
        inputUrl: "http://localhost:5678/webhook/inputWebhook",
        outputUrl: "http://localhost:5678/webhook/outputWebhook",
      },
      typing: {
        message: "sedang mengetik...",
        duration: 3000,
      },
      ui: {
        placeholder: "Ketik pesan Anda...",
        sendButtonText: "➤",
        title: "Chat Assistant",
      },
    };
  }

  /**
   * Retrieve bot configuration from localStorage with fallback to defaults
   * @returns {Object} Complete bot configuration object
   */
  getConfig() {
    try {
      const savedConfig = localStorage.getItem(this.configKey);

      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        // Merge with defaults to ensure all required properties exist
        return this.mergeConfig(this.defaultConfig, parsedConfig);
      }
    } catch (error) {
      console.warn("⚠️ Error loading config, using defaults:", error);
      // Clear corrupted config data
      localStorage.removeItem(this.configKey);
    }

    return { ...this.defaultConfig };
  }

  /**
   * Save bot configuration to localStorage and notify components
   * @param {Object} config - Bot configuration object
   * @returns {boolean} Success status
   */
  saveConfig(config) {
    if (!config || typeof config !== "object") {
      console.error("❌ Invalid config object provided");
      return false;
    }

    try {
      const currentConfig = this.getConfig();
      const mergedConfig = this.mergeConfig(currentConfig, config);

      // Validate essential properties
      if (!this.validateConfig(mergedConfig)) {
        console.error("❌ Configuration validation failed");
        return false;
      }

      localStorage.setItem(this.configKey, JSON.stringify(mergedConfig));
      this.notifyConfigChange(mergedConfig);

      console.log("✅ Configuration saved successfully");
      return true;
    } catch (error) {
      console.error("❌ Error saving config:", error);
      return false;
    }
  }

  /**
   * Validate configuration object structure
   * @param {Object} config - Configuration to validate
   * @returns {boolean} Validation result
   */
  validateConfig(config) {
    const requiredFields = ["botName", "botDescription", "webhook"];

    for (const field of requiredFields) {
      if (!(field in config)) {
        console.warn(`⚠️ Missing required field: ${field}`);
        return false;
      }
    }

    // Validate webhook structure
    if (config.webhook && typeof config.webhook === "object") {
      const webhookRequired = ["inputUrl", "outputUrl"];
      for (const field of webhookRequired) {
        if (!(field in config.webhook)) {
          console.warn(`⚠️ Missing webhook field: ${field}`);
        }
      }
    }

    return true;
  }

  /**
   * Deep merge new configuration with existing config
   * Handles nested objects (webhook, typing, ui) properly
   * @param {Object} defaultConfig - Base configuration
   * @param {Object} newConfig - New configuration to merge
   * @returns {Object} Merged configuration object
   */
  mergeConfig(defaultConfig, newConfig) {
    const merged = { ...defaultConfig };

    Object.keys(newConfig).forEach((key) => {
      const newValue = newConfig[key];
      const defaultValue = defaultConfig[key];

      // Handle nested objects (not arrays or null)
      if (this.isPlainObject(newValue) && this.isPlainObject(defaultValue)) {
        merged[key] = { ...defaultValue, ...newValue };
      } else {
        merged[key] = newValue;
      }
    });

    return merged;
  }

  /**
   * Check if value is a plain object (not array, null, or other types)
   * @param {*} obj - Value to check
   * @returns {boolean} True if plain object
   */
  isPlainObject(obj) {
    return (
      obj !== null &&
      typeof obj === "object" &&
      !Array.isArray(obj) &&
      obj.constructor === Object
    );
  }

  /**
   * Reset configuration to defaults and notify components
   * @returns {Object} Default configuration
   */
  resetConfig() {
    try {
      localStorage.removeItem(this.configKey);

      // Also clear related configuration flags
      localStorage.removeItem("discussion_config_set");

      const defaultConfig = { ...this.defaultConfig };
      this.notifyConfigChange(defaultConfig);

      console.log("🔄 Configuration reset to defaults");
      return defaultConfig;
    } catch (error) {
      console.error("❌ Error resetting config:", error);
      return { ...this.defaultConfig };
    }
  }

  /**
   * Mengambil nama bot
   * @returns {string} Bot name
   */
  getBotName() {
    return this.getConfig().botName;
  }

  /**
   * Mengambil deskripsi bot
   * @returns {string} Bot description
   */
  getBotDescription() {
    return this.getConfig().botDescription;
  }

  /**
   * Mengambil pesan typing dengan nama bot
   * @returns {string} Typing message
   */
  getTypingMessage() {
    const config = this.getConfig();
    return `${config.botName} ${config.typing.message}`;
  }

  /**
   * Mengambil URL webhook
   * @returns {Object} Webhook URLs
   */
  getWebhookUrls() {
    return this.getConfig().webhook;
  }

  /**
   * Notify komponen lain bahwa konfigurasi telah berubah
   * @param {Object} config - New configuration
   */
  notifyConfigChange(config) {
    const event = new CustomEvent("configChanged", {
      detail: config,
      bubbles: true,
    });
    document.dispatchEvent(event);
  }

  /**
   * Export konfigurasi sebagai JSON
   * @returns {string} JSON string of configuration
   */
  exportConfig() {
    return JSON.stringify(this.getConfig(), null, 2);
  }

  /**
   * Import konfigurasi dari JSON
   * @param {string} jsonString - JSON configuration
   * @returns {boolean} Success status
   */
  importConfig(jsonString) {
    try {
      const config = JSON.parse(jsonString);
      return this.saveConfig(config);
    } catch (error) {
      console.error("Error importing config:", error);
      return false;
    }
  }

  /**
   * Validasi konfigurasi
   * @param {Object} config - Configuration to validate
   * @returns {Object} Validation result
   */
  validateConfig(config) {
    const errors = [];
    const warnings = [];

    // Validasi required fields
    if (!config.botName || config.botName.trim() === "") {
      errors.push("Nama bot tidak boleh kosong");
    }

    if (config.botName && config.botName.length > 50) {
      warnings.push("Nama bot sebaiknya tidak lebih dari 50 karakter");
    }

    if (config.botDescription && config.botDescription.length > 200) {
      warnings.push("Deskripsi bot sebaiknya tidak lebih dari 200 karakter");
    }

    // Validasi webhook URLs
    if (config.webhook) {
      if (
        config.webhook.inputUrl &&
        !this.isValidUrl(config.webhook.inputUrl)
      ) {
        errors.push("URL webhook input tidak valid");
      }
      if (
        config.webhook.outputUrl &&
        !this.isValidUrl(config.webhook.outputUrl)
      ) {
        errors.push("URL webhook output tidak valid");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validasi URL
   * @param {string} url - URL to validate
   * @returns {boolean} Is valid URL
   */
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

// Export sebagai global instance
window.ConfigManager = new ConfigManager();

// Export untuk modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = ConfigManager;
}

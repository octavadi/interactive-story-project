/**
 * Main JavaScript - Inisialisasi dan konfigurasi chatbot
 * File utama untuk menjalankan aplikasi chatbot
 */

// Konfigurasi global
const CHAT_CONFIG = {
  // Webhook URLs untuk n8n lokal (pastikan sesuai dengan webhook n8n Anda)
  webhook: {
    input: "http://localhost:5678/webhook/inputWebhook",
    output: "http://localhost:5678/webhook/outputWebhook", // Diperbaiki: URL berbeda untuk output
  },

  // Konfigurasi UI
  ui: {
    theme: "light", // 'light' atau 'dark'
    language: "id", // 'id' atau 'en'
    autoScroll: true,
    showTimestamps: true,
  },

  // Konfigurasi chat
  chat: {
    maxMessages: 100,
    typingDelay: 1500,
    enableSound: false,
  },
};

// Inisialisasi aplikasi
class ChatbotApp {
  constructor() {
    this.chatManager = null;
    this.isInitialized = false;
    this.init();
  }

  /**
   * Inisialisasi aplikasi
   */
  async init() {
    try {
      console.log("Memulai inisialisasi chatbot...");

      // Tunggu semua komponen siap
      await this.waitForComponents();

      // Setup chat manager
      this.setupChatManager();

      // Setup event listeners
      this.setupGlobalEventListeners();

      // Setup webhook
      this.setupWebhook();

      // Setup UI theme
      this.setupTheme();

      // Setup language
      this.setupLanguage();

      this.isInitialized = true;
      console.log("Chatbot berhasil diinisialisasi!");

      // Dispatch event bahwa chatbot siap
      this.dispatchReadyEvent();
    } catch (error) {
      console.error("Error saat inisialisasi chatbot:", error);
      this.showErrorMessage(
        "Gagal menginisialisasi chatbot. Silakan refresh halaman."
      );
    }
  }

  /**
   * Tunggu semua web component siap dengan timeout
   */
  async waitForComponents() {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const timeout = 10000; // 10 second timeout
      
      const checkComponents = () => {
        const chatInput = document.querySelector("chat-input");
        const chatOutput = document.querySelector("chat-output");

        if (chatInput && chatOutput) {
          const loadTime = Date.now() - startTime;
          console.log(`✅ Components loaded in ${loadTime}ms`);
          resolve();
        } else if (Date.now() - startTime > timeout) {
          const error = new Error('Components failed to load within timeout');
          console.error('❌ Component loading timeout:', error);
          reject(error);
        } else {
          setTimeout(checkComponents, 100);
        }
      };

      checkComponents();
    });
  }

  /**
   * Setup chat manager
   */
  setupChatManager() {
    this.chatManager = new ChatManager();

    // Tunggu chat manager siap
    const checkManager = () => {
      if (this.chatManager && this.chatManager.isInitialized) {
        console.log("Chat Manager siap");
      } else {
        setTimeout(checkManager, 100);
      }
    };

    checkManager();
  }

  /**
   * Setup event listeners global
   */
  setupGlobalEventListeners() {
    // Listen untuk keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      this.handleKeyboardShortcuts(e);
    });

    // Listen untuk window events
    window.addEventListener("resize", () => {
      this.handleWindowResize();
    });

    // Listen untuk visibility change
    document.addEventListener("visibilitychange", () => {
      this.handleVisibilityChange();
    });
  }

  /**
   * Setup webhook with error handling
   */
  setupWebhook() {
    if (this.chatManager && this.chatManager.configureWebhook) {
      // Wrap webhook configuration with error handling
      const safeConfigureWebhook = ErrorHandler.createSafeWrapper(
        () => this.chatManager.configureWebhook(
          CHAT_CONFIG.webhook.input,
          CHAT_CONFIG.webhook.output,
          CHAT_CONFIG.chat.typingDelay
        ),
        'webhook-configuration'
      );
      
      safeConfigureWebhook();
    }
  }

  /**
   * Setup theme
   */
  setupTheme() {
    const theme = localStorage.getItem("chatbot_theme") || CHAT_CONFIG.ui.theme;
    this.applyTheme(theme);
  }

  /**
   * Apply theme
   */
  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("chatbot_theme", theme);

    // Update theme toggle button jika ada
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
      themeToggle.textContent = theme === "light" ? "🌙" : "☀️";
    }
  }

  /**
   * Setup language
   */
  setupLanguage() {
    const language =
      localStorage.getItem("chatbot_language") || CHAT_CONFIG.ui.language;
    this.applyLanguage(language);
  }

  /**
   * Apply language
   */
  applyLanguage(language) {
    document.documentElement.setAttribute("lang", language);
    localStorage.setItem("chatbot_language", language);

    // Update language toggle button jika ada
    const languageToggle = document.getElementById("languageToggle");
    if (languageToggle) {
      languageToggle.textContent = language === "id" ? "🇺🇸" : "🇮🇩";
    }
  }

  /**
   * Handle keyboard shortcuts
   */
  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + Enter untuk focus input
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      const chatInput = document.querySelector("chat-input");
      if (chatInput) {
        const input = chatInput.shadowRoot?.querySelector(".message-input");
        if (input) {
          input.focus();
        }
      }
    }

    // Ctrl/Cmd + K untuk clear chat
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      if (this.chatManager) {
        this.chatManager.clearMessageHistory();
      }
    }

    // Ctrl/Cmd + E untuk export chat
    if ((e.ctrlKey || e.metaKey) && e.key === "e") {
      e.preventDefault();
      if (this.chatManager) {
        this.chatManager.exportConversation();
      }
    }
  }

  /**
   * Handle window resize
   */
  handleWindowResize() {
    // Trigger resize event untuk komponen
    window.dispatchEvent(new Event("resize"));
  }

  /**
   * Handle visibility change
   */
  handleVisibilityChange() {
    if (document.hidden) {
      // Halaman tidak terlihat, pause polling jika ada
      console.log("Halaman tidak terlihat, pausing polling...");
    } else {
      // Halaman terlihat lagi, resume polling
      console.log("Halaman terlihat lagi, resuming polling...");
    }
  }

  /**
   * Dispatch ready event
   */
  dispatchReadyEvent() {
    const event = new CustomEvent("chatbotReady", {
      detail: {
        timestamp: new Date(),
        config: CHAT_CONFIG,
      },
    });
    document.dispatchEvent(event);
  }

  /**
   * Show error message
   */
  showErrorMessage(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            max-width: 300px;
        `;
    errorDiv.textContent = message;

    document.body.appendChild(errorDiv);

    // Auto remove setelah 5 detik
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 5000);
  }

  /**
   * Get chat manager instance
   */
  getChatManager() {
    return this.chatManager;
  }

  /**
   * Get config
   */
  getConfig() {
    return { ...CHAT_CONFIG };
  }

  /**
   * Update config
   */
  updateConfig(newConfig) {
    Object.assign(CHAT_CONFIG, newConfig);

    // Re-apply settings
    if (newConfig.ui?.theme) {
      this.applyTheme(newConfig.ui.theme);
    }

    if (newConfig.ui?.language) {
      this.applyLanguage(newConfig.ui.language);
    }

    if (newConfig.webhook) {
      this.setupWebhook();
    }
  }
}

// Inisialisasi aplikasi ketika DOM siap
let chatbotApp;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    chatbotApp = new ChatbotApp();
  });
} else {
  chatbotApp = new ChatbotApp();
}

// Export untuk penggunaan global
window.ChatbotApp = ChatbotApp;
window.chatbotApp = chatbotApp;

// Utility functions
window.ChatbotUtils = {
  /**
   * Toggle theme
   */
  toggleTheme: () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    if (chatbotApp) {
      chatbotApp.applyTheme(newTheme);
    }
  },

  /**
   * Toggle language
   */
  toggleLanguage: () => {
    const currentLang = document.documentElement.getAttribute("lang");
    const newLang = currentLang === "id" ? "en" : "id";
    if (chatbotApp) {
      chatbotApp.applyLanguage(newLang);
    }
  },

  /**
   * Test webhook connection with retry mechanism
   */
  testWebhook: async (url) => {
    return await ErrorHandler.withRetry(
      async () => {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            test: true,
            timestamp: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return {
          success: true,
          status: response.status,
          statusText: response.statusText,
          data: await response.json().catch(() => null)
        };
      },
      {
        retries: 3,
        delay: 1000,
        shouldRetry: (error) => {
          // Retry on network errors or 5xx status codes
          return error.message.includes('fetch') || 
                 error.message.includes('50') ||
                 error.message.includes('timeout');
        },
        onRetry: (error, attempt) => {
          console.warn(`🔄 Webhook test retry ${attempt}: ${error.message}`);
        }
      }
    ).catch(error => {
      console.error('❌ Webhook test failed:', error);
      return ErrorHandler.handleWebhookError(error, 'webhook-test');
    });
  },
};

console.log(
  "Chatbot utilities loaded. Use ChatbotUtils for common operations."
);

/**
 * Chat Manager - Mengatur komunikasi antar web component
 * Menangani event dan state management untuk chatbot
 */
class ChatManager {
  constructor() {
    this.chatInput = null;
    this.chatOutput = null;
    this.conversationContainer = null;
    this.isInitialized = false;
    this.messageHistory = [];
    this.configManager = window.ConfigManager || null;
    this.webhookConfig = {
      inputUrl: "",
      outputUrl: "",
      pollingInterval: 5000, // Polling interval untuk webhook output (ms)
    };

    this.init();
  }

  /**
   * Inisialisasi chat manager
   */
  init() {
    // Tunggu DOM selesai loading
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.setupComponents()
      );
    } else {
      this.setupComponents();
    }
  }

  /**
   * Setup komponen-komponen chat
   */
  setupComponents() {
    try {
      // Ambil referensi komponen
      this.chatInput = document.querySelector("chat-input");
      this.chatOutput = document.querySelector("chat-output");
      this.conversationContainer = document.getElementById("chatConversation");

      if (!this.chatInput || !this.chatOutput) {
        console.error("Web component tidak ditemukan");
        return;
      }

      // Setup event listeners
      this.setupEventListeners();
      this.setupConfigListener();

      // Setup webhook polling
      this.setupWebhookPolling();
      this.updateFromConfig();

      this.isInitialized = true;
      console.log("Chat Manager berhasil diinisialisasi");
    } catch (error) {
      console.error("Error saat setup komponen:", error);
    }
  }

  /**
   * Setup event listeners untuk komponen
   */
  setupEventListeners() {
    // Listen untuk pesan yang dikirim dari chat input
    this.chatInput.addEventListener("messageSent", (event) => {
      this.handleUserMessage(event.detail);
    });

    // Listen untuk custom events lain yang mungkin diperlukan
    document.addEventListener("webhookResponse", (event) => {
      this.handleWebhookResponse(event.detail);
    });

    // Setup action buttons
    this.setupActionButtons();
  }

  /**
   * Setup tombol aksi
   */
  setupActionButtons() {
    const actionButtons = document.querySelectorAll(".action-btn");
    actionButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        this.handleActionButtonClick(event.target.textContent);
      });
    });
  }

  /**
   * Handle pesan dari user
   */
  handleUserMessage(messageData) {
    const { message, timestamp } = messageData;

    // Tambahkan ke history
    this.messageHistory.push({
      type: "user",
      message,
      timestamp,
      id: Date.now(),
    });

    // Tampilkan pesan user di conversation area
    this.displayUserMessage(message, timestamp);

    // Tampilkan typing indicator
    this.showTypingIndicator();

    // Simulasi delay untuk AI response (dalam implementasi nyata, ini akan menunggu webhook)
    setTimeout(() => {
      this.hideTypingIndicator();
      this.simulateAIResponse(message);
    }, 1500);

    console.log("Pesan user diterima:", messageData);
  }

  /**
   * Handle response dari webhook
   */
  handleWebhookResponse(responseData) {
    const { message, sender, timestamp, type } = responseData;

    // Tambahkan ke history
    this.messageHistory.push({
      type: type || "ai",
      message,
      sender: sender || this.getBotName(),
      timestamp: timestamp || new Date(),
      id: Date.now(),
    });

    // Tampilkan di chat output
    this.chatOutput.addMessage(responseData);

    // Tampilkan di conversation area juga
    this.displayAIMessage(message, timestamp, sender);

    console.log("Response webhook diterima:", responseData);
  }

  /**
   * Tampilkan pesan user di conversation area
   */
  displayUserMessage(message, timestamp) {
    const messageElement = document.createElement("div");
    messageElement.className = "message user-message";

    const time = new Date(timestamp).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    messageElement.innerHTML = `
            <div class="message-bubble">
                <p>${this.escapeHtml(message)}</p>
                <small class="message-time">${time}</small>
            </div>
        `;

    this.conversationContainer.appendChild(messageElement);
    this.scrollToBottom();
  }

  /**
   * Tampilkan pesan AI di conversation area
   */
  displayAIMessage(message, timestamp, sender = this.getBotName()) {
    const messageElement = document.createElement("div");
    messageElement.className = "message chatbot-message";

    const time = new Date(timestamp).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    messageElement.innerHTML = `
            <div class="message-bubble">
                <p><strong>${sender}:</strong> ${this.escapeHtml(message)}</p>
                <small class="message-time">${time}</small>
            </div>
        `;

    this.conversationContainer.appendChild(messageElement);
    this.scrollToBottom();
  }

  /**
   * Tampilkan typing indicator
   */
  showTypingIndicator() {
    const existingIndicator = document.querySelector(".typing-indicator");
    if (existingIndicator) {
      existingIndicator.style.display = "block";
    }
  }

  /**
   * Sembunyikan typing indicator
   */
  hideTypingIndicator() {
    const existingIndicator = document.querySelector(".typing-indicator");
    if (existingIndicator) {
      existingIndicator.style.display = "none";
    }
  }

  /**
   * Handle tombol aksi
   */
  handleActionButtonClick(action) {
    console.log(`Action button clicked: ${action}`);

    // Simulasi response berdasarkan action
    let responseMessage = "";
    switch (action.toLowerCase()) {
      case "learn more":
        responseMessage =
          "Tentu! Saya dapat membantu Anda mempelajari lebih lanjut tentang layanan kami. Apa yang ingin Anda ketahui?";
        break;
      case "get started":
        responseMessage =
          "Bagus! Mari kita mulai. Silakan beri tahu saya apa yang bisa saya bantu hari ini.";
        break;
      default:
        responseMessage =
          "Terima kasih atas minat Anda! Bagaimana saya bisa membantu?";
    }

    // Tampilkan response
    setTimeout(() => {
      this.displayAIMessage(responseMessage, new Date());
    }, 500);
  }

  /**
   * Simulasi response AI (untuk testing)
   */
  simulateAIResponse(userMessage) {
    let responseMessage = "";

    // Simple response logic
    if (
      userMessage.toLowerCase().includes("layanan") ||
      userMessage.toLowerCase().includes("services")
    ) {
      responseMessage =
        "Kami menyediakan berbagai layanan termasuk konsultasi, pengembangan, dan dukungan teknis. Layanan mana yang ingin Anda ketahui lebih lanjut?";
    } else if (
      userMessage.toLowerCase().includes("harga") ||
      userMessage.toLowerCase().includes("price")
    ) {
      responseMessage =
        "Harga layanan kami bervariasi tergantung pada kompleksitas dan ruang lingkup proyek. Saya dapat memberikan estimasi yang lebih akurat setelah memahami kebutuhan Anda.";
    } else {
      responseMessage =
        "Terima kasih atas pesan Anda! Saya akan segera memproses dan memberikan respons yang tepat.";
    }

    this.displayAIMessage(responseMessage, new Date());
  }

  /**
   * Setup webhook polling untuk output
   */
  setupWebhookPolling() {
    // Dalam implementasi nyata, ini akan menggunakan WebSocket atau Server-Sent Events
    // Untuk saat ini, kita gunakan polling sebagai fallback
    if (this.webhookConfig.outputUrl) {
      setInterval(() => {
        this.pollWebhookOutput();
      }, this.webhookConfig.pollingInterval); // Diperbaiki: gunakan pollingInterval, bukan outputUrl
    }
  }

  /**
   * Poll webhook output (implementasi dasar)
   */
  async pollWebhookOutput() {
    if (!this.webhookConfig.outputUrl) return;

    try {
      const response = await fetch(this.webhookConfig.outputUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          data.messages.forEach((message) => {
            this.handleWebhookResponse(message);
          });
        }
      }
    } catch (error) {
      console.error("Error polling webhook output:", error);
    }
  }

  /**
   * Konfigurasi webhook
   */
  configureWebhook(inputUrl, outputUrl, pollingInterval = 5000) {
    this.webhookConfig = {
      inputUrl,
      outputUrl,
      pollingInterval,
    };

    // Update chat input webhook URL
    if (this.chatInput) {
      this.chatInput.setWebhookUrl(inputUrl);
    }

    // Start listening pada chat output
    if (this.chatOutput && outputUrl) {
      this.chatOutput.startListening(outputUrl);
    }

    console.log("Webhook dikonfigurasi:", this.webhookConfig);
  }

  /**
   * Scroll ke bagian bawah conversation
   */
  scrollToBottom() {
    if (this.conversationContainer) {
      this.conversationContainer.scrollTop =
        this.conversationContainer.scrollHeight;
    }
  }

  /**
   * Escape HTML untuk keamanan
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Get message history
   */
  getMessageHistory() {
    return [...this.messageHistory];
  }

  /**
   * Clear message history
   */
  clearMessageHistory() {
    this.messageHistory = [];
    if (this.conversationContainer) {
      this.conversationContainer.innerHTML = `
                <div class="message chatbot-message">
                    <div class="message-bubble">
                        <p>Hello! How can I help you today?</p>
                    </div>
                </div>
            `;
    }
  }

  /**
   * Export conversation untuk debugging
   */
  exportConversation() {
    const conversationData = {
      timestamp: new Date().toISOString(),
      messageCount: this.messageHistory.length,
      messages: this.messageHistory,
    };

    const blob = new Blob([JSON.stringify(conversationData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-conversation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Setup listener untuk perubahan konfigurasi
   */
  setupConfigListener() {
    document.addEventListener("configChanged", (event) => {
      this.updateFromConfig();
    });
  }

  /**
   * Update manager dari konfigurasi
   */
  updateFromConfig() {
    if (!this.configManager) return;

    const config = this.configManager.getConfig();

    // Update webhook config
    this.webhookConfig.inputUrl = config.webhook.inputUrl;
    this.webhookConfig.outputUrl = config.webhook.outputUrl;

    console.log("ChatManager updated from config:", config);
  }

  /**
   * Mendapatkan nama bot dari konfigurasi
   * @returns {string} Bot name
   */
  getBotName() {
    if (this.configManager) {
      return this.configManager.getBotName();
    }
    return "AI";
  }

  /**
   * Mendapatkan konfigurasi webhook
   * @returns {Object} Webhook configuration
   */
  getWebhookConfig() {
    if (this.configManager) {
      const config = this.configManager.getConfig();
      return {
        inputUrl: config.webhook.inputUrl,
        outputUrl: config.webhook.outputUrl,
        pollingInterval: this.webhookConfig.pollingInterval,
      };
    }
    return this.webhookConfig;
  }
}

// Export untuk penggunaan global
window.ChatManager = ChatManager;

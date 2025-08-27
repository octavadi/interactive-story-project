/**
 * Web Component untuk Output Chat AI
 * Menerima dan menampilkan pesan dari webhook n8n
 */
class ChatOutput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.messages = [];
    this.webhookEndpoint = null;
    this.isListening = false;
    this.configManager = null; // Will be set in connectedCallback
  }

  connectedCallback() {
    // Wait for ConfigManager to be available
    setTimeout(() => {
      this.configManager = window.ConfigManager || null;
      if (this.configManager) {
        console.log("✅ chat-output: ConfigManager connected");
        this.setupConfigListener();
        this.updateFromConfig();
      } else {
        console.warn("⚠️ chat-output: ConfigManager not available");
      }
    }, 100);

    this.render();
    this.setupWebhookListener();
    // Auto-start polling untuk menerima pesan
    this.startPolling();
  }

  render() {
    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }

                .output-container {
                    max-height: 400px;
                    overflow-y: auto;
                    padding: 12px;
                    background: #0f172a;
                    color: #f8fafc;
                    border-radius: 8px;
                    margin: 12px 0;
                }

                .message-item {
                    margin-bottom: 16px;
                    animation: fadeIn 0.3s ease-in;
                    text-align: left;
                }

                .message-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 4px;
                    text-align: left;
                }

                .message-sender {
                    font-weight: 600;
                    font-size: 12px;
                    color: #374151;
                }

                .message-time {
                    font-size: 11px;
                    color: #9ca3af;
                }

                .message-content {
                    background: #1e293b;
                    padding: 10px 14px;
                    border-radius: 8px;
                    word-wrap: break-word;
                    line-height: 1.5;
                    color: #f1f5f9;
                    font-weight: 400;
                    text-align: left;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                }

                .message-content.ai {
                    background: #0f172a;
                    color: #e2e8f0;
                    border-left: 2px solid #0ea5e9;
                }

                .message-content.user {
                    background: #1e293b;
                    color: #f8fafc;
                    border-left: 2px solid #f59e0b;
                }

                .message-content.error {
                    background: #450a0a;
                    color: #fecaca;
                    border-left: 2px solid #ef4444;
                }

                .typing-indicator {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 10px 14px;
                    background: #0f172a;
                    border-radius: 8px;
                    border-left: 2px solid #0ea5e9;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                }

                .typing-dots {
                    display: flex;
                    gap: 4px;
                }

                .typing-dots span {
                    width: 6px;
                    height: 6px;
                    background: #0ea5e9;
                    border-radius: 50%;
                    animation: typing 1.4s infinite ease-in-out;
                    opacity: 0.8;
                }

                .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
                .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

                .empty-state {
                    text-align: center;
                    color: #94a3b8;
                    font-style: italic;
                    padding: 24px 16px;
                    font-size: 0.9rem;
                }

                .webhook-status {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    background: #f3f4f6;
                    border-radius: 6px;
                    margin-bottom: 16px;
                    font-size: 12px;
                    color: #374151 !important;
                }
                
                #statusText {
                    color: #374151 !important;
                }

                .status-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #10b981;
                }

                .status-indicator.disconnected {
                    background: #ef4444;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes typing {
                    0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                    40% { transform: scale(1); opacity: 1; }
                }

                .clear-button {
                    background: #ef4444;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    margin-bottom: 16px;
                }

                .clear-button:hover {
                    background: #dc2626;
                }
            </style>

            <div class="webhook-status">
                <div class="status-indicator" id="statusIndicator"></div>
                <span id="statusText">Webhook Status</span>
            </div>

            <button class="clear-button" id="clearButton">Clear Messages</button>

            <div class="output-container" id="outputContainer">
                <div class="empty-state">
                    Belum ada pesan. Pesan akan muncul di sini setelah Anda mengirim pesan.
                </div>
            </div>
        `;
  }

  setupWebhookListener() {
    const clearButton = this.shadowRoot.getElementById("clearButton");
    const statusIndicator = this.shadowRoot.getElementById("statusIndicator");
    const statusText = this.shadowRoot.getElementById("statusText");

    // Clear button event
    clearButton.addEventListener("click", () => {
      this.clearMessages();
    });

    // Update status
    this.updateStatus("disconnected", "Webhook tidak terhubung");
  }

  /**
   * Memulai listening untuk webhook dari n8n
   * @param {string} endpoint - URL endpoint untuk menerima webhook
   */
  startListening(endpoint) {
    this.webhookEndpoint = endpoint;
    this.isListening = true;
    this.updateStatus("connected", `Listening pada ${endpoint}`);

    // Setup polling untuk menerima pesan dari n8n
    this.startPolling();

    console.log(`ChatOutput mulai listening pada: ${endpoint}`);
  }

  /**
   * Mulai polling untuk menerima pesan dari webhook n8n
   */
  startPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    this.isListening = true;
    this.updateStatus("connected", "Polling active untuk pesan baru");

    this.pollingInterval = setInterval(async () => {
      await this.checkForNewMessages();
    }, 1000); // Poll setiap 1 detik untuk responsivitas yang lebih baik

    console.log("Polling dimulai untuk webhook output");
  }

  /**
   * Check untuk pesan baru dari n8n
   */
  async checkForNewMessages() {
    try {
      // Dalam implementasi nyata untuk n8n lokal, kita bisa menggunakan
      // polling ke endpoint khusus atau WebSocket
      // Untuk sekarang, kita akan mensimulasikan dengan localStorage
      // yang bisa diset oleh webhook response handler

      const pendingMessages = JSON.parse(
        localStorage.getItem("n8n_pending_messages") || "[]"
      );

      if (pendingMessages.length > 0) {
        // Process semua pending messages
        pendingMessages.forEach((messageData) => {
          this.addMessage(messageData);
        });

        // Clear pending messages
        localStorage.removeItem("n8n_pending_messages");
        console.log(
          `Processed ${pendingMessages.length} pending messages from n8n`
        );
      }
    } catch (error) {
      console.error("Error checking for new messages:", error);
    }
  }

  /**
   * Berhenti listening untuk webhook
   */
  stopListening() {
    this.isListening = false;

    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }

    this.updateStatus("disconnected", "Webhook dihentikan");
    console.log("ChatOutput berhenti listening");
  }

  /**
   * Update status webhook
   */
  updateStatus(status, text) {
    const statusIndicator = this.shadowRoot.getElementById("statusIndicator");
    const statusText = this.shadowRoot.getElementById("statusText");

    statusIndicator.className = `status-indicator ${status}`;
    statusText.textContent = text;
  }

  /**
   * Menambahkan pesan baru ke output
   * @param {Object} messageData - Data pesan dari webhook
   */
  addMessage(messageData) {
    const {
      message,
      sender = this.getBotName(),
      timestamp,
      type = "ai",
      isTyping = false,
    } = messageData;

    // Jika ini adalah typing indicator
    if (isTyping || type === "typing") {
      this.showTypingIndicator();
      return;
    }

    // Hapus typing indicator jika ada
    this.hideTypingIndicator();

    const messageItem = {
      id: Date.now() + Math.random(),
      message,
      sender,
      timestamp: timestamp || new Date(),
      type,
    };

    this.messages.push(messageItem);
    this.renderMessage(messageItem);
    this.scrollToBottom();
  }

  /**
   * Render pesan individual
   */
  renderMessage(messageItem) {
    const container = this.shadowRoot.getElementById("outputContainer");
    const emptyState = container.querySelector(".empty-state");

    // Remove empty state if exists
    if (emptyState) {
      emptyState.remove();
    }

    const messageElement = document.createElement("div");
    messageElement.className = "message-item";
    messageElement.id = `message-${messageItem.id}`;

    const time = new Date(messageItem.timestamp).toLocaleString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    messageElement.innerHTML = `
            <div class="message-header">
                <span class="message-sender">${messageItem.sender}</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-content ${messageItem.type}">
                ${this.formatMessage(messageItem.message)}
            </div>
        `;

    container.appendChild(messageElement);
  }

  /**
   * Format pesan untuk menampilkan HTML dengan aman
   */
  formatMessage(message) {
    // Escape HTML untuk keamanan
    const div = document.createElement("div");
    div.textContent = message;
    return div.innerHTML;
  }

  /**
   * Menampilkan typing indicator
   */
  showTypingIndicator() {
    const container = this.shadowRoot.getElementById("outputContainer");
    const existingIndicator = container.querySelector(".typing-indicator");

    if (existingIndicator) return;

    const indicator = document.createElement("div");
    indicator.className = "typing-indicator";
    indicator.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <span>${this.getTypingMessage()}</span>
        `;

    container.appendChild(indicator);
    this.scrollToBottom();
  }

  /**
   * Menyembunyikan typing indicator
   */
  hideTypingIndicator() {
    const container = this.shadowRoot.getElementById("outputContainer");
    const indicator = container.querySelector(".typing-indicator");
    if (indicator) {
      indicator.remove();
    }
  }

  /**
   * Scroll ke bagian bawah
   */
  scrollToBottom() {
    const container = this.shadowRoot.getElementById("outputContainer");
    container.scrollTop = container.scrollHeight;
  }

  /**
   * Clear semua pesan
   */
  clearMessages() {
    this.messages = [];
    const container = this.shadowRoot.getElementById("outputContainer");
    container.innerHTML = `
            <div class="empty-state">
                Belum ada pesan. Pesan akan muncul di sini setelah Anda mengirim pesan.
            </div>
        `;
  }

  /**
   * Simulasi menerima pesan dari webhook (untuk testing)
   */
  simulateWebhookMessage(message, sender = this.getBotName(), type = "ai") {
    this.addMessage({
      message,
      sender,
      timestamp: new Date(),
      type,
    });
  }

  /**
   * Method untuk testing - simulasi typing indicator
   */
  simulateTyping() {
    this.showTypingIndicator();
    setTimeout(() => {
      this.hideTypingIndicator();
      this.simulateWebhookMessage(
        "Ini adalah pesan simulasi dari AI!",
        this.getBotName(),
        "ai"
      );
    }, 2000);
  }

  /**
   * Setup listener untuk perubahan konfigurasi
   */
  setupConfigListener() {
    document.addEventListener("configChanged", (event) => {
      this.updateFromConfig();
      this.updateExistingMessages();
    });
  }

  /**
   * Update component dari konfigurasi
   */
  updateFromConfig() {
    if (!this.configManager) return;

    const config = this.configManager.getConfig();

    // Update title jika diperlukan
    const titleElement = this.shadowRoot.querySelector(".chat-title");
    if (titleElement) {
      titleElement.textContent = config.ui.title || `Chat ${config.botName}`;
    }
  }

  /**
   * Update existing messages dengan nama bot baru
   */
  updateExistingMessages() {
    const botName = this.getBotName();
    this.messages.forEach((msg) => {
      if (msg.type === "ai" || msg.type === "typing") {
        msg.sender = botName;
      }
    });
    this.updateDisplay();
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
   * Mendapatkan pesan typing dari konfigurasi
   * @returns {string} Typing message
   */
  getTypingMessage() {
    if (this.configManager) {
      return this.configManager.getTypingMessage();
    }
    return "AI sedang mengetik...";
  }

  /**
   * Mendapatkan avatar bot dari konfigurasi
   * @returns {string} Bot avatar
   */
  getBotAvatar() {
    if (this.configManager) {
      return this.configManager.getConfig().botAvatar;
    }
    return "🤖";
  }

  /**
   * Mendapatkan avatar user dari konfigurasi
   * @returns {string} User avatar
   */
  getUserAvatar() {
    if (this.configManager) {
      return this.configManager.getConfig().userAvatar;
    }
    return "👤";
  }
}

// Register web component
customElements.define("chat-output", ChatOutput);

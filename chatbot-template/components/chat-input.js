/**
 * Web Component untuk Input Chat User
 * Mengirim pesan ke webhook n8n dan memicu event untuk komponen lain
 */
class ChatInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.webhookUrl = this.getAttribute("webhook-url") || "";
    this.placeholder = this.getAttribute("placeholder") || "Type a message...";
    this.configManager = null; // Will be set in connectedCallback
  }

  connectedCallback() {
    // Wait for ConfigManager to be available
    setTimeout(() => {
      this.configManager = window.ConfigManager || null;
      if (this.configManager) {
        console.log("✅ chat-input: ConfigManager connected");
        this.setupConfigListener();
        this.updateFromConfig();
      } else {
        console.warn("⚠️ chat-input: ConfigManager not available");
      }
    }, 100);

    this.render();
    this.setupEventListeners();
    this.validateWebhookUrl();
  }

  render() {
    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }

                .input-container {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                    background: #ffffff;
                    border-top: 1px solid #e5e7eb;
                }

                .message-input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 1px solid #d1d5db;
                    border-radius: 24px;
                    font-size: 14px;
                    outline: none;
                    transition: border-color 0.2s ease;
                    text-align: left;
                }

                .message-input:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .message-input::placeholder {
                    color: #9ca3af;
                }

                .send-button {
                    width: 40px;
                    height: 40px;
                    border: none;
                    border-radius: 50%;
                    background: #3b82f6;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.2s ease;
                }

                .send-button:hover {
                    background: #2563eb;
                }

                .send-button:disabled {
                    background: #9ca3af;
                    cursor: not-allowed;
                }

                .send-icon {
                    width: 16px;
                    height: 16px;
                    fill: currentColor;
                }

                .error-message {
                    color: #ef4444;
                    font-size: 12px;
                    margin-top: 8px;
                    text-align: center;
                }
            </style>

            <div class="input-container">
                <input 
                    type="text" 
                    class="message-input" 
                    placeholder="${this.placeholder}"
                    id="messageInput"
                >
                <button class="send-button" id="sendButton">
                    <svg class="send-icon" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                </button>
            </div>
            <div class="error-message" id="errorMessage" style="display: none;"></div>
        `;
  }

  setupEventListeners() {
    const input = this.shadowRoot.getElementById("messageInput");
    const sendButton = this.shadowRoot.getElementById("sendButton");
    const errorMessage = this.shadowRoot.getElementById("errorMessage");

    // Handle Enter key press
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Handle send button click
    sendButton.addEventListener("click", () => {
      this.sendMessage();
    });

    // Handle input change for button state
    input.addEventListener("input", () => {
      sendButton.disabled = !input.value.trim();
    });

    // Initial button state
    sendButton.disabled = true;
  }

  async sendMessage() {
    const input = this.shadowRoot.getElementById("messageInput");
    const sendButton = this.shadowRoot.getElementById("sendButton");
    const errorMessage = this.shadowRoot.getElementById("errorMessage");

    const message = input.value.trim();

    if (!message) return;

    // Disable input and button during sending
    input.disabled = true;
    sendButton.disabled = true;
    errorMessage.style.display = "none";

    try {
      // Dispatch event untuk komponen lain
      this.dispatchEvent(
        new CustomEvent("messageSent", {
          detail: { message, timestamp: new Date() },
          bubbles: true,
          composed: true,
        })
      );

      // Tampilkan user message di chat-output terlebih dahulu
      this.addUserMessageToOutput(message);

      // Kirim ke webhook n8n jika URL tersedia
      if (this.webhookUrl) {
        // Show typing indicator
        this.showTypingIndicator();

        const response = await this.sendToWebhookWithRetry(message);

        // Hide typing indicator
        this.hideTypingIndicator();

        // Jika ada response dari webhook, simpan untuk chat-output
        if (response) {
          this.handleWebhookResponse(response);
        }
      }

      // Clear input
      input.value = "";
    } catch (error) {
      console.error("Error sending message:", error);
      errorMessage.textContent = "Gagal mengirim pesan. Silakan coba lagi.";
      errorMessage.style.display = "block";
    } finally {
      // Re-enable input and button
      input.disabled = false;
      sendButton.disabled = true; // Will be enabled when user types
      input.focus();
    }
  }

  async sendToWebhook(message) {
    if (!this.webhookUrl) {
      console.error("Webhook URL not configured");
      return;
    }

    console.log("Sending to webhook:", this.webhookUrl);
    console.log("Message data:", message);

    const payload = {
      chatInput: message,
      timestamp: new Date().toISOString(),
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
    };

    console.log("Full payload:", payload);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(this.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // Add CORS headers for local development
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
        mode: "cors", // Explicitly set CORS mode
      });

      clearTimeout(timeoutId);

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Webhook error response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      let responseData;
      try {
        responseData = await response.json();
        console.log("Webhook response:", responseData);
      } catch (jsonError) {
        console.warn("Response is not JSON:", jsonError);
        responseData = { success: true, status: response.status };
      }

      return responseData;
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Webhook request timed out");
        throw new Error(
          "Request timeout - webhook tidak merespons dalam 10 detik"
        );
      } else if (error.message.includes("Failed to fetch")) {
        console.error("Network error or CORS issue:", error);
        throw new Error(
          "Koneksi gagal - pastikan n8n berjalan dan webhook URL benar"
        );
      } else {
        console.error("Webhook error:", error);
        throw error;
      }
    }
  }

  async sendToWebhookWithRetry(message, maxRetries = 3) {
    // Daftar URL webhook yang akan dicoba
    const webhookUrls = [
      this.webhookUrl, // URL yang dikonfigurasi
      "http://localhost:5678/webhook/test",
      "http://localhost:5678/webhook-test/test",
      "http://localhost:5678/webhook/inputWebhook",
      // Tambahkan URL dari localStorage jika ada
      localStorage.getItem("correct_webhook_url"),
    ].filter((url) => url && url.trim()); // Filter URL yang valid

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      // Pada attempt pertama, coba URL yang dikonfigurasi
      // Pada attempt berikutnya, coba URL alternatif
      const urlToTry =
        attempt === 1
          ? this.webhookUrl
          : webhookUrls[attempt - 1] || this.webhookUrl;

      try {
        console.log(
          `Webhook attempt ${attempt}/${maxRetries} - URL: ${urlToTry}`
        );

        // Update webhook URL untuk attempt ini
        const originalUrl = this.webhookUrl;
        this.webhookUrl = urlToTry;

        const result = await this.sendToWebhook(message);

        console.log(
          `✅ Webhook success on attempt ${attempt} with URL: ${urlToTry}`
        );

        // Simpan URL yang berhasil
        if (urlToTry !== originalUrl) {
          localStorage.setItem("correct_webhook_url", urlToTry);
          console.log(`Saved working webhook URL: ${urlToTry}`);
        }

        return result;
      } catch (error) {
        console.error(`Webhook attempt ${attempt} failed:`, error.message);

        if (attempt === maxRetries) {
          console.error("All webhook attempts failed");
          this.showWebhookError(error, webhookUrls);
          throw error;
        }

        // Wait before retry (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 2000);
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Show helpful error message for webhook failures
   */
  showWebhookError(error, attemptedUrls) {
    console.error("🚨 Webhook Error Debug Info:");
    console.error("Attempted URLs:", attemptedUrls);
    console.error("Last Error:", error.message);

    // Show user-friendly error in the chat
    this.dispatchEvent(
      new CustomEvent("webhookError", {
        detail: {
          error: error.message,
          attemptedUrls: attemptedUrls,
          troubleshooting: `
Webhook gagal terhubung. Possible solutions:

1. 🔧 Buka n8n-diagnostic.html untuk auto-detect webhook URL
2. 🚀 Pastikan n8n berjalan: npx n8n start  
3. ⚙️ Setup webhook di n8n dengan:
   - HTTP Method: POST
   - Path: /inputWebhook (atau custom)
   - Response Mode: "Response to Webhook"
4. 🔗 Update URL di aplikasi dengan URL yang benar

Attempted URLs: ${attemptedUrls.join(", ")}
          `,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  getUserId() {
    // Generate atau ambil user ID dari localStorage
    let userId = localStorage.getItem("chatbot_user_id");
    if (!userId) {
      userId =
        "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("chatbot_user_id", userId);
    }
    return userId;
  }

  getSessionId() {
    // Generate session ID baru setiap kali halaman di-refresh
    let sessionId = sessionStorage.getItem("chatbot_session_id");
    if (!sessionId) {
      // Generate 32-character hexadecimal session ID
      sessionId = this.generateHexSessionId();
      sessionStorage.setItem("chatbot_session_id", sessionId);
    }
    return sessionId;
  }

  /**
   * Generate 32-character hexadecimal session ID
   * Format: "655ef24e1f374a71909c1015a60b1320"
   */
  generateHexSessionId() {
    const chars = "0123456789abcdef";
    let result = "";

    // Generate 32 random hexadecimal characters
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  }

  validateWebhookUrl() {
    if (!this.webhookUrl) {
      console.warn("Chat Input: No webhook URL configured");
      return false;
    }

    try {
      const url = new URL(this.webhookUrl);
      console.log("Chat Input: Webhook URL validated:", this.webhookUrl);
      console.log("- Protocol:", url.protocol);
      console.log("- Host:", url.host);
      console.log("- Path:", url.pathname);
      return true;
    } catch (error) {
      console.error("Chat Input: Invalid webhook URL:", this.webhookUrl, error);
      return false;
    }
  }

  // Method untuk mengatur webhook URL secara dinamis
  setWebhookUrl(url) {
    this.webhookUrl = url;
    this.setAttribute("webhook-url", url);
    this.validateWebhookUrl();
  }

  // Method untuk mengatur placeholder
  setPlaceholder(placeholder) {
    this.placeholder = placeholder;
    const input = this.shadowRoot.getElementById("messageInput");
    if (input) {
      input.placeholder = placeholder;
    }
  }

  /**
   * Tambahkan user message ke chat-output
   */
  addUserMessageToOutput(message) {
    try {
      const pendingMessages = JSON.parse(
        localStorage.getItem("n8n_pending_messages") || "[]"
      );

      const userMessageData = {
        message: message,
        sender: "You",
        timestamp: new Date(),
        type: "user",
      };

      pendingMessages.push(userMessageData);
      localStorage.setItem(
        "n8n_pending_messages",
        JSON.stringify(pendingMessages)
      );

      console.log("User message ditambahkan ke output:", userMessageData);
    } catch (error) {
      console.error("Error adding user message to output:", error);
    }
  }

  /**
   * Show typing indicator di chat-output
   */
  showTypingIndicator() {
    try {
      const pendingMessages = JSON.parse(
        localStorage.getItem("n8n_pending_messages") || "[]"
      );

      const typingIndicator = {
        message: this.getTypingMessage(),
        sender: this.getBotName(),
        timestamp: new Date(),
        type: "typing",
        isTyping: true,
      };

      pendingMessages.push(typingIndicator);
      localStorage.setItem(
        "n8n_pending_messages",
        JSON.stringify(pendingMessages)
      );

      console.log("Typing indicator ditampilkan");
    } catch (error) {
      console.error("Error showing typing indicator:", error);
    }
  }

  /**
   * Hide typing indicator di chat-output
   */
  hideTypingIndicator() {
    try {
      let pendingMessages = JSON.parse(
        localStorage.getItem("n8n_pending_messages") || "[]"
      );

      // Remove typing indicator
      pendingMessages = pendingMessages.filter((msg) => !msg.isTyping);

      localStorage.setItem(
        "n8n_pending_messages",
        JSON.stringify(pendingMessages)
      );

      console.log("Typing indicator dihapus");
    } catch (error) {
      console.error("Error hiding typing indicator:", error);
    }
  }

  /**
   * Handle response dari webhook n8n
   */
  handleWebhookResponse(responseData) {
    try {
      console.log("Raw webhook response:", responseData);
      console.log("Response type:", typeof responseData);

      // Simpan response ke localStorage untuk chat-output component
      const pendingMessages = JSON.parse(
        localStorage.getItem("n8n_pending_messages") || "[]"
      );

      // Extract message dengan berbagai cara untuk mengatasi [object Object]
      let extractedMessage;

      if (typeof responseData === "string") {
        extractedMessage = responseData;
      } else if (responseData && typeof responseData === "object") {
        // Try different property names that n8n might use
        extractedMessage =
          // n8n Cloud specific response formats
          (responseData.data && responseData.data.message) ||
          (responseData.data && responseData.data.text) ||
          (responseData.data && responseData.data.response) ||
          (responseData.data && responseData.data.content) ||
          (responseData.data && responseData.data.output) ||
          (responseData.data &&
            typeof responseData.data === "string" &&
            responseData.data) ||
          // Direct properties (n8n local format)
          responseData.message ||
          responseData.text ||
          responseData.content ||
          responseData.response ||
          responseData.output ||
          responseData.aiResponse ||
          responseData.chatOutput ||
          responseData.result ||
          // Special handling for n8n cloud success response
          (responseData.success &&
            responseData.status &&
            "Pesan diterima, tapi tidak ada respons dari bot. Periksa konfigurasi n8n Anda.") ||
          // Last resort - stringify the object
          JSON.stringify(responseData); // Fallback to JSON string
      } else {
        extractedMessage = String(responseData || "Response tidak valid");
      }

      console.log("Extracted message:", extractedMessage);

      // Jika respons hanya berisi status sukses tanpa konten pesan yang sebenarnya
      if (
        extractedMessage.includes('{"success":true,"status":') ||
        extractedMessage ===
          "Pesan diterima, tapi tidak ada respons dari bot. Periksa konfigurasi n8n Anda."
      ) {
        console.warn(
          "⚠️ Webhook hanya mengembalikan status sukses tanpa konten pesan"
        );
        extractedMessage =
          "⚠️ Webhook berhasil dipanggil, tetapi tidak mengembalikan pesan. Pastikan workflow n8n Anda dikonfigurasi untuk mengembalikan respons dengan format yang benar.";
      }

      const messageData = {
        message: extractedMessage,
        sender: this.getBotName(),
        timestamp: new Date(),
        type: "ai",
      };

      pendingMessages.push(messageData);
      localStorage.setItem(
        "n8n_pending_messages",
        JSON.stringify(pendingMessages)
      );

      console.log("Webhook response disimpan untuk chat-output:", messageData);

      // Dispatch event untuk notify komponen lain
      this.dispatchEvent(
        new CustomEvent("webhookResponse", {
          detail: messageData,
          bubbles: true,
          composed: true,
        })
      );
    } catch (error) {
      console.error("Error handling webhook response:", error);
    }
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
   * Update component dari konfigurasi
   */
  updateFromConfig() {
    if (!this.configManager) return;

    const config = this.configManager.getConfig();

    // Update placeholder jika tidak ada attribute
    if (!this.getAttribute("placeholder")) {
      this.placeholder = config.ui.placeholder;
      const input = this.shadowRoot.querySelector(".message-input");
      if (input) {
        input.placeholder = this.placeholder;
      }
    }

    // Update webhook URLs jika tidak ada attribute
    if (!this.getAttribute("webhook-url")) {
      this.webhookUrl = config.webhook.inputUrl;
    }
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
   * Mendapatkan URL webhook dari konfigurasi
   * @returns {Object} Webhook URLs
   */
  getWebhookUrls() {
    if (this.configManager) {
      return this.configManager.getWebhookUrls();
    }
    return {
      inputUrl: this.webhookUrl,
      outputUrl: this.webhookUrl,
    };
  }
}

// Register web component
customElements.define("chat-input", ChatInput);

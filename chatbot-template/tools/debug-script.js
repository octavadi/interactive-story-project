/**
 * Debug Script untuk Interactive Chatbot
 * Jalankan di console browser untuk debugging
 */

// Enable debug mode
localStorage.setItem("chatbot_debug", "true");

const ChatbotDebug = {
  /**
   * Check status semua komponen
   */
  checkComponents() {
    console.log("🔍 Checking Chatbot Components...");

    const results = {
      chatInput: document.querySelector("chat-input"),
      chatOutput: document.querySelector("chat-output"),
      chatManager: window.chatbotApp?.getChatManager(),
      customElements: typeof customElements !== "undefined",
      localStorage: typeof localStorage !== "undefined",
      fetch: typeof fetch !== "undefined",
    };

    console.log("📊 Component Status:", results);

    // Detail check
    if (results.chatInput) {
      console.log("✅ ChatInput found");
      console.log("   Webhook URL:", results.chatInput.webhookUrl);
      console.log("   Placeholder:", results.chatInput.placeholder);
    } else {
      console.log("❌ ChatInput not found");
    }

    if (results.chatOutput) {
      console.log("✅ ChatOutput found");
      console.log("   Is Listening:", results.chatOutput.isListening);
      console.log("   Webhook Endpoint:", results.chatOutput.webhookEndpoint);
    } else {
      console.log("❌ ChatOutput not found");
    }

    if (results.chatManager) {
      console.log("✅ ChatManager found");
      console.log("   Is Initialized:", results.chatManager.isInitialized);
      console.log("   Webhook Config:", results.chatManager.webhookConfig);
    } else {
      console.log("❌ ChatManager not found");
    }

    return results;
  },

  /**
   * Test webhook connection
   */
  async testWebhook(url = "http://localhost:5678/webhook/inputWebhook") {
    console.log("🔗 Testing webhook:", url);

    try {
      const payload = {
        chatInput: "Test dari debug script",
        timestamp: new Date().toISOString(),
        userId: "debug-user",
        sessionId: this.generateHexSessionId(),
      };

      console.log("📤 Sending payload:", payload);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      console.log("📥 Response status:", response.status);
      console.log("📥 Response text:", responseText);

      if (response.ok) {
        console.log("✅ Webhook test successful");
        return {
          success: true,
          status: response.status,
          response: responseText,
        };
      } else {
        console.log("❌ Webhook test failed");
        return { success: false, status: response.status, error: responseText };
      }
    } catch (error) {
      console.log("❌ Webhook test error:", error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * Test n8n server connection
   */
  async testN8nServer() {
    console.log("🔗 Testing n8n server connection...");

    try {
      const response = await fetch("http://localhost:5678/rest/login", {
        method: "GET",
        mode: "cors",
      });

      if (response.status === 401 || response.status === 200) {
        console.log("✅ n8n server is running on localhost:5678");
        return { success: true, status: response.status };
      } else {
        console.log("❓ Unexpected response from n8n:", response.status);
        return { success: false, status: response.status };
      }
    } catch (error) {
      console.log("❌ n8n server not accessible:", error.message);
      console.log("💡 Make sure n8n is running with: npx n8n start");
      return { success: false, error: error.message };
    }
  },

  /**
   * Simulate AI response
   */
  simulateAIResponse(message = "Ini adalah simulasi response dari AI") {
    console.log("🤖 Simulating AI response:", message);

    const chatOutput = document.querySelector("chat-output");
    if (chatOutput) {
      chatOutput.simulateWebhookMessage(message, "AI", "ai");
      console.log("✅ AI response simulated");
    } else {
      console.log("❌ ChatOutput not found");
    }
  },

  /**
   * Clear all chat messages
   */
  clearChat() {
    console.log("🧹 Clearing chat messages...");

    const chatOutput = document.querySelector("chat-output");
    const chatManager = window.chatbotApp?.getChatManager();

    if (chatOutput) {
      chatOutput.clearMessages();
      console.log("✅ ChatOutput cleared");
    }

    if (chatManager) {
      chatManager.clearMessageHistory();
      console.log("✅ ChatManager history cleared");
    }

    // Clear pending messages
    localStorage.removeItem("n8n_pending_messages");
    console.log("✅ Pending messages cleared");
  },

  /**
   * Check pending messages
   */
  checkPendingMessages() {
    const pending = JSON.parse(
      localStorage.getItem("n8n_pending_messages") || "[]"
    );
    console.log("📬 Pending messages:", pending.length);
    if (pending.length > 0) {
      console.log("Messages:", pending);
    }
    return pending;
  },

  /**
   * Add test message to pending
   */
  addTestPendingMessage(message = "Test message dari debug") {
    const pending = JSON.parse(
      localStorage.getItem("n8n_pending_messages") || "[]"
    );
    pending.push({
      message: message,
      sender: "AI",
      timestamp: new Date(),
      type: "ai",
    });
    localStorage.setItem("n8n_pending_messages", JSON.stringify(pending));
    console.log("✅ Test message added to pending");
  },

  /**
   * Get current config
   */
  getConfig() {
    const config = window.chatbotApp?.getConfig();
    console.log("⚙️ Current config:", config);
    return config;
  },

  /**
   * Test full flow
   */
  async testFullFlow() {
    console.log("🚀 Testing full chatbot flow...");

    // 1. Check components
    const components = this.checkComponents();
    if (!components.chatInput || !components.chatOutput) {
      console.log("❌ Missing required components");
      return false;
    }

    // 2. Test n8n server
    const n8nTest = await this.testN8nServer();
    if (!n8nTest.success) {
      console.log("⚠️ n8n server not accessible, but continuing...");
    }

    // 3. Simulate user message
    console.log("👤 Simulating user message...");
    const chatInput = components.chatInput;
    const input = chatInput.shadowRoot?.querySelector("#messageInput");
    const sendButton = chatInput.shadowRoot?.querySelector("#sendButton");

    if (input && sendButton) {
      input.value = "Test message dari debug script";
      sendButton.disabled = false;
      sendButton.click();
      console.log("✅ User message sent");

      // 4. Wait and check for response
      setTimeout(() => {
        const pending = this.checkPendingMessages();
        if (pending.length > 0) {
          console.log("✅ Response received");
        } else {
          console.log(
            "⚠️ No response received - this is normal if n8n is not configured"
          );
          // Add test response
          this.addTestPendingMessage("Test response dari debug script");
        }
      }, 2000);

      return true;
    } else {
      console.log("❌ Could not access input elements");
      return false;
    }
  },

  /**
   * Help - show available commands
   */
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
  },

  help() {
    console.log(`
🛠️ ChatbotDebug Commands:

Basic Checks:
• ChatbotDebug.checkComponents() - Check all components status
• ChatbotDebug.getConfig() - Get current configuration

Testing:
• ChatbotDebug.testN8nServer() - Test n8n server connection
• ChatbotDebug.testWebhook() - Test webhook endpoint
• ChatbotDebug.testFullFlow() - Test complete chatbot flow

Simulation:
• ChatbotDebug.simulateAIResponse("message") - Simulate AI response
• ChatbotDebug.addTestPendingMessage("message") - Add test message

Utilities:
• ChatbotDebug.clearChat() - Clear all chat messages
• ChatbotDebug.checkPendingMessages() - Check pending messages
• ChatbotDebug.help() - Show this help

Example usage:
ChatbotDebug.testFullFlow()
ChatbotDebug.generateHexSessionId() // Generate sample sessionId

📝 Note: sessionId format adalah 32-karakter hexadecimal seperti "655ef24e1f374a71909c1015a60b1320"
    `);
  },
};

// Make available globally
window.ChatbotDebug = ChatbotDebug;

console.log("🎯 ChatbotDebug loaded! Use ChatbotDebug.help() for commands");

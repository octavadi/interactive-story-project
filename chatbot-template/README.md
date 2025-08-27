# 🤖 **Chatbot Template - n8n Interactive Bot System**

## 📋 **Overview**

Template lengkap untuk mengintegrasikan chatbot n8n ke dalam proyek web story interaktif. Template ini menyediakan semua komponen yang diperlukan untuk membuat sistem chatbot yang dapat dipersonalisasi dan mudah dikonfigurasi.

## 📁 **Struktur Template**

```
chatbot-template/
├── components/           # Web Components untuk UI chatbot
│   ├── chat-input.js    # Komponen input chat
│   ├── chat-output.js   # Komponen output chat
│   └── bot-config.js    # Komponen konfigurasi bot
├── js/                  # JavaScript core modules
│   ├── config-manager.js # Manajemen konfigurasi
│   └── chat-manager.js   # Koordinasi chat components
├── tools/               # Tools debugging & testing
│   ├── n8n-diagnostic.html
│   ├── test-webhook-connection.html
│   ├── debug-script.js
│   └── test-config-sharing.js
├── examples/            # Contoh konfigurasi & workflow
│   ├── n8n-chatbot-workflow.json
│   └── example-configs.js
├── docs/                # Dokumentasi lengkap
│   ├── PERSONALIZATION_GUIDE.md
│   ├── WEBHOOK_TROUBLESHOOTING.md
│   └── DEBUG_GUIDE.md
├── botSetting.html      # Halaman pengaturan bot
└── README.md           # Dokumentasi template (file ini)
```

---

## 🚀 **Quick Start**

### **1. Setup Template di Proyek Baru**

```bash
# Copy chatbot-template ke proyek baru
cp -r chatbot-template/ /path/to/your-new-project/

# Atau gunakan setup script
./setup-new-project.sh your-project-name
```

### **2. Integrasi ke HTML**

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Interactive Story</title>

    <!-- Browser Compatibility -->
    <link rel="stylesheet" href="../styles/browser-compatibility.css" />
    <script src="../js/browser-polyfills.js"></script>

    <!-- Chatbot Template CSS -->
    <link rel="stylesheet" href="chatbot-template/styles/chatbot.css" />
  </head>
  <body>
    <!-- Your story content here -->

    <!-- Chatbot Components -->
    <div class="chat-section">
      <chat-output id="chatOutput"></chat-output>
      <chat-input id="chatInput" placeholder="Tulis pesan..."></chat-input>
    </div>

    <!-- Chatbot Template Scripts -->
    <script src="chatbot-template/js/config-manager.js"></script>
    <script src="chatbot-template/js/chat-manager.js"></script>
    <script src="chatbot-template/components/chat-input.js"></script>
    <script src="chatbot-template/components/chat-output.js"></script>

    <!-- Optional: Bot Configuration UI -->
    <script src="chatbot-template/components/bot-config.js"></script>
  </body>
</html>
```

### **3. Konfigurasi n8n Webhook**

1. Import workflow: `examples/n8n-chatbot-workflow.json`
2. Set webhook URLs di bot settings
3. Test koneksi menggunakan diagnostic tools

---

## ⚙️ **Konfigurasi Bot**

### **🎯 Basic Configuration**

```javascript
// Konfigurasi dasar bot
const botConfig = {
  botName: "Nama Bot Anda",
  botDescription: "Deskripsi bot",
  botAvatar: "🤖",
  userAvatar: "👤",
  webhookUrl: "http://localhost:5678/webhook/your-webhook-id",
  typingMessage: "Sedang mengetik...",
  placeholder: "Ketik pesan Anda...",
};

// Apply konfigurasi
window.ConfigManager.saveConfig(botConfig);
```

### **🎨 Personalisasi Lanjutan**

```javascript
// Load persona dari template
window.PersonaManager.apply("customer-service");

// Atau konfigurasi custom
const customPersona = {
  botName: "Arya",
  botDescription: "Asisten virtual yang membantu dalam petualangan",
  botAvatar: "🧙‍♀️",
  theme: {
    primaryColor: "#6366f1",
    backgroundColor: "#f8fafc",
  },
  webhookUrl: "http://localhost:5678/webhook/story-assistant",
};

window.ConfigManager.saveConfig(customPersona);
```

---

## 🔧 **Komponen Utama**

### **📥 Chat Input Component**

```html
<chat-input
  placeholder="Tulis pesan..."
  webhook-url="http://localhost:5678/webhook/your-id"
>
</chat-input>
```

**Features:**

- ✅ Auto-retry webhook calls
- ✅ Error handling & user feedback
- ✅ Typing indicators
- ✅ Session management
- ✅ Dynamic configuration

### **📤 Chat Output Component**

```html
<chat-output polling-interval="1000"></chat-output>
```

**Features:**

- ✅ Real-time message polling
- ✅ Message history
- ✅ Typing indicators
- ✅ Avatar support
- ✅ Responsive design

### **⚙️ Bot Config Component**

```html
<bot-config></bot-config>
```

**Features:**

- ✅ Visual configuration UI
- ✅ Real-time preview
- ✅ Import/Export settings
- ✅ Persona templates
- ✅ Webhook testing

---

## 🛠️ **Development Tools**

### **🔍 Diagnostic Tools**

- **n8n-diagnostic.html**: Auto-detect n8n webhooks
- **test-webhook-connection.html**: Test webhook connectivity
- **debug-script.js**: Debugging utilities
- **test-config-sharing.js**: Configuration testing

### **🧪 Testing Commands**

```javascript
// Test webhook connection
testWebhook("http://localhost:5678/webhook/test");

// Test full chat flow
testFullFlow();

// Debug configuration
debugConfigIssue();

// Test components
testChatComponents();
```

---

## 📚 **Documentation**

### **📖 Available Guides**

1. **PERSONALIZATION_GUIDE.md**: Cara personalisasi bot
2. **WEBHOOK_TROUBLESHOOTING.md**: Troubleshooting koneksi
3. **DEBUG_GUIDE.md**: Debugging comprehensive

### **🎯 API Reference**

#### **ConfigManager**

```javascript
// Get current configuration
const config = window.ConfigManager.getConfig();

// Save configuration
window.ConfigManager.saveConfig(newConfig);

// Reset to defaults
window.ConfigManager.resetConfig();

// Export/Import
const exported = window.ConfigManager.exportConfig();
window.ConfigManager.importConfig(exported);
```

#### **PersonaManager**

```javascript
// Apply predefined persona
window.PersonaManager.apply("customer-service");

// Get available personas
const personas = window.PersonaManager.getAvailable();

// Apply random persona
window.PersonaManager.random();
```

---

## 🔗 **Integration Examples**

### **Story Adventure Bot**

```javascript
const adventureBot = {
  botName: "Narrator",
  botDescription: "Pemandu cerita petualangan Anda",
  botAvatar: "📚",
  theme: {
    primaryColor: "#059669",
    secondaryColor: "#10b981",
  },
  webhookUrl: "http://localhost:5678/webhook/adventure-narrator",
};
```

### **Customer Service Bot**

```javascript
const serviceBot = {
  botName: "Assistant",
  botDescription: "Asisten layanan pelanggan",
  botAvatar: "💼",
  theme: {
    primaryColor: "#3b82f6",
    secondaryColor: "#60a5fa",
  },
  webhookUrl: "http://localhost:5678/webhook/customer-service",
};
```

### **Educational Bot**

```javascript
const teacherBot = {
  botName: "Guru Maya",
  botDescription: "Tutor virtual yang membantu pembelajaran",
  botAvatar: "👩‍🏫",
  theme: {
    primaryColor: "#8b5cf6",
    secondaryColor: "#a78bfa",
  },
  webhookUrl: "http://localhost:5678/webhook/education-tutor",
};
```

---

## 🚀 **Advanced Usage**

### **🔄 Multi-Bot Setup**

```javascript
// Configure multiple bots for different sections
const bots = {
  narrator: {
    botName: "Narrator",
    webhookUrl: "http://localhost:5678/webhook/narrator",
  },
  companion: {
    botName: "Companion",
    webhookUrl: "http://localhost:5678/webhook/companion",
  },
};

// Switch between bots
function switchBot(botKey) {
  window.ConfigManager.saveConfig(bots[botKey]);
}
```

### **🎯 Event Handling**

```javascript
// Listen for configuration changes
document.addEventListener("configChanged", (event) => {
  console.log("Bot config updated:", event.detail);
  updateUIBasedOnConfig(event.detail);
});

// Listen for webhook responses
document.addEventListener("webhookResponse", (event) => {
  console.log("Bot response:", event.detail);
  handleBotResponse(event.detail);
});
```

### **🔧 Custom Components**

```javascript
// Extend chat-input component
class CustomChatInput extends HTMLElement {
  connectedCallback() {
    // Import base functionality
    const template = document.querySelector("chat-input");
    // Add custom features
    this.addCustomFeatures();
  }

  addCustomFeatures() {
    // Your custom functionality
  }
}

customElements.define("custom-chat-input", CustomChatInput);
```

---

## 🔒 **Security Best Practices**

### **🛡️ Webhook Security**

```javascript
// Validate webhook URLs
function validateWebhookUrl(url) {
  return (
    url.startsWith("http://localhost:") ||
    url.startsWith("https://your-domain.com/")
  );
}

// Sanitize user input
function sanitizeInput(input) {
  return input.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
}
```

### **🔐 Configuration Security**

```javascript
// Encrypt sensitive configuration
function encryptConfig(config) {
  // Implement encryption for sensitive data
  return encryptedConfig;
}

// Validate configuration before saving
function validateConfig(config) {
  const required = ["botName", "webhookUrl"];
  return required.every((field) => config[field]);
}
```

---

## 🐛 **Troubleshooting**

### **❌ Common Issues**

1. **Webhook 404 Error**

   - Check n8n workflow is active
   - Verify webhook URL format
   - Use diagnostic tools

2. **Configuration Not Saving**

   - Check localStorage availability
   - Verify JSON format
   - Clear browser cache

3. **Components Not Loading**
   - Check script loading order
   - Verify file paths
   - Use browser-polyfills.js

### **🔧 Debug Commands**

```javascript
// Check template status
console.log("Template Status:", window.ChatbotTemplate?.status);

// Test all components
window.ChatbotTemplate?.testAll();

// Reset everything
window.ChatbotTemplate?.reset();
```

---

## 📦 **Deployment**

### **📤 Production Checklist**

- [ ] Update webhook URLs to production
- [ ] Minify JavaScript files
- [ ] Optimize CSS
- [ ] Test all browsers
- [ ] Validate n8n workflows
- [ ] Setup monitoring

### **🌐 CDN Integration**

```html
<!-- Use CDN for production -->
<script src="https://cdn.your-domain.com/chatbot-template/latest/chatbot.min.js"></script>
<link
  rel="stylesheet"
  href="https://cdn.your-domain.com/chatbot-template/latest/chatbot.min.css"
/>
```

---

## 📄 **License & Support**

### **📜 License**

This template is provided under MIT License. Feel free to use, modify, and distribute.

### **🆘 Support**

- 📖 Check documentation in `/docs/`
- 🧪 Use diagnostic tools in `/tools/`
- 🔍 Search existing issues
- 💬 Contact support team

---

## 🎯 **Next Steps**

1. **📖 Read Documentation**: Familiarize yourself with all guides
2. **🧪 Test Integration**: Use diagnostic tools
3. **🎨 Customize**: Apply your branding and persona
4. **🚀 Deploy**: Move to production environment
5. **📊 Monitor**: Track performance and user experience

---

**🎉 Happy Coding! Template siap untuk membuat chatbot interactive yang amazing! 🚀**

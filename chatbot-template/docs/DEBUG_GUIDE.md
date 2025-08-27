# 🛠️ Panduan Debug Chatbot dengan n8n

## Masalah Yang Telah Diperbaiki

### ✅ **Perbaikan Utama:**

1. **URL Webhook Konsisten**: Diperbaiki URL webhook di `main.js` untuk input dan output yang berbeda
2. **Polling Chat Output**: Diperbaiki error di chat-manager.js untuk polling interval
3. **Response Handler**: Ditambahkan handler untuk response dari n8n webhook
4. **Konflik n8n Embedded**: Dinonaktifkan n8n embedded chat untuk mencegah konflik
5. **Debug Tools**: Ditambahkan tools untuk testing dan debugging

### 🔧 **File Yang Dimodifikasi:**

- `js/main.js` - Diperbaiki konfigurasi webhook URL
- `js/chat-manager.js` - Diperbaiki polling interval
- `components/chat-input.js` - Ditambahkan webhook response handler
- `components/chat-output.js` - Ditambahkan polling untuk pesan baru
- `index.html` - Dinonaktifkan n8n embedded chat

### 📁 **File Baru:**

- `test-webhook-connection.html` - Tool untuk test koneksi webhook
- `n8n-workflow-config.json` - Konfigurasi workflow n8n
- `debug-script.js` - Script debug untuk console
- `DEBUG_GUIDE.md` - Panduan debug ini

## Langkah-langkah Testing

### 1. **Setup n8n Lokal**

```bash
# Install n8n (jika belum)
npm install -g n8n

# Jalankan n8n
npx n8n start
```

n8n akan berjalan di: http://localhost:5678

### 2. **Konfigurasi Webhook di n8n**

1. Buka n8n di browser: http://localhost:5678
2. Buat workflow baru
3. Tambahkan node berikut:

**Webhook Input Node:**

- Type: Webhook
- HTTP Method: POST
- Webhook URL: `/inputWebhook`
- Response Mode: Return Response

**Code Node (untuk proses pesan):**

```javascript
// Proses pesan dari user
const userMessage = $input.first().json.message;
const userId = $input.first().json.userId;
const sessionId = $input.first().json.sessionId;

// Contoh response sederhana
let aiResponse = "";

if (
  userMessage.toLowerCase().includes("hello") ||
  userMessage.toLowerCase().includes("halo")
) {
  aiResponse =
    "Halo! Senang bertemu dengan Anda. Bagaimana saya bisa membantu hari ini?";
} else if (userMessage.toLowerCase().includes("layanan")) {
  aiResponse =
    "Kami menyediakan berbagai layanan teknologi. Layanan mana yang ingin Anda ketahui?";
} else {
  aiResponse = `Terima kasih atas pesan: "${userMessage}". Saya akan membantu Anda.`;
}

return {
  response: {
    message: aiResponse,
    timestamp: new Date().toISOString(),
    userId: userId,
    sessionId: sessionId,
    type: "ai_response",
  },
};
```

**Respond to Webhook Node:**

- Respond With: JSON
- Response Body: `{{ $json.response }}`

4. Hubungkan semua node dan aktifkan workflow

### 3. **Test Koneksi**

#### A. Test Koneksi n8n Server

Buka: `test-webhook-connection.html` di browser dan klik "Test Koneksi n8n"

#### B. Test Webhook Manual

```bash
curl -X POST http://localhost:5678/webhook/inputWebhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello from curl",
    "timestamp": "2024-01-01T00:00:00Z",
    "userId": "test-user",
    "sessionId": "test-session"
  }'
```

#### C. Test di Browser Console

1. Buka `index.html` di browser
2. Buka Developer Console (F12)
3. Load debug script:

```javascript
// Copy paste isi debug-script.js atau load via:
var script = document.createElement("script");
script.src = "debug-script.js";
document.head.appendChild(script);

// Lalu jalankan test:
ChatbotDebug.help();
ChatbotDebug.testFullFlow();
```

### 4. **Test Chatbot Interface**

1. Buka `index.html` di browser
2. Ketik pesan di input field
3. Klik Send atau tekan Enter
4. Periksa:
   - Console untuk log webhook
   - Network tab untuk request HTTP
   - Response di chat output

## Debugging Common Issues

### ❌ **"Webhook tidak merespons"**

**Causes:**

- n8n tidak berjalan
- Webhook URL salah
- Workflow tidak aktif
- CORS error

**Solutions:**

```javascript
// Test koneksi n8n
ChatbotDebug.testN8nServer();

// Test webhook URL
ChatbotDebug.testWebhook("http://localhost:5678/webhook/inputWebhook");

// Check konfigurasi
ChatbotDebug.getConfig();
```

### ❌ **"Komponen tidak loading"**

**Solutions:**

```javascript
// Check semua komponen
ChatbotDebug.checkComponents();

// Manual check
console.log("ChatInput:", document.querySelector("chat-input"));
console.log("ChatOutput:", document.querySelector("chat-output"));
console.log("ChatManager:", window.chatbotApp?.getChatManager());
```

### ❌ **"Pesan tidak muncul di output"**

**Solutions:**

```javascript
// Check pending messages
ChatbotDebug.checkPendingMessages();

// Simulate response
ChatbotDebug.simulateAIResponse("Test response");

// Check polling
const chatOutput = document.querySelector("chat-output");
console.log("Is Listening:", chatOutput.isListening);
console.log("Polling Interval:", chatOutput.pollingInterval);
```

### ❌ **"CORS Error"**

n8n biasanya sudah menghandle CORS, tapi jika masih error:

1. Restart n8n dengan environment variable:

```bash
export N8N_CORS_ORIGIN="*"
npx n8n start
```

2. Atau edit n8n config untuk allow localhost

## Monitoring & Logging

### Enable Debug Mode

```javascript
localStorage.setItem("chatbot_debug", "true");
```

### Check Logs

```javascript
// Browser console akan menampilkan:
console.log("Sending to webhook:", url);
console.log("Message data:", message);
console.log("Response:", response);
```

### Network Monitoring

1. Buka Developer Tools (F12)
2. Go to Network tab
3. Kirim pesan
4. Check requests ke localhost:5678

## Advanced Testing

### Test dengan Multiple Messages

```javascript
async function testMultipleMessages() {
  const messages = [
    "Hello",
    "Apa layanan yang tersedia?",
    "Berapa harga konsultasi?",
    "Terima kasih",
  ];

  for (let msg of messages) {
    await ChatbotDebug.testWebhook(
      "http://localhost:5678/webhook/inputWebhook"
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
```

### Load Testing

```javascript
async function loadTest(count = 10) {
  const promises = [];
  for (let i = 0; i < count; i++) {
    promises.push(
      ChatbotDebug.testWebhook("http://localhost:5678/webhook/inputWebhook")
    );
  }

  const results = await Promise.all(promises);
  console.log("Load test results:", results);
}
```

## Troubleshooting Checklist

### ✅ **Pre-flight Check:**

- [ ] n8n berjalan di localhost:5678
- [ ] Workflow di n8n aktif
- [ ] Webhook URL benar di konfigurasi
- [ ] Browser support Web Components
- [ ] No JavaScript errors di console

### ✅ **Runtime Check:**

- [ ] ChatInput component loaded
- [ ] ChatOutput component loaded
- [ ] ChatManager initialized
- [ ] Webhook request berhasil (Network tab)
- [ ] Response diterima dari n8n
- [ ] Message muncul di chat output

### ✅ **Integration Check:**

- [ ] User input → webhook → n8n → response → output
- [ ] Message history tersimpan
- [ ] Polling berfungsi untuk output
- [ ] Error handling bekerja

## Support Scripts

Load di console untuk debugging cepat:

```javascript
// Quick status check
ChatbotDebug.checkComponents();

// Quick webhook test
ChatbotDebug.testWebhook();

// Full integration test
ChatbotDebug.testFullFlow();

// Clear and reset
ChatbotDebug.clearChat();
```

## File Struktur Akhir

```
interactiveStory_proj/
├── components/
│   ├── chat-input.js          # ✅ Updated
│   └── chat-output.js         # ✅ Updated
├── js/
│   ├── chat-manager.js        # ✅ Updated
│   └── main.js               # ✅ Updated
├── index.html                # ✅ Updated
├── test-webhook-connection.html  # 🆕 New
├── n8n-workflow-config.json    # 🆕 New
├── debug-script.js            # 🆕 New
└── DEBUG_GUIDE.md            # 🆕 New
```

Semua komponen telah diperbaiki dan siap untuk testing dengan n8n lokal!

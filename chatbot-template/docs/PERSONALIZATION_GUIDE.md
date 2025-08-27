# 🎨 **Panduan Personalisasi Chatbot**

## 📋 **Daftar Isi**

1. [📖 Overview](#overview)
2. [⚙️ Cara Menggunakan](#cara-menggunakan)
3. [🎛️ Pengaturan Tersedia](#pengaturan-tersedia)
4. [💾 Backup & Restore](#backup--restore)
5. [🔧 Konfigurasi Lanjutan](#konfigurasi-lanjutan)
6. [🚀 API Reference](#api-reference)
7. [🔍 Troubleshooting](#troubleshooting)

---

## 📖 **Overview**

Sistem personalisasi chatbot memungkinkan Anda untuk:

- ✨ **Mengubah nama dan deskripsi bot**
- 🎭 **Mengatur avatar bot dan user**
- 🎨 **Menyesuaikan UI/UX**
- 🔗 **Mengonfigurasi webhook n8n**
- 💾 **Backup dan restore konfigurasi**
- 🔄 **Perubahan real-time tanpa refresh**

---

## ⚙️ **Cara Menggunakan**

### **1. Akses Form Pengaturan**

Klik tombol **⚙️** di header chatbot untuk membuka form konfigurasi.

### **2. Isi Form Pengaturan**

![Preview Section](docs/config-preview.png)

**✅ Required Fields:**

- **Nama Chatbot**: Nama yang akan ditampilkan (maks 50 karakter)

**📝 Optional Fields:**

- **Deskripsi**: Penjelasan kepribadian bot (maks 200 karakter)
- **Avatar Bot**: Emoji untuk bot (default: 🤖)
- **Avatar User**: Emoji untuk user (default: 👤)
- **Placeholder**: Teks placeholder input
- **Pesan Typing**: Suffix untuk "Nama sedang mengetik..."
- **Webhook URLs**: URL n8n untuk input dan output

### **3. Preview Real-time**

Semua perubahan langsung terlihat di bagian preview:

```
🤖 Arya sedang mengetik...
AI Assistant yang siap membantu Anda
```

### **4. Simpan Konfigurasi**

Klik **💾 Simpan** untuk menerapkan perubahan ke seluruh aplikasi.

---

## 🎛️ **Pengaturan Tersedia**

### **🏷️ Identitas Bot**

| Field            | Tipe   | Default                                | Deskripsi           |
| ---------------- | ------ | -------------------------------------- | ------------------- |
| `botName`        | String | "Arya"                                 | Nama bot (required) |
| `botDescription` | String | "AI Assistant yang siap membantu Anda" | Deskripsi bot       |
| `botAvatar`      | String | "🤖"                                   | Emoji avatar bot    |
| `userAvatar`     | String | "👤"                                   | Emoji avatar user   |

### **💬 UI/UX Settings**

| Field            | Tipe   | Default               | Deskripsi               |
| ---------------- | ------ | --------------------- | ----------------------- |
| `ui.placeholder` | String | "Ketik pesan Anda..." | Placeholder input       |
| `ui.title`       | String | "Chat {botName}"      | Judul aplikasi          |
| `typing.message` | String | "sedang mengetik..."  | Suffix typing indicator |

### **🔗 Webhook Configuration**

| Field               | Tipe   | Default                                       | Deskripsi                   |
| ------------------- | ------ | --------------------------------------------- | --------------------------- |
| `webhook.inputUrl`  | String | "http://localhost:5678/webhook/inputWebhook"  | URL untuk mengirim pesan    |
| `webhook.outputUrl` | String | "http://localhost:5678/webhook/outputWebhook" | URL untuk menerima response |

---

## 💾 **Backup & Restore**

### **📥 Export Konfigurasi**

1. Klik **📥 Export Config**
2. File JSON akan terdownload: `chatbot-config-YYYY-MM-DD.json`

### **📤 Import Konfigurasi**

1. Klik **📤 Import Config**
2. Pilih file JSON konfigurasi
3. Konfigurasi akan langsung diterapkan

### **🔄 Reset ke Default**

Klik **🔄 Reset Default** untuk kembali ke pengaturan awal.

---

## 🔧 **Konfigurasi Lanjutan**

### **🎨 Template Konfigurasi**

#### **Personal Assistant**

```json
{
  "botName": "Maya",
  "botDescription": "Asisten pribadi yang ramah dan helpful",
  "botAvatar": "👩‍💼",
  "userAvatar": "👨‍💻",
  "ui": {
    "placeholder": "Apa yang bisa Maya bantu hari ini?",
    "title": "Maya - Personal Assistant"
  }
}
```

#### **Customer Service**

```json
{
  "botName": "Alex",
  "botDescription": "Customer Service 24/7 siap membantu",
  "botAvatar": "🎧",
  "userAvatar": "👤",
  "ui": {
    "placeholder": "Ceritakan keluhan atau pertanyaan Anda...",
    "title": "Alex - Customer Support"
  }
}
```

#### **Educational Bot**

```json
{
  "botName": "Profesor",
  "botDescription": "Bot edukasi untuk pembelajaran interaktif",
  "botAvatar": "👨‍🏫",
  "userAvatar": "👨‍🎓",
  "ui": {
    "placeholder": "Tanya apa saja tentang pelajaran...",
    "title": "Profesor - Learning Assistant"
  }
}
```

### **🔌 Multiple Environment Setup**

#### **Development**

```json
{
  "webhook": {
    "inputUrl": "http://localhost:5678/webhook/dev-input",
    "outputUrl": "http://localhost:5678/webhook/dev-output"
  }
}
```

#### **Production**

```json
{
  "webhook": {
    "inputUrl": "https://n8n.yourcompany.com/webhook/prod-input",
    "outputUrl": "https://n8n.yourcompany.com/webhook/prod-output"
  }
}
```

---

## 🚀 **API Reference**

### **ConfigManager Methods**

#### **📖 Mengambil Konfigurasi**

```javascript
const config = window.ConfigManager.getConfig();
console.log(config.botName); // "Arya"
```

#### **💾 Menyimpan Konfigurasi**

```javascript
const success = window.ConfigManager.saveConfig({
  botName: "NewBot",
  botDescription: "Updated description",
});
```

#### **🔄 Reset Konfigurasi**

```javascript
const defaultConfig = window.ConfigManager.resetConfig();
```

#### **📥 Export/Import**

```javascript
// Export
const jsonString = window.ConfigManager.exportConfig();

// Import
const success = window.ConfigManager.importConfig(jsonString);
```

### **Event Handling**

#### **🔔 Listen Config Changes**

```javascript
document.addEventListener("configChanged", (event) => {
  const newConfig = event.detail;
  console.log("Config updated:", newConfig);
});
```

#### **⚠️ Validation**

```javascript
const validation = window.ConfigManager.validateConfig(config);
if (!validation.isValid) {
  console.error("Validation errors:", validation.errors);
}
```

---

## 🔍 **Troubleshooting**

### **❌ Form Tidak Muncul**

**Problem**: Tombol ⚙️ tidak menampilkan form

**Solution**:

1. ✅ Pastikan `bot-config.js` dimuat
2. ✅ Pastikan `config-manager.js` dimuat sebelum komponen lain
3. ✅ Check console untuk error JavaScript

### **🔄 Perubahan Tidak Tersimpan**

**Problem**: Konfigurasi tidak persistent setelah refresh

**Solution**:

1. ✅ Check localStorage browser
2. ✅ Pastikan tidak ada error di console
3. ✅ Coba clear localStorage: `localStorage.removeItem('chatbot_config')`

### **🚫 Validasi Error**

**Problem**: Form menampilkan error validasi

**Common Issues**:

- **Nama kosong**: Nama bot wajib diisi
- **URL invalid**: Format webhook URL salah
- **Karakter berlebih**: Nama >50 atau deskripsi >200 karakter

### **🔗 Webhook Tidak Berfungsi**

**Problem**: Bot tidak merespon setelah ganti URL

**Solution**:

1. ✅ Test URL dengan curl:
   ```bash
   curl -X POST "YOUR_WEBHOOK_URL" \\
        -H "Content-Type: application/json" \\
        -d '{"chatInput":"test","userId":"test","sessionId":"test"}'
   ```
2. ✅ Pastikan n8n workflow aktif
3. ✅ Check network tab di browser dev tools

### **💾 Import/Export Bermasalah**

**Problem**: File konfigurasi tidak bisa diimport

**Solution**:

1. ✅ Pastikan file format JSON valid
2. ✅ Check struktur JSON sesuai dengan schema
3. ✅ Gunakan validator JSON online

---

## 📚 **Contoh Penggunaan**

### **🎭 Quick Persona Change**

```javascript
// Ganti ke persona customer service
window.ConfigManager.saveConfig({
  botName: "Sarah",
  botDescription: "Customer Service Representative",
  botAvatar: "👩‍💼",
  ui: {
    placeholder: "Bagaimana kami bisa membantu Anda?",
    title: "Sarah - Customer Support",
  },
});
```

### **🔧 Dynamic Webhook Setup**

```javascript
// Setup untuk environment berbeda
const isDev = window.location.hostname === "localhost";

window.ConfigManager.saveConfig({
  webhook: {
    inputUrl: isDev
      ? "http://localhost:5678/webhook/dev-input"
      : "https://prod.n8n.com/webhook/input",
    outputUrl: isDev
      ? "http://localhost:5678/webhook/dev-output"
      : "https://prod.n8n.com/webhook/output",
  },
});
```

### **🎨 Theme Switching**

```javascript
// Persona tema gelap
window.ConfigManager.saveConfig({
  botName: "Shadow",
  botDescription: "Dark theme assistant",
  botAvatar: "🖤",
  userAvatar: "👤",
  ui: {
    placeholder: "Speak into the void...",
    title: "Shadow - Dark Assistant",
  },
});
```

---

## 🎯 **Best Practices**

### **✅ DO's**

- ✅ **Test konfigurasi** sebelum deploy production
- ✅ **Backup konfigurasi** sebelum perubahan major
- ✅ **Gunakan nama descriptive** untuk bot
- ✅ **Validasi webhook URLs** sebelum menyimpan
- ✅ **Monitor console** untuk error setelah perubahan

### **❌ DON'Ts**

- ❌ **Jangan hardcode** konfigurasi di component
- ❌ **Jangan lupa** update n8n workflow sesuai persona
- ❌ **Jangan gunakan** karakter special berlebihan
- ❌ **Jangan abaikan** validation warnings
- ❌ **Jangan deploy** tanpa test di development

---

## 🔮 **Roadmap & Future Features**

### **🚀 Coming Soon**

- 🎨 **Visual Theme Editor** - Custom CSS themes
- 🌍 **Multi-language Support** - i18n integration
- 📱 **Mobile Responsive Config** - Touch-friendly settings
- 🔐 **Access Control** - User permission system
- 📊 **Analytics Integration** - Usage tracking
- 🤖 **AI-Powered Suggestions** - Smart configuration recommendations

### **💡 Feature Requests**

Punya ide fitur baru? Buat issue di repository atau diskusikan di:

- 📧 Email: [your-email@domain.com]
- 💬 Chat: [Discord/Slack Link]
- 🐛 Issues: [GitHub Issues Link]

---

**🎉 Selamat! Anda sekarang bisa membuat chatbot dengan persona yang unik dan sesuai kebutuhan!**

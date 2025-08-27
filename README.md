# 📖 Interactive Story Project

[![GitHub](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](#)

Template sistem untuk membuat interactive story dengan integrasi chatbot n8n. Proyek ini menggunakan arsitektur modular dengan chatbot template yang dapat digunakan ulang di berbagai proyek story.

## ✨ Demo

![Interactive Story Demo](assets/images/posterStory_gemini2.5.png)

## 🚀 Features

### 📖 Story Features
- ✅ Interactive story content dengan pilihan cerita
- ✅ Editable text (double-click to edit)  
- ✅ Image upload untuk scenes
- ✅ Responsive design untuk semua device
- ✅ Navigation system yang intuitif
- ✅ Chat history dan save progress

### 🤖 Chatbot Features
- ✅ n8n workflow integration
- ✅ Real-time chat dengan typing indicators
- ✅ Configurable bot personality
- ✅ Multiple persona templates
- ✅ Message history dan context awareness
- ✅ Error handling & retry mechanism
- ✅ Webhook security protection

### 🔧 Technical Features
- ✅ Cross-browser compatibility (Chrome, Safari, Edge, Firefox)
- ✅ Mobile-first responsive design
- ✅ Web Components architecture
- ✅ Modular template system
- ✅ Comprehensive debugging tools
- ✅ Performance optimized
- ✅ PWA ready

## 🏗️ Project Structure

```
interactiveStory_proj/
├── 📄 index.html                    # Main story page
├── 📄 discussion.html               # Discussion page
├── 🎨 styles/                       # Styling files
│   ├── main.css                     # Core styles
│   ├── index.css                    # Homepage styles
│   ├── discussion.css               # Discussion page styles
│   └── browser-compatibility.css    # Cross-browser support
├── ⚡ js/                           # JavaScript files
│   ├── main.js                      # Main story logic
│   ├── browser-polyfills.js         # Browser compatibility
│   ├── error-handler.js             # Error management
│   ├── performance-utils.js         # Performance utilities
│   └── chat-history-manager.js      # Chat history functionality
├── 🤖 chatbot-template/             # Reusable chatbot system
│   ├── components/                  # Chat UI components
│   ├── js/                          # Core chatbot logic
│   ├── styles/                      # Chatbot styling
│   ├── tools/                       # Debugging tools
│   ├── examples/                    # Configuration examples
│   └── docs/                        # Template documentation
├── 🧪 testing/                      # Test files
│   ├── test-chat-history.html
│   ├── test-discussion.html
│   ├── browser-test.html
│   └── test-markdown-cleanup.html
├── 🧩 components/                   # Shared components
│   └── shared-footer.js
├── 🖼️ assets/                       # Static assets
│   ├── images/                      # Story images
│   └── icons/                       # UI icons
└── 🛠️ scripts/                      # Utility scripts
    ├── cleanup-old-files.sh
    └── setup-new-project.sh
```

## 🚀 Quick Start

### 📋 Prerequisites
- Web browser yang modern (Chrome 60+, Safari 12+, Edge 79+, Firefox 65+)
- Local web server (optional, untuk development)
- n8n instance untuk chatbot integration

### 🎯 Running Locally

1. **Clone repository**
```bash
git clone https://github.com/yourusername/interactive-story-project.git
cd interactive-story-project
```

2. **Open in browser**
```bash
# Langsung buka file
open index.html

# Atau gunakan local server (recommended)
python -m http.server 8000
# Then visit http://localhost:8000
```

3. **Configure chatbot** (optional)
```bash
# Buka bot configuration
open chatbot-template/botSetting.html
```

### ⚙️ Configuration

#### 🤖 Bot Setup
1. **Setup n8n workflow**: Import `chatbot-template/examples/n8n-chatbot-workflow.json`
2. **Configure bot settings**: Buka `chatbot-template/botSetting.html`
3. **Set webhook URL**: Update endpoint di konfigurasi bot
4. **Choose persona**: Pilih dari predefined templates
5. **Test connection**: Gunakan diagnostic tools

#### 🎨 Customization
```javascript
// Configure story-specific bot
const storyConfig = {
    botName: "Story Narrator",
    botDescription: "Your guide through this adventure",
    botAvatar: "📚",
    webhookUrl: "YOUR_WEBHOOK_URL_HERE", // Jangan commit URL asli!
    theme: {
        primaryColor: "#3b82f6",
        secondaryColor: "#60a5fa"
    }
};

window.ConfigManager.saveConfig(storyConfig);
```

## 🛠️ Development

### 🆕 Creating New Story Project
```bash
# Gunakan setup script
./scripts/setup-new-project.sh my-new-story

# Atau manual copy template
cp -r chatbot-template/ /path/to/new-project/
```

### 🧪 Testing
```bash
# Browser compatibility test
open testing/browser-test.html

# Chat history test
open testing/test-chat-history.html

# Webhook connection test
open chatbot-template/tools/test-webhook-connection.html

# n8n diagnostic
open chatbot-template/tools/n8n-diagnostic.html
```

### 📱 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| **Chrome** | 60+ | 🟢 Full Support |
| **Safari** | 12+ | 🟢 Full Support |
| **Edge** | 79+ | 🟢 Full Support |
| **Firefox** | 65+ | 🟢 Full Support |

## 🔒 Security

> **⚠️ Important**: Jangan commit webhook URLs atau API keys ke repository!

- Gunakan environment variables untuk sensitive data
- Webhook URLs dan secrets sudah di-exclude dalam `.gitignore`
- Test konfigurasi menggunakan file local yang tidak di-track git

## 📚 Documentation

- **[Chatbot Template Guide](chatbot-template/README.md)**: Dokumentasi lengkap template
- **[Browser Compatibility](BROWSER_COMPATIBILITY.md)**: Cross-browser support guide
- **[Template Usage](TEMPLATE_USAGE.md)**: Cara menggunakan template system

## 🤝 Contributing

1. Fork repository ini
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add some amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 🐛 Troubleshooting

### Common Issues
- **Webhook 404**: Pastikan n8n workflow sudah aktif
- **Config Not Saving**: Cek localStorage availability di browser
- **Components Not Loading**: Periksa script loading order
- **CORS Errors**: Configure n8n CORS settings

### Debug Tools
- Gunakan `testing/browser-test.html` untuk compatibility testing
- Check `chatbot-template/tools/` untuk debugging utilities
- Buka browser console untuk error messages
- Test webhook connectivity dengan diagnostic tools

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web standards
- Powered by n8n for chatbot integration
- Icons and images generated with AI assistance
- Cross-browser compatibility tested extensively

## 🎉 Next Steps

1. **📖 Explore Documentation**: Familiarize dengan template system
2. **🧪 Test Integration**: Gunakan diagnostic tools
3. **🎨 Customize**: Apply story theme dan branding
4. **🚀 Create New Stories**: Use setup script untuk new projects
5. **🤝 Contribute**: Share improvements back ke community

---

**🚀 Happy storytelling! Mari buat interactive stories yang amazing! 🚀**

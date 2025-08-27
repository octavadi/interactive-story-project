#!/bin/bash

# ===========================================
# Cleanup Old Files Script
# Remove duplicate files after template restructure
# ===========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "🧹 Starting cleanup of old duplicate files..."

# Files that were moved to chatbot-template/
OLD_FILES=(
    "botSetting.html"
    "components/chat-input.js"
    "components/chat-output.js" 
    "components/bot-config.js"
    "js/config-manager.js"
    "js/chat-manager.js"
    "example-configs.js"
    "n8n-chatbot-workflow.json"
    "n8n-diagnostic.html"
    "test-webhook-connection.html"
    "debug-script.js"
    "test-config-sharing.js"
    "PERSONALIZATION_GUIDE.md"
    "WEBHOOK_TROUBLESHOOTING.md"
    "DEBUG_GUIDE.md"
)

# Check if chatbot-template exists
if [ ! -d "chatbot-template" ]; then
    print_error "chatbot-template directory not found!"
    print_warning "Make sure you have run the template restructure first"
    exit 1
fi

# Show what will be removed
print_status "The following files will be removed (they are now in chatbot-template/):"
for file in "${OLD_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ❌ $file"
    fi
done

echo ""
read -p "Do you want to continue with cleanup? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Cleanup cancelled"
    exit 0
fi

# Remove old files
print_status "Removing old duplicate files..."

for file in "${OLD_FILES[@]}"; do
    if [ -f "$file" ]; then
        rm "$file"
        print_success "Removed: $file"
    elif [ -d "$file" ]; then
        rm -rf "$file"
        print_success "Removed directory: $file"
    fi
done

# Remove empty directories
print_status "Removing empty directories..."

if [ -d "components" ] && [ -z "$(ls -A components)" ]; then
    rmdir components
    print_success "Removed empty directory: components/"
fi

# Update README.md to reflect new structure
print_status "Updating main README.md..."

cat > README.md << 'EOF'
# 📚 **Interactive Story Project**

## 📋 **Overview**

Template sistem untuk membuat interactive story dengan integrasi chatbot n8n. Proyek ini menggunakan arsitektur modular dengan chatbot template yang dapat digunakan ulang di berbagai proyek story.

## 🗂️ **Project Structure**

```
interactiveStory_proj/
├── index.html                    # Main story page
├── styles/
│   └── main.css                 # Story-specific styles
├── js/
│   ├── main.js                  # Story logic
│   └── browser-polyfills.js     # Browser compatibility
├── chatbot-template/            # 🤖 Reusable chatbot system
│   ├── components/              # Chat UI components
│   │   ├── chat-input.js
│   │   ├── chat-output.js
│   │   └── bot-config.js
│   ├── js/                      # Core chatbot logic
│   │   ├── config-manager.js
│   │   └── chat-manager.js
│   ├── styles/
│   │   └── chatbot.css          # Chatbot styling
│   ├── tools/                   # Debugging tools
│   │   ├── n8n-diagnostic.html
│   │   ├── test-webhook-connection.html
│   │   ├── debug-script.js
│   │   └── test-config-sharing.js
│   ├── examples/                # Configuration examples
│   │   ├── n8n-chatbot-workflow.json
│   │   └── example-configs.js
│   ├── docs/                    # Documentation
│   │   ├── PERSONALIZATION_GUIDE.md
│   │   ├── WEBHOOK_TROUBLESHOOTING.md
│   │   └── DEBUG_GUIDE.md
│   ├── botSetting.html          # Bot configuration page
│   └── README.md                # Template documentation
├── browser-compatibility.css    # Cross-browser support
├── browser-test.html            # Compatibility testing
├── setup-new-project.sh         # Script untuk proyek baru
├── TEMPLATE_USAGE.md            # Template usage guide
├── BROWSER_COMPATIBILITY.md     # Browser support info
└── README.md                    # Project documentation (this file)
```

## 🚀 **Quick Start**

### **🎯 Current Project Usage**
```bash
# Main story page
open index.html

# Configure chatbot
open chatbot-template/botSetting.html

# Test browser compatibility
open browser-test.html
```

### **🆕 Create New Project**
```bash
# Use setup script to create new story project
./setup-new-project.sh my-new-story

# Or manually copy template
cp -r chatbot-template/ /path/to/new-project/
```

## 🎨 **Features**

### **📖 Story Features**
- ✅ Interactive story content
- ✅ Editable text (double-click to edit)
- ✅ Image upload for scenes
- ✅ Responsive design
- ✅ Navigation system

### **🤖 Chatbot Features**
- ✅ n8n workflow integration
- ✅ Real-time chat
- ✅ Configurable bot personality
- ✅ Multiple persona templates
- ✅ Typing indicators
- ✅ Message history
- ✅ Error handling & retry

### **🔧 Technical Features**
- ✅ Cross-browser compatibility (Chrome, Safari, Edge, Firefox)
- ✅ Mobile responsive
- ✅ Web Components architecture
- ✅ Modular template system
- ✅ Comprehensive debugging tools
- ✅ Performance optimized

## ⚙️ **Configuration**

### **🎯 Bot Setup**
1. **Import n8n Workflow**: `chatbot-template/examples/n8n-chatbot-workflow.json`
2. **Configure Bot Settings**: Open `chatbot-template/botSetting.html`
3. **Set Webhook URL**: Update webhook endpoint
4. **Choose Persona**: Select from predefined templates
5. **Test Connection**: Use diagnostic tools

### **🎨 Customization**
```javascript
// Configure story-specific bot
const storyConfig = {
    botName: "Story Narrator",
    botDescription: "Your guide through this adventure",
    botAvatar: "📚",
    webhookUrl: "http://localhost:5678/webhook/story-narrator",
    theme: {
        primaryColor: "#3b82f6",
        secondaryColor: "#60a5fa"
    }
};

window.ConfigManager.saveConfig(storyConfig);
```

## 🛠️ **Development**

### **📁 Template System**
- **chatbot-template/**: Reusable chatbot components
- **Root level**: Story-specific content dan assets
- **Separation**: Clear boundary antara story dan chatbot

### **🔧 Adding New Stories**
1. Create new project using `setup-new-project.sh`
2. Customize story content dan styling
3. Configure bot persona untuk story theme
4. Test integration dengan diagnostic tools

### **🧪 Testing**
```bash
# Browser compatibility
open browser-test.html

# Webhook connection
open chatbot-template/tools/test-webhook-connection.html

# n8n diagnostic
open chatbot-template/tools/n8n-diagnostic.html

# Config sharing test
open chatbot-template/tools/test-config-sharing.html
```

## 📚 **Documentation**

### **📖 Main Guides**
- **[Template Usage](TEMPLATE_USAGE.md)**: How to use template system
- **[Browser Compatibility](BROWSER_COMPATIBILITY.md)**: Cross-browser support
- **[Chatbot Template](chatbot-template/README.md)**: Template documentation

### **🔧 Chatbot Guides**
- **[Personalization](chatbot-template/docs/PERSONALIZATION_GUIDE.md)**: Bot customization
- **[Troubleshooting](chatbot-template/docs/WEBHOOK_TROUBLESHOOTING.md)**: Fix connection issues
- **[Debug Guide](chatbot-template/docs/DEBUG_GUIDE.md)**: Comprehensive debugging

## 🌐 **Browser Support**

| Browser | Version | Status |
|---------|---------|--------|
| **Chrome** | 60+ | 🟢 Full Support |
| **Safari** | 12+ | 🟢 Full Support |
| **Edge** | 79+ | 🟢 Full Support |
| **Firefox** | 65+ | 🟢 Full Support |

## 🚀 **Deployment**

### **📤 Production Checklist**
- [ ] Update webhook URLs to production
- [ ] Test all browsers using `browser-test.html`
- [ ] Verify n8n workflow active
- [ ] Optimize assets untuk performance
- [ ] Configure proper CORS settings

### **🔧 Environment Configuration**
```javascript
// Environment-specific settings
const env = window.location.hostname === 'localhost' ? 'development' : 'production';
const webhookBase = env === 'development' 
    ? 'http://localhost:5678' 
    : 'https://api.yourdomain.com';
```

## 🎯 **Best Practices**

### **🗂️ Project Organization**
1. **Use Template**: Start dengan setup script
2. **Separate Concerns**: Story content vs chatbot logic
3. **Version Control**: Track template updates
4. **Test Early**: Use diagnostic tools frequently
5. **Document Changes**: Keep project-specific docs

### **⚡ Performance**
1. **Lazy Loading**: Load chatbot components on demand
2. **Asset Optimization**: Minify CSS/JS untuk production
3. **Caching**: Configure proper cache headers
4. **CDN**: Use CDN untuk static assets

### **🔒 Security**
1. **Validate Inputs**: Sanitize user messages
2. **HTTPS**: Use secure connections untuk production
3. **CORS**: Configure proper CORS settings
4. **API Keys**: Secure n8n webhook URLs

## 🆘 **Support & Troubleshooting**

### **🐛 Common Issues**
1. **Webhook 404**: Check n8n workflow active
2. **Config Not Saving**: Verify localStorage availability
3. **Components Not Loading**: Check script loading order
4. **CORS Errors**: Configure n8n CORS settings

### **🔧 Debug Tools**
- Use `browser-test.html` untuk compatibility
- Check `chatbot-template/tools/` untuk debugging
- Open browser console untuk error messages
- Test webhook connectivity with diagnostic tools

### **📞 Getting Help**
1. Check documentation in `chatbot-template/docs/`
2. Use diagnostic tools untuk troubleshooting
3. Review browser compatibility guide
4. Test dengan example configurations

## 📄 **License**

This project is open source. Feel free to use, modify, dan distribute untuk your interactive story projects.

---

## 🎉 **Next Steps**

1. **📖 Read Documentation**: Familiarize dengan template system
2. **🧪 Test Integration**: Use diagnostic tools
3. **🎨 Customize**: Apply your story theme dan branding
4. **🚀 Create New Stories**: Use setup script untuk new projects
5. **📊 Share**: Contribute improvements back to template

---

**🚀 Happy storytelling! Template sistem siap untuk membuat amazing interactive stories! 🚀**
EOF

print_success "Updated README.md with new structure"

# Final verification
print_status "Verifying template structure..."

REQUIRED_TEMPLATE_FILES=(
    "chatbot-template/README.md"
    "chatbot-template/components/chat-input.js"
    "chatbot-template/components/chat-output.js"
    "chatbot-template/components/bot-config.js"
    "chatbot-template/js/config-manager.js"
    "chatbot-template/js/chat-manager.js"
    "chatbot-template/styles/chatbot.css"
    "chatbot-template/botSetting.html"
)

ALL_GOOD=true
for file in "${REQUIRED_TEMPLATE_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Missing required file: $file"
        ALL_GOOD=false
    fi
done

if [ "$ALL_GOOD" = true ]; then
    print_success "✅ All template files are in place!"
    print_success "✅ Old duplicate files removed"
    print_success "✅ Project structure cleaned up"
    echo ""
    print_status "📁 Current structure:"
    echo "  🏠 index.html (main story)"
    echo "  📁 chatbot-template/ (reusable system)"
    echo "  📄 setup-new-project.sh (for new projects)"
    echo "  📚 Documentation updated"
    echo ""
    print_success "🎉 Cleanup completed successfully!"
else
    print_error "❌ Some required files are missing. Please check the template structure."
    exit 1
fi
EOF

chmod +x cleanup-old-files.sh

Sekarang saya akan menjalankan cleanup dan update struktur final:

<function_calls>
<invoke name="run_terminal_cmd">
<parameter name="command">./cleanup-old-files.sh

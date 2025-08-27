#!/bin/bash

# ===========================================
# Setup New Interactive Story Project
# Script untuk membuat proyek baru dengan chatbot template
# ===========================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to show usage
show_usage() {
    echo "Usage: $0 <project-name> [destination-path]"
    echo ""
    echo "Examples:"
    echo "  $0 my-story-project"
    echo "  $0 adventure-game /path/to/projects/"
    echo ""
    echo "This script will:"
    echo "  ✅ Create new project directory"
    echo "  ✅ Copy chatbot template"
    echo "  ✅ Copy browser compatibility files"
    echo "  ✅ Create basic HTML structure"
    echo "  ✅ Setup n8n workflow template"
    echo "  ✅ Generate documentation"
}

# Check arguments
if [ $# -eq 0 ]; then
    print_error "Project name is required!"
    show_usage
    exit 1
fi

PROJECT_NAME="$1"
DESTINATION_PATH="${2:-.}"
TEMPLATE_DIR="$(dirname "$0")/chatbot-template"

# Validate project name
if [[ ! "$PROJECT_NAME" =~ ^[a-zA-Z0-9_-]+$ ]]; then
    print_error "Project name can only contain letters, numbers, hyphens, and underscores!"
    exit 1
fi

# Check if template directory exists
if [ ! -d "$TEMPLATE_DIR" ]; then
    print_error "Chatbot template directory not found: $TEMPLATE_DIR"
    print_warning "Make sure you're running this script from the correct location"
    exit 1
fi

# Create project directory
PROJECT_PATH="$DESTINATION_PATH/$PROJECT_NAME"

print_status "Creating new interactive story project: $PROJECT_NAME"
print_status "Project path: $PROJECT_PATH"

if [ -d "$PROJECT_PATH" ]; then
    print_error "Directory $PROJECT_PATH already exists!"
    read -p "Do you want to continue and overwrite? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Operation cancelled"
        exit 1
    fi
    rm -rf "$PROJECT_PATH"
fi

mkdir -p "$PROJECT_PATH"
cd "$PROJECT_PATH"

# ===========================================
# COPY TEMPLATE FILES
# ===========================================

print_status "Copying chatbot template..."
cp -r "$TEMPLATE_DIR" .

# Copy browser compatibility files
print_status "Copying browser compatibility files..."
if [ -f "$(dirname "$0")/browser-compatibility.css" ]; then
    cp "$(dirname "$0")/browser-compatibility.css" .
fi

if [ -f "$(dirname "$0")/js/browser-polyfills.js" ]; then
    mkdir -p js
    cp "$(dirname "$0")/js/browser-polyfills.js" js/
fi

if [ -f "$(dirname "$0")/browser-test.html" ]; then
    cp "$(dirname "$0")/browser-test.html" .
fi

# ===========================================
# CREATE MAIN PROJECT FILES
# ===========================================

print_status "Creating main project structure..."

# Create main HTML file
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    
    <title>PROJECT_NAME - Interactive Story</title>
    
    <!-- Browser Compatibility -->
    <link rel="stylesheet" href="browser-compatibility.css" />
    <script src="js/browser-polyfills.js"></script>
    
    <!-- Main Styles -->
    <link rel="stylesheet" href="styles/main.css" />
    
    <!-- Chatbot Template -->
    <link rel="stylesheet" href="chatbot-template/styles/chatbot.css" />
  </head>
  <body>
    <!-- Header -->
    <header class="scene-header">
      <div class="header-content">
        <h1 class="scene-title">📚 PROJECT_NAME</h1>
        <nav class="scene-nav">
          <button class="nav-btn" onclick="resetChat()">🔄 Reset Chat</button>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="content-container">
      <!-- Story Section -->
      <section class="scene-media">
        <div class="scene-image-container">
          <div class="scene-image-placeholder" onclick="uploadImage()">
            <span>🖼️ Click to upload scene image</span>
            <input type="file" id="imageInput" accept="image/*" style="display: none;" onchange="handleImageUpload(event)">
          </div>
        </div>
        
        <div class="scene-text-container">
          <div class="scene-story-text" ondblclick="editStoryText(this)" data-placeholder="Double-click to edit your story...">
            <h2>Welcome to Your Interactive Story!</h2>
            <p>This is your interactive story template with integrated chatbot. Double-click this text to edit your story content.</p>
            <p>The chatbot below will help guide your story and interact with readers.</p>
          </div>
        </div>
      </section>

      <!-- Chat Section -->
      <section class="chat-section">
        <chat-output id="chatOutput"></chat-output>
        <chat-input id="chatInput" placeholder="Type your message..."></chat-input>
      </section>
    </main>

    <!-- Footer -->
    <footer class="scene-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>📖 Story Navigation</h4>
          <button class="nav-btn" onclick="previousScene()">⬅️ Previous</button>
          <button class="nav-btn" onclick="nextScene()">➡️ Next</button>
        </div>
        
        <div class="footer-section">
          <h4>🔧 Settings</h4>
          <button class="nav-btn" onclick="openBotSettings()">⚙️ Bot Settings</button>
          <button class="nav-btn" onclick="openBrowserTest()">🧪 Browser Test</button>
        </div>
      </div>
    </footer>

    <!-- Chatbot Template Scripts -->
    <script src="chatbot-template/js/config-manager.js"></script>
    <script src="chatbot-template/js/chat-manager.js"></script>
    <script src="chatbot-template/components/chat-input.js"></script>
    <script src="chatbot-template/components/chat-output.js"></script>
    <script src="chatbot-template/examples/example-configs.js"></script>

    <!-- Main App Script -->
    <script>
      // Initialize chatbot when page loads
      document.addEventListener('DOMContentLoaded', function() {
        print_status('PROJECT_NAME Interactive Story initialized');
        
        // Set up default story narrator if no config exists
        if (window.PersonaManager && !localStorage.getItem('chatbot_config')) {
          const storyConfig = {
            botName: "Story Narrator",
            botDescription: "Your guide through this interactive adventure",
            botAvatar: "📖",
            userAvatar: "👤",
            webhookUrl: "http://localhost:5678/webhook/PROJECT_NAME-story",
            typingMessage: "Narrator is thinking...",
            placeholder: "What would you like to do next?",
            theme: {
              primaryColor: "#3b82f6",
              secondaryColor: "#60a5fa"
            }
          };
          
          window.ConfigManager.saveConfig(storyConfig);
          console.log('📚 Default story narrator set for PROJECT_NAME');
        }
        
        // Welcome message
        setTimeout(() => {
          const currentConfig = window.ConfigManager.getConfig();
          const chatOutput = document.getElementById('chatOutput');
          if (chatOutput && chatOutput.simulateWebhookMessage) {
            chatOutput.simulateWebhookMessage(
              `Welcome to PROJECT_NAME! I'm ${currentConfig.botName}, ${currentConfig.botDescription}. How can I help you with your story today?`,
              currentConfig.botName,
              "ai"
            );
          }
        }, 1000);
      });

      // Story interaction functions
      function editStoryText(element) {
        const currentText = element.innerHTML;
        const placeholder = element.getAttribute('data-placeholder') || 'Enter your story...';
        
        const textarea = document.createElement('textarea');
        textarea.value = element.textContent;
        textarea.style.width = '100%';
        textarea.style.minHeight = '200px';
        textarea.style.padding = '1rem';
        textarea.style.border = '2px solid #3b82f6';
        textarea.style.borderRadius = '8px';
        textarea.style.fontSize = '1rem';
        textarea.style.fontFamily = 'inherit';
        textarea.placeholder = placeholder;
        
        element.innerHTML = '';
        element.appendChild(textarea);
        textarea.focus();
        
        textarea.addEventListener('blur', function() {
          const newContent = this.value.trim();
          if (newContent) {
            element.innerHTML = newContent.replace(/\n/g, '<br>');
          } else {
            element.innerHTML = '<em style="color: #64748b;">Double-click to add your story content...</em>';
          }
        });
        
        textarea.addEventListener('keydown', function(e) {
          if (e.key === 'Escape') {
            element.innerHTML = currentText;
          }
        });
      }

      function uploadImage() {
        document.getElementById('imageInput').click();
      }

      function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            const imageContainer = document.querySelector('.scene-image-container');
            imageContainer.innerHTML = `
              <img src="${e.target.result}" alt="Scene image" style="
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 12px;
                cursor: pointer;
              " onclick="uploadImage()">
              <input type="file" id="imageInput" accept="image/*" style="display: none;" onchange="handleImageUpload(event)">
            `;
          };
          reader.readAsDataURL(file);
        }
      }

      function resetChat() {
        const chatOutput = document.getElementById('chatOutput');
        if (chatOutput && chatOutput.clearHistory) {
          chatOutput.clearHistory();
          console.log('💬 Chat history cleared');
        }
      }

      function previousScene() {
        console.log('⬅️ Previous scene - implement your navigation logic');
      }

      function nextScene() {
        console.log('➡️ Next scene - implement your navigation logic');
      }

      function openBotSettings() {
        window.open('chatbot-template/botSetting.html', '_blank');
      }

      function openBrowserTest() {
        window.open('browser-test.html', '_blank');
      }
    </script>
  </body>
</html>
EOF

# Replace PROJECT_NAME placeholder
sed -i.bak "s/PROJECT_NAME/$PROJECT_NAME/g" index.html && rm index.html.bak

# Create main CSS file
mkdir -p styles
cat > styles/main.css << 'EOF'
/**
 * PROJECT_NAME - Main Styles
 * Custom styles for your interactive story
 */

/* Import chatbot template variables */
@import url('../chatbot-template/styles/chatbot.css');

/* ===========================================
   CUSTOM THEME VARIABLES
   =========================================== */

:root {
  /* Story Theme Colors */
  --story-primary: #3b82f6;
  --story-secondary: #64748b;
  --story-accent: #10b981;
  
  /* Story Background */
  --story-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --story-content-bg: rgba(255, 255, 255, 0.95);
  
  /* Story Text */
  --story-text-primary: #1e293b;
  --story-text-secondary: #64748b;
}

/* ===========================================
   BASE LAYOUT
   =========================================== */

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  line-height: 1.6;
  color: var(--story-text-primary);
  background: var(--story-bg);
  min-height: 100vh;
}

/* ===========================================
   HEADER STYLES
   =========================================== */

.scene-header {
  background: rgba(255, 255, 255, 0.95);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 1rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.scene-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--story-text-primary);
}

.scene-nav {
  display: flex;
  gap: 1rem;
}

.nav-btn {
  padding: 0.5rem 1rem;
  border: 2px solid var(--story-primary);
  border-radius: 8px;
  background: transparent;
  color: var(--story-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-btn:hover {
  background: var(--story-primary);
  color: white;
  transform: translateY(-2px);
}

/* ===========================================
   MAIN CONTENT
   =========================================== */

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* ===========================================
   STORY SECTION
   =========================================== */

.scene-media {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.scene-image-container {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  border: 2px dashed #cbd5e1;
  transition: all 0.3s ease;
}

.scene-image-container:hover {
  border-color: var(--story-primary);
  background: rgba(255, 255, 255, 1);
}

.scene-image-placeholder {
  text-align: center;
  color: var(--story-text-secondary);
  cursor: pointer;
  padding: 2rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.scene-image-placeholder:hover {
  color: var(--story-primary);
  background: rgba(59, 130, 246, 0.05);
}

.scene-text-container {
  background: rgba(255, 255, 255, 0.95);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.scene-story-text {
  min-height: 200px;
  cursor: pointer;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.scene-story-text:hover {
  background: rgba(59, 130, 246, 0.05);
  border: 2px dashed var(--story-primary);
}

.scene-story-text h2 {
  margin-top: 0;
  color: var(--story-primary);
}

/* ===========================================
   CHAT SECTION
   =========================================== */

.chat-section {
  background: rgba(255, 255, 255, 0.95);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 500px;
  display: flex;
  flex-direction: column;
}

/* ===========================================
   FOOTER STYLES
   =========================================== */

.scene-footer {
  background: rgba(30, 41, 59, 0.95);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  color: white;
  padding: 2rem 0;
  margin-top: 2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-section h4 {
  margin: 0 0 1rem 0;
  color: #e2e8f0;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* ===========================================
   RESPONSIVE DESIGN
   =========================================== */

@media (max-width: 768px) {
  .header-content {
    padding: 0 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .scene-title {
    font-size: 1.5rem;
  }
  
  .content-container {
    padding: 1rem;
  }
  
  .scene-media {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .scene-image-container,
  .scene-text-container {
    min-height: 200px;
  }
  
  .chat-section {
    height: 400px;
  }
  
  .footer-content {
    padding: 0 1rem;
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .nav-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .scene-title {
    font-size: 1.25rem;
  }
  
  .content-container {
    padding: 0.5rem;
  }
  
  .scene-image-container,
  .scene-text-container {
    padding: 1rem;
  }
  
  .chat-section {
    height: 350px;
  }
}

/* ===========================================
   UTILITIES
   =========================================== */

.text-center {
  text-align: center;
}

.mt-2 {
  margin-top: 1rem;
}

.mb-2 {
  margin-bottom: 1rem;
}

.p-2 {
  padding: 1rem;
}

.rounded {
  border-radius: 8px;
}

.shadow {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* ===========================================
   ANIMATIONS
   =========================================== */

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.content-container > * {
  animation: fadeInUp 0.6s ease-out;
}

.content-container > *:nth-child(2) {
  animation-delay: 0.2s;
}

.content-container > *:nth-child(3) {
  animation-delay: 0.4s;
}
EOF

# Replace PROJECT_NAME in CSS
sed -i.bak "s/PROJECT_NAME/$PROJECT_NAME/g" styles/main.css && rm styles/main.css.bak

# ===========================================
# CREATE DOCUMENTATION
# ===========================================

print_status "Creating project documentation..."

cat > README.md << 'EOF'
# PROJECT_NAME - Interactive Story

## 📖 Overview

An interactive story project powered by n8n chatbot integration. This project uses the chatbot template system for easy bot configuration and seamless storytelling experience.

## 🚀 Quick Start

### Prerequisites
- n8n instance running (local or cloud)
- Modern web browser
- Web server (optional, for local development)

### Setup Steps

1. **Configure n8n Workflow**
   ```bash
   # Import the workflow template
   Import: chatbot-template/examples/n8n-chatbot-workflow.json
   ```

2. **Configure Bot Settings**
   ```bash
   # Open bot settings
   open chatbot-template/botSetting.html
   ```

3. **Start Development**
   ```bash
   # Open main story page
   open index.html
   ```

## 📁 Project Structure

```
PROJECT_NAME/
├── index.html                 # Main story page
├── styles/
│   └── main.css              # Project-specific styles
├── chatbot-template/         # Chatbot system (reusable)
│   ├── components/           # Chat UI components
│   ├── js/                   # Core JavaScript
│   ├── tools/               # Debugging tools
│   ├── examples/            # Configuration examples
│   └── docs/                # Documentation
├── browser-test.html         # Browser compatibility test
└── js/
    └── browser-polyfills.js  # Cross-browser support
```

## 🎯 Features

### Story Features
- ✅ Editable story content (double-click to edit)
- ✅ Image upload for scenes
- ✅ Navigation between scenes
- ✅ Responsive design

### Chatbot Features
- ✅ Real-time chat with n8n integration
- ✅ Configurable bot personality
- ✅ Typing indicators
- ✅ Message history
- ✅ Error handling & retry

### Technical Features
- ✅ Cross-browser compatibility
- ✅ Mobile responsive
- ✅ Accessibility support
- ✅ Performance optimized

## ⚙️ Configuration

### Bot Personalization
```javascript
// Configure your story bot
const storyConfig = {
    botName: "Your Bot Name",
    botDescription: "Bot description",
    botAvatar: "🤖",
    webhookUrl: "http://localhost:5678/webhook/your-webhook-id"
};

window.ConfigManager.saveConfig(storyConfig);
```

### Webhook Setup
1. Create n8n workflow using template
2. Copy webhook URL
3. Configure in bot settings
4. Test connection

## 🛠️ Development

### Adding New Scenes
1. Create new HTML file
2. Include chatbot template
3. Configure scene-specific bot persona
4. Add navigation links

### Customizing Styles
1. Edit `styles/main.css` for story-specific styles
2. Use chatbot template CSS variables for consistency
3. Test across browsers using `browser-test.html`

### Debugging
1. Use diagnostic tools in `chatbot-template/tools/`
2. Check browser console for errors
3. Test webhook connectivity
4. Verify configuration sharing

## 📚 Documentation

- **Chatbot Setup**: `chatbot-template/README.md`
- **Personalization**: `chatbot-template/docs/PERSONALIZATION_GUIDE.md`
- **Troubleshooting**: `chatbot-template/docs/WEBHOOK_TROUBLESHOOTING.md`
- **Debugging**: `chatbot-template/docs/DEBUG_GUIDE.md`

## 🧪 Testing

### Browser Compatibility
```bash
open browser-test.html
```

### Webhook Testing
```bash
open chatbot-template/tools/test-webhook-connection.html
```

### n8n Diagnostic
```bash
open chatbot-template/tools/n8n-diagnostic.html
```

## 🚀 Deployment

### Local Development
1. Open `index.html` in browser
2. Configure local n8n instance
3. Test all features

### Production Deployment
1. Update webhook URLs to production
2. Optimize assets
3. Test cross-browser compatibility
4. Deploy to web server

## 📄 License

This project is based on the Interactive Story Chatbot Template.
Customize freely for your story needs.

## 🆘 Support

- Check documentation in `chatbot-template/docs/`
- Use diagnostic tools for troubleshooting
- Test browser compatibility
- Verify n8n workflow configuration

---

**Happy Storytelling! 📚✨**
EOF

# Replace PROJECT_NAME in README
sed -i.bak "s/PROJECT_NAME/$PROJECT_NAME/g" README.md && rm README.bak

# ===========================================
# CREATE PACKAGE.JSON (OPTIONAL)
# ===========================================

cat > package.json << 'EOF'
{
  "name": "PROJECT_NAME",
  "version": "1.0.0",
  "description": "Interactive story with n8n chatbot integration",
  "main": "index.html",
  "scripts": {
    "start": "python -m http.server 8080",
    "start:node": "npx http-server -p 8080",
    "test": "open browser-test.html",
    "bot-settings": "open chatbot-template/botSetting.html"
  },
  "keywords": [
    "interactive-story",
    "chatbot",
    "n8n",
    "web-components",
    "javascript"
  ],
  "author": "Your Name",
  "license": "MIT",
  "devDependencies": {
    "http-server": "^14.1.1"
  }
}
EOF

# Replace PROJECT_NAME in package.json
sed -i.bak "s/PROJECT_NAME/$PROJECT_NAME/g" package.json && rm package.json.bak

# ===========================================
# FINAL SETUP
# ===========================================

print_status "Finalizing project setup..."

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*

# Environment
.env
.env.local

# Build outputs
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Temporary files
*.tmp
*.temp
.cache/
EOF

# Make the script executable
chmod +x "$0" 2>/dev/null || true

# ===========================================
# SUCCESS MESSAGE
# ===========================================

print_success "Project '$PROJECT_NAME' created successfully!"
echo ""
print_status "📁 Project location: $PROJECT_PATH"
print_status "🌐 Main page: index.html"
print_status "⚙️ Bot settings: chatbot-template/botSetting.html"
print_status "🧪 Browser test: browser-test.html"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. 📖 cd $PROJECT_NAME"
echo "2. 🔧 Configure n8n workflow (import chatbot-template/examples/n8n-chatbot-workflow.json)"
echo "3. ⚙️ Open chatbot-template/botSetting.html to configure bot"
echo "4. 🌐 Open index.html to start your story"
echo "5. 🧪 Test browser compatibility with browser-test.html"
echo ""
echo -e "${GREEN}🎉 Happy storytelling!${NC}"
EOF

chmod +x setup-new-project.sh

<function_calls>
<invoke name="todo_write">
<parameter name="merge">true

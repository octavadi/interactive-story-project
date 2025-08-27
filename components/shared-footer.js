/**
 * Shared Footer Component
 * Komponen footer yang dapat digunakan di semua halaman
 */

class SharedFooter extends HTMLElement {
  constructor() {
    super();
    this.currentPage = this.getAttribute("current-page") || "index";
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <footer class="shared-footer">
        <div class="footer-content">
          <!-- Navigation Section -->
          <div class="footer-section">
            <h4>📖 Story Navigation</h4>
            <div class="footer-links">
              <a href="index.html" class="footer-link ${
                this.currentPage === "index" ? "active" : ""
              }">
                🏠 Main Story
              </a>
              <a href="discussion.html" class="footer-link ${
                this.currentPage === "discussion" ? "active" : ""
              }">
                💬 Discussion
              </a>
              <button class="footer-btn" onclick="window.history.back()">
                ⬅️ Previous
              </button>
              <button class="footer-btn" onclick="resetAllChats()">
                🔄 Reset All
              </button>
            </div>
          </div>
          
          <!-- Tools Section -->
          <div class="footer-section">
            <h4>🔧 Tools & Settings</h4>
            <div class="footer-links">
              <a href="chatbot-template/botSetting.html" class="footer-link" target="_blank">
                ⚙️ Bot Settings
              </a>
              <a href="browser-test.html" class="footer-link" target="_blank">
                🧪 Browser Test
              </a>
              <button class="footer-btn" onclick="exportStoryData()">
                📥 Export Data
              </button>
              <button class="footer-btn" onclick="showStoryInfo()">
                ℹ️ Story Info
              </button>
            </div>
          </div>
          
          <!-- Status Section -->
          <div class="footer-section">
            <h4>📊 Status</h4>
            <div class="footer-status">
              <div class="status-item">
                <span class="status-label">Bot Status:</span>
                <span class="status-value" id="botStatus">🔍 Checking...</span>
              </div>
              <div class="status-item">
                <span class="status-label">Last Updated:</span>
                <span class="status-value" id="lastUpdated">${new Date().toLocaleString(
                  "id-ID"
                )}</span>
              </div>
              <div class="status-item">
                <span class="status-label">Browser:</span>
                <span class="status-value" id="browserInfo">🌐 Detecting...</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Copyright Section -->
        <div class="footer-bottom">
          <div class="copyright">
            <p>
              &copy; 2025 Interactive Story Sample Project. Built with ❤️, N8N, and Cursor IDE.
            </p>
            <p class="version-info">
              Template Version: <span id="templateVersion">2.0.0</span> | 
              <span id="pageLoadTime"></span>
            </p>
          </div>
        </div>
      </footer>
    `;

    this.initializeFooter();
  }

  initializeFooter() {
    // Update browser info
    this.updateBrowserInfo();

    // Update bot status
    this.updateBotStatus();

    // Update page load time
    this.updatePageLoadTime();

    // Setup periodic status updates
    setInterval(() => {
      this.updateBotStatus();
      document.getElementById("lastUpdated").textContent =
        new Date().toLocaleString("id-ID");
    }, 30000); // Update every 30 seconds
  }

  updateBrowserInfo() {
    const browserInfo = document.getElementById("browserInfo");
    if (browserInfo) {
      const ua = navigator.userAgent;
      let browserName = "Unknown";
      let browserVersion = "";

      // Check for Edge first (both old and new Edge)
      if (ua.indexOf("Edg/") > -1 || ua.indexOf("Edge/") > -1) {
        browserName = "Microsoft Edge";
        const edgeMatch = ua.match(/Edg?\/(\d+\.\d+)/);
        if (edgeMatch) browserVersion = ` ${edgeMatch[1]}`;
      }
      // Check for Chrome (after Edge check)
      else if (ua.indexOf("Chrome") > -1 && ua.indexOf("Edg") === -1) {
        browserName = "Chrome";
        const chromeMatch = ua.match(/Chrome\/(\d+\.\d+)/);
        if (chromeMatch) browserVersion = ` ${chromeMatch[1]}`;
      }
      // Check for Safari (after Chrome check)
      else if (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1) {
        browserName = "Safari";
        const safariMatch = ua.match(/Version\/(\d+\.\d+)/);
        if (safariMatch) browserVersion = ` ${safariMatch[1]}`;
      }
      // Check for Firefox
      else if (ua.indexOf("Firefox") > -1) {
        browserName = "Firefox";
        const firefoxMatch = ua.match(/Firefox\/(\d+\.\d+)/);
        if (firefoxMatch) browserVersion = ` ${firefoxMatch[1]}`;
      }
      // Check for Opera
      else if (ua.indexOf("OPR") > -1 || ua.indexOf("Opera") > -1) {
        browserName = "Opera";
        const operaMatch = ua.match(/(?:OPR|Opera)\/(\d+\.\d+)/);
        if (operaMatch) browserVersion = ` ${operaMatch[1]}`;
      }

      browserInfo.textContent = `🌐 ${browserName}${browserVersion}`;

      // Debug log for troubleshooting
      console.log("🔍 Browser Detection:", {
        userAgent: ua,
        detectedBrowser: browserName,
        version: browserVersion,
      });
    }
  }

  getBrowserName() {
    const ua = navigator.userAgent;

    // Check for Edge first (both old and new Edge)
    if (ua.indexOf("Edg/") > -1 || ua.indexOf("Edge/") > -1) {
      const edgeMatch = ua.match(/Edg?\/(\d+\.\d+)/);
      return `Microsoft Edge${edgeMatch ? ` ${edgeMatch[1]}` : ""}`;
    }
    // Check for Chrome (after Edge check)
    else if (ua.indexOf("Chrome") > -1 && ua.indexOf("Edg") === -1) {
      const chromeMatch = ua.match(/Chrome\/(\d+\.\d+)/);
      return `Chrome${chromeMatch ? ` ${chromeMatch[1]}` : ""}`;
    }
    // Check for Safari (after Chrome check)
    else if (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1) {
      const safariMatch = ua.match(/Version\/(\d+\.\d+)/);
      return `Safari${safariMatch ? ` ${safariMatch[1]}` : ""}`;
    }
    // Check for Firefox
    else if (ua.indexOf("Firefox") > -1) {
      const firefoxMatch = ua.match(/Firefox\/(\d+\.\d+)/);
      return `Firefox${firefoxMatch ? ` ${firefoxMatch[1]}` : ""}`;
    }
    // Check for Opera
    else if (ua.indexOf("OPR") > -1 || ua.indexOf("Opera") > -1) {
      const operaMatch = ua.match(/(?:OPR|Opera)\/(\d+\.\d+)/);
      return `Opera${operaMatch ? ` ${operaMatch[1]}` : ""}`;
    }

    return "Unknown Browser";
  }

  updateBotStatus() {
    const botStatus = document.getElementById("botStatus");
    if (botStatus) {
      if (window.ConfigManager) {
        const config = window.ConfigManager.getConfig();
        if (config && config.webhookUrl) {
          botStatus.innerHTML = "🟢 Connected";
          botStatus.className = "status-value connected";
        } else {
          botStatus.innerHTML = "🟡 Not Configured";
          botStatus.className = "status-value warning";
        }
      } else {
        botStatus.innerHTML = "🔴 Not Loaded";
        botStatus.className = "status-value error";
      }
    }
  }

  updatePageLoadTime() {
    const pageLoadTime = document.getElementById("pageLoadTime");
    if (pageLoadTime && window.performance) {
      const loadTime = Math.round(window.performance.now());
      pageLoadTime.textContent = `Load Time: ${loadTime}ms`;
    }
  }
}

// Global footer functions
window.resetAllChats = function () {
  if (
    confirm("Reset semua riwayat chat? Tindakan ini tidak dapat dibatalkan.")
  ) {
    // Clear all chat data
    const chatOutputs = document.querySelectorAll("chat-output");
    chatOutputs.forEach((output) => {
      if (output.clearHistory) {
        output.clearHistory();
      }
    });

    // Clear any stored chat data
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("chat_") || key.startsWith("message_")) {
        localStorage.removeItem(key);
      }
    });

    console.log("🔄 All chat history cleared");
    location.reload();
  }
};

window.exportStoryData = function () {
  const storyData = {
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
    botConfig: window.ConfigManager ? window.ConfigManager.getConfig() : null,
    browserInfo: {
      userAgent: navigator.userAgent,
      detectedBrowser: this.getBrowserName(),
      platform: navigator.platform,
    },
    storyContent: {
      title: document.querySelector("h1")?.textContent || "Interactive Story",
      url: window.location.href,
    },
  };

  // Create download
  const blob = new Blob([JSON.stringify(storyData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `story-data-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log("📥 Story data exported");
};

window.showStoryInfo = function () {
  const config = window.ConfigManager ? window.ConfigManager.getConfig() : {};
  const info = `
📖 Story Information

📄 Current Page: ${window.location.pathname}
🤖 Bot Name: ${config.botName || "Not configured"}
🔗 Webhook: ${config.webhookUrl ? "✅ Connected" : "❌ Not configured"}
🌐 Browser: ${this.getBrowserName()}
📊 Load Time: ${Math.round(window.performance.now())}ms
📅 Loaded: ${new Date().toLocaleString("id-ID")}

🎯 Template Version: 2.0.0
💾 Local Storage Used: ${Object.keys(localStorage).length} items
  `;

  alert(info);
};

// Register the component
customElements.define("shared-footer", SharedFooter);

/**
 * Test Script untuk Memverifikasi Config Sharing
 * Jalankan di console browser untuk debug
 */

function testConfigSharing() {
  console.log(
    "🔍 Testing Config Sharing between botSetting.html and index.html"
  );

  // Test 1: Check if ConfigManager exists
  if (!window.ConfigManager) {
    console.error(
      "❌ ConfigManager not found! Make sure config-manager.js is loaded."
    );
    return false;
  }

  console.log("✅ ConfigManager found");

  // Test 2: Get current config
  const currentConfig = window.ConfigManager.getConfig();
  console.log("📋 Current config:", currentConfig);

  // Test 3: Check localStorage
  const storedConfig = localStorage.getItem("chatbot_config");
  console.log("💾 Stored config in localStorage:", storedConfig);

  // Test 4: Test config change
  const testConfig = {
    botName: "TestBot_" + Date.now(),
    botDescription: "Test configuration for debugging",
    botAvatar: "🧪",
    userAvatar: "👨‍💻",
  };

  console.log("🧪 Testing config change...");
  const success = window.ConfigManager.saveConfig(testConfig);

  if (success) {
    console.log("✅ Config saved successfully");

    // Verify the change
    const newConfig = window.ConfigManager.getConfig();
    if (newConfig.botName === testConfig.botName) {
      console.log("✅ Config change verified");

      // Test event dispatch
      document.addEventListener("configChanged", function testListener(event) {
        console.log("✅ configChanged event received:", event.detail);
        document.removeEventListener("configChanged", testListener);
      });

      // Trigger another change to test event
      window.ConfigManager.saveConfig({
        ...testConfig,
        botDescription: "Updated test description",
      });
    } else {
      console.error("❌ Config change not reflected");
    }
  } else {
    console.error("❌ Failed to save config");
  }

  return true;
}

function testChatComponents() {
  console.log("🔍 Testing Chat Components Configuration");

  const chatInput = document.querySelector("chat-input");
  const chatOutput = document.querySelector("chat-output");

  if (chatInput) {
    console.log("✅ chat-input found");
    console.log("📋 chat-input config methods available:", {
      getBotName: typeof chatInput.getBotName,
      getTypingMessage: typeof chatInput.getTypingMessage,
      configManager: !!chatInput.configManager,
    });

    if (chatInput.getBotName) {
      console.log(
        "🤖 Current bot name from chat-input:",
        chatInput.getBotName()
      );
    }
  } else {
    console.warn("⚠️ chat-input not found");
  }

  if (chatOutput) {
    console.log("✅ chat-output found");
    console.log("📋 chat-output config methods available:", {
      getBotName: typeof chatOutput.getBotName,
      getTypingMessage: typeof chatOutput.getTypingMessage,
      configManager: !!chatOutput.configManager,
    });

    if (chatOutput.getBotName) {
      console.log(
        "🤖 Current bot name from chat-output:",
        chatOutput.getBotName()
      );
    }
  } else {
    console.warn("⚠️ chat-output not found");
  }
}

function debugConfigIssue() {
  console.log("🐛 Debugging Config Issue");

  // Check current page
  const currentPage = window.location.pathname.split("/").pop();
  console.log("📄 Current page:", currentPage);

  // Check if we're overriding config
  const hasStoredConfig = !!localStorage.getItem("chatbot_config");
  console.log("💾 Has stored config:", hasStoredConfig);

  if (!hasStoredConfig && currentPage === "index.html") {
    console.log(
      "⚠️ No stored config on index.html - will use default Narrator"
    );
  }

  // Check for config override in index.html
  if (currentPage === "index.html") {
    console.log("🔍 Checking for config override in index.html...");
    // This should only happen if no config exists
  }

  // Test manual config change
  console.log("🧪 Testing manual config change...");
  window.ConfigManager.saveConfig({
    botName: "DebugBot",
    botDescription: "Debug test bot",
    botAvatar: "🐛",
  });

  setTimeout(() => {
    const currentConfig = window.ConfigManager.getConfig();
    console.log("📋 Config after manual change:", currentConfig.botName);

    // Check if chat components reflect the change
    const chatInput = document.querySelector("chat-input");
    if (chatInput && chatInput.getBotName) {
      console.log(
        "🤖 Bot name from chat-input after change:",
        chatInput.getBotName()
      );
    }
  }, 100);
}

// Quick commands for console
window.testConfigSharing = testConfigSharing;
window.testChatComponents = testChatComponents;
window.debugConfigIssue = debugConfigIssue;

// Auto-run basic test if this script is loaded
if (typeof window !== "undefined") {
  console.log(`
🧪 Config Sharing Test Commands Available:

testConfigSharing()     - Test basic config sharing functionality
testChatComponents()    - Test chat component config integration  
debugConfigIssue()      - Debug config override issues

Quick tests:
- window.ConfigManager.getConfig()
- localStorage.getItem('chatbot_config')
- document.querySelector('chat-input').getBotName()
- window.PersonaManager.maya() // Change to Maya persona
  `);
}

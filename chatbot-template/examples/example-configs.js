/**
 * Contoh Konfigurasi untuk Berbagai Jenis Chatbot
 * Bisa digunakan untuk testing atau sebagai template
 */

// ========================================
// 🎭 PERSONA TEMPLATES
// ========================================

const PERSONA_TEMPLATES = {
  // 👩‍💼 Personal Assistant
  personalAssistant: {
    botName: "Maya",
    botDescription: "Asisten pribadi yang ramah dan helpful",
    botAvatar: "👩‍💼",
    userAvatar: "👨‍💻",
    ui: {
      placeholder: "Apa yang bisa Maya bantu hari ini?",
      title: "Maya - Personal Assistant",
    },
    typing: {
      message: "sedang memproses...",
    },
  },

  // 🎧 Customer Service
  customerService: {
    botName: "Alex",
    botDescription: "Customer Service 24/7 siap membantu",
    botAvatar: "🎧",
    userAvatar: "👤",
    ui: {
      placeholder: "Ceritakan keluhan atau pertanyaan Anda...",
      title: "Alex - Customer Support",
    },
    typing: {
      message: "sedang mencari solusi...",
    },
  },

  // 👨‍🏫 Educational Bot
  educational: {
    botName: "Profesor",
    botDescription: "Bot edukasi untuk pembelajaran interaktif",
    botAvatar: "👨‍🏫",
    userAvatar: "👨‍🎓",
    ui: {
      placeholder: "Tanya apa saja tentang pelajaran...",
      title: "Profesor - Learning Assistant",
    },
    typing: {
      message: "sedang menyiapkan penjelasan...",
    },
  },

  // 🏥 Healthcare Assistant
  healthcare: {
    botName: "Dr. Sarah",
    botDescription: "Asisten kesehatan untuk informasi medis",
    botAvatar: "👩‍⚕️",
    userAvatar: "🤒",
    ui: {
      placeholder: "Bagaimana kondisi kesehatan Anda?",
      title: "Dr. Sarah - Health Assistant",
    },
    typing: {
      message: "sedang menganalisis gejala...",
    },
  },

  // 💰 Financial Advisor
  financial: {
    botName: "Warren",
    botDescription: "Penasihat keuangan untuk investasi dan saving",
    botAvatar: "💼",
    userAvatar: "💰",
    ui: {
      placeholder: "Bagaimana rencana keuangan Anda?",
      title: "Warren - Financial Advisor",
    },
    typing: {
      message: "sedang menghitung...",
    },
  },

  // 🍳 Cooking Assistant
  cooking: {
    botName: "Chef Luna",
    botDescription: "Chef virtual untuk resep dan tips memasak",
    botAvatar: "👩‍🍳",
    userAvatar: "🍽️",
    ui: {
      placeholder: "Mau masak apa hari ini?",
      title: "Chef Luna - Cooking Assistant",
    },
    typing: {
      message: "sedang menyiapkan resep...",
    },
  },

  // 🎮 Gaming Buddy
  gaming: {
    botName: "Player One",
    botDescription: "Gaming buddy untuk tips dan strategies",
    botAvatar: "🎮",
    userAvatar: "🕹️",
    ui: {
      placeholder: "Game apa yang sedang kamu mainkan?",
      title: "Player One - Gaming Buddy",
    },
    typing: {
      message: "sedang loading strategy...",
    },
  },

  // 🌱 Life Coach
  lifeCoach: {
    botName: "Zen",
    botDescription: "Life coach untuk motivasi dan pengembangan diri",
    botAvatar: "🧘‍♀️",
    userAvatar: "🌟",
    ui: {
      placeholder: "Apa yang ingin kamu capai hari ini?",
      title: "Zen - Life Coach",
    },
    typing: {
      message: "sedang merenungkan...",
    },
  },

  // 🔧 Tech Support
  techSupport: {
    botName: "TechBot",
    botDescription: "Technical support untuk masalah IT",
    botAvatar: "🤖",
    userAvatar: "💻",
    ui: {
      placeholder: "Describe your technical issue...",
      title: "TechBot - IT Support",
    },
    typing: {
      message: "diagnosing the problem...",
    },
  },

  // 🎨 Creative Assistant
  creative: {
    botName: "Artsy",
    botDescription: "Creative assistant untuk ide dan inspirasi",
    botAvatar: "🎨",
    userAvatar: "✨",
    ui: {
      placeholder: "Apa proyek kreatif kamu?",
      title: "Artsy - Creative Assistant",
    },
    typing: {
      message: "sedang mencari inspirasi...",
    },
  },
};

// ========================================
// 🔧 ENVIRONMENT CONFIGS
// ========================================

const ENVIRONMENT_CONFIGS = {
  development: {
    webhook: {
      inputUrl: "http://localhost:5678/webhook/dev-input",
      outputUrl: "http://localhost:5678/webhook/dev-output",
    },
  },

  staging: {
    webhook: {
      inputUrl: "https://staging-n8n.yourcompany.com/webhook/input",
      outputUrl: "https://staging-n8n.yourcompany.com/webhook/output",
    },
  },

  production: {
    webhook: {
      inputUrl: "https://n8n.yourcompany.com/webhook/input",
      outputUrl: "https://n8n.yourcompany.com/webhook/output",
    },
  },
};

// ========================================
// 🎨 THEME VARIATIONS
// ========================================

const THEME_VARIATIONS = {
  // 🌙 Dark Theme
  dark: {
    botName: "Shadow",
    botDescription: "Dark theme assistant",
    botAvatar: "🖤",
    userAvatar: "👤",
    ui: {
      placeholder: "Speak into the void...",
      title: "Shadow - Dark Assistant",
    },
  },

  // 🌸 Kawaii Theme
  kawaii: {
    botName: "Kawaii-chan",
    botDescription: "Cute assistant kawaii desu~",
    botAvatar: "🌸",
    userAvatar: "😊",
    ui: {
      placeholder: "What can kawaii-chan help with? (◕‿◕)",
      title: "Kawaii-chan - Cute Assistant",
    },
  },

  // 🏢 Professional Theme
  professional: {
    botName: "Assistant",
    botDescription: "Professional business assistant",
    botAvatar: "💼",
    userAvatar: "👔",
    ui: {
      placeholder: "How may I assist you today?",
      title: "Assistant - Professional",
    },
  },

  // 🎪 Fun Theme
  fun: {
    botName: "Buddy",
    botDescription: "Fun and energetic assistant!",
    botAvatar: "🎉",
    userAvatar: "😄",
    ui: {
      placeholder: "What fun thing should we do?",
      title: "Buddy - Fun Assistant",
    },
  },
};

// ========================================
// 🚀 UTILITY FUNCTIONS
// ========================================

/**
 * Apply a persona template
 * @param {string} personaName - Name of persona from PERSONA_TEMPLATES
 */
function applyPersona(personaName) {
  const persona = PERSONA_TEMPLATES[personaName];
  if (!persona) {
    console.error(`Persona '${personaName}' not found`);
    return false;
  }

  if (window.ConfigManager) {
    const success = window.ConfigManager.saveConfig(persona);
    if (success) {
      console.log(`✅ Applied persona: ${persona.botName}`);
      return true;
    }
  }
  return false;
}

/**
 * Apply environment configuration
 * @param {string} env - Environment name (development, staging, production)
 */
function applyEnvironment(env) {
  const envConfig = ENVIRONMENT_CONFIGS[env];
  if (!envConfig) {
    console.error(`Environment '${env}' not found`);
    return false;
  }

  if (window.ConfigManager) {
    const success = window.ConfigManager.saveConfig(envConfig);
    if (success) {
      console.log(`✅ Applied environment: ${env}`);
      return true;
    }
  }
  return false;
}

/**
 * Apply theme variation
 * @param {string} themeName - Theme name
 */
function applyTheme(themeName) {
  const theme = THEME_VARIATIONS[themeName];
  if (!theme) {
    console.error(`Theme '${themeName}' not found`);
    return false;
  }

  if (window.ConfigManager) {
    const success = window.ConfigManager.saveConfig(theme);
    if (success) {
      console.log(`✅ Applied theme: ${theme.botName}`);
      return true;
    }
  }
  return false;
}

/**
 * Random persona for testing
 */
function randomPersona() {
  const personas = Object.keys(PERSONA_TEMPLATES);
  const randomName = personas[Math.floor(Math.random() * personas.length)];
  return applyPersona(randomName);
}

/**
 * Demo sequence - cycle through different personas
 */
async function demoSequence() {
  const personas = Object.keys(PERSONA_TEMPLATES);

  for (const persona of personas) {
    console.log(`🎭 Demonstrating: ${persona}`);
    applyPersona(persona);

    // Wait 3 seconds before next
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  console.log("✅ Demo sequence completed!");
}

/**
 * Export konfigurasi untuk persona tertentu
 * @param {string} personaName - Nama persona
 */
function exportPersona(personaName) {
  const persona = PERSONA_TEMPLATES[personaName];
  if (!persona) {
    console.error(`Persona '${personaName}' not found`);
    return;
  }

  const jsonString = JSON.stringify(persona, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `persona-${personaName}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log(`📥 Exported persona: ${personaName}`);
}

// ========================================
// 🔧 CONSOLE HELPERS
// ========================================

// Make functions available globally for console usage
if (typeof window !== "undefined") {
  window.PersonaManager = {
    templates: PERSONA_TEMPLATES,
    environments: ENVIRONMENT_CONFIGS,
    themes: THEME_VARIATIONS,
    apply: applyPersona,
    applyEnv: applyEnvironment,
    applyTheme: applyTheme,
    random: randomPersona,
    demo: demoSequence,
    export: exportPersona,

    // Quick helpers
    maya: () => applyPersona("personalAssistant"),
    alex: () => applyPersona("customerService"),
    profesor: () => applyPersona("educational"),
    chef: () => applyPersona("cooking"),
    gamer: () => applyPersona("gaming"),
    zen: () => applyPersona("lifeCoach"),

    // Environment helpers
    dev: () => applyEnvironment("development"),
    staging: () => applyEnvironment("staging"),
    prod: () => applyEnvironment("production"),
  };

  console.log(`
🎭 Persona Manager loaded!

Quick commands:
- PersonaManager.maya()     → Personal Assistant
- PersonaManager.alex()     → Customer Service  
- PersonaManager.profesor() → Educational Bot
- PersonaManager.chef()     → Cooking Assistant
- PersonaManager.random()   → Random persona
- PersonaManager.demo()     → Demo all personas

Environment:
- PersonaManager.dev()      → Development
- PersonaManager.staging()  → Staging
- PersonaManager.prod()     → Production

Available personas: ${Object.keys(PERSONA_TEMPLATES).join(", ")}
  `);
}

// Export for modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PERSONA_TEMPLATES,
    ENVIRONMENT_CONFIGS,
    THEME_VARIATIONS,
    applyPersona,
    applyEnvironment,
    applyTheme,
    randomPersona,
    demoSequence,
    exportPersona,
  };
}

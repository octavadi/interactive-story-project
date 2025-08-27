/**
 * Application Constants and Configuration
 * Centralized configuration management for the Interactive Story project
 */

// Application Configuration
window.APP_CONFIG = {
  // Application metadata
  APP_NAME: 'Interactive Story',
  APP_VERSION: '2.0.0',
  APP_DESCRIPTION: 'Interactive Story dengan AI Chatbot',
  
  // Environment settings
  ENVIRONMENT: window.location.hostname === 'localhost' ? 'development' : 'production',
  DEBUG_MODE: window.location.hostname === 'localhost',
  
  // Performance settings
  PERFORMANCE: {
    LAZY_LOAD_THRESHOLD: 0.1,
    LAZY_LOAD_ROOT_MARGIN: '50px',
    MEMORY_CHECK_INTERVAL: 30000, // 30 seconds
    PERFORMANCE_LOG_INTERVAL: 60000, // 1 minute
    MAX_ERROR_LOG_SIZE: 100,
    MAX_MEMORY_LOG_SIZE: 20,
    COMPONENT_LOAD_TIMEOUT: 10000, // 10 seconds
  },
  
  // UI/UX Settings
  UI: {
    ANIMATION_DURATION: {
      FAST: 200,
      NORMAL: 400,
      SLOW: 600
    },
    THEME: {
      DEFAULT: 'light',
      AVAILABLE: ['light', 'dark']
    },
    LANGUAGE: {
      DEFAULT: 'id',
      AVAILABLE: ['id', 'en']
    },
    MOBILE_BREAKPOINT: 768,
    TABLET_BREAKPOINT: 1024,
    DESKTOP_BREAKPOINT: 1200,
    
    // Touch targets (WCAG AA compliance)
    TOUCH_TARGET: {
      MINIMUM: 44, // px
      RECOMMENDED: 48 // px
    }
  },
  
  // Chat system configuration
  CHAT: {
    MAX_MESSAGES: 100,
    TYPING_DELAY: 1500,
    AUTO_SCROLL: true,
    SHOW_TIMESTAMPS: true,
    ENABLE_SOUND: false,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    RETRY_BACKOFF: 2, // exponential backoff multiplier
    
    // Webhook configuration
    WEBHOOK: {
      INPUT_URL: 'http://localhost:5678/webhook/inputWebhook',
      OUTPUT_URL: 'http://localhost:5678/webhook/outputWebhook',
      TIMEOUT: 30000, // 30 seconds
      POLLING_INTERVAL: 5000 // 5 seconds
    }
  },
  
  // Accessibility settings
  ACCESSIBILITY: {
    FOCUS_OUTLINE_WIDTH: 2, // px
    HIGH_CONTRAST_MODE: false,
    REDUCED_MOTION: false,
    SCREEN_READER_ANNOUNCEMENTS: true,
    KEYBOARD_NAVIGATION: true,
    
    // ARIA settings
    ARIA: {
      LIVE_REGION_POLITENESS: 'polite',
      EXPANDED_STATE_UPDATE: true,
      HIDDEN_STATE_UPDATE: true
    }
  },
  
  // Error handling configuration
  ERROR_HANDLING: {
    SHOW_USER_FRIENDLY_ERRORS: true,
    LOG_ERRORS_TO_CONSOLE: true,
    SEND_ERRORS_TO_SERVICE: false, // Set to true when error service is configured
    AUTO_RETRY_ON_NETWORK_ERROR: true,
    ERROR_NOTIFICATION_DURATION: 5000, // 5 seconds
    
    // Error types that should retry
    RETRYABLE_ERROR_PATTERNS: [
      'fetch',
      'network',
      'timeout',
      '50', // HTTP 5xx errors
      'NetworkError'
    ]
  }
};

// DOM Selectors - Centralized for consistency
window.DOM_SELECTORS = {
  // Main containers
  SCENE_CONTAINER: '.scene-container',
  SCENE_MAIN: '.scene-main',
  SCENE_HEADER: '.scene-header',
  SCENE_IMAGE: '.scene-image',
  SCENE_TEXT: '.scene-text',
  
  // Chat elements
  CHAT_CONTAINER: '#chatContainer',
  CHAT_INPUT: '#storyInput',
  CHAT_OUTPUT: '#storyOutput',
  CHAT_CLOSE_BTN: '#closeChatBtn',
  
  // Navigation and buttons
  FLOATING_CHATBOT_BTN: '.floating-chatbot-btn',
  START_STORY_BTN: '.start-story-btn',
  NAV_BTN: '.nav-btn',
  
  // Interactive elements
  CALL_ACTION: '.call_action',
  CHATBOT_TOOLTIP: '.chatbot-tooltip',
  
  // Forms and inputs
  MESSAGE_INPUT: '.message-input',
  SEND_BUTTON: '.send-button',
  
  // Components
  CHAT_INPUT_COMPONENT: 'chat-input',
  CHAT_OUTPUT_COMPONENT: 'chat-output',
  SHARED_FOOTER_COMPONENT: 'shared-footer'
};

// Event Names - Centralized event naming
window.EVENT_NAMES = {
  // Application events
  APP_READY: 'app:ready',
  CHATBOT_READY: 'chatbot:ready',
  
  // Chat events
  MESSAGE_SENT: 'chat:messageSent',
  MESSAGE_RECEIVED: 'chat:messageReceived',
  WEBHOOK_RESPONSE: 'webhookResponse',
  TYPING_START: 'chat:typingStart',
  TYPING_END: 'chat:typingEnd',
  
  // UI events
  CHAT_OPEN: 'ui:chatOpen',
  CHAT_CLOSE: 'ui:chatClose',
  THEME_CHANGE: 'ui:themeChange',
  LANGUAGE_CHANGE: 'ui:languageChange',
  
  // Error events
  ERROR_OCCURRED: 'error:occurred',
  ERROR_HANDLED: 'error:handled',
  
  // Performance events
  COMPONENT_LOADED: 'performance:componentLoaded',
  MEMORY_WARNING: 'performance:memoryWarning',
  PERFORMANCE_REPORT: 'performance:report'
};

// CSS Classes - Centralized class naming
window.CSS_CLASSES = {
  // State classes
  ACTIVE: 'active',
  VISIBLE: 'visible',
  HIDDEN: 'hidden',
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
  WARNING: 'warning',
  
  // Chat specific
  CHAT_OPEN: 'chat-open',
  SHOW: 'show',
  IS_VISIBLE: 'is-visible',
  USER_MESSAGE: 'user-message',
  AI_MESSAGE: 'ai-message',
  TYPING_INDICATOR: 'typing-indicator',
  
  // Accessibility
  SR_ONLY: 'sr-only',
  FOCUS_VISIBLE: 'focus-visible',
  HIGH_CONTRAST: 'high-contrast',
  REDUCED_MOTION: 'reduced-motion',
  
  // Animations
  ANIMATE_FADE_IN: 'animate-fade-in',
  ANIMATE_SCALE_IN: 'animate-scale-in',
  ANIMATE_SLIDE_UP: 'animate-slide-up',
  
  // Utility classes
  TEXT_CENTER: 'text-center',
  FONT_BOLD: 'font-weight-bold',
  MARGIN_BOTTOM_0: 'mb-0',
  MARGIN_BOTTOM_1: 'mb-1',
  MARGIN_BOTTOM_2: 'mb-2'
};

// ARIA Attributes - Centralized ARIA management
window.ARIA_ATTRIBUTES = {
  // States
  EXPANDED: 'aria-expanded',
  HIDDEN: 'aria-hidden',
  SELECTED: 'aria-selected',
  CHECKED: 'aria-checked',
  DISABLED: 'aria-disabled',
  
  // Properties
  LABEL: 'aria-label',
  LABELLEDBY: 'aria-labelledby',
  DESCRIBEDBY: 'aria-describedby',
  CONTROLS: 'aria-controls',
  OWNS: 'aria-owns',
  
  // Live regions
  LIVE: 'aria-live',
  ATOMIC: 'aria-atomic',
  RELEVANT: 'aria-relevant',
  
  // Roles
  ROLE: 'role'
};

// Error Messages - User-friendly error messages
window.ERROR_MESSAGES = {
  NETWORK: {
    CONNECTION_FAILED: 'Koneksi gagal. Silakan periksa koneksi internet Anda.',
    TIMEOUT: 'Permintaan timeout. Silakan coba lagi.',
    SERVER_ERROR: 'Terjadi kesalahan server. Silakan coba lagi nanti.',
    WEBHOOK_FAILED: 'Gagal terhubung ke layanan chat. Silakan coba lagi.'
  },
  
  VALIDATION: {
    EMPTY_MESSAGE: 'Pesan tidak boleh kosong.',
    MESSAGE_TOO_LONG: 'Pesan terlalu panjang. Maksimal 1000 karakter.',
    INVALID_INPUT: 'Input tidak valid. Silakan periksa kembali.'
  },
  
  COMPONENT: {
    LOAD_FAILED: 'Gagal memuat komponen. Silakan refresh halaman.',
    NOT_FOUND: 'Komponen tidak ditemukan.',
    INITIALIZATION_FAILED: 'Gagal menginisialisasi komponen.'
  },
  
  GENERIC: {
    UNKNOWN_ERROR: 'Terjadi kesalahan tak terduga. Silakan coba lagi.',
    FEATURE_UNAVAILABLE: 'Fitur tidak tersedia saat ini.',
    BROWSER_NOT_SUPPORTED: 'Browser Anda tidak mendukung fitur ini.'
  }
};

// Success Messages - Positive feedback messages
window.SUCCESS_MESSAGES = {
  CHAT: {
    MESSAGE_SENT: 'Pesan berhasil dikirim.',
    CONNECTION_ESTABLISHED: 'Koneksi berhasil dibuat.',
    CHAT_CLEARED: 'Riwayat chat berhasil dihapus.'
  },
  
  CONFIG: {
    SETTINGS_SAVED: 'Pengaturan berhasil disimpan.',
    THEME_CHANGED: 'Tema berhasil diubah.',
    LANGUAGE_CHANGED: 'Bahasa berhasil diubah.'
  },
  
  PERFORMANCE: {
    COMPONENT_LOADED: 'Komponen berhasil dimuat.',
    OPTIMIZATION_COMPLETE: 'Optimisasi selesai.'
  }
};

// Keyboard Shortcuts - Centralized keyboard navigation
window.KEYBOARD_SHORTCUTS = {
  CHAT: {
    SEND_MESSAGE: ['Enter'],
    FOCUS_INPUT: ['Ctrl+Enter', 'Meta+Enter'],
    CLEAR_CHAT: ['Ctrl+K', 'Meta+K'],
    EXPORT_CHAT: ['Ctrl+E', 'Meta+E']
  },
  
  UI: {
    CLOSE_MODAL: ['Escape'],
    TOGGLE_CHAT: ['Ctrl+/', 'Meta+/'],
    TOGGLE_THEME: ['Ctrl+Shift+T', 'Meta+Shift+T']
  },
  
  NAVIGATION: {
    NEXT_ELEMENT: ['Tab'],
    PREV_ELEMENT: ['Shift+Tab'],
    ACTIVATE_ELEMENT: ['Enter', 'Space']
  }
};

// Performance Thresholds - Performance monitoring thresholds
window.PERFORMANCE_THRESHOLDS = {
  MEMORY: {
    WARNING: 80, // percentage
    CRITICAL: 90 // percentage
  },
  
  LOAD_TIME: {
    GOOD: 1000, // ms
    ACCEPTABLE: 3000, // ms
    POOR: 5000 // ms
  },
  
  FRAME_RATE: {
    TARGET: 60, // fps
    MINIMUM: 30 // fps
  }
};

// Local Storage Keys - Centralized storage key management
window.STORAGE_KEYS = {
  // User preferences
  THEME: 'chatbot_theme',
  LANGUAGE: 'chatbot_language',
  
  // Chat data
  CHAT_CONFIG: 'chatbot_config',
  CHAT_HISTORY: 'chat_history',
  
  // Performance data
  PERFORMANCE_METRICS: 'performance_metrics',
  ERROR_LOG: 'error_log',
  
  // Feature flags
  FEATURE_FLAGS: 'feature_flags',
  
  // User settings
  ACCESSIBILITY_PREFERENCES: 'accessibility_preferences',
  UI_PREFERENCES: 'ui_preferences'
};

// Feature Flags - Toggle features on/off
window.FEATURE_FLAGS = {
  LAZY_LOADING: true,
  MEMORY_MONITORING: true,
  ERROR_REPORTING: true,
  PERFORMANCE_MONITORING: true,
  ACCESSIBILITY_FEATURES: true,
  CHAT_HISTORY: true,
  KEYBOARD_SHORTCUTS: true,
  TOOLTIPS: true,
  ANIMATIONS: true,
  SOUND_EFFECTS: false, // Disabled by default
  PUSH_NOTIFICATIONS: false, // Not implemented yet
  OFFLINE_MODE: false // Not implemented yet
};

// API Endpoints - Centralized endpoint management
window.API_ENDPOINTS = {
  // N8N Webhooks
  N8N: {
    INPUT_WEBHOOK: '/webhook/inputWebhook',
    OUTPUT_WEBHOOK: '/webhook/outputWebhook'
  },
  
  // Future API endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh'
  },
  
  CHAT: {
    SEND_MESSAGE: '/api/chat/send',
    GET_HISTORY: '/api/chat/history',
    CLEAR_HISTORY: '/api/chat/clear'
  },
  
  USER: {
    GET_PROFILE: '/api/user/profile',
    UPDATE_PREFERENCES: '/api/user/preferences'
  }
};

// Validation Rules - Input validation configuration
window.VALIDATION_RULES = {
  MESSAGE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 1000,
    ALLOWED_CHARACTERS: /^[a-zA-Z0-9\s\p{P}\p{S}\p{M}]*$/u
  },
  
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_-]+$/
  },
  
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
};

// Default Configurations - Default settings for various features
window.DEFAULT_CONFIG = {
  CHAT_PERSONA: {
    botName: 'Narrator',
    botDescription: 'Pemandu cerita interaktif',
    personality: 'friendly',
    responseStyle: 'narrative'
  },
  
  UI_PREFERENCES: {
    theme: 'light',
    language: 'id',
    showAnimations: true,
    autoScroll: true,
    showTimestamps: true
  },
  
  ACCESSIBILITY_PREFERENCES: {
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    focusIndicators: true
  },
  
  PERFORMANCE_PREFERENCES: {
    lazyLoading: true,
    memoryMonitoring: true,
    performanceLogging: false
  }
};

// Export configuration for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    APP_CONFIG: window.APP_CONFIG,
    DOM_SELECTORS: window.DOM_SELECTORS,
    EVENT_NAMES: window.EVENT_NAMES,
    CSS_CLASSES: window.CSS_CLASSES,
    ARIA_ATTRIBUTES: window.ARIA_ATTRIBUTES,
    ERROR_MESSAGES: window.ERROR_MESSAGES,
    SUCCESS_MESSAGES: window.SUCCESS_MESSAGES,
    KEYBOARD_SHORTCUTS: window.KEYBOARD_SHORTCUTS,
    PERFORMANCE_THRESHOLDS: window.PERFORMANCE_THRESHOLDS,
    STORAGE_KEYS: window.STORAGE_KEYS,
    FEATURE_FLAGS: window.FEATURE_FLAGS,
    API_ENDPOINTS: window.API_ENDPOINTS,
    VALIDATION_RULES: window.VALIDATION_RULES,
    DEFAULT_CONFIG: window.DEFAULT_CONFIG
  };
}

console.log('📋 Application constants loaded successfully');

/**
 * Centralized Error Handler
 * Provides consistent error handling, retry mechanisms, and user feedback
 */
class ErrorHandler {
  static instance = null;
  
  constructor() {
    if (ErrorHandler.instance) {
      return ErrorHandler.instance;
    }
    
    this.errorLog = [];
    this.maxLogSize = 100;
    this.setupGlobalErrorHandling();
    ErrorHandler.instance = this;
  }

  /**
   * Setup global error handling for uncaught errors
   */
  setupGlobalErrorHandling() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.logError('UnhandledPromiseRejection', event.reason);
      
      // Prevent the default browser error handling
      event.preventDefault();
      
      // Show user-friendly message
      this.showUserError('Terjadi kesalahan tak terduga. Tim teknis telah diberitahu.');
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      console.error('JavaScript error:', event.error);
      this.logError('JavaScriptError', event.error);
      
      // Show user-friendly message for critical errors
      if (event.error && event.error.stack && event.error.stack.includes('chat')) {
        this.showUserError('Terjadi masalah dengan sistem chat. Silakan refresh halaman.');
      }
    });
  }

  /**
   * Execute function with retry mechanism
   * @param {Function} fn - Function to execute
   * @param {Object} options - Retry options
   * @returns {Promise} - Promise that resolves with result or rejects with final error
   */
  static async withRetry(fn, options = {}) {
    const {
      retries = 3,
      delay = 1000,
      backoffMultiplier = 2,
      shouldRetry = () => true,
      onRetry = () => {}
    } = options;

    let lastError;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await fn();
        return result;
      } catch (error) {
        lastError = error;
        
        // Log the attempt
        console.warn(`Attempt ${attempt + 1}/${retries + 1} failed:`, error.message);
        
        // Check if we should retry
        if (attempt === retries || !shouldRetry(error)) {
          break;
        }
        
        // Call retry callback
        onRetry(error, attempt + 1);
        
        // Wait before retrying (exponential backoff)
        if (attempt < retries) {
          await this.delay(delay * Math.pow(backoffMultiplier, attempt));
        }
      }
    }

    throw lastError;
  }

  /**
   * Delay utility for retry mechanism
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise} - Promise that resolves after delay
   */
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Handle webhook errors specifically
   * @param {Error} error - The error that occurred
   * @param {string} context - Context where error occurred
   * @returns {Object} - Standardized error response
   */
  static handleWebhookError(error, context = 'webhook') {
    const errorResponse = {
      success: false,
      error: error.message,
      context,
      timestamp: new Date().toISOString(),
      retryable: false
    };

    // Determine if error is retryable
    if (error.name === 'NetworkError' || 
        error.message.includes('fetch') ||
        error.message.includes('network') ||
        (error.status && error.status >= 500)) {
      errorResponse.retryable = true;
    }

    // Log error details
    console.error(`Webhook Error [${context}]:`, {
      message: error.message,
      stack: error.stack,
      status: error.status,
      retryable: errorResponse.retryable
    });

    return errorResponse;
  }

  /**
   * Log error to internal log
   * @param {string} type - Error type
   * @param {Error} error - The error object
   */
  logError(type, error) {
    const logEntry = {
      type,
      message: error.message || error,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.errorLog.push(logEntry);

    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize);
    }

    // Send to analytics or logging service if available
    this.sendToLoggingService(logEntry);
  }

  /**
   * Show user-friendly error message
   * @param {string} message - User-friendly error message
   * @param {string} type - Error type (error, warning, info)
   */
  showUserError(message, type = 'error') {
    // Create or update error notification
    let notification = document.getElementById('error-notification');
    
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'error-notification';
      notification.className = 'error-notification';
      document.body.appendChild(notification);
    }

    notification.className = `error-notification ${type} show`;
    notification.innerHTML = `
      <div class="error-content">
        <span class="error-icon">${this.getErrorIcon(type)}</span>
        <span class="error-message">${message}</span>
        <button class="error-close" onclick="this.parentElement.parentElement.classList.remove('show')">
          ×
        </button>
      </div>
    `;

    // Add styles if not already present
    this.addErrorNotificationStyles();

    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (notification) {
        notification.classList.remove('show');
      }
    }, 5000);
  }

  /**
   * Get appropriate icon for error type
   * @param {string} type - Error type
   * @returns {string} - Icon character
   */
  getErrorIcon(type) {
    const icons = {
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      success: '✅'
    };
    return icons[type] || icons.error;
  }

  /**
   * Add CSS styles for error notifications
   */
  addErrorNotificationStyles() {
    if (document.getElementById('error-notification-styles')) {
      return; // Already added
    }

    const styles = document.createElement('style');
    styles.id = 'error-notification-styles';
    styles.textContent = `
      .error-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 400px;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        border-left: 4px solid #ef4444;
      }

      .error-notification.show {
        transform: translateX(0);
      }

      .error-notification.warning {
        border-left-color: #f59e0b;
      }

      .error-notification.info {
        border-left-color: #3b82f6;
      }

      .error-notification.success {
        border-left-color: #10b981;
      }

      .error-content {
        display: flex;
        align-items: center;
        padding: 16px;
        gap: 12px;
      }

      .error-icon {
        font-size: 18px;
        flex-shrink: 0;
      }

      .error-message {
        flex: 1;
        font-size: 14px;
        color: #374151;
        line-height: 1.4;
      }

      .error-close {
        background: none;
        border: none;
        font-size: 18px;
        color: #6b7280;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: background-color 0.2s ease;
      }

      .error-close:hover {
        background-color: #f3f4f6;
      }

      @media (max-width: 480px) {
        .error-notification {
          left: 16px;
          right: 16px;
          max-width: none;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  /**
   * Send error to logging service (placeholder for future implementation)
   * @param {Object} logEntry - Error log entry
   */
  sendToLoggingService(logEntry) {
    // Placeholder for sending to external logging service
    // Could be implemented to send to services like LogRocket, Sentry, etc.
    if (window.location.hostname === 'localhost') {
      console.log('Would send to logging service:', logEntry);
    }
  }

  /**
   * Get error logs
   * @returns {Array} - Array of error log entries
   */
  getErrorLog() {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  clearErrorLog() {
    this.errorLog = [];
  }

  /**
   * Create a safe async wrapper for functions
   * @param {Function} fn - Function to wrap
   * @param {string} context - Context for error reporting
   * @returns {Function} - Wrapped function
   */
  static createSafeWrapper(fn, context = 'unknown') {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        const errorHandler = new ErrorHandler();
        errorHandler.logError(`SafeWrapper:${context}`, error);
        
        // Show user-friendly message
        errorHandler.showUserError(
          `Terjadi masalah pada ${context}. Silakan coba lagi.`
        );
        
        throw error; // Re-throw so calling code can handle if needed
      }
    };
  }
}

// Create global instance
window.ErrorHandler = ErrorHandler;
window.errorHandler = new ErrorHandler();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ErrorHandler;
}

console.log('✅ Error Handler initialized');

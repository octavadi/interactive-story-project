/**
 * Performance Utilities
 * Provides lazy loading, memory management, and performance optimizations
 */

class PerformanceManager {
  constructor() {
    this.observers = new Map();
    this.eventListeners = new Map();
    this.loadedModules = new Map();
    this.performanceMetrics = {
      componentLoadTimes: new Map(),
      memoryUsage: [],
      networkRequests: []
    };
    
    this.init();
  }

  /**
   * Initialize performance monitoring
   */
  init() {
    this.setupIntersectionObserver();
    this.monitorMemoryUsage();
    this.setupNetworkMonitoring();
    
    // Performance debugging in development
    if (window.location.hostname === 'localhost') {
      this.setupPerformanceDebugging();
    }
  }

  /**
   * Lazy load component with intersection observer
   * @param {Element} element - Element to observe
   * @param {Function} loadCallback - Function to call when element is visible
   * @param {Object} options - Intersection observer options
   */
  lazyLoadComponent(element, loadCallback, options = {}) {
    const defaultOptions = {
      rootMargin: '50px',
      threshold: 0.1
    };
    
    const observerOptions = { ...defaultOptions, ...options };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const startTime = performance.now();
          
          loadCallback(entry.target)
            .then(() => {
              const endTime = performance.now();
              const componentName = entry.target.dataset.component || 'unknown';
              this.performanceMetrics.componentLoadTimes.set(
                componentName, 
                endTime - startTime
              );
              
              observer.unobserve(entry.target);
              console.log(`✅ Lazy loaded: ${componentName} (${(endTime - startTime).toFixed(2)}ms)`);
            })
            .catch(error => {
              console.error('❌ Failed to lazy load component:', error);
            });
        }
      });
    }, observerOptions);
    
    observer.observe(element);
    this.observers.set(element, observer);
    
    return observer;
  }

  /**
   * Dynamic import with caching and error handling
   * @param {string} modulePath - Path to module
   * @param {string} moduleName - Name for caching
   * @returns {Promise} - Module promise
   */
  async dynamicImport(modulePath, moduleName) {
    // Return cached module if available
    if (this.loadedModules.has(moduleName)) {
      return this.loadedModules.get(moduleName);
    }

    const startTime = performance.now();
    
    try {
      const module = await import(modulePath);
      const endTime = performance.now();
      
      this.loadedModules.set(moduleName, module);
      this.performanceMetrics.componentLoadTimes.set(
        `module:${moduleName}`,
        endTime - startTime
      );
      
      console.log(`📦 Loaded module: ${moduleName} (${(endTime - startTime).toFixed(2)}ms)`);
      return module;
      
    } catch (error) {
      console.error(`❌ Failed to load module ${moduleName}:`, error);
      throw error;
    }
  }

  /**
   * Optimized event listener management
   * @param {Element} element - Element to add listener to
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   * @param {Object} options - Event listener options
   */
  addManagedEventListener(element, event, handler, options = {}) {
    const listenerId = `${element.tagName}-${event}-${Date.now()}`;
    
    const wrappedHandler = this.throttle(handler, options.throttle || 0);
    
    element.addEventListener(event, wrappedHandler, options);
    
    // Store reference for cleanup
    if (!this.eventListeners.has(element)) {
      this.eventListeners.set(element, []);
    }
    
    this.eventListeners.get(element).push({
      id: listenerId,
      event,
      handler: wrappedHandler,
      options
    });
    
    return listenerId;
  }

  /**
   * Remove managed event listeners
   * @param {Element} element - Element to remove listeners from
   * @param {string} [specificEvent] - Specific event to remove
   */
  removeManagedEventListeners(element, specificEvent = null) {
    const listeners = this.eventListeners.get(element);
    
    if (!listeners) return;
    
    listeners.forEach(listener => {
      if (!specificEvent || listener.event === specificEvent) {
        element.removeEventListener(listener.event, listener.handler, listener.options);
      }
    });
    
    if (specificEvent) {
      // Remove only specific event listeners
      const remainingListeners = listeners.filter(l => l.event !== specificEvent);
      this.eventListeners.set(element, remainingListeners);
    } else {
      // Remove all listeners for element
      this.eventListeners.delete(element);
    }
  }

  /**
   * Throttle function calls
   * @param {Function} func - Function to throttle
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} - Throttled function
   */
  throttle(func, delay) {
    if (delay === 0) return func;
    
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        return func.apply(this, args);
      }
    };
  }

  /**
   * Debounce function calls
   * @param {Function} func - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} - Debounced function
   */
  debounce(func, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  /**
   * Image lazy loading with placeholder
   * @param {HTMLImageElement} img - Image element
   * @param {string} [placeholder] - Placeholder image URL
   */
  lazyLoadImage(img, placeholder = null) {
    if (placeholder) {
      img.src = placeholder;
    }
    
    const actualSrc = img.dataset.src || img.getAttribute('data-src');
    
    if (!actualSrc) {
      console.warn('No data-src found for lazy loading');
      return;
    }
    
    this.lazyLoadComponent(img, async (element) => {
      return new Promise((resolve, reject) => {
        const tempImg = new Image();
        
        tempImg.onload = () => {
          element.src = actualSrc;
          element.classList.add('loaded');
          resolve();
        };
        
        tempImg.onerror = () => {
          console.error('Failed to load image:', actualSrc);
          reject(new Error('Image load failed'));
        };
        
        tempImg.src = actualSrc;
      });
    });
  }

  /**
   * Setup intersection observer for general use
   */
  setupIntersectionObserver() {
    // Auto-setup lazy loading for elements with data-lazy attribute
    const lazyElements = document.querySelectorAll('[data-lazy]');
    
    lazyElements.forEach(element => {
      this.lazyLoadComponent(element, async (el) => {
        const component = el.dataset.lazy;
        if (component === 'image') {
          this.lazyLoadImage(el);
        } else if (component === 'component') {
          const modulePath = el.dataset.module;
          const moduleName = el.dataset.name;
          if (modulePath && moduleName) {
            await this.dynamicImport(modulePath, moduleName);
          }
        }
      });
    });
  }

  /**
   * Monitor memory usage
   */
  monitorMemoryUsage() {
    if (!performance.memory) {
      console.warn('Memory API not available');
      return;
    }
    
    const collectMemoryStats = () => {
      const memInfo = {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        timestamp: Date.now()
      };
      
      this.performanceMetrics.memoryUsage.push(memInfo);
      
      // Keep only last 10 minutes of data
      const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
      this.performanceMetrics.memoryUsage = this.performanceMetrics.memoryUsage
        .filter(entry => entry.timestamp > tenMinutesAgo);
      
      // Warn if memory usage is high
      const usagePercent = (memInfo.used / memInfo.limit) * 100;
      if (usagePercent > 80) {
        console.warn(`⚠️ High memory usage: ${usagePercent.toFixed(1)}%`);
        this.suggestMemoryOptimizations();
      }
    };
    
    // Collect memory stats every 30 seconds
    setInterval(collectMemoryStats, 30000);
    collectMemoryStats(); // Initial collection
  }

  /**
   * Suggest memory optimizations
   */
  suggestMemoryOptimizations() {
    console.log('💡 Memory optimization suggestions:');
    console.log('- Clean up unused event listeners');
    console.log('- Remove references to large objects');
    console.log('- Consider using WeakMap/WeakSet for caches');
    
    // Auto-cleanup if possible
    this.performAutoCleanup();
  }

  /**
   * Perform automatic cleanup
   */
  performAutoCleanup() {
    // Cleanup observers for removed elements
    this.observers.forEach((observer, element) => {
      if (!document.contains(element)) {
        observer.disconnect();
        this.observers.delete(element);
      }
    });
    
    // Cleanup event listeners for removed elements
    this.eventListeners.forEach((listeners, element) => {
      if (!document.contains(element)) {
        this.removeManagedEventListeners(element);
      }
    });
    
    console.log('🧹 Performed automatic cleanup');
  }

  /**
   * Setup network monitoring
   */
  setupNetworkMonitoring() {
    if (!window.PerformanceObserver) {
      return;
    }
    
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.entryType === 'navigation' || entry.entryType === 'resource') {
          this.performanceMetrics.networkRequests.push({
            name: entry.name,
            type: entry.entryType,
            duration: entry.duration,
            size: entry.transferSize || 0,
            timestamp: Date.now()
          });
        }
      });
    });
    
    try {
      observer.observe({ entryTypes: ['navigation', 'resource'] });
    } catch (error) {
      console.warn('Could not setup network monitoring:', error);
    }
  }

  /**
   * Setup performance debugging
   */
  setupPerformanceDebugging() {
    // Add performance metrics to window for debugging
    window.performanceMetrics = this.performanceMetrics;
    
    // Add utility functions
    window.getPerformanceReport = () => {
      return {
        componentLoadTimes: Object.fromEntries(this.performanceMetrics.componentLoadTimes),
        memoryUsage: this.performanceMetrics.memoryUsage.slice(-10),
        networkRequests: this.performanceMetrics.networkRequests.slice(-20),
        managedListeners: this.eventListeners.size,
        activeObservers: this.observers.size,
        loadedModules: Array.from(this.loadedModules.keys())
      };
    };
    
    window.forceCleanup = () => {
      this.performAutoCleanup();
    };
    
    console.log('🔧 Performance debugging enabled. Use getPerformanceReport() for metrics');
  }

  /**
   * Preload critical resources
   * @param {Array} resources - Array of resource URLs
   */
  preloadResources(resources) {
    resources.forEach(resource => {
      if (typeof resource === 'string') {
        this.preloadResource(resource);
      } else if (resource.url) {
        this.preloadResource(resource.url, resource.as, resource.type);
      }
    });
  }

  /**
   * Preload single resource
   * @param {string} url - Resource URL
   * @param {string} as - Resource type (script, style, image, etc.)
   * @param {string} type - MIME type
   */
  preloadResource(url, as = 'fetch', type = null) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;
    
    if (type) {
      link.type = type;
    }
    
    link.onload = () => {
      console.log(`⚡ Preloaded: ${url}`);
    };
    
    link.onerror = () => {
      console.warn(`❌ Failed to preload: ${url}`);
    };
    
    document.head.appendChild(link);
  }

  /**
   * Get performance report
   * @returns {Object} - Performance metrics
   */
  getPerformanceReport() {
    return {
      componentLoadTimes: Object.fromEntries(this.performanceMetrics.componentLoadTimes),
      averageMemoryUsage: this.calculateAverageMemoryUsage(),
      networkRequestCount: this.performanceMetrics.networkRequests.length,
      managedListenersCount: this.eventListeners.size,
      activeObserversCount: this.observers.size,
      loadedModulesCount: this.loadedModules.size
    };
  }

  /**
   * Calculate average memory usage
   * @returns {Object} - Memory usage statistics
   */
  calculateAverageMemoryUsage() {
    if (this.performanceMetrics.memoryUsage.length === 0) {
      return { average: 0, peak: 0, current: 0 };
    }
    
    const usages = this.performanceMetrics.memoryUsage.map(entry => entry.used);
    const average = usages.reduce((sum, usage) => sum + usage, 0) / usages.length;
    const peak = Math.max(...usages);
    const current = usages[usages.length - 1];
    
    return { average, peak, current };
  }

  /**
   * Cleanup all resources
   */
  cleanup() {
    // Disconnect all observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    
    // Remove all managed event listeners
    this.eventListeners.forEach((listeners, element) => {
      this.removeManagedEventListeners(element);
    });
    
    // Clear caches
    this.loadedModules.clear();
    this.performanceMetrics.componentLoadTimes.clear();
    this.performanceMetrics.memoryUsage = [];
    this.performanceMetrics.networkRequests = [];
    
    console.log('🧹 Performance manager cleaned up');
  }
}

// Create global instance
window.PerformanceManager = PerformanceManager;
window.performanceManager = new PerformanceManager();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceManager;
}

console.log('⚡ Performance Manager initialized');

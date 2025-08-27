/**
 * Browser Polyfills untuk Cross-Browser Compatibility
 * Support untuk Chrome, Safari, Edge, dan browser lama
 */

(function () {
  "use strict";

  // ==========================================
  // WEB COMPONENTS POLYFILL
  // ==========================================

  // Custom Elements polyfill check
  if (!window.customElements) {
    console.warn("⚠️ Custom Elements not supported. Loading polyfill...");

    // Basic Custom Elements shim
    window.customElements = {
      define: function (name, constructor) {
        // Store constructor for later use
        window[name.replace("-", "") + "Constructor"] = constructor;

        // Find existing elements and upgrade them
        var elements = document.querySelectorAll(name);
        for (var i = 0; i < elements.length; i++) {
          new constructor().connectedCallback &&
            new constructor().connectedCallback.call(elements[i]);
        }
      },
    };
  }

  // Shadow DOM basic polyfill
  if (!Element.prototype.attachShadow) {
    console.warn("⚠️ Shadow DOM not supported. Using fallback...");

    Element.prototype.attachShadow = function (options) {
      // Create a simple wrapper div
      var shadowRoot = document.createElement("div");
      shadowRoot.className = "shadow-root-polyfill";
      this.appendChild(shadowRoot);

      // Mock shadow root methods
      shadowRoot.querySelector = function (selector) {
        return this.querySelector(selector);
      }.bind(shadowRoot);

      shadowRoot.querySelectorAll = function (selector) {
        return this.querySelectorAll(selector);
      }.bind(shadowRoot);

      return shadowRoot;
    };
  }

  // ==========================================
  // ES6+ POLYFILLS
  // ==========================================

  // Object.assign polyfill untuk IE
  if (!Object.assign) {
    Object.assign = function (target) {
      if (target == null) {
        throw new TypeError("Cannot convert undefined or null to object");
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) {
          for (var nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    };
  }

  // Array.from polyfill
  if (!Array.from) {
    Array.from = function (arrayLike) {
      return Array.prototype.slice.call(arrayLike);
    };
  }

  // String.includes polyfill
  if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
      if (typeof start !== "number") {
        start = 0;
      }

      if (start + search.length > this.length) {
        return false;
      } else {
        return this.indexOf(search, start) !== -1;
      }
    };
  }

  // ==========================================
  // DOM POLYFILLS
  // ==========================================

  // closest() polyfill untuk IE
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
      var el = this;

      do {
        if (Element.prototype.matches.call(el, s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);

      return null;
    };
  }

  // matches() polyfill untuk IE
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function (s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s);
        var i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1;
      };
  }

  // remove() polyfill untuk IE
  if (!Element.prototype.remove) {
    Element.prototype.remove = function () {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }

  // ==========================================
  // FETCH API POLYFILL
  // ==========================================

  if (!window.fetch) {
    console.warn(
      "⚠️ Fetch API not supported. Using XMLHttpRequest fallback..."
    );

    window.fetch = function (url, options) {
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        options = options || {};

        xhr.open(options.method || "GET", url);

        // Set headers
        if (options.headers) {
          Object.keys(options.headers).forEach(function (key) {
            xhr.setRequestHeader(key, options.headers[key]);
          });
        }

        xhr.onload = function () {
          var response = {
            ok: xhr.status >= 200 && xhr.status < 300,
            status: xhr.status,
            statusText: xhr.statusText,
            text: function () {
              return Promise.resolve(xhr.responseText);
            },
            json: function () {
              return Promise.resolve(JSON.parse(xhr.responseText));
            },
          };
          resolve(response);
        };

        xhr.onerror = function () {
          reject(new Error("Network error"));
        };

        xhr.send(options.body || null);
      });
    };
  }

  // ==========================================
  // PROMISE POLYFILL
  // ==========================================

  if (!window.Promise) {
    console.warn("⚠️ Promise not supported. Loading basic polyfill...");

    // Simple Promise polyfill
    window.Promise = function (executor) {
      var self = this;
      this.state = "pending";
      this.value = undefined;
      this.handlers = [];

      function resolve(result) {
        if (self.state === "pending") {
          self.state = "fulfilled";
          self.value = result;
          self.handlers.forEach(handle);
          self.handlers = null;
        }
      }

      function reject(error) {
        if (self.state === "pending") {
          self.state = "rejected";
          self.value = error;
          self.handlers.forEach(handle);
          self.handlers = null;
        }
      }

      function handle(handler) {
        if (self.state === "pending") {
          self.handlers.push(handler);
        } else {
          if (
            self.state === "fulfilled" &&
            typeof handler.onFulfilled === "function"
          ) {
            handler.onFulfilled(self.value);
          }
          if (
            self.state === "rejected" &&
            typeof handler.onRejected === "function"
          ) {
            handler.onRejected(self.value);
          }
        }
      }

      this.then = function (onFulfilled, onRejected) {
        return new Promise(function (resolve, reject) {
          handle({
            onFulfilled: function (result) {
              try {
                var returnValue = onFulfilled ? onFulfilled(result) : result;
                resolve(returnValue);
              } catch (ex) {
                reject(ex);
              }
            },
            onRejected: function (error) {
              try {
                var returnValue = onRejected ? onRejected(error) : error;
                reject(returnValue);
              } catch (ex) {
                reject(ex);
              }
            },
          });
        });
      };

      executor(resolve, reject);
    };
  }

  // ==========================================
  // LOCALSTORAGE FALLBACK
  // ==========================================

  if (!window.localStorage) {
    console.warn("⚠️ localStorage not supported. Using memory fallback...");

    var localStoragePolyfill = {
      data: {},
      getItem: function (key) {
        return this.data[key] || null;
      },
      setItem: function (key, value) {
        this.data[key] = String(value);
      },
      removeItem: function (key) {
        delete this.data[key];
      },
      clear: function () {
        this.data = {};
      },
    };

    window.localStorage = localStoragePolyfill;
  }

  // ==========================================
  // CSS CUSTOM PROPERTIES FALLBACK
  // ==========================================

  // Simple CSS custom properties polyfill
  if (
    !window.CSS ||
    !window.CSS.supports ||
    !window.CSS.supports("(--primary-color: #3b82f6)")
  ) {
    console.warn(
      "⚠️ CSS Custom Properties not fully supported. Loading fallback..."
    );

    // Apply fallback colors
    var style = document.createElement("style");
    style.textContent = `
      .nav-btn { border-color: #3b82f6; color: #3b82f6; }
      .nav-btn:hover { background: #3b82f6; color: white; }
      .btn-primary { background: #3b82f6; }
      .settings-btn:hover { background: #3b82f6; }
      .form-input:focus { border-color: #3b82f6; }
      .content-card { background: #ffffff; }
      .scene-header { background: rgba(255, 255, 255, 0.95); }
    `;
    document.head.appendChild(style);
  }

  // ==========================================
  // INTERSECTION OBSERVER POLYFILL
  // ==========================================

  if (!window.IntersectionObserver) {
    console.warn(
      "⚠️ IntersectionObserver not supported. Using scroll fallback..."
    );

    // Simple polyfill untuk lazy loading jika diperlukan
    window.IntersectionObserver = function (callback) {
      this.observe = function (element) {
        // Immediately trigger callback for polyfill
        callback([
          {
            isIntersecting: true,
            target: element,
          },
        ]);
      };

      this.unobserve = function () {};
      this.disconnect = function () {};
    };
  }

  // ==========================================
  // BROWSER DETECTION & SPECIFIC FIXES
  // ==========================================

  // Detect browser
  var browser = {
    isIE:
      navigator.userAgent.indexOf("MSIE") !== -1 ||
      navigator.userAgent.indexOf("Trident/") !== -1,
    isEdge: navigator.userAgent.indexOf("Edge") !== -1,
    isSafari:
      navigator.userAgent.indexOf("Safari") !== -1 &&
      navigator.userAgent.indexOf("Chrome") === -1,
    isChrome: navigator.userAgent.indexOf("Chrome") !== -1,
    isFirefox: navigator.userAgent.indexOf("Firefox") !== -1,
    isMobile:
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ),
  };

  // Add browser classes to html element
  var browserClasses = [];
  if (browser.isIE) browserClasses.push("ie");
  if (browser.isEdge) browserClasses.push("edge");
  if (browser.isSafari) browserClasses.push("safari");
  if (browser.isChrome) browserClasses.push("chrome");
  if (browser.isFirefox) browserClasses.push("firefox");
  if (browser.isMobile) browserClasses.push("mobile");

  document.documentElement.className += " " + browserClasses.join(" ");

  // Safari specific fixes
  if (browser.isSafari) {
    // Fix for Safari input zoom issue
    var viewport = document.querySelector("meta[name=viewport]");
    if (!viewport) {
      viewport = document.createElement("meta");
      viewport.name = "viewport";
      document.head.appendChild(viewport);
    }
    viewport.content =
      "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
  }

  // Edge specific fixes
  if (browser.isEdge) {
    // Fix for Edge CSS Grid issues
    document.documentElement.classList.add("edge-grid-fallback");
  }

  // ==========================================
  // CONSOLE POLYFILL
  // ==========================================

  if (!window.console) {
    window.console = {
      log: function () {},
      warn: function () {},
      error: function () {},
      info: function () {},
      debug: function () {},
    };
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================

  // Feature detection results
  var features = {
    customElements: !!window.customElements,
    shadowDOM: !!Element.prototype.attachShadow,
    cssCustomProperties:
      window.CSS && window.CSS.supports && window.CSS.supports("(--test: 0)"),
    fetch: !!window.fetch,
    promise: !!window.Promise,
    localStorage: !!window.localStorage,
    intersectionObserver: !!window.IntersectionObserver,
  };

  console.log("🔧 Browser Compatibility Check:", {
    browser: browser,
    features: features,
  });

  // Export for debugging
  window.BrowserCompatibility = {
    browser: browser,
    features: features,
  };

  // Notify when polyfills are loaded
  document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Browser polyfills loaded successfully");
  });
})();

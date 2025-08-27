/**
 * Chat History Manager
 * Mengelola penyimpanan, pengambilan, dan ekspor histori percakapan
 */

class ChatHistoryManager {
  constructor() {
    try {
      this.storageKey = "discussion_chat_history";
      this.settingsKey = "discussion_history_settings";
      this.sessionId = this.getOrCreateSessionId();

      // Load user settings with fallback
      this.settings = this.loadSettings();

      // Load history first (before data management initialization)
      this.history = this.loadHistory();

      // Initialize data management
      this.initializeDataManagement();

      // Setup auto-cleanup listeners
      this.setupAutoCleanup();

      console.log("✅ ChatHistoryManager constructor completed successfully");
    } catch (error) {
      console.error("❌ Error in ChatHistoryManager constructor:", error);
      // Fallback initialization
      this.fallbackInitialization();
    }
  }

  /**
   * Fallback initialization if main constructor fails
   */
  fallbackInitialization() {
    console.log("🔄 Running fallback initialization...");
    this.storageKey = "discussion_chat_history";
    this.settingsKey = "discussion_history_settings";
    this.sessionId = "fallback_" + Date.now();
    this.settings = this.getDefaultSettings();
    this.history = [];
    console.log("⚠️ ChatHistoryManager initialized with fallback mode");
  }

  /**
   * Mendapatkan atau membuat session ID unik
   */
  getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem("chat_session_id");
    if (!sessionId) {
      sessionId = this.generateSessionId();
      sessionStorage.setItem("chat_session_id", sessionId);
    }
    return sessionId;
  }

  /**
   * Generate session ID unik
   */
  generateSessionId() {
    const timestamp = new Date().getTime();
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `session_${timestamp}_${randomStr}`;
  }

  /**
   * Get default settings untuk data management
   */
  getDefaultSettings() {
    return {
      autoCleanupOnRefresh: false, // Auto-delete saat refresh
      maxMessagesPerSession: 100, // Max pesan per sesi
      maxTotalMessages: 1000, // Max total pesan
      maxStorageMB: 5, // Max storage (MB)
      autoDeleteOldMessages: true, // Auto-delete pesan lama
      retentionDays: 7, // Simpan pesan berapa hari
      enableManualSave: false, // Memerlukan save manual
      sessionPersistence: "auto", // "auto", "manual", "never"
      showStorageWarnings: true, // Tampilkan warning storage
      lastCleanupDate: null, // Tanggal cleanup terakhir
      savedSessions: [], // Session yang di-save manual
    };
  }

  /**
   * Load settings dari localStorage
   */
  loadSettings() {
    try {
      const stored = localStorage.getItem(this.settingsKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge dengan default settings untuk backward compatibility
        return { ...this.getDefaultSettings(), ...parsed };
      }
    } catch (error) {
      console.error("❌ Error loading settings:", error);
    }
    return this.getDefaultSettings();
  }

  /**
   * Save settings ke localStorage
   */
  saveSettings() {
    try {
      localStorage.setItem(this.settingsKey, JSON.stringify(this.settings));
      console.log("⚙️ Settings saved:", this.settings);
    } catch (error) {
      console.error("❌ Error saving settings:", error);
    }
  }

  /**
   * Update specific setting
   */
  updateSetting(key, value) {
    this.settings[key] = value;
    this.saveSettings();

    // Trigger immediate actions based on setting changes
    this.onSettingChanged(key, value);
  }

  /**
   * Handle setting changes
   */
  onSettingChanged(key, value) {
    switch (key) {
      case "maxTotalMessages":
      case "maxMessagesPerSession":
        this.enforceMessageLimits();
        break;
      case "autoDeleteOldMessages":
        if (value) this.cleanupOldMessages();
        break;
      case "maxStorageMB":
        this.checkStorageUsage();
        break;
    }
  }

  /**
   * Initialize data management system
   */
  initializeDataManagement() {
    try {
      // Mark session as active
      sessionStorage.setItem("session_active", "true");
      sessionStorage.setItem("session_start_time", Date.now().toString());

      // Check if this is a refresh/restart
      const wasActive = sessionStorage.getItem("session_was_active");
      if (wasActive && this.settings && this.settings.autoCleanupOnRefresh) {
        this.performAutoCleanup();
      }

      // Mark session as was active for next time
      sessionStorage.setItem("session_was_active", "true");

      // Perform maintenance tasks (only if settings are loaded)
      if (this.settings) {
        this.performMaintenance();
      }

      console.log("✅ Data management initialized");
    } catch (error) {
      console.error("❌ Error initializing data management:", error);
    }
  }

  /**
   * Setup auto-cleanup event listeners
   */
  setupAutoCleanup() {
    try {
      // Cleanup on page unload (if enabled)
      window.addEventListener("beforeunload", () => {
        if (
          this.settings &&
          (this.settings.sessionPersistence === "never" ||
            (this.settings.enableManualSave && !this.isSessionSaved()))
        ) {
          this.performBeforeUnloadCleanup();
        }
      });

      // Cleanup on page hide (mobile)
      document.addEventListener("visibilitychange", () => {
        if (
          document.hidden &&
          this.settings &&
          this.settings.autoCleanupOnRefresh
        ) {
          sessionStorage.setItem("should_cleanup_on_return", "true");
        }
      });

      // Periodic maintenance
      this.setupPeriodicMaintenance();

      console.log("✅ Auto-cleanup listeners setup completed");
    } catch (error) {
      console.error("❌ Error setting up auto-cleanup:", error);
    }
  }

  /**
   * Setup periodic maintenance tasks
   */
  setupPeriodicMaintenance() {
    try {
      // Run maintenance every 5 minutes
      setInterval(() => {
        if (this.settings) {
          this.performMaintenance();
        }
      }, 5 * 60 * 1000);

      console.log("✅ Periodic maintenance setup completed");
    } catch (error) {
      console.error("❌ Error setting up periodic maintenance:", error);
    }
  }

  /**
   * Perform auto cleanup on refresh/restart
   */
  performAutoCleanup() {
    console.log("🔄 Performing auto-cleanup after refresh...");

    if (this.settings.sessionPersistence === "never") {
      // Delete all unsaved sessions
      this.clearUnsavedSessions();
    } else if (this.settings.enableManualSave) {
      // Only delete sessions that weren't manually saved
      this.clearUnsavedSessions();
    }
  }

  /**
   * Perform cleanup before page unload
   */
  performBeforeUnloadCleanup() {
    if (!this.isSessionSaved()) {
      // Mark current session for cleanup
      sessionStorage.setItem("cleanup_current_session", this.sessionId);
    }
  }

  /**
   * Clear unsaved sessions
   */
  clearUnsavedSessions() {
    const savedSessions = this.settings.savedSessions || [];
    const originalLength = this.history.length;

    this.history = this.history.filter((msg) =>
      savedSessions.includes(msg.sessionId)
    );

    const deletedCount = originalLength - this.history.length;
    if (deletedCount > 0) {
      this.saveHistory();
      console.log(`🗑️ Auto-cleanup: ${deletedCount} unsaved messages deleted`);
    }
  }

  /**
   * Check if current session is saved
   */
  isSessionSaved() {
    return this.settings.savedSessions.includes(this.sessionId);
  }

  /**
   * Save current session (prevent auto-cleanup)
   */
  saveCurrentSession() {
    if (!this.isSessionSaved()) {
      this.settings.savedSessions.push(this.sessionId);
      this.saveSettings();
      console.log(`💾 Session ${this.sessionId} saved from auto-cleanup`);
      return true;
    }
    return false;
  }

  /**
   * Unsave current session (allow auto-cleanup)
   */
  unsaveCurrentSession() {
    const index = this.settings.savedSessions.indexOf(this.sessionId);
    if (index > -1) {
      this.settings.savedSessions.splice(index, 1);
      this.saveSettings();
      console.log(`🗑️ Session ${this.sessionId} marked for auto-cleanup`);
      return true;
    }
    return false;
  }

  /**
   * Perform maintenance tasks
   */
  performMaintenance() {
    console.log("🔧 Running maintenance tasks...");

    // Enforce message limits
    this.enforceMessageLimits();

    // Cleanup old messages if enabled
    if (this.settings.autoDeleteOldMessages) {
      this.cleanupOldMessages();
    }

    // Check storage usage
    this.checkStorageUsage();

    // Update last cleanup date
    this.settings.lastCleanupDate = new Date().toISOString();
    this.saveSettings();
  }

  /**
   * Enforce message limits
   */
  enforceMessageLimits() {
    let hasChanges = false;

    // Enforce total message limit
    if (this.history.length > this.settings.maxTotalMessages) {
      const excessCount = this.history.length - this.settings.maxTotalMessages;
      // Remove oldest messages, but keep saved sessions
      const savedSessions = this.settings.savedSessions;

      // Sort by timestamp and remove oldest unsaved messages
      const sortedHistory = [...this.history].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      let removedCount = 0;
      for (
        let i = 0;
        i < sortedHistory.length && removedCount < excessCount;
        i++
      ) {
        const msg = sortedHistory[i];
        if (!savedSessions.includes(msg.sessionId)) {
          const index = this.history.findIndex((h) => h.id === msg.id);
          if (index > -1) {
            this.history.splice(index, 1);
            removedCount++;
            hasChanges = true;
          }
        }
      }

      if (removedCount > 0) {
        console.log(
          `📊 Enforced total limit: removed ${removedCount} old messages`
        );
      }
    }

    // Enforce per-session limit
    const sessionCounts = {};
    this.history.forEach((msg) => {
      sessionCounts[msg.sessionId] = (sessionCounts[msg.sessionId] || 0) + 1;
    });

    Object.keys(sessionCounts).forEach((sessionId) => {
      if (sessionCounts[sessionId] > this.settings.maxMessagesPerSession) {
        const sessionMessages = this.history
          .filter((msg) => msg.sessionId === sessionId)
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        const excessCount =
          sessionMessages.length - this.settings.maxMessagesPerSession;
        const toRemove = sessionMessages.slice(0, excessCount);

        toRemove.forEach((msg) => {
          const index = this.history.findIndex((h) => h.id === msg.id);
          if (index > -1) {
            this.history.splice(index, 1);
            hasChanges = true;
          }
        });

        if (excessCount > 0) {
          console.log(
            `📊 Enforced session limit: removed ${excessCount} messages from session ${sessionId}`
          );
        }
      }
    });

    if (hasChanges) {
      this.saveHistory();
    }
  }

  /**
   * Cleanup old messages based on retention days
   */
  cleanupOldMessages() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.settings.retentionDays);

    const originalLength = this.history.length;
    const savedSessions = this.settings.savedSessions;

    this.history = this.history.filter((msg) => {
      const messageDate = new Date(msg.timestamp);
      // Keep if message is recent OR session is saved
      return messageDate > cutoffDate || savedSessions.includes(msg.sessionId);
    });

    const deletedCount = originalLength - this.history.length;
    if (deletedCount > 0) {
      this.saveHistory();
      console.log(
        `📅 Cleanup old messages: removed ${deletedCount} messages older than ${this.settings.retentionDays} days`
      );
    }
  }

  /**
   * Check storage usage and warn if needed
   */
  checkStorageUsage() {
    try {
      const historyData = localStorage.getItem(this.storageKey);
      const historySizeMB = historyData ? historyData.length / 1024 / 1024 : 0;

      if (historySizeMB > this.settings.maxStorageMB) {
        console.warn(
          `⚠️ Storage usage (${historySizeMB.toFixed(2)}MB) exceeds limit (${
            this.settings.maxStorageMB
          }MB)`
        );

        if (this.settings.showStorageWarnings) {
          this.showStorageWarning(historySizeMB);
        }

        // Auto-cleanup if necessary
        this.performEmergencyCleanup();
      }
    } catch (error) {
      console.error("❌ Error checking storage usage:", error);
    }
  }

  /**
   * Show storage warning to user
   */
  showStorageWarning(currentSizeMB) {
    const event = new CustomEvent("storageWarning", {
      detail: {
        currentSize: currentSizeMB,
        maxSize: this.settings.maxStorageMB,
        message: `Storage usage (${currentSizeMB.toFixed(
          2
        )}MB) melebihi batas (${
          this.settings.maxStorageMB
        }MB). Pertimbangkan untuk menghapus histori lama.`,
      },
    });
    document.dispatchEvent(event);
  }

  /**
   * Perform emergency cleanup when storage is full
   */
  performEmergencyCleanup() {
    console.log("🚨 Performing emergency cleanup due to storage limit...");

    // More aggressive cleanup
    const originalSettings = { ...this.settings };

    // Temporarily reduce limits
    this.settings.maxTotalMessages = Math.floor(
      this.settings.maxTotalMessages * 0.7
    );
    this.settings.retentionDays = Math.floor(this.settings.retentionDays * 0.5);

    // Perform cleanup
    this.enforceMessageLimits();
    this.cleanupOldMessages();

    // Restore original settings
    this.settings = originalSettings;
    this.saveSettings();
  }

  /**
   * Menyimpan pesan baru ke histori
   * @param {string} speaker - 'user' atau nama bot
   * @param {string} message - Teks pesan
   * @param {Date} timestamp - Waktu pesan (opsional, default sekarang)
   */
  addMessage(speaker, message, timestamp = null) {
    try {
      console.log("📝 Adding message - Speaker:", speaker, "Message:", message);

      if (!this.history) {
        console.warn("⚠️ History array not initialized, creating new array");
        this.history = [];
      }

      if (!this.sessionId) {
        console.warn("⚠️ Session ID not found, generating new one");
        this.sessionId = this.generateSessionId();
      }

      const messageData = {
        id: this.generateMessageId(),
        speaker: speaker,
        message: message.trim(),
        timestamp: timestamp || new Date(),
        sessionId: this.sessionId,
      };

      this.history.push(messageData);
      this.saveHistory();

      console.log("✅ Pesan berhasil disimpan ke histori:", messageData);
      console.log("📊 Total pesan dalam histori:", this.history.length);

      return messageData;
    } catch (error) {
      console.error("❌ Error adding message to history:", error);
      return null;
    }
  }

  /**
   * Generate ID unik untuk setiap pesan
   */
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Menyimpan histori ke localStorage
   */
  saveHistory() {
    try {
      const historyData = JSON.stringify(this.history);
      localStorage.setItem(this.storageKey, historyData);
      console.log("💾 Histori berhasil disimpan ke localStorage");
      console.log(
        "📊 Data size:",
        (historyData.length / 1024).toFixed(2),
        "KB"
      );
    } catch (error) {
      console.error("❌ Error menyimpan histori:", error);
      console.error("Storage key:", this.storageKey);
      console.error(
        "History length:",
        this.history ? this.history.length : "undefined"
      );
    }
  }

  /**
   * Memuat histori dari localStorage
   */
  loadHistory() {
    try {
      console.log("📂 Loading history from localStorage...");
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log(
          "✅ History loaded successfully, message count:",
          parsed.length
        );
        // Konversi string timestamp kembali ke Date object
        return parsed.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      } else {
        console.log("📭 No existing history found, starting with empty array");
      }
    } catch (error) {
      console.error("❌ Error memuat histori:", error);
      console.error("Storage key:", this.storageKey);
    }
    return [];
  }

  /**
   * Mendapatkan histori sesi saat ini
   */
  getCurrentSessionHistory() {
    return this.history.filter((msg) => msg.sessionId === this.sessionId);
  }

  /**
   * Mendapatkan seluruh histori
   */
  getAllHistory() {
    return this.history;
  }

  /**
   * Membersihkan histori
   */
  clearHistory() {
    this.history = [];
    this.saveHistory();
    console.log("🗑️ Histori telah dibersihkan");
  }

  /**
   * Membersihkan histori sesi tertentu
   */
  clearSessionHistory(sessionId = null) {
    const targetSessionId = sessionId || this.sessionId;
    this.history = this.history.filter(
      (msg) => msg.sessionId !== targetSessionId
    );
    this.saveHistory();
    console.log(`🗑️ Histori sesi ${targetSessionId} telah dibersihkan`);
  }

  /**
   * Ekspor histori ke format plain text
   * @param {boolean} currentSessionOnly - Hanya sesi saat ini atau semua
   */
  exportToPlainText(currentSessionOnly = true) {
    const messages = currentSessionOnly
      ? this.getCurrentSessionHistory()
      : this.getAllHistory();

    if (messages.length === 0) {
      return "Tidak ada histori percakapan yang tersedia.";
    }

    let content = "";
    content += "=".repeat(60) + "\n";
    content += "HISTORI PERCAKAPAN INTERACTIVE STORY\n";
    content += "=".repeat(60) + "\n";
    content += `Diekspor pada: ${new Date().toLocaleString("id-ID")}\n`;
    content += `Total pesan: ${messages.length}\n`;
    if (currentSessionOnly) {
      content += `Session ID: ${this.sessionId}\n`;
    }
    content += "=".repeat(60) + "\n\n";

    messages.forEach((msg, index) => {
      const timestamp = msg.timestamp.toLocaleString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      content += `[${index + 1}] ${timestamp}\n`;
      content += `${msg.speaker}: ${msg.message}\n`;
      content += "-".repeat(40) + "\n\n";
    });

    content += "=".repeat(60) + "\n";
    content += "END OF CONVERSATION HISTORY\n";
    content += "=".repeat(60) + "\n";

    return content;
  }

  /**
   * Ekspor histori ke format Markdown
   * @param {boolean} currentSessionOnly - Hanya sesi saat ini atau semua
   */
  exportToMarkdown(currentSessionOnly = true) {
    const messages = currentSessionOnly
      ? this.getCurrentSessionHistory()
      : this.getAllHistory();

    if (messages.length === 0) {
      return "# Histori Percakapan\n\nTidak ada histori percakapan yang tersedia.";
    }

    let content = "";
    content += "# 💬 Histori Percakapan Interactive Story\n\n";
    content += `**Diekspor pada:** ${new Date().toLocaleString("id-ID")}\n\n`;
    content += `**Total pesan:** ${messages.length}\n\n`;
    if (currentSessionOnly) {
      content += `**Session ID:** \`${this.sessionId}\`\n\n`;
    }
    content += "---\n\n";

    // Kelompokkan pesan berdasarkan tanggal
    const messagesByDate = this.groupMessagesByDate(messages);

    Object.keys(messagesByDate).forEach((date) => {
      content += `## 📅 ${date}\n\n`;

      messagesByDate[date].forEach((msg, index) => {
        const time = msg.timestamp.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        const speakerIcon = msg.speaker === "user" ? "👤" : "🤖";
        const speakerName = msg.speaker === "user" ? "You" : msg.speaker;

        content += `### ${speakerIcon} ${speakerName} - ${time}\n\n`;
        content += `${msg.message}\n\n`;
        content += "---\n\n";
      });
    });

    content += "*Histori percakapan dibuat oleh Interactive Story System*\n";

    return content;
  }

  /**
   * Mengelompokkan pesan berdasarkan tanggal
   */
  groupMessagesByDate(messages) {
    const groups = {};

    messages.forEach((msg) => {
      const dateKey = msg.timestamp.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });

    return groups;
  }

  /**
   * Download file dengan content yang diberikan
   * @param {string} content - Konten file
   * @param {string} filename - Nama file
   * @param {string} mimeType - Tipe MIME file
   */
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`📥 File ${filename} berhasil diunduh`);
  }

  /**
   * Generate nama file berdasarkan timestamp
   */
  generateFilename(extension, currentSessionOnly = true) {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "-"); // HH-MM-SS
    const sessionSuffix = currentSessionOnly ? "_session" : "_all";

    return `chat_history_${dateStr}_${timeStr}${sessionSuffix}.${extension}`;
  }

  /**
   * Ekspor dan unduh histori sebagai plain text
   */
  exportAndDownloadPlainText(currentSessionOnly = true) {
    const content = this.exportToPlainText(currentSessionOnly);
    const filename = this.generateFilename("txt", currentSessionOnly);
    this.downloadFile(content, filename, "text/plain;charset=utf-8");
  }

  /**
   * Ekspor dan unduh histori sebagai Markdown
   */
  exportAndDownloadMarkdown(currentSessionOnly = true) {
    const content = this.exportToMarkdown(currentSessionOnly);
    const filename = this.generateFilename("md", currentSessionOnly);
    this.downloadFile(content, filename, "text/markdown;charset=utf-8");
  }

  /**
   * Ekspor histori ke PDF
   * Menggunakan jsPDF library untuk generate PDF
   * @param {boolean} currentSessionOnly - Hanya sesi saat ini atau semua
   */
  async exportToPDF(currentSessionOnly = true) {
    // Pastikan jsPDF sudah dimuat
    if (typeof window.jsPDF === "undefined") {
      console.error("❌ jsPDF library belum dimuat");
      alert("Library PDF belum dimuat. Silakan refresh halaman dan coba lagi.");
      return;
    }

    const messages = currentSessionOnly
      ? this.getCurrentSessionHistory()
      : this.getAllHistory();

    if (messages.length === 0) {
      alert("Tidak ada histori percakapan yang tersedia untuk diekspor.");
      return;
    }

    try {
      const { jsPDF } = window;
      const doc = new jsPDF();

      // Setup font dan margin
      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const maxWidth = pageWidth - margin * 2;
      let yPosition = margin;

      // Header
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Histori Percakapan Interactive Story", margin, yPosition);
      yPosition += 15;

      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      doc.text(
        `Diekspor pada: ${new Date().toLocaleString("id-ID")}`,
        margin,
        yPosition
      );
      yPosition += 8;
      doc.text(`Total pesan: ${messages.length}`, margin, yPosition);
      yPosition += 8;

      if (currentSessionOnly) {
        doc.text(`Session ID: ${this.sessionId}`, margin, yPosition);
        yPosition += 8;
      }

      // Garis pemisah
      yPosition += 5;
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 15;

      // Konten pesan
      messages.forEach((msg, index) => {
        // Cek apakah perlu halaman baru
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = margin;
        }

        const timestamp = msg.timestamp.toLocaleString("id-ID", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        // Header pesan
        doc.setFontSize(9);
        doc.setFont(undefined, "bold");
        const speakerIcon = msg.speaker === "user" ? "[USER]" : "[BOT]";
        const headerText = `${speakerIcon} ${msg.speaker} - ${timestamp}`;
        doc.text(headerText, margin, yPosition);
        yPosition += 10;

        // Konten pesan
        doc.setFont(undefined, "normal");
        const splitMessage = doc.splitTextToSize(msg.message, maxWidth);
        doc.text(splitMessage, margin, yPosition);
        yPosition += splitMessage.length * 5 + 10;

        // Garis pemisah antar pesan
        if (index < messages.length - 1) {
          doc.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 10;
        }
      });

      // Footer
      const filename = this.generateFilename("pdf", currentSessionOnly);
      doc.save(filename);

      console.log(`📄 PDF ${filename} berhasil diunduh`);
    } catch (error) {
      console.error("❌ Error mengekspor PDF:", error);
      alert("Terjadi kesalahan saat mengekspor PDF. Silakan coba lagi.");
    }
  }

  /**
   * Membuat preview histori yang user-friendly untuk tampilan UI
   * @param {boolean} currentSessionOnly - Hanya sesi saat ini atau semua
   * @param {number} limit - Jumlah pesan terakhir yang ditampilkan
   */
  createUserFriendlyPreview(currentSessionOnly = true, limit = 5) {
    const messages = currentSessionOnly
      ? this.getCurrentSessionHistory()
      : this.getAllHistory();

    if (messages.length === 0) {
      return {
        hasMessages: false,
        totalMessages: 0,
        previewMessages: [],
        remainingCount: 0,
      };
    }

    // Ambil pesan terakhir sesuai limit
    const lastMessages = messages.slice(-limit);

    const previewMessages = lastMessages.map((msg) => {
      const timestamp = msg.timestamp.toLocaleString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
      });

      // Bersihkan message dari HTML/markdown tags untuk preview
      const cleanMessage = window.Utils.cleanText(msg.message);

      // Truncate message jika terlalu panjang
      const truncatedMessage =
        cleanMessage.length > 100
          ? cleanMessage.substring(0, 100) + "..."
          : cleanMessage;

      return {
        id: msg.id,
        speaker: msg.speaker,
        speakerIcon: msg.speaker === "user" ? "👤" : "🤖",
        speakerDisplayName: msg.speaker === "user" ? "You" : msg.speaker,
        message: truncatedMessage,
        fullMessage: cleanMessage,
        timestamp: timestamp,
        rawTimestamp: msg.timestamp,
      };
    });

    return {
      hasMessages: true,
      totalMessages: messages.length,
      previewMessages,
      remainingCount: Math.max(0, messages.length - limit),
      sessionId: this.sessionId,
    };
  }

  

  /**
   * Mendapatkan statistik histori
   */
  getHistoryStats(currentSessionOnly = true) {
    const messages = currentSessionOnly
      ? this.getCurrentSessionHistory()
      : this.getAllHistory();

    if (messages.length === 0) {
      return {
        totalMessages: 0,
        userMessages: 0,
        botMessages: 0,
        firstMessage: null,
        lastMessage: null,
        duration: 0,
      };
    }

    const userMessages = messages.filter(
      (msg) => msg.speaker === "user"
    ).length;
    const botMessages = messages.length - userMessages;
    const firstMessage = messages[0].timestamp;
    const lastMessage = messages[messages.length - 1].timestamp;
    const duration = lastMessage - firstMessage;

    return {
      totalMessages: messages.length,
      userMessages,
      botMessages,
      firstMessage,
      lastMessage,
      duration,
    };
  }
}

// Inisialisasi global instance
try {
  window.ChatHistoryManager = new ChatHistoryManager();
  console.log("📚 ChatHistoryManager initialized successfully");
} catch (error) {
  console.error("❌ Error initializing ChatHistoryManager:", error);
  console.error("Stack trace:", error.stack);
}

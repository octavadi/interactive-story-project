/**
 * Bot Configuration Component
 * Form untuk mengatur personalisasi chatbot
 */

class BotConfigComponent extends HTMLElement {
  constructor() {
    super();
    this.configManager = window.ConfigManager;
    this.isVisible = false;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.loadCurrentConfig();
  }

  render() {
    this.innerHTML = `
      <style>
        .config-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          z-index: 1000;
          display: none;
          align-items: center;
          justify-content: center;
        }

        .config-overlay.visible {
          display: flex;
        }

        .config-modal {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .config-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .config-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #f0f0f0;
          color: #333;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #333;
          font-size: 0.9rem;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .form-textarea {
          min-height: 80px;
          resize: vertical;
          font-family: inherit;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 2px solid #f0f0f0;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #4f46e5;
          color: white;
        }

        .btn-primary:hover {
          background: #4338ca;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        .preview-section {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border: 2px solid #e2e8f0;
        }

        .preview-title {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #334155;
        }

        .preview-content {
          font-size: 0.9rem;
          color: #64748b;
        }

        .bot-avatar-preview {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          padding: 0.5rem;
          border-radius: 6px;
          border: 1px solid #d1d5db;
        }

        .validation-message {
          margin-top: 0.5rem;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
        }

        .validation-error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .validation-warning {
          background: #fffbeb;
          color: #d97706;
          border: 1px solid #fed7aa;
        }

        .validation-success {
          background: #f0fdf4;
          color: #059669;
          border: 1px solid #bbf7d0;
        }

        .export-import-section {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 2px solid #f0f0f0;
        }

        .export-import-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .file-input {
          display: none;
        }

        @media (max-width: 640px) {
          .config-modal {
            margin: 1rem;
            padding: 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .export-import-actions {
            flex-direction: column;
          }
        }
      </style>

      <div class="config-overlay" id="configOverlay">
        <div class="config-modal">
          <div class="config-header">
            <h2 class="config-title">⚙️ Pengaturan Chatbot</h2>
            <button class="close-btn" id="closeBtn">×</button>
          </div>

          <form id="configForm">
            <!-- Preview Section -->
            <div class="preview-section">
              <div class="preview-title">👁️ Preview</div>
              <div class="preview-content">
                <div class="bot-avatar-preview">
                  <span id="avatarPreview">🤖</span>
                  <strong id="namePreview">Arya</strong>
                  <span id="typingPreview">sedang mengetik...</span>
                </div>
                <div style="margin-top: 0.5rem;">
                  <em id="descriptionPreview">AI Assistant yang siap membantu Anda</em>
                </div>
              </div>
            </div>

            <!-- Basic Settings -->
            <div class="form-group">
              <label class="form-label" for="botName">🏷️ Nama Chatbot</label>
              <input 
                type="text" 
                id="botName" 
                class="form-input" 
                placeholder="Masukkan nama chatbot (contoh: Arya, Maya, Alex)"
                maxlength="50"
                required
              >
              <div id="nameValidation" class="validation-message" style="display: none;"></div>
            </div>

            <div class="form-group">
              <label class="form-label" for="botDescription">📝 Deskripsi Chatbot</label>
              <textarea 
                id="botDescription" 
                class="form-input form-textarea" 
                placeholder="Jelaskan kepribadian dan fungsi chatbot Anda..."
                maxlength="200"
              ></textarea>
              <div id="descriptionValidation" class="validation-message" style="display: none;"></div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="botAvatar">😀 Avatar Bot</label>
                <input 
                  type="text" 
                  id="botAvatar" 
                  class="form-input" 
                  placeholder="🤖"
                  maxlength="2"
                >
              </div>

              <div class="form-group">
                <label class="form-label" for="userAvatar">👤 Avatar User</label>
                <input 
                  type="text" 
                  id="userAvatar" 
                  class="form-input" 
                  placeholder="👤"
                  maxlength="2"
                >
              </div>
            </div>

            <!-- UI Settings -->
            <div class="form-group">
              <label class="form-label" for="placeholder">💬 Placeholder Input</label>
              <input 
                type="text" 
                id="placeholder" 
                class="form-input" 
                placeholder="Ketik pesan Anda..."
              >
            </div>

            <div class="form-group">
              <label class="form-label" for="typingMessage">⌨️ Pesan Typing</label>
              <input 
                type="text" 
                id="typingMessage" 
                class="form-input" 
                placeholder="sedang mengetik..."
              >
            </div>

            <!-- Webhook Settings -->
            <div class="form-group">
              <label class="form-label" for="inputWebhook">🔗 Webhook Input URL</label>
              <input 
                type="url" 
                id="inputWebhook" 
                class="form-input" 
                placeholder="http://localhost:5678/webhook/inputWebhook"
              >
              <div id="inputWebhookValidation" class="validation-message" style="display: none;"></div>
            </div>

            <div class="form-group">
              <label class="form-label" for="outputWebhook">📤 Webhook Output URL</label>
              <input 
                type="url" 
                id="outputWebhook" 
                class="form-input" 
                placeholder="http://localhost:5678/webhook/outputWebhook"
              >
              <div id="outputWebhookValidation" class="validation-message" style="display: none;"></div>
            </div>

            <!-- Export/Import Section -->
            <div class="export-import-section">
              <div class="preview-title">📁 Backup & Restore</div>
              <div class="export-import-actions">
                <button type="button" class="btn btn-secondary" id="exportBtn">
                  📥 Export Config
                </button>
                <button type="button" class="btn btn-secondary" id="importBtn">
                  📤 Import Config
                </button>
                <input type="file" id="importFile" class="file-input" accept=".json">
              </div>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="button" class="btn btn-danger" id="resetBtn">
                🔄 Reset Default
              </button>
              <button type="button" class="btn btn-secondary" id="cancelBtn">
                ❌ Batal
              </button>
              <button type="submit" class="btn btn-primary" id="saveBtn">
                💾 Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const overlay = this.querySelector("#configOverlay");
    const closeBtn = this.querySelector("#closeBtn");
    const cancelBtn = this.querySelector("#cancelBtn");
    const saveBtn = this.querySelector("#saveBtn");
    const resetBtn = this.querySelector("#resetBtn");
    const form = this.querySelector("#configForm");
    const exportBtn = this.querySelector("#exportBtn");
    const importBtn = this.querySelector("#importBtn");
    const importFile = this.querySelector("#importFile");

    // Close handlers
    closeBtn.addEventListener("click", () => this.hide());
    cancelBtn.addEventListener("click", () => this.hide());
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) this.hide();
    });

    // Form submission
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveConfig();
    });

    // Reset handler
    resetBtn.addEventListener("click", () => {
      if (confirm("Apakah Anda yakin ingin mereset ke pengaturan default?")) {
        this.resetToDefault();
      }
    });

    // Export/Import handlers
    exportBtn.addEventListener("click", () => this.exportConfig());
    importBtn.addEventListener("click", () => importFile.click());
    importFile.addEventListener("change", (e) => this.importConfig(e));

    // Real-time preview updates
    const inputs = this.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.addEventListener("input", () => this.updatePreview());
    });

    // Validation on blur
    this.querySelector("#botName").addEventListener("blur", () =>
      this.validateName()
    );
    this.querySelector("#botDescription").addEventListener("blur", () =>
      this.validateDescription()
    );
    this.querySelector("#inputWebhook").addEventListener("blur", () =>
      this.validateInputWebhook()
    );
    this.querySelector("#outputWebhook").addEventListener("blur", () =>
      this.validateOutputWebhook()
    );

    // Escape key to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isVisible) {
        this.hide();
      }
    });
  }

  show() {
    this.isVisible = true;
    this.querySelector("#configOverlay").classList.add("visible");
    this.loadCurrentConfig();
    this.updatePreview();

    // Focus pada input pertama
    setTimeout(() => {
      this.querySelector("#botName").focus();
    }, 100);
  }

  hide() {
    this.isVisible = false;
    this.querySelector("#configOverlay").classList.remove("visible");
  }

  loadCurrentConfig() {
    const config = this.configManager.getConfig();

    this.querySelector("#botName").value = config.botName;
    this.querySelector("#botDescription").value = config.botDescription;
    this.querySelector("#botAvatar").value = config.botAvatar;
    this.querySelector("#userAvatar").value = config.userAvatar;
    this.querySelector("#placeholder").value = config.ui.placeholder;
    this.querySelector("#typingMessage").value = config.typing.message;
    this.querySelector("#inputWebhook").value = config.webhook.inputUrl;
    this.querySelector("#outputWebhook").value = config.webhook.outputUrl;
  }

  updatePreview() {
    const botName = this.querySelector("#botName").value || "Bot";
    const botDescription =
      this.querySelector("#botDescription").value || "AI Assistant";
    const botAvatar = this.querySelector("#botAvatar").value || "🤖";
    const typingMessage =
      this.querySelector("#typingMessage").value || "sedang mengetik...";

    this.querySelector("#namePreview").textContent = botName;
    this.querySelector("#descriptionPreview").textContent = botDescription;
    this.querySelector("#avatarPreview").textContent = botAvatar;
    this.querySelector("#typingPreview").textContent = typingMessage;
  }

  validateName() {
    const nameInput = this.querySelector("#botName");
    const validation = this.querySelector("#nameValidation");
    const name = nameInput.value.trim();

    if (!name) {
      this.showValidation(validation, "Nama bot tidak boleh kosong", "error");
      return false;
    }

    if (name.length > 50) {
      this.showValidation(
        validation,
        "Nama bot tidak boleh lebih dari 50 karakter",
        "error"
      );
      return false;
    }

    if (name.length > 20) {
      this.showValidation(
        validation,
        "Nama bot sebaiknya tidak terlalu panjang",
        "warning"
      );
      return true;
    }

    this.hideValidation(validation);
    return true;
  }

  validateDescription() {
    const descInput = this.querySelector("#botDescription");
    const validation = this.querySelector("#descriptionValidation");
    const description = descInput.value.trim();

    if (description.length > 200) {
      this.showValidation(
        validation,
        "Deskripsi tidak boleh lebih dari 200 karakter",
        "error"
      );
      return false;
    }

    this.hideValidation(validation);
    return true;
  }

  validateInputWebhook() {
    const input = this.querySelector("#inputWebhook");
    const validation = this.querySelector("#inputWebhookValidation");
    return this.validateWebhookUrl(input.value, validation);
  }

  validateOutputWebhook() {
    const input = this.querySelector("#outputWebhook");
    const validation = this.querySelector("#outputWebhookValidation");
    return this.validateWebhookUrl(input.value, validation);
  }

  validateWebhookUrl(url, validationElement) {
    if (!url.trim()) {
      this.hideValidation(validationElement);
      return true;
    }

    if (!this.configManager.isValidUrl(url)) {
      this.showValidation(validationElement, "URL tidak valid", "error");
      return false;
    }

    this.showValidation(validationElement, "URL valid", "success");
    return true;
  }

  showValidation(element, message, type) {
    element.textContent = message;
    element.className = `validation-message validation-${type}`;
    element.style.display = "block";
  }

  hideValidation(element) {
    element.style.display = "none";
  }

  saveConfig() {
    // Validate all fields
    const isNameValid = this.validateName();
    const isDescValid = this.validateDescription();
    const isInputWebhookValid = this.validateInputWebhook();
    const isOutputWebhookValid = this.validateOutputWebhook();

    if (
      !isNameValid ||
      !isDescValid ||
      !isInputWebhookValid ||
      !isOutputWebhookValid
    ) {
      alert("Mohon perbaiki error validasi terlebih dahulu");
      return;
    }

    const newConfig = {
      botName: this.querySelector("#botName").value.trim(),
      botDescription: this.querySelector("#botDescription").value.trim(),
      botAvatar: this.querySelector("#botAvatar").value.trim() || "🤖",
      userAvatar: this.querySelector("#userAvatar").value.trim() || "👤",
      ui: {
        placeholder:
          this.querySelector("#placeholder").value.trim() ||
          "Ketik pesan Anda...",
        title: `Chat ${this.querySelector("#botName").value.trim()}`,
      },
      typing: {
        message:
          this.querySelector("#typingMessage").value.trim() ||
          "sedang mengetik...",
      },
      webhook: {
        inputUrl: this.querySelector("#inputWebhook").value.trim(),
        outputUrl: this.querySelector("#outputWebhook").value.trim(),
      },
    };

    if (this.configManager.saveConfig(newConfig)) {
      alert("✅ Konfigurasi berhasil disimpan!");
      this.hide();
    } else {
      alert("❌ Gagal menyimpan konfigurasi");
    }
  }

  resetToDefault() {
    this.configManager.resetConfig();
    this.loadCurrentConfig();
    this.updatePreview();
    alert("✅ Pengaturan telah direset ke default");
  }

  exportConfig() {
    const config = this.configManager.exportConfig();
    const blob = new Blob([config], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `chatbot-config-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  importConfig(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target.result);
        if (this.configManager.saveConfig(config)) {
          this.loadCurrentConfig();
          this.updatePreview();
          alert("✅ Konfigurasi berhasil diimport!");
        } else {
          alert("❌ Gagal mengimport konfigurasi");
        }
      } catch (error) {
        alert("❌ File konfigurasi tidak valid");
      }
    };
    reader.readAsText(file);

    // Reset input
    event.target.value = "";
  }
}

// Register component
customElements.define("bot-config", BotConfigComponent);

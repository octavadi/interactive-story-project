class BotActions extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .actions-container {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          display: flex;
          gap: 0.5rem;
          z-index: 10;
        }
        .action-btn {
          width: 28px;
          height: 28px;
          background: rgba(102, 126, 234, 0.2);
          border: 1px solid rgba(102, 126, 234, 0.3);
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.2s ease;
          padding: 0;
        }
        .action-btn:hover {
          background: rgba(102, 126, 234, 0.4);
          color: rgba(255, 255, 255, 1);
          transform: scale(1.05);
        }
      </style>
      <div class="actions-container">
        <button class="action-btn" id="clearBtn" title="Bersihkan riwayat chat" aria-label="Bersihkan riwayat chat">
          <span aria-hidden="true">🗑️</span>
        </button>
        <button class="action-btn" id="closeBtn" title="Tutup panel chat" aria-label="Tutup panel chat">
          <span aria-hidden="true">✕</span>
        </button>
      </div>
    `;
  }

  attachEventListeners() {
    const clearBtn = this.shadowRoot.querySelector('#clearBtn');
    const closeBtn = this.shadowRoot.querySelector('#closeBtn');

    clearBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('clear-chat-requested', {
        bubbles: true,
        composed: true
      }));
    });

    closeBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('close-chat-requested', {
        bubbles: true,
        composed: true
      }));
    });
  }
}

customElements.define('bot-actions', BotActions);
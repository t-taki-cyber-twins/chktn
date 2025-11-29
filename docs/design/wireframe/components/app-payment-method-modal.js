class AppPaymentMethodModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        @import "css/common.css";
        
        /* Modal Styles */
        .modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2000;
          justify-content: center;
          align-items: center;
        }

        .modal.active {
          display: flex;
        }

        .modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
        }

        .modal-content {
          position: relative;
          background-color: #fff;
          width: 600px;
          max-width: 90%;
          max-height: 90vh;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .modal-header {
          padding: 16px 24px;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin: 0;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          color: #666;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }

        .modal-body {
          padding: 24px;
          overflow-y: auto;
        }

        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid #e0e0e0;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        /* Payment Method Styles */
        .payment-options {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .payment-option {
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .payment-option:hover {
          background-color: #f9f9f9;
        }

        .payment-option.selected {
          border-color: #0066cc;
          background-color: #f0f7ff;
        }

        .option-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .option-radio {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .option-title {
          font-weight: 600;
          font-size: 16px;
          color: #333;
        }

        .option-icons {
          display: flex;
          gap: 8px;
          margin-left: auto;
          color: #666;
          font-size: 20px;
        }

        .option-content {
          margin-left: 30px;
          display: none;
          margin-top: 12px;
        }

        .payment-option.selected .option-content {
          display: block;
        }

        /* Form Styles */
        .form-group {
          margin-bottom: 16px;
        }

        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #555;
          margin-bottom: 6px;
        }

        .form-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          box-sizing: border-box;
        }
        
        .form-row {
          display: flex;
          gap: 16px;
        }
        
        .form-col {
          flex: 1;
        }

        .helper-text {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }
      </style>

      <div class="modal" id="modal">
        <div class="modal-overlay" id="overlay"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">お支払い情報変更</h2>
            <button class="modal-close" id="close-btn">×</button>
          </div>
          <div class="modal-body">
            
            <div class="payment-options">
              <!-- Credit Card Option -->
              <div class="payment-option selected" id="option-credit">
                <div class="option-header">
                  <input type="radio" name="payment-method" class="option-radio" checked>
                  <span class="option-title">クレジットカード</span>
                  <div class="option-icons">
                    <span>💳</span>
                    <span style="font-size: 12px; display: flex; align-items: center;">VISA / Master / JCB / Amex</span>
                  </div>
                </div>
                <div class="option-content">
                  <div class="form-group">
                    <label class="form-label">カード番号</label>
                    <input type="text" class="form-input" placeholder="0000 0000 0000 0000">
                  </div>
                  <div class="form-row">
                    <div class="form-col">
                      <div class="form-group">
                        <label class="form-label">有効期限</label>
                        <input type="text" class="form-input" placeholder="MM/YY">
                      </div>
                    </div>
                    <div class="form-col">
                      <div class="form-group">
                        <label class="form-label">CVC</label>
                        <input type="text" class="form-input" placeholder="123">
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">カード名義人</label>
                    <input type="text" class="form-input" placeholder="TARO YAMADA">
                  </div>
                </div>
              </div>

              <!-- Bank Transfer Option -->
              <div class="payment-option" id="option-bank">
                <div class="option-header">
                  <input type="radio" name="payment-method" class="option-radio">
                  <span class="option-title">銀行振込（請求書払い）</span>
                  <div class="option-icons">
                    <span>🏦</span>
                  </div>
                </div>
                <div class="option-content">
                  <p class="helper-text">
                    月末締め翌月末払いとなります。<br>
                    請求書は毎月第2営業日までにメールにて送付いたします。
                  </p>
                  <div class="form-group" style="margin-top: 12px;">
                    <label class="form-label">請求書送付先メールアドレス</label>
                    <input type="email" class="form-input" placeholder="billing@example.com">
                  </div>
                  <div class="form-group">
                    <label class="form-label">部署名・担当者名</label>
                    <input type="text" class="form-input" placeholder="経理部 担当者">
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="cancel-btn">キャンセル</button>
            <button class="btn btn-primary" id="save-btn">変更を保存</button>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const modal = this.shadowRoot.getElementById('modal');
    const overlay = this.shadowRoot.getElementById('overlay');
    const closeBtn = this.shadowRoot.getElementById('close-btn');
    const cancelBtn = this.shadowRoot.getElementById('cancel-btn');
    const saveBtn = this.shadowRoot.getElementById('save-btn');
    const options = this.shadowRoot.querySelectorAll('.payment-option');

    const close = () => {
      modal.classList.remove('active');
    };

    overlay.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    cancelBtn.addEventListener('click', close);

    saveBtn.addEventListener('click', () => {
      alert('お支払い情報を変更しました（モック）');
      close();
    });

    options.forEach(option => {
      option.addEventListener('click', (e) => {
        // Don't trigger if clicking inside inputs
        if (e.target.tagName === 'INPUT' && e.target.type !== 'radio') return;

        // Update UI
        options.forEach(o => {
          o.classList.remove('selected');
          o.querySelector('input[type="radio"]').checked = false;
        });
        option.classList.add('selected');
        option.querySelector('input[type="radio"]').checked = true;
      });
    });
  }

  open() {
    this.shadowRoot.getElementById('modal').classList.add('active');
  }
}

customElements.define('app-payment-method-modal', AppPaymentMethodModal);

class AppTenantEditModal extends HTMLElement {
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
        
        .plan-info {
          background-color: #f9f9f9;
          padding: 16px;
          border-radius: 4px;
          margin-bottom: 24px;
        }
        
        .plan-name {
          font-size: 18px;
          font-weight: 600;
          color: #0066cc;
          margin-bottom: 8px;
        }
        
        .plan-price {
          font-size: 14px;
          color: #666;
        }
        
        .payment-info {
          margin-bottom: 24px;
        }
        
        .payment-method {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-weight: 500;
        }
        
        .billing-history {
          border-top: 1px solid #e0e0e0;
          padding-top: 16px;
        }
        
        .billing-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
          font-size: 14px;
        }
        
        .billing-date {
          color: #666;
          width: 100px;
        }
        
        .billing-amount {
          font-weight: 500;
          width: 100px;
        }

        .billing-actions {
          display: flex;
          gap: 8px;
        }

        .btn-icon {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          font-size: 12px;
        }
      </style>

      <div class="modal" id="modal">
        <div class="modal-overlay" id="overlay"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">テナント情報編集</h2>
            <button class="modal-close" id="close-btn">×</button>
          </div>
          <div class="modal-body">
            <div class="section-header">
              <h3 class="section-title" style="font-size: 16px;">プラン情報</h3>
            </div>
            <div class="plan-info">
              <div class="plan-name">ダブルプラン</div>
              <div class="plan-price">月額 50,000円（税抜）</div>
              <div class="mt-2">
                <button class="btn btn-secondary btn-sm" id="change-plan-btn">プラン変更</button>
              </div>
            </div>

            <div class="section-header">
              <h3 class="section-title" style="font-size: 16px;">お支払い情報</h3>
            </div>
            <div class="payment-info">
              <div class="payment-method">
                <span>💳</span>
                <span>クレジットカード (****-****-****-1234)</span>
              </div>
              <button class="btn btn-secondary btn-sm" id="change-payment-btn">お支払い情報変更</button>
            </div>

            <div class="section-header">
              <h3 class="section-title" style="font-size: 16px;">請求履歴（直近3ヶ月）</h3>
            </div>
            <div class="billing-history">
              <div class="billing-item">
                <span class="billing-date">2023/10/31</span>
                <span class="billing-amount">¥55,000</span>
                <div class="billing-actions">
                  <button class="btn btn-outline-secondary btn-icon">
                    📄 請求書
                  </button>
                  <button class="btn btn-outline-secondary btn-icon">
                    🧾 領収書
                  </button>
                </div>
              </div>
              <div class="billing-item">
                <span class="billing-date">2023/09/30</span>
                <span class="billing-amount">¥55,000</span>
                <div class="billing-actions">
                  <button class="btn btn-outline-secondary btn-icon">
                    📄 請求書
                  </button>
                  <button class="btn btn-outline-secondary btn-icon">
                    🧾 領収書
                  </button>
                </div>
              </div>
              <div class="billing-item">
                <span class="billing-date">2023/08/31</span>
                <span class="billing-amount">¥55,000</span>
                <div class="billing-actions">
                  <button class="btn btn-outline-secondary btn-icon">
                    📄 請求書
                  </button>
                  <button class="btn btn-outline-secondary btn-icon">
                    🧾 領収書
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="cancel-btn">閉じる</button>
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
    const changePlanBtn = this.shadowRoot.getElementById('change-plan-btn');
    const changePaymentBtn = this.shadowRoot.getElementById('change-payment-btn');

    const close = () => {
      modal.classList.remove('active');
    };

    overlay.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    cancelBtn.addEventListener('click', close);

    changePlanBtn.addEventListener('click', () => {
      const planModal = document.getElementById('plan-selection-modal');
      if (planModal) planModal.open();
    });

    changePaymentBtn.addEventListener('click', () => {
      const paymentModal = document.getElementById('payment-method-modal');
      if (paymentModal) paymentModal.open();
    });
  }

  open() {
    this.shadowRoot.getElementById('modal').classList.add('active');
  }

  setAdminMode(isAdmin) {
    const changePlanBtn = this.shadowRoot.getElementById('change-plan-btn');
    const changePaymentBtn = this.shadowRoot.getElementById('change-payment-btn');
    
    if (isAdmin) {
      changePlanBtn.style.display = 'none';
      changePaymentBtn.style.display = 'none';
    } else {
      changePlanBtn.style.display = 'inline-block';
      changePaymentBtn.style.display = 'inline-block';
    }
  }
}

customElements.define('app-tenant-edit-modal', AppTenantEditModal);

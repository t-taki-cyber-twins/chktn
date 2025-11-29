class AppPlanSelectionModal extends HTMLElement {
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
          width: 800px;
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

        /* Plan Selection Styles */
        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 2px solid #0066cc;
          display: inline-block;
        }

        .plan-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .plan-card {
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .plan-card:hover {
          border-color: #99c2ff;
          background-color: #f0f7ff;
        }

        .plan-card.selected {
          border-color: #0066cc;
          background-color: #e6f2ff;
        }

        .plan-card.selected::after {
          content: '✓';
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: #0066cc;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .plan-name {
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 8px;
          color: #333;
        }

        .plan-price {
          font-size: 18px;
          font-weight: 700;
          color: #0066cc;
          margin-bottom: 12px;
        }

        .plan-desc {
          font-size: 13px;
          color: #666;
          line-height: 1.4;
        }

        .api-limit-input {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #ddd;
          display: none;
        }

        .plan-card.selected .api-limit-input {
          display: block;
        }

        .api-limit-input label {
          display: block;
          font-size: 12px;
          margin-bottom: 4px;
          color: #555;
        }

        .api-limit-input input {
          width: 100%;
          padding: 6px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 13px;
        }

        .addon-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .addon-item {
          display: flex;
          align-items: center;
          padding: 12px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
        }

        .addon-checkbox {
          margin-right: 12px;
          width: 18px;
          height: 18px;
        }

        .addon-info {
          flex: 1;
        }

        .addon-name {
          font-weight: 600;
          font-size: 14px;
          color: #333;
        }

        .addon-price {
          font-size: 14px;
          color: #666;
          margin-left: 8px;
        }
      </style>

      <div class="modal" id="modal">
        <div class="modal-overlay" id="overlay"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">プラン変更</h2>
            <button class="modal-close" id="close-btn">×</button>
          </div>
          <div class="modal-body">
            
            <div>
              <h3 class="section-title">基本プラン選択</h3>
              <div class="plan-options">
                <div class="plan-card selected" data-plan="engineer">
                  <div class="plan-name">エンジニア提供プラン</div>
                  <div class="plan-price">¥30,000<span style="font-size:12px; font-weight:normal; color:#666;">/月</span></div>
                  <div class="plan-desc">エンジニア情報の登録・公開が可能なプランです。案件への応募が可能です。</div>
                </div>
                
                <div class="plan-card" data-plan="project">
                  <div class="plan-name">案件提供プラン</div>
                  <div class="plan-price">¥30,000<span style="font-size:12px; font-weight:normal; color:#666;">/月</span></div>
                  <div class="plan-desc">案件情報の登録・公開が可能なプランです。エンジニアへのスカウトが可能です。</div>
                </div>

                <div class="plan-card" data-plan="double">
                  <div class="plan-name">ダブルプラン</div>
                  <div class="plan-price">¥50,000<span style="font-size:12px; font-weight:normal; color:#666;">/月</span></div>
                  <div class="plan-desc">エンジニア提供と案件提供の両方が利用可能な、お得なセットプランです。</div>
                </div>

                <div class="plan-card" data-plan="api">
                  <div class="plan-name">API従量課金プラン</div>
                  <div class="plan-price">従量制</div>
                  <div class="plan-desc">API利用量に応じた課金プランです。自社のシステムとの連携に最適です。詳しくはお問い合わせください。</div>
                  <div class="api-limit-input" id="api-limit-container">
                    <label>月額上限設定 (円)</label>
                    <input type="number" placeholder="例: 100000" step="10000">
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 class="section-title">アドオン選択</h3>
              <div class="addon-list">
                <label class="addon-item">
                  <input type="checkbox" class="addon-checkbox" name="addon" value="ai-matching">
                  <div class="addon-info">
                    <span class="addon-name">AIマッチングプラス</span>
                    <span class="addon-price">+ ¥10,000/月</span>
                  </div>
                </label>
                
                <label class="addon-item">
                  <input type="checkbox" class="addon-checkbox" name="addon" value="attendance">
                  <div class="addon-info">
                    <span class="addon-name">社員勤怠管理機能</span>
                    <span class="addon-price">+ ¥10,000/月</span>
                  </div>
                </label>

                <label class="addon-item">
                  <input type="checkbox" class="addon-checkbox" name="addon" value="invoice">
                  <div class="addon-info">
                    <span class="addon-name">請求書・発注書自動機能</span>
                    <span class="addon-price">+ ¥5,000/月</span>
                  </div>
                </label>
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
    const planCards = this.shadowRoot.querySelectorAll('.plan-card');

    const close = () => {
      modal.classList.remove('active');
    };

    overlay.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    cancelBtn.addEventListener('click', close);

    saveBtn.addEventListener('click', () => {
      // Here you would typically gather the data and emit an event or call an API
      alert('プラン変更を保存しました（モック）');
      close();
    });

    planCards.forEach(card => {
      card.addEventListener('click', (e) => {
        // Prevent triggering when clicking inside the input
        if (e.target.tagName === 'INPUT') return;

        // Remove selected class from all cards
        planCards.forEach(c => c.classList.remove('selected'));
        // Add selected class to clicked card
        card.classList.add('selected');
      });
    });
  }

  open() {
    this.shadowRoot.getElementById('modal').classList.add('active');
  }
}

customElements.define('app-plan-selection-modal', AppPlanSelectionModal);

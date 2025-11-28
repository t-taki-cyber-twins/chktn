class AppCompanyEditModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.searchModal = null;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setSearchModal(modalElement) {
    this.searchModal = modalElement;
    // 検索モーダルからのイベントをリッスン
    this.searchModal.addEventListener('company-selected', (e) => {
      this.fillForm(e.detail);
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        @import "css/common.css";
      </style>

      <div class="modal" id="modal">
        <div class="modal-overlay" id="overlay"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">会社情報編集</h2>
            <button class="modal-close" id="close-btn">×</button>
          </div>
          <div class="modal-body">
            <!-- 法人検索ボタンを一番上に目立つように配置 -->
            <div class="form-grid">
              <div class="form-group form-group-full">
                <button class="btn btn-primary" id="search-btn" style="width: 100%; padding: 12px; font-size: 16px; font-weight: bold;">🔍 法人検索</button>
                <div class="form-help-text">法人検索ボタンをクリックして、法人情報を検索・選択してください。</div>
              </div>

              <div class="form-group form-group-full">
                <label class="form-label">法人番号 <span class="form-required">*</span></label>
                <input type="text" class="form-input" id="corporate-number" placeholder="13桁の法人番号" readonly>
                <div class="form-help-text">法人検索から自動入力されます(編集不可)</div>
              </div>

              <div class="form-group form-group-full">
                <label class="form-label">会社名 <span class="form-required">*</span></label>
                <input type="text" class="form-input" id="company-name" readonly>
                <div class="form-help-text">法人検索から自動入力されます(編集不可)</div>
              </div>

              <div class="form-group form-group-full">
                <label class="form-label">会社名(カナ)</label>
                <input type="text" class="form-input" id="company-kana" readonly>
              </div>

              <div class="form-group">
                <label class="form-label">郵便番号</label>
                <input type="text" class="form-input" id="postal-code" placeholder="123-4567" readonly>
              </div>

              <div class="form-group">
                <label class="form-label">都道府県</label>
                <input type="text" class="form-input" id="prefecture" readonly>
              </div>

              <div class="form-group">
                <label class="form-label">市区町村</label>
                <input type="text" class="form-input" id="city" readonly>
              </div>

              <div class="form-group">
                <label class="form-label">番地</label>
                <input type="text" class="form-input" id="street" readonly>
              </div>

              <div class="form-group form-group-full">
                <label class="form-label">建物名</label>
                <input type="text" class="form-input" id="building" readonly>
              </div>

              <!-- メモテキストエリアを追加(自由入力) -->
              <div class="form-group form-group-full">
                <label class="form-label">メモ</label>
                <textarea class="form-textarea" id="memo" rows="4" placeholder="自由にメモを入力できます"></textarea>
                <div class="form-help-text">会社に関する補足情報を自由に記入してください。</div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-warning" id="cancel-btn">キャンセル</button>
            <button class="btn btn-primary" id="save-btn">保存</button>
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
    const searchBtn = this.shadowRoot.getElementById('search-btn');

    const close = () => {
      modal.classList.remove('active');
    };

    overlay.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    cancelBtn.addEventListener('click', close);

    saveBtn.addEventListener('click', () => {
      // 保存処理（モック）
      alert('保存しました');
      close();
    });

    searchBtn.addEventListener('click', () => {
      if (this.searchModal) {
        this.searchModal.open();
      } else {
        console.warn('Search modal is not set.');
      }
    });
  }

  fillForm(data) {
    const shadow = this.shadowRoot;
    shadow.getElementById('corporate-number').value = data.number || '';
    shadow.getElementById('company-name').value = data.name || '';
    shadow.getElementById('company-kana').value = data.kana || '';
    shadow.getElementById('postal-code').value = data.postalCode || '';
    shadow.getElementById('prefecture').value = data.prefecture || '';
    shadow.getElementById('city').value = data.city || '';
    shadow.getElementById('street').value = data.street || '';
    shadow.getElementById('building').value = data.building || '';
  }

  open() {
    this.shadowRoot.getElementById('modal').classList.add('active');
  }
}

customElements.define('app-company-edit-modal', AppCompanyEditModal);

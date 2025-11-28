class AppOfficialCompanySearchModal extends HTMLElement {
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
        
        .search-tabs {
          display: flex;
          border-bottom: 1px solid #e0e0e0;
          margin-bottom: 20px;
        }
        
        .search-tab {
          padding: 12px 24px;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          font-weight: 500;
          color: #666;
        }
        
        .search-tab.active {
          color: #0066cc;
          border-bottom-color: #0066cc;
        }
        
        .search-panel {
          display: none;
        }
        
        .search-panel.active {
          display: block;
        }
        
        .search-result-list {
          margin-top: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .search-result-item {
          padding: 12px 16px;
          border-bottom: 1px solid #e0e0e0;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .search-result-item:last-child {
          border-bottom: none;
        }
        
        .search-result-item:hover {
          background-color: #f5f5f5;
        }
        
        .company-name {
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }
        
        .company-info {
          font-size: 12px;
          color: #666;
        }
      </style>

      <div class="modal" id="modal">
        <div class="modal-overlay" id="overlay"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">法人検索</h2>
            <button class="modal-close" id="close-btn">×</button>
          </div>
          <div class="modal-body">
            <div class="search-tabs">
              <div class="search-tab active" data-tab="number">法人番号から検索</div>
              <div class="search-tab" data-tab="name">会社名から検索</div>
            </div>

            <div class="search-panel active" id="panel-number">
              <div class="form-group">
                <label class="form-label">法人番号</label>
                <div class="form-row">
                  <input type="text" class="form-input" placeholder="13桁の法人番号を入力" id="input-number">
                  <button class="btn btn-info" id="search-number-btn">検索</button>
                </div>
              </div>
            </div>

            <div class="search-panel" id="panel-name">
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">都道府県</label>
                  <select class="form-select" id="input-prefecture">
                    <option value="">選択してください</option>
                    <option value="tokyo">東京都</option>
                    <option value="osaka">大阪府</option>
                    <option value="kanagawa">神奈川県</option>
                    <!-- その他省略 -->
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">会社名</label>
                  <input type="text" class="form-input" placeholder="会社名を入力" id="input-name">
                </div>
                <div class="form-group-full">
                  <button class="btn btn-info" style="width: 100%;" id="search-name-btn">検索</button>
                </div>
              </div>
            </div>

            <div class="search-result-list" id="result-list" style="display: none;">
              <!-- 検索結果がここに挿入されます -->
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const modal = this.shadowRoot.getElementById('modal');
    const overlay = this.shadowRoot.getElementById('overlay');
    const closeBtn = this.shadowRoot.getElementById('close-btn');
    const tabs = this.shadowRoot.querySelectorAll('.search-tab');
    const panels = this.shadowRoot.querySelectorAll('.search-panel');
    const searchNumberBtn = this.shadowRoot.getElementById('search-number-btn');
    const searchNameBtn = this.shadowRoot.getElementById('search-name-btn');
    const resultList = this.shadowRoot.getElementById('result-list');

    const close = () => {
      modal.classList.remove('active');
      resultList.style.display = 'none';
      resultList.innerHTML = '';
    };

    overlay.addEventListener('click', close);
    closeBtn.addEventListener('click', close);

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panelId = `panel-${tab.dataset.tab}`;
        this.shadowRoot.getElementById(panelId).classList.add('active');
      });
    });

    const mockResults = [
      {
        number: '1234567890123',
        name: '株式会社WT2Mテクノロジー',
        kana: 'カブシキガイシャシーエイチケーティーエヌテクノロジー',
        postalCode: '150-0002',
        prefecture: '東京都',
        city: '渋谷区',
        street: '渋谷1-1-1',
        building: '渋谷ビル 10F'
      },
      {
        number: '9876543210987',
        name: 'WT2Mソリューションズ株式会社',
        kana: 'シーエイチケーティーエヌソリューションズカブシキガイシャ',
        postalCode: '530-0001',
        prefecture: '大阪府',
        city: '大阪市北区',
        street: '梅田1-1-1',
        building: '梅田タワー 20F'
      }
    ];

    const showResults = () => {
      resultList.innerHTML = '';
      resultList.style.display = 'block';
      
      mockResults.forEach(company => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
          <div class="company-name">${company.name}</div>
          <div class="company-info">法人番号: ${company.number} | 住所: ${company.prefecture}${company.city}${company.street}</div>
        `;
        item.addEventListener('click', () => {
          this.dispatchEvent(new CustomEvent('company-selected', {
            detail: company,
            bubbles: true,
            composed: true
          }));
          close();
        });
        resultList.appendChild(item);
      });
    };

    searchNumberBtn.addEventListener('click', showResults);
    searchNameBtn.addEventListener('click', showResults);
  }

  open() {
    this.shadowRoot.getElementById('modal').classList.add('active');
  }
}

customElements.define('app-official-company-search-modal', AppOfficialCompanySearchModal);

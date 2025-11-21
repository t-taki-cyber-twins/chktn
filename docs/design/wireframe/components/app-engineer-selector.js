/**
 * エンジニア選択モーダルコンポーネント
 * Web Components (Custom Elements) を使用して実装
 * 公開案件詳細画面用（マッチングスコア表示対応）
 */
class AppEngineerSelector extends HTMLElement {
    constructor() {
        super();
        this.selectedEngineerId = null;
        this.selectedEngineerData = null;
        this.initialEngineerId = null; // URLパラメータなどから取得した初期選択エンジニアID
    }

    connectedCallback() {
        this.render();
        this.initEventListeners();
        // URLパラメータから初期選択エンジニアIDを取得
        this.loadInitialEngineer();
    }

    render() {
        this.innerHTML = `
            <div class="modal engineer-selector-modal" id="engineer-selector-modal">
                <div class="modal-overlay"></div>
                <div class="modal-content engineer-selector-modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">エンジニアを選択</h3>
                        <button type="button" class="modal-close" data-modal="engineer-selector-modal">×</button>
                    </div>
                    <div class="modal-body engineer-selector-modal-body">
                        <!-- 検索フォーム -->
                        <div class="engineer-selector-search">
                            <div class="engineer-selector-search-group">
                                <label for="engineer-search-name" class="engineer-selector-search-label">エンジニア名</label>
                                <input type="text" id="engineer-search-name" class="form-input engineer-selector-search-input" placeholder="エンジニア名で検索">
                            </div>
                            <div class="engineer-selector-search-group">
                                <label for="engineer-search-skill" class="engineer-selector-search-label">エンジニアスキル</label>
                                <select id="engineer-search-skill" class="form-select engineer-selector-search-select" multiple>
                                    <option value="1">Java</option>
                                    <option value="2">Spring Boot</option>
                                    <option value="3">React</option>
                                    <option value="4">PostgreSQL</option>
                                    <option value="5">AWS</option>
                                    <option value="6">Python</option>
                                    <option value="7">Django</option>
                                    <option value="8">TypeScript</option>
                                    <option value="9">Next.js</option>
                                    <option value="10">Vue.js</option>
                                </select>
                                <p class="form-help-text">Ctrlキー（MacはCmdキー）を押しながらクリックで複数選択</p>
                            </div>
                            <div class="engineer-selector-search-actions">
                                <button type="button" class="btn btn-primary engineer-selector-search-btn">検索</button>
                                <button type="button" class="btn btn-secondary engineer-selector-reset-btn">リセット</button>
                            </div>
                        </div>
                        
                        <!-- エンジニア一覧 -->
                        <div class="engineer-selector-list">
                            <ul class="engineer-selector-list-ul" id="engineer-selector-list">
                                <!-- エンジニアリストがここに動的に追加される -->
                            </ul>
                        </div>
                    </div>
                    <div class="modal-footer engineer-selector-modal-footer">
                        <button type="button" class="btn btn-secondary engineer-selector-cancel-btn">キャンセル</button>
                        <button type="button" class="btn btn-primary engineer-selector-select-btn" disabled>選択</button>
                    </div>
                </div>
            </div>
        `;
        
        // 初期データを読み込む
        this.loadEngineerList();
    }

    initEventListeners() {
        const modal = this.querySelector('.engineer-selector-modal');
        const closeBtn = this.querySelector('.modal-close');
        const overlay = this.querySelector('.modal-overlay');
        const cancelBtn = this.querySelector('.engineer-selector-cancel-btn');
        const selectBtn = this.querySelector('.engineer-selector-select-btn');
        const searchBtn = this.querySelector('.engineer-selector-search-btn');
        const resetBtn = this.querySelector('.engineer-selector-reset-btn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.close());
        }

        if (selectBtn) {
            selectBtn.addEventListener('click', () => this.selectEngineer());
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.performSearch());
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetSearch());
        }

        // エンジニアリストのクリックイベント（動的に追加される要素用）
        const list = this.querySelector('#engineer-selector-list');
        if (list) {
            list.addEventListener('click', (e) => {
                const item = e.target.closest('.engineer-selector-item');
                if (item) {
                    this.handleEngineerItemClick(item);
                }
            });
        }
    }

    /**
     * URLパラメータから初期選択エンジニアIDを取得
     */
    loadInitialEngineer() {
        const urlParams = new URLSearchParams(window.location.search);
        const engineerId = urlParams.get('engineerId');
        if (engineerId) {
            this.initialEngineerId = engineerId;
        }
    }

    /**
     * エンジニアリストを読み込む
     */
    loadEngineerList() {
        const engineers = this.getMockEngineers();
        const list = this.querySelector('#engineer-selector-list');
        if (!list) return;

        list.innerHTML = engineers.map(engineer => this.createEngineerItem(engineer)).join('');

        // 初期選択エンジニアを選択状態にする
        if (this.initialEngineerId) {
            const item = list.querySelector(`[data-engineer-id="${this.initialEngineerId}"]`);
            if (item) {
                this.handleEngineerItemClick(item);
            }
        }
    }

    /**
     * エンジニアアイテムのHTMLを生成
     */
    createEngineerItem(engineer) {
        const skillsHtml = engineer.skills.map(skill => `<span class="skill-tag">${this.escapeHtml(skill)}</span>`).join('');
        const matchingScoreHtml = engineer.matchingScore !== null && engineer.matchingScore !== undefined
            ? `<div class="engineer-selector-matching-score">
                <span class="engineer-selector-matching-score-label">マッチングスコア:</span>
                <span class="engineer-selector-matching-score-value matching-score-${this.getScoreClass(engineer.matchingScore)}">${engineer.matchingScore}%</span>
            </div>`
            : '';

        return `
            <li class="engineer-selector-item" data-engineer-id="${engineer.id}">
                <button type="button" class="engineer-selector-item-btn">
                    <div class="engineer-selector-item-header">
                        <span class="engineer-selector-item-name">${this.escapeHtml(engineer.name)}</span>
                        ${matchingScoreHtml}
                    </div>
                    <div class="engineer-selector-item-skills">
                        ${skillsHtml}
                    </div>
                </button>
            </li>
        `;
    }

    /**
     * エンジニアアイテムのクリック処理
     */
    handleEngineerItemClick(item) {
        // 既存の選択を解除
        const allItems = this.querySelectorAll('.engineer-selector-item');
        allItems.forEach(i => i.classList.remove('selected'));

        // クリックされたアイテムを選択状態にする
        item.classList.add('selected');
        
        const engineerId = item.dataset.engineerId;
        const engineers = this.getMockEngineers();
        this.selectedEngineerData = engineers.find(e => e.id === parseInt(engineerId));
        this.selectedEngineerId = engineerId;

        // 選択ボタンを有効化
        const selectBtn = this.querySelector('.engineer-selector-select-btn');
        if (selectBtn) {
            selectBtn.disabled = false;
        }
    }

    /**
     * エンジニアを選択
     */
    selectEngineer() {
        if (!this.selectedEngineerData) return;

        // カスタムイベントを発火
        const event = new CustomEvent('engineer-selected', {
            detail: {
                engineerId: this.selectedEngineerId,
                engineerData: this.selectedEngineerData
            }
        });
        this.dispatchEvent(event);

        this.close();
    }

    /**
     * 検索実行
     */
    performSearch() {
        const nameInput = this.querySelector('#engineer-search-name');
        const skillSelect = this.querySelector('#engineer-search-skill');
        
        const searchName = nameInput ? nameInput.value.trim() : '';
        const selectedSkills = skillSelect ? Array.from(skillSelect.selectedOptions).map(opt => opt.value) : [];

        // TODO: 実際のAPI呼び出しに置き換える
        console.log('検索:', { name: searchName, skills: selectedSkills });
        
        // モックデータでフィルタリング
        const engineers = this.getMockEngineers();
        const filtered = engineers.filter(engineer => {
            if (searchName && !engineer.name.includes(searchName)) {
                return false;
            }
            // スキルフィルタリングは簡易実装
            return true;
        });

        const list = this.querySelector('#engineer-selector-list');
        if (list) {
            list.innerHTML = filtered.map(engineer => this.createEngineerItem(engineer)).join('');
        }
    }

    /**
     * 検索をリセット
     */
    resetSearch() {
        const nameInput = this.querySelector('#engineer-search-name');
        const skillSelect = this.querySelector('#engineer-search-skill');
        
        if (nameInput) nameInput.value = '';
        if (skillSelect) {
            Array.from(skillSelect.options).forEach(opt => opt.selected = false);
        }

        this.loadEngineerList();
    }

    /**
     * モーダルを開く
     */
    open() {
        const modal = this.querySelector('.engineer-selector-modal');
        if (modal) {
            modal.classList.add('active');
            this.loadEngineerList();
        }
    }

    /**
     * モーダルを閉じる
     */
    close() {
        const modal = this.querySelector('.engineer-selector-modal');
        if (modal) {
            modal.classList.remove('active');
            // 選択をリセット
            this.selectedEngineerId = null;
            this.selectedEngineerData = null;
            const selectBtn = this.querySelector('.engineer-selector-select-btn');
            if (selectBtn) {
                selectBtn.disabled = true;
            }
            const allItems = this.querySelectorAll('.engineer-selector-item');
            allItems.forEach(i => i.classList.remove('selected'));
        }
    }

    /**
     * マッチングスコアに応じたクラスを取得
     */
    getScoreClass(score) {
        if (score >= 80) return 'high';
        if (score >= 60) return 'medium';
        return 'low';
    }

    /**
     * HTMLエスケープ
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * モックエンジニアデータを取得
     */
    getMockEngineers() {
        return [
            {
                id: 1,
                name: '山田太郎',
                skills: ['Java', 'Spring Boot', 'React', 'PostgreSQL', 'AWS'],
                matchingScore: 85
            },
            {
                id: 2,
                name: '佐藤花子',
                skills: ['Python', 'Django', 'PostgreSQL'],
                matchingScore: 72
            },
            {
                id: 3,
                name: '鈴木一郎',
                skills: ['JavaScript', 'React', 'Vue.js'],
                matchingScore: 58
            },
            {
                id: 4,
                name: '田中次郎',
                skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
                matchingScore: 92
            },
            {
                id: 5,
                name: '高橋三郎',
                skills: ['Swift', 'iOS', 'Objective-C'],
                matchingScore: null // マッチングスコアがない場合
            }
        ];
    }
}

// カスタム要素として登録
customElements.define('app-engineer-selector', AppEngineerSelector);


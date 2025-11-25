/**
 * ブラックリスト選択モーダルコンポーネント
 * Web Components (Custom Elements) を使用して実装
 */
class AppBlacklistSelector extends HTMLElement {
    constructor() {
        super();
        this.selectedItems = [];
        this.likePatterns = []; // LIKEパターンの配列
        this.onSelectCallback = null;
    }

    connectedCallback() {
        this.render();
        this.initEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="modal blacklist-modal" id="blacklist-modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">ブラックリストを選択</h3>
                        <button type="button" class="modal-close" data-modal="blacklist-modal">×</button>
                    </div>
                    <div class="modal-body">
                        <!-- LIKE指定で除外する文字列入力 -->
                        <div class="blacklist-like-section">
                            <label for="blacklist-like-input" class="form-label">文字列パターンで除外</label>
                            <div class="blacklist-like-input-group">
                                <input type="text" id="blacklist-like-input" class="form-input blacklist-like-input" placeholder="例: テック, システム">
                                <button type="button" class="btn btn-secondary blacklist-like-add-btn">追加</button>
                            </div>
                            <p class="form-help-text">指定した文字列を含む会社名を検索対象から除外します（LIKE検索）。</p>
                            <div class="blacklist-like-list" id="blacklist-like-list">
                                <!-- LIKEパターンのリストがここに表示される -->
                            </div>
                        </div>
                        
                        <div class="modal-search">
                            <input type="text" class="form-input modal-search-input" placeholder="会社名で検索">
                            <button type="button" class="btn btn-info modal-search-btn">検索</button>
                        </div>
                        <div class="modal-list">
                            <ul class="company-list">
                                <li class="company-list-item">
                                    <label class="company-list-checkbox-label">
                                        <input type="checkbox" class="company-list-checkbox" data-company-id="1" data-company-name="テック株式会社">
                                        <span class="company-name">テック株式会社</span>
                                        <span class="company-code">法人番号: 2345678901234</span>
                                    </label>
                                </li>
                                <li class="company-list-item">
                                    <label class="company-list-checkbox-label">
                                        <input type="checkbox" class="company-list-checkbox" data-company-id="2" data-company-name="システム株式会社">
                                        <span class="company-name">システム株式会社</span>
                                        <span class="company-code">法人番号: 3456789012345</span>
                                    </label>
                                </li>
                                <li class="company-list-item">
                                    <label class="company-list-checkbox-label">
                                        <input type="checkbox" class="company-list-checkbox" data-company-id="3" data-company-name="ウェブ株式会社">
                                        <span class="company-name">ウェブ株式会社</span>
                                        <span class="company-code">法人番号: 4567890123456</span>
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-warning blacklist-cancel-btn">キャンセル</button>
                        <button type="button" class="btn btn-primary blacklist-confirm-btn">選択を確定</button>
                    </div>
                </div>
            </div>
        `;
    }

    initEventListeners() {
        const modal = this.querySelector('.blacklist-modal');
        const overlay = this.querySelector('.modal-overlay');
        const headerCloseBtn = this.querySelector('.modal-close');
        const cancelBtn = this.querySelector('.blacklist-cancel-btn');
        const confirmBtn = this.querySelector('.blacklist-confirm-btn');
        const likeInput = this.querySelector('#blacklist-like-input');
        const likeAddBtn = this.querySelector('.blacklist-like-add-btn');
        const likeList = this.querySelector('#blacklist-like-list');

        // ヘッダーの閉じるボタン
        if (headerCloseBtn) {
            headerCloseBtn.addEventListener('click', () => this.close());
        }

        // フッターのキャンセルボタン
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.close());
        }

        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }

        // LIKEパターンの追加
        const addLikePattern = () => {
            const pattern = likeInput.value.trim();
            if (!pattern) {
                alert('文字列を入力してください');
                return;
            }
            
            // 既に追加されているかチェック
            if (this.likePatterns.includes(pattern)) {
                alert('このパターンは既に追加されています');
                return;
            }
            
            this.likePatterns.push(pattern);
            this.renderLikeList();
            likeInput.value = '';
        };

        if (likeAddBtn) {
            likeAddBtn.addEventListener('click', addLikePattern);
        }

        if (likeInput) {
            likeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addLikePattern();
                }
            });
        }

        // LIKEパターンリストの削除処理
        if (likeList) {
            likeList.addEventListener('click', (e) => {
                const removeBtn = e.target.closest('.blacklist-like-remove');
                if (removeBtn) {
                    const index = parseInt(removeBtn.getAttribute('data-index'));
                    this.likePatterns.splice(index, 1);
                    this.renderLikeList();
                }
            });
        }

        // 確定ボタン
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                const checkboxes = this.querySelectorAll('.company-list-checkbox:checked');
                const selectedCompanies = [];
                checkboxes.forEach(checkbox => {
                    selectedCompanies.push({
                        id: checkbox.getAttribute('data-company-id'),
                        name: checkbox.getAttribute('data-company-name'),
                        type: 'company'
                    });
                });
                
                // LIKEパターンを追加
                const selectedLikePatterns = this.likePatterns.map(pattern => ({
                    id: null,
                    name: pattern,
                    type: 'like'
                }));
                
                // 会社選択とLIKEパターンを結合
                this.selectedItems = [...selectedCompanies, ...selectedLikePatterns];
                
                if (this.onSelectCallback) {
                    this.onSelectCallback(this.selectedItems);
                }
                
                this.close();
            });
        }
    }

    /**
     * LIKEパターンリストを表示
     */
    renderLikeList() {
        const likeList = this.querySelector('#blacklist-like-list');
        if (!likeList) return;
        
        likeList.innerHTML = '';
        if (this.likePatterns.length === 0) {
            return;
        }
        
        this.likePatterns.forEach((pattern, index) => {
            const item = document.createElement('div');
            item.className = 'blacklist-like-item';
            item.innerHTML = `
                <span class="blacklist-like-pattern">${pattern}</span>
                <button type="button" class="blacklist-like-remove" data-index="${index}">×</button>
            `;
            likeList.appendChild(item);
        });
    }

    /**
     * モーダルを開く
     * @param {Array} initialSelected - 初期選択状態のアイテム配列 [{id, name, type}, ...]
     * @param {Function} onSelect - 選択確定時のコールバック関数
     */
    open(initialSelected = [], onSelect = null) {
        const modal = this.querySelector('.blacklist-modal');
        if (!modal) return;

        // 初期選択状態を設定
        this.selectedItems = initialSelected;
        
        // 会社選択とLIKEパターンを分離
        // typeが設定されていない場合は'company'として扱う（既存コードとの互換性）
        const selectedCompanies = initialSelected.filter(item => !item.type || item.type !== 'like');
        const selectedLikePatterns = initialSelected
            .filter(item => item.type === 'like')
            .map(item => item.name);
        
        // チェックボックスの状態を設定
        const checkboxes = this.querySelectorAll('.company-list-checkbox');
        checkboxes.forEach(checkbox => {
            const companyId = checkbox.getAttribute('data-company-id');
            checkbox.checked = selectedCompanies.some(item => item.id === companyId);
        });
        
        // LIKEパターンを設定
        this.likePatterns = selectedLikePatterns;
        this.renderLikeList();

        // コールバック関数を保存
        this.onSelectCallback = onSelect;

        // モーダルを表示
        modal.classList.add('active');
    }

    /**
     * モーダルを閉じる
     */
    close() {
        const modal = this.querySelector('.blacklist-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
}

// カスタム要素として登録
customElements.define('app-blacklist-selector', AppBlacklistSelector);


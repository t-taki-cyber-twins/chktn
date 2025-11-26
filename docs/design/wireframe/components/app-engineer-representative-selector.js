/**
 * エンジニア担当者選択モーダルコンポーネント
 * Web Components (Custom Elements) を使用して実装
 */
class AppEngineerRepresentativeSelector extends HTMLElement {
    constructor() {
        super();
        this.selectedItems = [];
        this.onSelectCallback = null;
    }

    connectedCallback() {
        this.render();
        this.initEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="modal engineer-representative-modal" id="engineer-representative-modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">エンジニア担当者を選択</h3>
                        <button type="button" class="modal-close" data-modal="engineer-representative-modal">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-search">
                            <input type="text" class="form-input modal-search-input" placeholder="担当者名で検索">
                            <button type="button" class="btn btn-info modal-search-btn">検索</button>
                        </div>
                        <div class="modal-list">
                            <ul class="employee-list">
                                <li class="employee-list-item">
                                    <label class="employee-list-checkbox-label">
                                        <input type="checkbox" class="employee-list-checkbox" data-employee-id="self" data-employee-name="自分">
                                        <div class="employee-info">
                                            <span class="employee-name">自分</span>
                                            <span class="employee-department">-</span>
                                        </div>
                                    </label>
                                </li>
                                <li class="employee-list-item">
                                    <label class="employee-list-checkbox-label">
                                        <input type="checkbox" class="employee-list-checkbox" data-employee-id="1" data-employee-name="田中太郎">
                                        <div class="employee-info">
                                            <span class="employee-name">田中太郎</span>
                                            <span class="employee-department">営業部</span>
                                        </div>
                                    </label>
                                </li>
                                <li class="employee-list-item">
                                    <label class="employee-list-checkbox-label">
                                        <input type="checkbox" class="employee-list-checkbox" data-employee-id="2" data-employee-name="佐藤花子">
                                        <div class="employee-info">
                                            <span class="employee-name">佐藤花子</span>
                                            <span class="employee-department">営業部</span>
                                        </div>
                                    </label>
                                </li>
                                <li class="employee-list-item">
                                    <label class="employee-list-checkbox-label">
                                        <input type="checkbox" class="employee-list-checkbox" data-employee-id="3" data-employee-name="鈴木一郎">
                                        <div class="employee-info">
                                            <span class="employee-name">鈴木一郎</span>
                                            <span class="employee-department">技術部</span>
                                        </div>
                                    </label>
                                </li>
                                <li class="employee-list-item">
                                    <label class="employee-list-checkbox-label">
                                        <input type="checkbox" class="employee-list-checkbox" data-employee-id="4" data-employee-name="高橋次郎">
                                        <div class="employee-info">
                                            <span class="employee-name">高橋次郎</span>
                                            <span class="employee-department">技術部</span>
                                        </div>
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-warning engineer-representative-cancel-btn">キャンセル</button>
                        <button type="button" class="btn btn-primary engineer-representative-confirm-btn">選択を確定</button>
                    </div>
                </div>
            </div>
        `;
    }

    initEventListeners() {
        const modal = this.querySelector('.engineer-representative-modal');
        const overlay = this.querySelector('.modal-overlay');
        const headerCloseBtn = this.querySelector('.modal-close');
        const cancelBtn = this.querySelector('.engineer-representative-cancel-btn');
        const confirmBtn = this.querySelector('.engineer-representative-confirm-btn');

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

        // 確定ボタン
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                const checkboxes = this.querySelectorAll('.employee-list-checkbox:checked');
                const selectedEmployees = [];
                checkboxes.forEach(checkbox => {
                    selectedEmployees.push({
                        id: checkbox.getAttribute('data-employee-id'),
                        name: checkbox.getAttribute('data-employee-name')
                    });
                });
                
                this.selectedItems = selectedEmployees;
                
                if (this.onSelectCallback) {
                    this.onSelectCallback(this.selectedItems);
                }
                
                this.close();
            });
        }
    }

    /**
     * モーダルを開く
     * @param {Array} initialSelected - 初期選択状態のアイテム配列 [{id, name}, ...]
     * @param {Function} onSelect - 選択確定時のコールバック関数
     */
    open(initialSelected = [], onSelect = null) {
        const modal = this.querySelector('.engineer-representative-modal');
        if (!modal) return;

        // 初期選択状態を設定
        this.selectedItems = initialSelected;
        
        // チェックボックスの状態を設定
        const checkboxes = this.querySelectorAll('.employee-list-checkbox');
        checkboxes.forEach(checkbox => {
            const employeeId = checkbox.getAttribute('data-employee-id');
            checkbox.checked = initialSelected.some(item => item.id === employeeId);
        });
        
        // コールバック関数を保存
        this.onSelectCallback = onSelect;

        // モーダルを表示
        modal.classList.add('active');
    }

    /**
     * モーダルを閉じる
     */
    close() {
        const modal = this.querySelector('.engineer-representative-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
}

// カスタム要素として登録
customElements.define('app-engineer-representative-selector', AppEngineerRepresentativeSelector);

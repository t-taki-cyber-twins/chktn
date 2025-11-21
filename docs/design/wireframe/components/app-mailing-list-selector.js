/**
 * メーリングリスト選択モーダルコンポーネント
 * Web Components (Custom Elements) を使用して実装
 */
class AppMailingListSelector extends HTMLElement {
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
            <div class="modal mailing-list-modal" id="mailing-list-modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">メーリングリストを選択</h3>
                        <button type="button" class="modal-close" data-modal="mailing-list-modal">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-search">
                            <input type="text" class="form-input modal-search-input" placeholder="メーリングリスト名で検索">
                            <button type="button" class="btn btn-primary modal-search-btn">検索</button>
                        </div>
                        <div class="modal-list">
                            <ul class="mailing-list">
                                <li class="mailing-list-item">
                                    <label class="mailing-list-checkbox-label">
                                        <input type="checkbox" class="mailing-list-checkbox" data-mailing-list-id="1" data-mailing-list-name="営業部全員">
                                        <span class="mailing-list-name">営業部全員</span>
                                        <span class="mailing-list-description">営業部の全メンバー</span>
                                    </label>
                                </li>
                                <li class="mailing-list-item">
                                    <label class="mailing-list-checkbox-label">
                                        <input type="checkbox" class="mailing-list-checkbox" data-mailing-list-id="2" data-mailing-list-name="プロジェクトマネージャー">
                                        <span class="mailing-list-name">プロジェクトマネージャー</span>
                                        <span class="mailing-list-description">プロジェクトマネージャー全員</span>
                                    </label>
                                </li>
                                <li class="mailing-list-item">
                                    <label class="mailing-list-checkbox-label">
                                        <input type="checkbox" class="mailing-list-checkbox" data-mailing-list-id="3" data-mailing-list-name="経営層">
                                        <span class="mailing-list-name">経営層</span>
                                        <span class="mailing-list-description">経営層への通知用</span>
                                    </label>
                                </li>
                                <li class="mailing-list-item">
                                    <label class="mailing-list-checkbox-label">
                                        <input type="checkbox" class="mailing-list-checkbox" data-mailing-list-id="4" data-mailing-list-name="案件担当者">
                                        <span class="mailing-list-name">案件担当者</span>
                                        <span class="mailing-list-description">案件担当者への通知用</span>
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary mailing-list-cancel-btn">キャンセル</button>
                        <button type="button" class="btn btn-primary mailing-list-confirm-btn">選択を確定</button>
                    </div>
                </div>
            </div>
        `;
    }

    initEventListeners() {
        const modal = this.querySelector('.mailing-list-modal');
        const overlay = this.querySelector('.modal-overlay');
        const headerCloseBtn = this.querySelector('.modal-close');
        const cancelBtn = this.querySelector('.mailing-list-cancel-btn');
        const confirmBtn = this.querySelector('.mailing-list-confirm-btn');

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
                const checkboxes = this.querySelectorAll('.mailing-list-checkbox:checked');
                this.selectedItems = [];
                checkboxes.forEach(checkbox => {
                    this.selectedItems.push({
                        id: checkbox.getAttribute('data-mailing-list-id'),
                        name: checkbox.getAttribute('data-mailing-list-name')
                    });
                });
                
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
        const modal = this.querySelector('.mailing-list-modal');
        if (!modal) return;

        // 初期選択状態を設定
        this.selectedItems = initialSelected;
        const checkboxes = this.querySelectorAll('.mailing-list-checkbox');
        checkboxes.forEach(checkbox => {
            const mailingListId = checkbox.getAttribute('data-mailing-list-id');
            checkbox.checked = initialSelected.some(item => item.id === mailingListId);
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
        const modal = this.querySelector('.mailing-list-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
}

// カスタム要素として登録
customElements.define('app-mailing-list-selector', AppMailingListSelector);


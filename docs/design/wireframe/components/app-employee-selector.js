/**
 * 社員選択モーダルコンポーネント
 * Web Components (Custom Elements) を使用して実装
 * 
 * 機能:
 * - 社員一覧の表示
 * - 名前での検索
 * - 社員属性（エンジニア、案件担当、技術者管理）での絞り込み
 * - 複数選択
 */
class AppEmployeeSelector extends HTMLElement {
    constructor() {
        super();
        this.selectedItems = [];
        this.onSelectCallback = null;
        
        // モックデータ: 社員一覧
        this.employees = [
            { id: 'self', name: '自分', department: '-', isEngineer: true, isPM: true, isTechManager: true },
            { id: '1', name: '田中太郎', department: '営業部', isEngineer: false, isPM: true, isTechManager: false },
            { id: '2', name: '佐藤花子', department: '営業部', isEngineer: false, isPM: true, isTechManager: false },
            { id: '3', name: '鈴木一郎', department: '技術部', isEngineer: true, isPM: false, isTechManager: true },
            { id: '4', name: '高橋次郎', department: '技術部', isEngineer: true, isPM: false, isTechManager: false },
            { id: '5', name: '山田三郎', department: '開発部', isEngineer: true, isPM: false, isTechManager: false },
            { id: '6', name: '伊藤四郎', department: '開発部', isEngineer: true, isPM: true, isTechManager: false }
        ];
    }

    connectedCallback() {
        this.render();
        this.initEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="modal employee-selector-modal" id="employee-selector-modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">社員を選択</h3>
                        <button type="button" class="modal-close" data-modal="employee-selector-modal">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-search-area">
                            <div class="modal-search-row">
                                <input type="text" class="form-input modal-search-input" placeholder="社員名で検索">
                                <button type="button" class="btn btn-info modal-search-btn">検索</button>
                            </div>
                            <div class="modal-filter-row">
                                <span class="filter-label">絞り込み:</span>
                                <label class="filter-checkbox-label">
                                    <input type="checkbox" class="filter-checkbox" value="isEngineer"> エンジニア
                                </label>
                                <label class="filter-checkbox-label">
                                    <input type="checkbox" class="filter-checkbox" value="isPM"> 案件担当
                                </label>
                                <label class="filter-checkbox-label">
                                    <input type="checkbox" class="filter-checkbox" value="isTechManager"> 技術者管理
                                </label>
                            </div>
                        </div>
                        <div class="modal-list">
                            <ul class="employee-list" id="employee-list-container">
                                <!-- 社員リストがここに動的に表示される -->
                            </ul>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-warning employee-selector-cancel-btn">キャンセル</button>
                        <button type="button" class="btn btn-primary employee-selector-confirm-btn">選択を確定</button>
                    </div>
                </div>
            </div>
            <style>
                .modal-search-area {
                    margin-bottom: 16px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #eee;
                }
                .modal-search-row {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 12px;
                }
                .modal-search-input {
                    flex: 1;
                }
                .modal-filter-row {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    font-size: 14px;
                }
                .filter-label {
                    font-weight: bold;
                    color: #555;
                }
                .filter-checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    cursor: pointer;
                }
                .employee-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    max-height: 300px;
                    overflow-y: auto;
                }
                .employee-list-item {
                    border-bottom: 1px solid #f0f0f0;
                }
                .employee-list-item:last-child {
                    border-bottom: none;
                }
                .employee-list-checkbox-label {
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    cursor: pointer;
                    width: 100%;
                }
                .employee-list-checkbox-label:hover {
                    background-color: #f9f9f9;
                }
                .employee-list-checkbox {
                    margin-right: 12px;
                }
                .employee-info {
                    display: flex;
                    flex-direction: column;
                }
                .employee-name {
                    font-weight: bold;
                    margin-bottom: 2px;
                }
                .employee-department {
                    font-size: 12px;
                    color: #888;
                }
                .employee-badges {
                    display: flex;
                    gap: 4px;
                    margin-top: 4px;
                }
                .employee-badge {
                    font-size: 10px;
                    padding: 2px 6px;
                    border-radius: 4px;
                    background-color: #eee;
                    color: #555;
                }
                .badge-engineer { background-color: #e3f2fd; color: #0d47a1; }
                .badge-pm { background-color: #e8f5e9; color: #1b5e20; }
                .badge-manager { background-color: #fff3e0; color: #e65100; }
            </style>
        `;
    }

    initEventListeners() {
        const modal = this.querySelector('.employee-selector-modal');
        const overlay = this.querySelector('.modal-overlay');
        const headerCloseBtn = this.querySelector('.modal-close');
        const cancelBtn = this.querySelector('.employee-selector-cancel-btn');
        const confirmBtn = this.querySelector('.employee-selector-confirm-btn');
        const searchBtn = this.querySelector('.modal-search-btn');
        const searchInput = this.querySelector('.modal-search-input');
        const filterCheckboxes = this.querySelectorAll('.filter-checkbox');

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

        // 検索ボタン
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.filterEmployees());
        }

        // 検索入力（Enterキー）
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.filterEmployees();
                }
            });
        }

        // フィルターチェックボックス
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.filterEmployees());
        });

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
     * 社員リストをフィルタリングして表示
     */
    filterEmployees() {
        const searchInput = this.querySelector('.modal-search-input');
        const searchText = searchInput ? searchInput.value.trim().toLowerCase() : '';
        
        const filterCheckboxes = this.querySelectorAll('.filter-checkbox:checked');
        const activeFilters = Array.from(filterCheckboxes).map(cb => cb.value);

        const filteredEmployees = this.employees.filter(employee => {
            // 名前検索
            const nameMatch = !searchText || employee.name.toLowerCase().includes(searchText);
            
            // 属性フィルタ（AND条件: 選択された属性をすべて持っているか）
            // ※要件に合わせてOR条件にする場合は some() を使用
            // ここでは「絞り込み」なのでAND条件（every）を採用
            const attrMatch = activeFilters.length === 0 || activeFilters.every(filter => employee[filter]);
            
            return nameMatch && attrMatch;
        });

        this.renderEmployeeList(filteredEmployees);
    }

    /**
     * 社員リストを描画
     * @param {Array} employees - 表示する社員の配列
     */
    renderEmployeeList(employees) {
        const listContainer = this.querySelector('#employee-list-container');
        if (!listContainer) return;

        listContainer.innerHTML = '';

        if (employees.length === 0) {
            listContainer.innerHTML = '<li style="padding: 16px; text-align: center; color: #888;">該当する社員がいません</li>';
            return;
        }

        employees.forEach(employee => {
            const isSelected = this.selectedItems.some(item => item.id === employee.id);
            const li = document.createElement('li');
            li.className = 'employee-list-item';
            
            // バッジの生成
            let badgesHtml = '<div class="employee-badges">';
            if (employee.isEngineer) badgesHtml += '<span class="employee-badge badge-engineer">エンジニア</span>';
            if (employee.isPM) badgesHtml += '<span class="employee-badge badge-pm">案件担当</span>';
            if (employee.isTechManager) badgesHtml += '<span class="employee-badge badge-manager">技術者管理</span>';
            badgesHtml += '</div>';

            li.innerHTML = `
                <label class="employee-list-checkbox-label">
                    <input type="checkbox" class="employee-list-checkbox" 
                        data-employee-id="${employee.id}" 
                        data-employee-name="${employee.name}"
                        ${isSelected ? 'checked' : ''}>
                    <div class="employee-info">
                        <span class="employee-name">${employee.name}</span>
                        <span class="employee-department">${employee.department}</span>
                        ${badgesHtml}
                    </div>
                </label>
            `;
            listContainer.appendChild(li);
        });
    }

    /**
     * モーダルを開く
     * @param {Array} initialSelected - 初期選択状態のアイテム配列 [{id, name}, ...]
     * @param {Function} onSelect - 選択確定時のコールバック関数
     */
    open(initialSelected = [], onSelect = null) {
        const modal = this.querySelector('.employee-selector-modal');
        if (!modal) return;

        // 初期選択状態を設定
        this.selectedItems = initialSelected || [];
        this.onSelectCallback = onSelect;

        // 検索条件をリセット
        const searchInput = this.querySelector('.modal-search-input');
        if (searchInput) searchInput.value = '';
        
        const filterCheckboxes = this.querySelectorAll('.filter-checkbox');
        filterCheckboxes.forEach(cb => cb.checked = false);

        // リストを描画
        this.filterEmployees();

        // モーダルを表示
        modal.classList.add('active');
    }

    /**
     * モーダルを閉じる
     */
    close() {
        const modal = this.querySelector('.employee-selector-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
}

// カスタム要素として登録
customElements.define('app-employee-selector', AppEmployeeSelector);

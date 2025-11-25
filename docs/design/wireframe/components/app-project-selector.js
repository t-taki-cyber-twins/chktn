/**
 * 案件選択モーダルコンポーネント
 * Web Components (Custom Elements) を使用して実装
 * 自社（自テナント）の案件のみ選択可能
 */
class AppProjectSelector extends HTMLElement {
    constructor() {
        super();
        this.selectedProjectId = null;
        this.selectedProjectData = null;
        this.onSelectCallback = null;
    }

    connectedCallback() {
        this.render();
        this.initEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="modal project-selector-modal" id="project-selector-modal">
                <div class="modal-overlay"></div>
                <div class="modal-content project-selector-modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">案件を選択</h3>
                        <button type="button" class="modal-close" data-modal="project-selector-modal">×</button>
                    </div>
                    <div class="modal-body project-selector-modal-body">
                        <!-- 検索フォーム -->
                        <div class="project-selector-search">
                            <div class="project-selector-search-group">
                                <label for="project-search-name" class="project-selector-search-label">案件名</label>
                                <input type="text" id="project-search-name" class="form-input project-selector-search-input" placeholder="案件名で検索">
                            </div>
                            <div class="project-selector-search-group">
                                <label for="project-search-status" class="project-selector-search-label">案件ステータス</label>
                                <select id="project-search-status" class="form-select project-selector-search-select">
                                    <option value="">すべて</option>
                                    <option value="recruiting">募集中</option>
                                    <option value="interviewing">面談中</option>
                                    <option value="confirmed">確定</option>
                                    <option value="completed">終了</option>
                                </select>
                            </div>
                            <div class="project-selector-search-group">
                                <label for="project-search-end-company" class="project-selector-search-label">エンド会社</label>
                                <select id="project-search-end-company" class="form-select project-selector-search-select">
                                    <option value="">すべて</option>
                                    <option value="1">サンプル株式会社</option>
                                    <option value="2">テック株式会社</option>
                                    <option value="3">デザイン株式会社</option>
                                    <option value="4">システム株式会社</option>
                                </select>
                            </div>
                            <div class="project-selector-search-actions">
                                <button type="button" class="btn btn-info project-selector-search-btn">検索</button>
                                <button type="button" class="btn btn-secondary project-selector-reset-btn">リセット</button>
                            </div>
                        </div>
                        
                        <!-- 案件一覧 -->
                        <div class="project-selector-list">
                            <ul class="project-selector-list-ul" id="project-selector-list">
                                <!-- 案件リストがここに動的に追加される -->
                            </ul>
                        </div>
                    </div>
                    <div class="modal-footer project-selector-modal-footer">
                        <button type="button" class="btn btn-warning project-selector-cancel-btn">キャンセル</button>
                        <button type="button" class="btn btn-primary project-selector-select-btn" disabled>選択</button>
                    </div>
                </div>
            </div>
        `;
        
        // 初期データを読み込む
        this.loadProjectList();
    }

    initEventListeners() {
        const modal = this.querySelector('.project-selector-modal');
        const closeBtn = this.querySelector('.modal-close');
        const overlay = this.querySelector('.modal-overlay');
        const cancelBtn = this.querySelector('.project-selector-cancel-btn');
        const selectBtn = this.querySelector('.project-selector-select-btn');
        const searchBtn = this.querySelector('.project-selector-search-btn');
        const resetBtn = this.querySelector('.project-selector-reset-btn');

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
            selectBtn.addEventListener('click', () => this.selectProject());
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.performSearch());
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetSearch());
        }

        // 案件リストのクリックイベント（動的に追加される要素用）
        const list = this.querySelector('#project-selector-list');
        if (list) {
            list.addEventListener('click', (e) => {
                const item = e.target.closest('.project-selector-item');
                if (item) {
                    this.handleProjectItemClick(item);
                }
            });
        }
    }

    /**
     * 案件リストを読み込む
     */
    loadProjectList() {
        const projects = this.getMockProjects();
        const list = this.querySelector('#project-selector-list');
        if (!list) return;

        list.innerHTML = projects.map(project => this.createProjectItem(project)).join('');
    }

    /**
     * 案件アイテムのHTMLを生成
     */
    createProjectItem(project) {
        const statusBadgeClass = this.getStatusBadgeClass(project.status);
        const statusText = this.getStatusText(project.status);

        return `
            <li class="project-selector-item" data-project-id="${project.id}">
                <button type="button" class="project-selector-item-btn">
                    <div class="project-selector-item-header">
                        <span class="project-selector-item-name">${this.escapeHtml(project.name)}</span>
                    </div>
                    <div class="project-selector-item-info">
                        <span class="project-selector-item-end-company">${this.escapeHtml(project.endCompany)}</span>
                        <span class="project-selector-item-status">
                            <span class="badge ${statusBadgeClass}">${statusText}</span>
                        </span>
                    </div>
                </button>
            </li>
        `;
    }

    /**
     * 案件アイテムのクリック処理
     */
    handleProjectItemClick(item) {
        // 既存の選択を解除
        const allItems = this.querySelectorAll('.project-selector-item');
        allItems.forEach(i => i.classList.remove('selected'));

        // クリックされたアイテムを選択状態にする
        item.classList.add('selected');
        
        const projectId = item.dataset.projectId;
        const projects = this.getMockProjects();
        this.selectedProjectData = projects.find(p => p.id === parseInt(projectId));
        this.selectedProjectId = projectId;

        // 選択ボタンを有効化
        const selectBtn = this.querySelector('.project-selector-select-btn');
        if (selectBtn) {
            selectBtn.disabled = false;
        }
    }

    /**
     * 案件を選択
     */
    selectProject() {
        if (!this.selectedProjectData) return;

        // カスタムイベントを発火
        const event = new CustomEvent('project-selected', {
            detail: {
                projectId: this.selectedProjectId,
                projectData: this.selectedProjectData
            }
        });
        this.dispatchEvent(event);

        if (this.onSelectCallback) {
            this.onSelectCallback(this.selectedProjectData);
        }

        this.close();
    }

    /**
     * 検索実行
     */
    performSearch() {
        const nameInput = this.querySelector('#project-search-name');
        const statusSelect = this.querySelector('#project-search-status');
        const endCompanySelect = this.querySelector('#project-search-end-company');
        
        const searchName = nameInput ? nameInput.value.trim() : '';
        const searchStatus = statusSelect ? statusSelect.value : '';
        const searchEndCompany = endCompanySelect ? endCompanySelect.value : '';

        // TODO: 実際のAPI呼び出しに置き換える
        console.log('検索:', { name: searchName, status: searchStatus, endCompany: searchEndCompany });
        
        // モックデータでフィルタリング
        const projects = this.getMockProjects();
        const filtered = projects.filter(project => {
            if (searchName && !project.name.includes(searchName)) {
                return false;
            }
            if (searchStatus && project.status !== searchStatus) {
                return false;
            }
            if (searchEndCompany && project.endCompanyId !== searchEndCompany) {
                return false;
            }
            return true;
        });

        const list = this.querySelector('#project-selector-list');
        if (list) {
            list.innerHTML = filtered.map(project => this.createProjectItem(project)).join('');
        }

        // 選択をリセット
        this.selectedProjectId = null;
        this.selectedProjectData = null;
        const selectBtn = this.querySelector('.project-selector-select-btn');
        if (selectBtn) {
            selectBtn.disabled = true;
        }
    }

    /**
     * 検索をリセット
     */
    resetSearch() {
        const nameInput = this.querySelector('#project-search-name');
        const statusSelect = this.querySelector('#project-search-status');
        const endCompanySelect = this.querySelector('#project-search-end-company');
        
        if (nameInput) nameInput.value = '';
        if (statusSelect) statusSelect.value = '';
        if (endCompanySelect) endCompanySelect.value = '';

        this.loadProjectList();

        // 選択をリセット
        this.selectedProjectId = null;
        this.selectedProjectData = null;
        const selectBtn = this.querySelector('.project-selector-select-btn');
        if (selectBtn) {
            selectBtn.disabled = true;
        }
        const allItems = this.querySelectorAll('.project-selector-item');
        allItems.forEach(i => i.classList.remove('selected'));
    }

    /**
     * ステータスに応じたバッジクラスを取得
     */
    getStatusBadgeClass(status) {
        const statusMap = {
            'recruiting': 'badge-status-recruiting',
            'interviewing': 'badge-status-interviewing',
            'confirmed': 'badge-status-confirmed',
            'completed': 'badge-status-completed'
        };
        return statusMap[status] || 'badge-status-default';
    }

    /**
     * ステータスに応じたテキストを取得
     */
    getStatusText(status) {
        const statusMap = {
            'recruiting': '募集中',
            'interviewing': '面談中',
            'confirmed': '確定',
            'completed': '終了'
        };
        return statusMap[status] || status;
    }

    /**
     * モーダルを開く
     * @param {Function} onSelect - 選択確定時のコールバック関数
     */
    open(onSelect = null) {
        const modal = this.querySelector('.project-selector-modal');
        if (!modal) return;

        this.onSelectCallback = onSelect;

        // 選択をリセット
        this.selectedProjectId = null;
        this.selectedProjectData = null;
        const selectBtn = this.querySelector('.project-selector-select-btn');
        if (selectBtn) {
            selectBtn.disabled = true;
        }
        const allItems = this.querySelectorAll('.project-selector-item');
        allItems.forEach(i => i.classList.remove('selected'));

        // モーダルを表示
        modal.classList.add('active');
        this.loadProjectList();
    }

    /**
     * モーダルを閉じる
     */
    close() {
        const modal = this.querySelector('.project-selector-modal');
        if (modal) {
            modal.classList.remove('active');
            // 選択をリセット
            this.selectedProjectId = null;
            this.selectedProjectData = null;
            const selectBtn = this.querySelector('.project-selector-select-btn');
            if (selectBtn) {
                selectBtn.disabled = true;
            }
            const allItems = this.querySelectorAll('.project-selector-item');
            allItems.forEach(i => i.classList.remove('selected'));
        }
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
     * モック案件データを取得（自社の案件のみ）
     */
    getMockProjects() {
        return [
            {
                id: 1,
                name: 'フルスタックエンジニア募集',
                endCompany: 'サンプル株式会社',
                endCompanyId: '1',
                status: 'recruiting'
            },
            {
                id: 2,
                name: 'バックエンドエンジニア募集',
                endCompany: 'テック株式会社',
                endCompanyId: '2',
                status: 'interviewing'
            },
            {
                id: 3,
                name: 'フロントエンドエンジニア募集',
                endCompany: 'デザイン株式会社',
                endCompanyId: '3',
                status: 'confirmed'
            },
            {
                id: 4,
                name: 'インフラエンジニア募集',
                endCompany: 'システム株式会社',
                endCompanyId: '4',
                status: 'completed'
            }
        ];
    }
}

// カスタム要素として登録
customElements.define('app-project-selector', AppProjectSelector);


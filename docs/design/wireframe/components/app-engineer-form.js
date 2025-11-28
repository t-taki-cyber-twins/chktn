class AppEngineerForm extends HTMLElement {
    constructor() {
        super();
        this.skills = [];
        this.projects = [];
    }

    connectedCallback() {
        this.render();
        this.initTabs();
        this.initSkillSheetUpload();
        this.initEngineerManagersSelection();
        this.initSkillListTable();
        this.initProjectListTable();
        this.initBlacklistSelection();
        this.initSkillMemoButtons();
        this.initModals();
    }

    render() {
        this.innerHTML = `
            <div class="form-section">
                <div class="form-grid">
                    <div class="form-group form-group-full">
                        <label for="engineer-status" class="form-label">営業可否 <span class="form-required">*</span></label>
                        <select id="sales-status" name="sales-status" class="form-select">
                            <option value="available">営業可</option>
                            <option value="unavailable">営業不可</option>
                        </select>
                    </div>
                    <div class="form-group form-group-full">
                        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 8px;">
                            <label for="engineer-memo" class="form-label" style="margin-bottom: 0;">エンジニアメモ</label>
                            <button type="button" class="btn btn-info btn-sm" id="extract-engineer-memo-btn"><i class="icon-ai"></i>エンジニアメモから情報抽出</button>
                            &nbsp;
                            <select id="engineer-memo-template-select" class="form-select" style="width: auto; display: inline-block;">
                                <option value="">テンプレート選択</option>
                                <option value="1">通常スキルメモ</option>
                                <option value="2">AIスキルメモ</option>
                            </select>
                            <button type="button" class="btn btn-success btn-sm" id="generate-engineer-memo-btn"><i class="icon-ai"></i>エンジニアメモを生成</button>
                            <button type="button" class="btn btn-secondary btn-sm" id="edit-engineer-memo-template-btn">エンジニアメモテンプレート編集</button>
                        </div>
                        <textarea id="engineer-memo" name="engineer-memo" class="form-textarea" rows="10" placeholder="氏名　　：T.T（男性）\n年齢　　：40歳\n最寄り駅：両国駅\n国籍　　：日本\n経験年数：3年1ヶ月\n稼働時期：即日\n単価　　：70万円\n\n■スキル：\nReact/React Native/JavaScript/Next.js/TypeScript/Swift\n■工程：\n基本設計/詳細設計/実装/テスト/運用・保守\n\n■コメント\n・エンジニア歴は約3年です。\n・フロントエンジニアとして、React、Next.js、TypeScript、React Nativeを活用した開発を中心に携わってきました。\n・直近では、Swiftを活用したiOSネイティブ開発を行っていました。\n・設計～運用・保守まで1人称で対応可能です。\n　技術力も含めて伸びしろがあるエンジニアです。コミュニケーション面について心配はいらないかと思います。"></textarea>
                    </div>
                    <div class="form-group form-group-full">
                        <label class="form-label">スキルシートアップロード状況</label>
                        <div id="skill-sheet-status" class="skill-sheet-status">
                            <span class="skill-sheet-status-text">未アップロード</span>
                            <span><button type="button" class="btn btn-primary skill-sheet-upload-btn" id="skill-sheet-upload-btn"><i class="icon-ai"></i>スキルシートアップロード</button></span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- タブUI -->
            <div class="tab-container">
                <div class="tab-buttons">
                    <button type="button" class="tab-button active" data-tab="engineer-basic">エンジニア基本情報</button>
                    <button type="button" class="tab-button" data-tab="employee-info">社員情報</button>
                    <button type="button" class="tab-button" data-tab="skill-sheet">スキルシート</button>
                    <button type="button" class="tab-button" data-tab="projects">案件</button>
                </div>

                <!-- エンジニア基本情報タブ -->
                <div class="tab-content active" id="tab-engineer-basic">
                    <div class="form-section">
                        <h2 class="form-section-title">エンジニア基本情報</h2>
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="desired-location" class="form-label">希望勤務地</label>
                                <input type="text" id="desired-location" name="desired-location" class="form-input" placeholder="例) 東京23区、横浜市">
                            </div>
                            <div class="form-group">
                                <label for="desired-remote" class="form-label">希望リモート頻度</label>
                                <select class="form-input" name="desired-remote" id="desired-remote">
                                    <option value="">選択してください</option>
                                    <option value="full_office">フル出社可</option>
                                    <option value="week_1_2">週1-2日</option>
                                    <option value="week_2_3">週2-3日</option>
                                    <option value="week_3_4">週3-4日</option>
                                    <option value="week_4_5">週4-5日</option>
                                    <option value="full_remote">フルリモート</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="desired-price-min" class="form-label">希望単価</label>
                                <div class="form-grid">
                                    <input type="number" id="desired-price-min" name="desired-price-min" class="form-input" placeholder="万円" min="0">
                                    <input type="number" id="desired-price-max" name="desired-price-max" class="form-input" placeholder="万円" min="0">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="experience-years" class="form-label">経験年数</label>
                                <input type="number" id="experience-years" name="experience-years" class="form-input" placeholder="年" min="0" step="0.5">
                            </div>
                            <div class="form-group form-group-full">
                                <label class="form-label">エンジニア担当者</label>
                                <div class="form-select-wrapper">
                                    <button type="button" class="form-select-btn" id="engineer-managers-btn">
                                        <span class="form-select-text">選択してください</span>
                                        <span class="form-select-arrow">▼</span>
                                    </button>
                                    <div class="form-selected-values" id="engineer-managers-selected" style="display: none;">
                                        <div class="selected-values-list" id="engineer-managers-selected-list"></div>
                                        <button type="button" class="selected-value-remove-all" id="engineer-managers-remove-all">すべて解除</button>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group form-group-full">
                                <label class="form-label">ブラックリスト</label>
                                <div class="form-select-wrapper">
                                    <button type="button" class="form-select-btn" id="blacklist-btn">
                                        <span class="form-select-text">選択してください</span>
                                        <span class="form-select-arrow">▼</span>
                                    </button>
                                    <div class="form-selected-values" id="blacklist-selected" style="display: none;">
                                        <div class="selected-values-list" id="blacklist-selected-list"></div>
                                        <button type="button" class="selected-value-remove-all" id="blacklist-remove-all">すべて解除</button>
                                    </div>
                                </div>
                                <p class="form-help-text">このエンジニアを検索対象から除外する会社を選択します。</p>
                            </div>
                            <div class="form-group form-group-full">
                                <label for="engineer-note" class="form-label">備考</label>
                                <textarea id="engineer-note" name="engineer-note" class="form-textarea" rows="5" placeholder="エンジニアに関する備考を入力してください"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 社員情報タブ -->
                <div class="tab-content" id="tab-employee-info">
                    <app-employee-info-form></app-employee-info-form>
                </div>

                <!-- スキルシートタブ -->
                <div class="tab-content" id="tab-skill-sheet">
                    <div class="form-section">
                        <h2 class="form-section-title">スキルシート</h2>
                        
                        <!-- スキルシートダウンロード -->
                        <div class="skill-sheet-download-section">
                            <button type="button" class="btn btn-secondary skill-sheet-download-btn" id="skill-sheet-download-original">原本ダウンロード</button>
                            <button type="button" class="btn btn-secondary skill-sheet-download-btn" id="skill-sheet-download-generated">本システム生成ダウンロード</button>
                        </div>

                        <!-- スキル一覧テーブル -->
                        <div class="skill-list-table-section">
                            <div class="table-wrapper">
                                <table class="skill-list-table" id="skill-list-table">
                                    <thead>
                                        <tr>
                                            <th>スキル名</th>
                                            <th>スキルカテゴリ</th>
                                            <th>スキルレベル</th>
                                            <th>メモ</th>
                                            <th>アクション</th>
                                        </tr>
                                    </thead>
                                    <tbody id="skill-list-table-body">
                                        <!-- スキルがここに動的に追加される -->
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- スキル追加フォーム -->
                        <div class="skill-add-form-section">
                            <h3 class="form-subsection-title">スキル追加</h3>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="skill-category" class="form-label">スキルカテゴリ</label>
                                    <select id="skill-category" class="form-select">
                                        <option value="">選択してください</option>
                                        <option value="language">プログラミング言語</option>
                                        <option value="framework">フレームワーク</option>
                                        <option value="database">データベース</option>
                                        <option value="cloud">クラウド</option>
                                        <option value="tool">ツール</option>
                                        <option value="other">その他</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="skill-name" class="form-label">スキル名</label>
                                    <div class="skill-name-input-group">
                                        <select id="skill-master" class="form-select">
                                            <option value="">マスタから選択</option>
                                            <option value="1">Java</option>
                                            <option value="2">Spring Boot</option>
                                            <option value="3">React</option>
                                            <option value="4">PostgreSQL</option>
                                            <option value="5">AWS</option>
                                            <option value="6">Python</option>
                                            <option value="7">TypeScript</option>
                                            <option value="8">Docker</option>
                                        </select>
                                        <span class="skill-name-separator">または</span>
                                        <input type="text" id="skill-name-custom" class="form-input" placeholder="マスタにない場合は新規追加">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="skill-level" class="form-label">スキルレベル</label>
                                    <select id="skill-level" class="form-select">
                                        <option value="">選択してください</option>
                                        <option value="1">1（初級）</option>
                                        <option value="2">2（中級）</option>
                                        <option value="3">3（上級）</option>
                                        <option value="4">4（エキスパート）</option>
                                        <option value="5">5（マスター）</option>
                                    </select>
                                </div>
                                <div class="form-group form-group-full">
                                    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 8px;">
                                        <label for="skill-memo" class="form-label" style="margin-bottom: 0;">メモ</label>
                                        <button type="button" class="btn btn-info btn-sm" id="extract-skill-memo-btn"><i class="icon-ai"></i>スキルメモから情報抽出</button>
                                        <button type="button" class="btn btn-success btn-sm" id="generate-skill-memo-btn"><i class="icon-ai"></i>スキルメモを生成</button>
                                    </div>
                                    <textarea id="skill-memo" class="form-textarea" rows="2" placeholder="スキルに関するメモを入力してください"></textarea>
                                </div>
                                <div class="form-group form-group-full">
                                    <button type="button" class="btn btn-primary skill-add-btn" id="skill-add-btn">追加</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 案件タブ -->
                <div class="tab-content" id="tab-projects">
                    <div class="form-section">
                        <h2 class="form-section-title">案件</h2>
                        
                        <!-- 案件一覧テーブル -->
                        <div class="project-list-table-section">
                            <div class="table-wrapper">
                                <table class="project-list-table" id="project-list-table">
                                    <thead>
                                        <tr>
                                            <th>案件名</th>
                                            <th>案件提供会社</th>
                                            <th>ステータス</th>
                                            <th>面談日時</th>
                                            <th>稼働開始</th>
                                            <th>稼働終了</th>
                                            <th>アクション</th>
                                        </tr>
                                    </thead>
                                    <tbody id="project-list-table-body">
                                        <!-- 案件がここに動的に追加される -->
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- 案件追加ボタン -->
                        <div class="project-add-btn-section">
                            <button type="button" class="btn btn-primary project-add-btn" id="project-add-btn">案件追加</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- コンポーネント -->
            <app-engineer-representative-selector></app-engineer-representative-selector>
            <app-blacklist-selector></app-blacklist-selector>
            <app-skill-sheet-uploader></app-skill-sheet-uploader>
            <app-project-selector></app-project-selector>

            <!-- 案件追加フォームモーダル -->
            <div class="modal" id="project-add-modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">案件追加</h3>
                        <button type="button" class="modal-close" data-modal="project-add-modal">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-grid">
                            <div class="form-group form-group-full">
                                <label for="project-select" class="form-label">案件選択</label>
                                <div class="form-select-wrapper">
                                    <button type="button" class="form-select-btn" id="project-select-btn">
                                        <span class="form-select-text">選択してください</span>
                                        <span class="form-select-arrow">▼</span>
                                    </button>
                                    <div class="form-selected-value" id="project-selected" style="display: none;">
                                        <span class="selected-value-text"></span>
                                        <button type="button" class="selected-value-remove">×</button>
                                    </div>
                                </div>
                                <p class="form-help-text">本システムの案件と紐づける場合は選択してください。紐づけない場合は空欄のまま入力してください。</p>
                            </div>
                            <div class="form-group form-group-full">
                                <label for="operation-status" class="form-label">稼働ステータス</label>
                                <select id="operation-status" name="operation-status" class="form-select">
                                    <option value="">選択してください</option>
                                    <option value="waiting_entry">入場待ち</option>
                                    <option value="working">稼働中</option>
                                    <option value="leaving_soon">退場予定</option>
                                    <option value="left">退場済み</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="project-start-date" class="form-label">開始日</label>
                                <input type="date" id="project-start-date" name="project-start-date" class="form-input">
                            </div>
                            <div class="form-group">
                                <label for="project-end-date" class="form-label">終了日</label>
                                <input type="date" id="project-end-date" name="project-end-date" class="form-input">
                            </div>
                            <div class="form-group">
                                <label for="project-price" class="form-label">単価</label>
                                <input type="number" id="project-price" name="project-price" class="form-input" placeholder="万円" min="0">
                            </div>
                            <div class="form-group form-group-full">
                                <label for="project-work-content" class="form-label">業務内容</label>
                                <textarea id="project-work-content" name="project-work-content" class="form-textarea" rows="3" placeholder="業務内容を入力してください"></textarea>
                            </div>
                            <div class="form-group form-group-full">
                                <label for="project-languages-tools" class="form-label">言語・ツール</label>
                                <textarea id="project-languages-tools" name="project-languages-tools" class="form-textarea" rows="2" placeholder="使用した言語・ツールを入力してください"></textarea>
                            </div>
                            <div class="form-group form-group-full">
                                <label for="project-role-process" class="form-label">役割・工程</label>
                                <textarea id="project-role-process" name="project-role-process" class="form-textarea" rows="2" placeholder="役割・工程を入力してください"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-warning project-add-cancel-btn">キャンセル</button>
                        <button type="button" class="btn btn-primary project-add-confirm-btn">追加</button>
                    </div>
                </div>
            </div>
        `;
    }

    initTabs() {
        const tabButtons = this.querySelectorAll('.tab-button');
        const tabContents = this.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                this.activateTab(targetTab);
            });
        });
    }

    activateTab(tabName) {
        const tabButtons = this.querySelectorAll('.tab-button');
        const tabContents = this.querySelectorAll('.tab-content');

        // すべてのタブボタンとコンテンツからactiveクラスを削除
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // 指定されたタブボタンとコンテンツにactiveクラスを追加
        const targetButton = this.querySelector(`.tab-button[data-tab="${tabName}"]`);
        const targetContent = this.querySelector(`#tab-${tabName}`);

        if (targetButton) targetButton.classList.add('active');
        if (targetContent) targetContent.classList.add('active');
    }

    initSkillSheetUpload() {
        const uploadBtn = this.querySelector('#skill-sheet-upload-btn');
        const uploaderComponent = this.querySelector('app-skill-sheet-uploader');
        
        if (uploadBtn && uploaderComponent) {
            uploadBtn.addEventListener('click', () => {
                uploaderComponent.open(
                    // アップロード完了時のコールバック
                    (file) => {
                        this.updateSkillSheetStatus('アップロード済み', file.name);
                    },
                    // AI解析完了時のコールバック
                    (result) => {
                        this.updateSkillSheetStatus('解析完了', result.file.name);
                        // AI解析で抽出されたスキルをスキル一覧に追加
                        if (result.skills && result.skills.length > 0) {
                            result.skills.forEach(skill => {
                                this.addSkillToList(skill.name, skill.category, skill.level, skill.memo);
                            });
                        }
                        // AI解析で抽出された案件を案件一覧に追加
                        if (result.projects && result.projects.length > 0) {
                            result.projects.forEach(project => {
                                this.addProjectToList(project);
                            });
                        }
                    }
                );
            });
        }
    }

    updateSkillSheetStatus(status, fileName) {
        const statusDiv = this.querySelector('#skill-sheet-status');
        if (statusDiv) {
            const statusText = statusDiv.querySelector('.skill-sheet-status-text');
            if (statusText) {
                statusText.textContent = `${status}${fileName ? ': ' + fileName : ''}`;
            }
        }
    }

    initEngineerManagersSelection() {
        const selectBtn = this.querySelector('#engineer-managers-btn');
        const selectedDiv = this.querySelector('#engineer-managers-selected');
        const selectedList = this.querySelector('#engineer-managers-selected-list');
        const removeAllBtn = this.querySelector('#engineer-managers-remove-all');
        const selectorComponent = this.querySelector('app-engineer-representative-selector');
        
        let selectedItems = []; // 選択されたアイテムの配列

        // 選択されたアイテムを表示
        const renderSelectedItems = () => {
            if (!selectedList) return;
            
            selectedList.innerHTML = '';
            if (selectedItems.length === 0) {
                selectedDiv.style.display = 'none';
                if (selectBtn) selectBtn.style.display = 'flex';
                return;
            }

            selectedDiv.style.display = 'block';
            if (selectBtn) selectBtn.style.display = 'none';

            selectedItems.forEach((item, index) => {
                const tag = document.createElement('div');
                tag.className = 'selected-value-tag';
                tag.innerHTML = `
                    <span class="selected-value-text">${this.escapeHtml(item.name)}</span>
                    <button type="button" class="selected-value-remove" data-index="${index}">×</button>
                `;
                selectedList.appendChild(tag);
            });

            // 個別削除ボタンのイベントリスナー
            const removeButtons = selectedList.querySelectorAll('.selected-value-remove');
            removeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const index = parseInt(button.getAttribute('data-index'));
                    selectedItems.splice(index, 1);
                    renderSelectedItems();
                });
            });
        };

        // 選択ボタンクリック
        if (selectBtn) {
            selectBtn.addEventListener('click', () => {
                if (selectorComponent) {
                    selectorComponent.open(selectedItems, (newSelectedItems) => {
                        selectedItems = newSelectedItems;
                        renderSelectedItems();
                    });
                }
            });
        }

        // すべて解除ボタン
        if (removeAllBtn) {
            removeAllBtn.addEventListener('click', () => {
                selectedItems = [];
                renderSelectedItems();
            });
        }
    }

    initSkillListTable() {
        const skillTableBody = this.querySelector('#skill-list-table-body');
        const skillAddBtn = this.querySelector('#skill-add-btn');
        const skillCategory = this.querySelector('#skill-category');
        const skillMaster = this.querySelector('#skill-master');
        const skillNameCustom = this.querySelector('#skill-name-custom');
        const skillLevel = this.querySelector('#skill-level');
        const skillMemo = this.querySelector('#skill-memo');

        // スキル一覧を表示
        this.renderSkillList = () => {
            if (!skillTableBody) return;

            if (this.skills.length === 0) {
                skillTableBody.innerHTML = '<tr><td colspan="5" class="no-results">スキルが登録されていません</td></tr>';
                return;
            }

            skillTableBody.innerHTML = this.skills.map((skill, index) => {
                const categoryText = this.getCategoryText(skill.category);
                const levelText = this.getLevelText(skill.level);
                return `
                    <tr data-skill-index="${index}">
                        <td>${this.escapeHtml(skill.name)}</td>
                        <td>${this.escapeHtml(categoryText)}</td>
                        <td>${this.escapeHtml(levelText)}</td>
                        <td>${this.escapeHtml(skill.memo || '')}</td>
                        <td>
                            <button type="button" class="btn btn-secondary btn-sm skill-delete-btn" data-index="${index}">削除</button>
                        </td>
                    </tr>
                `;
            }).join('');

            // 削除ボタンのイベントリスナー
            const deleteButtons = skillTableBody.querySelectorAll('.skill-delete-btn');
            deleteButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const index = parseInt(button.getAttribute('data-index'));
                    this.removeSkillFromList(index);
                });
            });
        };

        // スキルを追加
        const addSkill = () => {
            const category = skillCategory ? skillCategory.value : '';
            const skillName = skillMaster && skillMaster.value 
                ? skillMaster.options[skillMaster.selectedIndex].text 
                : (skillNameCustom ? skillNameCustom.value.trim() : '');
            const level = skillLevel ? skillLevel.value : '';
            const memo = skillMemo ? skillMemo.value.trim() : '';

            if (!skillName) {
                alert('スキル名を入力または選択してください');
                return;
            }

            if (!category) {
                alert('スキルカテゴリを選択してください');
                return;
            }

            if (!level) {
                alert('スキルレベルを選択してください');
                return;
            }

            this.addSkillToList(skillName, category, level, memo);

            // フォームをクリア
            if (skillCategory) skillCategory.value = '';
            if (skillMaster) skillMaster.value = '';
            if (skillNameCustom) skillNameCustom.value = '';
            if (skillLevel) skillLevel.value = '';
            if (skillMemo) skillMemo.value = '';
        };

        // スキル追加ボタン
        if (skillAddBtn) {
            skillAddBtn.addEventListener('click', addSkill);
        }

        // スキルマスタ選択時、カスタム入力欄をクリア
        if (skillMaster) {
            skillMaster.addEventListener('change', function() {
                if (this.value && skillNameCustom) {
                    skillNameCustom.value = '';
                }
            });
        }

        // カスタム入力時、マスタ選択をクリア
        if (skillNameCustom) {
            skillNameCustom.addEventListener('input', function() {
                if (this.value && skillMaster) {
                    skillMaster.value = '';
                }
            });
        }

        // 初期表示
        this.renderSkillList();
    }

    addSkillToList(name, category, level, memo) {
        // 既に追加されているかチェック
        if (this.skills.find(s => s.name === name && s.category === category)) {
            alert('このスキルは既に追加されています');
            return;
        }

        const skill = {
            name: name,
            category: category,
            level: parseInt(level),
            memo: memo || ''
        };
        this.skills.push(skill);
        this.renderSkillList();
    }

    removeSkillFromList(index) {
        if (confirm('このスキルを削除しますか？')) {
            this.skills.splice(index, 1);
            this.renderSkillList();
        }
    }

    getCategoryText(category) {
        const categoryMap = {
            'language': 'プログラミング言語',
            'framework': 'フレームワーク',
            'database': 'データベース',
            'cloud': 'クラウド',
            'tool': 'ツール',
            'other': 'その他'
        };
        return categoryMap[category] || category;
    }

    getLevelText(level) {
        const levelMap = {
            1: '1（初級）',
            2: '2（中級）',
            3: '3（上級）',
            4: '4（エキスパート）',
            5: '5（マスター）'
        };
        return levelMap[level] || level;
    }

    initProjectListTable() {
        const projectTableBody = this.querySelector('#project-list-table-body');
        const projectAddBtn = this.querySelector('#project-add-btn');
        const projectSelector = this.querySelector('app-project-selector');
        const projectAddModal = this.querySelector('#project-add-modal');
        const projectSelectBtn = this.querySelector('#project-select-btn');
        const projectSelected = this.querySelector('#project-selected');
        const projectAddConfirmBtn = this.querySelector('.project-add-confirm-btn');
        const projectAddCancelBtn = this.querySelector('.project-add-cancel-btn');

        let selectedProjectData = null;
        let editingProjectIndex = null; // 編集中の案件インデックス

        // 案件一覧を表示
        this.renderProjectList = () => {
            if (!projectTableBody) return;

            if (this.projects.length === 0) {
                projectTableBody.innerHTML = '<tr><td colspan="7" class="no-results">案件が登録されていません</td></tr>';
                return;
            }

            // 日付で降順ソート
            // 優先順位: 稼働終了 > 稼働開始 > 面談日時
            const sortedProjects = [...this.projects].sort((a, b) => {
                const getDateValue = (project) => {
                    if (project.endDate) return new Date(project.endDate).getTime();
                    if (project.startDate) return new Date(project.startDate).getTime();
                    if (project.interviewDate) return new Date(project.interviewDate).getTime();
                    return 0; // 日付がない場合は一番最後（または最初）にするか？ここでは0（最古）扱い
                };

                const dateA = getDateValue(a);
                const dateB = getDateValue(b);

                return dateB - dateA; // 降順
            });

            projectTableBody.innerHTML = sortedProjects.map((project, index) => {
                // 元の配列のインデックスを見つける（編集・削除用）
                const originalIndex = this.projects.indexOf(project);

                const startDate = project.startDate ? this.formatDate(project.startDate) : '-';
                const endDate = project.endDate ? this.formatDate(project.endDate) : '-';
                const projectName = project.projectName || project.projectData?.name || '未紐づけ案件';
                const companyName = project.companyName || '-';
                
                // ステータスバッジの生成
                let statusBadge = '-';
                if (project.status) {
                    const statusMap = {
                        'waiting_entry': { text: '入場待ち', class: 'badge-status-pending' },
                        'working': { text: '稼働中', class: 'badge-status-active' },
                        'leaving_soon': { text: '退場予定', class: 'badge-status-warning' },
                        'left': { text: '退場済み', class: 'badge-status-inactive' },
                        'interview_pending': { text: '面談予定', class: 'badge-status-pending' },
                        'interview_completed': { text: '面談完了', class: 'badge-status-completed' },
                        'interview_rejected': { text: '不合格', class: 'badge-status-inactive' },
                        'interview_declined': { text: '辞退', class: 'badge-status-inactive' }
                    };
                    const statusInfo = statusMap[project.status] || { text: project.status, class: 'badge-secondary' };
                    statusBadge = `<span class="badge ${statusInfo.class}">${statusInfo.text}</span>`;
                }

                const interviewDate = project.interviewDate ? this.formatDate(project.interviewDate, true) : '-';
                
                // 案件名のリンクを条件分岐で設定
                let projectLinkHtml = '';
                if (project.projectId) {
                    const isOwnProject = project.isOwnProject !== undefined ? project.isOwnProject : (project.projectData ? true : false);
                    const linkUrl = isOwnProject 
                        ? `project-edit.html?id=${project.projectId}` 
                        : `public-project-detail.html?id=${project.projectId}`;
                    
                    const ownBadge = isOwnProject ? '<span class="badge-own-item">自</span>' : '';
                    projectLinkHtml = `<a href="${linkUrl}" class="table-link">${ownBadge}${this.escapeHtml(projectName)}</a>`;
                } else {
                    projectLinkHtml = this.escapeHtml(projectName);
                }

                return `
                    <tr data-project-index="${index}">
                        <td>
                            ${projectLinkHtml}
                        </td>
                        <td>${this.escapeHtml(companyName)}</td>
                        <td>${statusBadge}</td>
                        <td>${interviewDate}</td>
                        <td>${startDate}</td>
                        <td>${endDate}</td>
                        <td>
                            <div class="table-actions">
                                <button type="button" class="btn btn-secondary btn-sm project-edit-btn" data-index="${originalIndex}">編集</button>
                                <button type="button" class="btn btn-danger btn-sm project-delete-btn" data-index="${originalIndex}">削除</button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');

            // 編集ボタンのイベントリスナー
            const editButtons = projectTableBody.querySelectorAll('.project-edit-btn');
            editButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const index = parseInt(button.getAttribute('data-index'));
                    openProjectEditModal(index);
                });
            });

            // 削除ボタンのイベントリスナー
            const deleteButtons = projectTableBody.querySelectorAll('.project-delete-btn');
            deleteButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const index = parseInt(button.getAttribute('data-index'));
                    this.removeProjectFromList(index);
                });
            });
        };

        // 案件編集モーダルを開く
        this.openProjectEdit = (index) => {
            if (index < 0 || index >= this.projects.length) return;

            editingProjectIndex = index;
            const project = this.projects[index];

            // モーダルに既存データをセット
            if (project.projectId && project.projectData) {
                selectedProjectData = project.projectData;
                const selectedText = projectSelected.querySelector('.selected-value-text');
                if (selectedText) {
                    selectedText.textContent = project.projectData.name;
                }
                projectSelected.style.display = 'flex';
                projectSelectBtn.style.display = 'none';
            } else {
                selectedProjectData = null;
                projectSelected.style.display = 'none';
                projectSelectBtn.style.display = 'flex';
            }

            this.querySelector('#project-start-date').value = project.startDate || '';
            this.querySelector('#project-end-date').value = project.endDate || '';
            this.querySelector('#project-price').value = project.price || '';
            this.querySelector('#project-work-content').value = project.workContent || '';
            this.querySelector('#project-languages-tools').value = project.languagesTools || '';
            this.querySelector('#project-role-process').value = project.roleProcess || '';
            this.querySelector('#operation-status').value = project.status || ''; // ステータスもセット

            // モーダルタイトルを変更
            const modalTitle = projectAddModal.querySelector('.modal-title');
            if (modalTitle) {
                modalTitle.textContent = '案件編集';
            }

            // モーダルを開く
            if (projectAddModal) {
                projectAddModal.classList.add('active');
            }
        };

        const openProjectEditModal = this.openProjectEdit;

        // 案件追加モーダルを開く（新規追加）
        const openProjectAddModal = () => {
            editingProjectIndex = null;
            selectedProjectData = null;
            projectSelected.style.display = 'none';
            if (projectSelectBtn) projectSelectBtn.style.display = 'flex';
            this.querySelector('#project-start-date').value = '';
            this.querySelector('#project-end-date').value = '';
            this.querySelector('#project-price').value = '';
            this.querySelector('#project-work-content').value = '';
            this.querySelector('#project-languages-tools').value = '';
            this.querySelector('#project-role-process').value = '';

            // モーダルタイトルを変更
            const modalTitle = projectAddModal.querySelector('.modal-title');
            if (modalTitle) {
                modalTitle.textContent = '追加';
            }

            // モーダルを開く
            if (projectAddModal) {
                projectAddModal.classList.add('active');
            }
        };

        // 案件選択ボタン
        if (projectSelectBtn && projectSelector) {
            projectSelectBtn.addEventListener('click', () => {
                projectSelector.open((projectData) => {
                    selectedProjectData = projectData;
                    const selectedText = projectSelected.querySelector('.selected-value-text');
                    if (selectedText) {
                        selectedText.textContent = projectData.name;
                    }
                    projectSelected.style.display = 'flex';
                    projectSelectBtn.style.display = 'none';
                });
            });
        }

        // 案件選択解除
        const projectRemoveBtn = projectSelected ? projectSelected.querySelector('.selected-value-remove') : null;
        if (projectRemoveBtn) {
            projectRemoveBtn.addEventListener('click', () => {
                selectedProjectData = null;
                projectSelected.style.display = 'none';
                if (projectSelectBtn) projectSelectBtn.style.display = 'flex';
            });
        }

        // 案件追加確定ボタン
        if (projectAddConfirmBtn) {
            projectAddConfirmBtn.addEventListener('click', () => {
                const startDate = this.querySelector('#project-start-date').value;
                const endDate = this.querySelector('#project-end-date').value;
                const price = this.querySelector('#project-price').value;
                const workContent = this.querySelector('#project-work-content').value;
                const languagesTools = this.querySelector('#project-languages-tools').value;
                const roleProcess = this.querySelector('#project-role-process').value;

                const project = {
                    projectId: selectedProjectData ? selectedProjectData.id : null,
                    projectData: selectedProjectData,
                    projectName: selectedProjectData ? selectedProjectData.name : null,
                    isOwnProject: selectedProjectData ? true : false,
                    startDate: startDate || null,
                    endDate: endDate || null,
                    price: price || null,
                    workContent: workContent || '',
                    languagesTools: languagesTools || '',
                    roleProcess: roleProcess || ''
                };

                if (editingProjectIndex !== null) {
                    // 編集モード：既存データを更新
                    this.projects[editingProjectIndex] = project;
                } else {
                    // 新規追加モード：新しいデータを追加
                    this.projects.push(project);
                }

                this.renderProjectList();

                // フォームをクリア
                if (projectAddModal) projectAddModal.classList.remove('active');
                editingProjectIndex = null;
                selectedProjectData = null;
                if (projectSelected) projectSelected.style.display = 'none';
                if (projectSelectBtn) projectSelectBtn.style.display = 'flex';
                this.querySelector('#project-start-date').value = '';
                this.querySelector('#project-end-date').value = '';
                this.querySelector('#project-price').value = '';
                this.querySelector('#project-work-content').value = '';
                this.querySelector('#project-languages-tools').value = '';
                this.querySelector('#project-role-process').value = '';
            });
        }

        // 案件追加キャンセルボタン
        if (projectAddCancelBtn) {
            projectAddCancelBtn.addEventListener('click', () => {
                if (projectAddModal) projectAddModal.classList.remove('active');
                editingProjectIndex = null;
                selectedProjectData = null;
                if (projectSelected) projectSelected.style.display = 'none';
                if (projectSelectBtn) projectSelectBtn.style.display = 'flex';
                this.querySelector('#project-start-date').value = '';
                this.querySelector('#project-end-date').value = '';
                this.querySelector('#project-price').value = '';
                this.querySelector('#project-work-content').value = '';
                this.querySelector('#project-languages-tools').value = '';
                this.querySelector('#project-role-process').value = '';
            });
        }

        // 案件追加ボタン
        if (projectAddBtn) {
            projectAddBtn.addEventListener('click', () => {
                openProjectAddModal();
            });
        }

        // 初期表示
        this.renderProjectList();
    }

    addProjectToList(projectData) {
        const project = {
            projectId: projectData.projectId || null,
            projectData: projectData.projectData || null,
            projectName: projectData.projectName || null,
            isOwnProject: false,
            startDate: projectData.startDate || null,
            endDate: projectData.endDate || null,
            price: projectData.price || null,
            workContent: projectData.workContent || '',
            languagesTools: projectData.languagesTools || '',
            roleProcess: projectData.roleProcess || ''
        };

        this.projects.push(project);
        this.renderProjectList();
    }

    removeProjectFromList(index) {
        if (confirm('この案件を削除しますか？')) {
            this.projects.splice(index, 1);
            this.renderProjectList();
        }
    }

    initBlacklistSelection() {
        const selectBtn = this.querySelector('#blacklist-btn');
        const selectedDiv = this.querySelector('#blacklist-selected');
        const selectedList = this.querySelector('#blacklist-selected-list');
        const removeAllBtn = this.querySelector('#blacklist-remove-all');
        const selectorComponent = this.querySelector('app-blacklist-selector');
        
        let selectedItems = []; // 選択されたアイテムの配列

        // 選択されたアイテムを表示
        const renderSelectedItems = () => {
            if (!selectedList) return;
            
            selectedList.innerHTML = '';
            if (selectedItems.length === 0) {
                selectedDiv.style.display = 'none';
                if (selectBtn) selectBtn.style.display = 'flex';
                return;
            }

            selectedDiv.style.display = 'block';
            if (selectBtn) selectBtn.style.display = 'none';

            selectedItems.forEach((item, index) => {
                const tag = document.createElement('div');
                tag.className = 'selected-value-tag';
                // LIKEパターンの場合は視覚的に区別
                const isLikePattern = item.type === 'like';
                if (isLikePattern) {
                    tag.classList.add('selected-value-tag-like');
                }
                tag.innerHTML = `
                    <span class="selected-value-text">${this.escapeHtml(item.name)}${isLikePattern ? ' (LIKE)' : ''}</span>
                    <button type="button" class="selected-value-remove" data-index="${index}">×</button>
                `;
                selectedList.appendChild(tag);
            });

            // 個別削除ボタンのイベントリスナー
            const removeButtons = selectedList.querySelectorAll('.selected-value-remove');
            removeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const index = parseInt(button.getAttribute('data-index'));
                    selectedItems.splice(index, 1);
                    renderSelectedItems();
                });
            });
        };

        // 選択ボタンクリック
        if (selectBtn) {
            selectBtn.addEventListener('click', () => {
                if (selectorComponent) {
                    selectorComponent.open(selectedItems, (newSelectedItems) => {
                        selectedItems = newSelectedItems;
                        renderSelectedItems();
                    });
                }
            });
        }

        // すべて解除ボタン
        if (removeAllBtn) {
            removeAllBtn.addEventListener('click', () => {
                selectedItems = [];
                renderSelectedItems();
            });
        }
    }

    initModals() {
        // モーダルを閉じる
        const closeButtons = this.querySelectorAll('.modal-close');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modalId = button.getAttribute('data-modal');
                const modal = this.querySelector(`#${modalId}`);
                if (modal) {
                    modal.classList.remove('active');
                }
            });
        });

        // オーバーレイクリックで閉じる
        const overlays = this.querySelectorAll('.modal-overlay');
        overlays.forEach(overlay => {
            overlay.addEventListener('click', () => {
                const modal = overlay.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    initSkillMemoButtons() {
        const extractBtn = this.querySelector('#extract-skill-memo-btn');
        const generateBtn = this.querySelector('#generate-skill-memo-btn');
    
        if (extractBtn) {
            extractBtn.addEventListener('click', function() {
                alert('スキルメモから情報抽出機能は後で実装予定です。');
            });
        }
    
        if (generateBtn) {
            generateBtn.addEventListener('click', function() {
                alert('スキルメモを生成機能は後で実装予定です。');
            });
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    }

    getFormData() {
        const employeeInfoForm = this.querySelector('app-employee-info-form');
        const employeeInfo = employeeInfoForm ? employeeInfoForm.getFormData() : {};

        return {
            salesStatus: this.querySelector('#sales-status').value,
            engineerStatus: this.querySelector('#engineer-status').value,
            availableDate: this.querySelector('#available-date').value,
            engineerMemo: this.querySelector('#engineer-memo').value,
            desiredLocation: this.querySelector('#desired-location').value,
            desiredRemote: this.querySelector('#desired-remote').value,
            desiredPriceMin: this.querySelector('#desired-price-min').value,
            desiredPriceMax: this.querySelector('#desired-price-max').value,
            experienceYears: this.querySelector('#experience-years').value,
            engineerNote: this.querySelector('#engineer-note').value,
            ...employeeInfo,
            skills: this.skills,
            projects: this.projects
        };
    }

    setFormData(data) {
        if (!data) return;

        if (data.salesStatus) this.querySelector('#sales-status').value = data.salesStatus;
        if (data.engineerMemo) this.querySelector('#engineer-memo').value = data.engineerMemo;
        if (data.desiredLocation) this.querySelector('#desired-location').value = data.desiredLocation;
        if (data.desiredRemote) this.querySelector('#desired-remote').value = data.desiredRemote;
        if (data.desiredPriceMin) this.querySelector('#desired-price-min').value = data.desiredPriceMin;
        if (data.desiredPriceMax) this.querySelector('#desired-price-max').value = data.desiredPriceMax;
        if (data.experienceYears) this.querySelector('#experience-years').value = data.experienceYears;
        if (data.engineerNote) this.querySelector('#engineer-note').value = data.engineerNote;

        const employeeInfoForm = this.querySelector('app-employee-info-form');
        if (employeeInfoForm && data.employeeInfo) {
            employeeInfoForm.setFormData(data.employeeInfo);
        }

        if (data.skills) {
            this.skills = data.skills;
            this.renderSkillList();
        }

        if (data.projects) {
            this.projects = data.projects;
            this.renderProjectList();
        }
    }

    validateForm() {
        let isValid = true;
        let errorMessage = '';

        // 営業可否
        const salesStatus = this.querySelector('#sales-status');
        if (!salesStatus || !salesStatus.value) {
            isValid = false;
            errorMessage += '営業可否を選択してください\n';
        }

        // ステータス
        const engineerStatus = this.querySelector('#engineer-status');
        if (!engineerStatus || !engineerStatus.value) {
            isValid = false;
            errorMessage += 'ステータスを選択してください\n';
        }

        // 希望単価の整合性チェック
        const priceMin = this.querySelector('#desired-price-min');
        const priceMax = this.querySelector('#desired-price-max');
        if (priceMin && priceMax && priceMin.value && priceMax.value) {
            if (parseInt(priceMin.value) > parseInt(priceMax.value)) {
                isValid = false;
                errorMessage += '希望単価（最小）は希望単価（最大）以下に設定してください\n';
            }
        }

        // 社員情報のバリデーション
        const employeeInfoForm = this.querySelector('app-employee-info-form');
        if (employeeInfoForm && employeeInfoForm.validateForm && !employeeInfoForm.validateForm()) {
            isValid = false;
            // employeeInfoForm内でエラーメッセージが表示されることを想定
        }

        if (!isValid && errorMessage) {
            alert(errorMessage);
        }

        return isValid;
    }
}

customElements.define('app-engineer-form', AppEngineerForm);

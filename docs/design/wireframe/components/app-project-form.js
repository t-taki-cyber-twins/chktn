class AppProjectForm extends HTMLElement {
    constructor() {
        super();
        this.skills = [];
        this.selectedCompany = null;
        this.selectedManagers = [];
        this.selectedBlacklist = [];
        this.selectedMailingList = [];
        this.selectedContactMailingList = [];
        this.selectedInternalNotificationMailingList = [];
    }

    connectedCallback() {
        this.render();
        this.initEventListeners();
        this.initSubComponents();
    }

    render() {
        this.innerHTML = `
            <div class="project-form">
                <!-- 基本情報セクション -->
                <div class="form-section">
                    <h2 class="section-title">基本情報</h2>
                    <div class="form-grid">
                        <div class="form-group form-group-full">
                            <label for="project-recruit-status" class="form-label">募集可否 <span class="form-required">*</span></label>
                            <select id="project-recruit-status" name="project-recruit-status" class="form-select">
                                <option value="available">募集可</option>
                                <option value="working">募集不可</option>
                            </select>
                        </div>
                        <div class="form-group form-group-full">
                            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 8px;">
                                <label for="project-description" class="form-label" style="margin-bottom: 0;">案件メモ</label>
                                <button type="button" class="btn btn-info btn-sm" id="extract-project-memo-btn"><i class="icon-ai"></i>案件メモから情報抽出</button>
                                &nbsp;
                                <select id="project-memo-template-select" class="form-select" style="width: auto; display: inline-block;">
                                    <option value="">テンプレート選択</option>
                                    <option value="1">通常案件メモ</option>
                                    <option value="2">AI案件メモ</option>
                                </select>
                                <button type="button" class="btn btn-success btn-sm" id="generate-project-memo-btn"><i class="icon-ai"></i>案件メモを生成</button>
                                <button type="button" class="btn btn-secondary btn-sm" id="edit-project-memo-template-btn">案件メモテンプレート編集</button>
                            </div>
                            <textarea id="project-description" name="project-description" class="form-textarea" rows="10" placeholder="案件の詳細を入力してください"></textarea>
                        </div>
                        <div class="form-group form-group-full">
                            <label for="project-name" class="form-label">案件名 <span class="form-required">*</span></label>
                            <input type="text" id="project-name" name="project-name" class="form-input" placeholder="案件名を入力してください">
                        </div>
                        <div class="form-group">
                            <label for="end-company" class="form-label">案件エンド会社 <span class="form-required">*</span></label>
                            <div class="form-select-wrapper">
                                <button type="button" class="form-select-btn" id="end-company-btn">
                                    <span class="form-select-text">選択してください</span>
                                    <span class="form-select-arrow">▼</span>
                                </button>
                                <div class="form-selected-value" id="end-company-selected" style="display: none;">
                                    <span class="selected-value-text"></span>
                                    <button type="button" class="selected-value-remove">×</button>
                                </div>
                            </div>
                        </div>
                        <div class="form-group form-group-full">
                            <label for="project-summary" class="form-label">案件概要</label>
                            <textarea id="project-summary" name="project-summary" class="form-textarea" rows="3" placeholder="案件の概要を入力してください"></textarea>
                        </div>
                    </div>
                </div>

                <!-- スキル情報セクション -->
                <div class="form-section">
                    <h2 class="section-title">案件スキル</h2>
                    <div class="form-group form-group-full">
                        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 8px;">
                            <label for="skill-memo" class="form-label">スキルメモ</label>
                            <button type="button" class="btn btn-info btn-sm" id="extract-skill-memo-btn"><i class="icon-ai"></i>スキルメモからスキル情報を抽出</button>
                        </div>
                        <textarea id="skill-memo" name="skill-memo" class="form-textarea"></textarea>
                    </div>
                    <h3 class="section-title">必須スキル</h3>
                    <div class="form-group form-group-full">
                        <div class="skill-selector">
                            <div class="skill-select-header">
                                <select id="skill-master" class="form-select">
                                    <option value="">スキルを選択してください</option>
                                    <option value="1">Java</option>
                                    <option value="2">Spring Boot</option>
                                    <option value="3">React</option>
                                    <option value="4">PostgreSQL</option>
                                    <option value="5">AWS</option>
                                </select>
                                <input type="text" id="skill-custom" class="form-input skill-custom-input" placeholder="マスタにない場合は新規追加">
                                <button type="button" class="btn btn-secondary skill-add-btn">追加</button>
                            </div>
                            <div class="skill-list" id="skill-list">
                                <!-- 選択されたスキルがここに表示される -->
                            </div>
                        </div>
                    </div>
                    <h3 class="section-title">尚可スキル</h3>
                    <div class="form-group form-group-full">
                        <div class="skill-selector">
                            <div class="skill-select-header">
                                <select id="skill-master" class="form-select">
                                    <option value="">スキルを選択してください</option>
                                    <option value="1">Java</option>
                                    <option value="2">Spring Boot</option>
                                    <option value="3">React</option>
                                    <option value="4">PostgreSQL</option>
                                    <option value="5">AWS</option>
                                </select>
                                <input type="text" id="skill-custom" class="form-input skill-custom-input" placeholder="マスタにない場合は新規追加">
                                <button type="button" class="btn btn-secondary skill-add-btn">追加</button>
                            </div>
                            <div class="skill-list" id="skill-list">
                                <!-- 選択されたスキルがここに表示される -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 詳細情報セクション -->
                <div class="form-section">
                    <h2 class="section-title">詳細情報</h2>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="start-date" class="form-label">開始日</label>
                            <input type="date" id="start-date" name="start-date" class="form-input">
                        </div>
                        <div class="form-group">
                            <label for="end-date" class="form-label">終了日</label>
                            <input type="date" id="end-date" name="end-date" class="form-input">
                        </div>
                        
                        <div class="form-group">
                            <label for="interview-number" class="form-label">面談回数 <span class="form-required">*</span></label>
                            <input type="number" id="interview-number" name="interview-number" class="form-input" min="1">
                        </div>
                        <div class="form-group">
                            <label for="member-number" class="form-label">募集人数</label>
                            <input type="number" id="member-number" name="member-number" class="form-input" min="1">
                        </div>
                        
                        <div class="form-group">
                            <label for="age-range" class="form-label">希望年齢幅</label>
                            <input type="text" id="age-range" name="age-range" class="form-input" placeholder="例: 25-35">
                        </div>
                        <div class="form-group">
                            <label for="foreigner" class="form-label">外国籍</label>
                            <select id="foreigner" name="foreigner" class="form-input">
                                <option value="">選択してください</option>
                                <option value="1">可</option>
                                <option value="2">不可</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="work-location" class="form-label">勤務地 <span class="form-required">*</span></label>
                            <input type="text" id="work-location" name="work-location" class="form-input" placeholder="例: 東京都千代田区">
                        </div>
                        <div class="form-group">
                            <label for="desired-remote" class="form-label">希望リモート頻度</label>
                            <select id="desired-remote" name="desired-remote" class="form-input">
                                <option value="">選択してください</option>
                                <option value="full-office">フル出社</option>
                                <option value="week-1-2">週1-2日</option>
                                <option value="week-2-3">週2-3日</option>
                                <option value="week-3-4">週3-4日</option>
                                <option value="week-4-5">週4-5日</option>
                                <option value="full-remote">フルリモート可</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="contract-type" class="form-label">契約形態 <span class="form-required">*</span></label>
                            <select id="contract-type" name="contract-type" class="form-select">
                                <option value="">選択してください</option>
                                <option value="subcontracting">業務委託(準委任)</option>
                                <option value="contracting">業務委託(請負)</option>
                                <option value="contract-employee">契約社員</option>
                                <option value="full-time">正社員</option>
                                <option value="freelance">フリーランス</option>
                                <option value="part-time">パートタイム</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="desired-price" class="form-label">希望単価</label>
                            <div class="form-grid">
                                <input type="number" id="desired-price-min" name="desired-price-min" class="form-input" placeholder="最小(万円)" min="0">
                                <input type="number" id="desired-price-max" name="desired-price-max" class="form-input" placeholder="最大(万円)" min="0">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="payment-site" class="form-label">支払いサイト <span class="form-required">*</span></label>
                            <input type="text" id="payment-site" name="payment-site" class="form-input" placeholder="30日（月末締め翌月末支払い）">
                        </div>
                        <div class="form-group">
                            <label for="payment-time" class="form-label">精算時間</label>
                            <div class="form-grid">
                                <input type="number" id="payment-time-min" name="payment-time-min" class="form-input" placeholder="最小(h)" min="0">
                                <input type="number" id="payment-time-max" name="payment-time-max" class="form-input" placeholder="最大(h)" min="0">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 連絡先情報セクション -->
                <div class="form-section">
                    <h2 class="section-title">連絡先情報</h2>
                    <div class="form-grid">
                        <div class="form-group form-group-full">
                            <label for="project-manager" class="form-label">案件担当者</label>
                            <div class="form-select-wrapper">
                                <button type="button" class="form-select-btn" id="project-manager-btn">
                                    <span class="form-select-text">選択してください</span>
                                    <span class="form-select-arrow">▼</span>
                                </button>
                                <div class="form-selected-values" id="project-manager-selected" style="display: none;">
                                    <div class="selected-values-list" id="project-manager-selected-list"></div>
                                    <button type="button" class="selected-value-remove-all" id="project-manager-remove-all">すべて解除</button>
                                </div>
                            </div>
                            <p class="form-help-text">案件を担当する社員を選択します(複数選択可)。</p>
                        </div>
                        <div class="form-group form-group-full">
                            <label class="form-label">連絡先メーリングリスト</label>
                            <div class="form-select-wrapper">
                                <button type="button" class="form-select-btn" id="contact-mailing-list-btn">
                                    <span class="form-select-text">選択してください</span>
                                    <span class="form-select-arrow">▼</span>
                                </button>
                                <div class="form-selected-values" id="contact-mailing-list-selected" style="display: none;">
                                    <div class="selected-values-list" id="contact-mailing-list-selected-list"></div>
                                    <button type="button" class="selected-value-remove-all" id="contact-mailing-list-remove-all">すべて解除</button>
                                </div>
                            </div>
                            <p class="form-help-text">案件に関する連絡に使用するメーリングリストを選択します。</p>
                        </div>
                        <div class="form-group form-group-full">
                            <label for="contact-email-custom" class="form-label">連絡先メールアドレス (自由入力)</label>
                            <input type="email" id="contact-email-custom" name="contact-email-custom" class="form-input" placeholder="例: project-contact@example.com">
                            <p class="form-help-text">メーリングリストに含まれない個別のメールアドレスを入力できます。</p>
                        </div>
                    </div>
                </div>

                <!-- 非公開情報セクション -->
                <div class="form-section">
                    <h2 class="section-title">非公開情報</h2>
                    <div class="form-grid">
                        <div class="form-group form-group-full">
                            <label class="form-label">社内通知メーリングリスト</label>
                            <div class="form-select-wrapper">
                                <button type="button" class="form-select-btn" id="internal-notification-mailing-list-btn">
                                    <span class="form-select-text">選択してください</span>
                                    <span class="form-select-arrow">▼</span>
                                </button>
                                <div class="form-selected-values" id="internal-notification-mailing-list-selected" style="display: none;">
                                    <div class="selected-values-list" id="internal-notification-mailing-list-selected-list"></div>
                                    <button type="button" class="selected-value-remove-all" id="internal-notification-mailing-list-remove-all">すべて解除</button>
                                </div>
                            </div>
                            <p class="form-help-text">社内への通知に使用するメーリングリストを選択します。この情報は公開されません。</p>
                        </div>
                    </div>
                </div>

                <!-- 公開設定セクション -->
                <div class="form-section">
                    <h2 class="section-title">公開設定</h2>
                    <div class="form-grid">
                        <div class="form-group form-group-full">
                            <div class="form-row">
                                <div class="form-col">
                                    <label class="form-label">公開設定</label>
                                    <div class="form-checkbox-group">
                                        <label class="form-checkbox-label">
                                            <input type="checkbox" id="is-public" name="is-public" class="form-checkbox">
                                            <span>公開する</span>
                                        </label>
                                    </div>
                                    <p class="form-help-text">公開にチェックを入れると、他の会社からもこの案件を検索できるようになります。</p>
                                </div>
                                <div class="form-col">
                                    <label for="blacklist" class="form-label">ブラックリスト</label>
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
                                    <p class="form-help-text">この案件を検索対象から除外する会社を選択します。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- モーダル類 -->
            <div class="modal" id="end-company-modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">取引先会社を選択</h3>
                        <button type="button" class="modal-close" data-modal="end-company-modal">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-search">
                            <input type="text" class="form-input modal-search-input" placeholder="会社名で検索">
                            <button type="button" class="btn btn-info modal-search-btn">検索</button>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn btn-secondary modal-new-btn">新規取引先登録</button>
                        </div>
                        <div class="modal-list">
                            <ul class="company-list">
                                <li class="company-list-item">
                                    <button type="button" class="company-list-btn" data-company-id="1" data-company-name="サンプル株式会社">
                                        <span class="company-name">サンプル株式会社</span>
                                        <span class="company-code">法人番号: 1234567890123</span>
                                    </button>
                                </li>
                                <li class="company-list-item">
                                    <button type="button" class="company-list-btn" data-company-id="2" data-company-name="テック株式会社">
                                        <span class="company-name">テック株式会社</span>
                                        <span class="company-code">法人番号: 2345678901234</span>
                                    </button>
                                </li>
                                <li class="company-list-item">
                                    <button type="button" class="company-list-btn" data-company-id="3" data-company-name="デザイン株式会社">
                                        <span class="company-name">デザイン株式会社</span>
                                        <span class="company-code">法人番号: 3456789012345</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <app-employee-selector id="project-manager-selector"></app-employee-selector>

            <app-blacklist-selector></app-blacklist-selector>
            <app-mailing-list-selector></app-mailing-list-selector>
        `;
    }

    initEventListeners() {
        this.initModals();
        this.initCompanySelection();
        this.initProjectManagerSelection();
        this.initSkillSelection();
        this.initBlacklistSelection();
        this.initMailingListSelection();
        this.initContactMailingListSelection();
        this.initInternalNotificationMailingListSelection();
        this.initAiButtons();
    }

    initSubComponents() {
        // サブコンポーネントの初期化が必要な場合はここに記述
    }

    initModals() {
        const openButtons = {
            'end-company-btn': 'end-company-modal'
        };

        Object.keys(openButtons).forEach(buttonId => {
            const button = this.querySelector(`#${buttonId}`);
            const modalId = openButtons[buttonId];
            
            if (button) {
                button.addEventListener('click', () => {
                    const modal = this.querySelector(`#${modalId}`);
                    if (modal) {
                        modal.classList.add('active');
                    }
                });
            }
        });

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

    initCompanySelection() {
        const companyButtons = this.querySelectorAll('.company-list-btn');
        const modal = this.querySelector('#end-company-modal');

        companyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const companyId = button.getAttribute('data-company-id');
                const companyName = button.getAttribute('data-company-name');
                
                this.selectedCompany = { id: companyId, name: companyName };
                this.renderSelectedCompany();
                
                if (modal) {
                    modal.classList.remove('active');
                }
            });
        });

        const removeBtn = this.querySelector('#end-company-selected .selected-value-remove');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                this.selectedCompany = null;
                this.renderSelectedCompany();
            });
        }
    }

    renderSelectedCompany() {
        const selectedDiv = this.querySelector('#end-company-selected');
        const selectBtn = this.querySelector('#end-company-btn');
        const selectedText = selectedDiv.querySelector('.selected-value-text');

        if (this.selectedCompany) {
            if (selectedText) selectedText.textContent = this.selectedCompany.name;
            selectedDiv.style.display = 'flex';
            selectBtn.style.display = 'none';
        } else {
            selectedDiv.style.display = 'none';
            selectBtn.style.display = 'flex';
        }
    }

    initProjectManagerSelection() {
        const selectBtn = this.querySelector('#project-manager-btn');
        const removeAllBtn = this.querySelector('#project-manager-remove-all');
        const selectorComponent = this.querySelector('#project-manager-selector');
        
        if (selectBtn) {
            selectBtn.addEventListener('click', () => {
                if (selectorComponent) {
                    selectorComponent.open(this.selectedManagers, (newSelectedItems) => {
                        this.selectedManagers = newSelectedItems;
                        this.renderSelectedManagers();
                    });
                }
            });
        }

        if (removeAllBtn) {
            removeAllBtn.addEventListener('click', () => {
                this.selectedManagers = [];
                this.renderSelectedManagers();
            });
        }
    }

    renderSelectedManagers() {
        const selectedDiv = this.querySelector('#project-manager-selected');
        const selectedList = this.querySelector('#project-manager-selected-list');
        const selectBtn = this.querySelector('#project-manager-btn');

        if (!selectedList) return;
        
        selectedList.innerHTML = '';
        if (this.selectedManagers.length === 0) {
            selectedDiv.style.display = 'none';
            if (selectBtn) selectBtn.style.display = 'flex';
            return;
        }

        selectedDiv.style.display = 'block';
        if (selectBtn) selectBtn.style.display = 'none';

        this.selectedManagers.forEach((manager, index) => {
            const tag = document.createElement('div');
            tag.className = 'selected-value-tag';
            tag.innerHTML = `
                <span class="selected-value-text">${manager.name}</span>
                <button type="button" class="selected-value-remove" data-index="${index}">×</button>
            `;
            selectedList.appendChild(tag);
        });

        const removeButtons = selectedList.querySelectorAll('.selected-value-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                this.selectedManagers.splice(index, 1);
                this.renderSelectedManagers();
            });
        });
    }

    initSkillSelection() {
        const skillMaster = this.querySelector('#skill-master');
        const skillCustom = this.querySelector('#skill-custom');
        const skillAddBtn = this.querySelector('.skill-add-btn');

        if (skillMaster) {
            skillMaster.addEventListener('change', () => {
                if (skillMaster.value) {
                    const option = skillMaster.options[skillMaster.selectedIndex];
                    this.addSkill(option.value, option.text, false);
                }
            });
        }

        if (skillAddBtn) {
            skillAddBtn.addEventListener('click', () => {
                const customSkillName = skillCustom.value.trim();
                if (customSkillName) {
                    this.addSkill(null, customSkillName, true);
                } else {
                    alert('スキル名を入力してください');
                }
            });
        }

        if (skillCustom) {
            skillCustom.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    skillAddBtn.click();
                }
            });
        }
    }

    addSkill(skillId, skillName, isCustom = false) {
        if (this.skills.find(s => s.id === skillId && !isCustom) || 
            this.skills.find(s => s.name === skillName && isCustom)) {
            alert('このスキルは既に追加されています');
            return;
        }

        const skill = {
            id: skillId,
            name: skillName,
            isCustom: isCustom,
            level: 1
        };
        this.skills.push(skill);
        this.renderSkillList();
        
        const skillCustom = this.querySelector('#skill-custom');
        const skillMaster = this.querySelector('#skill-master');

        if (isCustom) {
            if (skillCustom) skillCustom.value = '';
        } else {
            if (skillMaster) skillMaster.value = '';
        }
    }

    renderSkillList() {
        const skillList = this.querySelector('#skill-list');
        if (!skillList) return;
        
        skillList.innerHTML = '';
        this.skills.forEach((skill, index) => {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item';
            skillItem.innerHTML = `
                <span class="skill-item-name">${skill.name}</span>
                <span class="skill-item-level">レベル: ${skill.level}</span>
                <button type="button" class="skill-item-remove" data-index="${index}">×</button>
            `;
            skillList.appendChild(skillItem);
        });

        const removeButtons = skillList.querySelectorAll('.skill-item-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                this.skills.splice(index, 1);
                this.renderSkillList();
            });
        });
    }

    initBlacklistSelection() {
        const selectBtn = this.querySelector('#blacklist-btn');
        const removeAllBtn = this.querySelector('#blacklist-remove-all');
        const selectorComponent = this.querySelector('app-blacklist-selector');
        
        if (selectBtn) {
            selectBtn.addEventListener('click', () => {
                if (selectorComponent) {
                    selectorComponent.open(this.selectedBlacklist, (newSelectedItems) => {
                        this.selectedBlacklist = newSelectedItems;
                        this.renderSelectedBlacklist();
                    });
                }
            });
        }

        if (removeAllBtn) {
            removeAllBtn.addEventListener('click', () => {
                this.selectedBlacklist = [];
                this.renderSelectedBlacklist();
            });
        }
    }

    renderSelectedBlacklist() {
        const selectedDiv = this.querySelector('#blacklist-selected');
        const selectedList = this.querySelector('#blacklist-selected-list');
        const selectBtn = this.querySelector('#blacklist-btn');

        if (!selectedList) return;
        
        selectedList.innerHTML = '';
        if (this.selectedBlacklist.length === 0) {
            selectedDiv.style.display = 'none';
            if (selectBtn) selectBtn.style.display = 'flex';
            return;
        }

        selectedDiv.style.display = 'block';
        if (selectBtn) selectBtn.style.display = 'none';

        this.selectedBlacklist.forEach((item, index) => {
            const tag = document.createElement('div');
            tag.className = 'selected-value-tag';
            const isLikePattern = item.type === 'like';
            if (isLikePattern) {
                tag.classList.add('selected-value-tag-like');
            }
            tag.innerHTML = `
                <span class="selected-value-text">${item.name}${isLikePattern ? ' (LIKE)' : ''}</span>
                <button type="button" class="selected-value-remove" data-index="${index}">×</button>
            `;
            selectedList.appendChild(tag);
        });

        const removeButtons = selectedList.querySelectorAll('.selected-value-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                this.selectedBlacklist.splice(index, 1);
                this.renderSelectedBlacklist();
            });
        });
    }

    initMailingListSelection() {
        const selectBtn = this.querySelector('#mailing-list-btn');
        const removeAllBtn = this.querySelector('#mailing-list-remove-all');
        const selectorComponent = this.querySelector('app-mailing-list-selector');
        
        if (selectBtn) {
            selectBtn.addEventListener('click', () => {
                if (selectorComponent) {
                    selectorComponent.open(this.selectedMailingList, (newSelectedItems) => {
                        this.selectedMailingList = newSelectedItems;
                        this.renderSelectedMailingList();
                    });
                }
            });
        }

        if (removeAllBtn) {
            removeAllBtn.addEventListener('click', () => {
                this.selectedMailingList = [];
                this.renderSelectedMailingList();
            });
        }
    }

    renderSelectedMailingList() {
        const selectedDiv = this.querySelector('#mailing-list-selected');
        const selectedList = this.querySelector('#mailing-list-selected-list');
        const selectBtn = this.querySelector('#mailing-list-btn');

        if (!selectedList) return;
        
        selectedList.innerHTML = '';
        if (this.selectedMailingList.length === 0) {
            selectedDiv.style.display = 'none';
            if (selectBtn) selectBtn.style.display = 'flex';
            return;
        }

        selectedDiv.style.display = 'block';
        if (selectBtn) selectBtn.style.display = 'none';

        this.selectedMailingList.forEach((item, index) => {
            const tag = document.createElement('div');
            tag.className = 'selected-value-tag';
            tag.innerHTML = `
                <span class="selected-value-text">${item.name}</span>
                <button type="button" class="selected-value-remove" data-index="${index}">×</button>
            `;
            selectedList.appendChild(tag);
        });

        const removeButtons = selectedList.querySelectorAll('.selected-value-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                this.selectedMailingList.splice(index, 1);
                this.renderSelectedMailingList();
            });
        });
    }

    initAiButtons() {
        const extractBtn = this.querySelector('#extract-project-memo-btn');
        const generateBtn = this.querySelector('#generate-project-memo-btn');
    
        if (extractBtn) {
            extractBtn.addEventListener('click', () => {
                alert('案件メモから情報抽出機能は後で実装予定です。');
            });
        }
    
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                alert('案件メモを生成機能は後で実装予定です。');
            });
        }
    }


    initContactMailingListSelection() {
        const selectBtn = this.querySelector('#contact-mailing-list-btn');
        const removeAllBtn = this.querySelector('#contact-mailing-list-remove-all');
        const selectorComponent = this.querySelector('app-mailing-list-selector');
        
        if (selectBtn) {
            selectBtn.addEventListener('click', () => {
                if (selectorComponent) {
                    selectorComponent.open(this.selectedContactMailingList, (newSelectedItems) => {
                        this.selectedContactMailingList = newSelectedItems;
                        this.renderSelectedContactMailingList();
                    });
                }
            });
        }

        if (removeAllBtn) {
            removeAllBtn.addEventListener('click', () => {
                this.selectedContactMailingList = [];
                this.renderSelectedContactMailingList();
            });
        }
    }

    renderSelectedContactMailingList() {
        const selectedDiv = this.querySelector('#contact-mailing-list-selected');
        const selectedList = this.querySelector('#contact-mailing-list-selected-list');
        const selectBtn = this.querySelector('#contact-mailing-list-btn');

        if (!selectedList) return;
        
        selectedList.innerHTML = '';
        if (this.selectedContactMailingList.length === 0) {
            selectedDiv.style.display = 'none';
            if (selectBtn) selectBtn.style.display = 'flex';
            return;
        }

        selectedDiv.style.display = 'block';
        if (selectBtn) selectBtn.style.display = 'none';

        this.selectedContactMailingList.forEach((item, index) => {
            const tag = document.createElement('div');
            tag.className = 'selected-value-tag';
            tag.innerHTML = `
                <span class="selected-value-text">${item.name}</span>
                <button type="button" class="selected-value-remove" data-index="${index}">×</button>
            `;
            selectedList.appendChild(tag);
        });

        const removeButtons = selectedList.querySelectorAll('.selected-value-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                this.selectedContactMailingList.splice(index, 1);
                this.renderSelectedContactMailingList();
            });
        });
    }

    initInternalNotificationMailingListSelection() {
        const selectBtn = this.querySelector('#internal-notification-mailing-list-btn');
        const removeAllBtn = this.querySelector('#internal-notification-mailing-list-remove-all');
        const selectorComponent = this.querySelector('app-mailing-list-selector');
        
        if (selectBtn) {
            selectBtn.addEventListener('click', () => {
                if (selectorComponent) {
                    selectorComponent.open(this.selectedInternalNotificationMailingList, (newSelectedItems) => {
                        this.selectedInternalNotificationMailingList = newSelectedItems;
                        this.renderSelectedInternalNotificationMailingList();
                    });
                }
            });
        }

        if (removeAllBtn) {
            removeAllBtn.addEventListener('click', () => {
                this.selectedInternalNotificationMailingList = [];
                this.renderSelectedInternalNotificationMailingList();
            });
        }
    }

    renderSelectedInternalNotificationMailingList() {
        const selectedDiv = this.querySelector('#internal-notification-mailing-list-selected');
        const selectedList = this.querySelector('#internal-notification-mailing-list-selected-list');
        const selectBtn = this.querySelector('#internal-notification-mailing-list-btn');

        if (!selectedList) return;
        
        selectedList.innerHTML = '';
        if (this.selectedInternalNotificationMailingList.length === 0) {
            selectedDiv.style.display = 'none';
            if (selectBtn) selectBtn.style.display = 'flex';
            return;
        }

        selectedDiv.style.display = 'block';
        if (selectBtn) selectBtn.style.display = 'none';

        this.selectedInternalNotificationMailingList.forEach((item, index) => {
            const tag = document.createElement('div');
            tag.className = 'selected-value-tag';
            tag.innerHTML = `
                <span class="selected-value-text">${item.name}</span>
                <button type="button" class="selected-value-remove" data-index="${index}">×</button>
            `;
            selectedList.appendChild(tag);
        });

        const removeButtons = selectedList.querySelectorAll('.selected-value-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                this.selectedInternalNotificationMailingList.splice(index, 1);
                this.renderSelectedInternalNotificationMailingList();
            });
        });
    }
    getFormData() {
        return {
            recruitStatus: this.querySelector('#project-recruit-status').value,
            projectDescription: this.querySelector('#project-description').value,
            projectName: this.querySelector('#project-name').value,
            endCompany: this.selectedCompany,
            projectManagers: this.selectedManagers,
            mailingList: this.selectedMailingList,
            skills: this.skills,
            skillMemo: this.querySelector('#skill-memo').value,
            startDate: this.querySelector('#start-date').value,
            endDate: this.querySelector('#end-date').value,
            memberNumber: this.querySelector('#member-number').value,
            ageRange: this.querySelector('#age-range').value,
            foreigner: this.querySelector('#foreigner').value,
            workLocation: this.querySelector('#work-location').value,
            desiredRemote: this.querySelector('#desired-remote').value,
            contractType: this.querySelector('#contract-type').value,
            desiredPriceMin: this.querySelector('#desired-price-min').value,
            desiredPriceMax: this.querySelector('#desired-price-max').value,
            paymentTimeMin: this.querySelector('#payment-time-min').value,
            paymentTimeMax: this.querySelector('#payment-time-max').value,
            paymentSite: this.querySelector('#payment-site').value,
            isPublic: this.querySelector('#is-public').checked,
            blacklist: this.selectedBlacklist
        };
    }

    setFormData(data) {
        if (!data) return;

        if (data.recruitStatus) this.querySelector('#project-recruit-status').value = data.recruitStatus;
        if (data.projectDescription) this.querySelector('#project-description').value = data.projectDescription;
        if (data.projectName) this.querySelector('#project-name').value = data.projectName;
        
        if (data.endCompany) {
            this.selectedCompany = data.endCompany;
            this.renderSelectedCompany();
        }

        if (data.projectManagers) {
            this.selectedManagers = data.projectManagers;
            this.renderSelectedManagers();
        }

        if (data.mailingList) {
            this.selectedMailingList = data.mailingList;
            this.renderSelectedMailingList();
        }

        if (data.skills) {
            this.skills = data.skills;
            this.renderSkillList();
        }

        if (data.skillMemo) this.querySelector('#skill-memo').value = data.skillMemo;
        if (data.startDate) this.querySelector('#start-date').value = data.startDate;
        if (data.endDate) this.querySelector('#end-date').value = data.endDate;
        if (data.memberNumber) this.querySelector('#member-number').value = data.memberNumber;
        if (data.ageRange) this.querySelector('#age-range').value = data.ageRange;
        if (data.foreigner) this.querySelector('#foreigner').value = data.foreigner;
        if (data.workLocation) this.querySelector('#work-location').value = data.workLocation;
        if (data.desiredRemote) this.querySelector('#desired-remote').value = data.desiredRemote;
        if (data.contractType) this.querySelector('#contract-type').value = data.contractType;
        if (data.desiredPriceMin) this.querySelector('#desired-price-min').value = data.desiredPriceMin;
        if (data.desiredPriceMax) this.querySelector('#desired-price-max').value = data.desiredPriceMax;
        if (data.paymentTimeMin) this.querySelector('#payment-time-min').value = data.paymentTimeMin;
        if (data.paymentTimeMax) this.querySelector('#payment-time-max').value = data.paymentTimeMax;
        if (data.paymentSite) this.querySelector('#payment-site').value = data.paymentSite;
        if (data.isPublic !== undefined) this.querySelector('#is-public').checked = data.isPublic;

        if (data.blacklist) {
            this.selectedBlacklist = data.blacklist;
            this.renderSelectedBlacklist();
        }
    }

    validateForm() {
        let isValid = true;
        let errorMessage = '';

        const projectName = this.querySelector('#project-name');
        if (!projectName || !projectName.value.trim()) {
            isValid = false;
            errorMessage += '案件名は必須です\n';
        }

        if (!this.selectedCompany) {
            isValid = false;
            errorMessage += '案件エンド会社は必須です\n';
        }

        if (!isValid && errorMessage) {
            alert(errorMessage);
        }

        return isValid;
    }
}

customElements.define('app-project-form', AppProjectForm);

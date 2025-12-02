/**
 * 面談ツール設定モーダルコンポーネント
 * 面談ツールの選択、参加者設定、URL発行を行う
 */
class AppMeetingToolSettings extends HTMLElement {
    constructor() {
        super();
        this.currentRoundNumber = null;
        this.currentRoundData = null;
        this.viewSide = null;
        
        // モックデータ（親から受け取るのが理想だが、現状はここで保持または親からセット）
        this.mockEngineer = { id: 'engineer-1', name: '山田太郎', email: 'yamada@example.com' };
        this.mockEngineerManager = { id: 'manager-1', name: '田中花子', email: 'tanaka@example.com' };
        this.mockProjectManager = { id: 'pm-1', name: '佐藤一郎', email: 'sato@example.com' };
    }

    connectedCallback() {
        this.render();
        this.initEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="modal meeting-tool-setting-modal" id="meeting-tool-setting-modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">面談ツール設定</h3>
                        <button type="button" class="modal-close meeting-tool-setting-close">×</button>
                    </div>
                    <div class="modal-body">
                        <!-- エンジニア側参加者 -->
                        <div class="form-section">
                            <h4>エンジニア側参加者</h4>
                            <div class="form-group">
                                <label class="form-label">社員を選択</label>
                                <div class="form-select-wrapper">
                                    <button type="button" class="form-select-btn" id="engineer-participants-select-btn">
                                        <span class="form-select-text">選択してください</span>
                                        <span class="form-select-arrow">▼</span>
                                    </button>
                                    <div class="form-selected-values" id="engineer-participants-selected" style="display: none;">
                                        <div class="selected-values-list" id="engineer-participants-selected-list"></div>
                                        <button type="button" class="selected-value-remove-all" id="engineer-participants-remove-all">すべて解除</button>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group" style="margin-top: 12px;">
                                <label for="engineer-emails" class="form-label">メールアドレス (自由入力、カンマ区切り)</label>
                                <textarea id="engineer-emails" class="form-textarea" rows="3" placeholder="例: tanaka@example.com, engineer@example.com"></textarea>
                            </div>
                        </div>

                        <!-- 案件側参加者 -->
                        <div class="form-section" style="margin-top: 20px;">
                            <h4>案件側参加者</h4>
                            <div class="form-group">
                                <label class="form-label">社員を選択</label>
                                <div class="form-select-wrapper">
                                    <button type="button" class="form-select-btn" id="project-participants-select-btn">
                                        <span class="form-select-text">選択してください</span>
                                        <span class="form-select-arrow">▼</span>
                                    </button>
                                    <div class="form-selected-values" id="project-participants-selected" style="display: none;">
                                        <div class="selected-values-list" id="project-participants-selected-list"></div>
                                        <button type="button" class="selected-value-remove-all" id="project-participants-remove-all">すべて解除</button>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group" style="margin-top: 12px;">
                                <label for="project-emails" class="form-label">メールアドレス (自由入力、カンマ区切り)</label>
                                <textarea id="project-emails" class="form-textarea" rows="3" placeholder="例: yamada@example.com, pm@example.com"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-warning meeting-tool-setting-cancel">キャンセル</button>
                        <button type="button" class="btn btn-primary meeting-tool-setting-confirm">面談URLを発行</button>
                    </div>
                </div>
            </div>
            <!-- 社員選択モーダルコンポーネント (ここで使用) -->
            <app-employee-selector></app-employee-selector>
        `;
    }

    initEventListeners() {
        const modal = this.querySelector('#meeting-tool-setting-modal');
        const modalOverlay = modal?.querySelector('.modal-overlay');
        const modalCloseBtn = modal?.querySelector('.meeting-tool-setting-close');
        const cancelBtn = modal?.querySelector('.meeting-tool-setting-cancel');
        const confirmBtn = modal?.querySelector('.meeting-tool-setting-confirm');

        if (modalOverlay) modalOverlay.addEventListener('click', () => this.close());
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', () => this.close());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.close());
        if (confirmBtn) confirmBtn.addEventListener('click', () => this.saveSettings());

        // エンジニア側参加者選択ボタン
        const engineerSelectBtn = this.querySelector('#engineer-participants-select-btn');
        if (engineerSelectBtn) {
            engineerSelectBtn.addEventListener('click', () => {
                this.openEmployeeSelector('engineer');
            });
        }

        // 案件側参加者選択ボタン
        const projectSelectBtn = this.querySelector('#project-participants-select-btn');
        if (projectSelectBtn) {
            projectSelectBtn.addEventListener('click', () => {
                this.openEmployeeSelector('project');
            });
        }
    }

    /**
     * モーダルを開く
     * @param {Object} roundData - 対象の面談回データ
     * @param {string} viewSide - 表示側 ('engineer' | 'project' | null)
     */
    open(roundData, viewSide = null) {
        this.currentRoundData = roundData; // 参照を保持して直接更新する（またはコピーして保存時に返す）
        this.currentRoundNumber = roundData.roundNumber;
        this.viewSide = viewSide;

        const modal = this.querySelector('#meeting-tool-setting-modal');
        if (!modal) return;

        // UI要素の取得
        const engineerSelectWrapper = this.querySelector('#engineer-participants-select-btn')?.closest('.form-group');
        const projectSelectWrapper = this.querySelector('#project-participants-select-btn')?.closest('.form-group');
        const engineerEmailsTextarea = this.querySelector('#engineer-emails');
        const projectEmailsTextarea = this.querySelector('#project-emails');

        // viewSideに基づいて表示を制御
        this.setupViewSideDisplay(engineerSelectWrapper, projectSelectWrapper, engineerEmailsTextarea, projectEmailsTextarea);

        // 選択済み社員の表示を更新
        this.renderParticipantsDisplay('engineer', this.currentRoundData.engineerParticipants);
        this.renderParticipantsDisplay('project', this.currentRoundData.projectParticipants);

        modal.classList.add('active');
    }

    /**
     * 表示側に応じたUI制御と初期値設定
     */
    setupViewSideDisplay(engineerSelectWrapper, projectSelectWrapper, engineerEmailsTextarea, projectEmailsTextarea) {
        const round = this.currentRoundData;

        if (this.viewSide === 'engineer') {
            // エンジニア側
            if (engineerSelectWrapper) engineerSelectWrapper.style.display = 'block';
            if (projectSelectWrapper) projectSelectWrapper.style.display = 'none';

            // デフォルト参加者追加
            this.addDefaultParticipant(round.engineerParticipants, this.mockEngineer);
            this.addDefaultParticipant(round.engineerParticipants, this.mockEngineerManager);

            // メールアドレス表示
            if (projectEmailsTextarea) projectEmailsTextarea.value = this.mockProjectManager.email;
            if (engineerEmailsTextarea) {
                engineerEmailsTextarea.value = this.getEmailsFromParticipants(round.engineerParticipants);
            }

        } else if (this.viewSide === 'project') {
            // 案件側
            if (projectSelectWrapper) projectSelectWrapper.style.display = 'block';
            if (engineerSelectWrapper) engineerSelectWrapper.style.display = 'none';

            // デフォルト参加者追加
            this.addDefaultParticipant(round.projectParticipants, this.mockProjectManager);

            // メールアドレス表示
            if (engineerEmailsTextarea) {
                engineerEmailsTextarea.value = [this.mockEngineer.email, this.mockEngineerManager.email].filter(Boolean).join(', ');
            }
            if (projectEmailsTextarea) {
                projectEmailsTextarea.value = this.getEmailsFromParticipants(round.projectParticipants);
            }

        } else {
            // 両方
            if (engineerSelectWrapper) engineerSelectWrapper.style.display = 'block';
            if (projectSelectWrapper) projectSelectWrapper.style.display = 'block';

            if (engineerEmailsTextarea) engineerEmailsTextarea.value = this.getEmailsFromParticipants(round.engineerParticipants);
            if (projectEmailsTextarea) projectEmailsTextarea.value = this.getEmailsFromParticipants(round.projectParticipants);
        }
    }

    addDefaultParticipant(participantsList, defaultUser) {
        if (!participantsList.some(p => p.id === defaultUser.id)) {
            participantsList.push({ ...defaultUser });
        }
    }

    getEmailsFromParticipants(participants) {
        return participants
            .filter(p => p.email && !p.id) // IDを持たない（メールアドレスのみの）参加者
            .map(p => p.email)
            .join(', ');
    }

    close() {
        const modal = this.querySelector('#meeting-tool-setting-modal');
        if (modal) {
            modal.classList.remove('active');
        }
        this.currentRoundData = null;
        this.currentRoundNumber = null;
    }

    /**
     * 社員選択モーダルを開く
     */
    openEmployeeSelector(side) {
        const employeeSelector = this.querySelector('app-employee-selector');
        if (!employeeSelector) return;

        // 既に選択されている社員を初期選択状態として渡す
        const participants = side === 'engineer' 
            ? this.currentRoundData.engineerParticipants.filter(p => p.id)
            : this.currentRoundData.projectParticipants.filter(p => p.id);
        const initialSelected = participants.map(p => ({ id: p.id, name: p.name }));

        employeeSelector.open(initialSelected, (selectedEmployees) => {
            // 選択された社員を反映
            const targetParticipants = side === 'engineer' ? this.currentRoundData.engineerParticipants : this.currentRoundData.projectParticipants;
            const emailOnlyParticipants = targetParticipants.filter(p => !p.id);
            
            const newParticipants = [
                ...selectedEmployees.map(e => ({ id: e.id, name: e.name, email: e.email || '' })),
                ...emailOnlyParticipants
            ];

            if (side === 'engineer') {
                this.currentRoundData.engineerParticipants = newParticipants;
            } else {
                this.currentRoundData.projectParticipants = newParticipants;
            }
            
            this.renderParticipantsDisplay(side, newParticipants);
        });
    }

    /**
     * 参加者リストの表示を更新
     */
    renderParticipantsDisplay(side, participants) {
        const prefix = side === 'engineer' ? 'engineer-participants' : 'project-participants';
        const selectBtn = this.querySelector(`#${prefix}-select-btn`);
        const selectedDiv = this.querySelector(`#${prefix}-selected`);
        const selectedList = this.querySelector(`#${prefix}-selected-list`);
        const removeAllBtn = this.querySelector(`#${prefix}-remove-all`);
        
        if (!selectedList) return;

        const employeeParticipants = participants.filter(p => p.id);

        selectedList.innerHTML = '';
        if (employeeParticipants.length === 0) {
            selectedDiv.style.display = 'none';
            if (selectBtn) selectBtn.style.display = 'flex';
            return;
        }

        selectedDiv.style.display = 'block';
        if (selectBtn) selectBtn.style.display = 'none';

        employeeParticipants.forEach((item, index) => {
            const tag = document.createElement('div');
            tag.className = 'selected-value-tag';
            tag.innerHTML = `
                <span class="selected-value-text">${this.escapeHtml(item.name)}</span>
                <button type="button" class="selected-value-remove" data-side="${side}" data-index="${index}">×</button>
            `;
            selectedList.appendChild(tag);
        });

        // 個別削除ボタン
        selectedList.querySelectorAll('.selected-value-remove').forEach(button => {
            button.addEventListener('click', () => {
                this.removeParticipant(button.getAttribute('data-side'), parseInt(button.getAttribute('data-index')));
            });
        });

        // すべて解除ボタン
        if (removeAllBtn) {
            const newRemoveAllBtn = removeAllBtn.cloneNode(true);
            removeAllBtn.parentNode.replaceChild(newRemoveAllBtn, removeAllBtn);
            newRemoveAllBtn.addEventListener('click', () => {
                this.removeAllParticipants(side);
            });
        }
    }

    removeParticipant(side, index) {
        const participants = side === 'engineer' ? this.currentRoundData.engineerParticipants : this.currentRoundData.projectParticipants;
        const employeeParticipants = participants.filter(p => p.id);
        
        if (index >= 0 && index < employeeParticipants.length) {
            const removedParticipant = employeeParticipants[index];
            const updatedParticipants = participants.filter(p => p.id !== removedParticipant.id);
            
            if (side === 'engineer') {
                this.currentRoundData.engineerParticipants = updatedParticipants;
            } else {
                this.currentRoundData.projectParticipants = updatedParticipants;
            }
            
            this.renderParticipantsDisplay(side, updatedParticipants);
        }
    }

    removeAllParticipants(side) {
        const participants = side === 'engineer' ? this.currentRoundData.engineerParticipants : this.currentRoundData.projectParticipants;
        const emailOnlyParticipants = participants.filter(p => !p.id);
        
        if (side === 'engineer') {
            this.currentRoundData.engineerParticipants = emailOnlyParticipants;
        } else {
            this.currentRoundData.projectParticipants = emailOnlyParticipants;
        }
        
        this.renderParticipantsDisplay(side, emailOnlyParticipants);
    }

    saveSettings() {
        // メールアドレス入力欄からの追加
        this.addEmailsFromTextarea('#engineer-emails', this.currentRoundData.engineerParticipants);
        this.addEmailsFromTextarea('#project-emails', this.currentRoundData.projectParticipants);

        // URL発行ロジック
        if (this.currentRoundData.meetingTool) {
            this.currentRoundData.meetingUrl = `https://example.com/meeting/${this.currentRoundData.meetingTool}/${this.currentRoundData.roundNumber}`;
            
            // イベント発火して親に通知
            this.dispatchEvent(new CustomEvent('settings-saved', {
                detail: {
                    roundNumber: this.currentRoundNumber,
                    meetingUrl: this.currentRoundData.meetingUrl,
                    engineerParticipants: this.currentRoundData.engineerParticipants,
                    projectParticipants: this.currentRoundData.projectParticipants
                }
            }));
            
            alert('面談URLを発行しました。URLは発行されますが、通知はまだ送信していません。');
        } else {
            alert('面談ツールを選択してください。');
            return;
        }

        this.close();
    }

    addEmailsFromTextarea(selector, participantsList) {
        const textarea = this.querySelector(selector);
        if (textarea) {
            const emails = textarea.value.split(',').map(e => e.trim()).filter(e => e.length > 0);
            const emailOnlyParticipants = emails.map(email => ({ email }));
            
            // 既存のID持ち参加者とマージ（既存のメールのみ参加者は一旦クリアして再追加する形になるが、重複チェックは簡易的に）
            // ここでは単純に ID持ち + 新規入力メール とする（既存のメールのみ参加者が消える可能性があるが、textareaに表示されているのでOK）
            const idParticipants = participantsList.filter(p => p.id);
            
            // リストを更新
            // 注意: 配列の中身を入れ替える必要がある
            participantsList.length = 0;
            participantsList.push(...idParticipants, ...emailOnlyParticipants);
        }
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

customElements.define('app-meeting-tool-settings', AppMeetingToolSettings);

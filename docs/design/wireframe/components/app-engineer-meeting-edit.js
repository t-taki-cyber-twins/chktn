/**
 * エンジニア面談編集モーダルコンポーネント
 * Web Components (Custom Elements) を使用して実装
 */
class AppEngineerMeetingEdit extends HTMLElement {
    constructor() {
        super();
        // 面談回数データを管理
        this.meetingRounds = [
            {
                roundNumber: 1,
                status: '',
                datetime: '', // 日時統合フィールド（YYYY-MM-DDTHH:mm形式）
                duration: '', // 面談時間（分単位）
                location: '',
                privateNote: '',
                meetingTool: '', // 選択された面談ツール
                meetingUrl: '', // 面談ツールで発行されたURL
                engineerParticipants: [], // エンジニア側参加者 [{id, name, email}, ...]
                projectParticipants: [] // 案件側参加者 [{id, name, email}, ...]
            }
        ];
        this.activeRound = 1; // 現在アクティブな面談回
        this.operationStatus = ''; // 稼働ステータス
        this.mode = 'edit'; // 'edit' or 'new'
        this.selectedProject = null; // 新規作成時に選択された案件
        this.viewSide = null; // 'engineer' | 'project' | null - 表示側の情報
        
        // モックデータ：エンジニア情報、担当者情報
        this.mockEngineer = {
            id: 'engineer-1',
            name: '山田太郎',
            email: 'yamada@example.com'
        };
        this.mockEngineerManager = {
            id: 'manager-1',
            name: '田中花子',
            email: 'tanaka@example.com'
        };
        this.mockProjectManager = {
            id: 'pm-1',
            name: '佐藤一郎',
            email: 'sato@example.com'
        };
    }

    async connectedCallback() {
        // 依存関係を読み込む
        await this.loadDependencies();
        // 依存関係読み込み後にレンダリングとイベントリスナー初期化
        this.render();
        this.initEventListeners();
        
        // ラウンドマネージャーの初期化
        this.updateRoundManager();
    }

    /**
     * 依存関係を動的に読み込む
     */
    async loadDependencies() {
        const components = [
            'app-message-list',
            'app-message-reply',
            'app-message-thread-modal',
            'app-project-selector',
            'app-employee-selector',
            'app-meeting-round-manager',
            'app-meeting-tool-settings'
        ];

        for (const component of components) {
            if (!customElements.get(component)) {
                try {
                    await import(`./${component}.js`);
                } catch (error) {
                    console.error(`Failed to load ${component} component:`, error);
                }
            }
        }
    }

    render() {
        this.innerHTML = `
            <div class="modal meeting-edit-modal" id="engineer-meeting-edit-modal">
                <div class="modal-overlay"></div>
                <div class="modal-content meeting-edit-modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">面談編集</h3>
                        <button type="button" class="modal-close" data-modal="engineer-meeting-edit-modal">×</button>
                    </div>
                    <div class="modal-body meeting-edit-modal-body">
                        <!-- 案件選択セクション（新規作成時のみ表示） -->
                        <div class="project-selection-section" id="project-selection-section" style="display: none; margin-bottom: 20px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; text-align: center;">
                            <h4 style="margin-bottom: 15px;">面談を行う案件を選択してください</h4>
                            <div style="display: flex; justify-content: center; gap: 15px;">
                                <button type="button" class="btn btn-primary" id="select-project-btn">案件を選択</button>
                                <button type="button" class="btn btn-outline-primary" id="add-provisional-project-btn">仮案件を追加</button>
                            </div>
                        </div>

                        <div class="meeting-info-container" id="meeting-info-container" style="display: flex; gap: 20px;">
                            <!-- エンジニアの基本情報セクション -->
                            <div class="meeting-info-section" style="flex: 1;">
                                <h4 class="meeting-info-section-title">
                                    エンジニア情報
                                    <a href="public-engineer-detail.html#engineer-detail-form" target="_blank" class="btn btn-outline-primary btn-sm">詳細</a>
                                </h4>
                                <div class="meeting-info-grid">
                                    <div class="meeting-info-item">
                                        <span class="meeting-info-label">エンジニア名:</span>
                                        <span class="meeting-info-value" id="meeting-engineer-name">田中太郎</span>
                                    </div>
                                    <div class="meeting-info-item">
                                        <span class="meeting-info-label">会社:</span>
                                        <span class="meeting-info-value" id="meeting-engineer-company">テック株式会社</span>
                                    </div>
                                    <div class="meeting-info-item">
                                        <span class="meeting-info-label">スキル:</span>
                                        <span class="meeting-info-value" id="meeting-engineer-skills">Java, Spring Boot, React</span>
                                    </div>
                                </div>
                            </div>

                            <!-- 案件の基本情報セクション -->
                            <div class="meeting-info-section" style="flex: 1;">
                                <h4 class="meeting-info-section-title">
                                    案件情報
                                    <a href="public-project-detail.html#project-detail-form" target="_blank" class="btn btn-outline-primary btn-sm">詳細</a>
                                </h4>
                                <div class="meeting-info-grid">
                                    <div class="meeting-info-item">
                                        <span class="meeting-info-label">案件名:</span>
                                        <span class="meeting-info-value" id="meeting-project-name">フルスタックエンジニア募集</span>
                                    </div>
                                    <div class="meeting-info-item">
                                        <span class="meeting-info-label">案件提供会社:</span>
                                        <span class="meeting-info-value" id="meeting-project-company">サンプル株式会社</span>
                                    </div>
                                    <div class="meeting-info-item">
                                        <span class="meeting-info-label">案件担当者:</span>
                                        <span class="meeting-info-value" id="meeting-project-manager">山田太郎</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- メッセージスレッド一覧セクション -->
                        <div id="message-thread-section">
                            <app-message-list title="面談スレッド - エンジニア・案件でスレッド1つ"></app-message-list>
                        </div>

                        <!-- 最新ステータス表示 -->
                        <div class="latest-status-section" style="margin-bottom: 20px; padding: 16px; background-color: #e6f2ff; border-radius: 4px; border: 1px solid #b3d7ff;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <span style="font-weight: 600; color: #0066cc;">最新ステータス:</span>
                                <span id="latest-status-value" style="font-size: 16px; font-weight: bold;">-</span>
                            </div>
                        </div>

                        <!-- タブUI -->
                        <div class="tab-container">
                            <div class="tab-buttons">
                                <button type="button" class="tab-button active" data-tab="meeting-info">面談情報</button>
                                <button type="button" class="tab-button" data-tab="operation-info" id="tab-btn-operation-info">稼働情報</button>
                            </div>

                            <!-- 面談情報タブ -->
                            <div class="tab-content active" id="tab-meeting-info">
                                <!-- 面談回管理コンポーネント -->
                                <app-meeting-round-manager></app-meeting-round-manager>
                            </div>

                            <!-- 稼働情報タブ -->
                            <div class="tab-content" id="tab-operation-info">
                                <div class="form-section">
                                    <div class="form-grid">
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
                                            <label for="operation-start-date" class="form-label">稼働開始日</label>
                                            <input type="date" id="operation-start-date" name="operation-start-date" class="form-input">
                                        </div>
                                        <div class="form-group">
                                            <label for="operation-end-date" class="form-label">稼働終了(予定)日</label>
                                            <input type="date" id="operation-end-date" name="operation-end-date" class="form-input">
                                        </div>
                                        <div class="form-group">
                                            <label for="operation-price" class="form-label">単価</label>
                                            <input type="number" id="operation-price" name="operation-price" class="form-input" placeholder="万円" min="0">
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
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer meeting-edit-modal-footer">
                        <button type="button" class="btn btn-warning meeting-edit-cancel-btn">キャンセル</button>
                        <button type="button" class="btn btn-success meeting-edit-update-btn">更新</button>
                    </div>
                </div>
            </div>

            <!-- メッセージ返信フォームモーダルコンポーネント -->
            <app-message-reply></app-message-reply>

            <!-- スレッド全表示モーダルコンポーネント -->
            <app-message-thread-modal></app-message-thread-modal>

            <!-- 案件選択モーダルコンポーネント -->
            <app-project-selector></app-project-selector>

            <!-- 面談ツール設定モーダルコンポーネント -->
            <app-meeting-tool-settings></app-meeting-tool-settings>
        `;
    }

    initEventListeners() {
        // モーダルを閉じる
        const closeBtn = this.querySelector('.modal-close');
        const overlay = this.querySelector('.modal-overlay');
        const cancelBtn = this.querySelector('.meeting-edit-cancel-btn');

        if (closeBtn) closeBtn.addEventListener('click', () => this.close());
        if (overlay) overlay.addEventListener('click', () => this.close());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.close());

        // 更新ボタンの処理
        const updateBtn = this.querySelector('.meeting-edit-update-btn');
        if (updateBtn) updateBtn.addEventListener('click', () => this.handleUpdate());

        // 稼働ステータス変更
        const operationStatusSelect = this.querySelector('#operation-status');
        if (operationStatusSelect) {
            operationStatusSelect.addEventListener('change', (e) => {
                this.operationStatus = e.target.value;
                this.updateLatestStatus();
            });
        }

        // タブ切り替え処理
        const tabButtons = this.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (button.disabled || button.classList.contains('disabled')) return;
                
                const tabId = button.dataset.tab;
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const tabContents = this.querySelectorAll('.tab-content');
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `tab-${tabId}`) content.classList.add('active');
                });
            });
        });

        // サブコンポーネントのイベントリスナー
        this.initSubComponentListeners();

        // メッセージ一覧コンポーネントのイベントリスナー
        this.initMessageListeners();

        // 案件選択ボタン
        const selectProjectBtn = this.querySelector('#select-project-btn');
        if (selectProjectBtn) {
            selectProjectBtn.addEventListener('click', () => {
                const projectSelector = this.querySelector('app-project-selector');
                if (projectSelector) {
                    projectSelector.open((project) => {
                        this.handleProjectSelect(project);
                    });
                }
            });
        }

        // 仮案件追加ボタン
        const addProvisionalProjectBtn = this.querySelector('#add-provisional-project-btn');
        if (addProvisionalProjectBtn) {
            addProvisionalProjectBtn.addEventListener('click', () => {
                this.handleProvisionalProject();
            });
        }
    }

    initSubComponentListeners() {
        const roundManager = this.querySelector('app-meeting-round-manager');
        const toolSettings = this.querySelector('app-meeting-tool-settings');

        if (roundManager) {
            roundManager.addEventListener('round-add', () => this.handleAddRound());
            roundManager.addEventListener('round-delete', (e) => this.handleDeleteRound(e.detail.roundNumber));
            roundManager.addEventListener('open-tool-settings', (e) => this.handleOpenToolSettings(e.detail.roundNumber));
            roundManager.addEventListener('status-changed', (e) => this.handleStatusChange(e.detail));
            roundManager.addEventListener('round-switch', (e) => {
                this.activeRound = e.detail.roundNumber;
            });
        }

        if (toolSettings) {
            toolSettings.addEventListener('settings-saved', (e) => this.handleSettingsSaved(e.detail));
        }
    }

    initMessageListeners() {
        const messageListComponent = this.querySelector('app-message-list');
        const replyComponent = this.querySelector('app-message-reply');
        const threadModalComponent = this.querySelector('app-message-thread-modal');

        if (messageListComponent) {
            messageListComponent.addEventListener('message-new', () => {
                if (replyComponent) replyComponent.open({ mode: 'new' });
            });

            messageListComponent.addEventListener('message-reply', (e) => {
                const { threadId, parentMessageId, originalSubject } = e.detail;
                if (replyComponent) {
                    replyComponent.open({ mode: 'reply', threadId, parentMessageId, originalSubject });
                }
            });

            messageListComponent.addEventListener('message-show-all', (e) => {
                const { threadId } = e.detail;
                const threads = this.getMockMessageThreads();
                const thread = threads.find(t => t.id === parseInt(threadId));
                if (thread && threadModalComponent) threadModalComponent.open(thread);
            });

            messageListComponent.addEventListener('message-detail-load', (e) => {
                const { messageId, targetElementId } = e.detail;
                this.loadMessageDetail(messageId, messageListComponent, targetElementId);
            });
        }

        if (replyComponent) {
            replyComponent.addEventListener('message-reply-submit', (e) => {
                this.handleMessageReply(e.detail);
            });
        }
    }

    /**
     * ラウンドマネージャーを更新
     */
    updateRoundManager(activeRound = null) {
        const roundManager = this.querySelector('app-meeting-round-manager');
        if (roundManager) {
            if (activeRound) this.activeRound = activeRound;
            roundManager.init(this.meetingRounds, this.activeRound);
        }
    }

    handleAddRound() {
        const newRoundNumber = this.meetingRounds.length + 1;
        this.meetingRounds.push({
            roundNumber: newRoundNumber,
            status: '',
            datetime: '',
            duration: '',
            location: '',
            privateNote: '',
            meetingTool: '',
            meetingUrl: '',
            engineerParticipants: [],
            projectParticipants: []
        });
        
        this.updateRoundManager(newRoundNumber);
        this.updateLatestStatus();
    }

    handleDeleteRound(roundNumber) {
        this.meetingRounds = this.meetingRounds.filter(r => r.roundNumber !== roundNumber);
        this.meetingRounds.forEach((r, index) => {
            r.roundNumber = index + 1;
        });
        
        if (this.activeRound >= roundNumber && this.activeRound > 1) {
            this.activeRound--;
        }
        
        this.updateRoundManager(this.activeRound);
        this.updateLatestStatus();
    }

    handleOpenToolSettings(roundNumber) {
        const toolSettings = this.querySelector('app-meeting-tool-settings');
        const round = this.meetingRounds.find(r => r.roundNumber === roundNumber);
        if (toolSettings && round) {
            toolSettings.open(round, this.viewSide);
        }
    }

    handleStatusChange(detail) {
        const { roundNumber, status } = detail;
        const round = this.meetingRounds.find(r => r.roundNumber === roundNumber);
        if (round) {
            round.status = status;
            this.updateOperationTabStatus(status);
            this.updateLatestStatus();
        }
    }

    handleSettingsSaved(detail) {
        const { roundNumber, meetingUrl } = detail;
        const roundManager = this.querySelector('app-meeting-round-manager');
        if (roundManager) {
            roundManager.updateMeetingUrl(roundNumber, meetingUrl);
        }
    }

    updateOperationTabStatus(status) {
        const operationTabBtn = this.querySelector('#tab-btn-operation-info');
        if (!operationTabBtn) return;

        const isOperationActive = true; // ロジックは要件に合わせて調整

        if (isOperationActive) {
            operationTabBtn.classList.remove('disabled');
            operationTabBtn.removeAttribute('disabled');
        } else {
            operationTabBtn.classList.add('disabled');
            operationTabBtn.setAttribute('disabled', 'true');
            
            if (operationTabBtn.classList.contains('active')) {
                const meetingTabBtn = this.querySelector('[data-tab="meeting-info"]');
                if (meetingTabBtn) meetingTabBtn.click();
            }
        }
    }

    updateLatestStatus() {
        const statusElement = this.querySelector('#latest-status-value');
        if (!statusElement) return;

        if (this.operationStatus) {
            const operationStatusMap = {
                'waiting_entry': '入場待ち',
                'working': '稼働中',
                'leaving_soon': '退場予定',
                'left': '退場済み'
            };
            statusElement.textContent = operationStatusMap[this.operationStatus] || this.operationStatus;
            return;
        }

        const lastRound = this.meetingRounds[this.meetingRounds.length - 1];
        if (lastRound && lastRound.status) {
            const meetingStatusMap = {
                'proposal': '調整中',
                'pending': '面談確定',
                'canceled': '面談中止',
                'waiting_result': '結果待ち',
                'passed': '合格',
                'failed': '不合格',
                'rejected': '辞退'
            };
            const statusText = meetingStatusMap[lastRound.status] || lastRound.status;
            statusElement.textContent = `${lastRound.roundNumber}回目: ${statusText}`;
            return;
        }

        statusElement.textContent = '-';
    }

    // ... (以下、既存のメソッド: open, openForNew, updateViewMode, handleProjectSelect, handleProvisionalProject, close, loadMeetingData, getMockMessageThreads, loadMessageDetail, handleUpdate, getTemplateByStatus, handleMessageReply) ...
    // これらのメソッドは基本的に変更なしだが、this.querySelectorのターゲットが変わっていないか注意が必要
    // handleUpdateでsaveCurrentRoundDataを呼び出す必要がある

    open(meetingId, viewSide = null) {
        this.mode = 'edit';
        this.viewSide = viewSide;
        const modal = this.querySelector('.meeting-edit-modal');
        if (modal) {
            modal.classList.add('active');
            this.updateViewMode();
            this.loadMeetingData(meetingId);
        }
    }

    openForNew() {
        this.mode = 'new';
        this.selectedProject = null;
        const modal = this.querySelector('.meeting-edit-modal');
        if (modal) {
            modal.classList.add('active');
            this.updateViewMode();
            
            this.querySelector('#meeting-engineer-name').textContent = '山田太郎';
            this.querySelector('#meeting-engineer-company').textContent = 'テック株式会社';
            this.querySelector('#meeting-engineer-skills').textContent = 'Java, Spring Boot, React';
            
            this.querySelector('#meeting-project-name').textContent = '-';
            this.querySelector('#meeting-project-company').textContent = '-';
            this.querySelector('#meeting-project-manager').textContent = '-';
        }
    }

    updateViewMode() {
        const selectionSection = this.querySelector('#project-selection-section');
        const meetingInfoContainer = this.querySelector('#meeting-info-container');
        const messageThreadSection = this.querySelector('#message-thread-section');
        const latestStatusSection = this.querySelector('.latest-status-section');
        const tabContainer = this.querySelector('.tab-container');
        const footer = this.querySelector('.meeting-edit-modal-footer');

        if (this.mode === 'new' && !this.selectedProject) {
            if (selectionSection) selectionSection.style.display = 'block';
            if (meetingInfoContainer) meetingInfoContainer.style.display = 'flex';
            if (messageThreadSection) messageThreadSection.style.display = 'none';
            if (latestStatusSection) latestStatusSection.style.display = 'none';
            if (tabContainer) tabContainer.style.display = 'none';
            if (footer) footer.style.display = 'none';
        } else {
            if (selectionSection) selectionSection.style.display = 'none';
            if (meetingInfoContainer) meetingInfoContainer.style.display = 'flex';
            if (messageThreadSection) messageThreadSection.style.display = 'block';
            if (latestStatusSection) latestStatusSection.style.display = 'block';
            if (tabContainer) tabContainer.style.display = 'block';
            if (footer) footer.style.display = 'flex';
        }
    }

    handleProjectSelect(project) {
        this.selectedProject = project;
        
        this.querySelector('#meeting-project-name').textContent = project.name;
        this.querySelector('#meeting-project-company').textContent = project.endCompany;
        this.querySelector('#meeting-project-manager').textContent = '担当者A';
        
        this.updateViewMode();
        
        this.meetingRounds = [
            {
                roundNumber: 1,
                status: '',
                datetime: '',
                duration: '',
                location: '',
                privateNote: '',
                meetingTool: '',
                meetingUrl: '',
                engineerParticipants: [],
                projectParticipants: []
            }
        ];
        this.activeRound = 1;
        this.updateRoundManager();
        this.updateLatestStatus();
    }

    handleProvisionalProject() {
        const provisionalProject = {
            id: 999,
            name: '【仮】新規案件案件',
            endCompany: '仮株式会社',
            status: 'recruiting'
        };
        
        alert('仮案件を作成しました: ' + provisionalProject.name);
        this.handleProjectSelect(provisionalProject);
    }

    close() {
        const modal = this.querySelector('.meeting-edit-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    loadMeetingData(meetingId) {
        console.log('面談データを読み込み:', meetingId);
        this.updateRoundManager();
        
        const messageListComponent = this.querySelector('app-message-list');
        if (messageListComponent) {
            const threads = this.getMockMessageThreads();
            messageListComponent.displayThreads(threads);
        }
    }

    getMockMessageThreads() {
        return [
            {
                id: 1,
                parentMessage: {
                    id: 1,
                    title: '面談の日程調整について',
                    subject: '面談の日程調整について',
                    sender: 'サンプル株式会社',
                    sentDate: '2024-12-10T14:30:00',
                    content: '面談の日程についてご相談があります。\n\n来週の火曜日または水曜日でご都合の良い日時をご指定いただけますでしょうか。'
                },
                children: [
                    {
                        id: 11,
                        subject: 'RE: 面談の日程調整について',
                        sender: 'テック株式会社',
                        sentDate: '2024-12-11T10:00:00',
                        content: 'ご連絡ありがとうございます。\n\n来週の火曜日（12月17日）の14時からであれば対応可能です。\nご都合いかがでしょうか。'
                    },
                    {
                        id: 12,
                        subject: 'RE: 面談の日程調整について',
                        sender: 'サンプル株式会社',
                        sentDate: '2024-12-11T15:30:00',
                        content: '承知いたしました。\n\n12月17日（火）14時からでお願いいたします。\n場所はオンラインでよろしいでしょうか。'
                    }
                ]
            }
        ];
    }

    loadMessageDetail(messageId, messageListComponent, targetElementId) {
        const threads = this.getMockMessageThreads();
        let message = null;

        for (const thread of threads) {
            if (thread.parentMessage.id === parseInt(messageId)) {
                message = thread.parentMessage;
                break;
            }
            if (thread.children) {
                const child = thread.children.find(c => c.id === parseInt(messageId));
                if (child) {
                    message = child;
                    break;
                }
            }
        }

        if (message && messageListComponent) {
            const content = message.content || message.body || '';
            messageListComponent.updateDetailContent(targetElementId, content);
        }
    }

    handleUpdate() {
        // 子コンポーネントのデータを保存させる
        const roundManager = this.querySelector('app-meeting-round-manager');
        if (roundManager) {
            roundManager.saveCurrentRoundData();
        }
        
        const currentRound = this.meetingRounds.find(r => r.roundNumber === this.activeRound);
        if (!currentRound) return;

        const template = this.getTemplateByStatus(currentRound.status, currentRound);
        
        const replyComponent = this.querySelector('app-message-reply');
        if (replyComponent) {
            const threads = this.getMockMessageThreads();
            const lastThread = threads[threads.length - 1];
            
            let parentMessageId = lastThread.parentMessage.id;
            let originalSubject = lastThread.parentMessage.subject;
            
            if (lastThread.children && lastThread.children.length > 0) {
                const lastChild = lastThread.children[lastThread.children.length - 1];
                parentMessageId = lastChild.id;
                originalSubject = lastChild.subject;
            }

            replyComponent.open({
                mode: 'reply',
                threadId: lastThread.id,
                parentMessageId: parentMessageId,
                originalSubject: originalSubject
            });

            const bodyTextarea = replyComponent.querySelector('#reply-body');
            if (bodyTextarea) {
                bodyTextarea.value = template;
            }
        }
    }

    getTemplateByStatus(status, round) {
        let baseTemplate = '';
        const formatDateTime = (datetimeStr) => {
            if (!datetimeStr) return 'YYYY/MM/DD HH:mm';
            return datetimeStr.replace('T', ' ').replace(/-/g, '/');
        };
        
        switch (status) {
            case 'proposal':
                baseTemplate = '面談の日程調整をお願いいたします。\n\n候補日：\n1. \n2. \n3. ';
                break;
            case 'pending':
                const datetimeStr = round && round.datetime ? formatDateTime(round.datetime) : 'YYYY/MM/DD HH:mm';
                baseTemplate = '面談日時が確定いたしました。\n\n日時：' + datetimeStr + '\n場所：';
                break;
            case 'canceled':
                baseTemplate = '誠に申し訳ございませんが、面談を中止させていただきたく存じます。\n\n理由：';
                break;
            case 'waiting_result':
                baseTemplate = '面談ありがとうございました。\n結果につきましては、追ってご連絡させていただきます。';
                break;
            case 'passed':
                baseTemplate = '面談の結果、合格となりました。\n\n今後の進め方についてご相談させてください。';
                break;
            case 'failed':
                baseTemplate = '厳正なる選考の結果、誠に残念ながら今回は見送らせていただくことになりました。\nご希望に添えず申し訳ございませんが、何卒ご了承くださいますようお願い申し上げます。';
                break;
            case 'rejected':
                baseTemplate = 'この度は辞退のご連絡をいただき、承知いたしました。\nまたの機会がございましたら、よろしくお願いいたします。';
                break;
            default:
                baseTemplate = 'ステータスが更新されました。';
        }
        
        if (round && round.meetingTool) {
            const meetingToolNames = {
                'zoom': 'Zoom',
                'google-meet': 'Google Meet',
                'teams': 'Microsoft Teams'
            };
            const toolName = meetingToolNames[round.meetingTool] || round.meetingTool;
            
            if (round.meetingUrl) {
                baseTemplate += '\n\n面談URL：' + round.meetingUrl;
            } else {
                baseTemplate += '\n\n面談ツール：' + toolName;
            }
        }
        
        return baseTemplate;
    }

    handleMessageReply(replyData) {
        console.log('メッセージ返信:', replyData);
        
        const messageListComponent = this.querySelector('app-message-list');
        if (messageListComponent) {
            // const threads = this.getMockMessageThreads();
            // messageListComponent.displayThreads(threads);
        }
        
        let message = 'ステータスを更新し、メッセージを送信しました。';
        if (replyData.internalNotification) {
            message += '\n社内通知メールを送信しました。';
        }
        alert(message);
        
        this.close();
    }
}

customElements.define('app-engineer-meeting-edit', AppEngineerMeetingEdit);

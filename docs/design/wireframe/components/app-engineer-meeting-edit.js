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
    }

    /**
     * 依存関係を動的に読み込む
     */
    async loadDependencies() {
        // app-message-listが未定義の場合のみ読み込む
        if (!customElements.get('app-message-list')) {
            try {
                await import('./app-message-list.js');
            } catch (error) {
                console.error('Failed to load app-message-list component:', error);
            }
        }

        // app-message-replyが未定義の場合のみ読み込む
        if (!customElements.get('app-message-reply')) {
            try {
                await import('./app-message-reply.js');
            } catch (error) {
                console.error('Failed to load app-message-reply component:', error);
            }
        }

        // app-message-thread-modalが未定義の場合のみ読み込む
        if (!customElements.get('app-message-thread-modal')) {
            try {
                await import('./app-message-thread-modal.js');
            } catch (error) {
                console.error('Failed to load app-message-thread-modal component:', error);
            }
        }

        // app-project-selectorが未定義の場合のみ読み込む
        if (!customElements.get('app-project-selector')) {
            try {
                await import('./app-project-selector.js');
            } catch (error) {
                console.error('Failed to load app-project-selector component:', error);
            }
        }

        // app-employee-selectorが未定義の場合のみ読み込む
        if (!customElements.get('app-employee-selector')) {
            try {
                await import('./app-employee-selector.js');
            } catch (error) {
                console.error('Failed to load app-employee-selector component:', error);
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
                                <!-- 面談回数のサブタブ -->
                                <div class="meeting-round-tabs" id="meeting-round-tabs" style="display: flex; gap: 8px; margin-bottom: 16px; align-items: center;">
                                    <!-- 動的に生成される -->
                                </div>
                                
                                <!-- 面談回数のコンテンツ -->
                                <div class="meeting-round-contents" id="meeting-round-contents">
                                    <!-- 動的に生成される -->
                                </div>
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

            <!-- 社員選択モーダルコンポーネント -->
            <app-employee-selector></app-employee-selector>

            <!-- 面談ツール設定モーダル -->
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
        `;
    }

    /**
     * 面談回タブを動的に生成
     */
    renderMeetingRoundTabs() {
        const tabsContainer = this.querySelector('#meeting-round-tabs');
        const contentsContainer = this.querySelector('#meeting-round-contents');
        
        if (!tabsContainer || !contentsContainer) return;
        
        // タブボタンを生成
        let tabsHTML = '';
        this.meetingRounds.forEach(round => {
            const activeClass = round.roundNumber === this.activeRound ? 'btn-primary' : 'btn-light';
            tabsHTML += `<button class="meeting-round-tab btn ${activeClass} btn-sm" data-round="${round.roundNumber}">${round.roundNumber}回目</button>`;
        });
        tabsHTML += '<button class="meeting-round-add-btn btn btn-outline-secondary btn-sm">+ 追加</button>';
        tabsContainer.innerHTML = tabsHTML;
        
        // タブコンテンツを生成
        let contentsHTML = '';
        this.meetingRounds.forEach(round => {
            contentsHTML += this.renderMeetingRoundContent(round);
        });
        contentsContainer.innerHTML = contentsHTML;

        // イベントリスナーを再設定
        this.attachMeetingRoundEventListeners();
    }

    /**
     * 指定した面談回のコンテンツHTMLを生成
     */
    renderMeetingRoundContent(round) {
        const activeClass = round.roundNumber === this.activeRound ? 'active' : '';
        const showDeleteBtn = round.status === '';
        
        return `
            <div class="meeting-round-content ${activeClass}" data-round="${round.roundNumber}" style="${activeClass === 'active' ? 'display: block;' : 'display: none;'}">
                <div class="form-section">
                    <!-- 面談ステータス選択 -->
                    <div class="form-section">
                        <label for="meeting-status-${round.roundNumber}" class="form-label">面談ステータス</label>
                        <select id="meeting-status-${round.roundNumber}" name="meeting-status" class="form-select meeting-status-select" data-round="${round.roundNumber}">
                            <option value="">選択してください</option>
                            <option value="proposal" ${round.status === 'proposal' ? 'selected' : ''}>調整中</option>
                            <option value="pending" ${round.status === 'pending' ? 'selected' : ''}>面談確定</option>
                            <option value="canceled" ${round.status === 'canceled' ? 'selected' : ''}>面談中止</option>
                            <option value="waiting_result" ${round.status === 'waiting_result' ? 'selected' : ''}>結果待ち</option>
                            <option value="passed" ${round.status === 'passed' ? 'selected' : ''}>合格</option>
                            <option value="failed" ${round.status === 'failed' ? 'selected' : ''}>不合格</option>
                            <option value="rejected" ${round.status === 'rejected' ? 'selected' : ''}>辞退</option>
                        </select>
                    </div>

                    <div class="form-grid">
                        <div class="form-group">
                            <label for="meeting-datetime-${round.roundNumber}" class="form-label">面談日時</label>
                            <input type="datetime-local" id="meeting-datetime-${round.roundNumber}" name="meeting-datetime" class="form-input" value="${round.datetime}">
                        </div>
                        <div class="form-group">
                            <label for="meeting-duration-${round.roundNumber}" class="form-label">面談時間</label>
                            <select id="meeting-duration-${round.roundNumber}" name="meeting-duration" class="form-select" data-round="${round.roundNumber}">
                                <option value="">選択してください</option>
                                <option value="15" ${round.duration === '15' ? 'selected' : ''}>15分</option>
                                <option value="30" ${round.duration === '30' ? 'selected' : ''}>30分</option>
                                <option value="45" ${round.duration === '45' ? 'selected' : ''}>45分</option>
                                <option value="60" ${round.duration === '60' ? 'selected' : ''}>60分</option>
                                <option value="90" ${round.duration === '90' ? 'selected' : ''}>90分</option>
                                <option value="120" ${round.duration === '120' ? 'selected' : ''}>120分</option>
                            </select>
                        </div>
                        <div class="form-group form-group-full">
                            <label for="meeting-location-${round.roundNumber}" class="form-label">面談場所</label>
                            <input type="text" id="meeting-location-${round.roundNumber}" name="meeting-location" class="form-input" placeholder="例: 東京都千代田区 会議室A" value="${round.location}">
                        </div>
                        
                        <!-- 面談ツール設定 -->
                        <div class="form-group">
                            <label for="meeting-tool-${round.roundNumber}" class="form-label">面談ツール</label>
                            <select id="meeting-tool-${round.roundNumber}" name="meeting-tool" class="form-select meeting-tool-select" data-round="${round.roundNumber}">
                                <option value="">選択してください</option>
                                <option value="zoom" ${round.meetingTool === 'zoom' ? 'selected' : ''}>Zoom</option>
                                <option value="google-meet" ${round.meetingTool === 'google-meet' ? 'selected' : ''}>Google Meet</option>
                                <option value="teams" ${round.meetingTool === 'teams' ? 'selected' : ''}>Microsoft Teams</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">&nbsp;</label>
                            <button type="button" class="btn btn-outline-secondary meeting-tool-setting-btn" data-round="${round.roundNumber}">参加者設定・URL発行</button>
                        </div>
                        <div class="form-group form-group-full">
                            <label for="meeting-url-${round.roundNumber}" class="form-label">面談URL</label>
                            <input type="text" id="meeting-url-${round.roundNumber}" name="meeting-url" class="form-input" value="${round.meetingUrl}" readonly style="background-color: #f5f5f5;">
                        </div>
                        
                        <div class="form-group form-group-full">
                            <label for="meeting-private-note-${round.roundNumber}" class="form-label">面談非公開メモ</label>
                            <textarea id="meeting-private-note-${round.roundNumber}" name="meeting-private-note" class="form-textarea" rows="4" placeholder="社内のみで共有する非公開メモを入力してください">${round.privateNote}</textarea>
                        </div>
                    </div>
                    
                    <div class="meeting-round-footer" style="margin-top: 16px; display: flex; justify-content: flex-end;">
                        <button class="meeting-round-delete-btn btn btn-outline-danger btn-sm" data-round="${round.roundNumber}" style="display: ${showDeleteBtn ? 'block' : 'none'};">
                            この面談を削除
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 面談回を追加
     */
    addMeetingRound() {
        const newRoundNumber = this.meetingRounds.length + 1;
        this.meetingRounds.push({
            roundNumber: newRoundNumber,
            status: '',
            datetime: '', // 日時統合フィールド（YYYY-MM-DDTHH:mm形式）
            duration: '', // 面談時間（分単位）
            location: '',
            privateNote: '',
            meetingTool: '',
            meetingUrl: '',
            engineerParticipants: [],
            projectParticipants: []
        });
        
        // 現在のフォームデータを保存
        this.saveCurrentRoundData();
        
        // タブを再生成
        this.renderMeetingRoundTabs();
        
        // 新しいタブに切り替え
        this.switchMeetingRound(newRoundNumber);
        
        // イベントリスナーを再設定
        this.attachMeetingRoundEventListeners();
        
        // 最新ステータスを更新
        this.updateLatestStatus();
    }

    /**
     * 面談回を削除
     */
    deleteMeetingRound(roundNumber) {
        const round = this.meetingRounds.find(r => r.roundNumber === roundNumber);
        
        // ステータスが選択されている場合は削除できない
        if (round && round.status !== '') {
            alert('ステータスが選択されている面談は削除できません。');
            return;
        }
        
        // 確認ダイアログ
        if (!confirm(`${roundNumber}回目の面談を削除してもよろしいですか?`)) {
            return;
        }
        
        // 配列から削除
        this.meetingRounds = this.meetingRounds.filter(r => r.roundNumber !== roundNumber);
        
        // roundNumberを振り直し
        this.meetingRounds.forEach((r, index) => {
            r.roundNumber = index + 1;
        });
        
        // アクティブな回を調整
        if (this.activeRound >= roundNumber && this.activeRound > 1) {
            this.activeRound--;
        }
        
        // タブを再生成
        this.renderMeetingRoundTabs();
        
        // イベントリスナーを再設定
        this.attachMeetingRoundEventListeners();
        
        // 最新ステータスを更新
        this.updateLatestStatus();
    }

    /**
     * 面談回タブを切り替え
     */
    switchMeetingRound(roundNumber) {
        // 現在のフォームデータを保存
        this.saveCurrentRoundData();
        
        // アクティブな回を更新
        this.activeRound = roundNumber;
        
        // タブボタンのアクティブ状態を更新
        this.querySelectorAll('.meeting-round-tab').forEach(tab => {
            if (parseInt(tab.dataset.round) === roundNumber) {
                tab.classList.remove('btn-light');
                tab.classList.add('btn-primary');
            } else {
                tab.classList.remove('btn-primary');
                tab.classList.add('btn-light');
            }
        });
        
        // タブコンテンツの表示切り替え
        this.querySelectorAll('.meeting-round-content').forEach(content => {
            if (parseInt(content.dataset.round) === roundNumber) {
                content.classList.add('active');
                content.style.display = 'block';
            } else {
                content.classList.remove('active');
                content.style.display = 'none';
            }
        });
    }

    /**
     * 現在アクティブな面談回のフォームデータを保存
     */
    saveCurrentRoundData() {
        const currentRound = this.meetingRounds.find(r => r.roundNumber === this.activeRound);
        if (!currentRound) return;
        
        const statusSelect = this.querySelector(`#meeting-status-${this.activeRound}`);
        const datetimeInput = this.querySelector(`#meeting-datetime-${this.activeRound}`);
        const durationSelect = this.querySelector(`#meeting-duration-${this.activeRound}`);
        const locationInput = this.querySelector(`#meeting-location-${this.activeRound}`);
        const noteTextarea = this.querySelector(`#meeting-private-note-${this.activeRound}`);
        const meetingToolSelect = this.querySelector(`#meeting-tool-${this.activeRound}`);
        const meetingUrlInput = this.querySelector(`#meeting-url-${this.activeRound}`);
        
        if (statusSelect) currentRound.status = statusSelect.value;
        if (datetimeInput) currentRound.datetime = datetimeInput.value;
        if (durationSelect) currentRound.duration = durationSelect.value;
        if (locationInput) currentRound.location = locationInput.value;
        if (noteTextarea) currentRound.privateNote = noteTextarea.value;
        if (meetingToolSelect) currentRound.meetingTool = meetingToolSelect.value;
        if (meetingUrlInput) currentRound.meetingUrl = meetingUrlInput.value;
    }

    /**
     * 削除ボタンの表示/非表示を更新
     */
    updateDeleteButtonVisibility(roundNumber) {
        const round = this.meetingRounds.find(r => r.roundNumber === roundNumber);
        if (!round) return;
        
        const deleteBtn = this.querySelector(`.meeting-round-delete-btn[data-round="${roundNumber}"]`);
        if (deleteBtn) {
            deleteBtn.style.display = round.status === '' ? 'block' : 'none';
        }
    }

    /**
     * 面談回タブ関連のイベントリスナーを設定
     */
    attachMeetingRoundEventListeners() {
        // タブクリック
        this.querySelectorAll('.meeting-round-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const roundNumber = parseInt(tab.dataset.round);
                this.switchMeetingRound(roundNumber);
            });
        });
        
        // 追加ボタン
        const addBtn = this.querySelector('.meeting-round-add-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.addMeetingRound();
            });
        }
        
        // 削除ボタン
        this.querySelectorAll('.meeting-round-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const roundNumber = parseInt(btn.dataset.round);
                this.deleteMeetingRound(roundNumber);
            });
        });
        
        // ステータス変更
        this.querySelectorAll('.meeting-status-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const roundNumber = parseInt(select.dataset.round);
                const round = this.meetingRounds.find(r => r.roundNumber === roundNumber);
                if (round) {
                    round.status = select.value;
                    this.updateDeleteButtonVisibility(roundNumber);
                    this.updateOperationTabStatus(select.value);
                    this.updateLatestStatus();
                }
            });
        });

        // 面談ツール設定ボタン
        this.attachMeetingToolSettingListeners();
    }

    /**
     * 最新ステータスを更新して表示
     */
    updateLatestStatus() {
        const statusElement = this.querySelector('#latest-status-value');
        if (!statusElement) return;

        // 稼働ステータスがある場合はそれを優先
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

        // 面談ステータスを確認（最後の回から）
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

        // どちらもない場合
        statusElement.textContent = '-';
    }

    initEventListeners() {
        // モーダルを閉じる
        const closeBtn = this.querySelector('.modal-close');
        const overlay = this.querySelector('.modal-overlay');
        const cancelBtn = this.querySelector('.meeting-edit-cancel-btn');
        const modal = this.querySelector('.meeting-edit-modal');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.close());
        }

        // 更新ボタンの処理
        const updateBtn = this.querySelector('.meeting-edit-update-btn');
        if (updateBtn) {
            updateBtn.addEventListener('click', () => this.handleUpdate());
        }

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
                // 無効化されているタブはクリックできない
                if (button.disabled || button.classList.contains('disabled')) return;

                const tabId = button.dataset.tab;
                
                // タブボタンのアクティブ化
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // タブコンテンツの表示切り替え
                const tabContents = this.querySelectorAll('.tab-content');
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `tab-${tabId}`) {
                        content.classList.add('active');
                    }
                });
            });
        });

        // 面談回タブのイベントリスナーを設定
        this.attachMeetingRoundEventListeners();

        // メッセージ一覧コンポーネントのイベントリスナー
        const messageListComponent = this.querySelector('app-message-list');
        const replyComponent = this.querySelector('app-message-reply');
        const threadModalComponent = this.querySelector('app-message-thread-modal');

        if (messageListComponent) {
            // 新規メッセージ作成
            messageListComponent.addEventListener('message-new', () => {
                if (replyComponent) {
                    replyComponent.open({ mode: 'new' });
                }
            });

            // 返信
            messageListComponent.addEventListener('message-reply', (e) => {
                const { threadId, parentMessageId, originalSubject } = e.detail;
                if (replyComponent) {
                    replyComponent.open({
                        mode: 'reply',
                        threadId,
                        parentMessageId,
                        originalSubject
                    });
                }
            });

            // 全て表示
            messageListComponent.addEventListener('message-show-all', (e) => {
                const { threadId } = e.detail;
                const threads = this.getMockMessageThreads();
                const thread = threads.find(t => t.id === parseInt(threadId));
                
                if (thread && threadModalComponent) {
                    threadModalComponent.open(thread);
                }
            });

            // 詳細読み込み
            messageListComponent.addEventListener('message-detail-load', (e) => {
                const { messageId, targetElementId } = e.detail;
                this.loadMessageDetail(messageId, messageListComponent, targetElementId);
            });
        }

        // 返信フォームの送信イベント
        if (replyComponent) {
            replyComponent.addEventListener('message-reply-submit', (e) => {
                this.handleMessageReply(e.detail);
            });
        }

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

        // 面談ツール設定モーダル関連
        this.initMeetingToolModalListeners();
    }

    /**
     * 稼働情報タブの有効/無効を更新
     * @param {string} status - 面談ステータス
     */
    updateOperationTabStatus(status) {
        const operationTabBtn = this.querySelector('#tab-btn-operation-info');
        if (!operationTabBtn) return;

        // 稼働決定(accepted)または入場済み(join)の場合のみ有効
        // const isOperationActive = ['accepted', 'join'].includes(status);
        const isOperationActive = true;

        if (isOperationActive) {
            operationTabBtn.classList.remove('disabled');
            operationTabBtn.removeAttribute('disabled');
        } else {
            operationTabBtn.classList.add('disabled');
            operationTabBtn.setAttribute('disabled', 'true');
            
            // もし稼働情報タブが開いていたら、面談情報タブに戻す
            if (operationTabBtn.classList.contains('active')) {
                const meetingTabBtn = this.querySelector('[data-tab="meeting-info"]');
                if (meetingTabBtn) meetingTabBtn.click();
            }
        }
    }

    /**
     * 面談ツール設定モーダル関連のイベントリスナーを初期化
     */
    initMeetingToolModalListeners() {
        // モーダルの開閉
        const modal = this.querySelector('#meeting-tool-setting-modal');
        const modalOverlay = modal?.querySelector('.modal-overlay');
        const modalCloseBtn = modal?.querySelector('.meeting-tool-setting-close');
        const cancelBtn = modal?.querySelector('.meeting-tool-setting-cancel');
        const confirmBtn = modal?.querySelector('.meeting-tool-setting-confirm');

        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => this.closeMeetingToolModal());
        }
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => this.closeMeetingToolModal());
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeMeetingToolModal());
        }
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.saveMeetingToolSettings());
        }

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
     * 面談ツール設定ボタンのイベントリスナーを設定
     * （renderMeetingRoundContentで動的に生成されるため、attachMeetingRoundEventListenersから呼ばれる）
     */
    attachMeetingToolSettingListeners() {
        this.querySelectorAll('.meeting-tool-setting-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const roundNumber = parseInt(btn.dataset.round);
                this.openMeetingToolModal(roundNumber);
            });
        });
    }

    /**
     * 面談ツール設定モーダルを開く
     */
    openMeetingToolModal(roundNumber) {
        this.currentMeetingToolRound = roundNumber;
        const round = this.meetingRounds.find(r => r.roundNumber === roundNumber);
        if (!round) return;

        const modal = this.querySelector('#meeting-tool-setting-modal');
        if (!modal) return;

        // エンジニア側・案件側の社員選択要素を取得
        const engineerSelectWrapper = this.querySelector('#engineer-participants-select-btn')?.closest('.form-group');
        const projectSelectWrapper = this.querySelector('#project-participants-select-btn')?.closest('.form-group');
        const engineerEmailsTextarea = this.querySelector('#engineer-emails');
        const projectEmailsTextarea = this.querySelector('#project-emails');

        // デバッグ: viewSideの値を確認
        console.log('openMeetingToolModal - viewSide:', this.viewSide);

        // viewSideに基づいて表示を制御
        if (this.viewSide === 'engineer') {
            // エンジニア側から表示された場合
            // エンジニア側の社員選択セクションを表示
            if (engineerSelectWrapper) engineerSelectWrapper.style.display = 'block';
            
            // デフォルトでエンジニアとエンジニア担当者を選択状態にする
            if (!round.engineerParticipants.some(p => p.id === this.mockEngineer.id)) {
                round.engineerParticipants.push({
                    id: this.mockEngineer.id,
                    name: this.mockEngineer.name,
                    email: this.mockEngineer.email
                });
            }
            if (!round.engineerParticipants.some(p => p.id === this.mockEngineerManager.id)) {
                round.engineerParticipants.push({
                    id: this.mockEngineerManager.id,
                    name: this.mockEngineerManager.name,
                    email: this.mockEngineerManager.email
                });
            }
            
            // 案件側の社員選択セクションを非表示
            if (projectSelectWrapper) projectSelectWrapper.style.display = 'none';
            
            // 案件側のメールアドレスフィールドに案件担当者のメールアドレスを表示
            if (projectEmailsTextarea) {
                projectEmailsTextarea.value = this.mockProjectManager.email;
            }
            
            // エンジニア側のメールアドレスは既存の参加者のメールアドレスを表示
            if (engineerEmailsTextarea) {
                const engineerEmails = round.engineerParticipants
                    .filter(p => p.email && !p.id) // IDを持たない（メールアドレスのみの）参加者
                    .map(p => p.email)
                    .join(', ');
                engineerEmailsTextarea.value = engineerEmails;
            }
            
        } else if (this.viewSide === 'project') {
            // 案件側から表示された場合
            // 案件側の社員選択セクションを表示
            if (projectSelectWrapper) projectSelectWrapper.style.display = 'block';
            
            // デフォルトで案件担当者を選択状態にする
            if (!round.projectParticipants.some(p => p.id === this.mockProjectManager.id)) {
                round.projectParticipants.push({
                    id: this.mockProjectManager.id,
                    name: this.mockProjectManager.name,
                    email: this.mockProjectManager.email
                });
            }
            
            // エンジニア側の社員選択セクションを非表示
            if (engineerSelectWrapper) engineerSelectWrapper.style.display = 'none';
            
            // エンジニア側のメールアドレスフィールドにエンジニアとエンジニア担当者のメールアドレスを表示
            if (engineerEmailsTextarea) {
                const emails = [
                    this.mockEngineer.email,
                    this.mockEngineerManager.email
                ].filter(Boolean).join(', ');
                engineerEmailsTextarea.value = emails;
            }
            
            // 案件側のメールアドレスは既存の参加者のメールアドレスを表示
            if (projectEmailsTextarea) {
                const projectEmails = round.projectParticipants
                    .filter(p => p.email && !p.id) // IDを持たない（メールアドレスのみの）参加者
                    .map(p => p.email)
                    .join(', ');
                projectEmailsTextarea.value = projectEmails;
            }
            
        } else {
            // どちらでもない場合（既存の動作）
            // 両方のセクションを表示
            if (engineerSelectWrapper) engineerSelectWrapper.style.display = 'block';
            if (projectSelectWrapper) projectSelectWrapper.style.display = 'block';
            
            // エンジニア側参加者を初期設定
            if (engineerEmailsTextarea) {
                const engineerEmails = round.engineerParticipants
                    .filter(p => p.email)
                    .map(p => p.email)
                    .join(', ');
                engineerEmailsTextarea.value = engineerEmails;
            }

            // 案件側参加者を初期設定
            if (projectEmailsTextarea) {
                const projectEmails = round.projectParticipants
                    .filter(p => p.email)
                    .map(p => p.email)
                    .join(', ');
                projectEmailsTextarea.value = projectEmails;
            }
        }

        // 選択済み社員の表示を更新
        this.renderParticipantsDisplay('engineer', round.engineerParticipants);
        this.renderParticipantsDisplay('project', round.projectParticipants);

        modal.classList.add('active');
    }

    /**
     * 面談ツール設定モーダルを閉じる
     */
    closeMeetingToolModal() {
        const modal = this.querySelector('#meeting-tool-setting-modal');
        if (modal) {
            modal.classList.remove('active');
        }
        this.currentMeetingToolRound = null;
    }

    /**
     * 社員選択モーダルを開く
     */
    openEmployeeSelector(side) {
        const employeeSelector = this.querySelector('app-employee-selector');
        if (!employeeSelector) return;

        const round = this.meetingRounds.find(r => r.roundNumber === this.currentMeetingToolRound);
        if (!round) return;

        // 既に選択されている社員を初期選択状態として渡す（{id, name}の形式に変換）
        const participants = side === 'engineer' 
            ? round.engineerParticipants.filter(p => p.id)
            : round.projectParticipants.filter(p => p.id);
        const initialSelected = participants.map(p => ({ id: p.id, name: p.name }));

        employeeSelector.open(initialSelected, (selectedEmployees) => {
            // 選択された社員を反映
            if (side === 'engineer') {
                // IDを持つ参加者のみを更新（メールアドレスのみの参加者は保持）
                const emailOnlyParticipants = round.engineerParticipants.filter(p => !p.id);
                round.engineerParticipants = [
                    ...selectedEmployees.map(e => ({ id: e.id, name: e.name, email: e.email || '' })),
                    ...emailOnlyParticipants
                ];
                this.renderParticipantsDisplay('engineer', round.engineerParticipants);
            } else {
                const emailOnlyParticipants = round.projectParticipants.filter(p => !p.id);
                round.projectParticipants = [
                    ...selectedEmployees.map(e => ({ id: e.id, name: e.name, email: e.email || '' })),
                    ...emailOnlyParticipants
                ];
                this.renderParticipantsDisplay('project', round.projectParticipants);
            }
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

        // IDを持つ参加者のみを取得
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

        // 個別削除ボタンのイベントリスナー
        const removeButtons = selectedList.querySelectorAll('.selected-value-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const side = button.getAttribute('data-side');
                const index = parseInt(button.getAttribute('data-index'));
                this.removeParticipant(side, index);
            });
        });

        // 「すべて解除」ボタンのイベントリスナー
        if (removeAllBtn) {
            // 既存のイベントリスナーを削除してから追加
            const newRemoveAllBtn = removeAllBtn.cloneNode(true);
            removeAllBtn.parentNode.replaceChild(newRemoveAllBtn, removeAllBtn);
            newRemoveAllBtn.addEventListener('click', () => {
                this.removeAllParticipants(side);
            });
        }
    }

    /**
     * 参加者を個別に削除
     */
    removeParticipant(side, index) {
        const round = this.meetingRounds.find(r => r.roundNumber === this.currentMeetingToolRound);
        if (!round) return;

        const participants = side === 'engineer' ? round.engineerParticipants : round.projectParticipants;
        const employeeParticipants = participants.filter(p => p.id);
        
        if (index >= 0 && index < employeeParticipants.length) {
            const removedParticipant = employeeParticipants[index];
            // IDを持つ参加者から削除
            const updatedParticipants = participants.filter(p => p.id !== removedParticipant.id);
            
            if (side === 'engineer') {
                round.engineerParticipants = updatedParticipants;
            } else {
                round.projectParticipants = updatedParticipants;
            }
            
            this.renderParticipantsDisplay(side, updatedParticipants);
        }
    }

    /**
     * すべての参加者を削除
     */
    removeAllParticipants(side) {
        const round = this.meetingRounds.find(r => r.roundNumber === this.currentMeetingToolRound);
        if (!round) return;

        const participants = side === 'engineer' ? round.engineerParticipants : round.projectParticipants;
        // IDを持たない参加者（メールアドレスのみ）は保持
        const emailOnlyParticipants = participants.filter(p => !p.id);
        
        if (side === 'engineer') {
            round.engineerParticipants = emailOnlyParticipants;
        } else {
            round.projectParticipants = emailOnlyParticipants;
        }
        
        this.renderParticipantsDisplay(side, emailOnlyParticipants);
    }

    /**
     * HTMLエスケープ
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 面談ツール設定を保存
     */
    saveMeetingToolSettings() {
        const round = this.meetingRounds.find(r => r.roundNumber === this.currentMeetingToolRound);
        if (!round) return;

        // 現在のフォームデータを保存（面談ツールの選択状態を取得するため）
        this.saveCurrentRoundData();

        // エンジニア側のメールアドレスを取得
        const engineerEmailsTextarea = this.querySelector('#engineer-emails');
        if (engineerEmailsTextarea) {
            const emails = engineerEmailsTextarea.value
                .split(',')
                .map(e => e.trim())
                .filter(e => e.length > 0);
            
            // メールアドレスのみの参加者を追加
            const emailOnlyParticipants = emails.map(email => ({ email }));
            const employeeParticipants = round.engineerParticipants.filter(p => p.id);
            round.engineerParticipants = [...employeeParticipants, ...emailOnlyParticipants];
        }

        // 案件側のメールアドレスを取得
        const projectEmailsTextarea = this.querySelector('#project-emails');
        if (projectEmailsTextarea) {
            const emails = projectEmailsTextarea.value
                .split(',')
                .map(e => e.trim())
                .filter(e => e.length > 0);
            
            const emailOnlyParticipants = emails.map(email => ({ email }));
            const employeeParticipants = round.projectParticipants.filter(p => p.id);
            round.projectParticipants = [...employeeParticipants, ...emailOnlyParticipants];
        }

        // 面談ツールが選択されている場合、URLを発行
        if (round.meetingTool) {
            // TODO: 実際の実装では、ここで面談ツールAPIを呼び出してURLを発行
            // 仮のURLを設定
            round.meetingUrl = `https://example.com/meeting/${round.meetingTool}/${round.roundNumber}`;
            
            // 呼び出し元の面談URLフィールドに反映
            const urlInput = this.querySelector(`#meeting-url-${round.roundNumber}`);
            if (urlInput) {
                urlInput.value = round.meetingUrl;
            }
            
            alert('面談URLを発行しました。URLは発行されますが、通知はまだ送信していません。');
        } else {
            alert('面談ツールを選択してください。');
            return;
        }

        this.closeMeetingToolModal();
    }

    /**
     * モーダルを開く
     * @param {string|number} meetingId - 面談ID
     * @param {string} viewSide - 表示側 ('engineer' | 'project' | null)
     */
    open(meetingId, viewSide = null) {
        this.mode = 'edit';
        this.viewSide = viewSide; // 表示側の情報を保存
        console.log('open() called - meetingId:', meetingId, 'viewSide:', viewSide, 'this.viewSide:', this.viewSide);
        const modal = this.querySelector('.meeting-edit-modal');
        if (modal) {
            modal.classList.add('active');
            this.updateViewMode();
            // TODO: 面談IDに基づいてデータを読み込む
            this.loadMeetingData(meetingId);
        }
    }

    /**
     * 新規作成モードでモーダルを開く
     */
    openForNew() {
        this.mode = 'new';
        this.selectedProject = null;
        const modal = this.querySelector('.meeting-edit-modal');
        if (modal) {
            modal.classList.add('active');
            this.updateViewMode();
            
            // エンジニア情報は親画面から取得するか、ここではモックで設定
            // 実際の実装では、コンテキストからエンジニア情報を取得する
            this.querySelector('#meeting-engineer-name').textContent = '山田太郎';
            this.querySelector('#meeting-engineer-company').textContent = 'テック株式会社';
            this.querySelector('#meeting-engineer-skills').textContent = 'Java, Spring Boot, React';
            
            // 案件情報はクリア
            this.querySelector('#meeting-project-name').textContent = '-';
            this.querySelector('#meeting-project-company').textContent = '-';
            this.querySelector('#meeting-project-manager').textContent = '-';
        }
    }

    /**
     * 表示モードに応じて表示を切り替え
     */
    updateViewMode() {
        const selectionSection = this.querySelector('#project-selection-section');
        const meetingInfoContainer = this.querySelector('#meeting-info-container');
        const messageThreadSection = this.querySelector('#message-thread-section');
        const latestStatusSection = this.querySelector('.latest-status-section');
        const tabContainer = this.querySelector('.tab-container');
        const footer = this.querySelector('.meeting-edit-modal-footer');

        if (this.mode === 'new' && !this.selectedProject) {
            // 新規作成かつ案件未選択時
            if (selectionSection) selectionSection.style.display = 'block';
            
            // 案件情報以外の詳細部分は非表示
            // meetingInfoContainerは表示するが、案件情報は空
            if (meetingInfoContainer) {
                meetingInfoContainer.style.display = 'flex';
                // 案件情報の詳細リンクを非表示にするなどの制御が必要かも
            }
            
            if (messageThreadSection) messageThreadSection.style.display = 'none';
            if (latestStatusSection) latestStatusSection.style.display = 'none';
            if (tabContainer) tabContainer.style.display = 'none';
            if (footer) footer.style.display = 'none';
            
        } else {
            // 編集モードまたは案件選択済み
            if (selectionSection) selectionSection.style.display = 'none';
            if (meetingInfoContainer) meetingInfoContainer.style.display = 'flex';
            if (messageThreadSection) messageThreadSection.style.display = 'block';
            if (latestStatusSection) latestStatusSection.style.display = 'block';
            if (tabContainer) tabContainer.style.display = 'block';
            if (footer) footer.style.display = 'flex';
        }
    }

    /**
     * 案件選択時の処理
     */
    handleProjectSelect(project) {
        this.selectedProject = project;
        
        // 案件情報を表示
        this.querySelector('#meeting-project-name').textContent = project.name;
        this.querySelector('#meeting-project-company').textContent = project.endCompany;
        this.querySelector('#meeting-project-manager').textContent = '担当者A'; // モック
        
        // ビューを更新
        this.updateViewMode();
        
        // 初期データをセット（1回目の面談枠を作成）
        this.meetingRounds = [
            {
                roundNumber: 1,
                status: '',
                datetime: '', // 日時統合フィールド（YYYY-MM-DDTHH:mm形式）
                duration: '', // 面談時間（分単位）
                location: '',
                privateNote: '',
                meetingTool: '',
                meetingUrl: '',
                engineerParticipants: [],
                projectParticipants: []
            }
        ];
        this.activeRound = 1;
        this.renderMeetingRoundTabs();
        this.updateLatestStatus();
    }

    /**
     * 仮案件追加時の処理
     */
    handleProvisionalProject() {
        // モックの仮案件を作成
        const provisionalProject = {
            id: 999,
            name: '【仮】新規案件案件',
            endCompany: '仮株式会社',
            status: 'recruiting'
        };
        
        alert('仮案件を作成しました: ' + provisionalProject.name);
        this.handleProjectSelect(provisionalProject);
    }

    /**
     * モーダルを閉じる
     */
    close() {
        const modal = this.querySelector('.meeting-edit-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    /**
     * 面談データを読み込む（モック）
     */
    loadMeetingData(meetingId) {
        // TODO: APIから面談データを取得してフォームに反映
        console.log('面談データを読み込み:', meetingId);
        
        // 面談回タブを生成
        this.renderMeetingRoundTabs();
        
        // メッセージ一覧を読み込む
        const messageListComponent = this.querySelector('app-message-list');
        if (messageListComponent) {
            const threads = this.getMockMessageThreads();
            messageListComponent.displayThreads(threads);
        }
    }

    /**
     * モックメッセージスレッドデータを取得
     */
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

    /**
     * メッセージ詳細を読み込む
     */
    loadMessageDetail(messageId, messageListComponent, targetElementId) {
        // TODO: APIからメッセージ詳細を取得
        const threads = this.getMockMessageThreads();
        let message = null;

        // スレッドからメッセージを検索
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

    /**
     * メッセージ返信の処理
     */
    /**
     * 更新ボタンクリック時の処理
     */
    handleUpdate() {
        // 現在のフォームデータを保存（最新のデータを取得するため）
        this.saveCurrentRoundData();
        
        // 現在のステータスを取得
        const currentRound = this.meetingRounds.find(r => r.roundNumber === this.activeRound);
        if (!currentRound) return;

        // ステータスに応じたテンプレートを取得
        const template = this.getTemplateByStatus(currentRound.status, currentRound);
        
        // 返信モーダルを開く
        const replyComponent = this.querySelector('app-message-reply');
        if (replyComponent) {
            // スレッドIDを取得（最後のスレッドを使用）
            const threads = this.getMockMessageThreads();
            const lastThread = threads[threads.length - 1];
            
            // 親メッセージIDを取得（スレッドの最後のメッセージ）
            let parentMessageId = lastThread.parentMessage.id;
            let originalSubject = lastThread.parentMessage.subject;
            
            if (lastThread.children && lastThread.children.length > 0) {
                const lastChild = lastThread.children[lastThread.children.length - 1];
                parentMessageId = lastChild.id;
                originalSubject = lastChild.subject;
            }

            // モーダルを開く前に、テンプレートをセットするためのハック
            // app-message-replyのopenメソッドはbodyを受け取らないため、
            // open後にDOMを操作する方法をとる
            replyComponent.open({
                mode: 'reply',
                threadId: lastThread.id,
                parentMessageId: parentMessageId,
                originalSubject: originalSubject
            });

            // 本文にテンプレートをセット
            const bodyTextarea = replyComponent.querySelector('#reply-body');
            if (bodyTextarea) {
                bodyTextarea.value = template;
            }
        }
    }

    /**
     * ステータスに応じたテンプレートを取得
     */
    getTemplateByStatus(status, round) {
        let baseTemplate = '';
        
        // datetimeを読みやすい形式に変換するヘルパー関数
        const formatDateTime = (datetimeStr) => {
            if (!datetimeStr) return 'YYYY/MM/DD HH:mm';
            // YYYY-MM-DDTHH:mm形式をYYYY/MM/DD HH:mm形式に変換
            return datetimeStr.replace('T', ' ').replace(/-/g, '/');
        };
        
        switch (status) {
            case 'proposal': // 調整中
                baseTemplate = '面談の日程調整をお願いいたします。\n\n候補日：\n1. \n2. \n3. ';
                break;
            case 'pending': // 面談確定
                const datetimeStr = round && round.datetime ? formatDateTime(round.datetime) : 'YYYY/MM/DD HH:mm';
                baseTemplate = '面談日時が確定いたしました。\n\n日時：' + datetimeStr + '\n場所：';
                break;
            case 'canceled': // 面談中止
                baseTemplate = '誠に申し訳ございませんが、面談を中止させていただきたく存じます。\n\n理由：';
                break;
            case 'waiting_result': // 結果待ち
                baseTemplate = '面談ありがとうございました。\n結果につきましては、追ってご連絡させていただきます。';
                break;
            case 'passed': // 合格
                baseTemplate = '面談の結果、合格となりました。\n\n今後の進め方についてご相談させてください。';
                break;
            case 'failed': // 不合格
                baseTemplate = '厳正なる選考の結果、誠に残念ながら今回は見送らせていただくことになりました。\nご希望に添えず申し訳ございませんが、何卒ご了承くださいますようお願い申し上げます。';
                break;
            case 'rejected': // 辞退
                baseTemplate = 'この度は辞退のご連絡をいただき、承知いたしました。\nまたの機会がございましたら、よろしくお願いいたします。';
                break;
            default:
                baseTemplate = 'ステータスが更新されました。';
        }
        
        // 面談ツールが選択されている場合は面談URLを追加
        if (round && round.meetingTool) {
            const meetingToolNames = {
                'zoom': 'Zoom',
                'google-meet': 'Google Meet',
                'teams': 'Microsoft Teams'
            };
            const toolName = meetingToolNames[round.meetingTool] || round.meetingTool;
            
            if (round.meetingUrl) {
                // 面談URLが設定されている場合はURLを追加
                baseTemplate += '\n\n面談URL：' + round.meetingUrl;
            } else {
                // 面談URLが設定されていない場合でも、面談ツール名を追加
                baseTemplate += '\n\n面談ツール：' + toolName;
            }
        }
        
        return baseTemplate;
    }

    /**
     * メッセージ返信の処理
     */
    handleMessageReply(replyData) {
        // TODO: APIに送信
        console.log('メッセージ返信:', replyData);
        
        // モックデータに追加（実際の実装ではAPIから取得）
        // ここでは表示を更新
        const messageListComponent = this.querySelector('app-message-list');
        if (messageListComponent) {
            const threads = this.getMockMessageThreads();
            // 新しいメッセージを追加するロジックはモックなので省略し、アラートのみ表示
            // messageListComponent.displayThreads(threads);
        }
        
        let message = 'ステータスを更新し、メッセージを送信しました。';
        if (replyData.internalNotification) {
            message += '\n社内通知メールを送信しました。';
        }
        alert(message);
        
        // モーダルを閉じる
        this.close();
    }
}

// カスタム要素として登録
customElements.define('app-engineer-meeting-edit', AppEngineerMeetingEdit);


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
                date: '',
                time: '',
                location: '',
                privateNote: ''
            }
        ];
        this.activeRound = 1; // 現在アクティブな面談回
        this.operationStatus = ''; // 稼働ステータス
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
                        <div class="meeting-info-container">
                            <!-- エンジニアの基本情報セクション -->
                            <div class="meeting-info-section">
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
                            <div class="meeting-info-section">
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
                        <app-message-list title="面談スレッド - エンジニア・案件でスレッド1つ"></app-message-list>

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
                            <label for="meeting-date-${round.roundNumber}" class="form-label">面談日時</label>
                            <input type="date" id="meeting-date-${round.roundNumber}" name="meeting-date" class="form-input" value="${round.date}">
                        </div>
                        <div class="form-group">
                            <label for="meeting-time-${round.roundNumber}" class="form-label">時刻</label>
                            <input type="time" id="meeting-time-${round.roundNumber}" name="meeting-time" class="form-input" value="${round.time}">
                        </div>
                        <div class="form-group form-group-full">
                            <label for="meeting-location-${round.roundNumber}" class="form-label">面談場所</label>
                            <input type="text" id="meeting-location-${round.roundNumber}" name="meeting-location" class="form-input" placeholder="例: 東京都千代田区 会議室A" value="${round.location}">
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
            date: '',
            time: '',
            location: '',
            privateNote: ''
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
        const dateInput = this.querySelector(`#meeting-date-${this.activeRound}`);
        const timeInput = this.querySelector(`#meeting-time-${this.activeRound}`);
        const locationInput = this.querySelector(`#meeting-location-${this.activeRound}`);
        const noteTextarea = this.querySelector(`#meeting-private-note-${this.activeRound}`);
        
        if (statusSelect) currentRound.status = statusSelect.value;
        if (dateInput) currentRound.date = dateInput.value;
        if (timeInput) currentRound.time = timeInput.value;
        if (locationInput) currentRound.location = locationInput.value;
        if (noteTextarea) currentRound.privateNote = noteTextarea.value;
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
     * モーダルを開く
     */
    open(meetingId) {
        const modal = this.querySelector('.meeting-edit-modal');
        if (modal) {
            modal.classList.add('active');
            // TODO: 面談IDに基づいてデータを読み込む
            this.loadMeetingData(meetingId);
        }
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
        // 現在のステータスを取得
        const currentRound = this.meetingRounds.find(r => r.roundNumber === this.activeRound);
        if (!currentRound) return;

        // ステータスに応じたテンプレートを取得
        const template = this.getTemplateByStatus(currentRound.status);
        
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
            // open後にDOMを操作するか、openメソッドを拡張する必要があるが、
            // ここではopen後にDOMを操作する方法をとる
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
    getTemplateByStatus(status) {
        switch (status) {
            case 'proposal': // 調整中
                return '面談の日程調整をお願いいたします。\n\n候補日：\n1. \n2. \n3. ';
            case 'pending': // 面談確定
                return '面談日時が確定いたしました。\n\n日時：YYYY/MM/DD HH:mm\n場所：';
            case 'canceled': // 面談中止
                return '誠に申し訳ございませんが、面談を中止させていただきたく存じます。\n\n理由：';
            case 'waiting_result': // 結果待ち
                return '面談ありがとうございました。\n結果につきましては、追ってご連絡させていただきます。';
            case 'passed': // 合格
                return '面談の結果、合格となりました。\n\n今後の進め方についてご相談させてください。';
            case 'failed': // 不合格
                return '厳正なる選考の結果、誠に残念ながら今回は見送らせていただくことになりました。\nご希望に添えず申し訳ございませんが、何卒ご了承くださいますようお願い申し上げます。';
            case 'rejected': // 辞退
                return 'この度は辞退のご連絡をいただき、承知いたしました。\nまたの機会がございましたら、よろしくお願いいたします。';
            default:
                return 'ステータスが更新されました。';
        }
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


/**
 * エンジニア面談編集モーダルコンポーネント
 * Web Components (Custom Elements) を使用して実装
 */
class AppEngineerMeetingEdit extends HTMLElement {
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
                                    <a href="public-engineer-detail.html" target="_blank" class="btn btn-outline-primary btn-sm">詳細</a>
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
                                    <a href="public-project-detail.html" target="_blank" class="btn btn-outline-primary btn-sm">詳細</a>
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

                        <!-- タブUI -->
                        <div class="tab-container">
                            <div class="tab-buttons">
                                <button type="button" class="tab-button active" data-tab="meeting-info">面談情報</button>
                                <button type="button" class="tab-button" data-tab="operation-info" id="tab-btn-operation-info">稼働情報</button>
                            </div>

                            <!-- 面談情報タブ -->
                            <div class="tab-content active" id="tab-meeting-info">
                                <div class="form-section">
                                    <!-- 面談ステータス選択 -->
                                    <div class="form-section">
                                        <label for="meeting-status" class="form-label">面談ステータス <span class="form-required">*</span></label>
                                        <select id="meeting-status" name="meeting-status" class="form-select">
                                            <option value="">選択してください</option>
                                            <option value="proposal">提案中</option>
                                            <option value="pending">面談予定</option>
                                            <option value="canceled">面談キャンセル</option>
                                            <option value="waiting_result">結果待ち</option>
                                            <option value="passed">合格</option>
                                            <option value="failed">不合格</option>
                                            <option value="rejected">辞退</option>
                                            <option value="accepted">稼働決定</option>
                                            <option value="join">入場済み</option>
                                        </select>
                                    </div>

                                    <div class="form-grid">
                                        <div class="form-group">
                                            <label for="meeting-date" class="form-label">面談日時</label>
                                            <input type="date" id="meeting-date" name="meeting-date" class="form-input">
                                        </div>
                                        <div class="form-group">
                                            <label for="meeting-time" class="form-label">時刻</label>
                                            <input type="time" id="meeting-time" name="meeting-time" class="form-input">
                                        </div>
                                        <div class="form-group form-group-full">
                                            <label for="meeting-location" class="form-label">面談場所</label>
                                            <input type="text" id="meeting-location" name="meeting-location" class="form-input" placeholder="例: 東京都千代田区 会議室A">
                                        </div>
                                        <div class="form-group form-group-full">
                                            <label for="meeting-note" class="form-label">面談備考</label>
                                            <textarea id="meeting-note" name="meeting-note" class="form-textarea" rows="4" placeholder="面談に関する備考を入力してください"></textarea>
                                        </div>
                                        <div class="form-group form-group-full">
                                            <label for="meeting-private-note" class="form-label">面談非公開メモ</label>
                                            <textarea id="meeting-private-note" name="meeting-private-note" class="form-textarea" rows="4" placeholder="社内のみで共有する非公開メモを入力してください"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 稼働情報タブ -->
                            <div class="tab-content" id="tab-operation-info">
                                <div class="form-section">
                                    <div class="form-grid">
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
                                            <label for="operation-note" class="form-label">備考</label>
                                            <textarea id="operation-note" name="operation-note" class="form-textarea" rows="4" placeholder="稼働に関する備考を入力してください"></textarea>
                                        </div>
                                        <div class="form-group form-group-full">
                                            <label for="operation-private-note" class="form-label">非公開メモ</label>
                                            <textarea id="operation-private-note" name="operation-private-note" class="form-textarea" rows="4" placeholder="社内のみで共有する非公開メモを入力してください"></textarea>
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

        // 更新ボタンの処理は外部JavaScript（engineer-meeting-edit.js）で実装

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

        // 面談ステータス変更時の処理
        const statusSelect = this.querySelector('#meeting-status');
        if (statusSelect) {
            statusSelect.addEventListener('change', () => {
                this.updateOperationTabStatus(statusSelect.value);
            });
            // 初期状態の反映
            this.updateOperationTabStatus(statusSelect.value);
        }

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
        const isOperationActive = ['accepted', 'join'].includes(status);

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
    handleMessageReply(replyData) {
        // TODO: APIに送信
        console.log('メッセージ返信:', replyData);
        
        // モックデータに追加（実際の実装ではAPIから取得）
        // ここでは表示を更新
        const messageListComponent = this.querySelector('app-message-list');
        if (messageListComponent) {
            const threads = this.getMockMessageThreads();
            messageListComponent.displayThreads(threads);
        }
        
        alert('返信を送信しました。');
    }
}

// カスタム要素として登録
customElements.define('app-engineer-meeting-edit', AppEngineerMeetingEdit);


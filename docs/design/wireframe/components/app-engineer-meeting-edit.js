/**
 * エンジニア面談編集モーダルコンポーネント
 * Web Components (Custom Elements) を使用して実装
 */
class AppEngineerMeetingEdit extends HTMLElement {
    connectedCallback() {
        this.render();
        this.initEventListeners();
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

                        <!-- メッセージ一覧セクション -->
                        <div class="message-list-section">
                            <h4 class="message-list-title">メッセージ一覧</h4>
                            <ul class="message-list" id="message-list">
                                <li class="message-list-item" data-message-id="1">
                                    <div class="message-list-header">
                                        <span class="message-list-title-text">面談の日程調整について</span>
                                        <span class="message-list-date">2024/12/10 14:30</span>
                                    </div>
                                    <div class="message-list-from">送信者: サンプル株式会社</div>
                                </li>
                                <li class="message-list-item" data-message-id="2">
                                    <div class="message-list-header">
                                        <span class="message-list-title-text">エンジニアのスキルシート確認</span>
                                        <span class="message-list-date">2024/12/09 10:15</span>
                                    </div>
                                    <div class="message-list-from">送信者: サンプル株式会社</div>
                                </li>
                                <li class="message-list-item" data-message-id="3">
                                    <div class="message-list-header">
                                        <span class="message-list-title-text">面談の場所について</span>
                                        <span class="message-list-date">2024/12/08 16:45</span>
                                    </div>
                                    <div class="message-list-from">送信者: サンプル株式会社</div>
                                </li>
                            </ul>
                            <!-- メッセージ内容表示エリア -->
                            <div class="message-content-area" id="message-content-area" style="display: none;">
                                <div class="message-content-header">
                                    <h5 class="message-content-title" id="message-content-title"></h5>
                                    <button type="button" class="message-content-close" id="message-content-close">×</button>
                                </div>
                                <div class="message-content-body" id="message-content-body"></div>
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

        // メッセージ一覧のクリック処理
        const messageItems = this.querySelectorAll('.message-list-item');
        messageItems.forEach(item => {
            item.addEventListener('click', () => {
                const messageId = item.dataset.messageId;
                this.showMessageContent(messageId);
            });
        });

        // メッセージ内容を閉じる
        const messageContentClose = this.querySelector('#message-content-close');
        if (messageContentClose) {
            messageContentClose.addEventListener('click', () => {
                this.hideMessageContent();
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

        // 面談ステータス変更時の処理
        const statusSelect = this.querySelector('#meeting-status');
        if (statusSelect) {
            statusSelect.addEventListener('change', () => {
                this.updateOperationTabStatus(statusSelect.value);
            });
            // 初期状態の反映
            this.updateOperationTabStatus(statusSelect.value);
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
    }


    /**
     * メッセージ内容を表示
     */
    showMessageContent(messageId) {
        const messageContentArea = this.querySelector('#message-content-area');
        const messageContentTitle = this.querySelector('#message-content-title');
        const messageContentBody = this.querySelector('#message-content-body');
        const messageItems = this.querySelectorAll('.message-list-item');

        // アクティブ状態を更新
        messageItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.messageId === messageId) {
                item.classList.add('active');
            }
        });

        // TODO: APIからメッセージ内容を取得
        // モックデータ
        const mockMessages = {
            '1': {
                title: '面談の日程調整について',
                body: '面談の日程についてご相談があります。\n\n来週の火曜日または水曜日でご都合の良い日時をご指定いただけますでしょうか。'
            },
            '2': {
                title: 'エンジニアのスキルシート確認',
                body: 'エンジニアのスキルシートを確認させていただきました。\n\nご提案いただいた案件に非常に興味を持っております。'
            },
            '3': {
                title: '面談の場所について',
                body: '面談の場所についてご確認させてください。\n\nオンラインでの面談も可能でしょうか。'
            }
        };

        const message = mockMessages[messageId];
        if (message) {
            messageContentTitle.textContent = message.title;
            messageContentBody.textContent = message.body;
            messageContentArea.style.display = 'block';
        }
    }

    /**
     * メッセージ内容を非表示
     */
    hideMessageContent() {
        const messageContentArea = this.querySelector('#message-content-area');
        const messageItems = this.querySelectorAll('.message-list-item');

        messageContentArea.style.display = 'none';
        messageItems.forEach(item => {
            item.classList.remove('active');
        });
    }
}

// カスタム要素として登録
customElements.define('app-engineer-meeting-edit', AppEngineerMeetingEdit);


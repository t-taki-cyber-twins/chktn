/**
 * メール送信プレビューモーダルコンポーネント
 * Web Components (Custom Elements) を使用して実装
 */
class AppEmailPreview extends HTMLElement {
    constructor() {
        super();
        this.callbacks = {
            onCancel: null,
            onUpdateWithoutSend: null,
            onUpdateWithSend: null
        };
    }

    connectedCallback() {
        this.render();
        this.initEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="modal email-preview-modal" id="email-preview-modal">
                <div class="modal-overlay"></div>
                <div class="modal-content email-preview-modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">メール送信プレビュー</h3>
                        <button type="button" class="modal-close" data-modal="email-preview-modal">×</button>
                    </div>
                    <div class="modal-body email-preview-modal-body">
                        <!-- メール内容表示 -->
                        <div class="email-preview-section">
                            <div class="email-preview-item">
                                <label class="email-preview-label">TO</label>
                                <div class="email-preview-value" id="email-preview-to"></div>
                            </div>
                            <div class="email-preview-item">
                                <label class="email-preview-label">タイトル</label>
                                <div class="email-preview-value" id="email-preview-title"></div>
                            </div>
                            <div class="email-preview-item email-preview-item-full">
                                <label class="email-preview-label">本文</label>
                                <div class="email-preview-body" id="email-preview-body"></div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer email-preview-modal-footer">
                        <button type="button" class="btn btn-warning email-preview-cancel-btn">キャンセル</button>
                        <button type="button" class="btn btn-info email-preview-update-without-send-btn">送信しないで更新</button>
                        <button type="button" class="btn btn-success email-preview-update-with-send-btn">送信して更新</button>
                    </div>
                </div>
            </div>
        `;
    }

    initEventListeners() {
        // モーダルを閉じる
        const closeBtn = this.querySelector('.modal-close');
        const overlay = this.querySelector('.modal-overlay');
        const cancelBtn = this.querySelector('.email-preview-cancel-btn');
        const modal = this.querySelector('.email-preview-modal');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                if (this.callbacks.onCancel) {
                    this.callbacks.onCancel();
                }
                this.close();
            });
        }

        // 送信しないで更新ボタン
        const updateWithoutSendBtn = this.querySelector('.email-preview-update-without-send-btn');
        if (updateWithoutSendBtn) {
            updateWithoutSendBtn.addEventListener('click', () => {
                if (this.callbacks.onUpdateWithoutSend) {
                    this.callbacks.onUpdateWithoutSend();
                }
                this.close();
            });
        }

        // 送信して更新ボタン
        const updateWithSendBtn = this.querySelector('.email-preview-update-with-send-btn');
        if (updateWithSendBtn) {
            updateWithSendBtn.addEventListener('click', () => {
                if (this.callbacks.onUpdateWithSend) {
                    this.callbacks.onUpdateWithSend();
                }
                this.close();
            });
        }
    }

    /**
     * モーダルを開く
     * @param {Object} emailData - メールデータ { to, title, body }
     * @param {Object} callbacks - コールバック関数 { onCancel, onUpdateWithoutSend, onUpdateWithSend }
     */
    open(emailData, callbacks = {}) {
        const modal = this.querySelector('.email-preview-modal');
        if (!modal) return;

        // メールデータを表示
        if (emailData) {
            const toElement = this.querySelector('#email-preview-to');
            const titleElement = this.querySelector('#email-preview-title');
            const bodyElement = this.querySelector('#email-preview-body');

            if (toElement) {
                toElement.textContent = emailData.to || '';
            }
            if (titleElement) {
                titleElement.textContent = emailData.title || '';
            }
            if (bodyElement) {
                bodyElement.textContent = emailData.body || '';
            }
        }

        // コールバック関数を保存
        if (callbacks) {
            this.callbacks = {
                onCancel: callbacks.onCancel || null,
                onUpdateWithoutSend: callbacks.onUpdateWithoutSend || null,
                onUpdateWithSend: callbacks.onUpdateWithSend || null
            };
        }

        // モーダルを表示
        modal.classList.add('active');
    }

    /**
     * モーダルを閉じる
     */
    close() {
        const modal = this.querySelector('.email-preview-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
}

// カスタム要素として登録
customElements.define('app-email-preview', AppEmailPreview);


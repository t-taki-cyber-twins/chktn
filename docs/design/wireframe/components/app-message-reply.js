/**
 * メッセージ返信フォームモーダルコンポーネント
 * Web Components (Custom Elements) を使用して実装
 */
class AppMessageReply extends HTMLElement {
    connectedCallback() {
        this.render();
        this.initEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="modal message-reply-modal" id="message-reply-modal">
                <div class="modal-overlay"></div>
                <div class="modal-content message-reply-modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">返信</h3>
                        <button type="button" class="modal-close" data-modal="message-reply-modal">×</button>
                    </div>
                    <div class="modal-body message-reply-modal-body">
                        <form id="message-reply-form" class="message-reply-form">
                            <div class="form-group">
                                <label for="reply-subject" class="form-label">件名 <span class="form-required">*</span></label>
                                <input type="text" id="reply-subject" name="subject" class="form-input" placeholder="件名を入力してください" required>
                            </div>
                            <div class="form-group">
                                <label for="reply-body" class="form-label">本文 <span class="form-required">*</span></label>
                                <textarea id="reply-body" name="body" class="form-textarea" rows="10" placeholder="返信内容を入力してください" required></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer message-reply-modal-footer">
                        <button type="button" class="btn btn-warning message-reply-cancel-btn">キャンセル</button>
                        <button type="button" class="btn btn-primary message-reply-submit-btn">送信</button>
                    </div>
                </div>
            </div>
        `;
    }

    initEventListeners() {
        // モーダルを閉じる
        const closeBtn = this.querySelector('.modal-close');
        const overlay = this.querySelector('.modal-overlay');
        const cancelBtn = this.querySelector('.message-reply-cancel-btn');
        const modal = this.querySelector('.message-reply-modal');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.close());
        }

        // 送信ボタン
        const submitBtn = this.querySelector('.message-reply-submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.handleSubmit());
        }
    }

    /**
     * モーダルを開く
     */
    open(threadId, parentMessageId) {
        const modal = this.querySelector('.message-reply-modal');
        if (modal) {
            modal.classList.add('active');
            this.threadId = threadId;
            this.parentMessageId = parentMessageId;
            // フォームをリセット
            const form = this.querySelector('#message-reply-form');
            if (form) {
                form.reset();
            }
        }
    }

    /**
     * モーダルを閉じる
     */
    close() {
        const modal = this.querySelector('.message-reply-modal');
        if (modal) {
            modal.classList.remove('active');
            // フォームをリセット
            const form = this.querySelector('#message-reply-form');
            if (form) {
                form.reset();
            }
        }
    }

    /**
     * 送信処理
     */
    handleSubmit() {
        const form = this.querySelector('#message-reply-form');
        if (!form) return;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const replyData = {
            threadId: this.threadId,
            parentMessageId: this.parentMessageId,
            subject: formData.get('subject'),
            body: formData.get('body')
        };

        // カスタムイベントを発火
        this.dispatchEvent(new CustomEvent('message-reply-submit', {
            detail: replyData,
            bubbles: true
        }));

        // モーダルを閉じる
        this.close();
    }
}

// カスタム要素として登録
customElements.define('app-message-reply', AppMessageReply);


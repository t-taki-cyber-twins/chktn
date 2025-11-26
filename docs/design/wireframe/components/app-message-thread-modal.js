/**
 * メッセージスレッド全表示モーダルコンポーネント
 * Web Components (Custom Elements) を使用して実装
 */
class AppMessageThreadModal extends HTMLElement {
    connectedCallback() {
        this.render();
        this.initEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="modal message-thread-modal" id="message-thread-modal">
                <div class="modal-overlay"></div>
                <div class="modal-content message-thread-modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title" id="message-thread-modal-title">スレッド詳細</h3>
                        <button type="button" class="modal-close" data-modal="message-thread-modal">×</button>
                    </div>
                    <div class="modal-body message-thread-modal-body">
                        <div id="message-thread-modal-messages">
                            <!-- メッセージ一覧がここに表示される -->
                        </div>
                    </div>
                    <div class="modal-footer message-thread-modal-footer">
                        <button type="button" class="btn btn-warning message-thread-modal-close-btn">閉じる</button>
                    </div>
                </div>
            </div>
        `;
    }

    initEventListeners() {
        const closeBtn = this.querySelector('.modal-close');
        const overlay = this.querySelector('.modal-overlay');
        const closeFooterBtn = this.querySelector('.message-thread-modal-close-btn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }

        if (closeFooterBtn) {
            closeFooterBtn.addEventListener('click', () => this.close());
        }
    }

    /**
     * モーダルを開く
     */
    open(thread) {
        const modal = this.querySelector('.message-thread-modal');
        const titleElement = this.querySelector('#message-thread-modal-title');
        const messagesContainer = this.querySelector('#message-thread-modal-messages');
        
        if (modal && titleElement && messagesContainer) {
            // タイトル設定
            titleElement.textContent = thread.parentMessage.title || 'スレッド詳細';
            
            // メッセージ一覧を生成
            const messagesHtml = this.generateMessagesHtml(thread);
            messagesContainer.innerHTML = messagesHtml;
            
            // モーダル表示
            modal.classList.add('active');
        }
    }

    /**
     * モーダルを閉じる
     */
    close() {
        const modal = this.querySelector('.message-thread-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    /**
     * メッセージ一覧のHTMLを生成
     */
    generateMessagesHtml(thread) {
        let html = '';
        
        // 親メッセージ
        html += this.createMessageItemHtml(thread.parentMessage, true);
        
        // 子メッセージ（時系列順）
        if (thread.children && thread.children.length > 0) {
            thread.children.forEach(child => {
                html += this.createMessageItemHtml(child, false);
            });
        }
        
        return html;
    }

    /**
     * 個別メッセージのHTMLを生成
     */
    createMessageItemHtml(message, isParent) {
        const messageClass = isParent ? 'message-thread-modal-message-parent' : 'message-thread-modal-message-child';
        
        return `
            <div class="message-thread-modal-message ${messageClass}">
                <div class="message-thread-modal-message-header">
                    <span class="message-thread-modal-message-sender">${this.escapeHtml(message.sender)}</span>
                    <span class="message-thread-modal-message-date">${this.formatDateTime(message.sentDate)}</span>
                </div>
                <div class="message-thread-modal-message-subject">
                    件名: ${this.escapeHtml(message.subject || message.title)}
                </div>
                <div class="message-thread-modal-message-body">
                    ${this.escapeHtml(message.content || message.body || '').replace(/\n/g, '<br>')}
                </div>
            </div>
        `;
    }

    /**
     * 日時をフォーマット
     */
    formatDateTime(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }

    /**
     * HTMLエスケープ
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// カスタム要素として登録
customElements.define('app-message-thread-modal', AppMessageThreadModal);

/**
 * メッセージ一覧共通コンポーネント
 * Web Components (Custom Elements) を使用して実装
 */
class AppMessageList extends HTMLElement {
    connectedCallback() {
        this.render();
        this.initEventListeners();
    }

    render() {
        const title = this.getAttribute('title') || 'メッセージスレッド一覧';
        const showAddButton = this.getAttribute('show-add-button') === 'true';
        const showAddInquiryButton = this.getAttribute('show-add-inquiry-button') === 'true';

        this.innerHTML = `
            <div class="message-list-section-header">
                <h2 class="inquiry-message-list-title">${this.escapeHtml(title)}</h2>
                ${showAddButton ? '<button type="button" class="btn btn-primary message-list-add-btn" id="message-list-add-btn">新規追加</button>' : ''}
                ${showAddInquiryButton ? '<button type="button" class="btn btn-warning message-list-add-inquiry-btn" id="message-list-add-inquiry-btn">問い合わせ</button>' : ''}
            </div>
            <div class="message-list-section">
                <ul class="message-thread-list" id="message-thread-list">
                    <!-- スレッド構造はJavaScriptで動的に生成 -->
                </ul>
            </div>
        `;
    }

    initEventListeners() {
        const messageThreadList = this.querySelector('#message-thread-list');
        const addBtn = this.querySelector('#message-list-add-btn');
        const addInquiryBtn = this.querySelector('#message-list-add-inquiry-btn');

        if (!messageThreadList) return;

        // 新規追加ボタン
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('message-new', {
                    bubbles: true
                }));
            });
        }

        // 新規問い合わせボタン
        if (addInquiryBtn) {
            addInquiryBtn.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('message-new', {
                    bubbles: true
                }));
            });
        }

        // イベント委譲でクリック処理
        messageThreadList.addEventListener('click', (e) => {
            // 全て表示ボタン
            const showAllBtn = e.target.closest('.message-thread-show-all-btn');
            if (showAllBtn) {
                e.stopPropagation();
                const threadId = showAllBtn.dataset.threadId;
                
                this.dispatchEvent(new CustomEvent('message-show-all', {
                    detail: { threadId },
                    bubbles: true
                }));
                return;
            }

            // 返信ボタン
            const replyBtn = e.target.closest('.message-thread-reply-btn');
            if (replyBtn) {
                e.stopPropagation();
                const threadId = replyBtn.dataset.threadId;
                const parentMessageId = replyBtn.dataset.parentMessageId;
                const originalSubject = replyBtn.dataset.originalSubject;
                
                this.dispatchEvent(new CustomEvent('message-reply', {
                    detail: { threadId, parentMessageId, originalSubject },
                    bubbles: true
                }));
                return;
            }

            // 親スレッドメッセージのクリック
            const parentMessage = e.target.closest('.message-thread-parent');
            if (parentMessage) {
                const messageId = parentMessage.dataset.messageId;
                const threadId = parentMessage.dataset.threadId;
                
                // 他の展開中の詳細を閉じる
                this.querySelectorAll('.message-thread-parent').forEach(item => {
                    if (item !== parentMessage) {
                        item.classList.remove('active');
                        const detailArea = item.nextElementSibling;
                        if (detailArea && detailArea.classList.contains('message-thread-detail-area')) {
                            detailArea.style.display = 'none';
                        }
                    }
                });

                // クリックされた親メッセージの詳細を開く/閉じる
                const isActive = parentMessage.classList.toggle('active');
                let detailArea = parentMessage.nextElementSibling;
                
                if (!detailArea || !detailArea.classList.contains('message-thread-detail-area')) {
                    // 詳細エリアが存在しない場合は作成
                    detailArea = document.createElement('div');
                    detailArea.className = 'message-thread-detail-area';
                    detailArea.innerHTML = `
                        <div class="message-thread-detail-content" id="detail-${messageId}">
                            <div class="loading">読み込み中...</div>
                        </div>
                    `;
                    parentMessage.after(detailArea);
                }
                
                detailArea.style.display = isActive ? 'block' : 'none';
                
                if (isActive) {
                    // カスタムイベントで内容読み込みを要求
                    this.dispatchEvent(new CustomEvent('message-detail-load', {
                        detail: { messageId, threadId, targetElementId: `detail-${messageId}` },
                        bubbles: true
                    }));
                }
                
                return;
            }
        });
    }

    /**
     * メッセージスレッドを表示
     */
    displayThreads(threads) {
        const messageThreadList = this.querySelector('#message-thread-list');
        if (!messageThreadList) return;

        messageThreadList.innerHTML = threads.map(thread => this.createThreadHTML(thread)).join('');
    }

    /**
     * スレッドのHTMLを生成
     */
    createThreadHTML(thread) {
        // 最新の子スレッド1件を取得（新しいメッセージ順）
        const latestChild = thread.children && thread.children.length > 0 
            ? thread.children[thread.children.length - 1] 
            : null;

        const latestChildHtml = latestChild 
            ? `<div class="message-thread-latest-child">
                <div class="message-thread-child-header">
                  <span class="message-thread-child-from">${this.escapeHtml(latestChild.sender)}</span>
                  <span class="message-thread-child-date">${this.formatDateTime(latestChild.sentDate)}</span>
                </div>
              </div>`
            : '';

        return `
            <li class="message-thread-item" data-thread-id="${thread.id}">
                <div class="message-thread-parent" data-message-id="${thread.parentMessage.id}" data-thread-id="${thread.id}">
                    <div class="message-list-header">
                        <span class="message-list-title-text">${this.escapeHtml(thread.parentMessage.title)}</span>
                        <span class="message-list-date">${this.formatDateTime(thread.parentMessage.sentDate)}</span>
                    </div>
                    <div class="message-list-from">送信者: ${this.escapeHtml(thread.parentMessage.sender)}</div>
                    ${latestChildHtml}
                    <div class="message-thread-actions">
                        ${thread.children && thread.children.length > 0 
                            ? `<button type="button" class="btn btn-secondary btn-sm message-thread-show-all-btn" data-thread-id="${thread.id}">全て表示</button>` 
                            : ''}
                        <button type="button" class="btn btn-primary btn-sm message-thread-reply-btn" 
                            data-thread-id="${thread.id}" 
                            data-parent-message-id="${thread.parentMessage.id}"
                            data-original-subject="${this.escapeHtml(thread.parentMessage.subject || thread.parentMessage.title)}">返信</button>
                    </div>
                </div>
            </li>
        `;
    }

    /**
     * 詳細エリアの内容を更新
     */
    updateDetailContent(targetElementId, content) {
        const targetElement = this.querySelector(`#${targetElementId}`);
        if (targetElement) {
            targetElement.innerHTML = `
                <div class="message-detail-body">
                    ${this.escapeHtml(content).replace(/\n/g, '<br>')}
                </div>
            `;
        }
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
customElements.define('app-message-list', AppMessageList);

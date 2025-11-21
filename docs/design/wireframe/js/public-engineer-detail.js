/* ========================================
   公開エンジニア詳細画面固有JavaScript
   ======================================== */

let selectedProjectId = null;
let selectedProjectData = null;

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    initProjectSelector();
    initScoutButton();
    initInquiryButton();
    initInquiryMessageList();
    // エンジニア情報はHTMLに静的に記述されているため、ロード処理は省略（必要に応じて実装）
});

/**
 * 案件選択の初期化
 */
function initProjectSelector() {
    const projectSelector = document.querySelector('app-project-selector');
    const selectBtn = document.getElementById('project-select-btn');
    
    if (!projectSelector) return;
    
    // 案件選択ボタンのクリックイベント
    if (selectBtn) {
        selectBtn.addEventListener('click', function() {
            projectSelector.open();
        });
    }
    
    // 案件選択イベント
    projectSelector.addEventListener('project-selected', function(e) {
        const { projectId, projectData } = e.detail;
        selectProject(projectData);
    });
}

/**
 * 案件を選択
 */
function selectProject(project) {
    selectedProjectId = project.id;
    selectedProjectData = project;
    
    // サイドメニューの表示を更新
    updateSidebarProjectDisplay(project);
    
    // スカウトボタンを有効化
    const scoutBtn = document.getElementById('scout-btn');
    if (scoutBtn) {
        scoutBtn.disabled = false;
    }
}

/**
 * サイドメニューの案件表示を更新
 */
function updateSidebarProjectDisplay(project) {
    const sidebarSelected = document.getElementById('sidebar-project-selected');
    if (!sidebarSelected) return;
    
    // 案件の場合はスキルではなく、単価や期間などを表示するかも？
    // ここではシンプルに案件名を表示
    
    sidebarSelected.innerHTML = `
        <div class="sidebar-project-selected-item">
            <div class="sidebar-project-selected-name">${escapeHtml(project.name)}</div>
            <div class="sidebar-project-selected-text" style="font-size: 12px; margin-bottom: 4px;">
                単価: ${project.priceMin}〜${project.priceMax}万円
            </div>
            <button type="button" class="btn btn-secondary btn-sm sidebar-project-select-btn" id="project-select-btn">変更</button>
        </div>
    `;
    
    // 変更ボタンのイベントリスナーを再設定
    const changeBtn = document.getElementById('project-select-btn');
    if (changeBtn) {
        changeBtn.addEventListener('click', function() {
            const projectSelector = document.querySelector('app-project-selector');
            if (projectSelector) {
                projectSelector.open();
            }
        });
    }
}

/**
 * スカウトボタンの初期化
 */
function initScoutButton() {
    const scoutBtn = document.getElementById('scout-btn');
    
    if (scoutBtn) {
        scoutBtn.addEventListener('click', function() {
            if (!selectedProjectData) {
                alert('案件を選択してください。');
                return;
            }
            
            const engineerName = document.querySelector('.form-display-value')?.textContent || 'このエンジニア';
            const projectName = selectedProjectData.name;
            
            if (confirm(`「${engineerName}」を「${projectName}」にスカウトしますか？`)) {
                // TODO: 実際のAPI呼び出しに置き換える
                console.log('スカウト送信:', {
                    engineerId: getEngineerIdFromUrl(),
                    projectId: selectedProjectId
                });
                alert('スカウトを送信しました。');
            }
        });
    }

    // テーブル内のスカウトボタン
    const tableScoutBtns = document.querySelectorAll('.scout-send-btn');
    tableScoutBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const projectId = this.dataset.projectId;
            const row = this.closest('tr');
            const projectName = row.querySelector('td:first-child').textContent;
            const engineerName = document.querySelector('.form-display-value')?.textContent || 'このエンジニア';

            if (confirm(`「${engineerName}」を「${projectName}」にスカウトしますか？`)) {
                console.log('スカウト送信:', {
                    engineerId: getEngineerIdFromUrl(),
                    projectId: projectId
                });
                alert('スカウトを送信しました。');
                
                // ボタンの状態を更新（簡易的）
                this.textContent = '送信済';
                this.disabled = true;
                this.classList.remove('btn-primary');
                this.classList.add('btn-secondary');
                
                // ステータスバッジを更新
                const statusBadge = row.querySelector('.badge');
                if (statusBadge) {
                    statusBadge.textContent = 'スカウト済';
                    statusBadge.className = 'badge badge-status-completed';
                }
            }
        });
    });
}

/**
 * 問い合わせボタンの初期化
 */
function initInquiryButton() {
    const inquiryBtn = document.getElementById('inquiry-btn');
    
    if (inquiryBtn) {
        inquiryBtn.addEventListener('click', function() {
            const engineerName = document.querySelector('.form-display-value')?.textContent || 'このエンジニア';
            
            // TODO: 実際のAPI呼び出しに置き換える
            console.log('問い合わせ:', {
                engineerId: getEngineerIdFromUrl()
            });
            
            alert(`「${engineerName}」について問い合わせますか？\n（問い合わせ画面への遷移は実装予定です）`);
        });
    }
}

/**
 * URLからエンジニアIDを取得
 */
function getEngineerIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('engineerId') || null;
}

/**
 * HTMLエスケープ
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 問い合わせメッセージ一覧の初期化
 */
function initInquiryMessageList() {
    const messageList = document.getElementById('inquiry-message-list');
    const messageContentArea = document.getElementById('inquiry-message-content-area');
    const messageContentTitle = document.getElementById('inquiry-message-content-title');
    const messageContentBody = document.getElementById('inquiry-message-content-body');
    const messageContentClose = document.getElementById('inquiry-message-content-close');

    if (!messageList || !messageContentArea) return;

    // スレッド構造のメッセージを表示
    displayInquiryMessageThreads();

    // イベント委譲でクリック処理
    messageList.addEventListener('click', function(e) {
        // 全て表示ボタン
        const showAllBtn = e.target.closest('.message-thread-show-all-btn');
        if (showAllBtn) {
            e.stopPropagation();
            const threadId = showAllBtn.dataset.threadId;
            toggleThreadChildren(threadId);
            return;
        }

        // 返信ボタン
        const replyBtn = e.target.closest('.message-thread-reply-btn');
        if (replyBtn) {
            e.stopPropagation();
            const threadId = replyBtn.dataset.threadId;
            const parentMessageId = replyBtn.dataset.parentMessageId;
            openReplyModal(threadId, parentMessageId);
            return;
        }

        // 子スレッドメッセージのクリック
        const childMessage = e.target.closest('.message-thread-child-item');
        if (childMessage) {
            e.stopPropagation();
            const messageId = childMessage.dataset.messageId;
            
            // すべての子メッセージからactiveクラスを削除
            messageList.querySelectorAll('.message-thread-child-item').forEach(item => {
                item.classList.remove('active');
            });

            // クリックされた子メッセージにactiveクラスを追加
            childMessage.classList.add('active');

            // メッセージ内容を表示
            loadInquiryMessageContent(messageId, messageContentTitle, messageContentBody);
            messageContentArea.style.display = 'block';
            return;
        }

        // 親スレッドメッセージのクリック
        const parentMessage = e.target.closest('.message-thread-parent');
        if (parentMessage) {
            const messageId = parentMessage.dataset.messageId;
            
            // すべてのメッセージ項目からactiveクラスを削除
            messageList.querySelectorAll('.message-thread-parent').forEach(item => {
                item.classList.remove('active');
            });
            messageList.querySelectorAll('.message-thread-child-item').forEach(item => {
                item.classList.remove('active');
            });

            // クリックされた親メッセージにactiveクラスを追加
            parentMessage.classList.add('active');

            // メッセージ内容を表示
            loadInquiryMessageContent(messageId, messageContentTitle, messageContentBody);
            messageContentArea.style.display = 'block';
            return;
        }
    });

    // メッセージ内容を閉じる
    if (messageContentClose) {
        messageContentClose.addEventListener('click', function() {
            messageContentArea.style.display = 'none';
            // すべてのメッセージ項目からactiveクラスを削除
            messageList.querySelectorAll('.message-thread-parent').forEach(item => {
                item.classList.remove('active');
            });
            messageList.querySelectorAll('.message-thread-child-item').forEach(item => {
                item.classList.remove('active');
            });
        });
    }

    // 返信フォームの送信イベント
    const replyComponent = document.querySelector('app-message-reply');
    if (replyComponent) {
        replyComponent.addEventListener('message-reply-submit', function(e) {
            handleMessageReply(e.detail);
        });
    }
}

/**
 * 問い合わせメッセージスレッドを表示
 */
function displayInquiryMessageThreads() {
    const messageList = document.getElementById('inquiry-message-list');
    if (!messageList) return;

    const threads = getMockInquiryThreads();
    
    messageList.innerHTML = threads.map(thread => createThreadHTML(thread)).join('');
}

/**
 * スレッドのHTMLを生成
 */
function createThreadHTML(thread) {
    // 最新の子スレッド1件を取得（新しいメッセージ順）
    const latestChild = thread.children && thread.children.length > 0 
        ? thread.children[thread.children.length - 1] 
        : null;
    
    // 子スレッドのHTML（折りたたみ状態）
    const childrenHtml = thread.children && thread.children.length > 0
        ? `<div class="message-thread-children" id="thread-children-${thread.id}" style="display: none;">
            ${thread.children.map(child => createChildMessageHTML(child, thread.id)).join('')}
          </div>`
        : '';

    const latestChildHtml = latestChild 
        ? `<div class="message-thread-latest-child">
            <div class="message-thread-child-item" data-message-id="${latestChild.id}" data-thread-id="${thread.id}">
              <div class="message-thread-child-header">
                <span class="message-thread-child-from">${escapeHtml(latestChild.sender)}</span>
                <span class="message-thread-child-date">${formatDateTime(latestChild.sentDate)}</span>
              </div>
            </div>
          </div>`
        : '';

    return `
        <li class="message-thread-item" data-thread-id="${thread.id}">
            <div class="message-thread-parent" data-message-id="${thread.parentMessage.id}">
                <div class="message-list-header">
                    <span class="message-list-title-text">${escapeHtml(thread.parentMessage.title)}</span>
                    <span class="message-list-date">${formatDateTime(thread.parentMessage.sentDate)}</span>
                </div>
                <div class="message-list-from">送信者: ${escapeHtml(thread.parentMessage.sender)}</div>
                <div class="message-thread-actions">
                    ${thread.children && thread.children.length > 0 
                        ? `<button type="button" class="btn btn-secondary btn-sm message-thread-show-all-btn" data-thread-id="${thread.id}">全て表示</button>` 
                        : ''}
                    <button type="button" class="btn btn-primary btn-sm message-thread-reply-btn" data-thread-id="${thread.id}" data-parent-message-id="${thread.parentMessage.id}">返信</button>
                </div>
            </div>
            ${latestChildHtml}
            ${childrenHtml}
        </li>
    `;
}

/**
 * 子メッセージのHTMLを生成
 */
function createChildMessageHTML(child, threadId) {
    return `
        <div class="message-thread-child-item" data-message-id="${child.id}" data-thread-id="${threadId}">
            <div class="message-thread-child-header">
                <span class="message-thread-child-from">${escapeHtml(child.sender)}</span>
                <span class="message-thread-child-date">${formatDateTime(child.sentDate)}</span>
            </div>
        </div>
    `;
}

/**
 * スレッドの子メッセージを表示/非表示
 */
function toggleThreadChildren(threadId) {
    const childrenContainer = document.getElementById(`thread-children-${threadId}`);
    const showAllBtn = document.querySelector(`.message-thread-show-all-btn[data-thread-id="${threadId}"]`);
    
    if (!childrenContainer || !showAllBtn) return;

    const isVisible = childrenContainer.style.display !== 'none';
    
    if (isVisible) {
        childrenContainer.style.display = 'none';
        showAllBtn.textContent = '全て表示';
    } else {
        childrenContainer.style.display = 'block';
        showAllBtn.textContent = '折りたたむ';
    }
}

/**
 * 返信モーダルを開く
 */
function openReplyModal(threadId, parentMessageId) {
    const replyComponent = document.querySelector('app-message-reply');
    if (replyComponent) {
        replyComponent.open(threadId, parentMessageId);
    }
}

/**
 * メッセージ返信の処理
 */
function handleMessageReply(replyData) {
    // TODO: APIに送信
    console.log('メッセージ返信:', replyData);
    
    // モックデータに追加（実際の実装ではAPIから取得）
    // ここでは表示を更新
    displayInquiryMessageThreads();
    
    alert('返信を送信しました。');
}

/**
 * 問い合わせメッセージ内容を読み込む（モック）
 */
function loadInquiryMessageContent(messageId, titleElement, bodyElement) {
    // TODO: APIからメッセージ内容を取得
    const threads = getMockInquiryThreads();
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

    if (message && titleElement && bodyElement) {
        titleElement.textContent = message.subject || message.title;
        // 改行を<br>タグに変換して表示
        bodyElement.innerHTML = escapeHtml(message.content || message.body).replace(/\n/g, '<br>');
    }
}

/**
 * モック問い合わせスレッドデータを取得
 */
function getMockInquiryThreads() {
    return [
        {
            id: 1,
            parentMessage: {
                id: 1,
                title: 'エンジニアについての問い合わせ',
                subject: 'エンジニアについての問い合わせ',
                sender: 'テック株式会社',
                sentDate: '2024-12-12T15:30:00',
                content: 'このエンジニアについて、いくつか質問がございます。\n\n1. 稼働開始可能日について\n2. リモートワークの条件について\n\n以上について、詳細を教えていただけますでしょうか。\n\nよろしくお願いいたします。'
            },
            children: [
                {
                    id: 11,
                    subject: 'Re: エンジニアについての問い合わせ',
                    sender: 'サンプル株式会社',
                    sentDate: '2024-12-13T10:00:00',
                    content: 'ご質問ありがとうございます。\n\n1. 稼働開始可能日について\n12月1日から稼働可能です。\n\n2. リモートワークの条件について\nフルリモート可能です。\n\nご不明な点がございましたら、お気軽にお問い合わせください。'
                }
            ]
        }
    ];
}

/**
 * 日時をフォーマット
 */
function formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
}

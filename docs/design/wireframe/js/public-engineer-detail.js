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
    // エンジニア情報はHTMLに静的に記述されているため、ロード処理は省略(必要に応じて実装)
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
    const messageListComponent = document.querySelector('app-message-list');
    const replyComponent = document.querySelector('app-message-reply');
    const threadModalComponent = document.querySelector('app-message-thread-modal');

    if (!messageListComponent) return;

    // メッセージスレッドを表示
    const threads = getMockInquiryThreads();
    messageListComponent.displayThreads(threads);

    // 新規メッセージイベント
    messageListComponent.addEventListener('message-new', function() {
        if (replyComponent) {
            replyComponent.open({ mode: 'new' });
        }
    });

    // 返信イベント
    messageListComponent.addEventListener('message-reply', function(e) {
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

    // 全て表示イベント
    messageListComponent.addEventListener('message-show-all', function(e) {
        const { threadId } = e.detail;
        const threads = getMockInquiryThreads();
        const thread = threads.find(t => t.id === parseInt(threadId));
        
        if (thread && threadModalComponent) {
            threadModalComponent.open(thread);
        }
    });

    // 詳細読み込みイベント
    messageListComponent.addEventListener('message-detail-load', function(e) {
        const { messageId, targetElementId } = e.detail;
        loadInquiryMessageContent(messageId, messageListComponent, targetElementId);
    });

    // 返信フォームの送信イベント
    if (replyComponent) {
        replyComponent.addEventListener('message-reply-submit', function(e) {
            handleMessageReply(e.detail);
        });
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
    const messageListComponent = document.querySelector('app-message-list');
    if (messageListComponent) {
        const threads = getMockInquiryThreads();
        messageListComponent.displayThreads(threads);
    }
    
    alert('返信を送信しました。');
}

/**
 * 問い合わせメッセージ内容を読み込む（モック）
 */
function loadInquiryMessageContent(messageId, messageListComponent, targetElementId) {
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

    if (message && messageListComponent) {
        const content = message.content || message.body || '';
        messageListComponent.updateDetailContent(targetElementId, content);
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

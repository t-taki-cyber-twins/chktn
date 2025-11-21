/* ========================================
   公開案件詳細画面固有JavaScript
   ======================================== */

let selectedEngineerId = null;
let selectedEngineerData = null;

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    initEngineerSelector();
    initMeetingApplyButton();
    initInquiryButton();
    initInquiryMessageList();
    loadInitialEngineer();
});

/**
 * URLパラメータから初期選択エンジニアを読み込む
 */
function loadInitialEngineer() {
    const urlParams = new URLSearchParams(window.location.search);
    const engineerId = urlParams.get('engineerId');
    
    if (engineerId) {
        // モックデータからエンジニアを取得
        const engineers = getMockEngineers();
        const engineer = engineers.find(e => e.id === parseInt(engineerId));
        
        if (engineer) {
            selectEngineer(engineer);
        }
    }
}

/**
 * エンジニア選択の初期化
 */
function initEngineerSelector() {
    const engineerSelector = document.querySelector('app-engineer-selector');
    const selectBtn = document.getElementById('engineer-select-btn');
    
    if (!engineerSelector) return;
    
    // エンジニア選択ボタンのクリックイベント
    if (selectBtn) {
        selectBtn.addEventListener('click', function() {
            engineerSelector.open();
        });
    }
    
    // エンジニア選択イベント
    engineerSelector.addEventListener('engineer-selected', function(e) {
        const { engineerId, engineerData } = e.detail;
        selectEngineer(engineerData);
    });
}

/**
 * エンジニアを選択
 */
function selectEngineer(engineer) {
    selectedEngineerId = engineer.id;
    selectedEngineerData = engineer;
    
    // サイドメニューの表示を更新
    updateSidebarEngineerDisplay(engineer);
    
    // 面談申込ボタンを有効化
    const meetingApplyBtn = document.getElementById('meeting-apply-btn');
    if (meetingApplyBtn) {
        meetingApplyBtn.disabled = false;
    }
}

/**
 * サイドメニューのエンジニア表示を更新
 */
function updateSidebarEngineerDisplay(engineer) {
    const sidebarSelected = document.getElementById('sidebar-engineer-selected');
    if (!sidebarSelected) return;
    
    const skillsHtml = engineer.skills.map(skill => 
        `<span class="skill-tag">${escapeHtml(skill)}</span>`
    ).join('');
    
    const matchingScoreHtml = engineer.matchingScore !== null && engineer.matchingScore !== undefined
        ? `<div class="sidebar-engineer-selected-matching-score">
            マッチングスコア: <span class="matching-score-badge matching-score-${getScoreClass(engineer.matchingScore)}">${engineer.matchingScore}%</span>
           </div>`
        : '';
    
    sidebarSelected.innerHTML = `
        <div class="sidebar-engineer-selected-item">
            <div class="sidebar-engineer-selected-name">${escapeHtml(engineer.name)}</div>
            <div class="sidebar-engineer-selected-skills">
                ${skillsHtml}
            </div>
            ${matchingScoreHtml}
            <button type="button" class="btn btn-secondary btn-sm sidebar-engineer-select-btn" id="engineer-select-btn">変更</button>
        </div>
    `;
    
    // 変更ボタンのイベントリスナーを再設定
    const changeBtn = document.getElementById('engineer-select-btn');
    if (changeBtn) {
        changeBtn.addEventListener('click', function() {
            const engineerSelector = document.querySelector('app-engineer-selector');
            if (engineerSelector) {
                engineerSelector.open();
            }
        });
    }
}

/**
 * 面談申込ボタンの初期化
 */
function initMeetingApplyButton() {
    const meetingApplyBtn = document.getElementById('meeting-apply-btn');
    
    if (meetingApplyBtn) {
        meetingApplyBtn.addEventListener('click', function() {
            if (!selectedEngineerData) {
                alert('エンジニアを選択してください。');
                return;
            }
            
            const projectName = document.querySelector('.form-title')?.textContent || 'この案件';
            const engineerName = selectedEngineerData.name;
            
            if (confirm(`「${projectName}」と「${engineerName}」の面談を申し込みますか？`)) {
                // TODO: 実際のAPI呼び出しに置き換える
                console.log('面談申込:', {
                    projectId: getProjectIdFromUrl(),
                    engineerId: selectedEngineerId
                });
                alert('面談を申し込みました。');
            }
        });
    }
}

/**
 * 問い合わせボタンの初期化
 */
function initInquiryButton() {
    const inquiryBtn = document.getElementById('inquiry-btn');
    
    if (inquiryBtn) {
        inquiryBtn.addEventListener('click', function() {
            const projectName = document.querySelector('.form-title')?.textContent || 'この案件';
            const engineerName = selectedEngineerData ? selectedEngineerData.name : '';
            
            // TODO: 実際のAPI呼び出しに置き換える
            // 問い合わせ画面への遷移またはモーダル表示
            console.log('問い合わせ:', {
                projectId: getProjectIdFromUrl(),
                engineerId: selectedEngineerId
            });
            
            if (engineerName) {
                alert(`「${projectName}」と「${engineerName}」について問い合わせますか？\n（問い合わせ画面への遷移は実装予定です）`);
            } else {
                alert(`「${projectName}」について問い合わせますか？\n（問い合わせ画面への遷移は実装予定です）`);
            }
        });
    }
}

/**
 * URLから案件IDを取得
 */
function getProjectIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('projectId') || null;
}

/**
 * マッチングスコアに応じたクラスを取得
 */
function getScoreClass(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
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
            const threadId = childMessage.dataset.threadId;
            
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
                title: '案件についての問い合わせ',
                subject: '案件についての問い合わせ',
                sender: 'テック株式会社',
                sentDate: '2024-12-12T15:30:00',
                content: 'この案件について、いくつか質問がございます。\n\n1. プロジェクトの規模感について\n2. チーム構成について\n3. 開発環境について\n\n以上について、詳細を教えていただけますでしょうか。\n\nよろしくお願いいたします。'
            },
            children: [
                {
                    id: 11,
                    subject: 'Re: 案件についての問い合わせ',
                    sender: 'サンプル株式会社',
                    sentDate: '2024-12-13T10:00:00',
                    content: 'ご質問ありがとうございます。\n\n1. プロジェクトの規模感について\nプロジェクトは約10名のチームで進行予定です。\n\n2. チーム構成について\nPM 1名、エンジニア 8名、デザイナー 1名の構成です。\n\n3. 開発環境について\nAWS上で構築予定です。\n\nご不明な点がございましたら、お気軽にお問い合わせください。'
                },
                {
                    id: 12,
                    subject: 'Re: 案件についての問い合わせ',
                    sender: 'テック株式会社',
                    sentDate: '2024-12-13T14:30:00',
                    content: 'ご回答ありがとうございます。\n\n追加で確認させていただきたいことがございます。\n開発期間はどの程度を想定されていますでしょうか。'
                }
            ]
        },
        {
            id: 2,
            parentMessage: {
                id: 2,
                title: 'スキル要件について',
                subject: 'スキル要件について',
                sender: 'システム株式会社',
                sentDate: '2024-12-11T10:15:00',
                content: 'スキル要件について確認させていただきたいことがございます。\n\nJavaとSpring Bootの経験年数はどの程度必要でしょうか。\nまた、Reactの経験は必須でしょうか。\n\nご回答いただけますと幸いです。'
            },
            children: [
                {
                    id: 21,
                    subject: 'Re: スキル要件について',
                    sender: 'サンプル株式会社',
                    sentDate: '2024-12-12T09:00:00',
                    content: 'ご質問ありがとうございます。\n\nJavaとSpring Bootについては、実務経験3年以上を想定しております。\nReactについては必須ではありませんが、あると望ましいです。\n\nご確認のほど、よろしくお願いいたします。'
                }
            ]
        },
        {
            id: 3,
            parentMessage: {
                id: 3,
                title: '勤務地について',
                subject: '勤務地について',
                sender: 'テック株式会社',
                sentDate: '2024-12-10T16:45:00',
                content: '勤務地についてお聞きしたいことがございます。\n\nリモートワークの可否について、具体的にどの程度可能でしょうか。\nまた、出社が必要な場合の頻度はどの程度でしょうか。\n\nご確認のほど、よろしくお願いいたします。'
            },
            children: []
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

/**
 * モックエンジニアデータを取得
 */
function getMockEngineers() {
    return [
        {
            id: 1,
            name: '山田太郎',
            skills: ['Java', 'Spring Boot', 'React', 'PostgreSQL', 'AWS'],
            matchingScore: 85
        },
        {
            id: 2,
            name: '佐藤花子',
            skills: ['Python', 'Django', 'PostgreSQL'],
            matchingScore: 72
        },
        {
            id: 3,
            name: '鈴木一郎',
            skills: ['JavaScript', 'React', 'Vue.js'],
            matchingScore: 58
        },
        {
            id: 4,
            name: '田中次郎',
            skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
            matchingScore: 92
        },
        {
            id: 5,
            name: '高橋三郎',
            skills: ['Swift', 'iOS', 'Objective-C'],
            matchingScore: null // マッチングスコアがない場合
        }
    ];
}


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


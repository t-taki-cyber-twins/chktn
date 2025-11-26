/* ========================================
   面談編集モーダル固有JavaScript
   ======================================== */

/**
 * メッセージ一覧のクリック処理
 */
function initMessageList() {
    const messageList = document.getElementById('message-list');
    const messageContentArea = document.getElementById('message-content-area');
    const messageContentTitle = document.getElementById('message-content-title');
    const messageContentBody = document.getElementById('message-content-body');
    const messageContentClose = document.getElementById('message-content-close');

    if (!messageList || !messageContentArea) return;

    // メッセージ項目のクリック処理
    messageList.addEventListener('click', function(e) {
        const messageItem = e.target.closest('.message-list-item');
        if (!messageItem) return;

        const messageId = messageItem.getAttribute('data-message-id');
        
        // すべてのメッセージ項目からactiveクラスを削除
        messageList.querySelectorAll('.message-list-item').forEach(item => {
            item.classList.remove('active');
        });

        // クリックされたメッセージ項目にactiveクラスを追加
        messageItem.classList.add('active');

        // メッセージ内容を表示
        loadMessageContent(messageId, messageContentTitle, messageContentBody);
        messageContentArea.style.display = 'block';
    });

    // メッセージ内容を閉じる
    if (messageContentClose) {
        messageContentClose.addEventListener('click', function() {
            messageContentArea.style.display = 'none';
            // すべてのメッセージ項目からactiveクラスを削除
            messageList.querySelectorAll('.message-list-item').forEach(item => {
                item.classList.remove('active');
            });
        });
    }
}

/**
 * メッセージ内容を読み込む（モック）
 */
function loadMessageContent(messageId, titleElement, bodyElement) {
    // TODO: APIからメッセージ内容を取得
    const mockMessages = {
        '1': {
            title: '面談の日程調整について',
            content: '面談の日程調整についてご相談があります。\n\n来週の月曜日から金曜日の間で、ご都合の良い日時をご指定いただけますでしょうか。\n\nよろしくお願いいたします。'
        },
        '2': {
            title: 'エンジニアのスキルシート確認',
            content: 'エンジニアのスキルシートを確認させていただきました。\n\nJavaとSpring Bootの経験が豊富で、当案件に非常に適していると感じました。\n\n面談の際に、より詳しくお話を伺いたいと思います。'
        },
        '3': {
            title: '面談の場所について',
            content: '面談の場所についてご相談があります。\n\nオンラインでの面談も可能でしょうか。\n\nもし可能でしたら、ZoomまたはGoogle Meetでの面談を希望いたします。'
        }
    };

    const message = mockMessages[messageId];
    if (message && titleElement && bodyElement) {
        titleElement.textContent = message.title;
        bodyElement.textContent = message.content;
    }
}

/**
 * モーダルの開閉処理
 */
function initModalOpenClose() {
    // 編集ボタンクリック時にモーダルを開く
    document.addEventListener('click', function(e) {
        const editBtn = e.target.closest('.meeting-edit-btn');
        if (editBtn) {
            e.preventDefault();
            const meetingId = editBtn.getAttribute('data-meeting-id');
            const modalComponent = document.querySelector('app-engineer-meeting-edit');
            if (modalComponent) {
                modalComponent.open(meetingId);
            }
        }
    });
}

/**
 * メール内容を生成する（モック）
 * 自社内回覧用のメールを生成
 */
function generateEmailContent(formData) {
    // 面談情報からメール内容を生成
    const engineerCompany = document.getElementById('meeting-engineer-company')?.textContent || 'エンジニア会社';
    const engineerName = document.getElementById('meeting-engineer-name')?.textContent || 'エンジニア名';
    const projectName = document.getElementById('meeting-project-name')?.textContent || '案件名';
    const projectManager = document.getElementById('meeting-project-manager')?.textContent || '案件担当者';
    const endCompany = document.getElementById('meeting-end-company')?.textContent || 'エンド会社';
    const meetingStatus = formData.meetingStatus;
    const meetingDate = formData.meetingDate;
    const meetingTime = formData.meetingTime;
    const meetingLocation = formData.meetingLocation;

    // ステータス名を日本語に変換
    const statusNames = {
        'pending': '面談予定',
        'completed': '面談完了',
        'cancelled': 'キャンセル'
    };
    const statusName = statusNames[meetingStatus] || meetingStatus;

    // TO（宛先メールアドレス）- 自社内の関係者
    // TODO: APIから自社内の関係者（案件担当者、プロジェクトマネージャーなど）のメールアドレスを取得
    const to = `project-team@sample.co.jp, ${projectManager.toLowerCase().replace(/\s+/g, '')}@sample.co.jp`;

    // タイトル - 自社内向け
    const title = `【面談情報更新通知】${projectName} - ${engineerCompany} ${engineerName}様`;

    // 本文 - 自社内向けの回覧メール
    let body = `関係者各位\n\n`;
    body += `お疲れ様です。\n\n`;
    body += `面談情報を更新いたしましたので、ご報告いたします。\n\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `【案件情報】\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `案件名: ${projectName}\n`;
    body += `エンド会社: ${endCompany}\n`;
    body += `案件担当者: ${projectManager}\n\n`;
    body += `【エンジニア情報】\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `エンジニア名: ${engineerName}\n`;
    body += `エンジニア会社: ${engineerCompany}\n\n`;
    body += `【面談情報】\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `ステータス: ${statusName}\n`;
    
    if (meetingDate) {
        body += `面談日時: ${meetingDate}`;
        if (meetingTime) {
            body += ` ${meetingTime}`;
        }
        body += `\n`;
    }
    
    if (meetingLocation) {
        body += `面談場所: ${meetingLocation}\n`;
    }
    
    if (formData.meetingNote) {
        body += `\n【備考】\n${formData.meetingNote}\n`;
    }
    
    body += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    body += `以上、ご確認のほどよろしくお願いいたします。\n\n`;
    body += `サンプル株式会社\n`;
    body += `営業部`;

    return {
        to: to,
        title: title,
        body: body
    };
}

/**
 * 面談情報を更新する（モック）
 */
function updateMeetingData(formData, sendEmail = false) {
    // TODO: APIにフォームデータを送信
    console.log('フォーム送信:', formData);
    console.log('メール送信:', sendEmail);
    
    if (sendEmail) {
        // TODO: メール送信APIを呼び出す
        console.log('メールを送信しました（モック）');
    }
    
    alert(sendEmail ? '面談情報を更新し、メールを送信しました（モック）' : '面談情報を更新しました（モック）');
    
    // モーダルを閉じる
    const modalComponent = document.querySelector('app-engineer-meeting-edit');
    if (modalComponent) {
        modalComponent.close();
    }
}

/**
 * フォーム送信処理
 */
function initFormSubmit() {
    const updateBtn = document.querySelector('.meeting-edit-update-btn');
    
    if (updateBtn) {
        updateBtn.addEventListener('click', function() {
            // フォームバリデーション
            const meetingStatus = document.getElementById('meeting-status');

            // フォームデータを取得
            const formData = {
                meetingStatus: meetingStatus.value,
                meetingDate: document.getElementById('meeting-date')?.value || '',
                meetingTime: document.getElementById('meeting-time')?.value || '',
                meetingLocation: document.getElementById('meeting-location')?.value || '',
                meetingNote: document.getElementById('meeting-note')?.value || '',
                meetingPrivateNote: document.getElementById('meeting-private-note')?.value || ''
            };

            // メール内容を生成
            const emailData = generateEmailContent(formData);

            // メールプレビューモーダルを開く
            const emailPreviewComponent = document.querySelector('app-email-preview');
            if (emailPreviewComponent) {
                emailPreviewComponent.open(emailData, {
                    onCancel: function() {
                        // キャンセル時は何もしない
                        console.log('メール送信をキャンセルしました');
                    },
                    onUpdateWithoutSend: function() {
                        // 送信しないで更新
                        updateMeetingData(formData, false);
                    },
                    onUpdateWithSend: function() {
                        // 送信して更新
                        updateMeetingData(formData, true);
                    }
                });
            } else {
                // メールプレビューコンポーネントが見つからない場合は直接更新
                console.warn('メールプレビューコンポーネントが見つかりません');
                updateMeetingData(formData, false);
            }
        });
    }
}

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    initMessageList();
    initModalOpenClose();
    initFormSubmit();
});



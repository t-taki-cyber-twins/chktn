/* ========================================
   エンジニア面談編集モーダル固有JavaScript
   ======================================== */

/**
 * メール内容を生成する（モック）
 * エンジニア提供会社内回覧用のメールを生成
 */
function generateEmailContent(formData) {
    // 面談情報からメール内容を生成
    const engineerName = document.getElementById('meeting-engineer-name')?.textContent || 'エンジニア名';
    const engineerCompany = document.getElementById('meeting-engineer-company')?.textContent || 'エンジニア会社';
    const projectName = document.getElementById('meeting-project-name')?.textContent || '案件名';
    const projectCompany = document.getElementById('meeting-project-company')?.textContent || '案件提供会社';
    const projectManager = document.getElementById('meeting-project-manager')?.textContent || '案件担当者';
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

    // TO（宛先メールアドレス）- エンジニア提供会社内の関係者
    // TODO: APIからエンジニア提供会社内の関係者（エンジニア担当者、営業担当者など）のメールアドレスを取得
    const to = `engineer-team@tech.co.jp, ${engineerName.toLowerCase().replace(/\s+/g, '')}@tech.co.jp`;

    // タイトル - エンジニア提供会社内向け
    const title = `【面談情報更新通知】${engineerName}様 - ${projectName}（${projectCompany}）`;

    // 本文 - エンジニア提供会社内向けの回覧メール
    let body = `関係者各位\n\n`;
    body += `お疲れ様です。\n\n`;
    body += `面談情報を更新いたしましたので、ご報告いたします。\n\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `【エンジニア情報】\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `エンジニア名: ${engineerName}\n`;
    body += `エンジニア会社: ${engineerCompany}\n\n`;
    body += `【案件情報】\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `案件名: ${projectName}\n`;
    body += `案件提供会社: ${projectCompany}\n`;
    body += `案件担当者: ${projectManager}\n\n`;
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
    body += `${engineerCompany}\n`;
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
    
    // 検索結果を再表示（ページをリロードするか、検索を再実行）
    // TODO: 実際の実装では、検索結果を再取得する
    if (typeof performSearch === 'function') {
        performSearch();
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
            if (!meetingStatus || !meetingStatus.value) {
                alert('面談ステータスを選択してください。');
                return;
            }

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
    initFormSubmit();
});


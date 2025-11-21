/* ========================================
   メッセージ検索画面固有JavaScript
   ======================================== */

let currentSortColumn = null;
let currentSortDirection = 'asc';

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    initSearchForm();
    initTableSort();
    initDetailButtons();
    initPagination();
});

/**
 * 検索フォームの初期化
 */
function initSearchForm() {
    const searchForm = document.getElementById('search-form');
    const resetButton = document.querySelector('.search-form-reset');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            performSearch();
        });
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            resetSearchForm();
        });
    }
}

/**
 * 検索実行
 */
function performSearch() {
    const formData = new FormData(document.getElementById('search-form'));
    const searchParams = {};
    
    // フォームデータをオブジェクトに変換
    for (const [key, value] of formData.entries()) {
        if (searchParams[key]) {
            // 既に値がある場合は配列にする（複数選択の場合）
            if (Array.isArray(searchParams[key])) {
                searchParams[key].push(value);
            } else {
                searchParams[key] = [searchParams[key], value];
            }
        } else {
            searchParams[key] = value;
        }
    }
    
    console.log('検索パラメータ:', searchParams);
    
    // TODO: 実際のAPI呼び出しに置き換える
    // モックデータで検索結果を表示
    const results = getMockSearchResults();
    displaySearchResults(results);
    updateResultsCount(results.length);
}

/**
 * 検索フォームをリセット
 */
function resetSearchForm() {
    const form = document.getElementById('search-form');
    if (form) {
        form.reset();
        // すべての検索結果を表示
        const results = getMockSearchResults();
        displaySearchResults(results);
        updateResultsCount(results.length);
    }
}

/**
 * 検索結果を表示
 */
function displaySearchResults(results) {
    const tableBody = document.getElementById('message-table-body');
    if (!tableBody) return;
    
    if (results.length === 0) {
        const colCount = document.querySelectorAll('.message-table thead th').length;
        tableBody.innerHTML = `<tr><td colspan="${colCount}" class="no-results">検索条件に一致するメッセージが見つかりませんでした。</td></tr>`;
        return;
    }
    
    tableBody.innerHTML = results.map(message => createTableRow(message)).join('');
    
    // イベントリスナーを再設定
    initDetailButtons();
}

/**
 * テーブル行のHTMLを生成
 */
function createTableRow(message) {
    const messageTypeBadge = getMessageTypeBadge(message.messageType);
    const sentDateTime = formatDateTime(message.sentDate);
    const engineerName = message.engineerName || '—';
    
    // 自社案件の場合はproject-edit.html、他社の公開案件の場合はpublic-project-detail.htmlにリンク
    const projectLink = message.isOwnProject 
        ? 'project-edit.html' 
        : 'public-project-detail.html';
    
    // 自社案件の場合のみ「自」バッジを表示
    const ownBadge = message.isOwnProject 
        ? '<span class="project-link-own-badge">自</span>' 
        : '';
    
    // メッセージタイプに応じてアクションボタンを変更
    // 質問・問い合わせ（100）の場合は「詳細」ボタン、それ以外は「面談編集」ボタン
    const isInquiry = message.messageType === 100;
    const actionButton = isInquiry
        ? `<button type="button" class="btn btn-secondary btn-sm message-detail-btn" data-message-id="${message.id}">詳細</button>`
        : `<button type="button" class="btn btn-secondary btn-sm meeting-edit-btn" data-meeting-id="${message.meetingId || message.id}">面談編集</button>`;
    
    return `
        <tr data-message-id="${message.id}">
            <td>
                ${messageTypeBadge}
            </td>
            <td>
                <a href="#" class="table-link">${escapeHtml(message.messageName)}</a>
            </td>
            <td>${escapeHtml(message.sender)}</td>
            <td>${sentDateTime}</td>
            <td>
                <a href="${projectLink}" class="table-link">${ownBadge}${escapeHtml(message.projectName)}</a>
            </td>
            <td>${escapeHtml(engineerName)}</td>
            <td>
                <div class="table-actions">
                    ${actionButton}
                </div>
            </td>
        </tr>
    `;
}

/**
 * メッセージタイプのバッジを取得
 */
function getMessageTypeBadge(messageType) {
    const badges = {
        1: '<span class="badge badge-message-type-1">エンジニア提供会社から面談依頼</span>',
        2: '<span class="badge badge-message-type-2">案件提供会社から面談依頼</span>',
        3: '<span class="badge badge-message-type-3">面談依頼のステータス変化</span>',
        4: '<span class="badge badge-message-type-4">ステータス変化社内メッセージ通知</span>',
        100: '<span class="badge badge-message-type-100">質問・問い合わせ</span>'
    };
    return badges[messageType] || badges[100];
}

/**
 * 検索結果件数を更新
 */
function updateResultsCount(count) {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        resultsCount.textContent = `${count}件`;
    }
}

/**
 * テーブルソートの初期化
 */
function initTableSort() {
    const sortableHeaders = document.querySelectorAll('.table-sortable');
    sortableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const column = this.dataset.sort;
            if (currentSortColumn === column) {
                // 同じ列をクリックした場合はソート方向を切り替え
                currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                currentSortColumn = column;
                currentSortDirection = 'asc';
            }
            
            // ソートアイコンの更新
            sortableHeaders.forEach(h => {
                h.classList.remove('sort-asc', 'sort-desc');
            });
            this.classList.add(`sort-${currentSortDirection}`);
            
            // テーブルをソート
            sortTable(column, currentSortDirection);
        });
    });
}

/**
 * テーブルをソート
 */
function sortTable(column, direction) {
    const tableBody = document.getElementById('message-table-body');
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        let aValue, bValue;
        
        switch (column) {
            case 'message-type':
                aValue = a.cells[0].textContent.trim();
                bValue = b.cells[0].textContent.trim();
                break;
            case 'message-name':
                aValue = a.cells[1].querySelector('.table-link').textContent.trim();
                bValue = b.cells[1].querySelector('.table-link').textContent.trim();
                break;
            case 'sender':
                aValue = a.cells[2].textContent.trim();
                bValue = b.cells[2].textContent.trim();
                break;
            case 'sent-date':
                aValue = new Date(a.cells[3].textContent.trim().replace(/\//g, '-'));
                bValue = new Date(b.cells[3].textContent.trim().replace(/\//g, '-'));
                break;
            case 'project-name':
                aValue = a.cells[4].querySelector('.table-link').textContent.trim();
                bValue = b.cells[4].querySelector('.table-link').textContent.trim();
                break;
            case 'engineer-name':
                aValue = a.cells[5].textContent.trim();
                bValue = b.cells[5].textContent.trim();
                break;
            default:
                return 0;
        }
        
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });
    
    // ソートされた行をテーブルに再配置
    rows.forEach(row => tableBody.appendChild(row));
}

/**
 * 詳細ボタンと面談編集ボタンの初期化
 */
function initDetailButtons() {
    // 詳細ボタン（質問・問い合わせの場合）
    const detailButtons = document.querySelectorAll('.message-detail-btn');
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const messageId = this.dataset.messageId;
            // 面談詳細画面への遷移
            window.location.href = `public-project-detail.html?messageId=${messageId}`;
        });
    });
    
    // 面談編集ボタン（質問・問い合わせ以外の場合）
    const editButtons = document.querySelectorAll('.meeting-edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const meetingId = this.dataset.meetingId;
            const modalComponent = document.querySelector('app-project-meeting-edit');
            if (modalComponent) {
                modalComponent.open(meetingId);
            } else {
                console.error('面談編集モーダルコンポーネントが見つかりません');
            }
        });
    });
}

/**
 * ページネーションの初期化
 */
function initPagination() {
    const prevButton = document.querySelector('.pagination-btn-prev');
    const nextButton = document.querySelector('.pagination-btn-next');
    const pageButtons = document.querySelectorAll('.pagination-page');
    
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            // TODO: 前のページに移動
            console.log('前のページへ');
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            // TODO: 次のページに移動
            console.log('次のページへ');
        });
    }
    
    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            // アクティブ状態を更新
            pageButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // TODO: 該当ページのデータを読み込み
            console.log('ページ:', this.textContent);
        });
    });
}

/**
 * モック検索結果データを取得
 */
function getMockSearchResults() {
    return [
        {
            id: 1,
            messageType: 1,
            messageName: '面談依頼: フルスタックエンジニア募集',
            sender: '山田太郎（サンプル株式会社）',
            sentDate: '2024-12-15T14:30:00',
            projectName: 'フルスタックエンジニア募集',
            engineerName: '佐藤一郎',
            isOwnProject: true,  // 自社案件
            meetingId: 1  // 面談ID
        },
        {
            id: 2,
            messageType: 2,
            messageName: '面談依頼: バックエンドエンジニア募集',
            sender: '鈴木花子（テック株式会社）',
            sentDate: '2024-12-14T10:15:00',
            projectName: 'バックエンドエンジニア募集',
            engineerName: '田中次郎',
            isOwnProject: false,  // 他社の公開案件
            meetingId: 2  // 面談ID
        },
        {
            id: 3,
            messageType: 3,
            messageName: 'ステータス変更: 面談確定',
            sender: 'システム',
            sentDate: '2024-12-13T16:45:00',
            projectName: 'フロントエンドエンジニア募集',
            engineerName: '伊藤三郎',
            isOwnProject: true,  // 自社案件
            meetingId: 3  // 面談ID
        },
        {
            id: 4,
            messageType: 4,
            messageName: '社内通知: 面談確定',
            sender: 'システム',
            sentDate: '2024-12-13T16:45:00',
            projectName: 'フロントエンドエンジニア募集',
            engineerName: '伊藤三郎',
            isOwnProject: true,  // 自社案件
            meetingId: 3  // 面談ID（ID 3と同じ面談）
        },
        {
            id: 5,
            messageType: 100,
            messageName: '案件についての質問',
            sender: '高橋四郎（デザイン株式会社）',
            sentDate: '2024-12-12T09:20:00',
            projectName: 'UI/UXデザイナー募集',
            engineerName: null,
            isOwnProject: false  // 他社の公開案件（質問・問い合わせなので面談IDなし）
        }
    ];
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


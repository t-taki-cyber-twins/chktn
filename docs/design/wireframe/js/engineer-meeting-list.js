/* ========================================
   エンジニア面談管理画面固有JavaScript
   ======================================== */

let currentSortColumn = null;
let currentSortDirection = 'asc';

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    initSearchForm();
    initEngineerRepresentativeSelection();
    initTableSort();
    initDeleteButtons();
    initPagination();
    initEditButtons();
});

/**
 * エンジニア担当者選択処理（検索フォーム用）
 */
function initEngineerRepresentativeSelection() {
    const selectBtn = document.getElementById('search-engineer-representative-btn');
    const selectedDiv = document.getElementById('search-engineer-representative-selected');
    const selectedList = document.getElementById('search-engineer-representative-selected-list');
    const removeAllBtn = document.getElementById('search-engineer-representative-remove-all');
    const selectorComponent = document.querySelector('app-engineer-representative-selector');
    
    let selectedItems = []; // 選択されたアイテムの配列

    // 選択されたアイテムを表示
    function renderSelectedItems() {
        if (!selectedList) return;
        
        selectedList.innerHTML = '';
        if (selectedItems.length === 0) {
            selectedDiv.style.display = 'none';
            if (selectBtn) selectBtn.style.display = 'flex';
            return;
        }

        selectedDiv.style.display = 'block';
        if (selectBtn) selectBtn.style.display = 'none';

        selectedItems.forEach((item, index) => {
            const tag = document.createElement('div');
            tag.className = 'selected-value-tag';
            tag.innerHTML = `
                <span class="selected-value-text">${escapeHtml(item.name)}</span>
                <button type="button" class="selected-value-remove" data-index="${index}">×</button>
            `;
            selectedList.appendChild(tag);
        });

        // 個別削除ボタンのイベントリスナー
        const removeButtons = selectedList.querySelectorAll('.selected-value-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(button.getAttribute('data-index'));
                selectedItems.splice(index, 1);
                renderSelectedItems();
                
                // 隠しフィールドがあれば更新するなどの処理が必要な場合はここに追加
            });
        });
    }

    // 選択ボタンクリック
    if (selectBtn) {
        selectBtn.addEventListener('click', function() {
            if (selectorComponent) {
                selectorComponent.open(selectedItems, function(newSelectedItems) {
                    selectedItems = newSelectedItems;
                    renderSelectedItems();
                    
                    // 検索実行などの処理が必要な場合はここに追加
                });
            }
        });
    }

    // すべて解除ボタン
    if (removeAllBtn) {
        removeAllBtn.addEventListener('click', function() {
            selectedItems = [];
            renderSelectedItems();
        });
    }
}

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
    
    // フォームデータをオブジェクトに変換（複数選択対応）
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
    
    // エンジニア担当者の選択状態も取得（フォームデータには含まれないため）
    const selectedRepresentatives = [];
    const selectedList = document.getElementById('search-engineer-representative-selected-list');
    if (selectedList) {
        const tags = selectedList.querySelectorAll('.selected-value-text');
        tags.forEach(tag => {
            selectedRepresentatives.push(tag.textContent);
        });
    }
    if (selectedRepresentatives.length > 0) {
        searchParams['engineer-representative'] = selectedRepresentatives;
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
        
        // エンジニア担当者の選択もリセット
        const removeAllBtn = document.getElementById('search-engineer-representative-remove-all');
        if (removeAllBtn) {
            removeAllBtn.click();
        }
        
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
    const tableBody = document.getElementById('meeting-table-body');
    if (!tableBody) return;
    
    if (results.length === 0) {
        const colCount = document.querySelectorAll('.meeting-table thead th').length;
        tableBody.innerHTML = `<tr><td colspan="${colCount}" class="no-results">検索条件に一致する面談が見つかりませんでした。</td></tr>`;
        return;
    }
    
    tableBody.innerHTML = results.map(meeting => createTableRow(meeting)).join('');
    
    // イベントリスナーを再設定
    initDeleteButtons();
    initEditButtons();
}

/**
 * テーブル行のHTMLを生成
 */
function createTableRow(meeting) {
    const meetingDateTime = formatMeetingDateTime(meeting.meetingDate, meeting.meetingTime);
    const statusBadgeClass = getStatusBadgeClass(meeting.status);
    const statusText = getStatusText(meeting.status);
    
    // 自社案件の場合はproject-edit.html、他社の公開案件の場合はpublic-project-detail.htmlにリンク
    const projectLink = meeting.isOwnProject 
        ? 'project-edit.html' 
        : 'public-project-detail.html';
    
    // 自社案件の場合のみ「自」バッジを表示
    const ownBadge = meeting.isOwnProject 
        ? '<span class="project-link-own-badge">自</span>' 
        : '';
    
    return `
        <tr data-meeting-id="${meeting.id}">
            <td class="table-checkbox">
                <input type="checkbox" class="row-select-checkbox" value="${meeting.id}">
            </td>
            <td>
                <a href="#" class="table-link">${escapeHtml(meeting.engineerName)}</a>
            </td>
            <td>${escapeHtml(meeting.engineerRepresentative || '-')}</td>
            <td>
                <a href="${projectLink}" class="table-link">${ownBadge}${escapeHtml(meeting.projectName)}</a>
            </td>
            <td>${escapeHtml(meeting.projectCompany)}</td>
            <td>${escapeHtml(meeting.projectManager)}</td>
            <td>
                <span class="badge ${statusBadgeClass}">${statusText}</span>
            </td>
            <td>${meetingDateTime}</td>
            <td>
                <div class="table-actions">
                    <button type="button" class="btn btn-secondary btn-sm meeting-edit-btn" data-meeting-id="${meeting.id}">編集</button>
                    <button type="button" class="btn btn-secondary btn-sm meeting-delete-btn" data-meeting-id="${meeting.id}">削除</button>
                </div>
            </td>
        </tr>
    `;
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
    const tableBody = document.getElementById('meeting-table-body');
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        let aValue, bValue;
        
        switch (column) {
            case 'engineer-name':
                aValue = a.cells[1].querySelector('.table-link').textContent.trim();
                bValue = b.cells[1].querySelector('.table-link').textContent.trim();
                break;
            case 'engineer-representative':
                aValue = a.cells[2].textContent.trim();
                bValue = b.cells[2].textContent.trim();
                break;
            case 'project-name':
                aValue = a.cells[3].querySelector('.table-link').textContent.trim();
                bValue = b.cells[3].querySelector('.table-link').textContent.trim();
                break;
            case 'project-company':
                aValue = a.cells[4].textContent.trim();
                bValue = b.cells[4].textContent.trim();
                break;
            case 'project-manager':
                aValue = a.cells[5].textContent.trim();
                bValue = b.cells[5].textContent.trim();
                break;
            case 'status':
                aValue = a.cells[6].textContent.trim();
                bValue = b.cells[6].textContent.trim();
                break;
            case 'meeting-date':
                // 日時文字列をDateオブジェクトに変換
                const aDateStr = a.cells[7].textContent.trim();
                const bDateStr = b.cells[7].textContent.trim();
                aValue = parseMeetingDateTime(aDateStr);
                bValue = parseMeetingDateTime(bDateStr);
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
 * 編集ボタンの初期化
 */
function initEditButtons() {
    const editButtons = document.querySelectorAll('.meeting-edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const meetingId = this.dataset.meetingId;
            // 編集モーダルを開く
            const editModal = document.querySelector('app-engineer-meeting-edit');
            if (editModal) {
                editModal.open(meetingId);
            }
        });
    });
}

/**
 * 削除ボタンの初期化
 */
function initDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.meeting-delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const meetingId = this.dataset.meetingId;
            const engineerName = this.closest('tr').cells[1].querySelector('.table-link').textContent;
            const projectName = this.closest('tr').cells[3].querySelector('.table-link').textContent;
            
            if (confirm(`「${engineerName}」と「${projectName}」の面談を削除しますか？`)) {
                // TODO: 実際のAPI呼び出しに置き換える
                console.log('面談削除:', meetingId);
                alert('面談を削除しました。');
                // 検索結果を再表示
                performSearch();
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
            engineerName: '田中太郎',
            engineerRepresentative: '鈴木一郎',
            projectName: 'フルスタックエンジニア募集',
            projectCompany: 'サンプル株式会社',
            projectManager: '山田太郎',
            status: 'pending',
            meetingDate: '2024-12-15',
            meetingTime: '14:00',
            isOwnProject: true  // 自社案件
        },
        {
            id: 2,
            engineerName: '佐藤次郎',
            engineerRepresentative: '高橋次郎',
            projectName: 'フルスタックエンジニア募集',
            projectCompany: 'サンプル株式会社',
            projectManager: '山田太郎',
            status: 'pending',
            meetingDate: '2024-12-16',
            meetingTime: '10:00',
            isOwnProject: true  // 自社案件
        },
        {
            id: 3,
            engineerName: '佐藤次郎',
            engineerRepresentative: '高橋次郎',
            projectName: 'バックエンドエンジニア募集',
            projectCompany: 'テック株式会社',
            projectManager: '佐藤花子',
            status: 'completed',
            meetingDate: '2024-12-10',
            meetingTime: '10:00',
            isOwnProject: false  // 他社の公開案件
        },
        {
            id: 4,
            engineerName: '鈴木花子',
            engineerRepresentative: '鈴木一郎',
            projectName: 'フロントエンドエンジニア募集',
            projectCompany: 'デザイン株式会社',
            projectManager: '鈴木一郎',
            status: 'cancelled',
            meetingDate: '2024-12-08',
            meetingTime: '15:00',
            isOwnProject: false  // 他社の公開案件
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
 * 面談日時をフォーマット
 */
function formatMeetingDateTime(dateString, timeString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day} ${timeString || ''}`;
}

/**
 * 日時文字列をDateオブジェクトに変換
 */
function parseMeetingDateTime(dateTimeString) {
    // "2024/12/15 14:00" 形式をパース
    const parts = dateTimeString.split(' ');
    if (parts.length !== 2) return new Date(0);
    
    const dateParts = parts[0].split('/');
    const timeParts = parts[1].split(':');
    
    if (dateParts.length !== 3 || timeParts.length !== 2) return new Date(0);
    
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2], 10);
    const hour = parseInt(timeParts[0], 10);
    const minute = parseInt(timeParts[1], 10);
    
    return new Date(year, month, day, hour, minute);
}

/**
 * ステータスのバッジクラスを取得
 */
function getStatusBadgeClass(status) {
    switch (status) {
        case 'pending':
            return 'badge-status-pending';
        case 'completed':
            return 'badge-status-completed';
        case 'cancelled':
            return 'badge-status-cancelled';
        default:
            return 'badge-status-pending';
    }
}

/**
 * ステータスのテキストを取得
 */
function getStatusText(status) {
    switch (status) {
        case 'pending':
            return '面談予定';
        case 'completed':
            return '面談完了';
        case 'cancelled':
            return 'キャンセル';
        default:
            return '面談予定';
    }
}


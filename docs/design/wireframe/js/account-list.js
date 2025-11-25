/* ========================================
   アカウント管理画面固有JavaScript
   ======================================== */

import { mockAccounts } from './mock-data.js';

let currentSortColumn = null;
let currentSortDirection = 'asc';

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    initSearchForm();
    initTableSort();
    initDeleteButtons();
    initPagination();
    initEditButtons();
    
    // 初期表示のために検索を実行
    performSearch();
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
        searchParams[key] = value;
    }
    
    console.log('検索パラメータ:', searchParams);
    
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
    const tableBody = document.getElementById('account-table-body');
    if (!tableBody) return;
    
    if (results.length === 0) {
        const colCount = document.querySelectorAll('.common-table thead th').length;
        tableBody.innerHTML = `<tr><td colspan="${colCount}" class="no-results">検索条件に一致するアカウントが見つかりませんでした。</td></tr>`;
        return;
    }
    
    tableBody.innerHTML = results.map(account => createTableRow(account)).join('');
    
    // イベントリスナーを再設定
    initDeleteButtons();
    initEditButtons();
}

/**
 * テーブル行のHTMLを生成
 */
function createTableRow(account) {
    const statusBadgeClass = getStatusBadgeClass(account.status);
    const roleBadgeClass = getRoleBadgeClass(account.roleGroup);
    
    return `
        <tr data-account-id="${account.id}">
            <td class="table-checkbox">
                <input type="checkbox" class="row-select-checkbox" value="${account.id}">
            </td>
            <td>${escapeHtml(account.email)}</td>
            <td>${escapeHtml(account.employeeName)}</td>
            <td>${escapeHtml(account.companyName)}</td>
            <td>
                <span class="badge ${roleBadgeClass}">${escapeHtml(account.roleGroupLabel)}</span>
            </td>
            <td>
                <span class="badge ${statusBadgeClass}">${escapeHtml(account.statusLabel)}</span>
            </td>
            <td>${escapeHtml(account.lastLogin.replace(/-/g, '/'))}</td>
            <td>
                <div class="table-actions">
                    <button type="button" class="btn btn-primary btn-sm account-edit-btn" data-account-id="${account.id}">編集</button>
                    <button type="button" class="btn btn-danger btn-sm account-delete-btn" data-account-id="${account.id}">削除</button>
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
                currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                currentSortColumn = column;
                currentSortDirection = 'asc';
            }
            
            sortableHeaders.forEach(h => {
                h.classList.remove('sort-asc', 'sort-desc');
            });
            this.classList.add(`sort-${currentSortDirection}`);
            
            sortTable(column, currentSortDirection);
        });
    });
}

/**
 * テーブルをソート
 */
function sortTable(column, direction) {
    const tableBody = document.getElementById('account-table-body');
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        let aValue, bValue;
        
        switch (column) {
            case 'email':
                aValue = a.cells[1].textContent.trim();
                bValue = b.cells[1].textContent.trim();
                break;
            case 'employee':
                aValue = a.cells[2].textContent.trim();
                bValue = b.cells[2].textContent.trim();
                break;
            case 'role-group':
                aValue = a.cells[4].textContent.trim();
                bValue = b.cells[4].textContent.trim();
                break;
            case 'status':
                aValue = a.cells[5].textContent.trim();
                bValue = b.cells[5].textContent.trim();
                break;
            case 'last-login':
                aValue = new Date(a.cells[6].textContent.trim());
                bValue = new Date(b.cells[6].textContent.trim());
                break;
            default:
                return 0;
        }
        
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });
    
    rows.forEach(row => tableBody.appendChild(row));
}

/**
 * 削除ボタンの初期化
 */
function initDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.account-delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const accountId = this.dataset.accountId;
            const email = this.closest('tr').cells[1].textContent;
            
            if (confirm(`アカウント「${email}」を削除しますか？`)) {
                console.log('アカウント削除:', accountId);
                alert('アカウントを削除しました。');
                performSearch();
            }
        });
    });
}

/**
 * 編集ボタンの初期化
 */
function initEditButtons() {
    const editButtons = document.querySelectorAll('.account-edit-btn');
    const modal = document.getElementById('account-edit-modal');
    
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const accountId = this.dataset.accountId;
            // モックデータから該当アカウントを検索
            const account = mockAccounts.find(a => a.id == accountId);
            if (account && modal) {
                modal.show(account);
            }
        });
    });
    
    // 新規登録ボタン
    const newAccountBtn = document.getElementById('new-account-btn');
    if (newAccountBtn && modal) {
        newAccountBtn.addEventListener('click', () => {
            modal.show();
        });
    }
}

/**
 * ページネーションの初期化
 */
function initPagination() {
    // app-paginationコンポーネントを使用するため、ここでは特別な処理は不要
}

/**
 * モック検索結果データを取得
 */
function getMockSearchResults() {
    return mockAccounts;
}

/**
 * HTMLエスケープ
 */
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * ステータスのバッジクラスを取得
 */
function getStatusBadgeClass(status) {
    switch (status) {
        case 'active':
            return 'badge-status-recruiting'; // 緑色
        case 'inactive':
            return 'badge-status-inactive'; // 灰色
        case 'locked':
            return 'badge-status-suspended'; // 黄色
        default:
            return 'badge-status-recruiting';
    }
}

/**
 * ロールグループのバッジクラスを取得
 */
function getRoleBadgeClass(roleGroup) {
    switch (roleGroup) {
        case 'admin':
            return 'badge-danger';
        case 'engineer-manager':
            return 'badge-primary';
        case 'back-office':
            return 'badge-secondary';
        case 'viewer':
            return 'badge-info';
        default:
            return 'badge-secondary';
    }
}

/* ========================================
   社員管理画面固有JavaScript
   ======================================== */

import { mockEmployees } from './mock-data.js';

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
        if (searchParams[key]) {
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
    const tableBody = document.getElementById('employee-table-body');
    if (!tableBody) return;
    
    if (results.length === 0) {
        const colCount = document.querySelectorAll('.common-table thead th').length;
        tableBody.innerHTML = `<tr><td colspan="${colCount}" class="no-results">検索条件に一致する社員が見つかりませんでした。</td></tr>`;
        return;
    }
    
    tableBody.innerHTML = results.map(employee => createTableRow(employee)).join('');
    
    // イベントリスナーを再設定
    initDeleteButtons();
    initEditButtons();
}

/**
 * テーブル行のHTMLを生成
 */
function createTableRow(employee) {
    const statusBadgeClass = getStatusBadgeClass(employee.status);
    
    // 属性バッジの生成
    let attributeBadges = '';
    if (employee.isEngineer) attributeBadges += '<span class="badge badge-primary">エンジニア</span> ';
    if (employee.isPM) attributeBadges += '<span class="badge badge-secondary">案件担当</span> ';
    if (employee.isTechManager) attributeBadges += '<span class="badge badge-info">技術者管理</span> ';
    if (!employee.isEngineer && !employee.isPM && !employee.isTechManager) {
        attributeBadges = '<span class="badge badge-secondary">バックオフィス</span>';
    }
    
    return `
        <tr data-employee-id="${employee.id}">
            <td class="table-checkbox">
                <input type="checkbox" class="row-select-checkbox" value="${employee.id}">
            </td>
            <td>${escapeHtml(employee.name)}</td>
            <td>${escapeHtml(employee.email)}</td>
            <td>${escapeHtml(employee.department)}</td>
            <td>${attributeBadges}</td>
            <td>
                <span class="badge ${statusBadgeClass}">${escapeHtml(employee.statusLabel)}</span>
            </td>
            <td>${escapeHtml(employee.joinedDate.replace(/-/g, '/'))}</td>
            <td>
                <div class="table-actions">
                    <button type="button" class="btn btn-secondary btn-sm employee-edit-btn" data-employee-id="${employee.id}">編集</button>
                    <button type="button" class="btn btn-secondary btn-sm employee-delete-btn" data-employee-id="${employee.id}">削除</button>
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
    const tableBody = document.getElementById('employee-table-body');
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        let aValue, bValue;
        
        switch (column) {
            case 'name':
                aValue = a.cells[1].textContent.trim();
                bValue = b.cells[1].textContent.trim();
                break;
            case 'department':
                aValue = a.cells[3].textContent.trim();
                bValue = b.cells[3].textContent.trim();
                break;
            case 'status':
                aValue = a.cells[5].textContent.trim();
                bValue = b.cells[5].textContent.trim();
                break;
            case 'joined-date':
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
    const deleteButtons = document.querySelectorAll('.employee-delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const employeeId = this.dataset.employeeId;
            const employeeName = this.closest('tr').cells[1].textContent;
            
            if (confirm(`社員「${employeeName}」を削除しますか？`)) {
                console.log('社員削除:', employeeId);
                alert('社員を削除しました。');
                performSearch();
            }
        });
    });
}

/**
 * 編集ボタンの初期化
 */
function initEditButtons() {
    const editButtons = document.querySelectorAll('.employee-edit-btn');
    const modal = document.getElementById('employee-edit-modal');
    
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const employeeId = this.dataset.employeeId;
            // モックデータから該当社員を検索
            const employee = mockEmployees.find(e => e.id == employeeId);
            if (employee && modal) {
                modal.show(employee);
            }
        });
    });
    
    // 新規登録ボタン
    const newEmployeeBtn = document.getElementById('new-employee-btn');
    if (newEmployeeBtn && modal) {
        newEmployeeBtn.addEventListener('click', () => {
            modal.show();
        });
    }
}

/**
 * ページネーションの初期化
 */
function initPagination() {
    // app-paginationコンポーネントを使用するため、ここでは特別な処理は不要
    // 必要に応じてイベントリスナーを追加
}

/**
 * モック検索結果データを取得
 */
function getMockSearchResults() {
    return mockEmployees;
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
        case 'suspended':
            return 'badge-status-suspended'; // 黄色
        default:
            return 'badge-status-recruiting';
    }
}

/* ========================================
   案件検索画面固有JavaScript（自社案件）
   ======================================== */

let currentSortColumn = null;
let currentSortDirection = 'asc';

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    initSearchForm();
    initTableSort();
    initBulkActions();
    initDeleteButtons();
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
    const tableBody = document.getElementById('project-table-body');
    if (!tableBody) return;
    
    if (results.length === 0) {
        const colCount = document.querySelectorAll('.project-table thead th').length;
        tableBody.innerHTML = `<tr><td colspan="${colCount}" class="no-results">検索条件に一致する案件が見つかりませんでした。</td></tr>`;
        return;
    }
    
    tableBody.innerHTML = results.map(project => createTableRow(project)).join('');
    
    // イベントリスナーを再設定
    initBulkActions();
    initDeleteButtons();
}

/**
 * テーブル行のHTMLを生成
 */
function createTableRow(project) {
    const startDate = formatDateShort(project.startDate);
    const endDate = formatDateShort(project.endDate);
    const priceRange = project.priceMin && project.priceMax 
        ? `${project.priceMin}〜${project.priceMax}万円`
        : project.priceMin 
            ? `${project.priceMin}万円〜`
            : project.priceMax 
                ? `〜${project.priceMax}万円`
                : '要相談';
    
    const badgeClass = project.isPublic ? 'badge-public' : 'badge-private';
    const badgeText = project.isPublic ? '公開' : '非公開';
    
    const statusBadgeClass = getStatusBadgeClass(project.status);
    const statusText = getStatusText(project.status);
    
    return `
        <tr data-project-id="${project.id}">
            <td class="table-checkbox">
                <input type="checkbox" class="row-select-checkbox" value="${project.id}">
            </td>
            <td>
                <a href="project-register.html" class="table-link">${escapeHtml(project.name)}</a>
            </td>
            <td>${escapeHtml(project.endCompany)}</td>
            <td>${startDate}</td>
            <td>${endDate}</td>
            <td>${priceRange}</td>
            <td>
                <span class="badge ${statusBadgeClass}">${statusText}</span>
            </td>
            <td>${escapeHtml(project.projectManager)}</td>
            <td>
                <span class="badge ${badgeClass}">${badgeText}</span>
            </td>
            <td>
                <div class="table-actions">
                    <a href="project-register.html" class="btn btn-secondary btn-sm">編集</a>
                    <button type="button" class="btn btn-secondary btn-sm project-delete-btn" data-project-id="${project.id}">削除</button>
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
    const tableBody = document.getElementById('project-table-body');
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        let aValue, bValue;
        
        switch (column) {
            case 'name':
                aValue = a.querySelector('.table-link').textContent.trim();
                bValue = b.querySelector('.table-link').textContent.trim();
                break;
            case 'end-company':
                aValue = a.cells[2].textContent.trim();
                bValue = b.cells[2].textContent.trim();
                break;
            case 'start-date':
            case 'end-date':
                aValue = new Date(a.cells[column === 'start-date' ? 3 : 4].textContent.trim());
                bValue = new Date(b.cells[column === 'start-date' ? 3 : 4].textContent.trim());
                break;
            case 'price':
                aValue = parseFloat(a.cells[5].textContent.trim().replace(/[^0-9.]/g, ''));
                bValue = parseFloat(b.cells[5].textContent.trim().replace(/[^0-9.]/g, ''));
                break;
            case 'status':
                aValue = a.cells[6].textContent.trim();
                bValue = b.cells[6].textContent.trim();
                break;
            case 'project-manager':
                aValue = a.cells[7].textContent.trim();
                bValue = b.cells[7].textContent.trim();
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
 * 一括操作の初期化
 */
function initBulkActions() {
    const selectAllCheckbox = document.getElementById('select-all');
    const tableSelectAllCheckbox = document.getElementById('table-select-all');
    const rowCheckboxes = document.querySelectorAll('.row-select-checkbox');
    const bulkPublicBtn = document.getElementById('bulk-public-btn');
    const bulkPrivateBtn = document.getElementById('bulk-private-btn');
    
    // すべて選択チェックボックス
    const handleSelectAll = (checkbox) => {
        checkbox.addEventListener('change', function() {
            const isChecked = this.checked;
            rowCheckboxes.forEach(cb => {
                cb.checked = isChecked;
            });
            updateRowSelection();
        });
    };
    
    if (selectAllCheckbox) {
        handleSelectAll(selectAllCheckbox);
    }
    
    if (tableSelectAllCheckbox) {
        handleSelectAll(tableSelectAllCheckbox);
    }
    
    // 行のチェックボックス
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateRowSelection();
            updateSelectAllState();
        });
    });
    
    // 一括公開ボタン
    if (bulkPublicBtn) {
        bulkPublicBtn.addEventListener('click', function() {
            const selectedIds = getSelectedProjectIds();
            if (selectedIds.length === 0) {
                alert('選択された案件がありません。');
                return;
            }
            if (confirm(`${selectedIds.length}件の案件を公開しますか？`)) {
                // TODO: 実際のAPI呼び出しに置き換える
                console.log('一括公開:', selectedIds);
                alert('案件を公開しました。');
                performSearch();
            }
        });
    }
    
    // 一括非公開ボタン
    if (bulkPrivateBtn) {
        bulkPrivateBtn.addEventListener('click', function() {
            const selectedIds = getSelectedProjectIds();
            if (selectedIds.length === 0) {
                alert('選択された案件がありません。');
                return;
            }
            if (confirm(`${selectedIds.length}件の案件を非公開にしますか？`)) {
                // TODO: 実際のAPI呼び出しに置き換える
                console.log('一括非公開:', selectedIds);
                alert('案件を非公開にしました。');
                performSearch();
            }
        });
    }
}

/**
 * 選択された案件IDを取得
 */
function getSelectedProjectIds() {
    const selectedCheckboxes = document.querySelectorAll('.row-select-checkbox:checked');
    return Array.from(selectedCheckboxes).map(cb => cb.value);
}

/**
 * 行の選択状態を更新
 */
function updateRowSelection() {
    const selectedCheckboxes = document.querySelectorAll('.row-select-checkbox:checked');
    const rows = document.querySelectorAll('#project-table-body tr');
    
    rows.forEach(row => {
        const checkbox = row.querySelector('.row-select-checkbox');
        if (checkbox && checkbox.checked) {
            row.classList.add('selected');
        } else {
            row.classList.remove('selected');
        }
    });
}

/**
 * すべて選択チェックボックスの状態を更新
 */
function updateSelectAllState() {
    const rowCheckboxes = document.querySelectorAll('.row-select-checkbox');
    const checkedCount = document.querySelectorAll('.row-select-checkbox:checked').length;
    const selectAllCheckbox = document.getElementById('select-all');
    const tableSelectAllCheckbox = document.getElementById('table-select-all');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = checkedCount === rowCheckboxes.length && rowCheckboxes.length > 0;
    }
    if (tableSelectAllCheckbox) {
        tableSelectAllCheckbox.checked = checkedCount === rowCheckboxes.length && rowCheckboxes.length > 0;
    }
}

/**
 * 削除ボタンの初期化
 */
function initDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.project-delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.dataset.projectId;
            const projectName = this.closest('tr').querySelector('.table-link').textContent;
            
            if (confirm(`「${projectName}」を削除しますか？`)) {
                // TODO: 実際のAPI呼び出しに置き換える
                console.log('案件削除:', projectId);
                alert('案件を削除しました。');
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
            name: 'フルスタックエンジニア募集',
            endCompany: 'サンプル株式会社',
            startDate: '2024-12-01',
            endDate: '2025-03-31',
            priceMin: 60,
            priceMax: 80,
            status: 'recruiting',
            projectManager: '山田太郎',
            isPublic: true
        },
        {
            id: 2,
            name: 'バックエンドエンジニア募集',
            endCompany: 'テック株式会社',
            startDate: '2024-11-20',
            endDate: '2025-02-28',
            priceMin: 55,
            priceMax: 70,
            status: 'interviewing',
            projectManager: '佐藤花子',
            isPublic: false
        },
        {
            id: 3,
            name: 'フロントエンドエンジニア募集',
            endCompany: 'デザイン株式会社',
            startDate: '2025-01-01',
            endDate: '2025-06-30',
            priceMin: 50,
            priceMax: 65,
            status: 'confirmed',
            projectManager: '鈴木一郎',
            isPublic: true
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
 * 日付を短い形式でフォーマット
 */
function formatDateShort(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}

/**
 * 案件ステータスのバッジクラスを取得
 */
function getStatusBadgeClass(status) {
    switch (status) {
        case 'recruiting':
            return 'badge-status-recruiting';
        case 'interviewing':
            return 'badge-status-interviewing';
        case 'confirmed':
            return 'badge-status-confirmed';
        case 'completed':
            return 'badge-status-completed';
        default:
            return 'badge-status-recruiting';
    }
}

/**
 * 案件ステータスのテキストを取得
 */
function getStatusText(status) {
    switch (status) {
        case 'recruiting':
            return '募集中';
        case 'interviewing':
            return '面談中';
        case 'confirmed':
            return '確定';
        case 'completed':
            return '終了';
        default:
            return '募集中';
    }
}

/* ========================================
   テキスト値管理画面固有JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    initSearch();
    initButtons();
});

/**
 * 検索機能の初期化
 */
function initSearch() {
    const searchInput = document.getElementById('text-value-search');
    const categoryFilter = document.getElementById('category-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterTextValues);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterTextValues);
    }
}

/**
 * テキスト値のフィルタリング
 */
function filterTextValues() {
    const searchValue = document.getElementById('text-value-search').value.toLowerCase();
    const categoryValue = document.getElementById('category-filter').value;
    const rows = document.querySelectorAll('#text-value-table-body tr');
    
    rows.forEach(row => {
        const category = row.querySelector('td:nth-child(1)').textContent;
        const key = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const value = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
        
        const matchesSearch = key.includes(searchValue) || value.includes(searchValue);
        const matchesCategory = !categoryValue || category.includes(getCategoryName(categoryValue));
        
        row.style.display = matchesSearch && matchesCategory ? '' : 'none';
    });
}

/**
 * カテゴリIDからカテゴリ名を取得
 */
function getCategoryName(categoryId) {
    const categoryMap = {
        'department': '部署名',
        'position': '役職名',
        'engineer_status': 'エンジニアステータス',
        'project_status': '案件ステータス'
    };
    return categoryMap[categoryId] || '';
}

/**
 * ボタンの初期化
 */
function initButtons() {
    // 新規作成ボタン
    const createBtn = document.getElementById('create-text-value-btn');
    if (createBtn) {
        createBtn.addEventListener('click', function() {
            alert('テキスト値新規作成モーダルを開きます（未実装）');
        });
    }
    
    // 編集ボタン
    const editButtons = document.querySelectorAll('.text-value-edit-btn');
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const textValueId = this.dataset.textValueId;
            alert(`テキスト値編集モーダルを開きます（ID: ${textValueId}）（未実装）`);
        });
    });
    
    // 削除ボタン
    const deleteButtons = document.querySelectorAll('.text-value-delete-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const textValueId = this.dataset.textValueId;
            const value = this.closest('tr').querySelector('td:nth-child(3)').textContent;
            
            if (confirm(`「${value}」を削除しますか？`)) {
                alert(`テキスト値を削除しました（ID: ${textValueId}）`);
            }
        });
    });
}

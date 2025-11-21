/* ========================================
   お知らせ管理画面固有JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    initSearch();
    initButtons();
});

/**
 * 検索機能の初期化
 */
function initSearch() {
    const searchInput = document.getElementById('announcement-search');
    const categoryFilter = document.getElementById('category-filter');
    const statusFilter = document.getElementById('status-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterAnnouncements);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterAnnouncements);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterAnnouncements);
    }
}

/**
 * お知らせのフィルタリング
 */
function filterAnnouncements() {
    const searchValue = document.getElementById('announcement-search').value.toLowerCase();
    const categoryValue = document.getElementById('category-filter').value;
    const statusValue = document.getElementById('status-filter').value;
    const rows = document.querySelectorAll('#announcement-table-body tr');
    
    rows.forEach(row => {
        const title = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
        const category = row.querySelector('td:nth-child(2)').textContent;
        const statusBadge = row.querySelector('td:nth-child(3) .badge');
        const status = statusBadge ? statusBadge.textContent : '';
        
        const matchesSearch = title.includes(searchValue);
        const matchesCategory = !categoryValue || category.includes(getCategoryName(categoryValue));
        const matchesStatus = !statusValue || status.includes(getStatusName(statusValue));
        
        row.style.display = matchesSearch && matchesCategory && matchesStatus ? '' : 'none';
    });
}

/**
 * カテゴリIDからカテゴリ名を取得
 */
function getCategoryName(categoryId) {
    const categoryMap = {
        'maintenance': 'メンテナンス',
        'feature': '新機能',
        'improvement': '改善',
        'important': '重要なお知らせ'
    };
    return categoryMap[categoryId] || '';
}

/**
 * ステータスIDからステータス名を取得
 */
function getStatusName(statusId) {
    const statusMap = {
        'draft': '下書き',
        'published': '公開中',
        'archived': 'アーカイブ'
    };
    return statusMap[statusId] || '';
}

/**
 * ボタンの初期化
 */
function initButtons() {
    // 新規作成ボタン
    const createBtn = document.getElementById('create-announcement-btn');
    if (createBtn) {
        createBtn.addEventListener('click', function() {
            alert('お知らせ新規作成モーダルを開きます（未実装）');
        });
    }
    
    // 編集ボタン
    const editButtons = document.querySelectorAll('.announcement-edit-btn');
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const announcementId = this.dataset.announcementId;
            alert(`お知らせ編集モーダルを開きます（ID: ${announcementId}）（未実装）`);
        });
    });
    
    // 削除ボタン
    const deleteButtons = document.querySelectorAll('.announcement-delete-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const announcementId = this.dataset.announcementId;
            const title = this.closest('tr').querySelector('td:nth-child(1)').textContent;
            
            if (confirm(`「${title}」を削除しますか？`)) {
                alert(`お知らせを削除しました（ID: ${announcementId}）`);
            }
        });
    });
}

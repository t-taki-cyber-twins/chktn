/* ========================================
   スキルマスタ管理画面固有JavaScript
   ======================================== */

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initSkillSearch();
    initCategorySearch();
    initSkillButtons();
    initCategoryButtons();
});

/**
 * タブ機能の初期化
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // すべてのタブボタンとコンテンツから active クラスを削除
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // クリックされたタブボタンと対応するコンテンツに active クラスを追加
            this.classList.add('active');
            document.getElementById(`tab-${tabName}`).classList.add('active');
            
            // サイドバーの検索フォームの表示切り替え
            document.querySelectorAll('.sidebar-search-form').forEach(form => form.style.display = 'none');
            const sidebarSearch = document.getElementById(`sidebar-search-${tabName}`);
            if (sidebarSearch) {
                sidebarSearch.style.display = 'block';
            }

            // URLハッシュを更新
            window.location.hash = tabName;
        });
    });
    
    // 初期表示時にURLハッシュがあればそのタブを表示
    const hash = window.location.hash.substring(1);
    if (hash) {
        const targetButton = document.querySelector(`[data-tab="${hash}"]`);
        if (targetButton) {
            targetButton.click();
        }
    }
}

/**
 * スキルマスタ検索機能の初期化
 */
function initSkillSearch() {
    const searchInput = document.getElementById('skill-search');
    const categoryFilter = document.getElementById('category-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterSkills);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterSkills);
    }
}

/**
 * スキルカテゴリ検索機能の初期化
 */
function initCategorySearch() {
    const searchInput = document.getElementById('category-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterCategories);
    }
}

/**
 * スキルマスタのフィルタリング
 */
function filterSkills() {
    const searchValue = document.getElementById('skill-search').value.toLowerCase();
    const categoryValue = document.getElementById('category-filter').value;
    const rows = document.querySelectorAll('#skill-table-body tr');
    
    rows.forEach(row => {
        const skillName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const categoryText = row.querySelector('td:nth-child(3)').textContent;
        
        const matchesSearch = skillName.includes(searchValue);
        const matchesCategory = !categoryValue || categoryText.includes(getCategoryName(categoryValue));
        
        row.style.display = matchesSearch && matchesCategory ? '' : 'none';
    });
}

/**
 * スキルカテゴリのフィルタリング
 */
function filterCategories() {
    const searchValue = document.getElementById('category-search').value.toLowerCase();
    const rows = document.querySelectorAll('#category-table-body tr');
    
    rows.forEach(row => {
        const categoryName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        row.style.display = categoryName.includes(searchValue) ? '' : 'none';
    });
}

/**
 * カテゴリIDからカテゴリ名を取得
 */
function getCategoryName(categoryId) {
    const categoryMap = {
        '1': 'プログラミング言語',
        '2': 'フレームワーク',
        '3': 'データベース',
        '4': 'クラウド'
    };
    return categoryMap[categoryId] || '';
}

/**
 * スキルマスタボタンの初期化
 */
function initSkillButtons() {
    // 新規作成ボタン
    const createBtn = document.getElementById('create-skill-btn');
    if (createBtn) {
        createBtn.addEventListener('click', function() {
            alert('スキルマスタ新規作成モーダルを開きます（未実装）');
        });
    }
    
    // 編集ボタン
    const editButtons = document.querySelectorAll('.skill-edit-btn');
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const skillId = this.dataset.skillId;
            alert(`スキルマスタ編集モーダルを開きます（ID: ${skillId}）（未実装）`);
        });
    });
    
    // 削除ボタン
    const deleteButtons = document.querySelectorAll('.skill-delete-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const skillId = this.dataset.skillId;
            const skillName = this.closest('tr').querySelector('td:nth-child(2)').textContent;
            
            if (confirm(`「${skillName}」を削除しますか？`)) {
                alert(`スキルマスタを削除しました（ID: ${skillId}）`);
                // 実際の実装では、ここでAPIを呼び出して削除処理を行う
            }
        });
    });
}

/**
 * スキルカテゴリボタンの初期化
 */
function initCategoryButtons() {
    // 新規作成ボタン
    const createBtn = document.getElementById('create-category-btn');
    if (createBtn) {
        createBtn.addEventListener('click', function() {
            alert('スキルカテゴリ新規作成モーダルを開きます（未実装）');
        });
    }
    
    // 編集ボタン
    const editButtons = document.querySelectorAll('.category-edit-btn');
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const categoryId = this.dataset.categoryId;
            alert(`スキルカテゴリ編集モーダルを開きます（ID: ${categoryId}）（未実装）`);
        });
    });
    
    // 削除ボタン
    const deleteButtons = document.querySelectorAll('.category-delete-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const categoryId = this.dataset.categoryId;
            const categoryName = this.closest('tr').querySelector('td:nth-child(2)').textContent;
            
            if (confirm(`「${categoryName}」を削除しますか？`)) {
                alert(`スキルカテゴリを削除しました（ID: ${categoryId}）`);
                // 実際の実装では、ここでAPIを呼び出して削除処理を行う
            }
        });
    });
}

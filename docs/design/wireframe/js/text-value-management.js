/* ========================================
   テキスト・テンプレート管理画面固有JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initTextValueSearch();
    initTemplateSearch();
    initButtons();
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
 * テキスト値検索機能の初期化
 */
function initTextValueSearch() {
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
 * テンプレート検索機能の初期化
 */
function initTemplateSearch() {
    const searchInput = document.getElementById('template-search');
    const categoryFilter = document.getElementById('template-category-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterTemplates);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterTemplates);
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
        const matchesCategory = !categoryValue || category.includes(getTextValueCategoryName(categoryValue));
        
        row.style.display = matchesSearch && matchesCategory ? '' : 'none';
    });
}

/**
 * テンプレートのフィルタリング
 */
function filterTemplates() {
    const searchValue = document.getElementById('template-search').value.toLowerCase();
    const categoryValue = document.getElementById('template-category-filter').value;
    const rows = document.querySelectorAll('#template-table-body tr');
    
    rows.forEach(row => {
        const templateName = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
        const category = row.querySelector('td:nth-child(2)').textContent;
        
        const matchesSearch = templateName.includes(searchValue);
        const matchesCategory = !categoryValue || category.includes(getTemplateCategoryName(categoryValue));
        
        row.style.display = matchesSearch && matchesCategory ? '' : 'none';
    });
}

/**
 * テキスト値カテゴリIDからカテゴリ名を取得
 */
function getTextValueCategoryName(categoryId) {
    const categoryMap = {
        'department': '部署名',
        'position': '役職名',
        'engineer_status': 'エンジニアステータス',
        'project_status': '案件ステータス'
    };
    return categoryMap[categoryId] || '';
}

/**
 * テンプレートカテゴリIDからカテゴリ名を取得
 */
function getTemplateCategoryName(categoryId) {
    const categoryMap = {
        'project': '案件メモ',
        'engineer': 'エンジニアメモ'
    };
    return categoryMap[categoryId] || '';
}

/**
 * ボタンの初期化
 */
function initButtons() {
    // テキスト値: 新規作成ボタン
    const createTextValueBtn = document.getElementById('create-text-value-btn');
    if (createTextValueBtn) {
        createTextValueBtn.addEventListener('click', function() {
            alert('テキスト値新規作成モーダルを開きます（未実装）');
        });
    }
    
    // テキスト値: 編集ボタン
    document.querySelectorAll('.text-value-edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            alert(`テキスト値編集モーダルを開きます（ID: ${this.dataset.textValueId}）（未実装）`);
        });
    });
    
    // テキスト値: 削除ボタン
    document.querySelectorAll('.text-value-delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const value = this.closest('tr').querySelector('td:nth-child(3)').textContent;
            if (confirm(`「${value}」を削除しますか？`)) {
                alert(`テキスト値を削除しました（ID: ${this.dataset.textValueId}）`);
            }
        });
    });

    // テンプレート: 新規作成ボタン
    const createTemplateBtn = document.getElementById('create-template-btn');
    if (createTemplateBtn) {
        createTemplateBtn.addEventListener('click', () => alert('テンプレート新規作成モーダルを開きます（未実装）'));
    }
    
    // テンプレート: 編集ボタン
    document.querySelectorAll('.template-edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            alert(`テンプレート編集モーダルを開きます（ID: ${this.dataset.templateId}）（未実装）`);
        });
    });
    
    // テンプレート: 削除ボタン
    document.querySelectorAll('.template-delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const name = this.closest('tr').querySelector('td:nth-child(1)').textContent;
            if (confirm(`「${name}」を削除しますか？`)) {
                alert(`テンプレートを削除しました（ID: ${this.dataset.templateId}）`);
            }
        });
    });
}


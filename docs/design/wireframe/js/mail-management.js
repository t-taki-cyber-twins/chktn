/* ========================================
   メール管理画面固有JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initTemplateSearch();
    initMailingListSearch();
    initDefaultSettingSearch();
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
 * メーリングリスト検索機能の初期化
 */
function initMailingListSearch() {
    const searchInput = document.getElementById('mailing-list-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterMailingLists);
    }
}

/**
 * デフォルト設定検索機能の初期化
 */
function initDefaultSettingSearch() {
    const searchInput = document.getElementById('default-setting-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterDefaultSettings);
    }
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
        const matchesCategory = !categoryValue || category.includes(getCategoryName(categoryValue));
        
        row.style.display = matchesSearch && matchesCategory ? '' : 'none';
    });
}

/**
 * メーリングリストのフィルタリング
 */
function filterMailingLists() {
    const searchValue = document.getElementById('mailing-list-search').value.toLowerCase();
    const rows = document.querySelectorAll('#mailing-list-table-body tr');
    
    rows.forEach(row => {
        const listName = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
        row.style.display = listName.includes(searchValue) ? '' : 'none';
    });
}

/**
 * デフォルト設定のフィルタリング
 */
function filterDefaultSettings() {
    const searchValue = document.getElementById('default-setting-search').value.toLowerCase();
    const rows = document.querySelectorAll('#default-setting-table-body tr');
    
    rows.forEach(row => {
        const settingName = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
        row.style.display = settingName.includes(searchValue) ? '' : 'none';
    });
}

/**
 * カテゴリIDからカテゴリ名を取得
 */
function getCategoryName(categoryId) {
    const categoryMap = {
        'engineer': 'エンジニア関連',
        'project': '案件関連',
        'meeting': '面談関連',
        'system': 'システム通知'
    };
    return categoryMap[categoryId] || '';
}

/**
 * ボタンの初期化
 */
function initButtons() {
    // テンプレート
    const createTemplateBtn = document.getElementById('create-template-btn');
    if (createTemplateBtn) {
        createTemplateBtn.addEventListener('click', () => alert('テンプレート新規作成モーダルを開きます（未実装）'));
    }
    
    document.querySelectorAll('.template-edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            alert(`テンプレート編集モーダルを開きます（ID: ${this.dataset.templateId}）（未実装）`);
        });
    });
    
    document.querySelectorAll('.template-delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const name = this.closest('tr').querySelector('td:nth-child(1)').textContent;
            if (confirm(`「${name}」を削除しますか？`)) {
                alert(`テンプレートを削除しました（ID: ${this.dataset.templateId}）`);
            }
        });
    });
    
    // メーリングリスト
    const createMailingListBtn = document.getElementById('create-mailing-list-btn');
    if (createMailingListBtn) {
        createMailingListBtn.addEventListener('click', () => alert('メーリングリスト新規作成モーダルを開きます（未実装）'));
    }
    
    document.querySelectorAll('.mailing-list-edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            alert(`メーリングリスト編集モーダルを開きます（ID: ${this.dataset.mailingListId}）（未実装）`);
        });
    });
    
    document.querySelectorAll('.mailing-list-delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const name = this.closest('tr').querySelector('td:nth-child(1)').textContent;
            if (confirm(`「${name}」を削除しますか？`)) {
                alert(`メーリングリストを削除しました（ID: ${this.dataset.mailingListId}）`);
            }
        });
    });
    
    // デフォルト設定
    const createDefaultSettingBtn = document.getElementById('create-default-setting-btn');
    if (createDefaultSettingBtn) {
        createDefaultSettingBtn.addEventListener('click', () => alert('デフォルト設定新規作成モーダルを開きます（未実装）'));
    }
    
    document.querySelectorAll('.default-setting-edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            alert(`デフォルト設定編集モーダルを開きます（ID: ${this.dataset.defaultSettingId}）（未実装）`);
        });
    });
    
    document.querySelectorAll('.default-setting-delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const name = this.closest('tr').querySelector('td:nth-child(1)').textContent;
            if (confirm(`「${name}」を削除しますか？`)) {
                alert(`デフォルト設定を削除しました（ID: ${this.dataset.defaultSettingId}）`);
            }
        });
    });
}

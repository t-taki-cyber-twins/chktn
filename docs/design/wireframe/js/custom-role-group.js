/**
 * カスタムロールグループ管理画面のJavaScript
 * タブ切り替え、検索、削除確認などの機能を実装
 */

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initCustomRoleGroupManagement();
    initCustomRoleGroupPermissionManagement();
});

/**
 * タブ切り替え機能の初期化
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // URLハッシュから初期タブを決定
    const hash = window.location.hash.substring(1);
    const initialTab = hash || 'custom-role-group';

    // タブボタンのクリックイベント
    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            switchTab(tabName);
        });
    });

    // ブラウザの戻る/進むボタン対応
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            switchTab(hash);
        }
    });

    // 初期タブを表示
    switchTab(initialTab);
}

/**
 * タブを切り替える
 * @param {string} tabName - タブ名
 */
function switchTab(tabName) {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // すべてのタブを非アクティブ化
    tabButtons.forEach((button) => {
        button.classList.remove('active');
    });
    tabContents.forEach((content) => {
        content.classList.remove('active');
    });

    // 指定されたタブをアクティブ化
    const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
    const targetContent = document.getElementById(`tab-${tabName}`);

    if (targetButton && targetContent) {
        targetButton.classList.add('active');
        targetContent.classList.add('active');
        
        // URLハッシュを更新（履歴に追加）
        if (window.location.hash !== `#${tabName}`) {
            window.location.hash = tabName;
        }
    }
}

/**
 * カスタムロールグループ管理タブの初期化
 */
function initCustomRoleGroupManagement() {
    const searchInput = document.getElementById('custom-role-group-search');
    const createBtn = document.getElementById('create-custom-role-group-btn');
    const editBtns = document.querySelectorAll('.custom-role-group-edit-btn');
    const deleteBtns = document.querySelectorAll('.custom-role-group-delete-btn');

    // 検索機能
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterTable('custom-role-group-table-body', e.target.value);
        });
    }

    // 新規作成ボタン
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            alert('カスタムロールグループの新規作成画面を開きます（モック）');
        });
    }

    // 編集ボタン
    editBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const customRoleGroupId = btn.dataset.customRoleGroupId;
            alert(`カスタムロールグループID: ${customRoleGroupId} の編集画面を開きます（モック）`);
        });
    });

    // 削除ボタン
    deleteBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const customRoleGroupId = btn.dataset.customRoleGroupId;
            if (confirm(`カスタムロールグループID: ${customRoleGroupId} を削除してもよろしいですか？`)) {
                alert(`カスタムロールグループID: ${customRoleGroupId} を削除しました（モック）`);
                // 実際はここでAPIを呼び出して削除処理を行う
            }
        });
    });
}

/**
 * カスタムロールグループ権限管理タブの初期化
 */
function initCustomRoleGroupPermissionManagement() {
    const filterSelect = document.getElementById('custom-role-group-permission-filter');
    const createBtn = document.getElementById('create-custom-role-group-permission-btn');
    const addFromRoleBtn = document.getElementById('add-from-role-btn');
    const addFromRoleGroupBtn = document.getElementById('add-from-role-group-btn');
    const deleteBtns = document.querySelectorAll('.custom-role-group-permission-delete-btn');

    // フィルター機能
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            filterCustomRoleGroupPermissionTable(e.target.value);
        });
    }

    // 新規紐づけボタン
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            alert('カスタムロールグループと権限の紐づけ作成画面を開きます（モック）');
        });
    }

    // ロールから追加ボタン
    if (addFromRoleBtn) {
        addFromRoleBtn.addEventListener('click', () => {
            alert('ロールを選択して権限を一括追加する画面を開きます（モック）\n\n例：「エンジニア管理者」ロールを選択すると、そのロールに紐づく権限がカスタムロールグループに追加されます。');
        });
    }

    // ロールグループから追加ボタン
    if (addFromRoleGroupBtn) {
        addFromRoleGroupBtn.addEventListener('click', () => {
            alert('ロールグループを選択して権限を一括追加する画面を開きます（モック）\n\n例：「管理者」ロールグループを選択すると、そのロールグループに紐づく全ての権限がカスタムロールグループに追加されます。');
        });
    }

    // 削除ボタン
    deleteBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const customRoleGroupId = btn.dataset.customRoleGroupId;
            const permissionId = btn.dataset.permissionId;
            if (confirm(`カスタムロールグループID: ${customRoleGroupId} と権限ID: ${permissionId} の紐づけを削除してもよろしいですか？`)) {
                alert(`紐づけを削除しました（モック）`);
                // 実際はここでAPIを呼び出して削除処理を行う
            }
        });
    });
}

/**
 * テーブルをフィルタリングする
 * @param {string} tableBodyId - テーブルボディのID
 * @param {string} searchText - 検索テキスト
 */
function filterTable(tableBodyId, searchText) {
    const tableBody = document.getElementById(tableBodyId);
    if (!tableBody) return;

    const rows = tableBody.querySelectorAll('tr');
    const lowerSearchText = searchText.toLowerCase();

    rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        if (text.includes(lowerSearchText)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

/**
 * カスタムロールグループ権限テーブルをフィルタリングする
 * @param {string} customRoleGroupId - カスタムロールグループID（空文字列の場合はすべて表示）
 */
function filterCustomRoleGroupPermissionTable(customRoleGroupId) {
    const tableBody = document.getElementById('custom-role-group-permission-table-body');
    if (!tableBody) return;

    const rows = tableBody.querySelectorAll('tr');

    rows.forEach((row) => {
        if (!customRoleGroupId || row.dataset.customRoleGroupId === customRoleGroupId) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

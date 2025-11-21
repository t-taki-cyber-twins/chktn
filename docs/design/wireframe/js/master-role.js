/**
 * マスタロール管理画面のJavaScript
 * タブ切り替え、検索、削除確認などの機能を実装
 */

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initRoleManagement();
    initRoleGroupManagement();
    initRoleGroupRoleManagement();
});

/**
 * タブ切り替え機能の初期化
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // URLハッシュから初期タブを決定
    const hash = window.location.hash.substring(1);
    const initialTab = hash || 'role';

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
 * マスタロール管理タブの初期化
 */
function initRoleManagement() {
    const searchInput = document.getElementById('role-search');
    const createBtn = document.getElementById('create-role-btn');
    const editBtns = document.querySelectorAll('.role-edit-btn');
    const deleteBtns = document.querySelectorAll('.role-delete-btn');

    // 検索機能
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterTable('role-table-body', e.target.value);
        });
    }

    // 新規作成ボタン
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            alert('ロールの新規作成画面を開きます（モック）');
        });
    }

    // 編集ボタン
    editBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const roleId = btn.dataset.roleId;
            alert(`ロールID: ${roleId} の編集画面を開きます（モック）`);
        });
    });

    // 削除ボタン
    deleteBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const roleId = btn.dataset.roleId;
            if (confirm(`ロールID: ${roleId} を削除してもよろしいですか？`)) {
                alert(`ロールID: ${roleId} を削除しました（モック）`);
                // 実際はここでAPIを呼び出して削除処理を行う
            }
        });
    });
}

/**
 * マスタロールグループ管理タブの初期化
 */
function initRoleGroupManagement() {
    const searchInput = document.getElementById('role-group-search');
    const createBtn = document.getElementById('create-role-group-btn');
    const editBtns = document.querySelectorAll('.role-group-edit-btn');
    const deleteBtns = document.querySelectorAll('.role-group-delete-btn');

    // 検索機能
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterTable('role-group-table-body', e.target.value);
        });
    }

    // 新規作成ボタン
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            alert('ロールグループの新規作成画面を開きます（モック）');
        });
    }

    // 編集ボタン
    editBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const roleGroupId = btn.dataset.roleGroupId;
            alert(`ロールグループID: ${roleGroupId} の編集画面を開きます（モック）`);
        });
    });

    // 削除ボタン
    deleteBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const roleGroupId = btn.dataset.roleGroupId;
            if (confirm(`ロールグループID: ${roleGroupId} を削除してもよろしいですか？`)) {
                alert(`ロールグループID: ${roleGroupId} を削除しました（モック）`);
                // 実際はここでAPIを呼び出して削除処理を行う
            }
        });
    });
}

/**
 * マスタロールグループロール管理タブの初期化
 */
function initRoleGroupRoleManagement() {
    const filterSelect = document.getElementById('role-group-role-filter');
    const createBtn = document.getElementById('create-role-group-role-btn');
    const deleteBtns = document.querySelectorAll('.role-group-role-delete-btn');

    // フィルター機能
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            filterRoleGroupRoleTable(e.target.value);
        });
    }

    // 新規紐づけボタン
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            alert('ロールグループとロールの紐づけ作成画面を開きます（モック）');
        });
    }

    // 削除ボタン
    deleteBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const roleGroupId = btn.dataset.roleGroupId;
            const roleId = btn.dataset.roleId;
            if (confirm(`ロールグループID: ${roleGroupId} とロールID: ${roleId} の紐づけを削除してもよろしいですか？`)) {
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
 * ロールグループロールテーブルをフィルタリングする
 * @param {string} roleGroupId - ロールグループID（空文字列の場合はすべて表示）
 */
function filterRoleGroupRoleTable(roleGroupId) {
    const tableBody = document.getElementById('role-group-role-table-body');
    if (!tableBody) return;

    const rows = tableBody.querySelectorAll('tr');

    rows.forEach((row) => {
        if (!roleGroupId || row.dataset.roleGroupId === roleGroupId) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

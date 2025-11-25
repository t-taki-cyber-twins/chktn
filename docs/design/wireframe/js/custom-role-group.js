/**
 * カスタムロールグループ管理画面のJavaScript
 * 検索、削除確認、権限管理モーダルなどの機能を実装
 */

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    initCustomRoleGroupManagement();
    initCustomRoleGroupPermissionManagement();
});

/**
 * カスタムロールグループ管理の初期化
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
            const row = btn.closest('tr');
            const customRoleGroupName = row.cells[1].textContent; // 2列目が名前
            openPermissionModal(customRoleGroupId, customRoleGroupName);
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
 * カスタムロールグループ権限管理（モーダル）の初期化
 */
function initCustomRoleGroupPermissionManagement() {
    const createBtn = document.getElementById('create-custom-role-group-permission-btn');
    const addFromRoleBtn = document.getElementById('add-from-role-btn');
    const addFromRoleGroupBtn = document.getElementById('add-from-role-group-btn');
    const deleteBtns = document.querySelectorAll('.custom-role-group-permission-delete-btn');
    const modalCloseBtn = document.getElementById('custom-role-group-permission-modal-close');
    const modalCancelBtn = document.getElementById('custom-role-group-permission-modal-cancel');
    const modalOverlay = document.querySelector('#custom-role-group-permission-modal .modal-overlay');

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

    // モーダルを閉じる処理
    const closeModal = () => {
        const modal = document.getElementById('custom-role-group-permission-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
}

/**
 * 権限管理モーダルを開く
 * @param {string} customRoleGroupId - カスタムロールグループID
 * @param {string} customRoleGroupName - カスタムロールグループ名
 */
function openPermissionModal(customRoleGroupId, customRoleGroupName) {
    const modal = document.getElementById('custom-role-group-permission-modal');
    const titleSpan = document.getElementById('modal-custom-role-group-name');
    
    if (modal && titleSpan) {
        titleSpan.textContent = customRoleGroupName;
        
        // テーブルをフィルタリングして、選択されたグループの権限のみ表示
        filterCustomRoleGroupPermissionTable(customRoleGroupId);
        
        modal.classList.add('active');
    }
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
 * @param {string} customRoleGroupId - カスタムロールグループID
 */
function filterCustomRoleGroupPermissionTable(customRoleGroupId) {
    const tableBody = document.getElementById('custom-role-group-permission-table-body');
    if (!tableBody) return;

    const rows = tableBody.querySelectorAll('tr');

    rows.forEach((row) => {
        if (row.dataset.customRoleGroupId === customRoleGroupId) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

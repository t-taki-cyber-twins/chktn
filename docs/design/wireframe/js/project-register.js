/* ========================================
   案件登録画面固有JavaScript
   ======================================== */

/**
 * フォーム送信処理
 */
function initFormSubmit() {
    const saveBtn = document.querySelector('.sidebar-save-btn');
    const cancelBtn = document.querySelector('.sidebar-cancel-btn');
    const projectForm = document.getElementById('project-form');

    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            if (projectForm && projectForm.validateForm()) {
                // フォームデータを取得
                const formData = projectForm.getFormData();
                console.log('フォーム送信:', formData);
                alert('案件を登録しました（モック）');
            }
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('入力内容を破棄して戻りますか？')) {
                // 前の画面に戻る（モック）
                console.log('キャンセル');
                window.location.href = 'top.html'; // 仮の遷移先
            }
        });
    }
}

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    initFormSubmit();
});

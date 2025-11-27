/* ========================================
   エンジニア登録画面固有JavaScript
   ======================================== */

/**
 * フォーム送信処理
 */
function initFormSubmit() {
    const saveBtn = document.querySelector('.sidebar-save-btn');
    const cancelBtn = document.querySelector('.sidebar-cancel-btn');
    const engineerForm = document.getElementById('engineer-form');

    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            if (engineerForm && engineerForm.validateForm()) {
                const formData = engineerForm.getFormData();
                console.log('フォーム送信:', formData);
                alert('エンジニアを登録しました（モック）');
                // TODO: 登録完了後、エンジニア詳細画面に遷移
            }
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('入力内容を破棄して戻りますか？')) {
                window.location.href = 'engineer-search.html';
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

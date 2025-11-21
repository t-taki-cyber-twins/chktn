/* ========================================
   共通JavaScript
   ======================================== */

/**
 * ドロップダウンメニューの初期化
 */
function initDropdownMenus() {
    const dropdowns = document.querySelectorAll('.header-dropdown');
    
    dropdowns.forEach(function(dropdown) {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle && !toggle.dataset.dropdownInitialized) {
            // 既に初期化済みの場合はスキップ（Web Componentsで初期化済みの場合）
            toggle.dataset.dropdownInitialized = 'true';
            
            toggle.addEventListener('click', function(e) {
                e.stopPropagation();
                const isActive = dropdown.classList.contains('active');
                
                // すべてのドロップダウンを閉じる（Web Components内のものも含む）
                const allDropdowns = document.querySelectorAll('.header-dropdown');
                allDropdowns.forEach(function(otherDropdown) {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
                
                // クリックしたドロップダウンを開閉
                if (isActive) {
                    dropdown.classList.remove('active');
                } else {
                    dropdown.classList.add('active');
                }
            });
        }
    });
    
    // ドキュメントのクリックでドロップダウンを閉じる（一度だけ設定）
    if (!document.dropdownClickHandlerAdded) {
        document.addEventListener('click', function(e) {
            // ドロップダウンメニュー内のクリックは閉じないようにする
            if (!e.target.closest('.header-dropdown')) {
                const allDropdowns = document.querySelectorAll('.header-dropdown');
                allDropdowns.forEach(function(dropdown) {
                    dropdown.classList.remove('active');
                });
            }
        });
        document.dropdownClickHandlerAdded = true;
    }
}

/**
 * ログアウトリンクのクリックイベント
 */
function initLogoutLink() {
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(function(item) {
        if (item.textContent.trim() === 'ログアウト') {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                // TODO: ログアウト処理を実装
                if (confirm('ログアウトしますか？')) {
                    console.log('ログアウト処理を実行');
                    // window.location.href = '/logout';
                }
            });
        }
    });
}

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    initDropdownMenus();
    initLogoutLink();
});


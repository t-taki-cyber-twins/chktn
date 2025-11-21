/**
 * ヘッダーコンポーネント
 * Web Components (Custom Elements) を使用して実装
 */
class AppHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header class="header">
                <div class="header-left">
                    <a href="top.html" class="logo">chktn</a>
                    
                    <!-- メッセージ管理 -->
                    <div class="header-dropdown">
                        <button class="header-nav-link dropdown-toggle">
                            <span class="header-nav-icon">💬</span>
                            <span>メッセージ管理</span>
                        </button>
                        <div class="dropdown-menu">
                            <a href="message-search.html" class="dropdown-item">メッセージ検索</a>
                        </div>
                    </div>
                    

                    <!-- エンジニア管理 -->
                    <div class="header-dropdown">
                        <button class="header-nav-link dropdown-toggle">
                            <span class="header-nav-icon">👤</span>
                            <span>エンジニア管理</span>
                        </button>
                        <div class="dropdown-menu">
                            <a href="engineer-search.html" class="dropdown-item">エンジニア検索</a>
                            <a href="engineer-meeting-list.html" class="dropdown-item">エンジニア面談管理</a>
                            <a href="engineer-register.html" class="dropdown-item">エンジニア登録</a>
                            <a href="#" class="dropdown-item">エンジニア一括登録</a>
                        </div>
                    </div>
                    
                    <!-- 案件を探す -->
                    <div class="header-dropdown">
                        <button class="header-nav-link dropdown-toggle">
                            <span class="header-nav-icon">🔍</span>
                            <span>案件を探す</span>
                        </button>
                        <div class="dropdown-menu">
                            <a href="public-project-search.html" class="dropdown-item">公開案件検索</a>
                            <a href="recommended-project-search.html" class="dropdown-item">おすすめ案件検索</a>
                        </div>
                    </div>
                    
                    <!-- 案件管理 -->
                    <div class="header-dropdown">
                        <button class="header-nav-link dropdown-toggle">
                            <span class="header-nav-icon">📋</span>
                            <span>案件管理</span>
                        </button>
                        <div class="dropdown-menu">
                            <a href="project-search.html" class="dropdown-item">案件検索</a>
                            <a href="project-meeting-list.html" class="dropdown-item">案件面談管理</a>
                            <a href="project-register.html" class="dropdown-item">案件登録</a>
                            <a href="#" class="dropdown-item">案件一括登録</a>
                        </div>
                    </div>
                    
                    <!-- エンジニアを探す -->
                    <div class="header-dropdown">
                        <button class="header-nav-link dropdown-toggle">
                            <span class="header-nav-icon">👥</span>
                            <span>エンジニアを探す</span>
                        </button>
                        <div class="dropdown-menu">
                            <a href="public-engineer-search.html" class="dropdown-item">公開エンジニア検索</a>
                            <a href="recommended-engineer-search.html" class="dropdown-item">おすすめエンジニア検索</a>
                        </div>
                    </div>
                    
                </div>
                
                <div class="header-right">
                    <!-- テナントマスタ管理 -->
                    <div class="header-dropdown">
                        <button class="header-icon-btn dropdown-toggle" title="テナントマスタ管理">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                        <div class="dropdown-menu dropdown-menu-right">
                            <a href="client-list.html" class="dropdown-item">取引先会社管理</a>
                            <a href="custom-role-group.html" class="dropdown-item">カスタムロールグループ</a>
                            <a href="#" class="dropdown-item">テキスト値管理</a>
                            <a href="#" class="dropdown-item">メール管理</a>
                            <a href="#" class="dropdown-item">お知らせ管理</a>
                        </div>
                    </div>
                    
                    <!-- アカウント管理 -->
                    <div class="header-dropdown">
                        <button class="header-icon-btn dropdown-toggle" title="アカウント管理">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </button>
                        <div class="dropdown-menu dropdown-menu-right">
                            <a href="employee-list.html" class="dropdown-item">社員管理</a>
                            <a href="account-list.html" class="dropdown-item">アカウント管理</a>
                            <a href="tenant-company-list.html" class="dropdown-item">テナント・会社管理</a>
                        </div>
                    </div>

                    <!-- システム管理者メニュー -->
                    <div class="header-dropdown">
                        <button class="header-icon-btn dropdown-toggle" title="システム管理者メニュー">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </button>
                        <div class="dropdown-menu dropdown-menu-right">
                            <a href="master-role.html" class="dropdown-item">マスタロール管理</a>
                            <a href="admin-tenant-list.html" class="dropdown-item">テナント管理</a>
                            <a href="admin-corporate-master-list.html" class="dropdown-item">法人マスタ管理</a>
                            <a href="#" class="dropdown-item">お知らせ管理</a>
                            <a href="#" class="dropdown-item">リファラー管理</a>
                        </div>
                    </div>
                    
                    <!-- ユーザー名 -->
                    <div class="header-dropdown">
                        <button class="header-user-btn dropdown-toggle">
                            <span class="user-name">山田太郎</span>
                        </button>
                        <div class="dropdown-menu dropdown-menu-right">
                            <div class="dropdown-item-text">
                                <div class="user-info-item">テナント名: サンプルテナント</div>
                                <div class="user-info-item">会社名: サンプル株式会社</div>
                            </div>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item">ログアウト</a>
                        </div>
                    </div>
                </div>
            </header>
        `;
        
        // ドロップダウンメニューの初期化
        // Web Components内で直接初期化する
        this.initDropdownMenus();
    }
    
    /**
     * ドロップダウンメニューの初期化
     */
    initDropdownMenus() {
        const dropdowns = this.querySelectorAll('.header-dropdown');
        
        dropdowns.forEach((dropdown) => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (toggle) {
                // 初期化済みフラグを設定（common.jsとの重複を防ぐ）
                toggle.dataset.dropdownInitialized = 'true';
                
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isActive = dropdown.classList.contains('active');
                    
                    // すべてのドロップダウンを閉じる（common.jsで初期化されたものも含む）
                    const allDropdowns = document.querySelectorAll('.header-dropdown');
                    allDropdowns.forEach((otherDropdown) => {
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
    }
}

// カスタム要素として登録
customElements.define('app-header', AppHeader);


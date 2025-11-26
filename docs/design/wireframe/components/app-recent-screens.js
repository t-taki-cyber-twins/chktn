/**
 * 最近使った画面コンポーネント
 * Web Components (Custom Elements) を使用して実装
 */
class AppRecentScreens extends HTMLElement {
    connectedCallback() {
        // 属性からデータを取得（JSON形式）
        const dataAttr = this.getAttribute('data-screens');
        let screens = [];
        
        if (dataAttr) {
            try {
                screens = JSON.parse(dataAttr);
            } catch (e) {
                console.error('Invalid JSON data for recent screens:', e);
            }
        }
        
        // デフォルトデータ（属性がない場合）
        if (screens.length === 0) {
            screens = [
                { icon: '👥', title: 'エンジニア面談設定', detail: '（田中太郎さん）' },
                { icon: '📋', title: '案件検索', detail: '（項目:フルスタックエンジニア）' },
                { icon: '📝', title: '案件編集', detail: '（案件名:Webアプリケーション開発）' },
                { icon: '🏢', title: '取引先編集', detail: '（会社名:サンプル株式会社）' },
                { icon: '👥', title: 'エンジニア面談設定', detail: '（佐藤花子さん）' },
                { icon: '📋', title: '案件検索', detail: '（項目:バックエンドエンジニア）' },
                { icon: '📝', title: '案件編集', detail: '（案件名:モバイルアプリ開発）' },
                { icon: '🏢', title: '取引先編集', detail: '（会社名:テック株式会社）' }
            ];
        }
        
        // HTMLを生成
        const menuItems = screens.map(screen => `
            <li class="sidebar-menu-item">
                <a href="#" class="sidebar-menu-link">
                    <span class="sidebar-menu-text">
                        <span class="sidebar-menu-title">${screen.title || ''}</span>
                        <span class="sidebar-menu-detail">${screen.detail || ''}</span>
                    </span>
                </a>
            </li>
        `).join('');
        
        this.innerHTML = `
            <div class="sidebar-title">最近使った画面</div>
            <ul class="sidebar-menu">
                ${menuItems}
            </ul>
        `;
    }
    
    /**
     * データを更新するメソッド
     * @param {Array} screens - 画面データの配列
     */
    updateScreens(screens) {
        if (!Array.isArray(screens)) {
            console.error('Screens must be an array');
            return;
        }
        
        this.setAttribute('data-screens', JSON.stringify(screens));
        // 再描画
        this.innerHTML = '';
        this.connectedCallback();
    }
}

// カスタム要素として登録
customElements.define('app-recent-screens', AppRecentScreens);


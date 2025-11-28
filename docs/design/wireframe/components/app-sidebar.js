class AppSidebar extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        // Capture the initial content (search form, etc.)
        const content = this.innerHTML;
        // 依存関係を読み込む
        await this.loadDependencies();
        this.render(content);
    }

    /**
     * 依存関係を動的に読み込む
     */
    async loadDependencies() {
        // app-recent-screensが未定義の場合のみ読み込む
        if (!customElements.get('app-recent-screens')) {
            try {
                await import('./app-recent-screens.js');
            } catch (error) {
                console.error('Failed to load app-recent-screens.js component:', error);
            }
        }
    }

    render(content) {
        this.innerHTML = `
            <aside class="sidebar">
                <nav>
                    ${content}
                    
                    <!-- 共通コンポーネント: 最近使った画面 -->
                    <app-recent-screens></app-recent-screens>
                </nav>
            </aside>
        `;
    }
}

customElements.define('app-sidebar', AppSidebar);

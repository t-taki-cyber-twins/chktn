class AppSidebar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Capture the initial content (search form, etc.)
        const content = this.innerHTML;
        this.render(content);
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

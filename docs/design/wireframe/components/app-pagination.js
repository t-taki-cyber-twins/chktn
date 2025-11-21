class AppPagination extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="pagination">
                <button type="button" class="pagination-btn pagination-btn-prev" disabled>前へ</button>
                <div class="pagination-pages">
                    <button type="button" class="pagination-page active">1</button>
                    <button type="button" class="pagination-page">2</button>
                    <button type="button" class="pagination-page">3</button>
                </div>
                <button type="button" class="pagination-btn pagination-btn-next">次へ</button>
            </div>
        `;
    }

    setupEventListeners() {
        const pages = this.querySelectorAll('.pagination-page');
        pages.forEach(page => {
            page.addEventListener('click', (e) => {
                // Remove active class from all pages
                pages.forEach(p => p.classList.remove('active'));
                // Add active class to clicked page
                e.target.classList.add('active');
                
                // Dispatch event
                this.dispatchEvent(new CustomEvent('page-change', {
                    bubbles: true,
                    detail: { page: e.target.textContent }
                }));
            });
        });
    }
}

customElements.define('app-pagination', AppPagination);

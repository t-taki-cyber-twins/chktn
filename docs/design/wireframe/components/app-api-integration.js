/**
 * API連携管理コンポーネント
 */
class AppApiIntegration extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
                }
                
                /* Tabs */
                .tabs {
                    display: flex;
                    border-bottom: 1px solid #ddd;
                    margin-bottom: 24px;
                }
                .tab-btn {
                    padding: 12px 24px;
                    background: none;
                    border: none;
                    border-bottom: 2px solid transparent;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 500;
                    color: #666;
                    transition: all 0.2s;
                }
                .tab-btn:hover {
                    color: #333;
                    background-color: #f9f9f9;
                }
                .tab-btn.active {
                    color: #0056b3;
                    border-bottom-color: #0056b3;
                }

                /* Content */
                .tab-content {
                    display: none;
                }
                .tab-content.active {
                    display: block;
                }

                /* Form */
                .form-group {
                    margin-bottom: 20px;
                }
                .form-label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: bold;
                    color: #333;
                }
                .form-control {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                    box-sizing: border-box;
                }
                .form-control:read-only {
                    background-color: #f5f5f5;
                    color: #666;
                }
                .form-text {
                    font-size: 12px;
                    color: #666;
                    margin-top: 4px;
                }

                /* Toggle Switch */
                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                    margin-right: 10px;
                    vertical-align: middle;
                }
                .toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: .4s;
                    border-radius: 24px;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                input:checked + .slider {
                    background-color: #28a745;
                }
                input:checked + .slider:before {
                    transform: translateX(26px);
                }
                .toggle-label {
                    vertical-align: middle;
                    font-weight: bold;
                }

                /* Buttons */
                .btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    transition: background-color 0.2s;
                }
                .btn-primary {
                    background-color: #0056b3;
                    color: white;
                }
                .btn-primary:hover {
                    background-color: #004494;
                }
                .btn-outline {
                    background-color: white;
                    border: 1px solid #ddd;
                    color: #333;
                }
                .btn-outline:hover {
                    background-color: #f5f5f5;
                }

                /* Status */
                .status-badge {
                    display: inline-block;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: bold;
                }
                .status-connected {
                    background-color: #d4edda;
                    color: #155724;
                }
                .status-disconnected {
                    background-color: #f8d7da;
                    color: #721c24;
                }

                .service-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #eee;
                }
                .service-title {
                    font-size: 18px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .service-icon {
                    width: 32px;
                    height: 32px;
                    object-fit: contain;
                }
                
                .copy-group {
                    display: flex;
                    gap: 8px;
                }
                .copy-btn {
                    white-space: nowrap;
                }
            </style>

            <div class="tabs">
                <button class="tab-btn active" data-tab="zoom">Zoom</button>
                <button class="tab-btn" data-tab="google">Google Meet</button>
                <button class="tab-btn" data-tab="teams">Microsoft Teams</button>
            </div>

            <!-- Zoom Settings -->
            <div id="zoom" class="tab-content active">
                <div class="service-header">
                    <div class="service-title">
                        <!-- Placeholder icon -->
                        <span style="font-size: 24px;">🎥</span>
                        Zoom連携設定
                    </div>
                    <div class="status-badge status-disconnected">未連携</div>
                </div>

                <div class="form-group">
                    <label class="toggle-switch">
                        <input type="checkbox" id="zoom-enable">
                        <span class="slider"></span>
                    </label>
                    <span class="toggle-label">Zoom連携を有効にする</span>
                </div>

                <div class="form-group">
                    <label class="form-label">Client ID</label>
                    <input type="text" class="form-control" placeholder="Zoom Client ID">
                </div>

                <div class="form-group">
                    <label class="form-label">Client Secret</label>
                    <input type="password" class="form-control" placeholder="Zoom Client Secret">
                </div>

                <div class="form-group">
                    <label class="form-label">Redirect URI</label>
                    <div class="copy-group">
                        <input type="text" class="form-control" value="https://app.wt2m.com/api/auth/zoom/callback" readonly>
                        <button class="btn btn-outline copy-btn">コピー</button>
                    </div>
                    <div class="form-text">このURLをZoom App MarketplaceのRedirect URLに設定してください。</div>
                </div>

                <div class="form-actions">
                    <button class="btn btn-primary">保存して連携テスト</button>
                </div>
            </div>

            <!-- Google Meet Settings -->
            <div id="google" class="tab-content">
                <div class="service-header">
                    <div class="service-title">
                        <span style="font-size: 24px;">📅</span>
                        Google Meet連携設定
                    </div>
                    <div class="status-badge status-connected">連携済み</div>
                </div>

                <div class="form-group">
                    <label class="toggle-switch">
                        <input type="checkbox" id="google-enable" checked>
                        <span class="slider"></span>
                    </label>
                    <span class="toggle-label">Google Meet連携を有効にする</span>
                </div>

                <div class="form-group">
                    <label class="form-label">Client ID</label>
                    <input type="text" class="form-control" value="123456789-abcdefg.apps.googleusercontent.com">
                </div>

                <div class="form-group">
                    <label class="form-label">Client Secret</label>
                    <input type="password" class="form-control" value="********">
                </div>

                <div class="form-group">
                    <label class="form-label">Redirect URI</label>
                    <div class="copy-group">
                        <input type="text" class="form-control" value="https://app.wt2m.com/api/auth/google/callback" readonly>
                        <button class="btn btn-outline copy-btn">コピー</button>
                    </div>
                    <div class="form-text">このURLをGoogle Cloud Consoleの承認済みのリダイレクトURIに設定してください。</div>
                </div>

                <div class="form-actions">
                    <button class="btn btn-primary">保存して連携テスト</button>
                </div>
            </div>

            <!-- Microsoft Teams Settings -->
            <div id="teams" class="tab-content">
                <div class="service-header">
                    <div class="service-title">
                        <span style="font-size: 24px;">👥</span>
                        Microsoft Teams連携設定
                    </div>
                    <div class="status-badge status-disconnected">未連携</div>
                </div>

                <div class="form-group">
                    <label class="toggle-switch">
                        <input type="checkbox" id="teams-enable">
                        <span class="slider"></span>
                    </label>
                    <span class="toggle-label">Microsoft Teams連携を有効にする</span>
                </div>

                <div class="form-group">
                    <label class="form-label">Application (Client) ID</label>
                    <input type="text" class="form-control" placeholder="Azure AD Application ID">
                </div>

                <div class="form-group">
                    <label class="form-label">Client Secret</label>
                    <input type="password" class="form-control" placeholder="Azure AD Client Secret">
                </div>

                <div class="form-group">
                    <label class="form-label">Directory (Tenant) ID</label>
                    <input type="text" class="form-control" placeholder="Azure AD Directory ID">
                </div>

                <div class="form-group">
                    <label class="form-label">Redirect URI</label>
                    <div class="copy-group">
                        <input type="text" class="form-control" value="https://app.wt2m.com/api/auth/teams/callback" readonly>
                        <button class="btn btn-outline copy-btn">コピー</button>
                    </div>
                    <div class="form-text">このURLをAzure PortalのリダイレクトURIに設定してください。</div>
                </div>

                <div class="form-actions">
                    <button class="btn btn-primary">保存して連携テスト</button>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Tab switching
        const tabs = this.shadowRoot.querySelectorAll('.tab-btn');
        const contents = this.shadowRoot.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));

                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                const targetId = tab.dataset.tab;
                this.shadowRoot.getElementById(targetId).classList.add('active');
            });
        });

        // Copy buttons
        const copyBtns = this.shadowRoot.querySelectorAll('.copy-btn');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const input = e.target.previousElementSibling;
                input.select();
                document.execCommand('copy');
                
                // Visual feedback
                const originalText = btn.textContent;
                btn.textContent = 'コピーしました';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);
            });
        });
    }
}

customElements.define('app-api-integration', AppApiIntegration);

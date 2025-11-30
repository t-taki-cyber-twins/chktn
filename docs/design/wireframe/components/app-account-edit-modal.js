/**
 * アカウント編集モーダルコンポーネント
 * Web Components (Custom Elements) を使用して実装
 */
class AppAccountEditModal extends HTMLElement {
    constructor() {
        super();
        this.accountData = null;
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="modal" id="account-edit-modal-overlay">
                <div class="modal-content modal-lg">
                    <div class="modal-header">
                        <h2 class="modal-title" id="account-modal-title">アカウント作成</h2>
                        <button type="button" class="modal-close" id="account-modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="account-edit-form" class="modal-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="account-email" class="form-label required">ログインメールアドレス</label>
                                    <input type="email" id="account-email" name="email" class="form-input" required>
                                    <div class="form-help-text">
                                        このメールアドレスでログインします
                                    </div>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="account-password" class="form-label required">パスワード</label>
                                    <input type="password" id="account-password" name="password" class="form-input" required>
                                    <div class="form-help-text">
                                        編集時は空欄の場合、変更されません
                                    </div>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="account-employee" class="form-label required">紐づける社員</label>
                                    <select id="account-employee" name="employee-id" class="form-select" required>
                                        <option value="">社員を選択してください</option>
                                        <option value="1">山田 太郎 (開発部)</option>
                                        <option value="2">鈴木 一郎 (営業部)</option>
                                        <option value="3">田中 花子 (開発部)</option>
                                        <option value="4">佐藤 次郎 (総務部)</option>
                                    </select>
                                    <div class="form-help-text">
                                        このアカウントに紐づく社員を選択します
                                    </div>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="account-company" class="form-label required">会社</label>
                                    <select id="account-company" name="company-id" class="form-select" required>
                                        <option value="">会社を選択してください</option>
                                        <option value="1">サンプル株式会社</option>
                                        <option value="2">テスト株式会社</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="account-role-group" class="form-label required">カスタムロールグループ</label>
                                    <select id="account-role-group" name="role-group-id" class="form-select" required>
                                        <option value="">ロールグループを選択してください</option>
                                        <option value="admin">管理者</option>
                                        <option value="engineer-manager">エンジニア管理者</option>
                                        <option value="back-office">バックオフィス</option>
                                        <option value="viewer">閲覧者</option>
                                    </select>
                                    <div class="form-help-text">
                                        このアカウントの権限レベルを設定します
                                    </div>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="account-status" class="form-label required">ステータス</label>
                                    <select id="account-status" name="status" class="form-select" required>
                                        <option value="active">有効</option>
                                        <option value="inactive">無効</option>
                                        <option value="locked">ロック中</option>
                                    </select>
                                    <div class="form-help-text">
                                        無効にするとログインできなくなります
                                    </div>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="account-2fa" class="form-label required">二段階認証</label>
                                    <select id="account-2fa" name="two-factor-auth" class="form-select" required>
                                        <option value="enabled">有効</option>
                                        <option value="disabled">無効</option>
                                    </select>
                                    <div class="form-help-text">
                                        このアカウントの二段階認証設定
                                    </div>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-notice">
                                    <strong>注意:</strong> アカウントを作成すると、指定したメールアドレスに初期パスワードが送信されます。
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-warning" id="account-modal-cancel">キャンセル</button>
                        <button type="submit" form="account-edit-form" class="btn btn-primary" id="account-modal-save">保存</button>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const overlay = this.querySelector('#account-edit-modal-overlay');
        const closeBtn = this.querySelector('#account-modal-close');
        const cancelBtn = this.querySelector('#account-modal-cancel');
        const form = this.querySelector('#account-edit-form');

        // モーダルを閉じる
        const closeModal = () => {
            overlay.classList.remove('active');
            this.accountData = null;
            form.reset();
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        // オーバーレイクリックで閉じる
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });

        // フォーム送信
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            console.log('Account data to save:', data);
            alert('保存機能は未実装です。\nデータ: ' + JSON.stringify(data, null, 2));
            closeModal();
        });
    }

    /**
     * モーダルを表示
     * @param {Object} accountData - 編集するアカウントデータ（新規の場合はnull）
     */
    show(accountData = null) {
        this.accountData = accountData;
        const overlay = this.querySelector('#account-edit-modal-overlay');
        const title = this.querySelector('#account-modal-title');
        const form = this.querySelector('#account-edit-form');
        const passwordField = this.querySelector('#account-password');

        if (accountData) {
            // 編集モード
            title.textContent = 'アカウント編集';
            this.querySelector('#account-email').value = accountData.email || '';
            this.querySelector('#account-employee').value = accountData.employeeId || '';
            this.querySelector('#account-company').value = accountData.companyId || '';
            this.querySelector('#account-role-group').value = accountData.roleGroupId || '';
            this.querySelector('#account-status').value = accountData.status || 'active';
            this.querySelector('#account-2fa').value = accountData.twoFactorAuth || 'disabled';
            
            // 編集時はパスワードは必須ではない
            passwordField.removeAttribute('required');
            passwordField.value = '';
        } else {
            // 新規モード
            title.textContent = 'アカウント作成';
            form.reset();
            passwordField.setAttribute('required', 'required');
        }

        overlay.classList.add('active');
    }

    /**
     * モーダルを閉じる
     */
    hide() {
        const overlay = this.querySelector('#account-edit-modal-overlay');
        overlay.classList.remove('active');
        this.accountData = null;
        this.querySelector('#account-edit-form').reset();
    }
}

// カスタム要素として登録
customElements.define('app-account-edit-modal', AppAccountEditModal);

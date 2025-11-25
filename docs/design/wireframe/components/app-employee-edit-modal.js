/**
 * 社員編集モーダルコンポーネント
 * Web Components (Custom Elements) を使用して実装
 */
class AppEmployeeEditModal extends HTMLElement {
    constructor() {
        super();
        this.employeeData = null;
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="modal" id="employee-edit-modal-overlay">
                <div class="modal-content modal-lg">
                    <div class="modal-header">
                        <h2 class="modal-title" id="employee-modal-title">社員登録</h2>
                        <button type="button" class="modal-close" id="employee-modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="employee-edit-form" class="modal-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="employee-name" class="form-label required">氏名</label>
                                    <input type="text" id="employee-name" name="name" class="form-input" required>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="employee-email" class="form-label required">メールアドレス</label>
                                    <input type="email" id="employee-email" name="email" class="form-input" required>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="employee-department" class="form-label">所属部署</label>
                                    <input type="text" id="employee-department" name="department" class="form-input">
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="employee-joined-date" class="form-label">入社日</label>
                                    <input type="date" id="employee-joined-date" name="joined-date" class="form-input">
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">社員属性</label>
                                    <div class="form-checkbox-group">
                                        <label class="form-checkbox-label">
                                            <input type="checkbox" id="employee-is-engineer" name="is-engineer" class="form-checkbox">
                                            <span>エンジニア属性</span>
                                        </label>
                                        <label class="form-checkbox-label">
                                            <input type="checkbox" id="employee-is-pm" name="is-pm" class="form-checkbox">
                                            <span>案件担当属性</span>
                                        </label>
                                        <label class="form-checkbox-label">
                                            <input type="checkbox" id="employee-is-tech-manager" name="is-tech-manager" class="form-checkbox">
                                            <span>技術者管理属性</span>
                                        </label>
                                    </div>
                                    <div class="form-help-text">
                                        ※ エンジニア属性を持つ社員はエンジニア情報を入力する必要があります<br>
                                        ※ 案件担当属性を持つ社員は案件担当情報を入力する必要があります<br>
                                        ※ 一人の社員が複数の属性を持つことができます
                                    </div>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="employee-status" class="form-label required">ステータス</label>
                                    <select id="employee-status" name="status" class="form-select" required>
                                        <option value="active">在籍中</option>
                                        <option value="suspended">休職中</option>
                                        <option value="inactive">退職済み</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-warning" id="employee-modal-cancel">キャンセル</button>
                        <button type="submit" form="employee-edit-form" class="btn btn-primary" id="employee-modal-save">保存</button>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const overlay = this.querySelector('#employee-edit-modal-overlay');
        const closeBtn = this.querySelector('#employee-modal-close');
        const cancelBtn = this.querySelector('#employee-modal-cancel');
        const form = this.querySelector('#employee-edit-form');

        // モーダルを閉じる
        const closeModal = () => {
            overlay.classList.remove('active');
            this.employeeData = null;
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
            
            console.log('Employee data to save:', data);
            alert('保存機能は未実装です。\nデータ: ' + JSON.stringify(data, null, 2));
            closeModal();
        });
    }

    /**
     * モーダルを表示
     * @param {Object} employeeData - 編集する社員データ（新規の場合はnull）
     */
    show(employeeData = null) {
        this.employeeData = employeeData;
        const overlay = this.querySelector('#employee-edit-modal-overlay');
        const title = this.querySelector('#employee-modal-title');
        const form = this.querySelector('#employee-edit-form');

        if (employeeData) {
            // 編集モード
            title.textContent = '社員編集';
            this.querySelector('#employee-name').value = employeeData.name || '';
            this.querySelector('#employee-email').value = employeeData.email || '';
            this.querySelector('#employee-department').value = employeeData.department || '';
            this.querySelector('#employee-joined-date').value = employeeData.joinedDate || '';
            this.querySelector('#employee-is-engineer').checked = employeeData.isEngineer || false;
            this.querySelector('#employee-is-pm').checked = employeeData.isPM || false;
            this.querySelector('#employee-is-tech-manager').checked = employeeData.isTechManager || false;
            this.querySelector('#employee-status').value = employeeData.status || 'active';
        } else {
            // 新規モード
            title.textContent = '社員登録';
            form.reset();
        }

        overlay.classList.add('active');
    }

    /**
     * モーダルを閉じる
     */
    hide() {
        const overlay = this.querySelector('#employee-edit-modal-overlay');
        overlay.classList.remove('active');
        this.employeeData = null;
        this.querySelector('#employee-edit-form').reset();
    }
}

// カスタム要素として登録
customElements.define('app-employee-edit-modal', AppEmployeeEditModal);

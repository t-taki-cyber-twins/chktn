/**
 * 社員情報フォームコンポーネント
 * Web Components (Custom Elements) を使用して実装
 */
class AppEmployeeInfoForm extends HTMLElement {
    constructor() {
        super();
        this.companies = [];
        this.departments = [];
        this.positions = [];
        this.formData = {};
    }

    connectedCallback() {
        this.loadMasterData();
        this.render();
    }

    /**
     * マスタデータを読み込む
     */
    async loadMasterData() {
        try {
            const { mockCompanies, mockDepartments, mockPositions } = await import('../js/mock-data.js');
            this.companies = mockCompanies;
            this.departments = mockDepartments;
            this.positions = mockPositions;
            this.render();
        } catch (error) {
            console.error('Failed to load master data:', error);
        }
    }

    render() {
        this.innerHTML = `
            <div class="form-section">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="last-name" class="form-label">姓</label>
                        <input type="text" id="last-name" name="last-name" class="form-input" placeholder="例: 山田" value="${this.formData.lastName || ''}">
                    </div>
                    <div class="form-group">
                        <label for="first-name" class="form-label">名</label>
                        <input type="text" id="first-name" name="first-name" class="form-input" placeholder="例: 太郎" value="${this.formData.firstName || ''}">
                    </div>
                    <div class="form-group">
                        <label for="birth-date" class="form-label">生年月日</label>
                        <input type="date" id="birth-date" name="birth-date" class="form-input">
                    </div>
                    <div class="form-group">
                        <label for="nearest-station" class="form-label">最寄駅</label>
                        <input type="text" id="nearest-station" name="nearest-station" class="form-input" placeholder="例: 東京駅">
                    </div>
                    <div class="form-group form-group-full">
                        <label for="address" class="form-label">住所</label>
                        <input type="text" id="address" name="address" class="form-input" placeholder="例: 東京都千代田区">
                    </div>
                    <div class="form-group">
                        <label for="phone" class="form-label">電話番号</label>
                        <input type="text" id="phone" name="phone" class="form-input" placeholder="例: 03-1234-5678">
                    </div>
                    <div class="form-group">
                        <label for="email" class="form-label">メールアドレス</label>
                        <input type="email" id="email" name="email" class="form-input" placeholder="example@example.com">
                    </div>
                    <div class="form-group">
                        <label for="company" class="form-label">所属会社</label>
                        <select id="company" name="company" class="form-select">
                            <option value="">選択してください</option>
                            ${this.companies.map(company => {
                                const selected = String(this.formData.company) === String(company.id) ? 'selected' : '';
                                return `<option value="${company.id}" ${selected}>${this.escapeHtml(company.name)}</option>`;
                            }).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="department" class="form-label">所属部署</label>
                        <select id="department" name="department" class="form-select">
                            <option value="">選択してください</option>
                            ${this.departments.map(department => {
                                const selected = String(this.formData.department) === String(department.id) ? 'selected' : '';
                                return `<option value="${department.id}" ${selected}>${this.escapeHtml(department.name)}</option>`;
                            }).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="position" class="form-label">所属役職</label>
                        <select id="position" name="position" class="form-select">
                            <option value="">選択してください</option>
                            ${this.positions.map(position => {
                                const selected = String(this.formData.position) === String(position.id) ? 'selected' : '';
                                return `<option value="${position.id}" ${selected}>${this.escapeHtml(position.name)}</option>`;
                            }).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="joined-date" class="form-label">入社日</label>
                        <input type="date" id="joined-date" name="joined-date" class="form-input" value="${this.formData.joinedDate || ''}">
                    </div>
                    <div class="form-group">
                        <label for="status" class="form-label required">ステータス</label>
                        <select id="status" name="status" class="form-select" required>
                            <option value="active" ${this.formData.status === 'active' ? 'selected' : ''}>在籍中</option>
                            <option value="suspended" ${this.formData.status === 'suspended' ? 'selected' : ''}>休職中</option>
                            <option value="inactive" ${this.formData.status === 'inactive' ? 'selected' : ''}>退職済み</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * フォームデータを設定
     * @param {Object} data - フォームデータ
     */
    setFormData(data) {
        this.formData = data || {};
        this.render();
    }

    /**
     * フォームデータを取得
     * @returns {Object} フォームデータ
     */
    getFormData() {
        const data = {};
        
        // すべての入力フィールドを取得
        const inputs = this.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (!input.name) return;
            
            if (input.type === 'checkbox') {
                data[input.name] = input.checked;
            } else if (input.type === 'radio') {
                if (input.checked) {
                    data[input.name] = input.value;
                }
            } else {
                data[input.name] = input.value;
            }
        });
        
        return data;
    }

    /**
     * フォームをリセット
     */
    reset() {
        this.formData = {};
        const inputs = this.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
    }

    /**
     * HTMLエスケープ
     */
    escapeHtml(text) {
        if (text === null || text === undefined) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// カスタム要素として登録
customElements.define('app-employee-info-form', AppEmployeeInfoForm);


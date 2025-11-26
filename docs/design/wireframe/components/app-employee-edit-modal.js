/**
 * 社員編集モーダルコンポーネント
 * Web Components (Custom Elements) を使用して実装
 */
import { mockDepartments } from '../js/mock-data.js';

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

                            <!-- 社員情報フォームコンポーネント -->
                            <app-employee-info-form id="employee-info-form"></app-employee-info-form>

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
                                            <span>エンジニア管理属性</span>
                                        </label>
                                    </div>
                                    <div class="form-help-text">
                                        ※ エンジニア属性を持つ社員はエンジニア情報を入力する必要があります<br>
                                        ※ 案件担当属性を持つ社員は案件担当になれる<br>
                                        ※ エンジニア管理属性を持つ社員は技術者管理になれる<br>
                                        ※ 一人の社員が複数の属性を持つことができます
                                    </div>
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
        const infoForm = this.querySelector('#employee-info-form');

        // モーダルを閉じる
        const closeModal = () => {
            overlay.classList.remove('active');
            this.employeeData = null;
            form.reset();
            if (infoForm) infoForm.reset();
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
            
            // 基本情報の取得
            const formData = new FormData(form);
            const basicData = Object.fromEntries(formData.entries());
            
            // コンポーネントからのデータ取得
            const infoData = infoForm ? infoForm.getFormData() : {};
            
            // データの統合
            const mergedData = {
                ...basicData,
                ...infoData,
                // チェックボックスの状態を明示的に取得（FormDataでも取れるが念のため）
                isEngineer: this.querySelector('#employee-is-engineer').checked,
                isPM: this.querySelector('#employee-is-pm').checked,
                isTechManager: this.querySelector('#employee-is-tech-manager').checked
            };
            
            console.log('Employee data to save:', mergedData);
            alert('保存機能は未実装です。\nデータ: ' + JSON.stringify(mergedData, null, 2));
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
        const infoForm = this.querySelector('#employee-info-form');

        if (employeeData) {
            // 編集モード
            title.textContent = '社員編集';
            this.querySelector('#employee-name').value = employeeData.name || '';
            this.querySelector('#employee-is-engineer').checked = employeeData.isEngineer || false;
            this.querySelector('#employee-is-pm').checked = employeeData.isPM || false;
            this.querySelector('#employee-is-tech-manager').checked = employeeData.isTechManager || false;
            
            // コンポーネントにデータを設定
            if (infoForm) {
                // 部署名のID変換などのマッピング処理
                const mappedData = { ...employeeData };
                
                // 部署名からIDへの変換（モックデータ用）
                if (employeeData.department) {
                    const dept = mockDepartments.find(d => d.name === employeeData.department);
                    if (dept) {
                        mappedData.department = dept.id;
                    }
                }
                
                infoForm.setFormData(mappedData);
            }
        } else {
            // 新規モード
            title.textContent = '社員登録';
            form.reset();
            if (infoForm) infoForm.reset();
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
        const infoForm = this.querySelector('#employee-info-form');
        if (infoForm) infoForm.reset();
    }
}

// カスタム要素として登録
customElements.define('app-employee-edit-modal', AppEmployeeEditModal);

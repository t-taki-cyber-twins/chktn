/**
 * 案件登録モーダルコンポーネント
 * Web Components (Custom Elements) を使用して実装
 */
class AppProjectRegisterModal extends HTMLElement {
    connectedCallback() {
        this.render();
        this.initEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="modal project-register-modal" id="project-register-modal">
                <div class="modal-overlay"></div>
                <div class="modal-content modal-content-large">
                    <div class="modal-header">
                        <h3 class="modal-title">案件登録</h3>
                        <button type="button" class="modal-close" data-modal="project-register-modal">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="project-register-form" style="box-shadow: none; padding: 0;">
                            <!-- 基本情報セクション -->
                            <div class="form-section">
                                <h4 class="section-title">基本情報</h4>
                                <div class="form-grid">
                                    <div class="form-group form-group-full">
                                        <div class="form-row">
                                            <div class="form-col">
                                                <label class="form-label">公開設定</label>
                                                <div class="form-checkbox-group">
                                                    <label class="form-checkbox-label">
                                                        <input type="checkbox" id="modal-is-public" name="is-public" class="form-checkbox">
                                                        <span>公開する</span>
                                                    </label>
                                                </div>
                                                <p class="form-help-text">公開にチェックを入れると、他の会社からもこの案件を検索できるようになります。</p>
                                            </div>
                                            <div class="form-col">
                                                <label for="modal-blacklist" class="form-label">ブラックリスト</label>
                                                <div class="form-select-wrapper">
                                                    <button type="button" class="form-select-btn" id="modal-blacklist-btn">
                                                        <span class="form-select-text">選択してください</span>
                                                        <span class="form-select-arrow">▼</span>
                                                    </button>
                                                    <div class="form-selected-values" id="modal-blacklist-selected" style="display: none;">
                                                        <div class="selected-values-list" id="modal-blacklist-selected-list"></div>
                                                        <button type="button" class="selected-value-remove-all" id="modal-blacklist-remove-all">すべて解除</button>
                                                    </div>
                                                </div>
                                                <p class="form-help-text">この案件を検索対象から除外する会社を選択します。</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group form-group-full">
                                        <label for="modal-project-name" class="form-label">案件名 <span class="form-required">*</span></label>
                                        <input type="text" id="modal-project-name" name="project-name" class="form-input" placeholder="案件名を入力してください">
                                    </div>
                                    <div class="form-group form-group-full">
                                        <label for="modal-project-description" class="form-label">案件概要</label>
                                        <textarea id="modal-project-description" name="project-description" class="form-textarea" rows="5" placeholder="案件概要を入力してください"></textarea>
                                    </div>
                                    <div class="form-group form-group-full">
                                        <label for="modal-mailing-list" class="form-label">メーリングリスト</label>
                                        <div class="form-select-wrapper">
                                            <button type="button" class="form-select-btn" id="modal-mailing-list-btn">
                                                <span class="form-select-text">選択してください</span>
                                                <span class="form-select-arrow">▼</span>
                                            </button>
                                            <div class="form-selected-values" id="modal-mailing-list-selected" style="display: none;">
                                                <div class="selected-values-list" id="modal-mailing-list-selected-list"></div>
                                                <button type="button" class="selected-value-remove-all" id="modal-mailing-list-remove-all">すべて解除</button>
                                            </div>
                                        </div>
                                        <p class="form-help-text">案件情報を通知するメーリングリストを選択します（複数選択可）。</p>
                                    </div>
                                </div>
                            </div>

                            <!-- 関連情報セクション -->
                            <div class="form-section">
                                <h4 class="section-title">関連情報</h4>
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label for="modal-end-company" class="form-label">案件エンド会社 <span class="form-required">*</span></label>
                                        <div class="form-select-wrapper">
                                            <button type="button" class="form-select-btn" id="modal-end-company-btn">
                                                <span class="form-select-text">選択してください</span>
                                                <span class="form-select-arrow">▼</span>
                                            </button>
                                            <div class="form-selected-value" id="modal-end-company-selected" style="display: none;">
                                                <span class="selected-value-text"></span>
                                                <button type="button" class="selected-value-remove">×</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="modal-project-manager" class="form-label">案件担当者</label>
                                        <div class="form-select-wrapper">
                                            <button type="button" class="form-select-btn" id="modal-project-manager-btn">
                                                <span class="form-select-text">選択してください</span>
                                                <span class="form-select-arrow">▼</span>
                                            </button>
                                            <div class="form-selected-value" id="modal-project-manager-selected" style="display: none;">
                                                <span class="selected-value-text"></span>
                                                <button type="button" class="selected-value-remove">×</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="modal-engineer" class="form-label">エンジニア</label>
                                        <div class="form-select-wrapper">
                                            <button type="button" class="form-select-btn" id="modal-engineer-btn">
                                                <span class="form-select-text">選択してください</span>
                                                <span class="form-select-arrow">▼</span>
                                            </button>
                                            <div class="form-selected-value" id="modal-engineer-selected" style="display: none;">
                                                <span class="selected-value-text"></span>
                                                <button type="button" class="selected-value-remove">×</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- スキル情報セクション -->
                            <div class="form-section">
                                <h4 class="section-title">案件スキル</h4>
                                <div class="form-group form-group-full">
                                    <div class="skill-selector">
                                        <div class="skill-select-header">
                                            <select id="modal-skill-master" class="form-select">
                                                <option value="">スキルを選択してください</option>
                                                <option value="1">Java</option>
                                                <option value="2">Spring Boot</option>
                                                <option value="3">React</option>
                                                <option value="4">PostgreSQL</option>
                                                <option value="5">AWS</option>
                                            </select>
                                            <input type="text" id="modal-skill-custom" class="form-input skill-custom-input" placeholder="マスタにない場合は新規追加">
                                            <button type="button" class="btn btn-secondary skill-add-btn">追加</button>
                                        </div>
                                        <div class="skill-list" id="modal-skill-list">
                                            <!-- 選択されたスキルがここに表示される -->
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 詳細情報セクション -->
                            <div class="form-section">
                                <h4 class="section-title">詳細情報</h4>
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label for="modal-start-date" class="form-label">開始日</label>
                                        <input type="date" id="modal-start-date" name="start-date" class="form-input">
                                    </div>
                                    <div class="form-group">
                                        <label for="modal-end-date" class="form-label">終了日</label>
                                        <input type="date" id="modal-end-date" name="end-date" class="form-input">
                                    </div>
                                    <div class="form-group">
                                        <label for="modal-price" class="form-label">単価</label>
                                        <input type="number" id="modal-price" name="price" class="form-input" placeholder="円">
                                    </div>
                                    <div class="form-group">
                                        <label for="modal-age-range" class="form-label">希望年齢幅</label>
                                        <input type="text" id="modal-age-range" name="age-range" class="form-input" placeholder="例: 25-35">
                                    </div>
                                    <div class="form-group">
                                        <label for="modal-contract-type" class="form-label">契約形態</label>
                                        <select id="modal-contract-type" name="contract-type" class="form-select">
                                            <option value="">選択してください</option>
                                            <option value="contract">契約社員</option>
                                            <option value="employee">正社員</option>
                                            <option value="freelance">フリーランス</option>
                                            <option value="part-time">パートタイム</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="modal-member-number" class="form-label">募集人数</label>
                                        <input type="number" id="modal-member-number" name="member-number" class="form-input" min="1">
                                    </div>
                                    <div class="form-group">
                                        <label for="modal-work-location" class="form-label">勤務地</label>
                                        <input type="text" id="modal-work-location" name="work-location" class="form-input" placeholder="例: 東京都千代田区">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">リモートワーク</label>
                                        <div class="form-radio-group">
                                            <label class="form-radio-label">
                                                <input type="radio" name="modal-remote-work" value="yes" class="form-radio">
                                                <span>可</span>
                                            </label>
                                            <label class="form-radio-label">
                                                <input type="radio" name="modal-remote-work" value="no" class="form-radio">
                                                <span>不可</span>
                                            </label>
                                            <label class="form-radio-label">
                                                <input type="radio" name="modal-remote-work" value="partial" class="form-radio">
                                                <span>一部可</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary project-register-cancel-btn">キャンセル</button>
                        <button type="button" class="btn btn-primary project-register-save-btn">登録</button>
                    </div>
                </div>
            </div>
        `;
    }

    initEventListeners() {
        // モーダルを閉じる
        const closeBtn = this.querySelector('.modal-close');
        const overlay = this.querySelector('.modal-overlay');
        const cancelBtn = this.querySelector('.project-register-cancel-btn');
        const saveBtn = this.querySelector('.project-register-save-btn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.close());
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                // TODO: 登録処理の実装
                alert('案件を登録しました（モック）');
                this.close();
            });
        }

        // その他、フォーム内のイベントリスナー（ブラックリスト選択など）は
        // 必要に応じてここに追加するか、外部から制御する
    }

    /**
     * モーダルを開く
     */
    open() {
        const modal = this.querySelector('.project-register-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    /**
     * モーダルを閉じる
     */
    close() {
        const modal = this.querySelector('.project-register-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
}

// カスタム要素として登録
customElements.define('app-project-register-modal', AppProjectRegisterModal);

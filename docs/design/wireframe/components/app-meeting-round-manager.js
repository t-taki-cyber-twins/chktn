/**
 * 面談回管理コンポーネント
 * 面談回のタブ表示、追加・削除、各回のフォーム表示を行う
 */
class AppMeetingRoundManager extends HTMLElement {
    constructor() {
        super();
        this.meetingRounds = [];
        this.activeRound = 1;
    }

    connectedCallback() {
        this.render();
        this.initEventListeners();
    }

    /**
     * 初期データの設定
     * @param {Array} rounds - 面談回データの配列
     * @param {number} activeRound - アクティブな面談回番号
     */
    init(rounds, activeRound = 1) {
        this.meetingRounds = rounds;
        this.activeRound = activeRound;
        this.renderTabs();
    }

    render() {
        this.innerHTML = `
            <div class="meeting-round-manager">
                <!-- 面談回タブ -->
                <div class="meeting-round-tabs" id="meeting-round-tabs" style="display: flex; gap: 8px; margin-bottom: 16px; align-items: center;">
                    <!-- 動的に生成 -->
                </div>
                
                <!-- 面談回コンテンツ -->
                <div class="meeting-round-contents" id="meeting-round-contents">
                    <!-- 動的に生成 -->
                </div>
            </div>
        `;
    }

    initEventListeners() {
        // コンテナレベルでのイベント委譲を設定
        this.addEventListener('click', (e) => {
            // タブ切り替え
            if (e.target.classList.contains('meeting-round-tab')) {
                const roundNumber = parseInt(e.target.dataset.round);
                this.switchRound(roundNumber);
            }
            // 追加ボタン
            else if (e.target.classList.contains('meeting-round-add-btn')) {
                this.addRound();
            }
            // 削除ボタン
            else if (e.target.classList.contains('meeting-round-delete-btn')) {
                const roundNumber = parseInt(e.target.dataset.round);
                this.deleteRound(roundNumber);
            }
            // ツール設定ボタン
            else if (e.target.classList.contains('meeting-tool-setting-btn')) {
                const roundNumber = parseInt(e.target.dataset.round);
                this.dispatchEvent(new CustomEvent('open-tool-settings', { 
                    detail: { roundNumber } 
                }));
            }
        });

        // 入力変更の監視（イベント委譲）
        this.addEventListener('change', (e) => {
            if (e.target.matches('input, select, textarea')) {
                this.saveCurrentRoundData();
                
                // ステータス変更時は特別な処理が必要かもしれない
                if (e.target.classList.contains('meeting-status-select')) {
                    const roundNumber = parseInt(e.target.dataset.round);
                    this.updateDeleteButtonVisibility(roundNumber);
                    
                    // 親に通知
                    this.dispatchEvent(new CustomEvent('status-changed', {
                        detail: { 
                            roundNumber, 
                            status: e.target.value 
                        }
                    }));
                }
            }
        });
    }

    /**
     * タブとコンテンツの再描画
     */
    renderTabs() {
        const tabsContainer = this.querySelector('#meeting-round-tabs');
        const contentsContainer = this.querySelector('#meeting-round-contents');
        
        if (!tabsContainer || !contentsContainer) return;
        
        // タブボタン生成
        let tabsHTML = '';
        this.meetingRounds.forEach(round => {
            const activeClass = round.roundNumber === this.activeRound ? 'btn-primary' : 'btn-light';
            tabsHTML += `<button class="meeting-round-tab btn ${activeClass} btn-sm" data-round="${round.roundNumber}">${round.roundNumber}回目</button>`;
        });
        tabsHTML += '<button class="meeting-round-add-btn btn btn-outline-secondary btn-sm">+ 追加</button>';
        tabsContainer.innerHTML = tabsHTML;
        
        // コンテンツ生成
        let contentsHTML = '';
        this.meetingRounds.forEach(round => {
            contentsHTML += this.renderRoundContent(round);
        });
        contentsContainer.innerHTML = contentsHTML;
    }

    /**
     * 各ラウンドのHTML生成
     */
    renderRoundContent(round) {
        const activeClass = round.roundNumber === this.activeRound ? 'active' : '';
        const showDeleteBtn = round.status === '';
        
        return `
            <div class="meeting-round-content ${activeClass}" data-round="${round.roundNumber}" style="${activeClass === 'active' ? 'display: block;' : 'display: none;'}">
                <div class="form-section">
                    <!-- 面談ステータス選択 -->
                    <div class="form-section">
                        <label for="meeting-status-${round.roundNumber}" class="form-label">面談ステータス</label>
                        <select id="meeting-status-${round.roundNumber}" name="meeting-status" class="form-select meeting-status-select" data-round="${round.roundNumber}">
                            <option value="">選択してください</option>
                            <option value="proposal" ${round.status === 'proposal' ? 'selected' : ''}>調整中</option>
                            <option value="pending" ${round.status === 'pending' ? 'selected' : ''}>面談確定</option>
                            <option value="canceled" ${round.status === 'canceled' ? 'selected' : ''}>面談中止</option>
                            <option value="waiting_result" ${round.status === 'waiting_result' ? 'selected' : ''}>結果待ち</option>
                            <option value="passed" ${round.status === 'passed' ? 'selected' : ''}>合格</option>
                            <option value="failed" ${round.status === 'failed' ? 'selected' : ''}>不合格</option>
                            <option value="rejected" ${round.status === 'rejected' ? 'selected' : ''}>辞退</option>
                        </select>
                    </div>

                    <div class="form-grid">
                        <div class="form-group">
                            <label for="meeting-datetime-${round.roundNumber}" class="form-label">面談日時</label>
                            <input type="datetime-local" id="meeting-datetime-${round.roundNumber}" name="meeting-datetime" class="form-input" value="${round.datetime}">
                        </div>
                        <div class="form-group">
                            <label for="meeting-duration-${round.roundNumber}" class="form-label">面談時間</label>
                            <select id="meeting-duration-${round.roundNumber}" name="meeting-duration" class="form-select" data-round="${round.roundNumber}">
                                <option value="">選択してください</option>
                                <option value="15" ${round.duration === '15' ? 'selected' : ''}>15分</option>
                                <option value="30" ${round.duration === '30' ? 'selected' : ''}>30分</option>
                                <option value="45" ${round.duration === '45' ? 'selected' : ''}>45分</option>
                                <option value="60" ${round.duration === '60' ? 'selected' : ''}>60分</option>
                                <option value="90" ${round.duration === '90' ? 'selected' : ''}>90分</option>
                                <option value="120" ${round.duration === '120' ? 'selected' : ''}>120分</option>
                            </select>
                        </div>
                        <div class="form-group form-group-full">
                            <label for="meeting-location-${round.roundNumber}" class="form-label">面談場所</label>
                            <input type="text" id="meeting-location-${round.roundNumber}" name="meeting-location" class="form-input" placeholder="例: 東京都千代田区 会議室A" value="${round.location}">
                        </div>
                        
                        <!-- 面談ツール設定 -->
                        <div class="form-group">
                            <label for="meeting-tool-${round.roundNumber}" class="form-label">面談ツール</label>
                            <select id="meeting-tool-${round.roundNumber}" name="meeting-tool" class="form-select meeting-tool-select" data-round="${round.roundNumber}">
                                <option value="">選択してください</option>
                                <option value="zoom" ${round.meetingTool === 'zoom' ? 'selected' : ''}>Zoom</option>
                                <option value="google-meet" ${round.meetingTool === 'google-meet' ? 'selected' : ''}>Google Meet</option>
                                <option value="teams" ${round.meetingTool === 'teams' ? 'selected' : ''}>Microsoft Teams</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">&nbsp;</label>
                            <button type="button" class="btn btn-outline-secondary meeting-tool-setting-btn" data-round="${round.roundNumber}">参加者設定・URL発行</button>
                        </div>
                        <div class="form-group form-group-full">
                            <label for="meeting-url-${round.roundNumber}" class="form-label">面談URL</label>
                            <input type="text" id="meeting-url-${round.roundNumber}" name="meeting-url" class="form-input" value="${round.meetingUrl}" readonly style="background-color: #f5f5f5;">
                        </div>
                        
                        <div class="form-group form-group-full">
                            <label for="meeting-private-note-${round.roundNumber}" class="form-label">面談非公開メモ</label>
                            <textarea id="meeting-private-note-${round.roundNumber}" name="meeting-private-note" class="form-textarea" rows="4" placeholder="社内のみで共有する非公開メモを入力してください">${round.privateNote}</textarea>
                        </div>
                    </div>
                    
                    <div class="meeting-round-footer" style="margin-top: 16px; display: flex; justify-content: flex-end;">
                        <button class="meeting-round-delete-btn btn btn-outline-danger btn-sm" data-round="${round.roundNumber}" style="display: ${showDeleteBtn ? 'block' : 'none'};">
                            この面談を削除
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    addRound() {
        // 親コンポーネントに通知してデータを追加してもらう
        this.dispatchEvent(new CustomEvent('round-add'));
    }

    deleteRound(roundNumber) {
        const round = this.meetingRounds.find(r => r.roundNumber === roundNumber);
        if (round && round.status !== '') {
            alert('ステータスが選択されている面談は削除できません。');
            return;
        }
        if (!confirm(`${roundNumber}回目の面談を削除してもよろしいですか?`)) {
            return;
        }
        
        // 親コンポーネントに通知
        this.dispatchEvent(new CustomEvent('round-delete', { detail: { roundNumber } }));
    }

    switchRound(roundNumber) {
        this.saveCurrentRoundData();
        this.activeRound = roundNumber;
        
        // UI更新（全再描画ではなくクラス切り替えで効率化）
        this.querySelectorAll('.meeting-round-tab').forEach(tab => {
            if (parseInt(tab.dataset.round) === roundNumber) {
                tab.classList.remove('btn-light');
                tab.classList.add('btn-primary');
            } else {
                tab.classList.remove('btn-primary');
                tab.classList.add('btn-light');
            }
        });
        
        this.querySelectorAll('.meeting-round-content').forEach(content => {
            if (parseInt(content.dataset.round) === roundNumber) {
                content.classList.add('active');
                content.style.display = 'block';
            } else {
                content.classList.remove('active');
                content.style.display = 'none';
            }
        });

        // 親に通知（必要であれば）
        this.dispatchEvent(new CustomEvent('round-switch', { detail: { roundNumber } }));
    }

    saveCurrentRoundData() {
        const currentRound = this.meetingRounds.find(r => r.roundNumber === this.activeRound);
        if (!currentRound) return;
        
        const statusSelect = this.querySelector(`#meeting-status-${this.activeRound}`);
        const datetimeInput = this.querySelector(`#meeting-datetime-${this.activeRound}`);
        const durationSelect = this.querySelector(`#meeting-duration-${this.activeRound}`);
        const locationInput = this.querySelector(`#meeting-location-${this.activeRound}`);
        const noteTextarea = this.querySelector(`#meeting-private-note-${this.activeRound}`);
        const meetingToolSelect = this.querySelector(`#meeting-tool-${this.activeRound}`);
        const meetingUrlInput = this.querySelector(`#meeting-url-${this.activeRound}`);
        
        if (statusSelect) currentRound.status = statusSelect.value;
        if (datetimeInput) currentRound.datetime = datetimeInput.value;
        if (durationSelect) currentRound.duration = durationSelect.value;
        if (locationInput) currentRound.location = locationInput.value;
        if (noteTextarea) currentRound.privateNote = noteTextarea.value;
        if (meetingToolSelect) currentRound.meetingTool = meetingToolSelect.value;
        if (meetingUrlInput) currentRound.meetingUrl = meetingUrlInput.value;
    }

    updateDeleteButtonVisibility(roundNumber) {
        const round = this.meetingRounds.find(r => r.roundNumber === roundNumber);
        if (!round) return;
        
        const deleteBtn = this.querySelector(`.meeting-round-delete-btn[data-round="${roundNumber}"]`);
        if (deleteBtn) {
            deleteBtn.style.display = round.status === '' ? 'block' : 'none';
        }
    }

    /**
     * 特定のラウンドのURLフィールドを更新（ツール設定後に呼ばれる）
     */
    updateMeetingUrl(roundNumber, url) {
        const urlInput = this.querySelector(`#meeting-url-${roundNumber}`);
        if (urlInput) {
            urlInput.value = url;
        }
    }
}

customElements.define('app-meeting-round-manager', AppMeetingRoundManager);

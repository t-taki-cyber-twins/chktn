/**
 * スキルシートアップロードモーダルコンポーネント
 * Web Components (Custom Elements) を使用して実装
 */
class AppSkillSheetUploader extends HTMLElement {
    constructor() {
        super();
        this.selectedFile = null;
        this.isAnalyzing = false;
        this.analysisProgress = 0;
        this.onUploadCallback = null;
        this.onAnalysisCallback = null;
    }

    connectedCallback() {
        this.render();
        this.initEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="modal skill-sheet-uploader-modal" id="skill-sheet-uploader-modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">スキルシートアップロード</h3>
                        <button type="button" class="modal-close" data-modal="skill-sheet-uploader-modal">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="skill-sheet-upload-form">
                            <div class="form-group form-group-full">
                                <label for="skill-sheet-file" class="form-label">ファイル選択</label>
                                <input type="file" id="skill-sheet-file" class="form-input" accept=".pdf,.doc,.docx,.xls,.xlsx">
                                <p class="form-help-text">PDF、Word、Excelファイルを選択してください。</p>
                            </div>
                            
                            <div class="skill-sheet-file-info" id="skill-sheet-file-info" style="display: none;">
                                <div class="file-info-item">
                                    <span class="file-info-label">ファイル名:</span>
                                    <span class="file-info-value" id="file-name"></span>
                                </div>
                                <div class="file-info-item">
                                    <span class="file-info-label">ファイルサイズ:</span>
                                    <span class="file-info-value" id="file-size"></span>
                                </div>
                            </div>

                            <div class="skill-sheet-upload-actions">
                                <button type="button" class="btn btn-secondary skill-sheet-upload-submit-btn" id="skill-sheet-upload-submit-btn" disabled>アップロードのみ</button>
                                <button type="button" class="btn btn-primary skill-sheet-ai-analyze-btn" id="skill-sheet-ai-analyze-btn" disabled>AIで解析</button>
                            </div>

                            <div class="skill-sheet-analysis-progress" id="skill-sheet-analysis-progress" style="display: none;">
                                <div class="progress-bar-container">
                                    <div class="progress-bar" id="analysis-progress-bar" style="width: 0%;"></div>
                                </div>
                                <div class="progress-text">
                                    <span id="analysis-progress-text">解析中...</span>
                                    <span id="analysis-progress-percent">0%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-warning skill-sheet-uploader-cancel-btn">キャンセル</button>
                    </div>
                </div>
            </div>
        `;
    }

    initEventListeners() {
        const modal = this.querySelector('.skill-sheet-uploader-modal');
        const overlay = this.querySelector('.modal-overlay');
        const headerCloseBtn = this.querySelector('.modal-close');
        const cancelBtn = this.querySelector('.skill-sheet-uploader-cancel-btn');
        const fileInput = this.querySelector('#skill-sheet-file');
        const uploadBtn = this.querySelector('#skill-sheet-upload-submit-btn');
        const aiAnalyzeBtn = this.querySelector('#skill-sheet-ai-analyze-btn');

        // ヘッダーの閉じるボタン
        if (headerCloseBtn) {
            headerCloseBtn.addEventListener('click', () => this.close());
        }

        // フッターのキャンセルボタン
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.close());
        }

        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }

        // ファイル選択
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.selectedFile = file;
                    this.displayFileInfo(file);
                    if (uploadBtn) uploadBtn.disabled = false;
                    if (aiAnalyzeBtn) aiAnalyzeBtn.disabled = false;
                } else {
                    this.selectedFile = null;
                    this.hideFileInfo();
                    if (uploadBtn) uploadBtn.disabled = true;
                    if (aiAnalyzeBtn) aiAnalyzeBtn.disabled = true;
                }
            });
        }

        // アップロードボタン
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                if (this.selectedFile) {
                    this.uploadFile();
                }
            });
        }

        // AI解析ボタン
        if (aiAnalyzeBtn) {
            aiAnalyzeBtn.addEventListener('click', () => {
                if (this.selectedFile && !this.isAnalyzing) {
                    this.startAnalysis();
                }
            });
        }
    }

    /**
     * ファイル情報を表示
     */
    displayFileInfo(file) {
        const fileInfo = this.querySelector('#skill-sheet-file-info');
        const fileName = this.querySelector('#file-name');
        const fileSize = this.querySelector('#file-size');

        if (fileInfo && fileName && fileSize) {
            fileName.textContent = file.name;
            fileSize.textContent = this.formatFileSize(file.size);
            fileInfo.style.display = 'block';
        }
    }

    /**
     * ファイル情報を非表示
     */
    hideFileInfo() {
        const fileInfo = this.querySelector('#skill-sheet-file-info');
        if (fileInfo) {
            fileInfo.style.display = 'none';
        }
    }

    /**
     * ファイルサイズをフォーマット
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * ファイルをアップロード
     */
    uploadFile() {
        if (!this.selectedFile) return;

        // TODO: 実際のAPI呼び出しに置き換える
        console.log('ファイルアップロード:', this.selectedFile.name);

        if (this.onUploadCallback) {
            this.onUploadCallback(this.selectedFile);
        }

        // アップロード成功時の処理
        alert('スキルシートをアップロードしました（モック）');
        this.close();
    }

    /**
     * AI解析を開始
     */
    startAnalysis() {
        if (!this.selectedFile || this.isAnalyzing) return;

        this.isAnalyzing = true;
        this.analysisProgress = 0;

        // ボタンの状態を更新
        const uploadBtn = this.querySelector('#skill-sheet-upload-submit-btn');
        const aiAnalyzeBtn = this.querySelector('#skill-sheet-ai-analyze-btn');
        if (uploadBtn) uploadBtn.disabled = true;
        if (aiAnalyzeBtn) {
            aiAnalyzeBtn.disabled = true;
            aiAnalyzeBtn.textContent = '解析中...';
        }

        // 進捗表示を表示
        const progressSection = this.querySelector('#skill-sheet-analysis-progress');
        if (progressSection) {
            progressSection.style.display = 'block';
        }

        // 進捗をシミュレート（実際のAPI呼び出しに置き換える）
        this.simulateAnalysis();
    }

    /**
     * AI解析の進捗をシミュレート
     */
    simulateAnalysis() {
        const interval = setInterval(() => {
            this.analysisProgress += Math.random() * 15;
            if (this.analysisProgress > 100) {
                this.analysisProgress = 100;
            }

            this.updateProgress();

            if (this.analysisProgress >= 100) {
                clearInterval(interval);
                this.completeAnalysis();
            }
        }, 500);
    }

    /**
     * 進捗を更新
     */
    updateProgress() {
        const progressBar = this.querySelector('#analysis-progress-bar');
        const progressText = this.querySelector('#analysis-progress-text');
        const progressPercent = this.querySelector('#analysis-progress-percent');

        if (progressBar) {
            progressBar.style.width = this.analysisProgress + '%';
        }
        if (progressPercent) {
            progressPercent.textContent = Math.round(this.analysisProgress) + '%';
        }
    }

    /**
     * AI解析を完了
     */
    completeAnalysis() {
        this.isAnalyzing = false;
        this.analysisProgress = 100;

        // ボタンの状態を更新
        const uploadBtn = this.querySelector('#skill-sheet-upload-submit-btn');
        const aiAnalyzeBtn = this.querySelector('#skill-sheet-ai-analyze-btn');
        if (uploadBtn) uploadBtn.disabled = false;
        if (aiAnalyzeBtn) {
            aiAnalyzeBtn.disabled = false;
            aiAnalyzeBtn.textContent = 'AIで解析';
        }

        // 進捗表示を更新
        const progressText = this.querySelector('#analysis-progress-text');
        if (progressText) {
            progressText.textContent = '解析完了';
        }

        // TODO: 実際のAPI呼び出しに置き換える
        console.log('AI解析完了');

        if (this.onAnalysisCallback) {
            this.onAnalysisCallback({
                file: this.selectedFile,
                skills: this.getMockExtractedSkills(), // モックスキルデータ
                projects: this.getMockExtractedProjects() // モック案件データ
            });
        }

        // 解析完了後の処理
        setTimeout(() => {
            alert('AI解析が完了しました（モック）スキルシートと案件の確認を行ってください');
            this.close();
        }, 1000);
    }

    /**
     * モック抽出スキルデータを取得
     */
    getMockExtractedSkills() {
        return [
            { name: 'Java', category: 'language', level: 3, memo: '' },
            { name: 'Spring Boot', category: 'framework', level: 3, memo: '' },
            { name: 'React', category: 'framework', level: 2, memo: '' },
            { name: 'PostgreSQL', category: 'database', level: 2, memo: '' },
            { name: 'AWS', category: 'cloud', level: 2, memo: '' }
        ];
    }

    /**
     * モック抽出案件データを取得
     */
    getMockExtractedProjects() {
        return [
            {
                projectName: 'ECサイト開発プロジェクト',
                startDate: '2023-04-01',
                endDate: '2023-09-30',
                price: 65,
                workContent: 'ECサイトのバックエンドAPI開発を担当。Spring Bootを使用したRESTful APIの設計・実装を行いました。',
                languagesTools: 'Java, Spring Boot, PostgreSQL, Docker',
                roleProcess: 'バックエンドエンジニア / 設計・実装・テスト'
            },
            {
                projectName: '社内管理システムリニューアル',
                startDate: '2022-10-01',
                endDate: '2023-03-31',
                price: 60,
                workContent: '既存の社内管理システムのリニューアルプロジェクト。フロントエンドとバックエンドの両方を担当しました。',
                languagesTools: 'React, TypeScript, Java, Spring Boot, PostgreSQL',
                roleProcess: 'フルスタックエンジニア / 要件定義・設計・実装'
            }
        ];
    }

    /**
     * モーダルを開く
     * @param {Function} onUpload - アップロード完了時のコールバック関数
     * @param {Function} onAnalysis - AI解析完了時のコールバック関数
     */
    open(onUpload = null, onAnalysis = null) {
        const modal = this.querySelector('.skill-sheet-uploader-modal');
        if (!modal) return;

        this.onUploadCallback = onUpload;
        this.onAnalysisCallback = onAnalysis;

        // 状態をリセット
        this.selectedFile = null;
        this.isAnalyzing = false;
        this.analysisProgress = 0;

        const fileInput = this.querySelector('#skill-sheet-file');
        const uploadBtn = this.querySelector('#skill-sheet-upload-submit-btn');
        const aiAnalyzeBtn = this.querySelector('#skill-sheet-ai-analyze-btn');
        const progressSection = this.querySelector('#skill-sheet-analysis-progress');

        if (fileInput) fileInput.value = '';
        if (uploadBtn) uploadBtn.disabled = true;
        if (aiAnalyzeBtn) {
            aiAnalyzeBtn.disabled = true;
            aiAnalyzeBtn.textContent = 'AIで解析';
        }
        if (progressSection) progressSection.style.display = 'none';
        this.hideFileInfo();

        // モーダルを表示
        modal.classList.add('active');
    }

    /**
     * モーダルを閉じる
     */
    close() {
        const modal = this.querySelector('.skill-sheet-uploader-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
}

// カスタム要素として登録
customElements.define('app-skill-sheet-uploader', AppSkillSheetUploader);


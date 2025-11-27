/* ========================================
   案件編集画面固有JavaScript
   ======================================== */

/**
 * モックデータの読み込み
 */
function loadMockData() {
    const projectForm = document.getElementById('project-form');
    if (!projectForm) return;

    // モックデータ
    const mockData = {
        'project-name': 'フルスタックエンジニア募集',
        'project-description': 'Webアプリケーション開発の案件です。フロントエンドとバックエンドの両方を担当していただきます。',
        'project-recruit-status': 'available', // デフォルト
        'end-company': { id: '1', name: 'サンプル株式会社' },
        'project-manager': [], // 初期値なし
        'mailing-list': [], // 初期値なし
        'blacklist': [], // 初期値なし
        'skills': [
            { id: '1', name: 'Java', level: 1, isCustom: false },
            { id: '2', name: 'Spring Boot', level: 1, isCustom: false },
            { id: '3', name: 'React', level: 1, isCustom: false }
        ],
        'skill-memo': '',
        'start-date': '2024-12-01',
        'end-date': '2025-03-31',
        'member-number': 2,
        'age-range': '25-35',
        'foreigner': '', // 初期値なし
        'work-location': '東京都千代田区',
        'desired-remote': 'week-3-4', // 仮の値（元のHTMLではラジオボタンだったがコンポーネントはセレクトボックス）
        'contract-type': 'contract',
        'desired-price-min': 60, // 万円単位
        'desired-price-max': 80, // 万円単位
        'payment-time-min': 140,
        'payment-time-max': 180,
        'payment-site': '30日',
        'is-public': true
    };

    // コンポーネントにデータをセット
    // コンポーネントの準備ができてからセットする必要があるため、少し遅延させるか、
    // コンポーネント側でsetFormDataが呼ばれたときに要素がなければ待機するロジックが必要だが、
    // ここでは単純にDOMContentLoaded後に実行されるので、customElements.whenDefinedを使うのが安全
    customElements.whenDefined('app-project-form').then(() => {
        projectForm.setFormData(mockData);
    });
}

/**
 * フォーム送信処理
 */
function initFormSubmit() {
    const saveBtn = document.querySelector('.sidebar-save-btn');
    const projectForm = document.getElementById('project-form');

    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            if (projectForm && projectForm.validateForm()) {
                // フォームデータを取得
                const formData = projectForm.getFormData();
                console.log('フォーム送信:', formData);
                alert('案件を更新しました（モック）');
            }
        });
    }
}

/**
 * エンジニア一覧の表示処理（モックデータ）
 */
function initEngineerList() {
    // TODO: APIからエンジニア一覧を取得
    // 現在はHTMLに直接記述されているため、特に処理は不要
    console.log('エンジニア一覧を表示');
}

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    initFormSubmit();
    initEngineerList();
    loadMockData();
});

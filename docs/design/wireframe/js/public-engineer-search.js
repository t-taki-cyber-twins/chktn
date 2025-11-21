/* ========================================
   公開エンジニア検索画面固有JavaScript
   ======================================== */

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    initSearchForm();
    initPagination();
});

/**
 * 検索フォームの初期化
 */
function initSearchForm() {
    const searchForm = document.getElementById('search-form');
    const resetButton = document.querySelector('.search-form-reset');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            performSearch();
        });
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            resetSearchForm();
        });
    }
}

/**
 * 検索実行
 */
function performSearch() {
    const formData = new FormData(document.getElementById('search-form'));
    const searchParams = {};
    
    // フォームデータをオブジェクトに変換
    for (const [key, value] of formData.entries()) {
        if (searchParams[key]) {
            // 既に値がある場合は配列にする（複数選択の場合）
            if (Array.isArray(searchParams[key])) {
                searchParams[key].push(value);
            } else {
                searchParams[key] = [searchParams[key], value];
            }
        } else {
            searchParams[key] = value;
        }
    }
    
    console.log('検索パラメータ:', searchParams);
    
    // TODO: 実際のAPI呼び出しに置き換える
    // モックデータで検索結果を表示
    displaySearchResults(getMockSearchResults());
    
    // 検索結果件数を更新
    updateResultsCount(getMockSearchResults().length);
}

/**
 * 検索フォームをリセット
 */
function resetSearchForm() {
    const form = document.getElementById('search-form');
    if (form) {
        form.reset();
        // すべての検索結果を表示
        displaySearchResults(getMockSearchResults());
        updateResultsCount(getMockSearchResults().length);
    }
}

/**
 * 検索結果を表示
 */
function displaySearchResults(results) {
    const engineerList = document.getElementById('engineer-list');
    if (!engineerList) return;
    
    if (results.length === 0) {
        engineerList.innerHTML = '<div class="no-results">検索条件に一致するエンジニアが見つかりませんでした。</div>';
        return;
    }
    
    engineerList.innerHTML = results.map(engineer => createEngineerCard(engineer)).join('');
}

/**
 * エンジニアカードのHTMLを生成
 */
function createEngineerCard(engineer) {
    const skillsHtml = engineer.skills.map(skill => 
        `<span class="skill-tag">${escapeHtml(skill)}</span>`
    ).join('');
    
    const badgeClass = engineer.isPublic ? 'badge-public' : 'badge-private';
    const badgeText = engineer.isPublic ? '公開' : '非公開';
    
    const availableDate = formatDate(engineer.availableDate);
    const priceRange = engineer.priceMin 
        ? `${engineer.priceMin}万円〜`
        : '要相談';
    
    const remoteWorkText = getRemoteWorkText(engineer.remoteWork);
    
    return `
        <div class="engineer-card">
            <div class="engineer-card-header">
                <h2 class="engineer-card-title">
                    <a href="public-engineer-detail.html?engineerId=${engineer.id}" class="engineer-card-link">${escapeHtml(engineer.name)}</a>
                </h2>
                <div class="engineer-card-badge">
                    <span class="badge ${badgeClass}">${badgeText}</span>
                </div>
            </div>
            <div class="engineer-card-body">
                <p class="engineer-card-description">${escapeHtml(engineer.description)}</p>
                <div class="engineer-card-skills">
                    ${skillsHtml}
                </div>
                <div class="engineer-card-details">
                    <div class="engineer-card-detail-item">
                        <span class="detail-label">稼働開始:</span>
                        <span class="detail-value">${availableDate}</span>
                    </div>
                    <div class="engineer-card-detail-item">
                        <span class="detail-label">希望単価:</span>
                        <span class="detail-value">${priceRange}</span>
                    </div>
                    <div class="engineer-card-detail-item">
                        <span class="detail-label">希望契約:</span>
                        <span class="detail-value">${escapeHtml(engineer.contractType)}</span>
                    </div>
                    <div class="engineer-card-detail-item">
                        <span class="detail-label">希望勤務地:</span>
                        <span class="detail-value">${escapeHtml(engineer.workLocation)}${remoteWorkText ? `（${remoteWorkText}）` : ''}</span>
                    </div>
                </div>
            </div>
            <div class="engineer-card-footer">
                <div class="engineer-card-actions">
                    <a href="public-engineer-detail.html?engineerId=${engineer.id}" class="btn btn-secondary btn-sm">詳細を見る</a>
                </div>
            </div>
        </div>
    `;
}

/**
 * 検索結果件数を更新
 */
function updateResultsCount(count) {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        resultsCount.textContent = `${count}件`;
    }
}

/**
 * ページネーションの初期化
 */
function initPagination() {
    const prevButton = document.querySelector('.pagination-btn-prev');
    const nextButton = document.querySelector('.pagination-btn-next');
    const pageButtons = document.querySelectorAll('.pagination-page');
    
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            // TODO: 前のページに移動
            console.log('前のページへ');
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            // TODO: 次のページに移動
            console.log('次のページへ');
        });
    }
    
    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            // アクティブ状態を更新
            pageButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // TODO: 該当ページのデータを読み込み
            console.log('ページ:', this.textContent);
        });
    });
}

/**
 * モック検索結果データを取得
 */
function getMockSearchResults() {
    return [
        {
            id: 1,
            name: '山田 太郎',
            description: 'Java, Spring Bootを中心としたバックエンド開発が得意です。要件定義から設計、実装、テストまで一通り経験があります。',
            skills: ['Java', 'Spring Boot', 'MySQL', 'AWS'],
            availableDate: '2024-12-01',
            priceMin: 80,
            contractType: 'フリーランス',
            workLocation: '東京都',
            remoteWork: 'yes',
            isPublic: true
        },
        {
            id: 2,
            name: '佐藤 花子',
            description: 'React, TypeScriptを用いたフロントエンド開発の経験が豊富です。UI/UXデザインにも興味があります。',
            skills: ['React', 'TypeScript', 'Next.js', 'Figma'],
            availableDate: '2025-01-01',
            priceMin: 70,
            contractType: '正社員',
            workLocation: '東京都',
            remoteWork: 'partial',
            isPublic: true
        },
        {
            id: 3,
            name: '鈴木 一郎',
            description: 'Python, DjangoでのWebアプリ開発経験があります。データ分析の経験もあります。',
            skills: ['Python', 'Django', 'PostgreSQL', 'Pandas'],
            availableDate: '2024-12-15',
            priceMin: 65,
            contractType: '契約社員',
            workLocation: '神奈川県',
            remoteWork: 'no',
            isPublic: true
        }
    ];
}

/**
 * HTMLエスケープ
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 日付をフォーマット
 */
function formatDate(dateString) {
    if (!dateString) return '即日可能';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}年${month}月${day}日`;
}

/**
 * リモートワークのテキストを取得
 */
function getRemoteWorkText(remoteWork) {
    switch (remoteWork) {
        case 'yes':
            return 'リモート可';
        case 'no':
            return 'リモート不可';
        case 'partial':
            return 'リモート一部可';
        default:
            return '';
    }
}

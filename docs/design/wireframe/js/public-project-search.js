/* ========================================
   公開案件検索画面固有JavaScript
   ======================================== */

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    initSearchForm();
    initDeleteButtons();
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
    const projectList = document.getElementById('project-list');
    if (!projectList) return;
    
    if (results.length === 0) {
        projectList.innerHTML = '<div class="no-results">検索条件に一致する案件が見つかりませんでした。</div>';
        return;
    }
    
    projectList.innerHTML = results.map(project => createProjectCard(project)).join('');
    
    // 削除ボタンのイベントリスナーを再設定
    initDeleteButtons();
}

/**
 * 案件カードのHTMLを生成
 */
function createProjectCard(project) {
    const skillsHtml = project.skills.map(skill => 
        `<span class="skill-tag">${escapeHtml(skill)}</span>`
    ).join('');
    
    const badgeClass = project.isPublic ? 'badge-public' : 'badge-private';
    const badgeText = project.isPublic ? '公開' : '非公開';
    
    const startDate = formatDate(project.startDate);
    const endDate = formatDate(project.endDate);
    const priceRange = project.priceMin && project.priceMax 
        ? `${project.priceMin}万円〜${project.priceMax}万円`
        : project.priceMin 
            ? `${project.priceMin}万円〜`
            : project.priceMax 
                ? `〜${project.priceMax}万円`
                : '要相談';
    
    const remoteWorkText = getRemoteWorkText(project.remoteWork);
    
    return `
        <div class="project-card">
            <div class="project-card-header">
                <h2 class="project-card-title">
                    <a href="project-register.html" class="project-card-link">${escapeHtml(project.name)}</a>
                </h2>
                <div class="project-card-badge">
                    <span class="badge ${badgeClass}">${badgeText}</span>
                </div>
            </div>
            <div class="project-card-body">
                <p class="project-card-description">${escapeHtml(project.description)}</p>
                <div class="project-card-skills">
                    ${skillsHtml}
                </div>
                <div class="project-card-details">
                    <div class="project-card-detail-item">
                        <span class="detail-label">期間:</span>
                        <span class="detail-value">${startDate} 〜 ${endDate}</span>
                    </div>
                    <div class="project-card-detail-item">
                        <span class="detail-label">単価:</span>
                        <span class="detail-value">${priceRange}</span>
                    </div>
                    <div class="project-card-detail-item">
                        <span class="detail-label">契約形態:</span>
                        <span class="detail-value">${escapeHtml(project.contractType)}</span>
                    </div>
                    <div class="project-card-detail-item">
                        <span class="detail-label">勤務地:</span>
                        <span class="detail-value">${escapeHtml(project.workLocation)}${remoteWorkText ? `（${remoteWorkText}）` : ''}</span>
                    </div>
                </div>
            </div>
            <div class="project-card-footer">
                <div class="project-card-actions">
                    <a href="public-project-detail.html" class="btn btn-secondary btn-sm">詳細を見る</a>
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
 * 削除ボタンの初期化
 */
function initDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.project-delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.dataset.projectId;
            const projectName = this.closest('.project-card').querySelector('.project-card-title a').textContent;
            
            if (confirm(`「${projectName}」を削除しますか？`)) {
                // TODO: 実際のAPI呼び出しに置き換える
                console.log('案件削除:', projectId);
                alert('案件を削除しました。');
                // 検索結果を再表示
                performSearch();
            }
        });
    });
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
            name: 'フルスタックエンジニア募集',
            description: 'Webアプリケーション開発のフルスタックエンジニアを募集しています。Java、Spring Boot、Reactを使用した開発経験がある方を希望します。',
            skills: ['Java', 'Spring Boot', 'React', 'PostgreSQL'],
            startDate: '2024-12-01',
            endDate: '2025-03-31',
            priceMin: 60,
            priceMax: 80,
            contractType: '契約社員',
            workLocation: '東京都千代田区',
            remoteWork: 'yes',
            isPublic: true
        },
        {
            id: 2,
            name: 'バックエンドエンジニア募集',
            description: 'Python、Djangoを使用したバックエンド開発のエンジニアを募集しています。PostgreSQL、AWSの経験がある方を希望します。',
            skills: ['Python', 'Django', 'PostgreSQL', 'AWS'],
            startDate: '2024-11-20',
            endDate: '2025-02-28',
            priceMin: 55,
            priceMax: 70,
            contractType: '正社員',
            workLocation: '東京都港区',
            remoteWork: 'partial',
            isPublic: false
        },
        {
            id: 3,
            name: 'フロントエンドエンジニア募集',
            description: 'TypeScript、React、Next.jsを使用したフロントエンド開発のエンジニアを募集しています。',
            skills: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS'],
            startDate: '2025-01-01',
            endDate: '2025-06-30',
            priceMin: 50,
            priceMax: 65,
            contractType: 'フリーランス',
            workLocation: '',
            remoteWork: 'yes',
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
    if (!dateString) return '';
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


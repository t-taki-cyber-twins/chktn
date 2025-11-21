/* ========================================
   おすすめエンジニア検索画面固有JavaScript
   ======================================== */

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    initSearchForm();
    initSortForm();
    // 初期表示時にモックデータを表示
    const results = getMockSearchResults();
    displaySearchResults(results);
    updateResultsCount(results.length);
    
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
    const results = getMockSearchResults();
    displaySearchResults(results);
    updateResultsCount(results.length);
}

/**
 * 検索フォームをリセット
 */
function resetSearchForm() {
    const form = document.getElementById('search-form');
    if (form) {
        form.reset();
        // すべての検索結果を表示
        const results = getMockSearchResults();
        displaySearchResults(results);
        updateResultsCount(results.length);
    }
}

/**
 * 検索結果を表示
 */
function displaySearchResults(results) {
    const matchingList = document.getElementById('matching-list');
    if (!matchingList) return;
    
    // 現在の検索結果を保持
    currentResults = results;
    
    if (results.length === 0) {
        matchingList.innerHTML = '<div class="no-results">検索条件に一致するマッチングが見つかりませんでした。</div>';
        return;
    }
    
    matchingList.innerHTML = results.map(matching => createMatchingCard(matching)).join('');
    
    // 面談申込ボタンと問い合わせボタンのイベントリスナーを再設定
    initMatchingApplyButtons();
    initMatchingInquiryButtons();
}

/**
 * 並び順フォームの初期化
 */
function initSortForm() {
    const sortSelect = document.getElementById('sort-order');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            sortResults(sortValue);
        });
    }
}

// 現在表示中の検索結果を保持
let currentResults = [];

/**
 * 検索結果を並び替え
 */
function sortResults(sortValue) {
    if (currentResults.length === 0) {
        currentResults = getMockSearchResults();
    }
    
    // 並び替え
    const sortedResults = [...currentResults].sort((a, b) => {
        switch (sortValue) {
            case 'score-desc':
                return b.score - a.score;
            case 'score-asc':
                return a.score - b.score;
            case 'engineer-name-asc':
                return a.engineer.name.localeCompare(b.engineer.name, 'ja');
            case 'engineer-name-desc':
                return b.engineer.name.localeCompare(a.engineer.name, 'ja');
            case 'engineer-start-date-asc':
                // 案件終了予定日などを基準にする場合のロジック（仮）
                 return 0; // 実装時は適切な日付比較を行う
            case 'engineer-start-date-desc':
                 return 0; // 実装時は適切な日付比較を行う
            default:
                return 0;
        }
    });
    
    // 並び替えた結果を表示
    displaySearchResults(sortedResults);
}

/**
 * マッチングカードのHTMLを生成
 */
function createMatchingCard(matching) {
    const projectSkillsHtml = matching.project.skills.map(skill => 
        `<span class="skill-tag">${escapeHtml(skill)}</span>`
    ).join('');
    
    const engineerSkillsHtml = matching.engineer.skills.map(skill => 
        `<span class="skill-tag">${escapeHtml(skill)}</span>`
    ).join('');
    
    const scoreClass = getScoreClass(matching.score);
    
    const projectWorkLocation = matching.project.workLocation || '';
    const projectStartDate = matching.project.startDate ? formatDate(matching.project.startDate) : '';
    const engineerNearestStation = matching.engineer.nearestStation || '';
    const engineerWorkStatus = matching.engineer.workStatus || '待機中';
    const engineerProjectEndDate = matching.engineer.projectEndDate ? formatDate(matching.engineer.projectEndDate) : '';
    const matchingReason = matching.reason || '';
    
    const projectDetailsHtml = `
        <div class="matching-card-details">
            ${projectWorkLocation ? `<div class="matching-card-detail-item">
                <span class="detail-label">勤務地:</span>
                <span class="detail-value">${escapeHtml(projectWorkLocation)}</span>
            </div>` : ''}
            ${projectStartDate ? `<div class="matching-card-detail-item">
                <span class="detail-label">開始日:</span>
                <span class="detail-value">${projectStartDate}</span>
            </div>` : ''}
        </div>
    `;
    
    const engineerWorkStatusText = engineerWorkStatus === '待機中' 
        ? '待機中'
        : `案件終了予定日: ${engineerProjectEndDate}`;
    
    const engineerDetailsHtml = `
        <div class="matching-card-details">
            ${engineerNearestStation ? `<div class="matching-card-detail-item">
                <span class="detail-label">最寄駅:</span>
                <span class="detail-value">${escapeHtml(engineerNearestStation)}</span>
            </div>` : ''}
            <div class="matching-card-detail-item">
                <span class="detail-label">勤務状況:</span>
                <span class="detail-value">${escapeHtml(engineerWorkStatusText)}</span>
            </div>
        </div>
    `;
    
    const matchingReasonHtml = matchingReason ? `
        <div class="matching-reason">
            <span class="matching-reason-label">おすすめ理由:</span>
            <span class="matching-reason-text">${escapeHtml(matchingReason)}</span>
        </div>
    ` : '';
    
    return `
        <div class="matching-card">
            <div class="matching-card-header">
                <div class="matching-score-section">
                    <div class="matching-score">
                        <span class="matching-score-label">マッチングスコア</span>
                        <span class="matching-score-value ${scoreClass}">${matching.score}%</span>
                    </div>
                    ${matchingReasonHtml}
                </div>
            </div>
            <div class="matching-card-body">
                <div class="matching-card-section">
                    <div class="matching-card-section-title">エンジニア情報</div>
                    <div class="matching-card-item">
                        <h3 class="matching-card-item-title">
                            <a href="public-engineer-detail.html" class="matching-card-link">${escapeHtml(matching.engineer.name)}</a>
                        </h3>
                        <div class="matching-card-skills">
                            ${engineerSkillsHtml}
                        </div>
                        ${engineerDetailsHtml}
                    </div>
                </div>
                <div class="matching-card-section">
                    <div class="matching-card-section-title">案件情報</div>
                    <div class="matching-card-item">
                        <h3 class="matching-card-item-title">
                            <a href="public-project-detail.html" class="matching-card-link">${escapeHtml(matching.project.name)}</a>
                        </h3>
                        <div class="matching-card-skills">
                            ${projectSkillsHtml}
                        </div>
                        ${projectDetailsHtml}
                    </div>
                </div>
            </div>
            <div class="matching-card-footer">
                <div class="matching-card-actions">
                    <button type="button" class="btn btn-primary btn-sm matching-apply-btn" data-matching-id="${matching.id}">面談申込</button>
                    <button type="button" class="btn btn-secondary btn-sm matching-inquiry-btn" data-matching-id="${matching.id}">問い合わせ</button>
                    <a href="public-engineer-detail.html" class="btn btn-secondary btn-sm">詳細</a>
                </div>
            </div>
        </div>
    `;
}

/**
 * マッチングスコアに応じたクラスを取得
 */
function getScoreClass(score) {
    if (score >= 80) {
        return 'matching-score-high';
    } else if (score >= 60) {
        return 'matching-score-medium';
    } else {
        return 'matching-score-low';
    }
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
 * 面談申込ボタンの初期化
 */
function initMatchingApplyButtons() {
    const applyButtons = document.querySelectorAll('.matching-apply-btn');
    applyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const matchingId = this.dataset.matchingId;
            const matchingCard = this.closest('.matching-card');
            const engineerName = matchingCard.querySelector('.matching-card-section:first-child .matching-card-link').textContent;
            const projectName = matchingCard.querySelector('.matching-card-section:last-child .matching-card-link').textContent;
            
            if (confirm(`「${engineerName}」と「${projectName}」の面談を申し込みますか？`)) {
                // TODO: 実際のAPI呼び出しに置き換える
                console.log('面談申込:', matchingId);
                alert('面談を申し込みました。');
            }
        });
    });
}

/**
 * 問い合わせボタンの初期化
 */
function initMatchingInquiryButtons() {
    const inquiryButtons = document.querySelectorAll('.matching-inquiry-btn');
    inquiryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const matchingId = this.dataset.matchingId;
            const matchingCard = this.closest('.matching-card');
            const engineerName = matchingCard.querySelector('.matching-card-section:first-child .matching-card-link').textContent;
            const projectName = matchingCard.querySelector('.matching-card-section:last-child .matching-card-link').textContent;
            
            // TODO: 実際のAPI呼び出しに置き換える
            // 問い合わせ画面への遷移またはモーダル表示
            console.log('問い合わせ:', matchingId, engineerName, projectName);
            alert(`「${engineerName}」と「${projectName}」について問い合わせますか？\n（問い合わせ画面への遷移は実装予定です）`);
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
            score: 85,
            reason: 'エンジニアのスキル（Java、Spring Boot、React、PostgreSQL）が案件の要件と完全に一致しており、さらにAWSの経験もあるため、即戦力として活躍できる可能性が高いです。',
            project: {
                id: 1,
                name: 'フルスタックエンジニア募集',
                skills: ['Java', 'Spring Boot', 'React', 'PostgreSQL'],
                workLocation: '東京都千代田区',
                startDate: '2024-12-01'
            },
            engineer: {
                id: 1,
                name: '山田太郎',
                skills: ['Java', 'Spring Boot', 'React', 'PostgreSQL', 'AWS'],
                nearestStation: '東京駅',
                workStatus: '待機中',
                projectEndDate: null
            }
        },
        {
            id: 2,
            score: 72,
            reason: 'Python、Django、PostgreSQLのスキルが一致していますが、AWSの経験が不足しているため、学習期間が必要になる可能性があります。',
            project: {
                id: 2,
                name: 'バックエンドエンジニア募集',
                skills: ['Python', 'Django', 'PostgreSQL', 'AWS'],
                workLocation: '東京都港区',
                startDate: '2024-11-20'
            },
            engineer: {
                id: 2,
                name: '佐藤花子',
                skills: ['Python', 'Django', 'PostgreSQL'],
                nearestStation: '新橋駅',
                workStatus: '案件進行中',
                projectEndDate: '2024-12-31'
            }
        },
        {
            id: 3,
            score: 58,
            reason: 'Reactの経験はありますが、TypeScriptやNext.jsの経験が不足しており、学習コストがかかる可能性があります。',
            project: {
                id: 3,
                name: 'フロントエンドエンジニア募集',
                skills: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS'],
                workLocation: 'リモートワーク可',
                startDate: '2025-01-01'
            },
            engineer: {
                id: 3,
                name: '鈴木一郎',
                skills: ['JavaScript', 'React', 'Vue.js'],
                nearestStation: '渋谷駅',
                workStatus: '案件進行中',
                projectEndDate: '2025-03-31'
            }
        },
        {
            id: 4,
            score: 92,
            reason: 'エンジニアのスキル（AWS、Docker、Kubernetes、Terraform）が案件の要件と完全に一致しており、さらにCI/CDの経験もあるため、非常に高いマッチング度です。',
            project: {
                id: 4,
                name: 'DevOpsエンジニア募集',
                skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
                workLocation: '東京都新宿区',
                startDate: '2024-12-15'
            },
            engineer: {
                id: 4,
                name: '田中次郎',
                skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
                nearestStation: '新宿駅',
                workStatus: '待機中',
                projectEndDate: null
            }
        },
        {
            id: 5,
            score: 65,
            reason: 'SwiftとiOSの経験はありますが、SwiftUIやCore Dataの経験が不足しており、学習が必要になる可能性があります。',
            project: {
                id: 5,
                name: 'モバイルアプリ開発',
                skills: ['Swift', 'iOS', 'SwiftUI', 'Core Data'],
                workLocation: '東京都渋谷区',
                startDate: '2025-02-01'
            },
            engineer: {
                id: 5,
                name: '高橋三郎',
                skills: ['Swift', 'iOS', 'Objective-C'],
                nearestStation: '表参道駅',
                workStatus: '待機中',
                projectEndDate: null
            }
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

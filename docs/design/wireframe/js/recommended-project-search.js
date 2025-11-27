/* ========================================
   おすすめ案件検索画面固有JavaScript
   ======================================== */

import { mockProjects, mockEngineers } from './mock-data.js';

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    initSearchForm();
    initSortForm();
    initPagination();
    
    // 初期表示のために検索を実行
    performSearch();
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
            case 'project-name-asc':
                return a.project.name.localeCompare(b.project.name, 'ja');
            case 'project-name-desc':
                return b.project.name.localeCompare(a.project.name, 'ja');
            case 'project-start-date-asc':
                return new Date(a.project.startDate) - new Date(b.project.startDate);
            case 'project-start-date-desc':
                return new Date(b.project.startDate) - new Date(a.project.startDate);
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
    // mockProjectsにはskillsがないため、仮の値を設定
    const projectSkills = matching.project.skills ? matching.project.skills.split(', ') : ['Java', 'Spring Boot'];
    const engineerSkills = matching.engineer.skills ? matching.engineer.skills.split(', ') : ['Java', 'Spring Boot', 'AWS'];

    const projectSkillsHtml = projectSkills.map(skill => 
        `<span class="skill-tag">${escapeHtml(skill)}</span>`
    ).join('');
    
    const engineerSkillsHtml = engineerSkills.map(skill => 
        `<span class="skill-tag">${escapeHtml(skill)}</span>`
    ).join('');
    
    const scoreClass = getScoreClass(matching.score);
    
    const projectWorkLocation = matching.project.workLocation || '東京都'; // 仮の値
    const projectStartDate = matching.project.startDate ? formatDate(matching.project.startDate) : '';
    const engineerNearestStation = matching.engineer.nearestStation || '東京駅'; // 仮の値
    const engineerWorkStatus = matching.engineer.statusLabel || '待機中';
    const engineerProjectEndDate = matching.engineer.availableDate ? formatDate(matching.engineer.availableDate) : '';
    const matchingReason = matching.reason || 'スキルマッチ度が高いです。';
    
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
    
    const engineerWorkStatusText = engineerWorkStatus === '待機中' || engineerWorkStatus === '即日可能'
        ? engineerWorkStatus
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
                    <div class="matching-card-section-title">案件情報</div>
                    <div class="matching-card-item">
                        <h3 class="matching-card-item-title">
                            <a href="project-register.html" class="matching-card-link">${escapeHtml(matching.project.name)}</a>
                        </h3>
                        <div class="matching-card-skills">
                            ${projectSkillsHtml}
                        </div>
                        ${projectDetailsHtml}
                    </div>
                </div>
                <div class="matching-card-section">
                    <div class="matching-card-section-title">エンジニア情報</div>
                    <div class="matching-card-item">
                        <h3 class="matching-card-item-title">
                            <a href="#" class="matching-card-link">${escapeHtml(matching.engineer.name)}</a>
                        </h3>
                        <div class="matching-card-skills">
                            ${engineerSkillsHtml}
                        </div>
                        ${engineerDetailsHtml}
                    </div>
                </div>
            </div>
            <div class="matching-card-footer">
                <div class="matching-card-actions">
                    <a href="public-project-detail.html?projectId=${matching.project.id}&engineerId=${matching.engineer.id}#project-detail-form" class="btn btn-success btn-sm">面談申込</a>
                    <a href="public-project-detail.html?projectId=${matching.project.id}#inquiry-message-list-section" class="btn btn-warning btn-sm">問い合わせ</a>
                    <a href="public-project-detail.html?projectId=${matching.project.id}#project-detail-form" class="btn btn-info btn-sm">詳細</a>
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
 * ページネーションの初期化
 */
function initPagination() {
    // app-paginationコンポーネントを使用するため、ここでは特別な処理は不要
}

/**
 * モック検索結果データを取得
 */
function getMockSearchResults() {
    // mockProjectsとmockEngineersを組み合わせてマッチングデータを生成
    const results = [];
    const projectCount = mockProjects.length;
    const engineerCount = mockEngineers.length;
    
    // 簡易的に5件のマッチングデータを生成
    for (let i = 0; i < 5; i++) {
        const project = mockProjects[i % projectCount];
        const engineer = mockEngineers[i % engineerCount];
        
        // ランダムなスコアを生成 (50-100)
        const score = Math.floor(Math.random() * 51) + 50;
        
        results.push({
            id: i + 1,
            score: score,
            reason: 'スキルマッチ度が高いです。', // 簡易的な理由
            project: project,
            engineer: engineer
        });
    }
    
    return results.sort((a, b) => b.score - a.score);
}

/**
 * HTMLエスケープ
 */
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 日付をフォーマット
 */
function formatDate(dateString) {
    if (!dateString) return '';
    // YYYY/MM/DD 形式を YYYY年MM月DD日 に変換
    return dateString.replace(/-/g, '年').replace(/(\d{2})$/, '月$1日').replace(/(\d{4})年(\d{2})月(\d{2})日/, '$1年$2月$3日').replace(/\//g, '年').replace(/(\d{2})$/, '月$1日').replace(/(\d{4})年(\d{2})月(\d{2})日/, '$1年$2月$3日');
}




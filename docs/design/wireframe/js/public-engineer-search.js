/* ========================================
   公開エンジニア検索画面固有JavaScript
   ======================================== */

import { mockEngineers } from './mock-data.js';

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    initSearchForm();
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
    
    // 検索結果件数を更新
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
    // mockEngineersのskillsは文字列なので配列に変換
    const skills = engineer.skills ? engineer.skills.split(', ') : [];
    const skillsHtml = skills.map(skill => 
        `<span class="skill-tag">${escapeHtml(skill)}</span>`
    ).join('');
    
    const badgeClass = engineer.isPublic ? 'badge-public' : 'badge-private';
    const badgeText = engineer.isPublic ? '公開' : '非公開';
    
    const availableDate = formatDate(engineer.availableDate);
    // mockEngineersのpriceは文字列（例: '80万円'）なのでそのまま表示するか、調整する
    const priceRange = engineer.price || '要相談';
    
    // mockEngineersにはないプロパティのデフォルト値設定
    const remoteWork = engineer.remoteWork || 'yes'; // デフォルト: リモート可
    const remoteWorkText = getRemoteWorkText(remoteWork);
    const description = engineer.description || '経験豊富なエンジニアです。要件定義から実装まで幅広く対応可能です。';
    const contractType = engineer.contractType || '準委任';
    const workLocation = engineer.workLocation || '東京都';
    
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
                <p class="engineer-card-description">${escapeHtml(description)}</p>
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
                        <span class="detail-value">${escapeHtml(priceRange)}</span>
                    </div>
                    <div class="engineer-card-detail-item">
                        <span class="detail-label">希望契約:</span>
                        <span class="detail-value">${escapeHtml(contractType)}</span>
                    </div>
                    <div class="engineer-card-detail-item">
                        <span class="detail-label">希望勤務地:</span>
                        <span class="detail-value">${escapeHtml(workLocation)}${remoteWorkText ? `（${remoteWorkText}）` : ''}</span>
                    </div>
                </div>
            </div>
            <div class="engineer-card-footer">
                <div class="engineer-card-actions">
                    <a href="public-engineer-detail.html?engineerId=${engineer.id}" class="btn btn-info btn-sm">詳細を見る</a>
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
    // app-paginationコンポーネントを使用するため、ここでは特別な処理は不要
}

/**
 * モック検索結果データを取得
 */
function getMockSearchResults() {
    // isPublicがtrueのエンジニアのみをフィルタリング
    return mockEngineers.filter(engineer => engineer.isPublic);
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
    if (!dateString) return '即日可能';
    // YYYY/MM/DD 形式を YYYY年MM月DD日 に変換
    return dateString.replace(/-/g, '年').replace(/(\d{2})$/, '月$1日').replace(/(\d{4})年(\d{2})月(\d{2})日/, '$1年$2月$3日').replace(/\//g, '年').replace(/(\d{2})$/, '月$1日').replace(/(\d{4})年(\d{2})月(\d{2})日/, '$1年$2月$3日');
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




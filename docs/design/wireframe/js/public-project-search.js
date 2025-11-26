/* ========================================
   公開案件検索画面固有JavaScript
   ======================================== */

import { mockProjects } from './mock-data.js';

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    initSearchForm();
    initDeleteButtons();
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
    // スキルタグの生成（mockProjectsにはskillsがない場合があるので考慮）
    // mock-data.jsのmockProjectsにはskillsプロパティがないため、仮のスキルを表示するか、
    // mock-data.jsを更新する必要がありますが、ここでは仮のスキルを表示します。
    // または、mockProjectsにskillsを追加するのがベストですが、今回は既存のmockProjectsを使用します。
    // mockProjectsの構造を確認すると、skillsプロパティはありません。
    // 以前のhardcoded dataにはskillsがありましたが、mockProjectsにはありません。
    // ここでは、mockProjectsに合わせて表示を調整するか、mockProjectsにskillsを追加すべきです。
    // 今回は、mockProjectsにskillsがないため、空配列として扱います。
    const skills = project.skills ? project.skills.split(', ') : ['Java', 'Spring Boot']; // 仮のデフォルト値
    
    const skillsHtml = skills.map(skill => 
        `<span class="skill-tag">${escapeHtml(skill)}</span>`
    ).join('');
    
    const badgeClass = project.isPublic ? 'badge-public' : 'badge-private';
    const badgeText = project.isPublic ? '公開' : '非公開';
    
    const startDate = project.startDate.replace(/-/g, '年').replace(/(\d{2})$/, '月$1日').replace(/(\d{4})年(\d{2})月(\d{2})日/, '$1年$2月$3日'); // 簡易的なフォーマット変換
    const endDate = project.endDate.replace(/-/g, '年').replace(/(\d{2})$/, '月$1日').replace(/(\d{4})年(\d{2})月(\d{2})日/, '$1年$2月$3日');
    
    const priceRange = project.price; // mockProjectsではpriceは文字列 '60〜80万円' など
    
    // mockProjectsにはcontractType, workLocation, remoteWorkがないため、仮の値を表示
    const contractType = '契約社員';
    const workLocation = '東京都';
    const remoteWorkText = 'リモート可';
    
    return `
        <div class="project-card">
            <div class="project-card-header">
                <h2 class="project-card-title">
                    <a href="public-project-detail.html" class="project-card-link">${escapeHtml(project.name)}</a>
                </h2>
                <div class="project-card-badge">
                    <span class="badge ${badgeClass}">${badgeText}</span>
                </div>
            </div>
            <div class="project-card-body">
                <p class="project-card-description">
                    ${escapeHtml(project.endCompany)}の案件です。${escapeHtml(project.manager)}が担当しています。
                </p>
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
                        <span class="detail-value">${escapeHtml(priceRange)}</span>
                    </div>
                    <div class="project-card-detail-item">
                        <span class="detail-label">契約形態:</span>
                        <span class="detail-value">${contractType}</span>
                    </div>
                    <div class="project-card-detail-item">
                        <span class="detail-label">勤務地:</span>
                        <span class="detail-value">${workLocation}（${remoteWorkText}）</span>
                    </div>
                </div>
            </div>
            <div class="project-card-footer">
                <div class="project-card-actions">
                    <a href="public-project-detail.html?projectId=${project.id}#project-detail-form" class="btn btn-info btn-sm">詳細</a>
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
    // 公開案件検索には削除ボタンはないが、念のため残しておく
    const deleteButtons = document.querySelectorAll('.project-delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.dataset.projectId;
            const projectName = this.closest('.project-card').querySelector('.project-card-title a').textContent;
            
            if (confirm(`「${projectName}」を削除しますか？`)) {
                console.log('案件削除:', projectId);
                alert('案件を削除しました。');
                performSearch();
            }
        });
    });
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
    // 公開案件のみをフィルタリング
    console.log('mockProjects:', mockProjects);
    const results = mockProjects.filter(project => project.isPublic);
    console.log('filtered results:', results);
    return results;
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





/* ========================================
   トップ画面固有JavaScript
   ======================================== */

import { mockProjects, mockEngineers, mockMessages, mockAnnouncements } from './mock-data.js';

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    displayAnnouncementBanners();
    displayRecentMessages();
    displayRecommendationMatching();
    displayAnnouncements();
});

/**
 * お知らせバナーを表示
 */
function displayAnnouncementBanners() {
    const bannersContainer = document.getElementById('announcement-banners');
    if (!bannersContainer) return;
    
    // モックデータ: 実際には API から取得
    const banners = [
        {
            id: 'global-001',
            type: 'global',
            title: '【管理者からのお知らせ】',
            message: 'システムメンテナンスのため、2025年12月1日 2:00-4:00の間サービスを停止いたします。ご不便をおかけしますがよろしくお願いいたします。',
            icon: '📢'
        },
        {
            id: 'tenant-001',
            type: 'tenant',
            title: '【社内からのお知らせ】',
            message: '新しいプロジェクトが3件追加されました。エンジニアのアサインをお願いいたします。',
            icon: '📌'
        }
    ];
    
    // 閉じられたバナーの情報を取得
    const closedBanners = getClosedBanners();
    
    // 閉じられていないバナーのみ表示
    const visibleBanners = banners.filter(banner => !closedBanners.includes(banner.id));
    
    if (visibleBanners.length === 0) {
        bannersContainer.innerHTML = '';
        return;
    }
    
    bannersContainer.innerHTML = visibleBanners.map(banner => createBannerHtml(banner)).join('');
    
    // 閉じるボタンのイベントリスナーを追加
    visibleBanners.forEach(banner => {
        const closeButton = document.getElementById(`close-banner-${banner.id}`);
        if (closeButton) {
            closeButton.addEventListener('click', (event) => closeBanner(banner.id, event));
        }
    });
}

/**
 * バナーのHTMLを生成
 */
function createBannerHtml(banner) {
    const bannerClass = banner.type === 'global' ? 'announcement-banner-global' : 'announcement-banner-tenant';
    const tabHash = banner.type === 'global' ? '#global' : '#tenant';
    
    return `
        <a href="announcement.html${tabHash}" class="announcement-banner ${bannerClass}" id="banner-${banner.id}">
            <div class="announcement-banner-content">
                <div class="announcement-banner-icon">${banner.icon}</div>
                <div class="announcement-banner-text">
                    <div class="announcement-banner-title">${escapeHtml(banner.title)}</div>
                    <div class="announcement-banner-message">${escapeHtml(banner.message)}</div>
                </div>
            </div>
            <button class="announcement-banner-close" id="close-banner-${banner.id}" aria-label="閉じる">
                ✕
            </button>
        </a>
    `;
}

/**
 * バナーを閉じる
 */
function closeBanner(bannerId, event) {
    // イベントがある場合は、リンクのデフォルト動作を阻止
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const bannerElement = document.getElementById(`banner-${bannerId}`);
    if (bannerElement) {
        // フェードアウトアニメーション
        bannerElement.style.transition = 'opacity 0.3s, margin 0.3s, padding 0.3s, height 0.3s';
        bannerElement.style.opacity = '0';
        bannerElement.style.marginBottom = '0';
        bannerElement.style.paddingTop = '0';
        bannerElement.style.paddingBottom = '0';
        bannerElement.style.height = '0';
        
        setTimeout(() => {
            bannerElement.remove();
        }, 300);
    }
    
    // LocalStorage に閉じた状態を保存
    saveClosedBanner(bannerId);
}

/**
 * 閉じられたバナーのIDリストを取得
 */
function getClosedBanners() {
    const stored = localStorage.getItem('closedAnnouncementBanners');
    return stored ? JSON.parse(stored) : [];
}

/**
 * バナーを閉じた状態を保存
 */
function saveClosedBanner(bannerId) {
    const closedBanners = getClosedBanners();
    if (!closedBanners.includes(bannerId)) {
        closedBanners.push(bannerId);
        localStorage.setItem('closedAnnouncementBanners', JSON.stringify(closedBanners));
    }
}

/**
 * 最近のメッセージを表示
 */
function displayRecentMessages() {
    const messagesList = document.getElementById('recent-messages-list');
    if (!messagesList) return;
    
    // 最新3件のメッセージを表示
    const recentMessages = mockMessages.slice(0, 3);
    
    if (recentMessages.length === 0) {
        messagesList.innerHTML = '<li class="common-list-item">メッセージがありません。</li>';
        return;
    }
    
    messagesList.innerHTML = recentMessages.map(message => createMessageItem(message)).join('');
}

/**
 * メッセージアイテムのHTMLを生成
 */
function createMessageItem(message) {
    const formattedDate = formatDateTime(message.date);
    
    return `
        <li class="common-list-item">
            <div class="message-header">
                <div class="message-project">案件: ${escapeHtml(message.projectName)}</div>
                <div class="message-date">${formattedDate}</div>
            </div>
            <div class="message-content">${escapeHtml(message.content)}</div>
            <div class="message-from">送信者: ${escapeHtml(message.sender)}</div>
        </li>
    `;
}

/**
 * レコメンドマッチングを表示
 */
function displayRecommendationMatching() {
    const matchingList = document.getElementById('recommendation-matching-list');
    if (!matchingList) return;
    
    // マッチングデータを生成
    const matchingResults = generateMatchingData();
    
    if (matchingResults.length === 0) {
        matchingList.innerHTML = '<div class="no-results">マッチングデータがありません。</div>';
        return;
    }
    
    // 上位3件を表示
    const topMatches = matchingResults.slice(0, 3);
    matchingList.innerHTML = topMatches.map(matching => createMatchingCard(matching)).join('');
}

/**
 * マッチングデータを生成
 */
function generateMatchingData() {
    const results = [];
    const projectCount = mockProjects.length;
    const engineerCount = mockEngineers.length;
    
    // 5件のマッチングデータを生成
    for (let i = 0; i < 5; i++) {
        const project = mockProjects[i % projectCount];
        const engineer = mockEngineers[i % engineerCount];
        
        // マッチングスコアを生成 (50-100)
        const score = Math.floor(Math.random() * 51) + 50;
        
        // スコアに応じたおすすめ理由を生成
        let reason = '';
        if (score >= 90) {
            reason = `案件で必要なスキルをすべて保有しており、即戦力として活躍できる可能性が高いです。`;
        } else if (score >= 80) {
            reason = `主要なスキルが一致しています。`;
        } else {
            reason = `スキルマッチ度が高いです。`;
        }
        
        results.push({
            id: i + 1,
            score: score,
            reason: reason,
            project: project,
            engineer: engineer
        });
    }
    
    // スコア順にソート
    return results.sort((a, b) => b.score - a.score);
}

/**
 * マッチングカードのHTMLを生成
 */
function createMatchingCard(matching) {
    const projectSkills = matching.project.skills ? matching.project.skills.split(', ') : ['Java', 'Spring Boot'];
    const engineerSkills = matching.engineer.skills ? matching.engineer.skills.split(', ') : ['Java', 'Spring Boot', 'AWS'];
    
    const projectSkillsHtml = projectSkills.map(skill => 
        `<span class="skill-tag">${escapeHtml(skill)}</span>`
    ).join('');
    
    const engineerSkillsHtml = engineerSkills.map(skill => 
        `<span class="skill-tag">${escapeHtml(skill)}</span>`
    ).join('');
    
    const scoreClass = getScoreClass(matching.score);
    
    const projectWorkLocation = matching.project.workLocation || '東京都';
    const projectStartDate = matching.project.startDate ? formatDate(matching.project.startDate) : '';
    const engineerNearestStation = matching.engineer.nearestStation || '東京駅';
    const engineerWorkStatus = matching.engineer.statusLabel || '待機中';
    
    return `
        <div class="matching-card">
            <div class="matching-card-header">
                <div class="matching-score-section">
                    <div class="matching-score">
                        <span class="matching-score-label">マッチングスコア</span>
                        <span class="matching-score-value ${scoreClass}">${matching.score}%</span>
                    </div>
                    <div class="matching-reason">
                        <span class="matching-reason-label">おすすめ理由:</span>
                        <span class="matching-reason-text">${escapeHtml(matching.reason)}</span>
                    </div>
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
                    </div>
                </div>
                <div class="matching-card-section">
                    <div class="matching-card-section-title">エンジニア情報</div>
                    <div class="matching-card-item">
                        <h3 class="matching-card-item-title">
                            <a href="public-engineer-detail.html" class="matching-card-link">${escapeHtml(matching.engineer.name)}</a>
                        </h3>
                        <div class="matching-card-skills">
                            ${engineerSkillsHtml}
                        </div>
                        <div class="matching-card-details">
                            ${engineerNearestStation ? `<div class="matching-card-detail-item">
                                <span class="detail-label">最寄駅:</span>
                                <span class="detail-value">${escapeHtml(engineerNearestStation)}</span>
                            </div>` : ''}
                            <div class="matching-card-detail-item">
                                <span class="detail-label">勤務状況:</span>
                                <span class="detail-value">${escapeHtml(engineerWorkStatus)}</span>
                            </div>
                        </div>
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
 * お知らせを表示
 */
function displayAnnouncements() {
    const announcementsList = document.getElementById('announcements-list');
    if (!announcementsList) return;
    
    // 最新3件のお知らせを表示
    const recentAnnouncements = mockAnnouncements.slice(0, 3);
    
    if (recentAnnouncements.length === 0) {
        announcementsList.innerHTML = '<li class="common-list-item">お知らせがありません。</li>';
        return;
    }
    
    announcementsList.innerHTML = recentAnnouncements.map(announcement => createAnnouncementItem(announcement)).join('');
}

/**
 * お知らせアイテムのHTMLを生成
 */
function createAnnouncementItem(announcement) {
    const formattedDate = formatDate(announcement.date);
    
    return `
        <li class="common-list-item">
            <div class="announcement-date">${formattedDate}</div>
            <div class="announcement-title">${escapeHtml(announcement.title)}</div>
        </li>
    `;
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
 * 日付をフォーマット (YYYY/MM/DD -> YYYY年MM月DD日)
 */
function formatDate(dateString) {
    if (!dateString) return '';
    // YYYY/MM/DD or YYYY-MM-DD 形式を YYYY年MM月DD日 に変換
    return dateString
        .replace(/\//g, '-')
        .replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$1年$2月$3日');
}

/**
 * 日時をフォーマット (ISO8601 -> YYYY年MM月DD日 HH:MM)
 */
function formatDateTime(dateTimeString) {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
}

/* ========================================
   お知らせ画面固有JavaScript
   ======================================== */

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    loadAnnouncements();
    
    // URLハッシュがあれば対応するタブを表示
    if (window.location.hash) {
        const tabName = window.location.hash.substring(1);
        if (tabName === 'global' || tabName === 'tenant') {
            switchTab(tabName);
        }
    }
});

/**
 * タブ初期化
 */
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

/**
 * タブ切り替え
 */
function switchTab(tabName) {
    // すべてのタブボタンとコンテンツから active クラスを削除
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 選択されたタブのボタンとコンテンツに active クラスを追加
    const selectedButton = document.querySelector(`.tab-button[data-tab="${tabName}"]`);
    const selectedContent = document.getElementById(`tab-${tabName}`);
    
    if (selectedButton && selectedContent) {
        selectedButton.classList.add('active');
        selectedContent.classList.add('active');
    }
    
    // URLハッシュを更新
    window.location.hash = tabName;
}

/**
 * お知らせデータを読み込んで表示
 */
function loadAnnouncements() {
    // モックデータ: 実際には API から取得
    const globalAnnouncements = [
        {
            id: 1,
            type: 'global',
            category: 'maintenance',
            categoryLabel: 'メンテナンス',
            title: 'システムメンテナンスのお知らせ',
            content: '2025年12月1日 2:00-4:00の間、システムメンテナンスのためサービスを停止いたします。ご不便をおかけしますがよろしくお願いいたします。',
            date: '2024-11-15',
            publishedAt: '2024-11-15'
        },
        {
            id: 2,
            type: 'global',
            category: 'feature',
            categoryLabel: '新機能',
            title: '新機能「レコメンドマッチング」が追加されました',
            content: 'エンジニアと案件を自動的にマッチングする新機能「レコメンドマッチング」がリリースされました。ダッシュボードからご確認ください。',
            date: '2024-11-10',
            publishedAt: '2024-11-10'
        },
        {
            id: 4,
            type: 'global',
            category: 'important',
            categoryLabel: '重要なお知らせ',
            title: '年末年始の営業日について',
            content: '年末年始の営業日をお知らせいたします。12月29日(金)～1月5日(金)は休業とさせていただきます。',
            date: '2024-11-18',
            publishedAt: '2024-11-18'
        }
    ];
    
    const tenantAnnouncements = [
        {
            id: 101,
            type: 'tenant',
            category: 'important',
            categoryLabel: '重要',
            title: '新しいプロジェクトが3件追加されました',
            content: 'エンジニアのアサインをお願いいたします。詳細はプロジェクト一覧画面からご確認ください。',
            date: '2024-11-20',
            publishedAt: '2024-11-20'
        },
        {
            id: 102,
            type: 'tenant',
            category: 'improvement',
            categoryLabel: '改善',
            title: 'エンジニア管理機能の改善について',
            content: 'エンジニアの検索機能と詳細画面が改善されました。より使いやすくなりましたのでご活用ください。',
            date: '2024-11-18',
            publishedAt: '2024-11-18'
        }
    ];
    
    displayAnnouncements('global-announcements-list', globalAnnouncements);
    displayAnnouncements('tenant-announcements-list', tenantAnnouncements);
}

/**
 * お知らせを表示
 */
function displayAnnouncements(containerId, announcements) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (announcements.length === 0) {
        container.innerHTML = `
            <div class="no-announcements">
                <div class="no-announcements-icon">📢</div>
                <div class="no-announcements-text">現在お知らせはありません</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = announcements.map(announcement => createAnnouncementCard(announcement)).join('');
}

/**
 * お知らせカードのHTMLを生成
 */
function createAnnouncementCard(announcement) {
    const categoryClass = `category-${announcement.category}`;
    const formattedDate = formatDate(announcement.date);
    
    return `
        <div class="announcement-card" data-announcement-id="${announcement.id}">
            <div class="announcement-card-header">
                <span class="announcement-card-category ${categoryClass}">${escapeHtml(announcement.categoryLabel)}</span>
                <span class="announcement-card-date">${formattedDate}</span>
            </div>
            <h3 class="announcement-card-title">${escapeHtml(announcement.title)}</h3>
            <div class="announcement-card-content">${escapeHtml(announcement.content)}</div>
        </div>
    `;
}

/**
 * 日付をフォーマット (YYYY-MM-DD -> YYYY年MM月DD日)
 */
function formatDate(dateString) {
    if (!dateString) return '';
    return dateString.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$1年$2月$3日');
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

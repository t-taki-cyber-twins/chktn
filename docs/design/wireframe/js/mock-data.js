/**
 * Mock Data for Wireframes
 */

export const mockEngineers = [
    {
        id: 1,
        name: '山田 太郎',
        representatives: ['鈴木一郎', '田中太郎'],
        company: 'テック株式会社',
        skills: 'Java, Spring Boot, AWS',
        experience: '5年',
        price: '80万円',
        status: 'available', // available, working, leaving
        statusLabel: '即日可能',
        availableDate: '2024/12/01',
        isPublic: true
    },
    {
        id: 2,
        name: '鈴木 一郎',
        representatives: ['田中太郎'],
        company: 'システム株式会社',
        skills: 'React, TypeScript, Node.js',
        experience: '3年',
        price: '70万円',
        status: 'working',
        statusLabel: '稼働中',
        availableDate: '2025/04/01',
        isPublic: false
    },
    {
        id: 3,
        name: '田中 花子',
        representatives: ['高橋次郎', '鈴木一郎'],
        company: 'システム株式会社',
        skills: 'Python, Django, Machine Learning',
        experience: '4年',
        price: '75万円',
        status: 'leaving',
        statusLabel: '離任予定',
        availableDate: '2025/01/15',
        isPublic: true
    }
];

export const mockProjects = [
    {
        id: 1,
        name: 'フルスタックエンジニア募集',
        endCompany: 'サンプル株式会社',
        startDate: '2024/12/01',
        endDate: '2025/03/31',
        price: '60〜80万円',
        status: 'recruiting', // recruiting, interviewing, confirmed, completed
        statusLabel: '募集中',
        manager: '山田太郎',
        isPublic: true
    },
    {
        id: 2,
        name: 'バックエンドエンジニア募集',
        endCompany: 'テック株式会社',
        startDate: '2024/11/20',
        endDate: '2025/02/28',
        price: '55〜70万円',
        status: 'interviewing',
        statusLabel: '面談中',
        manager: '佐藤花子',
        isPublic: false
    },
    {
        id: 3,
        name: 'フロントエンドエンジニア募集',
        endCompany: 'デザイン株式会社',
        startDate: '2025/01/01',
        endDate: '2025/06/30',
        price: '50〜65万円',
        status: 'confirmed',
        statusLabel: '確定',
        manager: '鈴木一郎',
        isPublic: true
    }
];

export const mockEngineerMeetings = [
    {
        id: 1,
        engineerName: '田中太郎',
        engineerRepresentative: '鈴木一郎',
        projectName: 'フルスタックエンジニア募集',
        isOwnProject: true,
        projectCompany: 'サンプル株式会社',
        projectManager: '山田太郎',
        status: 'pending',
        statusLabel: '面談予定',
        meetingDate: '2024/12/15 14:00'
    },
    {
        id: 2,
        engineerName: '佐藤次郎',
        engineerRepresentative: '高橋次郎',
        projectName: 'フルスタックエンジニア募集',
        isOwnProject: true,
        projectCompany: 'サンプル株式会社',
        projectManager: '山田太郎',
        status: 'pending',
        statusLabel: '面談予定',
        meetingDate: '2024/12/16 10:00'
    },
    {
        id: 3,
        engineerName: '佐藤次郎',
        engineerRepresentative: '高橋次郎',
        projectName: 'バックエンドエンジニア募集',
        isOwnProject: false,
        projectCompany: 'テック株式会社',
        projectManager: '佐藤花子',
        status: 'completed',
        statusLabel: '面談完了',
        meetingDate: '2024/12/10 10:00'
    },
    {
        id: 4,
        engineerName: '鈴木花子',
        engineerRepresentative: '鈴木一郎',
        projectName: 'フロントエンドエンジニア募集',
        isOwnProject: false,
        projectCompany: 'デザイン株式会社',
        projectManager: '鈴木一郎',
        status: 'cancelled',
        statusLabel: 'キャンセル',
        meetingDate: '2024/12/08 15:00'
    }
];

export const mockProjectMeetings = [
    {
        id: 1,
        projectName: 'フルスタックエンジニア募集',
        projectCompany: 'サンプル株式会社',
        projectManager: '山田太郎',
        engineerCompany: 'テック株式会社',
        engineerName: '田中太郎',
        status: 'pending',
        statusLabel: '面談予定',
        meetingDate: '2024/12/15 14:00'
    },
    {
        id: 2,
        projectName: 'フルスタックエンジニア募集',
        projectCompany: 'サンプル株式会社',
        projectManager: '山田太郎',
        engineerCompany: 'システム株式会社',
        engineerName: '佐藤次郎',
        status: 'pending',
        statusLabel: '面談予定',
        meetingDate: '2024/12/16 10:00'
    },
    {
        id: 3,
        projectName: 'バックエンドエンジニア募集',
        projectCompany: 'テック株式会社',
        projectManager: '佐藤花子',
        engineerCompany: 'システム株式会社',
        engineerName: '佐藤次郎',
        status: 'completed',
        statusLabel: '面談完了',
        meetingDate: '2024/12/10 10:00'
    },
    {
        id: 4,
        projectName: 'フロントエンドエンジニア募集',
        projectCompany: 'デザイン株式会社',
        projectManager: '鈴木一郎',
        engineerCompany: 'ウェブ株式会社',
        engineerName: '鈴木花子',
        status: 'cancelled',
        statusLabel: 'キャンセル',
        meetingDate: '2024/12/08 15:00'
    }
];

export const mockEmployees = [
    {
        id: 1,
        name: '山田 太郎',
        email: 'yamada@example.com',
        department: '開発部',
        isEngineer: true,
        isPM: false,
        isTechManager: false,
        status: 'active',
        statusLabel: '在籍中',
        joinedDate: '2020/04/01'
    },
    {
        id: 2,
        name: '鈴木 一郎',
        email: 'suzuki@example.com',
        department: '営業部',
        isEngineer: false,
        isPM: true,
        isTechManager: false,
        status: 'active',
        statusLabel: '在籍中',
        joinedDate: '2019/07/15'
    },
    {
        id: 3,
        name: '田中 花子',
        email: 'tanaka@example.com',
        department: '開発部',
        isEngineer: true,
        isPM: false,
        isTechManager: true,
        status: 'active',
        statusLabel: '在籍中',
        joinedDate: '2018/10/01'
    },
    {
        id: 4,
        name: '佐藤 次郎',
        email: 'sato@example.com',
        department: '総務部',
        isEngineer: false,
        isPM: false,
        isTechManager: false,
        status: 'suspended',
        statusLabel: '休職中',
        joinedDate: '2021/01/10'
    }
];

export const mockAccounts = [
    {
        id: 1,
        email: 'admin@example.com',
        employeeName: '山田 太郎',
        companyName: 'サンプル株式会社',
        roleGroup: 'admin',
        roleGroupLabel: '管理者',
        status: 'active',
        statusLabel: '有効',
        lastLogin: '2025/11/20 09:30'
    },
    {
        id: 2,
        email: 'suzuki@example.com',
        employeeName: '鈴木 一郎',
        companyName: 'サンプル株式会社',
        roleGroup: 'engineer-manager',
        roleGroupLabel: 'エンジニア管理者',
        status: 'active',
        statusLabel: '有効',
        lastLogin: '2025/11/19 15:22'
    },
    {
        id: 3,
        email: 'tanaka@example.com',
        employeeName: '田中 花子',
        companyName: 'サンプル株式会社',
        roleGroup: 'back-office',
        roleGroupLabel: 'バックオフィス',
        status: 'active',
        statusLabel: '有効',
        lastLogin: '2025/11/18 11:45'
    },
    {
        id: 4,
        email: 'sato@example.com',
        employeeName: '佐藤 次郎',
        companyName: 'サンプル株式会社',
        roleGroup: 'viewer',
        roleGroupLabel: '閲覧者',
        status: 'inactive',
        statusLabel: '無効',
        lastLogin: '2025/10/15 14:20'
    }
];

export const mockMessages = [
    {
        id: 1,
        projectName: 'フルスタックエンジニア募集',
        content: '面談の日程調整についてご相談があります。',
        sender: '株式会社サンプル',
        date: '2024-11-15T14:30:00',
        isRead: false
    },
    {
        id: 2,
        projectName: 'バックエンドエンジニア募集',
        content: 'エンジニアのスキルシートを確認させていただきました。',
        sender: '株式会社テック',
        date: '2024-11-14T10:15:00',
        isRead: false
    },
    {
        id: 3,
        projectName: 'フロントエンドエンジニア募集',
        content: '面談の結果についてご連絡いたします。',
        sender: '株式会社デザイン',
        date: '2024-11-13T16:45:00',
        isRead: true
    }
];

export const mockAnnouncements = [
    {
        id: 1,
        title: 'システムメンテナンスのお知らせ',
        date: '2024-11-15',
        category: 'maintenance'
    },
    {
        id: 2,
        title: '新機能「レコメンドマッチング」が追加されました',
        date: '2024-11-10',
        category: 'feature'
    },
    {
        id: 3,
        title: 'エンジニア管理機能の改善について',
        date: '2024-11-05',
        category: 'improvement'
    }
];

// マスタデータ
export const mockCompanies = [
    { id: 1, name: 'サンプル株式会社' },
    { id: 2, name: 'テック株式会社' },
    { id: 3, name: 'システム株式会社' },
    { id: 4, name: 'デザイン株式会社' },
    { id: 5, name: 'ウェブ株式会社' }
];

export const mockDepartments = [
    { id: 1, name: '開発部' },
    { id: 2, name: '営業部' },
    { id: 3, name: '技術部' },
    { id: 4, name: '総務部' },
    { id: 5, name: '人事部' },
    { id: 6, name: '経理部' }
];

export const mockPositions = [
    { id: 1, name: 'マネージャー' },
    { id: 2, name: 'シニアエンジニア' },
    { id: 3, name: 'エンジニア' },
    { id: 4, name: 'ジュニアエンジニア' },
    { id: 5, name: 'リーダー' },
    { id: 6, name: '主任' },
    { id: 7, name: '一般社員' }
];


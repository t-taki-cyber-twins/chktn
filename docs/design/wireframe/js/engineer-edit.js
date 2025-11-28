/* ========================================
   エンジニア編集画面固有JavaScript
   ======================================== */

/**
 * 初期化処理
 */
document.addEventListener("DOMContentLoaded", function () {
  // 面談編集モーダル初期化
  initMeetingEdit();

  // 保存ボタン
  const saveBtn = document.querySelector(".sidebar-save-btn");
  const engineerForm = document.getElementById("engineer-form");

  if (saveBtn) {
    saveBtn.addEventListener("click", function () {
      if (engineerForm && engineerForm.validateForm()) {
        const formData = engineerForm.getFormData();
        console.log("フォーム送信:", formData);
        alert("エンジニア情報を更新しました");
        // 実際の実装ではAPIを呼び出して保存
      }
    });
  }

  // キャンセルボタン
  const cancelBtn = document.querySelector(".sidebar-cancel-btn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", function () {
      if (confirm("編集内容を破棄して戻りますか？")) {
        window.history.back();
      }
    });
  }

  // 稼働中案件の編集ボタン
  const activeProjectEditBtns = document.querySelectorAll(".active-project-edit-btn");
  if (activeProjectEditBtns) {
    activeProjectEditBtns.forEach(btn => {
      btn.addEventListener("click", function() {
        const projectIndex = this.getAttribute("data-project-index");
        
        // フォームまでスクロール
        if (engineerForm) {
          engineerForm.scrollIntoView({ behavior: "smooth" });
          
          // 案件タブをアクティブにする
          if (typeof engineerForm.activateTab === "function") {
            engineerForm.activateTab("projects");
          }
          
          // 少し待ってからモーダルを開く（タブ切り替えの描画待ち）
          setTimeout(() => {
            if (typeof engineerForm.openProjectEdit === "function") {
              engineerForm.openProjectEdit(parseInt(projectIndex));
            }
          }, 300);
        }
      });
    });
  }

  // モックデータの読み込み
  loadMockData();
});

/**
 * モックデータの読み込み
 */
function loadMockData() {
    const engineerForm = document.getElementById("engineer-form");
    if (!engineerForm) return;

    const mockData = {
        // engineerName is not part of the form component yet, assuming it's handled elsewhere or not needed for now
        isPublic: true,
        birthDate: "1990-01-01",
        nearestStation: "東京駅",
        address: "東京都千代田区丸の内1-1-1",
        phone: "090-1234-5678",
        email: "yamada.taro@example.com",
        company: "テック株式会社",
        department: "開発部",
        position: "リーダー",
        engineerStatus: "available",
        availableDate: "2024-12-01",
        experienceYears: 5,
        desiredPrice: 80,
        engineerMemo: "Java, Spring Bootが得意です。",
        engineerNote: "コミュニケーション能力が高く、リーダー経験もあります。",
        skills: [
            { name: "Java", category: "language", level: 3, memo: "業務経験5年" },
            { name: "Spring Boot", category: "framework", level: 3, memo: "業務経験3年" },
            { name: "AWS", category: "cloud", level: 2, memo: "EC2, S3, RDSの使用経験あり" },
        ],
        projects: [
            {
                projectId: "3",
                projectName: "あの時の案件",
                companyName: "テック株式会社",
                status: "working",
                interviewDate: "2023-09-01 15:00",
                startDate: "2023-09-10",
                endDate: "2025-01-01",
                price: "75",
                workContent: "Javaを用いたバックエンド開発",
                languagesTools: "Java, Spring Boot, Oracle",
                roleProcess: "詳細設計〜テスト",
                isOwnProject: true
            },
            {
                projectId: "4",
                projectName: "過去のWebアプリ開発",
                companyName: "株式会社サンプル",
                status: "left",
                interviewDate: "2022-03-15 10:00",
                startDate: "2022-04-01",
                endDate: "2023-03-31",
                price: "70",
                workContent: "Reactを用いたフロントエンド開発",
                languagesTools: "React, TypeScript, AWS",
                roleProcess: "実装〜テスト",
                isOwnProject: false
            },
            {
                projectId: "1",
                projectName: "フルスタックエンジニア募集",
                companyName: "サンプル株式会社",
                status: "interview_pending",
                interviewDate: "2024-12-15 14:00",
                startDate: "",
                endDate: "",
                price: "80",
                workContent: "Next.jsを用いたフルスタック開発",
                languagesTools: "Next.js, TypeScript, Supabase",
                roleProcess: "基本設計〜実装",
                isOwnProject: true
            },
            {
                projectId: "2",
                projectName: "バックエンドエンジニア募集",
                companyName: "テック株式会社",
                status: "interview_completed",
                interviewDate: "2024-12-10 10:00",
                startDate: "",
                endDate: "",
                price: "75",
                workContent: "Go言語を用いたAPI開発",
                languagesTools: "Go, Gin, MySQL",
                roleProcess: "詳細設計〜実装",
                isOwnProject: false
            },
            {
                projectId: "5",
                projectName: "AIアプリ開発",
                companyName: "AIソリューションズ",
                status: "interview_rejected",
                interviewDate: "2024-11-20 11:00",
                startDate: "",
                endDate: "",
                price: "85",
                workContent: "Pythonを用いたAIモデル組み込み",
                languagesTools: "Python, TensorFlow, FastAPI",
                roleProcess: "実装〜テスト",
                isOwnProject: false
            },
            {
                projectId: "6",
                projectName: "金融系システム改修",
                companyName: "フィンテックジャパン",
                status: "interview_declined",
                interviewDate: "2024-11-15 16:00",
                startDate: "",
                endDate: "",
                price: "90",
                workContent: "Javaを用いた基幹システム改修",
                languagesTools: "Java, Spring, Oracle",
                roleProcess: "要件定義〜基本設計",
                isOwnProject: true
            }
        ]
    };

    engineerForm.setFormData(mockData);
}

/**
 * 面談編集モーダルの初期化
 */
function initMeetingEdit() {
  const meetingEditBtns = document.querySelectorAll(".meeting-edit-btn");
  const meetingEditComponent = document.querySelector("app-engineer-meeting-edit");

  if (meetingEditComponent) {
    meetingEditBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const meetingId = this.getAttribute("data-meeting-id");
        // モックデータを使用してモーダルを開く
        const mockData = {
          id: meetingId,
          engineerName: "山田 太郎",
          projectName: "フルスタックエンジニア募集",
          status: "pending",
          meetingDate: "2024-12-15T14:00",
          meetingType: "online",
          meetingUrl: "https://zoom.us/j/123456789",
          memo: "技術的な質問を中心に確認予定",
        };
        meetingEditComponent.open(mockData, function (updatedData) {
          console.log("Updated meeting data:", updatedData);
          alert("面談情報を更新しました");
        });
      });
    });
  }
}

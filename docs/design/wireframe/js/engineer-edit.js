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
                projectId: "1",
                projectName: "基幹システムリプレース",
                startDate: "2023-04-01",
                endDate: "2024-03-31",
                price: "75",
                workContent: "Javaを用いたバックエンド開発",
                languagesTools: "Java, Spring Boot, Oracle",
                roleProcess: "詳細設計〜テスト",
            },
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

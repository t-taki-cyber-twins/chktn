# プロジェクト構造

```
chktn/
├── api-gateway/              # API Gatewayサービス
│   ├── build.gradle.kts
│   ├── Dockerfile
│   └── src/main/java/jp/chokutuna/gateway/
│       └── ApiGatewayApplication.java
│
├── core-service/             # Core Service（統合サービス）
│   ├── build.gradle.kts
│   ├── Dockerfile
│   └── src/main/java/jp/chokutuna/core/
│       ├── company/          # 会社管理モジュール
│       ├── engineer/         # エンジニア管理モジュール
│       ├── project/          # 案件管理モジュール
│       ├── matching/         # マッチング・検索モジュール
│       ├── auth/            # 認証・アカウント管理モジュール
│       ├── master/           # マスタ管理モジュール
│       ├── notification/     # 通知モジュール（オプション）
│       ├── common/           # 共通モジュール
│       │   ├── security/     # セキュリティ共通
│       │   ├── database/     # データベース共通
│       │   ├── multitenant/  # マルチテナント共通
│       │   └── config/       # 設定（OpenApiConfig等）
│       └── CoreServiceApplication.java
│
├── gradle/
│   └── libs.versions.toml    # バージョンカタログ
├── docker-compose.yml        # Docker Compose設定
├── .env.example              # 環境変数テンプレート
└── .env                      # 環境変数（Git除外）
```

## ドキュメント構造

`docs`フォルダ以下の構成は以下の通りです。特に`docs/design/仕様書`フォルダには、機能グループごとの詳細仕様書が格納されています。

```
docs/
├── design/                       # 設計ドキュメント
│   ├── 00_機能一覧.md            # 機能一覧・全体設計
│   ├── wireframe/                # ワイヤーフレーム（HTML/JS）
│   └── 仕様書/                   # 詳細仕様書（機能グループ別）
│       ├── エンジニア管理/                 # エンジニア検索、登録、編集など
│       ├── テナント・企業・アカウント管理/   # テナント、会社、アカウント管理など
│       ├── パブリック・トップ・認証/        # LP、ログイン、登録など
│       ├── メッセージ・面談/               # メッセージ、面談管理など
│       ├── 案件管理/                      # 案件検索、登録、編集など
│       ├── 管理者・マスタ管理/             # システム管理、マスタ管理など
│       ├── 共通コンポーネント/             # 汎用的な共通コンポーネントの仕様
│       └── 共通コンポーネント一覧.md        # 共通コンポーネントの一覧とリンク
├── memory/                       # AIエージェント用メモリ（コンテキスト情報）
│   ├── project-structure.md      # プロジェクト構造（本ファイル）
│   ├── database-design.md        # データベース設計
│   ├── infrastructure.md         # インフラ・環境変数情報
│   └── mcp-usage-guide.md        # MCPツール利用ガイド
└── spec/                         # 仕様書（確定版・管理用）
```

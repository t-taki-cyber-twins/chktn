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


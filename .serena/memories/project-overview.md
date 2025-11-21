# プロジェクト概要

## プロジェクト名
chktn（エンジニア・案件マッチングシステム）

## 目的
エンジニア提供会社と案件提供会社をマッチングするプラットフォーム。
- マルチテナント対応（複数の会社が同一システムを利用）
- テナント間でのデータ共有（公開設定による）
- エンジニアと案件のマッチング推薦

## アーキテクチャ
- **サービス構成**: API Gateway + Core Service（2サービス）
- **データベース**: Shared Database（単一データベース、単一スキーマ）
- **マルチテナント方式**: テナントIDカラム方式（アプリケーションレベルでフィルタリング）

## プロジェクト構造
```
chktn/
├── api-gateway/          # API Gatewayサービス（ポート: 8080）
├── core-service/         # Core Service（ポート: 8081）
│   ├── company/          # 会社管理モジュール
│   ├── engineer/         # エンジニア管理モジュール
│   ├── project/          # 案件管理モジュール
│   ├── matching/         # マッチング・検索モジュール
│   ├── auth/             # 認証・アカウント管理モジュール
│   ├── master/           # マスタ管理モジュール
│   ├── notification/     # 通知モジュール
│   └── common/           # 共通モジュール
│       ├── security/     # セキュリティ共通
│       ├── database/     # データベース共通
│       ├── multitenant/  # マルチテナント共通
│       └── config/       # 設定
├── gradle/               # Gradle設定
│   └── libs.versions.toml # バージョンカタログ
└── docker-compose.yml     # Docker Compose設定
```

## 開発環境
- **OS**: Darwin (macOS)
- **Java**: 21
- **データベース**: PostgreSQL 17 (Docker)
- **コンテナ**: Docker Compose

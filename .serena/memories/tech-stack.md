# 技術スタック

## 言語・フレームワーク
- **Java**: 21 (JavaLanguageVersion.of(21))
- **Spring Boot**: 3.5.7
- **Spring Cloud**: 2025.0.0
- **Gradle**: マルチプロジェクト構成（Kotlin DSL）

## データベース
- **PostgreSQL**: 17 (postgres:17-alpine)
- **JDBCドライバ**: 42.7.3
- **マイグレーション**: Flyway 10.14.0

## その他主要ライブラリ
- **Lombok**: 1.18.34
- **SpringDoc OpenAPI**: 2.6.0 (Swagger UI)
- **Spring Boot DevTools**: 開発時の自動リロード

## バージョン管理
- バージョンカタログ（`gradle/libs.versions.toml`）で一元管理
- 依存関係の追加時はバージョンカタログを使用

## 開発ツール
- **Docker**: コンテナ化対応
- **Docker Compose**: 開発環境の起動
- **Flyway**: データベースマイグレーション

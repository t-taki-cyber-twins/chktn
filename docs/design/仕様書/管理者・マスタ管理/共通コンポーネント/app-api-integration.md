# API連携設定コンポーネント (app-api-integration.js)

## 概要
外部Web会議ツール（Zoom、Google Meets、Microsoft Teams）とのAPI連携設定を管理するためのコンポーネントです。各サービスのOAuth認証設定（Client ID, Client Secret）や連携の有効化/無効化をタブ切り替えで管理します。

## 詳細仕様
本コンポーネントの機能詳細、ユースケース、要件定義については、このコンポーネントを使用している以下の画面ドキュメントを参照してください。

- [API連携設定画面 (api-integration.html)](../API連携設定.md)

## 機能一覧
- サービス切り替え（タブUI）
- 連携有効/無効切り替え
- OAuth認証情報入力（Client ID, Client Secret）
- リダイレクトURI表示・コピー
- 連携テスト・保存アクション

## 備考
- 本コンポーネントは「管理者・マスタ管理」機能の一部として提供されます。

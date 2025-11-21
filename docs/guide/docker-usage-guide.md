# Docker使い方ガイド

本ドキュメントでは、エンジニア・案件マッチングシステムでのDockerの使い方を説明します。

## Dockerとは

Dockerは、アプリケーションを**コンテナ**という形式で実行するための技術です。コンテナは、アプリケーションとその実行環境を一緒にパッケージ化したもので、どこでも同じ環境でアプリケーションを実行できます。

このプロジェクトでは、Dockerを使用して以下の3つのサービスを管理しています：
- **PostgreSQL**: データベースサーバー
- **Core Service**: メインのバックエンドサービス
- **API Gateway**: APIのエントリーポイント

## このプロジェクトでのDocker構成

### サービス一覧

| サービス名 | 役割 | ポート番号 | コンテナ名 |
|-----------|------|-----------|-----------|
| postgres | PostgreSQLデータベース | 5432 | chktn-postgres |
| core-service | Core Service（バックエンド） | 8081 | chktn-core-service |
| api-gateway | API Gateway | 8080 | chktn-api-gateway |

### 各サービスの説明

- **postgres**: データベースサーバー。すべてのデータを保存します。
- **core-service**: メインのバックエンドサービス。APIの実装やビジネスロジックを提供します。
- **api-gateway**: 外部からのリクエストを受け取り、Core Serviceに転送します。

## 基本的な使い方（Makefileを使った操作）

このプロジェクトでは、よく使うDockerコマンドを簡単に実行できるように`Makefile`を用意しています。

### コマンドの使い分け（重要）

どのコマンドを使うべきかは、状況によって異なります：

| 状況 | 使用するコマンド | 説明 |
|------|----------------|------|
| **通常の起動** | `make up` | 環境変数変更なし、コード変更なしの場合 |
| **Core Serviceのみのコード変更後** | `make rebuild-core` | Core Serviceのコードやマイグレーションファイルを変更した後（推奨） |
| **全サービスのコード変更後** | `make build && make up` または `make rebuild` | 全サービスのDockerfileやソースコードを変更した後 |
| **マイグレーションファイル追加後** | `make rebuild-core` | 新しいマイグレーションファイルを追加した後（Flywayは起動時に自動実行） |
| **環境変数変更後** | `make down && make rebuild` | `.env`ファイルなどを変更した後 |
| **エラーが発生した場合** | `make rebuild` | 完全に再ビルドして起動したい時 |
| **ログ確認** | `make logs` または `make logs-{service}` | サービスの動作を確認したい時 |

### よく使うコマンド一覧

#### 基本操作

```bash
# 全サービスを起動（バックグラウンド）
make up

# 全サービスを停止
make down

# サービスを再起動
make restart

# 実行中のコンテナ一覧を表示
make ps
```

#### ログ確認

```bash
# 全サービスのログを表示
make logs

# 特定のサービスのログを表示
make logs-postgres    # PostgreSQLのログ
make logs-core        # Core Serviceのログ
make logs-gateway      # API Gatewayのログ
```

#### データベース操作

```bash
# PostgreSQLに接続
make db-connect
```

接続後、SQLコマンドを実行できます：
```sql
-- テーブル一覧を表示
\dt

-- 接続を終了
\q
```

#### ビルド・再構築

```bash
# 全サービスのイメージを再ビルド（Dockerfileやコード変更時）
make build

# 全サービスのイメージを再ビルドして起動（環境変数変更時やビルドエラー時）
make rebuild

# Core Serviceのみを再ビルド（ビルドのみ）
make build-core

# Core Serviceのみを再ビルドして起動（Core Serviceのコード変更時、推奨）
make rebuild-core
```

### 注意が必要なコマンド

以下のコマンドは、**データベースの全データが削除される**危険な操作のため、Makefile内でコメントアウトされています。

必要に応じて、Makefile内の該当箇所のコメントを外して使用してください：

- **`make db-reset`**: データベースを完全にリセット（全データが削除されます）
- **`make clean`**: 停止してボリュームも削除（完全クリーンアップ、全データが削除されます）

## 開発時のよくある操作

### 1. サービス起動・停止

**初回起動時**:
```bash
make up
```

**停止時**:
```bash
make down
```

**再起動時**:
```bash
make restart
```

### 2. ログの確認

**全サービスのログを確認**:
```bash
make logs
```

**特定のサービスのログを確認**（推奨）:
```bash
make logs-core        # Core Serviceのログを確認
make logs-gateway     # API Gatewayのログを確認
make logs-postgres    # PostgreSQLのログを確認
```

### 3. データベースへの接続

```bash
make db-connect
```

接続後、SQLコマンドを実行できます：
```sql
-- テーブル一覧
\dt

-- データベースの状態確認
SELECT * FROM flyway_schema_history;

-- 接続終了
\q
```

### 4. コード変更後の再ビルド手順

**方法1: ビルドしてから起動**（推奨）
```bash
make build
make up
```

**方法2: 一度に実行**（簡単）
```bash
make rebuild
```

**マイグレーションファイルを追加した場合**:
新しいマイグレーションファイルを追加した場合は、Core Serviceの再ビルドが必要です。FlywayはCore Service起動時に自動的に未実行のマイグレーションを実行します。

```bash
# Core Serviceのみを再ビルドして起動（推奨、高速）
make rebuild-core
```

再起動後、Core Serviceのログでマイグレーションの実行状況を確認できます：
```bash
make logs-core
```

**注意**: 全サービスを再ビルドする場合は`make rebuild`を使用しますが、Core Serviceのみの変更であれば`make rebuild-core`の方が高速です。

### 5. 環境変数変更後の再起動手順

`.env`ファイルなどを変更した場合は、完全に再ビルドが必要です：

```bash
# 停止
make down

# 再ビルドして起動
make rebuild
```

### 6. データベースのリセット

**注意**: この操作は**データベースの全データが削除されます**。開発環境のみで使用してください。

Makefile内の`db-reset`コマンドのコメントを外して使用：
```bash
# コメントを外した後
make db-reset
```

## トラブルシューティング

### よくあるエラーと解決方法

#### 1. ポートが既に使用されている

**エラー**: `port is already allocated` など

**解決方法**:
```bash
# 使用中のポートを確認
lsof -i :8080
lsof -i :8081
lsof -i :5432

# プロセスを終了（プロセスIDを確認してから）
kill -9 <PID>

# または、既存のコンテナを停止
make down
```

#### 2. コンテナが起動しない

**解決方法**:
```bash
# ログを確認して原因を特定
make logs

# 完全に再ビルド
make rebuild
```

#### 3. データベース接続エラー

**解決方法**:
```bash
# PostgreSQLコンテナの状態を確認
make ps

# PostgreSQLのログを確認
make logs-postgres

# コンテナを再起動
make restart
```

#### 4. ビルドエラーが発生する

**解決方法**:
```bash
# キャッシュを使わずに完全再ビルド
make rebuild
```

## 参考資料

### Docker公式ドキュメント

- [Docker公式ドキュメント](https://docs.docker.com/)
- [Docker Compose公式ドキュメント](https://docs.docker.com/compose/)

### よく使うコマンドのクイックリファレンス

| コマンド | 説明 | 使用タイミング |
|---------|------|---------------|
| `make up` | 全サービスを起動 | 通常の起動時 |
| `make down` | 全サービスを停止 | 開発終了時、環境変数変更前 |
| `make restart` | サービスを再起動 | 設定ファイル変更後 |
| `make logs` | 全サービスのログを表示 | エラー確認時 |
| `make logs-{service}` | 特定サービスのログを表示 | 特定サービスの確認時 |
| `make ps` | コンテナ一覧を表示 | 状態確認時 |
| `make db-connect` | PostgreSQLに接続 | データベース操作時 |
| `make build` | 全サービスのイメージを再ビルド | 全サービスのコード変更後 |
| `make rebuild` | 全サービスを再ビルドして起動 | 環境変数変更後、エラー時 |
| `make build-core` | Core Serviceのみを再ビルド | Core Serviceのコード変更後（ビルドのみ） |
| `make rebuild-core` | Core Serviceのみを再ビルドして起動 | Core Serviceのコード変更後（推奨） |

### 直接docker composeコマンドを使う場合

Makefileを使わず、直接`docker compose`コマンドを使うこともできます：

```bash
# 起動
docker compose up -d

# 停止
docker compose down

# ログ確認
docker compose logs -f

# ビルド
docker compose build
```

詳細は[Docker Compose公式ドキュメント](https://docs.docker.com/compose/)を参照してください。


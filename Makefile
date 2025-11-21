.PHONY: help up down restart logs logs-postgres logs-core logs-gateway ps db-connect build rebuild build-core rebuild-core

# ==============================================================================
# Docker Compose コマンド短縮版
# ==============================================================================
# このMakefileは、開発でよく使用するDockerコマンドを簡単に実行できるようにします。
#
# 【コマンドの使い分け】
# - 通常の起動（環境変数変更なし、コード変更なし）: make up
# - コード変更後（全サービス）: make build && make up または make rebuild
# - Core Serviceのみのコード変更後（推奨）: make rebuild-core
# - 環境変数変更後（.envファイルなど）: make down && make rebuild
# - エラー時: make rebuild（完全に再ビルド）
# - ログ確認: make logs または make logs-{service}
# ==============================================================================

# ヘルプ表示
help:
	@echo "Docker Compose コマンド一覧:"
	@echo ""
	@echo "【基本操作】"
	@echo "  make up              - 全サービスを起動（バックグラウンド）"
	@echo "  make down            - 全サービスを停止"
	@echo "  make restart         - サービスを再起動"
	@echo "  make ps              - 実行中のコンテナ一覧を表示"
	@echo ""
	@echo "【ログ確認】"
	@echo "  make logs            - 全サービスのログを表示"
	@echo "  make logs-postgres   - PostgreSQLのログを表示"
	@echo "  make logs-core       - Core Serviceのログを表示"
	@echo "  make logs-gateway    - API Gatewayのログを表示"
	@echo ""
	@echo "【データベース操作】"
	@echo "  make db-connect      - PostgreSQLに接続"
	@echo ""
	@echo "【ビルド・再構築】"
	@echo "  make build           - 全サービスのイメージを再ビルド（Dockerfileやコード変更時）"
	@echo "  make rebuild         - 全サービスのイメージを再ビルドして起動（環境変数変更時やビルドエラー時）"
	@echo "  make build-core      - Core Serviceのみを再ビルド"
	@echo "  make rebuild-core    - Core Serviceのみを再ビルドして起動（Core Serviceのコード変更時、推奨）"
	@echo ""
	@echo "【注意が必要なコマンド（コメントアウト）】"
	@echo "  以下のコマンドは危険な操作のためコメントアウトされています。"
	@echo "  必要に応じてMakefile内の該当箇所のコメントを外して使用してください。"
	@echo "  - make db-reset      - データベースをリセット（全データが削除されます）"
	@echo "  - make clean         - 停止してボリュームも削除（完全クリーンアップ、全データが削除されます）"

# ==============================================================================
# 基本操作（日常的に使用）
# ==============================================================================

# 全サービスを起動（バックグラウンド）
# 使用タイミング: 通常の起動時（環境変数変更なし、コード変更なし）
up:
	docker compose up -d

# 全サービスを停止
# 使用タイミング: 開発を終了する時、または環境変数を変更する前
down:
	docker compose down

# サービスを再起動
# 使用タイミング: 設定ファイル（application.ymlなど）を変更した後
restart:
	docker compose restart

# 実行中のコンテナ一覧を表示
# 使用タイミング: コンテナの状態を確認したい時
ps:
	docker compose ps

# ==============================================================================
# ログ確認
# ==============================================================================

# 全サービスのログを表示
# 使用タイミング: 全体的なログを確認したい時
logs:
	docker compose logs -f

# PostgreSQLのログを表示
# 使用タイミング: データベース関連のエラーを調査する時
logs-postgres:
	docker compose logs -f postgres

# Core Serviceのログを表示
# 使用タイミング: Core Serviceの動作を確認する時
logs-core:
	docker compose logs -f core-service

# API Gatewayのログを表示
# 使用タイミング: API Gatewayの動作を確認する時
logs-gateway:
	docker compose logs -f api-gateway

# ==============================================================================
# データベース操作
# ==============================================================================

# PostgreSQLに接続
# 使用タイミング: データベースに直接接続してSQLを実行したい時
db-connect:
	docker compose exec postgres psql -U postgres -d chktn_db

# ==============================================================================
# ビルド・再構築（必要な時のみ使用）
# ==============================================================================

# イメージを再ビルド（Dockerfileやコード変更時）
# 使用タイミング: 
#   - Dockerfileやソースコードを変更した後
#   - マイグレーションファイルを追加した後（Flywayは起動時に自動実行されるため、再ビルドが必要）
build:
	docker compose build

# イメージを再ビルドして起動（環境変数変更時やビルドエラー時）
# 使用タイミング: 
#   - 環境変数（.envファイルなど）を変更した後
#   - ビルドエラーが発生した時（完全に再ビルドしたい時）
#   - コード変更後、確実に最新の状態で起動したい時
rebuild:
	docker compose down
	docker compose build --no-cache
	docker compose up -d

# Core Serviceのみを再ビルド
# 使用タイミング: Core ServiceのコードやDockerfileを変更した後（ビルドのみ）
build-core:
	docker compose build core-service

# Core Serviceのみを再ビルドして起動（Core Serviceのコード変更時、推奨）
# 使用タイミング:
#   - Core Serviceのコードを変更した後（最も頻繁に使用）
#   - マイグレーションファイルを追加した後（Flywayは起動時に自動実行されるため、再ビルドが必要）
#   - Core ServiceのDockerfileを変更した後
rebuild-core:
	docker compose build core-service
	docker compose up -d core-service

# ==============================================================================
# 注意が必要なコマンド（コメントアウト）
# ==============================================================================
# 以下のコマンドは危険な操作のため、デフォルトではコメントアウトされています。
# 必要に応じてコメントを外して使用してください。
# 使用時は十分注意してください。

# データベースをリセット（全データが削除されます）
# 使用タイミング: データベースを完全に初期状態に戻したい時（開発環境のみ）
# 注意: このコマンドを実行すると、データベースの全データが削除されます
# db-reset:
# 	docker compose exec postgres psql -U postgres -d chktn_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
# 	docker compose restart core-service

# 停止してボリュームも削除（完全クリーンアップ、全データが削除されます）
# 使用タイミング: 完全にクリーンな状態から始めたい時（開発環境のみ）
# 注意: このコマンドを実行すると、データベースの全データが削除されます
# clean:
# 	docker compose down -v
# 	docker compose build --no-cache
# 	docker compose up -d


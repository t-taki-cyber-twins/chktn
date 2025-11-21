# インフラ情報

## ポート番号

- **API Gateway**: 8080
- **Core Service**: 8081
- **PostgreSQL**: 5432

## 環境変数

主要な環境変数（`.env`ファイルで管理）:
- `DB_PASSWORD`: PostgreSQLパスワード（デフォルト: `postgres`）
- `SPRING_PROFILES_ACTIVE`: Springプロファイル（デフォルト: `local`）
- `LOG_LEVEL`: ログレベル（オプション）


# 推奨コマンド

## ビルド・実行

### プロジェクト全体のビルド
```bash
./gradlew build
```

### 特定のモジュールのビルド
```bash
./gradlew :core-service:build
./gradlew :api-gateway:build
```

### テスト実行
```bash
# 全体のテスト
./gradlew test

# 特定のモジュールのテスト
./gradlew :core-service:test
```

### クリーンビルド
```bash
./gradlew clean build
```

## Docker Compose

### すべてのサービスを起動
```bash
docker compose up -d
```

### 特定のサービスを再ビルドして起動
```bash
docker compose up -d --build core-service
docker compose up -d --build api-gateway
```

### ログ確認
```bash
# すべてのサービスのログ
docker compose logs

# 特定のサービスのログ
docker compose logs core-service --tail 50
docker compose logs api-gateway --tail 50
docker compose logs postgres --tail 50
```

### サービス停止
```bash
docker compose down
```

### データベースボリュームも含めて停止
```bash
docker compose down -v
```

## データベース操作

### PostgreSQLに接続
```bash
docker compose exec postgres psql -U postgres -d chktn_db
```

### データベース内での操作
```sql
-- テーブル一覧確認
\dt

-- データ確認
SELECT * FROM companies;

-- Flywayマイグレーション履歴確認
SELECT * FROM flyway_schema_history;
```

## APIテスト

### curlコマンドでのテスト
```bash
# 会社一覧取得
curl -X GET "http://localhost:8080/api/v1/companies" \
  -H "X-Tenant-ID: tenant-001" \
  -H "Content-Type: application/json"

# 会社作成
curl -X POST "http://localhost:8080/api/v1/companies" \
  -H "X-Tenant-ID: tenant-001" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "テスト会社",
    "address": "東京都渋谷区",
    "phone": "03-1234-5678",
    "email": "test@example.com",
    "isPublic": false
  }'
```

## OpenAPI仕様

### OpenAPI仕様の取得
```bash
# JSON形式
curl -o openapi.json http://localhost:8081/v3/api-docs

# YAML形式（利用可能な場合）
curl -o openapi.yaml http://localhost:8081/v3/api-docs.yaml
```

### Swagger UI
- Core Service: http://localhost:8081/swagger-ui.html
- OpenAPI JSON: http://localhost:8081/v3/api-docs

## 開発ツール

### ファイル検索
```bash
find . -name "*.java" -type f
```

### コード検索
```bash
grep -r "pattern" src/
```

### Git操作
```bash
git status
git add .
git commit -m "message"
git push
```

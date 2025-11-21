# データベース設計

## マルチテナント設計

- **方式**: Shared Database（単一データベース、単一スキーマ）
- **データベース名**: `chktn_db`
- **スキーマ**: `public`（デフォルト）
- **テナント分離**: テナントIDカラム方式（`tenant_id`カラムで分離）
- **データ共有**: `is_public`フラグでテナント間データ共有

## テーブル名命名規則

- テーブル名はスネークケースで単数形とする（例：tnt_user_account）
- テーブル名プレフィックスとして以下を使用する
  - mst_: 全体で管理するマスタ系テーブル
  - tnt_: テナント単位で管理するテーブル
  - cmp_: 会社単位で管理するテーブル
  - usr_: ユーザー単位で管理するテーブル

## ID採番ルール
- 公開される一部のデータ以外は原則外部の会社のデータにアクセスすることができない＆IDが公開されないように考慮する
- auto_incrementの自動採番はマスタテーブル以外では原則使用しない
- PKは複数カラム（テナント・会社IDと一緒に結合して使用すること）を基本とする
  - 例）tnt_account
    - tenant_id: テナントID PK
    - tenant_account_id: テナントユーザアカウントID(テナント毎に連番で採番する) PK
    - company_id: 会社ID

## タイムスタンプ管理

### 基本方針
- **タイムゾーン**: すべてのタイムスタンプはUTCで保存
- **管理方法**: データベース側で自動管理（DEFAULT値とトリガーを使用）
- **Java側**: `@PrePersist`/`@PreUpdate`を使用せず、カラムは読み取り専用

### 実装ルール

1. **カラム定義**
   ```sql
   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
   ```

2. **自動更新トリガー**
   ```sql
   CREATE OR REPLACE FUNCTION update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
       NEW.updated_at = CURRENT_TIMESTAMP;
       RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   CREATE TRIGGER update_{table_name}_updated_at
       BEFORE UPDATE ON {table_name}
       FOR EACH ROW
       EXECUTE FUNCTION update_updated_at_column();
   ```

3. **Javaエンティティ側**
   ```java
   @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
   private LocalDateTime createdAt;

   @Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
   private LocalDateTime updatedAt;
   ```
   - `insertable = false`: INSERT時にJava側から値を設定しない
   - `updatable = false`: UPDATE時にJava側から値を更新しない
   - データベース側のDEFAULT値とトリガーに任せる

### 理由
- タイムゾーンの一貫性を保証（UTCで統一）
- アプリケーションコードを経由しない更新（SQL直接実行など）でも確実に更新される
- タイムゾーン変換の複雑さを回避

## マイグレーション

- Flywayを使用（`core-service/src/main/resources/db/migration/`）
- 命名規則: `V{version}__{description}.sql`（例: `V1__create_companies_table.sql`）
  - {version}: システムの現在日時（yyyyMMddhhmmss）を確認して設定すること


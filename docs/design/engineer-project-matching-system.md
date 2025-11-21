# エンジニア・案件マッチングシステム構成案

## 1. システム概要

### 1.1 システムの目的

本システムは、エンジニア提供会社と案件提供会社をマッチングするプラットフォームです。エンジニア提供会社はエンジニア情報を登録・管理し、案件提供会社は案件情報を登録・管理します。1つの会社が両方の役割を担うことも可能で、エンジニア情報や案件情報を公開することで、テナント（会社）間でのデータ共有を実現します。

### 1.2 主要なユースケース

1. **エンジニア提供会社**
   - エンジニア情報の登録・更新・削除
   - エンジニア情報の公開設定（公開/非公開）
   - 自社のエンジニア情報の管理

2. **案件提供会社**
   - 案件情報の登録・更新・削除
   - 案件情報の公開設定（公開/非公開）
   - 自社の案件情報の管理

3. **マッチング機能**
   - 公開されたエンジニア情報の検索・閲覧
   - 公開された案件情報の検索・閲覧
   - エンジニアと案件のマッチング推薦

4. **データ共有**
   - 公開設定されたエンジニア情報は全テナントから閲覧可能
   - 公開設定された案件情報は全テナントから閲覧可能
   - 非公開情報は自社のみアクセス可能

### 1.3 ビジネス要件

- **マルチテナント対応**: 複数の会社（テナント）が同一システムを利用
- **柔軟な役割**: 1つの会社がエンジニア提供と案件提供の両方を担当可能
- **データ共有**: 公開設定により、テナント間でデータを共有
- **データプライバシー**: 非公開情報は自社のみアクセス可能

### 1.4 全体アーキテクチャ

本システムは、段階的な拡張を考慮したアーキテクチャを採用します。初期段階ではシンプルな構成から開始し、必要に応じてサービスを分割していきます。

#### 1.4.1 フェーズ1: 初期段階（シンプル構成）

初期段階では、API GatewayとCore Serviceを分離し、ビジネスロジックはCore Service内でモジュール化します。

```
┌─────────────────────────────────────────────────────────────┐
│                     AWS CloudFront / ALB                      │
└──────────────────────────┬────────────────────────────────────┘
                           │
┌──────────────────────────▼────────────────────────────────────┐
│                    API Gateway (Spring Cloud Gateway)          │
│  - ルーティング                                              │
│  - 認証・認可（JWT）                                         │
│  - テナントID抽出・注入                                       │
│  - 基本ログ記録                                              │
└──────────────────────────┬────────────────────────────────────┘
                           │
        ┌──────────────────▼──────────────────┐
        │        Core Service                  │
        │  - Company（会社管理モジュール）      │
        │  - Engineer（エンジニア管理モジュール）│
        │  - Project（案件管理モジュール）      │
        │  - Matching（マッチング・検索モジュール）│
        │  - Auth（認証・アカウント管理モジュール）│
        │  - Master（マスタ管理モジュール）     │
        └──────────────────┬──────────────────┘
                           │
        ┌──────────────────▼──────────────────┐
        │   PostgreSQL (RDS)                  │
        │  - データベース: chktn_db             │
        │  - スキーマ: public                  │
        │  - マルチテナント（tenant_idカラム）  │
        │  - 単一データベース・単一スキーマ     │
        └──────────────────────────────────────┘
```

**フェーズ1の特徴**
- **サービス数**: 2つ（API Gateway + Core Service）
- **データベース**: 単一データベース、単一スキーマ（Shared Database）
- **開発・運用**: シンプルで管理しやすい
- **拡張性**: モジュール単位で将来的なサービス分割を考慮

#### 1.4.2 フェーズ2: 拡張段階（サービス分割）

システムが成長し、スケーラビリティや独立性が必要になった場合、Core Serviceを分割します。

```
┌─────────────────────────────────────────────────────────────┐
│                     AWS CloudFront / ALB                      │
└──────────────────────────┬────────────────────────────────────┘
                           │
┌──────────────────────────▼────────────────────────────────────┐
│                    API Gateway (Spring Cloud Gateway)          │
│  - ルーティング                                              │
│  - 認証・認可（JWT）                                         │
│  - レートリミット                                            │
│  - ログ集約                                                  │
│  - サーキットブレーカー                                      │
└──────────────────────────┬────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼──────┐  ┌───────▼──────┐  ┌───────▼──────┐
│   Company    │  │   Engineer   │  │   Project    │
│   Service    │  │   Service    │  │   Service    │
└───────┬──────┘  └───────┬──────┘  └───────┬──────┘
        │                  │                  │
        └──────────┬───────┴──────────────────┘
                   │
        ┌──────────▼──────────┐
        │   Matching Service  │
        │  - 検索・推薦機能    │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │ Notification Service │
        │  - 通知機能          │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │   Auth Service       │
        │  - 認証・アカウント管理│
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │   Master Service    │
        │  - マスタ管理        │
        └──────────┬──────────┘
                   │
        └──────────┼──────────┘
                   │
        ┌──────────▼──────────┐
        │   PostgreSQL (RDS)   │
        │  - Schema per Service│
        │  - マルチテナント    │
        │  - テナントIDカラム  │
        └──────────────────────┘
```

**フェーズ2の特徴**
- **サービス数**: 複数（各ドメインごとに独立）
- **データベース**: Schema per Service（サービスごとにスキーマ分離）
- **独立性**: サービス単位で開発・デプロイ・スケールが可能
- **スケーラビリティ**: サービス単位で独立スケール

#### 1.4.3 段階的な移行パス

フェーズ1からフェーズ2への移行は、以下の段階で実施します：

1. **Auth Serviceの分離**: 認証機能の独立性を確保
2. **Matching Serviceの分離**: 検索処理の負荷分散
3. **Master Serviceの分離**: マスタデータの独立管理
4. **各ドメインサービスの分離**: Company, Engineer, Projectサービスを独立

データベースについては、Shared DatabaseからSchema per Serviceへ段階的に移行します。

### 1.4.4 マイクロサービス化のメリット・デメリット

**メリット**

- 技術スタックの独立性（各サービスで異なる技術を選択可能）
- スケーラビリティ（サービス単位で独立スケール）
- 開発・デプロイの独立性（チーム単位で並行開発・デプロイ可能）
- 障害の局所化（1つのサービスの障害が他に影響しにくい）
- 保守性の向上（サービス単位で理解・修正が容易）
- 外部API連携の柔軟性（特定サービスだけを外部公開可能、API仕様の独立管理）

**デメリット**

- 運用の複雑化（複数サービス・データベースの管理）
- ネットワークレイテンシ（サービス間通信のオーバーヘッド）
- データ整合性の課題（分散トランザクションの複雑さ）
- デバッグの困難さ（トレーシング・ログ収集の必要性）
- 初期開発コストの増加（インフラ・ツールの準備）
- 外部API公開時のセキュリティ複雑化（複数エンドポイントの管理、認証・認可の統一）

### 1.5 サービス間通信パターン

**同期通信**
- **REST API（Spring Cloud OpenFeign）**: サービス間の直接的な同期通信
  - マッチングサービスがエンジニアサービス・案件サービスからデータを取得
  - 低レイテンシが必要な操作に使用
  - タイムアウトとリトライ設定が必要

**非同期通信**
- **AWS SQS/SNS（イベント駆動型アーキテクチャ）**: イベントベースの非同期通信
  - エンジニア情報公開時の通知イベント
  - 案件情報公開時の通知イベント
  - マッチング成立時の通知イベント
  - サービス間の疎結合を実現
  - イベントソーシングパターンで将来の拡張性を確保

**サービスディスカバリ**
- **AWS ECS Service Discovery**: マネージドサービスディスカバリ（推奨）
  - ECS環境では自動的にサービスを発見
  - ヘルスチェックと自動フェイルオーバー
- **Spring Cloud Eureka**: オンプレミスまたは複雑な環境の場合

### 1.6 APIゲートウェイの設計詳細

**Spring Cloud Gateway**
- ルーティングとロードバランシング
  - パスベースルーティング（`/api/v1/companies/**` → Company Service）
  - 動的ルーティング設定
  - ヘルスチェックベースのルーティング

**認証・認可**
- JWT（JSON Web Token）による認証
- テナントIDの検証と注入
- ロールベースアクセス制御（RBAC）

**レートリミット**
- テナント単位でのレートリミット
- IPアドレスベースのレートリミット
- スライディングウィンドウアルゴリズム

**サーキットブレーカー**
- Resilience4jによるサーキットブレーカー実装
- フォールバック処理
- 自動リトライ

**ログ集約**
- リクエスト/レスポンスのログ記録
- トレーシングIDによるリクエスト追跡
- AWS CloudWatchへのログ送信

**OpenAPI仕様**
- 統合されたOpenAPI仕様の提供
- Swagger UIによるAPIドキュメント表示
- 各サービスからのOpenAPI仕様の自動統合

**外部API公開・連携における役割**
- 単一エントリーポイント（外部からはAPI Gatewayのみにアクセス、内部構造を隠蔽）
- バージョン管理（APIバージョニング戦略の統一管理）
- APIキー管理（外部連携パートナー向けのAPIキー発行・管理）
- 契約管理（SLA管理、利用制限の設定）
- 外部向けドキュメント提供（公開用API仕様の提供）
- CORS対応（外部からのクロスオリジンリクエスト対応）
- セキュリティポリシーの統一（外部・内部アクセスで異なるセキュリティポリシー適用）

**認証・認可**
- JWT（JSON Web Token）による認証やテナントIDの検証・注入など、セキュリティ関連の処理を担います。

**レートリミット**
- テナント単位やIPアドレスベースでのリクエスト制限を適用します。

**ログ集約**
- リクエスト/レスポンスのログ記録と、トレーシングIDによるリクエスト追跡を一括で行います。

**サーキットブレーカー**
- バックエンドサービスの障害時にフォールバック処理を提供し、システムの耐障害性を高めます。

## 2. 技術スタック詳細

### 2.1 Java 21 + Spring Boot

**Java 21 の特徴**
- 仮想スレッド（Project Loom）による高スループット
- パターンマッチングとレコードクラスによる簡潔なコード
- シーケンスコレクションによる効率的なデータ操作

**Spring Boot 3.x**
- Spring Framework 6.x ベース
- ネイティブコンパイル（GraalVM）サポート
- マイクロサービス向け機能：
  - Spring Cloud Gateway（API Gateway）
  - Spring Cloud OpenFeign（サービス間通信）
  - Spring Cloud Config（設定管理）
  - Spring Data JPA（データアクセス）

**推奨バージョン**
```gradle
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

dependencies {
    implementation platform('org.springframework.boot:spring-boot-dependencies:3.2.0')
}
```

### 2.2 Gradle

**マルチプロジェクト構成**

本システムはGradleマルチプロジェクト構成を採用し、段階的な拡張を考慮したプロジェクト構成を採用します。

#### 2.2.1 フェーズ1: 初期段階（シンプル構成）

初期段階では、API GatewayとCore Serviceの2つのサービスで構成します。

**プロジェクト構成（フェーズ1）**
```
chktn/
├── build.gradle.kts                    # ルートビルド設定
├── settings.gradle.kts                  # プロジェクト設定
├── gradle/
│   └── libs.versions.toml              # バージョンカタログ
├── api-gateway/                        # API Gateway サービス
├── core-service/                       # Core Service（統合サービス）
└── common/                             # 共通ライブラリ（オプション）
    ├── common-security/                # セキュリティ共通
    ├── common-database/                # データベース共通
    └── common-multitenant/             # マルチテナント共通
```

#### 2.2.2 フェーズ2: 拡張段階（サービス分割）

システムが成長し、サービス分割が必要になった場合、Core Serviceを分割します。

**プロジェクト構成（フェーズ2）**
```
chktn/
├── build.gradle.kts                    # ルートビルド設定
├── settings.gradle.kts                  # プロジェクト設定
├── gradle/
│   └── libs.versions.toml              # バージョンカタログ
├── api-gateway/                        # API Gateway サービス
├── company-service/                    # 会社サービス（分離後）
├── engineer-service/                   # エンジニアサービス（分離後）
├── project-service/                    # 案件サービス（分離後）
├── matching-service/                   # マッチングサービス（分離後）
├── auth-service/                       # 認証・アカウント管理サービス（分離後）
├── master-service/                     # マスタ管理サービス（分離後）
├── notification-service/               # 通知サービス（分離後）
└── common/                             # 共通ライブラリ
    ├── common-security/                # セキュリティ共通
    ├── common-database/                # データベース共通
    └── common-multitenant/             # マルチテナント共通
```

**Gradleバージョンカタログ（gradle/libs.versions.toml）**
```toml
[versions]
spring-boot = "3.2.0"
spring-cloud = "2023.0.0"
postgresql = "42.7.1"
flyway = "10.0.0"
lombok = "1.18.30"

[libraries]
spring-boot-starter-web = { module = "org.springframework.boot:spring-boot-starter-web", version.ref = "spring-boot" }
spring-boot-starter-data-jpa = { module = "org.springframework.boot:spring-boot-starter-data-jpa", version.ref = "spring-boot" }
postgresql = { module = "org.postgresql:postgresql", version.ref = "postgresql" }
flyway-core = { module = "org.flywaydb:flyway-core", version.ref = "flyway" }
flyway-database-postgresql = { module = "org.flywaydb:flyway-database-postgresql", version.ref = "flyway" }

[plugins]
flyway = { id = "org.flywaydb.flyway", version.ref = "flyway" }
```

### 2.3 PostgreSQL

**マルチテナントデータベース設計**

本システムでは、段階的な拡張を考慮したデータベース設計を採用します。初期段階ではシンプルなShared Database方式から開始し、必要に応じてSchema per Service方式へ移行します。

#### 2.3.1 フェーズ1: Shared Database（単一データベース、単一スキーマ）

**採用アプローチ: テナントIDカラム + 単一スキーマ**

初期段階では、**Shared Database方式**を採用します。単一のデータベース（`chktn_db`）と単一のスキーマ（`public`）を使用し、テナントIDカラムでデータを分離します。

**構成**
```
PostgreSQL RDS
└── chktn_db (データベース)
    └── public (スキーマ、デフォルト)
        ├── companies テーブル
        ├── engineers テーブル
        ├── engineer_skills テーブル
        ├── projects テーブル
        ├── project_required_skills テーブル
        ├── users テーブル
        ├── user_roles テーブル
        ├── skills テーブル（マスタ、tenant_id不要）
        ├── prefectures テーブル（マスタ、tenant_id不要）
        └── notifications テーブル
```

**特徴**
- 単一スキーマ内でテナントIDでデータを分離
- 運用がシンプル（単一データベース・単一スキーマの管理）
- テナント間でのデータ共有が容易（同一スキーマ内でJOIN可能）
- トランザクション管理が容易（同一データベース内）
- シンプルな実装で保守性が高い

**設計方針**
- すべてのテーブルに`tenant_id`カラムを必須で追加（マスタテーブルは除く）
- 公開フラグ（`is_public`）によりテナント間でデータ共有
- テナントIDによるハッシュパーティショニングで性能最適化（オプション）
- インデックス戦略：`tenant_id`、`is_public`（公開データのみ）にインデックス

**推奨設定**
- 接続プール: HikariCP（Spring Bootデフォルト）
- マイグレーション: **Flyway**（推奨）
- 読み取りレプリカ: AWS RDS Read Replica（本番環境）
- パーティショニング: テナントIDによるハッシュパーティショニング（大規模な場合）

#### 2.3.2 フェーズ2: Schema per Service（サービスごとにスキーマ分離）

システムが成長し、サービス分割が必要になった場合、**Schema per Service方式**へ移行します。

**構成**
```
PostgreSQL RDS (単一データベース、マルチスキーマ)
└── chktn_db (データベース)
    ├── company_schema
    │   ├── companies テーブル (tenant_id必須)
    │   └── company_roles テーブル
    ├── engineer_schema
    │   ├── engineers テーブル (tenant_id必須)
    │   ├── engineer_skills テーブル
    │   └── engineer_profiles テーブル
    ├── project_schema
    │   ├── projects テーブル (tenant_id必須)
    │   ├── project_required_skills テーブル
    │   └── project_applications テーブル
    ├── matching_schema
    │   ├── matching_results テーブル (tenant_id必須)
    │   └── matching_scores テーブル
    ├── auth_schema
    │   ├── users テーブル (tenant_id必須)
    │   ├── user_roles テーブル
    │   └── user_sessions テーブル
    ├── master_schema
    │   ├── skills テーブル (tenant_id不要、共通マスタ)
    │   ├── prefectures テーブル (tenant_id不要)
    │   └── industries テーブル (tenant_id不要)
    └── notification_schema
        ├── notifications テーブル (tenant_id必須)
        └── notification_templates テーブル
```

**特徴**
- サービスごとにスキーマを分離（データ所有権の明確化）
- スキーマ変更の独立性（他サービスへの影響なし）
- 運用コストの削減（単一データベースの管理）
- スキーマ間のJOINは可能だが、推奨されない（サービス間通信で実現）

**移行パス**
- Shared Databaseから段階的にスキーマ分離を実施
- 各サービスが自身のスキーマのマイグレーションを管理
- サービス間のデータアクセスはREST APIで実現

### 2.4 OpenAPI

**API仕様定義（フェーズ1）**
- OpenAPI 3.1形式でAPI仕様を定義
- Core ServiceでOpenAPI仕様を公開
- フェーズ1ではCore Service内の全モジュール（Company, Engineer, Project, Matching, Auth, Master）のAPIを統合して表示

**SpringDoc OpenAPI統合**
```gradle
dependencies {
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.6.0'
}
```

**OpenAPI設定クラス（Core Service）**
```java
@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Core Service API")
                .version("1.0.0")
                .description("エンジニア・案件マッチングシステム Core Service API"))
            .servers(List.of(
                new Server().url("http://localhost:8081").description("Local Development Server")
            ));
    }
}
```

**API仕様の自動生成と公開**
- `/v3/api-docs`: OpenAPI JSON（`http://localhost:8081/v3/api-docs`）
- `/swagger-ui.html`: Swagger UI（`http://localhost:8081/swagger-ui.html`）

**フェーズ2での拡張**
- サービス分割後は、各サービスでOpenAPI仕様を個別に公開
- API Gatewayで統合されたOpenAPI仕様を提供

### 2.5 Apidog

**Apidog統合戦略**

ApidogはAPI開発・テスト・ドキュメント管理ツールとして以下で活用：

1. **API仕様のインポート**
   - OpenAPI仕様をApidogにインポート
   - チーム全体でAPI仕様を共有

2. **APIテスト**
   - 各マイクロサービスのAPIテストケース作成
   - 環境変数でテナントIDを切り替え
   - CI/CDパイプラインでの自動テスト

3. **モックサーバー**
   - 開発中のAPIモック
   - フロントエンド開発との並行作業

4. **ドキュメント生成**
   - ApidogからMarkdown/HTML形式でドキュメント出力
   - 開発者ポータルに統合

**Apidog設定例（フェーズ1）**
```yaml
# apidog-config.yaml
environments:
  - name: local
    baseUrl: http://localhost:8080  # API Gateway経由
    variables:
      tenantId: company_001
  - name: core-service-direct
    baseUrl: http://localhost:8081  # Core Service直接アクセス
    variables:
      tenantId: company_001
  - name: staging
    baseUrl: https://api-staging.example.com
    variables:
      tenantId: company_001

# テナントIDを環境変数として設定
headers:
  X-Tenant-ID: ${tenantId}
  Content-Type: application/json
```

### 2.6 Docker

**コンテナ化戦略（フェーズ1）**

フェーズ1では、API GatewayとCore ServiceをDockerコンテナ化します：

```dockerfile
# Dockerfile 例（API Gateway / Core Service）
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY build/libs/*.jar app.jar
EXPOSE 8080  # API Gatewayの場合は8080、Core Serviceの場合は8081
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Docker Compose（開発環境）**

開発環境では、Docker Composeを使用して以下のサービスを一括起動します：
- PostgreSQL 17（postgres:17-alpine）
- Core Service（ポート8081）
- API Gateway（ポート8080）

詳細は`development-environment-guide.md`の「3. Docker環境の構築」セクションを参照してください。

### 2.7 AWS

**インフラ構成**

**コンピューティング**
- **AWS ECS（Fargate）**: コンテナオーケストレーション
  - マネージドサービスで運用負荷軽減
  - 自動スケーリング対応
- **AWS EKS**: Kubernetesベース（大規模な場合）

**データベース**
- **AWS RDS PostgreSQL**: マネージドデータベース
  - マルチAZ配置で高可用性
  - 自動バックアップとポイントインタイムリカバリ
  - 読み取りレプリカで負荷分散

**ネットワーク**
- **AWS ALB（Application Load Balancer）**: ロードバランシング
  - パスベースルーティング
  - ヘルスチェック
- **AWS VPC**: ネットワーク分離
  - パブリック/プライベートサブネット構成
  - セキュリティグループでアクセス制御

**その他**
- **AWS Secrets Manager**: 機密情報管理
- **AWS CloudWatch**: ログ収集とモニタリング
- **AWS SQS/SNS**: 非同期通信（通知サービスで使用）
- **AWS S3**: ファイルストレージ

## 3. サービス構成の設計

本システムは、段階的な拡張を考慮したサービス構成を採用します。初期段階ではCore Serviceに全機能を統合し、必要に応じてサービスを分割していきます。

### 3.1 フェーズ1: Core Service統合版（初期段階）

初期段階では、すべてのビジネスロジックをCore Service内でモジュール化して実装します。

#### 3.1.1 Core Service（統合サービス）

**役割**
- すべてのビジネスロジックを含む統合サービス
- 内部でモジュール分離（パッケージ単位）
- 将来的なサービス分割を考慮した設計

**内部構成**
```
core-service/
├── src/main/java/jp/chokutuna/core/
│   ├── company/          # 会社管理モジュール
│   ├── engineer/         # エンジニア管理モジュール
│   ├── project/          # 案件管理モジュール
│   ├── matching/         # マッチング・検索モジュール
│   ├── auth/            # 認証・アカウント管理モジュール
│   ├── master/           # マスタ管理モジュール
│   ├── notification/     # 通知モジュール（オプション）
│   └── common/          # 共通モジュール
│       ├── security/    # セキュリティ共通
│       ├── database/    # データベース共通
│       └── multitenant/ # マルチテナント共通
└── src/main/resources/
    └── db/migration/    # Flywayマイグレーション
```

**主要機能**

1. **Company（会社管理）**
   - 会社情報の登録・更新・削除
   - 会社の基本情報管理（会社名、住所、連絡先など）
   - 会社の役割設定（エンジニア提供会社、案件提供会社、両方）

2. **Engineer（エンジニア管理）**
   - エンジニア情報の登録・更新・削除
   - エンジニア情報の公開設定管理
   - エンジニア情報の検索（自社のみ、または公開データ全体）

3. **Project（案件管理）**
   - 案件情報の登録・更新・削除
   - 案件情報の公開設定管理
   - 案件情報の検索（自社のみ、または公開データ全体）

4. **Matching（マッチング・検索）**
   - エンジニアと案件のマッチング推薦
   - 検索機能（スキル、単価、期間などによる検索）
   - マッチングスコア計算

5. **Auth（認証・アカウント管理）**
   - ユーザー登録・ログイン・ログアウト
   - パスワード管理（ハッシュ化、リセット）
   - ユーザー情報管理（プロフィール、設定）
   - ロール・権限管理
   - テナント（会社）とユーザーの紐付け

6. **Master（マスタ管理）**
   - スキルマスタの管理
   - 都道府県マスタの管理
   - 業種マスタの管理
   - その他共通マスタの管理

**API例**
```
# Company
POST   /api/v1/companies          # 会社登録
GET    /api/v1/companies/{id}     # 会社情報取得
PUT    /api/v1/companies/{id}     # 会社情報更新
PATCH  /api/v1/companies/{id}/roles # 役割設定

# Engineer
POST   /api/v1/engineers                    # エンジニア登録
GET    /api/v1/engineers                   # 自社エンジニア一覧
GET    /api/v1/engineers/{id}               # エンジニア詳細（自社）
GET    /api/v1/engineers/public             # 公開エンジニア検索（全テナント）
PUT    /api/v1/engineers/{id}               # エンジニア更新
PATCH  /api/v1/engineers/{id}/visibility    # 公開設定変更
DELETE /api/v1/engineers/{id}               # エンジニア削除

# Project
POST   /api/v1/projects                    # 案件登録
GET    /api/v1/projects                    # 自社案件一覧
GET    /api/v1/projects/{id}                # 案件詳細（自社）
GET    /api/v1/projects/public             # 公開案件検索（全テナント）
PUT    /api/v1/projects/{id}                # 案件更新
PATCH  /api/v1/projects/{id}/visibility    # 公開設定変更
DELETE /api/v1/projects/{id}                # 案件削除

# Matching
GET    /api/v1/matching/engineers/{engineerId}/projects  # エンジニアにマッチする案件
GET    /api/v1/matching/projects/{projectId}/engineers   # 案件にマッチするエンジニア
GET    /api/v1/matching/search                           # 詳細検索

# Auth
POST   /api/v1/auth/register        # ユーザー登録
POST   /api/v1/auth/login           # ログイン（JWT発行）
POST   /api/v1/auth/logout          # ログアウト
POST   /api/v1/auth/refresh         # トークンリフレッシュ
GET    /api/v1/users/{id}           # ユーザー情報取得
PUT    /api/v1/users/{id}            # ユーザー情報更新

# Master
GET    /api/v1/master/skills        # スキル一覧取得
GET    /api/v1/master/prefectures   # 都道府県一覧取得
GET    /api/v1/master/industries    # 業種一覧取得
```

#### 3.1.2 API Gateway

**役割**
- ルーティング（`/api/v1/**` → Core Service）
- 認証・認可（JWT検証、テナントID抽出・注入）
- 基本ログ記録

**フェーズ1での機能**
- 最小構成（ルーティング + JWT認証）
- レートリミット、サーキットブレーカーはフェーズ2で追加

### 3.2 フェーズ2: サービス分割版（拡張段階）

システムが成長し、スケーラビリティや独立性が必要になった場合、Core Serviceを分割します。

#### 3.2.1 サービス分割方針

以下の順序でサービスを分割します：

1. **Auth Serviceの分離**: 認証機能の独立性を確保
2. **Matching Serviceの分離**: 検索処理の負荷分散
3. **Master Serviceの分離**: マスタデータの独立管理
4. **各ドメインサービスの分離**: Company, Engineer, Projectサービスを独立

#### 3.2.2 各サービスの詳細

### 3.3 Company Service（会社サービス）

**役割**
- 会社情報の登録・更新・削除
- 会社の基本情報管理（会社名、住所、連絡先など）
- 会社の役割設定（エンジニア提供会社、案件提供会社、両方）

**主要機能**
- 会社登録・更新
- 会社情報取得
- 会社の役割設定（`canProvideEngineers`, `canProvideProjects`）

**API例**
```
POST   /api/v1/companies          # 会社登録
GET    /api/v1/companies/{id}     # 会社情報取得
PUT    /api/v1/companies/{id}     # 会社情報更新
PATCH  /api/v1/companies/{id}/roles # 役割設定
```

### 3.2 Engineer Service（エンジニアサービス）

**役割**
- エンジニア情報の登録・更新・削除
- エンジニア情報の公開設定管理
- エンジニア情報の検索（自社のみ、または公開データ全体）

**主要機能**
- エンジニア登録・更新・削除
- 公開設定（`isPublic`フラグ）
- 自社エンジニア情報の一覧取得
- 公開エンジニア情報の検索（全テナント）

**データモデル**
- エンジニアID
- 会社ID（tenant_id）
- 名前、スキル、経験年数、希望単価など
- 公開フラグ（`isPublic`）

**API例**
```
POST   /api/v1/engineers                    # エンジニア登録
GET    /api/v1/engineers                   # 自社エンジニア一覧
GET    /api/v1/engineers/{id}               # エンジニア詳細（自社）
GET    /api/v1/engineers/public             # 公開エンジニア検索（全テナント）
PUT    /api/v1/engineers/{id}               # エンジニア更新
PATCH  /api/v1/engineers/{id}/visibility    # 公開設定変更
DELETE /api/v1/engineers/{id}               # エンジニア削除
```

### 3.3 Project Service（案件サービス）

**役割**
- 案件情報の登録・更新・削除
- 案件情報の公開設定管理
- 案件情報の検索（自社のみ、または公開データ全体）

**主要機能**
- 案件登録・更新・削除
- 公開設定（`isPublic`フラグ）
- 自社案件情報の一覧取得
- 公開案件情報の検索（全テナント）

**データモデル**
- 案件ID
- 会社ID（tenant_id）
- 案件名、必要なスキル、単価、期間など
- 公開フラグ（`isPublic`）

**API例**
```
POST   /api/v1/projects                    # 案件登録
GET    /api/v1/projects                    # 自社案件一覧
GET    /api/v1/projects/{id}                # 案件詳細（自社）
GET    /api/v1/projects/public             # 公開案件検索（全テナント）
PUT    /api/v1/projects/{id}                # 案件更新
PATCH  /api/v1/projects/{id}/visibility    # 公開設定変更
DELETE /api/v1/projects/{id}                # 案件削除
```

### 3.4 Matching Service（マッチングサービス）

**役割**
- エンジニアと案件のマッチング推薦
- 検索機能（スキル、単価、期間などによる検索）
- マッチングスコア計算

**主要機能**
- エンジニアと案件のマッチング検索
- スキルマッチング
- 単価範囲マッチング
- マッチングスコア計算とランキング

**API例**
```
GET    /api/v1/matching/engineers/{engineerId}/projects  # エンジニアにマッチする案件
GET    /api/v1/matching/projects/{projectId}/engineers   # 案件にマッチするエンジニア
GET    /api/v1/matching/search                           # 詳細検索
```

### 3.5 Notification Service（通知サービス）

**役割**
- マッチング成立時の通知
- エンジニア情報公開時の通知
- 案件情報公開時の通知

**主要機能**
- イベント駆動型通知
- メール通知
- システム内通知

**API例**
```
POST   /api/v1/notifications                # 通知送信
GET    /api/v1/notifications               # 通知一覧取得
```

## 4. データモデル設計（参考案）

### 4.1 エンティティ概要

**Company（会社）**
- 基本情報: ID、会社名、住所、連絡先
- 役割設定: `canProvideEngineers`、`canProvideProjects`
- テナントID: `tenant_id`（必須）
- 関連: エンジニア、案件との1対多関係

**Engineer（エンジニア）**
- 基本情報: ID、名前、スキル、経験年数、希望単価、稼働状況
- 公開設定: `isPublic`フラグ（デフォルト: false）
- テナントID: `tenant_id`（必須）
- 関連: 会社との多対1関係

**Project（案件）**
- 基本情報: ID、案件名、説明、必要なスキル、単価、期間
- 公開設定: `isPublic`フラグ（デフォルト: false）
- テナントID: `tenant_id`（必須）
- 関連: 会社との多対1関係

### 4.2 データベーステーブル概要（参考案）

**主要テーブル**
- `companies`: 会社情報
- `engineers`: エンジニア情報
- `engineer_skills`: エンジニアスキル（多対多）
- `projects`: 案件情報
- `project_required_skills`: 案件必要スキル（多対多）

**共通設計**
- すべてのテーブルに`tenant_id`カラム（VARCHAR(50), NOT NULL）
- 公開フラグ用の`is_public`カラム（BOOLEAN, NOT NULL, DEFAULT false）
- 作成日時・更新日時の自動管理
- テナントIDと公開フラグにインデックス

詳細なテーブル定義は、実装時にFlywayマイグレーションファイルとして作成します。

## 5. 公開・共有機能の参考案

### 5.1 公開フラグによるデータ共有

**基本方針**
- `isPublic`フラグが`true`の場合、全テナントから閲覧可能
- `isPublic`フラグが`false`の場合、自社（テナント）のみアクセス可能

**実装方針**
- リポジトリ層でテナントIDと公開フラグによるフィルタリング
- 自社データ取得: `tenant_id = currentTenantId`
- 公開データ取得: `is_public = true`（テナントID制限なし）
- サービス層でアクセス制御ロジックを実装

### 5.2 テナント間でのデータアクセス制御

**アクセス制御ロジック**
1. 自社のデータは常にアクセス可能（公開/非公開問わず）
2. 他社のデータは公開設定（`isPublic = true`）の場合のみアクセス可能
3. 管理者権限を持つユーザーは全データにアクセス可能

**セキュリティ実装**
- アプリケーションレベルでのアクセス制御
- Spring Securityによる認証・認可
- テナントID検証のAOP実装

## 6. マルチテナント実装戦略

### 6.1 テナント分離方式

**採用アプローチ: テナントIDカラム + アプリケーションレベルフィルタリング**

本システムでは、テナントIDカラム方式を採用します。単一のデータソースを使用し、アプリケーションレベルでテナントIDによるフィルタリングを実装します。これにより、テナント間でのデータ共有や集計処理が容易になります。

**主要な実装要素**
1. **TenantContext**: スレッドローカルでテナントIDを管理
2. **TenantAspect**: AOPでテナントIDを自動抽出・設定
3. **TenantAwareEntity**: エンティティ基底クラスでテナントIDを自動設定
4. **Repository**: テナントIDによる自動フィルタリング

### 6.2 テナント識別方法

**識別方法**
1. **HTTPヘッダー**: `X-Tenant-ID`（推奨）
2. **サブドメイン**: `company1.example.com`
3. **JWTトークン**: 認証トークンにテナントIDを含める

**API Gatewayでの処理**
- リクエスト受信時にテナントIDを抽出
- テナントIDを検証
- バックエンドサービスにテナントIDをヘッダーとして転送

### 6.3 セキュリティ設計

**認証・認可**
- JWT（JSON Web Token）による認証
- テナントIDとユーザーIDの紐付け
- ロールベースアクセス制御（RBAC）

**データアクセス制御**
- テナントIDによる自動フィルタリング
- 公開フラグによるテナント間データ共有制御
- 管理者権限による全データアクセス

**セキュリティ対策**
- SQLインジェクション対策: パラメータ化クエリ
- テナントID偽造対策: 認証トークンからの検証
- データ漏洩対策: テナントIDによる厳格なフィルタリング

詳細な実装コードは`microservices-architecture.md`の「3. マルチテナント実装」セクションを参照してください。

## 7. API設計

### 7.1 OpenAPI仕様

**API仕様定義方針**
- 各マイクロサービスはOpenAPI 3.1形式でAPI仕様を定義
- SpringDoc OpenAPIを使用して自動生成
- API Gatewayで統合されたOpenAPI仕様を提供

**主要なAPIエンドポイント（参考）**
- Company Service: `/api/v1/companies/**`
- Engineer Service: `/api/v1/engineers/**`
- Project Service: `/api/v1/projects/**`
- Matching Service: `/api/v1/matching/**`
- Notification Service: `/api/v1/notifications/**`

詳細なAPI仕様は、実装時にOpenAPI形式で定義します。

### 7.2 Apidog統合

**Apidog活用方針**
- OpenAPI仕様をApidogにインポート
- 環境変数でテナントIDを切り替え
- APIテストケースの作成と実行
- モックサーバーによる並行開発

詳細な設定方法は、実装時に決定します。

## 8. プロジェクト構造

本システムは、段階的な拡張を考慮したプロジェクト構造を採用します。初期段階ではシンプルな構成から開始し、必要に応じてサービスを分割していきます。

### 8.1 フェーズ1: 初期段階（シンプル構成）

**プロジェクト構成（フェーズ1）**
```
chktn/
├── build.gradle.kts                    # ルートビルド設定
├── settings.gradle.kts                  # プロジェクト設定
├── gradle/
│   └── libs.versions.toml              # バージョンカタログ
├── api-gateway/                        # API Gateway サービス
│   ├── build.gradle.kts
│   └── src/
│       ├── main/java/jp/chokutuna/gateway/
│       │   └── ApiGatewayApplication.java
│       └── main/resources/
│           └── application.yml
├── core-service/                       # Core Service（統合サービス）
│   ├── build.gradle.kts
│   └── src/
│       ├── main/java/jp/chokutuna/core/
│       │   ├── company/                # 会社管理モジュール
│       │   ├── engineer/               # エンジニア管理モジュール
│       │   ├── project/                # 案件管理モジュール
│       │   ├── matching/               # マッチング・検索モジュール
│       │   ├── auth/                  # 認証・アカウント管理モジュール
│       │   ├── master/                 # マスタ管理モジュール
│       │   ├── notification/           # 通知モジュール（オプション）
│       │   ├── common/                # 共通モジュール
│       │   │   ├── security/          # セキュリティ共通
│       │   │   ├── database/          # データベース共通
│       │   │   └── multitenant/       # マルチテナント共通
│       │   └── CoreServiceApplication.java
│       └── main/resources/
│           ├── application.yml
│           └── db/migration/           # Flywayマイグレーションファイル
│               ├── V1__create_companies_table.sql
│               ├── V2__create_engineers_table.sql
│               ├── V3__create_projects_table.sql
│               └── ...
└── common/                             # 共通ライブラリ（オプション）
    ├── common-security/                # セキュリティ共通
    ├── common-database/                 # データベース共通
    └── common-multitenant/               # マルチテナント共通
```

**特徴**
- **サービス数**: 2つ（API Gateway + Core Service）
- **モジュール構成**: Core Service内でパッケージ単位でモジュール分離
- **データベース**: 単一データベース、単一スキーマ（Shared Database）
- **マイグレーション**: Core Serviceで一元管理

### 8.2 フェーズ2: 拡張段階（サービス分割）

**プロジェクト構成（フェーズ2）**
```
chktn/
├── build.gradle.kts
├── settings.gradle.kts
├── gradle/
│   └── libs.versions.toml
├── api-gateway/                        # API Gateway サービス
├── company-service/                   # 会社サービス（分離後）
├── engineer-service/                   # エンジニアサービス（分離後）
├── project-service/                    # 案件サービス（分離後）
├── matching-service/                   # マッチングサービス（分離後）
├── auth-service/                       # 認証・アカウント管理サービス（分離後）
├── master-service/                     # マスタ管理サービス（分離後）
├── notification-service/                # 通知サービス（分離後）
└── common/                             # 共通ライブラリ
    ├── common-security/
    ├── common-database/
    └── common-multitenant/
```

**各サービスの構造（分離後）**
- `build.gradle.kts`: ビルド設定
- `src/main/java/`: Javaソースコード
- `src/main/resources/`: 設定ファイル（application.yml等）
- `src/main/resources/db/migration/`: Flywayマイグレーションファイル（サービスごとに管理）

**移行方法**
- Core Service内のモジュールを独立したサービスに分割
- 各サービスが自身のスキーマのマイグレーションを管理
- サービス間通信はREST API（Spring Cloud OpenFeign）で実現

詳細なディレクトリ構造は、実装時に決定します。

## 9. データベース設計（参考案）

### 9.1 Flywayマイグレーション

**マイグレーション方針**
- Flywayを使用してデータベーススキーマを管理
- バージョン管理されたマイグレーションファイル（`V1__*.sql`, `V2__*.sql`等）
- 各サービスごとにマイグレーションファイルを管理

**主要なマイグレーション**
- `V1__create_companies_table.sql`: 会社テーブル作成
- `V2__create_engineers_table.sql`: エンジニアテーブル作成
- `V3__create_projects_table.sql`: 案件テーブル作成

詳細なテーブル定義は、実装時にFlywayマイグレーションファイルとして作成します。

## 10. 開発環境構築

開発環境の構築手順は、`development-environment-guide.md`を参照してください。

## 11. デプロイ戦略

デプロイ戦略は、`microservices-architecture.md`の「6. デプロイ戦略」セクションを参照してください。

**主要な構成**
- AWS ECS（Fargate）: コンテナオーケストレーション
- AWS RDS PostgreSQL: マネージドデータベース
- AWS ALB: ロードバランシング
- CI/CDパイプライン（GitHub Actions）

## 12. まとめ

本構成案は、エンジニア・案件マッチングシステムのマイクロサービス化APIサーバーを構築するための包括的な設計を提供します：

- **マルチテナント対応**: 会社（テナント）単位でデータを分離
- **柔軟な役割**: 1つの会社がエンジニア提供と案件提供の両方を担当可能
- **データ共有**: 公開フラグによりテナント間でデータを共有
- **マイクロサービス**: Company, Engineer, Project, Matching, Notificationサービスで構成
- **技術スタック**: Java 21, Spring Boot, Gradle, PostgreSQL, OpenAPI, Apidog, Docker, AWS

この構成により、スケーラブルで保守性の高いエンジニア・案件マッチングプラットフォームを構築できます。


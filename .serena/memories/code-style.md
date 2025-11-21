# コードスタイルと規約

## パッケージ構造
- **ベースパッケージ**: `jp.chokutuna`
- **API Gateway**: `jp.chokutuna.gateway`
- **Core Service**: `jp.chokutuna.core`
- **モジュール**: `jp.chokutuna.core.{module}` (company, engineer, project等)

## クラス命名規則
- **Applicationクラス**: `{Service}Application.java` (例: `ApiGatewayApplication.java`, `CoreServiceApplication.java`)
- **設定クラス**: `{Config}Config.java` (例: `OpenApiConfig.java`)
- **コントローラー**: `{Entity}Controller.java` (例: `CompanyController.java`)
- **サービス**: `{Entity}Service.java` (例: `CompanyService.java`)
- **リポジトリ**: `{Entity}Repository.java` (例: `CompanyRepository.java`)
- **エンティティ**: `{Entity}.java` (例: `Company.java`)
- **DTO**: `{Entity}Request.java`, `{Entity}Response.java` (例: `CompanyRequest.java`, `CompanyResponse.java`)

## データベース命名規則
- **テーブル名**: スネークケース、複数形 (例: `companies`, `engineers`)
- **カラム名**: スネークケース (例: `tenant_id`, `is_public`)

## コードスタイル（Java）
- **Lombok使用**: `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@RequiredArgsConstructor`
- **アノテーション**: Spring Boot標準アノテーション使用
- **コメント**: JavaDocコメントでクラス・メソッドの説明を記載
- **インデント**: タブ文字を使用

## レイヤー構成
- **Controller層**: REST APIエンドポイント（`@RestController`）
- **Service層**: ビジネスロジック（`@Service`, `@Transactional`）
- **Repository層**: データアクセス（`JpaRepository`継承）
- **Domain層**: エンティティ（`@Entity`）
- **DTO層**: データ転送オブジェクト（リクエスト/レスポンス）

## マルチテナント対応
- すべてのテーブルに`tenant_id`カラムを追加（マスタテーブル除く）
- `TenantContext`を使用してテナントIDを取得
- リポジトリメソッドでテナントIDによるフィルタリングを実装

## OpenAPI仕様
- `@Tag`でコントローラーをグループ化
- `@Operation`で各エンドポイントの説明を記載
- `@ApiResponse`でレスポンス仕様を定義

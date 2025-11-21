# Apidog使用ガイド

本ドキュメントでは、エンジニア・案件マッチングシステム（chktn）でのApidogの使い方を説明します。

## 目次

1. [Apidogとは](#apidogとは)
2. [インストール方法](#インストール方法)
3. [初期設定](#初期設定)
4. [基本的な使い方](#基本的な使い方)
5. [OpenAPI仕様のインポート](#openapi仕様のインポート)
6. [環境変数と設定の管理](#環境変数と設定の管理)
7. [Apidog MCPサーバーの設定と使用方法](#apidog-mcpサーバーの設定と使用方法)
8. [トラブルシューティング](#トラブルシューティング)
9. [まとめ](#まとめ)

## Apidogとは

Apidogは、API開発・テスト・ドキュメント管理を統合したツールです。PostmanやSwagger UIの機能を統合し、以下のことができます：

- **API設計**: OpenAPI仕様に基づいたAPI設計
- **APIテスト**: リクエストの送信とレスポンスの確認
- **ドキュメント生成**: 自動生成されたAPIドキュメント
- **チーム協業**: チームメンバーとのAPI仕様共有

### このプロジェクトでの役割

このプロジェクトでは、Apidogを以下の目的で使用します：

1. **APIテスト**: 開発したAPIエンドポイントの動作確認
2. **API仕様管理**: OpenAPI仕様のインポートと管理
3. **環境管理**: 開発環境（local）とステージング環境（staging）の切り替え
4. **AI連携**: Apidog MCPサーバーを通じたAIエージェントとの連携

## インストール方法

### Macでのインストール

1. [Apidog公式サイト](https://apidog.com/)にアクセス
2. 「Download」をクリックしてMac版をダウンロード
3. ダウンロードした`.dmg`ファイルを開く
4. Apidogアプリを`Applications`フォルダにドラッグ&ドロップ
5. `Applications`フォルダからApidogを起動

### Windowsでのインストール

1. [Apidog公式サイト](https://apidog.com/)にアクセス
2. 「Download」をクリックしてWindows版をダウンロード
3. ダウンロードした`.exe`ファイルを実行
4. インストールウィザードに従ってインストール
5. インストール完了後、Apidogを起動

### Linuxでのインストール

1. [Apidog公式サイト](https://apidog.com/)にアクセス
2. 「Download」をクリックしてLinux版をダウンロード
3. ダウンロードした`.AppImage`ファイルに実行権限を付与：
   ```bash
   chmod +x Apidog-*.AppImage
   ```
4. 実行：
   ```bash
   ./Apidog-*.AppImage
   ```

### インストール確認

Apidogを起動し、ログイン画面またはプロジェクト選択画面が表示されれば、インストールは成功しています。

**初回起動時**:
- アカウント作成またはログインが必要な場合があります
- 無料プランでも基本的な機能は使用できます

## 初期設定

### 1. プロジェクト作成

1. Apidogを起動
2. ホーム画面で「新規プロジェクト」または「Create Project」をクリック
3. プロジェクト名を入力（例: `chktn-api`）
4. 必要に応じて説明を追加
5. 「作成」または「Create」をクリック

### 2. 環境設定

Apidogでは、環境ごとに異なる設定（ベースURL、変数など）を管理できます。

#### 環境の作成

1. 左サイドバーの「環境」アイコンをクリック
2. 「+ 環境を追加」をクリック
3. 環境名を入力（例: `local`, `staging`）
4. 環境変数を設定（後述）

#### 環境変数の設定

このプロジェクトでは、以下の環境変数を設定します：

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `tenantId` | テナントID（すべてのリクエストに必要） | `tenant-001` |
| `baseUrl` | APIのベースURL | `http://localhost:8080` |

**設定手順**:

1. 環境設定画面で「変数」タブを開く
2. 「+ 変数を追加」をクリック
3. 変数名と値を入力
4. 保存

### 3. apidog-config.yamlの活用

このプロジェクトには、`apidog-config.yaml`という設定ファイルが用意されています。このファイルには、環境ごとの設定が定義されています。

**ファイルの場所**: プロジェクトルートの`apidog-config.yaml`

**設定内容**:

```yaml
environments:
  - name: local
    baseUrl: http://localhost:8080  # API Gateway経由
    variables:
      tenantId: tenant-001
  - name: core-service-direct
    baseUrl: http://localhost:8081  # Core Service直接アクセス
    variables:
      tenantId: tenant-001
  - name: staging
    baseUrl: https://api-staging.example.com
    variables:
      tenantId: tenant-001

headers:
  X-Tenant-ID: ${tenantId}
  Content-Type: application/json
```

**使用方法**:

この設定ファイルは、手動でApidogに設定を反映させる際の参考として使用します。現在、Apidogは直接このYAMLファイルをインポートする機能はありませんが、設定内容を手動でApidogに反映させることができます。

**手動設定手順**:

1. `apidog-config.yaml`の内容を確認
2. Apidogで各環境を作成し、変数を設定
3. プロジェクト全体のヘッダー設定で`X-Tenant-ID: {{tenantId}}`を追加

### 4. グローバルヘッダーの設定

すべてのリクエストに自動的にヘッダーを追加する設定：

1. プロジェクト設定を開く
2. 「グローバルヘッダー」または「Global Headers」を選択
3. 以下のヘッダーを追加：
   - `X-Tenant-ID`: `{{tenantId}}`（環境変数を参照）
   - `Content-Type`: `application/json`

これにより、すべてのリクエストに自動的にこれらのヘッダーが追加されます。

## 基本的な使い方

### 1. APIリクエストの作成

#### 手動でリクエストを作成

1. 左サイドバーの「API」または「APIs」をクリック
2. 「+ 新規」または「+ New」をクリック
3. リクエストの種類を選択（GET、POST、PUT、DELETEなど）
4. URLを入力：
   ```
   {{baseUrl}}/api/v1/companies
   ```
   （`{{baseUrl}}`は環境変数を参照）
5. 必要に応じてリクエストボディを追加（POST、PUTの場合）

#### リクエスト例

**GET リクエスト（会社一覧取得）**:
- Method: `GET`
- URL: `{{baseUrl}}/api/v1/companies`
- Headers: 自動的に`X-Tenant-ID`が追加される

**POST リクエスト（会社作成）**:
- Method: `POST`
- URL: `{{baseUrl}}/api/v1/companies`
- Headers: 自動的に`X-Tenant-ID`と`Content-Type`が追加される
- Body (JSON):
  ```json
  {
    "name": "テスト会社",
    "address": "東京都渋谷区",
    "phone": "03-1234-5678",
    "email": "test@example.com",
    "isPublic": false
  }
  ```

### 2. リクエストの送信とレスポンス確認

1. リクエストを作成または選択
2. 右上の「送信」または「Send」ボタンをクリック
3. レスポンスが表示されます：
   - **Status**: HTTPステータスコード（200 OK、404 Not Foundなど）
   - **Body**: レスポンスボディ（JSON形式）
   - **Headers**: レスポンスヘッダー
   - **Time**: リクエストの実行時間

### 3. テストケースの作成

Apidogでは、リクエストのレスポンスを自動的に検証するテストケースを作成できます。

#### テストスクリプトの追加

1. リクエスト画面で「テスト」または「Tests」タブを開く
2. テストスクリプトを記述（JavaScript）：

```javascript
// ステータスコードが200であることを確認
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// レスポンスボディがJSONであることを確認
pm.test("Response is JSON", function () {
    pm.response.to.be.json;
});

// レスポンスに特定のフィールドが含まれることを確認
pm.test("Response contains id field", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
});
```

3. リクエスト送信後、自動的にテストが実行されます
4. テスト結果が「テスト」タブに表示されます

### 4. コレクションの管理

関連するAPIリクエストをグループ化して管理できます。

#### コレクションの作成

1. 左サイドバーの「API」または「APIs」をクリック
2. 「+ 新規」→「フォルダ」または「Folder」を選択
3. フォルダ名を入力（例: `Company APIs`）
4. 関連するリクエストをフォルダにドラッグ&ドロップ

#### コレクションの実行

1. コレクション（フォルダ）を右クリック
2. 「実行」または「Run」を選択
3. 実行順序を確認し、「実行」をクリック
4. すべてのリクエストが順番に実行され、結果が表示されます

## OpenAPI仕様のインポート

このプロジェクトでは、Spring BootのOpenAPI（Swagger）機能を使用してAPI仕様を自動生成しています。生成されたOpenAPI仕様をApidogにインポートすることで、API定義を自動的に取り込むことができます。

### 1. OpenAPI仕様の取得

まず、実行中のCore ServiceからOpenAPI仕様を取得します。

#### 方法1: ブラウザから直接ダウンロード

1. Core Serviceを起動（`make up`または`make rebuild-core`）
2. ブラウザで `http://localhost:8081/v3/api-docs` にアクセス
3. JSONファイルが表示されるので、ファイルとして保存
4. ファイル名を `openapi.json` に変更（任意）

#### 方法2: curlコマンドで取得

```bash
# JSON形式で取得
curl -o openapi.json http://localhost:8081/v3/api-docs

# または、YAML形式で取得（YAML形式が利用可能な場合）
curl -o openapi.yaml http://localhost:8081/v3/api-docs.yaml
```

#### 方法3: Swagger UIからエクスポート

1. `http://localhost:8081/swagger-ui.html` にアクセス
2. 右上の「Download」ボタンをクリック
3. OpenAPI JSONをダウンロード

### 2. Apidogへのインポート

#### 手順1: Apidogを開く

1. Apidogアプリケーションを起動
2. 対象のプロジェクトを開く

#### 手順2: OpenAPI仕様をインポート

**注意**: Apidogのバージョンやプラットフォームによって、メニュー構造が異なる場合があります。以下のいずれかのパスからアクセスできます：
- 「設定」→「データのインポート」
- プロジェクト設定 → 「インポート」
- メインメニュー → 「インポート」

**方法A: ファイルからインポート**

1. 「設定」→「データのインポート」を開く（またはプロジェクト設定から「インポート」を選択）
2. 「ファイルからインポート」または「Import from File」を選択
3. ダウンロードした`openapi.json`ファイルをドラッグ&ドロップ、またはファイルマネージャーから選択
4. インポート設定を確認：
   - **フォルダの指定**: インポート先のフォルダを選択
   - **上書き設定**: 
     - 上書き: 既存のAPIを完全に置き換える
     - マージ: 既存のAPIと新しいAPIを統合する
     - スキップ: 既存のAPIは変更しない
   - **フィールドレベルの設定**: 特定フィールドの上書き、無視、両方保持などを設定
   - 環境変数の設定（`X-Tenant-ID`など）
   - サーバーURLの設定
5. 「インポート」をクリック

**方法B: URLからインポート**

1. 「設定」→「データのインポート」を開く（またはプロジェクト設定から「インポート」を選択）
2. 「URLからインポート」または「Import from URL」を選択
3. URLを入力: `http://localhost:8081/v3/api-docs`
   - **重要**: Swagger UIのベースURL（`http://localhost:8081/swagger-ui.html`）ではなく、OpenAPI JSONファイルの直接URLを指定します
4. インポート設定を確認（方法Aと同様）：
   - フォルダの指定
   - 上書き設定
   - フィールドレベルの設定
5. 「インポート」をクリック

**方法C: コマンドラインからインポート（Apidog CLI使用時）**

```bash
# Apidog CLIがインストールされている場合
apidog import openapi.json
```

### 3. インポート後の設定

インポート後、以下の設定を行うことを推奨します：

1. **環境変数の設定**: `tenantId`と`baseUrl`を設定
2. **グローバルヘッダーの設定**: `X-Tenant-ID: {{tenantId}}`を追加
3. **サーバーURLの確認**: 各リクエストのURLが正しく設定されているか確認

詳細は[環境変数と設定の管理](#環境変数と設定の管理)セクションを参照してください。

### 4. OpenAPI仕様の更新

コードを変更して新しいAPIエンドポイントを追加した場合：

1. Core Serviceを再起動
2. `http://localhost:8081/v3/api-docs`から最新のOpenAPI仕様を取得
3. Apidogに再インポート（既存のAPIは更新、新しいAPIは追加されます）

### 5. URLからのインポートと定期インポート設定

プロジェクトとApidogの状態を同期するために、URLからのインポート機能と定期インポート機能を活用できます。これにより、コード変更時に手動でインポートする手間を減らすことができます。

#### メリット

- **自動同期**: Core ServiceのOpenAPI仕様が更新されると、Apidogから最新の仕様を取得できる
- **手間削減**: ファイルをダウンロードする必要がない
- **常に最新**: URLから直接取得するため、常に最新のAPI仕様を参照できる
- **定期インポート**: スケジュール設定により、定期的に自動的に同期できる

#### 手動インポート（URLから）

**初回設定**:

1. **Apidogを開く**
   - Apidogアプリケーションを起動
   - 対象のプロジェクトを開く

2. **データのインポートを開く**
   - 「設定」→「データのインポート」を選択
   - または、プロジェクト設定から「インポート」を選択（Apidogのバージョンによってメニュー構造が異なる場合があります）

3. **URLからインポート**
   - 「URLからインポート」または「Import from URL」を選択
   - URLを入力: `http://localhost:8081/v3/api-docs`
     - **重要**: Swagger UIのベースURL（`http://localhost:8081/swagger-ui.html`）ではなく、OpenAPI JSONファイルの直接URLを指定します
   - インポート設定を確認：
     - **フォルダの指定**: インポート先フォルダを選択
     - **上書き設定**: 既存のAPIを上書きするか、マージするかを選択
     - **フィールドレベルの設定**: 特定フィールドの上書き、無視、両方保持などの詳細設定
   - 「インポート」をクリック

4. **インポート後の設定**
   - 環境変数の設定（`X-Tenant-ID`など）
   - サーバーURLの設定

**更新時の手順**:

コードを変更して新しいAPIエンドポイントを追加した場合：

1. **Core Serviceを再起動**
   ```bash
   make rebuild-core
   ```

2. **Apidogで再インポート**
   - 「設定」→「データのインポート」を開く
   - 同じURL（`http://localhost:8081/v3/api-docs`）を入力
   - 「インポート」をクリック
   - 既存のAPIは更新され、新しいAPIは追加されます

#### 定期インポート（スケジュール設定）【推奨】

Apidogでは、定期的にOpenAPI仕様をインポートするスケジュール機能が提供されています。これにより、手動での再インポートを行う必要がなくなります。

**前提条件**:
- プロジェクト管理者権限が必要です

**設定手順**:

1. **スケジュール設定を開く**
   - 「設定」→「データのインポート」を選択
   - 「スケジュール」または「Schedule」タブを選択

2. **新しいスケジュールを作成**
   - 「新規スケジュール」または「New Schedule」をクリック

3. **データソースを設定**
   - データソースタイプ: 「URL」を選択
   - URL: `http://localhost:8081/v3/api-docs` を入力
   - **注意**: ローカル開発環境の場合、`localhost`はApidogアプリケーションからアクセス可能である必要があります

4. **同期設定を指定**
   - インポート先フォルダ: 同期先のフォルダを選択
   - 同期間隔: 定期実行の間隔を設定（例: 毎時間、毎日など）
   - 上書き設定: 既存のAPIを上書きするか、マージするかを選択

5. **保存**
   - 設定を保存すると、指定した間隔で自動的にインポートが実行されます

**注意事項**:

- **Core Serviceが起動している必要がある**: 定期インポートが実行される際は、Core Serviceが起動している必要があります
- **ローカル環境での制限**: `localhost`へのアクセスは、Apidogアプリケーションが実行されているマシンからのみ可能です。リモートサーバーを使用している場合は、適切なURLを指定してください
- **プロジェクト管理者権限**: この機能はプロジェクト管理者のみがアクセスできます

#### インポート設定の詳細オプション

Apidogでは、インポート時に以下の詳細設定が可能です：

- **フォルダの指定**: インポート先のフォルダを指定
- **上書き設定**: 
  - 上書き: 既存のAPIを完全に置き換える
  - マージ: 既存のAPIと新しいAPIを統合する
  - スキップ: 既存のAPIは変更しない
- **フィールドレベルの設定**:
  - 特定フィールドの上書き
  - 特定フィールドの無視
  - 両方保持（既存と新しい両方の値を保持）

これらの設定により、インポート時の動作を細かく制御できます。

#### 注意事項

- **メニュー構造の違い**: Apidogのバージョンやプラットフォームによって、メニュー構造が異なる場合があります。「設定」→「データのインポート」のパスが見つからない場合は、プロジェクト設定やメインメニューから「インポート」機能を探してください
- **URL形式**: Swagger UIのベースURL（`http://localhost:8081/swagger-ui.html`）ではなく、OpenAPI JSONファイルの直接URL（`http://localhost:8081/v3/api-docs`）を指定する必要があります
- **ネットワーク接続**: ローカル開発環境では、`localhost`へのアクセスが可能である必要があります

#### 自動化のヒント

**定期インポートを使用する場合**:

1. スケジュール設定で定期インポートを有効化
2. Core Serviceが起動している状態を維持（開発時）
3. コード変更後、Core Serviceを再起動（`make rebuild-core`）
4. 次回のスケジュール実行時に自動的に同期される

**手動インポートを使用する場合**:

コード変更後に以下の手順を習慣化します：

1. Core Serviceを再起動（`make rebuild-core`）
2. ApidogでURLから再インポート
3. 動作確認

このワークフローを習慣化することで、プロジェクトとApidogの状態を常に同期させることができます。

## 環境変数と設定の管理

### 1. 環境ごとの設定

このプロジェクトでは、以下の環境を想定しています：

| 環境名 | ベースURL | 用途 |
|--------|----------|------|
| `local` | `http://localhost:8080` | ローカル開発環境（API Gateway経由） |
| `core-service-direct` | `http://localhost:8081` | ローカル開発環境（Core Service直接） |
| `staging` | `https://api-staging.example.com` | ステージング環境 |

### 2. 環境変数の種類

Apidogでは、以下の2種類の変数を使用できます：

#### グローバル変数

プロジェクト全体で使用される変数：

- 設定場所: プロジェクト設定 → グローバル変数
- スコープ: プロジェクト全体
- 例: `baseUrl`, `apiVersion`

#### 環境変数

特定の環境でのみ使用される変数：

- 設定場所: 環境設定 → 変数
- スコープ: 選択した環境のみ
- 例: `tenantId`

### 3. 環境の切り替え

1. 右上の環境選択ドロップダウンをクリック
2. 使用する環境を選択（例: `local`）
3. 選択した環境の変数が自動的に適用されます

### 4. ヘッダーの自動設定

すべてのリクエストに自動的にヘッダーを追加する設定：

1. プロジェクト設定を開く
2. 「グローバルヘッダー」または「Global Headers」を選択
3. 以下のヘッダーを追加：
   - `X-Tenant-ID`: `{{tenantId}}`
   - `Content-Type`: `application/json`

これにより、すべてのリクエストに自動的にこれらのヘッダーが追加されます。

### 5. 変数の参照方法

リクエスト内で変数を参照するには、`{{変数名}}`という形式を使用します：

- URL: `{{baseUrl}}/api/v1/companies`
- ヘッダー: `{{tenantId}}`
- リクエストボディ: `{{variableName}}`

## Apidog MCPサーバーの設定と使用方法

Apidog MCPサーバーを使用すると、AIエージェント（Cursor、VSCode with Cline等）がApidogプロジェクト内のAPI仕様に接続して利用できるようになります。これにより、AIがAPI仕様を理解して、より正確なコード生成やAPI開発支援が可能になります。

### 1. MCPサーバーとは

MCP（Model Context Protocol）は、AIエージェントが外部ツールやサービスと連携するためのプロトコルです。Apidog MCPサーバーを使用することで、AIエージェントが以下のことができるようになります：

- Apidogプロジェクト内のAPI仕様を読み取る
- APIエンドポイントの一覧を取得する
- API仕様の詳細を理解する
- API開発時の参考情報として活用する

### 2. 前提条件

Apidog MCPサーバーを使用するには、以下の前提条件が必要です：

#### 必須要件

- **Node.js**: バージョン18以上（最新のLTS推奨）
  - インストール確認: `node --version`
  - インストール方法（Mac）:
    ```bash
    brew install node
    ```
- **Apidogアカウント**: 有効なApidogアカウントとプロジェクト
- **MCP対応のIDE**: 以下のいずれか
  - **Cursor**: MCP機能が標準でサポートされています
  - **VSCode with Cline**: Cline拡張機能を使用

#### オプション要件

- **npmまたはyarn**: Node.jsと一緒にインストールされます（`npx`コマンドを使用）

### 3. APIアクセスTokenの取得

Apidog MCPサーバーを使用するには、APIアクセスTokenが必要です。

#### 手順

1. **Apidogを開く**
   - Apidogアプリケーションを起動
   - 対象のプロジェクトを開く

2. **アカウント設定を開く**
   - 右上のプロフィール画像にカーソルを合わせる
   - 「アカウント設定」または「Account Settings」をクリック

3. **APIアクセスTokenを生成**
   - 左メニューから「APIアクセスToken」または「API Access Token」を選択
   - 「新しいTokenを作成」または「Create New Token」をクリック
   - Token名を入力（例: `mcp-server-token`）
   - 「作成」または「Create」をクリック

4. **Tokenをコピー**
   - **重要**: Tokenは一度しか表示されないため、必ずコピーして安全な場所に保存してください
   - Tokenをコピー（例: `apidog_xxxxxxxxxxxxxxxxxxxx`）

#### セキュリティ注意事項

- **Tokenは秘密情報です**: 他人に共有しないでください
- **Gitにコミットしない**: 設定ファイルにTokenを直接記述する場合は、`.gitignore`に追加してください
- **定期的に更新**: セキュリティのため、定期的にTokenを再生成することを推奨します

### 4. プロジェクトIDの取得

Apidog MCPサーバーを使用するには、対象プロジェクトのIDが必要です。

#### 手順

1. **Apidogで対象プロジェクトを開く**
   - 対象のプロジェクトを選択して開く

2. **プロジェクト設定を開く**
   - 左サイドバーで「プロジェクト設定」または「Project Settings」をクリック
   - または、プロジェクト名をクリックして設定を開く

3. **プロジェクトIDを確認**
   - 「基本設定」または「Basic Settings」タブを開く
   - 「プロジェクトID」または「Project ID」を確認
   - プロジェクトIDをコピー（例: `1234567890abcdef`）

#### プロジェクトIDの見つけ方（別の方法）

プロジェクトIDは、ApidogのURLにも含まれています：
- URL例: `https://api.apidog.com/project/1234567890abcdef`
- この場合、`1234567890abcdef`がプロジェクトIDです

### 5. CursorでのMCP設定手順

CursorエディタでApidog MCPサーバーを設定する手順です。

#### 手順1: MCP設定を開く

1. Cursorエディタを開く
2. 右上の設定アイコン（⚙️）をクリック
3. 左メニューから「MCP」を選択

#### 手順2: MCP設定ファイルを編集

1. 「+ 新しいグローバルMCPサーバーを追加」または「+ Add New Global MCP Server」をクリック
2. 設定ファイル（通常は`mcp.json`）が開きます
3. 以下の設定を追加または編集：

```json
{
  "mcpServers": {
    "apidog": {
      "command": "npx",
      "args": [
        "-y",
        "apidog-mcp-server@latest",
        "--project=<project-id>"
      ],
      "env": {
        "APIDOG_ACCESS_TOKEN": "<access-token>"
      }
    }
  }
}
```

#### 手順3: 設定値の置き換え

上記の設定で、以下の値を実際の値に置き換えます：

- `<project-id>`: [プロジェクトIDの取得](#4-プロジェクトidの取得)で取得したプロジェクトID
- `<access-token>`: [APIアクセスTokenの取得](#3-apiアクセストokenの取得)で取得したToken

**設定例**:

```json
{
  "mcpServers": {
    "apidog": {
      "command": "npx",
      "args": [
        "-y",
        "apidog-mcp-server@latest",
        "--project=1234567890abcdef"
      ],
      "env": {
        "APIDOG_ACCESS_TOKEN": "apidog_xxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

#### 手順4: 設定を保存

1. 設定ファイルを保存
2. Cursorを再起動（推奨）またはMCPサーバーを再読み込み

### 6. 環境変数を使用したToken管理（推奨）

セキュリティのため、Tokenを設定ファイルに直接記述せず、環境変数として管理することを推奨します。

#### 方法1: システム環境変数として設定（推奨）

システム環境変数として設定することで、Cursorをどのように起動しても環境変数が読み込まれます。最も確実な方法です。

**Mac/Linux**:

1. **シェル設定ファイルを編集**:
   ```bash
   # .zshrc（zshを使用している場合）または.bash_profile（bashを使用している場合）を開く
   nano ~/.zshrc  # または nano ~/.bash_profile
   ```

2. **環境変数を追加**:
   ```bash
   export APIDOG_ACCESS_TOKEN="apidog_xxxxxxxxxxxxxxxxxxxx"
   ```
   （`apidog_xxxxxxxxxxxxxxxxxxxx`を実際のTokenに置き換えてください）

3. **設定ファイルを読み込み**:
   ```bash
   # zshの場合
   source ~/.zshrc
   
   # bashの場合
   source ~/.bash_profile
   ```

4. **環境変数が設定されたか確認**:
   ```bash
   echo $APIDOG_ACCESS_TOKEN
   # Tokenが表示されればOK
   ```

**Windows**:

1. **コマンドプロンプト（管理者として実行）で環境変数を設定**:
   ```cmd
   setx APIDOG_ACCESS_TOKEN "apidog_xxxxxxxxxxxxxxxxxxxx" /M
   ```
   （`apidog_xxxxxxxxxxxxxxxxxxxx`を実際のTokenに置き換えてください）
   
   **注意**: `/M`オプションはシステム環境変数として設定します（管理者権限が必要）。ユーザー環境変数として設定する場合は、`/M`を削除してください。

2. **新しいコマンドプロンプトまたはPowerShellを開いて確認**:
   ```cmd
   echo %APIDOG_ACCESS_TOKEN%
   # または
   set APIDOG_ACCESS_TOKEN
   ```

**重要な注意事項**:

- システム環境変数を設定した後、**Cursorを完全に再起動**してください（すべてのウィンドウを閉じて再度起動）
- 環境変数の変更は、Cursorを含むすべてのアプリケーションに影響します
- Tokenは秘密情報のため、他人と共有しないでください

#### 方法2: MCP設定ファイルから環境変数を削除

設定ファイルから`APIDOG_ACCESS_TOKEN`を削除し、システム環境変数から自動的に読み込まれるようにします：

```json
{
  "mcpServers": {
    "apidog": {
      "command": "npx",
      "args": [
        "-y",
        "apidog-mcp-server@latest",
        "--project=1234567890abcdef"
      ]
    }
  }
}
```

システム環境変数`APIDOG_ACCESS_TOKEN`が自動的に使用されます。

#### チーム開発時の推奨事項

チームでMCP設定ファイルを共有する場合：

1. **設定ファイルからTokenを削除**: 上記の方法2を使用
2. **各メンバーが環境変数を設定**: 各メンバーのマシンで`APIDOG_ACCESS_TOKEN`を設定
3. **`.gitignore`に追加**: 設定ファイルにTokenが含まれている場合は、`.gitignore`に追加

### 7. 動作確認方法

MCPサーバーの設定が正しく行われているか確認します。

#### 確認手順

1. **Cursorを再起動**（設定変更後）
2. **AIエージェントモードでテスト**:
   - CursorのAIチャットを開く
   - 以下のように指示します：
     ```
     MCPを介してApidogプロジェクトのAPI仕様を取得し、プロジェクトに存在するエンドポイントの数を教えてください。
     ```
3. **結果の確認**:
   - AIがApidogプロジェクトのAPI情報を返すと、接続が成功しています
   - エラーメッセージが表示される場合は、[トラブルシューティング](#トラブルシューティング)セクションを参照

#### 接続確認の別の方法

CursorのMCP設定画面で、MCPサーバーの状態を確認できます：

1. 設定 → MCPを開く
2. `apidog`サーバーの状態を確認
3. 「接続済み」または「Connected」と表示されていれば成功

### 8. オンプレミス環境での設定

オンプレミス展開のApidogを使用している場合、追加の設定が必要です。

#### 設定方法

MCP設定ファイルに、オンプレミスサーバーのAPIアドレスを追加します：

```json
{
  "mcpServers": {
    "apidog": {
      "command": "npx",
      "args": [
        "-y",
        "apidog-mcp-server@latest",
        "--project=<project-id>",
        "--apidog-api-base-url=<API address of the on-premise server>"
      ],
      "env": {
        "APIDOG_ACCESS_TOKEN": "<access-token>"
      }
    }
  }
}
```

**設定例**:

```json
{
  "mcpServers": {
    "apidog": {
      "command": "npx",
      "args": [
        "-y",
        "apidog-mcp-server@latest",
        "--project=1234567890abcdef",
        "--apidog-api-base-url=https://apidog.company.com"
      ],
      "env": {
        "APIDOG_ACCESS_TOKEN": "apidog_xxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

### 9. MCPサーバーの活用例

Apidog MCPサーバーを設定すると、AIエージェントが以下のようなことを理解できるようになります：

- **APIエンドポイントの一覧**: プロジェクト内のすべてのAPIエンドポイント
- **リクエスト/レスポンスの構造**: 各エンドポイントのパラメータとレスポンス形式
- **認証方式**: 使用されている認証方式（JWT、API Key等）
- **環境変数**: プロジェクトで使用されている環境変数

これにより、AIがより正確なコード生成やAPI開発支援を行うことができます。

## トラブルシューティング

### よくある問題と解決方法

#### 1. リクエストが送信できない

**症状**: 「送信」ボタンをクリックしてもリクエストが送信されない、またはエラーが表示される

**原因と解決方法**:

| 原因 | 解決方法 |
|------|----------|
| サーバーが起動していない | Core Serviceを起動（`make up`または`make rebuild-core`） |
| URLが間違っている | URLを確認し、`{{baseUrl}}`が正しく設定されているか確認 |
| 環境変数が設定されていない | 環境変数（`baseUrl`, `tenantId`）を設定 |
| ポートが使用中 | ポート8080または8081が使用されていないか確認 |

#### 2. 401 Unauthorizedエラー

**症状**: リクエストを送信すると「401 Unauthorized」エラーが返される

**原因と解決方法**:

- **テナントIDヘッダーが不足**: `X-Tenant-ID`ヘッダーが設定されているか確認
- **グローバルヘッダーの設定**: プロジェクト設定でグローバルヘッダーを確認

#### 3. 404 Not Foundエラー

**症状**: リクエストを送信すると「404 Not Found」エラーが返される

**原因と解決方法**:

- **URLが間違っている**: エンドポイントのURLを確認（例: `/api/v1/companies`）
- **APIが実装されていない**: コントローラーにエンドポイントが実装されているか確認
- **サーバーURLが間違っている**: `baseUrl`が正しく設定されているか確認

#### 4. OpenAPI仕様のインポートが失敗する

**症状**: OpenAPI仕様をインポートしようとするとエラーが発生する

**原因と解決方法**:

- **Core Serviceが起動していない**: Core Serviceを起動してから再試行
- **OpenAPI仕様のURLが間違っている**: `http://localhost:8081/v3/api-docs`にアクセスできるか確認
- **ネットワークエラー**: ファイアウォールやプロキシの設定を確認

#### 5. MCPサーバーに接続できない

**症状**: CursorでMCPサーバーに接続できない、またはエラーメッセージが表示される

**原因と解決方法**:

| 原因 | 解決方法 |
|------|----------|
| Node.jsがインストールされていない | Node.js 18以上をインストール（`brew install node`） |
| APIアクセスTokenが間違っている | Tokenを再生成して設定を更新 |
| プロジェクトIDが間違っている | プロジェクトIDを再確認して設定を更新 |
| ネットワークエラー | インターネット接続を確認、オンプレミスの場合は`--apidog-api-base-url`を設定 |

#### 5-1. 「Please provide a token」エラー

**症状**: MCPサーバーに接続しようとすると「Please provide a token」というエラーが表示される

**原因**:

`APIDOG_ACCESS_TOKEN`環境変数が設定されていないか、Cursorが環境変数を読み込めていません。

**解決方法**:

**方法1: システム環境変数として設定（推奨）**

最も確実な方法は、システム環境変数として設定することです。詳細は[環境変数を使用したToken管理](#6-環境変数を使用したtoken管理推奨)セクションの「方法1: システム環境変数として設定」を参照してください。

**Mac/Linux**:
```bash
# .zshrcまたは.bash_profileに追加
export APIDOG_ACCESS_TOKEN="apidog_xxxxxxxxxxxxxxxxxxxx"
```

設定後、ターミナルを再起動するか、以下を実行：
```bash
source ~/.zshrc  # または source ~/.bash_profile
```

**Windows**:
```cmd
setx APIDOG_ACCESS_TOKEN "apidog_xxxxxxxxxxxxxxxxxxxx"
```

**重要**: システム環境変数を設定した後、**Cursorを完全に再起動**してください（すべてのウィンドウを閉じて再度起動）。

**方法2: 環境変数が設定されているか確認**

ターミナルで環境変数が設定されているか確認します：

**Mac/Linux**:
```bash
echo $APIDOG_ACCESS_TOKEN
# Tokenが表示されればOK、何も表示されない場合は設定されていません
```

**Windows**:
```cmd
echo %APIDOG_ACCESS_TOKEN%
# または
set APIDOG_ACCESS_TOKEN
```

**方法3: MCP設定ファイルに直接記述（一時的な解決策）**

セキュリティ上推奨されませんが、一時的な解決策としてMCP設定ファイルに直接記述することもできます：

```json
{
  "mcpServers": {
    "apidog": {
      "command": "npx",
      "args": [
        "-y",
        "apidog-mcp-server@latest",
        "--project=1118600"
      ],
      "env": {
        "APIDOG_ACCESS_TOKEN": "apidog_xxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

**注意**: この方法を使用する場合は、`.gitignore`に`.cursor/mcp.json`が含まれているか確認してください。含まれていない場合は追加することを推奨します。

**確認方法**:

設定後、Cursorを再起動し、MCPサーバーの状態を確認します：

1. 設定 → MCPを開く
2. `apidog`サーバーの状態を確認
3. 「接続済み」または「Connected」と表示されていれば成功

#### 6. 環境変数が反映されない

**症状**: 環境変数を設定したが、リクエストで反映されない

**原因と解決方法**:

- **環境が選択されていない**: 右上の環境選択ドロップダウンで正しい環境を選択
- **変数名が間違っている**: 変数名のスペルを確認（大文字小文字も含む）
- **参照方法が間違っている**: `{{変数名}}`という形式で参照しているか確認

#### 7. ヘッダーが自動追加されない

**症状**: グローバルヘッダーを設定したが、リクエストに追加されない

**原因と解決方法**:

- **グローバルヘッダーの設定場所**: プロジェクト設定の「グローバルヘッダー」を確認
- **環境変数の参照**: ヘッダーの値が`{{tenantId}}`のように環境変数を参照しているか確認
- **リクエストごとの設定**: 個別のリクエストでヘッダーが上書きされていないか確認

#### 8. OpenAPIセキュリティスキームによる変数名問題

**症状**: `X-Tenant-ID`ヘッダーに`{{apiKey}}`という値が送信される、またはログに`tenantId={{apiKey}}`と表示される

**原因**:

OpenAPI仕様で`SecurityScheme.Type.APIKEY`として`X-Tenant-ID`を定義している場合、ApidogがOpenAPI仕様をインポートする際に、デフォルトで`apiKey`という変数名を自動生成します。そのため、`X-Tenant-ID`ヘッダーの値が`{{apiKey}}`として設定され、環境変数が解決されずに文字列のまま送信されてしまいます。

**解決方法**:

**方法A: OpenAPI仕様からセキュリティスキームを削除（推奨）**

1. **`OpenApiConfig.java`を修正**:
   - `addSecurityItem`の呼び出しを削除
   - `components`でのセキュリティスキーム定義を削除
   - 不要になった`SecurityRequirement`と`SecurityScheme`のimportを削除

2. **Core Serviceを再起動**:
   ```bash
   make rebuild-core
   ```

3. **Apidogで設定を変更**:
   - 「TenantHeader」セキュリティスキームを削除（Component → Security Schemes → TenantHeaderを削除）
   - `X-Tenant-ID`をグローバルヘッダーとして設定（値: `{{tenantId}}`）
   - 環境変数`tenantId`を設定（値: `tenant-001`）

4. **OpenAPI仕様を再インポート**:
   - Apidogで「設定」→「データのインポート」→「URLからインポート」を選択
   - URL: `http://localhost:8081/v3/api-docs`
   - インポートを実行

**方法B: Apidog側で環境変数名を変更**

1. **環境設定を開く**:
   - 右上の環境選択ドロップダウンから「環境設定」を開く

2. **グローバルパラメータを確認**:
   - 「グローバルパラメータ」または「変数」タブを開く
   - `apiKey`という変数が存在するか確認

3. **変数名を変更**:
   - `apiKey`を`tenantId`に変更、または新規で`tenantId`を作成（値: `tenant-001`）

4. **グローバルヘッダーを確認**:
   - `X-Tenant-ID`の値が`{{tenantId}}`になっているか確認
   - `{{apiKey}}`になっている場合は`{{tenantId}}`に変更

**確認方法**:

修正後、Apidogからリクエストを送信し、Core Serviceのログを確認します：

```bash
make logs-core
```

ログに正しいテナントIDが出力されれば成功です：

```
TenantInterceptor: テナントIDを設定しました - path=/api/v1/companies, tenantId=tenant-001
```

### 接続エラーの対処法

#### Core Serviceに接続できない

1. **サービスが起動しているか確認**:
   ```bash
   make ps
   # または
   docker compose ps
   ```

2. **ログを確認**:
   ```bash
   make logs-core
   ```

3. **ポートが使用されているか確認**:
   ```bash
   lsof -i :8081
   ```

4. **サービスを再起動**:
   ```bash
   make rebuild-core
   ```

#### Apidog MCPサーバーに接続できない

1. **Node.jsのバージョンを確認**:
   ```bash
   node --version
   # v18以上であることを確認
   ```

2. **npxコマンドが動作するか確認**:
   ```bash
   npx --version
   ```

3. **MCP設定ファイルの構文を確認**:
   - JSONの構文エラーがないか確認
   - カンマや引用符が正しいか確認

4. **Cursorを再起動**:
   - 設定変更後はCursorの再起動が必要な場合があります

5. **環境変数を確認**:
   ```bash
   # Mac/Linux
   echo $APIDOG_ACCESS_TOKEN
   
   # Windows
   echo %APIDOG_ACCESS_TOKEN%
   ```

## まとめ

このガイドでは、Apidogの初期設定から基本的な使い方、そしてApidog MCPサーバーを使用したAI連携までを説明しました。


### 参考資料

- [Apidog公式ドキュメント](https://docs.apidog.com/)
- [Apidog MCPサーバー公式ドキュメント](https://docs.apidog.com/jp/apidog%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E5%86%85%E3%81%AEapi%E4%BB%95%E6%A7%98%E3%82%92apidog-mcp%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E7%B5%8C%E7%94%B1%E3%81%A7ai%E3%81%AB%E6%8E%A5%E7%B6%9A%E3%81%99%E3%82%8B-908769m0)
- [API開発ガイド](api-development-guide.md) - このプロジェクトでのAPI開発手順
- [開発環境構築手順](development-environment-guide.md) - 開発環境の構築方法

### 関連ドキュメント

- [API開発ガイド](api-development-guide.md): API開発の詳細な手順
- [開発環境構築手順](development-environment-guide.md): 開発環境の構築方法
- [Docker使い方ガイド](docker-usage-guide.md): Dockerの使用方法


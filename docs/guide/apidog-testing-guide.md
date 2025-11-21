# Apidogテスト実行ガイド

本ドキュメントでは、エンジニア・案件マッチングシステム（chktn）でのApidogを使用したAPIテストの実行方法について説明します。

## 目次

1. [はじめに](#はじめに)
2. [テストの基本概念](#テストの基本概念)
3. [単体テストの作成](#単体テストの作成)
4. [テストシナリオの作成](#テストシナリオの作成)
5. [リクエスト間のデータ連携](#リクエスト間のデータ連携)
6. [フロー制御の設定](#フロー制御の設定)
7. [テストの実行](#テストの実行)
8. [テストレポートの確認](#テストレポートの確認)
9. [パフォーマンステスト](#パフォーマンステスト)
10. [CI/CD統合](#cicd統合)
11. [テストデータ管理](#テストデータ管理)
12. [プロジェクト内テストのApidog同期](#プロジェクト内テストのapidog同期)
13. [ベストプラクティス](#ベストプラクティス)
14. [トラブルシューティング](#トラブルシューティング)
15. [まとめと参考資料](#まとめと参考資料)

## はじめに

### ドキュメントの目的

このドキュメントは、Apidogを使用したAPIテストの基本的な使い方から、自動テストの作成・運用までを包括的に説明します。主に以下の内容をカバーします：

- 単一リクエストのテスト方法
- 複数リクエストを組み合わせたテストシナリオの作成
- データ連携とフロー制御
- CI/CDパイプラインとの統合
- パフォーマンステスト

### 対象読者

- API開発者
- テストエンジニア
- DevOpsエンジニア
- プロジェクトマネージャー

### Apidogのテスト機能の概要

Apidogは、以下のテスト機能を提供しています：

- **単体テスト**: 各APIリクエストに対する個別のテストケース
- **統合テスト**: 複数のAPIリクエストを組み合わせたテストシナリオ
- **データ駆動テスト**: CSVやJSONデータを使用したバッチテスト
- **パフォーマンステスト**: 負荷テストとスケーラビリティテスト
- **CI/CD統合**: 自動テスト実行のパイプライン統合

### このプロジェクトでのテスト戦略

このプロジェクトでは、以下のテスト戦略を採用しています：

1. **単体テスト**: 各APIエンドポイントの基本的な動作確認
2. **統合テスト**: 複数エンドポイントを組み合わせたワークフローテスト
3. **マルチテナント対応テスト**: テナントIDによる分離が正しく機能することを確認
4. **回帰テスト**: 既存機能が壊れていないことを定期的に確認

## テストの基本概念

### テストケース、テストシナリオ、テストステップの違い

Apidogでは、以下の3つの概念を区別します：

#### テストケース（API Case）

- **定義**: 単一のAPIリクエストに対するテスト
- **用途**: 個別のエンドポイントの動作確認
- **例**: GET `/api/v1/companies` のテスト

#### テストステップ（Test Step）

- **定義**: テストシナリオ内の1つのリクエスト
- **用途**: テストシナリオの構成要素
- **例**: 会社作成→取得→更新の各ステップ

#### テストシナリオ（Test Scenario）

- **定義**: 複数のテストステップを組み合わせた一連のテスト
- **用途**: エンドツーエンドのワークフローテスト
- **例**: 会社の作成から削除までの一連の流れ

### 単体テスト vs 統合テスト

#### 単体テスト

- **目的**: 個別のAPIエンドポイントが正しく動作することを確認
- **範囲**: 1つのリクエストとそのレスポンス
- **例**: 会社一覧取得APIのテスト

#### 統合テスト

- **目的**: 複数のAPIエンドポイントが連携して正しく動作することを確認
- **範囲**: 複数のリクエストとそれらの間のデータ連携
- **例**: 会社作成→取得→更新→削除の一連の流れ

### テストスクリプト（JavaScript）の基本

Apidogでは、Postman SDK互換のJavaScriptを使用してテストスクリプトを記述します。

#### 基本的な構文

```javascript
// テストケースの定義
pm.test("テスト名", function () {
    // アサーション
    pm.response.to.have.status(200);
});

// 変数の設定
pm.environment.set("variableName", "value");

// 変数の取得
var value = pm.environment.get("variableName");

// レスポンスJSONの取得
var jsonData = pm.response.json();
```

#### 主なAPI

- `pm.test()`: テストケースを定義
- `pm.expect()`: アサーション（期待値の検証）
- `pm.response`: レスポンス情報へのアクセス
- `pm.environment`: 環境変数の取得・設定
- `pm.globals`: グローバル変数の取得・設定

## 単体テストの作成

### リクエストごとのテストスクリプト作成

各APIリクエストに対して、テストスクリプトを追加することで、レスポンスを自動的に検証できます。

#### 手順

1. リクエスト画面で「テスト」または「Tests」タブを開く
2. テストスクリプトを記述（JavaScript）
3. リクエスト送信後、自動的にテストが実行される
4. テスト結果が「テスト」タブに表示される

### アサーションの書き方

#### pm.test と pm.expect

Apidogでは、`pm.test()`でテストケースを定義し、`pm.expect()`でアサーションを記述します。

```javascript
// pm.testを使用した基本形
pm.test("ステータスコードが200であること", function () {
    pm.response.to.have.status(200);
});

// pm.expectを使用した詳細な検証
pm.test("レスポンスにidフィールドが含まれること", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData.id).to.be.a('number');
});
```

### レスポンス検証の例

#### ステータスコードの検証

```javascript
// ステータスコードが200であることを確認
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// ステータスコードが201であることを確認（作成成功）
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

// ステータスコードが204であることを確認（削除成功）
pm.test("Status code is 204", function () {
    pm.response.to.have.status(204);
});

// ステータスコードが404であることを確認（エラーケース）
pm.test("Status code is 404", function () {
    pm.response.to.have.status(404);
});
```

#### JSON構造の検証

```javascript
// レスポンスがJSONであることを確認
pm.test("Response is JSON", function () {
    pm.response.to.be.json;
});

// レスポンスの構造を確認（Company APIの例）
pm.test("Response has correct structure", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData).to.have.property('name');
    pm.expect(jsonData).to.have.property('tenantId');
    pm.expect(jsonData).to.have.property('email');
    pm.expect(jsonData).to.have.property('isPublic');
});
```

#### フィールド値の検証

```javascript
// 特定のフィールドの値を検証（Company APIの例）
pm.test("Company name is correct", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.name).to.equal("テスト会社");
});

// フィールドの型を検証
pm.test("ID is a number", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.id).to.be.a('number');
});

// フィールドの存在を確認
pm.test("Email field exists", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('email');
});

// 配列の要素数を検証
pm.test("Response is an array with items", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
    pm.expect(jsonData.length).to.be.above(0);
});
```

#### ヘッダーの検証

```javascript
// レスポンスヘッダーの検証
pm.test("Content-Type is application/json", function () {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

// カスタムヘッダーの検証
pm.test("Custom header exists", function () {
    pm.expect(pm.response.headers.has("X-Custom-Header")).to.be.true;
});
```

### 実践例：Company APIのテスト

#### GET /api/v1/companies（会社一覧取得）

```javascript
// ステータスコードの検証
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// レスポンスがJSON配列であることを確認
pm.test("Response is JSON array", function () {
    pm.response.to.be.json;
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
});

// 各要素の構造を検証
pm.test("Each item has required fields", function () {
    var jsonData = pm.response.json();
    if (jsonData.length > 0) {
        var firstItem = jsonData[0];
        pm.expect(firstItem).to.have.property('id');
        pm.expect(firstItem).to.have.property('name');
        pm.expect(firstItem).to.have.property('tenantId');
    }
});

// レスポンス時間の検証
pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});
```

#### GET /api/v1/companies/{id}（会社取得）

```javascript
// ステータスコードの検証
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// レスポンス構造の検証
pm.test("Response has correct structure", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData).to.have.property('name');
    pm.expect(jsonData).to.have.property('tenantId');
    pm.expect(jsonData).to.have.property('email');
    pm.expect(jsonData).to.have.property('isPublic');
    pm.expect(jsonData).to.have.property('createdAt');
    pm.expect(jsonData).to.have.property('updatedAt');
});

// リクエストパスのIDとレスポンスのIDが一致することを確認
pm.test("ID matches path parameter", function () {
    var jsonData = pm.response.json();
    var pathId = pm.request.url.variables.get('id');
    pm.expect(jsonData.id.toString()).to.equal(pathId);
});

// テナントIDの検証（マルチテナント対応）
pm.test("Tenant ID matches environment variable", function () {
    var jsonData = pm.response.json();
    var expectedTenantId = pm.environment.get("tenantId");
    pm.expect(jsonData.tenantId).to.equal(expectedTenantId);
});
```

#### POST /api/v1/companies（会社作成）

```javascript
// ステータスコードの検証（201 Created）
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

// レスポンス構造の検証
pm.test("Response has correct structure", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData).to.have.property('name');
    pm.expect(jsonData).to.have.property('tenantId');
});

// リクエストボディとレスポンスの値が一致することを確認
pm.test("Request body matches response", function () {
    var requestBody = pm.request.body.raw;
    var requestData = JSON.parse(requestBody);
    var responseData = pm.response.json();
    
    pm.expect(responseData.name).to.equal(requestData.name);
    pm.expect(responseData.email).to.equal(requestData.email);
    pm.expect(responseData.address).to.equal(requestData.address);
});

// 作成されたIDを環境変数に保存（後続のテストで使用）
pm.test("Save created company ID", function () {
    var jsonData = pm.response.json();
    pm.environment.set("lastCreatedCompanyId", jsonData.id);
});
```

#### PUT /api/v1/companies/{id}（会社更新）

```javascript
// ステータスコードの検証
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// 更新された内容がレスポンスに反映されていることを確認
pm.test("Updated data is reflected", function () {
    var requestBody = pm.request.body.raw;
    var requestData = JSON.parse(requestBody);
    var responseData = pm.response.json();
    
    pm.expect(responseData.name).to.equal(requestData.name);
    pm.expect(responseData.email).to.equal(requestData.email);
});

// updatedAtが更新されていることを確認
pm.test("updatedAt is updated", function () {
    var responseData = pm.response.json();
    pm.expect(responseData.updatedAt).to.not.be.null;
});
```

#### DELETE /api/v1/companies/{id}（会社削除）

```javascript
// ステータスコードの検証（204 No Content）
pm.test("Status code is 204", function () {
    pm.response.to.have.status(204);
});

// レスポンスボディが空であることを確認
pm.test("Response body is empty", function () {
    pm.response.to.have.body("");
});
```

## テストシナリオの作成

### テストシナリオの新規作成手順

テストシナリオは、複数のAPIリクエストを組み合わせて一連のワークフローをテストするために使用します。

#### 手順

1. Apidogの左サイドバーから「自動テスト」または「Tests」をクリック
2. 「+ 新規」または「+ New」をクリック
3. 「テストシナリオ」または「Test Scenario」を選択
4. シナリオ名を入力（例: `Company CRUD Flow`）
5. 必要に応じて説明を追加
6. 「作成」または「Create」をクリック

### テストステップの追加方法

テストシナリオを作成したら、テストステップを追加します。

#### 方法1: API仕様からインポート

既存のAPI仕様からリクエストをインポートします。

1. テストシナリオ画面で「ステップを追加」をクリック
2. 「API仕様からインポート」を選択
3. インポートしたいAPIエンドポイントを選択
4. 「追加」をクリック

#### 方法2: APIケースからインポート

事前に設定済みのパラメータを含むAPIケースからインポートします。

1. テストシナリオ画面で「ステップを追加」をクリック
2. 「APIケースからインポート」を選択
3. インポートしたいAPIケースを選択
4. 「追加」をクリック

#### 方法3: カスタムリクエストの追加

特定の要件に合わせてリクエストを一から作成します。

1. テストシナリオ画面で「ステップを追加」をクリック
2. 「カスタムリクエスト」を選択
3. リクエストの詳細を設定：
   - Method（GET、POST、PUT、DELETE等）
   - URL
   - Headers
   - Body（必要に応じて）
4. 「保存」をクリック

#### 方法4: cURLからのインポート

既存のcURLコマンドからリクエストをインポートします。

1. テストシナリオ画面で「ステップを追加」をクリック
2. 「cURLからインポート」を選択
3. cURLコマンドを貼り付け
4. 「インポート」をクリック

### テストステップの順序変更

テストステップの順序は、ドラッグ&ドロップで変更できます。

1. テストステップをクリックして選択
2. 上下の矢印アイコンで移動、またはドラッグ&ドロップで移動

### 実践例：Company CRUDフローのテストシナリオ

以下の例では、Company APIのCRUD操作を一連の流れでテストします。

#### ステップ1: 会社作成

- **Method**: POST
- **URL**: `{{baseUrl}}/api/v1/companies`
- **Body**:
```json
{
  "name": "テスト会社",
  "address": "東京都渋谷区",
  "phone": "03-1234-5678",
  "email": "test@example.com",
  "isPublic": false
}
```

#### ステップ2: 作成された会社の取得

- **Method**: GET
- **URL**: `{{baseUrl}}/api/v1/companies/{{lastCreatedCompanyId}}`
- **注**: `{{lastCreatedCompanyId}}`は、ステップ1のレスポンスから抽出したID

#### ステップ3: 会社情報の更新

- **Method**: PUT
- **URL**: `{{baseUrl}}/api/v1/companies/{{lastCreatedCompanyId}}`
- **Body**:
```json
{
  "name": "更新されたテスト会社",
  "address": "東京都新宿区",
  "phone": "03-9876-5432",
  "email": "updated@example.com",
  "isPublic": true
}
```

#### ステップ4: 会社一覧の取得

- **Method**: GET
- **URL**: `{{baseUrl}}/api/v1/companies`

#### ステップ5: 会社の削除

- **Method**: DELETE
- **URL**: `{{baseUrl}}/api/v1/companies/{{lastCreatedCompanyId}}`

## リクエスト間のデータ連携

### データの受け渡し方法

テストシナリオでは、前のステップのレスポンスからデータを抽出し、次のステップの入力として使用できます。

#### 変数の抽出

前のステップのレスポンスから値を抽出して、環境変数またはグローバル変数に保存します。

**方法1: テストスクリプトで抽出**

```javascript
// レスポンスからIDを抽出して環境変数に保存
pm.test("Extract company ID", function () {
    var jsonData = pm.response.json();
    pm.environment.set("lastCreatedCompanyId", jsonData.id);
});
```

**方法2: 後処理で抽出**

Apidogの後処理機能を使用して、レスポンスから値を自動的に抽出できます。

1. テストステップの「後処理」タブを開く
2. 「変数抽出」を選択
3. 抽出するパスを指定（例: `$.id`）
4. 変数名を指定（例: `lastCreatedCompanyId`）

#### 変数の参照

次のステップで、抽出した変数を参照します。

**URLでの参照**:
```
{{baseUrl}}/api/v1/companies/{{lastCreatedCompanyId}}
```

**リクエストボディでの参照**:
```json
{
  "companyId": "{{lastCreatedCompanyId}}",
  "name": "テスト"
}
```

**ヘッダーでの参照**:
```
Authorization: Bearer {{accessToken}}
```

### 実践例：会社作成→取得→更新の流れ

以下の例では、会社作成→取得→更新の一連の流れでデータを連携します。

#### ステップ1: 会社作成（POST）

**リクエスト**:
- Method: POST
- URL: `{{baseUrl}}/api/v1/companies`
- Body:
```json
{
  "name": "テスト会社",
  "address": "東京都渋谷区",
  "phone": "03-1234-5678",
  "email": "test@example.com",
  "isPublic": false
}
```

**テストスクリプト**:
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Extract company ID", function () {
    var jsonData = pm.response.json();
    pm.environment.set("lastCreatedCompanyId", jsonData.id);
    pm.environment.set("createdCompanyName", jsonData.name);
});
```

#### ステップ2: 作成された会社の取得（GET）

**リクエスト**:
- Method: GET
- URL: `{{baseUrl}}/api/v1/companies/{{lastCreatedCompanyId}}`

**テストスクリプト**:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Retrieved company matches created one", function () {
    var jsonData = pm.response.json();
    var createdName = pm.environment.get("createdCompanyName");
    pm.expect(jsonData.name).to.equal(createdName);
});
```

#### ステップ3: 会社情報の更新（PUT）

**リクエスト**:
- Method: PUT
- URL: `{{baseUrl}}/api/v1/companies/{{lastCreatedCompanyId}}`
- Body:
```json
{
  "name": "更新されたテスト会社",
  "address": "東京都新宿区",
  "phone": "03-9876-5432",
  "email": "updated@example.com",
  "isPublic": true
}
```

**テストスクリプト**:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Company is updated", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.name).to.equal("更新されたテスト会社");
    pm.expect(jsonData.isPublic).to.be.true;
});
```

## フロー制御の設定

### 条件分岐（if）

条件分岐を使用して、特定の条件に基づいてテストステップの実行を制御します。

#### 使用方法

1. テストシナリオ画面で「ロジックコンポーネント」を追加
2. 「If」を選択
3. 条件式を設定
4. 条件が真の場合のステップを追加
5. 必要に応じて「Else」を追加

#### 実践例：エラーハンドリング

```javascript
// If条件: レスポンスステータスが200の場合
if (pm.response.code === 200) {
    // 正常系の処理
    pm.test("Success case", function () {
        var jsonData = pm.response.json();
        pm.expect(jsonData).to.have.property('id');
    });
} else {
    // エラーケースの処理
    pm.test("Error case", function () {
        pm.expect(pm.response.code).to.be.oneOf([400, 404, 500]);
    });
}
```

### ループ処理（for, forEach）

#### for ループ

指定した回数だけテストステップを繰り返し実行します。

**使用例**:
- 複数の会社を作成する
- 負荷テストの準備として、データを大量に作成する

#### forEach ループ

配列の各要素に対してテストステップを実行します。

**使用例**:
- 会社一覧の各要素に対して詳細情報を取得する
- 複数のIDに対して削除を実行する

#### 実践例：複数会社の作成

```javascript
// 複数の会社を作成する例
var companyNames = ["会社A", "会社B", "会社C"];
var createdIds = [];

for (var i = 0; i < companyNames.length; i++) {
    var requestBody = {
        "name": companyNames[i],
        "email": "test" + i + "@example.com",
        "isPublic": false
    };
    
    pm.sendRequest({
        url: pm.environment.get("baseUrl") + "/api/v1/companies",
        method: 'POST',
        header: {
            'Content-Type': 'application/json',
            'X-Tenant-ID': pm.environment.get("tenantId")
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify(requestBody)
        }
    }, function (err, res) {
        if (res.code === 201) {
            var jsonData = res.json();
            createdIds.push(jsonData.id);
        }
    });
}
```

### ロジックコンポーネントの活用

Apidogでは、以下のロジックコンポーネントを使用できます：

- **If**: 条件分岐
- **For**: 指定回数の繰り返し
- **ForEach**: 配列の各要素に対する繰り返し
- **While**: 条件が真の間繰り返し
- **Wait**: 指定時間待機

## テストの実行

### 単一リクエストのテスト実行

個別のリクエストに対してテストを実行します。

#### 手順

1. リクエストを選択
2. 環境を選択（右上の環境選択ドロップダウン）
3. 「送信」または「Send」ボタンをクリック
4. テスト結果が「テスト」タブに表示される

#### テスト結果の確認

- **成功**: 緑色のチェックマーク
- **失敗**: 赤色の×マーク
- **詳細**: 各テストケースの詳細を確認可能

### テストシナリオの実行

テストシナリオ全体を実行します。

#### 手順

1. テストシナリオを選択
2. 環境を選択
3. 「実行」または「Run」ボタンをクリック
4. 実行オプションを設定（必要に応じて）
5. 「実行開始」をクリック

#### 実行オプション

- **環境選択**: 実行する環境（local、staging等）
- **並列実行**: 複数のステップを並列で実行するか
- **エラー時の動作**: エラーが発生した場合の動作（続行/停止）
- **リトライ**: 失敗した場合のリトライ回数

### 環境の選択と切り替え

テスト実行時には、適切な環境を選択する必要があります。

#### 環境の選択方法

1. 右上の環境選択ドロップダウンをクリック
2. 使用する環境を選択（例: `local`、`staging`）
3. 選択した環境の変数が自動的に適用される

#### 環境ごとの設定

各環境では、以下の変数が設定されています：

- `baseUrl`: APIのベースURL
- `tenantId`: テナントID

詳細は[Apidog使用ガイド](apidog-usage-guide.md#環境変数と設定の管理)を参照してください。

## テストレポートの確認

### レポートの見方

テスト実行後、詳細なレポートが生成されます。

#### レポートの構成

- **概要**: テスト全体の結果（成功/失敗数、実行時間等）
- **ステップごとの結果**: 各テストステップの詳細
- **ログ**: リクエスト/レスポンスの詳細ログ
- **エラー情報**: エラーが発生した場合の詳細

### 成功/失敗の判定

#### 成功の条件

- すべてのテストケースが成功
- ステータスコードが期待通り
- アサーションがすべて通過

#### 失敗の原因

- **ステータスコードエラー**: 期待したステータスコードと異なる
- **アサーションエラー**: 期待値と実際の値が一致しない
- **ネットワークエラー**: リクエストが送信できない
- **タイムアウト**: リクエストがタイムアウトした

### 詳細なログの確認

#### リクエストログ

- **Method**: HTTPメソッド
- **URL**: リクエストURL
- **Headers**: リクエストヘッダー
- **Body**: リクエストボディ

#### レスポンスログ

- **Status**: HTTPステータスコード
- **Headers**: レスポンスヘッダー
- **Body**: レスポンスボディ
- **Time**: レスポンス時間

### エラーの分析

#### よくあるエラーと対処法

**401 Unauthorized**:
- 原因: テナントIDヘッダーが不足している
- 対処: `X-Tenant-ID`ヘッダーが設定されているか確認

**404 Not Found**:
- 原因: URLが間違っている、またはリソースが存在しない
- 対処: URLとパスパラメータを確認

**400 Bad Request**:
- 原因: リクエストボディの形式が正しくない
- 対処: リクエストボディの形式を確認

**500 Internal Server Error**:
- 原因: サーバー側のエラー
- 対処: サーバーログを確認

## パフォーマンステスト

### パフォーマンステストの設定

Apidogでは、APIのパフォーマンスを評価するためのパフォーマンステスト機能を提供しています。

#### 設定手順

1. テストシナリオを選択
2. 「パフォーマンステスト」タブを開く
3. 以下の設定を行う：
   - **同時接続数**: 同時に実行するリクエスト数
   - **実行時間**: テストの実行時間
   - **リクエスト間隔**: リクエスト間の待機時間

### 負荷テストの実行

#### 負荷テストの種類

- **軽負荷**: 少数の同時接続で動作確認
- **中負荷**: 通常の使用状況を想定した負荷
- **高負荷**: ピーク時の負荷を想定

#### 実行手順

1. パフォーマンステストの設定を完了
2. 「実行」ボタンをクリック
3. リアルタイムでパフォーマンス指標を確認
4. テスト完了後、レポートを確認

### 結果の分析

#### パフォーマンス指標

- **レスポンス時間**: 平均、最小、最大、中央値
- **スループット**: 1秒あたりのリクエスト数
- **エラー率**: エラーが発生したリクエストの割合
- **同時接続数**: 同時に処理されたリクエスト数

#### ボトルネックの特定

- レスポンス時間が長いエンドポイントを特定
- エラー率が高いエンドポイントを特定
- リソース使用率が高いエンドポイントを特定

## CI/CD統合

### Apidog CLIの使用方法

Apidog CLIを使用することで、コマンドラインからテストを実行できます。

#### インストール

Apidog CLIは、Apidogアプリケーションに含まれている場合があります。または、以下の方法でインストールできます。

**注意**: Apidog CLIの詳細なインストール方法は、公式ドキュメントを参照してください。

#### 基本的な使用方法

```bash
# テストシナリオの実行
apidog run <scenario-id> --env <environment-name>

# テスト結果のエクスポート
apidog run <scenario-id> --env <environment-name> --report <report-file>

# 環境変数の指定
apidog run <scenario-id> --env <environment-name> --var tenantId=tenant-001
```

### CI/CDパイプラインへの統合方法

#### GitHub Actionsでの実行例

```yaml
name: API Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  api-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install Apidog CLI
      run: |
        npm install -g @apidog/cli
    
    - name: Run API tests
      run: |
        apidog run <scenario-id> \
          --env local \
          --var baseUrl=http://localhost:8080 \
          --var tenantId=tenant-001
      env:
        APIDOG_ACCESS_TOKEN: ${{ secrets.APIDOG_ACCESS_TOKEN }}
    
    - name: Upload test results
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: test-results
        path: test-results/
```

#### Jenkinsでの実行例

```groovy
pipeline {
    agent any
    
    environment {
        APIDOG_ACCESS_TOKEN = credentials('apidog-access-token')
    }
    
    stages {
        stage('API Tests') {
            steps {
                sh '''
                    npm install -g @apidog/cli
                    apidog run <scenario-id> \
                      --env staging \
                      --var baseUrl=https://api-staging.example.com \
                      --var tenantId=tenant-001
                '''
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'test-results/**', fingerprint: true
        }
    }
}
```

### 注意事項

- **認証情報の管理**: APIアクセスTokenは、シークレット管理機能を使用して安全に管理してください
- **環境の準備**: CI/CD環境でテストを実行する前に、必要な環境（データベース、サービス等）が起動していることを確認してください
- **テスト結果の保存**: テスト結果をアーティファクトとして保存し、後から確認できるようにしてください

## テストデータ管理

### 環境変数の活用

環境変数を使用して、テストデータを管理します。

#### 環境変数の設定

- **baseUrl**: APIのベースURL
- **tenantId**: テナントID
- **testCompanyId**: テスト用の会社ID
- **testEmail**: テスト用のメールアドレス

詳細は[Apidog使用ガイド](apidog-usage-guide.md#環境変数と設定の管理)を参照してください。

### テストデータセットの作成

#### CSVデータセット

CSVファイルを使用して、複数のテストデータを定義できます。

**例: `test-companies.csv`**
```csv
name,address,phone,email,isPublic
会社A,東京都渋谷区,03-1111-1111,company-a@example.com,false
会社B,東京都新宿区,03-2222-2222,company-b@example.com,true
会社C,東京都港区,03-3333-3333,company-c@example.com,false
```

#### JSONデータセット

JSONファイルを使用して、より複雑なテストデータを定義できます。

**例: `test-companies.json`**
```json
[
  {
    "name": "会社A",
    "address": "東京都渋谷区",
    "phone": "03-1111-1111",
    "email": "company-a@example.com",
    "isPublic": false
  },
  {
    "name": "会社B",
    "address": "東京都新宿区",
    "phone": "03-2222-2222",
    "email": "company-b@example.com",
    "isPublic": true
  }
]
```

### データドリブンテスト

データセットを使用して、同じテストシナリオを複数のデータで実行できます。

#### 設定手順

1. テストシナリオを選択
2. 「データセット」タブを開く
3. CSVまたはJSONファイルをインポート
4. データセットを選択
5. テストを実行

#### 実践例

データセットを使用して、複数の会社を作成・検証するテスト：

1. CSVファイルから会社データを読み込む
2. 各データに対して会社作成APIを呼び出す
3. 作成された会社が正しいことを検証する

## プロジェクト内テストのApidog同期

### 概要

プロジェクト内でテストを作成してApidogに同期する方法について説明します。Apidogでは、複数の方法でテストを管理・同期できます。

### 同期方法の比較

| 方法 | 説明 | メリット | デメリット | 推奨度 |
|------|------|----------|------------|--------|
| **OpenAPI仕様からのインポート** | OpenAPI仕様からAPI定義とテストシナリオを自動生成 | コード変更に自動追従、一貫性が保たれる | テストスクリプトは手動で追加が必要 | ⭐⭐⭐⭐⭐ |
| **テストデータセットのインポート** | CSV/JSONファイルからテストデータをインポート | データ駆動テストが容易 | テストロジックはApidog内で作成 | ⭐⭐⭐⭐ |
| **Apidog CLIによる同期** | CLIツールを使用してテストを実行・管理 | CI/CD統合が容易 | テスト定義はApidog内で管理 | ⭐⭐⭐⭐ |
| **テストファイルのエクスポート/インポート** | Apidogからテストをエクスポートしてプロジェクトに保存 | バージョン管理が可能 | 手動での同期が必要 | ⭐⭐⭐ |

### 方法1: OpenAPI仕様からの自動インポート（推奨）

この方法では、Spring BootのOpenAPI仕様からAPI定義を自動的にインポートし、Apidog内でテストを作成・管理します。

#### ワークフロー

1. **OpenAPI仕様の生成**
   - Core Serviceを起動すると、`http://localhost:8081/v3/api-docs`でOpenAPI仕様が自動生成されます
   - 詳細は[OpenAPI仕様のインポート](apidog-usage-guide.md#openapi仕様のインポート)を参照

2. **Apidogへのインポート**
   - URLから直接インポート: `http://localhost:8081/v3/api-docs`
   - 定期インポートを設定することで、コード変更に自動追従

3. **テストスクリプトの追加**
   - Apidog内で各APIリクエストに対してテストスクリプトを追加
   - テストスクリプトはApidog内で管理

#### メリット

- **自動同期**: コード変更時にOpenAPI仕様が更新され、Apidogに再インポート可能
- **一貫性**: API定義とテストが常に同期された状態を保てる
- **保守性**: API定義の変更がテストに自動的に反映される

#### 注意事項

- テストスクリプト（JavaScript）はApidog内で手動で追加する必要があります
- テストスクリプトはApidogのプロジェクト内で管理されます

### 方法2: テストデータセットのインポート

プロジェクト内でテストデータ（CSV/JSON）を作成し、Apidogにインポートしてデータ駆動テストを実行します。

#### ワークフロー

1. **テストデータファイルの作成**

   プロジェクト内にテストデータファイルを作成します：

   **例: `docs/test-data/test-companies.csv`**
   ```csv
   name,address,phone,email,isPublic
   会社A,東京都渋谷区,03-1111-1111,company-a@example.com,false
   会社B,東京都新宿区,03-2222-2222,company-b@example.com,true
   会社C,東京都港区,03-3333-3333,company-c@example.com,false
   ```

   **例: `docs/test-data/test-companies.json`**
   ```json
   [
     {
       "name": "会社A",
       "address": "東京都渋谷区",
       "phone": "03-1111-1111",
       "email": "company-a@example.com",
       "isPublic": false
     },
     {
       "name": "会社B",
       "address": "東京都新宿区",
       "phone": "03-2222-2222",
       "email": "company-b@example.com",
       "isPublic": true
     }
   ]
   ```

2. **Apidogへのインポート**

   - Apidogのテストシナリオ画面で「データセット」タブを開く
   - CSVまたはJSONファイルをインポート
   - データセットを選択してテストを実行

3. **テストスクリプトでのデータ参照**

   ```javascript
   // データセットから値を取得
   var companyName = pm.iterationData.get("name");
   var companyEmail = pm.iterationData.get("email");
   
   // リクエストボディで使用
   var requestBody = {
       "name": companyName,
       "email": companyEmail,
       "isPublic": pm.iterationData.get("isPublic") === "true"
   };
   ```

#### メリット

- **バージョン管理**: テストデータをGitで管理できる
- **再利用性**: 同じデータセットを複数のテストで使用可能
- **保守性**: データの変更が容易

#### 推奨ディレクトリ構造

```
docs/
└── test-data/
    ├── companies.csv
    ├── companies.json
    ├── engineers.csv
    └── projects.json
```

### 方法3: Apidog CLIによる同期

Apidog CLIを使用して、コマンドラインからテストを実行・管理します。

#### ワークフロー

1. **Apidog CLIのインストール**

   ```bash
   npm install -g @apidog/cli
   ```

2. **テストの実行**

   ```bash
   # テストシナリオの実行
   apidog run <scenario-id> --env local
   
   # テスト結果のエクスポート
   apidog run <scenario-id> --env local --report test-results.json
   ```

3. **CI/CDパイプラインへの統合**

   詳細は[CI/CD統合](#cicd統合)セクションを参照してください。

#### メリット

- **自動化**: CI/CDパイプラインに統合可能
- **レポート生成**: テスト結果をJSON形式でエクスポート可能
- **環境変数の指定**: コマンドラインから環境変数を指定可能

### 方法4: テストファイルのエクスポート/インポート

Apidogからテストをエクスポートしてプロジェクトに保存し、バージョン管理することができます。

#### ワークフロー

1. **Apidogからテストをエクスポート**

   - Apidogのテストシナリオ画面で「エクスポート」を選択
   - 形式を選択（Postman Collection、OpenAPI等）
   - ファイルを保存

2. **プロジェクトに保存**

   ```
   docs/
   └── apidog-tests/
       ├── company-crud.postman_collection.json
       └── engineer-tests.postman_collection.json
   ```

3. **必要に応じて再インポート**

   - Apidogの「インポート」機能を使用
   - エクスポートしたファイルをインポート

#### メリット

- **バージョン管理**: テスト定義をGitで管理できる
- **共有**: チームメンバーとテスト定義を共有可能

#### デメリット

- **手動同期**: 変更時に手動でエクスポート/インポートが必要
- **二重管理**: Apidogとプロジェクトの両方で管理する必要がある

### 推奨されるワークフロー

このプロジェクトでは、以下のワークフローを推奨します：

1. **API定義の管理**: OpenAPI仕様からApidogに自動インポート（定期インポート設定）
2. **テストスクリプトの管理**: Apidog内でテストスクリプトを作成・管理
3. **テストデータの管理**: プロジェクト内にCSV/JSONファイルとして保存し、Apidogにインポート
4. **CI/CD統合**: Apidog CLIを使用してCI/CDパイプラインでテストを実行

#### ディレクトリ構造の例

```
docs/
├── test-data/              # テストデータ（CSV/JSON）
│   ├── companies.csv
│   ├── engineers.csv
│   └── projects.json
└── apidog-tests/           # エクスポートしたテスト（オプション）
    └── backups/
```

### 注意事項

- **テストスクリプトの管理**: テストスクリプト（JavaScript）はApidog内で管理されます。プロジェクト内で直接編集することはできません
- **同期のタイミング**: OpenAPI仕様の変更後は、Apidogに再インポートする必要があります（定期インポートを設定している場合は自動）
- **テストデータの更新**: プロジェクト内のテストデータを更新した場合、Apidogに再インポートする必要があります

### まとめ

プロジェクト内でテストを作成してApidogに同期する方法は複数ありますが、このプロジェクトでは以下の方法を推奨します：

1. **API定義**: OpenAPI仕様からの自動インポート（定期インポート設定）
2. **テストスクリプト**: Apidog内で作成・管理
3. **テストデータ**: プロジェクト内にCSV/JSONとして保存し、Apidogにインポート
4. **CI/CD**: Apidog CLIを使用して自動テスト実行

この方法により、API定義とテストデータはバージョン管理でき、テストスクリプトはApidog内で効率的に管理できます。

## ベストプラクティス

### テスト設計の原則

#### 1. 明確なテスト目的

各テストケースには、明確な目的があるべきです。

- 正常系の動作確認
- 異常系のエラーハンドリング確認
- 境界値の確認

#### 2. 独立性の維持

テストケースは、他のテストケースに依存しないように設計します。

- テストデータの準備とクリーンアップを適切に行う
- 環境変数の使用を最小限にする

#### 3. 再利用性の向上

共通の処理は、再利用可能な形で定義します。

- 共通のテストスクリプトを作成
- 環境変数を使用して柔軟性を確保

### 保守しやすいテストの書き方

#### 1. 意味のあるテスト名

```javascript
// 悪い例
pm.test("Test 1", function () { ... });

// 良い例
pm.test("会社作成APIは201ステータスコードを返す", function () { ... });
```

#### 2. 適切なコメント

```javascript
// 会社IDを環境変数に保存（後続のテストで使用）
pm.environment.set("lastCreatedCompanyId", jsonData.id);
```

#### 3. エラーハンドリング

```javascript
pm.test("Company creation", function () {
    pm.response.to.have.status(201);
    
    if (pm.response.code === 201) {
        var jsonData = pm.response.json();
        pm.environment.set("lastCreatedCompanyId", jsonData.id);
    } else {
        console.log("Failed to create company: " + pm.response.text());
    }
});
```

### テストの組織化

#### 1. フォルダ構造

```
Tests/
├── Company/
│   ├── 01_Company_Create.apitest
│   ├── 02_Company_Get.apitest
│   ├── 03_Company_Update.apitest
│   └── 04_Company_Delete.apitest
├── Engineer/
└── Project/
```

#### 2. 命名規則

- **テストケース**: `{Entity}_{Action}_{ExpectedResult}.apitest`
- **テストシナリオ**: `{Entity}_CRUD_Flow.apitest`
- **変数**: `lastCreated{Entity}Id`

### 命名規則

#### 変数名

- **環境変数**: `camelCase`（例: `lastCreatedCompanyId`）
- **グローバル変数**: `UPPER_SNAKE_CASE`（例: `DEFAULT_TENANT_ID`）

#### テスト名

- **日本語**: 動作を明確に表現（例: `会社作成APIは201ステータスコードを返す`）
- **英語**: プロジェクトの規約に従う（例: `Company creation returns 201 status code`）

## トラブルシューティング

### よくある問題と解決方法

#### 1. テストが実行されない

**症状**: テストスクリプトを追加したが、テストが実行されない

**原因と解決方法**:
- **原因**: テストスクリプトの構文エラー
- **解決**: スクリプトの構文を確認し、エラーを修正

#### 2. 変数が取得できない

**症状**: 前のステップで設定した変数が取得できない

**原因と解決方法**:
- **原因**: 環境変数とグローバル変数の混同
- **解決**: 変数の種類を確認し、適切な方法で取得

#### 3. アサーションが失敗する

**症状**: アサーションが期待通りに動作しない

**原因と解決方法**:
- **原因**: レスポンスの形式が期待と異なる
- **解決**: レスポンスの実際の形式を確認し、アサーションを修正

#### 4. データ連携がうまくいかない

**症状**: 前のステップのデータを次のステップで使用できない

**原因と解決方法**:
- **原因**: 変数の抽出タイミングが間違っている
- **解決**: テストスクリプトで変数を抽出するタイミングを確認

### テストが失敗する原因の特定

#### デバッグのヒント

1. **ログを確認**: リクエスト/レスポンスのログを詳細に確認
2. **ステップごとに実行**: テストシナリオ全体ではなく、個別のステップを実行
3. **変数の値を確認**: 環境変数の値が正しいか確認
4. **エラーメッセージを確認**: エラーメッセージから原因を特定

#### よくあるエラー

**ReferenceError: variable is not defined**:
- 原因: 変数が定義されていない
- 解決: 変数の定義を確認

**TypeError: Cannot read property 'id' of undefined**:
- 原因: レスポンスが期待した形式でない
- 解決: レスポンスの形式を確認

**AssertionError: expected 200 to equal 201**:
- 原因: ステータスコードが期待と異なる
- 解決: 実際のステータスコードを確認

### デバッグのヒント

#### 1. コンソールログの活用

```javascript
// デバッグ情報を出力
console.log("Response:", pm.response.json());
console.log("Environment variable:", pm.environment.get("tenantId"));
```

#### 2. テストスクリプトの段階的な追加

1. 基本的なアサーションから開始
2. 段階的に複雑な検証を追加
3. 各段階でテストを実行し、動作を確認

#### 3. レスポンスの確認

```javascript
// レスポンスの内容を確認
pm.test("Debug response", function () {
    var jsonData = pm.response.json();
    console.log("Full response:", JSON.stringify(jsonData, null, 2));
});
```

## まとめと参考資料

### まとめ

このドキュメントでは、Apidogを使用したAPIテストの基本的な使い方から、自動テストの作成・運用までを説明しました。

主なポイント：

1. **単体テスト**: 各APIエンドポイントに対する個別のテスト
2. **テストシナリオ**: 複数のAPIリクエストを組み合わせた統合テスト
3. **データ連携**: リクエスト間でのデータの受け渡し
4. **フロー制御**: 条件分岐やループを使用した複雑なテストフロー
5. **CI/CD統合**: 自動テスト実行のパイプライン統合

### 関連ドキュメント

- [Apidog使用ガイド](apidog-usage-guide.md): Apidogの基本的な使い方
- [API開発ガイド](api-development-guide.md): API開発の詳細な手順
- [開発環境構築手順](development-environment-guide.md): 開発環境の構築方法

### Apidog公式ドキュメント

- [Apidog公式ドキュメント](https://docs.apidog.com/)
- [Apidogテスト機能ガイド](https://docs.apidog.com/jp/apidog%E3%81%A7%E3%81%AE%E8%87%AA%E5%8B%95%E3%83%86%E3%82%B9%E3%83%88-599176m0)
- [Apidogテストシナリオ作成ガイド](https://docs.apidog.com/jp/%E3%83%86%E3%82%B9%E3%83%88%E3%82%B7%E3%83%8A%E3%83%AA%E3%82%AA%E3%81%AE%E4%BD%9C%E6%88%90-599311m0)

### 次のステップ

1. 基本的なテストケースを作成し、実行してみる
2. テストシナリオを作成し、複数のAPIを連携してテストする
3. データドリブンテストを実装し、複数のデータでテストする
4. CI/CDパイプラインに統合し、自動テストを実行する


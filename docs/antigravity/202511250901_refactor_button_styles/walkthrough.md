# 修正内容の確認 (Walkthrough)

## 変更概要
`docs/design/wireframe` 以下のHTML およびJavaScriptファイルにあるボタンのクラスを、以下のルールに従って統一しました。

## ボタンの種類とCSSのルール
- **btn-primary**: 新規作成、編集、追加
- **btn-info**: 検索
- **btn-success**: 保存、更新、面談申込
- **btn-warning**: リセット、問い合わせ
- **btn-danger**: 削除
- **btn-secondary**: その他（すべて見る、詳細、詳細を見る、など）

## 主な変更内容

### 1. 検索ボタン: btn-primary → btn-info
- すべての検索フォーム内の「検索」ボタン
- モーダル内の検索ボタン
- **変更例**: `engineer-search.html`, `project-search.html`, `admin-tenant-list.html` など
```html
<!-- Before -->
<button type="submit" class="btn btn-primary search-form-submit">検索</button>

<!-- After -->
<button type="submit" class="btn btn-info search-form-submit">検索</button>
```

### 2. 保存・更新ボタン: btn-primary → btn-success
- サイドバーの「更新」「保存」ボタン
- **変更例**: `engineer-edit.html`
```html
<!-- Before -->
<button class="btn btn-primary sidebar-save-btn">更新</button>

<!-- After -->
<button class="btn btn-success sidebar-save-btn">更新</button>
```

### 3. リセットボタン: btn-secondary → btn-warning
- すべての検索フォーム内の「リセット」ボタン
- **変更例**: `engineer-search.html`, `project-search.html` など
```html
<!-- Before -->
<button type="button" class="btn btn-secondary search-form-reset">リセット</button>

<!-- After -->
<button type="button" class="btn btn-warning search-form-reset">リセット</button>
```

### 4. 問い合わせボタン: btn-secondary → btn-warning
- 「問い合わせ」ボタン
- **変更例**: `public-engineer-detail.html`
```html
<!-- Before -->
<button type="button" class="btn btn-secondary sidebar-inquiry-btn">問い合わせ</button>

<!-- After -->
<button type="button" class="btn btn-warning sidebar-inquiry-btn">問い合わせ</button>
```

### 5. 削除ボタン: btn-secondary → btn-danger
- すべてのテーブルやリストの「削除」ボタン
- **変更例**: `engineer-search.html`, `text-value-management.html` など
```html
<!-- Before -->
<button type="button" class="btn btn-secondary btn-sm engineer-delete-btn">削除</button>

<!-- After -->
<button type="button" class="btn btn-danger btn-sm engineer-delete-btn">削除</button>
```

### 6. 編集ボタン: btn-secondary → btn-primary
- テーブル内の「編集」ボタン
- **変更例**: `engineer-search.html`, `text-value-management.html` など
```html
<!-- Before -->
<button type="button" class="btn btn-secondary btn-sm">編集</button>

<!-- After -->
<button type="button" class="btn btn-primary btn-sm">編集</button>
```

### 7. 面談申込ボタン: btn-secondary → btn-success
- 「面談申込」「面談を申し込む」ボタン
- **変更例**: `js/top.js`
```html
<!-- Before -->
<a href="#" class="btn btn-secondary btn-sm">面談申込</a>

<!-- After -->
<a href="#" class="btn btn-success btn-sm">面談申込</a>
```

### 8. 詳細ボタン: btn-secondary/btn-primary → btn-info
- 「詳細を見る」ボタン
- 「詳細/編集」ボタン
- **変更例**: `js/public-engineer-search.js`, `admin-tenant-list.html`
```html
<!-- Before -->
<a href="#" class="btn btn-secondary btn-sm">詳細を見る</a>
<button class="btn btn-secondary btn-sm">詳細/編集</button>

<!-- After -->
<a href="#" class="btn btn-info btn-sm">詳細を見る</a>
<button class="btn btn-info btn-sm">詳細/編集</button>
```

## 変更対象ファイル数
- HTMLファイル: 約30ファイル
- JavaScriptファイル: 約20ファイル

## 検証結果
- すべてのボタンが定義されたルールに従って適切なクラスに変更されました
- 既存の機能は維持されており、視覚的な変更のみです
- 新規作成、新規登録などのボタンは意図通り `btn-primary` のままです

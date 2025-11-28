# 検索サイドバー追加手順

このドキュメントでは、ワイヤーフレームの各一覧画面に検索サイドバーを追加する手順を説明します。
`client-list.html` での実装を例としています。

## 1. 必要なコンポーネントの読み込み

`<head>` タグ内に `app-sidebar.js` の読み込みを追加します。

```html
<script src="components/app-sidebar.js" type="module"></script>
```

## 2. レイアウト構造の変更

`<body>` 内の構造を以下のように変更します。
`<app-sidebar>` と `<main class="content-area">` を `.main-layout` 内に配置します。

```html
<div class="container">
  <app-header></app-header>

  <div class="main-layout">
    <!-- サイドバーを追加 -->
    <app-sidebar>
      <div class="sidebar-search-form">
          <div class="sidebar-title">検索条件</div>
          <form id="search-form" class="search-form">
              <div class="search-form-actions">
                  <button type="submit" class="btn btn-info search-form-submit">検索</button>
                  <button type="button" class="btn btn-warning search-form-reset">リセット</button>
              </div>

              <!-- 検索項目をここに追加 -->
              <div class="search-form-group">
                  <label for="search-field-1" class="search-form-label">項目名</label>
                  <input type="text" id="search-field-1" name="field-1"
                      class="search-form-input" placeholder="検索プレースホルダー">
              </div>
          </form>
      </div>
    </app-sidebar>
    
    <!-- 既存のコンテンツを main タグで囲む -->
    <main class="content-area">
      <!-- 既存のコンテンツ -->
    </main>
  </div>
</div>
```

## 3. 検索項目のカスタマイズ

`<form id="search-form">` 内に必要な検索項目を追加します。
`client-list.html` では以下の項目を追加しました。

- 会社名
- 法人番号
- 住所

```html
<div class="search-form-group">
    <label for="search-company-name" class="search-form-label">会社名</label>
    <input type="text" id="search-company-name" name="company-name"
        class="search-form-input" placeholder="会社名で検索">
</div>

<div class="search-form-group">
    <label for="search-corporate-number" class="search-form-label">法人番号</label>
    <input type="text" id="search-corporate-number" name="corporate-number" class="search-form-input"
        placeholder="法人番号で検索">
</div>

<div class="search-form-group">
    <label for="search-address" class="search-form-label">住所</label>
    <input type="text" id="search-address" name="address" class="search-form-input"
        placeholder="住所で検索">
</div>
```

## 4. CSSの確認

`css/common.css` または各ページのCSSファイルで、`.main-layout`, `app-sidebar`, `.content-area` のスタイルが正しく定義されていることを確認してください。通常は `common.css` で定義されています。

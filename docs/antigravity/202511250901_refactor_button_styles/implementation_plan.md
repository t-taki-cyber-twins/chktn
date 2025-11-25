# 実装計画: ボタンスタイルのリファクタリング

## 目的
`docs/design/wireframe` 以下のHTMLおよびJavaScriptファイルにあるボタンのクラスを、以下のルールに従って統一する。

## ボタンの種類とCSSのルール
- **btn-primary**: 新規作成、編集、追加
- **btn-info**: 検索
- **btn-success**: 保存、更新、面談申込
- **btn-warning**: リセット、問い合わせ
- **btn-danger**: 削除
- **btn-secondary**: その他（すべて見る、詳細、詳細を見る、など）

## 変更対象

### 対象ディレクトリ
- `docs/design/wireframe/*.html`
- `docs/design/wireframe/js/*.js`
- `docs/design/wireframe/components/*.js`

### 主な変更パターン

#### 検索ボタン: btn-primary → btn-info
- 現在多くの検索ボタンが `btn-primary` を使用しているため、`btn-info` に変更

#### 保存・更新ボタン: btn-primary → btn-success
- 「保存」「更新」などのボタンを `btn-success` に変更

#### リセットボタン: btn-secondary → btn-warning
- 「リセット」ボタンを `btn-warning` に変更

#### 問い合わせボタン: btn-secondary → btn-warning
- 「問い合わせ」ボタンを `btn-warning` に変更

#### 削除ボタン: btn-secondary → btn-danger
- 「削除」ボタンを `btn-danger` に変更

#### 編集ボタン: btn-secondary → btn-primary
- 「編集」ボタン（単独の場合）を `btn-primary` に変更

#### 面談申込ボタン: btn-secondary → btn-success
- 「面談申込」「面談を申し込む」ボタンを `btn-success` に変更

#### 詳細ボタン: btn-secondary → btn-info
- 「詳細を見る」ボタンを `btn-info` に変更
- 「詳細/編集」ボタンを `btn-info` に変更

## 検証計画
- 変更後、主要なHTMLファイルを手動で確認し、ボタンの色が適切に変更されていることを確認する
- 既存の機能が維持されていることを確認する

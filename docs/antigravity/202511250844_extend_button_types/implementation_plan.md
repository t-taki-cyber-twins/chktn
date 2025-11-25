# 実装計画: ボタン種類の拡張

## 目的
`docs/design/wireframe/css/common.css` にボタンのバリエーション（primary, secondary, info, warning, danger等）を追加し、デザインの表現力を向上させる。

## 変更内容

### `docs/design/wireframe/css/common.css`

以下のクラスを追加する:
- `.btn-success`: 成功 (緑)
- `.btn-info`: 情報 (水色)
- `.btn-warning`: 警告 (黄色)
- `.btn-danger`: 危険 (赤)
- `.btn-light`: ライト (白/グレー)
- `.btn-dark`: ダーク (黒)
- `.btn-link`: リンク風
- 各種 `.btn-outline-*`

## 検証計画
- `common.css` の変更後、コードレビューにて定義が正しいことを確認する。
- 既存の `btn-primary`, `btn-secondary` が維持されていることを確認する。

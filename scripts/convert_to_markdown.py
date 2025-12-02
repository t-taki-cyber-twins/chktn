#!/usr/bin/env python3
"""
指定されたフォルダ以下のファイルをマークダウン化するスクリプト
MarkItDownライブラリを使用
"""
import os
import sys
from pathlib import Path
from markitdown import MarkItDown


def convert_files_to_markdown(input_folder: str, output_folder: str = None):
    """
    指定されたフォルダ内のファイルをマークダウンに変換する
    
    Args:
        input_folder: 変換元のフォルダパス
        output_folder: 出力先フォルダパス（指定がない場合は input_folder/markdown）
    """
    input_path = Path(input_folder)
    
    if not input_path.exists():
        print(f"エラー: フォルダが見つかりません: {input_folder}")
        sys.exit(1)
    
    # 出力フォルダの設定
    if output_folder is None:
        output_path = input_path / "markdown"
    else:
        output_path = Path(output_folder)
    
    # 出力フォルダを作成
    output_path.mkdir(parents=True, exist_ok=True)
    print(f"出力フォルダ: {output_path}")
    
    # MarkItDownインスタンスを作成
    md = MarkItDown()
    
    # 変換対象の拡張子
    supported_extensions = {'.xls', '.xlsx', '.doc', '.docx', '.pdf', '.ppt', '.pptx'}
    
    # フォルダ内のファイルを処理
    converted_count = 0
    error_count = 0
    
    for file_path in input_path.iterdir():
        if file_path.is_file() and file_path.suffix.lower() in supported_extensions:
            try:
                print(f"変換中: {file_path.name}...")
                
                # ファイルを変換
                result = md.convert(str(file_path))
                
                # 出力ファイル名を作成（拡張子を.mdに変更）
                output_file = output_path / f"{file_path.stem}.md"
                
                # NaNとNaTを削除してマークダウンファイルとして保存
                content = result.text_content.replace('NaN', '').replace('NaT', '')
                with open(output_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                print(f"  ✓ 完了: {output_file.name}")
                converted_count += 1
                
            except Exception as e:
                print(f"  ✗ エラー: {file_path.name} - {str(e)}")
                error_count += 1
    
    # 結果を表示
    print(f"\n{'='*50}")
    print(f"変換完了: {converted_count}件")
    if error_count > 0:
        print(f"エラー: {error_count}件")
    print(f"出力先: {output_path}")
    print(f"{'='*50}")


def main():
    """メイン関数"""
    if len(sys.argv) < 2:
        print("使用方法: python convert_to_markdown.py <入力フォルダ> [出力フォルダ]")
        print("例: python convert_to_markdown.py ./temp")
        print("例: python convert_to_markdown.py ./temp ./output")
        sys.exit(1)
    
    input_folder = sys.argv[1]
    output_folder = sys.argv[2] if len(sys.argv) > 2 else None
    
    convert_files_to_markdown(input_folder, output_folder)


if __name__ == "__main__":
    main()

"""
# ファイル一括マークダウン変換スクリプト

## 概要
このスクリプトは、指定されたフォルダ内のファイル（Excel、Word、PDFなど）をMarkItDownライブラリを使用してマークダウン形式に一括変換します。

## 必要な環境
- Python 3.7以上
- pip（Pythonパッケージマネージャー）

## インストール

### 1. MarkItDownライブラリのインストール
```bash
pip3 install 'markitdown[all]'
```

## 使用方法

### 基本的な使い方
```bash
python3 convert_to_markdown.py <入力フォルダ>
```

入力フォルダ内のファイルが変換され、`<入力フォルダ>/markdown`ディレクトリに出力されます。

#### 例
```bash
python3 convert_to_markdown.py temp
```
→ `temp/markdown`に変換結果が出力されます

### 出力先を指定する場合
```bash
python3 convert_to_markdown.py <入力フォルダ> <出力フォルダ>
```

#### 例
```bash
python3 convert_to_markdown.py temp output/markdown
```
→ `output/markdown`に変換結果が出力されます

## 対応ファイル形式
- Excel: `.xls`, `.xlsx`
- Word: `.doc`, `.docx`
- PowerPoint: `.ppt`, `.pptx`
- PDF: `.pdf`

## サンプル実行結果

```bash
出力フォルダ: temp/markdown
変換中: H.M坂戸.xls...
  ✓ 完了: H.M坂戸.md
変換中: S.K祖師ヶ谷大蔵.xls...
  ✓ 完了: S.K祖師ヶ谷大蔵.md
...
==================================================
変換完了: 23件
出力先: temp/markdown
==================================================
```

## トラブルシューティング

### エラー: `MissingDependencyException`
もし以下のようなエラーが出た場合:
```
XlsxConverter threw MissingDependencyException
```

以下のコマンドを実行して、必要な依存関係をすべてインストールしてください:
```bash
pip3 install 'markitdown[all]'
```

### エラー: `フォルダが見つかりません`
入力フォルダのパスが正しいか確認してください。相対パスまたは絶対パスで指定できます。

## スクリプトの機能
- 指定フォルダ内のサポート対象ファイルを自動検出
- マークダウン形式に一括変換
- 変換後にExcelの空セルを表す「NaN」や「NaT」を自動削除（見やすくするため）
- 出力フォルダの自動作成
- 変換結果の詳細表示（成功/失敗件数）
- エラーハンドリング（一部のファイルが失敗してもスクリプトは継続）

## 注意事項
- 変換処理には時間がかかる場合があります（特に大きなファイルや多数のファイルを処理する場合）
- 変換されたマークダウンファイルは、元のファイル名と同じ名前で拡張子が`.md`になります
- 既に同名のマークダウンファイルが存在する場合は上書きされます
"""
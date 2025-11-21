---
allowed-tools: Bash(git worktree:*),Bash(git checkout:*),Bash(git pull origin:*)
description: git worktreeのaddでworktreeを作成。作成ブランチ名、もとになるブランチ名を指定。
---

## 手順

1. 作成ブランチ名（ベースブランチ名）
    - 指定がなければ聞いてください
    - feature/XXX、hotfix/XXXなど「/」が含まれるブランチ名の場合は、後ろの「XXX」部分を{{ベースブランチ名}}とする

2. 派生元ブランチ名
    - 指定がなければ聞いてください

3. 派生元ブランチを最新化
    - `git checkout {{派生元ブランチ名}}`
    - `git pull origin {{派生元ブランチ名}}`

4. 以下コマンドでworktreeを追加
    - 追加する前に下記をユーザに表示して承認を得ること
        - 作成ブランチ名
        - ベースブランチ名
        - 作成場所
        - 派生元ブランチ名
    - `git worktree add -b {{作成ブランチ名}} ../worktree/{{ベースブランチ名}} {{派生元ブランチ名}}` 

5. 必要なフォルダ・ファイルのコピー(ない場合は無視)
    - 下記を`../worktree/{{ベースブランチ名}}`の同フォルダにコピーしてください
        - .claude/settings.local.json
        - .vscode/
        - .serena/project.yml
        - .mcp.json
        - gradle.properties
        - .cursor/mcp.json
        - .env

6. コピー先のファイルの中身を編集
    - `../worktree/{{ベースブランチ名}}/.serena/project.yml`
        - 68行目付近`project_name: "XXX"` -> `project_name: {{ベースブランチ名}}`
    - `../worktree/{{ベースブランチ名}}/.mcp.json`
        - 43行目付近`"/home/taki/sources/XXX"` -> `"/home/taki/sources/worktree/{{ベースブランチ名}}"`

7. 完了後以下の情報を出力
    - 作成されたワークツリーパス
    - 作成されたブランチ名
    - 派生元ブランチ名
    - コピーされたファイル、フォルダ


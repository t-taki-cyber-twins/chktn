---
allowed-tools: Bash(git worktree:*), Bash(mkdir:*), Bash(cp:*), Write, Read
description: jiraのタスク（イシュー）にアクセスしてその情報をもとにgit worktreeでブランチ作成
---

## 手順
1. タスク番号の確認
    - 指定がなければ聞いてください
    - CHKTN-XXXまたはXXXのみの指定で、atlassianのMCPを使用して下記URLからデータを取得してください
        - https://proudgroupkaihatsu.atlassian.net/browse/CHKTN-XXX
            - 例 CHKTN-34または34と言われたら`https://proudgroupkaihatsu.atlassian.net/browse/CHKTN-34`にアクセス
    - 複数指定も可能

2. 内容の表示と作成ブランチ名, ベースブランチ名の提案をしてください
    - 取得したデータを表示してください
    - 下記ブランチ名ルールに則って提案してください
        - feature/chktnXXX_{英語表記タスクの要約}
        - 複数指定の場合
            - 数値が連続していない場合、feature/chktnXXX_YYY_XXX_{英語表記タスクの要約}
            - 数値が連続している場合、feature/chktnXXX-YYY_{英語表記タスクの要約}
    - 変更したい場合は作成ブランチ名の入力を促してください
    - feature/XXX、hotfix/XXXなど「/」が含まれるブランチ名の場合は、後ろの「XXX」部分をベースブランチ名とする

3. 派生元ブランチ名をユーザに聞いてください
    - 派生元ブランチ名のデフォルトは現在のブランチを提案
    - 派生元ブランチ名が決定したらコマンド`/add-worktree`を下記変数を渡して実行してください
        - 作成ブランチ名
        - ベースブランチ名
        - 派生元ブランチ名

4. 取得したjiraの情報をもとにしたドキュメントの作成
    - フォルダを作成
        - `../worktree/{{ベースブランチ名}}/docs/spec/feature/{{ベースブランチ名}}/`
    - そこにatlassianのMCPから取得した情報の要約を記載したドキュメントファイルを作成してください
        - jira.mdという名前で以下を記載
            - リンクURL
                - 複数の場合は複数
            - タイトル
                - 複数の場合は複数
            - 他情報の要約
                - 複数の場合でも何をするべきか1つに要約

5. 完了後以下の情報を出力
    - 作成されたワークツリーパス
    - 作成されたブランチ名
    - 派生元ブランチ名
    - コピーされたファイル、フォルダ
    - 作成したファイル

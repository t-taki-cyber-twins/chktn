# 開発環境構築手順（Mac優先）

本ドキュメントでは、エンジニア・案件マッチングシステムの開発環境をMac上に構築する詳細な手順を説明します。

## 前提条件

- macOS（推奨: macOS 13以降）
- 管理者権限
- インターネット接続

## 1. 必要なツールのインストール

### 1.1 Homebrewのインストール

Homebrewがインストールされていない場合、以下のコマンドでインストールします：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

インストール後、パスを設定します：

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

**確認方法**
```bash
brew --version
# Homebrew 4.x.x が表示されればOK
```

### 1.2 Java 21のインストール

**OpenJDK 21のインストール**
```bash
brew install openjdk@21
```

**JAVA_HOMEの設定**
```bash
# .zshrcに追加（zshを使用している場合）
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 21)' >> ~/.zshrc

# .bash_profileに追加（bashを使用している場合）
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 21)' >> ~/.bash_profile

# 現在のシェルに適用
source ~/.zshrc  # または source ~/.bash_profile
```

**確認方法**
```bash
java -version
# openjdk version "21.0.x" が表示されればOK

echo $JAVA_HOME
# /Library/Java/JavaVirtualMachines/openjdk-21.jdk/Contents/Home が表示されればOK
```

### 1.2.1 Java 8のインストール（既存プロジェクト対応）

既存プロジェクトでJava 8を使用する場合、以下の手順でインストールします。

**OpenJDK 8のインストール**
```bash
brew install openjdk@8
```

**インストール確認**
```bash
# インストールされたJavaバージョンを確認
/usr/libexec/java_home -V

# 出力例:
# Matching Java Virtual Machines (2):
#     21.0.8 (arm64) "Homebrew" - "OpenJDK 21.0.8" /opt/homebrew/Cellar/openjdk@21/21.0.8/libexec/openjdk.jdk/Contents/Home
#     1.8.0_462 (arm64) "Azul Systems, Inc." - "Zulu 8.88.0.19" /Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home
```

### 1.2.2 Javaバージョンの切り替え方法

複数のJavaバージョンを使用する場合、以下の方法でバージョンを切り替えます。

**方法1: jenvを使用したバージョン管理（推奨）**

jenvを使用すると、プロジェクトごとにJavaバージョンを簡単に切り替えられます。

**jenvのインストール**
```bash
brew install jenv
```

**jenvの初期化**
```bash
# zshを使用している場合
echo 'export PATH="$HOME/.jenv/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(jenv init -)"' >> ~/.zshrc
source ~/.zshrc

# bashを使用している場合
echo 'export PATH="$HOME/.jenv/bin:$PATH"' >> ~/.bash_profile
echo 'eval "$(jenv init -)"' >> ~/.bash_profile
source ~/.bash_profile
```

**Javaバージョンの登録**
```bash
# Java 8を登録
jenv add $(/usr/libexec/java_home -v 1.8)

# Java 21を登録
jenv add $(/usr/libexec/java_home -v 21)

# 登録されたバージョンを確認
jenv versions
```

**グローバルバージョンの設定**
```bash
# グローバルにJava 21を設定（デフォルト）
jenv global 21
```

**プロジェクトごとのバージョン設定**
```bash
# プロジェクトディレクトリに移動
cd /path/to/project

# プロジェクトでJava 8を使用する場合
jenv local 1.8

# .java-versionファイルが作成され、プロジェクト内でJava 8が自動的に使用されます
```

**方法2: 手動でのJavaバージョン切り替え**

jenvを使用しない場合、手動でJAVA_HOMEを切り替えます。

**Java 8に切り替え**
```bash
# 一時的にJava 8に切り替え（現在のターミナルセッションのみ）
export JAVA_HOME=$(/usr/libexec/java_home -v 1.8)

# 確認
java -version
# openjdk version "1.8.0_xxx" が表示されればOK
```

**Java 21に切り替え**
```bash
# 一時的にJava 21に切り替え（現在のターミナルセッションのみ）
export JAVA_HOME=$(/usr/libexec/java_home -v 21)

# 確認
java -version
# openjdk version "21.0.x" が表示されればOK
```

**プロジェクトごとの自動切り替え（.java-versionファイル）**

jenvを使用している場合、プロジェクトルートに`.java-version`ファイルを作成することで、自動的にバージョンが切り替わります：

```bash
# プロジェクトディレクトリで
echo "1.8" > .java-version  # Java 8を使用
# または
echo "21" > .java-version   # Java 21を使用
```

このファイルが存在する場合、`cd`コマンドでプロジェクトディレクトリに移動すると、自動的に指定されたJavaバージョンに切り替わります。

### 1.3 Docker Desktopのインストール

**インストール**
```bash
brew install --cask docker
```

**起動と確認**
```bash
# Docker Desktopアプリを起動（Applicationsフォルダから起動）
# または
open -a Docker

# Dockerが起動するまで待機（数分かかる場合があります）
# 起動後、以下で確認
docker --version
# Docker version 24.x.x が表示されればOK

docker ps
# エラーがなければOK
```

**Docker Composeの確認**
```bash
docker compose version
# Docker Compose version v2.x.x が表示されればOK
```

### 1.4 PostgreSQLのインストール（オプション）

Docker ComposeでPostgreSQLを使用する場合は、ローカルインストールは必須ではありませんが、開発ツールとして使用する場合はインストールします：

```bash
brew install postgresql@17
```

**起動（必要な場合）**
```bash
brew services start postgresql@17
```

**確認方法**
```bash
psql --version
# psql (PostgreSQL) 17.x が表示されればOK
```

### 1.5 Gradleのインストール

**インストール**
```bash
brew install gradle
```

**確認方法**
```bash
gradle --version
# Gradle 8.x.x が表示されればOK
```

**注意**: プロジェクトでGradle Wrapper（`./gradlew`）を使用する場合は、システムにインストールされたGradleは使用されませんが、開発ツールとして便利です。

## 2. プロジェクトのセットアップ

### 2.1 新規プロジェクトの作成

プロジェクトを最初から作成する場合の手順です。

**プロジェクトディレクトリの作成**

```bash
# プロジェクトディレクトリを作成
mkdir chktn
cd chktn
```

**Spring Bootプロジェクトの初期化（推奨）**

Spring Bootプロジェクトの場合は、Spring Initializrを使用することを強く推奨します。以下の3つの方法があります。

**方法1: Spring Initializr Web UI（最も簡単・推奨）**

1. [Spring Initializr](https://start.spring.io/) にアクセス
2. 以下の設定を選択：
   - **Project**: Gradle - Groovy（またはGradle - Kotlin）
   - **Language**: Java
   - **Spring Boot**: 最新の安定版（例: 3.2.x）
   - **Project Metadata**:
     - Group: `com.example.chktn`
     - Artifact: `chktn`（またはプロジェクト名）
     - Name: `chktn`
     - Package name: `com.example.chktn`
     - Packaging: `Jar`
     - Java: `21`
3. **Dependencies**を追加：
   - Spring Web
   - Spring Data JPA
   - PostgreSQL Driver
   - Spring Boot DevTools
   - その他必要な依存関係
4. **Generate**ボタンをクリックしてZIPファイルをダウンロード
5. ZIPファイルを解凍してプロジェクトディレクトリに配置

```bash
# ダウンロードしたZIPファイルを解凍
unzip chktn.zip
cd chktn

# 生成されたファイルを確認
ls -la
# build.gradle, settings.gradle, gradlew などが生成されている
```

**生成されるSpring Bootプロジェクトの構造**

```
chktn/
├── build.gradle                    # Gradleビルド設定（Spring Bootプラグイン含む）
├── settings.gradle                 # プロジェクト設定
├── gradlew                         # Gradle Wrapper（既に含まれている）
├── gradlew.bat
├── gradle/
│   └── wrapper/
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/chktn/
│   │   │       └── ChktnApplication.java  # メインクラス
│   │   └── resources/
│   │       ├── application.properties      # アプリケーション設定
│   │       └── static/                    # 静的リソース
│   └── test/
│       └── java/
│           └── com/example/chktn/
│               └── ChktnApplicationTests.java
└── build.gradle
```

**注意事項**

- Spring Initializrで生成されたプロジェクトには、**Gradle Wrapperが既に含まれています**
- そのため、`gradle wrapper`コマンドを実行する必要はありません
- 生成された`build.gradle`には、Spring Bootプラグインと必要な依存関係が既に設定されています

**マルチプロジェクト構成への変更**

Spring Initializrで作成した単一プロジェクトを、マイクロサービスなどのマルチプロジェクト構成に変更する場合の手順です。

**既存プロジェクトの構造確認**

まず、Spring Initializrで作成したプロジェクトの現在の構造を確認します：

```
chktn/
├── build.gradle
├── settings.gradle
├── gradlew
├── gradle/
│   └── wrapper/
├── src/                    # 既存のソースコード（後で移動または削除）
│   ├── main/
│   └── test/
└── build/
```

**マルチプロジェクト構成への変更手順**

1. **既存のsrcディレクトリをバックアップ（必要に応じて）**

```bash
# 既存のsrcディレクトリをバックアップ（必要に応じて）
# 後で適切なサブプロジェクトに移動できます
cp -r src src-backup
```

2. **settings.gradleをマルチプロジェクト用に更新**

```bash
# settings.gradleを編集
cat > settings.gradle << 'EOF'
rootProject.name = 'chktn'

include 'api-gateway'
include 'company-service'
include 'engineer-service'
include 'project-service'
include 'matching-service'
EOF
```

3. **ルートのbuild.gradleをマルチプロジェクト用に更新**

```bash
# build.gradleを編集
cat > build.gradle << 'EOF'
plugins {
    id 'java'
}

allprojects {
    group = 'com.example.chktn'
    version = '1.0.0'
    
    repositories {
        mavenCentral()
    }
}

subprojects {
    apply plugin: 'java'
    apply plugin: 'org.springframework.boot'
    apply plugin: 'io.spring.dependency-management'
    
    sourceCompatibility = '21'
    targetCompatibility = '21'
    
    dependencyManagement {
        imports {
            mavenBom "org.springframework.boot:spring-boot-dependencies:3.2.0"
        }
    }
    
    dependencies {
        // 共通の依存関係をここに追加
    }
}
EOF
```

4. **各サブプロジェクトディレクトリとbuild.gradleを作成**

```bash
# api-gatewayサブプロジェクト
mkdir -p api-gateway/src/main/java/com/example/chktn/apigateway
mkdir -p api-gateway/src/main/resources
mkdir -p api-gateway/src/test/java

cat > api-gateway/build.gradle << 'EOF'
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
    // その他の依存関係
}
EOF

# company-serviceサブプロジェクト
mkdir -p company-service/src/main/java/com/example/chktn/company
mkdir -p company-service/src/main/resources
mkdir -p company-service/src/test/java

cat > company-service/build.gradle << 'EOF'
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.postgresql:postgresql'
    // その他の依存関係
}
EOF

# engineer-serviceサブプロジェクト
mkdir -p engineer-service/src/main/java/com/example/chktn/engineer
mkdir -p engineer-service/src/main/resources
mkdir -p engineer-service/src/test/java

cat > engineer-service/build.gradle << 'EOF'
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.postgresql:postgresql'
    // その他の依存関係
}
EOF

# project-serviceサブプロジェクト
mkdir -p project-service/src/main/java/com/example/chktn/project
mkdir -p project-service/src/main/resources
mkdir -p project-service/src/test/java

cat > project-service/build.gradle << 'EOF'
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.postgresql:postgresql'
    // その他の依存関係
}
EOF

# matching-serviceサブプロジェクト
mkdir -p matching-service/src/main/java/com/example/chktn/matching
mkdir -p matching-service/src/main/resources
mkdir -p matching-service/src/test/java

cat > matching-service/build.gradle << 'EOF'
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.postgresql:postgresql'
    // その他の依存関係
}
EOF
```

**フェーズ1: 初期段階のマルチプロジェクト構成のフォルダ構造**

初期段階では、API GatewayとCore Serviceの2つのサービスで構成します。

```
chktn/
├── build.gradle                    # ルートのビルド設定（共通設定）
├── settings.gradle                 # マルチプロジェクト設定
├── gradlew                         # Gradle Wrapper
├── gradlew.bat
├── gradle/
│   └── wrapper/
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── api-gateway/                    # API Gatewayサブプロジェクト
│   ├── build.gradle
│   └── src/
│       ├── main/
│       │   ├── java/jp/chokutuna/gateway/
│       │   │   └── ApiGatewayApplication.java
│       │   └── resources/
│       │       └── application.yml
│       └── test/
│           └── java/
├── core-service/                   # Core Serviceサブプロジェクト（統合サービス）
│   ├── build.gradle
│   └── src/
│       ├── main/
│       │   ├── java/jp/chokutuna/core/
│       │   │   ├── company/                # 会社管理モジュール
│       │   │   ├── engineer/               # エンジニア管理モジュール
│       │   │   ├── project/                # 案件管理モジュール
│       │   │   ├── matching/               # マッチング・検索モジュール
│       │   │   ├── auth/                  # 認証・アカウント管理モジュール
│       │   │   ├── master/                 # マスタ管理モジュール
│       │   │   ├── notification/           # 通知モジュール（オプション）
│       │   │   ├── common/                # 共通モジュール
│       │   │   │   ├── security/          # セキュリティ共通
│       │   │   │   ├── database/          # データベース共通
│       │   │   │   └── multitenant/       # マルチテナント共通
│       │   │   └── CoreServiceApplication.java
│       │   └── resources/
│       │       ├── application.yml
│       │       └── db/migration/           # Flywayマイグレーションファイル
│       │           ├── V1__create_companies_table.sql
│       │           ├── V2__create_engineers_table.sql
│       │           ├── V3__create_projects_table.sql
│       │           └── ...
│       └── test/
│           └── java/
└── common/                          # 共通ライブラリ（オプション）
    ├── common-security/
    ├── common-database/
    └── common-multitenant/
```

**確認方法**

```bash
# マルチプロジェクト構成を確認
./gradlew projects

# 出力例（フェーズ1）:
# Root project 'chktn'
# +--- Project ':api-gateway'
# +--- Project ':core-service'

# 各サブプロジェクトをビルド
./gradlew build

# 特定のサブプロジェクトをビルド
./gradlew :api-gateway:build
./gradlew :core-service:build
```

**注意事項**

- 既存の`src`ディレクトリは、適切なサブプロジェクトに移動するか削除してください
- 各サブプロジェクトの`build.gradle`には、そのプロジェクトに必要な依存関係のみを追加します
- 共通の依存関係は、ルートの`build.gradle`の`subprojects`ブロックに追加します
- Core Service内では、パッケージ単位でモジュール分離を実施し、将来的なサービス分割を考慮した設計にします
- データベースマイグレーションは、Core Serviceで一元管理します（フェーズ1）

**フェーズ2での拡張**

システムが成長し、サービス分割が必要になった場合、Core Service内のモジュールを独立したサービスに分割します。その際の構成については、`engineer-project-matching-system.md`の「8. プロジェクト構造」セクションを参照してください。

### 2.4 プロジェクトのビルド

**初回ビルド**
```bash
# 依存関係のダウンロードとビルド
./gradlew build

# ビルドが成功すれば、build/ディレクトリが作成されます
```

**ビルドエラーの確認**
```bash
# ビルドログを確認
./gradlew build --info

# クリーンビルド（必要に応じて）
./gradlew clean build
```

## 3. Docker環境の構築

### 3.1 Docker Desktopの設定

**リソース設定**
1. Docker Desktopアプリを起動
2. 設定（Settings）を開く
3. Resourcesタブで以下を設定：
   - **CPU**: 4コア以上推奨
   - **Memory**: 8GB以上推奨
   - **Disk**: 20GB以上推奨

**Docker Composeファイルの確認**
```bash
# docker-compose.ymlが存在するか確認
ls -la docker-compose.yml
```

### 3.2 Docker Composeの起動

**サービスの起動**
```bash
# バックグラウンドで起動
docker compose up -d

# ログを確認
docker compose logs -f
```

**起動確認**
```bash
# 実行中のコンテナを確認
docker compose ps

# 以下のような出力が表示されればOK
# NAME                IMAGE               STATUS
# chktn-postgres-1    postgres:17-alpine  Up
```

**PostgreSQLへの接続確認**
```bash
# PostgreSQLコンテナに接続
docker compose exec postgres psql -U postgres -d chktn_db

# 接続成功後、以下のコマンドで確認
\dt  # テーブル一覧を表示
\q   # 接続を終了
```

### 3.3 データベースの初期化

**Flywayマイグレーションの実行（フェーズ1）**

フェーズ1では、Core Serviceでマイグレーションを一元管理します：

```bash
# Core Serviceのマイグレーション実行
./gradlew :core-service:flywayMigrate
```

**マイグレーションの確認**
```bash
# PostgreSQLに接続してテーブルを確認
docker compose exec postgres psql -U postgres -d chktn_db -c "\dt"

# flyway_schema_historyテーブルを確認
docker compose exec postgres psql -U postgres -d chktn_db -c "SELECT * FROM flyway_schema_history;"
```

## 4. 各サービスの起動

### 4.1 サービス起動方法（フェーズ1）

フェーズ1では、API GatewayとCore Serviceの2つのサービスを起動します。

**方法1: 個別に起動（推奨）**

各サービスを別々のターミナルで起動します：

```bash
# ターミナル1: API Gateway
./gradlew :api-gateway:bootRun

# ターミナル2: Core Service
./gradlew :core-service:bootRun
```

**方法2: Docker Composeで起動**

```bash
# すべてのサービスをDocker Composeで起動
docker compose up

# バックグラウンドで起動
docker compose up -d
```

### 4.2 起動確認（フェーズ1）

**ヘルスチェックエンドポイントの確認**

```bash
# API Gateway
curl http://localhost:8080/actuator/health

# Core Service
curl http://localhost:8081/actuator/health
```

**OpenAPIエンドポイントの確認**

```bash
# OpenAPI JSON仕様を取得
curl http://localhost:8081/v3/api-docs

# Swagger UIをブラウザで開く（Mac）
open http://localhost:8081/swagger-ui.html

# または直接アクセス
# http://localhost:8081/swagger-ui.html
```

**ログの確認（フェーズ1）**
```bash
# 各サービスのログを確認
# ターミナルで起動している場合は、直接ログが表示されます

# Docker Composeで起動している場合
# API Gatewayのログ
docker compose logs -f api-gateway

# Core Serviceのログ
docker compose logs -f core-service

# PostgreSQLのログ
docker compose logs -f postgres

# 全サービスのログ
docker compose logs -f
```

## 5. 開発ツールの設定

### 5.1 VS Codeの設定

**必要な拡張機能**

```bash
# VS Codeを起動して、以下の拡張機能をインストール
# - Extension Pack for Java
# - Spring Boot Extension Pack
# - Docker
# - PostgreSQL
```

**設定ファイル（.vscode/settings.json）**

Java 8とJava 21の両方をサポートする設定：

```json
{
  "java.configuration.runtimes": [
    {
      "name": "JavaSE-1.8",
      "path": "/opt/homebrew/opt/openjdk@8/libexec/openjdk.jdk/Contents/Home",
      "default": false
    },
    {
      "name": "JavaSE-21",
      "path": "/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home",
      "default": true
    }
  ],
  "java.compile.nullAnalysis.mode": "automatic",
  "java.configuration.updateBuildConfiguration": "automatic",
  "java.format.settings.url": "https://raw.githubusercontent.com/google/styleguide/gh-pages/eclipse-java-google-style.xml",
  "java.format.settings.profile": "GoogleStyle",
  "files.exclude": {
    "**/.gradle": true,
    "**/build": true
  }
}
```

**注意**: パスはHomebrewのインストール場所によって異なる場合があります。以下のコマンドで実際のパスを確認してください：

```bash
# Java 8のパスを確認
/usr/libexec/java_home -v 1.8

# Java 21のパスを確認
/usr/libexec/java_home -v 21
```

**プロジェクトごとのJavaバージョン設定**

**方法1: ワークスペース設定で指定**

プロジェクトルートに`.vscode/settings.json`を作成し、プロジェクトごとにJavaバージョンを指定します：

**Java 8を使用するプロジェクトの場合**
```json
{
  "java.configuration.runtimes": [
    {
      "name": "JavaSE-1.8",
      "path": "/opt/homebrew/opt/openjdk@8/libexec/openjdk.jdk/Contents/Home",
      "default": true
    }
  ],
  "java.jdt.ls.java.home": "/opt/homebrew/opt/openjdk@8/libexec/openjdk.jdk/Contents/Home"
}
```

**Java 21を使用するプロジェクトの場合**
```json
{
  "java.configuration.runtimes": [
    {
      "name": "JavaSE-21",
      "path": "/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home",
      "default": true
    }
  ],
  "java.jdt.ls.java.home": "/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home"
}
```

**方法2: .java-versionファイルを使用**

jenvを使用している場合、プロジェクトルートに`.java-version`ファイルを作成すると、VS CodeのJava拡張機能が自動的に認識します：

```bash
# プロジェクトディレクトリで
echo "1.8" > .java-version  # Java 8を使用
# または
echo "21" > .java-version   # Java 21を使用
```

**Javaバージョンの切り替え方法**

1. **コマンドパレットから切り替え**
   - `Cmd + Shift + P`（macOS）でコマンドパレットを開く
   - `Java: Configure Java Runtime`を選択
   - 使用するJavaバージョンを選択

2. **設定から切り替え**
   - `Cmd + ,`で設定を開く
   - `java.jdt.ls.java.home`を検索
   - 使用するJavaのパスを設定

**VS Codeの再起動**

Javaバージョンを変更した後は、VS Codeを再起動することを推奨します：

```bash
# コマンドパレットから
# Developer: Reload Window
```

または、VS Codeを完全に終了して再起動してください。

**タスク設定（.vscode/tasks.json）**

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Gradle: Build",
      "type": "shell",
      "command": "./gradlew",
      "args": ["build"],
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "problemMatcher": ["$gradle"]
    },
    {
      "label": "Docker Compose: Up",
      "type": "shell",
      "command": "docker compose up -d",
      "group": "build"
    },
    {
      "label": "Docker Compose: Down",
      "type": "shell",
      "command": "docker compose down",
      "group": "build"
    }
  ]
}
```

### 5.2 Apidogの設定

**Apidog Desktopのインストール**

1. [Apidog公式サイト](https://apidog.com/)からダウンロード
2. `.dmg`ファイルを開いてインストール
3. Apidogを起動

**プロジェクトの設定**

1. Apidogで新しいプロジェクトを作成
2. `Settings` → `Environments`で環境を追加：
   - **Local環境**
     - Base URL: `http://localhost:8080`
     - 環境変数: `tenantId = company_001`
   - **Staging環境**
     - Base URL: `https://api-staging.example.com`
     - 環境変数: `tenantId = company_001`

**OpenAPI仕様のインポート（フェーズ1）**

フェーズ1では、Core ServiceのOpenAPI仕様をインポートします：

1. Core ServiceのOpenAPI仕様を取得：
   ```bash
   # Core ServiceのOpenAPI仕様を取得
   curl http://localhost:8081/v3/api-docs > core-service-openapi.json
   ```
2. Apidogで`Import` → `OpenAPI`を選択
3. 取得したJSONファイルをインポート

**ヘッダーの設定**

1. `Settings` → `Headers`で共通ヘッダーを設定：
   - `X-Tenant-ID: ${tenantId}`

**APIテストの作成**

1. 各APIエンドポイントでテストケースを作成
2. 環境変数`${tenantId}`を使用してテナントIDを切り替え
3. テストスイートとして実行

## 6. トラブルシューティング

### 6.1 よくある問題と解決方法

**Java 21が見つからない**

```bash
# JAVA_HOMEが正しく設定されているか確認
echo $JAVA_HOME

# 設定されていない場合、再設定
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
```

**Dockerが起動しない**

```bash
# Docker Desktopが起動しているか確認
docker ps

# 起動していない場合、Docker Desktopアプリを起動
open -a Docker

# 起動後、数分待ってから再試行
```

**ポートが既に使用されている**

```bash
# 使用中のポートを確認
lsof -i :8080

# プロセスを終了（プロセスIDを確認してから）
kill -9 <PID>
```

**Gradleビルドが失敗する**

```bash
# キャッシュをクリア
./gradlew clean

# 依存関係を再ダウンロード
rm -rf ~/.gradle/caches
./gradlew build --refresh-dependencies
```

**PostgreSQLに接続できない**

```bash
# Dockerコンテナが起動しているか確認
docker compose ps

# 起動していない場合、起動
docker compose up -d postgres

# 接続情報を確認
docker compose exec postgres env | grep POSTGRES
```

**Flywayマイグレーションが失敗する（フェーズ1）**

```bash
# データベースの状態を確認
docker compose exec postgres psql -U postgres -d chktn_db -c "SELECT * FROM flyway_schema_history;"

# マイグレーションをリセット（注意: データが削除されます）
docker compose exec postgres psql -U postgres -d chktn_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
./gradlew :core-service:flywayMigrate
```

### 6.2 ログの確認方法（フェーズ1）

**各サービスのログ**

```bash
# Gradleで起動している場合、ターミナルに直接表示されます
# Docker Composeで起動している場合

# API Gatewayのログ
docker compose logs -f api-gateway

# Core Serviceのログ
docker compose logs -f core-service

# PostgreSQLのログ
docker compose logs -f postgres

# すべてのサービスのログ
docker compose logs -f
```

**Spring Bootのログ設定**

各サービスの`application.yml`でログレベルを調整できます：

```yaml
logging:
  level:
    root: INFO
    com.example: DEBUG
```

## 7. 開発ワークフロー

### 7.1 通常の開発フロー

1. **リポジトリを更新**
   ```bash
   git pull origin main
   ```

2. **依存関係を更新（必要に応じて）**
   ```bash
   ./gradlew build --refresh-dependencies
   ```

3. **データベースマイグレーション（必要に応じて）**
   ```bash
   ./gradlew flywayMigrate
   ```

4. **サービスを起動**
   ```bash
   ./gradlew :<service-name>:bootRun
   ```

5. **テストを実行**
   ```bash
   ./gradlew test
   ```

### 7.2 デバッグ方法

**VS Codeでのデバッグ**

1. `.vscode/launch.json`を作成してデバッグ設定を追加
2. 各サービスの`Application`クラスをデバッグエントリーポイントとして設定
3. 環境変数やVMオプションを設定（例: `-Dspring.profiles.active=dev`）

**リモートデバッグ**

```bash
# サービス起動時にデバッグポートを有効化
./gradlew :<service-name>:bootRun --debug-jvm
```

VS Codeで`Remote JVM Debug`設定を作成し、ポート5005に接続します。

## 8. 次のステップ

開発環境の構築が完了したら、以下を確認してください：

1. **APIドキュメントの確認**
   - `http://localhost:8080/swagger-ui.html`でAPIドキュメントを確認

2. **APIテストの実行**
   - ApidogでAPIテストを実行して動作確認

3. **コードの理解**
   - プロジェクト構造を確認
   - 各サービスのコードを読む

4. **開発開始**
   - 機能追加や修正を開始

## 9. 参考資料

- [Spring Boot公式ドキュメント](https://spring.io/projects/spring-boot)
- [Gradle公式ドキュメント](https://docs.gradle.org/)
- [Docker公式ドキュメント](https://docs.docker.com/)
- [PostgreSQL公式ドキュメント](https://www.postgresql.org/docs/)
- [Apidog公式ドキュメント](https://help.apidog.com/)


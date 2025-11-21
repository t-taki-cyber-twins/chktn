# Core Service Dockerfile
# ビルドステージ
FROM gradle:8.14-jdk21-alpine AS builder

WORKDIR /app

# Gradleラッパーとビルドファイルをコピー
COPY gradle ./gradle
COPY gradlew ./gradlew
COPY gradlew.bat ./gradlew.bat
COPY build.gradle.kts ./
COPY settings.gradle.kts ./

# Core Serviceのソースコードとビルドファイルをコピー
COPY core-service ./core-service

# 実行権限を付与
RUN chmod +x ./gradlew

# JARファイルをビルド
RUN ./gradlew :core-service:bootJar --no-daemon

# 実行ステージ
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# ビルドされたJARファイルをコピー
COPY --from=builder /app/core-service/build/libs/*.jar app.jar

# ポートを公開
EXPOSE 8081

# アプリケーション起動
# FlywayマイグレーションはSpring Boot起動時に自動実行される
ENTRYPOINT ["java", "-jar", "app.jar"]


# API Gateway Dockerfile
# ビルドステージ
FROM gradle:8.14-jdk21-alpine AS builder

WORKDIR /app

# Gradleラッパーとビルドファイルをコピー
COPY gradle ./gradle
COPY gradlew ./gradlew
COPY gradlew.bat ./gradlew.bat
COPY build.gradle.kts ./
COPY settings.gradle.kts ./

# API Gatewayのソースコードとビルドファイルをコピー
COPY api-gateway ./api-gateway

# 実行権限を付与
RUN chmod +x ./gradlew

# JARファイルをビルド
RUN ./gradlew :api-gateway:bootJar --no-daemon

# 実行ステージ
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# ビルドされたJARファイルをコピー
COPY --from=builder /app/api-gateway/build/libs/*.jar app.jar

# ポートを公開
EXPOSE 8080

# アプリケーション起動
ENTRYPOINT ["java", "-jar", "app.jar"]


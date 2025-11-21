plugins {
	java
	id("org.springframework.boot") version "3.5.7" apply false
	id("io.spring.dependency-management") version "1.1.7" apply false
}

group = "jp.chokutuna"
version = "0.0.1-SNAPSHOT"

// 全サブプロジェクトに共通の設定を適用
subprojects {
	apply(plugin = "java")
	apply(plugin = "org.springframework.boot")
	apply(plugin = "io.spring.dependency-management")

	group = rootProject.group
	version = rootProject.version

	java {
		toolchain {
			languageVersion = JavaLanguageVersion.of(21)
		}
	}

	repositories {
		mavenCentral()
	}

	tasks.withType<Test> {
		useJUnitPlatform()
	}
}

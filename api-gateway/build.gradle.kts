configure<io.spring.gradle.dependencymanagement.dsl.DependencyManagementExtension> {
	imports {
		mavenBom("org.springframework.cloud:spring-cloud-dependencies:2025.0.0")
	}
}

dependencies {
	// Spring Cloud 2025.0の新しいモジュール名を使用
	implementation(libs.spring.cloud.starter.gateway.server.webflux)
	
	// Development
	developmentOnly(libs.spring.boot.devtools)
	
	// Testing
	testImplementation(libs.spring.boot.starter.test)
	testRuntimeOnly(libs.junit.platform.launcher)
}


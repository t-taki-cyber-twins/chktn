plugins {
	alias(libs.plugins.flyway)
}

dependencies {
	// Spring Boot
	implementation(libs.bundles.spring.boot.web)
	
	// Validation
	implementation("org.springframework.boot:spring-boot-starter-validation")
	
	// Database
	runtimeOnly(libs.postgresql)
	
	// Flyway
	implementation(libs.flyway.core)
	implementation(libs.flyway.database.postgresql)
	
	// Lombok
	compileOnly(libs.lombok)
	annotationProcessor(libs.lombok)
	
	// OpenAPI
	implementation(libs.springdoc.openapi.starter.webmvc.ui)
	
	// Development
	developmentOnly(libs.spring.boot.devtools)
	
	// Testing
	testImplementation(libs.spring.boot.starter.test)
	testRuntimeOnly(libs.junit.platform.launcher)
}


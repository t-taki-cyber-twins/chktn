package jp.chokutuna.core.common.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI設定クラス
 * Swagger UIとOpenAPI仕様の生成設定を行います
 */
@Configuration
public class OpenApiConfig {

	@Bean
	public OpenAPI customOpenAPI() {
		return new OpenAPI()
			.info(new Info()
				.title("Core Service API")
				.version("1.0.0")
				.description("エンジニア・案件マッチングシステム Core Service API")
				.contact(new Contact()
					.name("API Support")
					.email("support@example.com"))
				.license(new License()
					.name("Apache 2.0")
					.url("https://www.apache.org/licenses/LICENSE-2.0.html")))
			.servers(List.of(
				new Server().url("http://localhost:8081").description("Local Development Server (Core Service)"),
				new Server().url("http://localhost:8080").description("Local Development Server (API Gateway)")
			));
	}
}


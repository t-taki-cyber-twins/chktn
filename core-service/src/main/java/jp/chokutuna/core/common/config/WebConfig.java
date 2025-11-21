package jp.chokutuna.core.common.config;

import jp.chokutuna.core.common.multitenant.TenantInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web設定クラス
 * インターセプターの登録を行う
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
	
	@Autowired
	private TenantInterceptor tenantInterceptor;
	
	@Override
	public void addInterceptors(@NonNull InterceptorRegistry registry) {
		registry.addInterceptor(tenantInterceptor)
			.addPathPatterns("/api/**");
	}
}


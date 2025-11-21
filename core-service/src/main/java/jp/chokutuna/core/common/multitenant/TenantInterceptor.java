package jp.chokutuna.core.common.multitenant;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * HTTPヘッダーからテナントIDを取得してTenantContextに設定するインターセプター
 */
@Component
public class TenantInterceptor implements HandlerInterceptor {
	
	private static final String TENANT_ID_HEADER = "X-Tenant-ID";
	
	@Value("${app.multitenant.default-tenant-id:}")
	private String defaultTenantId;
	
	@Override
	public boolean preHandle(
			@NonNull HttpServletRequest request,
			@NonNull HttpServletResponse response,
			@NonNull Object handler) {
		
		String tenantId = request.getHeader(TENANT_ID_HEADER);
		if (tenantId != null && !tenantId.isBlank()) {
			TenantContext.setTenantId(tenantId.trim());
		} else if (defaultTenantId != null && !defaultTenantId.isBlank()) {
			// 開発環境用: ヘッダーがない場合、デフォルトテナントIDを使用
			TenantContext.setTenantId(defaultTenantId.trim());
		}
		
		return true;
	}
	
	@Override
	public void afterCompletion(
			@NonNull HttpServletRequest request,
			@NonNull HttpServletResponse response,
			@Nullable Object handler,
			@Nullable Exception ex) {
		// リクエスト処理完了後にテナントIDをクリア
		TenantContext.clear();
	}
}


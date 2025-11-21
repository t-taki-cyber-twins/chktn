package jp.chokutuna.core.common.multitenant;

/**
 * テナントIDを保持するコンテキストクラス
 * ThreadLocalを使用してスレッドごとにテナントIDを保持
 */
public class TenantContext {
	
	private static final ThreadLocal<String> TENANT_ID = new ThreadLocal<>();
	
	/**
	 * 現在のスレッドにテナントIDを設定
	 * @param tenantId テナントID
	 */
	public static void setTenantId(String tenantId) {
		TENANT_ID.set(tenantId);
	}
	
	/**
	 * 現在のスレッドのテナントIDを取得
	 * @return テナントID（設定されていない場合はnull）
	 */
	public static String getTenantId() {
		return TENANT_ID.get();
	}
	
	/**
	 * 現在のスレッドのテナントIDをクリア
	 */
	public static void clear() {
		TENANT_ID.remove();
	}
}


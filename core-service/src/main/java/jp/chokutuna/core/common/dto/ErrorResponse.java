package jp.chokutuna.core.common.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * エラーレスポンスDTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "エラーレスポンス")
public class ErrorResponse {
	
	@Schema(description = "エラーコード", example = "NOT_FOUND")
	private String code;
	
	@Schema(description = "エラーメッセージ", example = "会社が見つかりません: id=1")
	private String message;
}


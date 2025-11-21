package jp.chokutuna.core.company.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Company作成・更新リクエストDTO
 */
@Data
public class CompanyRequest {
	
	@NotBlank(message = "会社名は必須です")
	@Size(max = 255, message = "会社名は255文字以内で入力してください")
	private String name;
	
	@Size(max = 1000, message = "住所は1000文字以内で入力してください")
	private String address;
	
	@Size(max = 50, message = "電話番号は50文字以内で入力してください")
	private String phone;
	
	@Email(message = "メールアドレスの形式が正しくありません")
	@Size(max = 255, message = "メールアドレスは255文字以内で入力してください")
	private String email;
	
	private Boolean isPublic;
}


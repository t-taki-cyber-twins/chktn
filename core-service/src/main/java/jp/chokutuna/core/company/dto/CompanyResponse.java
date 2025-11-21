package jp.chokutuna.core.company.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * CompanyレスポンスDTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyResponse {
	
	private Long id;
	private String tenantId;
	private String name;
	private String address;
	private String phone;
	private String email;
	private Boolean isPublic;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}


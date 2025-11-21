package jp.chokutuna.core.company.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Companyエンティティ
 */
@Entity
@Table(name = "companies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Company {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "tenant_id", nullable = false)
	private String tenantId;
	
	@Column(nullable = false)
	private String name;
	
	@Column(columnDefinition = "TEXT")
	private String address;
	
	@Column(length = 50)
	private String phone;
	
	@Column
	private String email;
	
	@Column(name = "is_public", nullable = false)
	@Builder.Default
	private Boolean isPublic = false;
	
	/**
	 * 作成日時（データベース側でUTC時刻として自動設定）
	 */
	@Column(name = "created_at", nullable = false, insertable = false, updatable = false)
	private LocalDateTime createdAt;
	
	/**
	 * 更新日時（データベース側でUTC時刻として自動更新）
	 */
	@Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
	private LocalDateTime updatedAt;
}


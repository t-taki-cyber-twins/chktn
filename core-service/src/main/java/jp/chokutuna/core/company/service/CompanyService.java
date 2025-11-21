package jp.chokutuna.core.company.service;

import jp.chokutuna.core.common.multitenant.TenantContext;
import jp.chokutuna.core.company.domain.Company;
import jp.chokutuna.core.company.domain.CompanyRepository;
import jp.chokutuna.core.company.dto.CompanyRequest;
import jp.chokutuna.core.company.dto.CompanyResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Companyサービス
 */
@Service
@RequiredArgsConstructor
public class CompanyService {
	
	private final CompanyRepository companyRepository;
	
	/**
	 * 会社一覧を取得（自社の会社のみ）
	 * @return 会社リスト
	 */
	@Transactional(readOnly = true)
	public List<CompanyResponse> findAll() {
		String tenantId = TenantContext.getTenantId();
		if (tenantId == null) {
			throw new IllegalStateException("テナントIDが設定されていません");
		}
		
		return companyRepository.findByTenantId(tenantId).stream()
			.map(this::toResponse)
			.collect(Collectors.toList());
	}
	
	/**
	 * IDで会社を取得（自社の会社のみ）
	 * @param id 会社ID
	 * @return 会社レスポンス
	 * @throws jakarta.persistence.EntityNotFoundException 会社が見つからない場合
	 */
	@Transactional(readOnly = true)
	public CompanyResponse findById(Long id) {
		String tenantId = TenantContext.getTenantId();
		if (tenantId == null) {
			throw new IllegalStateException("テナントIDが設定されていません");
		}
		
		Company company = companyRepository.findByIdAndTenantId(id, tenantId)
			.orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("会社が見つかりません: id=" + id));
		
		return toResponse(company);
	}
	
	/**
	 * 会社を作成
	 * @param request リクエストDTO
	 * @return 作成された会社レスポンス
	 */
	@Transactional
	public CompanyResponse create(CompanyRequest request) {
		String tenantId = TenantContext.getTenantId();
		if (tenantId == null) {
			throw new IllegalStateException("テナントIDが設定されていません");
		}
		
		Company company = Company.builder()
			.tenantId(tenantId)
			.name(request.getName())
			.address(request.getAddress())
			.phone(request.getPhone())
			.email(request.getEmail())
			.isPublic(request.getIsPublic() != null ? request.getIsPublic() : false)
			.build();
		
		Company saved = companyRepository.save(company);
		return toResponse(saved);
	}
	
	/**
	 * 会社を更新
	 * @param id 会社ID
	 * @param request リクエストDTO
	 * @return 更新された会社レスポンス
	 * @throws jakarta.persistence.EntityNotFoundException 会社が見つからない場合
	 */
	@Transactional
	public CompanyResponse update(Long id, CompanyRequest request) {
		String tenantId = TenantContext.getTenantId();
		if (tenantId == null) {
			throw new IllegalStateException("テナントIDが設定されていません");
		}
		
		Company company = companyRepository.findByIdAndTenantId(id, tenantId)
			.orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("会社が見つかりません: id=" + id));
		
		company.setName(request.getName());
		company.setAddress(request.getAddress());
		company.setPhone(request.getPhone());
		company.setEmail(request.getEmail());
		if (request.getIsPublic() != null) {
			company.setIsPublic(request.getIsPublic());
		}
		
		Company updated = companyRepository.save(company);
		return toResponse(updated);
	}
	
	/**
	 * 会社を削除
	 * @param id 会社ID
	 * @throws jakarta.persistence.EntityNotFoundException 会社が見つからない場合
	 */
	@Transactional
	public void delete(Long id) {
		String tenantId = TenantContext.getTenantId();
		if (tenantId == null) {
			throw new IllegalStateException("テナントIDが設定されていません");
		}
		
		Company company = companyRepository.findByIdAndTenantId(id, tenantId)
			.orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("会社が見つかりません: id=" + id));
		
		companyRepository.delete(company);
	}
	
	/**
	 * CompanyエンティティをCompanyResponseに変換
	 * @param company 会社エンティティ
	 * @return 会社レスポンス
	 */
	private CompanyResponse toResponse(Company company) {
		return CompanyResponse.builder()
			.id(company.getId())
			.tenantId(company.getTenantId())
			.name(company.getName())
			.address(company.getAddress())
			.phone(company.getPhone())
			.email(company.getEmail())
			.isPublic(company.getIsPublic())
			.createdAt(company.getCreatedAt())
			.updatedAt(company.getUpdatedAt())
			.build();
	}
}


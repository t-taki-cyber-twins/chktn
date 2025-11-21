package jp.chokutuna.core.company.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Companyリポジトリ
 */
@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
	
	/**
	 * テナントIDで検索
	 * @param tenantId テナントID
	 * @return 会社リスト
	 */
	List<Company> findByTenantId(String tenantId);
	
	/**
	 * テナントIDとIDで検索
	 * @param id 会社ID
	 * @param tenantId テナントID
	 * @return 会社（オプショナル）
	 */
	Optional<Company> findByIdAndTenantId(Long id, String tenantId);
	
	/**
	 * 公開されている会社を検索（全テナント）
	 * @return 公開されている会社リスト
	 */
	@Query("SELECT c FROM Company c WHERE c.isPublic = true")
	List<Company> findPublicCompanies();
	
	/**
	 * テナントIDで検索（公開設定に関係なく）
	 * または公開されている会社を検索
	 * @param tenantId テナントID
	 * @return 会社リスト
	 */
	@Query("SELECT c FROM Company c WHERE c.tenantId = :tenantId OR c.isPublic = true")
	List<Company> findByTenantIdOrPublic(@Param("tenantId") String tenantId);
}


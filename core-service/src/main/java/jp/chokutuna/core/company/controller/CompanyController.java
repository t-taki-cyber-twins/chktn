package jp.chokutuna.core.company.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jp.chokutuna.core.common.dto.ErrorResponse;
import jp.chokutuna.core.company.dto.CompanyRequest;
import jp.chokutuna.core.company.dto.CompanyResponse;
import jp.chokutuna.core.company.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Company RESTコントローラー
 */
@RestController
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
@Tag(name = "Company", description = "会社管理API")
public class CompanyController {
	
	private final CompanyService companyService;
	
	/**
	 * 会社一覧を取得
	 */
	@GetMapping
	@Operation(summary = "会社一覧取得", description = "自社の会社一覧を取得します")
	@ApiResponse(responseCode = "200", description = "取得成功")
	public ResponseEntity<List<CompanyResponse>> findAll() {
		List<CompanyResponse> companies = companyService.findAll();
		return ResponseEntity.ok(companies);
	}
	
	/**
	 * IDで会社を取得
	 */
	@GetMapping("/{id}")
	@Operation(summary = "会社取得", description = "IDを指定して会社情報を取得します")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "取得成功"),
		@ApiResponse(responseCode = "400", description = "リクエストパラメータエラー（IDが数値でない場合など）", 
			content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
		@ApiResponse(responseCode = "404", description = "会社が見つかりません", 
			content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
	})
	public ResponseEntity<CompanyResponse> findById(
			@Parameter(description = "会社ID", required = true, example = "1")
			@PathVariable Long id) {
		CompanyResponse company = companyService.findById(id);
		return ResponseEntity.ok(company);
	}
	
	/**
	 * 会社を作成
	 */
	@PostMapping
	@Operation(summary = "会社作成", description = "新しい会社を作成します")
	@ApiResponses({
		@ApiResponse(responseCode = "201", description = "作成成功"),
		@ApiResponse(responseCode = "400", description = "バリデーションエラー", 
			content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
	})
	public ResponseEntity<CompanyResponse> create(
			@io.swagger.v3.oas.annotations.parameters.RequestBody(
					description = "会社情報",
					required = true,
					content = @Content(schema = @Schema(implementation = CompanyRequest.class))
			)
			@Valid @RequestBody CompanyRequest request) {
		CompanyResponse company = companyService.create(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(company);
	}
	
	/**
	 * 会社を更新
	 */
	@PutMapping("/{id}")
	@Operation(summary = "会社更新", description = "会社情報を更新します")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "更新成功"),
		@ApiResponse(responseCode = "400", description = "バリデーションエラーまたはリクエストパラメータエラー（IDが数値でない場合など）", 
			content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
		@ApiResponse(responseCode = "404", description = "会社が見つかりません", 
			content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
	})
	public ResponseEntity<CompanyResponse> update(
			@Parameter(description = "会社ID", required = true, example = "1")
			@PathVariable Long id,
			@io.swagger.v3.oas.annotations.parameters.RequestBody(
					description = "更新する会社情報",
					required = true,
					content = @Content(schema = @Schema(implementation = CompanyRequest.class))
			)
			@Valid @RequestBody CompanyRequest request) {
		CompanyResponse company = companyService.update(id, request);
		return ResponseEntity.ok(company);
	}
	
	/**
	 * 会社を削除
	 */
	@DeleteMapping("/{id}")
	@Operation(summary = "会社削除", description = "会社を削除します")
	@ApiResponses({
		@ApiResponse(responseCode = "204", description = "削除成功"),
		@ApiResponse(responseCode = "400", description = "リクエストパラメータエラー（IDが数値でない場合など）", 
			content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
		@ApiResponse(responseCode = "404", description = "会社が見つかりません", 
			content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
	})
	public ResponseEntity<Void> delete(
			@Parameter(description = "会社ID", required = true, example = "1")
			@PathVariable Long id) {
		companyService.delete(id);
		return ResponseEntity.noContent().build();
	}
}


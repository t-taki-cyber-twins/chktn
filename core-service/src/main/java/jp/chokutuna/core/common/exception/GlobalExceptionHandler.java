package jp.chokutuna.core.common.exception;

import io.swagger.v3.oas.annotations.Hidden;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import jp.chokutuna.core.common.dto.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

/**
 * グローバル例外ハンドラー
 * アプリケーション全体の例外をハンドリングして、適切なHTTPステータスコードとレスポンスを返す
 */
@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
	
	/**
	 * EntityNotFoundExceptionを404 Not Foundに変換
	 * @param ex 例外
	 * @return エラーレスポンス
	 */
	@ExceptionHandler(EntityNotFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public ResponseEntity<ErrorResponse> handleEntityNotFound(EntityNotFoundException ex) {
		log.warn("Entity not found: {}", ex.getMessage());
		ErrorResponse errorResponse = ErrorResponse.builder()
			.code("NOT_FOUND")
			.message(ex.getMessage())
			.build();
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
	}
	
	/**
	 * IllegalStateExceptionを400 Bad Requestに変換
	 * テナントID未設定などの業務ロジックエラーをハンドリング
	 * @param ex 例外
	 * @return エラーレスポンス
	 */
	@ExceptionHandler(IllegalStateException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ResponseEntity<ErrorResponse> handleIllegalState(IllegalStateException ex) {
		log.warn("Illegal state: {}", ex.getMessage());
		ErrorResponse errorResponse = ErrorResponse.builder()
			.code("BAD_REQUEST")
			.message(ex.getMessage())
			.build();
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
	}
	
	/**
	 * バリデーションエラー（MethodArgumentNotValidException）を400 Bad Requestに変換
	 * @param ex 例外
	 * @return エラーレスポンス
	 */
	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
		log.warn("Validation error: {}", ex.getMessage());
		String message = ex.getBindingResult().getFieldErrors().stream()
			.map(error -> error.getField() + ": " + error.getDefaultMessage())
			.reduce((a, b) -> a + ", " + b)
			.orElse("バリデーションエラーが発生しました");
		
		ErrorResponse errorResponse = ErrorResponse.builder()
			.code("VALIDATION_ERROR")
			.message(message)
			.build();
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
	}
	
	/**
	 * バリデーションエラー（ConstraintViolationException）を400 Bad Requestに変換
	 * @param ex 例外
	 * @return エラーレスポンス
	 */
	@ExceptionHandler(ConstraintViolationException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException ex) {
		log.warn("Constraint violation: {}", ex.getMessage());
		String message = ex.getConstraintViolations().stream()
			.map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
			.reduce((a, b) -> a + ", " + b)
			.orElse("バリデーションエラーが発生しました");
		
		ErrorResponse errorResponse = ErrorResponse.builder()
			.code("VALIDATION_ERROR")
			.message(message)
			.build();
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
	}
	
	/**
	 * パス変数やリクエストパラメータの型変換エラーを400 Bad Requestに変換
	 * @param ex 例外
	 * @return エラーレスポンス
	 */
	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex) {
		log.warn("Type mismatch for parameter '{}': {}", ex.getName(), ex.getMessage());
		Class<?> requiredType = ex.getRequiredType();
		String typeName = requiredType != null ? requiredType.getSimpleName() : "不明";
		String message = String.format("パラメータ '%s' の値 '%s' は型 '%s' に変換できません", 
			ex.getName(), 
			ex.getValue(), 
			typeName);
		
		ErrorResponse errorResponse = ErrorResponse.builder()
			.code("BAD_REQUEST")
			.message(message)
			.build();
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
	}
	
	/**
	 * その他の予期しない例外を500 Internal Server Errorに変換
	 * @param ex 例外
	 * @return エラーレスポンス
	 */
	@ExceptionHandler(Exception.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	@Hidden
	public ResponseEntity<ErrorResponse> handleException(Exception ex) {
		log.error("Unexpected error occurred", ex);
		ErrorResponse errorResponse = ErrorResponse.builder()
			.code("INTERNAL_SERVER_ERROR")
			.message("予期しないエラーが発生しました")
			.build();
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
	}
}


import { DomainValidationError } from 'src/common/error/validation';
import { Result } from 'src/common/types/result';

export class RolePolicy {
  public static validateName(
    name: string,
  ): Result<string, DomainValidationError> {
    let valid = this.validateRequiredString(name, '역할 이름');
    if (!valid.success) return valid;
    valid = this.validateStringPattern(
      name,
      /^[가-힣a-zA-Z0-9\s]+$/g,
      '역할 이름은 한글, 영문, 숫자, 공백만 입력 가능합니다',
    );
    if (!valid.success) return valid;
    valid = this.validateStringLength(
      name,
      3,
      50,
      '역할 이름은 3자 이상 50자 이하여야 합니다',
    );
    if (!valid.success) return valid;

    return valid;
  }

  public static validateCode(
    code: string,
  ): Result<string, DomainValidationError> {
    let valid = this.validateRequiredString(code, '역할 코드');
    if (!valid.success) return valid;
    valid = this.validateStringPattern(
      code,
      /^[A-Z0-9]+$/,
      '역할 코드는 대문자와 숫자로만 이루어져야 합니다',
    );
    if (!valid.success) return valid;
    valid = this.validateStringLength(
      code,
      3,
      20,
      '역할 코드는 3자 이상 20자 이하여야 합니다',
    );
    if (!valid.success) return valid;

    return { success: true, value: code };
  }

  public static validateDescription(
    description?: string,
  ): Result<string, DomainValidationError> {
    if (!description) return { success: true, value: '' };
    const valid = this.validateStringLength(
      description,
      0,
      200,
      '역할 설명은 200자 이하여야 합니다',
    );
    if (!valid.success) return valid;

    return valid;
  }

  // 필수 String 누락 검사
  private static validateRequiredString(
    value: string,
    fieldName: string,
  ): Result<string, DomainValidationError> {
    if (!value || value.trim().length === 0) {
      return {
        success: false,
        error: new DomainValidationError(`${fieldName}은 필수입니다`),
      };
    }
    return { success: true, value };
  }

  private static validateStringPattern(
    value: string,
    pattern: RegExp,
    message?: string,
  ): Result<string, DomainValidationError> {
    if (!pattern.test(value)) {
      return {
        success: false,
        error: new DomainValidationError(
          message || '입력 형식이 올바르지 않습니다',
        ),
      };
    }
    return { success: true, value };
  }

  private static validateStringLength(
    value: string,
    minLength: number,
    maxLength: number,
    message?: string,
  ): Result<string, DomainValidationError> {
    if (value.length < minLength || value.length > maxLength) {
      return {
        success: false,
        error: new DomainValidationError(
          message ||
            `입력은 ${minLength}자 이상 ${maxLength}자 이하여야 합니다`,
        ),
      };
    }
    return { success: true, value };
  }
}

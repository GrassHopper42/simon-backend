import { DomainValidationError } from 'src/common/error/validation';
import { Result } from 'src/common/types/result';

export class RolePolicy {
  public static validateName(
    name: string,
  ): Result<string, DomainValidationError> {
    let valid = this.validateRequiredString(name, '역할 이름');
    if (!valid.success) return valid;
    valid = this.validateNamePattern(name);
    if (!valid.success) return valid;
    valid = this.validateNameLength(name);
    if (!valid.success) return valid;

    return valid;
  }

  public static validateCode(
    code: string,
  ): Result<string, DomainValidationError> {
    this.validateRequiredString(code, '역할 코드');

    if (!/^[A-Z0-9]+$/.test(code)) {
      return {
        success: false,
        error: new DomainValidationError(
          '역할 코드는 대문자와 숫자로만 이루어져야 합니다',
        ),
      };
    }

    if (code.length < 3 || code.length > 20) {
      return {
        success: false,
        error: new DomainValidationError(
          '역할 코드는 3자 이상 20자 이하여야 합니다',
        ),
      };
    }

    return { success: true, value: code };
  }

  public static validateDescription(
    description?: string,
  ): Result<string, DomainValidationError> {
    if (description.length > 200) {
      return {
        success: false,
        error: new DomainValidationError('설명은 200자 이하로 입력해주세요'),
      };
    }
    return { success: true, value: description };
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

  // 이름 규격 검사
  private static validateNamePattern(
    name: string,
  ): Result<string, DomainValidationError> {
    if (!/^[가-힣a-zA-Z0-9\s]+$/g.test(name)) {
      return {
        success: false,
        error: new DomainValidationError(
          '역할 이름은 한글, 영문, 숫자, 공백만 입력 가능합니다',
        ),
      };
    }
    return { success: true, value: name };
  }

  private static validateNameLength(
    name: string,
  ): Result<string, DomainValidationError> {
    if (name.length < 3 || name.length > 50) {
      return {
        success: false,
        error: new DomainValidationError(
          '역할 이름은 3자 이상 50자 이하여야 합니다',
        ),
      };
    }
    return { success: true, value: name };
  }
}

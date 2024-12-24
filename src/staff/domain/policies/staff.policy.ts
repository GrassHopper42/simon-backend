import { DomainValidationError } from 'src/common/error/validation';
import { Result } from 'src/common/types/result';

export class StaffPolicy {
  public static validateName(
    name: string,
  ): Result<string, DomainValidationError> {
    return StaffPolicy.validatePattern(
      name,
      /^[가-힣]{2,5}$/,
      '이름은 2자 이상 5자 이하의 한글로 입력해주세요',
    );
  }

  public static validateEmail(
    email?: string,
  ): Result<string, DomainValidationError> {
    if (!email) return { success: true, value: '' };
    let valid = StaffPolicy.validateLength(
      email,
      10,
      50,
      '이메일은 10자 이상 50자 이하로 입력해주세요',
    );
    if (!valid.success) return valid;

    valid = StaffPolicy.validatePattern(
      email,
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
      '이메일 형식이 올바르지 않습니다',
    );
    if (!valid.success) return valid;

    return valid;
  }

  public static validateNote(
    note?: string,
  ): Result<string, DomainValidationError> {
    if (!note) return { success: true, value: '' };

    return StaffPolicy.validateLength(
      note,
      0,
      200,
      '200자 이하로 입력해주세요',
    );
  }

  private static validateLength(
    value: string,
    min: number,
    max: number,
    message?: string,
  ): Result<string, DomainValidationError> {
    if (value.length < min || value.length > max) {
      return {
        success: false,
        error: new DomainValidationError(
          message || `${min}자 이상 ${max}자 이하로 입력해주세요`,
        ),
      };
    }
    return { success: true, value };
  }

  private static validatePattern(
    value: string,
    pattern: RegExp,
    message?: string,
  ): Result<string, DomainValidationError> {
    if (!pattern.test(value)) {
      return {
        success: false,
        error: new DomainValidationError(message),
      };
    }
    return { success: true, value };
  }
}

import { DomainValidationError } from 'src/common/error/validation';
import { Result } from 'src/common/types/result';

export class StaffPolicy {
  public static validateName(
    name: string,
  ): Result<string, DomainValidationError> {
    // 2자 이상 5자 이하의 한국어 이름
    const namePattern = /^[가-힣]{2,5}$/;
    if (!namePattern.test(name)) {
      return {
        success: false,
        error: new DomainValidationError(
          '이름은 2자 이상 5자 이하의 한글로 입력해주세요',
        ),
      };
    }
    return { success: true, value: name };
  }

  public static validateEmail(
    email: string,
  ): Result<string, DomainValidationError> {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return {
        success: false,
        error: new DomainValidationError('이메일 형식이 올바르지 않습니다'),
      };
    }
    return { success: true, value: email };
  }

  public static validteNote(
    note?: string,
  ): Result<string, DomainValidationError> {
    if (note.length > 200) {
      return {
        success: false,
        error: new DomainValidationError('노트는 200자 이하로 입력해주세요'),
      };
    }
    return { success: true, value: note };
  }
}

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
    const emailPattern =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    if (!emailPattern.test(email)) {
      return {
        success: false,
        error: new DomainValidationError('이메일 형식이 올바르지 않습니다'),
      };
    }
    return { success: true, value: email };
  }

  public static validateNote(
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

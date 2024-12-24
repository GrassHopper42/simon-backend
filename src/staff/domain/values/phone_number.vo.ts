import { DomainValidationError } from 'src/common/error/validation';

export class PhoneNumber {
  private readonly _phone: string;

  constructor(phone: string) {
    phone = this.removeWhitespace(phone);
    phone = this.toUnformattedPhone(phone);
    const validatedPhone = this.validate(phone);

    this._phone = validatedPhone;
  }

  // 전화번호에 대한 규격은 국내로 한정
  private validate(phone: string): string {
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(phone)) {
      throw new DomainValidationError('전화번호 형식이 올바르지 않습니다.');
    }
    return phone;
  }

  private toFormattedPhone(phone: string): string {
    // 휴대폰 번호(11자리)
    if (/^01\d{9}$/.exec(phone)) {
      return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    // 서울 지역번호(02-xxxx-xxxx)
    if (/^02\d{8}$/.exec(phone)) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    // 서울 지역번호(02-xxx-xxxx)
    if (/^02\d{7}$/.exec(phone)) {
      return phone.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    // 지역번호(3자리) + 전화번호(7자리)
    if (/^0\d{2}\d{7}$/.exec(phone)) {
      return phone.replace(/(\d{3})(\d{7})(\d{4})/, '$1-$2-$3');
    }
    return phone;
  }

  private toUnformattedPhone(phone: string): string {
    if (phone.length === 13) {
      return phone.replace(/-/g, '');
    }
    return phone;
  }

  private removeWhitespace(phone: string): string {
    return phone.replace(/\s/g, '');
  }

  get value() {
    return this._phone;
  }

  get formattedValue() {
    return this.toFormattedPhone(this._phone);
  }
}

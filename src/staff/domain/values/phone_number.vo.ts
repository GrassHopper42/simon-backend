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
    if (phone.length === 11) {
      return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
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

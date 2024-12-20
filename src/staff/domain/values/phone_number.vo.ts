export class PhoneNumber {
  private readonly _phone: string;

  constructor(phone: string) {
    phone = this.removeWhitespace(phone);
    phone = this.toUnformattedPhone(phone);
    const validatedPhone = this.validate(phone);

    this._phone = validatedPhone;
  }

  private validate(phone: string): string {
    const phoneRegex = /^\d{10,11}$/;
    if (!phoneRegex.test(phone)) {
      throw new Error('PHONE_NUMBER_INVALID');
    }
    return phone;
  }

  private toFormattedPhone(phone: string): string {
    if (phone.length === 10) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return phone;
  }

  private toUnformattedPhone(phone: string): string {
    if (phone.length === 13) {
      return phone.replace(/-/g, '');
    }
    return phone.replace(/-/g, '');
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

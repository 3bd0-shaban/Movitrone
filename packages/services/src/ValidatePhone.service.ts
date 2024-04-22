// phone-validation.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';

@Injectable()
export class PhoneValidationService {
  // Declare phoneNumberUtil with correct type
  private phoneNumberUtil: PhoneNumberUtil;

  constructor() {
    // Initialize phoneNumberUtil in the constructor
    this.phoneNumberUtil = PhoneNumberUtil.getInstance();
  }

  validatePhoneNumber(value: { number: string; code: string }): string {
    try {
      const { number, code } = value;
      const parsedNumber = this.phoneNumberUtil.parseAndKeepRawInput(
        number,
        code,
      );

      if (this.phoneNumberUtil.isValidNumber(parsedNumber)) {
        return this.phoneNumberUtil.format(
          parsedNumber,
          PhoneNumberFormat.E164, // Use PhoneNumberFormat from the imported library
        );
      } else {
        throw new BadRequestException('Invalid phone number');
      }
    } catch (error) {
      throw new BadRequestException('Invalid phone number');
    }
  }
}

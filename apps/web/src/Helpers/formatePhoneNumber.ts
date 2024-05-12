import phoneUtil from 'google-libphonenumber';

const phoneNumberUtil = phoneUtil.PhoneNumberUtil.getInstance();

export enum PhoneNumberFormat {
  E164 = 'E164', // E164 format: '+123456789012'
  INTERNATIONAL = 'INTERNATIONAL', // International format: '+12 34 5678 9012'
  NATIONAL = 'NATIONAL', // National format: '12 34 5678 9012'
  RFC3966 = 'RFC3966', // RFC3966 format suitable for display in a URL: 'tel:+1-123-456-7890'
  NATIONAL_E164 = 'NATIONAL_E164', // National and E164 format combined: '12 3456789012,+123456789012'
  INTERNATIONAL_E164 = 'INTERNATIONAL_E164', // International and E164 format combined: '+12 3456789012,+123456789012'
  UNKNOWN = 'UNKNOWN', // Unknown format
}

export const formatPhoneNumber = ({
  number,
  code,
  formatType = PhoneNumberFormat.INTERNATIONAL,
}: {
  number?: string;
  code?: string;
  formatType?: PhoneNumberFormat;
}): string => {
  try {
    const formattedNumber = phoneNumberUtil.format(
      phoneNumberUtil.parseAndKeepRawInput(String(number), code),
      phoneUtil.PhoneNumberFormat[
        formatType as keyof typeof phoneUtil.PhoneNumberFormat
      ],
    );
    return formattedNumber;
  } catch (error) {
    console.error('Error formatting phone number:', error);
    return 'N/A'; // Handle case where phone number is not available or cannot be formatted
  }
};

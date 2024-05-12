import phoneUtil from 'google-libphonenumber';
const phoneNumberUtil = phoneUtil.PhoneNumberUtil.getInstance();
export const validatePhoneNumber = (value: {
  number: string;
  code: string;
}) => {
  try {
    const { number, code } = value;
    const parsedNumber = phoneNumberUtil.parseAndKeepRawInput(number, code);

    if (phoneNumberUtil.isValidNumber(parsedNumber)) {
      const formattedNumber = phoneNumberUtil.format(
        parsedNumber,
        phoneUtil.PhoneNumberFormat.E164,
      );
      return formattedNumber;
    } else {
      throw new Error('Invalid phone number');
    }
  } catch (error) {
    throw new Error('Invalid phone number');
  }
};

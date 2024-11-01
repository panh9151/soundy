import validator from "validator";

class Validator {
  // String validations
  static isEmpty(value: string): boolean {
    return validator.isEmpty(value);
  }

  static isLength(
    value: string,
    options: { min?: number; max?: number }
  ): boolean {
    return validator.isLength(value, options);
  }

  static isAlphanumeric(value: string): boolean {
    return validator.isAlphanumeric(value);
  }

  static isAlpha(value: string): boolean {
    return validator.isAlpha(value);
  }

  static isAscii(value: string): boolean {
    return validator.isAscii(value);
  }

  static isBase64(value: string): boolean {
    return validator.isBase64(value);
  }

  static isHexadecimal(value: string): boolean {
    return validator.isHexadecimal(value);
  }

  static isLowercase(value: string): boolean {
    return validator.isLowercase(value);
  }

  static isUppercase(value: string): boolean {
    return validator.isUppercase(value);
  }

  // Number validations
  static isInt(value: string): boolean {
    return validator.isInt(value);
  }

  static isFloat(value: string): boolean {
    return validator.isFloat(value);
  }

  static isNumeric(value: string): boolean {
    return validator.isNumeric(value);
  }

  // Email and URL validations
  static isEmail(value: string): boolean {
    return validator.isEmail(value);
  }

  static isURL(value: string): boolean {
    return validator.isURL(value);
  }

  static isIP(value: string, version?: 4 | 6): boolean {
    return validator.isIP(value, version);
  }

  static isDomain(value: string): boolean {
    return validator.isFQDN(value); // Full Qualified Domain Name
  }

  // Date and time validations
  static isDate(value: string): boolean {
    return validator.isDate(value);
  }

  static isISO8601(value: string): boolean {
    return validator.isISO8601(value);
  }

  static isAfter(value: string, date?: string): boolean {
    return validator.isAfter(value, date);
  }

  static isBefore(value: string, date?: string): boolean {
    return validator.isBefore(value, date);
  }

  // JSON and special data
  static isJSON(value: string): boolean {
    return validator.isJSON(value);
  }

  static isUUID(value: string, version?: "3" | "4" | "5"): boolean {
    return validator.isUUID(value, version);
  }

  static isMongoId(value: string): boolean {
    return validator.isMongoId(value);
  }

  // Credit card and financial validations
  static isCreditCard(value: string): boolean {
    return validator.isCreditCard(value);
  }

  static isCurrency(
    value: string,
    options?: validator.IsCurrencyOptions
  ): boolean {
    return validator.isCurrency(value, options);
  }

  // Other type validations
  static isBoolean(value: string): boolean {
    return validator.isBoolean(value);
  }

  static isMobilePhone(
    value: string,
    locale?: validator.MobilePhoneLocale
  ): boolean {
    return validator.isMobilePhone(value, locale);
  }

  static isBase32(value: string): boolean {
    return validator.isBase32(value);
  }

  static isBase58(value: string): boolean {
    return validator.isBase58(value);
  }

  // Custom checks
  static contains(value: string, seed: string): boolean {
    return validator.contains(value, seed);
  }

  static isPassword(value: string): boolean {
    if (typeof value === "string" && value.length > 6 && value.length < 40) {
      return true;
    } else return false;
  }

  static required(value: any): boolean {
    if (!!value) {
      return true;
    } else return false;
  }
}

export default Validator;

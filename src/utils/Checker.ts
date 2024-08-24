import { NextResponse } from "next/server";
import { objectResponse } from "./Response";
import { throwCustomError } from "./Error";

const validator = require("validator");

class Checker {
  static checkPassword(password: any, isRequired = false) {
    if (isRequired && !password) {
      throwCustomError("Missing password field");
    } else {
      if (!password) return true;
      if (password.length < 6 || password.length > 40) {
        throwCustomError("Password must be between 6 and 40 chars", 400);
      }
    }
    return true;
  }

  static checkEmail(email: any, isRequired = false) {
    if (isRequired && !email) {
      throwCustomError("Missing email field");
    } else {
      if (!email) return true;
      if (!validator.isEmail(email)) {
        throwCustomError("Email invalid form", 400);
      }
    }
    return true;
  }

  static checkPhoneNumber(phone: any, isRequired = false) {
    if (isRequired && !phone) {
      throwCustomError("Missing phone field");
    } else {
      if (!phone) return true;
      if (!/^\d{10,12}$/.test(phone)) {
        throwCustomError("Invalid phone format", 400);
      }
    }
    return true;
  }

  static checkGender(gender: any, isRequired = false) {
    if (isRequired && !gender) {
      throwCustomError("Missing gender field");
    } else {
      if (!gender) return true;
      if (gender !== "male" && gender !== "female") {
        throwCustomError("Invalid gender format", 400);
      }
      return true;
    }
  }

  static checkDate(date: any, isRequired = false) {
    if (isRequired && !date) {
      throwCustomError("Missing date field");
    } else {
      if (!date) return true;
      if (!validator.isISO8601(date)) {
        throwCustomError("Invalid date format", 400);
      }
    }
    return true;
  }

  static checkBoolean(bol: any, isRequired = false) {
    if (isRequired && !bol && typeof bol !== "boolean") {
      throwCustomError("Missing boolean field");
    } else {
      if (!bol) return true;
      if (typeof bol !== "boolean") {
        throwCustomError("Invalid boolean format", 400);
      }
    }
    return true;
  }

  static checkInteger(num: any, isRequired = false) {
    if (isRequired && !num && typeof num !== "number") {
      throwCustomError("Missing password");
    } else {
      if (!num) return true;
      if (!Number.isInteger(num)) {
        throwCustomError("Invalid integer format", 400);
      }
    }
    return true;
  }

  static checkNumber(num: any, isRequired = false) {
    if (isRequired && !num && typeof num !== "number") {
      throwCustomError("Missing password");
    } else {
      if (!num) return true;
      if (typeof num !== "number") {
        throwCustomError("Invalid number format", 400);
      }
    }
    return true;
  }

  static checkString(str: any, isRequired = false) {
    if (isRequired && !str && typeof str !== "string") {
      throwCustomError("Missing password");
    } else {
      if (!str) return true;
      if (typeof str !== "string") {
        throwCustomError("Invalid string format", 400);
      }
    }
  }

  static isEmptyObject(obj: Object) {
    if (obj && Object.keys(obj).length === 0 && obj.constructor === Object) {
      return true;
    }
    throwCustomError("Object is empty", 400);
  }

  static checkRequired(...list: Array<any>) {
    if (
      list.every(
        (value) => value !== null && value !== undefined && value !== ""
      )
    ) {
      return true;
    }
    throwCustomError("Missing required fields", 400);
  }

  static checkIncluded(str: any, arr: Array<any>, isRequired = false) {
    if (isRequired === false && !str) return;

    if (arr.includes(str)) {
      return true;
    }
    throwCustomError("Check included failed", 400);
  }

  static convertJson(arr: Array<any>, ...fields: any) {
    arr.forEach((item) => {
      fields.forEach((field: any) => {
        item[field] = JSON.parse(item[field]);
      });
      return arr;
    });
  }
}

export default Checker;

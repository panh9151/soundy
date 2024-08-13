class Env {
  static PORT: number = parseInt(process.env.PORT || "8181");
  static JWT_CODE: number = parseInt(process.env.JWT_CODE || "81627645173987");

  // Email
  static EMAIL: string = process.env.EMAIL || "panh9151@gmail.com";
  static EMAIL_PASSWORD: string =
    process.env.EMAIL_PASSWORD || "hkqqwkjauvefwlqc";

  // DB
  static DB_HOST: string = process.env.DB_HOST || "103.169.35.190";
  static DB_USER: string = process.env.DB_USER || "tuananh1";
  static DB_PASSWORD: string = process.env.DB_PASSWORD || "Tuananh123";
  static DB_NAME: string = process.env.DB_NAME || "Soundy";

  // Token
  static get ACCESS_TOKEN_SECRET(): Uint8Array {
    return new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET || "abc");
  }

  // Cloudinary
  static CLOUD_FOLDER: string = process.env.CLOUD_FOLDER || "Soundy";
  static CLOUD_URL: string =
    process.env.CLOUD_URL ||
    "https://res.cloudinary.com/dmiaubxsm/image/upload/v1722415903/";
  static CLOUD_NAME: string = process.env.CLOUD_NAME || "dmiaubxsm";
  static CLOUD_API_KEY: string = process.env.CLOUD_API_KEY || "178948511994638";
  static CLOUD_API_SECRET: string =
    process.env.CLOUD_API_SECRET || "ZkBZKKZNVa9zBqTUAl-E0hCWX";

  // Uncomment if needed
  // static FRONEND_HOST: string = process.env.FRONEND_HOST || 'https://localhost:3000/';
}

export default Env;

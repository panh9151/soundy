class User {
  static user(): Array<any> {
    return [
      "first_name",
      "last_name",
      "middle_name",
      "email",
      "avatar_path",
      "phone",
      "gender",
      "age",
      "id_google",
      "role",
    ];
  }

  static admin(): Array<any> {
    return [
      "id_user",
      "first_name",
      "last_name",
      "middle_name",
      "email",
      "avatar_path",
      "phone",
      "gender",
      "role",
      "age",
      "id_google",
      "is_banned",
      "token_reset",
      "expired_token_reset",
    ];
  }
}

class Fields {
  static user(role: string) {
    if (role === "user" || role === "membership") return User.user();
    else if (role === "admin") return User.admin();
  }
}

export default Fields;

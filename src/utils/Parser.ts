export default class Parser {
  static queryObject(str: string[]): string {
    return `
    JSON_OBJECT(
      ${str.join(",\n")}
    )
    `;
  }

  static queryArray(str: string): string {
    return `
    CONCAT('[', GROUP_CONCAT(
      ${str}
    SEPARATOR ','), ']')
    `;
  }

  static convertJson(arr: Array<any>, ...fields: any) {
    arr.forEach((item) => {
      fields.forEach((field: any) => {
        item[field] = JSON.parse(item[field]);
      });
      return arr;
    });
  }

  static filterObjectKeys = (
    obj: Record<string, any>,
    keys: string[]
  ): Record<string, any> => {
    return keys.reduce((result, key) => {
      if (key in obj) {
        result[key] = obj[key as string];
      }
      return result;
    }, {} as Record<string, any>);
  };
}

export const filterObjectKeys = (
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

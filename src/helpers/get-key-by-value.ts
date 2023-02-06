export const getKeyByValue = <T extends object, U extends keyof T>(object: T, value: T[U]): U | null =>
  (Object.keys(object) as Array<U>).find((key) => object[key] === value) || null

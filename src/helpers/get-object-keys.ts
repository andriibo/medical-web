export const getObjectKeys = <T extends object, U extends keyof T>(obj: T): Array<U> => Object.keys(obj) as Array<U>

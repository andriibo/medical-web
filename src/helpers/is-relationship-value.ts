export const isRelationshipValue = <T>(value: T | ''): value is T => (value as T) !== undefined

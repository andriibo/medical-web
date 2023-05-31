export const filterNullable = <T extends number | null>(arr: T[]) =>
  arr.filter((el) => el !== null) as Array<NonNullable<T>>

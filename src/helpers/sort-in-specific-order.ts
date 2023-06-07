export const sortInSpecificOrder = <T extends object, U extends keyof T>(
  sortArr: T[],
  fieldName: U,
  sortOrder: string[],
) => {
  type Ordering = Record<any, number>

  const ordering = <Ordering>{}

  sortArr.forEach((item) => (ordering[item[fieldName] as string] = 99))

  sortOrder.forEach((_, i) => (ordering[sortOrder[i]] = i))

  return [...sortArr].sort((a, b) => ordering[a[fieldName]] - ordering[b[fieldName]])
}

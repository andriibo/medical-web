export const sortByFields = <T extends object, U extends keyof T>(arr: T[], field: U, fieldSecondary?: U) =>
  arr.sort((a, b) => {
    if (a[field] < b[field]) {
      return -1
    }

    if (a[field] > b[field]) {
      return 1
    }

    if (fieldSecondary && a[field] === b[field]) {
      if (a[fieldSecondary] < b[fieldSecondary]) {
        return -1
      }

      if (a[fieldSecondary] > b[fieldSecondary]) {
        return 1
      }
    }

    return 0
  })

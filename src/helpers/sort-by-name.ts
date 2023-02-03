export const sortByName = <T extends { firstName: string; lastName: string }>(arr: T[]) =>
  arr.sort((a, b) => {
    if (a.lastName < b.lastName || a.firstName < b.firstName) {
      return -1
    }

    if (a.lastName > b.lastName || a.firstName > b.firstName) {
      return 1
    }

    return 0
  })

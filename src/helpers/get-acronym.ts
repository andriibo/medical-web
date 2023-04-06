export const getAcronym = (firstName: string, lastName: string): string =>
  firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()

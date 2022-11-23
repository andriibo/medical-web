export const getAcronym = (name: string): string => {
  const nameArr = name.trim().split(' ')

  if (nameArr.length > 1) {
    return nameArr
      .slice(0, 2)
      .map((i) => i.charAt(0))
      .join('')
  }

  return name.slice(0, 2)
}

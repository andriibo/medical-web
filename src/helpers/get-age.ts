export const getAge = (birthString: string) => {
  const birthDate = new Date(birthString)

  const ageDiffMilliseconds = Date.now() - birthDate.getTime()
  const ageDate = new Date(ageDiffMilliseconds)

  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

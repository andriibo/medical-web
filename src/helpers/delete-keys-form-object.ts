export const deleteKeysFormObject = (object: { [key: string]: any }, keys: string[]) => {
  keys.forEach((key) => {
    if (object.hasOwnProperty(key)) {
      delete object[key]
    }
  })

  return object
}

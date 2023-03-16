export const getUrlWithParams = (url: string) => {
  const params = window.location.search

  return url + params
}

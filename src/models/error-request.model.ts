export interface IErrorRequest {
  status: number
  data: {
    error: string
    message: string[] | string
    statusCode: number
  }
}

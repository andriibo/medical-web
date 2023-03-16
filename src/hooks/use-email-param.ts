import { useSearchParams } from 'react-router-dom'

export const useEmailParam = () => {
  const [searchParams] = useSearchParams()

  return searchParams.get('email') || undefined
}

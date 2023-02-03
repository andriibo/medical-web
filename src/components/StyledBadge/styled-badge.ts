import styled from '@emotion/styled'
import { Badge } from '@mui/material'

export const StyledBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    boxShadow: '0 0 0 2px #fff',
    backgroundColor: '#44b700',
    color: 'inherit',
  },
  '& .MuiBadge-colorError': {
    backgroundColor: '#d32f2f',
  },
  '& .MuiBadge-colorWarning': {
    backgroundColor: '#ff9800',
  },
}))

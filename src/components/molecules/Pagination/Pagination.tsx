import { Box, Pagination as PaginationMUI } from '@mui/material'

interface IProps {
  count: number
  page: number
  handleChange: (page: number) => unknown
}

export const Pagination = ({ count, page, handleChange }: IProps) => {
  return (
    <Box
      sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 3 }}
    >
      <PaginationMUI
        color="secondary"
        count={count}
        page={page}
        onChange={(_, value) => handleChange(value)}
        showFirstButton
        showLastButton
      />
    </Box>
  )
}

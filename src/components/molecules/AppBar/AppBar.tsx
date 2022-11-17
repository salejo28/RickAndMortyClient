import { Box, Toolbar, AppBar as AppBarMUI, Typography } from '@mui/material'

export const AppBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBarMUI position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Rick and Morty
          </Typography>
        </Toolbar>
      </AppBarMUI>
    </Box>
  )
}

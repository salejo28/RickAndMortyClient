import {
  Box,
  IconButton,
  Toolbar,
  AppBar as AppBarMUI,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

export const AppBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBarMUI position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Rick and Morty
          </Typography>
        </Toolbar>
      </AppBarMUI>
    </Box>
  )
}

import { Box, Tab, Tabs } from '@mui/material'
import { AppBar } from 'app/components/molecules/AppBar/AppBar'
import { useCurrentPath } from 'app/hooks/useCurrentPath'
import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

export const Layout = ({
  children,
}: {
  children: JSX.Element | JSX.Element[]
}) => {
  const navigate = useNavigate()
  const currentPath = useCurrentPath()

  const handleRoute = (path: string) => {
    navigate(`/${path.replace('/', '')}`)
  }

  return (
    <Fragment>
      <AppBar />
      <div className="container">
        <Box mb={2}>
          <Tabs value={currentPath} onChange={(_, value) => handleRoute(value)}>
            <Tab label={'Characters'} value="/" />
            <Tab label={'Locations'} value="locations" />
            <Tab label={'Episodes'} value="episodes" />
          </Tabs>
        </Box>
        {children}
      </div>
    </Fragment>
  )
}

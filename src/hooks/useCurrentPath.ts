import { routes } from 'app/router'
import { matchRoutes, useLocation } from 'react-router-dom'

export const useCurrentPath = () => {
  const location = useLocation()
  const match = matchRoutes(routes, location)

  if (!match) return ''

  return match[0].route.path
}

import { createBrowserRouter } from 'react-router-dom'
import { Characters, Episodes, Locations } from 'app/pages'

export const routes = [
  {
    path: '/',
    element: <Characters />,
  },
  {
    path: 'locations',
    element: <Locations />,
  },
  {
    path: 'episodes',
    element: <Episodes />,
  },
]

export const router = createBrowserRouter(routes)

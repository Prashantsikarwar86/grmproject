import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './ui/RootLayout'
import Landing from './views/Landing'
import Dashboard from './views/Dashboard'
import Pickup from './views/Pickup'
import Products from './views/Products'
import Reports from './views/Reports'
import Analytics from './views/Analytics'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'pickup', element: <Pickup /> },
      { path: 'products', element: <Products /> },
      { path: 'reports', element: <Reports /> },
      { path: 'analytics', element: <Analytics /> },
    ],
  },
])



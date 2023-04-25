import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router.jsx'
import "./main.css"


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <h1>Header</h1>
    <RouterProvider router={router} />
    <h1>Footer</h1>

  </React.StrictMode>,
)

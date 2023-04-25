import { createBrowserRouter } from "react-router-dom"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import TestCRUD from "./pages/TestCRUD"


const router = createBrowserRouter([
    {
        path: "/",
        element: <Login></Login>
    },
    {
        path: "/dashboard",
        element: <Dashboard></Dashboard>,
    },
    {
        path: "/test-crud",
        element: <TestCRUD></TestCRUD>
    },
])

export default router
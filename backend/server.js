import express from "express"
import cors from "cors"

// Create express application
const port = 8080
const app = express()

// Enable cross-origin resource sharing (CORS)
//
//CORS allows us to set what front-end URLs are allowed 
// to access this API. 
app.use(cors({
    //Allow only do request in the website example.com 
    origin: [ "https://example.com"],
    // origin: true,
}))

// Enable JSON Request parsing middleware.
// 
// Must be done before endpoints are defined.
// if a request with 'content-Type: application/json' header is made
// to an endpoint, this middleware will treat the request body
// as a JSON string. It will attempt to parse it with
// On the body property of the request object, which you can 
// access in your endpoints or other middleware.
app.use(express.json())

//swagger documentation
import docsRouter from "./middleware/swagger-doc.js"
app.use(docsRouter)


//Controllers: 
/* ====\/\/\/\/\/\/\/\/\/\/==== */

// readings
import readingsController from "./controllers/readings.js"
app.use(readingsController)

//Users
import usersControllers from "./controllers/users.js"
app.use(usersControllers)

//Tests
import testsControllers from "./controllers/test.js"
app.use(testsControllers)

/* ====/\/\/\/\/\/\/\/\/\/\/\==== */

// validator
import { validateErrorMiddleware } from "./middleware/validator.js"
app.use(validateErrorMiddleware) 

// Start listening for API requests
app.listen(port, () => {
    console.log(`Express started on http://localhost:${port}`)
})
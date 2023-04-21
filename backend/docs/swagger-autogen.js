import swaggerAutogen from "swagger-autogen"

const doc = {
    info: {
        version: "1.0.0",
        tittle: "Weather Data API",
        description: "JSON REST API for tracking data of the weather sightings",
    }, 
    host: "localhost:8080",
    basePath: "",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
}

const outputFile = "./docs/swagger-output.json"
const endpointsFiles = ["./server.js"]

swaggerAutogen({ openapi: "3.0.0"})(outputFile, endpointsFiles, doc)
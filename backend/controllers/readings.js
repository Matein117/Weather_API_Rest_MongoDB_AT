import { Router } from "express";
import { validate } from "../middleware/validator.js"
import { Reading } from "../models/reading.js";
import models from "../models/model-switcher.js";
import auth from "../middleware/auth.js";

const readingsController = Router()

// 'CRUD' for 'Readings'


//     === START THE ENDPOINT FOR GET ALL ===


// validator Schema

const getAllReadingSchema = {
    type: "object",
    properties: {}
}


// GET ALL, method: get
// show your the whole readings
readingsController.get(
    "/readings",
    [
        // auth(["admin","teacher","student", "iotSensor"]),
        validate({ body: getAllReadingSchema }), 
    ],
    async (req, res) => {
        // #swagger.summary = 'Get a collection of all readings'
        const readings = await models.readingModel.getAll()
        
        res.status(200).json({
            status: 200,
            message: "Readings list",
            readings: readings,
        })
    }
)


//     === END THE ENDPOINT FOR GET ALL ===
//     === START THE ENDPOINT FOR GET BY ID ===


// validator schema 
const getReadingByIDSchema = {
    type: "object",
    properties: {
        id: {
            type: "string",
        }
    }
}

// GET BY ID, method: get
//Show you by specific ID 
readingsController.get(
    "/readings/:id", 
    [
        // auth(["admin","teacher","student","iotSensor"]),
        validate({ params: getReadingByIDSchema }),
    ],
    (req, res) => {
        // #swagger.summary = 'Get a specific readings by ID'

        const readingID = req.params.id

        models.readingModel.getByID(readingID).then(readings => {
            res.status(200).json ({
                status: 200, 
                message: "Get readings by ID",
                reading: readings
            })
        }).catch(error => { 
            res.status(500).json({ 
                status: 500,
                message: "failed to get reading by ID"
            })
        })
    
    })


//     === END THE ENDPOINT FOR GET BY ID ===
//     === START THE ENDPOINT FOR CREATE ===


//  Validator schema  
const createReadingSchema = {
    type: "object",
    required: [
        "Device Name",
        "Precipitation mm/h",
        "Time",
        "Latitude",
        "Longitude",
        "Atmospheric Pressure (kPa)",
        "Max Wind Speed (m/s)",
        "Solar Radiation (W/m2)",
        "Vapor Pressure (kPa)",
        "Humidity (%)",
        "Temperature (C)",
        "Wind Direction ()"
    ],
    properties: {
        "Device Name": {
            type: "string"
        },
        "Precipitation mm/h": {
            type: "number"
        },
        "Time": {
            type: "string",
            pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$"
        },
        "Latitude": {
            type: "number"
        },
        "Longitude": {
            type: "number"
        },
        "Temperature (°C)": {
            type: "number"
        },
        "Atmospheric Pressure (kPa)": {
            type: "number"
        },
        "Max Wind Speed (m/s)": {
            type: "number"
        },
        "Solar Radiation (W/m2)": {
            type: "number"
        },
        "Vapor Pressure (kPa)": {
            type: "number"
        },
        "Humidity (%)": {
            type: "number"
        },
        "Wind Direction (°)": {
            type: "number"
        }
    }  
};  

// CREATE, method: post
//Create a specific reading
readingsController.post("/readings/",
[
    auth(["admin","teacher","iotSensor"]),
    validate({ body: createReadingSchema }),                    
],
(req, res) => {
    // #swagger.summary = 'Create a specific reading'

    /* 

    #swagger.requestBody = {
        description: "Adding new reading",
        content: {
            'application/json': {
                schema: {
                    "Device Name": {
                        type: "string"
                    },
                    "Precipitation mm/h": {
                        type: "number"
                    },
                    "Time": {
                        type: "string",
                        format: "date-time"
                    },
                    "Latitude": {
                        type: "number"
                    },
                    "Longitude": {
                        type: "number"
                    },
                    "Temperature (°C)": {
                        type: "number"
                    },
                    "Atmospheric Pressure (kPa)": {
                        type: "number"
                    },
                    "Max Wind Speed (m/s)": {
                        type: "number"
                    },
                    "Solar Radiation (W/m2)": {
                        type: "number"
                    },
                    "Vapor Pressure (kPa)": {
                        type: "number"
                    },
                    "Humidity (%)": {
                        type: "number"
                    },
                    "Wind Direction (°)": {
                        type: "number"
                    }
                },
                example:{
                    "Device Name": "Woodford_Sensor",
                    "Precipitation mm/h": 0.085,
                    "Time": "2022-03-22T10:30:00.000Z",
                    "Latitude": 152.77891,
                    "Longitude": -26.95064,
                    "Atmospheric Pressure (kPa)": 128.02,
                    "Max Wind Speed (m/s)": 4.94,
                    "Solar Radiation (W/m2)": 113.21,
                    "Vapor Pressure (kPa)": 1.73,
                    "Humidity (%)": 73.84,
                    "Temperature (C)": 22.74,
                    "Wind Direction ()":  162.2
                }
            }
        }
    }

    */
    const readingData = req.body

    const reading = Reading(
        null,
        readingData.deviceName,
        readingData.precipitationMMH,
        readingData.time,
        readingData.latitude,
        readingData.longitude,
        readingData.atmosphericPressureKPa,
        readingData.maxWindSpeedMS,
        readingData.solarRadiationWM,
        readingData.vaporPressureKPA,
        readingData.humidity,
        readingData.temperatureC,
        readingData.windDirection
    )

    create(reading).then(reading => {        
        res.status(200).json({
            status: 200,
            message: "Create reading",
            reading: reading
        })
    }).catch(error => {
        res.status(500).json({ 
            status:500,
            message: "failed to create new reading"
        })
    }) 
    
})


//     === END THE ENDPOINT FOR CREATE ===
//     === START THE ENDPOINT FOR UPDATE "PATCH" ===


// Validator Schema 
const updateReadingSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "number"
        },
        "Device Name": {
            type: "string"
        },
        "Precipitation mm/h": {
            type: "number"
        },
        "Time": {
            type: "string",
            pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$"
        },
        "Latitude": {
            type: "number"
        },
        "Longitude": {
            type: "number"
        },
        "Temperature (°C)": {
            type: "number"
        },
        "Atmospheric Pressure (kPa)": {
            type: "number"
        },
        "Max Wind Speed (m/s)": {
            type: "number"
        },
        "Solar Radiation (W/m2)": {
            type: "number"
        },
        "Vapor Pressure (kPa)": {
            type: "number"
        },
        "Humidity (%)": {
            type: "number"
        },
        "Wind Direction (°)": {
            type: "number"
        }
    }
}
// UPDATE, method: patch
// Update a specific reading by ID 
readingsController.patch("/readings",
[
    auth(["admin","teacher","iotSensor"]),
    validate({ body: updateReadingSchema }),
],
async (req, res) => {
    // #swagger.summary = 'Update a specific reading by ID'
    /* 

    #swagger.requestBody = {
        description: "Updating reading",
        content: {
            'application/json': {
                schema: {
                    id: {
                        type: "number"
                    },
                    "Device Name": {
                        type: "string"
                    },
                    "Precipitation mm/h": {
                        type: "number"
                    },
                    "Time": {
                        type: "string",
                        format: "date-time"
                    },
                    "Latitude": {
                        type: "number"
                    },
                    "Longitude": {
                        type: "number"
                    },
                    "Temperature (°C)": {
                        type: "number"
                    },
                    "Atmospheric Pressure (kPa)": {
                        type: "number"
                    },
                    "Max Wind Speed (m/s)": {
                        type: "number"
                    },
                    "Solar Radiation (W/m2)": {
                        type: "number"
                    },
                    "Vapor Pressure (kPa)": {
                        type: "number"
                    },
                    "Humidity (%)": {
                        type: "number"
                    },
                    "Wind Direction (°)": {
                        type: "number"
                    }
                },
                example:{
                    "id": 1,
                    "Device Name": "Woodford_Sensor"
                }
            }
        }
    }
    */
    
    const readingData = req.body

    const reading = Reading(
        readingData.id,
        readingData.deviceName,
        readingData.precipitationMMH,
        readingData.time,
        readingData.latitude,
        readingData.longitude,
        readingData.atmosphericPressureKPa,
        readingData.maxWindSpeedMS,
        readingData.solarRadiationWM,
        readingData.vaporPressureKPA,
        readingData.humidity,
        readingData.temperatureC,
        readingData.windDirection
    )
    
    models.readingModel.update(reading).then(reading => {
        res.status(200).json({
            status: 200,
            message: "Update reading",
            reading: reading
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to update reading"
        })
    })
})


//     === END THE ENDPOINT FOR UPDATE "PATCH" ===
//     === START THE ENDPOINT FOR UPDATE "PUT" ===


// validator Schema 
const updateReadingSchemaPut = {
    type: "object",
    required: [
        "id",
        "Device Name",
        "Precipitation mm/h",
        "Time",
        "Latitude",
        "Longitude",
        "Atmospheric Pressure (kPa)",
        "Max Wind Speed (m/s)",
        "Solar Radiation (W/m2)",
        "Vapor Pressure (kPa)",
        "Humidity (%)",
        "Temperature (C)",
        "Wind Direction ()"
    ],
    properties: {
        id: {
            type: "number"
        },
        "Device Name": {
            type: "string"
        },
        "Precipitation mm/h": {
            type: "number"
        },
        "Time": {
            type: "string",
            pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$"
        },
        "Latitude": {
            type: "number"
        },
        "Longitude": {
            type: "number"
        },
        "Temperature (°C)": {
            type: "number"
        },
        "Atmospheric Pressure (kPa)": {
            type: "number"
        },
        "Max Wind Speed (m/s)": {
            type: "number"
        },
        "Solar Radiation (W/m2)": {
            type: "number"
        },
        "Vapor Pressure (kPa)": {
            type: "number"
        },
        "Humidity (%)": {
            type: "number"
        },
        "Wind Direction (°)": {
            type: "number"
        }
    }
}

readingsController.put("/readings/",
[
    auth(["admin","teacher","iotSensor"]),
    validate({ body: updateReadingSchema }),
],
(req, res) => {
    // #swagger.summary = 'Update a specific by ID'
    /* 

    #swagger.requestBody = {
        description: "Updating reading",
        content: {
            'application/json': {
                schema: {
                    "id": {
                        type: "number"
                    },
                    "Device Name": {
                        type: "string"
                    },
                    "Precipitation mm/h": {
                        type: "number"
                    },
                    "Time": {
                        type: "string",
                        format: "date-time"
                    },
                    "Latitude": {
                        type: "number"
                    },
                    "Longitude": {
                        type: "number"
                    },
                    "Temperature (°C)": {
                        type: "number"
                    },
                    "Atmospheric Pressure (kPa)": {
                        type: "number"
                    },
                    "Max Wind Speed (m/s)": {
                        type: "number"
                    },
                    "Solar Radiation (W/m2)": {
                        type: "number"
                    },
                    "Vapor Pressure (kPa)": {
                        type: "number"
                    },
                    "Humidity (%)": {
                        type: "number"
                    },
                    "Wind Direction (°)": {
                        type: "number"
                    }
                },
                example:{
                    "id": 1,
                    "Device Name": "Woodford_Sensor",
                    "Precipitation mm/h": 0.085,
                    "Time": "2022-03-22T10:30:00.000Z",
                    "Latitude": 152.77891,
                    "Longitude": -26.95064,
                    "Atmospheric Pressure (kPa)": 128.02,
                    "Max Wind Speed (m/s)": 4.94,
                    "Solar Radiation (W/m2)": 113.21,
                    "Vapor Pressure (kPa)": 1.73,
                    "Humidity (%)": 73.84,
                    "Temperature (C)": 22.74,
                    "Wind Direction ()":  162.2
                }
            }
        }
    }

    */

    const readingData = req.body

    const reading = Reading(
        readingData.id,
        readingData.deviceName,
        readingData.precipitationMMH,
        readingData.time,
        readingData.latitude,
        readingData.longitude,
        readingData.atmosphericPressureKPa,
        readingData.maxWindSpeedMS,
        readingData.solarRadiationWM,
        readingData.vaporPressureKPA,
        readingData.humidity,
        readingData.temperatureC,
        readingData.windDirection
    )
    
    models.readingModel.update(reading).then(reading => {
        res.status(200).json({
            status: 200,
            message: "Update reading",
            reading: reading
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to update reading"
        })
    })
})
//     === END THE ENDPOINT FOR UPDATE "PUT" ===
//     === START THE ENDPOINT FOR DELETE ===


// Validator Schema

const deleteReadingSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "number"
        }
    }
}

//DELETED, method: get 
//Deleted the reading 
readingsController.delete(
    "/readings/:id",
    [
        auth(["admin","teacher","iotSensor"]),
        validate({ body: updateReadingSchema }),
    ],
    (req, res) => {
    // #swagger.summary = 'Delete a specific reading by ID'
        const readingID = req.body.id
    
        models.readingModel.deleteByID(readingID).then(result => {
            res.status(200).json({
                status: 200,
                message: "reading deleted",
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to delete reading",
            })
        })
    }
)


//     === END THE ENDPOINT FOR DELETE ===


export default readingsController 
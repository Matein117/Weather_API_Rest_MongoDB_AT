import { Router } from "express";
import { Reading } from "../models/reading.js";
import { create, createMany, getAll, getByID, update, deleteByID, maximumPrecipitation  } from "../models/reading-mdb.js";
import { validate } from "../middleware/validator.js"
import auth from "../middleware/auth.js";
import { removeNullFields } from "../models/utils.js";

const readingsControllers = Router()

// 'CRUD' for 'Readings'


//     === START THE ENDPOINT FOR GET ALL ===


// validator Schema

const getAllReadingSchema = {
    type: "object",
    properties: {}
}


// GET ALL, method: get
// show your the whole readings
readingsControllers.get(
    "/readings",
    [
        // auth(["admin","teacher","student", "iotSensor"]),
        validate({ body: getAllReadingSchema }), 
    ],
    async (req, res) => {
        // #swagger.summary = 'Get a collection of all readings'
        const readings = await getAll()
        
        res.status(200).json({
            status: 200,
            message: "Readings list",
            readings: readings,
        })
    }
)


//     === END THE ENDPOINT FOR GET ALL ===

//     === START THE ENDPOINT FOR GET MAXIMUM PRECIPITATION ===

readingsControllers.get(
    "/readings/precipitation1",
    async (req, res) => {
        console.log("debugging Precipitation", req.query)
        
        // const { min, max } = req.query; you can use this one it's the same, those who are below are below.
        const min = req.query.min
        const max = req.query.max


    // #swagger.summary = 'Get a Max. Pre.'


        try {
            const maxPrecipitation = await maximumPrecipitation(min, max);
            res.status(200).json({
                status: 200,
                message: "Maximum precipitation",
                maxPrecipitation: maxPrecipitation,
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Failed to get maximum precipitation",
                error,
            });
        }
    }
);

//     === END THE ENDPOINT FOR GET MAXIMUM PRECIPITATION ===


//     === START THE ENDPOINT FOR GET BY DEVICE AND TIME ===

readingsControllers.get("/readings/byDeviceAndTime",
    async (req, res) => {

    const deviceName = req.query.deviceName;
    const dateTime = req.query.dateTime;
    console.log("debugging 1 controllers req.query: ", req.query)

        // #swagger.summary = 'Get a by Device and Time to find temperature, atmospheric pressure, radiation and precipitation .'


    try {
        const result = await getByDeviceAndDateTime(deviceName, dateTime);
        console.log("debugging 2 controllers result : ", result)
        console.log("debugging 3 controllers deviceName: ", deviceName )
        console.log("debugging 4 controllers dateTime: ", dateTime )

        res.status(200).json({
            status: 200,
            message: "Readings retrieved successfully",
            result: result,
        });
    }   catch (error) {
        res.status(500).json({
            status: 500,
            message: "Failed to retrieve readings",
            error: error,
        });
    }
});

//     === END THE ENDPOINT FOR GET BY DEVICE AND TIME ===

//     === START THE ENDPOINT FOR GET THE MAXIMUM TEMPERATURE BY DEVICE AND TIME ===

readingsControllers.get("/readings/maxTemperatureByDevice",
    async (req, res) => {
        const startDateTime = req.query.startDateTime;
        const endDateTime = req.query.endDateTime;
    
        // #swagger.summary = 'Get the maximum temperature recorded for each device within a given date/time range.'
    
        try {
            const maxTemperatureReadings = await findMaxTemperatureByDevice(startDateTime, endDateTime);
            res.status(200).json({
                status: 200,
                message: "Maximum temperature readings by device retrieved successfully",
                maxTemperatureReadings: maxTemperatureReadings
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Failed to retrieve maximum temperature readings by device",
                error: error
            });
        }
    }
);

//     === END THE ENDPOINT FOR GET BY DEVICE AND TIME ===



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
readingsControllers.get(
    "/readings/:id", 
    [
        auth(["admin","teacher","student","iotSensor"]),
        validate({ params: getReadingByIDSchema }),
    ],
    (req, res) => {
        // #swagger.summary = 'Get a specific readings by ID'
        /* 

    #swagger.requestBody = {
        description: "Adding new reading",
        content: {
            'application/json': {
                schema: {
                    "authenticationKey": {
                        type: "string"
                    }
                },
                example:{
                    "authenticationKey": "d0a4a0be-64bf-4fe9-badc-d101e9133415",
                }
            }
        }
    }

    */

        const readingID = req.params.id

        getByID(readingID).then(readings => {
            res.status(200).json ({
                status: 200, 
                message: "Get readings by ID",
                reading: readings
            })
        }).catch(error => { 
            res.status(500).json({ 
                status: 500,
                message: "failed to get reading by ID",
                error
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
        "Latitude": {
            type: "number"
        },
        "Longitude": {
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
        "Temperature (C)": {
            type: "number"
        },
        "Wind Direction ()": {
            type: "number"
        }
    }  
};  



// CREATE, method: post
//Create a specific reading
readingsControllers.post("/readings/",
[
    // auth(["admin","teacher","iotSensor"]),
    validate({ body: createReadingSchema }),                    
],
async (req, res) => {
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
                    "Temperature (C)": {
                        type: "number"
                    },
                    "Wind Direction ()": {
                        type: "number"
                    }
                },
                example:{
                    "authenticationKey": "bdd390da-58bb-4c06-8df2-792ec841db96",
                    "Device Name": "THIS_IS_A_Reading_4",
                    "Precipitation mm/h": 1.111,
                    "Time": "2023-04-25T10:30:00.000Z",
                    "Latitude": 222.22222,
                    "Longitude": -33.33333,
                    "Atmospheric Pressure (kPa)": 444.44,
                    "Max Wind Speed (m/s)": 5.55,
                    "Solar Radiation (W/m2)": 666.66,
                    "Vapor Pressure (kPa)": 7.77,
                    "Humidity (%)": 88.88,
                    "Temperature (C)": 99.99,
                    "Wind Direction ()":  123.4
                }
            }
        }
    }

    */
    const readingData = req.body

    const reading = new Reading(
        null,
        readingData['Device Name'],
        readingData['Precipitation mm/h'],
        null,
        readingData['Latitude'],
        readingData['Longitude'],
        readingData['Atmospheric Pressure (kPa)'],
        readingData['Max Wind Speed (m/s)'],
        readingData['Solar Radiation (W/m2)'],
        readingData['Vapor Pressure (kPa)'],
        readingData['Humidity (%)'],
        readingData['Temperature (C)'],
        readingData['Wind Direction ()']
    );

    create(reading).then(reading => {        
        res.status(200).json({
            status: 200,
            message: "Create reading",
            reading: reading
        })
    }).catch(error => {
        res.status(500).json({ 
            status:500,
            message: "failed to create new reading",
            error
        })
    }) 
    
})


//     === END THE ENDPOINT FOR CREATE ===
//     === START THW ENDPOINT FOR CREATE MANY ===

//  Validator schema 
const createReadingSchemaMany = {
    type: "object",
    properties: {
        reading: {
            type: "array",
            items:{
                type: "object",
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
                    "Temperature (C)": {
                        type: "number"
                    },
                    "Wind Direction ()": {
                        type: "number"
                    }
                },
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
                ]
            }
        }
    },
    required: [
        "reading"
    ]
};  

// CREATE, method: post
//Create a Many Readings
readingsControllers.post("/readings/many",
[
    // auth(["admin","teacher","iotSensor"]),
    validate({ body: createReadingSchemaMany }),                    
],
async (req, res) => {
    // #swagger.summary = 'Create a many Readings'

    

    /* 

    #swagger.requestBody = {
    description: "Adding many readings in one single station",
    content: {
        'application/json': {
            schema: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
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
                        "Temperature (C)": {
                            type: "number"
                        },
                        "Wind Direction ()": {
                            type: "number"
                        }
                    },
                    example:{
                        "authenticationKey": "829ef690-a373-4485-9afb-b9f4b8f80f9a",
                        "reading": [

                            {
                                "Device Name": "Test test for create many 1",
                                "Precipitation mm/h": 1.111,
                                "Time": "2023-04-25T10:30:00.000Z",
                                "Latitude": 222.22222,
                                "Longitude": -33.33333,
                                "Atmospheric Pressure (kPa)": 444.44,
                                "Max Wind Speed (m/s)": 5.55,
                                "Solar Radiation (W/m2)": 666.66,
                                "Vapor Pressure (kPa)": 7.77,
                                "Humidity (%)": 88.88,
                                "Temperature (C)": 99.99,
                                "Wind Direction ()":  123.4
                            },{
                                "Device Name": "Test test for create many 2",
                                "Precipitation mm/h": 1.111,
                                "Time": "2023-04-25T10:30:00.000Z",
                                "Latitude": 222.22222,
                                "Longitude": -33.33333,
                                "Atmospheric Pressure (kPa)": 444.44,
                                "Max Wind Speed (m/s)": 5.55,
                                "Solar Radiation (W/m2)": 666.66,
                                "Vapor Pressure (kPa)": 7.77,
                                "Humidity (%)": 88.88,
                                "Temperature (C)": 99.99,
                                "Wind Direction ()":  123.4
                            },
                        ]    
                    }
                }
            }
        }
    }
}

    */

    console.log("Request body", req.body)

    const readingData = req.body

    const reading = readingData.reading.map(readingDataItem => Reading(
        null,
        readingDataItem['Device Name'],
        readingDataItem['Precipitation mm/h'],
        new Date(readingDataItem["Time"]),
        readingDataItem['Latitude'],
        readingDataItem['Longitude'],
        readingDataItem['Atmospheric Pressure (kPa)'],
        readingDataItem['Max Wind Speed (m/s)'],
        readingDataItem['Solar Radiation (W/m2)'],
        readingDataItem['Vapor Pressure (kPa)'],
        readingDataItem['Humidity (%)'],
        readingDataItem['Temperature (C)'],
        readingDataItem['Wind Direction ()']
    ));
    
    createMany(reading).then(insertedReadings => {      
        console.log("Inserted readings:", insertedReadings )      
        res.status(200).json({
            status: 200,
            message: "Created many Readings",
            readings: insertedReadings
        })
    }).catch(error => {
        console.log("Error:", error);
        res.status(500).json({ 
            status:500,
            message: "failed to create many Readings",
            error
        })
    }) 
    
})

//     === END THE ENDPOINT FOR CREATE MANY ===
//     === START THE ENDPOINT FOR UPDATE "PATCH" ===


// Validator Schema 
const updateReadingSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "string"
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
        "Temperature (C)": {
            type: "number"
        },
        "Wind Direction ()": {
            type: "number"
        }
    }
}
// UPDATE, method: patch
// Update a specific reading by ID 
readingsControllers.patch("/readings",
[
    // auth(["admin","teacher","iotSensor"]),
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
                        type: "string"
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
                    "Temperature (C)": {
                        type: "number"
                    },
                    "Wind Direction ()": {
                        type: "number"
                    }
                },
                example:{
                    "authenticationKey": "829ef690-a373-4485-9afb-b9f4b8f80f9a",
                    "id": "6451d1a8ad634b02939e7612",
                    "Precipitation mm/h": 555555
                }
            }
        }
    }
    */
    
    const readingData = req.body
    
    console.log("dib 4", readingData)

    const reading = Reading(
        readingData['id'],
        readingData['Device Name'],
        readingData['Precipitation mm/h'],
        null,
        readingData['Latitude'],
        readingData['Longitude'],
        readingData['Atmospheric Pressure (kPa)'],
        readingData['Max Wind Speed (m/s)'],
        readingData['Solar Radiation (W/m2)'],
        readingData['Vapor Pressure (kPa)'],
        readingData['Humidity (%)'],
        readingData['Temperature (C)'],
        readingData['Wind Direction ()']
    )

    const readingNoNull = removeNullFields(reading) // this function avoid lost of data when is updated 

    console.log(readingNoNull)
    update(readingNoNull).then(readingNoNull => {
        res.status(200).json({
            status: 200,
            message: "Update reading",
            readingNoNull: readingNoNull
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to update reading",
            error
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

readingsControllers.put("/readings/",
[
    // auth(["admin","teacher","iotSensor"]),
    validate({ body: updateReadingSchemaPut }),
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
    
    update(reading).then(reading => {
        res.status(200).json({
            status: 200,
            message: "Update reading",
            reading: reading
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to update reading",
            error
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
            type: "string"
        }
    }
}

//DELETED, method: get 
//Deleted the reading 
readingsControllers.delete(
    "/readings/:id",
    [
        // auth(["admin","teacher","iotSensor"]),
        validate({ body: deleteReadingSchema }),
    ],
    (req, res) => {
    // #swagger.summary = 'Delete a specific reading by ID'
        const readingID = req.body.id
    
        deleteByID(readingID).then(result => {
            res.status(200).json({
                status: 200,
                message: "reading deleted",
                result
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to delete reading",
                error
            })
        })
    }
)


//     === END THE ENDPOINT FOR DELETE ===




//     === END THE ENDPOINT FOR GET MAXIMUM PRECIPITATION ===


//     === START THE ENDPOINT FOR GET MAXIMUM TEMP(C) FOR ALL STATIONS === 
 //TODO: CREATE END POINT TO GET THE MAXIMUM TEMPERATURE (C) 
//     === START THE ENDPOINT FOR GET MAXIMUM TEMP(C) FOR ALL STATIONS === 



export default readingsControllers 
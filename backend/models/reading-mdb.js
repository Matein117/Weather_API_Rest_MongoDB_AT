import { Reading } from "./reading.js";
import { ObjectId } from "mongodb";
import { db } from "../database/mongodb.js"
import { checkWeatherReadings } from "../triggers/create-trigger-reading.js"
import { createLocationByLongitudeAndLatitude } from "../triggers/create-trigger-location-by-longitude-and-latitude.js";
import { updateLocationByLongitudeAndLatitude } from "../triggers/update-trigger-location-by-longitude-and-latitude.js";



export async function create(reading) {
    // invoke triggers here
    await checkWeatherReadings(reading); //trigger
    await createLocationByLongitudeAndLatitude(reading); //trigger

    // New reading should not have an existing ID, delete just to be sure.
    delete reading.id;
    reading.Time = { $date: new Date(Date.now()).toISOString() };
    return db.collection("readings2")
        .insertOne(reading)
        .then((result) => {
            delete reading._id;
            return { ...reading, id: result.insertedId.toString() };
        })
        .catch((error) => {
            throw {
                statusCode: 500,
                message: "Failed to create new reading",
                error,
            };
        });
}





export async function createMany(readings) {
    const readingsToInsert = readings.map(reading => {
        delete reading.id;
        return reading;
    });
    const result = await db.collection("readings2").insertMany(readingsToInsert);
    const insertedIds = Object.keys(result.insertedIds).map(id => result.insertedIds[id].toString());
    return insertedIds;
}





// Original Method by Jasper
// export async function getAll() {
//     let allReadingResults = await db.collection("readings").find().toArray()
//     //Convert the collection of result into a list reading  
//     return await allReadingResults.map(readingResult => {
//         Reading(
//             readingResult._id.toString(),
//             readingResult.deviceName,
//             readingResult.precipitationMMH,
//             readingResult.time,
//             readingResult.latitude,
//             readingResult.longitude,
//             readingResult.atmosphericPressureKPa,
//             readingResult.maxWindSpeedMS,
//             readingResult.solarRadiationWM,
//             readingResult.vaporPressureKPA,
//             readingResult.humidity,
//             readingResult.temperatureC,
//             readingResult.windDirection
//             )
//         }
//     )
// }


//  method 2 By ChatGPT
// export async function getAll() {
//     let allReadingResults = await db.collection("readings").find().toArray()
//     //Convert the collection of result into a list reading  
//     return await allReadingResults.map(readingResult => {
//         return new Reading(
//             readingResult._id.toString(),
//             readingResult.deviceName,
//             readingResult.precipitationMMH,
//             readingResult.time,
//             readingResult.latitude,
//             readingResult.longitude,
//             readingResult.atmosphericPressureKPa,
//             readingResult.maxWindSpeedMS,
//             readingResult.solarRadiationWM,
//             readingResult.vaporPressureKPA,
//             readingResult.humidity,
//             readingResult.temperatureC,
//             readingResult.windDirection
//             )
//         }
//     )
// }


// method 3 By ChatGPT 
// export async function getAll() {
//     const allReadingResults = await db.collection("readings").find().toArray();
//     const allReadings = allReadingResults.map((readingResult) => {
//         return Reading(
//             readingResult._id.toString(),
//             readingResult["Device Name"],
//             readingResult["Precipitation mm/h"],
//             readingResult["Time"],
//             readingResult["Latitude"],
//             readingResult["Longitude"],
//             readingResult["Atmospheric Pressure (kPa)"],
//             readingResult["Max Wind Speed (m/s)"],
//             readingResult["Solar Radiation (W/m2)"],
//             readingResult["Vapor Pressure (kPa)"],
//             readingResult["Humidity (%)"],
//             readingResult["Temperature (C)"],
//             readingResult["Wind Direction ()"]
//         );
//     });
//     return allReadings;
// }


// method 4 mixed with ChatGPT & Jasper
export async function getAll() {
        let allReadingResults = await db.collection("readings2").find().toArray()
        //Convert the collection of result into a list reading  
        return await allReadingResults.map(readingResult => {
            return Reading(
                readingResult._id.toString(),
                readingResult["Device Name"],
                readingResult["Precipitation mm/h"],
                readingResult["Time"],
                readingResult["Latitude"],
                readingResult["Longitude"],
                readingResult["Atmospheric Pressure (kPa)"],
                readingResult["Max Wind Speed (m/s)"],
                readingResult["Solar Radiation (W/m2)"],
                readingResult["Vapor Pressure (kPa)"],
                readingResult["Humidity (%)"],
                readingResult["Temperature (C)"],
                readingResult["Wind Direction ()"]
                )
            }
        )
    }


export async function getByID(readingID) {   
    let readingResult = await db.collection("readings2").findOne({ _id: new ObjectId(readingID) })
    if (readingResult) {
        return Promise.resolve ( 
            Reading(
                readingResult._id.toString(),
                readingResult["Device Name"],
                readingResult["Precipitation mm/h"],
                readingResult["Time"],
                readingResult["Latitude"],
                readingResult["Longitude"],
                readingResult["Atmospheric Pressure (kPa)"],
                readingResult["Max Wind Speed (m/s)"],
                readingResult["Solar Radiation (W/m2)"],
                readingResult["Vapor Pressure (kPa)"],
                readingResult["Humidity (%)"],
                readingResult["Temperature (C)"],
                readingResult["Wind Direction ()"]
            )
        )
    } else {
        return Promise.reject("no matching result found")
    }
}


export async function update(reading) {
    await updateLocationByLongitudeAndLatitude(reading);
    const readingID =  new ObjectId(reading._id)
    delete reading._id
    reading.Time = {$date: new Date(Date.now()).toISOString()}
    const readingUpdateDocument = {
        "$set": reading
    }
    return db.collection("readings2").updateOne({ _id: readingID }, readingUpdateDocument )
}


export async function deleteByID(readingID) {
    return db.collection("readings2").deleteOne({ _id: new ObjectId(readingID) })
}



export async function maximumPrecipitation(min, max) {
    const precipitation = [
        {
            $match: {
                Time: {
                    // $gte: new Date("2021-01-7T00:00:00.000Z"),
                    // $lte: new Date("2021-05-07T23:59:59.000Z")
                    $gte: new Date(min),
                    $lte: new Date(max)
                },
                "Precipitation mm/h": { $exists: true }
            }
        },
        {
            $group: {
                _id: "$Device Name",
                maxPrecipitation: { $max: "$Precipitation mm/h" },
                Time: { $last: "$Time" }
            }
        },
        {
            $project: {
                _id: 0,
                "Device Name": "$_id",
                Time: 1,
                "Precipitation mm/h": "$maxPrecipitation"
            }
        }
    ];

    try {
        const result = await db.collection("readings2").aggregate(precipitation).toArray();
        return result.map((readingResult) =>
            new Reading(
                null,
                readingResult["Device Name"],
                readingResult["Precipitation mm/h"],
                readingResult["Time"],
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
            )
        );
    } catch (error) {
        throw error;
    }
}

export async function getByDeviceAndDateTime(deviceName, dateTime) {
    const query = {
        "Device Name": deviceName,
        Time: new Date(dateTime),
    };
    const projection = {
        _id: 0,
        "Temperature (C)": 1,
        "Atmospheric Pressure (kPa)": 1,
        "Solar Radiation (W/m2)": 1,
        "Precipitation mm/h": 1,
    };

    try {
        const result = await db.collection("readings2").find(query, projection).toArray();
        console.log("debugging 3 models result: ", result)
        return result.map((readingResult) =>
            new Reading(
                null,
                deviceName,
                readingResult["Precipitation mm/h"],
                dateTime,
                null,
                null,
                readingResult["Atmospheric Pressure (kPa)"],
                null,
                readingResult["Solar Radiation (W/m2)"],
                null,
                null,
                readingResult["Temperature (C)"],
                null
            )
        );
    } catch (error) {
        throw error;
    }
}

export async function findMaxTemperatureByDevice(startDateTime, endDateTime) {
    const query = {
        "Device Name": {
            $in: ["Yandina_Sensor", "Noosa_Sensor", "Woodford_Sensor"]
        },
        Time: {
            $gte: new Date(startDateTime),
            $lte: new Date(endDateTime)
        }
    };    
    const projection = {
        _id: 0,
        "Device Name": 1,
        Time: 1,
        "Temperature (C)": 1
    };    
    try {
        const result = await db.collection("readings2").find(query, projection).toArray();
        const maxTemperatureReadings = {};
        result.forEach(reading => {
            const deviceName = reading["Device Name"];
            const temperature = reading["Temperature (C)"];
            const dateTime = reading.Time;    
            if (!maxTemperatureReadings[deviceName] || temperature > maxTemperatureReadings[deviceName].temperature) {
                maxTemperatureReadings[deviceName] = {
                    sensorName: deviceName,
                    dateTime,
                    temperature
                };
            }
        });
        return Object.values(maxTemperatureReadings);
    } catch (error) {
        throw error;
    }
}


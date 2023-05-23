import { Reading } from "./reading.js";
import { ObjectId } from "mongodb";
import { db } from "../database/mongodb.js"

export async function create(reading) {
    delete reading.id
    return db.collection("readings2").insertOne(reading)
        .then(result => {
            delete reading._id
            return { ...reading, id: result.insertedId.toString() }
        })
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
    console.log("debug for time", reading)
    const readingID =  new ObjectId(reading._id)
    delete reading._id
    reading.Time = {$date: new Date(Date.now()).toISOString()}
    console.log("Debug2",reading.Time)
    const readingUpdateDocument = {
        "$set": reading
    }
    console.log("Debug3",readingUpdateDocument)
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

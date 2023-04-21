import { Reading } from "./reading.js";
import { ObjectId } from "mongodb";
import { db } from "../database/mongodb.js"

export async function create(reading) {
    delete reading.id
    return db.collection("readings").insertOne(reading)
        .then(result => {
            delete reading._id
            return { ...reading, id: result.insertedId.toString() }
        })
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
        let allReadingResults = await db.collection("readings").find().toArray()
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
    let readingResult = await db.collection("readings").findOne({ _id: new ObjectId(readingID) })
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
    const readingID = new ObjectId(reading.id)
    delete reading.id 
    const readingUpdateDocument = {
        "$set": reading
    }
    return db.collection("readings").updateOne({ _id: readingID }, readingUpdateDocument )
}

export async function deleteByID(readingID) {
    return db.collection("readings").deleteOne({ _id: new ObjectId(readingID) })
}
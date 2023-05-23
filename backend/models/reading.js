// readings model (object) constructor
export function Reading(
    id,
    deviceName,
    precipitationMMH,
    time,
    latitude,
    longitude,
    atmosphericPressureKPa,
    maxWindSpeedMS,
    solarRadiationWM,
    vaporPressureKPA,
    humidity,
    temperatureC,
    windDirection
) {

    
    return {
        "_id": id,
        "Device Name": deviceName,
        "Precipitation mm/h": precipitationMMH,
        "Time": {$date: new Date(time).toISOString()}, 
        "Latitude": latitude,
        "Longitude": longitude,
        "Atmospheric Pressure (kPa)": atmosphericPressureKPa,
        "Max Wind Speed (m/s)": maxWindSpeedMS,
        "Solar Radiation (W/m2)": solarRadiationWM,
        "Vapor Pressure (kPa)": vaporPressureKPA,
        "Humidity (%)": humidity,
        "Temperature (C)": temperatureC,
        "Wind Direction ()": windDirection,
    }
}

// import {create, getAll, getByID, update, deleteByID } from "./reading-mdb.js"

// let allTests = await getAll()
// console.log(allTests)

// deleteByID("6423bfbab43beaa8e010a39e").then(result => console.log(result))
// 
// getByID("6422b984405de9cc001177ce")
//     .then(reading => console.log(reading))
//     .catch(error => console.log(error))
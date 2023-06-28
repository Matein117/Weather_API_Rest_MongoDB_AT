export async function checkWeatherReadings(document) {
    if (document["Temperature (C)"] > 60) {
        throw {
            statusCode: 401,
            message: "Temperature too high. must be lower than 60",
        };
    }

    if (document["Temperature (C)"] < -50) {
        throw {
            statusCode: 401,
            message: "Temperature too low. must be higher tha -60",
        };  
    }

    if (document["Humidity (%)"] > 100) {
        throw {
            statusCode: 401,
            message: "Humidity too high. must be lower than 100 %",
        };
    }
}  
export async function updateLocationByLongitudeAndLatitude(document) {
    
    if ( document["Latitude"] == 152.77891 && document["Longitude"] == -26.95064 ) {
        document["Device Name"] = "Woodford_Sensor"
    }
    if ( document["Latitude"] == 152.95574 && document["Longitude"] == -26.56271 ) {
        document["Device Name"] = "Yandina_Sensor"
    }
    if ( document["Latitude"] == 153.08919 && document["Longitude"] == -26.39676 ) {
        document["Device Name"] = "Noosa_Sensor"
    }
    
}
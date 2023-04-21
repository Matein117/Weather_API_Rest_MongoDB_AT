// This file should import all models and expose the selected database providers models as an export

// Change to either "mysql" or "mdb" to select database backend
const databaseBackend = "mdb"

let models = {}

if (databaseBackend == "mdb") {
    models = {
        readingModel: await import("./reading-mdb.js"),
        userModel: await import("./user-mdb.js"),
        testModel: await import("./test-mdb.js")
    }
} else {
    console.log("invalid database backend selected")
}

export default models  
export function User(id, email, password, role, firstName, lastName, authenticationKey) {
    return {
        id,
        email,
        password,
        role,
        firstName,
        lastName,
        authenticationKey
    }
}

// import {create, getAll, getByID, update, deleteByID } from "./user-mdb.js"

// getByID("64339237c7815bb0fd40419e")
//     .then(reading => console.log(reading))
//     .catch(error => console.log(error))

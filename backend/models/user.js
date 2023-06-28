export function User(id, email, password, role, firstName, lastName, authenticationKey, dateCreated) {
    return {
        id,
        email,
        password,
        role,
        firstName,
        lastName,
        authenticationKey,
        dateCreated: {$date: new Date(dateCreated).toISOString()}
    }
}


import { ObjectId } from "mongodb"
import { User } from "./user.js";
import { db } from "../database/mongodb.js";


export async function getAll() {
    // Get the collection of all users
    let allUserResults = await db.collection("users").find().toArray()
    // Convert the collection of results into a list of User objects
    return await allUserResults.map((userResult) =>
        User(
            userResult._id.toString(),
            userResult.email,
            userResult.password,
            userResult.role,
            userResult.firstName,
            userResult.lastName,
            userResult.authenticationKey,
            userResult.dateCreated
        )
    )
}

export async function getByID(userID) {
    // Get the collection of matching users
    let userResult = await db.collection("users").findOne({ _id: new ObjectId(userID) })
    // Convert the result into a User object
    if (userResult) {
        return Promise.resolve(
            User(
                userResult._id.toString(),
                userResult.email,
                userResult.password,
                userResult.role,
                userResult.firstName,
                userResult.lastName,
                userResult.authenticationKey,
                userResult.dateCreated
            )
        )
    } else {
        return Promise.reject("no results found")
    }
}

export async function getByEmail(email) {
    console.log("Executing getByEmail function with email:", email);

    // Get the collection of matching users
    let userResult = await db.collection("users").findOne({ email })
    // Convert the result into a User object
    if (userResult) {
        return Promise.resolve(
            User(
                userResult._id.toString(),
                userResult.email,
                userResult.password,
                userResult.role,
                userResult.firstName,
                userResult.lastName,
                userResult.authenticationKey,
                userResult.dateCreated
            )
        )
    } else {
        return Promise.reject("no results found")
    }
}

export async function getByAuthenticationKey(authenticationKey) {
    // Search for a matching document
    let userResult = await db.collection("users").findOne({ authenticationKey })
    // Convert the result into a User object
    if (userResult) {
        return Promise.resolve(
            User(
                userResult._id.toString(),
                userResult.email,
                userResult.password,
                userResult.role,
                userResult.firstName,
                userResult.lastName,
                userResult.authenticationKey,
                userResult.dateCreated
            )
        )
    } else {
        return Promise.reject("no results found")
    }
}

export async function create(user) {
    const userWithDate = {
        ...user,
        dateCreated: new Date(Date.now()).toISOString()
    };

    delete userWithDate.id;

    return db.collection("users").insertOne(userWithDate).then(result => {
        delete userWithDate._id;
        return { ...userWithDate, id: result.insertedId.toString() };
    });
}


export async function createMany(users) {
    const usersToInsert = users.map(user => {
        delete user.id;
        user.dateCreated = new Date().toISOString(); // Set the date created

        return user;
    });
    const result = await db.collection("users").insertMany(usersToInsert);
    const insertedIds = Object.keys(result.insertedIds).map(id => result.insertedIds[id].toString());
    return insertedIds;
}

export async function update(user) {
    // Convert ID into a mongoDB objectId and remove from object
    const userID = new ObjectId(user.id)
    delete user.id
    // Create the update document
    const userUpdateDocument = {
        "$set": user
    }
    // Update the user object by ID but excluding the ID itself and return resulting promise
    return db.collection("users").updateOne({ _id: userID }, userUpdateDocument)
}


export async function deleteByID(userID) {
    return db.collection("users").deleteOne({ _id: new ObjectId(userID) })
}

export async function deleteMany(ids) {
    const objIds = ids.map(id => {
        return new ObjectId(id)
    })
    console.log("Debugging",objIds)

    const result = await db.collection("users").deleteMany({ _id: { $in: objIds } });
    console.log("Debug 2 /models/ result:", result);    
    console.log("Debug 3 /models/ result.delete:",result.deletedCount);
    return result.deletedCount;
}

export async function updateAccessLevel(startDate, endDate, newRole) {
    try {
        const result = await db.collection("users").updateMany(
            {
                $and: [
                    { dateCreated: { $gte: startDate } },
                    { dateCreated: { $lte: endDate } },
                ],
            },
            { $set: { role: newRole } }
        );
    
        return result.modifiedCount;
    } catch (error) {
        throw error;
    }
}
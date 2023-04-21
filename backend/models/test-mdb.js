import { Test } from "./test.js";
import { ObjectId } from "mongodb";
import { db } from "../database/mongodb.js"

export async function create(test) { 
    delete test.id
    return db.collection("tests").insertOne(test)
        .then(result => {
            delete test.id
            return{ ...test, id: result.insertedId.toString() }
        })
}

export async function getAll() {
    let allTestResults = await db.collection("tests").find().toArray()
    return await allTestResults.map(testResult => 
        Test(
            testResult._id.toString(),
            testResult.country,
            testResult.city
            )
    )
}

export async function getByID(testID) {
    let testResult = await db.collection("tests").findOne({ _id: new ObjectId(testID) })
    if (testResult !=null) {
        return Promise.resolve (
            Test(
                testResult._id.toString(),
                testResult.country,
                testResult.city
            )
        )
    } else {
        return Promise.reject("no matching result found")
    }
}

export async function update(test) {
    const testID = new ObjectId(test.id)
    delete test.id
    const testUpdateDocument = {
        "$set": test
    }
    return db.collection("tests").updateOne({ _id: testID }, testUpdateDocument)

}

export async function deleteByID(testID) { 
    return db.collection("tests").deleteOne({ _id: new ObjectId(testID) })
}
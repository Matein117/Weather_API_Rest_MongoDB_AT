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


export async function createMany(tests) {
    const testsToInsert = tests.map(test => {
        delete test.id;
        return test;
    });
    const result = await db.collection("tests").insertMany(testsToInsert);
    const insertedIds = Object.keys(result.insertedIds).map(id => result.insertedIds[id].toString());
    return insertedIds;
}

    



export async function deleteManyById(ids) {
    const result = await db.collection("tests").deleteMany({ _id: { $in: ids.map(ObjectId) } });
    console.log("Debug 2 /models/ result:", result);    
    console.log("Debug 3 /models/ result.delete:",result.deletedCount);
    return result.deletedCount;
}


// export async function deleteManyById(ids) { 
//     console.log('Debug 1 /models/ Deleting tests with IDs:', ids);
//     const idsToDelete = ids.map(id => new ObjectId(id));
//     console.log('Debug 2 /models/ idsToDelete:', idsToDelete);
//     const result = await db.collection("tests").deleteMany({ _id: { $in: idsToDelete } });
//     console.log('Debug 3 /models/ result:', result);
//     console.log('Debug 4 /models/ result.deletedCount:', result.deletedCount);
//     return result.deletedCount;
// }





// export async function deleteByID(testID) { 
//     return db.collection("tests").deleteOne({ _id: new ObjectId(testID) })
// }


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


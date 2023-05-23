import { Router } from "express";
import { validate } from "../middleware/validator.js";
import auth from "../middleware/auth.js";
import { Test } from "../models/test.js";
import { create, createMany, getAll, getByID, update, deleteByID, deleteManyById } from "../models/test-mdb.js";



const testsControllers = Router()


//     === START THE ENDPOINT FOR GET  ALL ===


//'CRUD' for 'tests' 

// validator Schema 

const getTestAllSchema = {
    type: "object",
    properties: {}
}

//GET ALL, methods: get 
//  Show all the tests

testsControllers.get(
    "/tests",
    [
        // auth(["admin"]),
        validate({ body: getTestAllSchema }),
    ],
    async (req, res) => {
            // #swagger.summary = 'Get a collection of all tests'


        const tests = await getAll()

        res.status(200).json({
            status: 200,
            message: "Test list",
            tests: tests,
        })
    }
)

//     === END THE ENDPOINT FOR GET ALL ===
//     === START THE ENDPOINT FOR GET BY ID" ===

// validator Schema 
const getTestByIDSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id:{
            type: "string",
        }
    }
}

//GET BY ID. methods: get
//  Get a specific tests by ID

testsControllers.get(
    "/tests/:id",
    [
        auth(["admin"]),
        validate({ body: getTestByIDSchema }),
    ],    (req, res) => {
        const testID = req.params.id
        // #swagger.summary = 'Get a specific test by ID 
        getByID(testID).then(test => {
            res.status(200).json({
                status: 200,
                message: "Get test by ID",
                test: test
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to get test by ID",
                error
            })
        })
    }
)

//     === END THE ENDPOINT FOR GET BY ID" ===
//     === START THE ENDPOINT FOR CREATE" ===


// Validator Schema 
const createTestSchema = {
    type: "object",
    properties: {
        test: {
            type: "array",
            items:{
                type: "object",
                properties: {
                    country: { 
                        type: "string"
                    },
                    city: { 
                        type: "string"
                    }
                },
                required: [
                    "country",
                    "city"
                ]
            }
        }
    },
    required: [
        "test"
    ]
}

testsControllers.post(
    "/tests/", 
    [
        auth(["admin"]),
        validate({ body: createTestSchema }),
    ],
    (req, res) => {
    // #swagger.summary = 'Create a specific test'
    /* #swagger.requestBody = {
            description: 'Adding new test.',
            content: {
                'application/json': {
                    schema: {
                        country: 'string',
                        city: 'string',
                    },
                    example: {
                        country: 'any',
                        city: 'any',
                    }
                }
            }
            
        } 
    */
    // Get the test data out of the request
    const testData = req.body

    // Convert the test data into an test model object
    const test = Test(
        null, 
        testData.country, 
        testData.city
    )

    // Use the create model function to insert this test into the DB
    create(test).then(test => {
        res.status(200).json({
            status: 200,
            message: "Created test",
            test: test,
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to created test",
            error
        })
    })
})

//     === END THE ENDPOINT FOR CREATE" ===

//     === START THW ENDPOINT FOR CREATE MANY ===

//  Validator schema 

const createTestSchemaMany = {
    type: "object",
    properties: {
        test: {
            type: "array",
            items:{
                type: "object",
                properties: {
                    country: { 
                        type: "string"
                    },
                    city: { 
                        type: "string"
                    }
                },
                required: [
                    "country",
                    "city"
                ]
            }
        }
    },
    required: [
        "test"
    ]
};  

// CREATE, method: post
//Create a Many Tests
testsControllers.post("/tests/many",
[
    auth(["admin","teacher","iotSensor"]),
    validate({ body: createTestSchemaMany }),                    
],
async (req, res) => {
    // #swagger.summary = 'Create a many Tests'
    
    

/* 
    #swagger.requestBody = {
        description: "Adding new Test",
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            "country": {
                                type: "string"
                            },
                            "city": {
                                type: "string"
                            }
                        },
                        example:{
                            "authenticationKey": "829ef690-a373-4485-9afb-b9f4b8f80f9a",
                            "test": [
                                {
                                    "country": "Tests for create many 1",
                                    "city": "Tests for create many 1"
                                },
                                {
                                    "country": "Tests for create many 2",
                                    "city": "Tests for create many 2"
                                },
                                {
                                    "country": "Tests for create many 3",
                                    "city": "Tests for create many 3"
                                },
                                {
                                    "country": "Tests for create many 4",
                                    "city": "Tests for create many 4"
                                },
                                {
                                    "country": "Tests for create many 5",
                                    "city": "Tests for create many 5"
                                },
                            ]
                        }
                    }
                }
            }
        }
    }
*/

    console.log("Request body", req.body)

    const testData = req.body

    const test = testData.test.map(testDataItem => Test(
        null, 
        testDataItem.country, 
        testDataItem.city
    ));
    
    createMany(test).then(insertedTests => {      
        console.log("Inserted tests:", insertedTests )      
        res.status(200).json({
            status: 200,
            message: "Created many Tests",
            tests: insertedTests
        })
    }).catch(error => {
        console.log("Error:", error);
        res.status(500).json({ 
            status:500,
            message: "failed to create many Tests",
            error
        })
    }) 
    
})



//     === END THE ENDPOINT FOR CREATE MANY ===
//     === START THE ENDPOINT FOR UPDATE "PATCH" ===


// Validator Schema
const updateTestSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "string"
        },
        "country": {
            type: "string",
            pattern: "^[A-Za-z ]+$",
            maxLength: 50 
        },
        "city": {
            type: "string",
            pattern: "^[A-Za-z ]+$",
            maxLength: 50 
        }
        
    }
}
//UPDATE, method: patch
//   Update a specific test by ID
testsControllers.patch("/tests/",
[
    auth(["admin"]),
    validate({ body: updateTestSchema }),
],async (req, res) => {
    // #swagger.summary = 'Update a specific test by ID'

    /* 

    #swagger.requestBody = {
        description: "Adding new test",
        content: {
            'application/json': {
                schema: {
                        id: {
                            type: "string"
                        },
                        "country": {
                            type: "string",
                            pattern: "^[A-Za-z ]+$",
                            maxLength: 50 
                        },
                        "city": {
                            type: "string",
                            pattern: "^[A-Za-z ]+$",
                            maxLength: 50 
                        }
                },
                example:{
                    "id": 1, 
                    "country": "Colombia"
                }
            }
        }
    }
    */

    const testData = req.body

    const test = Test(
        testData.id,
        testData.country,
        testData.city,
    )

    // Use the update model function to update this tes in the DB
    update(test).then(test => {
        res.status(200).json({
            status: 200,
            message: "Updated test",
            test: test
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to update test",
            error
        })
    })
})


//     === END THE ENDPOINT FOR UPDATE "PATCH" ===
//     === START THE ENDPOINT FOR UPDATE "PUT" ===


//validator Schema 
const updateTestSchemaPut = {
    type: "object",
    required: [
        "id",
        "country",
        "city"
    ],
    properties: {
        id: {
            type: "string"
        },
        "country": {
            type: "string",
            pattern: "^[A-Za-z ]+$",
            maxLength: 50 
        },
        "city": {
            type: "string",
            pattern: "^[A-Za-z ]+$",
            maxLength: 50 
        }
    }
}

testsControllers.put("/tests/",
[
    auth(["admin"]),
    validate({ body: updateTestSchemaPut }),
],async (req, res) => {
    // #swagger.summary = 'Update a specific test by ID'
    /* 

    #swagger.requestBody = {
        description: "Adding new test",
        content: {
            'application/json': {
                schema: {
                    id: {
                        type: "string"
                    },
                    "country": {
                        type: "string",
                        pattern: "^[A-Za-z ]+$",
                        maxLength: 50 
                    },
                    "city": {
                        type: "string",
                        pattern: "^[A-Za-z ]+$",
                        maxLength: 50 
                    }
                },
                example:{
                    "id": 1, 
                    "country" : "Colombia",
                    "city" : "Bogota"
                }
            }
        }
    }
    */


    const testData = req.body

    const test = Test(
        testData.id,
        testData.country,
        testData.city,
    )

    // Use the update model function to update this tes in the DB
    update(test).then(test => {
        res.status(200).json({
            status: 200,
            message: "Updated test",
            test: test
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to update test",
            error
        })
    })
})


//     === END THE ENDPOINT FOR UPDATE "PUT" ===
//     === START THE ENDPOINT FOR DELETE" ===

// Validator Schema
const deleteTestSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "string"
        }
    }
}

//DELETE, method: delete
//  Delete a specific test by ID
testsControllers.delete(
    "/tests/:id",
    [
        auth(["admin"]),
        validate({ body: deleteTestSchema }),
    ],    (req, res) => {
    // #swagger.summary = 'Delete a specific test by ID'

        const testID = req.params.id

        deleteByID(testID).then(result => {
            res.status(200).json({
                status: 200,
                message: "Test deleted",
                result
            })
        }).catch(error => { 
            res.status(500).json({
                status: 500,
                message: "Failed to delete a single test",
                error 
            })
        }) 
    }
)


//     === END THE ENDPOINT FOR DELETE" ===

//     === START THE ENDPOINT FOR DELETE MANY" ===
// validator Schema 

    const deleteManyTestsSchema = {
        type: "object",
        required: ["ids"],
        properties: {
            ids: {
                type: "array",
            }
        },
    }  


//DELETE MANY, methods: delete 
// Delete many tests by ID
testsControllers.delete(
    "/tests/deleteMany", ...
    [
        auth(["admin"]),
        validate({ body: deleteManyTestsSchema }),
    ],
    (req, res) => {
        console.log("Debug 0 /controllers/ Request body:", req.body); // Debugging statement

        // #swagger.summary = 'Delete many tests by ID'
/* 
    #swagger.requestBody = {
        description: "Deleting many tests",
        content: {
            'application/json': {
                schema: {
                        type: "object",
                        required: ["ids"],
                        properties: {
                            ids: {
                                type: "array",
                                items: {
                                    type: "object",
                                    required: ["id"],
                                    properties: {
                                        id: {
                                            type: "string",
                                        }
                                    }
                                }
                            }
                        }
                    },
                    example:{
                        "authenticationKey": "b2317874-ab1c-4d71-9883-2bba10b71ebd",
                        "ids": [
                            "64230e5570a4fd40cb4d2ca9",
                            "6423a3be27a38a7885ecdbc6" 
                        ]
                    }
                }
            }
        }
    }
*/

const testIds = req.body.ids;


    console.log("Debug 1 /Controllers/ TestIds:", testIds); // Debugging statement

    
    deleteManyById(testIds).then((result) => {
        console.log("Debug 2 /controllers/  result:", result); // Debugging statement

        res.status(200).json({
            status: 200,
            message: `${result} test(s) deleted`,
        })
    }).catch((error) => {
        console.log("Debug 3 /controllers/ error:", error); // Debugging statement
            res.status(500).json({
                status: 500,
                message: "Failed to delete many tests",
                error,
            })
        })
    }
)

//     === END THE ENDPOINT FOR DELETE MANY" ===


export default testsControllers


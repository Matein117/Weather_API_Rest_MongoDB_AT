import { Router } from "express";

import { validate } from "../middleware/validator.js";

import auth from "../middleware/auth.js";

import models from "../models/model-switcher.js";


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
        auth(["admin"]),
        validate({ body: getTestAllSchema }),
    ],
    async (req, res) => {
            // #swagger.summary = 'Get a collection of all tests'


        const tests = await models.testModel.getAll()

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
        models.testModel.getByID(testID).then(test => {
            res.status(200).json({
                status: 200,
                message: "Get test by ID",
                test: test
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to get test by ID",
            })
        })
    }
)

//     === END THE ENDPOINT FOR GET BY ID" ===
//     === START THE ENDPOINT FOR CREATE" ===


// Validator Schema 
const createTestSchema = {
    type: "object",
    required: ["country", "city"],
    properties: {
        country: {
            type: "string"
        },
        city: {
            type: "string"
        }
    }
}

testsControllers.post("/tests/", validate({ body: createTestSchema }), (req, res) => {
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
    const test = Test(null, testData.country, testData.city)

    // Use the create model function to insert this test into the DB
    models.testModel.create(test).then(test => {
        res.status(200).json({
            status: 200,
            message: "Created test",
            test: test,
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to created test",
        })
    })
})

//     === END THE ENDPOINT FOR CREATE" ===
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
    validate({ body: getTestAllSchema }),
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
    models.testModel.update(test).then(test => {
        res.status(200).json({
            status: 200,
            message: "Updated test",
            test: test
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to update test",
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
    validate({ body: getTestAllSchema }),
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
    models.testModel.update(test).then(test => {
        res.status(200).json({
            status: 200,
            message: "Updated test",
            test: test
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to update test",
        })
    })
})


//     === END THE ENDPOINT FOR UPDATE "PUT" ===
//     === START THE ENDPOINT FOR DELETE" ===

// Validator Schema
const deleteTestSchema = {
    type: "object",
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
        validate({ body: getTestAllSchema }),
    ],    (req, res) => {
    // #swagger.summary = 'Delete a specific test by ID'

        const testID = req.params.id

        models.testModel.deleteByID(testID).then(result => {
            res.status(200).json({
                status: 200,
                message: "Test deleted",
            })
        }).catch(error => { 
            res.status(500).json({
                status: 500,
                message: "Failed to delete tests"
            })
        }) 
    }
)


//     === END THE ENDPOINT FOR DELETE" ===


export default testsControllers


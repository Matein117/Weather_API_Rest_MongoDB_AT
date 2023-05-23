import { Router } from "express";
import bcrypt from "bcryptjs"
import { v4 as uuid4 } from "uuid"
import { User } from "../models/user.js";
import { create, createMany, getAll, getByID, update, deleteByID, getByAuthenticationKey, getByEmail, deleteMany  } from "../models/user-mdb.js";
import { validate } from "../middleware/validator.js";
import auth from "../middleware/auth.js";
import { removeNullFields } from "../models/utils.js";

const userController = Router()


// ======= START ENDPOINT TO LOGIN =========//

// SCHEMA
const postUserLoginSchema = {
    type: "object",
    required: ["email", "password"],
    properties: {
        email: {
            type: "string"
        },
        password: {
            type: "string"
        }
    }
}

userController.post(
    "/users/login",
    validate({ body: postUserLoginSchema }),
    (req, res) => {
        // access request body
        let loginData = req.body

        getByEmail(loginData.email)
            .then(user => {
                if (bcrypt.compareSync(loginData.password, user.password)) {
                    user.authenticationKey = uuid4().toString()

                    update(user).then(result => {
                        res.status(200).json({
                            status: 200,
                            message: "user logged in",
                            authenticationKey: user.authenticationKey,
                            result
                        })
                    })
                } else {
                    res.status(400).json({
                        status: 400,
                        message: "invalid credentials"
                    })

                }
            }).catch(error => {
                res.status(500).json({
                    status: 500,
                    message: "login failed",
                    error
                    
                })
            })
    }
)

// ======= END ENDPOINT TO LOGIN =========//

// ======= START ENDPOINT TO LOGOUT =========//

// SCHEMA
const postUserLogoutSchema = {
    type: "object",
    required: ["authenticationKey"],
    properties: {
        authenticationKey: {
            type: "string"
        }
    }
}

userController.post(
    "/users/logout",
    validate({ body: postUserLogoutSchema }),
    (req, res) => {
        const authenticationKey = req.body.authenticationKey
        getByAuthenticationKey(authenticationKey)
            .then(user => {
                user.authenticationKey = null
                update(user).then(user => {
                    res.status(200).json({
                        status: 200,
                        message: "user logged out",
                        user
                    })
                })
            }).catch(error => {
                res.status(500).json({
                    status: 500,
                    message: "failed to logout user",
                    error
                })
            })
    }
)


// ======= END ENDPOINT TO LOGOUT =========//

// ======= START ENDPOINT TO GET ALL LIST =========//


// SCHEMA
const getUserListSchema = {
    type: "object",
    properties: {}
}

userController.get(
    "/users",
    [
        auth(["admin","teacher"]),
        validate({ body: getUserListSchema }),
    ],
    async (req, res) => {
        // #swagger.summary = 'Get a collection of all users'
        const users = await getAll()

        res.status(200).json({
            status: 200,
            message: "User list",
            users: users,
        })
    }
)


// ======= END ENDPOINT TO GET ALL LIST =========//

// ======= START ENDPOINT TO GET BY ID =========//


/// SCHEMA
const getUserByIDSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "string",
        }
    }
}

userController.get(
    "/users/:id",
    [
    auth(["admin","teacher"]),
    validate({ params: getUserByIDSchema }),
    ],
    (req, res) => {
        // #swagger.summary = 'Get a specific user by ID 
        const userID = req.params.id

        getByID(userID).then(user => {
            res.status(200).json({
                status: 200,
                message: "Get user by ID",
                user: user,
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to get user by ID",
                error
            })
        })
    }
)


// ======= END ENDPOINT TO GET BY ID =========//

// ======= START ENDPOINT TO GET AUTHENTICATION KEY =========//


/// SCHEMA
const getUserByAuthenticationKeySchema = {
    type: "object",
    required: ["authenticationKey"],
    properties: {
        authenticationKey: {
            type: "string",
        }
    }
}

userController.get(
    "/users/by-key/:authenticationKey",
    validate({ params: getUserByAuthenticationKeySchema }),
    (req, res) => {
        const authenticationKey = req.params.authenticationKey

        getByAuthenticationKey(authenticationKey).then(user => {
            res.status(200).json({
                status: 200,
                message: "Get user by authentication key",
                user: user,
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to get user by authentication key",
            })
        })
    }
)


// ======= END ENDPOINT TO GET AUTHENTICATION KEY =========//

// ======= START ENDPOINT TO CREATE A SINGLE USER =========//


/// SCHEMA
const createUserSchema = {
    type: "object",
    required: [
        "email",
        "password",
        "role",
        "firstName",
        "lastName",
    ],
    properties: {
        email: {
            type: "string"
        },
        password: {
            type: "string"
        },
        role: {
            type: "string"
        },
        firstName: {
            type: "string"
        },
        lastName: {
            type: "string"
        },
    }
}

userController.post(
    "/users",
    [
        auth(["admin","teacher"]),   
        validate({ body: createUserSchema }),
    ],
    (req, res) => {
        // #swagger.summary = 'Create user' 
        const userData = req.body

        // hash the password if it isn't already hashed
        if (!userData.password.startsWith("$2a")) {
            userData.password = bcrypt.hashSync(userData.password);
        }

        // Convert the user data into an User model object
        const user = User(
            null,
            userData.email,
            userData.password,
            userData.role,
            userData.firstName,
            userData.lastName,
            null
        )

        // Use the create model function to insert this user into the DB
        create(user).then(user => {
            res.status(200).json({
                status: 200,
                message: "Created user",
                user: user
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to create user",
                error
            })
        })
    }
)


// ======= END ENDPOINT TO CREATE A SINGLE USER =========//

// ======= START ENDPOINT TO CREATE MANY USERS =========//

//  SCHEMA 
const createUserSchemaMany = {
    type: "object",
    properties: {
        user: {
            type: "array",
            items:{
                type: "object",
                properties: {
                    email: {
                        type: "string"
                    },
                    password: {
                        type: "string"
                    },
                    role: {
                        type: "string"
                    },
                    firstName: {
                        type: "string"
                    },
                    lastName: {
                        type: "string"
                    },
                },
                required: [
                    "email",
                    "password",
                    "role",
                    "firstName",
                    "lastName",
                ]
            }
        }
    },
    required: [
        "user"
    ]
};  

// CREATE, method: post
//Create a Many Users
userController.post("/users/many",
[
    auth(["admin","teacher","iotSensor"]),
    validate({ body: createUserSchemaMany }),                    
],
async (req, res) => {
    // #swagger.summary = 'Create a many Users'
    /* 

    #swagger.requestBody = {
    description: "Adding many Users in one single station",
    content: {
        'application/json': {
            schema: {
                type: 'array',
                items: {
                    type: "object",
                    properties: {
                        email: {
                            type: "string"
                        },
                        password: {
                            type: "string"
                        },
                        role: {
                            type: "string"
                        },
                        firstName: {
                            type: "string"
                        },
                        lastName: {
                            type: "string"
                        }
                    },
                    example:{
                        "authenticationKey": "b2317874-ab1c-4d71-9883-2bba10b71ebd",
                        "user": [
                            {
                                "email": "studentB@server.com",
                                "password": "abc123",
                                "role": "studentB",
                                "firstName": "studentB",
                                "lastName": "studentB"
                            },
                            {
                                "email": "studentC@server.com",
                                "password": "abc123",
                                "role": "studentC",
                                "firstName": "studentC",
                                "lastName": "studentC"
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

    const userData = req.body

    if (userData.user && userData.user.length > 0) {
        userData.user.forEach(userDataItem => {
            if (userDataItem.password && !userDataItem.password.startsWith("$2a")) {
                userDataItem.password = bcrypt.hashSync(userDataItem.password);
            }
        });

        const users = userData.user.map(userDataItem => ({
            email: userDataItem.email,
            password: userDataItem.password,
            role: userDataItem.role,
            firstName: userDataItem.firstName,
            lastName: userDataItem.lastName,
        }));

        createMany(users)
            .then(insertedUsers => {
                console.log("Inserted users:", insertedUsers);
                res.status(200).json({
                    status: 200,
                    message: "Created many Users",
                    users: insertedUsers,
                });
            })
            .catch(error => {
                console.log("Error:", error);
                res.status(500).json({
                    status: 500,
                    message: "Failed to create many Users",
                    error,
                });
            });
    } else {
        res.status(400).json({
            status: 400,
            message: "No user data provided",
        });
    }
});


// ======= END ENDPOINT TO CREATE MANY USERS =========//

// ======= START ENDPOINT TO REGISTER =========//


/// SCHEMA
const registerUserSchema = {
    type: "object",
    required: [
        "email",
        "password",
        "firstName",
        "lastName",
    ],
    properties: {
        email: {
            type: "string"
        },
        password: {
            type: "string"
        },
        firstName: {
            type: "string"
        },
        lastName: {
            type: "string"
        },
    }
}
userController.post(
    "/users/register",
    validate({ body: registerUserSchema }),
    (req, res) => {
        // Get the user data out of the request
        const userData = req.body

        // hash the password 
        userData.password = bcrypt.hashSync(userData.password);

        // Convert the user data into an User model object
        const user = User(
            null,
            userData.email,
            userData.password,
            "spotter",
            userData.firstName,
            userData.lastName,
            null
        )

        // Use the create model function to insert this user into the DB
        create(user).then(user => {
            res.status(200).json({
                status: 200,
                message: "Registration successful",
                user: user
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Registration failed",
                error
            })
        })
    }
)


// ======= END ENDPOINT TO REGISTER =========//

// ======= START ENDPOINT TO UPDATE =========//


// SCHEMA
const updateUserSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "string"
        },
        email: {
            type: "string"
        },
        password: {
            type: "string"
        },
        role: {
            type: "string"
        },
        firstName: {
            type: "string"
        },
        lastName: {
            type: "string"
        },
        authenticationKey: {
            type: ["string", "null"]
        },
    }
}

userController.patch(
    "/users",
    [
        auth(["admin"]),
        validate({ body: updateUserSchema }),
    ],
    async (req, res) => {
        // #swagger.summary = 'Update user by ID PATCH' 
        const userData = req.body

        // hash the password if it isn't already hashed
        if (userData.password && !userData.password.startsWith("$2a")) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        // Convert the user data into a User model object
        const user = User(
            userData.id,
            userData.email,
            userData.password,
            userData.role,
            userData.firstName,
            userData.lastName,
            userData.authenticationKey
        )

        const userNoNull = removeNullFields(user) // this function avoid lost of data when is updated 
        
        // Use the update model function to update this user in the DB
        update(userNoNull).then(userNoNull => {
            res.status(200).json({
                status: 200,
                message: "Updated user",
                userNoNull: userNoNull
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to update user",
                error
            })
        })
    })


// ======= END ENDPOINT TO UPDATE =========//

// TODO: endpoint with PUT here

// ======= START END POINT TO DELETE MANY =========// 

// SCHEMA 

const deleteManyUsersSchema = {
    type: "object",
    required: ["ids"],
    properties: {
        ids: {
            type: "array",
        }
    },
}  


//DELETE MANY, methods: delete 
// Delete many Users by ID
userController.delete(
"/users/deleteMany",
[
    auth(["admin"]),
    validate({ body: deleteManyUsersSchema }),
],
(req, res) => {
    console.log("Debug 0 /controllers/ Request body:", req.body); // Debugging statement

    // #swagger.summary = 'Delete many Users by ID'
/* 
#swagger.requestBody = {
    description: "Deleting many Users",
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
                        "645b3f4e9b9feee93455ea90",
                        "645b3f4e9b9feee93455ea8f" 
                    ]
                }
            }
        }
    }
}
*/

const userIds = req.body.ids;


console.log("Debug 1 /Controllers/ userIds:", userIds); // Debugging statement


deleteMany(userIds).then((result) => {
    console.log("Debug 2 /controllers/  result:", result); // Debugging statement

    res.status(200).json({
        status: 200,
        message: `${result} user(s) deleted`,
    })
}).catch((error) => {
    console.log("Debug 3 /controllers/ error:", error); // Debugging statement
        res.status(500).json({
            status: 500,
            message: "Failed to delete many Users",
            error,
        })
    })
}
)

// ======= START END POINT TO DELETE MANY =========// 


// ======= START ENDPOINT TO DELETE =========//

/// SCHEMA
const deleteUserByIDSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "string",
        }
    }
}

userController.delete(
    "/users/:id",
    [
        auth(["admin"]),
        validate({ params: deleteUserByIDSchema }),
    ],
    (req, res) => {
    // #swagger.summary = 'Delete a specific user By ID'
        const userID = req.body.id

        deleteByID(userID).then(result => {
            res.status(200).json({
                status: 200,
                message: "Single User deleted",
                result
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to delete user",
                error
            })
        })
    }
)

// ======= END ENDPOINT TO DELETE  =========// 



//     === START THE ENDPOINT TO UPDATE MANY USERS === //
 //TODO: CREATE END POINT TO UPDATE MANY USERS 
//     === START THE ENDPOINT TO UPDATE MANY USERS === //



export default userController
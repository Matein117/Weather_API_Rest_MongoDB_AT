import { Router } from "express";
import bcrypt from "bcryptjs"
import { v4 as uuid4 } from "uuid"
import { User } from "../models/user.js";
import models from "../models/model-switcher.js"
import { validate } from "../middleware/validator.js";
import auth from "../middleware/auth.js";
import { removeNullFields } from "../models/utils.js";

const userController = Router()


// User login endpoint
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

        models.userModel.getByEmail(loginData.email)
            .then(user => {
                if (bcrypt.compareSync(loginData.password, user.password)) {
                    user.authenticationKey = uuid4().toString()

                    models.userModel.update(user).then(result => {
                        res.status(200).json({
                            status: 200,
                            message: "user logged in",
                            authenticationKey: user.authenticationKey,
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
                    message: "login failed"
                })
            })
    }
)

// User logout endpoint
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
        models.userModel.getByAuthenticationKey(authenticationKey)
            .then(user => {
                user.authenticationKey = null
                models.userModel.update(user).then(user => {
                    res.status(200).json({
                        status: 200,
                        message: "user logged out"
                    })
                })
            }).catch(error => {
                res.status(500).json({
                    status: 500,
                    message: "failed to logout user"
                })
            })
    }
)


// Get user list endpoint
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
        const users = await models.userModel.getAll()

        res.status(200).json({
            status: 200,
            message: "User list",
            users: users,
        })
    }
)

/// Get user by ID endpoint
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

        models.userModel.getByID(userID).then(user => {
            res.status(200).json({
                status: 200,
                message: "Get user by ID",
                user: user,
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to get user by ID",
            })
        })
    }
)

/// Get user by authentication key endpoint
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

        models.userModel.getByAuthenticationKey(authenticationKey).then(user => {
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

/// Create user endpoint
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
        models.userModel.create(user).then(user => {
            res.status(200).json({
                status: 200,
                message: "Created user",
                user: user
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to create user",
            })
        })
    }
)

/// Register user endpoint
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
        models.userModel.create(user).then(user => {
            res.status(200).json({
                status: 200,
                message: "Registration successful",
                user: user
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Registration failed",
            })
        })
    }
)

// Update user endpoint
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
        models.userModel.update(userNoNull).then(userNoNull => {
            res.status(200).json({
                status: 200,
                message: "Updated user",
                userNoNull: userNoNull
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to update user",
            })
        })
    })


// TODO: endpoint with PUT here

/// Delete user by ID endpoint
const deleteUserByIDSchema = {
    type: "object",
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
        const userID = req.params.id

        models.userModel.deleteByID(userID).then(result => {
            res.status(200).json({
                status: 200,
                message: "User deleted",
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to delete user",
            })
        })
    }
)

export default userController
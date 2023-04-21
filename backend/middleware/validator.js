import { response } from "express"
import { Validator, ValidationError } from "express-json-validator-middleware"

// create validator object 
const validator = new Validator()

// Export error handling middleware for use in endpoints 
export const validate = validator.validate

// Export error handling middleware 
export const validateErrorMiddleware = (error, req, res, next) => {
    if (response.headersSent) {
        return next(error)
    }

    const isValidationError = error instanceof ValidationError
    if (!isValidationError) {
        return next(error)
    }

    res.status(400).json ({
        status: 400,
        message: "Validation error",
        errors: error.validationErrors,
    })
}
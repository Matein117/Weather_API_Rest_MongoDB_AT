import { getByAuthenticationKey } from "../models/user-mdb.js";

export default function auth(allowed_roles) {
    return function (req, res, next) {
        const authenticationKey = req.body.authenticationKey;

        if (authenticationKey) {

            getByAuthenticationKey(authenticationKey)
                .then(user => {
                    // console.log(user)
                    if (allowed_roles.includes(user.role)) {
                        next()
                    } else {
                        res.status(403).json({
                            status: 403,
                            message:"Access forbidden",
                        });
                    }
                })
                .catch(error => {
                    res.status(401).json({
                        status: 401,
                        message: "Authentication key invalid",
                        error
                    });
                })
        } else {
            res.status(401).json({
                status: 401,
                message: "Authentication key missing",
            });
        }
    };
}
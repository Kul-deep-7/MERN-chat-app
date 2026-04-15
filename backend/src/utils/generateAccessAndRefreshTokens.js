import jwt from "jsonwebtoken"
import User from "../models/user.models.js"
import ApiError from "./ApiError.js"

const generateAccessAndRefreshTokens = async(userId)=> {
    try {
        const user = await User.findById(userId)

        if (!user) {
            throw new ApiError(404, "User not found while generating tokens")
        }

        const accessToken =user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        //console.log(process.env.ACCESS_TOKEN_SECRET)

        return {accessToken, refreshToken}
        } catch (error) {
            console.log("TOKEN GENERATION ERROR:", error)
            throw new ApiError(500, "Could not generate tokens")
    }
}

export default generateAccessAndRefreshTokens


/*

This function generates access token and refresh token for a user during login.
First, it finds the user in the database using the provided userId.
Then it calls model methods generateAccessToken() and generateRefreshToken() defined on the User schema.
After generating the refresh token, it stores it in the database for future validation and logout security.
validateBeforeSave: false is used to skip schema validations while saving only the refresh token.
Finally, it returns both tokens to be sent as cookies or response to the client.
If any error occurs, it throws an ApiError for centralized error handling.



This function generates access and refresh tokens for authenticated users.

Flow:
1. Fetch user from DB using userId
2. Generate accessToken (short-lived) and refreshToken (long-lived) using schema methods
3. Store refreshToken in DB for logout and token rotation security
4. Skip validation using validateBeforeSave since only refreshToken is updated
5. Return both tokens to be sent as httpOnly cookies

This pattern improves:
- Security (refresh token validation)
- Logout control (token invalidation)
- Session persistence (refresh flow)

*/
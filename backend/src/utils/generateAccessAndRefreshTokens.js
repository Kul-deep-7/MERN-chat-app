import jwt from "jsonwebtoken"
import User from "../models/user.models.js"

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
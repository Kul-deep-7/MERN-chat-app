import  ApiError  from "../utils/ApiError.js";
import  asyncHandler  from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import  User  from "../models/user.models.js";

export const verifyJWT = asyncHandler(async(req, res, next) => {
    try {
        console.log("Auth middleware called");
        
        const token = req.cookies?.accessToken || 
                     req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            //console.log(" No token provided");
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

         const user = await User.findById(decodedToken._id)
                        .select("-Password -refreshToken");


        if (!user) {
            console.log(" User not found for ID:", decodedToken._id);
            throw new ApiError(401, "Invalid Access Token");
        }

        //console.log(" User authenticated:", user.Username);
        req.user = user; //req object with .user(we can name it .cooldeep too) has the user from above
        next();

    } catch (error) {
        console.error("Auth error:", error.name, "-", error.message);
        
        if (error.name === "JsonWebTokenError") {
            throw new ApiError(401, "Invalid token");
        }
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Token expired");
        }
        
        throw error;
    }
});
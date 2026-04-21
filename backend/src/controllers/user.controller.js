import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import deleteFromCloudinary from "../utils/cloudinary.js";
import User from "../models/user.models.js";
import bcrypt from "bcrypt"
import generateAccessAndRefreshTokens from "../utils/generateAccessAndRefreshTokens.js";
import jwt from "jsonwebtoken"

//async(req,res)=>{} is callback because asyncHandler is function
//signUp will become a callback fuction when we pass  it to .get(), .post(), etc which are fundamental HTTP request methods acting as functions in programming.
//signUp → callback to Express router

const signUp = asyncHandler(async (req,res)=>{
    const {fullName, email, password, bio} = req.body

    if(!fullName || fullName.trim()===""){
        throw new ApiError(400,"Name is required")
    }else if(!email || email.trim()===""){
        throw new ApiError(400,"Email is required")
    }else if(!password || password.trim()===""){
        throw new ApiError(400,"Password is required")
    }else if(!bio || bio.trim()===""){
        throw new ApiError(400,"Bio is required")
    }
    
    const existedUser = await User.findOne({email})

    if(existedUser){
        throw new ApiError(400, "User with same email or fullName exists")
    }

    const profilePicLocalPath = req.file?.path

    if(!profilePicLocalPath){
        throw new ApiError(400, "Profile picture is required")
    }

    const ProfilePicCloudinary = await uploadOnCloudinary(profilePicLocalPath)

    if(!ProfilePicCloudinary){
        throw new ApiError(500, "Could not upload on cloudinary")
    }

    //using bcrypt to hash the password before saving it to the database for security reasons.
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        fullName,
        email,
        password : hashedPassword,
        bio,
        profilePic: { 
            url : ProfilePicCloudinary?.url || "" ,
            public_id: ProfilePicCloudinary?.public_id
        }
    }) // not safe to  send this to frontend cuz it contains sensitive info

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "User registered successfully", createdUser))
})


const LoginUser = asyncHandler(async(req,res)=>{
    const {email, password} = req.body

    if(!email || email.trim() === ""){
        throw new ApiError(400, "Email is required")
    }

    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(400, "User with this email does not exists")
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if(!isPasswordCorrect){
        throw new ApiError(400, "Incorrect password")
    }

    const {refreshToken, accessToken}= await generateAccessAndRefreshTokens(user._id) 

    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")

    const options = {
    httpOnly: true, 
    secure: false, //true in production & false in development
 
    }

    return res
            .status(200)
            .cookie("accessToken", accessToken, options) //sending tokens as cookies it is v secure cuz JS cannot access tokens as it prevents XSS atks/security atk
            .cookie("refreshToken", refreshToken,options) 
            .json(
                new ApiResponse(200, {loggedInUser}, "user logged in successfully")
            )
})

const logoutUser = asyncHandler(async(req,res)=>{
    
    await User.findByIdAndUpdate(
        req.user._id, 
        {
            $set:{ 
                refreshToken : undefined
            }
        },
        {
            new : true 
        }
    )

    const options = {
    httpOnly: true, 
    secure: true 
}

    return res
    .status(200)
    .clearCookie("accessToken", options) //we stored accessToken in key value pairs in login controller here we only need key
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged out successfully"))

})

const refreshAccessToken = asyncHandler(async(req,res)=>{

    const incomingRefreshToken = req.cookies.refreshToken 

    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if(!user){
            throw new ApiError(401, "invalid refresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "refresh token mismatch. possible token reuse")
        }    

            const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

            const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, 
                {accessToken, refreshToken},
                "Access token refreshed successfully"
        )
    )
    } catch (error) {
        throw new ApiError(401, "invalid refresh token" )
    }


})


const updateProfile = asyncHandler(async(req,res)=>{
    const {fullName, bio} = req.body

    if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized, no user found to be updated")
    }

//finding existingUser from DB, so can delete the old cloudinary img 
    const existingUser = await User.findById(req.user._id) 

    const profilePicLocalPath = req.file?.path

    let uploadedProfilePic = null //we can have this as let uploadedProfilePic;

//if user uploads Profilepic then run this..
    if (profilePicLocalPath) {
        uploadedProfilePic = await uploadOnCloudinary(profilePicLocalPath)

        if (!uploadedProfilePic) {
            throw new ApiError(500, "Error uploading profile picture")
        }
    }

    //empty object to store the updated fields..is an empty obj where fullName, bio & profile pic are conditionally pushed/ created
    const updateFields = {}

    // If fullName comes in req obj in req.body AND after trimming it's not empty then add it in updateFields obj
    if (fullName?.trim()) {
        updateFields.fullName = fullName
    }

    if (bio?.trim()) {
        updateFields.bio = bio
    }

    //if new image uplaoded add profilePic data to updateFields
    if (uploadedProfilePic) {
        updateFields.profilePic = {
            url: uploadedProfilePic.url,
            public_id: uploadedProfilePic.public_id
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: updateFields
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    if (!updatedUser) {
        throw new ApiError(
            500,
            "Something went wrong while updating profile"
        )
    }

     // Delete old image after successful update
    if (uploadedProfilePic && existingUser?.profilePic?.public_id) {
            await deleteFromCloudinary(existingUser.profilePic.public_id)
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "profile updated successfully" ))
})



export  {signUp, LoginUser, logoutUser, refreshAccessToken, updateProfile}
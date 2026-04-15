import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import User from "../models/user.models.js";
import bcrypt from "bcrypt"
import generateAccessAndRefreshTokens from "../utils/generateAccessAndRefreshTokens.js";

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
    
    const existedUser = await User.findOne({
        $or: [{email}, {fullName}]
    })

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
        profilePic: ProfilePicCloudinary?.url || ""
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



export  {signUp, LoginUser, logoutUser}
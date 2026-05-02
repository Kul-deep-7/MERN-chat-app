import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true, 
        unique : true,   
    },
    email: {
        type: String,
        required: true, 
        unique: true   
    },
    password: {
        type: String,
        required: true, 
        minlength: 6
    },
    profilePic: {
        url: {
            type: String,
            default: ""
        },
        public_id: {
            type: String,
            default: ""
        }
    },
    bio: {
        type: String,  
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
})



userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.ACCESS_TOKEN_SECRET, //secret key to sign the token or password
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,//instruction 
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

const User = mongoose.model("User", userSchema)

export default User
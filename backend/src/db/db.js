import mongoose from "mongoose"

const connectDB = async () => {
    try {

        //event listener for MongoDB connection: Runs when MongoDB connects successfully.
        // mongoose.connection.on("connected", () => {
        //     console.log("MongoDB connected")
        // })

        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
        console.log("MongoDB connected")
      
    } catch (e) {
        console.log("Mongo error",e)
    }
}

export default connectDB
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.models.js";
import Message from "../models/message.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js"

            //tutorial code
//If your app has 10,000 users → you fetch 9,999 users Sidebar becomes unusable. DB load = unnecessary
 /*  BAD LOGIC
        Returns every user in database
        No pagination
        No relevance (you may never have chatted with them)
        BUT since we are learning and testing this is fine for project but will surely collapse irw..
*/


const getUsersForSidebar = asyncHandler(async(req, res)=>{
    const userId = req.user._id; //Getting logged-in user from JWT middleware.

    const filteredUsers = await User.find( //Fetch all users except yourself. BAD
        {
            _id: {
                    $ne: userId //$ne = "not equal"
                }
        }).select("-password -refreshToken") 
   
    const unseenMessages = {} //→ Object to store unread counts.
    // Will look something like: { "userId1": 3, "userId2": 1 }
    // key = sender's ID, value = how many unread messages from them

    const promises = filteredUsers.map(async (user)=>{ //looping over each user....
    // find() → gives full data (heavy)
    // countDocuments() → gives just number of the data (light)
        const messages = await Message.countDocuments({
            senderID: user._id, // messages sent BY this sidebar user
            receiverID: userId, // sent TO the logged-in user (you)
            seen: false})       // only count unread ones
            // countDocuments just returns a number — doesn't load message content.
            // Way better than .find() which loads full documents just to count them.
            if(messages > 0){
                //could have been messages.length if we used .find() method as it return array but since we used countDocuments() it directly gives us the number count.
                unseenMessages[user._id] = messages; //user._id is dynamic key so whenever an iteration runs it will create a new key in unseenMessages object with that 
                // user._id and assign the count of unseen messages as value to that key. like {a:3 , b: 5} where a & b are user_ids  & if c have sent 0 msg and then it 
                // owont be added in the obj
                //if messages is greated than 0 then only we add that user to unseenMessages obj with key as user._id & value as number of unseen msgs.
                //Use this user’s ID as a key, and store how many unread messages they sent me
            }
    })
    await Promise.all(promises) //Waits for ALL async counts to finish.  Ensures object is fully filled before sending response

    return res 
        .status(200)
        .json(ApiResponse(200, {users : filteredUsers, unseenMessages},"get all users done"))
})


//get all messages for selected User

const getMessages = asyncHandler(async(req,res)=>{

    const {id} = req.params
    const myId = req.user._id

    await Message.updateMany({
        senderID : id,
        receiverID : myId
    },
    {
        seen : true
    }
)


    const messages = await Message.find({
        $or: [
            {
                senderID : myId,
                receiverID : id
            },
            {
                senderID : id,
                receiverID : myId
            },
        ]
    })

    return res
        .status(200)
        .json(new ApiResponse(200, messages, "got all messages"))
})


// api to mark messages as seen using message id
const markMessageAsSeen = asyncHandler(async(req,res)=>{
    const {id} = req.params
    await Message.findByIdAndUpdate(id, {seen : true}, {new : true})

    return res
        .status(200)
        .json(new ApiResponse(200, "messages are seen"))
})

//send message to selected user..

const sendMessage = asyncHandler(async(req, res)=>{
    const { text } = req.body;
    const receiverID = req.params.id;
    const senderID = req.user._id

    const profilePicLocalPath = req.file?.path
    let uploadedProfilePic = null

    if (profilePicLocalPath) {
        uploadedProfilePic = await uploadOnCloudinary(profilePicLocalPath)

        if (!uploadedProfilePic) {
            throw new ApiError(500, "Error uploading picture in chat")
        }
    }

    const newMessage = await Message.create({
        senderID,
        receiverID,
        text,
        image : uploadProfilePic?.url
    })

    return res
    .status(200)
    .json(new ApiResponse (201, newMessage, "Message created"))

})
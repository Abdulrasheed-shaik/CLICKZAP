import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    message: {
        type: String
    },
    post: {
        caption: { type: String },
        media: [
            {
                url: { type: String },
                type: { type: String, enum: ["image", "video"] }
            }
        ]
    }
})
export const Message = mongoose.model("Message",messageSchema)
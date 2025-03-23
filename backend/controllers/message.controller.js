import { Conversation } from "../models/conversation.model.js"
import { Message } from "../models/message.model.js"
import { Post } from "../models/post.model.js"; // Import Post model
import { getReceiverSocketId, io } from "../socket/socket.js"

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { textMessage, postId } = req.body;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        // Establish conversation if it doesn't exist
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        // Prepare message object
        const newMessageData = {
            senderId,
            receiverId
        };

        if (textMessage) {
            newMessageData.message = textMessage;
        }

        if (postId) {
            const post = await Post.findById(postId).populate('author', 'username profilePicture');
            if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

            newMessageData.post = {
                caption: post.caption,
                media: post.media, // Contains image/video URLs
                username: post.author?.username, //  Corrected field
                profilePicture: post.author?.profilePicture //  Corrected fiel
            };
        }

        const newMessage = await Message.create(newMessageData);
        conversation.messages.push(newMessage._id);
        await Promise.all([conversation.save(), newMessage.save()]);

        // Emit real-time update
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        return res.status(201).json({ success: true, newMessage });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getMessage = async (req,res)=>{
    try {
        const senderId = req.id
        const receiverId = req.params.id

        const conversation = await Conversation.findOne({
            participants:{$all:[senderId, receiverId]}
        }).populate({
            path: 'messages',
            populate: {
                path: 'post',
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            }
        });

        
        if(!conversation){
            return res.status(200).json({
                success:true,
                message:[]
            })
        }
        return res.status(200).json({
            success:true,
            messages:conversation?.messages || []
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
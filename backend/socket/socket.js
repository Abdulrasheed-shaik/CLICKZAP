import {Server} from 'socket.io'
import express from 'express'
import http from 'http'

const app = express()

const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:'https://clickzap-1.onrender.com',
        methods:['GET','POST']
    }
})
const userSocketMap  = {} //this map stores the socket id corresponding the user id ; userId ->socketid

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId]
io.on('connection',(socket)=>{
    const userId = socket.handshake.query.userId
    if(userId){
        userSocketMap[userId] = socket.id
        console.log(`User connected : UserId = ${userId}, socketId = ${socket.id}`);
        
    }
    io.emit('getOnlineUsers',Object.keys(userSocketMap))
    socket.on('disconnect',()=>{
        if(userId){
            console.log(`User disconnected : UserId = ${userId}, socketId = ${socket.id}`);
            delete userSocketMap[userId]
        }
        io.emit('getOnlineUsers',Object.keys(userSocketMap))
    })
    socket.on("message", ({ senderId, receiverId, textMessage, postId }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", {
                senderId,
                textMessage,
                postId
            });
        }
    });
})

export {app, server, io}
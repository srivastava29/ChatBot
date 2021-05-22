const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const formatMsg = require('./utils/messages') 
const {userJoin,getCurrentUser,leaveRoom,getRoomUsers} = require('./utils/users') 
 

const app = express()
const server = http.createServer(app)

const io = socketio(server)

//set static folder

app.use(express.static(path.join(__dirname,'public')))

const botname="ChatBot"

//when client connects

io.on('connection', socket =>{
    socket.on('joinRoom',({username,room})=>{
    const user =userJoin(socket.id,username,room) 
      
    socket.join(user.room)    

    socket.emit("message", formatMsg(botname,"Welcome to chat Bot")) //single client that connects
    socket.broadcast.to(user.room).emit("message",formatMsg(botname,`${user.username} has joined the chat`)) //to everyone excepts the client that connects
    
    io.to(user.room).emit('roomUsers',{
        room:user.room,
        users: getRoomUsers(user.room)
    })
    })

   
    socket.on('chatMessage', (msg)=>{
        const user = getCurrentUser(socket.id)
        console.log(user)
        io.to(user.room).emit("message",formatMsg(user.username,msg))
    })

    socket.on('disconnect', ()=>{
        const user = leaveRoom(socket.id)
        if(user)
        {
        io.to(user.room).emit("message",formatMsg(botname,`${user.username} has left the chat`)); // to everyone
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users: getRoomUsers(user.room)
        })
        }
    })

})

const PORT = 8000 || process.env.PORT

server.listen(PORT,()=>console.log(`Server running on PORT${PORT}`))


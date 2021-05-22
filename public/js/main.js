const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const roomUsers = document.getElementById('users')


const socket = io();

const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix : true
});

socket.emit('joinRoom',{username,room})

socket.on('roomUsers',({room,users})=>{
    outputRoomName(room)
    outputUsers(users)
    console.log(users)
})

socket.on("message",message=>{
    console.log(message)
    outputMessage(message);

    //scroll down
chatMessages.scrollTop=chatMessages.scrollHeight
})


chatForm.addEventListener('submit',(e)=>
{
    e.preventDefault();
    const msg = e.target.elements.msg.value;


    //emit message to server
    socket.emit('chatMessage',msg)
    e.target.elements.msg.value=""
    e.target.elements.msg.focus()
})


function outputMessage(msg)
{
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML=`<p class="meta">${msg.user} <span>${msg.time}</span></p>
    <p class="text">
        ${msg.message}.
    </p>`

    document.querySelector('.chat-messages').appendChild(div)
}

function outputRoomName(room)
{
    roomName.innerHTML=room
}

function outputUsers(users)
{
    roomUsers.innerHTML=`${users.map(user=>`<li>${user.username}</li>`).join('')}`
}
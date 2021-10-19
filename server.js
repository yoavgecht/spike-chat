const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require('./public/js/formatMessage');
const { userJoin, getCurrentUser, getChatUsers, userLeave } = require('./public/js/users');

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

const adminName = 'Spike Chat Admin';

//Run when client connects
io.on('connection', socket => {
    console.log('WS connection');
    // socket.emit - send a message only to the connect user
    socket.emit('message', formatMessage(adminName, 'Hi, Welcome to Spike Chat  :)'));
    socket.on('joinChat', (username) => {
        console.log('JOINCHAT', username);
        const user = userJoin(socket.id, username);
       // console.log('user', user);
        //socket.broadcast - Broadcast a message to every connected user except the connected user
        socket.broadcast.emit('message', formatMessage(adminName, `${user.username} has join the chat`));

        io.emit('users', {
            users: getChatUsers(user)
          });
    })
    
    //Listen for chat message
    socket.on('message', (msg) => {
        const user = getCurrentUser(socket.id);
        io.emit('message', formatMessage(user.username, msg))
    });

     //  Runs when user disconnects
     socket.on('disconnect', () => {    
        const user = userLeave(socket.id);
        if(user) {
            //io.emit - broadcast to everyone including the connected user
            io.emit('message', formatMessage(adminName, `${user.username} has left the chat`))
        }
    });
        
})





const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

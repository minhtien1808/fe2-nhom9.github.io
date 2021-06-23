const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const { Socket } = require('dgram');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');






const app = express();
const server = http.createServer(app);
const io = socketio(server);



app.use(express.static(path.join(__dirname, 'public')));
// tao ten bot
const botName = 'Tiến dz vc Bot :> : ';

// chạy khi người dùng kêt nối 
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);
        socket.emit('message', formatMessage(botName, 'chào mừng bạn đến với Tìm Bạn Bốn Phương ^^ !'));

        // hiển thị khi người dùng kết nối vào phòng
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `Chào Mừng ${user.username} Đã Tham Gia Phòng Trò Truyện`));
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

        // nhận tin nhắn 
        socket.on('chatMessage', msg => {
            const user = getCurrentUser(socket.id);


            io.to(user.room).emit('message', formatMessage(user.username, msg));
        })

    });
    // hiển thị khi người dùng ngắt kết nối
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username} đã rời khỏi phòng !`)
            );

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});
const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
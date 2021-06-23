const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
// Lấy tên người dùng và tên phòng trên URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// tham gia vào chat room
socket.emit('joinRoom', { username, room });
// lấy thông tin người dùng và phòng
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});
// tin nhan tu server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // xử lý thanh cuộn đi xuống 
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Gửi tin nhắn đi

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //lấy dử liệu tin nhắn trong ô button 
    let msg = e.target.elements.msg.value;

    msg = msg.trim();

    if (!msg) {
        return false;
    }
    // chạy tin nhắn của người dùng lên server
    socket.emit('chatMessage', msg);
    // xóa dữ liệu nhập vào khi đã gửi đi 
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});
//Xuat thong bao bang DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}
// thêm tên phòng bằng DOM 
function outputRoomName(room) {
    roomName.innerText = room;
}

// thêm người dùng bằng DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}

//hiển thị cảnh báo khi người dùng rời khỏi phòng
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('bạn có chắc là rời phòng chat? người còn lại sẽ buồn lắm đấy :((');
    if (leaveRoom) {
        window.location = '../index.html';
    } else {}
});
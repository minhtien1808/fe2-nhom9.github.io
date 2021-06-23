const users = [];

// người dùng tham gia phòng
function userJoin(id, username, room) {
    const user = { id, username, room };
    users.push(user);
    return user;
}
//lay thong tin nguoi dung 
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}
// người dùng khi rời khỏi phòng 
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Lấy dử liệu phòng của người dùng 
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}
module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};
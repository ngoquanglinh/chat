const users = [];

//join user romm chat
function userJoin(id, username, room) {
    const user = { id, username, room };

    users.push(user);

    return user;
}

// lay user hien tai

function getCurrenUser(id) {
    return users.find(user => user.id == id);
}
// xoa user
function userLead(id) {
    const index = users.findIndex(user => user.id == id);
    if (index != -1) {
        return users.splice(index, 1)[0];
    }
}
// lay phong cua user
function getRoomUsers(room) {
    return users.filter(user => user.room == room)
}
module.exports = {
    userJoin,
    getCurrenUser,
    userLead,
    getRoomUsers
}
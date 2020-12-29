
const chatForm = document.getElementById('chat-form');
const socket = io();
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
})

// vao phong
socket.emit('joinRoom', { username, room });

// lay room user


socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// tin nhan tu server
socket.on('message', message => {
    // console.log(message);
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


// gui tin nhan
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // lay tin nhan tu input
    const msg = e.target.elements.msg.value;
    msg = msg.trim();
    console.log(msg, "a");
    if (!msg) {
        return false;
    }

    // gui tin nhan len serve
    socket.emit('chatMessage', msg);

    //xoa input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

})

// hien tin  nhan ra 
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
// them ten phong
function outputRoomName(room) {
    roomName.innerText = room;
}
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}
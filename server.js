const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/message");
const { userJoin, getCurrenUser,
    userLead, getRoomUsers } = require("./utils/user");


const app = express();
const server = http.createServer(app);
const io = socketio(server);

// STATIC folder
app.use(express.static(path.join(__dirname, "public")));

const botName = 'ChatCord Bot';

// run khi connect
io.on("connection", socket => {
    socket.on("joinRoom", ({ username, room }) => {

        const user = userJoin(socket.id, username, room);
        socket.join(user.user);

        // user hien tai vao
        socket.emit("message", formatMessage(botName, "xin chao"));

        //phat song  khi user connect
        socket.broadcast
            .to(user.room)
            .emit("message", formatMessage(botName, `${user.username}  has joined the chat`));

        // send user and room
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    })

    // lang nghe 
    socket.on("chatMessage", (msg) => {
        const user = getCurrenUser(socket.id);
        io.to(user.room)
            .emit("message", formatMessage(user.username, msg));
    })

    // khi user disconnect
    socket.on("disconnect", () => {
        const user = userLead(socket.id);
        if (user) {
            io.to(user.room)
                .emit("message", formatMessage(user.username, `${user.username} roi khoi phong chat`));

            // send user and room
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }

    })
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`server runing on port ${PORT}`));
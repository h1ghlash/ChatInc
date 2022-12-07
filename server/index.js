const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messagesRoute = require("./routes/messagesRoute")
const cookieParser = require("cookie-parser");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors({
    origin:  "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoute);

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("DB connection successfull");
        }).catch((err) => {
            console.log(err.message);
        });
        const server = app.listen(process.env.PORT, ()=>
            console.log(`Server started on port ${process.env.PORT}`)
        );
        const io = socket(server, {
            cors: {
                origin: "http://localhost:3000",
                credentials: true,
            },
        });

        global.onlineUsers = new Map();
        io.on("connection", (socket) => {
            global.chatSocket = socket;
            socket.on("add-user", (userId) => {
                onlineUsers.set(userId, socket.id);
            });

            socket.on("send-msg", (data) => {
                const sendUserSocket = onlineUsers.get(data.to);
                if (sendUserSocket) {
                    socket.to(sendUserSocket).emit("msg-receive", data.message);
                }
            });
        });
    } catch (e) {
        console.log(e);
    }
}

start();




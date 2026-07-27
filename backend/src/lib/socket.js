import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

const io = new Server(server, {
    cors: {
        origin: [allowedOrigin],
        credentials: true,
    },
});

const userSocketMap = {};

function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

io.on("connection", (socket) => {
    console.log("\n========== SOCKET CONNECT ==========");

    const userId = socket.handshake.query.userId;

    console.log("User ID:", userId);
    console.log("Socket ID:", socket.id);

    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    console.log("Current Socket Map:", userSocketMap);
    console.log("Online Users:", Object.keys(userSocketMap));

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", (reason) => {
        console.log("\n========== SOCKET DISCONNECT ==========");
        console.log("User ID:", userId);
        console.log("Socket ID:", socket.id);
        console.log("Reason:", reason);

        if (userId) {
            delete userSocketMap[userId];
        }

        console.log("Current Socket Map:", userSocketMap);
        console.log("Online Users:", Object.keys(userSocketMap));

        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, server, io, getReceiverSocketId };
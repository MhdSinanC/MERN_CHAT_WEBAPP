import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { io } from "socket.io-client";


const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        set({ isCheckingAuth: true, });

        try {
            const res = await axiosInstance.get("/auth/check")
            set({ authUser: res.data });

            get().connectSocket(res.data);
        }
        catch (error) {
            console.error("Error in checkAuth:", error);
            set({ authUser: null });
        }
        finally {
            set({ isCheckingAuth: false })
        }
    },

    clearAuth: () => {
        set({ authUser: null, isCheckingAuth: false, onlineUsers: [] });
        get().disconnectSocket();
    },

    connectSocket: (user) => {
    console.log("connectSocket called");

    if (!user) {
        console.log("No user");
        return;
    }

    if (get().socket?.connected) {
        console.log("Socket already connected");
        return;
    }

    console.log("Creating new socket...");

    const socket = io(BASE_URL, {
        query: { userId: user._id },
    });

    socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
        console.log("Client disconnected:", reason);
    });

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
        console.log("Received online users:", userIds);
        set({ onlineUsers: userIds });
    });
},

    disconnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) socket.disconnect();
        set({ socket: null })
    }
}))
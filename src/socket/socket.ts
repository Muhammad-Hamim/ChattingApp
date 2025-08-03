import { auth } from "@/config/firebase";
import { io } from "socket.io-client";
import { toast } from "sonner";

export const socket = io("http://localhost:5000", {
  autoConnect: false,
  transports: ["websocket", "polling"],
});

export const connectSocket = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();

      //send authentication data when connecting
      socket.auth = {
        token,
      };
      socket.connect();
      console.log("🔌 Attempting to connect to socket with user:", user.email);
    } else {
      console.log("❌ No authenticated user found, cannot connect socket");
    }
  } catch (error) {
    console.error("❌ Socket connection error:", error);
  }
};

// Socket disconnect helper
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("🔌 Socket disconnected");
  }
};

// Socket event listeners
socket.on("connect", () => {
  console.log("✅ Connected to socket server with ID:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Disconnected from socket server. Reason:", reason);
});
socket.on("welcome", (data) => {
  console.log("👋 Welcome message from server:", data);
  toast.success(`Welcome ${data.name}`, {
    description: `${data.message}.
      socket Id: ${data.socketId}`,
    action: {
      label: "Undo",
      onClick: () => console.log("Undo"),
    },
  });
});
socket.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error);
});

// User presence events
socket.on("user_connected", (data) => {
  console.log("👋 User connected:", data);
});

socket.on("user_disconnected", (data) => {
  console.log("👋 User disconnected:", data);
});

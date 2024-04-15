const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const userRoute = require("./routes/User");
const messageRoute = require("./routes/Message");
const authMiddleware = require("./middleware/Auth");
const app = express();

app.use(express.json());
app.use(cors());

app.use("/user", userRoute);
app.use("/messages", authMiddleware, messageRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT;

//
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("newMessage", (data) => {
    // console.log(data);
    io.emit("newMessage", data);
    io.emit("messageSent");
  });
  socket.on("chatDeleted", () => {
    io.emit("chatDeleted");
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

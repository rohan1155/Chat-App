const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const userRoute = require("./routes/User");
const messageRoute = require("./routes/Message");
const authMiddleware = require("./middleware/Auth");
const path = require("path");
const app = express();

app.use(express.json());
app.use(cors());

app.use("/user", userRoute);
app.use("/messages", authMiddleware, messageRoute);

// DEPLOYMENT
const __dirname1 = path.resolve(path.join(__dirname, ".."));
if (process.env.NODE_ENV === "production") {
  app.use(express.static(__dirname1 + "/client/dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "client", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API Running");
  });
}
//

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
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // console.log("a user connected");
  socket.on("disconnect", () => {
    // console.log("user disconnected");
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

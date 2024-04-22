import express from "express";
import cors from "cors";
import { createServer } from "http";
import { userCredRouter } from "./services/userCred.js";
import searchRouter from "./services/Search.js";
import { config } from "dotenv";
import { paymentRouter } from "./services/payment.js";
import employeeRouter from "./services/Search.js";
import { Server } from "socket.io";

config();
const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 8080;
const chatPort = 7000;

const newChatServer = createServer();
const chatServer = new Server(newChatServer, {
  cors: {
    origin: "*",
  },
});

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

chatServer.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  //Listens and logs the message to the console
  socket.on("message", (data) => {
    chatServer.emit("messageResponse", data);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});
app.use(express.json());
app.use(userCredRouter);
app.use(paymentRouter);
app.use(employeeRouter);
app.use("/api/search", searchRouter);

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

newChatServer.listen(chatPort, () => {
  console.log(`Server listening on ${chatPort}`);
});

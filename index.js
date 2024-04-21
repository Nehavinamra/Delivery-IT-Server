import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import { userCredRouter } from "./services/userCred.js";
import searchRouter from "./services/Search.js";
import { config } from "dotenv";
import { paymentRouter } from "./services/payment.js";
import employeeRouter from "./services/Search.js";
import { Server as SocketIO } from "socket.io";
import { chatRouter } from "./services/Chat.js";

config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;
const io = new SocketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
// MongoDB Connection URL
const mongoURI =
  process.env.MONGODB_URI ||
  "mongodb+srv://nehaV:FV47KppuT6qWxcFz@cluster0.00tx6ph.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("MongoDB connection established successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(userCredRouter);
app.use(paymentRouter);
app.use(employeeRouter);
app.use("/api/search", searchRouter);
app.use(chatRouter);

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

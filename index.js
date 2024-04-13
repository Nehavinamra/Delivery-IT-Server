import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import { userCredRouter } from "./services/userCred.js";
import searchRouter from "./services/Search.js";
import setupChat from './services/Chat.js';

import router from "./services/Search.js";
import { config } from "dotenv";
import { paymentRouter } from "./services/payment.js";
import employeeRouter from "./services/Search.js";
config();
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8080;
// MongoDB Connection URL
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://nehaV:FV47KppuT6qWxcFz@cluster0.00tx6ph.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connection established successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

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
app.use('/api/users', userCredRouter);
app.use('/api/search', searchRouter);

setupChat(server);

async function main() {
  try {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (e) {
    console.error("Server start error:", e);
  }
}

main().catch(console.error);
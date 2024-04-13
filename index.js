import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userCredRouter } from "./services/userCred.js";
import router from "./services/Search.js";
import { config } from "dotenv";
import { paymentRouter } from "./services/payment.js";
import employeeRouter from "./services/Search.js";
config();
const app = express();
const port = process.env.PORT || 8080;

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

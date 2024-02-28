import express from "express";
import cors from "cors";
import { userCredRouter } from "./services/userCred.js";

const app = express();
const port = 8080;
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(userCredRouter)


async function main() {
  try {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (e) {
    console.error("Could not connect to MongoDB", e);
  }
}

main().catch(console.error);

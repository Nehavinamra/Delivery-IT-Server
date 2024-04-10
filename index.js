import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userCredRouter } from "./services/userCred.js";
import router from "./services/Search.js";


const app = express();
const port = process.env.PORT || 8080;  // It's a good practice to allow port to be set by environment variable

// MongoDB Connection URL
const mongoURI = "mongodb+srv://nehaV:FV47KppuT6qWxcFz@cluster0.00tx6ph.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connection established successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(express.json());
app.use(userCredRouter);

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
import { config } from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
import express from "express";
import bcrypt from "bcrypt";

config(); //configure

const chatRoute = express.Router();

chatRoute.use(express.json());

const dbName = "Deliver-IT";
const client = new MongoClient(process.env.DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

chatRoute.get("/getAllUsers", async (req, res) => {
  try {
    const db = client.db(dbName);
    const usersCollection = db.collection("users");
    const allUsers = await usersCollection.find();
    const allUsersArr = [];
    for await (const x of allUsers) {
      allUsersArr.push(x.email);
    }
    res.status(200).json({ allUsers: allUsersArr });
  } catch (error) {
    console.error("Error fetching users", error);
    res.status(500).send("An error occurred during fetching users");
  }
});

export { chatRoute };

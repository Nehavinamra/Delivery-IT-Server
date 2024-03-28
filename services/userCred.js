import { config } from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
import express from "express";
import bcrypt from "bcrypt";

config(); //configure

const userCredRouter = express.Router();

userCredRouter.use(express.json());

const dbName = "Deliver-IT";
const client = new MongoClient(process.env.DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
// Route to handle user login
userCredRouter.post("/Login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Request body must contain email and password");
  }
  try {
    const db = client.db(dbName);
    const usersCollection = db.collection("users");

    //console.log(hello);
    // Find the user by email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if the password is correct

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Password is incorrect");
    }

    // User is authenticated
    res.status(200).json({
      message: "User Login Successful",
      userInfo: JSON.stringify(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("An error occurred during login");
  }
  // No need to close the MongoDB client after every request
}); //
// Route to handle user registration
userCredRouter.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  // Simple validation
  if (!firstName || !lastName || !email || !password || !role) {
    return res.status(400).send("Please enter all fields");
  }

  try {
    const db = client.db(dbName);
    const usersCollection = db.collection("users");

    // Check if the user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      
    };

    // Insert the new user into the database
    await usersCollection.insertOne(newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send("An error occurred during registration");
  }
});

userCredRouter.post("/userDetails", async (req, res) => {
  const { email } = req.body;
  try {
    const db = client.db(dbName);
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ email });
    res.status(200).json({
      userInfo: JSON.stringify(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("An error occurred during login");
  }
});

export { userCredRouter };

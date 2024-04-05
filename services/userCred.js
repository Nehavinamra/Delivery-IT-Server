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
  const { firstName, lastName, email, password, role, packages, chatSchema} = req.body;

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
// Define the MongoDB schema for chat messages
const chatSchema = {
  conversationId: String,
  messages: [
    {
      from: String,
      to: String,
      content: String,
      timestamp: Date,
    },
  ],
};
    // Create a new user object
    const newUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      packages,
      chat: chatSchema// add the chatSchema to the chat property
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

// Route to handle adding package information
userCredRouter.post("/addPackage", async (req, res) => {
  try {
    const { email, packageName, packageDetails } = req.body;
    const db = client.db(dbName);
    const usersCollection = db.collection("users");

    // Check if the user exists
    const existingUser = await usersCollection.findOne({ email });
    if (!existingUser) {
      return res.status(404).send("User not found");
    }

    // Update user document with package information
    await usersCollection.updateOne(
      { email },
      { $set: { packageName, packageDetails } }
    );

    res.status(200).send("Package information added successfully");
  } catch (error) {
    console.error("Error adding package information:", error);
    res.status(500).send("An error occurred while adding package information");
  }
});

// Route to handle sending chat messages
userCredRouter.post("/sendMessage", async (req, res) => {
  const { conversationId, from, to, content } = req.body;
  try {
    const db = client.db(dbName);
    const chatCollection = db.collection("chat");

    // Find the conversation document or create a new one if it doesn't exist
    const conversation = await chatCollection.findOneAndUpdate(
      { conversationId },
      {
        $addToSet: {
          messages: { from, to, content, timestamp: new Date() },
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    res.status(201).json({ message: "Message sent successfully", conversation });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send("An error occurred while sending message");
  }
});

// Route to handle retrieving chat messages for a specific conversation
userCredRouter.post("/getMessages", async (req, res) => {
  const { conversationId } = req.body;
  try {
    const db = client.db(dbName);
    const chatCollection = db.collection("chat");

    // Retrieve messages for the specified conversation
    const conversation = await chatCollection.findOne({ conversationId });

    if (!conversation) {
      return res.status(404).send("Conversation not found");
    }

    res.status(200).json({ messages: conversation.messages });
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).send("An error occurred while retrieving messages");
  }
});



export { userCredRouter };

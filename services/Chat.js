import express from "express";
const chatRouter = express.Router();

const chatRooms = {};


chatRouter.post("/createRoom", (req, res) => {
    const { roomName } = req.body;
    if (chatRooms[roomName]) {
        return res.status(400).send("Room already exists");
    }
    chatRooms[roomName] = [];
    res.status(201).send("Room created");
});

chatRouter.post("/sendMessage", (req, res) => {
    const { roomName, message } = req.body;
    if (!chatRooms[roomName]) {
        return res.status(404).send("Room not found");
    }
    chatRooms[roomName].push(message);
    res.status(201).send("Message sent");
});

chatRouter.get("/getMessages", (req, res) => {
    const { roomName } = req.query;
    if (!chatRooms[roomName]) {
        return res.status(404).send("Room not found");
    }
    res.status(200).json(chatRooms[roomName]);
});

export { chatRouter };
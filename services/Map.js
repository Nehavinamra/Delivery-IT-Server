import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Adjust according to frontend's origin
        methods: ["GET", "POST"]
    }
});

const pickupLocation = [39.1683, -86.5090]; // Hardcoded pickup location
const destinationLocation = [39.1611, -86.5340]; // Hardcoded destination location

io.on('connection', (socket) => {
    console.log('A user connected');

    // Emit the pickup and destination locations once upon connection
    socket.emit('locationData', {
        pickupLocation: [39.1683, -86.5090],
        destinationLocation: [39.1611, -86.5340],
        pickupAddress: '123 Pickup St, City, State',
        destinationAddress: '456 Destination Ave, City, State',
    });

    setInterval(() => {
        const latOffset = (Math.random() - 0.5) * 0.01;
        const lngOffset = (Math.random() - 0.5) * 0.01;
        const currentPosition = [
            39.1653 + latOffset,
            -86.5264 + lngOffset,
        ];
        socket.emit('positionUpdate', currentPosition);
    }, 5000);

    socket.on('disconnect', () => console.log('A user disconnected'));
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
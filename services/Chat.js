import { Server } from 'socket.io';

export default function setupChat(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
        }
    });

    let rooms = {};

    io.on('connection', (socket) => {
        console.log('New user connected');

        socket.on('join', ({ userId, room }) => {
            socket.join(room);
            rooms[userId] = room;
            console.log(`${userId} joined ${room}`);
            socket.to(room).emit('user status', `${userId} has joined the chat`);
        });

        socket.on('sendMessage', ({ userId, text }) => {
            const room = rooms[userId];
            io.to(room).emit('message', { userId, text });
        });

        socket.on('createGroupChat', ({ managerId, employeeIds }) => {
            const room = `manager_${managerId}_group`;
            employeeIds.forEach(id => {
                io.to(rooms[id]).socketsJoin(room);
            });
            rooms[managerId] = room;
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
}
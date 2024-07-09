import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
app.use(cors());

const server = http.createServer(app);

app.get('/', (req, res) => {
    res.json({ message: 'Hello from server!' });
})

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling']
});


let winner = null;
io.on('connection', (socket) => {
    console.log("User connected", socket.id);

    socket.on('join_room', (data) => {
        socket.join(data.room);
        console.log(`User with ID: ${socket.id} joined room: ${data.room}, username: ${data.username})`);
    })

    socket.on('send_message', (data) => {
        const { room, username, message } = data;
        console.log(`Received message in room ${room}: ${message}`);

        // Check if the message is equal to '9' (adjust as per your specific condition)
        if (message === 9) {


            console.log(winner)
            io.to(room).emit('receive_message', {
                username: username,
                room: room,
                message: 'Winner'
            });
        } else {
            winner = {
                username: username,
                room: room,
                message: 'try again'
            };
            io.to(room).emit('receive_message', {
                username: username,
                room: room,
                message: 'try again'
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    })
})


server.listen(3001, () => {
    console.log('Server listening on *:3001');
})
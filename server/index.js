import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import ListOfProblems from './problems.js';

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

// const problems = [
//     {
//         id: 1,
//         title: "Sum of Two Numbers",
//         description: "Write a function to return the sum of two numbers.",
//         testCases: [
//             { input: "1 2", output: "3" },
//             { input: "5 10", output: "15" }
//         ]
//     },
//     {
//         id: 2,
//         title: "Multiply Two Numbers",
//         description: "Write a function to return the product of two numbers.",
//         testCases: [
//             { input: "2 3", output: "6" },
//             { input: "4 5", output: "20" }
//         ]
//     }
// ];

let winner = null;
io.on('connection', (socket) => {
    console.log("User connected", socket.id);

    socket.on('join_room', (data) => {
        socket.join(data.room);
        console.log(`User with ID: ${socket.id} joined room: ${data.room}, username: ${data.username})`);

        const randomProblem = ListOfProblems[Math.floor(Math.random() * ListOfProblems.length)];
        io.to(data.room).emit('assign_problem', randomProblem);
    })

    socket.on('send_message', (data) => {
        const { room, username, message, problem } = data;
        console.log(`Received message from ${username} in room ${room}: ${message}`);
        const title = problem.title;
        console.log(title);

        if (title == "Sum of Two Numbers") {
            if (message === 3 || 15) {
                io.to(room).emit('receive_message', {
                    username: username,
                    room: room,
                    message: 'Winner'
                });
            } else {
                io.to(room).emit('receive_message', {
                    username: username,
                    room: room,
                    message: 'try again'
                });
            }
        } else if (title == "Multiply Two Numbers") {
            if (message === 6 || 20) {
                io.to(room).emit('receive_message', {
                    username: username,
                    room: room,
                    message: 'Winner'
                });
            } else {
                io.to(room).emit('receive_message', {
                    username: username,
                    room: room,
                    message: 'try again'
                });
            }
        }

        // Check if the message is equal to '9' (adjust as per your specific condition)
        // if (message === 9) {


        //     console.log(winner)
        //     io.to(room).emit('receive_message', {
        //         username: username,
        //         room: room,
        //         message: 'Winner'
        //     });
        // } else {
        //     winner = {
        //         username: username,
        //         room: room,
        //         message: 'try again'
        //     };
        //     io.to(room).emit('receive_message', {
        //         username: username,
        //         room: room,
        //         message: 'try again'
        //     });
        // }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    })
})


server.listen(3001, () => {
    console.log('Server listening on *:3001');
})
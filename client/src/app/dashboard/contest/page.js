"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { Button } from '@/components/ui/button';

const socket = io('http://localhost:3001', {
    withCredentials: true,
    transports: ['websocket', 'polling'],
});

const ContestPage = () => {
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const router = useRouter();

    const joinRoom = () => {
        if (username !== "" && room !== "") {
            socket.emit("join_room", { room, username });
            router.push(`contest/editor?room=${room}&username=${username}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-4">Join Contest</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mb-2 p-2 border rounded"
            />
            <input
                type="text"
                placeholder="Room ID"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="mb-2 p-2 border rounded"
            />
            <Button onClick={joinRoom}>Join Contest</Button>
        </div>
    );
};

export default ContestPage;

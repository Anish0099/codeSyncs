// pages/index.js
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  withCredentials: true,
  transports: ['websocket', 'polling'],
});

console.log("Socket connected:", socket.connected);

export default function Home() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const router = useRouter();

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", { room, username });
      router.push(`/dashboard?room=${room}`);
    }
  };

  return (
    <main className="flex flex-col items-center justify-between gap-6 p-24">
      <div className="flex gap-2 justify-center items-center">
        <h1 className="text-3xl font-bold underline">
          Welcome to the chat
        </h1>
      </div>
      <h3 className="text-2xl font-semibold">Join a Chat</h3>
      <Input onChange={(e) => setUsername(e.target.value)} className="max-w-[14rem]" type="text" placeholder="John..." />
      <Input onChange={(e) => setRoom(e.target.value)} className="max-w-[14rem]" type="text" placeholder="Enter Room Name" />
      <Button className="text-md" onClick={joinRoom} >Join a room</Button>
    </main>
  );
}

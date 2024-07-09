"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CodeEditor from '@/components/CodeEditor';
import { Button } from '@/components/ui/button';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import LanguageList from '@/components/LanguageList';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { io } from 'socket.io-client';
import { join } from 'path';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const socket = io('http://localhost:3001', {
    withCredentials: true,
    transports: ['websocket', 'polling'],
});



const Dashboard = () => {
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [language, setLanguage] = useState(javascript);
    const [languageId, setLanguageId] = useState(63);
    const [winnerInfo, setWinnerInfo] = useState(null);
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    console.log(process.env.NEXT_PUBLIC_JUDGE0_API_KEY)

    useEffect(() => {
        socket.on('receive_message', (data) => {
            const { message, room, username } = data;

            console.log(message);
            if (message === 'Winner') {
                setWinnerInfo({ username, room, message });
            }
        });
    }, [socket]);


    const joinRoom = () => {
        console.log(room, username)
        if (username !== "" && room !== "") {
            socket.emit("join_room", { room, username });

        }
    };

    const postSubmission = async (language_id, source_code, stdin) => {
        console.log({ language_id, source_code, stdin });
        const options = {
            method: 'POST',
            url: 'https://judge0-ce.p.rapidapi.com/submissions',
            params: { base64_encoded: 'true', fields: '*' },
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': process.env.NEXT_PUBLIC_JUDGE0_API_KEY,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            data: JSON.stringify({
                language_id: language_id,
                source_code: btoa(source_code),
                stdin: btoa(stdin)
            })
        };

        const res = await axios.request(options);
        console.log(res.data);
        return res.data.token;
    };

    const getOutput = async (token) => {
        const options = {
            method: 'GET',
            url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
            params: { base64_encoded: 'true', fields: '*' },
            headers: {
                'X-RapidAPI-Key': process.env.NEXT_PUBLIC_JUDGE0_API_KEY,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
        };

        const res = await axios.request(options);
        if (res.data.status.id <= 2) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before polling again
            return await getOutput(token); // Recursively poll for the result
        }
        console.log('Socket connected:', socket.connected);
        console.log(res.data);
        return res.data;
    };

    const executeCode = async () => {
        const token = await postSubmission(languageId, code, "");
        const res = await getOutput(token);
        const output = res.stdout ? atob(res.stdout) : atob(res.stderr);
        console.log(output);
        setOutput(output);

        console.log(room, username);

        socket.emit('send_message', { message: parseInt(output), room, username });
    };

    return (
        <div className='grid grid-cols-1 md:grid-cols-3 w-screen h-screen'>
            <div className='w-full p-2 col-span-1 md:col-span-2 justify-center mb-0 items-center gap-4 bg-slate-800'>
                <div className='flex justify-between items-center p-1'>
                    {/* <h1 className='md:text-xl text-md font-bold text-white bg-slate-900 p-2 rounded-lg shadow-md'>Code Sync Anish</h1> */}
                    <div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">Edit Profile</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit profile</DialogTitle>
                                    <DialogDescription>
                                        Make changes to your profile here. Click save when you're done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Name
                                        </Label>
                                        <Input onChange={(e) => setUsername(e.target.value)}
                                            id="name"
                                            defaultValue="Pedro Duarte"
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="username" className="text-right">
                                            Username
                                        </Label>
                                        <Input onChange={(e) => setRoom(e.target.value)}
                                            id="room"
                                            defaultValue="1111"
                                            className="col-span-3"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={joinRoom}>Save changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className='flex gap-2 justify-end items-center'>
                        <LanguageList setLanguageId={setLanguageId} setCode={setCode} languageId={languageId} language={language} setLanguage={setLanguage} />
                        <Button className='' onClick={executeCode}>Run Code</Button>
                    </div>
                </div>
                <CodeEditor setLanguageId={setLanguageId} code={code} language={language} setCode={setCode} />
            </div>
            <div className='w-full flex flex-col h-full p-2 bg-slate-700'>
                <h1 className='font-bold text-xl text-white'>Output:</h1>
                <pre className='text-white border-teal-100 border rounded-md p-1 bg-slate-600 min-w-[10rem]'>{output}</pre>
                {winnerInfo && (
                    <div className="text-white mt-4">
                        <p>Winner: {winnerInfo.username}</p>
                        <p>Room: {winnerInfo.room}</p>
                        <p>Message: {winnerInfo.message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;

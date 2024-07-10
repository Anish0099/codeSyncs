"use client"

import { usePathname, useSearchParams } from 'next/navigation'
import { io } from 'socket.io-client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CodeEditor from '@/components/CodeEditor';
import { Button } from '@/components/ui/button';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import LanguageList from '@/components/LanguageList';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp'
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
})

const CodeEditorPage = () => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [room, setRoom] = useState('')
    const [username, setUsername] = useState('')
    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [language, setLanguage] = useState(javascript);
    const [languageId, setLanguageId] = useState(63);
    const [winnerInfo, setWinnerInfo] = useState(null);
    const [defaultCode, setDefaultCode] = useState('');



    useEffect(() => {
        const url = `${pathname}?${searchParams}`;
        console.log(url);

        const params = new URLSearchParams(searchParams);
        const name = params.get('username');
        const id = params.get('room');
        setUsername(name);
        setRoom(id);

        socket.emit("join_room", { room, username });

        socket.on('assign_problem', (problem) => {
            setProblem(problem);
            console.log(problem);

            if (problem && problem.defaultCode) {
                setDefaultCode(problem.defaultCode[language.language.name]);
                console.log(defaultCode);
            }
        });

        socket.on('receive_message', (data) => {
            console.log('Received message:', data);
            const { message, room, username } = data;

            console.log(message);
            if (message === 'Winner') {
                setWinnerInfo({ username, room, message });
            }
        });



    }, [pathname, searchParams, socket]);

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
        console.log('Status:', res.data.status);
        console.log('Stdout:', res.data.stdout);
        console.log('Stderr:', res.data.stderr);
        return res.data;
    };

    const executeCode = async () => {
        if (!problem) {
            console.error('Problem is not defined');
            return;
        }

        let allPassed = true;
        let failedTestCaseIndex = -1;

        for (let i = 0; i < problem.testCases.length; i++) {
            const testCase = problem.testCases[i];
            console.log(testCase.input)
            const token = await postSubmission(languageId, code, testCase.input);
            const res = await getOutput(token);
            console.log(res);
            const actualOutput = res.stdout ? atob(res.stdout).trim() : atob(res.stderr).trim();
            console.log(languageId);

            console.log(actualOutput, testCase.output);

            if (actualOutput !== testCase.output) {
                allPassed = false;
                failedTestCaseIndex = i;
                break;
            }
        }

        if (allPassed) {
            console.log(room, username);
            socket.emit('send_message', { message: 'Winner', room, username, problem });
            setOutput('All test cases passed!');
        } else {
            setOutput(`Test case ${failedTestCaseIndex + 1} failed.`);
        }
    };


    return (
        <div className='w-screen h-screen flex flex-col'>
            <div className='flex-1 flex flex-col md:flex-row'>
                <div className='w-full p-2 flex-1 h-full justify-center mb-0 items-center gap-4 bg-slate-800'>
                    <div className='flex justify-between items-center p-1'>

                        <div className='flex gap-2 justify-end items-center'>


                        </div>
                    </div>
                    <CodeEditor defaultCode={defaultCode} setLanguageId={setLanguageId} code={code} language={language} setCode={setCode} />
                </div>
                <div className='w-full flex-1 flex flex-col h-full p-2 bg-slate-700'>
                    <div className='flex gap-2 justify-between items-center mb-2'>
                        {console.log(problem)}
                        <LanguageList setDefaultCode={setDefaultCode} problem={problem} setLanguageId={setLanguageId} setCode={setCode} languageId={languageId} language={language} setLanguage={setLanguage} />
                        <Button className='' onClick={executeCode}>Run Code</Button>
                    </div>




                    {winnerInfo && (
                        <div className="text-white mt-4">
                            <p>Winner: {winnerInfo.username}</p>
                            <p>Room: {winnerInfo.room}</p>
                            <p>Message: {winnerInfo.message}</p>
                        </div>
                    )}

                    <h1 className='font-bold text-xl text-white'>Output:</h1>
                    <pre className='text-white border-teal-100 border rounded-md p-1 bg-slate-600 min-w-[10rem] min-h-10'>{output}</pre>
                    {winnerInfo && (
                        <div className="text-white mt-4">
                            <p>Winner: {winnerInfo.username}</p>
                            <p>Room: {winnerInfo.room}</p>
                            <p>Message: {winnerInfo.message}</p>
                        </div>
                    )}

                    <div className='grid grid-cols-3 gap-2 mb-2'>
                        <div className='col-span-1 w-full h-full'>
                            <h1 className='font-bold text-xl text-white'>Title:</h1>
                            <pre className='text-white border-teal-100 border rounded-md p-1 bg-slate-600 w-full'>{problem?.title}</pre>
                        </div>
                        <div className='col-span-2'>

                            <h1 className='font-bold text-xl text-white'>Description:</h1>
                            <pre className='text-white border-teal-100 border rounded-md p-1 bg-slate-600 '>{problem?.description}</pre>
                        </div>

                    </div>
                    <div>
                        <h1 className='font-bold text-xl text-white'>Test Cases:</h1>
                        <div className='grid grid-cols-2 gap-3'>
                            {problem?.testCases.map((testCase, index) => (
                                <div key={index} className='w-full h-full'>
                                    <h1 className='font-bold text-xl text-white'>Input:</h1>
                                    <pre className='text-white border-teal-100 border rounded-md p-1 bg-slate-600 w-full'>{testCase.input}</pre>
                                    <h1 className='font-bold text-xl text-white'>Output:</h1>
                                    <pre className='text-white border-teal-100 border rounded-md p-1 bg-slate-600 w-full'>{testCase.output}</pre>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CodeEditorPage
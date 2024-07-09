"use client"

import React, { useEffect } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button'
import { cpp } from '@codemirror/lang-cpp'
import { java } from '@codemirror/lang-java'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { languageMap } from '@/utils'


const LanguageList = ({ language, setLanguage, setLanguageId, languageId, setCode }) => {

    useEffect(() => {
        console.log(language.language.name)

        if (language.language.name === 'javascript') {
            setLanguageId(63);
            setCode(languageMap['javascript'].defaultCode)
        } else if (language.language.name === 'cpp') {
            setLanguageId(54);
            setCode(languageMap['cpp'].defaultCode)
        } else if (language.language.name === 'java') {
            setLanguageId(62);
            setCode(languageMap['java'].defaultCode)
        } else if (language.language.name === 'python') {
            setLanguageId(71);
            setCode(languageMap['python'].defaultCode)
        }
        console.log(languageId)
    }, [language])
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary">Select Language</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel >Languages</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setLanguage(java)}>java</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage(javascript)}>javascript</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage(cpp)}>C++</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage(python)}>Python</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default LanguageList
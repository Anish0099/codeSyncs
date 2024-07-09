// components/CodeEditor.js
import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror'
import { githubDark, githubLight } from '@uiw/codemirror-theme-github'
import { javascript } from '@codemirror/lang-javascript'
import { indentUnit } from '@codemirror/language'
import { EditorState } from '@codemirror/state'
import { cpp } from '@codemirror/lang-cpp';
import { languageMap } from '@/utils';

const CodeEditor = ({ code, setCode, language }) => {
    const [theme, setTheme] = useState(githubDark)

    return (
        <CodeMirror
            value={code}
            className='w-full h-[35rem] md:h-[40rem] '
            height='100%'
            theme={theme}
            extensions={[
                language,
                indentUnit.of("        "),
                EditorState.tabSize.of(8),
                EditorState.changeFilter.of(() => true)
            ]}
            onChange={(value) => setCode(value)}
            basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: true,
                highlightSpecialChars: true,
                history: true,
                foldGutter: true,
                drawSelection: true,
                dropCursor: true,
                allowMultipleSelections: true,
                indentOnInput: true,
                syntaxHighlighting: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: true,
                rectangularSelection: true,
                crosshairCursor: true,
                highlightActiveLine: true,
                highlightSelectionMatches: true,
                closeBracketsKeymap: true,
                defaultKeymap: true,
                searchKeymap: true,
                historyKeymap: true,
                foldKeymap: true,
                completionKeymap: true,
                lintKeymap: true,
            }}
        />
    );
};

export default CodeEditor;

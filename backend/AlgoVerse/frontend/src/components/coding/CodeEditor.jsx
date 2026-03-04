import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme

const CodeEditor = ({ code, setCode, language }) => {
    const getGrammar = () => {
        switch (language) {
            case 'python': return languages.python;
            case 'java': return languages.java;
            case 'cpp': return languages.cpp;
            case 'c': return languages.c;
            default: return languages.js;
        }
    };

    return (
        <div style={{
            fontFamily: '"Fira Code", "Fira Mono", monospace',
            fontSize: 14,
            backgroundColor: '#1e1e1e',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            minHeight: '100%',
            height: '100%',
            overflow: 'auto'
        }}>
            <Editor
                value={code}
                onValueChange={code => setCode(code)}
                highlight={code => highlight(code, getGrammar() || languages.js)}
                padding={20}
                style={{
                    fontFamily: '"Fira Code", "Fira Mono", monospace',
                    fontSize: 14,
                }}
                textareaClassName="code-area"
            />
            <style>{`
                .code-area:focus {
                    outline: none;
                }
            `}</style>
        </div>
    );
};

export default CodeEditor;

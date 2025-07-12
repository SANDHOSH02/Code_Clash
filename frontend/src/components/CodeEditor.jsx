import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { saveCode, loadCode } from '../utils/localStorage';

function CodeEditor({ language = 'javascript' }) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  useEffect(() => {
    // Initialize Monaco Editor
    monacoRef.current = monaco.editor.create(editorRef.current, {
      value: loadCode('code') || '// Start coding here...\nconsole.log("Hello, CodeMentor AI!");',
      language: language,
      theme: 'vs-dark',
      automaticLayout: true,
    });

    // Save code to localStorage on change
    monacoRef.current.onDidChangeModelContent(() => {
      saveCode('code', monacoRef.current.getValue());
    });

    return () => {
      monacoRef.current.dispose();
    };
  }, [language]);

  const runCode = () => {
    const code = monacoRef.current.getValue();
    try {
      // Note: In production, use a sandboxed environment for code execution
      // Here, eval is used for simplicity (not safe for production)
      // eslint-disable-next-line no-eval
      eval(code);
      alert('Code executed! Check console for output.');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const callAISuggestion = async () => {
    const code = monacoRef.current.getValue();
    // Placeholder for AI API call
    try {
      const response = await fetch('http://localhost:3001/api/code/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const suggestion = await response.json();
      alert(`AI Suggestion: ${suggestion.message || 'No suggestions available'}`);
    } catch (err) {
      alert('Error fetching AI suggestion');
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div ref={editorRef} className="h-96 border border-gray-700 rounded" />
      <div className="flex space-x-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={runCode}
        >
          Run Code
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={callAISuggestion}
        >
          Get AI Suggestion
        </button>
      </div>
    </div>
  );
}

export default CodeEditor;
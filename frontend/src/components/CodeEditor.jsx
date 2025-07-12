import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { saveCode, loadCode } from '../utils/localStorage';

function CodeEditor({ language = 'javascript' }) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const [output, setOutput] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  // Override console methods for JavaScript and window.print
  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalPrint = window.print;

    console.log = (...args) => {
      setOutput((prev) => [...prev, { type: 'log', content: args.join(' ') }]);
      originalConsoleLog(...args);
    };
    console.error = (...args) => {
      setOutput((prev) => [...prev, { type: 'error', content: args.join(' ') }]);
      originalConsoleError(...args);
    };
    window.print = () => {
      setOutput((prev) => [...prev, { type: 'error', content: 'Print dialog blocked. Use console.log or print() for output.' }]);
    };

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      window.print = originalPrint;
    };
  }, []);

  useEffect(() => {
    monacoRef.current = monaco.editor.create(editorRef.current, {
      value: loadCode('code') || (selectedLanguage === 'python' ? '# Start coding here...\nprint("Hello, CodeMentor AI!")' : '// Start coding here...\nconsole.log("Hello, CodeMentor AI!");'),
      language: selectedLanguage,
      theme: 'vs-dark',
      automaticLayout: true,
    });

    monacoRef.current.onDidChangeModelContent(() => {
      saveCode('code', monacoRef.current.getValue());
    });

    return () => {
      monacoRef.current.dispose();
    };
  }, [selectedLanguage]);

  const runCode = async () => {
    setOutput([]); // Clear previous output
    const code = monacoRef.current.getValue();

    if (selectedLanguage === 'javascript') {
      try {
        // Sanitize code to prevent window.print()
        if (code.includes('window.print')) {
          setOutput([{ type: 'error', content: 'Error: window.print() is not allowed.' }]);
          return;
        }
        const execute = new Function(code);
        execute();
        if (output.length === 0) {
          setOutput([{ type: 'log', content: 'Code executed successfully!' }]);
        }
      } catch (err) {
        setOutput([{ type: 'error', content: `Error: ${err.message}` }]);
      }
    } else if (selectedLanguage === 'python') {
      try {
        const response = await fetch('http://localhost:8000/api/code/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });
        const result = await response.json();
        if (result.error) {
          setOutput([{ type: 'error', content: `Error: ${result.error}` }]);
        } else {
          setOutput(result.output.map((line) => ({ type: 'log', content: line })));
        }
      } catch (err) {
        setOutput([{ type: 'error', content: 'Error: Failed to execute Python code. Is the AI service running?' }]);
      }
    }
  };

  const callAISuggestion = async () => {
    const code = monacoRef.current.getValue();
    try {
      const response = await fetch('http://localhost:8000/api/code/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: selectedLanguage }),
      });
      const suggestion = await response.json();
      setOutput([{ type: 'suggestion', content: suggestion.message || 'No suggestions available' }]);
    } catch (err) {
      setOutput([{ type: 'error', content: 'Error fetching AI suggestion' }]);
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="flex space-x-4">
        <select
          className="bg-gray-700 text-white p-2 rounded"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
      </div>
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
      <div className="bg-gray-800 p-4 rounded border border-gray-700">
        <h3 className="text-lg font-semibold mb-2">Output</h3>
        <div className="text-sm">
          {output.length === 0 ? (
            <p className="text-gray-400">No output yet. Run your code!</p>
          ) : (
            output.map((line, index) => (
              <p
                key={index}
                className={
                  line.type === 'error'
                    ? 'text-red-400'
                    : line.type === 'suggestion'
                    ? 'text-green-400'
                    : 'text-white'
                }
              >
                {line.content}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;

import React from 'react';
import CodeEditor from '../components/CodeEditor';

function Editor() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Code Editor</h2>
      <CodeEditor />
    </div>
  );
}

export default Editor;
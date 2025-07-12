import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">CodeMentor AI</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <Link to="/editor" className="hover:text-blue-400">Editor</Link>
          <Link to="/challenges" className="hover:text-blue-400">Challenges</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
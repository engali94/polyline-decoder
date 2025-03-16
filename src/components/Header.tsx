import React from 'react';
import { Github, Map, Info, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="w-full glass rounded-xl p-4 flex items-center justify-between mb-4 animate-slide-down">
      <div className="flex items-center space-x-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Map className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-medium tracking-tight">Polyline Encoder & Decoder</h1>
          <p className="text-sm text-muted-foreground">
            Convert between encoded polylines and coordinate pairs with advanced visualization
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <nav className="hidden md:flex items-center space-x-2">
          <Link to="/" className="px-3 py-1.5 text-sm hover:bg-secondary rounded-md transition-colors">
            Home
          </Link>
          <Link to="/about" className="px-3 py-1.5 text-sm hover:bg-secondary rounded-md transition-colors flex items-center">
            <Info className="h-3.5 w-3.5 mr-1" />
            About
          </Link>
          <Link to="/docs" className="px-3 py-1.5 text-sm hover:bg-secondary rounded-md transition-colors flex items-center">
            <BookOpen className="h-3.5 w-3.5 mr-1" />
            Docs
          </Link>
        </nav>
        <span className="hidden md:inline-block text-xs text-muted-foreground">
          Free online tool for Google polyline format
        </span>
        <a
          href="https://github.com/engali94/polyline-decoder"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source code on GitHub"
          className="p-2 rounded-full hover:bg-secondary transition-colors duration-200"
        >
          <Github className="h-5 w-5" />
        </a>
      </div>
    </header>
  );
};

export default Header;

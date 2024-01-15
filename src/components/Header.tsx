
import React from 'react';
import { Github, Map } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full glass rounded-xl p-4 flex items-center justify-between mb-4 animate-slide-down">
      <div className="flex items-center space-x-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Map className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-medium tracking-tight">Polyline Decoder</h1>
          <p className="text-sm text-muted-foreground">Advanced map visualization tool</p>
        </div>
      </div>
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full hover:bg-secondary transition-colors duration-200"
      >
        <Github className="h-5 w-5" />
      </a>
    </header>
  );
};

export default Header;

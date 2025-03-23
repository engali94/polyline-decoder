import React from 'react';
import { Github, Map, Info, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import ShareButton from './ShareButton';
import { ShareableState } from '../utils/urlState';

interface HeaderProps {
  shareableState?: ShareableState;
}

const Header: React.FC<HeaderProps> = ({ shareableState }) => {
  return (
    <header className="glass mb-4 flex w-full animate-slide-down items-center justify-between rounded-xl p-4">
      <div className="flex items-center space-x-2">
        <div className="rounded-lg bg-primary/10 p-2">
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
        <nav className="hidden items-center space-x-2 md:flex">
          <Link
            to="/"
            className="rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-secondary"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="flex items-center rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-secondary"
          >
            <Info className="mr-1 h-3.5 w-3.5" />
            About
          </Link>
          <Link
            to="/docs"
            className="flex items-center rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-secondary"
          >
            <BookOpen className="mr-1 h-3.5 w-3.5" />
            Docs
          </Link>
          {shareableState && <ShareButton state={shareableState} />}
        </nav>
        <span className="hidden text-xs text-muted-foreground md:inline-block">
          Free online tool for Google polyline format
        </span>
        <a
          href="https://github.com/engali94/polyline-decoder"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source code on GitHub"
          className="rounded-full p-2 transition-colors duration-200 hover:bg-secondary"
        >
          <Github className="h-5 w-5" />
        </a>
      </div>
    </header>
  );
};

export default Header;

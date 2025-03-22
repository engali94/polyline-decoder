import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="glass max-w-md animate-scale-in rounded-2xl p-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <span className="text-3xl font-bold text-primary">404</span>
        </div>
        <h1 className="mb-2 text-2xl font-bold">Page not found</h1>
        <p className="mb-6 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to home
        </a>
      </div>
    </div>
  );
};

export default NotFound;

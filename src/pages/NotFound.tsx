
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="glass p-8 rounded-2xl max-w-md text-center animate-scale-in">
        <div className="bg-primary/10 h-20 w-20 flex items-center justify-center rounded-full mx-auto mb-6">
          <span className="text-3xl font-bold text-primary">404</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to home
        </a>
      </div>
    </div>
  );
};

export default NotFound;

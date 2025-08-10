import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingPageProps {
  title?: string;
  message?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ 
  title = "Processing...", 
  message = "Please wait while we process your request." 
}) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center animate-fade-in">
      <div className="text-center">
        <div className="mb-8">
          <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-4" />
        </div>
        
        <h1 className="text-3xl font-semibold text-foreground mb-4 font-inter tracking-tight">
          {title}
        </h1>
        
        <p className="text-lg text-muted-foreground font-inter max-w-md mx-auto">
          {message}
        </p>
        
        <div className="mt-8 space-y-2">
          <div className="h-2 bg-muted rounded-full w-80 mx-auto overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse" style={{
              animation: 'progress 2s ease-in-out infinite'
            }}></div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes progress {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0%); }
          100% { width: 100%; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;
import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { ShareableState, updateUrlWithState } from '../utils/urlState';
import { toast } from 'sonner';

interface ShareButtonProps {
  state: ShareableState;
}

const ShareButton: React.FC<ShareButtonProps> = ({ state }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const handleShare = () => {
    updateUrlWithState(state);
    
    setIsDialogOpen(true);
    setIsCopied(false);
  };
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      toast.success('Link copied to clipboard');
      
      setTimeout(() => setIsCopied(false), 3000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <>
      <Button 
        onClick={handleShare}
        variant="ghost"
        size="sm"
        className="flex items-center gap-1"
      >
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">Share</span>
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this polyline visualization</DialogTitle>
            <DialogDescription>
              Anyone with the link will be able to view this exact polyline configuration.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                value={window.location.href}
                readOnly
                className="h-9"
              />
            </div>
            <Button 
              type="button" 
              size="sm" 
              className="px-3"
              onClick={copyToClipboard}
            >
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy</span>
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Link contains all current polyline data and visualization settings.
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareButton; 
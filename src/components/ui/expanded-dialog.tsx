import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, X } from "lucide-react";

interface ExpandedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
  className?: string;
}

export const ExpandedDialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  fullscreen = false,
  onToggleFullscreen,
  className = ""
}: ExpandedDialogProps) => {
  const dialogContentClass = fullscreen 
    ? "w-[100vw] h-[100vh] max-w-[100vw] max-h-[100vh] m-0 rounded-none"
    : "w-[95vw] h-[95vh] max-w-[95vw] max-h-[95vh]";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${dialogContentClass} overflow-hidden flex flex-col ${className}`}>
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl">{title}</DialogTitle>
              {description && (
                <DialogDescription className="mt-1">{description}</DialogDescription>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4">
              {onToggleFullscreen && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleFullscreen}
                  className="h-8 w-8"
                >
                  {fullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};
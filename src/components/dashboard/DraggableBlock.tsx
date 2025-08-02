
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, X } from 'lucide-react';

interface DraggableBlockProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isEditing?: boolean;
  onRemove?: () => void;
  className?: string;
}

export const DraggableBlock = ({ 
  id, 
  title, 
  children, 
  isEditing = false, 
  onRemove,
  className = "" 
}: DraggableBlockProps) => {
  return (
    <div className={`relative group ${className}`}>
      {isEditing && (
        <div className="absolute -top-2 -right-2 z-10 flex gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 bg-white shadow-sm cursor-grab active:cursor-grabbing"
            data-drag-handle={id}
          >
            <GripVertical className="h-3 w-3" />
          </Button>
          {onRemove && (
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 bg-white shadow-sm hover:bg-red-50 hover:border-red-200"
              onClick={onRemove}
            >
              <X className="h-3 w-3 text-red-500" />
            </Button>
          )}
        </div>
      )}
      
      <div className={`transition-all duration-200 ${
        isEditing 
          ? 'ring-2 ring-blue-200 ring-opacity-50 hover:ring-blue-300' 
          : ''
      }`}>
        {children}
      </div>
    </div>
  );
};

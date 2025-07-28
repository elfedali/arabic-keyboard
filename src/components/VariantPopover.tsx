import React from 'react';
import { Button } from '@/components/ui/button';

interface VariantPopoverProps {
  variants: string[];
  isVisible: boolean;
  position: { x: number; y: number };
  onSelectVariant: (variant: string) => void;
  onClose: () => void;
}

export const VariantPopover: React.FC<VariantPopoverProps> = ({
  variants,
  isVisible,
  position,
  onSelectVariant,
  onClose,
}) => {
  if (!isVisible || variants.length <= 1) return null;

  return (
    <>
      {/* Overlay to close popover when clicking outside */}
      <div 
        className="fixed inset-0 z-40 bg-transparent"
        onClick={onClose}
      />
      
      {/* Popover content */}
      <div
        className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-1 sm:p-2 min-w-max"
        style={{
          left: `${position.x}px`,
          top: `${position.y - 50}px`, // Position above the key (adjusted for mobile)
          transform: 'translateX(-50%)', // Center horizontally
        }}
      >
        <div className="flex gap-0.5 sm:gap-1">
          {variants.map((variant, index) => (
            <Button
              key={index}
              variant={index === 0 ? "default" : "outline"}
              size="sm"
              className="h-8 w-8 sm:h-10 sm:w-10 p-0 text-sm sm:text-lg font-medium hover:bg-blue-50 hover:border-blue-300 arabic-keyboard-key"
              onClick={() => {
                onSelectVariant(variant);
                onClose();
              }}
            >
              {variant}
            </Button>
          ))}
        </div>
        
        {/* Small arrow pointing down */}
        <div 
          className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"
          style={{ marginTop: '-1px' }}
        />
        <div 
          className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-300"
          style={{ marginTop: '0px' }}
        />
      </div>
    </>
  );
};

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
        className="fixed z-50 bg-white dark:bg-[#251c17] border border-gray-300 dark:border-[#3d2e26] rounded-xl shadow-xl p-1.5 min-w-max transition-colors"
        style={{
          left: `${position.x}px`,
          top: `${position.y - 54}px`,
          transform: 'translateX(-50%)',
        }}
      >
        <div className="flex gap-1">
          {variants.map((variant, index) => (
            <Button
              key={index}
              variant={index === 0 ? "default" : "outline"}
              size="sm"
              className={`h-9 w-9 sm:h-10 sm:w-10 p-0 text-base sm:text-lg font-bold arabic-keyboard-key transition-all ${
                index === 0 
                  ? 'bg-amber-600 dark:bg-amber-600 text-white hover:bg-amber-700' 
                  : 'bg-white dark:bg-[#32251f] text-gray-900 dark:text-[#f6efe8] border-gray-200 dark:border-[#46342b] hover:bg-amber-50 dark:hover:bg-[#423129]'
              }`}
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
          className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-white dark:border-t-[#251c17]"
          style={{ marginTop: '-1px' }}
        />
      </div>
    </>
  );
};

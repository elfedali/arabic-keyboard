import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { VariantPopover } from '@/components/VariantPopover';
import { arabicVariants } from '@/data/arabicVariants';

interface ArabicKeyboardProps {
  onKeyPress: (key: string) => void;
}

// Arabic keyboard layout following standard Arabic QWERTY layout
const arabicKeyboardLayout = [
  // First row - numbers and symbols
  [
    { key: '١', label: '١', englishKey: '1' },
    { key: '٢', label: '٢', englishKey: '2' },
    { key: '٣', label: '٣', englishKey: '3' },
    { key: '٤', label: '٤', englishKey: '4' },
    { key: '٥', label: '٥', englishKey: '5' },
    { key: '٦', label: '٦', englishKey: '6' },
    { key: '٧', label: '٧', englishKey: '7' },
    { key: '٨', label: '٨', englishKey: '8' },
    { key: '٩', label: '٩', englishKey: '9' },
    { key: '٠', label: '٠', englishKey: '0' },
  ],
  // Second row - ض ص ث ق ف غ ع ه خ ح ج د
  [
    { key: 'ض', label: 'ض', englishKey: 'Q' },
    { key: 'ص', label: 'ص', englishKey: 'W' },
    { key: 'ث', label: 'ث', englishKey: 'E' },
    { key: 'ق', label: 'ق', englishKey: 'R' },
    { key: 'ف', label: 'ف', englishKey: 'T' },
    { key: 'غ', label: 'غ', englishKey: 'Y' },
    { key: 'ع', label: 'ع', englishKey: 'U' },
    { key: 'ه', label: 'ه', englishKey: 'I' },
    { key: 'خ', label: 'خ', englishKey: 'O' },
    { key: 'ح', label: 'ح', englishKey: 'P' },
    { key: 'ج', label: 'ج', englishKey: '[' },
    { key: 'د', label: 'د', englishKey: ']' },
  ],
  // Third row - ش س ي ب ل ا ت ن م ك ط
  [
    { key: 'ش', label: 'ش', englishKey: 'A' },
    { key: 'س', label: 'س', englishKey: 'S' },
    { key: 'ي', label: 'ي', englishKey: 'D' },
    { key: 'ب', label: 'ب', englishKey: 'F' },
    { key: 'ل', label: 'ل', englishKey: 'G' },
    { key: 'ا', label: 'ا', englishKey: 'H' },
    { key: 'ت', label: 'ت', englishKey: 'J' },
    { key: 'ن', label: 'ن', englishKey: 'K' },
    { key: 'م', label: 'م', englishKey: 'L' },
    { key: 'ك', label: 'ك', englishKey: ';' },
    { key: 'ط', label: 'ط', englishKey: '\'' },
  ],
  // Fourth row - ئ ء ؤ ر لا ى ة و ز ظ
  [
    { key: 'ئ', label: 'ئ', englishKey: 'Z' },
    { key: 'ء', label: 'ء', englishKey: 'X' },
    { key: 'ؤ', label: 'ؤ', englishKey: 'C' },
    { key: 'ر', label: 'ر', englishKey: 'V' },
    { key: 'لا', label: 'لا', englishKey: 'B' },
    { key: 'ى', label: 'ى', englishKey: 'N' },
    { key: 'ة', label: 'ة', englishKey: 'M' },
    { key: 'و', label: 'و', englishKey: ',' },
    { key: 'ز', label: 'ز', englishKey: '.' },
    { key: 'ظ', label: 'ظ', englishKey: '/' },
  ],
];

// Special keys
const specialKeys = [
  { key: ' ', label: 'Space', width: 'w-32' },
  { key: '\n', label: 'Enter', width: 'w-20' },
  { key: 'backspace', label: '⌫', width: 'w-16' },
];

export const ArabicKeyboard: React.FC<ArabicKeyboardProps> = ({ onKeyPress }) => {
  const [showVariants, setShowVariants] = useState(false);
  const [variantPosition, setVariantPosition] = useState({ x: 0, y: 0 });
  const [currentVariants, setCurrentVariants] = useState<string[]>([]);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const longPressThreshold = 500; // 500ms for long press

  const handleKeyPress = (key: string) => {
    onKeyPress(key);
  };

  const handleMouseDown = (key: string, event: React.MouseEvent) => {
    const variants = arabicVariants[key] || [key];
    
    if (variants.length > 1) {
      pressTimer.current = setTimeout(() => {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setVariantPosition({
          x: rect.left + rect.width / 2,
          y: rect.top,
        });
        setCurrentVariants(variants);
        setShowVariants(true);
      }, longPressThreshold);
    }
  };

  const handleMouseUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleVariantSelect = (variant: string) => {
    onKeyPress(variant);
  };

  const handleCloseVariants = () => {
    setShowVariants(false);
    setCurrentVariants([]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-white rounded-lg border">
      <h3 className="text-lg font-semibold mb-4 text-center text-gray-900">
        Arabic Keyboard - Standard Layout
      </h3>
      <p className="text-sm text-center text-gray-600 mb-4">
        Standard Arabic QWERTY layout | Long press keys with ⋯ for variants
      </p>
      
      <div className="space-y-2">
        {arabicKeyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((keyData, keyIndex) => {
              const hasVariants = arabicVariants[keyData.key] && arabicVariants[keyData.key].length > 1;
              return (
                <Button
                  key={keyIndex}
                  variant="outline"
                  size="sm"
                  className={`h-12 w-10 sm:h-14 sm:w-12 md:h-16 md:w-16 p-1 arabic-keyboard-key 
                    hover:bg-blue-50 hover:border-blue-300 active:scale-95 transition-all 
                    flex flex-col justify-center items-center relative
                    ${hasVariants ? 'cursor-pointer' : ''}
                  `}
                  onClick={() => handleKeyPress(keyData.key)}
                  onMouseDown={(e) => handleMouseDown(keyData.key, e)}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={(e) => {
                    // Handle touch for mobile
                    const syntheticEvent = {
                      target: e.target,
                      button: 0,
                    } as any;
                    handleMouseDown(keyData.key, syntheticEvent);
                  }}
                  onTouchEnd={handleMouseUp}
                >
                  <span className="text-base sm:text-lg font-medium text-gray-900">{keyData.label}</span>
                  {keyData.englishKey && (
                    <span className="text-xs text-gray-500 mt-0.5 hidden sm:block">{keyData.englishKey}</span>
                  )}
                  {hasVariants && (
                    <span className="absolute top-1 right-1 text-xs text-blue-500">⋯</span>
                  )}
                </Button>
              );
            })}
          </div>
        ))}
        
        {/* Special keys row */}
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          {specialKeys.map((keyData, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className={`h-12 ${keyData.width} text-sm hover:bg-blue-50 hover:border-blue-300`}
              onClick={() => handleKeyPress(keyData.key)}
            >
              {keyData.label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Variant Popover */}
      <VariantPopover
        variants={currentVariants}
        isVisible={showVariants}
        position={variantPosition}
        onSelectVariant={handleVariantSelect}
        onClose={handleCloseVariants}
      />
    </div>
  );
};

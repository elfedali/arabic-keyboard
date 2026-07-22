import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { VariantPopover } from '@/components/VariantPopover';
import { arabicVariants } from '@/data/arabicVariants';

interface ArabicKeyboardProps {
  onKeyPress: (key: string) => void;
  layout?: 'QWERTY' | 'AZERTY';
}

// Arabic keyboard layout following standard Arabic QWERTY layout
const qwertyKeyboardLayout = [
  // First row - numbers
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
  // Second row - Q W E R T Y U I O P [ ]
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
  // Third row - A S D F G H J K L ; '
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
  // Fourth row - Z X C V B N M , . /
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

// Arabic keyboard layout following standard Francophone Arabic AZERTY layout
const azertyKeyboardLayout = [
  // First row - numbers
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
  // Second row - A Z E R T Y U I O P ^ $
  [
    { key: 'ض', label: 'ض', englishKey: 'A' },
    { key: 'ص', label: 'ص', englishKey: 'Z' },
    { key: 'ث', label: 'ث', englishKey: 'E' },
    { key: 'ق', label: 'ق', englishKey: 'R' },
    { key: 'ف', label: 'ف', englishKey: 'T' },
    { key: 'غ', label: 'غ', englishKey: 'Y' },
    { key: 'ع', label: 'ع', englishKey: 'U' },
    { key: 'ه', label: 'ه', englishKey: 'I' },
    { key: 'خ', label: 'خ', englishKey: 'O' },
    { key: 'ح', label: 'ح', englishKey: 'P' },
    { key: 'ج', label: 'ج', englishKey: '^' },
    { key: 'د', label: 'د', englishKey: '$' },
  ],
  // Third row - Q S D F G H J K L M %
  [
    { key: 'ش', label: 'ش', englishKey: 'Q' },
    { key: 'س', label: 'س', englishKey: 'S' },
    { key: 'ي', label: 'ي', englishKey: 'D' },
    { key: 'ب', label: 'ب', englishKey: 'F' },
    { key: 'ل', label: 'ل', englishKey: 'G' },
    { key: 'ا', label: 'ا', englishKey: 'H' },
    { key: 'ت', label: 'ت', englishKey: 'J' },
    { key: 'ن', label: 'ن', englishKey: 'K' },
    { key: 'م', label: 'م', englishKey: 'L' },
    { key: 'ك', label: 'ك', englishKey: 'M' },
    { key: 'ط', label: 'ط', englishKey: '%' },
  ],
  // Fourth row - W X C V B N ? , . /
  [
    { key: 'ئ', label: 'ئ', englishKey: 'W' },
    { key: 'ء', label: 'ء', englishKey: 'X' },
    { key: 'ؤ', label: 'ؤ', englishKey: 'C' },
    { key: 'ر', label: 'ر', englishKey: 'V' },
    { key: 'لا', label: 'لا', englishKey: 'B' },
    { key: 'ى', label: 'ى', englishKey: 'N' },
    { key: 'ة', label: 'ة', englishKey: '?' },
    { key: 'و', label: 'و', englishKey: ',' },
    { key: 'ز', label: 'ز', englishKey: '.' },
    { key: 'ظ', label: 'ظ', englishKey: '/' },
  ],
];

// Special keys
const specialKeys = [
  { key: ' ', label: 'مسافة', width: 'w-32' },
  { key: '\n', label: 'إدخال', width: 'w-20' },
  { key: 'backspace', label: '⌫', width: 'w-16' },
];

export const ArabicKeyboard: React.FC<ArabicKeyboardProps> = ({ onKeyPress, layout = 'QWERTY' }) => {
  const [showVariants, setShowVariants] = useState(false);
  const [variantPosition, setVariantPosition] = useState({ x: 0, y: 0 });
  const [currentVariants, setCurrentVariants] = useState<string[]>([]);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const longPressThreshold = 500;

  const currentLayout = layout === 'AZERTY' ? azertyKeyboardLayout : qwertyKeyboardLayout;

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
    <div className="w-full max-w-5xl mx-auto p-2 sm:p-4 md:p-5 bg-white dark:bg-[#251c17] rounded-2xl border border-gray-200 dark:border-[#3d2e26] shadow-sm transition-colors" dir="ltr">
      <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
        {currentLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-0.5 sm:gap-1 md:gap-1.5 w-full">
            {row.map((keyData, keyIndex) => {
              const hasVariants = arabicVariants[keyData.key] && arabicVariants[keyData.key].length > 1;
              return (
                <Button
                  key={keyIndex}
                  variant="outline"
                  size="sm"
                  className={`h-10 sm:h-13 md:h-14 flex-1 max-w-[52px] min-w-[25px] sm:min-w-[36px] p-0 arabic-keyboard-key keycap-btn
                    bg-gradient-to-b from-white to-gray-50 dark:from-[#352720] dark:to-[#2c1f19] 
                    border-gray-200/90 dark:border-[#46342b]
                    text-gray-900 dark:text-[#f6efe8]
                    hover:from-amber-50 hover:to-amber-100/60 dark:hover:from-[#443229] dark:hover:to-[#382820] 
                    hover:border-amber-400 dark:hover:border-amber-600 
                    active:bg-amber-100 dark:active:bg-[#4d3a30]
                    flex flex-col justify-center items-center relative select-none rounded-md sm:rounded-xl
                    ${hasVariants ? 'cursor-pointer' : ''}
                  `}
                  onClick={() => handleKeyPress(keyData.key)}
                  onMouseDown={(e) => handleMouseDown(keyData.key, e)}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={(e) => {
                    const syntheticEvent = {
                      target: e.target,
                      button: 0,
                    } as any;
                    handleMouseDown(keyData.key, syntheticEvent);
                  }}
                  onTouchEnd={handleMouseUp}
                >
                  <span className="text-sm sm:text-lg md:text-xl font-bold leading-none tracking-wide">{keyData.label}</span>
                  {keyData.englishKey && (
                    <span className="text-[9px] sm:text-xs text-gray-400 dark:text-amber-200/50 mt-0.5 sm:mt-1 hidden xs:block sm:block font-medium">{keyData.englishKey}</span>
                  )}
                  {hasVariants && (
                    <span className="absolute top-0.5 right-0.5 sm:right-1 text-[9px] sm:text-[10px] text-amber-600 dark:text-amber-400 font-extrabold">⋯</span>
                  )}
                </Button>
              );
            })}
          </div>
        ))}
        
        {/* Special keys row */}
        <div className="flex justify-center gap-1 sm:gap-2 pt-1.5 sm:pt-2 w-full" dir="rtl">
          {specialKeys.map((keyData, index) => {
            const isBackspace = keyData.key === 'backspace';
            const isEnter = keyData.key === '\n';
            const isSpace = keyData.key === ' ';

            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className={`h-10 sm:h-13 text-xs sm:text-sm font-bold rounded-md sm:rounded-xl keycap-btn ${
                  isSpace 
                    ? 'flex-2 max-w-[280px] min-w-[120px] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#32251f] dark:to-[#281d18] border-gray-200 dark:border-[#46342b] text-gray-700 dark:text-[#f6efe8] hover:bg-gray-100 dark:hover:bg-[#423129]'
                    : isEnter
                    ? 'flex-1 max-w-[110px] min-w-[65px] bg-gradient-to-b from-amber-600 to-amber-700 dark:from-amber-600 dark:to-amber-700 text-white border-amber-700 hover:from-amber-700 hover:to-amber-800'
                    : isBackspace
                    ? 'flex-1 max-w-[90px] min-w-[55px] bg-gradient-to-b from-red-50 to-red-100/60 dark:from-red-950/50 dark:to-red-950/80 text-red-600 dark:text-red-300 border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-950'
                    : 'bg-white dark:bg-[#32251f] text-gray-900 dark:text-[#f6efe8] border-gray-200 dark:border-[#46342b]'
                }`}
                onClick={() => handleKeyPress(keyData.key)}
              >
                {keyData.label}
              </Button>
            );
          })}
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

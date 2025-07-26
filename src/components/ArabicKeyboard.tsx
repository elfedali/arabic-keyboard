import React from 'react';
import { Button } from '@/components/ui/button';

interface ArabicKeyboardProps {
  onKeyPress: (key: string) => void;
}

// Standard Arabic keyboard layout (QWERTY to Arabic mapping)
const arabicKeyboardLayout = [
  // First row - numbers and symbols
  [
    { key: '١', label: '١' },
    { key: '٢', label: '٢' },
    { key: '٣', label: '٣' },
    { key: '٤', label: '٤' },
    { key: '٥', label: '٥' },
    { key: '٦', label: '٦' },
    { key: '٧', label: '٧' },
    { key: '٨', label: '٨' },
    { key: '٩', label: '٩' },
    { key: '٠', label: '٠' },
    { key: '-', label: '-' },
    { key: '=', label: '=' },
  ],
  // Second row - ضصثقفغعهخحجد
  [
    { key: 'ض', label: 'ض' },
    { key: 'ص', label: 'ص' },
    { key: 'ث', label: 'ث' },
    { key: 'ق', label: 'ق' },
    { key: 'ف', label: 'ف' },
    { key: 'غ', label: 'غ' },
    { key: 'ع', label: 'ع' },
    { key: 'ه', label: 'ه' },
    { key: 'خ', label: 'خ' },
    { key: 'ح', label: 'ح' },
    { key: 'ج', label: 'ج' },
    { key: 'د', label: 'د' },
  ],
  // Third row - شسيبلاتنمكطذ
  [
    { key: 'ش', label: 'ش' },
    { key: 'س', label: 'س' },
    { key: 'ي', label: 'ي' },
    { key: 'ب', label: 'ب' },
    { key: 'ل', label: 'ل' },
    { key: 'ا', label: 'ا' },
    { key: 'ت', label: 'ت' },
    { key: 'ن', label: 'ن' },
    { key: 'م', label: 'م' },
    { key: 'ك', label: 'ك' },
    { key: 'ط', label: 'ط' },
    { key: 'ذ', label: 'ذ' },
  ],
  // Fourth row - ئءؤرىةوزظ
  [
    { key: 'ئ', label: 'ئ' },
    { key: 'ء', label: 'ء' },
    { key: 'ؤ', label: 'ؤ' },
    { key: 'ر', label: 'ر' },
    { key: 'ى', label: 'ى' },
    { key: 'ة', label: 'ة' },
    { key: 'و', label: 'و' },
    { key: 'ز', label: 'ز' },
    { key: 'ظ', label: 'ظ' },
  ],
];

// Special keys
const specialKeys = [
  { key: ' ', label: 'Space', width: 'w-32' },
  { key: '\n', label: 'Enter', width: 'w-20' },
  { key: 'backspace', label: '⌫', width: 'w-16' },
];

export const ArabicKeyboard: React.FC<ArabicKeyboardProps> = ({ onKeyPress }) => {
  const handleKeyPress = (key: string) => {
    onKeyPress(key);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
        Arabic Keyboard
      </h3>
      
      <div className="space-y-2">
        {arabicKeyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((keyData, keyIndex) => (
              <Button
                key={keyIndex}
                variant="outline"
                size="sm"
                className="h-10 w-10 p-0 arabic-keyboard-key hover:bg-blue-50 hover:border-blue-300 active:scale-95 transition-all"
                onClick={() => handleKeyPress(keyData.key)}
              >
                {keyData.label}
              </Button>
            ))}
          </div>
        ))}
        
        {/* Special keys row */}
        <div className="flex justify-center gap-2 mt-4">
          {specialKeys.map((keyData, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className={`h-10 ${keyData.width} text-sm hover:bg-blue-50 hover:border-blue-300`}
              onClick={() => handleKeyPress(keyData.key)}
            >
              {keyData.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

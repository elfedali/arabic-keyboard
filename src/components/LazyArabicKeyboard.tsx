import { lazy, Suspense } from 'react';

// Lazy load the ArabicKeyboard component for better performance
const ArabicKeyboardLazy = lazy(() => 
  import('./ArabicKeyboard').then(module => ({ default: module.ArabicKeyboard }))
);

interface LazyArabicKeyboardProps {
  onKeyPress: (key: string) => void;
  layout?: 'QWERTY' | 'AZERTY';
}

export const LazyArabicKeyboard: React.FC<LazyArabicKeyboardProps> = ({ onKeyPress, layout = 'QWERTY' }) => {
  return (
    <Suspense fallback={
      <div className="w-full max-w-4xl mx-auto p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800">
        <div className="text-center py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-slate-800 rounded w-1/4 mx-auto mb-4"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-center gap-1">
                  {[...Array(12)].map((_, j) => (
                    <div key={j} className="h-10 w-10 bg-gray-300 dark:bg-slate-800 rounded"></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <ArabicKeyboardLazy onKeyPress={onKeyPress} layout={layout} />
    </Suspense>
  );
};

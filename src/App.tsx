import { useState, useEffect } from 'react';
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { LazyArabicKeyboard } from "./components/LazyArabicKeyboard";
import { HistoryModal } from "./components/HistoryModal";
import { HistoryView } from "./components/HistoryView";
import { SettingsModal } from "./components/SettingsModal";
import { Navbar } from "./components/Navbar";
import { useTextEditor } from "./hooks/useTextEditor";
import { getHistory } from "./lib/localStorage";
import { Copy, Download, Trash2, Search, Youtube, RefreshCw, ToggleLeft, ToggleRight, Clock, Save } from "lucide-react";

function App() {
  const {
    text,
    setText,
    setTextDirectly,
    manualSave,
    textareaRef,
    insertText,
    handleBackspace,
    copyToClipboard,
    searchInGoogle,
    searchInYouTube,
    convertToArabic,
    isAutoConvertEnabled,
    toggleAutoConvert,
  } = useTextEditor();

  const [activeTab, setActiveTab] = useState<'home' | 'history'>('home');
  const [copySuccess, setCopySuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);

  const [keyboardLayout, setKeyboardLayout] = useState<'QWERTY' | 'AZERTY'>(() => {
    return (localStorage.getItem('keyboard_layout') as 'QWERTY' | 'AZERTY') || 'QWERTY';
  });

  const handleManualSaveWithToast = () => {
    if (text.trim()) {
      manualSave();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  // Update history entry count
  useEffect(() => {
    const updateCount = () => {
      setHistoryCount(getHistory().length);
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    return () => window.removeEventListener('storage', updateCount);
  }, [text, isHistoryOpen, activeTab]);

  // Calculate word count
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  // Update page title dynamically based on text content
  useEffect(() => {
    const baseTitle = "لوحة المفاتيح العربية - كتابة واختبارات";
    if (text.trim()) {
      const preview = text.trim().substring(0, 30);
      document.title = `${preview}... - ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }
  }, [text]);

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      handleBackspace();
    } else if (key === '\n') {
      insertText('\n');
    } else {
      insertText(key);
    }
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard();
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleClear = () => {
    setText('');
    textareaRef.current?.focus();
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'arabic-text.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1310] text-gray-900 dark:text-[#f6efe8] flex flex-col transition-colors duration-200">
      {/* Top Navigation Bar */}
      <Navbar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        historyCount={historyCount}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 px-4 pb-8 max-w-7xl mx-auto w-full" dir="rtl">
        {activeTab === 'home' ? (
          <div className="space-y-4 mt-2 relative">
            {/* Toast Feedback Notification */}
            {(saveSuccess || copySuccess) && (
              <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-600 dark:bg-amber-500 text-white px-5 py-2.5 rounded-full shadow-xl font-bold text-sm flex items-center gap-2 transition-all animate-bounce">
                <span>{saveSuccess ? '✓ تم حفظ النص في السجل بنجاح!' : '✓ تم نسخ النص إلى الحافظة!'}</span>
              </div>
            )}

            {/* 1. Action Buttons Bar (Single Line Layout without duplicate actions) */}
            <div className="bg-white dark:bg-[#251c17] p-2.5 sm:p-3 rounded-2xl border border-gray-200 dark:border-[#3d2e26] shadow-sm flex flex-nowrap items-center justify-between gap-2 overflow-x-auto transition-colors scrollbar-none">
              <div className="flex flex-nowrap items-center gap-1.5 sm:gap-2 min-w-max">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualSaveWithToast}
                  disabled={!text.trim()}
                  className="font-bold text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-[#32251f] border-gray-200 dark:border-[#3d2e26] text-xs sm:text-sm px-2.5 py-1.5"
                >
                  <Save className="w-4 h-4 ml-1" />
                  {saveSuccess ? 'تم الحفظ!' : 'حفظ'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('history')}
                  className="font-bold text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-[#32251f] border-gray-200 dark:border-[#3d2e26] text-xs sm:text-sm px-2.5 py-1.5"
                >
                  <Clock className="w-4 h-4 ml-1" />
                  السجل
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleAutoConvert}
                  className={isAutoConvertEnabled ? 'bg-blue-50 dark:bg-amber-950/60 border-blue-300 dark:border-amber-700 text-blue-700 dark:text-amber-300 font-bold text-xs sm:text-sm px-2.5 py-1.5' : 'border-gray-200 dark:border-[#3d2e26] dark:text-amber-100/70 font-bold text-xs sm:text-sm px-2.5 py-1.5'}
                >
                  {isAutoConvertEnabled ? <ToggleRight className="w-4 h-4 ml-1 text-blue-600 dark:text-amber-400" /> : <ToggleLeft className="w-4 h-4 ml-1" />}
                  تحويل تلقائي {isAutoConvertEnabled ? 'مفعّل' : 'معطّل'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className={copySuccess ? 'bg-green-50 dark:bg-green-950/60 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 font-bold text-xs sm:text-sm px-2.5 py-1.5' : 'border-gray-200 dark:border-[#3d2e26] dark:text-amber-100/70 font-bold text-xs sm:text-sm px-2.5 py-1.5'}
                >
                  <Copy className="w-4 h-4 ml-1" />
                  {copySuccess ? 'تم النسخ!' : 'نسخ'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={!text.trim()}
                  className="border-gray-200 dark:border-[#3d2e26] dark:text-amber-100/70 font-bold text-xs sm:text-sm px-2.5 py-1.5"
                >
                  <Download className="w-4 h-4 ml-1" />
                  تنزيل
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={searchInGoogle}
                  disabled={!text.trim()}
                  className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-[#32251f] border-gray-200 dark:border-[#3d2e26] font-bold text-xs sm:text-sm px-2.5 py-1.5"
                >
                  <Search className="w-4 h-4 ml-1" />
                  جوجل
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={searchInYouTube}
                  disabled={!text.trim()}
                  className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-[#32251f] border-gray-200 dark:border-[#3d2e26] font-bold text-xs sm:text-sm px-2.5 py-1.5"
                >
                  <Youtube className="w-4 h-4 ml-1" />
                  يوتيوب
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={convertToArabic}
                  disabled={!text.trim()}
                  className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-[#32251f] border-gray-200 dark:border-[#3d2e26] font-bold text-xs sm:text-sm px-2.5 py-1.5"
                >
                  <RefreshCw className="w-4 h-4 ml-1" />
                  تحويل
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  disabled={!text.trim()}
                  className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-[#32251f] border-gray-200 dark:border-[#3d2e26] font-bold text-xs sm:text-sm px-2.5 py-1.5"
                >
                  <Trash2 className="w-4 h-4 ml-1" />
                  مسح
                </Button>
              </div>

              {/* Character & Word Counter */}
              <div className="text-xs text-gray-500 dark:text-amber-200/60 font-bold px-2.5 py-1 bg-gray-100 dark:bg-[#18120f] rounded-lg border border-gray-200/60 dark:border-[#382b24] min-w-max">
                {text.length} حرف • {wordCount} كلمة
              </div>
            </div>

            {/* 2. One Line Textarea Input (No Placeholder) */}
            <div className="bg-white dark:bg-[#251c17] rounded-2xl border border-gray-200 dark:border-[#3d2e26] shadow-sm focus-within:ring-2 focus-within:ring-amber-500/50 p-2 transition-all">
              <Textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder=""
                rows={1}
                className="w-full min-h-[54px] max-h-[140px] py-2.5 px-3 text-xl font-bold leading-normal arabic-text border-none bg-transparent text-gray-900 dark:text-[#f6efe8] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
                dir="rtl"
                lang="ar"
              />
            </div>

            {/* 3. Keyboard under it */}
            <div className="pt-2">
              <LazyArabicKeyboard onKeyPress={handleKeyPress} layout={keyboardLayout} />
              
              {/* Sample note under the keyboard */}
              <p className="text-center text-xs font-bold text-gray-500 dark:text-amber-200/60 pt-3">
                ملاحظة: يمكنك الكتابة باستخدام الحروف والرموز اللاتينية وسيتم تحويلها تلقائياً إلى الكلمات العربية
              </p>
            </div>
          </div>
        ) : (
          <HistoryView 
            onLoadText={setTextDirectly}
            onGoHome={() => setActiveTab('home')}
          />
        )}
      </main>

      {/* History Modal */}
      <HistoryModal 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onLoadText={setTextDirectly}
      />

      {/* Global Settings Gear Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        keyboardLayout={keyboardLayout}
        onLayoutChange={setKeyboardLayout}
        isAutoConvertEnabled={isAutoConvertEnabled}
        onToggleAutoConvert={toggleAutoConvert}
      />
    </div>
  );
}

export default App;



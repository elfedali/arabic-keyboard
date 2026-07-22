import { useState, useEffect } from 'react';
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { LazyArabicKeyboard } from "./components/LazyArabicKeyboard";
import { HistoryModal } from "./components/HistoryModal";
import { HistoryView } from "./components/HistoryView";
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
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);

  // Update history entry count
  useEffect(() => {
    const updateCount = () => {
      setHistoryCount(getHistory().length);
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    return () => window.removeEventListener('storage', updateCount);
  }, [text, isHistoryOpen, activeTab]);

  // Calculate word count and dynamic font size
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  
  const getDynamicFontSize = (words: number) => {
    if (words < 10) return 'text-2xl'; // 24px - Large for short texts
    if (words < 15) return 'text-xl';  // 20px - Medium-large
    if (words < 20) return 'text-lg';  // 18px - Medium
    if (words < 30) return 'text-base'; // 16px - Normal
    return 'text-sm'; // 14px - Small for long texts
  };

  // Update page title dynamically based on text content
  useEffect(() => {
    const baseTitle = "Arabic Online Keyboard - Free Virtual Arabic Typing Tool";
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Navigation Bar */}
      <Navbar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        historyCount={historyCount} 
      />

      <main className="flex-1 px-4 pb-8 max-w-5xl mx-auto w-full">
        {activeTab === 'home' ? (
          <div className="space-y-4 mt-2">
            {/* 1. Action Buttons Bar above textarea */}
            <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-2 transition-colors">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={manualSave}
                  disabled={!text.trim()}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border-gray-200 dark:border-slate-700"
                >
                  <Save className="w-4 h-4 mr-1" />
                  حفظ
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('history')}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/50 border-gray-200 dark:border-slate-700"
                >
                  <Clock className="w-4 h-4 mr-1" />
                  السجل
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleAutoConvert}
                  className={isAutoConvertEnabled ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300' : 'border-gray-200 dark:border-slate-700 dark:text-slate-300'}
                >
                  {isAutoConvertEnabled ? <ToggleRight className="w-4 h-4 mr-1 text-blue-600 dark:text-blue-400" /> : <ToggleLeft className="w-4 h-4 mr-1" />}
                  تحويل تلقائي {isAutoConvertEnabled ? 'مفعّل' : 'معطّل'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className={copySuccess ? 'bg-green-50 dark:bg-green-950/60 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300' : 'border-gray-200 dark:border-slate-700 dark:text-slate-300'}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  {copySuccess ? 'تم النسخ!' : 'نسخ'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={!text.trim()}
                  className="border-gray-200 dark:border-slate-700 dark:text-slate-300"
                >
                  <Download className="w-4 h-4 mr-1" />
                  تنزيل
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={searchInGoogle}
                  disabled={!text.trim()}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 border-gray-200 dark:border-slate-700"
                >
                  <Search className="w-4 h-4 mr-1" />
                  جوجل
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={searchInYouTube}
                  disabled={!text.trim()}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/50 border-gray-200 dark:border-slate-700"
                >
                  <Youtube className="w-4 h-4 mr-1" />
                  يوتيوب
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={convertToArabic}
                  disabled={!text.trim()}
                  className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-950/50 border-gray-200 dark:border-slate-700"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  تحويل
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  disabled={!text.trim()}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/50 border-gray-200 dark:border-slate-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  مسح
                </Button>
              </div>

              {/* Character & Word Counter */}
              <div className="text-xs text-gray-500 dark:text-slate-400 font-medium px-2.5 py-1 bg-gray-100 dark:bg-slate-800 rounded-lg border border-gray-200/60 dark:border-slate-700/60">
                {text.length} حرف • {wordCount} كلمة
              </div>
            </div>

            {/* 2. One Line Textarea Input */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/50 p-2 transition-all">
              <Textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={isAutoConvertEnabled ? 'Type: ahlan wa sahlan → أهلاً وسهلاً | bayt → بيت' : 'اكتب النص هنا...'}
                rows={1}
                className="w-full min-h-[54px] max-h-[140px] py-2.5 px-3 text-xl font-medium leading-normal arabic-text border-none bg-transparent text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
                dir="rtl"
                lang="ar"
              />
            </div>

            {/* 3. Keyboard under it */}
            <div className="pt-2">
              <LazyArabicKeyboard onKeyPress={handleKeyPress} />
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
    </div>
  );
}

export default App;


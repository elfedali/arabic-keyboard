import { useState, useEffect } from 'react';
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { LazyArabicKeyboard } from "./components/LazyArabicKeyboard";
import { HistoryModal } from "./components/HistoryModal";
import { useTextEditor } from "./hooks/useTextEditor";
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

  const [copySuccess, setCopySuccess] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

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
    <main className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Arabic Online Keyboard
        </h1>
        <p className="text-gray-600 text-lg">
          Type in Arabic using standard QWERTY layout | اكتب باللغة العربية باستخدام تخطيط QWERTY
        </p>
      </header>

      {/* Split Screen Layout */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-200px)] gap-4">
        {/* Left Side - Text Editor (50%) */}
        <section className="w-full lg:w-1/2 bg-white rounded-lg shadow border flex flex-col" aria-label="Arabic Text Editor">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="text-lg font-semibold text-gray-900">Text Editor | محرر النصوص</h2>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsHistoryOpen(true)}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  History
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={manualSave}
                  disabled={!text.trim()}
                  className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleAutoConvert}
                  className={isAutoConvertEnabled ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}
                >
                  {isAutoConvertEnabled ? <ToggleRight className="w-4 h-4 mr-2" /> : <ToggleLeft className="w-4 h-4 mr-2" />}
                  Auto Convert {isAutoConvertEnabled ? 'ON' : 'OFF'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className={copySuccess ? 'bg-green-50 border-green-300' : ''}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copySuccess ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={!text.trim()}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={searchInGoogle}
                  disabled={!text.trim()}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={searchInYouTube}
                  disabled={!text.trim()}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Youtube className="w-4 h-4 mr-2" />
                  YouTube
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={convertToArabic}
                  disabled={!text.trim()}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Convert
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  disabled={!text.trim()}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Textarea */}
          <div className="flex-1 p-4">
            <Textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={isAutoConvertEnabled ? 'Type: ahlan wa sahlan → أهلاً وسهلاً | bayt → بيت | shukran → شكراً' : 'عبر عن نفسك'}
              className={`h-full min-h-[300px] leading-relaxed arabic-text resize-none border-gray-300 focus:border-blue-500 focus:ring-0 focus:outline-none transition-all duration-300 ${getDynamicFontSize(wordCount)} !text-current`}
              dir="rtl"
              lang="ar"
            />
          </div>

          {/* Stats */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Characters: {text.length}</span>
              <span>Words: {wordCount} • Font: {getDynamicFontSize(wordCount)}</span>
            </div>
          </div>
        </section>

        {/* Right Side - Arabic Keyboard (50%) */}
        <section className="w-full lg:w-1/2 bg-white rounded-lg shadow border flex flex-col" aria-label="Arabic Virtual Keyboard">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900 text-center">Arabic Keyboard | لوحة المفاتيح العربية</h2>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <LazyArabicKeyboard onKeyPress={handleKeyPress} />
          </div>
        </section>
      </div>

      {/* Instructions Footer */}
      <footer className="mt-8 bg-white rounded-lg shadow border p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">How to Use</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 text-sm text-gray-600">
          <div className="text-center">
            <strong>Standard Layout:</strong> QWERTY layout
          </div>
          <div className="text-center">
            <strong>Long Press:</strong> Hold ⋯ keys for variants
          </div>
          <div className="text-center">
            <strong>Auto Convert:</strong> Toggle phonetic mode
          </div>
          <div className="text-center">
            <strong>Click Keys:</strong> Tap to type
          </div>
          <div className="text-center">
            <strong>Search:</strong> Google & YouTube
          </div>
          <div className="text-center">
            <strong>Export:</strong> Copy & download
          </div>
        </div>
      </footer>

      {/* History Modal */}
      <HistoryModal 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onLoadText={setTextDirectly}
      />
    </main>
  );
}

export default App;

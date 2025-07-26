import { useState, useEffect } from 'react';
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { LazyArabicKeyboard } from "./components/LazyArabicKeyboard";
import { useTextEditor } from "./hooks/useTextEditor";
import { Copy, Download, Trash2, Search, Youtube } from "lucide-react";

function App() {
  const {
    text,
    setText,
    textareaRef,
    insertText,
    handleBackspace,
    copyToClipboard,
    searchInGoogle,
    searchInYouTube,
  } = useTextEditor();

  const [copySuccess, setCopySuccess] = useState(false);

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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Arabic Online Keyboard
          </h1>
          <p className="text-gray-600 text-lg">
            Type in Arabic using the virtual keyboard below | اكتب باللغة العربية باستخدام لوحة المفاتيح الافتراضية أدناه
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Free online Arabic keyboard with Google search, YouTube search, copy and download features
          </p>
        </header>

        {/* Text Area Section */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-6" aria-label="Arabic Text Editor">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Text Editor | محرر النصوص</h2>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className={`${copySuccess ? 'bg-green-50 border-green-300' : ''}`}
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
                onClick={handleClear}
                disabled={!text.trim()}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing in Arabic... أبدأ بالكتابة باللغة العربية"
            className="min-h-[200px] text-lg leading-relaxed arabic-text"
            dir="rtl"
            lang="ar"
          />

          <div className="mt-2 text-sm text-gray-500 flex justify-between">
            <span>Characters: {text.length}</span>
            <span>Words: {text.trim() ? text.trim().split(/\s+/).length : 0}</span>
          </div>
        </section>

        {/* Keyboard Section */}
        <section className="bg-white rounded-lg shadow-lg p-2" aria-label="Arabic Virtual Keyboard">
          <LazyArabicKeyboard onKeyPress={handleKeyPress} />
        </section>

        {/* Instructions */}
        <section className="mt-8 bg-white/80 rounded-lg p-6 text-center" aria-label="Usage Instructions">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            How to Use | كيفية الاستخدام
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm text-gray-600">
            <div>
              <strong>Click Keys:</strong> Click on the Arabic keyboard keys to type
            </div>
            <div>
              <strong>Physical Keyboard:</strong> Use your regular keyboard to type
            </div>
            <div>
              <strong>Copy & Share:</strong> Use the copy button to share your text
            </div>
            <div>
              <strong>Search Google:</strong> Search your Arabic text on Google
            </div>
            <div>
              <strong>Search YouTube:</strong> Find videos related to your text
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="mt-8 bg-white/60 rounded-lg p-6 text-sm text-gray-600" aria-label="SEO Information">
          <h4 className="font-semibold mb-3">About Arabic Online Keyboard</h4>
          <p className="mb-2">
            Our free Arabic online keyboard (لوحة المفاتيح العربية) allows you to type in Arabic easily without installing any software. 
            This virtual Arabic keyboard supports all Arabic characters and diacritics, making it perfect for writing Arabic text online.
          </p>
          <p className="mb-2">
            Features include: Arabic typing, text copying, Google search integration, YouTube search, text download, 
            and full support for right-to-left (RTL) Arabic text. Compatible with all devices and browsers.
          </p>
          <p>
            Keywords: Arabic keyboard, virtual Arabic keyboard, online Arabic typing, Arabic input method, 
            لوحة مفاتيح عربية, كتابة عربية, Arabic text editor.
          </p>
        </section>
      </div>
    </main>
  );
}

export default App;

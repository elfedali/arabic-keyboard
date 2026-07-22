import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { getHistory, deleteHistoryEntry, clearAllHistory, loadHistoryEntry, type HistoryEntry } from "../lib/localStorage";
import { Trash2, Clock, Download, Copy, RotateCcw, Search, ArrowRight } from "lucide-react";

interface HistoryViewProps {
  onLoadText: (text: string) => void;
  onGoHome: () => void;
}

export const HistoryView = ({ onLoadText, onGoHome }: HistoryViewProps) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleDelete = (id: string) => {
    deleteHistoryEntry(id);
    setHistory(getHistory());
  };

  const handleClearAll = () => {
    if (confirm('هل أنت تأكد من رغبتك في حذف جميع النصوص المحفوظة؟ (Are you sure you want to clear all saved history?)')) {
      clearAllHistory();
      setHistory([]);
    }
  };

  const handleLoad = (id: string) => {
    const text = loadHistoryEntry(id);
    if (text) {
      onLoadText(text);
      onGoHome();
    }
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(id);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownload = (text: string, timestamp: number) => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    const date = new Date(timestamp).toISOString().slice(0, 10);
    element.download = `arabic-text-${date}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'الآن (Just now)';
    if (diffInMinutes < 60) return `قبل ${diffInMinutes} دقيقة (${diffInMinutes}m ago)`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `قبل ${diffInHours} ساعة (${diffInHours}h ago)`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `قبل ${diffInDays} يوم (${diffInDays}d ago)`;
    
    return date.toLocaleDateString();
  };

  const filteredHistory = history.filter(entry => 
    entry.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-800 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">سجل النصوص (History)</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">استعرض وإدارة جميع النصوص التي تم حفظها سابقاً</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={onGoHome}
            className="flex items-center gap-2 border-gray-200 dark:border-slate-700 dark:text-slate-200"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للمحرر (Home)
          </Button>

          {history.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearAll}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/50 border-red-200 dark:border-red-900/50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              مسح الكل
            </Button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      {history.length > 0 && (
        <div className="relative mb-6">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في النصوص المحفوظة... (Search saved text...)"
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm transition"
          />
        </div>
      )}

      {/* History Items Grid */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-gray-200 dark:border-slate-800 shadow-sm">
          <Clock className="w-16 h-16 mx-auto mb-4 text-purple-300 dark:text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-1">
            {searchQuery ? 'لم يتم العثور على نتائج' : 'لا يوجد نصوص محفوظة'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
            {searchQuery ? 'جرب البحث بكلمات أخرى' : 'سيتم حفظ النصوص التي تكتبها في المحرر تلقائياً'}
          </p>
          <Button onClick={onGoHome} className="bg-purple-600 hover:bg-purple-700 text-white">
            ابدأ الكتابة الآن
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredHistory.map((entry) => (
            <div
              key={entry.id}
              className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition group"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-100 dark:border-purple-900/50">
                      {formatDate(entry.timestamp)}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-slate-500">
                      {entry.text.length} حرف • {entry.text.trim().split(/\s+/).length} كلمة
                    </span>
                  </div>

                  <p 
                    className="text-gray-900 dark:text-slate-100 text-lg leading-relaxed arabic-text p-3 bg-gray-50/80 dark:bg-slate-800/60 rounded-lg border border-gray-100 dark:border-slate-700/60" 
                    dir="rtl"
                    lang="ar"
                    style={{ wordBreak: 'break-word' }}
                  >
                    {entry.text}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 flex-wrap flex-shrink-0 self-end sm:self-start">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleLoad(entry.id)}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    استرجاع (Load)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(entry.text, entry.id)}
                    className={copySuccess === entry.id ? 'bg-green-50 dark:bg-green-950/60 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300' : 'border-gray-200 dark:border-slate-700 dark:text-slate-300'}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    {copySuccess === entry.id ? 'تم النسخ' : 'نسخ'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(entry.text, entry.timestamp)}
                    className="border-gray-200 dark:border-slate-700 dark:text-slate-300"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    تنزيل
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/50 border-red-200 dark:border-red-900/50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    حذف
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

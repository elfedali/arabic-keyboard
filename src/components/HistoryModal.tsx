import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { getHistory, deleteHistoryEntry, clearAllHistory, loadHistoryEntry, type HistoryEntry } from "../lib/localStorage";
import { Trash2, Clock, Download, Copy, RotateCcw } from "lucide-react";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadText: (text: string) => void;
}

export const HistoryModal = ({ isOpen, onClose, onLoadText }: HistoryModalProps) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setHistory(getHistory());
    }
  }, [isOpen]);

  const handleDelete = (id: string) => {
    deleteHistoryEntry(id);
    setHistory(getHistory());
  };

  const handleClearAll = () => {
    if (confirm('هل أنت تأكد من رغبتك في حذف جميع النصوص المحفوظة؟')) {
      clearAllHistory();
      setHistory([]);
    }
  };

  const handleLoad = (id: string) => {
    const text = loadHistoryEntry(id);
    if (text) {
      onLoadText(text);
      onClose();
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
    const date = new Date(timestamp).toLocaleDateString('ar-SA');
    element.download = `arabic-text-${date}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `قبل ${diffInMinutes} دقيقة`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `قبل ${diffInHours} ساعة`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `قبل ${diffInDays} يوم`;
    
    return date.toLocaleDateString('ar-SA');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-white dark:bg-[#231b17] border-gray-200 dark:border-[#3d2e26] text-gray-900 dark:text-[#f6efe8]">
        <DialogHeader className="text-right">
          <DialogTitle className="flex items-center justify-end gap-2 text-gray-900 dark:text-[#f6efe8] font-bold">
            <span>سجل النصوص المحفوظة</span>
            <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-amber-200/50 text-right">
            استعرض النصوص المحفوظة سابقاً واضغط "استرجاع" لإعادتها إلى المحرر.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-between items-center mb-4" dir="rtl">
          <span className="text-sm font-bold text-gray-600 dark:text-amber-200/60">
            {history.length} نصوص محفوظة
          </span>
          {history.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="font-bold text-red-600 dark:text-red-300 hover:text-red-700 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-950/50 border-red-200 dark:border-red-900/50"
            >
              <Trash2 className="w-4 h-4 ml-1.5" />
              مسح الكل
            </Button>
          )}
        </div>

        <div className="max-h-96 overflow-hidden" dir="rtl">
          <ScrollArea className="h-96">
            <div className="space-y-3 pl-4">
              {history.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-amber-200/50">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50 text-purple-400" />
                  <p className="font-bold text-base">لا توجد نصوص محفوظة بعد</p>
                  <p className="text-sm">ابدأ الكتابة لحفظ نصوصك تلقائياً</p>
                </div>
              ) : (
                history.map((entry) => (
                  <div
                    key={entry.id}
                    className="border border-gray-200 dark:border-[#3d2e26] rounded-xl p-4 bg-gray-50/50 dark:bg-[#1c1512] hover:bg-gray-100 dark:hover:bg-[#2a1e18] transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 dark:text-amber-200/50 mb-1 font-medium">
                          {formatDate(entry.timestamp)}
                        </p>
                        <p 
                          className="text-gray-900 dark:text-[#f6efe8] leading-relaxed arabic-text font-bold" 
                          dir="rtl"
                          style={{ wordBreak: 'break-word' }}
                        >
                          {entry.preview}
                        </p>
                      </div>
                      <div className="flex gap-1 mr-3 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLoad(entry.id)}
                          title="استرجاع"
                          className="text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-[#352720] border-gray-200 dark:border-[#3d2e26]"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(entry.text, entry.id)}
                          title="نسخ"
                          className={copySuccess === entry.id ? 'bg-green-50 dark:bg-green-950/60 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300' : 'border-gray-200 dark:border-[#3d2e26] dark:text-[#f6efe8]'}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(entry.text, entry.timestamp)}
                          title="تنزيل"
                          className="border-gray-200 dark:border-[#3d2e26] dark:text-[#f6efe8]"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                          title="حذف"
                          className="text-red-600 dark:text-red-300 hover:text-red-700 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-950/50 border-red-200 dark:border-red-900/50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-amber-200/40 font-medium">
                      {entry.text.length} حرف • {entry.text.trim().split(/\s+/).length} كلمة
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

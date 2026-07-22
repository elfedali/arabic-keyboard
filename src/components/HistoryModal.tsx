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
    if (confirm('Are you sure you want to delete all history? This action cannot be undone.')) {
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
    
    const date = new Date(timestamp).toLocaleDateString();
    element.download = `arabic-text-${date}.txt`;
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-900 dark:text-slate-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-slate-100">
            <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Text History | سجل النصوص
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-slate-400">
            View and manage your previously saved texts. Click "Load" to restore text to the editor.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600 dark:text-slate-400">
            {history.length} saved {history.length === 1 ? 'entry' : 'entries'}
          </span>
          {history.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/50 border-red-200 dark:border-red-900/50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        <div className="max-h-96 overflow-hidden">
          <ScrollArea className="h-96">
            <div className="space-y-3 pr-4">
              {history.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No saved texts yet</p>
                  <p className="text-sm">Start typing to automatically save your work</p>
                </div>
              ) : (
                history.map((entry) => (
                  <div
                    key={entry.id}
                    className="border border-gray-200 dark:border-slate-800 rounded-lg p-4 bg-gray-50/50 dark:bg-slate-800/40 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">
                          {formatDate(entry.timestamp)}
                        </p>
                        <p 
                          className="text-gray-900 dark:text-slate-100 leading-relaxed arabic-text" 
                          dir="rtl"
                          style={{ wordBreak: 'break-word' }}
                        >
                          {entry.preview}
                        </p>
                      </div>
                      <div className="flex gap-1 ml-3 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLoad(entry.id)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 border-gray-200 dark:border-slate-700"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(entry.text, entry.id)}
                          className={copySuccess === entry.id ? 'bg-green-50 dark:bg-green-950/60 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300' : 'border-gray-200 dark:border-slate-700 dark:text-slate-300'}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(entry.text, entry.timestamp)}
                          className="border-gray-200 dark:border-slate-700 dark:text-slate-300"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/50 border-red-200 dark:border-red-900/50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">
                      {entry.text.length} characters • {entry.text.trim().split(/\s+/).length} words
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

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
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Text History | سجل النصوص
          </DialogTitle>
          <DialogDescription>
            View and manage your previously saved texts. Click "Load" to restore text to the editor.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">
            {history.length} saved {history.length === 1 ? 'entry' : 'entries'}
          </span>
          {history.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No saved texts yet</p>
                  <p className="text-sm">Start typing to automatically save your work</p>
                </div>
              ) : (
                history.map((entry) => (
                  <div
                    key={entry.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600 mb-1">
                          {formatDate(entry.timestamp)}
                        </p>
                        <p 
                          className="text-gray-900 leading-relaxed arabic-text" 
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
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(entry.text, entry.id)}
                          className={copySuccess === entry.id ? 'bg-green-50 border-green-300' : ''}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(entry.text, entry.timestamp)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
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

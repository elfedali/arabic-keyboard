import { useState, useRef, useCallback } from "react";

export interface UseTextEditorReturn {
  text: string;
  setText: (text: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  insertText: (newText: string) => void;
  handleBackspace: () => void;
  copyToClipboard: () => Promise<void>;
  searchInGoogle: () => void;
  searchInYouTube: () => void;
  cursorPosition: number;
}

export const useTextEditor = (
  initialText: string = ""
): UseTextEditorReturn => {
  const [text, setText] = useState(initialText);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = useCallback(
    (newText: string) => {
      if (!textareaRef.current) return;

      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newValue = text.slice(0, start) + newText + text.slice(end);
      setText(newValue);

      // Set cursor position after the inserted text
      const newCursorPosition = start + newText.length;
      setCursorPosition(newCursorPosition);

      // Focus and set cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    },
    [text]
  );

  const handleBackspace = useCallback(() => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end) {
      // Delete selected text
      const newValue = text.slice(0, start) + text.slice(end);
      setText(newValue);
      setCursorPosition(start);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start);
      }, 0);
    } else if (start > 0) {
      // Delete character before cursor
      const newValue = text.slice(0, start - 1) + text.slice(start);
      setText(newValue);
      const newCursorPosition = start - 1;
      setCursorPosition(newCursorPosition);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    }
  }, [text]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      return Promise.resolve();
    } catch (err) {
      // Fallback for older browsers
      if (textareaRef.current) {
        textareaRef.current.select();
        document.execCommand("copy");
      }
      return Promise.resolve();
    }
  }, [text]);

  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  }, []);

  const searchInGoogle = useCallback(() => {
    if (text.trim()) {
      const searchQuery = encodeURIComponent(text.trim());
      const googleURL = `https://www.google.com/search?q=${searchQuery}`;
      window.open(googleURL, "_blank");
    }
  }, [text]);

  const searchInYouTube = useCallback(() => {
    if (text.trim()) {
      const searchQuery = encodeURIComponent(text.trim());
      const youtubeURL = `https://www.youtube.com/results?search_query=${searchQuery}`;
      window.open(youtubeURL, "_blank");
    }
  }, [text]);

  return {
    text,
    setText: handleTextChange,
    textareaRef,
    insertText,
    handleBackspace,
    copyToClipboard,
    searchInGoogle,
    searchInYouTube,
    cursorPosition,
  };
};

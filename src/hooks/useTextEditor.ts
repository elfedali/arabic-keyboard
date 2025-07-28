import { useState, useRef, useCallback, useEffect } from "react";
import { saveToHistory } from "../lib/localStorage";

// English to Arabic phonetic mapping (sound-based)
const englishToArabicMap: { [key: string]: string } = {
  // Numbers
  "1": "١",
  "2": "٢",
  "3": "٣",
  "4": "٤",
  "5": "٥",
  "6": "٦",
  "7": "٧",
  "8": "٨",
  "9": "٩",
  "0": "٠",

  // Phonetic mapping (lowercase)
  a: "ا", // Alif
  b: "ب", // Ba
  c: "ك", // Ka (closest to C sound)
  d: "د", // Dal
  e: "ي", // Ya (for E sound)
  f: "ف", // Fa
  g: "غ", // Ghayn
  h: "ه", // Ha
  i: "ي", // Ya (for I sound)
  j: "ج", // Jim
  k: "ك", // Kaf
  l: "ل", // Lam
  m: "م", // Mim
  n: "ن", // Nun
  o: "و", // Waw (for O sound)
  p: "ب", // Ba (closest to P sound)
  q: "ق", // Qaf
  r: "ر", // Ra
  s: "س", // Sin
  t: "ت", // Ta
  u: "و", // Waw (for U sound)
  v: "ف", // Fa (closest to V sound)
  w: "و", // Waw
  x: "كس", // Kaf + Sin (X sound)
  y: "ي", // Ya
  z: "ز", // Zay

  // Capital letters (same mapping)
  A: "ا",
  B: "ب",
  C: "ك",
  D: "د",
  E: "ي",
  F: "ف",
  G: "غ",
  H: "ه",
  I: "ي",
  J: "ج",
  K: "ك",
  L: "ل",
  M: "م",
  N: "ن",
  O: "و",
  P: "ب",
  Q: "ق",
  R: "ر",
  S: "س",
  T: "ت",
  U: "و",
  V: "ف",
  W: "و",
  X: "كس",
  Y: "ي",
  Z: "ز",

  // Special combinations for better phonetics (must be checked first)
  th: "ث", // Tha
  kh: "خ", // Kha
  sh: "ش", // Shin
  gh: "غ", // Ghayn
  ch: "ش", // Shin (closest to CH sound)
  dh: "ذ", // Dhal
  Th: "ث", // Tha (capital)
  Kh: "خ", // Kha (capital)
  Sh: "ش", // Shin (capital)
  Gh: "غ", // Ghayn (capital)
  Ch: "ش", // Shin (capital)
  Dh: "ذ", // Dhal (capital)
  TH: "ث", // Tha (all caps)
  KH: "خ", // Kha (all caps)
  SH: "ش", // Shin (all caps)
  GH: "غ", // Ghayn (all caps)
  CH: "ش", // Shin (all caps)
  DH: "ذ", // Dhal (all caps)
};

export interface UseTextEditorReturn {
  text: string;
  setText: (text: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  insertText: (newText: string) => void;
  handleBackspace: () => void;
  copyToClipboard: () => Promise<void>;
  searchInGoogle: () => void;
  searchInYouTube: () => void;
  convertToArabic: () => void;
  isAutoConvertEnabled: boolean;
  toggleAutoConvert: () => void;
  cursorPosition: number;
}

export const useTextEditor = () => {
  const [text, setText] = useState("");
  const [isAutoConvertEnabled, setIsAutoConvertEnabled] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [lastSavedText, setLastSavedText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Smart auto-save to localStorage when text changes significantly
  useEffect(() => {
    if (!text.trim()) return;

    const timeoutId = setTimeout(() => {
      // Only save if text has changed significantly
      const currentWords = text.trim().split(/\s+/).length;
      const lastSavedWords = lastSavedText.trim()
        ? lastSavedText.trim().split(/\s+/).length
        : 0;

      // Save if:
      // 1. No previous save, or
      // 2. Word count increased by 3 or more, or
      // 3. Text is significantly different (more than 20 characters difference), or
      // 4. Text length decreased significantly (user deleted content)
      const shouldSave =
        !lastSavedText ||
        currentWords >= lastSavedWords + 3 ||
        Math.abs(text.length - lastSavedText.length) > 20 ||
        text.length < lastSavedText.length * 0.8; // 20% reduction in length

      if (shouldSave) {
        saveToHistory(text);
        setLastSavedText(text);
      }
    }, 3000); // Increased to 3 seconds for better debouncing

    return () => clearTimeout(timeoutId);
  }, [text, lastSavedText]);

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

  // Function to convert English text to Arabic with proper multi-character support
  const convertEnglishToArabic = useCallback((inputText: string): string => {
    let result = "";
    let i = 0;

    while (i < inputText.length) {
      let converted = false;

      // Check for 2-character combinations first
      if (i < inputText.length - 1) {
        const twoChar = inputText.slice(i, i + 2).toLowerCase();
        if (englishToArabicMap[twoChar]) {
          result += englishToArabicMap[twoChar];
          i += 2;
          converted = true;
        }
      }

      // If no 2-character match, check single character
      if (!converted) {
        const oneChar = inputText[i];
        if (englishToArabicMap[oneChar]) {
          result += englishToArabicMap[oneChar];
        } else {
          result += oneChar;
        }
        i += 1;
      }
    }

    return result;
  }, []);

  const handleTextChange = useCallback(
    (newText: string) => {
      if (isAutoConvertEnabled) {
        // Convert English letters to Arabic in real-time using proper multi-character conversion
        const convertedText = convertEnglishToArabic(newText);
        setText(convertedText);
      } else {
        setText(newText);
      }

      if (textareaRef.current) {
        setCursorPosition(textareaRef.current.selectionStart);
      }
    },
    [isAutoConvertEnabled, convertEnglishToArabic]
  );

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

  const convertToArabic = useCallback(() => {
    if (text.trim()) {
      const convertedText = convertEnglishToArabic(text);
      setText(convertedText);

      // Focus the textarea after conversion
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(
            convertedText.length,
            convertedText.length
          );
        }
      }, 0);
    }
  }, [text, convertEnglishToArabic]);

  const toggleAutoConvert = useCallback(() => {
    setIsAutoConvertEnabled((prev) => !prev);
  }, []);

  const manualSave = useCallback(() => {
    if (text.trim()) {
      saveToHistory(text);
      setLastSavedText(text);
    }
  }, [text]);

  const setTextDirectly = useCallback((newText: string) => {
    setText(newText);
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(newText.length, newText.length);
    }
  }, []);

  return {
    text,
    setText: handleTextChange,
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
    cursorPosition,
  };
};

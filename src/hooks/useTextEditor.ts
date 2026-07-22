import { useState, useRef, useCallback, useEffect } from "react";
import { saveToHistory } from "../lib/localStorage";

// Common Arabizi & Franco-Arabic words for instant word-level replacement
const commonWordMap: { [key: string]: string } = {
  "ahlan": "أهلاً",
  "ahlan wa sahlan": "أهلاً وسهلاً",
  "shukran": "شكراً",
  "chokran": "شكراً",
  "choukran": "شكراً",
  "shukran jazilan": "شكراً جزيلاً",
  "salam": "سلام",
  "salem": "سلام",
  "assalam": "السلام",
  "assalamu alaikum": "السلام عليكم",
  "marhaba": "مرحبا",
  "marhaban": "مرحباً",
  "sabah": "صباح",
  "sabah al khair": "صباح الخير",
  "sabah al khayr": "صباح الخير",
  "masaa": "مساء",
  "masaa al khair": "مساء الخير",
  "khair": "خير",
  "khayr": "خير",
  "kheir": "خير",
  "habibi": "حبيبي",
  "7abibi": "حبيبي",
  "7abibati": "حبيبتي",
  "kaifa": "كيف",
  "kayf": "كيف",
  "kifa": "كيف",
  "kaifa halak": "كيف حالك",
  "kayf halak": "كيف حالك",
  "bikhair": "بخير",
  "bikhayr": "بخير",
  "na3am": "نعم",
  "naam": "نعم",
  "laa": "لا",
  "la": "لا",
  "inshallah": "إن شاء الله",
  "inshaallah": "إن شاء الله",
  "mashallah": "ما شاء الله",
  "alhamdulillah": "الحمد لله",
  "elhamdulillah": "الحمد لله",
  "mabrouk": "مبروك",
  "mabruk": "مبروك",
  "afwan": "عفواً",
  "min fadlak": "من فضلك",
  "min fadlik": "من فضلك",
  "yallah": "يلا",
  "yalla": "يلا",
  "wallah": "والله",
  "walah": "والله",
  "tbarkallah": "تبارك الله",
};

// Multi-character phonetic combinations (checked first)
const multiCharMap: { [key: string]: string } = {
  "th": "ث",
  "kh": "خ",
  "sh": "ش",
  "gh": "غ",
  "ch": "ش",
  "dh": "ذ",
  "zh": "ژ",
  "ph": "ف",
  "ou": "و",
  "oo": "و",
  "ee": "ي",
  "aa": "آ",
  "la": "لا",
  "al": "ال",
  "el": "ال",
  "3'": "غ",
  "9'": "ض",
};

// Single letter & number sound-based mapping
const singleCharMap: { [key: string]: string } = {
  // Arabizi Numbers
  "1": "١",
  "2": "ء",
  "3": "ع",
  "4": "٤",
  "5": "خ",
  "6": "ط",
  "7": "ح",
  "8": "ق",
  "9": "ص",
  "0": "٠",

  // Letters (lowercase)
  a: "ا",
  b: "ب",
  c: "ك",
  d: "د",
  e: "ي",
  f: "ف",
  g: "غ",
  h: "ه",
  i: "ي",
  j: "ج",
  k: "ك",
  l: "ل",
  m: "م",
  n: "ن",
  o: "و",
  p: "ب",
  q: "ق",
  r: "ر",
  s: "س",
  t: "ت",
  u: "و",
  v: "ف",
  w: "و",
  x: "كس",
  y: "ي",
  z: "ز",

  // Uppercase
  A: "أ",
  B: "ب",
  C: "ك",
  D: "ض",
  E: "إ",
  F: "ف",
  G: "غ",
  H: "ح",
  I: "إ",
  J: "ج",
  K: "ك",
  L: "ل",
  M: "م",
  N: "ن",
  O: "و",
  P: "ب",
  Q: "ق",
  R: "ر",
  S: "ص",
  T: "ط",
  U: "و",
  V: "ف",
  W: "و",
  X: "كس",
  Y: "ي",
  Z: "ظ",
};

export interface UseTextEditorReturn {
  text: string;
  setText: (text: string) => void;
  setTextDirectly: (text: string) => void;
  manualSave: () => void;
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
  // Auto-convert enabled by default so typing latin letters writes arabic words
  const [isAutoConvertEnabled, setIsAutoConvertEnabled] = useState(true);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [lastSavedText, setLastSavedText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save history after typing pauses
  useEffect(() => {
    if (!text.trim()) return;

    const timeoutId = setTimeout(() => {
      const currentWords = text.trim().split(/\s+/).length;
      const lastSavedWords = lastSavedText.trim()
        ? lastSavedText.trim().split(/\s+/).length
        : 0;

      const shouldSave =
        !lastSavedText ||
        currentWords >= lastSavedWords + 3 ||
        Math.abs(text.length - lastSavedText.length) > 20 ||
        text.length < lastSavedText.length * 0.8;

      if (shouldSave) {
        saveToHistory(text);
        setLastSavedText(text);
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [text, lastSavedText]);

  // Converter function: converts Latin word/character inputs into Arabic
  const convertEnglishToArabic = useCallback((inputText: string): string => {
    if (!inputText) return "";

    // Split input by space/punctuation preserving separators
    const tokens = inputText.split(/(\s+)/);

    return tokens
      .map((token) => {
        // If token is whitespace, return as is
        if (/^\s+$/.test(token)) return token;

        // Check if full word matches common dictionary
        const lowerToken = token.toLowerCase();
        if (commonWordMap[lowerToken]) {
          return commonWordMap[lowerToken];
        }

        // Transliterate character by character
        let result = "";
        let i = 0;

        while (i < token.length) {
          let matched = false;

          // Check 2-character combinations first
          if (i < token.length - 1) {
            const twoChar = token.slice(i, i + 2).toLowerCase();
            if (multiCharMap[twoChar]) {
              result += multiCharMap[twoChar];
              i += 2;
              matched = true;
            }
          }

          // Single character conversion
          if (!matched) {
            const char = token[i];
            if (singleCharMap[char]) {
              result += singleCharMap[char];
            } else {
              result += char;
            }
            i += 1;
          }
        }

        return result;
      })
      .join("");
  }, []);

  const insertText = useCallback(
    (newText: string) => {
      if (!textareaRef.current) return;

      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newValue = text.slice(0, start) + newText + text.slice(end);
      setText(newValue);

      const newCursorPosition = start + newText.length;
      setCursorPosition(newCursorPosition);

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
      const newValue = text.slice(0, start) + text.slice(end);
      setText(newValue);
      setCursorPosition(start);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start);
      }, 0);
    } else if (start > 0) {
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
      if (textareaRef.current) {
        textareaRef.current.select();
        document.execCommand("copy");
      }
      return Promise.resolve();
    }
  }, [text]);

  const handleTextChange = useCallback(
    (newText: string) => {
      if (isAutoConvertEnabled) {
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

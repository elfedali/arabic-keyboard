export interface HistoryEntry {
  id: string;
  text: string;
  timestamp: number;
  preview: string;
}

const HISTORY_KEY = "arabic-keyboard-history";
const MAX_HISTORY_ENTRIES = 50;

export const saveToHistory = (text: string): void => {
  if (!text.trim()) return;

  const history = getHistory();
  const trimmedText = text.trim();

  // Check if we should skip saving due to similarity with recent entries
  const shouldSkip = history.slice(0, 3).some((entry) => {
    // Skip if exact match
    if (entry.text === trimmedText) return true;

    // Skip if very similar (less than 10% difference in length and 80% similar content)
    const lengthDiff = Math.abs(entry.text.length - trimmedText.length);
    const maxLength = Math.max(entry.text.length, trimmedText.length);

    if (lengthDiff / maxLength < 0.1) {
      // Check content similarity for short texts
      if (maxLength < 100) {
        const similarity = calculateSimilarity(entry.text, trimmedText);
        return similarity > 0.8; // 80% similar
      }
    }

    return false;
  });

  if (shouldSkip) return;

  const newEntry: HistoryEntry = {
    id: crypto.randomUUID(),
    text: trimmedText,
    timestamp: Date.now(),
    preview:
      trimmedText.substring(0, 50) + (trimmedText.length > 50 ? "..." : ""),
  };

  // Remove exact duplicates and very similar recent entries
  const filteredHistory = history.filter((entry) => entry.text !== trimmedText);

  // Add new entry at the beginning
  const newHistory = [newEntry, ...filteredHistory].slice(
    0,
    MAX_HISTORY_ENTRIES
  );

  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
};

// Simple similarity calculation
const calculateSimilarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

// Levenshtein distance calculation
const getEditDistance = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + substitutionCost // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
};

export const getHistory = (): HistoryEntry[] => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading history:", error);
    return [];
  }
};

export const deleteHistoryEntry = (id: string): void => {
  const history = getHistory();
  const filteredHistory = history.filter((entry) => entry.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filteredHistory));
};

export const clearAllHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
};

export const loadHistoryEntry = (id: string): string | null => {
  const history = getHistory();
  const entry = history.find((entry) => entry.id === id);
  return entry ? entry.text : null;
};

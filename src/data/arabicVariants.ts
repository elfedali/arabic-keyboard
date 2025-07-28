// Arabic letter variants for long press
export const arabicVariants: { [key: string]: string[] } = {
  // Alif variants
  ا: ["ا", "آ", "أ", "إ", "ء"],

  // Ba variants
  ب: ["ب", "پ"], // Persian Pe

  // Ta variants
  ت: ["ت", "ة", "ث"], // Ta, Ta Marbuta, Tha

  // Jim variants
  ج: ["ج", "چ"], // Persian Che

  // Ha variants
  ح: ["ح", "خ"], // Ha, Kha
  ه: ["ه", "ة"], // Ha, Ta Marbuta

  // Dal variants
  د: ["د", "ذ"], // Dal, Dhal

  // Ra variants
  ر: ["ر", "ژ"], // Persian Zhe

  // Sin variants
  س: ["س", "ش"], // Sin, Shin
  ص: ["ص", "ض"], // Sad, Dad

  // Ta variants (emphatic)
  ط: ["ط", "ظ"], // Ta, Dha

  // Ain variants
  ع: ["ع", "غ"], // Ain, Ghayn

  // Fa variants
  ف: ["ف", "ڤ"], // Fa, Arabic V

  // Qaf variants
  ق: ["ق", "ڨ"], // Qaf, Maghrebi Qaf

  // Kaf variants
  ك: ["ك", "گ"], // Persian Gaf

  // Lam variants
  ل: ["ل", "لا"], // Lam, Lam-Alif

  // Nun variants
  ن: ["ن", "ں"], // Urdu Noon Ghunna

  // Waw variants
  و: ["و", "ؤ", "ۆ"], // Waw, Waw with Hamza, Kurdish Waw

  // Ya variants
  ي: ["ي", "ی", "ئ", "ى"], // Ya, Persian Ya, Ya with Hamza, Alif Maksura

  // Hamza variants
  ء: ["ء", "أ", "إ", "آ", "ؤ", "ئ"],

  // Numbers with variants
  "١": ["١", "1"],
  "٢": ["٢", "2"],
  "٣": ["٣", "3"],
  "٤": ["٤", "4"],
  "٥": ["٥", "5"],
  "٦": ["٦", "6"],
  "٧": ["٧", "7"],
  "٨": ["٨", "8"],
  "٩": ["٩", "9"],
  "٠": ["٠", "0"],

  // Diacritics (can be added to any letter)
  "َ": ["َ", "ً", "ّ"], // Fatha, Tanween Fath, Shadda
  "ِ": ["ِ", "ٍ"], // Kasra, Tanween Kasr
  "ُ": ["ُ", "ٌ"], // Damma, Tanween Damm
  "ْ": ["ْ", "ّ"], // Sukun, Shadda
};

import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Settings, Moon, Sun, Keyboard, ToggleLeft, ToggleRight } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  keyboardLayout: 'QWERTY' | 'AZERTY';
  onLayoutChange: (layout: 'QWERTY' | 'AZERTY') => void;
  isAutoConvertEnabled: boolean;
  onToggleAutoConvert: () => void;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  keyboardLayout,
  onLayoutChange,
  isAutoConvertEnabled,
  onToggleAutoConvert,
}: SettingsModalProps) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-[#231b17] border-gray-200 dark:border-[#3d2e26] text-gray-900 dark:text-[#f6efe8] rounded-2xl shadow-xl p-6">
        <DialogHeader className="text-right border-b border-gray-100 dark:border-[#352720] pb-4">
          <DialogTitle className="flex items-center justify-end gap-2 text-xl font-bold text-gray-900 dark:text-[#f6efe8]">
            <span>الإعدادات العامة</span>
            <Settings className="w-5 h-5 text-amber-600 dark:text-amber-500" />
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-amber-200/60 text-right mt-1">
            خصص خيارات ومظهر لوحة المفاتيح العربية وفقاً لتفضيلاتك
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4" dir="rtl">
          {/* 1. Keyboard Layout Setting */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-800 dark:text-[#f6efe8] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-blue-600 dark:text-amber-400" />
                تخطيط لوحة المفاتيح
              </span>
              <span className="text-xs font-normal text-gray-500 dark:text-amber-200/50">QWERTY / AZERTY</span>
            </label>

            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-[#18120f] rounded-xl border border-gray-200/80 dark:border-[#352720]">
              <Button
                variant={keyboardLayout === 'QWERTY' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onLayoutChange('QWERTY')}
                className={`rounded-lg py-2 text-sm font-bold transition-all ${
                  keyboardLayout === 'QWERTY'
                    ? 'bg-white dark:bg-[#32251f] text-blue-600 dark:text-amber-400 shadow-sm'
                    : 'text-gray-600 dark:text-amber-100/70 hover:bg-white/50 dark:hover:bg-[#2b1f1a]'
                }`}
              >
                QWERTY (قياسي)
              </Button>

              <Button
                variant={keyboardLayout === 'AZERTY' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onLayoutChange('AZERTY')}
                className={`rounded-lg py-2 text-sm font-bold transition-all ${
                  keyboardLayout === 'AZERTY'
                    ? 'bg-white dark:bg-[#32251f] text-blue-600 dark:text-amber-400 shadow-sm'
                    : 'text-gray-600 dark:text-amber-100/70 hover:bg-white/50 dark:hover:bg-[#2b1f1a]'
                }`}
              >
                AZERTY (فرنسي)
              </Button>
            </div>
          </div>

          {/* 2. Auto Transliteration Setting */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1c1512] rounded-xl border border-gray-200/70 dark:border-[#352720]">
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-[#f6efe8]">التحويل التلقائي للحروف اللاتينية</h4>
              <p className="text-xs text-gray-500 dark:text-amber-200/50">تحويل كتابة الأرقام والحروف الصوتية تلقائياً للعربية</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleAutoConvert}
              className={`border-gray-200 dark:border-[#3d2e26] ${
                isAutoConvertEnabled
                  ? 'bg-blue-50 dark:bg-amber-950/60 text-blue-700 dark:text-amber-300 border-blue-300 dark:border-amber-700'
                  : 'text-gray-600 dark:text-amber-200/60'
              }`}
            >
              {isAutoConvertEnabled ? (
                <span className="flex items-center gap-1">
                  <ToggleRight className="w-4 h-4 text-blue-600 dark:text-amber-400" />
                  مفعّل
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <ToggleLeft className="w-4 h-4" />
                  معطّل
                </span>
              )}
            </Button>
          </div>

          {/* 3. Theme Setting */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1c1512] rounded-xl border border-gray-200/70 dark:border-[#352720]">
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-[#f6efe8]">مظهر التطبيق</h4>
              <p className="text-xs text-gray-500 dark:text-amber-200/50">التبديل بين الوضع الفاتح والوضع الداكن البني</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDarkMode}
              className="border-gray-200 dark:border-[#3d2e26] bg-white dark:bg-[#2a1f1a] text-gray-800 dark:text-amber-200 hover:bg-gray-100 dark:hover:bg-[#352720]"
            >
              {isDarkMode ? (
                <span className="flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-400" />
                  فاتح
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-indigo-600" />
                  داكن بني
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100 dark:border-[#352720] flex justify-end">
          <Button
            onClick={onClose}
            className="w-full sm:w-auto bg-blue-600 dark:bg-amber-600 hover:bg-blue-700 dark:hover:bg-amber-700 text-white font-bold px-6"
          >
            إغلاق الإعدادات
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { Home, Clock, Keyboard, Sparkles, Sun, Moon, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { useDarkMode } from "../hooks/useDarkMode";

interface NavbarProps {
  activeTab: 'home' | 'history';
  onTabChange: (tab: 'home' | 'history') => void;
  historyCount?: number;
  onOpenSettings?: () => void;
}

export const Navbar = ({ activeTab, onTabChange, historyCount = 0, onOpenSettings }: NavbarProps) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#1f1714]/95 backdrop-blur border-b border-gray-200 dark:border-[#382b24] shadow-sm mb-6 transition-colors duration-200" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & App Title (Far Right in RTL) */}
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
            onClick={() => onTabChange('home')}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-700 to-amber-900 dark:from-amber-600 dark:to-amber-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
              <Keyboard className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-right">
              <h1 className="text-sm sm:text-xl font-extrabold text-gray-900 dark:text-[#f6efe8] leading-tight flex items-center gap-1.5 sm:gap-2">
                لوحة المفاتيح العربية
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 hidden sm:inline-block" />
              </h1>
              <p className="text-[11px] sm:text-xs text-gray-500 dark:text-amber-200/50 hidden sm:block font-medium">كتابة عربية ذكية وسريعة</p>
            </div>
          </div>

          {/* Controls & Nav Links */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Navigation Links (Home & History) */}
            <nav className="flex items-center gap-1 sm:gap-2 bg-gray-100/80 dark:bg-[#281e19] p-1 rounded-xl border border-gray-200/60 dark:border-[#3b2d26]">
              <Button
                variant={activeTab === 'home' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onTabChange('home')}
                className={`rounded-lg px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'home' 
                    ? 'bg-white dark:bg-[#382b24] text-amber-700 dark:text-amber-400 shadow-sm hover:bg-white dark:hover:bg-[#382b24]' 
                    : 'text-gray-600 dark:text-amber-100/70 hover:text-gray-900 dark:hover:text-[#f6efe8] hover:bg-white/50 dark:hover:bg-[#352720]/50'
                }`}
              >
                <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1" />
                <span>الرئيسية</span>
              </Button>

              <Button
                variant={activeTab === 'history' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onTabChange('history')}
                className={`rounded-lg px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'history' 
                    ? 'bg-white dark:bg-[#382b24] text-purple-600 dark:text-purple-400 shadow-sm hover:bg-white dark:hover:bg-[#382b24]' 
                    : 'text-gray-600 dark:text-amber-100/70 hover:text-gray-900 dark:hover:text-[#f6efe8] hover:bg-white/50 dark:hover:bg-[#352720]/50'
                }`}
              >
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1" />
                <span>السجل</span>
                {historyCount > 0 && (
                  <span className="mr-1 px-1.5 py-0.5 text-[10px] sm:text-xs font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 rounded-full">
                    {historyCount}
                  </span>
                )}
              </Button>
            </nav>

            {/* Gear Icon for Global Settings */}
            <Button
              variant="outline"
              size="icon"
              onClick={onOpenSettings}
              title="الإعدادات العامة"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-gray-200 dark:border-[#3b2d26] bg-white dark:bg-[#281e19] text-gray-700 dark:text-amber-200 hover:bg-gray-100 dark:hover:bg-[#352720] transition-colors"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 hover:rotate-90 transition-transform duration-300" />
              <span className="sr-only">الإعدادات</span>
            </Button>

            {/* Dark Mode Toggle Switch */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              title={isDarkMode ? "الوضع الفاتح" : "الوضع الداكن البني"}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-gray-200 dark:border-[#3b2d26] bg-white dark:bg-[#281e19] text-gray-700 dark:text-amber-200 hover:bg-gray-100 dark:hover:bg-[#352720] transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 hover:-rotate-12 transition-transform" />
              )}
              <span className="sr-only">التبديل بين الفاتح والداكن</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

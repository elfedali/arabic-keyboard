import { Home, Clock, Keyboard, Sparkles, Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { useDarkMode } from "../hooks/useDarkMode";

interface NavbarProps {
  activeTab: 'home' | 'history';
  onTabChange: (tab: 'home' | 'history') => void;
  historyCount?: number;
}

export const Navbar = ({ activeTab, onTabChange, historyCount = 0 }: NavbarProps) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-gray-200 dark:border-slate-800 shadow-sm mb-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & App Title */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onTabChange('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100 leading-tight flex items-center gap-2">
                لوحة المفاتيح العربية
                <Sparkles className="w-4 h-4 text-amber-500 hidden sm:inline-block" />
              </h1>
              <p className="text-xs text-gray-500 dark:text-slate-400 hidden sm:block">Arabic Virtual Keyboard</p>
            </div>
          </div>

          {/* Right Navigation & Dark Mode Controls */}
          <div className="flex items-center gap-2">
            {/* Navigation Links (Home & History) */}
            <nav className="flex items-center gap-1 sm:gap-2 bg-gray-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-gray-200/60 dark:border-slate-700/60">
              <Button
                variant={activeTab === 'home' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onTabChange('home')}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                  activeTab === 'home' 
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm hover:bg-white dark:hover:bg-slate-700' 
                    : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Home className="w-4 h-4 mr-1.5" />
                <span>الرئيسية</span>
                <span className="text-xs opacity-60 ml-1 font-normal hidden sm:inline">(Home)</span>
              </Button>

              <Button
                variant={activeTab === 'history' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onTabChange('history')}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                  activeTab === 'history' 
                    ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm hover:bg-white dark:hover:bg-slate-700' 
                    : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Clock className="w-4 h-4 mr-1.5" />
                <span>السجل</span>
                <span className="text-xs opacity-60 ml-1 font-normal hidden sm:inline">(History)</span>
                {historyCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-xs font-semibold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-full">
                    {historyCount}
                  </span>
                )}
              </Button>
            </nav>

            {/* Dark Mode Toggle Switch */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              title={isDarkMode ? "الوضع الفاتح (Light Mode)" : "الوضع الداكن (Dark Mode)"}
              className="w-10 h-10 rounded-xl border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600 hover:-rotate-12 transition-transform" />
              )}
              <span className="sr-only">Toggle Theme</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

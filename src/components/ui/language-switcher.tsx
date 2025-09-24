import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, languages, Language } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'modal';
  size?: 'sm' | 'md' | 'lg';
  showFlag?: boolean;
  showNativeName?: boolean;
  className?: string;
}

export function LanguageSwitcher({ 
  variant = 'dropdown',
  size = 'md',
  showFlag = true,
  showNativeName = true,
  className = ''
}: LanguageSwitcherProps) {
  const { currentLanguage, setLanguage, t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
    setIsModalOpen(false);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm px-2 py-1';
      case 'lg':
        return 'text-lg px-4 py-3';
      default:
        return 'text-base px-3 py-2';
    }
  };

  if (variant === 'modal') {
    return (
      <>
        <Button
          variant="outline"
          onClick={() => setIsModalOpen(true)}
          className={`${getSizeClasses()} ${className} border-white/20 text-gray-400 hover:text-white hover:border-primary/50`}
        >
          <Globe className="w-4 h-4 mr-2" />
          {showFlag && <span className="mr-2">{currentLanguage.flag}</span>}
          {showNativeName ? currentLanguage.nativeName : currentLanguage.name}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>

        <AnimatePresence>
          {isModalOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />
              
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
              >
                <Card className="bg-surface border-white/20 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-heading text-white font-semibold">
                      {t('nav.language')}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      ×
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`flex items-center justify-between p-3 rounded-lg transition-all text-left ${
                          currentLanguage.code === language.code
                            ? 'bg-primary/10 border border-primary/30 text-primary'
                            : 'hover:bg-white/5 text-gray-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{language.flag}</span>
                          <div>
                            <div className="font-medium">{language.nativeName}</div>
                            <div className="text-sm opacity-70">{language.name}</div>
                          </div>
                        </div>
                        {currentLanguage.code === language.code && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Dropdown variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`${getSizeClasses()} ${className} border-white/20 text-gray-400 hover:text-white hover:border-primary/50`}
        >
          <Globe className="w-4 h-4 mr-2" />
          {showFlag && <span className="mr-2">{currentLanguage.flag}</span>}
          {showNativeName ? currentLanguage.nativeName : currentLanguage.name}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-64 bg-surface border-white/20 max-h-80 overflow-y-auto"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center justify-between p-3 cursor-pointer ${
              currentLanguage.code === language.code
                ? 'bg-primary/10 text-primary'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{language.flag}</span>
              <div>
                <div className="font-medium">{language.nativeName}</div>
                <div className="text-xs opacity-70">{language.name}</div>
              </div>
            </div>
            {currentLanguage.code === language.code && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Compact version for mobile or space-constrained areas
export function LanguageSwitcherCompact({ className = '' }: { className?: string }) {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`${className} text-gray-400 hover:text-white p-2`}
        >
          <Globe className="w-4 h-4 mr-1" />
          <span className="text-lg">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-surface border-white/20 max-h-64 overflow-y-auto"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setLanguage(language.code)}
            className={`flex items-center gap-2 p-2 cursor-pointer ${
              currentLanguage.code === language.code
                ? 'bg-primary/10 text-primary'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{language.flag}</span>
            <span className="text-sm">{language.nativeName}</span>
            {currentLanguage.code === language.code && (
              <Check className="w-3 h-3 text-primary ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
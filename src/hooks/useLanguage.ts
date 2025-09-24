import { useState, useEffect, createContext, useContext } from 'react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳' },
];

export interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (languageCode: string) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation keys and their values
const translations: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.courses': 'Courses',
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin',
    'nav.signIn': 'Sign In',
    'nav.signOut': 'Sign Out',
    'nav.language': 'Language',
    
    // Homepage
    'home.hero.title': 'Empower Your Future',
    'home.hero.subtitle': 'Master new skills with our cutting-edge learning platform. Access expert-led courses, track your progress, and earn certificates in emerging technologies.',
    'home.hero.getStarted': 'Get Started',
    'home.hero.exploreCourses': 'Explore Courses',
    'home.hero.goToDashboard': 'Go to Dashboard',
    'home.hero.browseCourses': 'Browse Courses',
    
    // Features
    'home.features.title': 'Why Choose Our Platform?',
    'home.features.subtitle': 'Experience the future of learning with our innovative approach to skill development.',
    'home.features.expertCourses': 'Expert-Led Courses',
    'home.features.expertCoursesDesc': 'Learn from industry professionals with real-world experience',
    'home.features.progressTracking': 'Progress Tracking',
    'home.features.progressTrackingDesc': 'Monitor your learning journey with detailed analytics',
    'home.features.certificates': 'Certificates',
    'home.features.certificatesDesc': 'Earn recognized certificates to showcase your achievements',
    'home.features.community': 'Community',
    'home.features.communityDesc': 'Connect with learners and experts in your field',
    
    // Stats
    'home.stats.learners': 'Active Learners',
    'home.stats.courses': 'Expert Courses',
    'home.stats.completion': 'Completion Rate',
    
    // CTA
    'home.cta.title': 'Ready to Transform Your Career?',
    'home.cta.subtitle': 'Join thousands of learners who have already started their journey to success',
    'home.cta.startLearning': 'Start Learning Today',
    'home.cta.continueLearning': 'Continue Learning',
    
    // Footer
    'footer.quickLinks': 'Quick Links',
    'footer.learning': 'Learning',
    'footer.certificates': 'Certificates',
    'footer.progressTracking': 'Progress Tracking',
    'footer.expertInstructors': 'Expert Instructors',
    'footer.communitySupport': 'Community Support',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.cookies': 'Cookie Policy',
    'footer.accessibility': 'Accessibility',
    'footer.copyright': '© 2024 LearnHub. All rights reserved. Built with modern web technologies for the future of learning.',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.all': 'All',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.courses': 'कोर्स',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.profile': 'प्रोफाइल',
    'nav.admin': 'एडमिन',
    'nav.signIn': 'साइन इन',
    'nav.signOut': 'साइन आउट',
    'nav.language': 'भाषा',
    
    // Homepage
    'home.hero.title': 'अपने भविष्य को सशक्त बनाएं',
    'home.hero.subtitle': 'हमारे अत्याधुनिक लर्निंग प्लेटफॉर्म के साथ नए कौशल सीखें। विशेषज्ञ-नेतृत्व वाले कोर्स तक पहुंचें, अपनी प्रगति को ट्रैक करें, और उभरती प्रौद्योगिकियों में प्रमाणपत्र अर्जित करें।',
    'home.hero.getStarted': 'शुरू करें',
    'home.hero.exploreCourses': 'कोर्स देखें',
    'home.hero.goToDashboard': 'डैशबोर्ड पर जाएं',
    'home.hero.browseCourses': 'कोर्स ब्राउज़ करें',
    
    // Features
    'home.features.title': 'हमारा प्लेटफॉर्म क्यों चुनें?',
    'home.features.subtitle': 'कौशल विकास के लिए हमारे नवाचार दृष्टिकोण के साथ सीखने के भविष्य का अनुभव करें।',
    'home.features.expertCourses': 'विशेषज्ञ-नेतृत्व कोर्स',
    'home.features.expertCoursesDesc': 'वास्तविक दुनिया के अनुभव वाले उद्योग पेशेवरों से सीखें',
    'home.features.progressTracking': 'प्रगति ट्रैकिंग',
    'home.features.progressTrackingDesc': 'विस्तृत एनालिटिक्स के साथ अपनी सीखने की यात्रा की निगरानी करें',
    'home.features.certificates': 'प्रमाणपत्र',
    'home.features.certificatesDesc': 'अपनी उपलब्धियों को प्रदर्शित करने के लिए मान्यता प्राप्त प्रमाणपत्र अर्जित करें',
    'home.features.community': 'समुदाय',
    'home.features.communityDesc': 'अपने क्षेत्र में शिक्षार्थियों और विशेषज्ञों से जुड़ें',
    
    // Stats
    'home.stats.learners': 'सक्रिय शिक्षार्थी',
    'home.stats.courses': 'विशेषज्ञ कोर्स',
    'home.stats.completion': 'पूर्णता दर',
    
    // CTA
    'home.cta.title': 'अपने करियर को बदलने के लिए तैयार हैं?',
    'home.cta.subtitle': 'हजारों शिक्षार्थियों में शामिल हों जिन्होंने पहले से ही सफलता की अपनी यात्रा शुरू कर दी है',
    'home.cta.startLearning': 'आज ही सीखना शुरू करें',
    'home.cta.continueLearning': 'सीखना जारी रखें',
    
    // Footer
    'footer.quickLinks': 'त्वरित लिंक',
    'footer.learning': 'सीखना',
    'footer.certificates': 'प्रमाणपत्र',
    'footer.progressTracking': 'प्रगति ट्रैकिंग',
    'footer.expertInstructors': 'विशेषज्ञ प्रशिक्षक',
    'footer.communitySupport': 'समुदायिक सहायता',
    'footer.legal': 'कानूनी',
    'footer.privacy': 'गोपनीयता नीति',
    'footer.terms': 'सेवा की शर्तें',
    'footer.cookies': 'कुकी नीति',
    'footer.accessibility': 'पहुंच',
    'footer.copyright': '© 2024 LearnHub। सभी अधिकार सुरक्षित। सीखने के भविष्य के लिए आधुनिक वेब तकनीकों के साथ निर्मित।',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.cancel': 'रद्द करें',
    'common.save': 'सेव करें',
    'common.edit': 'संपादित करें',
    'common.delete': 'हटाएं',
    'common.view': 'देखें',
    'common.back': 'वापस',
    'common.next': 'अगला',
    'common.previous': 'पिछला',
    'common.search': 'खोजें',
    'common.filter': 'फिल्टर',
    'common.all': 'सभी',
  },
  // Add more languages as needed - for now showing English and Hindi as examples
  // Other languages would follow the same pattern
};

export const useLanguageHook = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      const language = languages.find(lang => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
      }
    }
  }, []);

  const setLanguage = (languageCode: string) => {
    const language = languages.find(lang => lang.code === languageCode);
    if (language) {
      setCurrentLanguage(language);
      localStorage.setItem('selectedLanguage', languageCode);
    }
  };

  const t = (key: string): string => {
    const languageTranslations = translations[currentLanguage.code] || translations.en;
    return languageTranslations[key] || key;
  };

  return {
    currentLanguage,
    setLanguage,
    t,
  };
};
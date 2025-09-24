import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'ta' | 'te';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.courses': 'Courses',
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin',
    'nav.signIn': 'Sign In',
    'nav.signOut': 'Sign Out',
    
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
    'home.features.expertCoursesDesc': 'Dive into a curated catalog of courses designed and taught by industry veterans. Gain practical, real-world skills that are immediately applicable to your career.',
    'home.features.progressTracking': 'Progress Tracking',
    'home.features.progressTrackingDesc': 'Visualize your learning journey with an intuitive dashboard. Monitor course completion, quiz scores, and skill acquisition to stay motivated and on track.',
    'home.features.certificates': 'Verified Certificates',
    'home.features.certificatesDesc': 'Earn recognized certificates upon course completion. Showcase your achievements on your resume and professional networks to validate your new expertise.',
    'home.features.community': 'Global Community',
    'home.features.communityDesc': 'Connect with a vibrant community of learners and mentors. Collaborate on projects, ask questions, and grow your professional network in a supportive environment.',
    
    // Stats
    'home.stats.title': 'Join a Thriving Community',
    'home.stats.subtitle': 'Our platform empowers thousands of learners to achieve their goals. The numbers speak for themselves.',
    'home.stats.activeLearners': 'Active Learners',
    'home.stats.expertCourses': 'Expert Courses',
    'home.stats.completionRate': 'Completion Rate',
    
    // CTA
    'home.cta.title': 'Ready to Transform Your Career?',
    'home.cta.subtitle': 'Join thousands of learners who have already started their journey to success.',
    'home.cta.startLearning': 'Start Learning Today',
    'home.cta.continueLearning': 'Continue Learning',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
  },
  
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.courses': 'कोर्स',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.admin': 'एडमिन',
    'nav.signIn': 'साइन इन',
    'nav.signOut': 'साइन आउट',
    
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
    'home.features.expertCourses': 'विशेषज्ञ-नेतृत्व वाले कोर्स',
    'home.features.expertCoursesDesc': 'उद्योग के दिग्गजों द्वारा डिज़ाइन और पढ़ाए गए कोर्स के क्यूरेटेड कैटलॉग में गोता लगाएं। व्यावहारिक, वास्तविक-दुनिया के कौशल प्राप्त करें जो आपके करियर में तुरंत लागू होते हैं।',
    'home.features.progressTracking': 'प्रगति ट्रैकिंग',
    'home.features.progressTrackingDesc': 'एक सहज डैशबोर्ड के साथ अपनी सीखने की यात्रा को विज़ुअलाइज़ करें। प्रेरित और ट्रैक पर रहने के लिए कोर्स पूर्णता, क्विज़ स्कोर, और कौशल अधिग्रहण की निगरानी करें।',
    'home.features.certificates': 'सत्यापित प्रमाणपत्र',
    'home.features.certificatesDesc': 'कोर्स पूर्णता पर मान्यता प्राप्त प्रमाणपत्र अर्जित करें। अपनी नई विशेषज्ञता को मान्य करने के लिए अपने रिज्यूमे और पेशेवर नेटवर्क पर अपनी उपलब्धियों को प्रदर्शित करें।',
    'home.features.community': 'वैश्विक समुदाय',
    'home.features.communityDesc': 'शिक्षार्थियों और सलाहकारों के एक जीवंत समुदाय से जुड़ें। परियोजनाओं पर सहयोग करें, प्रश्न पूछें, और एक सहायक वातावरण में अपने पेशेवर नेटवर्क को बढ़ाएं।',
    
    // Stats
    'home.stats.title': 'एक संपन्न समुदाय में शामिल हों',
    'home.stats.subtitle': 'हमारा प्लेटफॉर्म हजारों शिक्षार्थियों को अपने लक्ष्यों को प्राप्त करने के लिए सशक्त बनाता है। संख्याएं खुद बोलती हैं।',
    'home.stats.activeLearners': 'सक्रिय शिक्षार्थी',
    'home.stats.expertCourses': 'विशेषज्ञ कोर्स',
    'home.stats.completionRate': 'पूर्णता दर',
    
    // CTA
    'home.cta.title': 'अपने करियर को बदलने के लिए तैयार हैं?',
    'home.cta.subtitle': 'हजारों शिक्षार्थियों में शामिल हों जिन्होंने पहले से ही सफलता की अपनी यात्रा शुरू कर दी है।',
    'home.cta.startLearning': 'आज ही सीखना शुरू करें',
    'home.cta.continueLearning': 'सीखना जारी रखें',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
  },
  
  ta: {
    // Navigation
    'nav.home': 'முகப்பு',
    'nav.courses': 'பாடங்கள்',
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.profile': 'சுயவிவரம்',
    'nav.admin': 'நிர்வாகம்',
    'nav.signIn': 'உள்நுழைய',
    'nav.signOut': 'வெளியேறு',
    
    // Homepage
    'home.hero.title': 'உங்கள் எதிர்காலத்தை வலுப்படுத்துங்கள்',
    'home.hero.subtitle': 'எங்கள் அதிநவீன கற்றல் தளத்துடன் புதிய திறன்களை மாஸ்டர் செய்யுங்கள். நிபுணர் தலைமையிலான பாடங்களை அணுகி, உங்கள் முன்னேற்றத்தை கண்காணித்து, வளர்ந்து வரும் தொழில்நுட்பங்களில் சான்றிதழ்களை பெறுங்கள்.',
    'home.hero.getStarted': 'தொடங்குங்கள்',
    'home.hero.exploreCourses': 'பாடங்களை ஆராயுங்கள்',
    'home.hero.goToDashboard': 'டாஷ்போர்டுக்கு செல்லுங்கள்',
    'home.hero.browseCourses': 'பாடங்களை உலாவுங்கள்',
    
    // Features
    'home.features.title': 'எங்கள் தளத்தை ஏன் தேர்வு செய்ய வேண்டும்?',
    'home.features.subtitle': 'திறன் மேம்பாட்டிற்கான எங்கள் புதுமையான அணுகுமுறையுடன் கற்றலின் எதிர்காலத்தை அனுபவியுங்கள்.',
    'home.features.expertCourses': 'நிபுணர் தலைமையிலான பாடங்கள்',
    'home.features.expertCoursesDesc': 'தொழில்துறை வீரர்களால் வடிவமைக்கப்பட்ட மற்றும் கற்பிக்கப்படும் பாடங்களின் தேர்ந்தெடுக்கப்பட்ட பட்டியலில் மூழ்குங்கள். உங்கள் தொழில் வாழ்க்கையில் உடனடியாக பயன்படுத்தக்கூடிய நடைமுறை, உண்மையான உலக திறன்களை பெறுங்கள்.',
    'home.features.progressTracking': 'முன்னேற்ற கண்காணிப்பு',
    'home.features.progressTrackingDesc': 'ஒரு உள்ளுணர்வு டாஷ்போர்டுடன் உங்கள் கற்றல் பயணத்தை காட்சிப்படுத்துங்கள். உந்துதல் மற்றும் பாதையில் இருக்க பாட நிறைவு, வினாடி வினா மதிப்பெண்கள் மற்றும் திறன் கையகப்படுத்தலை கண்காணியுங்கள்.',
    'home.features.certificates': 'சரிபார்க்கப்பட்ட சான்றிதழ்கள்',
    'home.features.certificatesDesc': 'பாட நிறைவின் போது அங்கீகரிக்கப்பட்ட சான்றிதழ்களை பெறுங்கள். உங்கள் புதிய நிபுணத்துவத்தை சரிபார்க்க உங்கள் ரெஸ்யூம் மற்றும் தொழில்முறை நெட்வொர்க்குகளில் உங்கள் சாதனைகளை காட்சிப்படுத்துங்கள்.',
    'home.features.community': 'உலகளாவிய சமூகம்',
    'home.features.communityDesc': 'கற்றவர்கள் மற்றும் வழிகாட்டிகளின் துடிப்பான சமூகத்துடன் இணைக்கவும். திட்டங்களில் ஒத்துழைக்கவும், கேள்விகள் கேட்கவும், மற்றும் ஆதரவான சூழலில் உங்கள் தொழில்முறை நெட்வொர்க்கை வளர்க்கவும்.',
    
    // Stats
    'home.stats.title': 'வளர்ந்து வரும் சமூகத்தில் சேருங்கள்',
    'home.stats.subtitle': 'எங்கள் தளம் ஆயிரக்கணக்கான கற்றவர்களை அவர்களின் இலக்குகளை அடைய அதிகாரம் அளிக்கிறது. எண்கள் தாங்களாகவே பேசுகின்றன.',
    'home.stats.activeLearners': 'செயலில் உள்ள கற்றவர்கள்',
    'home.stats.expertCourses': 'நிபுணர் பாடங்கள்',
    'home.stats.completionRate': 'நிறைவு விகிதம்',
    
    // CTA
    'home.cta.title': 'உங்கள் தொழில் வாழ்க்கையை மாற்ற தயாரா?',
    'home.cta.subtitle': 'வெற்றியின் பயணத்தை ஏற்கனவே தொடங்கிய ஆயிரக்கணக்கான கற்றவர்களுடன் சேருங்கள்.',
    'home.cta.startLearning': 'இன்றே கற்றலைத் தொடங்குங்கள்',
    'home.cta.continueLearning': 'கற்றலைத் தொடருங்கள்',
    
    // Common
    'common.loading': 'ஏற்றுகிறது...',
    'common.error': 'பிழை',
    'common.success': 'வெற்றி',
  },
  
  te: {
    // Navigation
    'nav.home': 'హోమ్',
    'nav.courses': 'కోర్సులు',
    'nav.dashboard': 'డాష్‌బోర్డ్',
    'nav.profile': 'ప్రొఫైల్',
    'nav.admin': 'అడ్మిన్',
    'nav.signIn': 'సైన్ ఇన్',
    'nav.signOut': 'సైన్ అవుట్',
    
    // Homepage
    'home.hero.title': 'మీ భవిష్యత్తును శక్తివంతం చేయండి',
    'home.hero.subtitle': 'మా అత్యాధునిక లెర్నింగ్ ప్లాట్‌ఫారమ్‌తో కొత్త నైపుణ్యాలను మాస్టర్ చేయండి. నిపుణుల నేతృత్వంలోని కోర్సులను యాక్సెస్ చేయండి, మీ పురోగతిని ట్రాక్ చేయండి మరియు అభివృద్ధి చెందుతున్న సాంకేతికతలలో సర్టిఫికేట్లను సంపాదించండి.',
    'home.hero.getStarted': 'ప్రారంభించండి',
    'home.hero.exploreCourses': 'కోర్సులను అన్వేషించండి',
    'home.hero.goToDashboard': 'డాష్‌బోర్డ్‌కు వెళ్లండి',
    'home.hero.browseCourses': 'కోర్సులను బ్రౌజ్ చేయండి',
    
    // Features
    'home.features.title': 'మా ప్లాట్‌ఫారమ్‌ను ఎందుకు ఎంచుకోవాలి?',
    'home.features.subtitle': 'నైపుణ్య అభివృద్ధికి మా వినూత్న విధానంతో అభ్యసనం యొక్క భవిష్యత్తును అనుభవించండి.',
    'home.features.expertCourses': 'నిపుణుల నేతృత్వంలోని కోర్సులు',
    'home.features.expertCoursesDesc': 'పరిశ్రమ అనుభవజ్ఞులచే రూపొందించబడిన మరియు బోధించబడే కోర్సుల క్యూరేటెడ్ కేటలాగ్‌లో మునిగిపోండి. మీ కెరీర్‌కు వెంటనే వర్తించే ప్రాక్టికల్, రియల్-వరల్డ్ స్కిల్స్‌ను పొందండి.',
    'home.features.progressTracking': 'పురోగతి ట్రాకింగ్',
    'home.features.progressTrackingDesc': 'అంతర్దృష్టిగల డాష్‌బోర్డ్‌తో మీ అభ్యసన ప్రయాణాన్ని విజువలైజ్ చేయండి. ప్రేరణ మరియు ట్రాక్‌లో ఉండటానికి కోర్స్ పూర్తి, క్విజ్ స్కోర్లు మరియు నైపుణ్య సముపార్జనను పర్యవేక్షించండి.',
    'home.features.certificates': 'ధృవీకరించబడిన సర్టిఫికేట్లు',
    'home.features.certificatesDesc': 'కోర్స్ పూర్తయిన తర్వాత గుర్తింపు పొందిన సర్టిఫికేట్లను సంపాదించండి. మీ కొత్త నైపుణ్యాన్ని ధృవీకరించడానికి మీ రెజ్యూమే మరియు వృత్తిపరమైన నెట్‌వర్క్‌లలో మీ విజయాలను ప్రదర్శించండి.',
    'home.features.community': 'ప్రపంచ సమాజం',
    'home.features.communityDesc': 'అభ్యాసకులు మరియు మార్గదర్శకుల చైతన్యవంతమైన సమాజంతో కనెక్ట్ అవ్వండి. ప్రాజెక్ట్‌లలో సహకరించండి, ప్రశ్నలు అడగండి మరియు సహాయక వాతావరణంలో మీ వృత్తిపరమైన నెట్‌వర్క్‌ను పెంచుకోండి.',
    
    // Stats
    'home.stats.title': 'అభివృద్ధి చెందుతున్న సమాజంలో చేరండి',
    'home.stats.subtitle': 'మా ప్లాట్‌ఫారమ్ వేలాది మంది అభ్యాసకులను వారి లక్ష్యాలను సాధించడానికి శక్తివంతం చేస్తుంది. సంఖ్యలు తమకు తాము మాట్లాడుకుంటాయి.',
    'home.stats.activeLearners': 'క్రియాశీల అభ్యాసకులు',
    'home.stats.expertCourses': 'నిపుణుల కోర్సులు',
    'home.stats.completionRate': 'పూర్తి రేటు',
    
    // CTA
    'home.cta.title': 'మీ కెరీర్‌ను మార్చడానికి సిద్ధంగా ఉన్నారా?',
    'home.cta.subtitle': 'విజయం యొక్క ప్రయాణాన్ని ఇప్పటికే ప్రారంభించిన వేలాది మంది అభ్యాసకులతో చేరండి.',
    'home.cta.startLearning': 'ఈరోజే అభ్యసనం ప్రారంభించండి',
    'home.cta.continueLearning': 'అభ్యసనం కొనసాగించండి',
    
    // Common
    'common.loading': 'లోడ్ అవుతోంది...',
    'common.error': 'లోపం',
    'common.success': 'విజయం',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  // Load saved language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as Language;
    if (savedLanguage && ['en', 'hi', 'ta', 'te'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferred-language', language);
  };

  const t = (key: string): string => {
    return translations[currentLanguage][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
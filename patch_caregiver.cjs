const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'context', 'AppContext.jsx');
let content = fs.readFileSync(file, 'utf8');

const caregiverKeys = {
  hi: {
    'Caregiver Dashboard': 'देखभालकर्ता डैशबोर्ड',
    'Monitor cognitive performance, track engagement trends, and receive AI-powered clinical insights.': 'संज्ञानात्मक प्रदर्शन की निगरानी करें, रुझानों को ट्रैक करें और AI-संचालित नैदानिक अंतर्दृष्टि प्राप्त करें।',
    'Cognitive Wellness Index': 'संज्ञानात्मक कल्याण सूचकांक',
    'Out of 100': '100 में से',
    'AI Multi-Signal Attribution': 'AI मल्टी-सिग्नल एट्रिब्यूशन',
    'Game Performance': 'खेल प्रदर्शन',
    'Emotional Stability': 'भावनात्मक स्थिरता',
    'Speech Fluency Biomarker': 'भाषण प्रवाह बायोमार्कर',
    'Sessions This Week': 'इस सप्ताह के सत्र',
    'Average Accuracy': 'औसत सटीकता',
    'Avg Response Time': 'औसत प्रतिक्रिया समय',
    'Active Streak': 'सक्रिय लकीर',
    'Reminders Completed': 'अनुस्मारक पूर्ण',
    'Caregiver Wellbeing': 'देखभालकर्ता कल्याण',
    'Sundowning Pattern Detected': 'सनडाउनिंग पैटर्न का पता चला',
    'CRITICAL': 'गंभीर',
    'AI Recommendation:': 'AI सिफारिश:',
    '7-Day Cognitive Performance': '7-दिन का संज्ञानात्मक प्रदर्शन',
    'Accuracy & response time trends': 'सटीकता और प्रतिक्रिया समय के रुझान',
    'Cognitive Digital Twin': 'संज्ञानात्मक डिजिटल ट्विन',
    'Radar mapping of 6 brain domains (CST)': '6 मस्तिष्क डोमेन का रडार मैपिंग',
    'Patient Mood Trend': 'रोगी के मूड का रुझान',
    'Self-reported pre-session emotional state': 'सत्र-पूर्व भावनात्मक स्थिति',
    'Conversational Cognitive Signal': 'संवादात्मक संज्ञानात्मक संकेत',
    'Speech fluency biomarker from Smriti Phone': 'स्मृति फोन से भाषण प्रवाह बायोमार्कर',
    'Recent Game Sessions': 'हाल के खेल सत्र',
    'Detailed session history with accuracy tracking': 'सटीकता ट्रैकिंग के साथ विस्तृत सत्र इतिहास',
    'Live Analysis': 'लाइव विश्लेषण',
    'Accuracy': 'सटीकता',
    'Performance': 'प्रदर्शन',
    'Time': 'समय',
    'Game Exercise': 'खेल अभ्यास'
  },
  as: {
    'Caregiver Dashboard': 'পৰিচৰ্যাকাৰী ডেছবোৰ্ড',
    'Monitor cognitive performance, track engagement trends, and receive AI-powered clinical insights.': 'জ্ঞানমূলক প্ৰদৰ্শন নিৰীক্ষণ কৰক, ট্ৰেণ্ডসমূহ অনুসৰণ কৰক আৰু AI-চালিত ক্লিনিকেল অন্তৰ্দৃষ্টি লাভ কৰক।',
    'Cognitive Wellness Index': 'জ্ঞানমূলক সুস্থতা সূচক',
    'Out of 100': '১০০ৰ ভিতৰত',
    'AI Multi-Signal Attribution': 'AI মাল্টি-চিগনেল এট্ৰিবিউচন',
    'Game Performance': 'খেলৰ প্ৰদৰ্শন',
    'Emotional Stability': 'আৱেগিক স্থিৰতা',
    'Speech Fluency Biomarker': 'কথন সাৱলীলতা বায়োমাৰ্কাৰ',
    'Sessions This Week': 'এই সপ্তাহৰ অধিবেশনসমূহ',
    'Average Accuracy': 'গড় নিখুঁততা',
    'Avg Response Time': 'গড় সঁহাৰিৰ সময়',
    'Active Streak': 'সক্ৰিয় ধাৰাবাহিকতা',
    'Reminders Completed': 'সোঁৱৰণী সম্পূৰ্ণ',
    'Caregiver Wellbeing': 'পৰিচৰ্যাকাৰীৰ সুস্থতা',
    'Sundowning Pattern Detected': 'ছানডাউনিং আৰ্হি ধৰা পৰিছে',
    'CRITICAL': 'জটিল',
    'AI Recommendation:': 'AI পৰামৰ্শ:',
    '7-Day Cognitive Performance': '৭-দিনীয়া জ্ঞানমূলক প্ৰদৰ্শন',
    'Accuracy & response time trends': 'নিখুঁততা আৰু সঁহাৰিৰ সময়ৰ ট্ৰেণ্ড',
    'Cognitive Digital Twin': 'জ্ঞানমূলক ডিজিটেল টুইন',
    'Radar mapping of 6 brain domains (CST)': '৬টা মগজু ডমেইনৰ ৰাডাৰ মেপিং',
    'Patient Mood Trend': 'ৰোগীৰ মেজাজৰ ট্ৰেণ্ড',
    'Self-reported pre-session emotional state': 'অধিবেশনৰ পূৰ্বৰ আৱেগিক অৱস্থা',
    'Conversational Cognitive Signal': 'কথোপকথনমূলক জ্ঞানমূলক সংকেত',
    'Speech fluency biomarker from Smriti Phone': 'স্মৃতি ফোনৰ পৰা কথন সাৱলীলতা বায়োমাৰ্কাৰ',
    'Recent Game Sessions': 'শেহতীয়া খেলৰ অধিবেশনসমূহ',
    'Detailed session history with accuracy tracking': 'নিখুঁততা ট্ৰেকিংৰ সৈতে বিতং অধিবেশনৰ ইতিহাস',
    'Live Analysis': 'লাইভ বিশ্লেষণ',
    'Accuracy': 'নিখুঁততা',
    'Performance': 'প্ৰদৰ্শন',
    'Time': 'সময়',
    'Game Exercise': 'খেলৰ অনুশীলন'
  }
};

for (const lang in caregiverKeys) {
  const marker = new RegExp(`  ${lang}: \\{`);
  let replacementStr = `  ${lang}: {\n`;
  for (const k in caregiverKeys[lang]) {
    replacementStr += `    '${k}': '${caregiverKeys[lang][k].replace(/'/g, "\\'")}',\n`;
  }
  content = content.replace(marker, replacementStr);
}

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched CAREGIVER TRANSLATIONS in AppContext.jsx');

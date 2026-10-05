const fs = require('fs');
const path = require('path');

const appCtxPath = path.join(__dirname, 'src/context/AppContext.jsx');
let content = fs.readFileSync(appCtxPath, 'utf8');

const keysToAdd = {
  en: { oddOneOut: 'Odd One Out', familyFaces: 'Family Faces', addReminder: 'Add Custom Reminder', addReminderBtn: '+ Add Reminder', saveReminder: 'Save Reminder', cancel: 'Cancel', timeLabel: 'Time', titleLabel: 'Title', detailLabel: 'Details' },
  as: { oddOneOut: 'অস্বাভাৱিক বাছনি কৰক', familyFaces: 'পৰিয়ালৰ মুখসমূহ', addReminder: 'কাষ্টম সোঁৱৰণী যোগ কৰক', addReminderBtn: '+ সোঁৱৰণী যোগ কৰক', saveReminder: 'সোঁৱৰণী সংৰক্ষণ কৰক', cancel: 'বাতিল কৰক', timeLabel: 'সময়', titleLabel: 'শিৰোনাম', detailLabel: 'বিৱৰণ' },
  mni: { oddOneOut: 'তোপ তোপ্পা খন্বা', familyFaces: 'ইমুংগী মশকশিং', addReminder: 'কাষ্টম রিমাইন্ডার হাপচিনবা', addReminderBtn: '+ রিমাইন্ডার হাপচিনবা', saveReminder: 'রিমাইন্ডার সেভ তৌবা', cancel: 'কেন্সেল তৌবা', timeLabel: 'মতম', titleLabel: 'মিংথোল', detailLabel: 'অকুপ্পা ৱারোল' },
  hi: { oddOneOut: 'विषम चुनें', familyFaces: 'परिवार के चेहरे', addReminder: 'कस्टम अनुस्मारक जोड़ें', addReminderBtn: '+ अनुस्मारक जोड़ें', saveReminder: 'अनुस्मारक सहेजें', cancel: 'रद्द करें', timeLabel: 'समय', titleLabel: 'शीर्षक', detailLabel: 'विवरण' },
  bn: { oddOneOut: 'অস্বাভাবিকটি বেছে নিন', familyFaces: 'পরিবারের মুখগুলি', addReminder: 'কাস্টম অনুস্মারক যোগ করুন', addReminderBtn: '+ অনুস্মারক যোগ করুন', saveReminder: 'অনুস্মারক সংরক্ষণ করুন', cancel: 'বাতিল করুন', timeLabel: 'সময়', titleLabel: 'শিরোনাম', detailLabel: 'বিবরণ' },
  kha: { oddOneOut: 'Jied iaba kong', familyFaces: 'Ki dur khmat iing', addReminder: 'Thep jingpynmaw thymmai', addReminderBtn: '+ Thep jingpynmaw', saveReminder: 'Save jingpynmaw', cancel: 'Nym thep', timeLabel: 'Por', titleLabel: 'Kyrteng', detailLabel: 'Batai' },
  mzo: { oddOneOut: 'A dang thlang chhuak rawh', familyFaces: 'Chhungte hmel', addReminder: 'Hriattirna thar dah', addReminderBtn: '+ Hriattirna dah', saveReminder: 'Hriattirna save', cancel: 'Sut leh', timeLabel: 'Hun', titleLabel: 'Thupui', detailLabel: 'Sawifiahna' }
};

// Add to translations
for (const [lang, translations] of Object.entries(keysToAdd)) {
  const blockRegex = new RegExp(`(${lang}:\\s*\\{[\\s\\S]*?)(  \\},)`, 'g');
  const injectString = Object.entries(translations).map(([k, v]) => `    ${k}: '${v}',`).join('\n') + '\n';
  content = content.replace(blockRegex, `$1${injectString}$2`);
}

// Add dark theme
if (!content.includes('dark: {')) {
  const darkThemeStr = `
  dark: {
    name: 'Midnight Slate',
    emoji: '🌙',
    '--bg-primary': '#0D1117',
    '--bg-secondary': '#161B22',
    '--bg-card': '#1E232B',
    '--bg-card-hover': '#262D35',
    '--bg-sidebar': '#090C10',
    '--text-primary': '#F0F6FC',
    '--text-secondary': '#C9D1D9',
    '--text-muted': '#8B949E',
    '--text-on-dark': '#FFFFFF',
    '--text-on-dark-muted': '#C9D1D9',
    '--accent-teal': '#2F81F7',
    '--accent-green': '#3FB950',
    '--gradient-primary': 'linear-gradient(135deg, #1F6FEB 0%, #2EA043 100%)',
    '--gradient-hero': 'linear-gradient(160deg, #161B22 0%, #0D1117 40%, #090C10 100%)',
    '--accent-teal-light': 'rgba(47,129,247,0.15)',
    '--gradient-glow': 'radial-gradient(circle at 50% 0%, rgba(47,129,247,0.15) 0%, transparent 70%)',
    '--border-color': '#30363D',
  },
`;
  content = content.replace(/export const THEMES = \{/, `export const THEMES = {${darkThemeStr}`);
}

// Add light theme (default high contrast)
if (!content.includes('light: {')) {
  const lightThemeStr = `
  light: {
    name: 'High Contrast Light',
    emoji: '☀️',
    '--bg-primary': '#F2F7F2',
    '--bg-secondary': '#FFFFFF',
    '--bg-sidebar': '#0B3D3D',
    '--bg-card': '#FFFFFF',
    '--text-primary': '#0A1C11',
    '--text-secondary': '#1F3F2A',
    '--text-muted': '#4A6E55',
    '--accent-teal': '#0A7E6A',
    '--accent-green': '#1D9B5F',
    '--gradient-primary': 'linear-gradient(135deg, #0A7E6A 0%, #1D9B5F 100%)',
    '--gradient-hero': 'linear-gradient(160deg, #E8F8F0 0%, #F5EFE6 40%, #E4F5E9 100%)',
    '--accent-teal-light': 'rgba(10,126,106,0.08)',
    '--gradient-glow': 'radial-gradient(circle at 50% 0%, rgba(10,126,106,0.12) 0%, transparent 70%)',
    '--border-color': 'rgba(10,80,60,0.12)',
  },
`;
  content = content.replace(/export const THEMES = \{/, `export const THEMES = {${lightThemeStr}`);
}

fs.writeFileSync(appCtxPath, content);
console.log('Successfully updated AppContext.jsx with new translations and dark/light themes.');

// Multi-language support for Hebrew Typing Games

// Add CSS to hide non-selected languages initially
const style = document.createElement('style');
style.textContent = `
    .lang-he, .lang-en, .lang-fr {
        display: none;
    }
`;
document.head.appendChild(style);

const translations = {
    he: {
        'index.title': 'משחקי תרגול עברית',
        'index.subtitle': 'שפרו את מיומנות ההקלדה שלכם בעברית דרך משחקים מהנים!',
        'index.game1.title': 'רץ וקפוץ',
        'index.game1.desc': 'לחצו על האות העברית הנכונה כדי לקפוץ ולהתקדם!',
        'index.game2.title': 'מכונית עברית',
        'index.game2.desc': 'נווטו ימינה ושמאלה באמצעות אותיות עבריות אקראיות!',
        'index.game3.title': 'הקלדת משפטים',
        'index.game3.desc': 'תרגול הקלדה מהיר עם משפטים מעיתונים עבריים',
        'index.game4.title': 'אותיות נופלות',
        'index.game4.desc': 'הקלידו את האותיות לפני שהן נוגעות בקרקע!',
        'index.game5.title': 'פצח בלונים',
        'index.game5.desc': 'פוצצו בלונים עם אותיות לפני שהם עפים!',
        'index.game6.title': 'קרב חלל עברי',
        'index.game6.desc': 'ירו בחייזרים עם אותיות עבריות!',
        'index.game7.title': 'תופס אותיות',
        'index.game7.desc': 'תפסו אותיות ירוקות, הימנעו מאדומות!',
        'index.game8.title': 'בועות אותיות',
        'index.game8.desc': 'פוצצו בועות לפני שהזמן אוזל - קומבו!',
        'game6.title': 'קרב חלל עברי!',
        'game6.inst1': 'הקלידו את האות כדי לירות בחייזרים!',
        'game6.inst2': 'חייזרים עם אותיות עבריות פולשים מהחלל!',
        'game6.inst3': 'הקלידו במהירות כדי להציל את כדור הארץ!',
        'game6.wave': 'גל:',
        'game6.finalWave': 'גל שהגעת:',
        'game7.title': 'תופס אותיות!',
        'game7.inst1': 'השתמשו במקשי החיצים או A/D כדי להזיז את הסל!',
        'game7.inst2': 'תפסו אותיות ירוקות כדי לקבל נקודות!',
        'game7.inst3': 'הימנעו מאותיות אדומות - הן יגרעו נקודות!',
        'game7.inst4': 'תפסו 20 אותיות טובות כדי לנצח!',
        'game7.good': 'טובות:',
        'game7.bad': 'רעות:',
        'game7.success': 'כל הכבוד! תפסת 20 אותיות!',
        'game8.title': 'בועות אותיות!',
        'game8.inst1': 'הקלידו את האות כדי לפוצץ בועות!',
        'game8.inst2': 'פוצצו בועות במהירות לקומבו!',
        'game8.inst3': 'אל תתנו לזמן לגמור!',
        'game8.combo': 'קומבו:',
        'game8.timeUp': 'הזמן נגמר!',
        'touchtyping.title': 'מאמן הקלדה עיוורת',
        'touchtyping.instructions': 'הוראות:',
        'touchtyping.instructionText': 'למד להקליד ללא הסתכלות על המקלדת! התחל משורת הבית (אשדגכעיחלךף) והתקדם לרמות קשות יותר. שים את האצבעות על שורת הבית ועקוב אחר האות המודגשת על המקלדת.',
        'touchtyping.speed': 'מהירות (תווים/דקה)',
        'touchtyping.accuracy': 'דיוק',
        'touchtyping.errors': 'טעויות',
        'touchtyping.progress': 'התקדמות',
        'touchtyping.homeRow': 'שורת בית',
        'touchtyping.topRow': 'שורה עליונה',
        'touchtyping.bottomRow': 'שורה תחתונה',
        'touchtyping.allLetters': 'כל האותיות',
        'touchtyping.words': 'מילים',
        'touchtyping.sentences': 'משפטים',
        'touchtyping.handPosition': 'מיקום ידיים',
        'touchtyping.rightHand': 'יד ימין:',
        'touchtyping.leftHand': 'יד שמאל:',
        'touchtyping.startExercise': 'התחל תרגיל חדש',
        'touchtyping.resetStats': 'אפס סטטיסטיקות',
        'touchtyping.placeholder': 'התחל להקליד כאן...'
    },
    en: {
        'index.title': 'Hebrew Typing Games',
        'index.subtitle': 'Improve your Hebrew typing skills through fun games!',
        'index.game1.title': 'Run and Jump',
        'index.game1.desc': 'Press the correct Hebrew letter to jump and advance!',
        'index.game2.title': 'Hebrew Car',
        'index.game2.desc': 'Navigate left and right using random Hebrew letters!',
        'index.game3.title': 'Sentence Typing',
        'index.game3.desc': 'Fast typing practice with sentences from Hebrew newspapers',
        'index.game4.title': 'Falling Letters',
        'index.game4.desc': 'Type the letters before they hit the ground!',
        'index.game5.title': 'Balloon Pop',
        'index.game5.desc': 'Pop balloons with letters before they fly away!',
        'index.game6.title': 'Space Shooter',
        'index.game6.desc': 'Shoot aliens with Hebrew letters!',
        'index.game7.title': 'Letter Catcher',
        'index.game7.desc': 'Catch green letters, avoid red ones!',
        'index.game8.title': 'Letter Bubbles',
        'index.game8.desc': 'Pop bubbles before time runs out - combo bonuses!',
        'game6.title': 'Hebrew Space Shooter!',
        'game6.inst1': 'Type the letter to shoot the aliens!',
        'game6.inst2': 'Aliens with Hebrew letters are invading from space!',
        'game6.inst3': 'Type fast to save Earth!',
        'game6.wave': 'Wave:',
        'game6.finalWave': 'Wave Reached:',
        'game7.title': 'Letter Catcher!',
        'game7.inst1': 'Use arrow keys or A/D to move the basket!',
        'game7.inst2': 'Catch green letters to earn points!',
        'game7.inst3': 'Avoid red letters - they subtract points!',
        'game7.inst4': 'Catch 20 good letters to win!',
        'game7.good': 'Good:',
        'game7.bad': 'Bad:',
        'game7.success': 'Well done! You caught 20 letters!',
        'game8.title': 'Letter Bubbles!',
        'game8.inst1': 'Type the letter to pop bubbles!',
        'game8.inst2': 'Pop bubbles quickly for combos!',
        'game8.inst3': 'Don\'t let time run out!',
        'game8.combo': 'Combo:',
        'game8.timeUp': 'Time\'s Up!',
        'touchtyping.title': 'Touch Typing Trainer',
        'touchtyping.instructions': 'Instructions:',
        'touchtyping.instructionText': 'Learn to type without looking at the keyboard! Start with the home row (אשדגכעיחלךף) and progress to harder levels. Place your fingers on the home row and follow the highlighted letter on the keyboard.',
        'touchtyping.speed': 'Speed (chars/min)',
        'touchtyping.accuracy': 'Accuracy',
        'touchtyping.errors': 'Errors',
        'touchtyping.progress': 'Progress',
        'touchtyping.homeRow': 'Home Row',
        'touchtyping.topRow': 'Top Row',
        'touchtyping.bottomRow': 'Bottom Row',
        'touchtyping.allLetters': 'All Letters',
        'touchtyping.words': 'Words',
        'touchtyping.sentences': 'Sentences',
        'touchtyping.handPosition': 'Hand Position',
        'touchtyping.rightHand': 'Right Hand:',
        'touchtyping.leftHand': 'Left Hand:',
        'touchtyping.startExercise': 'Start New Exercise',
        'touchtyping.resetStats': 'Reset Statistics',
        'touchtyping.placeholder': 'Start typing here...'
    },
    fr: {
        'index.title': 'Jeux de frappe hébraïque',
        'index.subtitle': 'Améliorez vos compétences de frappe en hébreu avec des jeux amusants !',
        'index.game1.title': 'Courir et sauter',
        'index.game1.desc': 'Appuyez sur la bonne lettre hébraïque pour sauter et avancer !',
        'index.game2.title': 'Voiture hébraïque',
        'index.game2.desc': 'Naviguez à gauche et à droite avec des lettres hébraïques aléatoires !',
        'index.game3.title': 'Frappe de phrases',
        'index.game3.desc': 'Pratique de frappe rapide avec des phrases de journaux hébreux',
        'index.game4.title': 'Lettres tombantes',
        'index.game4.desc': 'Tapez les lettres avant qu\'elles ne touchent le sol !',
        'index.game5.title': 'Éclater des ballons',
        'index.game5.desc': 'Éclatez les ballons avec des lettres avant qu\'ils ne s\'envolent !',
        'index.game6.title': 'Tireur spatial',
        'index.game6.desc': 'Tirez sur les extraterrestres avec des lettres hébraïques !',
        'index.game7.title': 'Attraper les lettres',
        'index.game7.desc': 'Attrapez les lettres vertes, évitez les rouges !',
        'index.game8.title': 'Bulles de lettres',
        'index.game8.desc': 'Éclatez les bulles avant que le temps ne soit écoulé - bonus combo !',
        'game6.title': 'Tireur spatial hébraïque !',
        'game6.inst1': 'Tapez la lettre pour tirer sur les extraterrestres !',
        'game6.inst2': 'Des extraterrestres avec des lettres hébraïques envahissent depuis l\'espace !',
        'game6.inst3': 'Tapez rapidement pour sauver la Terre !',
        'game6.wave': 'Vague :',
        'game6.finalWave': 'Vague atteinte :',
        'game7.title': 'Attraper les lettres !',
        'game7.inst1': 'Utilisez les flèches ou A/D pour déplacer le panier !',
        'game7.inst2': 'Attrapez les lettres vertes pour gagner des points !',
        'game7.inst3': 'Évitez les lettres rouges - elles soustraient des points !',
        'game7.inst4': 'Attrapez 20 bonnes lettres pour gagner !',
        'game7.good': 'Bonnes :',
        'game7.bad': 'Mauvaises :',
        'game7.success': 'Bien joué ! Vous avez attrapé 20 lettres !',
        'game8.title': 'Bulles de lettres !',
        'game8.inst1': 'Tapez la lettre pour éclater les bulles !',
        'game8.inst2': 'Éclatez les bulles rapidement pour des combos !',
        'game8.inst3': 'Ne laissez pas le temps s\'écouler !',
        'game8.combo': 'Combo :',
        'game8.timeUp': 'Temps écoulé !',
        'touchtyping.title': 'Entraîneur de frappe au toucher',
        'touchtyping.instructions': 'Instructions :',
        'touchtyping.instructionText': 'Apprenez à taper sans regarder le clavier ! Commencez par la rangée de base (אשדגכעיחלךף) et progressez vers des niveaux plus difficiles. Placez vos doigts sur la rangée de base et suivez la lettre en surbrillance sur le clavier.',
        'touchtyping.speed': 'Vitesse (car/min)',
        'touchtyping.accuracy': 'Précision',
        'touchtyping.errors': 'Erreurs',
        'touchtyping.progress': 'Progrès',
        'touchtyping.homeRow': 'Rangée de base',
        'touchtyping.topRow': 'Rangée supérieure',
        'touchtyping.bottomRow': 'Rangée inférieure',
        'touchtyping.allLetters': 'Toutes les lettres',
        'touchtyping.words': 'Mots',
        'touchtyping.sentences': 'Phrases',
        'touchtyping.handPosition': 'Position des mains',
        'touchtyping.rightHand': 'Main droite :',
        'touchtyping.leftHand': 'Main gauche :',
        'touchtyping.startExercise': 'Commencer un nouvel exercice',
        'touchtyping.resetStats': 'Réinitialiser les statistiques',
        'touchtyping.placeholder': 'Commencez à taper ici...'
    }
};

let currentLang = 'he';

function setLanguage(lang) {
    console.log('Setting language to:', lang); // Debug log
    currentLang = lang;
    localStorage.setItem('hebrewGameLang', lang);
    
    // Hide all language elements
    document.querySelectorAll('.lang-he, .lang-en, .lang-fr').forEach(el => {
        el.style.display = 'none';
    });
    
    // Show selected language elements
    // Using 'inline' for inline elements (span) and checking for block elements
    document.querySelectorAll(`.lang-${lang}`).forEach(el => {
        // Default to inline for most text elements
        el.style.display = 'inline';
    });
    
    // Update active button state
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[data-lang="${lang}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Update direction and language attributes
    const html = document.documentElement;
    const isHebrew = lang === 'he';
    
    // Set direction: RTL for Hebrew, LTR for others
    html.setAttribute('dir', isHebrew ? 'rtl' : 'ltr');
    html.setAttribute('lang', lang);
    
    // Also set on body for better browser support
    document.body.setAttribute('dir', isHebrew ? 'rtl' : 'ltr');
    
    console.log('Language changed successfully to:', lang); // Debug log
}

// Make setLanguage globally accessible - this is crucial for onclick handlers
window.setLanguage = setLanguage;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Get saved language or default to Hebrew
    const savedLang = localStorage.getItem('hebrewGameLang') || 'he';
    setLanguage(savedLang);
});

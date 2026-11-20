export type Language = 'te' | 'hi' | 'en';

export const astroTranslations: Record<Language, {
  planets: Record<string, string>;
  rashis: Record<string, string>;
  nakshatras: Record<string, string>;
}> = {
  te: {
    planets: {
      Sun: 'సూర్యుడు', Moon: 'చంద్రుడు', Mars: 'కుజుడు', Mercury: 'బుధుడు',
      Jupiter: 'గురుడు', Venus: 'శుక్రుడు', Saturn: 'శని', Rahu: 'రాహువు', Ketu: 'కేతువు',
    },
    rashis: {
      Aries: 'మేషం', Taurus: 'వృషభం', Gemini: 'మిధునం', Cancer: 'కర్కాటకం',
      Leo: 'సింహం', Virgo: 'కన్య', Libra: 'తుల', Scorpio: 'వృశ్చికం',
      Sagittarius: 'ధనుస్సు', Capricorn: 'మకరం', Aquarius: 'కుంభం', Pisces: 'మీనం',
    },
    nakshatras: {
      Ashwini: 'అశ్విని', Bharani: 'భరణి', Krittika: 'కృత్తిక', Rohini: 'రోహిణి',
      Mrigashira: 'మృగశిర', Ardra: 'ఆరుద్ర', Punarvasu: 'పునర్వసు', Pushya: 'పుష్యమి',
      Ashlesha: 'ఆశ్లేష', Magha: 'మఖ', 'Purva Phalguni': 'పూర్వఫల్గుని (పుబ్బ)',
      'Uttara Phalguni': 'ఉత్తరఫల్గుని (ఉత్తర)', Hasta: 'హస్త', Chitra: 'చిత్త',
      Swati: 'స్వాతి', Vishakha: 'విశాఖ', Anuradha: 'అనూరాధ', Jyeshtha: 'జ్యేష్ఠ',
      Mula: 'మూల', 'Purva Ashadha': 'పూర్వాషాఢ', 'Uttara Ashadha': 'ఉత్తరాషాఢ',
      Shravana: 'శ్రవణం', Dhanishta: 'ధనిష్ఠ', Shatabhisha: 'శతభిషం',
      'Purva Bhadrapada': 'పూర్వాభాద్ర', 'Uttara Bhadrapada': 'ఉత్తరాభాద్ర', Revati: 'రేవతి',
    },
  },
  hi: {
    planets: {
      Sun: 'सूर्य', Moon: 'चन्द्रमा', Mars: 'मंगल', Mercury: 'बुध',
      Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
    },
    rashis: {
      Aries: 'मेष', Taurus: 'वृषभ', Gemini: 'मिथुन', Cancer: 'कर्क',
      Leo: 'सिंह', Virgo: 'कन्या', Libra: 'तुला', Scorpio: 'वृश्चिक',
      Sagittarius: 'धनु', Capricorn: 'मकर', Aquarius: 'कुंभ', Pisces: 'मीन',
    },
    nakshatras: {
      Ashwini: 'अश्विनी', Bharani: 'भरणी', Krittika: 'कृत्तिका', Rohini: 'रोहिणी',
      Mrigashira: 'मृगशिरा', Ardra: 'आर्द्रा', Punarvasu: 'पुनर्वसु', Pushya: 'पुष्य',
      Ashlesha: 'अश्लेषा', Magha: 'मघा', 'Purva Phalguni': 'पूर्वाफाल्गुनी',
      'Uttara Phalguni': 'उत्तराफाल्गुनी', Hasta: 'हस्त', Chitra: 'चित्रा',
      Swati: 'स्वाति', Vishakha: 'विशाखा', Anuradha: 'अनुराधा', Jyeshtha: 'ज्येष्ठा',
      Mula: 'मूल', 'Purva Ashadha': 'पूर्वाषाढ़ा', 'Uttara Ashadha': 'उत्तराषाढ़ा',
      Shravana: 'श्रवण', Dhanishta: 'धनिष्ठा', Shatabhisha: 'शतभिषा',
      'Purva Bhadrapada': 'पूर्वभाद्रपद', 'Uttara Bhadrapada': 'उत्तरभाद्रपद', Revati: 'रेवती',
    },
  },
  en: {
    planets: {
      Sun: 'Sun', Moon: 'Moon', Mars: 'Mars', Mercury: 'Mercury',
      Jupiter: 'Jupiter', Venus: 'Venus', Saturn: 'Saturn', Rahu: 'Rahu', Ketu: 'Ketu',
    },
    rashis: {
      Aries: 'Aries', Taurus: 'Taurus', Gemini: 'Gemini', Cancer: 'Cancer',
      Leo: 'Leo', Virgo: 'Virgo', Libra: 'Libra', Scorpio: 'Scorpio',
      Sagittarius: 'Sagittarius', Capricorn: 'Capricorn', Aquarius: 'Aquarius', Pisces: 'Pisces',
    },
    nakshatras: {
      Ashwini: 'Ashwini', Bharani: 'Bharani', Krittika: 'Krittika', Rohini: 'Rohini',
      Mrigashira: 'Mrigashira', Ardra: 'Ardra', Punarvasu: 'Punarvasu', Pushya: 'Pushya',
      Ashlesha: 'Ashlesha', Magha: 'Magha', 'Purva Phalguni': 'Purva Phalguni',
      'Uttara Phalguni': 'Uttara Phalguni', Hasta: 'Hasta', Chitra: 'Chitra',
      Swati: 'Swati', Vishakha: 'Vishakha', Anuradha: 'Anuradha', Jyeshtha: 'Jyeshtha',
      Mula: 'Mula', 'Purva Ashadha': 'Purva Ashadha', 'Uttara Ashadha': 'Uttara Ashadha',
      Shravana: 'Shravana', Dhanishta: 'Dhanishta', Shatabhisha: 'Shatabhisha',
      'Purva Bhadrapada': 'Purva Bhadrapada', 'Uttara Bhadrapada': 'Uttara Bhadrapada', Revati: 'Revati',
    },
  },
};

// తెలుగు లేదా ఇంగ్లీష్ పదం ఏది వచ్చినా దాన్ని కరెక్ట్ ఇంగ్లీష్ కీగా మార్చి అనువదించే హెల్పర్
const ALIAS_TO_KEY: Record<string, string> = {
  // గ్రహాలు
  'సూర్యుడు': 'Sun', 'సూర్యుడు (Sun)': 'Sun', 'Sun': 'Sun',
  'చంద్రుడు': 'Moon', 'చంద్రుడు (Moon)': 'Moon', 'Moon': 'Moon',
  'కుజుడు': 'Mars', 'కుజుడు (Mars)': 'Mars', 'Mars': 'Mars',
  'బుధుడు': 'Mercury', 'బుధుడు (Mercury)': 'Mercury', 'Mercury': 'Mercury',
  'గురుడు': 'Jupiter', 'గురుడు (Jupiter)': 'Jupiter', 'Jupiter': 'Jupiter',
  'శుక్రుడు': 'Venus', 'శుక్రుడు (Venus)': 'Venus', 'Venus': 'Venus',
  'శని': 'Saturn', 'శని (Saturn)': 'Saturn', 'Saturn': 'Saturn',
  'రాహువు': 'Rahu', 'రాహువు (Rahu)': 'Rahu', 'Rahu': 'Rahu',
  'కేతువు': 'Ketu', 'కేతువు (Ketu)': 'Ketu', 'Ketu': 'Ketu',
  // రాశులు
  'మేష': 'Aries', 'వృషభ': 'Taurus', 'మిధున': 'Gemini', 'కర్కాటక': 'Cancer',
  'సింహ': 'Leo', 'కన్య': 'Virgo', 'తుల': 'Libra', 'వృశ్చిక': 'Scorpio',
  'ధనుస్సు': 'Sagittarius', 'మకర': 'Capricorn', 'కుంభ': 'Aquarius', 'మీన': 'Pisces',
};

export function translateText(
  category: 'planets' | 'rashis' | 'nakshatras',
  rawValue: string,
  lang: Language = 'te'
): string {
  if (!rawValue) return '';
  // ముందుగా బ్రాకెట్లలో ఉన్న ఇంగ్లీష్ పేరు ఉంటే తీసుకుంటుంది, లేదంటే ALIAS_TO_KEY చూస్తుంది
  const cleanKey = ALIAS_TO_KEY[rawValue.trim()] || rawValue.split('(')[0].trim();
  const normalizedKey = ALIAS_TO_KEY[cleanKey] || cleanKey;

  return astroTranslations[lang]?.[category]?.[normalizedKey] || rawValue;
}
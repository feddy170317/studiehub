/* QuizLive — Quiz-manifest. Tilføj nye quizzer her. */
window.QUIZ_MANIFEST = [
  {
    id: 'demo',
    title: 'Demo: Blandet paratviden',
    file: 'quizzes/demo.js',
    count: 8
  },
  {
    id: 'demo_en',
    title: 'Demo: General Knowledge (English)',
    file: 'quizzes/demo_en.js',
    count: 8,
    language: 'en'
  },
  {
    id: 'almen_3_5_klasse',
    title: 'Almen viden · 3.–5. klasse',
    file: 'quizzes/almen_3_5_klasse.js',
    count: 20
  },
  {
    id: 'hvad_koster_det',
    title: '💰 Hvad koster det? (DBA-prisgæt)',
    file: 'quizzes/hvad_koster_det.js',
    count: 20,
    mode: 'estimate'
  },
  {
    id: 'hvad_koster_det_fjollet',
    title: '💰 Hvad koster det? Det fjollede',
    file: 'quizzes/hvad_koster_det_fjollet.js',
    count: 20,
    mode: 'estimate'
  },
  {
    id: 'hvad_koster_det_svaer',
    title: '💰 Hvad koster det? Aner det ikke (svær)',
    file: 'quizzes/hvad_koster_det_svaer.js',
    count: 20,
    mode: 'estimate'
  }
];
/* "Dansk Almen Viden" og "Verdens Almenviden" er nu auto-genererede quizzer,
   der trækker 15 tilfældige spørgsmål fra en 100+ spørgsmåls-bank i Firebase
   — se quizzes/bank_manifest.js og "🎲 Automatiske quizzer" i host-kataloget. */

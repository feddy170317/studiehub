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
  }
];
/* "Dansk Almen Viden" og "Verdens Almenviden" er nu auto-genererede quizzer,
   der trækker 15 tilfældige spørgsmål fra en 100+ spørgsmåls-bank i Firebase
   — se quizzes/bank_manifest.js og "🎲 Automatiske quizzer" i host-kataloget. */

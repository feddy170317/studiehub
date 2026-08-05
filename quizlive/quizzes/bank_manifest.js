/* QuizLive — Manifest over spørgsmålsbanke (auto-genererede quizzer).
   Selve spørgsmålene ligger IKKE her, men i Firebase under quizzes/{id}
   (isBank:true) — se _gen/bank_*.json for kilde-indhold og _gen/upload_bank.js
   for upload-scriptet. Tilføj nye banke her, når de er uploadet. */
window.QUESTION_BANKS = [
  { id: 'dansk_almen_viden_bank', title: 'Dansk Almen Viden', poolSize: 104, drawCount: 15 },
  { id: 'verdens_almenviden_bank', title: 'Verdens Almenviden', poolSize: 101, drawCount: 15 }
];

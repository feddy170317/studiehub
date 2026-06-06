// Load content.json and log semester info
fetch('http://localhost:8000/content.json')
  .then(r => r.json())
  .then(content => {
    const edu = content.educations[0];
    console.log('Education: ' + edu.name);
    console.log('Semesters: ' + edu.semesters.length);
    edu.semesters.forEach(sem => {
      console.log('  Sem ' + sem.number + ': ' + sem.courses.length + ' courses');
    });
    // Check key courses
    const sem1 = edu.semesters.find(s => s.number === 1);
    const sem2 = edu.semesters.find(s => s.number === 2);
    const sem3 = edu.semesters.find(s => s.number === 3);
    const sem5 = edu.semesters.find(s => s.number === 5);
    
    console.log('Sem1 has MEK1: ' + (sem1.courses.some(c => c.code === 'MEK1') ? 'YES' : 'NO'));
    console.log('Sem2 has MAT1: ' + (sem2.courses.some(c => c.code === 'MAT1') ? 'YES' : 'NO'));
    console.log('Sem2 has DYN1: ' + (sem2.courses.some(c => c.code === 'DYN1') ? 'YES' : 'NO'));
    console.log('Sem3 exists: ' + (sem3 ? 'YES' : 'NO'));
    console.log('Sem5 has INP1: ' + (sem5.courses.some(c => c.code === 'INP1') ? 'YES' : 'NO'));
  });

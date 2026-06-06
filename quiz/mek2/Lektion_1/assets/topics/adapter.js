/* Adapter: Map MEK2_L1 data to MMT_TOPICS for quiz.js compatibility */
(function(){
  // Wait for lektion_1.js to load
  var attempts = 0;
  var checkInterval = setInterval(function(){
    if(window.MEK2_L1 && window.MEK2_L1['L1_spaending_toejning']){
      // Copy to MMT_TOPICS
      window.MMT_TOPICS = window.MMT_TOPICS || {};
      window.MMT_TOPICS['L1_spaending_toejning'] = window.MEK2_L1['L1_spaending_toejning'];

      // Also create manifest
      window.MMT_MANIFEST = window.MMT_MANIFEST || [];
      if(!window.MMT_MANIFEST.find(m => m.id === 'L1_spaending_toejning')){
        window.MMT_MANIFEST.push({
          id: 'L1_spaending_toejning',
          title: 'Lektion 1: Spænding og Tøjning',
          cat: 'mek'
        });
      }

      clearInterval(checkInterval);
      console.log('✓ MEK2_L1 data mapped to MMT_TOPICS');
    }
    attempts++;
    if(attempts > 50){
      clearInterval(checkInterval);
      console.error('✗ Timeout waiting for MEK2_L1 data');
    }
  }, 100);
})();

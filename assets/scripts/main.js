
// main.js — registro de visitas e helpers simples
(function(){
  // registra visita pela URL atual
  const page = location.pathname.split('/').pop() || 'index.html';
  try { fp_recordVisit(page); } catch(e){ /* store.js pode não estar carregado em todas páginas */ }
})();

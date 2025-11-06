// main.js — controle do menu mobile + registro de visitas
(function(){
  // Registrar visita (mantém seu sistema de analytics local)
  const page = location.pathname.split('/').pop() || 'index.html';
  try { fp_recordVisit(page); } catch(e){ /* store.js pode não estar carregado em todas páginas */ }

  // Controle do menu mobile
  window.toggleMobileMenu = function() {
    const menu = document.getElementById("mobile-menu");
    const openIcon = document.getElementById("menu-icon");
    const closeIcon = document.getElementById("close-icon");

    const isOpen = menu.classList.contains("translate-y-0");
    if (isOpen) {
      menu.classList.remove("translate-y-0", "opacity-100", "visible");
      menu.classList.add("-translate-y-full", "opacity-0", "invisible");
      openIcon.classList.remove("hidden");
      closeIcon.classList.add("hidden");
    } else {
      menu.classList.remove("-translate-y-full", "opacity-0", "invisible");
      menu.classList.add("translate-y-0", "opacity-100", "visible");
      openIcon.classList.add("hidden");
      closeIcon.classList.remove("hidden");
    }
  }

  window.closeMobileMenu = function() {
    const menu = document.getElementById("mobile-menu");
    const openIcon = document.getElementById("menu-icon");
    const closeIcon = document.getElementById("close-icon");

    menu.classList.remove("translate-y-0", "opacity-100", "visible");
    menu.classList.add("-translate-y-full", "opacity-0", "invisible");
    openIcon.classList.remove("hidden");
    closeIcon.classList.add("hidden");
  }

  // Fecha automaticamente o menu ao clicar em um link
  document.addEventListener('click', (e)=>{
    if(e.target.tagName==='A' && e.target.closest('#mobile-menu')) closeMobileMenu();
  });
})();
// assets/scripts/main.js — v13 (menu mobile + registro de visita + helpers)
(function() {
  /** ------------------------------------------
   *  Registro simples de visita
   *  ------------------------------------------ */
  const page = location.pathname.split('/').pop() || 'index.html';
  try {
    if (typeof fp_recordVisit === "function") fp_recordVisit(page);
  } catch (e) {
    console.warn("store.js não disponível para registro de visita.");
  }

  /** ------------------------------------------
   *  MENU MOBILE
   *  ------------------------------------------ */

  window.toggleMobileMenu = function() {
    const menu = document.getElementById("mobile-menu");
    const openIcon = document.getElementById("menu-icon");
    const closeIcon = document.getElementById("close-icon");
    if (!menu) return;

    const isOpen = menu.classList.contains("translate-y-0");
    if (isOpen) {
      // Fecha o menu
      menu.classList.remove("translate-y-0", "opacity-100", "visible");
      menu.classList.add("-translate-y-full", "opacity-0", "invisible");
      if (openIcon) openIcon.classList.remove("hidden");
      if (closeIcon) closeIcon.classList.add("hidden");
      document.body.style.overflow = "";
    } else {
      // Abre o menu
      menu.classList.remove("-translate-y-full", "opacity-0", "invisible");
      menu.classList.add("translate-y-0", "opacity-100", "visible");
      if (openIcon) openIcon.classList.add("hidden");
      if (closeIcon) closeIcon.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
  };

  window.closeMobileMenu = function() {
    const menu = document.getElementById("mobile-menu");
    const openIcon = document.getElementById("menu-icon");
    const closeIcon = document.getElementById("close-icon");
    if (!menu) return;
    menu.classList.remove("translate-y-0", "opacity-100", "visible");
    menu.classList.add("-translate-y-full", "opacity-0", "invisible");
    if (openIcon) openIcon.classList.remove("hidden");
    if (closeIcon) closeIcon.classList.add("hidden");
    document.body.style.overflow = "";
  };

  /** ------------------------------------------
   *  Buscar (Desktop / Mobile)
   *  ------------------------------------------ */

  window.realizarBusca = function() {
    const termo = document.getElementById("search-input")?.value.trim();
    if (!termo) return alert("Digite o nome do produto para buscar.");
    alert("Busca por: " + termo);
    // Aqui você pode integrar um sistema de busca real futuramente
  };

  window.realizarBuscaMobile = function() {
    const termo = document.getElementById("search-input-mobile")?.value.trim();
    if (!termo) return alert("Digite o nome do produto para buscar.");
    alert("Busca por: " + termo);
  };

  /** ------------------------------------------
   *  Inicialização
   *  ------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function() {
    console.log("Main.js carregado — página:", page);
  });
})();
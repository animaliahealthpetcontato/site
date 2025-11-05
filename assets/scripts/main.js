
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');
  if (mobileMenu.classList.contains('-translate-y-full')) {
    mobileMenu.classList.remove('-translate-y-full', 'opacity-0', 'invisible');
    mobileMenu.classList.add('translate-y-0', 'opacity-100', 'visible');
    menuIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
  } else {
    mobileMenu.classList.add('-translate-y-full', 'opacity-0', 'invisible');
    mobileMenu.classList.remove('translate-y-0', 'opacity-100', 'visible');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
  }
}
function closeMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');
  mobileMenu.classList.add('-translate-y-full', 'opacity-0', 'invisible');
  mobileMenu.classList.remove('translate-y-0', 'opacity-100', 'visible');
  menuIcon.classList.remove('hidden');
  closeIcon.classList.add('hidden');
}

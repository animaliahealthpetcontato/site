
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

function realizarBusca() {
  var i = document.getElementById('search-input');
  if (!i) return;
  const termo = i.value.trim();
  if (termo) alert('Você buscou por: ' + termo);
}
function realizarBuscaMobile() {
  var i = document.getElementById('search-input-mobile');
  if (!i) return;
  const termo = i.value.trim();
  if (termo) { alert('Você buscou por: ' + termo); closeMobileMenu(); }
}

// Carrinho - Controles simples para quantidades e totais
function formatBRL(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function alterarQtd(btn, delta) {
  const wrap = btn.closest('[data-price]');
  const input = wrap.querySelector('.qtd');
  let v = parseInt(input.value || '1', 10);
  v = Math.max(1, v + delta);
  input.value = v;
  recalcularLinha(wrap);
  recalcularTotais();
}

function removerItem(btn) {
  const wrap = btn.closest('[data-price]');
  wrap.parentNode.removeChild(wrap);
  recalcularTotais();
}

function recalcularLinha(row) {
  const price = parseFloat(row.getAttribute('data-price'));
  const qtd = parseInt(row.querySelector('.qtd').value || '1', 10);
  const total = price * qtd;
  const totalEl = row.querySelector('.total-item');
  if (totalEl) totalEl.textContent = formatBRL(total);
}

function subtotalAtual() {
  let s = 0;
  document.querySelectorAll('[data-price]').forEach(row => {
    const price = parseFloat(row.getAttribute('data-price'));
    const qtd = parseInt(row.querySelector('.qtd').value || '1', 10);
    s += price * qtd;
  });
  return s;
}

let descontoValor = 0;
let freteValor = 0;

function aplicarCupom() {
  const c = (document.getElementById('cupom')?.value || '').trim().toUpperCase();
  descontoValor = 0;
  if (c === 'BEMVINDO') {
    descontoValor = subtotalAtual() * 0.10;
    document.getElementById('cupom-info').textContent = 'Cupom aplicado: 10% de desconto.';
  } else if (c) {
    document.getElementById('cupom-info').textContent = 'Cupom inválido.';
  }
  recalcularTotais();
}

function calcularFrete() {
  const cep = (document.getElementById('cep')?.value || '').replace(/\D/g,'');
  freteValor = 0;
  if (cep.length >= 8) {
    // Simulação simples de frete
    freteValor = subtotalAtual() > 149 ? 0 : 19.90;
    document.getElementById('frete-info').textContent = freteValor === 0 ? 'Frete grátis aplicado.' : 'Frete estimado: ' + formatBRL(freteValor);
  } else {
    document.getElementById('frete-info').textContent = 'CEP inválido.';
  }
  recalcularTotais();
}

function recalcularTotais() {
  const s = subtotalAtual();
  document.getElementById('subtotal') && (document.getElementById('subtotal').textContent = formatBRL(s));
  document.getElementById('desconto') && (document.getElementById('desconto').textContent = formatBRL(descontoValor));
  document.getElementById('frete') && (document.getElementById('frete').textContent = formatBRL(freteValor));
  let total = Math.max(0, s - descontoValor) + freteValor;
  document.getElementById('total') && (document.getElementById('total').textContent = formatBRL(total));
}

// Inicializa totais ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('[data-price]').forEach(recalcularLinha);
  recalcularTotais();
});

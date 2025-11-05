
// auth.js — Login modal Cliente / Colaborador
(function(){
  const KEY_USER='fp_user';
  const ADMIN_PASSWORD='11Marco@2023'; // senha de acesso de colaborador (nível mestre)

  function getUser(){ try{return JSON.parse(localStorage.getItem(KEY_USER))}catch(e){return null} }
  function setUser(u){ localStorage.setItem(KEY_USER, JSON.stringify(u)); renderSession(); }
  function logout(){ localStorage.removeItem(KEY_USER); renderSession(); }

  function shaLike(s){ return btoa(unescape(encodeURIComponent(s))).split('').reverse().join(''); }

  function ensureAdminSeed(){
    const colabs = fp_getColabs();
    if(!colabs.find(c=>c.email==="admin@santini.com")){
      colabs.push({ id: Date.now(), nome:"Administrador", email:"admin@santini.com", nivel:"Administrador", senha: shaLike(ADMIN_PASSWORD) });
      fp_setColabs(colabs);
    }
  }

  function openModal(){ document.getElementById('loginModal')?.classList.remove('hidden'); document.body.style.overflow='hidden'; }
  function closeModal(){ document.getElementById('loginModal')?.classList.add('hidden'); document.body.style.overflow=''; }

  function mountModal(){
    if(document.getElementById('loginModal')) return;
    const el = document.createElement('div');
    el.id='loginModal'; el.className='hidden fixed inset-0 z-50';
    el.innerHTML = `
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" data-close="1"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-xl relative">
          <button class="absolute right-3 top-3 text-gray-600" data-close="1">✕</button>
          <div class="p-6">
            <h2 class="text-xl font-bold mb-4">Entrar</h2>
            <div class="flex gap-2 mb-4">
              <button class="tab active" data-tab="cli">Cliente</button>
              <button class="tab" data-tab="col">Colaborador</button>
            </div>
            <div id="tab-cli">
              <label class="block text-sm mb-1">E-mail</label>
              <input id="cli-email" class="w-full border rounded px-3 py-2 mb-3" type="email" placeholder="email@exemplo.com">
              <label class="block text-sm mb-1">Senha</label>
              <input id="cli-senha" class="w-full border rounded px-3 py-2 mb-4" type="password" placeholder="••••••••">
              <button id="btn-cli" class="w-full bg-black text-white rounded py-2">Entrar</button>
            </div>
            <div id="tab-col" class="hidden">
              <label class="block text-sm mb-1">E-mail (colaborador)</label>
              <input id="col-email" class="w-full border rounded px-3 py-2 mb-3" type="email" placeholder="colaborador@empresa.com">
              <label class="block text-sm mb-1">Senha de acesso</label>
              <input id="col-senha" class="w-full border rounded px-3 py-2 mb-4" type="password" placeholder="••••••••">
              <button id="btn-col" class="w-full bg-black text-white rounded py-2">Acessar painel</button>
            </div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(el);
    el.addEventListener('click', e=>{ if(e.target.dataset.close) closeModal(); });
    const tabs = el.querySelectorAll('.tab');
    tabs.forEach(b=>b.addEventListener('click', ()=>{
      tabs.forEach(x=>x.classList.remove('active')); b.classList.add('active');
      const t = b.dataset.tab;
      el.querySelector('#tab-cli').classList.toggle('hidden', t!=='cli');
      el.querySelector('#tab-col').classList.toggle('hidden', t!=='col');
    }));
    el.querySelector('#btn-cli').onclick = ()=>{
      const email = el.querySelector('#cli-email').value.trim();
      const senha = el.querySelector('#cli-senha').value.trim();
      if(!email || !senha) return alert('Preencha e-mail e senha');
      setUser({ tipo:'cliente', email, nome: email.split('@')[0] });
      closeModal(); location.hash = '#minha-conta';
    };
    el.querySelector('#btn-col').onclick = ()=>{
      const email = el.querySelector('#col-email').value.trim();
      const senha = el.querySelector('#col-senha').value.trim();
      if(!email || !senha) return alert('Preencha e-mail e senha');
      // permite login mestre pela senha padrão ou por colaborador cadastrado
      const cols = fp_getColabs();
      const ok = (senha===ADMIN_PASSWORD) || cols.find(c => c.email.toLowerCase()===email.toLowerCase() && c.senha===shaLike(senha));
      if(!ok) return alert('Credenciais inválidas');
      setUser({ tipo:'colaborador', email, nome: email.split('@')[0], nivel: 'Colaborador' });
      closeModal(); location.href='admin.html';
    };
  }

  function injectLoginButton(){
    // não mostra "Admin" na navbar; apenas "Entrar"
    let btn = document.querySelector('[data-action="open-login"]');
    if(!btn){
      // tenta injetar na navbar existente
      const nav = document.querySelector('nav') || document.querySelector('header');
      if(nav){
        btn = document.createElement('a'); btn.href="#"; btn.textContent="Entrar"; btn.setAttribute('data-action','open-login');
        btn.style.marginLeft='12px'; btn.style.cursor='pointer';
        // tenta colocar em menus ul>li
        const ul = nav.querySelector('ul');
        if(ul){ const li = document.createElement('li'); li.appendChild(btn); ul.appendChild(li); }
        else { nav.appendChild(btn); }
      } else {
        // fallback flutuante
        btn = document.createElement('button'); btn.textContent='Entrar'; btn.setAttribute('data-action','open-login');
        Object.assign(btn.style,{position:'fixed',right:'16px',bottom:'16px',padding:'10px 14px',borderRadius:'12px',background:'#000',color:'#fff',zIndex:40});
        document.body.appendChild(btn);
      }
    }
    btn.addEventListener('click', e=>{ e.preventDefault(); openModal(); });
  }

  function renderSession(){
    const u = getUser();
    const loginBtn = document.querySelector('[data-action="open-login"]');
    const accountBtn = document.querySelector('[data-action="open-account"]'); // caso exista
    if(u){
      if(accountBtn){ accountBtn.classList.remove('hidden'); accountBtn.href='carrinho.html#minha-conta'; accountBtn.textContent='Minha Conta'; }
      if(loginBtn){ loginBtn.textContent = (u.tipo==='colaborador'?'Administração':'Minha Conta'); loginBtn.onclick = (e)=>{
        e.preventDefault(); if(u.tipo==='colaborador'){ location.href='admin.html'; } else { location.href='carrinho.html#minha-conta'; }
      }; }
    }
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    ensureAdminSeed();
    mountModal();
    injectLoginButton();
    renderSession();
  });
})();
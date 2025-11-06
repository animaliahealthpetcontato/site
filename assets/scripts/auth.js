// assets/scripts/auth.js — v14 (Login Cliente + Colaborador + Google + Esqueci Senha + Mobile Fix Final)
(function () {
  const extra = `
  <style id="fp-auth-extra-style-v14">
    .fp-eye{position:absolute; right:12px; top:36px; cursor:pointer; font-size:13px; color:#6b7280}
    .fp-sep{margin:0 .25rem; color:#5bc0be; font-weight:600}
    .gbtn{display:flex; gap:.5rem; align-items:center; justify-content:center; width:100%; border:1px solid #e6e6e6; background:#fff; border-radius:12px; padding:.7rem 1rem; font-weight:600; cursor:pointer}
    .gbtn:hover{background:#f7f7f9}
    .gicon{width:18px;height:18px;display:inline-block;background:url('https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg') no-repeat center/contain}
    #loginModal{z-index:9999 !important;}
    .fp-modal-overlay{background:rgba(0,0,0,0.45);backdrop-filter:blur(4px);}
  </style>`;
  if (!document.getElementById("fp-auth-extra-style-v14")) {
    document.head.insertAdjacentHTML("beforeend", extra);
  }

  function openModal() {
    ensureModal();
    const m = document.getElementById("loginModal");
    if (m) {
      m.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal() {
    const m = document.getElementById("loginModal");
    if (m) {
      m.classList.add("hidden");
      document.body.style.overflow = "";
    }
  }

  function ensureModal() {
    if (document.getElementById("loginModal")) return;
    const w = document.createElement("div");
    w.id = "loginModal";
    w.className = "hidden fixed inset-0 z-50";
    w.innerHTML = `
    <div class="absolute inset-0 fp-modal-overlay" data-close="1"></div>
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <div class="fp-card w-full max-w-md relative" style="background:white;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.15)">
        <div class="flex items-center justify-between px-6 py-4" style="border-bottom:1px solid #eee">
          <div class="fp-modal-title" style="font-weight:700;font-size:1.1rem;color:#1b4070">Entrar na Farmácia Pet</div>
          <button class="fp-close" data-close="1" aria-label="Fechar" style="font-size:1.2rem">✕</button>
        </div>
        <div class="p-6">
          <div class="flex items-center justify-center gap-2 mb-4">
            <button class="fp-tab active" data-tab="cli" style="color:#1b4070">🐾 Cliente</button>
            <span class="fp-sep">/</span>
            <button class="fp-tab" data-tab="col" style="color:#1b4070">💼 Colaborador</button>
          </div>

          <div id="tab-cli">
            <label class="block mb-1" style="font-size:.85rem;color:#6b7280">E-mail</label>
            <input id="cli-email" class="fp-input mb-3" type="email" placeholder="email@exemplo.com" style="width:100%;padding:.6rem;border:1px solid #ddd;border-radius:8px">
            <div style="position:relative">
              <label class="block mb-1" style="font-size:.85rem;color:#6b7280">Senha</label>
              <input id="cli-senha" class="fp-input mb-1" type="password" placeholder="••••••••" style="width:100%;padding:.6rem;border:1px solid #ddd;border-radius:8px">
              <span class="fp-eye" data-eye="#cli-senha">👁️</span>
            </div>
            <div class="flex justify-between items-center mb-3" style="font-size:.85rem">
              <a href="#" id="link-forgot" style="color:#5bc0be">Esqueci minha senha</a>
            </div>
            <button id="btn-cli" class="fp-btn primary w-full" style="margin-bottom:.6rem;background:#1b4070;color:white;padding:.7rem;border-radius:10px;width:100%">Entrar</button>
            <button id="btn-g" class="gbtn"><span class="gicon"></span> Entrar com Google</button>
          </div>

          <div id="tab-col" class="hidden">
            <label class="block mb-1" style="font-size:.85rem;color:#6b7280">E-mail (colaborador)</label>
            <input id="col-email" class="fp-input mb-3" type="email" placeholder="colaborador@empresa.com" style="width:100%;padding:.6rem;border:1px solid #ddd;border-radius:8px">
            <div style="position:relative">
              <label class="block mb-1" style="font-size:.85rem;color:#6b7280">Senha</label>
              <input id="col-senha" class="fp-input mb-1" type="password" placeholder="••••••••" style="width:100%;padding:.6rem;border:1px solid #ddd;border-radius:8px">
              <span class="fp-eye" data-eye="#col-senha">👁️</span>
            </div>
            <button id="btn-col" class="fp-btn primary w-full" style="margin-top:.5rem;background:#1b4070;color:white;padding:.7rem;border-radius:10px;width:100%">Acessar painel</button>
          </div>

          <div id="forgot-area" class="hidden" style="margin-top:10px">
            <label class="block mb-1" style="font-size:.85rem;color:#6b7280">E-mail para redefinir</label>
            <input id="forgot-email" class="fp-input mb-2" type="email" placeholder="seu@email.com" style="width:100%;padding:.6rem;border:1px solid #ddd;border-radius:8px">
            <button id="btn-forgot" class="fp-btn primary w-full" style="background:#1b4070;color:white;padding:.7rem;border-radius:10px;width:100%">Enviar link de redefinição</button>
          </div>
        </div>
      </div>
    </div>`;
    document.body.appendChild(w);

    // Fechar modal
    w.addEventListener("click", (e) => { if (e.target.dataset.close) closeModal(); });

    // Alternar abas
    w.querySelectorAll(".fp-tab").forEach((b) => {
      b.addEventListener("click", () => {
        w.querySelectorAll(".fp-tab").forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        const t = b.dataset.tab;
        w.querySelector("#tab-cli").classList.toggle("hidden", t !== "cli");
        w.querySelector("#tab-col").classList.toggle("hidden", t !== "col");
      });
    });

    // Mostrar senha
    w.querySelectorAll(".fp-eye").forEach((icon) => {
      icon.addEventListener("click", () => {
        const input = w.querySelector(icon.dataset.eye);
        if (input) input.type = input.type === "password" ? "text" : "password";
      });
    });

    // Esqueci senha
    w.querySelector("#link-forgot").onclick = (e) => {
      e.preventDefault();
      w.querySelector("#tab-cli").classList.add("hidden");
      w.querySelector("#tab-col").classList.add("hidden");
      w.querySelector("#forgot-area").classList.remove("hidden");
    };

    // Reset senha
    w.querySelector("#btn-forgot").onclick = async () => {
      const email = w.querySelector("#forgot-email").value.trim();
      if (!email) return alert("Informe o e-mail");
      try {
        await window.fp.auth.sendPasswordResetEmail(email);
        alert("E-mail de redefinição enviado!");
        closeModal();
      } catch (err) { alert("Erro: " + (err.message || err)); }
    };

    // Login cliente
    w.querySelector("#btn-cli").onclick = async () => {
      const email = w.querySelector("#cli-email").value.trim();
      const senha = w.querySelector("#cli-senha").value.trim();
      if (!email || !senha) return alert("Preencha e-mail e senha");
      try {
        await window.fp.auth.signInWithEmailAndPassword(email, senha);
        closeModal();
        location.hash = "#minha-conta";
      } catch (err) { alert("Falha: " + (err.message || err)); }
    };

    // Login colaborador (mobile safe)
    w.querySelector("#btn-col").addEventListener("click", async (e) => {
      e.preventDefault();
      const email = w.querySelector("#col-email").value.trim();
      const senha = w.querySelector("#col-senha").value.trim();
      if (!email || !senha) return alert("Preencha e-mail e senha");

      const btn = w.querySelector("#btn-col");
      btn.disabled = true;
      btn.textContent = "Entrando...";
      document.activeElement?.blur();

      try {
        await window.fp.auth.signInWithEmailAndPassword(email, senha);
        setTimeout(() => { location.href = "admin.html"; }, 300);
      } catch (err) {
        alert("Erro: " + (err.message || err));
        btn.disabled = false;
        btn.textContent = "Acessar painel";
      }
    });

    // Login Google
    w.querySelector("#btn-g").onclick = async () => {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await window.fp.auth.signInWithPopup(provider);
        closeModal();
        location.hash = "#minha-conta";
      } catch (err) { alert("Erro Google: " + (err.message || err)); }
    };
  }

  // Substitui "Admin" → "Entrar"
  function injectLoginButton() {
    document.querySelectorAll("a,button").forEach((el) => {
      if ((el.textContent || "").match(/\bAdmin\b/i)) {
        el.textContent = "Entrar";
        el.setAttribute("data-action", "open-login");
        el.onclick = (e) => { e.preventDefault(); openModal(); };
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    ensureModal();
    injectLoginButton();
    window.fpAuthScanNav = injectLoginButton;
  });

  // MOBILE FIX — menus e eventos dinâmicos
  document.body.addEventListener("click", (e) => {
    const alvo = e.target.closest('[data-action="open-login"], .menu-item-login, a[href="#login"], button[data-login]');
    if (!alvo) return;
    e.preventDefault();
    const menu = document.querySelector(".menu.open, .menu-mobile.open, nav.open, .is-active");
    if (menu) menu.classList.remove("open", "is-active", "active");
    setTimeout(() => openModal(), 200);
  });
})();
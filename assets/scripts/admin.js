// assets/scripts/admin.js — v12 (Dashboard + CRUD Firestore)
(function(){
  function el(tag, attrs={}, children=[]){
    const e=document.createElement(tag);
    Object.entries(attrs).forEach(([k,v])=>{
      if(k==='class') e.className=v;
      else if(k==='html') e.innerHTML=v;
      else e.setAttribute(k,v);
    });
    (Array.isArray(children)?children:[children]).forEach(c=>{
      if(!c) return;
      if(typeof c==='string') e.appendChild(document.createTextNode(c));
      else e.appendChild(c);
    });
    return e;
  }

  function mountSkeleton(){
    let root=document.getElementById('admin-root');
    if(!root){ 
      root=el('div',{id:'admin-root',style:'padding:20px;max-width:1000px;margin:auto'}); 
      document.body.appendChild(root);
    }
    root.innerHTML='';

    root.append(
      el('div',{class:'card',html:'<h2 style="margin-bottom:1rem">📊 Visão geral</h2><div id="cards" class="grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px"></div>'}),
      el('div',{class:'card',html:'<h3 style="margin-top:2rem;margin-bottom:1rem">🛒 Produtos</h3><div id="produtos"></div><hr style="margin:12px 0"><h4 style="margin-bottom:.5rem">Cadastrar novo produto</h4>'}),
    );

    // Formulário de novo produto
    const form = el('form',{id:'form-prod',style:'display:grid;gap:8px;grid-template-columns:repeat(auto-fit,minmax(180px,1fr))'},
      [
        el('input',{type:'text',placeholder:'Nome do produto',id:'p-nome',required:true,style:'padding:8px;border:1px solid #ddd;border-radius:8px'}),
        el('input',{type:'number',placeholder:'Preço (R$)',id:'p-preco',step:'0.01',required:true,style:'padding:8px;border:1px solid #ddd;border-radius:8px'}),
        el('input',{type:'number',placeholder:'Estoque',id:'p-estoque',required:true,style:'padding:8px;border:1px solid #ddd;border-radius:8px'}),
        el('input',{type:'text',placeholder:'URL da imagem',id:'p-img',style:'padding:8px;border:1px solid #ddd;border-radius:8px'}),
        el('textarea',{placeholder:'Descrição do produto',id:'p-desc',style:'grid-column:1/-1;padding:8px;border:1px solid #ddd;border-radius:8px'}),
        el('button',{type:'submit',style:'background:#1b4070;color:#fff;border:0;padding:10px;border-radius:8px;cursor:pointer;grid-column:1/-1'},'Salvar produto')
      ]
    );
    root.querySelector('.card:last-child').append(form);

    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const p={
        name: document.getElementById('p-nome').value.trim(),
        price: parseFloat(document.getElementById('p-preco').value||0),
        stock: parseInt(document.getElementById('p-estoque').value||0,10),
        imageUrl: document.getElementById('p-img').value.trim()||'',
        description: document.getElementById('p-desc').value.trim()
      };
      if(!p.name) return alert('Nome é obrigatório');
      try{
        const id = await window.fp.store.addProduct(p);
        if(window.analyticsEvents) analyticsEvents.viewProduct(id,p.name,p.price);
        await loadProducts();
        e.target.reset();
        alert('Produto salvo com sucesso!');
      }catch(err){ alert('Erro ao salvar: '+(err.message||err)); }
    });
  }

  async function loadDashboard(){
    const cards = document.getElementById('cards');
    const [prods, orders] = await Promise.all([
      window.fp.store.listProducts(10), 
      window.fp.store.listOrders(10)
    ]);
    const total = orders.reduce((s,o)=> s + (o.total || 0), 0);
    cards.innerHTML='';
    const c = (title,val)=> el('div',{class:'card',style:'background:#fff;border:1px solid #eee;border-radius:12px;padding:12px;box-shadow:0 3px 8px rgba(0,0,0,.04)'},[
      el('div',{html:`<div style="font-size:.85rem;color:#6b7280">${title}</div><div style="font-size:1.6rem;font-weight:700">${val}</div>`})
    ]);
    cards.append(
      c('Produtos cadastrados', prods.length),
      c('Pedidos recentes', orders.length),
      c('Faturamento total', 'R$ '+ total.toFixed(2))
    );
  }

  async function loadProducts(){
    const box = document.getElementById('produtos');
    const list = await window.fp.store.listProducts();
    box.innerHTML='';
    if(!list.length){ 
      box.innerHTML = '<p style="color:#6b7280">Nenhum produto cadastrado ainda.</p>'; 
      return; 
    }
    list.forEach(p=>{
      const row = el('div',{style:'display:flex;align-items:center;gap:12px;border-bottom:1px solid #eee;padding:8px 0'},
        [
          el('img',{src:p.imageUrl||'https://placehold.co/60x60',alt:'',style:'width:48px;height:48px;object-fit:cover;border-radius:8px;border:1px solid #eee'}),
          el('div',{style:'flex:1'},[
            el('div',{html:`<strong>${p.name}</strong> — R$ ${Number(p.price||0).toFixed(2)}`}),
            el('div',{html:`<small style="color:#6b7280">Estoque: ${p.stock||0}</small>`})
          ]),
          el('button',{style:'background:#1b4070;color:#fff;border:0;border-radius:6px;padding:6px 10px;cursor:pointer',onclick: async()=>{
            const novo = prompt('Novo preço (R$):', p.price);
            if(novo!==null){
              await fp.store.updateProduct(p.id,{price: parseFloat(novo)});
              await loadProducts();
            }
          }},'Editar'),
          el('button',{style:'background:#c53b3b;color:#fff;border:0;border-radius:6px;padding:6px 10px;cursor:pointer',onclick: async()=>{
            if(confirm('Excluir produto?')){
              await fp.store.deleteProduct(p.id);
              await loadProducts();
            }
          }},'Excluir')
        ]
      );
      box.append(row);
    });
  }

  async function init(){
    if(!window.fp?.db){ console.warn('Firebase não carregado ainda.'); return; }
    mountSkeleton();
    await loadDashboard();
    await loadProducts();
  }

  if(document.readyState!=='loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();

const BRL = v => v.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
const qs = (s,el=document)=>el.querySelector(s);

function toggleMobileMenu(){const m=qs('#mobile-menu'),mi=qs('#menu-icon'),ci=qs('#close-icon');if(m.classList.contains('-translate-y-full')){m.classList.remove('-translate-y-full','opacity-0','invisible');m.classList.add('translate-y-0','opacity-100','visible');mi.classList.add('hidden');ci.classList.remove('hidden');}else{m.classList.add('-translate-y-full','opacity-0','invisible');m.classList.remove('translate-y-0','opacity-100','visible');mi.classList.remove('hidden');ci.classList.add('hidden');}}
function closeMobileMenu(){const m=qs('#mobile-menu');if(!m)return;m.classList.add('-translate-y-full','opacity-0','invisible');m.classList.remove('translate-y-0','opacity-100','visible');qs('#menu-icon')?.classList.remove('hidden');qs('#close-icon')?.classList.add('hidden');}

function realizarBusca(){const t=qs('#search-input')?.value?.trim();if(!t)return;localStorage.setItem('busca',t);window.location.href='index.html#busca';}
function realizarBuscaMobile(){const t=qs('#search-input-mobile')?.value?.trim();if(!t)return;localStorage.setItem('busca',t);closeMobileMenu();window.location.href='index.html#busca';}

const SENHA_ADMIN='11Marco@2023';
let produtosBase=[],produtosAtivos=[];

async function carregarProdutos(){try{const res=await fetch('assets/scripts/produtos.json',{cache:'no-store'});produtosBase=await res.json();}catch(e){produtosBase=[];}const salvos=JSON.parse(localStorage.getItem('produtos')||'[]');const map=new Map(produtosBase.map(p=>[p.id,p]));for(const p of salvos){map.set(p.id,p);}produtosAtivos=Array.from(map.values());}

function renderCategoria(){const cat=window.PAGE_CATEGORY;const wrap=qs('#produtos-container');if(!cat||!wrap)return;const termo=(localStorage.getItem('busca')||'').toLowerCase();const list=produtosAtivos.filter(p=>p.categoria===cat).filter(p=>termo?(p.nome.toLowerCase().includes(termo)||p.descricao.toLowerCase().includes(termo)):true);wrap.innerHTML=list.map(p=>`
  <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col">
    <div class="h-40 bg-gray-100 mb-4 rounded-xl overflow-hidden flex items-center justify-center">
      <img src="${p.imagem}" alt="${p.nome}" class="object-cover max-h-full">
    </div>
    <h3 class="font-black text-navy mb-1">${p.nome}</h3>
    <p class="text-gray-600 text-sm mb-4">${p.descricao}</p>
    <div class="mt-auto">
      <div class="flex items-center justify-between mb-2">
        <span class="text-tiffany-dark font-black text-lg">${BRL(p.preco)}</span>
        <span class="text-sm ${p.estoque>0?'text-emerald-600':'text-rose-600'}">Estoque: ${p.estoque}</span>
      </div>
      <button ${p.estoque<=0?'disabled':''}
        class="w-full ${p.estoque>0?'bg-gradient-to-r from-tiffany to-cyan-600':'bg-gray-300'} text-white px-4 py-2 rounded-full font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-60"
        onclick="adicionarAoCarrinho(${p.id})">Adicionar</button>
    </div>
  </div>`).join('')||`<div class="text-gray-500">Nenhum produto encontrado nesta categoria.</div>`;}

function getCarrinho(){return JSON.parse(localStorage.getItem('carrinho')||'[]');}
function setCarrinho(c){localStorage.setItem('carrinho',JSON.stringify(c));}

function adicionarAoCarrinho(id){const p=produtosAtivos.find(x=>x.id===id);if(!p||p.estoque<=0)return;const c=getCarrinho();const it=c.find(i=>i.id===id);if(it){it.qtd+=1;}else{c.push({id:id,qtd:1});}setCarrinho(c);const idx=produtosAtivos.findIndex(x=>x.id===id);if(idx>=0){produtosAtivos[idx].estoque=Math.max(0,produtosAtivos[idx].estoque-1);}localStorage.setItem('produtos',JSON.stringify(produtosAtivos));alert('Produto adicionado ao carrinho!');renderCategoria();}

let descontoValor=0,freteValor=0;
function renderCarrinho(){const wrap=qs('#cart-items');if(!wrap)return;const c=getCarrinho();const rows=c.map(ci=>{const p=produtosAtivos.find(pp=>pp.id===ci.id);if(!p)return'';const totalItem=p.preco*ci.qtd;return`
  <div class="p-6 flex items-center gap-4" data-id="${p.id}">
    <div class="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
      <img src="${p.imagem}" alt="${p.nome}" class="object-cover max-h-full">
    </div>
    <div class="flex-1">
      <h4 class="font-bold text-navy">${p.nome}</h4>
      <p class="text-sm text-gray-500">${p.categoria}</p>
      <button class="text-rose-600 text-sm mt-1" onclick="removerItemCarrinho(${p.id})">Remover</button>
    </div>
    <div class="flex items-center gap-3">
      <button class="px-3 py-1 rounded-lg border" onclick="alterarQtdCarrinho(${p.id},-1)">−</button>
      <input type="number" class="w-14 text-center border rounded-lg qtd-cart" value="${ci.qtd}" min="1" onchange="setQtdCarrinho(${p.id}, this.value)">
      <button class="px-3 py-1 rounded-lg border" onclick="alterarQtdCarrinho(${p.id},1)">+</button>
    </div>
    <div class="w-28 text-right">
      <div class="text-gray-500 text-sm">Preço</div>
      <div class="font-bold">${BRL(p.preco)}</div>
      <div class="text-gray-500 text-sm">Total</div>
      <div class="font-black text-navy total-item">${BRL(totalItem)}</div>
    </div>
  </div>`;}).join('');wrap.innerHTML=rows||`<div class="p-6 text-gray-500">Seu carrinho está vazio.</div>`;recalcularTotaisCarrinho();}
function subtotalCarrinho(){const c=getCarrinho();let s=0;for(const ci of c){const p=produtosAtivos.find(pp=>pp.id===ci.id);if(p)s+=p.preco*ci.qtd;}return s;}
function recalcularTotaisCarrinho(){const s=subtotalCarrinho();qs('#subtotal')&&(qs('#subtotal').textContent=BRL(s));qs('#desconto')&&(qs('#desconto').textContent=BRL(descontoValor));qs('#frete')&&(qs('#frete').textContent=BRL(freteValor));const total=Math.max(0,s-descontoValor)+freteValor;qs('#total')&&(qs('#total').textContent=BRL(total));}
function alterarQtdCarrinho(id,d){const c=getCarrinho();const it=c.find(i=>i.id===id);if(!it)return;it.qtd=Math.max(1,it.qtd+d);setCarrinho(c);renderCarrinho();}
function setQtdCarrinho(id,val){const c=getCarrinho();const it=c.find(i=>i.id===id);if(!it)return;it.qtd=Math.max(1,parseInt(val||'1',10));setCarrinho(c);renderCarrinho();}
function removerItemCarrinho(id){const c=getCarrinho().filter(i=>i.id!==id);setCarrinho(c);renderCarrinho();}
function aplicarCupom(){const cp=(qs('#cupom')?.value||'').trim().toUpperCase();descontoValor=0;if(cp==='BEMVINDO'){descontoValor=subtotalCarrinho()*0.10;qs('#cupom-info').textContent='Cupom aplicado: 10% de desconto.';}else if(cp){qs('#cupom-info').textContent='Cupom inválido.';}recalcularTotaisCarrinho();}
function calcularFrete(){const cep=(qs('#cep')?.value||'').replace(/\D/g,'');freteValor=0;if(cep.length>=8){freteValor=subtotalCarrinho()>149?0:19.90;qs('#frete-info').textContent=freteValor===0?'Frete grátis aplicado.':'Frete estimado: '+BRL(freteValor);}else{qs('#frete-info').textContent='CEP inválido.';}recalcularTotaisCarrinho();}

function adminLogin(){const pass=qs('#admin-pass')?.value||'';if(pass==='11Marco@2023'){qs('#admin-guard')?.classList.add('hidden');}else{qs('#admin-msg').textContent='Senha incorreta.';}}
function produtosList(){return produtosAtivos.slice().sort((a,b)=>a.id-b.id);}
function salvarProdutosLocal(){localStorage.setItem('produtos',JSON.stringify(produtosAtivos));}
function renderTabela(){const tb=qs('#admin-tabela');if(!tb)return;const termo=(qs('#admin-busca')?.value||'').toLowerCase();const rows=produtosList().filter(p=>!termo||p.nome.toLowerCase().includes(termo)).map(p=>`
  <tr class="border-top">
    <td class="p-2">${p.id}</td>
    <td class="p-2">${p.nome}</td>
    <td class="p-2"><span class="badge">${p.categoria}</span></td>
    <td class="p-2">${BRL(p.preco)}</td>
    <td class="p-2">${p.estoque}</td>
    <td class="p-2 space-x-2">
      <button class="px-3 py-1 rounded-xl border" onclick="editarProduto(${p.id})">Editar</button>
      <button class="px-3 py-1 rounded-xl border text-rose-600" onclick="excluirProduto(${p.id})">Excluir</button>
    </td>
  </tr>`).join('');tb.innerHTML=rows||`<tr><td class="p-2 text-gray-500" colspan="6">Nenhum produto.</td></tr>`;}
function limparForm(){qs('#p-id').value='';['#p-nome','#p-preco','#p-estoque','#p-imagem','#p-desc'].forEach(s=>qs(s).value='');qs('#p-categoria').selectedIndex=0;}
function salvarProduto(){const id=parseInt(qs('#p-id').value||'0',10);const novo={id:id||(Math.max(0,...produtosAtivos.map(p=>p.id))+1),nome:qs('#p-nome').value.trim(),preco:parseFloat(qs('#p-preco').value||'0'),estoque:parseInt(qs('#p-estoque').value||'0',10),imagem:qs('#p-imagem').value.trim()||'assets/imagens/placeholder.jpg',categoria:qs('#p-categoria').value,descricao:qs('#p-desc').value.trim()};const idx=produtosAtivos.findIndex(p=>p.id===novo.id);if(idx>=0)produtosAtivos[idx]=novo;else produtosAtivos.push(novo);salvarProdutosLocal();limparForm();renderTabela();alert('Produto salvo.');}
function editarProduto(id){const p=produtosAtivos.find(x=>x.id===id);if(!p)return;qs('#p-id').value=p.id;qs('#p-nome').value=p.nome;qs('#p-preco').value=p.preco;qs('#p-estoque').value=p.estoque;qs('#p-imagem').value=p.imagem;qs('#p-categoria').value=p.categoria;qs('#p-desc').value=p.descricao;window.scrollTo({top:0,behavior:'smooth'});}
function excluirProduto(id){if(!confirm('Excluir este produto?'))return;produtosAtivos=produtosAtivos.filter(p=>p.id!==id);salvarProdutosLocal();renderTabela();}
function baixarJSON(){const blob=new Blob([JSON.stringify(produtosAtivos,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='produtos.json';a.click();URL.revokeObjectURL(a.href);}

document.addEventListener('DOMContentLoaded',async()=>{await carregarProdutos();renderCategoria();renderCarrinho();renderTabela();});

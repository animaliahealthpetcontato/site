
// store.js — helpers para armazenamento (localStorage)
const FP_KEYS = {
  products: 'fp_products',
  orders: 'fp_orders',
  visits: 'fp_visits',
  user: 'fp_user',
  colaboradores: 'fp_colaboradores'
};

function fp_read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch(e){ return fallback; }
}
function fp_write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

// Produtos
function fp_getProducts(){ return fp_read(FP_KEYS.products, []); }
function fp_setProducts(arr){ fp_write(FP_KEYS.products, arr); }

// Pedidos
function fp_getOrders(){ return fp_read(FP_KEYS.orders, []); }
function fp_addOrder(o){ const arr = fp_getOrders(); arr.push(o); fp_write(FP_KEYS.orders, arr); }

// Visitas
function fp_recordVisit(page){
  const today = new Date().toISOString().slice(0,10);
  const v = fp_read(FP_KEYS.visits, {});
  v[page] = v[page] || { total: 0, byDate: {} };
  v[page].total++;
  v[page].byDate[today] = (v[page].byDate[today]||0)+1;
  fp_write(FP_KEYS.visits, v);
}
function fp_getVisits(){ return fp_read(FP_KEYS.visits, {}); }

// Colaboradores
function fp_getColabs(){ return fp_read(FP_KEYS.colaboradores, []); }
function fp_setColabs(arr){ fp_write(FP_KEYS.colaboradores, arr); }

// Seed inicial se vazio
(function seed(){
  if(fp_getProducts().length===0){
    fp_setProducts([
      {id:1, nome:"Vita Pet Complete", preco:79.9, estoque:15, categoria:"Vitaminas & Minerais", imagem:"", descricao:"Suplemento completo para saúde geral."},
      {id:2, nome:"Probiótico Avançado", preco:59.9, estoque:20, categoria:"Probióticos Avançados", imagem:"", descricao:"Equilíbrio intestinal e imunidade."}
    ]);
  }
  if(fp_getColabs().length===0){
    fp_setColabs([{ id:1, nome:"Administrador", email:"admin@santini.com", nivel:"Administrador", senha:"adm-seed" }]);
  }
})();
// assets/scripts/firestore.js — v12 (CRUD Firestore: products, orders, staff)
(function(){
  if(!window.fp) window.fp = {};
  const db = () => window.fp.db;

  const col = {
    products: () => db().collection('products'),
    orders:   () => db().collection('orders'),
    staff:    () => db().collection('staff')
  };

  // 📦 PRODUCTS
  async function addProduct(p){ 
    const ref = await col.products().add({ 
      ...p, 
      createdAt: firebase.firestore.FieldValue.serverTimestamp() 
    }); 
    return ref.id; 
  }
  async function updateProduct(id,p){ 
    await col.products().doc(id).set(p,{merge:true}); 
  }
  async function deleteProduct(id){ 
    await col.products().doc(id).delete(); 
  }
  async function listProducts(limit){ 
    let q=col.products().orderBy('createdAt','desc'); 
    if(limit) q=q.limit(limit); 
    const snap=await q.get(); 
    return snap.docs.map(d=>({id:d.id, ...d.data()})); 
  }

  // 🧾 ORDERS
  async function addOrder(o){ 
    const ref = await col.orders().add({ 
      ...o, 
      createdAt: firebase.firestore.FieldValue.serverTimestamp() 
    }); 
    return ref.id; 
  }
  async function listOrders(limit){ 
    let q=col.orders().orderBy('createdAt','desc'); 
    if(limit) q=q.limit(limit); 
    const snap=await q.get(); 
    return snap.docs.map(d=>({id:d.id, ...d.data()})); 
  }

  // 👩‍💼 STAFF
  async function addStaff(s){ 
    const ref = await col.staff().add({ 
      ...s, 
      createdAt: firebase.firestore.FieldValue.serverTimestamp() 
    }); 
    return ref.id; 
  }
  async function listStaff(){ 
    const snap=await col.staff().orderBy('createdAt','desc').get(); 
    return snap.docs.map(d=>({id:d.id, ...d.data()})); 
  }

  // Expor funções globalmente
  window.fp.store = {
    addProduct, updateProduct, deleteProduct, listProducts,
    addOrder, listOrders,
    addStaff, listStaff
  };
})();
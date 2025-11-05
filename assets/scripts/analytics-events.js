// assets/scripts/analytics-events.js — v12 (GA4 helpers)
(function(){
  const log = (name, params={}) => {
    try{
      if(window.fp?.analytics && window.fp.analytics.logEvent){
        window.fp.analytics.logEvent(name, params);
      } else if (window.gtag){ 
        gtag('event', name, params); 
      }
    }catch(e){}
  };

  // Funções de evento GA4
  window.analyticsEvents = {
    viewProduct: (id, name, price) =>
      log('view_item', { items:[{ item_id:id, item_name:name, price }] }),
    addToCart: (id, name, price, qty=1) =>
      log('add_to_cart', { items:[{ item_id:id, item_name:name, price, quantity:qty }] }),
    beginCheckout: (value) =>
      log('begin_checkout', { value }),
    purchase: (orderId, value) =>
      log('purchase', { transaction_id:orderId, value }),
    login: (method) =>
      log('login', { method }),
    signup: (method) =>
      log('sign_up', { method }),
    page: (page) =>
      log('page_view', { page_location: page || location.pathname })
  };

  // Dispara automaticamente quando o usuário acessa uma página
  if(document.readyState!=='loading')
    analyticsEvents.page();
  else
    document.addEventListener('DOMContentLoaded', ()=>analyticsEvents.page());
})();
// assets/scripts/firebase-config.js — v12 (Firebase + GA4 + Firestore)
(function () {
  function add(src) {
    return new Promise((res) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = res;
      document.head.appendChild(s);
    });
  }
  (async function () {
    if (!window.firebase || !firebase.apps) {
      await add("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
      await add("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js");
      await add("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js");
      await add("https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics-compat.js");
    }
    const firebaseConfig = {
      apiKey: "AIzaSyBehpD8Vug88gd3cGD7wIaP_ciJFKThQuM",
      authDomain: "animaliahealthpetsite.firebaseapp.com",
      projectId: "animaliahealthpetsite",
      storageBucket: "animaliahealthpetsite.firebasestorage.app",
      messagingSenderId: "429738325731",
      appId: "1:429738325731:web:e24c8ac2a8373f0093f7d6",
      measurementId: "G-W47G2R7590"
    };
    if (firebase.apps?.length === 0) {
      firebase.initializeApp(firebaseConfig);
      try { firebase.analytics(); } catch (e) {}
    }
    window.fp = window.fp || {};
    window.fp.db = firebase.firestore();
    window.fp.auth = firebase.auth();
    window.fp.analytics = firebase.analytics ? firebase.analytics() : null;
  })();
})();
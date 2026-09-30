/*
 * طبقة ربط Firebase — لا تُنشئ قاعدة البيانات ولا تكتب فيها.
 * تُرجع البيانات بنفس الشكل الذي تحتاجه الواجهة.
 */
(function () {
  function isConfigured(settings) {
    return settings && settings.enabled && settings.config &&
      settings.config.apiKey && !settings.config.apiKey.includes("ضع_");
  }

  function normalizeProduct(id, data) {
    return {
      id: id || data.id || crypto.randomUUID(),
      name: data.name || data.title || "منتج",
      category: data.category || data.type || "مختاراتنا",
      description: data.description || data.details || "",
      price: Number(data.price || 0),
      currency: data.currency || "ل.س",
      tag: data.tag || data.badge || "متوفر",
      imageUrl: data.imageUrl || data.image || data.photoURL || ""
    };
  }

  async function loadFirestore(settings) {
    const appModule = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
    const firestoreModule = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
    const app = appModule.initializeApp(settings.config);
    const db = firestoreModule.getFirestore(app);
    const snapshot = await firestoreModule.getDocs(firestoreModule.collection(db, settings.collection || "products"));
    return snapshot.docs.map(function (doc) { return normalizeProduct(doc.id, doc.data()); });
  }

  async function loadRealtimeDatabase(settings) {
    const baseUrl = String(settings.config.databaseURL || "").replace(/\/$/, "");
    if (!baseUrl || baseUrl.includes("ضع_")) throw new Error("Firebase databaseURL غير موجود.");
    const response = await fetch(baseUrl + "/" + (settings.realtimePath || "products") + ".json");
    if (!response.ok) throw new Error("تعذر قراءة Realtime Database.");
    const data = await response.json();
    if (!data) return [];
    if (Array.isArray(data)) return data.map(function (item, index) { return normalizeProduct(String(index), item || {}); });
    return Object.entries(data).map(function (entry) { return normalizeProduct(entry[0], entry[1] || {}); });
  }

  window.loadProductsFromFirebase = async function () {
    const settings = window.FIREBASE_SETTINGS;
    if (!isConfigured(settings)) return null;
    if (settings.type === "realtime-database") return loadRealtimeDatabase(settings);
    return loadFirestore(settings);
  };
}());
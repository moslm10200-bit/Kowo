/*
 * إعداد Firebase الاختياري.
 *
 * 1) املأ بيانات مشروعك من Firebase Console.
 * 2) غيّر enabled إلى true.
 * 3) اختر firestore أو realtime-database.
 *
 * لا تضع أي مفتاح سري هنا. Firebase Web API key يمكن أن يكون ظاهرًا
 * في الواجهة، مع ضبط قواعد الأمان من Firebase Console.
 */
window.FIREBASE_SETTINGS = {
  enabled: false,
  type: "firestore",
  collection: "products",
  realtimePath: "products",
  config: {
    apiKey: "ضع_apiKey_هنا",
    authDomain: "ضع_authDomain_هنا",
    projectId: "ضع_projectId_هنا",
    storageBucket: "ضع_storageBucket_هنا",
    messagingSenderId: "ضع_messagingSenderId_هنا",
    appId: "ضع_appId_هنا",
    databaseURL: "ضع_databaseURL_هنا"
  }
};
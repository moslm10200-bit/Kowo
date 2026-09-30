# السكب — واجهة متجر جاهزة لـ Netlify

هذه نسخة ثابتة من موقع **السكب**. لا تحتوي على قاعدة بيانات من طرفنا كما طلبت؛ تعرض بيانات تجريبية مؤقتة، وتحتوي على طبقة ربط اختيارية مع Firebase حتى تستبدلها ببياناتك أنت.

## الملفات المهمة

- `index.html` — هيكل الصفحة والمكونات.
- `styles.css` — التصميم المتجاوب، الألوان، البطاقات، النافذة، والسلة.
- `app.js` — التفاعل، السحب، السلة، ورسالة واتساب.
- `products.js` — منتجات تجريبية يمكنك تعديلها أو تركها للمعاينة.
- `firebase-config.js` — مكان إعداد مشروع Firebase الخاص بك.
- `firebase-adapter.js` — جلب المنتجات من Firestore أو Realtime Database فقط، من دون إنشاء قاعدة البيانات.
- `netlify.toml` — إعداد النشر على Netlify.

## النشر على Netlify

1. فك ضغط الملف.
2. ارفع المجلد إلى Netlify Drop أو اربطه بمستودع Git.
3. اترك أمر البناء فارغًا، ومجلد النشر هو جذر المشروع (`.`).
4. الموقع سيعمل مباشرة بالمنتجات التجريبية.

## ربط Firestore

في `firebase-config.js`:

```js
window.FIREBASE_SETTINGS = {
  enabled: true,
  type: "firestore",
  collection: "products",
  config: {
    apiKey: "…",
    authDomain: "…",
    projectId: "…",
    storageBucket: "…",
    messagingSenderId: "…",
    appId: "…"
  }
};
```

أنشئ مجموعة باسم `products`، واجعل كل مستند يحتوي على:

| الحقل | النوع | مثال |
|---|---|---|
| `name` | نص | مجموعة الصباح |
| `category` | نص | اختيار اليوم |
| `description` | نص | وصف المنتج |
| `price` | رقم | 185000 |
| `currency` | نص | ل.س |
| `tag` | نص | الأكثر طلبًا |
| `imageUrl` | نص | رابط الصورة العام |

يمكن استخدام `title` بدل `name`، و`image` أو `photoURL` بدل `imageUrl` أيضًا.

## ربط Realtime Database

غيّر `type` إلى `realtime-database` وأضف `databaseURL`:

```js
window.FIREBASE_SETTINGS = {
  enabled: true,
  type: "realtime-database",
  realtimePath: "products",
  config: {
    apiKey: "…",
    authDomain: "…",
    projectId: "…",
    storageBucket: "…",
    messagingSenderId: "…",
    appId: "…",
    databaseURL: "https://YOUR-PROJECT-default-rtdb.firebaseio.com"
  }
};
```

تستطيع تخزين المنتجات بهذا الشكل:

```json
{
  "products": {
    "product-1": {
      "name": "مجموعة الصباح",
      "category": "اختيار اليوم",
      "description": "وصف المنتج",
      "price": 185000,
      "currency": "ل.س",
      "tag": "الأكثر طلبًا",
      "imageUrl": "https://example.com/product.jpg"
    }
  }
}
```

## واتساب

الرقم مضبوط حاليًا على `963992147669`. عند الضغط على **الشراء عبر واتساب**، يُفتح رابط مباشر للمحادثة مع رسالة جاهزة تحتوي لكل منتج:

- اسم المنتج
- السعر
- رابط الصورة القادم من Firebase
- الإجمالي

لتغيير الرقم، عدّل `whatsappNumber` في `app.js` بصيغة دولية من دون `+` أو مسافات.

## ملاحظات مهمة

- رابط الصورة في Firebase يجب أن يكون رابطًا عامًا يبدأ بـ `https://` حتى يظهر للعميل وحتى يستطيع واتساب قراءته.
- فعّل قواعد قراءة مناسبة في Firebase. هذه الواجهة تقرأ المنتجات فقط ولا تنشئ أو تعدّل أو تحذف أي بيانات.
- خط الشعار يستخدم `Aref Ruqaa Ink` مع بديل `Diwani Letter`. إذا كان لديك ملف خط ديواني مرخّص، يمكن إضافته واستبدال اسم الخط في `styles.css`.
- جميع أبعاد الصفحة الأساسية مضبوطة على عرض كامل `100vw` مع `max-width: 100%` ومن دون هوامش جانبية للموقع نفسه.
# نشر تطبيق Iqama Labels على Cloudflare Pages

## الطرق المتاحة للنشر:

### 1️⃣ النشر عبر GitHub (الطريقة الموصى بها) 🌟

#### الخطوة الأولى: رفع المشروع على GitHub
```powershell
# تهيئة Git (إذا لم يكن مهيأ)
git init

# إضافة جميع الملفات
git add .

# عمل commit
git commit -m "Initial commit - Ready for Cloudflare Pages deployment"

# ربط المشروع بـ GitHub repository (استبدل YOUR_USERNAME بحسابك)
git remote add origin https://github.com/YOUR_USERNAME/iqama-labels.git

# رفع المشروع
git push -u origin main
```

#### الخطوة الثانية: ربط Cloudflare Pages مع GitHub
1. اذهب إلى [Cloudflare Dashboard](https://dash.cloudflare.com)
2. اختر **Pages** من القائمة الجانبية
3. اضغط **Create a project**
4. اختر **Connect to Git**
5. اربط حساب GitHub الخاص بك
6. اختر repository: `iqama-labels`
7. استخدم الإعدادات التالية:

**Build Settings:**
- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`

8. اضغط **Save and Deploy**

---

### 2️⃣ النشر المباشر عبر Wrangler CLI ⚡

#### تثبيت Wrangler (أداة Cloudflare CLI)
```powershell
# تثبيت Wrangler عالمياً
npm install -g wrangler

# تسجيل الدخول إلى Cloudflare
wrangler login
```

#### بناء المشروع
```powershell
# بناء التطبيق
npm run build
```

#### نشر المشروع
```powershell
# نشر المشروع على Cloudflare Pages
wrangler pages deploy dist --project-name=iqama-labels
```

---

### 3️⃣ النشر عبر واجهة Cloudflare (Drag & Drop) 📤

1. قم ببناء المشروع:
```powershell
npm run build
```

2. اذهب إلى [Cloudflare Pages Dashboard](https://dash.cloudflare.com/pages)
3. اضغط **Create a project**
4. اختر **Upload assets**
5. قم بسحب وإفلات مجلد `dist` كاملاً
6. اختر اسم المشروع: `iqama-labels`
7. اضغط **Deploy site**

---

## 🔧 إعدادات البناء (Build Settings)

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node version:** `18.17.0` (محدد في `.node-version`)
- **Install command:** `npm install`

---

## 📝 ملاحظات مهمة

### متغيرات البيئة (Environment Variables)
إذا كنت تستخدم أي متغيرات بيئية، أضفها في إعدادات المشروع:
1. اذهب إلى Project Settings
2. اختر **Environment variables**
3. أضف المتغيرات المطلوبة

### Custom Domain
لربط دومين مخصص:
1. اذهب إلى **Custom domains**
2. اضغط **Set up a custom domain**
3. اتبع التعليمات

---

## ✅ التحقق من النشر

بعد النشر الناجح:
- ستحصل على رابط مثل: `https://iqama-labels.pages.dev`
- يمكنك مشاركة هذا الرابط مع أي شخص
- التطبيق سيكون متاح على الإنترنت مباشرة

---

## 🔄 التحديثات التلقائية

إذا استخدمت طريقة GitHub:
- كل push جديد سيؤدي إلى build ونشر تلقائي
- يمكنك متابعة حالة البناء في Cloudflare Dashboard
- كل commit سيحصل على رابط معاينة خاص

---

## 🚀 الأوامر السريعة

```powershell
# بناء للإنتاج
npm run build

# معاينة محلية للبناء
npm run preview

# تشغيل في وضع التطوير
npm run dev

# نشر مباشر (بعد تثبيت wrangler)
wrangler pages deploy dist --project-name=iqama-labels
```

---

## 🆘 المساعدة والدعم

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

**ملاحظة:** التطبيق جاهز للنشر ويعمل بشكل كامل كـ Static Site (SPA) بدون الحاجة إلى backend.

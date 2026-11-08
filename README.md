# مشكاة — القرآن الكريم

تجربة قراءة واستماع حديثة للقرآن الكريم، مبنية على **Next.js 16** و **AlQuran Cloud API**.
الواجهة عربية بالكامل (RTL)، برسم عثماني وتلاوات مختارة، مع حفظ موضع القراءة والمحفوظات
على جهاز المستخدم.

## المزايا

- فهرس ١١٤ سورة مع بحث forgiving بالاسم أو الرقم وتصفية مكية/مدنية.
- صفحة قراءة لكل سورة بالرسم العثماني (`quran-uthmani`) بأسلوب صفحة المصحف المتصلة،
  مع فاصل رقم الآية وعلامات السجود.
- مشغل صوت متصل آية بآية: تشغيل/إيقاف، السابق/التالي، تكرار الآية، سرعة التلاوة، مستوى
  الصوت، والتمرير التلقائي إلى الآية الحالية.
- اختيار القارئ (١٧ قارئًا برواية حفص) مع حفظ الاختيار في الرابط وفي `localStorage`،
  و fallback تلقائي للجودة الأدنى عند فشل الملف.
- حفظ آخر موضع قراءة تلقائيًا، ومحفوظات للآيات على الجهاز، ووضع ليلي، وتحكم في حجم
  الخط ونوعه.
- دعم `Media Session` (أزرار التشغيل على شاشة القفل) واختصارات لوحة المفاتيح.
- SEO: صفحات ثابتة لكل سورة، metadata وJSON-LD، sitemap وrobots.

## التشغيل

```bash
npm install
cp .env.example .env.local   # على Windows: copy .env.example .env.local
npm run dev
```

ثم افتح <http://localhost:3000>.

### المتغيرات

| المتغير | الوصف |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | رابط الموقع العام (canonical / sitemap / robots). |

## البناء

```bash
npm run build
npm run start
```

الصفحات تُبنى مسبقًا (`generateStaticParams`) ويُخزَّن نص السور عبر `use cache` لمدة
طويلة، بينما تُحدَّث آية اليوم كل ساعة.

## البيانات والصوت

- نص القرآن: محفوظ محليًا في `src/data/quran.json` بعد تنزيله من
  `https://api.alquran.cloud/v1/surah/{number}/quran-uthmani`، لضمان سرعة الصفحات
  وثبات البناء وتجنب حدود الـ API.
- الصوت: `https://cdn.islamic.network/quran/audio/{bitrate}/{reciter}/{globalAyah}.mp3`

لتحديث البيانات من المصدر:

```bash
node scripts/fetch-quran.mjs   # نص القرآن
node scripts/fetch-surahs.mjs  # فهرس السور
```

## البنية

```
src/
  app/                 # الصفحات (App Router)
  components/          # الواجهة
  components/reading/  # مشغل الصوت وصفحة القراءة
  data/surahs.json     # فهرس السور
  data/quran.json      # نص القرآن (مأخوذ من AlQuran Cloud)
  lib/                 # API، التخزين، النصوص، القراء
```

## الترخيص

نص القرآن وصوتياته مقدمة من [AlQuran Cloud](https://alquran.cloud/api) و
[Islamic Network](https://islamic.network). يُرجى مراعاة شروط استخدامهما.

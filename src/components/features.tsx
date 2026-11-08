import {
  BookOpenIcon,
  BookmarkIcon,
  ClockIcon,
  HeadphonesIcon,
  MoonIcon,
  SlidersIcon,
} from '@/components/icons';

const features = [
  {
    icon: BookOpenIcon,
    title: 'رسم عثماني أصيل',
    description: 'نص القرآن كاملًا بالرسم العثماني، دون تشويه أو تعديل، وبخطوط مصممة للقراءة الطويلة.',
  },
  {
    icon: HeadphonesIcon,
    title: 'تلاوة متصلة',
    description: 'استمع آية بآية مع الانتقال التلقائي، والتكرار، وتغيير السرعة، واختيار القارئ.',
  },
  {
    icon: ClockIcon,
    title: 'حفظ موضعك',
    description: 'نتذكر آخر سورة وآية قرأتها، لتعود إليها بضغطة واحدة في أي وقت.',
  },
  {
    icon: BookmarkIcon,
    title: 'محفوظاتك الخاصة',
    description: 'احفظ الآيات التي تريد الرجوع إليها، وستبقى على جهازك دون حساب أو تسجيل.',
  },
  {
    icon: SlidersIcon,
    title: 'تحكم كامل بالقراءة',
    description: 'كبّر الخط، واختر الخط الأنسب لعينك، وفعّل التمرير التلقائي مع التلاوة.',
  },
  {
    icon: MoonIcon,
    title: 'وضع ليلي مريح',
    description: 'ألوان هادئة منخفضة التباين للقراءة ليلًا، تحافظ على راحة عينيك.',
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip">لماذا مشكاة؟</span>
          <h2 className="mt-4 text-balance font-display text-3xl leading-tight sm:text-4xl">
            صُممت لتُعينك على التدبّر
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
            كل تفصيلة في الواجهة تخدم هدفًا واحدًا: أن تبقى عينك وقلبك مع الآيات.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="group rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lift"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/8 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

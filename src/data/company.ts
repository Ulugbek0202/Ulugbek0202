import type { CompanyProfile, Milestone, Statistic, TeamMember } from '@/types';

/**
 * ============================================================================
 * PLACEHOLDER COMPANY IDENTITY — REPLACE BEFORE LAUNCH
 * ============================================================================
 * The company name, contact details, registration numbers and all figures in
 * this file are DEMONSTRATION VALUES. They were not supplied by the client and
 * must not be presented as verified facts.
 *
 * Every value here is mirrored by the `company` singleton table in Supabase, so
 * it can be edited from `/admin/content` without a code change once credentials
 * are configured.
 * ============================================================================
 */
export const company: CompanyProfile = {
  name: {
    uz: 'Meridian Construction',
    ru: 'Meridian Construction',
    en: 'Meridian Construction',
  },
  legalName: {
    uz: '"Meridian Construction & Engineering" mas’uliyati cheklangan jamiyati',
    ru: 'Общество с ограниченной ответственностью «Meridian Construction & Engineering»',
    en: 'Meridian Construction & Engineering Limited Liability Company',
  },
  tagline: {
    uz: 'Xalqaro standartlardagi qurilish va muhandislik.',
    ru: 'Строительство и инжиниринг по международным стандартам.',
    en: 'Construction and engineering to international standards.',
  },
  founded: 2009,
  description: {
    uz: 'Meridian Construction & Engineering — loyihalash, muhandislik va qurilishni bitta mas’uliyatli tashkilotda birlashtirgan qurilish kompaniyasi. Biz turar-joy, tijorat, infratuzilma va sanoat obyektlarini texnik-iqtisodiy asoslashdan yakuniy topshirishgacha olib boramiz.',
    ru: 'Meridian Construction & Engineering — строительная компания, объединяющая проектирование, инжиниринг и строительство в одной ответственной организации. Мы ведём объекты жилого, коммерческого, инфраструктурного и промышленного назначения от обоснования до финальной сдачи.',
    en: 'Meridian Construction & Engineering is a construction company that brings design, engineering and construction together in a single accountable organisation. We carry residential, commercial, infrastructure and industrial projects from feasibility through to final handover.',
  },
  mission: {
    uz: 'Mijozlarimiz so’zsiz ishonadigan qurilish va muhandislik ishlarini yetkazib berish — texnik jihatdan puxta, moliyaviy intizomli va natija bilan yashashga to’g’ri keladigan odamlarning ehtiyotkorligi bilan yakunlangan.',
    ru: 'Выполнять строительные и инженерные работы, на которые клиенты могут положиться без оговорок — технически обоснованные, финансово дисциплинированные и завершённые с той тщательностью, которую проявляют люди, которым предстоит жить с результатом.',
    en: 'To deliver construction and engineering work that our clients can rely on without qualification — technically sound, financially disciplined, and completed with the care of people who will have to live with the result.',
  },
  vision: {
    uz: 'Mintaqada eng ko’p tanlanadigan muhandislik hamkoriga aylanish: loyiha murakkab, muddat qattiq va ikkinchi urinishga o’rin bo’lmaganda xalqaro mijozlar murojaat qiladigan kompaniya.',
    ru: 'Стать предпочтительным инженерным партнёром в регионе: компанией, к которой обращаются международные клиенты, когда проект сложен, сроки жёсткие, а права на вторую попытку нет.',
    en: 'To be the engineering partner of choice across the region: the firm international clients call when a project is complex, the schedule is demanding, and there is no room for a second attempt.',
  },
  values: [
    {
      title: {
        uz: 'Muhandislik halolligi',
        ru: 'Инженерная честность',
        en: 'Engineering integrity',
      },
      description: {
        uz: 'O’z nomimizni qo’yishga va ochiq himoya qilishga tayyor bo’lgan hisob-kitoblar va spetsifikatsiyalar.',
        ru: 'Расчёты и спецификации, под которыми мы готовы поставить своё имя и публично их защищать.',
        en: 'Calculations and specifications we are willing to put our name to, and to defend publicly.',
      },
    },
    {
      title: {
        uz: 'Mas’uliyatli yetkazib berish',
        ru: 'Ответственная реализация',
        en: 'Accountable delivery',
      },
      description: {
        uz: 'Natija uchun bitta jamoa javob beradi. Mas’uliyat hech qachon zanjir bo’ylab o’tkazilmaydi.',
        ru: 'За результат отвечает одна команда. Ответственность никогда не передаётся дальше по цепочке.',
        en: 'One team owns the outcome. Responsibility is never passed down the chain.',
      },
    },
    {
      title: {
        uz: 'Shaffof hisobot',
        ru: 'Прозрачная отчётность',
        en: 'Transparent reporting',
      },
      description: {
        uz: 'Xarajat, muddat va xavf ochiq bayon etiladi — yangilik yoqimsiz bo’lsa ham.',
        ru: 'Стоимость, сроки и риски излагаются прямо, в том числе когда новости неудобны.',
        en: 'Cost, programme and risk stated plainly, including when the news is unwelcome.',
      },
    },
    {
      title: {
        uz: 'Xavfsizlikda murosasizlik',
        ru: 'Безопасность без компромиссов',
        en: 'Safety without compromise',
      },
      description: {
        uz: 'Hech bir bosqich jarohatga arziydi. Xavfsiz maydonchalar samarali ham bo’ladi.',
        ru: 'Ни один этап не стоит травмы. Безопасные площадки — это ещё и производительные площадки.',
        en: 'No milestone is worth an injury. Safe sites are also productive sites.',
      },
    },
  ],

  // ---------------------------------------------------------------------------
  // CONTACT — replace with the company's real details.
  // The telephone numbers use the reserved +998 00 000 00 00 pattern so they
  // cannot accidentally dial a real subscriber.
  // ---------------------------------------------------------------------------
  address: {
    uz: 'Toshkent shahri, Amir Temur shoh ko’chasi, 000-uy, 0-qavat',
    ru: 'г. Ташкент, проспект Амира Темура, дом 000, этаж 0',
    en: '000 Amir Temur Avenue, Floor 0, Tashkent',
  },
  phones: ['+998 00 000 00 00', '+998 00 000 00 01'],
  emails: ['info@example.com', 'tenders@example.com'],
  telegram: '@example_company',
  workingHours: {
    uz: 'Dushanba–Juma, 09:00–18:00',
    ru: 'Понедельник–пятница, 09:00–18:00',
    en: 'Monday–Friday, 09:00–18:00',
  },
  registration: {
    // Intentionally null: registration identifiers must be supplied by the
    // company before publication. Nothing is invented here.
    taxId: null,
    license: null,
  },
};

/**
 * ============================================================================
 * ILLUSTRATIVE STATISTICS — NOT VERIFIED COMPANY FIGURES
 * ============================================================================
 * These numbers exist only to demonstrate the animated counter component. They
 * are labelled as demo content everywhere they appear in the UI and must be
 * replaced with audited figures before the site goes live.
 * ============================================================================
 */
export const statistics: Statistic[] = [
  {
    id: 'stat-projects',
    label: {
      uz: 'Yakunlangan loyihalar',
      ru: 'Завершённых проектов',
      en: 'Completed projects',
    },
    value: 148,
    suffix: null,
    isDemo: true,
  },
  {
    id: 'stat-years',
    label: { uz: 'Yillik tajriba', ru: 'Лет опыта', en: 'Years of experience' },
    value: 16,
    suffix: null,
    isDemo: true,
  },
  {
    id: 'stat-specialists',
    label: {
      uz: 'Mutaxassislar soni',
      ru: 'Специалистов в штате',
      en: 'Specialists on staff',
    },
    value: 420,
    suffix: null,
    isDemo: true,
  },
  {
    id: 'stat-area',
    label: {
      uz: 'Qurilgan umumiy maydon',
      ru: 'Построено общей площади',
      en: 'Construction area delivered',
    },
    value: 1_240_000,
    suffix: { uz: 'm²', ru: 'м²', en: 'm²' },
    isDemo: true,
  },
];

/**
 * ============================================================================
 * ILLUSTRATIVE TIMELINE — PENDING VERIFIED CORPORATE HISTORY
 * ============================================================================
 */
export const milestones: Milestone[] = [
  {
    id: 'ms-2009',
    year: 2009,
    title: {
      uz: 'Kompaniya tashkil etildi',
      ru: 'Основание компании',
      en: 'The company is founded',
    },
    description: {
      uz: 'Kichik muhandislik jamoasi sifatida ish boshladik — uchta muhandis va bitta loyiha. Namunaviy yozuv.',
      ru: 'Начали работу небольшой инженерной командой — три инженера и один проект. Пример записи.',
      en: 'Started as a small engineering team — three engineers and a single project. Illustrative entry.',
    },
    imageUrl: 'history-1',
  },
  {
    id: 'ms-2013',
    year: 2013,
    title: {
      uz: 'Birinchi yirik turar-joy loyihasi',
      ru: 'Первый крупный жилой проект',
      en: 'First major residential project',
    },
    description: {
      uz: 'Ko’p qavatli turar-joy majmuasini to’liq tsiklda topshirdik. Namunaviy yozuv.',
      ru: 'Сдали многоэтажный жилой комплекс полным циклом. Пример записи.',
      en: 'Delivered a multi-storey residential complex on a full-cycle basis. Illustrative entry.',
    },
    imageUrl: 'history-2',
  },
  {
    id: 'ms-2017',
    year: 2017,
    title: {
      uz: 'Infratuzilma yo’nalishi ochildi',
      ru: 'Открытие инфраструктурного направления',
      en: 'Infrastructure division established',
    },
    description: {
      uz: 'Yo’l va kommunikatsiya loyihalari uchun alohida bo’lim tuzdik. Namunaviy yozuv.',
      ru: 'Создали отдельное подразделение для дорожных и коммуникационных проектов. Пример записи.',
      en: 'Formed a dedicated division for road and utility projects. Illustrative entry.',
    },
    imageUrl: 'history-3',
  },
  {
    id: 'ms-2021',
    year: 2021,
    title: {
      uz: 'BIM tizimiga o’tish',
      ru: 'Переход на BIM',
      en: 'Transition to BIM',
    },
    description: {
      uz: 'Barcha yirik loyihalarda raqamli loyihalash va muvofiqlashtirishga o’tdik. Namunaviy yozuv.',
      ru: 'Перешли на цифровое проектирование и координацию на всех крупных проектах. Пример записи.',
      en: 'Moved to digital design and coordination across all major projects. Illustrative entry.',
    },
    imageUrl: 'history-4',
  },
];

/**
 * ============================================================================
 * ILLUSTRATIVE TEAM — PENDING CONFIRMATION OF ACTUAL MANAGEMENT
 * ============================================================================
 * Names are deliberately generic placeholders. Do not replace these with real
 * individuals until the company confirms who they are and consents to
 * publication of their profile.
 * ============================================================================
 */
export const teamMembers: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Placeholder Name 01',
    role: {
      uz: 'Bosh direktor',
      ru: 'Генеральный директор',
      en: 'Chief Executive Officer',
    },
    bio: {
      uz: 'Namunaviy profil. Haqiqiy rahbariyat tasdiqlangach almashtiriladi.',
      ru: 'Образец профиля. Будет заменён после подтверждения состава руководства.',
      en: 'Illustrative profile. To be replaced once the actual management is confirmed.',
    },
    photoUrl: 'team-1',
    credentials: {
      uz: 'Qurilish muhandisligi bo’yicha mutaxassis',
      ru: 'Специалист в области строительного инжиниринга',
      en: 'Construction engineering specialist',
    },
    order: 1,
    published: true,
  },
  {
    id: 'team-2',
    name: 'Placeholder Name 02',
    role: {
      uz: 'Bosh muhandis',
      ru: 'Главный инженер',
      en: 'Chief Engineer',
    },
    bio: {
      uz: 'Namunaviy profil. Haqiqiy rahbariyat tasdiqlangach almashtiriladi.',
      ru: 'Образец профиля. Будет заменён после подтверждения состава руководства.',
      en: 'Illustrative profile. To be replaced once the actual management is confirmed.',
    },
    photoUrl: 'team-2',
    credentials: {
      uz: 'Konstruktiv hisob-kitoblar va texnik nazorat',
      ru: 'Конструктивные расчёты и технический надзор',
      en: 'Structural calculation and technical assurance',
    },
    order: 2,
    published: true,
  },
  {
    id: 'team-3',
    name: 'Placeholder Name 03',
    role: {
      uz: 'Loyihalar bo’yicha direktor',
      ru: 'Директор по проектам',
      en: 'Projects Director',
    },
    bio: {
      uz: 'Namunaviy profil. Haqiqiy rahbariyat tasdiqlangach almashtiriladi.',
      ru: 'Образец профиля. Будет заменён после подтверждения состава руководства.',
      en: 'Illustrative profile. To be replaced once the actual management is confirmed.',
    },
    photoUrl: 'team-3',
    credentials: {
      uz: 'Muddat va resurslarni rejalashtirish',
      ru: 'Планирование сроков и ресурсов',
      en: 'Programme and resource planning',
    },
    order: 3,
    published: true,
  },
  {
    id: 'team-4',
    name: 'Placeholder Name 04',
    role: {
      uz: 'Tijorat direktori',
      ru: 'Коммерческий директор',
      en: 'Commercial Director',
    },
    bio: {
      uz: 'Namunaviy profil. Haqiqiy rahbariyat tasdiqlangach almashtiriladi.',
      ru: 'Образец профиля. Будет заменён после подтверждения состава руководства.',
      en: 'Illustrative profile. To be replaced once the actual management is confirmed.',
    },
    photoUrl: 'team-4',
    credentials: {
      uz: 'Smeta, shartnomalar va xaridlar',
      ru: 'Сметное дело, договоры и закупки',
      en: 'Estimating, contracts and procurement',
    },
    order: 4,
    published: true,
  },
  {
    id: 'team-5',
    name: 'Placeholder Name 05',
    role: {
      uz: 'Sifat va xavfsizlik bo’yicha rahbar',
      ru: 'Руководитель по качеству и безопасности',
      en: 'Head of Quality & Safety',
    },
    bio: {
      uz: 'Namunaviy profil. Haqiqiy rahbariyat tasdiqlangach almashtiriladi.',
      ru: 'Образец профиля. Будет заменён после подтверждения состава руководства.',
      en: 'Illustrative profile. To be replaced once the actual management is confirmed.',
    },
    photoUrl: 'team-5',
    credentials: {
      uz: 'Tekshiruv rejalari va me’yoriy muvofiqlik',
      ru: 'Планы инспекций и нормативное соответствие',
      en: 'Inspection regimes and regulatory compliance',
    },
    order: 5,
    published: true,
  },
  {
    id: 'team-6',
    name: 'Placeholder Name 06',
    role: {
      uz: 'Kadrlar bo’limi rahbari',
      ru: 'Руководитель отдела кадров',
      en: 'Head of Human Resources',
    },
    bio: {
      uz: 'Namunaviy profil. Haqiqiy rahbariyat tasdiqlangach almashtiriladi.',
      ru: 'Образец профиля. Будет заменён после подтверждения состава руководства.',
      en: 'Illustrative profile. To be replaced once the actual management is confirmed.',
    },
    photoUrl: 'team-6',
    credentials: {
      uz: 'Iste’dodlarni jalb qilish va rivojlantirish',
      ru: 'Привлечение и развитие талантов',
      en: 'Talent acquisition and development',
    },
    order: 6,
    published: true,
  },
];

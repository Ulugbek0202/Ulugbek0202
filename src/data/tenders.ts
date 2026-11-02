import type { Tender, Vacancy } from '@/types';

/**
 * ============================================================================
 * ILLUSTRATIVE TENDER NOTICES — NO PROCUREMENT IS ANNOUNCED
 * ============================================================================
 * These are structural examples demonstrating the tender listing layout. No
 * real procurement process is described and no submission is being invited.
 * ============================================================================
 */
export const tenders: Tender[] = [
  {
    id: 'tnd-01',
    reference: 'TND-2026-001',
    title: {
      uz: 'Beton ishlari uchun subpudratchi tanlash',
      ru: 'Отбор субподрядчика на бетонные работы',
      en: 'Subcontractor selection for concrete works',
    },
    description: {
      uz: 'Ko’p qavatli turar-joy loyihasi uchun beton ishlarini bajaruvchi subpudratchi tanlanadi. Namunaviy elon.',
      ru: 'Отбирается субподрядчик для выполнения бетонных работ на проекте многоэтажного жилья. Пример извещения.',
      en: 'Selection of a subcontractor to carry out concrete works on a multi-storey residential project. Illustrative notice.',
    },
    category: {
      uz: 'Qurilish ishlari',
      ru: 'Строительные работы',
      en: 'Construction works',
    },
    status: 'open',
    publishedAt: '2026-01-12T08:00:00.000Z',
    deadline: '2026-12-15T17:00:00.000Z',
    fileUrl: null,
  },
  {
    id: 'tnd-02',
    reference: 'TND-2026-002',
    title: {
      uz: 'Fasad tizimlarini yetkazib berish',
      ru: 'Поставка фасадных систем',
      en: 'Supply of facade systems',
    },
    description: {
      uz: 'Ofis binosi uchun fasad tizimlarini yetkazib beruvchi kompaniya tanlanadi. Namunaviy elon.',
      ru: 'Отбирается компания-поставщик фасадных систем для офисного здания. Пример извещения.',
      en: 'Selection of a supplier of facade systems for an office building. Illustrative notice.',
    },
    category: {
      uz: 'Materiallar yetkazib berish',
      ru: 'Поставка материалов',
      en: 'Material supply',
    },
    status: 'open',
    publishedAt: '2026-02-03T08:00:00.000Z',
    deadline: '2026-11-30T17:00:00.000Z',
    fileUrl: null,
  },
  {
    id: 'tnd-03',
    reference: 'TND-2026-003',
    title: {
      uz: 'Geotexnik tadqiqotlar xizmati',
      ru: 'Услуги геотехнических изысканий',
      en: 'Geotechnical investigation services',
    },
    description: {
      uz: 'Sanoat obyekti uchun geotexnik tadqiqotlar o’tkazuvchi tashkilot tanlanadi. Namunaviy elon.',
      ru: 'Отбирается организация для проведения геотехнических изысканий под промышленный объект. Пример извещения.',
      en: 'Selection of an organisation to carry out geotechnical investigation for an industrial facility. Illustrative notice.',
    },
    category: {
      uz: 'Muhandislik xizmatlari',
      ru: 'Инженерные услуги',
      en: 'Engineering services',
    },
    status: 'open',
    publishedAt: '2026-02-20T08:00:00.000Z',
    deadline: '2026-12-05T17:00:00.000Z',
    fileUrl: null,
  },
  {
    id: 'tnd-04',
    reference: 'TND-2025-014',
    title: {
      uz: 'Lift uskunalarini o’rnatish',
      ru: 'Монтаж лифтового оборудования',
      en: 'Lift equipment installation',
    },
    description: {
      uz: 'Biznes markaz loyihasida lift uskunalarini o’rnatish bo’yicha subpudratchi tanlangan. Namunaviy elon.',
      ru: 'Отобран субподрядчик на монтаж лифтового оборудования в проекте бизнес-центра. Пример извещения.',
      en: 'A subcontractor was selected for lift equipment installation on a business centre project. Illustrative notice.',
    },
    category: {
      uz: 'Uskunalar o’rnatish',
      ru: 'Монтаж оборудования',
      en: 'Equipment installation',
    },
    status: 'awarded',
    publishedAt: '2025-08-11T08:00:00.000Z',
    deadline: '2025-10-01T17:00:00.000Z',
    fileUrl: null,
  },
  {
    id: 'tnd-05',
    reference: 'TND-2025-009',
    title: {
      uz: 'Yer ishlari va poydevor qazish',
      ru: 'Земляные работы и разработка котлована',
      en: 'Earthworks and excavation',
    },
    description: {
      uz: 'Turar-joy loyihasida yer ishlari bo’yicha tanlov yakunlangan. Namunaviy elon.',
      ru: 'Завершён отбор на земляные работы в жилом проекте. Пример извещения.',
      en: 'Selection for earthworks on a residential project has closed. Illustrative notice.',
    },
    category: {
      uz: 'Qurilish ishlari',
      ru: 'Строительные работы',
      en: 'Construction works',
    },
    status: 'closed',
    publishedAt: '2025-04-07T08:00:00.000Z',
    deadline: '2025-05-20T17:00:00.000Z',
    fileUrl: null,
  },
];

/**
 * ============================================================================
 * ILLUSTRATIVE VACANCIES — PENDING THE COMPANY'S ACTUAL OPEN POSITIONS
 * ============================================================================
 */
export const vacancies: Vacancy[] = [
  {
    id: 'vac-01',
    slug: 'senior-structural-engineer',
    title: {
      uz: 'Katta konstruktiv muhandis',
      ru: 'Старший инженер-конструктор',
      en: 'Senior Structural Engineer',
    },
    department: {
      uz: 'Muhandislik',
      ru: 'Инжиниринг',
      en: 'Engineering',
    },
    location: {
      uz: 'Toshkent, O’zbekiston',
      ru: 'Ташкент, Узбекистан',
      en: 'Tashkent, Uzbekistan',
    },
    employmentType: 'full-time',
    experience: {
      uz: '5 yildan ortiq',
      ru: 'Более 5 лет',
      en: '5+ years',
    },
    summary: {
      uz: 'Temir-beton va metall konstruksiyalar bo’yicha hisob-kitoblar olib boradigan katta muhandis. Namunaviy vakansiya.',
      ru: 'Старший инженер, выполняющий расчёты железобетонных и металлических конструкций. Пример вакансии.',
      en: 'A senior engineer responsible for reinforced concrete and steel design calculations. Illustrative vacancy.',
    },
    responsibilities: {
      uz: [
        'Konstruktiv hisob-kitoblarni bajarish va hujjatlashtirish',
        'Loyiha yechimlarini qurilishga yaroqlilik bo’yicha tekshirish',
        'Yosh muhandislarni nazorat qilish va o’qitish',
        'Boshqa yo’nalishlar bilan chizmalarni muvofiqlashtirish',
        'Maydondagi texnik savollarga javob berish',
      ],
      ru: [
        'Выполнение и документирование конструктивных расчётов',
        'Проверка проектных решений на технологичность',
        'Контроль и обучение младших инженеров',
        'Координация чертежей с другими разделами',
        'Ответы на технические вопросы на площадке',
      ],
      en: [
        'Producing and documenting structural calculations',
        'Reviewing design solutions for buildability',
        'Supervising and mentoring junior engineers',
        'Coordinating drawings with other disciplines',
        'Responding to technical queries on site',
      ],
    },
    requirements: {
      uz: [
        'Qurilish muhandisligi bo’yicha oliy ma’lumot',
        'Kamida 5 yillik loyihalash tajribasi',
        'Temir-beton va metall konstruksiyalar hisob-kitobi tajribasi',
        'Loyihalash dasturlari bilan ishlash ko’nikmasi',
        'O’zbek va rus tillarini bilish',
      ],
      ru: [
        'Высшее образование в области строительного инжиниринга',
        'Не менее 5 лет опыта проектирования',
        'Опыт расчёта железобетонных и металлических конструкций',
        'Навыки работы с программным обеспечением для проектирования',
        'Владение узбекским и русским языками',
      ],
      en: [
        'Degree in construction or structural engineering',
        'At least 5 years of design experience',
        'Experience calculating reinforced concrete and steel structures',
        'Proficiency with structural design software',
        'Working knowledge of Uzbek and Russian',
      ],
    },
    salaryRange: null,
    deadline: null,
    published: true,
    postedAt: '2025-09-01T08:00:00.000Z',
  },
  {
    id: 'vac-02',
    slug: 'construction-project-manager',
    title: {
      uz: 'Qurilish loyihasi menejeri',
      ru: 'Руководитель строительного проекта',
      en: 'Construction Project Manager',
    },
    department: {
      uz: 'Loyiha boshqaruvi',
      ru: 'Управление проектами',
      en: 'Project management',
    },
    location: {
      uz: 'Toshkent, O’zbekiston',
      ru: 'Ташкент, Узбекистан',
      en: 'Tashkent, Uzbekistan',
    },
    employmentType: 'full-time',
    experience: {
      uz: '7 yildan ortiq',
      ru: 'Более 7 лет',
      en: '7+ years',
    },
    summary: {
      uz: 'Muddat, xarajat va sifatni boshqaradigan loyiha menejeri. Namunaviy vakansiya.',
      ru: 'Руководитель проекта, отвечающий за сроки, стоимость и качество. Пример вакансии.',
      en: 'A project manager accountable for programme, cost and quality. Illustrative vacancy.',
    },
    responsibilities: {
      uz: [
        'Loyiha muddati va resurslarini rejalashtirish',
        'Subpudratchilar ishini muvofiqlashtirish',
        'Mijoz bilan muntazam hisobot va aloqa',
        'Xavflarni aniqlash va boshqarish',
        'Sifat va xavfsizlik talablariga rioya qilishni ta’minlash',
      ],
      ru: [
        'Планирование сроков и ресурсов проекта',
        'Координация работы субподрядчиков',
        'Регулярная отчётность и коммуникация с заказчиком',
        'Выявление и управление рисками',
        'Обеспечение соблюдения требований качества и безопасности',
      ],
      en: [
        'Planning project programme and resources',
        'Coordinating subcontractor work',
        'Regular reporting and communication with the client',
        'Identifying and managing risk',
        'Ensuring compliance with quality and safety requirements',
      ],
    },
    requirements: {
      uz: [
        'Qurilish yoki muhandislik bo’yicha oliy ma’lumot',
        'Kamida 7 yillik qurilish loyihalari tajribasi',
        'Muddat va xarajatlarni boshqarish tajribasi',
        'Jamoa boshqaruvi ko’nikmalari',
        'O’zbek va rus tillarini bilish',
      ],
      ru: [
        'Высшее образование в области строительства или инжиниринга',
        'Не менее 7 лет опыта на строительных проектах',
        'Опыт управления сроками и стоимостью',
        'Навыки управления командой',
        'Владение узбекским и русским языками',
      ],
      en: [
        'Degree in construction or engineering',
        'At least 7 years of construction project experience',
        'Experience managing programme and cost',
        'Team management skills',
        'Working knowledge of Uzbek and Russian',
      ],
    },
    salaryRange: null,
    deadline: null,
    published: true,
    postedAt: '2025-09-12T08:00:00.000Z',
  },
  {
    id: 'vac-03',
    slug: 'site-safety-officer',
    title: {
      uz: 'Maydon xavfsizligi bo’yicha mutaxassis',
      ru: 'Специалист по безопасности на площадке',
      en: 'Site Safety Officer',
    },
    department: {
      uz: 'Sifat va xavfsizlik',
      ru: 'Качество и безопасность',
      en: 'Quality & safety',
    },
    location: {
      uz: 'Toshkent viloyati, O’zbekiston',
      ru: 'Ташкентская область, Узбекистан',
      en: 'Tashkent Region, Uzbekistan',
    },
    employmentType: 'full-time',
    experience: {
      uz: '3 yildan ortiq',
      ru: 'Более 3 лет',
      en: '3+ years',
    },
    summary: {
      uz: 'Maydonda xavfsizlik tartiblarini joriy etuvchi va nazorat qiluvchi mutaxassis. Namunaviy vakansiya.',
      ru: 'Специалист, внедряющий и контролирующий режимы безопасности на площадке. Пример вакансии.',
      en: 'A specialist implementing and monitoring safety regimes on site. Illustrative vacancy.',
    },
    responsibilities: {
      uz: [
        'Kunlik xavfsizlik instruktajlarini o’tkazish',
        'Ish joylarini muntazam tekshirish',
        'Xavflarni qayd etish va bartaraf etishni kuzatish',
        'Ish usuli bayonnomalarini tayyorlashda ishtirok etish',
        'Baxtsiz hodisalarni tekshirish va hisobot tayyorlash',
      ],
      ru: [
        'Проведение ежедневных инструктажей по безопасности',
        'Регулярные проверки рабочих мест',
        'Фиксация опасностей и контроль их устранения',
        'Участие в подготовке технологических регламентов',
        'Расследование происшествий и подготовка отчётов',
      ],
      en: [
        'Delivering daily safety briefings',
        'Carrying out regular workplace inspections',
        'Recording hazards and tracking their resolution',
        'Contributing to method statement preparation',
        'Investigating incidents and preparing reports',
      ],
    },
    requirements: {
      uz: [
        'Mehnat muhofazasi bo’yicha malaka yoki oliy ma’lumot',
        'Kamida 3 yillik qurilish maydonchasi tajribasi',
        'Mehnat xavfsizligi qonunchiligini bilish',
        'Hisobot yuritish ko’nikmalari',
        'O’zbek va rus tillarini bilish',
      ],
      ru: [
        'Квалификация или высшее образование в области охраны труда',
        'Не менее 3 лет опыта на строительной площадке',
        'Знание законодательства об охране труда',
        'Навыки ведения отчётности',
        'Владение узбекским и русским языками',
      ],
      en: [
        'Qualification or degree in occupational health and safety',
        'At least 3 years of construction site experience',
        'Knowledge of occupational safety legislation',
        'Report-writing skills',
        'Working knowledge of Uzbek and Russian',
      ],
    },
    salaryRange: null,
    deadline: null,
    published: true,
    postedAt: '2025-10-02T08:00:00.000Z',
  },
  {
    id: 'vac-04',
    slug: 'bim-coordinator',
    title: {
      uz: 'BIM muvofiqlashtiruvchi',
      ru: 'BIM-координатор',
      en: 'BIM Coordinator',
    },
    department: {
      uz: 'Muhandislik',
      ru: 'Инжиниринг',
      en: 'Engineering',
    },
    location: {
      uz: 'Toshkent, O’zbekiston',
      ru: 'Ташкент, Узбекистан',
      en: 'Tashkent, Uzbekistan',
    },
    employmentType: 'full-time',
    experience: {
      uz: '3 yildan ortiq',
      ru: 'Более 3 лет',
      en: '3+ years',
    },
    summary: {
      uz: 'Turli yo’nalishlar modellarini muvofiqlashtiruvchi mutaxassis. Namunaviy vakansiya.',
      ru: 'Специалист, координирующий модели различных разделов. Пример вакансии.',
      en: 'A specialist coordinating models across disciplines. Illustrative vacancy.',
    },
    responsibilities: {
      uz: [
        'Yo’nalishlar modellarini yig’ish va muvofiqlashtirish',
        'Ziddiyatlarni aniqlash va tayinlash',
        'Model standartlarini yuritish',
        'Loyiha jamoasini model bo’yicha o’qitish',
        'Hisobotlarni tayyorlash',
      ],
      ru: [
        'Сведение и координация моделей разделов',
        'Выявление и назначение коллизий',
        'Ведение стандартов моделирования',
        'Обучение проектной команды работе с моделью',
        'Подготовка отчётности',
      ],
      en: [
        'Federating and coordinating discipline models',
        'Detecting and assigning clashes',
        'Maintaining modelling standards',
        'Training the project team on the model',
        'Preparing reports',
      ],
    },
    requirements: {
      uz: [
        'Qurilish yoki arxitektura bo’yicha ma’lumot',
        'BIM muhitida kamida 3 yillik tajriba',
        'Model muvofiqlashtirish tajribasi',
        'Loyihalash dasturlarini yaxshi bilish',
        'Ingliz tilini bilish afzallik',
      ],
      ru: [
        'Образование в области строительства или архитектуры',
        'Не менее 3 лет опыта в среде BIM',
        'Опыт координации моделей',
        'Уверенное владение ПО для проектирования',
        'Знание английского языка приветствуется',
      ],
      en: [
        'Degree in construction or architecture',
        'At least 3 years of experience in a BIM environment',
        'Experience coordinating models',
        'Confident use of design software',
        'English language skills an advantage',
      ],
    },
    salaryRange: null,
    deadline: null,
    published: true,
    postedAt: '2025-10-15T08:00:00.000Z',
  },
];

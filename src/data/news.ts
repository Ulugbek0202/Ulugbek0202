import type { NewsArticle } from '@/types';

/**
 * ============================================================================
 * ILLUSTRATIVE NEWSROOM — REPLACE WITH REAL ARTICLES
 * ============================================================================
 * These six articles exist to demonstrate the editorial index, featured layout
 * and article page. They describe no real event, contract or award. The UI
 * labels the whole newsroom as demonstration content.
 * ============================================================================
 */
export const news: NewsArticle[] = [
  {
    id: 'news-01',
    slug: 'structural-review-before-mobilisation',
    title: {
      uz: 'Ish boshlanishidan oldin konstruktiv tekshiruv',
      ru: 'Конструктивная проверка до начала работ',
      en: 'Structural review before mobilisation',
    },
    excerpt: {
      uz: 'Nima uchun har bir loyihada mustaqil hisob-kitob tekshiruvi qurilish boshlanishidan oldin o’tkaziladi. Namunaviy maqola.',
      ru: 'Почему в каждом проекте независимая проверка расчётов проводится до начала строительства. Пример статьи.',
      en: 'Why independent calculation review is carried out before construction starts on every project. Illustrative article.',
    },
    body: {
      uz: 'Qurilish maydonchasiga chiqishdan oldin bajariladigan eng foydali ishlardan biri — konstruktiv hisob-kitoblarni mustaqil tekshirishdir.\n\nAmaliyotda bu bosqich ko’pincha rasmiyatchilik sifatida qabul qilinadi. Bizda esa u haqiqiy tekshiruv: alohida muhandis hisob-kitoblarni noldan qayta ko’rib chiqadi, yuklamalar kombinatsiyasini, material xususiyatlarini va chegara holatlarini tekshiradi.\n\nNatijada uch turdagi xatolar aniqlanadi: hisoblashdagi texnik xatolar, model qabul qilingan taxminlardagi nomuvofiqliklar va chizmalar orasidagi ziddiyatlar. Ularning barchasi maydonda emas, qog’ozda topilganda ancha arzon hal qilinadi.\n\nTekshiruv tugagach, natijalar hujjatlashtiriladi va loyiha jamoasiga taqdim etiladi. Har bir tuzatish qayd etiladi va uning qanday hal qilinganligi kuzatiladi.',
      ru: 'Одна из самых полезных работ, выполняемых до выхода на площадку, — независимая проверка конструктивных расчётов.\n\nНа практике этот этап часто воспринимается как формальность. У нас это настоящая проверка: отдельный инженер пересматривает расчёты с нуля, проверяет сочетания нагрузок, характеристики материалов и предельные состояния.\n\nВ результате выявляются три типа ошибок: технические ошибки в вычислениях, несоответствия в принятых допущениях модели и противоречия между чертежами. Все они обходятся значительно дешевле, когда обнаруживаются на бумаге, а не на площадке.\n\nПосле завершения проверки результаты документируются и передаются проектной команде. Каждое исправление фиксируется и отслеживается до закрытия.',
      en: 'One of the most valuable pieces of work carried out before anyone reaches site is independent review of the structural calculations.\n\nIn practice this stage is often treated as a formality. For us it is a genuine check: a separate engineer reworks the calculations from first principles, testing load combinations, material properties and limit states.\n\nThree kinds of error tend to surface: arithmetic mistakes, inconsistencies in the assumptions behind the model, and contradictions between drawings. All three are far cheaper to resolve on paper than on site.\n\nOnce the review closes, the findings are documented and issued to the design team. Every correction is logged and tracked through to closure.',
    },
    coverImage: 'news-1',
    category: {
      uz: 'Muhandislik',
      ru: 'Инжиниринг',
      en: 'Engineering',
    },
    author: 'Editorial Team',
    publishedAt: '2025-09-18T08:00:00.000Z',
    published: true,
    featured: true,
  },
  {
    id: 'news-02',
    slug: 'bim-coordination-in-practice',
    title: {
      uz: 'Amaliyotda BIM muvofiqlashtirish',
      ru: 'BIM-координация на практике',
      en: 'BIM coordination in practice',
    },
    excerpt: {
      uz: 'Raqamli model qanday qilib chizmalar orasidagi ziddiyatlarni maydonga chiqishidan oldin aniqlaydi. Namunaviy maqola.',
      ru: 'Как цифровая модель выявляет противоречия между чертежами до выхода на площадку. Пример статьи.',
      en: 'How a digital model surfaces clashes between drawings before they reach site. Illustrative article.',
    },
    body: {
      uz: 'BIM ning asosiy foydasi chiroyli vizualizatsiyalarda emas, balki ziddiyatlarni erta aniqlashda.\n\nHar bir loyihada biz barcha yo’nalishlar — konstruksiya, isitish-ventilyatsiya, elektr, suv ta’minoti — modellarini bitta koordinatali muhitga yig’amiz. Model haftalik yangilanadi va har bir yangilanishdan keyin avtomatik ziddiyat tekshiruvi o’tkaziladi.\n\nMuhim jihat — topilgan ziddiyatlarni kim hal qilishini oldindan belgilash. Har bir ziddiyat mas’ul muhandisga tayinlanadi, muddat belgilanadi va yopilgunga qadar kuzatiladi.\n\nBu yondashuv maydonda qayta ishlash hajmini sezilarli kamaytiradi, lekin uni faqat modelning o’zi ta’minlamaydi — jarayon intizomi ta’minlaydi.',
      ru: 'Основная польза BIM не в красивых визуализациях, а в раннем выявлении противоречий.\n\nВ каждом проекте мы сводим модели всех разделов — конструкции, отопления и вентиляции, электрики, водоснабжения — в единую координатную среду. Модель обновляется еженедельно, и после каждого обновления выполняется автоматическая проверка на коллизии.\n\nВажный момент — заранее определить, кто устраняет найденные коллизии. Каждая коллизия назначается ответственному инженеру, получает срок и отслеживается до закрытия.\n\nТакой подход заметно снижает объём переделок на площадке, но обеспечивает его не сама модель, а дисциплина процесса.',
      en: 'The main benefit of BIM is not attractive visualisation — it is early detection of clashes.\n\nOn every project we federate the models from all disciplines — structure, HVAC, electrical, water — into a single coordinated environment. The model is refreshed weekly, and each refresh triggers an automated clash check.\n\nThe important part is deciding in advance who resolves each clash. Every conflict is assigned to a named engineer, given a deadline, and tracked until it is closed.\n\nThat approach measurably reduces rework on site, but the model alone does not deliver it — process discipline does.',
    },
    coverImage: 'news-2',
    category: {
      uz: 'Texnologiya',
      ru: 'Технологии',
      en: 'Technology',
    },
    author: 'Editorial Team',
    publishedAt: '2025-07-02T08:00:00.000Z',
    published: true,
    featured: false,
  },
  {
    id: 'news-03',
    slug: 'inspection-and-test-plans-explained',
    title: {
      uz: 'Tekshiruv va sinov rejalari: nima uchun ular muhim',
      ru: 'Планы инспекций и испытаний: почему они важны',
      en: 'Inspection and test plans explained',
    },
    excerpt: {
      uz: 'Sifat tasodifan yuzaga kelmaydi. U rejalashtiriladi, hujjatlashtiriladi va har bir nuqtada tasdiqlanadi. Namunaviy maqola.',
      ru: 'Качество не возникает случайно. Его планируют, документируют и подтверждают в каждой точке. Пример статьи.',
      en: 'Quality does not happen by accident. It is planned, documented and signed off at every point. Illustrative article.',
    },
    body: {
      uz: 'Tekshiruv va sinov rejasi (ITP) — bu ish bosqichlari bo’yicha qaysi tekshiruvlar, kim tomonidan va qanday dalillar asosida bajarilishini belgilovchi hujjat.\n\nReja loyiha boshlanishidan oldin tuziladi va mijoz bilan kelishiladi. Unda nazorat nuqtalari belgilanadi: bu nuqtalarda ish tasdiqlanmaguncha keyingi bosqich boshlanmaydi.\n\nAmaliyotda eng ko’p e’tibor talab qiladigan qism — yashirin ishlar. Poydevor, armatura, izolyatsiya kabi keyinchalik ko’rinmaydigan ishlar tekshirilmasdan yopilsa, xatoni topish deyarli imkonsiz bo’ladi.\n\nShu sababli har bir yashirin ish foto-hisobot va imzo bilan qayd etiladi. Bu mijozga ishonch beradi va kompaniyani keyingi da’volardan himoya qiladi.',
      ru: 'План инспекций и испытаний (ITP) — документ, определяющий, какие проверки выполняются по этапам работ, кем и на основании каких доказательств.\n\nПлан составляется до начала проекта и согласуется с заказчиком. В нём определяются контрольные точки: пока работы в них не приняты, следующий этап не начинается.\n\nНа практике наибольшего внимания требует скрытые работы. Если фундамент, армирование или изоляция закрыты без проверки, найти ошибку становится почти невозможно.\n\nПоэтому каждая скрытая работа фиксируется фотоотчётом и подписью. Это даёт заказчику уверенность и защищает компанию от последующих претензий.',
      en: 'An inspection and test plan (ITP) is the document that sets out which checks are performed at each stage of work, by whom, and on what evidence.\n\nIt is written before the project starts and agreed with the client. It defines hold points: stages that cannot begin until the work at that point has been signed off.\n\nThe area that demands the most attention in practice is hidden work. If foundations, reinforcement or insulation are covered without inspection, finding an error afterwards is nearly impossible.\n\nThat is why every hidden work item is recorded with a photographic report and a signature. It gives the client confidence and protects the company against later claims.',
    },
    coverImage: 'news-3',
    category: {
      uz: 'Sifat nazorati',
      ru: 'Контроль качества',
      en: 'Quality assurance',
    },
    author: 'Editorial Team',
    publishedAt: '2025-05-14T08:00:00.000Z',
    published: true,
    featured: false,
  },
  {
    id: 'news-04',
    slug: 'planning-for-winter-construction',
    title: {
      uz: 'Qishki qurilishni rejalashtirish',
      ru: 'Планирование зимнего строительства',
      en: 'Planning for winter construction',
    },
    excerpt: {
      uz: 'Past haroratlarda beton quyish va pardozlash ishlarini qanday xavfsiz tashkil etish mumkin. Namunaviy maqola.',
      ru: 'Как безопасно организовать бетонирование и отделочные работы при низких температурах. Пример статьи.',
      en: 'How to organise concreting and finishing work safely at low temperatures. Illustrative article.',
    },
    body: {
      uz: 'Qishki sharoitda qurilish to’xtamaydi, lekin uni boshqacha rejalashtirish talab qilinadi.\n\nBeton uchun asosiy masala — qotish jarayonida haroratni saqlash. Bunga qoliplarni izolyatsiyalash, isitish, issiq suvda aralashtirish va sovuqqa chidamli qo’shimchalar orqali erishiladi. Har bir yechim betonning loyihaviy mustahkamligiga erishishini tasdiqlovchi sinovlar bilan tekshiriladi.\n\nIsh grafigi ham qayta ko’riladi: tashqi pardozlash va suvga bog’liq ishlar issiq davrga suriladi, ichki ishlar esa oldinga olinadi.\n\nMuhim jihat — maydonchada havo haroratini muntazam o’lchash va natijalarni hujjatlashtirish. Bu ish sifatini tasdiqlashning ajralmas qismidir.',
      ru: 'Зимой строительство не останавливается, но требует иного планирования.\n\nДля бетона главная задача — сохранить температуру в процессе твердения. Это достигается теплоизоляцией опалубки, обогревом, затворением горячей водой и противоморозными добавками. Каждое решение подтверждается испытаниями, показывающими достижение проектной прочности бетона.\n\nГрафик работ также пересматривается: наружная отделка и работы, зависящие от воды, переносятся на тёплый период, а внутренние работы сдвигаются вперёд.\n\nВажный момент — регулярное измерение температуры воздуха на площадке и документирование результатов. Это неотъемлемая часть подтверждения качества работ.',
      en: 'Construction does not stop in winter, but it has to be planned differently.\n\nFor concrete, the central problem is holding temperature during curing. That is achieved through insulated formwork, heating, hot-water batching and cold-resistant admixtures. Each solution is verified by tests confirming the concrete reaches its design strength.\n\nThe programme is reworked too: external finishes and water-dependent works move to the warmer period, while internal works are pulled forward.\n\nA crucial point is measuring air temperature on site regularly and documenting the results. That record is an inseparable part of proving work quality.',
    },
    coverImage: 'news-4',
    category: {
      uz: 'Qurilish amaliyoti',
      ru: 'Строительная практика',
      en: 'Construction practice',
    },
    author: 'Editorial Team',
    publishedAt: '2025-02-27T08:00:00.000Z',
    published: true,
    featured: false,
  },
  {
    id: 'news-05',
    slug: 'why-safety-briefings-are-not-paperwork',
    title: {
      uz: 'Xavfsizlik instruktajlari — bu rasmiyatchilik emas',
      ru: 'Инструктажи по безопасности — это не формальность',
      en: 'Why safety briefings are not paperwork',
    },
    excerpt: {
      uz: 'Kunlik instruktaj qanday qilib maydondagi eng samarali xavfsizlik chorasiga aylanishi mumkin. Namunaviy maqola.',
      ru: 'Как ежедневный инструктаж может стать самой эффективной мерой безопасности на площадке. Пример статьи.',
      en: 'How a daily briefing can become the most effective safety measure on site. Illustrative article.',
    },
    body: {
      uz: 'Kunlik instruktaj ko’pincha imzo uchun bajariladigan rasmiyatchilikka aylanadi. Bu esa uning butun ma’nosini yo’qotadi.\n\nSamarali instruktaj qisqa va aniq bo’ladi: bugun nima qilinadi, qaysi xavflar bor, kim nima uchun javob beradi. U ishchilar tushunadigan tilda o’tkaziladi va savollarga joy qoldiradi.\n\nEng muhimi — ishchilarning o’zlari xavf haqida xabar berishidan qo’rqmasligi. Buning uchun xabar berganlik uchun jazo emas, rag’batlantirish tizimi ishlashi kerak.\n\nMaydonda xavfsizlik madaniyati rahbariyatning shaxsiy namunasi bilan boshlanadi. Agar rahbar dubulg’a taqmasa, hech qanday qoida ishlamaydi.',
      ru: 'Ежедневный инструктаж часто превращается в формальность ради подписи. Это лишает его всякого смысла.\n\nЭффективный инструктаж краток и конкретен: что делаем сегодня, какие есть риски, кто за что отвечает. Он проводится на понятном рабочим языке и оставляет место для вопросов.\n\nСамое важное — чтобы сами рабочие не боялись сообщать об опасности. Для этого должна работать система поощрения, а не наказания за сообщение.\n\nКультура безопасности на площадке начинается с личного примера руководства. Если руководитель не надевает каску, не работает ни одно правило.',
      en: 'The daily briefing often degenerates into a formality performed for a signature. That strips it of all meaning.\n\nAn effective briefing is short and specific: what we are doing today, what the risks are, who is responsible for what. It is delivered in language the workforce understands and leaves room for questions.\n\nMost important is that workers are not afraid to report hazards themselves. That requires a system that rewards reporting rather than punishing it.\n\nA safety culture on site starts with personal example from leadership. If the manager does not wear a helmet, no rule will hold.',
    },
    coverImage: 'news-5',
    category: {
      uz: 'Xavfsizlik',
      ru: 'Безопасность',
      en: 'Safety',
    },
    author: 'Editorial Team',
    publishedAt: '2024-12-09T08:00:00.000Z',
    published: true,
    featured: false,
  },
  {
    id: 'news-06',
    slug: 'handover-documentation-done-properly',
    title: {
      uz: 'Topshirish hujjatlarini to’g’ri shakllantirish',
      ru: 'Правильное формирование документации при сдаче',
      en: 'Handover documentation done properly',
    },
    excerpt: {
      uz: 'Nima uchun topshirish hujjatlari loyiha yakunida emas, boshidan tayyorlanishi kerak. Namunaviy maqola.',
      ru: 'Почему документация для сдачи должна готовиться с начала, а не в конце проекта. Пример статьи.',
      en: 'Why handover documentation must be built from the start, not assembled at the end. Illustrative article.',
    },
    body: {
      uz: 'Topshirish hujjatlari ko’pincha loyiha oxirida shoshilinch yig’iladi. Natijada hujjatlar to’liq bo’lmaydi yoki binoning haqiqiy holatini aks ettirmaydi.\n\nBizda hujjatlar qurilish davomida shakllanadi. Har bir o’zgarish, har bir sinov natijasi va har bir material sertifikati o’z vaqtida tizimga kiritiladi.\n\nTopshirish paketi uch qismdan iborat: qurilgan holat chizmalari, foydalanish va texnik xizmat ko’rsatish qo’llanmalari hamda kafolat hujjatlari.\n\nBundan tashqari, binoni boshqaradigan xodimlar uchun o’qitish o’tkaziladi. Hujjat qanchalik yaxshi bo’lmasin, tizimlarni amalda bilgan odam uni yaxshiroq boshqaradi.',
      ru: 'Документация для сдачи часто собирается в спешке в конце проекта. В результате она оказывается неполной или не отражает фактическое состояние здания.\n\nУ нас документация формируется в ходе строительства. Каждое изменение, каждый результат испытаний и каждый сертификат материала вносится в систему своевременно.\n\nПакет при сдаче состоит из трёх частей: исполнительные чертежи, руководства по эксплуатации и техническому обслуживанию, а также гарантийные документы.\n\nКроме того, проводится обучение сотрудников, которые будут управлять зданием. Каким бы хорошим ни был документ, системы лучше эксплуатирует человек, знающий их на практике.',
      en: 'Handover documentation is often assembled in a rush at the end of a project. The result is a package that is either incomplete or does not reflect the building as built.\n\nOn our projects the documentation is built during construction. Every change, every test result and every material certificate is entered into the system as it happens.\n\nThe handover package has three parts: as-built drawings, operation and maintenance manuals, and warranty documents.\n\nBeyond that, we train the staff who will operate the building. However good the document, systems are run better by someone who knows them in practice.',
    },
    coverImage: 'news-6',
    category: {
      uz: 'Loyiha boshqaruvi',
      ru: 'Управление проектами',
      en: 'Project management',
    },
    author: 'Editorial Team',
    publishedAt: '2024-10-21T08:00:00.000Z',
    published: true,
    featured: false,
  },
];

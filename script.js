import * as THREE from 'three';
import { GoogleGenAI } from "@google/genai";

// Safely suppress benign ResizeObserver loop notification messages
window.addEventListener('error', (e) => {
    if (e && e.message && (
        e.message.includes('ResizeObserver loop completed with undelivered notifications') ||
        e.message.includes('ResizeObserver loop limit exceeded')
    )) {
        e.stopImmediatePropagation();
        e.preventDefault();
        return true;
    }
});

// --- MULTILINGUAL DICTIONARY ---
const translations = {
    proc_kpi_1_val: {"fr": "14 Jours", "en": "14 Days", "ar": "14 يوماً"},
    proc_kpi_1_label: {"fr": "Délai Clé en Main", "en": "Turnaround Time", "ar": "مدة الإنجاز الكامل"},
    proc_kpi_1_desc: {"fr": "Sprint technique garanti de A à Z", "en": "Guaranteed technical sprint from A to Z", "ar": "سباق تقني مضمون من البداية للنهاية"},
    proc_kpi_2_val: {"fr": "50% / 50%", "en": "50% / 50%", "ar": "50% / 50%"},
    proc_kpi_2_label: {"fr": "Paiement Sécurisé", "en": "Milestone Payment", "ar": "دفع آمن ومجزأ"},
    proc_kpi_2_desc: {"fr": "Acompte au cadrage, solde à la recette", "en": "Deposit at kickoff, balance upon sign-off", "ar": "تسبيق عند التأطير، والباقي عند المصادقة"},
    proc_kpi_3_val: {"fr": "0 MAD", "en": "0 MAD", "ar": "0 درهم"},
    proc_kpi_3_label: {"fr": "Coût par Clic", "en": "Cost per Click", "ar": "تكلفة النقرة"},
    proc_kpi_3_desc: {"fr": "Trafic organique Google 100% propriétaire", "en": "100% proprietary organic Google traffic", "ar": "زيارات غوغل عضوية ملكك 100%"},
    proc_kpi_4_val: {"fr": "100% Offert", "en": "100% Free", "ar": "100% مجاناً"},
    proc_kpi_4_label: {"fr": "Audit Étape 02", "en": "Step 02 Audit", "ar": "تدقيق المرحلة 02"},
    proc_kpi_4_desc: {"fr": "15 min d'échange direct sans engagement", "en": "15 min strategy call, zero commitment", "ar": "15 دقيقة تشخيص دون التزام"},
    proc_tab_all: {"fr": "Toutes les 9 Étapes", "en": "All 9 Steps", "ar": "كافة الخطوات الـ 9"},
    proc_tab_p1: {"fr": "Phase 1 : Cadrage (1 à 5)", "en": "Phase 1: Scoping (1 to 5)", "ar": "المرحلة 1: التأطير (1-5)"},
    proc_tab_p2: {"fr": "Phase 2 : Sprint (6 & 7)", "en": "Phase 2: Sprint (6 & 7)", "ar": "المرحلة 2: التطوير (6-7)"},
    proc_tab_p3: {"fr": "Phase 3 : Croissance (8 & 9)", "en": "Phase 3: Growth (8 & 9)", "ar": "المرحلة 3: النمو (8-9)"},
    proc_deliv_label: {"fr": "Livrable :", "en": "Deliverable:", "ar": "المخرج :"},
    proc_chan_label: {"fr": "Format :", "en": "Format:", "ar": "الصيغة :"},
    funnel_s1_deliv: {"fr": "Cartographie sémantique des courtiers de votre ville", "en": "Semantic mapping of local insurance brokers", "ar": "خريطة دلالية لوسطاء التأمين بمدينتك"},
    funnel_s1_chan: {"fr": "Google Maps, registre local & étude concurrentielle", "en": "Google Maps, local registry & competitor audit", "ar": "خرائط غوغل، السجل المحلي ودراسة المنافسين"},
    funnel_s2_deliv: {"fr": "Rapport sémantique 5 pages & estimation de devis mensuels", "en": "5-page keyword report & monthly quote estimates", "ar": "تقرير سيو من 5 صفحات وتقدير طلبات التسعير"},
    funnel_s2_chan: {"fr": "Échange direct 15 min en visio ou WhatsApp", "en": "15-min direct call via Video or WhatsApp", "ar": "محادثة مباشرة 15 دقيقة عبر واتساب أو مكالمة"},
    funnel_s3_deliv: {"fr": "Verrouillage de votre zone exclusive & ciblage produits", "en": "Territory lock & priority product line selection", "ar": "حجز منطقتك الحصرية وتحديد المنتجات ذات الأولوية"},
    funnel_s3_chan: {"fr": "Directeur d'acquisition dédié AssurLead", "en": "Dedicated AssurLead Acquisition Director", "ar": "مدير استقطاب مخصص من أسورليد"},
    funnel_s4_deliv: {"fr": "Plan d'action chiffré sous 24h & contrat d'engagement", "en": "Quantified proposal under 24h & legal contract", "ar": "خطة عمل مسعرة خلال 24 ساعة وعقد رسمي"},
    funnel_s4_chan: {"fr": "Formule Starter, Growth, Lead Engine ou Acquisition", "en": "Starter, Growth, Lead Engine or Custom Tier", "ar": "باقة Starter، Growth، Lead Engine أو المخصصة"},
    funnel_s5_deliv: {"fr": "Facture officielle d'acompte 50% & créneau de production", "en": "50% deposit invoice & guaranteed production slot", "ar": "فاتورة رسمية لتسبيق 50% وحجز رسمي في جدول الإنتاج"},
    funnel_s5_chan: {"fr": "Virement bancaire professionnel sécurisé", "en": "Secure commercial bank transfer", "ar": "تحويل بنكي مهني آمن"},
    funnel_s6_deliv: {"fr": "Plateforme web sur-mesure validée Google Core Web Vitals", "en": "Custom web build verified on Google Core Web Vitals", "ar": "منصة ويب مخصصة موافقة لمعايير غوغل للسرعة"},
    funnel_s6_chan: {"fr": "Sprint continu 7 à 10 jours ouvrés", "en": "Continuous 7 to 10 business day sprint", "ar": "سباق برمجي متواصل من 7 إلى 10 أيام عمل"},
    funnel_s7_deliv: {"fr": "Domaine .ma/.com, certificat SSL HTTPS & validation finale", "en": ".ma/.com domain, HTTPS SSL & final client sign-off", "ar": "اسم النطاق .ma/.com، شهادة SSL والمصادقة النهائية"},
    funnel_s7_chan: {"fr": "Tests en direct des formulaires et du bouton WhatsApp", "en": "Live testing of lead intake forms and WhatsApp", "ar": "اختبار حي ومباشر لنماذج التسعير وزر واتساب"},
    funnel_s8_deliv: {"fr": "Balisage Schema.org LocalBusiness & indexation Google", "en": "Schema.org LocalBusiness markup & Google indexation", "ar": "ترميز سكيما للمؤسسات المحلية وفهرسة غوغل"},
    funnel_s8_chan: {"fr": "Ciblage du Top 3 local sur les devis d'assurance", "en": "Targeting local Top 3 on insurance quotes", "ar": "استهداف المراتب الثلاث الأولى لطلبات التأمين"},
    funnel_s9_deliv: {"fr": "Reporting mensuel de leads, maintenance & baisse du CAC", "en": "Monthly leads report, maintenance & CAC reduction", "ar": "تقرير شهري للعملاء، صيانة دورية وخفض تكلفة الاكتساب"},
    funnel_s9_chan: {"fr": "Modèle récurrent sans engagement de durée", "en": "Recurring retainer with zero lock-in", "ar": "نموذج اشتراك مرن دون التزام طويل الأمد"},
    proc_sim_badge: {"fr": "CALENDRIER ESTIMATIF", "en": "DEPLOYMENT TIMELINE", "ar": "الجدول الزمني التقديري"},
    proc_sim_title: {"fr": "Simulateur de Calendrier de Déploiement en 14 Jours", "en": "14-Day Deployment Schedule Simulator", "ar": "محاكي جدول الإطلاق والتسليم خلال 14 يوماً"},
    proc_sim_desc: {"fr": "Découvrez vos dates jalons clés selon votre jour de démarrage avec l'agence AssurLead.", "en": "Discover your key milestone dates based on your kickoff day with AssurLead.", "ar": "اكتشف المواعيد الدقيقة لكل مرحلة وفقاً ليوم انطلاق مشروعك مع وكالة أسورليد."},
    proc_sim_btn_mon: {"fr": "Démarrer ce Lundi", "en": "Start This Monday", "ar": "البدء يوم الإثنين القادم"},
    proc_sim_btn_today: {"fr": "Démarrer Aujourd'hui", "en": "Start Today", "ar": "البدء اليوم"},
    proc_sim_btn_custom: {"fr": "Date Personnalisée", "en": "Custom Date", "ar": "تاريخ مخصص"},
    proc_sim_btn_next_month: {"fr": "Démarrer le 1er du Mois", "en": "Start 1st of Month", "ar": "البدء أول الشهر"},
    proc_sim_m1_day: {"fr": "JOUR 0", "en": "DAY 0", "ar": "اليوم 0"},
    proc_sim_m1_title: {"fr": "Audit Gratuit 15 min", "en": "Free 15-min Audit", "ar": "تدقيق مجاني لمدة 15 دقيقة"},
    proc_sim_m1_desc: {"fr": "Analyse sémantique complète des devis de votre ville.", "en": "Full semantic analysis of insurance quote searches in your city.", "ar": "تحليل دلالي شامل لحجم طلبات تسعير التأمين بمدينتك."},
    proc_sim_m2_day: {"fr": "JOUR +1", "en": "DAY +1", "ar": "اليوم +1"},
    proc_sim_m2_title: {"fr": "Proposition Chiffrée", "en": "Quoted Action Plan", "ar": "عرض تجاري مفصل"},
    proc_sim_m2_desc: {"fr": "Remise du plan d'action sous 24h & contrat d'engagement.", "en": "Turnkey proposal within 24h and agency commitment agreement.", "ar": "تسليم خطة العمل الرقمية خلال 24 ساعة وعقد الالتزام."},
    proc_sim_m3_day: {"fr": "JOUR +2", "en": "DAY +2", "ar": "اليوم +2"},
    proc_sim_m3_title: {"fr": "Acompte 50% & Cadrage", "en": "50% Deposit & Kickoff", "ar": "تسبيق 50% وانطلاق المشروع"},
    proc_sim_m3_desc: {"fr": "Verrouillage de votre créneau de production et exclusivité.", "en": "Locking production schedule and territory exclusivity.", "ar": "حجز خانة الإنتاج وتثبيت الحصرية الجغرافية لمنطقتك."},
    proc_sim_m4_day: {"fr": "JOUR +10", "en": "DAY +10", "ar": "اليوم +10"},
    proc_sim_m4_title: {"fr": "Fin de Sprint Technique", "en": "Tech Sprint Delivery", "ar": "اكتمال السباق التقني"},
    proc_sim_m4_desc: {"fr": "Site développé, responsive mobile & intégration WhatsApp.", "en": "Full development, mobile responsive & direct WhatsApp routing.", "ar": "موقع مطور بالكامل، متوافق مع الهواتف ومربوط بواتساب."},
    proc_sim_m5_day: {"fr": "JOUR +14", "en": "DAY +14", "ar": "اليوم +14"},
    proc_sim_m5_title: {"fr": "Mise en Ligne & SEO", "en": "Launch & Google SEO", "ar": "الإطلاق الرسمي وفهرسة غوغل"},
    proc_sim_m5_desc: {"fr": "Déploiement HTTPS, déclaration Google Search Console & leads.", "en": "HTTPS deployment, Search Console registration & live leads.", "ar": "إطلاق آمن ببروتوكول HTTPS، ربط بغوغل وبدء استقبال العملاء."},
    proc_faq_badge: {"fr": "TRANSPARENCE TOTALE", "en": "COMPLETE TRANSPARENCY", "ar": "شفافية تامة"},
    proc_faq_title: {"fr": "Questions Fréquentes sur notre Processus", "en": "Frequently Asked Questions About Our Process", "ar": "الأسئلة الشائعة حول مسار العمل والمنهجية"},
    proc_faq_sub: {"fr": "Les réponses claires et contractuelles à toutes vos interrogations avant de réserver votre audit.", "en": "Clear and contractual answers to all your questions before booking your audit.", "ar": "إجابات واضحة ودقيقة على كافة تساؤلاتك قبل حجز تدقيقك المجاني."},
    proc_faq_q1: {"fr": "Que comprend exactement l'audit gratuit de 15 minutes à l'étape 02 ?", "en": "What is included in the free 15-minute audit at Step 02?", "ar": "ماذا يشمل تحديداً التدقيق المجاني لمدة 15 دقيقة في المرحلة 02؟"},
    proc_faq_a1: {"fr": "Nous analysons le volume exact de recherches de devis d'assurance sur votre ville (Auto, Santé, Risques Pro), le positionnement de vos concurrents directs et les failles de votre site actuel. Vous repartez avec des données chiffrées réelles, sans aucun engagement.", "en": "We analyze exact insurance quote search volumes in your city (Auto, Health, Commercial), competitor rankings, and technical flaws in your existing website. You receive concrete data with zero obligation.", "ar": "نقوم بتحليل دقيق لحجم عمليات البحث عن تسعيرات التأمين بمدينتك (السيارات، الصحة، الشركات)، ومواقع منافسيك ونقاط ضعف موقعك الحالي. ستحصل على أرقام واقعية دون أي التزام."},
    proc_faq_q2: {"fr": "Pourquoi demandez-vous 50 % d'acompte à l'étape 05 ?", "en": "Why is a 50% deposit required at Step 05?", "ar": "لماذا تطلبون تسبيقاً بنسبة 50% في المرحلة 05؟"},
    proc_faq_a2: {"fr": "Cet acompte formalise l'engagement mutuel et verrouille votre créneau exclusif dans notre calendrier de production. Dès réception, nos ingénieurs et rédacteurs démarrent immédiatement le sprint technique sans retard.", "en": "This deposit solidifies mutual commitment and secures your exclusive slot in our production schedule. Upon receipt, our engineers and copywriters initiate the sprint immediately without delay.", "ar": "يضفي هذا التسبيق الطابع الرسمي على الالتزام المتبادل ويحجز خانتك الحصرية في جدول الإنتاج. بمجرد التوصل به، ينطلق مهندسونا مباشرة في السباق البرمجي دون أي تأخير."},
    proc_faq_q3: {"fr": "Comment est garantie mon exclusivité territoriale ?", "en": "How is my territorial exclusivity guaranteed?", "ar": "كيف يتم ضمان حصريتي الجغرافية؟"},
    proc_faq_a3: {"fr": "Elle est inscrite noir sur blanc dans notre contrat d'agence : nous ne collaborons qu'avec un seul courtier ou cabinet d'assurance par zone géographique définie, évitant tout conflit d'intérêts direct.", "en": "It is written clearly into our agency contract: we only partner with one insurance broker per defined territory, eliminating direct conflicts of interest.", "ar": "يتم تضمينها بوضوح في عقد الوكالة: نحن نتعامل مع وسيط أو مكتب تأمين واحد فقط لكل منطقة جغرافية محددة، لتفادي أي تضارب مباشر في المصالح."},
    proc_faq_q4: {"fr": "Que se passe-t-il si les délais de livraison ne sont pas respectés ?", "en": "What happens if delivery timelines are not met?", "ar": "ماذا يحدث إذا لم يتم احترام مواعيد التسليم؟"},
    proc_faq_a4: {"fr": "Notre processus normé en sprint de 7 à 10 jours ouvrés garantit une livraison ponctuelle. En cas de dépassement imputable à notre agence, le premier mois d'abonnement SEO et maintenance vous est entièrement offert.", "en": "Our standardized 7-10 business day sprint guarantees timely launch. In the unlikely event of agency delay, your first month of SEO and maintenance retainer is completely free.", "ar": "منهجيتنا المحددة في سباق من 7 إلى 10 أيام عمل تضمن التسليم في الموعد. وفي حال حدوث أي تأخير من طرف الوكالة، نقدم لك الشهر الأول من صيانة وسيو مجاناً بالكامل."},
    proc_faq_q5: {"fr": "Le site et les prospects m'appartiennent-ils réellement à 100 % ?", "en": "Do I own 100% of the website and generated leads?", "ar": "هل أملك الموقع والعملاء بنسبة 100% حقاً؟"},
    proc_faq_a5: {"fr": "Oui, sans aucune exception. Vous êtes propriétaire exclusif du nom de domaine, du code source, de la base de données et de l'intégralité des devis entrants. Aucun système captif.", "en": "Yes, without exception. You hold 100% ownership of domain, codebase, database, and all inbound leads. Zero vendor lock-in.", "ar": "نعم، وبدون أي استثناء. أنت المالك الحصري والوحيد لاسم النطاق، الكود المصدري، قاعدة البيانات وكافة طلبات التسعير الواردة دون أي قيود."},
    aga_faq_badge: {
        fr: "FAQ Spécialisée",
        en: "Local FAQ",
        ar: "الأسئلة الشائعة"
    },
    casa_s1_desc: {
        fr: "Conception adaptée aux smartphones (91% du trafic à Casablanca), ergonomie fluide et valorisation de votre image de marque.",
        en: "Optimized for mobile (91% of Casablanca web traffic), smooth ergonomics and strong brand elevation.",
        ar: "تصميم متوافق تماماً مع الهواتف الذكية وتجربة تصفح سلسة تعزز مكانة علامتك التجارية."
    },
    casa_s1_title: {
        fr: "SITE VITRINE & RESPONSIVE",
        en: "RESPONSIVE SHOWCASE SITE",
        ar: "موقع تعريفي متجاوب"
    },
    maroc_cta_title: {
        fr: "Prêt à lancer votre moteur d'acquisition au Maroc ?",
        en: "Ready to launch your acquisition engine in Morocco?",
        ar: "هل أنت مستعد لإطلاق منظومة الاستقطاب لمشروعك بالمغرب؟"
    },
    maroc_s1_desc: {
        fr: "Plateformes vitrines institutionnelles ou boutiques e-commerce à forte conversion conçues pour les entreprises marocaines.",
        en: "High-conversion corporate showcase sites and e-commerce stores engineered for Moroccan businesses.",
        ar: "مواقع تعريفية ومتاجر إلكترونية عالية التحويل مصممة خصيصاً للشركات المغربية."
    },
    maroc_s1_title: {
        fr: "SITE VITRINE & E-COMMERCE",
        en: "SHOWCASE & E-COMMERCE SITE",
        ar: "موقع تعريفي ومتجر إلكتروني"
    },
    maroc_sec_badge: {
        fr: "Envergure Nationale",
        en: "Nationwide Reach",
        ar: "تغطية وطنية شاملة"
    },
    maroc_sec_desc: {
        fr: "Des infrastructures web pensées pour couvrir l'ensemble du marché marocain et asseoir votre leadership.",
        en: "Web infrastructure engineered to cover the whole Moroccan market and secure industry leadership.",
        ar: "بنية رقمية متطورة لتغطية السوق المغربي بالكامل وترسيخ ريادتك في مجالك."
    },
    maroc_sec_title: {
        fr: "Ce que comprend la création de site web au Maroc",
        en: "What Morocco Website Creation Includes",
        ar: "ما يشمله إنشاء المواقع في المغرب"
    },
    fes_faq_badge: {
        fr: "FAQ Spécialisée",
        en: "Local FAQ",
        ar: "الأسئلة الشائعة"
    },
    fes_faq_sub: {
        fr: "Toutes les réponses pour préparer votre projet web en toute sérénité.",
        en: "All the answers you need to prepare your web project with peace of mind.",
        ar: "جميع الإجابات لتجهيز مشروعك الرقمي بكل اطمئنان."
    },
    leads_faq_a1: {
        fr: "Nous positionnons votre cabinet sur les requêtes à forte intention d'achat (devis assurance auto, mutuelle santé entreprise, etc.) et connectons chaque visiteur directement à votre WhatsApp commercial.",
        en: "We rank your brokerage on high-intent search terms (auto insurance quote, business health insurance, etc.) routing every lead directly to your WhatsApp sales team.",
        ar: "نضع وكالتك في صدارة الكلمات ذات نية الشراء العالية ونربط كل زائر بمستشارك التجاري عبر واتساب."
    },
    leads_faq_a2: {
        fr: "100% exclusifs. Les leads générés par votre plateforme n'appartiennent qu'à votre cabinet et ne sont jamais revendus à des tiers.",
        en: "100% exclusive. Inbound leads generated on your platform belong only to your brokerage and are never resold.",
        ar: "حصرية 100%. العملاء المتوافدون عبر موقعك ملك خاص لوكالتك ولا تتم مشاركتهم مع أي جهة أخرى."
    },
    leads_faq_a3: {
        fr: "Notre sprint de production livre votre dispositif complet en 10 à 14 jours ouvrés.",
        en: "Our dedicated production sprint delivers your complete acquisition system in 10 to 14 business days.",
        ar: "نسلم منظومتك التسويقية المتكاملة في مدة قياسية تتراوح بين 10 و14 يوم عمل."
    },
    leads_faq_badge: {
        fr: "FAQ Acquisition Assurance",
        en: "Insurance Acquisition FAQ",
        ar: "الأسئلة الشائعة لتأمين العملاء"
    },
    leads_faq_q1: {
        fr: "Comment AssurLead génère-t-il des leads d'assurance au Maroc ?",
        en: "How does AssurLead generate insurance leads in Morocco?",
        ar: "كيف تجلب أسورليد عملاء التأمين في المغرب؟"
    },
    leads_faq_q2: {
        fr: "Les prospects sont-ils exclusifs à mon cabinet ?",
        en: "Are incoming leads exclusive to my agency?",
        ar: "هل العملاء المتوافدون حصريون لوكالتي فقط؟"
    },
    leads_faq_q3: {
        fr: "Quel est le délai pour lancer mon dispositif ?",
        en: "What is the launch timeline?",
        ar: "كم تستغرق مدة إطلاق المنظومة؟"
    },
    leads_faq_title: {
        fr: "Questions fréquentes sur la <span class=\"neon\">génération de leads assurance</span>",
        en: "Frequently Asked Questions on <span class=\"neon\">Insurance Lead Generation</span>",
        ar: "الأسئلة الشائعة حول <span class=\"neon\">جلب عملاء التأمين</span>"
    },
    leads_s1_desc: {
        fr: "Capturez les contrats à haute valeur auprès des transporteurs, entreprises de BTP et gestionnaires de flottes au Maroc.",
        en: "Capture high-value corporate policies from haulage firms, construction companies, and commercial fleet managers across Morocco.",
        ar: "استقطب عقود التأمين الكبرى من شركات النقل والمقاولات ومديري أساطيل السيارات في المغرب."
    },
    leads_s1_title: {
        fr: "Flotte Automobile & Transport",
        en: "Commercial Fleet & Transport",
        ar: "أساطيل السيارات والنقل"
    },
    leads_sec_badge: {
        fr: "Branches Clés d'Assurance",
        en: "Key Insurance Lines",
        ar: "الفروع الاستراتيجية للتأمين"
    },
    leads_sec_desc: {
        fr: "Des tunnels de devis calibrés sur les polices les plus rentables du marché marocain.",
        en: "Tailored quote funnels focused on the most profitable policies in the Moroccan market.",
        ar: "مسارات عروض أسعار متخصصة تركز على الفروع الأكثر ربحية بالسوق المغربي."
    },
    leads_sec_title: {
        fr: "Les spécialités d'assurance à fort volume d'acquisition",
        en: "High-Volume Acquisition Insurance Specialties",
        ar: "تخصصات التأمين ذات الإقبال الكبير"
    },
    kech_faq_badge: {
        fr: "FAQ Spécialisée",
        en: "Local FAQ",
        ar: "الأسئلة الشائعة"
    },
    funnel_s9_badge: {
        fr: "RÉCURRENCE AGENCE",
        en: "AGENCY RETAINER",
        ar: "نموذج الوكالة المستمر"
    },
    rabat_faq_badge: {
        fr: "FAQ Spécialisée",
        en: "Local FAQ",
        ar: "الأسئلة الشائعة"
    },
    rabat_faq_sub: {
        fr: "Toutes les réponses pour préparer votre projet web en toute sérénité.",
        en: "All the answers you need to prepare your web project with peace of mind.",
        ar: "جميع الإجابات لتجهيز مشروعك الرقمي بكل اطمئنان."
    },
    seo_casa_faq_a1: {
        fr: "Le référencement naturel pérennise votre flux de prospects sans payer chaque clic. Une fois positionné en 1ère page Google, votre visibilité travaille pour vous 24h/24.",
        en: "Organic SEO creates a continuous lead flow without paying per click. Once ranked on Page 1, your visibility generates business 24/7.",
        ar: "يضمن السيو تدفقاً متواصلاً للعملاء دون الدفع مقابل كل نقرة، ويجعل ظهورك يعمل لصالحك على مدار الساعة."
    },
    seo_casa_faq_a2: {
        fr: "Les premiers résultats s'observent sous 3 à 6 semaines, avec une montée en puissance progressive de vos positions sur Casablanca.",
        en: "Initial ranking gains appear within 3 to 6 weeks, scaling steadily across high-value Casablanca searches.",
        ar: "تظهر أولى النتائج في غضون 3 إلى 6 أسابيع مع تصاعد مستمر في الترتيب بالدار البيضاء."
    },
    seo_casa_faq_a3: {
        fr: "Oui, nous configurons et dynamisons votre fiche Google Business Profile pour capter les appels et itinéraires locaux.",
        en: "Yes, we tune and optimize your Google Business Profile to capture direct local phone calls and map requests.",
        ar: "نعم، نقوم بتهيئة وتطوير حساب Google Business Profile لجلب الاتصالات وزيارات الزبائن."
    },
    seo_casa_faq_badge: {
        fr: "FAQ Référencement SEO",
        en: "SEO FAQ",
        ar: "الأسئلة الشائعة في السيو"
    },
    seo_casa_faq_q1: {
        fr: "Pourquoi le SEO est-il plus rentable que la publicité payante à Casablanca ?",
        en: "Why is SEO more profitable than paid ads in Casablanca?",
        ar: "لماذا يعتبر السيو أكثر ربحية من الإعلانات المدفوعة بالدار البيضاء؟"
    },
    seo_casa_faq_q2: {
        fr: "Combien de temps faut-il pour atteindre la 1ère page Google ?",
        en: "How long does it take to reach Google Page 1?",
        ar: "كم يستغرق الوصول إلى الصفحة الأولى على غوغل؟"
    },
    seo_casa_faq_q3: {
        fr: "Optimisez-vous aussi Google Maps à Casablanca ?",
        en: "Do you also optimize Google Maps in Casablanca?",
        ar: "هل تشمل الخدمة تحسين التواجد على خرائط جوجل بالدار البيضاء؟"
    },
    seo_casa_faq_sub: {
        fr: "Toutes les réponses pour comprendre la puissance du référencement naturel local.",
        en: "All the answers to understand the power of local organic search ranking.",
        ar: "كل الإجابات لفهم قوة التموضع الطبيعي المحلي على محركات البحث."
    },
    seo_casa_faq_title: {
        fr: "Questions fréquentes sur le <span class=\"neon\">référencement SEO à Casablanca</span>",
        en: "Frequently Asked Questions on <span class=\"neon\">Casablanca Google SEO</span>",
        ar: "الأسئلة الشائعة حول <span class=\"neon\">السيو في الدار البيضاء</span>"
    },
    seo_casa_s1_desc: {
        fr: "Optimisation des Core Web Vitals, balisage Schema.org LocalBusiness et architecture technique pour un crawl Google sans faille.",
        en: "Core Web Vitals tuning, Schema.org LocalBusiness markup, and clean technical architecture for flawless Google crawling.",
        ar: "تحسين سرعة Core Web Vitals، وسوم Schema.org وبنية تقنية تضمن أرشفة مثالية وسريعة من عناكب جوجل."
    },
    seo_casa_s1_title: {
        fr: "Audit Technique & Vitesse",
        en: "Technical Audit & Speed",
        ar: "التدقيق التقني والسرعة"
    },
    seo_casa_sec_badge: {
        fr: "Expertise SEO Casablanca",
        en: "Casablanca SEO Expertise",
        ar: "خبرة السيو بالدار البيضاء"
    },
    seo_casa_sec_desc: {
        fr: "Une méthodologie rigoureuse qui place votre site devant vos concurrents sur les mots-clés qui comptent.",
        en: "A rigorous methodology positioning your site ahead of competitors on keywords that drive revenue.",
        ar: "منهجية دقيقة تضع موقعك أمام جميع المنافسين على الكلمات المفتاحية الأكثر ربحية."
    },
    seo_casa_sec_title: {
        fr: "Notre méthode pour dominer la 1ère page Google à Casablanca",
        en: "Our Method to Dominate Google Page 1 in Casablanca",
        ar: "منهجيتنا لتصدر الصفحة الأولى على غوغل في الدار البيضاء"
    },
    tgr_faq_badge: {
        fr: "FAQ Spécialisée",
        en: "Local FAQ",
        ar: "الأسئلة الشائعة"
    },
    nav_home: {
        fr: "Accueil",
        en: "Home",
        ar: "الرئيسية"
    },
    nav_casablanca: {
        fr: "Casablanca",
        en: "Casablanca",
        ar: "الدار البيضاء"
    },
    nav_maroc: {
        fr: "Maroc",
        en: "Morocco",
        ar: "المغرب"
    },
    nav_processus: {
        fr: "Processus",
        en: "Process",
        ar: "المسار"
    },
    nav_consultation: {
        fr: "Consultation Gratuite",
        en: "Free Consultation",
        ar: "استشارة مجانية"
    },
    breadcrumb_back: {
        fr: "<i class=\"fas fa-arrow-left\"></i> <span>Revenir à l'accueil du site</span>",
        en: "<i class=\"fas fa-arrow-left\"></i> <span>Back to main home</span>",
        ar: "<i class=\"fas fa-arrow-right\"></i> <span>العودة للصفحة الرئيسية</span>"
    },
    funnel_step_01: {
        fr: "ÉTAPE 01",
        en: "STEP 01",
        ar: "الخطوة 01"
    },
    funnel_step_02: {
        fr: "ÉTAPE 02",
        en: "STEP 02",
        ar: "الخطوة 02"
    },
    funnel_step_03: {
        fr: "ÉTAPE 03",
        en: "STEP 03",
        ar: "الخطوة 03"
    },
    funnel_step_04: {
        fr: "ÉTAPE 04",
        en: "STEP 04",
        ar: "الخطوة 04"
    },
    funnel_step_05: {
        fr: "ÉTAPE 05",
        en: "STEP 05",
        ar: "الخطوة 05"
    },
    funnel_step_06: {
        fr: "ÉTAPE 06",
        en: "STEP 06",
        ar: "الخطوة 06"
    },
    funnel_step_07: {
        fr: "ÉTAPE 07",
        en: "STEP 07",
        ar: "الخطوة 07"
    },
    funnel_step_08: {
        fr: "ÉTAPE 08",
        en: "STEP 08",
        ar: "الخطوة 08"
    },
    funnel_step_09: {
        fr: "ÉTAPE 09",
        en: "STEP 09",
        ar: "الخطوة 09"
    },
    funnel_phase1_timing: {
        fr: "Délais : 24 à 48 heures",
        en: "Turnaround: 24 to 48 hours",
        ar: "المدة: 24 إلى 48 ساعة"
    },
    funnel_phase2_timing: {
        fr: "Sprint garanti : 7 à 10 jours ouvrés",
        en: "Guaranteed sprint: 7 to 10 business days",
        ar: "إنجاز مضمون: 7 إلى 10 أيام عمل"
    },
    funnel_phase3_timing: {
        fr: "Modèle agence : mensuel récurrent sans engagement",
        en: "Agency model: monthly retainer with no lock-in",
        ar: "نموذج الوكالة: اشتراك شهري مستمر بدون التزام"
    },
    funnel_flow_contract: {
        fr: "Contractualisation & Verrouillage Territoire",
        en: "Contracting & Territory Lock",
        ar: "التعاقد وتثبيت المنطقة الحصرية"
    },
    funnel_s2_offert: {
        fr: "100% OFFERT",
        en: "100% FREE",
        ar: "100% مجاني"
    },
    funnel_s2_cta: {
        fr: "<i class=\"fab fa-whatsapp\"></i> Réserver cet Audit (Offert) <i class=\"fas fa-arrow-right\"></i>",
        en: "<i class=\"fab fa-whatsapp\"></i> Book this Free Audit <i class=\"fas fa-arrow-right\"></i>",
        ar: "<i class=\"fab fa-whatsapp\"></i> حجز هذا التدقيق (مجاناً) <i class=\"fas fa-arrow-left\"></i>"
    },
    funnel_guar_title: {
        fr: "<i class=\"fas fa-award neon\"></i> Pourquoi ce système fait d'AssurLead une vraie agence structurée ?",
        en: "<i class=\"fas fa-award neon\"></i> Why does this system make AssurLead a truly structured agency?",
        ar: "<i class=\"fas fa-award neon\"></i> لماذا يجعل هذا النظام من أسورليد وكالة حقيقية منظمة وموثوقة؟"
    },
    funnel_g1_title: {
        fr: "Exclusivité Territoriale",
        en: "Territorial Exclusivity",
        ar: "حصرية جغرافية تامة"
    },
    funnel_g1_desc: {
        fr: "Un seul courtier partenaire par zone géographique pour éviter tout conflit d'intérêts direct.",
        en: "Only one partner broker per geographic territory to prevent direct conflict of interest.",
        ar: "وسيط شريك واحد فقط لكل منطقة جغرافية لمنع أي تضارب مباشر في المصالح."
    },
    funnel_g2_title: {
        fr: "Contrat & Acompte 50%",
        en: "Contract & 50% Deposit",
        ar: "عقد قانوني ودفعة 50%"
    },
    funnel_g2_desc: {
        fr: "Un cadre juridique clair avec calendrier d'exécution strict et protection financière mutuelle.",
        en: "Clear legal contract with rigorous execution milestones and mutual financial protection.",
        ar: "إطار قانوني واضح بجدول زمني محدد وحماية مالية متبادلة للطرفين."
    },
    funnel_g3_title: {
        fr: "Sprint Industriel 7-10j",
        en: "Industrial Sprint 7-10 Days",
        ar: "إنتاج سريع في 7-10 أيام"
    },
    funnel_g3_desc: {
        fr: "Une chaîne de production normée, sans retard et validée selon les Core Web Vitals de Google.",
        en: "Standardized production line delivered on time and validated on Google Core Web Vitals.",
        ar: "خط إنتاج منظم دون أي تأخير ومطابق لمعايير الأداء والسرعة من جوجل."
    },
    funnel_g4_title: {
        fr: "Accompagnement MRR",
        en: "Monthly Retainer & Growth",
        ar: "متابعة شهرية مستمرة"
    },
    funnel_g4_desc: {
        fr: "Un abonnement mensuel transparent centré sur le coût par lead qualifié et le retour sur investissement.",
        en: "Transparent monthly retainer focused on qualified lead cost and measurable ROI.",
        ar: "اشتراك شهري شفاف يركز على تكلفة العميل المؤهل وتحقيق أعلى عائد على الاستثمار."
    },
    kpi_speed_val: {
        fr: "< 1.2s",
        en: "< 1.2s",
        ar: "< 1.2ث"
    },
    kpi_speed_title: {
        fr: "Temps de Chargement",
        en: "Loading Speed",
        ar: "سرعة التحميل"
    },
    kpi_speed_desc: {
        fr: "Vitesse mobile ultra-rapide validée sur les Core Web Vitals de Google.",
        en: "Ultra-fast mobile speed validated on Google Core Web Vitals.",
        ar: "سرعة فائقة على الهواتف متوافقة مع معايير Google Core Web Vitals."
    },
    kpi_delay_val: {
        fr: "10 - 14j",
        en: "10 - 14d",
        ar: "10 - 14 يوماً"
    },
    kpi_delay_title: {
        fr: "Délai Garanti",
        en: "Guaranteed Deadline",
        ar: "مدة تسليم مضمونة"
    },
    kpi_delay_desc: {
        fr: "Livraison clé en main avec nom de domaine, hébergement SSL et SEO configuré.",
        en: "Turnkey delivery with domain name, secure SSL hosting, and SEO setup.",
        ar: "تسليم متكامل مع اسم النطاق واستضافة آمنة بشهادة SSL وتهيئة السيو."
    },
    kpi_owner_val: {
        fr: "100%",
        en: "100%",
        ar: "100%"
    },
    kpi_owner_title: {
        fr: "Propriété Exclusive",
        en: "Exclusive Ownership",
        ar: "ملكية حصرية كاملة"
    },
    kpi_owner_desc: {
        fr: "Code source et leads 100% propriétaires à votre entreprise, sans dépendance tierce.",
        en: "Source code and customer leads 100% owned by your company, no vendor lock-in.",
        ar: "الشفرة البرمجية وقاعدة بيانات العملاء ملك خالص لشركتك دون أي تبعية."
    },
    kpi_whatsapp_val: {
        fr: "1 clic",
        en: "1 click",
        ar: "نقرة واحدة"
    },
    kpi_whatsapp_title: {
        fr: "Tunnel WhatsApp",
        en: "WhatsApp Funnel",
        ar: "مسار واتساب مباشر"
    },
    kpi_whatsapp_desc: {
        fr: "Routage instantané des visiteurs vers vos commerciaux sans friction.",
        en: "Instant frictionless routing of visitors straight to your sales advisors.",
        ar: "توجيه فوري وسلس للزوار نحو فريق مبيعاتك بنقرة واحدة."
    },
    pillar_section_badge: {
        fr: "Méthode en 4 Étapes",
        en: "4-Step Process",
        ar: "منهجية في 4 خطوات"
    },
    pillar_1_title: {
        fr: "1. Audit & Cadrage Stratégique",
        en: "1. Audit & Strategic Scoping",
        ar: "1. التدقيق والتأطير الاستراتيجي"
    },
    pillar_1_desc: {
        fr: "Analyse de vos cibles locales, des mots-clés recherchés au Maroc et définition de l'arborescence de votre site.",
        en: "Analysis of your local target audience, high-intent Moroccan search queries, and site architecture mapping.",
        ar: "تحليل جمهورك المستهدف، الكلمات المفتاحية الأكثر بحثاً في المغرب وتحديد هيكل الموقع."
    },
    pillar_2_title: {
        fr: "2. Design UI/UX & Rédaction",
        en: "2. UI/UX Design & Copywriting",
        ar: "2. تصميم عصري وصياغة مقنعة"
    },
    pillar_2_desc: {
        fr: "Création graphique sur-mesure aux couleurs de votre marque et rédaction persuasive orientée conversion de contacts.",
        en: "Tailored brand visual design and persuasive copywriting focused on inbound lead conversion.",
        ar: "تصميم مخصص يعكس هويتك وصياغة محتوى احترافي موجه لتحويل الزوار إلى زبائن."
    },
    pillar_3_title: {
        fr: "3. Livraison en 10-14 jours",
        en: "3. Turnkey Delivery in 10-14 Days",
        ar: "3. تسليم شامل في 10-14 يوماً"
    },
    pillar_3_desc: {
        fr: "Mise en ligne avec certificat SSL, vérification de la vitesse mobile et déclaration de l'indexation sur Google Search Console.",
        en: "Production launch with SSL certificate, mobile speed checks, and Google Search Console indexing submission.",
        ar: "الإطلاق مع شهادة أمان SSL، التحقق من سرعة الهواتف وطلب الأرشفة في Google Search Console."
    },
    pillar_4_title: {
        fr: "4. Acquisition & Suivi",
        en: "4. Inbound Acquisition & Support",
        ar: "4. الاستقطاب والمتابعة المستمرة"
    },
    pillar_4_desc: {
        fr: "Activation des canaux WhatsApp, accompagnement à la prise en main et suivi du positionnement local sur Google.",
        en: "Activation of WhatsApp funnels, operational onboarding, and continuous monitoring of local Google rankings.",
        ar: "تفعيل قنوات واتساب، التدريب على الاستخدام ومتابعة الترتيب المحلي على جوجل."
    },
    pricing_section_badge: {
        fr: "Grille Tarifaire Transparente",
        en: "Transparent Pricing Grid",
        ar: "أسعار شفافة ومحددة"
    },
    pricing_section_title: {
        fr: "Des tarifs clairs et sans frais cachés",
        en: "Clear Pricing With No Hidden Fees",
        ar: "أسعار واضحة وبدون أي رسوم خفية"
    },
    pricing_section_desc: {
        fr: "Nos formules répondent aux besoins réels des entreprises du Maroc, du lancement au système d'acquisition complet.",
        en: "Our plans fit the real needs of Moroccan businesses, from early launch to full-scale lead machines.",
        ar: "باقاتنا تلبي الاحتياجات الحقيقية للشركات في المغرب، من الانطلاقة وحتى منظومة الاستقطاب المتكاملة."
    },
    price_launch_badge: {
        fr: "OFFRE DE LANCEMENT",
        en: "LAUNCH OFFER",
        ar: "عرض الإطلاق"
    },
    price_p1_title: {
        fr: "Vitrine Essentielle — 1 500 DH",
        en: "Essential Showcase — 1,500 DH",
        ar: "الموقع التعريفي الأساسي — 1500 درهم"
    },
    price_p1_desc: {
        fr: "Offre valable jusqu'au 31/10/2026. Idéale pour démarrer avec une page de présentation soignée (n'inclut pas de SEO avancé ni de pages services dédiées).",
        en: "Offer valid until 31/10/2026. Ideal to start with a polished single landing page (excludes advanced SEO and dedicated service subpages).",
        ar: "عرض ساري حتى 31/10/2026. مثالي للانطلاق بصفحة تعريفية أنيقة (لا يشمل السيو المتقدم أو صفحات فرعية متعددة)."
    },
    price_starter_badge: {
        fr: "FORMULE STARTER",
        en: "STARTER PLAN",
        ar: "باقة الانطلاق"
    },
    price_p2_title: {
        fr: "Starter — 2 000 DH",
        en: "Starter — 2,000 DH",
        ar: "باقة Starter — 2000 درهم"
    },
    price_p2_desc: {
        fr: "Site professionnel clé en main, hébergement et nom de domaine inclus la 1ère année, responsive mobile et contact WhatsApp.",
        en: "Complete turnkey website, domain and hosting included for year 1, mobile responsive and direct WhatsApp button.",
        ar: "موقع احترافي متكامل، الاستضافة والنطاق مجاناً للسنة الأولى، متجاوب مع الهواتف وزر واتساب مباشر."
    },
    price_growth_badge: {
        fr: "LE PLUS POPULAIRE",
        en: "MOST POPULAR",
        ar: "الأكثر طلباً"
    },
    price_p3_title: {
        fr: "Growth — 4 500 DH",
        en: "Growth — 4,500 DH",
        ar: "باقة Growth — 4500 درهم"
    },
    price_p3_desc: {
        fr: "Site complet multipages avec référencement naturel local sur Google, tunnels de conversion et optimisation Google Business Profile.",
        en: "Complete multi-page site with local Google SEO, high-conversion funnels, and Google Business Profile setup.",
        ar: "موقع متعدد الصفحات مع سيو محلي متقدم على جوجل، مسارات تحويل وتهيئة حساب Google Business Profile."
    },
    price_lead_badge: {
        fr: "ACQUISITION ACTIVE",
        en: "ACTIVE ACQUISITION",
        ar: "استقطاب مكثف"
    },
    price_p4_title: {
        fr: "Lead Engine — 8 000 DH",
        en: "Lead Engine — 8,000 DH",
        ar: "باقة Lead Engine — 8000 درهم"
    },
    price_p4_desc: {
        fr: "Moteur d'acquisition intensif, fonctionnalités e-commerce ou formulaires de devis avancés pour PME et cabinets ambitieux.",
        en: "High-performance acquisition engine, e-commerce or advanced quote funnels for ambitious companies.",
        ar: "منظومة استقطاب مكثفة، إمكانات تجارة إلكترونية أو استمارات تسعير متطورة للشركات الطموحة."
    },
    case_callout_badge: {
        fr: "<span class=\"badge-flag\">🇲🇦</span> Étude de Cas Réelle",
        en: "<span class=\"badge-flag\">🇲🇦</span> Live Case Study",
        ar: "<span class=\"badge-flag\">🇲🇦</span> دراسة حالة واقعية"
    },
    case_callout_title: {
        fr: "Cabinet Assurances El Omrani (AXA Casablanca)",
        en: "Assurances El Omrani Broker (AXA Casablanca)",
        ar: "مكتب التأمين العمراني (أكسا الدار البيضاء)"
    },
    case_callout_desc: {
        fr: "Déploiement du site www.assuranceselomrani.com : un moteur digital ultra-rapide générant des demandes de devis d'assurance en flux continu avec un positionnement en 1ère page Google.",
        en: "Deployment of www.assuranceselomrani.com: an ultra-fast digital engine generating continuous quote requests with page 1 Google ranking.",
        ar: "إطلاق موقع www.assuranceselomrani.com: منصة رقمية فائقة السرعة تجلب طلبات عروض أسعار متواصلة مع تصدر الصفحة الأولى على جوجل."
    },
    case_callout_btn: {
        fr: "<i class=\"fas fa-arrow-right\"></i> Lire l'étude de cas complète",
        en: "<i class=\"fas fa-arrow-right\"></i> Read the full case study",
        ar: "<i class=\"fas fa-arrow-left\"></i> قراءة دراسة الحالة الكاملة"
    },
    case_stat_val: {
        fr: "1ère Page",
        en: "1st Page",
        ar: "الصفحة الأولى"
    },
    case_stat_label: {
        fr: "Google SEO Maroc",
        en: "Google SEO Morocco",
        ar: "سيو جوجل المغرب"
    },
    case_stat_sub: {
        fr: "Résultats mesurables et canal de contact direct WhatsApp actif 24h/24.",
        en: "Measurable results and direct active WhatsApp inquiry channel 24/7.",
        ar: "نتائج ملموسة وقناة تواصل واتساب نشطة على مدار الساعة."
    },
    consult_badge: {
        fr: "<span class=\"badge-flag\">🇲🇦</span> Déploiement Clé en Main",
        en: "<span class=\"badge-flag\">🇲🇦</span> Turnkey Deployment",
        ar: "<span class=\"badge-flag\">🇲🇦</span> تنفيذ وتسليم شامل"
    },
    consult_whatsapp_btn: {
        fr: "<i class=\"fab fa-whatsapp\"></i> Devis Rapide sur WhatsApp",
        en: "<i class=\"fab fa-whatsapp\"></i> Quick Quote on WhatsApp",
        ar: "<i class=\"fab fa-whatsapp\"></i> طلب عرض سعر فوري عبر واتساب"
    },
    consult_diag_btn: {
        fr: "Consulter le Diagnostic de Visibilité <i class=\"fas fa-chart-line\"></i>",
        en: "View Visibility Diagnostic <i class=\"fas fa-chart-line\"></i>",
        ar: "الاطلاع على تشخيص الرؤية الرقمية <i class=\"fas fa-chart-line\"></i>"
    },
    consult_trust_1: {
        fr: "Délai garanti 7-10 jours",
        en: "Guaranteed 7-10 day turnaround",
        ar: "مدة تسليم مضمونة 7-10 أيام"
    },
    consult_trust_2: {
        fr: "Sans engagement de durée",
        en: "No long-term commitment",
        ar: "بدون أي التزام زمني"
    },
    consult_trust_3: {
        fr: "Paiement 50/50 sécurisé",
        en: "Secure 50/50 payment",
        ar: "دفع آمن 50/50 على مرحلتين"
    },
    casa_hero_badge: {
        fr: "<span class=\"badge-flag\">🇲🇦</span> CASABLANCA & MÉTROPOLE ÉCONOMIQUE",
        en: "<span class=\"badge-flag\">🇲🇦</span> CASABLANCA & ECONOMIC HUB",
        ar: "<span class=\"badge-flag\">🇲🇦</span> الدار البيضاء والقطب الاقتصادي"
    },
    casa_hero_title: {
        fr: "Création de Site Web à Casablanca :<br><span class=\"neon\">Des Plateformes Conçues pour Capter des Clients</span>",
        en: "Website Creation in Casablanca:<br><span class=\"neon\">High-Performance Platforms Built to Convert Leads</span>",
        ar: "إنشاء المواقع الإلكترونية في الدار البيضاء:<br><span class=\"neon\">منصات مصممة خصيصاً لجلب العملاء</span>"
    },
    casa_hero_sub: {
        fr: "Vous recherchez une agence spécialisée en <strong>création site web Casablanca</strong> pour générer des contacts qualifiés plutôt qu'une simple carte de visite en ligne ? Dans la capitale économique du Maroc, votre présence sur Google décide de votre chiffre d'affaires : nous concevons des sites vitrines et e-commerce rapides, responsives et taillés pour transformer les recherches locales en opportunités commerciales réelles.",
        en: "Looking for an agency specialized in <strong>website creation in Casablanca</strong> to generate qualified leads rather than a basic online business card? In Morocco's economic capital, your Google presence drives your revenue: we build fast, responsive showcase and e-commerce websites built to turn local searches into real business opportunities.",
        ar: "هل تبحث عن وكالة متخصصة في <strong>إنشاء المواقع بالدار البيضاء</strong> لجلب عملاء مؤهلين بدلاً من مجرد بطاقة عمل بسيطة؟ في العاصمة الاقتصادية للمملكة، يحدد ظهورك على غوغل حجم مبيعاتك: نصمم مواقع تعريفية ومتاجر سريعة ومتجاوبة تحول عمليات البحث المحلية إلى صفقات حقيقية."
    },
    casa_btn_whatsapp: {
        fr: "<i class=\"fab fa-whatsapp\"></i> Devis Rapide sur WhatsApp",
        en: "<i class=\"fab fa-whatsapp\"></i> Quick Quote on WhatsApp",
        ar: "<i class=\"fab fa-whatsapp\"></i> عرض سعر فوري عبر واتساب"
    },
    casa_btn_realisations: {
        fr: "<i class=\"fas fa-check-circle\"></i> Voir nos Réalisations",
        en: "<i class=\"fas fa-check-circle\"></i> View Portfolio",
        ar: "<i class=\"fas fa-check-circle\"></i> مشاهدة أعمالنا"
    },
    casa_btn_maroc: {
        fr: "<i class=\"fas fa-globe\"></i> Offre Nationale Maroc",
        en: "<i class=\"fas fa-globe\"></i> Morocco National Plan",
        ar: "<i class=\"fas fa-globe\"></i> العرض الوطني للمغرب"
    },
    casa_sec_badge: {
        fr: "Architecture & Standards",
        en: "Architecture & Standards",
        ar: "المعايير والهندسة الرقمية"
    },
    casa_sec_title: {
        fr: "Ce que comprend la création de votre site internet à Casablanca",
        en: "What Your Casablanca Website Package Includes",
        ar: "ما يشمله إنشاء موقعك الإلكتروني في الدار البيضاء"
    },
    casa_sec_desc: {
        fr: "Chaque projet web combine rigueur d'ingénierie front-end et stratégie de référencement naturel local.",
        en: "Every web project combines front-end engineering precision with aggressive local SEO strategy.",
        ar: "يجمع كل مشروع بين دقة البرمجة العصرية واستراتيجية التموضع المحلي على محركات البحث."
    },
    casa_c1_title: {
        fr: "SITE VITRINE & RESPONSIVE",
        en: "RESPONSIVE SHOWCASE SITE",
        ar: "موقع تعريفي متجاوب"
    },
    casa_c1_desc: {
        fr: "Conception adaptée aux smartphones (91% du trafic à Casablanca), ergonomie fluide et valorisation de votre image de marque.",
        en: "Optimized for mobile (91% of Casablanca web traffic), smooth ergonomics and strong brand elevation.",
        ar: "تصميم مثالي للهواتف (91% من زيارات البيضاء عبر الجوال)، تجربة تصفح سلسة وإبراز لهويتك."
    },
    casa_c2_title: {
        fr: "RÉFÉRENCEMENT NATUREL SEO",
        en: "LOCAL SEO RANKING",
        ar: "التموضع الطبيعي سيو"
    },
    casa_c2_desc: {
        fr: "Structure sémantique HTML5, balisage Schema.org et mots-clés ciblés sur les quartiers de Casablanca (Anfa, Maarif, Sidi Maarouf).",
        en: "HTML5 semantic markup, Schema.org tagging, and target keywords for Casablanca districts (Anfa, Maarif, Sidi Maarouf).",
        ar: "هيكلة سيمانتيك HTML5، وسوم Schema.org واستهداف دقيق لأحياء الدار البيضاء (أنفا، المعاريف، سيدي معروف)."
    },
    casa_c3_title: {
        fr: "WHATSAPP COMMERCIAL",
        en: "COMMERCIAL WHATSAPP",
        ar: "واتساب تجاري مباشر"
    },
    casa_c3_desc: {
        fr: "Intégration de boutons d'appel et de discussion WhatsApp pré-remplis pour déclencher des conversations avec vos prospects chauds.",
        en: "Integration of pre-filled WhatsApp click-to-chat buttons triggering immediate sales discussions with warm leads.",
        ar: "دمج أزرار واتساب برسائل مجهزة مسبقاً لفتح محادثات فورية مع العملاء الجادين."
    },
    casa_c4_title: {
        fr: "HÉBERGEMENT & NOM DE DOMAINE",
        en: "HOSTING & DOMAIN NAME",
        ar: "الاستضافة واسم النطاق"
    },
    casa_c4_desc: {
        fr: "Configuration complète de votre nom de domaine .ma ou .com avec certificat SSL HTTPS et boîtes emails professionnelles incluses.",
        en: "Full setup of your .ma or .com domain with secure HTTPS/SSL certificate and custom business email addresses.",
        ar: "تهيئة كاملة لنطاقك .ma أو .com مع شهادة أمان SSL HTTPS وبريد إلكتروني مهني."
    },
    casa_c5_title: {
        fr: "GOOGLE BUSINESS PROFILE",
        en: "GOOGLE BUSINESS PROFILE",
        ar: "ملف GOOGLE BUSINESS"
    },
    casa_c5_desc: {
        fr: "Optimisation de votre présence sur Google Maps pour capter les requêtes à proximité immédiate dans la métropole casablancaise.",
        en: "Optimization of your Google Maps listing to dominate local proximity searches across the Casablanca metropolis.",
        ar: "تحسين تواجدك على خرائط جوجل لاستقطاب عمليات البحث القريبة في مختلف مناطق البيضاء."
    },
    casa_c6_title: {
        fr: "CORE WEB VITALS OPTIMISÉS",
        en: "CORE WEB VITALS TUNED",
        ar: "معايير CORE WEB VITALS"
    },
    casa_c6_desc: {
        fr: "Chargement instantané, zéro script superflu et respect scrupuleux des critères techniques imposés par Google.",
        en: "Instant loading, zero bloatware scripts, and rigorous adherence to Google technical performance criteria.",
        ar: "تحميل فوري في أجزاء من الثانية، بدون ملفات زائدة مع الالتزام الصارم بمعايير جوجل التقنية."
    },
    casa_method_title: {
        fr: "Notre processus de création site web Casablanca",
        en: "Our Casablanca Website Creation Process",
        ar: "مسار إنشاء المواقع في الدار البيضاء"
    },
    casa_faq_badge: {
        fr: "FAQ Spécialisée",
        en: "Local FAQ",
        ar: "الأسئلة الشائعة"
    },
    casa_faq_title: {
        fr: "Questions fréquentes sur la <span class=\"neon\">création site web Casablanca</span>",
        en: "Frequently Asked Questions on <span class=\"neon\">Casablanca Website Creation</span>",
        ar: "الأسئلة الشائعة حول <span class=\"neon\">إنشاء المواقع بالدار البيضاء</span>"
    },
    casa_faq_sub: {
        fr: "Toutes les réponses pour préparer votre projet web en toute sérénité.",
        en: "All the answers you need to prepare your web project with peace of mind.",
        ar: "كل الإجابات لتجهيز مشروعك الرقمي بكل ثقة واطمئنان."
    },
    casa_faq_q1: {
        fr: "Combien coûte la création d'un site web à Casablanca ?",
        en: "How much does a website cost in Casablanca?",
        ar: "كم تبلغ تكلفة إنشاء موقع إلكتروني في الدار البيضاء؟"
    },
    casa_faq_a1: {
        fr: "Chez ASSURLEAD, notre offre d'appel débute à 1 500 DH pour une page de présentation essentielle (valable jusqu'au 31/10/2026). Nos formules complètes s'échelonnent ensuite selon vos objectifs : Starter à 2 000 DH, Growth à 4 500 DH avec référencement naturel local, Lead Engine à 8 000 DH pour un moteur commercial avancé, et Formule Acquisition sur-mesure à partir de 12 000 DH.",
        en: "At ASSURLEAD, our entry offer starts at 1,500 DH for an essential showcase page (valid until 31/10/2026). Our full plans scale based on your goals: Starter at 2,000 DH, Growth at 4,500 DH with local SEO, Lead Engine at 8,000 DH for advanced commercial lead engines, and custom Acquisition plans from 12,000 DH.",
        ar: "في أسورليد، تبدأ عروضنا من 1500 درهم لصفحة تعريفية أساسية (سارية حتى 31/10/2026). وتتوزع باقاتنا المتكاملة حسب أهدافك: Starter بـ 2000 درهم، Growth بـ 4500 درهم مع سيو محلي، Lead Engine بـ 8000 درهم لمحرك تجاري متطور، وباقة الاستقطاب المخصصة ابتداءً من 12000 درهم."
    },
    casa_faq_q2: {
        fr: "Combien de temps faut-il pour livrer un site internet à Casablanca ?",
        en: "How long does it take to deliver a website in Casablanca?",
        ar: "كم يستغرق تسليم الموقع الإلكتروني في الدار البيضاء؟"
    },
    casa_faq_a2: {
        fr: "Notre délai moyen de livraison est de 10 à 14 jours ouvrés. Ce délai court est garanti grâce à notre méthodologie éprouvée et à notre chaîne de production sans intermédiaire.",
        en: "Our average delivery time is 10 to 14 business days. This fast turnaround is guaranteed thanks to our tested methodology and direct production process.",
        ar: "متوسط مدة التسليم لدينا هو 10 إلى 14 يوم عمل، بفضل منهجيتنا الدقيقة وفريقنا الداخلي المتخصص."
    },
    casa_faq_q3: {
        fr: "Pourquoi privilégier le référencement naturel local à Casablanca ?",
        en: "Why prioritize local SEO in Casablanca?",
        ar: "لماذا يجب التركيز على السيو المحلي في الدار البيضاء؟"
    },
    casa_faq_a3: {
        fr: "Casablanca concentre la plus forte concurrence digitale du Maroc. Être positionné en 1ère page Google sur des requêtes précises comme 'création site web Maarif' ou vos spécialités vous apporte des prospects chauds chaque semaine, sans dépendre du coût élevé de la publicité payante.",
        en: "Casablanca holds Morocco's highest digital competition. Ranking on Google page 1 for targeted queries brings you warm inbound prospects every week without depending on costly paid ads.",
        ar: "تضم الدار البيضاء المنافسة الرقمية الأكبر بالمغرب. التصدر في الصفحة الأولى على غوغل يجلب لك زبائن مؤهلين أسبوعياً بدون استنزاف ميزانيتك في الإعلانات المدفوعة."
    },
    casa_cta_title: {
        fr: "Prêt à lancer votre site web performant à Casablanca ?",
        en: "Ready to launch a high-performing website in Casablanca?",
        ar: "مستعد لإطلاق موقعك الإلكتروني الرائد بالدار البيضاء؟"
    },
    casa_cta_desc: {
        fr: "Contactez notre équipe dès aujourd'hui pour un diagnostic gratuit de 15 minutes et recevez un plan d'action chiffré.",
        en: "Contact our team today for a free 15-minute diagnostic and receive a quantified action plan.",
        ar: "تواصل مع فريقنا اليوم للاستفادة من تدقيق مجاني لمدة 15 دقيقة واستلام خطة عمل مفصلة."
    },
    rabat_hero_badge: {
        fr: "<span class=\"badge-flag\">🇲🇦</span> RABAT, HAY RIAD & AGDAL",
        en: "<span class=\"badge-flag\">🇲🇦</span> RABAT, HAY RIAD & AGDAL",
        ar: "<span class=\"badge-flag\">🇲🇦</span> الرباط، حي الرياض وأكدال"
    },
    rabat_hero_title: {
        fr: "Création de Site Web à Rabat :<br><span class=\"neon\">Autorité Institutionnelle & Leads Qualifiés</span>",
        en: "Website Creation in Rabat:<br><span class=\"neon\">Institutional Authority & High-Value Leads</span>",
        ar: "إنشاء المواقع الإلكترونية في الرباط:<br><span class=\"neon\">مصداقية مؤسسية واستقطاب زبائن نوعيين</span>"
    },
    rabat_hero_sub: {
        fr: "Vous recherchez une agence experte en <strong>création de site internet à Rabat</strong> pour asseoir votre notoriété auprès des décideurs de la capitale ? À Rabat, centre névralgique des ministères, ambassades, cabinets d'affaires à Hay Riad et entreprises innovantes de Technopolis, votre site web doit inspirer une confiance absolue. Nous concevons des plateformes rapides, élégantes et rigoureusement optimisées pour le référencement naturel Google.",
        en: "Looking for an expert agency for <strong>website creation in Rabat</strong> to establish your authority with capital decision-makers? In Rabat, hub of ministries, embassies, business firms in Hay Riad, and tech startups in Technopolis, your website must inspire absolute trust. We craft fast, elegant platforms strictly tuned for Google organic SEO.",
        ar: "هل تبحث عن وكالة خبيرة في <strong>إنشاء المواقع بالرباط</strong> لترسيخ مكانتك لدى صناع القرار في العاصمة؟ في الرباط، المركز الحيوي للوزارات والسفارات ومكاتب الأعمال بحي الرياض وشركات تكنوبوليس، يجب أن يعكس موقعك ثقة مطلقة. نصمم منصات أنيقة وسريعة ومتصدرة على غوغل."
    },
    rabat_btn_whatsapp: {
        fr: "<i class=\"fab fa-whatsapp\"></i> Devis Rabat sur WhatsApp",
        en: "<i class=\"fab fa-whatsapp\"></i> Rabat Quote on WhatsApp",
        ar: "<i class=\"fab fa-whatsapp\"></i> طلب عرض سعر بالرباط عبر واتساب"
    },
    rabat_sec_badge: {
        fr: "Écosystème Rbati",
        en: "Rabat Business Ecosystem",
        ar: "بيئة الأعمال بالرباط"
    },
    rabat_sec_title: {
        fr: "Des solutions calibrées pour les professionnels de Rabat",
        en: "Solutions Tailored for Rabat Professionals",
        ar: "حلول مدروسة للمهنيين والشركات بالرباط"
    },
    rabat_sec_desc: {
        fr: "Une expertise sectorielle adaptée aux exigences de la capitale du Royaume.",
        en: "Sector expertise matched to the prestige and standards of the Kingdom's capital.",
        ar: "خبرة قطاعية متماشية مع متطلبات ومعايير عاصمة المملكة."
    },
    rabat_s1_title: {
        fr: "Cabinets Juridiques & Conseils",
        en: "Legal & Advisory Firms",
        ar: "مكاتب الاستشارات والمحاماة"
    },
    rabat_s1_desc: {
        fr: "Vitrines institutionnelles sobres et statutaires pour avocats, notaires et experts-comptables de l'Agdal et Hay Riad.",
        en: "Stately institutional showcases for lawyers, notaries, and chartered accountants in Agdal and Hay Riad.",
        ar: "مواقع مؤسسية راقية للمحامين، الموثقين والخبراء المحاسبين في أكدال وحي الرياض."
    },
    rabat_s2_title: {
        fr: "Technopolis & Startups B2B",
        en: "Technopolis & B2B Tech",
        ar: "تكنوبوليس والشركات الناشئة B2B"
    },
    rabat_s2_desc: {
        fr: "Plateformes modernes pour éditeurs de logiciels, cabinets de formation et sociétés de services numériques de Rabat-Salé.",
        en: "Modern platforms for software vendors, corporate training centers, and digital services firms in Rabat-Salé.",
        ar: "منصات حديثة لشركات البرمجيات ومراكز التدريب وشركات الخدمات الرقمية برباط-سلا."
    },
    rabat_s3_title: {
        fr: "Santé, Cliniques & Praticiens",
        en: "Healthcare & Private Clinics",
        ar: "المصحات والمراكز الطبية"
    },
    rabat_s3_desc: {
        fr: "Sites médicaux clairs avec modules de prise de contact pour centres spécialisés et cliniques privées de Rabat.",
        en: "Clear medical portals with patient contact funnels for private clinics and specialized centers in Rabat.",
        ar: "مواقع طبية احترافية مع قنوات تواصل مباشرة للمصحات الخاصة والأطباء بالرباط."
    },
    rabat_why_badge: {
        fr: "Visibilité & Conversion",
        en: "Visibility & Conversion",
        ar: "الرؤية والتحويل"
    },
    rabat_why_title: {
        fr: "Pourquoi le référencement Google à Rabat est un impératif",
        en: "Why Google SEO in Rabat Is a Strategic Imperative",
        ar: "لماذا يعد تصدر غوغل في الرباط ضرورة استراتيجية"
    },
    rabat_why_desc: {
        fr: "Les décideurs et résidents de Rabat recherchent leurs prestataires directement sur leur smartphone.",
        en: "Rabat decision-makers and residents search for trusted providers directly on mobile.",
        ar: "يبحث صناع القرار وسكان الرباط عن مقدمي الخدمات مباشرة عبر هواتفهم الذكية."
    },
    rabat_p1_title: {
        fr: "SEO Hyper-Localisé",
        en: "Hyper-Local SEO",
        ar: "سيو محلي دقيق"
    },
    rabat_p1_desc: {
        fr: "Positionnement stratégique sur les requêtes ciblées à Hay Riad, Agdal, Souissi et Hassan pour capter les opportunités locales.",
        en: "Strategic rankings on targeted searches in Hay Riad, Agdal, Souissi, and Hassan to capture high-value leads.",
        ar: "تموضع استراتيجي في أحياء الرياض، أكدال، السويسي وحسان لجلب أفضل الفرص."
    },
    rabat_p2_title: {
        fr: "Gage de Crédibilité",
        en: "Institutional Credibility",
        ar: "مصداقية عالية"
    },
    rabat_p2_desc: {
        fr: "Un design épuré et rassurant qui convainc immédiatement les directeurs d'achats, ministères et partenaires institutionnels.",
        en: "A refined, reassuring design that immediately convinces corporate buyers and institutions.",
        ar: "تصميم أنيق ومطمئن يقنع مدراء المشتريات والمؤسسات الكبرى على الفور."
    },
    rabat_p3_title: {
        fr: "Synergie Métropolitaine",
        en: "Metropolitan Synergy",
        ar: "تكامل جهوي"
    },
    rabat_p3_desc: {
        fr: "Ciblage étendu à l'agglomération Rabat-Salé-Kénitra pour maximiser votre zone de chalandise commerciale.",
        en: "Extended targeting across the Rabat-Salé-Kénitra urban hub to expand your client pool.",
        ar: "استهداف موسع يشمل محور الرباط-سلا-القنيطرة لتوسيع نطاق عملائك."
    },
    rabat_p4_title: {
        fr: "Tarifs Garantis",
        en: "Guaranteed Pricing",
        ar: "أسعار مضمونة"
    },
    rabat_p4_desc: {
        fr: "Grille forfaitaire sans surprise : à partir de 1 500 DH pour l'offre vitrine jusqu'aux dispositifs complets d'acquisition.",
        en: "Fixed transparent pricing: starting from 1,500 DH up to complete inbound acquisition systems.",
        ar: "أسعار ثابتة بدون مفاجآت: ابتداءً من 1500 درهم للباقة التعريفية وصولاً لمنظومة الاستقطاب."
    },
    rabat_faq_title: {
        fr: "Questions fréquentes sur la <span class=\"neon\">création de site web à Rabat</span>",
        en: "Frequently Asked Questions on <span class=\"neon\">Rabat Website Creation</span>",
        ar: "الأسئلة الشائعة حول <span class=\"neon\">إنشاء المواقع في الرباط</span>"
    },
    rabat_faq_q1: {
        fr: "Pourquoi créer un site internet dédié à Rabat ?",
        en: "Why build a site tailored for Rabat?",
        ar: "لماذا يجب إنشاء موقع مخصص للرباط؟"
    },
    rabat_faq_a1: {
        fr: "La clientèle rbati recherche des prestataires sérieux, transparents et réactifs. Avoir un site web optimisé sur Rabat positionne votre entreprise comme un acteur de référence face aux institutions et grands comptes.",
        en: "Rabat clients seek serious, responsive, transparent partners. A site optimized for Rabat positions your business as an authority for corporate and institutional accounts.",
        ar: "يبحث عملاء الرباط عن شركاء يتسمون بالجدية والشفافية. يمنحك الموقع المصمم خصيصاً للرباط مكانة مرجعية أمام كبار العملاء."
    },
    rabat_faq_q2: {
        fr: "Combien de temps prend la conception d'un site à Rabat ?",
        en: "How long does design take in Rabat?",
        ar: "كم يستغرق تصميم الموقع بالرباط؟"
    },
    rabat_faq_a2: {
        fr: "Nous livrons votre site web clé en main en 10 à 14 jours ouvrés avec hébergement sécurisé HTTPS et nom de domaine inclus.",
        en: "We deliver your turnkey website in 10 to 14 business days with secure HTTPS hosting and domain included.",
        ar: "نسلم موقعك مكتملاً في 10 إلى 14 يوم عمل مع استضافة آمنة ونطاق مجاني."
    },
    rabat_faq_q3: {
        fr: "Puis-je cibler à la fois Rabat et d'autres villes du Maroc ?",
        en: "Can I target both Rabat and other cities?",
        ar: "هل يمكن استهداف الرباط ومدن مغربية أخرى معاً؟"
    },
    rabat_faq_a3: {
        fr: "Absolument. Nos architectures SEO prévoient des pages régionales et nationales pour capter des clients à Rabat, Casablanca, Marrakech ou partout au Maroc.",
        en: "Absolutely. Our SEO architecture sets up local and national landing pages capturing clients in Rabat, Casablanca, Marrakech, or across Morocco.",
        ar: "بالتأكيد. تتيح بنيتنا التقنية استهداف الرباط والدار البيضاء ومراكش ومختلف ربوع المملكة في آن واحد."
    },
    rabat_cta_title: {
        fr: "Prêt à asseoir votre autorité digitale à Rabat ?",
        en: "Ready to build your digital authority in Rabat?",
        ar: "مستعد لترسيخ حضورك الرقمي القوي في الرباط؟"
    },
    rabat_cta_desc: {
        fr: "Échangez en direct avec notre directeur d'acquisition sur WhatsApp et recevez une proposition chiffrée sous 24h.",
        en: "Chat directly with our acquisition director on WhatsApp and receive a detailed quote within 24 hours.",
        ar: "تواصل مباشرة مع مدير الاستقطاب عبر واتساب واستلم عرضاً مفصلاً خلال 24 ساعة."
    },
    kech_hero_badge: {
        fr: "<span class=\"badge-flag\">🇲🇦</span> MARRAKECH, GUÉLIZ & HIVERNAGE",
        en: "<span class=\"badge-flag\">🇲🇦</span> MARRAKECH, GUELIZ & HIVERNAGE",
        ar: "<span class=\"badge-flag\">🇲🇦</span> مراكش، كليز والحي الشتوي"
    },
    kech_hero_title: {
        fr: "Création de Site Web à Marrakech :<br><span class=\"neon\">Élégance Visuelle & Réservations Directes</span>",
        en: "Website Creation in Marrakech:<br><span class=\"neon\">Visual Elegance & Direct Online Bookings</span>",
        ar: "إنشاء المواقع الإلكترونية في مراكش:<br><span class=\"neon\">أناقة بصرية وحجوزات مباشرة</span>"
    },
    kech_hero_sub: {
        fr: "Vous cherchez une agence spécialisée en <strong>création de site internet à Marrakech</strong> capable de refléter le standing exceptionnel de votre établissement ? À Marrakech, capitale touristique et carrefour du luxe, votre site web doit séduire instantanément une clientèle internationale et locale exigeante. Nous concevons des plateformes immersives, ultra-rapides et taillées pour générer des réservations et demandes directes sans commissions d'intermédiaires.",
        en: "Seeking an agency specialized in <strong>website creation in Marrakech</strong> to reflect your venue's exceptional standards? In Marrakech, world capital of hospitality and luxury, your website must instantly charm discerning international and local clients. We craft immersive, ultra-fast platforms designed to drive direct bookings with zero commissions.",
        ar: "هل تبحث عن وكالة خبيرة في <strong>إنشاء المواقع بمراكش</strong> تعكس المستوى الراقي لمشروعك؟ في عاصمة السياحة والضيافة، يجب أن يبهر موقعك الزوار الدوليين والمحليين من النظرة الأولى. نصمم منصات بصرية ساحرة وفائقة السرعة لتوليد حجوزات وطلبات مباشرة بدون عمولات وسيطة."
    },
    kech_btn_whatsapp: {
        fr: "<i class=\"fab fa-whatsapp\"></i> Devis Marrakech sur WhatsApp",
        en: "<i class=\"fab fa-whatsapp\"></i> Marrakech Quote on WhatsApp",
        ar: "<i class=\"fab fa-whatsapp\"></i> طلب عرض سعر بمراكش عبر واتساب"
    },
    kech_sec_badge: {
        fr: "Secteurs Clés Marrakech",
        en: "Marrakech Key Sectors",
        ar: "القطاعات الرائدة بمراكش"
    },
    kech_sec_title: {
        fr: "Des sites web conçus pour le rayonnement de Marrakech",
        en: "Websites Built for Marrakech's Prestige",
        ar: "مواقع مصممة لإشعاع مشاريع مراكش"
    },
    kech_sec_desc: {
        fr: "Une réponse digitale sur-mesure pour les acteurs de l'hôtellerie, de l'immobilier et des services haut de gamme.",
        en: "Tailored digital execution for hospitality, luxury real estate, and premier lifestyle services.",
        ar: "حلول رقمية راقية لقطاعات الفندقة، العقار والخدمات الممتازة."
    },
    kech_s1_title: {
        fr: "Riads, Hôtels & Maisons d'Hôtes",
        en: "Riads, Hotels & Boutique Stays",
        ar: "الرياضات، الفنادق ودور الضيافة"
    },
    kech_s1_desc: {
        fr: "Galeries immersives, intégration de moteurs de réservation directe et multilinguisme (FR, EN, AR) pour capter les voyageurs.",
        en: "Immersive visual showcases, direct booking integration, and multilingual setups (FR, EN, AR) for global travelers.",
        ar: "معارض صور جذابة، دمج محركات الحجز المباشر ودعم كامل للغات (فرنسية، إنجليزية، عربية)."
    },
    kech_s2_title: {
        fr: "Immobilier & Conciergeries de Luxe",
        en: "Luxury Real Estate & Concierge",
        ar: "العقارات الفاخرة وخدمات الكونسيرج"
    },
    kech_s2_desc: {
        fr: "Présentation haute définition de villas dans la Palmeraie, fiches biens détaillées et tunnel WhatsApp pour acheteurs fortunés.",
        en: "High-definition villa portfolios in the Palmeraie, detailed property listings, and instant WhatsApp inquiry funnels.",
        ar: "عرض عالي الدقة لفيلات النخيل، بطاقات عقارية مفصلة وقناة واتساب مباشرة للمستثمرين."
    },
    kech_s3_title: {
        fr: "Restaurants & Excursions Désert",
        en: "Dining, Desert & Experiences",
        ar: "المطاعم، رحلات الصحراء والأنشطة"
    },
    kech_s3_desc: {
        fr: "Menus interactifs, réservation de tables et programmes d'excursions vers Agafay ou l'Atlas avec paiement sécurisé.",
        en: "Interactive menus, table booking, and excursion schedules to Agafay and Atlas with secure payments.",
        ar: "قوائم طعام تفاعلية، حجز طاولات وجداول رحلات نحو أكافاي والأطلس مع خيارات دفع آمنة."
    },
    kech_why_badge: {
        fr: "SEO & Réservations Directes",
        en: "SEO & Direct Sales",
        ar: "السيو والحجوزات المباشرة"
    },
    kech_why_title: {
        fr: "Pourquoi un site performant à Marrakech change tout",
        en: "Why a High-Performing Marrakech Website Changes Everything",
        ar: "لماذا يحدث الموقع الاحترافي بمراكش فارقاً حاسماً"
    },
    kech_why_desc: {
        fr: "Échappez aux commissions étouffantes des plateformes tierces (Booking, Airbnb) et captez directement vos clients.",
        en: "Bypass high commission fees from third-party platforms and capture your clients directly.",
        ar: "تخلص من عمولات المنصات الوسيطة واستقطب زبائنك ومسافريك مباشرة."
    },
    kech_p1_title: {
        fr: "Réservation 100% Directe",
        en: "100% Direct Bookings",
        ar: "حجز مباشر 100%"
    },
    kech_p1_desc: {
        fr: "Gardez 100% de vos marges en convertissant vos visiteurs directement via WhatsApp ou formulaire dédié.",
        en: "Retain 100% of your margins by converting web visitors directly via WhatsApp or booking forms.",
        ar: "حافظ على كامل أرباحك بتحويل الزوار مباشرة عبر واتساب أو استمارات الحجز."
    },
    kech_p2_title: {
        fr: "Référencement International",
        en: "International SEO",
        ar: "سيو دولي ومحلي"
    },
    kech_p2_desc: {
        fr: "Positionnement sur Google pour les voyageurs préparant leur séjour à Marrakech depuis l'Europe, le Golfe ou les USA.",
        en: "Rank on Google for travelers planning their Marrakech trip from Europe, the Gulf, or the Americas.",
        ar: "تصدر نتائج غوغل للمسافرين الباحثين عن رحلات مراكش من أوروبا، الخليج وأمريكا."
    },
    kech_p3_title: {
        fr: "Vitesse Mobile Éclair",
        en: "Lightning Mobile Speed",
        ar: "سرعة تصفح فائقة"
    },
    kech_p3_desc: {
        fr: "Moins de 1.2s de chargement même en 4G, indispensable pour les touristes en mobilité dans la Médina.",
        en: "Under 1.2s load speed on 4G, essential for tourists on the move across the Medina.",
        ar: "تحميل في أقل من 1.2 ثانية على شبكات الهاتف، مثالي للسياح المتنقلين داخل المدينة."
    },
    kech_p4_title: {
        fr: "Image de Marque Distinguée",
        en: "Distinctive Brand Prestige",
        ar: "هوية بصرية استثنائية"
    },
    kech_p4_desc: {
        fr: "Une esthétique visuelle haut de gamme qui justifie vos tarifs et séduit une clientèle à fort pouvoir d'achat.",
        en: "Premier visual aesthetics reinforcing premium pricing and attracting affluent clients.",
        ar: "طابع بصري راقٍ يعكس فخامة خدماتك ويجذب عملاء ذوي قدرة شرائية عالية."
    },
    kech_faq_title: {
        fr: "Questions fréquentes sur la <span class=\"neon\">création de site web à Marrakech</span>",
        en: "Frequently Asked Questions on <span class=\"neon\">Marrakech Website Creation</span>",
        ar: "الأسئلة الشائعة حول <span class=\"neon\">إنشاء المواقع في مراكش</span>"
    },
    kech_faq_q1: {
        fr: "Le site sera-t-il disponible en plusieurs langues ?",
        en: "Will the website be multilingual?",
        ar: "هل سيكون الموقع متوفراً بعدة لغات؟"
    },
    kech_faq_a1: {
        fr: "Oui, nous configurons le multilinguisme complet (français, anglais, arabe ou autres) pour accueillir vos visiteurs internationaux sans aucune barrière.",
        en: "Yes, we implement complete multilingual support (French, English, Arabic, etc.) to welcome international visitors seamlessly.",
        ar: "نعم، نهيئ الموقع بجميع اللغات (فرنسية، إنجليزية، عربية وغيرها) لاستقبال زوارك الدوليين بسلاسة."
    },
    kech_faq_q2: {
        fr: "Puis-je intégrer des paiements par carte bancaire (CMI / Stripe) ?",
        en: "Can I integrate credit card payments (CMI / Stripe)?",
        ar: "هل يمكن دمج الدفع بالبطاقات البنكية (CMI / Stripe)؟"
    },
    kech_faq_a2: {
        fr: "Absolument. Nous intégrons les passerelles marocaines CMI ou internationales Stripe / PayPal selon votre modèle d'encaissement.",
        en: "Absolutely. We integrate Moroccan CMI gateways or international Stripe/PayPal processors based on your needs.",
        ar: "بالتأكيد، نقوم بدمج بوابات الدفع المغربية CMI أو الدولية Stripe وPayPal حسب رغبتك."
    },
    kech_faq_q3: {
        fr: "Quel est le délai de mise en ligne à Marrakech ?",
        en: "What is the launch timeline in Marrakech?",
        ar: "ما هي مدة الإطلاق بمراكش؟"
    },
    kech_faq_a3: {
        fr: "Votre site est prêt et opérationnel en 10 à 14 jours ouvrés avec hébergement sécurisé et nom de domaine inclus.",
        en: "Your website goes live in 10 to 14 business days with secure hosting and custom domain included.",
        ar: "يكون موقعك جاهزاً ومنشوراً بالكامل خلال 10 إلى 14 يوم عمل مع النطاق والاستضافة."
    },
    kech_cta_title: {
        fr: "Prêt à sublimer votre présence en ligne à Marrakech ?",
        en: "Ready to elevate your online presence in Marrakech?",
        ar: "مستعد للارتقاء بحضورك الرقمي في مراكش؟"
    },
    kech_cta_desc: {
        fr: "Contactez-nous pour un audit offert et découvrez comment capter des réservations directes dès le premier mois.",
        en: "Contact us for a free audit and discover how to capture direct bookings from month one.",
        ar: "تواصل معنا للاستفادة من تدقيق مجاني واكتشف كيف تجلب حجوزات مباشرة من الشهر الأول."
    },
    tgr_hero_badge: {
        fr: "<span class=\"badge-flag\">🇲🇦</span> TANGER, TANGER MED & FREE ZONES",
        en: "<span class=\"badge-flag\">🇲🇦</span> TANGIER, TANGER MED & FREE ZONES",
        ar: "<span class=\"badge-flag\">🇲🇦</span> طنجة، ميناء طنجة المتوسط والمناطق الحرة"
    },
    tgr_hero_title: {
        fr: "Création de Site Web à Tanger :<br><span class=\"neon\">Industrie, Logistique & Croissance B2B</span>",
        en: "Website Creation in Tangier:<br><span class=\"neon\">Industry, Logistics & B2B Expansion</span>",
        ar: "إنشاء المواقع الإلكترونية في طنجة:<br><span class=\"neon\">الصناعة، اللوجستيك ونمو أعمال B2B</span>"
    },
    tgr_hero_sub: {
        fr: "Vous recherchez une agence spécialisée en <strong>création de site web à Tanger</strong> pour accélérer vos contrats commerciaux et partenariats industriels ? Au carrefour de l'Europe et de l'Afrique, avec le géant Tanger Med, les zones franches automobiles et le dynamisme du détroit, votre entreprise doit projeter une stature internationale irréprochable. Nous concevons des plateformes robustes, bilingues et optimisées pour générer des consultations de décideurs B2B.",
        en: "Looking for a specialized agency for <strong>website creation in Tangier</strong> to accelerate commercial contracts and industrial partnerships? At the crossroads of Europe and Africa, driven by Tanger Med, automotive free zones, and Strait trade, your business must project flawless global authority. We craft robust, bilingual platforms optimized to capture B2B inquiries.",
        ar: "هل تبحث عن وكالة متخصصة في <strong>إنشاء المواقع بطنجة</strong> لتسريع عقودك وشراكاتك الصناعية؟ في بوابة المغرب نحو أوروبا وإفريقيا، ومع الزخم الاستثنائي لميناء طنجة المتوسط والمناطق الحرة، يجب أن يبرز موقعك مكانة دولية واثقة. نصمم منصات قوية ومزدوجة اللغة لجلب عقود B2B."
    },
    tgr_btn_whatsapp: {
        fr: "<i class=\"fab fa-whatsapp\"></i> Devis Tanger sur WhatsApp",
        en: "<i class=\"fab fa-whatsapp\"></i> Tangier Quote on WhatsApp",
        ar: "<i class=\"fab fa-whatsapp\"></i> طلب عرض سعر بطنجة عبر واتساب"
    },
    tgr_sec_badge: {
        fr: "Hub du Détroit",
        en: "Strait Economic Hub",
        ar: "قطب البوغاز الاقتصادي"
    },
    tgr_sec_title: {
        fr: "Des solutions digitales pour les leaders du Nord",
        en: "Digital Solutions for Northern Morocco Leaders",
        ar: "حلول رقمية رائدة لشركات الشمال"
    },
    tgr_sec_desc: {
        fr: "Accompagnement adapté aux entreprises de l'industrie, du transit et des services maritimes.",
        en: "Strategic guidance tailored for industrial, freight, and maritime service companies.",
        ar: "مواكبة موجهة لشركات الصناعة، الشحن والخدمات اللوجستية."
    },
    tgr_s1_title: {
        fr: "Logistique, Fret & Tanger Med",
        en: "Logistics, Freight & Tanger Med",
        ar: "اللوجستيك، الشحن وطنجة المتوسط"
    },
    tgr_s1_desc: {
        fr: "Catalogues de prestations de transit, formulaires de cotation fret et présentation multilingue (FR, EN, ES).",
        en: "Freight forwarding service directories, quotation request tools, and multilingual execution (FR, EN, ES).",
        ar: "عرض خدمات العبور والشحن، استمارات طلب تسعير لوجستي ودعم كامل للغات (فرنسية، إنجليزية، إسبانية)."
    },
    tgr_s2_title: {
        fr: "Sous-traitance Industrielle & Free Zones",
        en: "Industrial Subcontracting & Free Zones",
        ar: "المناولة الصناعية والمناطق الحرة"
    },
    tgr_s2_desc: {
        fr: "Vitrines B2B pour usines, équipementiers automobiles et ateliers certifiés ISO de la Tanger Automotive City.",
        en: "B2B portals for factories, automotive suppliers, and ISO-certified workshops in Tanger Automotive City.",
        ar: "مواقع B2B للمصانع، موردي قطاع السيارات والوحدات المعتمدة بمعايير ISO بمدينة صناعة السيارات."
    },
    tgr_s3_title: {
        fr: "Immobilier Balnéaire & Tourisme",
        en: "Coastal Real Estate & Tourism",
        ar: "العقار الساحلي والمشاريع السياحية"
    },
    tgr_s3_desc: {
        fr: "Sites modernes pour promoteurs, agences immobilières et résidences de standing sur la baie de Tanger.",
        en: "Modern showcases for developers, real estate brokers, and premium residences along the Bay of Tangier.",
        ar: "مواقع عصرية للمنعشين العقاريين ووكالات العقار والإقامات الراقية على خليج طنجة."
    },
    tgr_why_badge: {
        fr: "Avantage Concurrentiel",
        en: "Competitive Edge",
        ar: "أسبقية تنافسية"
    },
    tgr_why_title: {
        fr: "Pourquoi votre présence Google à Tanger est déterminante",
        en: "Why Your Tangier Google Presence Is Decisive",
        ar: "لماذا يعد حضورك على غوغل بطنجة أمراً حاسماً"
    },
    tgr_why_desc: {
        fr: "Les investisseurs et donneurs d'ordre européens vérifient votre sérieux sur le web avant toute signature.",
        en: "European investors and contracting authorities check your digital authority before signing any deal.",
        ar: "يتحقق المستثمرون والشركاء الدوليون من مصداقيتك عبر موقعك قبل توقيع أي عقد تجاري."
    },
    tgr_p1_title: {
        fr: "Bilinguisme International",
        en: "International Multilingualism",
        ar: "تعدد لغات دولي"
    },
    tgr_p1_desc: {
        fr: "Versions complètes en français, anglais et espagnol pour échanger sans friction avec les marchés voisins.",
        en: "Full versions in French, English, and Spanish to communicate smoothly with European partners.",
        ar: "نسخ متكاملة بالفرنسية والإنجليزية والإسبانية للتواصل السلس مع الشركاء الأجانب."
    },
    tgr_p2_title: {
        fr: "SEO B2B Ciblé",
        en: "Targeted B2B SEO",
        ar: "سيو B2B متخصص"
    },
    tgr_p2_desc: {
        fr: "Référencement sur les requêtes d'acheteurs industriels et logistiques recherchant des partenaires au Nord du Maroc.",
        en: "Rank on queries from industrial and supply chain procurement managers seeking Northern Morocco partners.",
        ar: "تموضع مدروس على كلمات مسؤولي المشتريات والخدمات اللوجستية الباحثين عن شركاء بالشمال."
    },
    tgr_p3_title: {
        fr: "Conformité & Sécurité",
        en: "Security & Compliance",
        ar: "أمان ومعايير معتمدة"
    },
    tgr_p3_desc: {
        fr: "Hébergement ultra-sécurisé, chiffrement HTTPS et conformité aux standards des multinationales.",
        en: "High-security hosting, HTTPS encryption, and full compliance with corporate enterprise standards.",
        ar: "استضافة عالية الأمان، تشفير كامل HTTPS وتوافق مع معايير الشركات العالمية."
    },
    tgr_p4_title: {
        fr: "Livraison en 10-14 jours",
        en: "Turnkey in 10-14 Days",
        ar: "تسليم في 10-14 يوماً"
    },
    tgr_p4_desc: {
        fr: "Déploiement rapide sans mobiliser excessivement vos équipes opérationnelles.",
        en: "Rapid deployment without pulling your internal operational teams away from their core work.",
        ar: "إطلاق سريع ومرن دون إثقال كاهل فرق عملك الداخلية."
    },
    tgr_faq_title: {
        fr: "Questions fréquentes sur la <span class=\"neon\">création de site web à Tanger</span>",
        en: "Frequently Asked Questions on <span class=\"neon\">Tangier Website Creation</span>",
        ar: "الأسئلة الشائعة حول <span class=\"neon\">إنشاء المواقع في طنجة</span>"
    },
    tgr_faq_q1: {
        fr: "Le site peut-il intégrer des demandes de devis complexes pour le B2B ?",
        en: "Can the site handle complex B2B quote requests?",
        ar: "هل يمكن للموقع استقبال طلبات تسعير B2B معقدة؟"
    },
    tgr_faq_a1: {
        fr: "Oui, nous concevons des formulaires de qualification sur-mesure avec upload de cahier des charges et notification instantanée par email et WhatsApp.",
        en: "Yes, we build custom qualification forms with RFP file uploads and instant alerts via email and WhatsApp.",
        ar: "نعم، نصمم استمارات مخصصة تسمح بإرفاق دفاتر التحملات مع إشعار فوري عبر البريد وواتساب."
    },
    tgr_faq_q2: {
        fr: "Comment assurez-vous le référencement naturel à Tanger ?",
        en: "How do you ensure SEO in Tangier?",
        ar: "كيف تضمنون التموضع على محركات البحث بطنجة؟"
    },
    tgr_faq_a2: {
        fr: "Nous ciblons les mots-clés stratégiques liés à votre industrie combinés à Tanger et sa région, avec balisage technique et optimisation Google Business Profile.",
        en: "We target high-intent keywords linked to your sector combined with Tangier, reinforced with technical tagging and Google Business tuning.",
        ar: "نستهدف الكلمات المفتاحية الاستراتيجية لقطاعك في طنجة والمنطقة مع تهيئة حساب خرائط غوغل."
    },
    tgr_faq_q3: {
        fr: "Proposez-vous une maintenance après la mise en ligne ?",
        en: "Do you offer post-launch maintenance?",
        ar: "هل تقدمون خدمة الصيانة بعد الإطلاق؟"
    },
    tgr_faq_a3: {
        fr: "Oui, notre abonnement mensuel agence couvre les sauvegardes, la sécurité, les mises à jour et le support prioritaire 7j/7.",
        en: "Yes, our monthly agency retainer covers backups, security, updates, and 7/7 priority support.",
        ar: "نعم، يشمل اشتراكنا الشهري النسخ الاحتياطي، الحماية، التحديثات والدعم الفني طيلة أيام الأسبوع."
    },
    tgr_cta_title: {
        fr: "Prêt à accélérer vos opportunités B2B à Tanger ?",
        en: "Ready to accelerate your B2B opportunities in Tangier?",
        ar: "مستعد لمضاعفة عقود B2B لشركتك في طنجة؟"
    },
    tgr_cta_desc: {
        fr: "Contactez notre équipe pour un audit gratuit de 15 minutes et recevez un plan d'action adapté à votre marché.",
        en: "Contact our team for a free 15-minute audit and receive a customized roadmap for your market.",
        ar: "تواصل مع فريقنا لتدقيق مجاني لمدة 15 دقيقة واستلم خطة عمل مخصصة لقطاعك."
    },
    fes_hero_badge: {
        fr: "<span class=\"badge-flag\">🇲🇦</span> FÈS, MÉDINA & PARCS INDUSTRIELS",
        en: "<span class=\"badge-flag\">🇲🇦</span> FEZ, MEDINA & INDUSTRIAL PARKS",
        ar: "<span class=\"badge-flag\">🇲🇦</span> فاس، المدينة العتيقة والمناطق الصناعية"
    },
    fes_hero_title: {
        fr: "Création de Site Web à Fès :<br><span class=\"neon\">Artisanat, Tourisme & Essor Industriel</span>",
        en: "Website Creation in Fez:<br><span class=\"neon\">Artisanal Craft, Tourism & Industrial Growth</span>",
        ar: "إنشاء المواقع الإلكترونية في فاس:<br><span class=\"neon\">الصناعة التقليدية، السياحة والنمو الاقتصادي</span>"
    },
    fes_hero_sub: {
        fr: "Vous cherchez une agence experte en <strong>création de site internet à Fès</strong> pour faire rayonner votre savoir-faire et capter de nouveaux marchés ? Capitale spirituelle et culturelle du Maroc, pôle mondial de l'artisanat d'art et métropole industrielle en pleine modernisation (parc Fès Shore, agroalimentaire, textile), Fès exige une présence digitale moderne et vendeuse. Nous concevons des sites vitrines et e-commerce élégants, rapides et pensés pour conquérir des clients au Maroc comme à l'international.",
        en: "Looking for an expert agency for <strong>website creation in Fez</strong> to showcase your heritage and capture new markets? Spiritual and cultural capital, world capital of traditional craft, and modernizing industrial center (Fez Shore, agribusiness, textile), Fez demands a modern, high-converting digital presence. We build fast, elegant showcase and e-commerce websites designed to win clients locally and globally.",
        ar: "هل تبحث عن وكالة خبيرة في <strong>إنشاء المواقع بفاس</strong> لإبراز خبرتك واستقطاب أسواق جديدة؟ كعاصمة علمية وتاريخية للمملكة ومركز عالمي للصناعة التقليدية وقطب صناعي متطور (فاس شور، الصناعات الغذائية والنسيج)، تحتاج مشاريع فاس لحضور رقمي مقنع وعصري. نصمم مواقع ومتاجر رقمية متألقة وسريعة."
    },
    fes_btn_whatsapp: {
        fr: "<i class=\"fab fa-whatsapp\"></i> Devis Fès sur WhatsApp",
        en: "<i class=\"fab fa-whatsapp\"></i> Fez Quote on WhatsApp",
        ar: "<i class=\"fab fa-whatsapp\"></i> طلب عرض سعر بفاس عبر واتساب"
    },
    fes_sec_badge: {
        fr: "Patrimoine & Dynamisme",
        en: "Heritage & Dynamism",
        ar: "الأصالة والتطور"
    },
    fes_sec_title: {
        fr: "Des plateformes web pensées pour l'économie fassie",
        en: "Web Platforms Engineered for Fez's Economy",
        ar: "منصات رقمية مصممة لاقتصاد فاس"
    },
    fes_sec_desc: {
        fr: "Valoriser le savoir-faire ancestral tout en activant des leviers commerciaux modernes.",
        en: "Showcasing authentic mastery while activating modern digital sales funnels.",
        ar: "إبراز المهارة العريقة مع تفعيل أحدث قنوات التجارة والاستقطاب الرقمي."
    },
    fes_s1_title: {
        fr: "Tourisme, Riads & Médina",
        en: "Tourism, Riads & Medina",
        ar: "السياحة، الرياضات والمدينة العتيقة"
    },
    fes_s1_desc: {
        fr: "Présentation raffinée des maisons d'hôtes de la Médina, modules de réservation directe et galeries immersives.",
        en: "Refined showcases for Medina boutique riads, direct booking engines, and immersive photography.",
        ar: "إبراز أنيق لدور الضيافة بالمدينة القديمة مع محركات حجز مباشر ومعارض صور ممتعة."
    },
    fes_s2_title: {
        fr: "Artisanat d'Art & Export",
        en: "Artisanal Craft & Export",
        ar: "الصناعة التقليدية والتصدير"
    },
    fes_s2_desc: {
        fr: "Boutiques e-commerce pour poterie, zellige, cuir et tapis avec expédition internationale et paiement sécurisé.",
        en: "E-commerce stores for pottery, zellij, leather, and carpets with worldwide shipping and secure checkout.",
        ar: "متاجر إلكترونية للفخار، الزليج، المصنوعات الجلدية والزرابي مع شحن دولي ودفع آمن."
    },
    fes_s3_title: {
        fr: "PME & Parcs Industriels",
        en: "SMEs & Industrial Hubs",
        ar: "المقاولات والمناطق الصناعية"
    },
    fes_s3_desc: {
        fr: "Sites vitrines institutionnels pour fabricants textiles, coopératives agroalimentaires et prestataires B2B de Fès-Meknès.",
        en: "Corporate websites for textile producers, agribusiness cooperatives, and B2B providers across Fez-Meknes.",
        ar: "مواقع تعريفية لمصانع النسيج، التعاونيات الفلاحية وشركات الخدمات بجهة فاس-مكناس."
    },
    fes_why_badge: {
        fr: "Expansion Commerciale",
        en: "Business Expansion",
        ar: "توسع تجاري"
    },
    fes_why_title: {
        fr: "Pourquoi investir dans un site professionnel à Fès",
        en: "Why Invest in a Professional Website in Fez",
        ar: "لماذا يعد الاستثمار في موقع احترافي بفاس خطوة رابحة"
    },
    fes_why_desc: {
        fr: "Dépassez les limites du marché local et vendez vos prestations partout au Maroc et à l'étranger.",
        en: "Go beyond local borders and sell your products and services throughout Morocco and abroad.",
        ar: "تجاوز الحدود الجغرافية الضيقة وبع منتجاتك وخدماتك في سائر مدن المغرب والعالم."
    },
    fes_p1_title: {
        fr: "Vente Sans Intermédiaire",
        en: "Direct Direct Sales",
        ar: "بيع مباشر بدون وسطاء"
    },
    fes_p1_desc: {
        fr: "Connectez vos acheteurs directement à vos équipes sans dépendre des courtiers ou intermédiaires coûteux.",
        en: "Connect buyers directly to your team without paying commissions to third-party middlemen.",
        ar: "اربط عملاءك بفريقك مباشرة دون دفع عمولات باهظة للوسطاء."
    },
    fes_p2_title: {
        fr: "Visibilité Google Fès & National",
        en: "Google Fez & National SEO",
        ar: "ظهور على غوغل محلياً ووطنياً"
    },
    fes_p2_desc: {
        fr: "Positionnez-vous sur les requêtes ciblées à Fès, Meknès et dans tout le Royaume.",
        en: "Rank on targeted searches in Fez, Meknes, and nationwide across Morocco.",
        ar: "تصدر نتائج البحث في فاس ومكناس ومختلف ربوع المملكة."
    },
    fes_p3_title: {
        fr: "Multilinguisme Intégré",
        en: "Integrated Multilingualism",
        ar: "دعم متكامل للغات"
    },
    fes_p3_desc: {
        fr: "Sites en français, anglais et arabe pour séduire touristes, acheteurs et partenaires internationaux.",
        en: "French, English, and Arabic setups to welcome tourists, foreign buyers, and global partners.",
        ar: "مواقع بالفرنسية، الإنجليزية والعربية لاستقبال السياح والمستوردين الدوليين."
    },
    fes_p4_title: {
        fr: "Tarifs Accessibles & Clairs",
        en: "Transparent & Accessible Rates",
        ar: "أسعار واضحة ومناسبة"
    },
    fes_p4_desc: {
        fr: "Des offres adaptées aux budgets des PME et artisans fassis, à partir de 1 500 DH.",
        en: "Packages tailored for Fez SMEs and craftsmen budgets, starting from 1,500 DH.",
        ar: "باقات مدروسة تناسب ميزانيات مقاولات وصناع فاس، ابتداءً من 1500 درهم."
    },
    fes_faq_title: {
        fr: "Questions fréquentes sur la <span class=\"neon\">création de site web à Fès</span>",
        en: "Frequently Asked Questions on <span class=\"neon\">Fez Website Creation</span>",
        ar: "الأسئلة الشائعة حول <span class=\"neon\">إنشاء المواقع في فاس</span>"
    },
    fes_faq_q1: {
        fr: "Est-il possible de vendre des produits d'artisanat en ligne ?",
        en: "Is it possible to sell handicrafts online?",
        ar: "هل يمكن بيع منتجات الصناعة التقليدية عبر الإنترنت؟"
    },
    fes_faq_a1: {
        fr: "Oui, nous concevons des boutiques e-commerce clé en main avec catalogue, paiement sécurisé et calcul des frais de livraison au Maroc et à l'international.",
        en: "Yes, we build turnkey e-commerce stores with product catalogs, secure checkout, and local/international shipping fee calculation.",
        ar: "نعم، نبني متاجر إلكترونية شاملة مع كتالوج للمنتجات، دفع آمن وحساب تلقائي لمصاريف الشحن."
    },
    fes_faq_q2: {
        fr: "Combien de temps faut-il pour concevoir un site à Fès ?",
        en: "How long does design take in Fez?",
        ar: "كم يستغرق تصميم الموقع بفاس؟"
    },
    fes_faq_a2: {
        fr: "La livraison est effectuée en 10 à 14 jours ouvrés avec hébergement sécurisé, nom de domaine et SEO inclus.",
        en: "Delivery takes 10 to 14 business days with secure hosting, domain, and SEO included.",
        ar: "يتم التسليم خلال 10 إلى 14 يوم عمل مع النطاق والاستضافة وتهيئة السيو."
    },
    fes_faq_q3: {
        fr: "Comment les clients me contacteront-ils ?",
        en: "How will customers reach me?",
        ar: "كيف سيتواصل معي الزبائن؟"
    },
    fes_faq_a3: {
        fr: "Via des boutons d'appel direct, un canal WhatsApp connecté en 1 clic et des formulaires de demande de devis reçus instantanément.",
        en: "Via direct phone call buttons, 1-click WhatsApp links, and instant inquiry forms.",
        ar: "عبر الاتصال الهاتفي المباشر، زر واتساب بنقرة واحدة واستمارات طلب عروض الأسعار."
    },
    fes_cta_title: {
        fr: "Prêt à faire rayonner votre activité à Fès ?",
        en: "Ready to expand your business in Fez?",
        ar: "مستعد لتوسيع نشاطك التجاري بفاس؟"
    },
    fes_cta_desc: {
        fr: "Demandez votre audit gratuit de 15 minutes et recevez un plan de développement digital sur-mesure.",
        en: "Request your free 15-minute audit and receive a tailored digital growth plan.",
        ar: "اطلب تدقيقك المجاني لمدة 15 دقيقة واستلم خطة تطوير رقمي مخصصة."
    },
    aga_hero_badge: {
        fr: "<span class=\"badge-flag\">🇲🇦</span> AGADIR, SOUSS-MASSA & TAGHAZOUT",
        en: "<span class=\"badge-flag\">🇲🇦</span> AGADIR, SOUSS-MASSA & TAGHAZOUT",
        ar: "<span class=\"badge-flag\">🇲🇦</span> أكادير، سوس ماسة وتغازوت"
    },
    aga_hero_title: {
        fr: "Création de Site Web à Agadir :<br><span class=\"neon\">Tourisme Balnéaire, Terroir & Agro-industrie</span>",
        en: "Website Creation in Agadir:<br><span class=\"neon\">Seaside Tourism, Local Terroir & Agribusiness</span>",
        ar: "إنشاء المواقع الإلكترونية في أكادير:<br><span class=\"neon\">السياحة الشاطئية، المنتجات المجالية والفلاحة</span>"
    },
    aga_hero_sub: {
        fr: "Vous recherchez une agence spécialisée en <strong>création de site internet à Agadir</strong> pour attirer des clients locaux, des vacanciers et des acheteurs internationaux ? Au cœur de la région Souss-Massa, 1ère zone agroalimentaire du Maroc et destination phare du tourisme balnéaire et du surf (Taghazout Bay), votre présence en ligne est votre premier commercial. Nous développons des sites rapides, responsives et taillés pour transformer les visites en réservations et commandes fermes.",
        en: "Looking for an expert agency in <strong>website creation in Agadir</strong> to attract local clients, holidaymakers, and international buyers? At the heart of Souss-Massa, Morocco's leading agribusiness zone and premier coastal tourism and surf hub (Taghazout Bay), your online presence is your top salesperson. We build fast, responsive websites engineered to turn visits into bookings and confirmed sales.",
        ar: "هل تبحث عن وكالة خبيرة في <strong>إنشاء المواقع بأكادير</strong> لجلب زبائن محليين وسياح ومستوردين دوليين؟ في قلب جهة سوس ماسة، القطب الفلاحي الأول بالمملكة والوجهة العالمية للسياحة الشاطئية وركوب الأمواج (تغازوت)، يعتبر موقعك هو رجل مبيعاتك الأول. نصمم مواقع فائقة السرعة تحول الزيارات إلى حجوزات وصفقات مؤكدة."
    },
    aga_btn_whatsapp: {
        fr: "<i class=\"fab fa-whatsapp\"></i> Devis Agadir sur WhatsApp",
        en: "<i class=\"fab fa-whatsapp\"></i> Agadir Quote on WhatsApp",
        ar: "<i class=\"fab fa-whatsapp\"></i> طلب عرض سعر بأكادير عبر واتساب"
    },
    aga_sec_badge: {
        fr: "Pôle Souss-Massa",
        en: "Souss-Massa Hub",
        ar: "قطب سوس ماسة"
    },
    aga_sec_title: {
        fr: "Des solutions digitales pour les fleurons d'Agadir",
        en: "Digital Solutions for Agadir Flagships",
        ar: "حلول رقمية متطورة لقطاعات أكادير"
    },
    aga_sec_desc: {
        fr: "Une expertise web adaptée au tourisme, à l'export de produits du terroir et à l'agriculture.",
        en: "Web expertise tailored for tourism, terroir product exports, and agribusiness.",
        ar: "خبرة رقمية تواكب السياحة، تصدير المنتجات المحلية والقطاع الفلاحي."
    },
    aga_s1_title: {
        fr: "Tourisme, Surf Camps & Hôtels",
        en: "Tourism, Surf Camps & Hotels",
        ar: "السياحة، نوادي السورف والفنادق"
    },
    aga_s1_desc: {
        fr: "Plateformes immersives pour résidences hôtelières, surf houses de Taghazout et clubs nautiques avec réservation directe.",
        en: "Immersive platforms for beachfront resorts, Taghazout surf camps, and water sports clubs with direct bookings.",
        ar: "منصات جذابة للإقامات الفندقية، نوادي ركوب الأمواج بتغازوت والأنشطة البحرية مع حجز مباشر."
    },
    aga_s2_title: {
        fr: "Huile d'Argan & Produits du Terroir",
        en: "Argan Oil & Terroir Products",
        ar: "زيت أركان والمنتجات المجالية"
    },
    aga_s2_desc: {
        fr: "Boutiques en ligne pour coopératives féminines, marques cosmétiques et producteurs de miel et safran de Taroudant.",
        en: "E-commerce stores for women's cooperatives, cosmetic brands, and organic honey & saffron producers.",
        ar: "متاجر إلكترونية للتعاونيات النسوية، منتجات التجميل، العسل الحر والزعفران مع شحن دولي."
    },
    aga_s3_title: {
        fr: "Agro-industrie & Export Primeurs",
        en: "Agribusiness & Fresh Produce Export",
        ar: "الصناعات الفلاحية والتصدير"
    },
    aga_s3_desc: {
        fr: "Vitrines professionnelles bilingues pour stations de conditionnement, exportateurs d'agrumes et fournisseurs agricoles de Chtouka.",
        en: "Bilingual enterprise portals for packing stations, citrus exporters, and agricultural suppliers in Chtouka.",
        ar: "مواقع مؤسسية لمحطات التلفيف، مصدري الحوامض والبواكير وموردي المعدات الفلاحية باشتوكة."
    },
    aga_why_badge: {
        fr: "Impact Mesurable",
        en: "Measurable Impact",
        ar: "أثر ملموس"
    },
    aga_why_title: {
        fr: "Pourquoi un site optimisé à Agadir est un accélérateur",
        en: "Why an Optimized Website in Agadir Accelerates Growth",
        ar: "لماذا يعد الموقع الاحترافي بأكادير محركاً للنمو"
    },
    aga_why_desc: {
        fr: "Captez les clients qui recherchent vos services sur smartphone dès leur arrivée dans la région.",
        en: "Capture customers searching on smartphones the moment they land in the region.",
        ar: "استقطب الزوار الذين يبحثون عن خدماتك عبر هواتفهم بمجرد وصولهم للمنطقة."
    },
    aga_p1_title: {
        fr: "Réservation Sans Commission",
        en: "Commission-Free Bookings",
        ar: "حجوزات بدون عمولة"
    },
    aga_p1_desc: {
        fr: "Économisez les 15 à 25% prélevés par les plateformes de voyage en générant vos propres clients directs.",
        en: "Save 15% to 25% taken by travel booking platforms by generating your own direct clients.",
        ar: "وفر نسبة 15% إلى 25% التي تقتطعها منصات الحجز واستقبل زبائنك مباشرة."
    },
    aga_p2_title: {
        fr: "Visibilité Souss-Massa & Europe",
        en: "Souss-Massa & European Reach",
        ar: "ظهور في سوس وأوروبا"
    },
    aga_p2_desc: {
        fr: "Référencement auprès des internautes locaux et des voyageurs européens préparant leurs vacances au soleil.",
        en: "SEO targeting local residents as well as European travelers planning sunny holidays.",
        ar: "تموضع ممتاز أمام الزوار المحليين والمسافرين الأوروبيين الباحثين عن عطلات مشمسة."
    },
    aga_p3_title: {
        fr: "Tunnel WhatsApp Instantané",
        en: "Instant WhatsApp Funnel",
        ar: "تواصل فوري عبر واتساب"
    },
    aga_p3_desc: {
        fr: "Permettez à vos prospects de vous écrire en 1 clic pour vérifier les disponibilités ou demander un devis.",
        en: "Let prospects message you with 1 click to check room availability or request customized quotes.",
        ar: "مكن زوارك من مراسلتك بنقرة واحدة للاستفسار عن الحجوزات أو طلب عروض الأسعار."
    },
    aga_p4_title: {
        fr: "Mise en Ligne en 10-14 jours",
        en: "Turnkey in 10-14 Days",
        ar: "إطلاق سريع في 10-14 يوماً"
    },
    aga_p4_desc: {
        fr: "Un projet mené rapidement, sans retard et avec garantie de bon fonctionnement technique.",
        en: "Fast project turnaround delivered on time with comprehensive technical warranty.",
        ar: "مشروع ينجز في وقت قياسي مع ضمان الأداء التقني الكامل."
    },
    aga_faq_title: {
        fr: "Questions fréquentes sur la <span class=\"neon\">création de site web à Agadir</span>",
        en: "Frequently Asked Questions on <span class=\"neon\">Agadir Website Creation</span>",
        ar: "الأسئلة الشائعة حول <span class=\"neon\">إنشاء المواقع في أكادير</span>"
    },
    aga_faq_q1: {
        fr: "Mon site sera-t-il bien visible sur Google à Agadir et Taghazout ?",
        en: "Will my site rank well on Google in Agadir and Taghazout?",
        ar: "هل سيظهر موقعي بشكل ممتاز على غوغل بأكادير وتغازوت؟"
    },
    aga_faq_a1: {
        fr: "Oui, nous configurons un référencement naturel local ciblé sur Agadir, Taghazout, Tamraght et la région pour capter les recherches les plus lucratives.",
        en: "Yes, we implement targeted local SEO for Agadir, Taghazout, Tamraght, and the broader region capturing high-intent searches.",
        ar: "نعم، نهيئ سيو محلي دقيق يستهدف أكادير، تغازوت، تمراغت والجهة لاستقطاب الزيارات الأكثر قيمة."
    },
    aga_faq_q2: {
        fr: "Puis-je vendre mes produits cosmétiques ou bio en ligne ?",
        en: "Can I sell cosmetics or organic products online?",
        ar: "هل يمكن بيع مستحضرات التجميل أو المنتجات العضوية عبر الموقع؟"
    },
    aga_faq_a2: {
        fr: "Absolument. Nous intégrons une boutique e-commerce sécurisée avec paiement bancaire et suivi des commandes pour vos clients marocains et étrangers.",
        en: "Absolutely. We build a secure e-commerce store with credit card payment and order tracking for local and global clients.",
        ar: "بالتأكيد، نوفر متجراً إلكترونياً آمناً مع الدفع البنكي وتتبع الشحنات للمغرب والخارج."
    },
    aga_faq_q3: {
        fr: "Combien coûte un site web professionnel à Agadir ?",
        en: "How much does a website cost in Agadir?",
        ar: "كم تبلغ تكلفة موقع مهني في أكادير؟"
    },
    aga_faq_a3: {
        fr: "Notre offre démarre à 1 500 DH pour une vitrine essentielle, 2 000 DH pour la formule Starter, 4 500 DH pour la formule Growth avec SEO, et 8 000 DH pour un moteur d'acquisition complet.",
        en: "Our packages start at 1,500 DH for essential showcases, 2,000 DH for Starter, 4,500 DH for Growth with SEO, and 8,000 DH for complete lead machines.",
        ar: "تبدأ باقاتنا من 1500 درهم للموقع التعريفي، 2000 درهم لباقة Starter، 4500 درهم لباقة Growth مع السيو، و8000 درهم للمنظومة المتكاملة."
    },
    aga_cta_title: {
        fr: "Prêt à booster votre visibilité à Agadir ?",
        en: "Ready to boost your visibility in Agadir?",
        ar: "مستعد لمضاعفة زبائنك ومبيعاتك في أكادير؟"
    },
    aga_cta_desc: {
        fr: "Réservez votre audit offert de 15 minutes dès aujourd'hui et commencez à capter des clients qualifiés.",
        en: "Book your free 15-minute audit today and start converting qualified clients.",
        ar: "احجز تدقيقك المجاني لمدة 15 دقيقة اليوم وابدأ في تحويل الزوار إلى زبائن مؤكدين."
    },
    seo_casa_hero_badge: {
        fr: "<span class=\"badge-flag\">🇲🇦</span> RÉFÉRENCEMENT NATUREL GOOGLE CASABLANCA",
        en: "<span class=\"badge-flag\">🇲🇦</span> GOOGLE SEO RANKING CASABLANCA",
        ar: "<span class=\"badge-flag\">🇲🇦</span> سيو والتموضع على غوغل بالدار البيضاء"
    },
    seo_casa_hero_title: {
        fr: "Référencement SEO à Casablanca :<br><span class=\"neon\">Dominez la 1ère Page Google & Générez des Leads</span>",
        en: "SEO Ranking in Casablanca:<br><span class=\"neon\">Dominate Page 1 on Google & Drive Inbound Leads</span>",
        ar: "السيو وتحسين محركات البحث بالدار البيضاء:<br><span class=\"neon\">تصدر الصفحة الأولى على غوغل وضاعف مبيعاتك</span>"
    },
    seo_casa_hero_sub: {
        fr: "Vous voulez que votre entreprise apparaisse en 1ère position sur Google lorsque vos clients recherchent vos services à Casablanca ? Dans un environnement ultra-concurrentiel, le référencement naturel (SEO) est l'actif digital le plus rentable : il génère des prospects chauds 24h/24 sans dépendre du budget publicitaire payant. Nous déployons des stratégies sémantiques, techniques et locales pour positionner durablement votre site en tête des résultats.",
        en: "Want your company to rank #1 on Google when clients search for your services in Casablanca? In a hyper-competitive market, organic SEO is your most profitable asset: delivering inbound leads 24/7 without burning paid ad budgets. We execute semantic, technical, and local strategies to position your business at the top of Google search.",
        ar: "هل ترغب في ظهور شركتك في المرتبة الأولى على غوغل عندما يبحث عملاؤك عن خدماتك بالدار البيضاء؟ في بيئة تنافسية قوية، يعتبر السيو الاستثمار الأكثر ربحية: يجلب زبائن جادين 24/7 دون استنزاف ميزانية الإعلانات. ننفذ استراتيجيات برمجية وسيمانتيك لتصدر نتائج البحث بثبات."
    },
    seo_casa_btn_whatsapp: {
        fr: "<i class=\"fab fa-whatsapp\"></i> Audit SEO Casablanca sur WhatsApp",
        en: "<i class=\"fab fa-whatsapp\"></i> Casablanca SEO Audit on WhatsApp",
        ar: "<i class=\"fab fa-whatsapp\"></i> تدقيق سيو البيضاء عبر واتساب"
    },
    leads_hero_badge: {
        fr: "<span class=\"badge-flag\">🇲🇦</span> ACQUISITION SPÉCIALISÉE ASSURANCE MAROC",
        en: "<span class=\"badge-flag\">🇲🇦</span> SPECIALIZED INSURANCE ACQUISITION MOROCCO",
        ar: "<span class=\"badge-flag\">🇲🇦</span> استقطاب عملاء التأمين بالمغرب"
    },
    leads_hero_title: {
        fr: "Génération de Leads Assurance au Maroc :<br><span class=\"neon\">Dispositifs d'Acquisition Exclusifs pour Cabinets</span>",
        en: "Insurance Lead Generation in Morocco:<br><span class=\"neon\">Exclusive Acquisition Engines for Brokers</span>",
        ar: "جلب عملاء التأمين في المغرب:<br><span class=\"neon\">منظومة استقطاب حصرية لوسطاء ووكلاء التأمين</span>"
    },
    leads_hero_sub: {
        fr: "Vous êtes courtier ou agent général d'assurance au Maroc et cherchez à multiplier vos demandes de devis qualifiées chaque semaine ? Finie la dépendance aléatoire au bouche-à-oreille : nous créons des plateformes web dédiées, positionnées en 1ère page Google sur vos branches stratégiques (auto, santé, multirisque pro, RC décennale), qui convertissent directement les recherches d'assurés en leads exclusifs sur votre WhatsApp commercial.",
        en: "Are you an insurance broker or general agent in Morocco looking to scale qualified quote requests every week? End random reliance on word-of-mouth: we build dedicated web platforms, ranked on Google Page 1 across your core insurance lines (auto, health, commercial, professional liability), converting active searchers directly into exclusive WhatsApp leads.",
        ar: "هل أنت وسيط أو وكيل عام للتأمين بالمغرب وتبحث عن مضاعفة طلبات عروض الأسعار المؤهلة أسبوعياً؟ وداعاً للاعتماد العشوائي على التوصيات: نبني منصات متخصصة تتصدر الصفحة الأولى على غوغل في فروعك الاستراتيجية (السيارات، الصحي، المهني، العشري) وتحول الباحثين إلى عملاء حصريين على واتساب."
    },
    leads_btn_whatsapp: {
        fr: "<i class=\"fab fa-whatsapp\"></i> Lancer mon Dispositif Leads sur WhatsApp",
        en: "<i class=\"fab fa-whatsapp\"></i> Launch My Lead Engine on WhatsApp",
        ar: "<i class=\"fab fa-whatsapp\"></i> إطلاق منظومة جلب العملاء عبر واتساب"
    },
    maroc_hero_badge: {
        fr: "<span class=\"badge-flag\">🇲🇦</span> ROYAUME DU MAROC & COUVERTURE NATIONALE",
        en: "<span class=\"badge-flag\">🇲🇦</span> KINGDOM OF MOROCCO & NATIONWIDE COVERAGE",
        ar: "<span class=\"badge-flag\">🇲🇦</span> المملكة المغربية وتغطية وطنية شاملة"
    },
    maroc_hero_title: {
        fr: "Création de Site Web au Maroc :<br><span class=\"neon\">Votre Moteur d'Acquisition & de Visibilité Google</span>",
        en: "Website Creation in Morocco:<br><span class=\"neon\">Your Inbound Acquisition & Google Visibility Engine</span>",
        ar: "إنشاء المواقع الإلكترونية في المغرب:<br><span class=\"neon\">محركك المتكامل للاستقطاب والظهور على غوغل</span>"
    },
    maroc_hero_sub: {
        fr: "Vous cherchez une agence web au Maroc capable de transformer votre présence digitale en véritable levier de croissance commerciale ? Chez ASSURLEAD, nous ne créons pas de simples vitrines décoratives : nous bâtissons des dispositifs digitaux ultra-rapides, responsives et taillés pour dominer la 1ère page de Google sur Casablanca, Rabat, Marrakech, Tanger et l'ensemble du Royaume.",
        en: "Looking for a web agency in Morocco capable of transforming your digital presence into a true revenue engine? At ASSURLEAD, we don't build decorative brochures: we engineer ultra-fast, responsive web platforms built to dominate Google's Page 1 across Casablanca, Rabat, Marrakech, Tangier, and nationwide.",
        ar: "هل تبحث عن وكالة ويب بالمغرب تحول حضورك الرقمي إلى رافعة حقيقية لنمو مبيعاتك؟ في أسورليد، لا نصنع مجرد واجهات شكلية: نبني منصات رقمية فائقة السرعة ومتجاوبة مصممة لتصدر الصفحة الأولى على غوغل في الدار البيضاء، الرباط، مراكش، طنجة وسائر مدن المملكة."
    },
    maroc_btn_whatsapp: {
        fr: "<i class=\"fab fa-whatsapp\"></i> Devis National sur WhatsApp",
        en: "<i class=\"fab fa-whatsapp\"></i> Morocco National Quote on WhatsApp",
        ar: "<i class=\"fab fa-whatsapp\"></i> طلب عرض سعر وطني عبر واتساب"
    },
    // Navbar
    nav_systeme: {
        fr: "Notre Système",
        en: "Our System",
        ar: "نظامنا"
    },
    nav_offres: {
        fr: "Offres",
        en: "Offers",
        ar: "العروض"
    },
    nav_roi: {
        fr: "Simulateur",
        en: "ROI Simulator",
        ar: "الحاسبة"
    },
    nav_simulateur: {
        fr: "Simulateur",
        en: "Simulator",
        ar: "الحاسبة"
    },
    nav_cas: {
        fr: "Étude de Cas",
        en: "Case Study",
        ar: "دراسة حالة"
    },
    nav_faq: {
        fr: "FAQ",
        en: "FAQ",
        ar: "الأسئلة الشائعة"
    },
    nav_contact: {
        fr: "Contact",
        en: "Contact",
        ar: "اتصل بنا"
    },
    nav_start: {
        fr: "Audit Gratuit",
        en: "Free Audit",
        ar: "تدقيق مجاني"
    },
    nav_diagnostic: {
        fr: "Diagnostic",
        en: "Diagnostic",
        ar: "التشخيص"
    },
    nav_realisations: {
        fr: "Réalisations",
        en: "Case Studies",
        ar: "أعمالنا"
    },
    nav_approche: {
        fr: "Notre Approche",
        en: "Our Approach",
        ar: "نهجنا"
    },
    footer_seo_realisation: {
        fr: "Réalisation : Assurances El Omrani",
        en: "Case Study: Assurances El Omrani",
        ar: "دراسة حالة: تأمينات العمراني"
    },
    rea_badge: {
        fr: "<span class=\"badge-flag\">🇲🇦</span> ÉTUDE DE CAS • AGENT D'ASSURANCE MAROC",
        en: "<span class=\"badge-flag\">🇲🇦</span> CASE STUDY • MOROCCO INSURANCE AGENT",
        ar: "<span class=\"badge-flag\">🇲🇦</span> دراسة حالة • وكيل تأمين بالمغرب"
    },
    rea_hero_title: {
        fr: "Cabinet Assurances El Omrani<br><span class=\"neon\">Site Web & Système d'Acquisition.</span>",
        en: "Assurances El Omrani Agency<br><span class=\"neon\">Website & Lead Acquisition Engine.</span>",
        ar: "وكالة تأمينات العمراني<br><span class=\"neon\">موقع إلكتروني ومنظومة استقطاب عملاء.</span>"
    },
    rea_hero_sub: {
        fr: "Déploiement complet d'un site web sur-mesure ultra-rapide (<a href=\"https://www.assuranceselomrani.com\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color: var(--brand-neon); font-weight: 700; text-decoration: underline;\">www.assuranceselomrani.com</a>), référencement local 1ère page Google et tunnel de conversion WhatsApp pour l'agence d'assurance à Casablanca.",
        en: "Full deployment of a high-speed custom website (<a href=\"https://www.assuranceselomrani.com\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color: var(--brand-neon); font-weight: 700; text-decoration: underline;\">www.assuranceselomrani.com</a>), local Google 1st page ranking, and WhatsApp conversion funnel for the insurance agency in Casablanca.",
        ar: "إطلاق شامل لموقع إلكتروني فائق السرعة ومخصص (<a href=\"https://www.assuranceselomrani.com\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color: var(--brand-neon); font-weight: 700; text-decoration: underline;\">www.assuranceselomrani.com</a>)، مع تصدر الصفحة الأولى في غوغل محلياً وتفعيل مسار تحويل مباشر عبر واتساب لوكالة التأمين بالدار البيضاء."
    },
    rea_meta_client: {
        fr: "Client : <strong>Assurances El Omrani</strong>",
        en: "Client: <strong>Assurances El Omrani</strong>",
        ar: "العميل: <strong>تأمينات العمراني</strong>"
    },
    rea_meta_comp: {
        fr: "Réseau : <strong>AXA Assurance Maroc</strong>",
        en: "Network: <strong>AXA Assurance Morocco</strong>",
        ar: "الشبكة: <strong>أكسا للتأمين المغرب</strong>"
    },
    rea_meta_city: {
        fr: "Zone : <strong>Casablanca & Maroc</strong>",
        en: "Zone: <strong>Casablanca & Morocco</strong>",
        ar: "المنطقة: <strong>الدار البيضاء والمغرب</strong>"
    },
    rea_btn_visit: {
        fr: "Visiter www.assuranceselomrani.com",
        en: "Visit www.assuranceselomrani.com",
        ar: "زيارة الموقع www.assuranceselomrani.com"
    },
    rea_btn_whatsapp: {
        fr: "Déployer pour mon agence",
        en: "Deploy for my agency",
        ar: "إطلاق منظومة لوكالتي"
    },
    rea_live_tag: {
        fr: "Site En Ligne",
        en: "Live Website",
        ar: "موقع مباشر"
    },
    rea_kpi1_title: {
        fr: "Demandes de Devis",
        en: "Quote Requests",
        ar: "طلبات عروض الأسعار"
    },
    rea_kpi1_desc: {
        fr: "Augmentation mensuelle des cotations entrantes (Auto, Moto, Santé, Habitation).",
        en: "Monthly surge in incoming quote requests (Auto, Health, Home, Commercial).",
        ar: "ارتفاع شهري في طلبات التسعير الواردة (سيارات، صحة، سكن، مخاطر مهنية)."
    },
    rea_kpi2_title: {
        fr: "SEO Google Local",
        en: "Local Google SEO",
        ar: "تصدر غوغل المحلي"
    },
    rea_kpi2_desc: {
        fr: "Positionnement prioritaire sur les requêtes d'assurance géolocalisées à Casablanca.",
        en: "Top priority ranking for localized insurance queries across Casablanca.",
        ar: "ترتيب متقدم على الكلمات المفتاحية للتأمين بمدينة الدار البيضاء."
    },
    rea_kpi3_title: {
        fr: "Coût par Lead",
        en: "Cost per Lead",
        ar: "تكلفة العميل المؤهل"
    },
    rea_kpi3_desc: {
        fr: "Économie directe par rapport à l'achat de leads non exclusifs sur les plateformes tierces.",
        en: "Direct savings compared to buying shared non-exclusive leads from third-party broker sites.",
        ar: "توفير مباشر مقارنة بشراء بيانات غير حصرية من المنصات الوسيطة."
    },
    rea_kpi4_title: {
        fr: "Réactivité WhatsApp",
        en: "WhatsApp Responsiveness",
        ar: "سرعة التفاعل عبر واتساب"
    },
    rea_kpi4_desc: {
        fr: "Délai moyen de prise en charge d'un prospect chaud grâce au routage instantané.",
        en: "Average response time for hot prospects thanks to automated direct routing.",
        ar: "متوسط وقت التكفل بالعميل المستعجل بفضل التوجيه الفوري المباشر."
    },
    rea_impact_badge: {
        fr: "Transformation Commerciale",
        en: "Business Transformation",
        ar: "التحول التجاري"
    },
    rea_impact_title: {
        fr: "L'Impact Concret sur l'Agence",
        en: "Concrete Agency Impact",
        ar: "الأثر الملموس على نشاط الوكالة"
    },
    rea_impact_sub: {
        fr: "Comparatif de l'activité du cabinet avant et après le déploiement du système digital ASSURLEAD.",
        en: "Comparison of agency activity before and after implementing the ASSURLEAD digital framework.",
        ar: "مقارنة نشاط الوكالة قبل وبعد تشغيل منظومة ASSURLEAD الرقمية."
    },
    rea_before_badge: {
        fr: "Avant ASSURLEAD",
        en: "Before ASSURLEAD",
        ar: "قبل ASSURLEAD"
    },
    rea_before_title: {
        fr: "Activité Passante & Dépendance Physique",
        en: "Walk-in Reliance & Offline Bottlenecks",
        ar: "الاعتماد الكلي على الزيارات العابرة"
    },
    rea_b1: {
        fr: "Dépendance à 100% au passage en agence physique et au bouche-à-oreille local.",
        en: "100% reliance on physical walk-in traffic and word-of-mouth.",
        ar: "الاعتماد بنسبة 100% على مرور الزوار أمام الوكالة والتوصيات الشفهية."
    },
    rea_b2: {
        fr: "Aucun site internet moderne valorisant l'expertise du cabinet auprès des professionnels.",
        en: "No modern website showcasing agency credentials to high-value prospects.",
        ar: "غياب موقع إلكتروني احترافي يبرز خبرة الوكالة أمام المهنيين والشركات."
    },
    rea_b3: {
        fr: "Perte des prospects qui comparent en ligne le soir, le week-end ou depuis leur mobile.",
        en: "Loss of valuable prospects comparing insurance options online in evenings and weekends.",
        ar: "فقدان العملاء الذين يقارنون العروض عبر هواتفهم في المساء ونهاية الأسبوع."
    },
    rea_b4: {
        fr: "Absence de canal direct WhatsApp pour capter les demandes de devis urgentes.",
        en: "No direct WhatsApp funnel to handle urgent quote requests immediately.",
        ar: "غياب قناة واتساب سريعة لاستقبال ومتابعة طلبات التسعير المستعجلة."
    },
    rea_after_badge: {
        fr: "Après www.assuranceselomrani.com",
        en: "After www.assuranceselomrani.com",
        ar: "بعد إطلاق www.assuranceselomrani.com"
    },
    rea_after_title: {
        fr: "Machine Digitale & Flux Continu",
        en: "Digital Engine & Continuous Inflow",
        ar: "منظومة رقمية وتدفق مستمر"
    },
    rea_a1: {
        fr: "Présence web premium 24h/24 crédibilisant immédiatement le cabinet à Casablanca.",
        en: "24/7 premium web presence instantly establishing credibility across Casablanca.",
        ar: "حضور رقمي احترافي 24/7 يعزز ثقة ومصداقية الوكالة في الدار البيضاء."
    },
    rea_a2: {
        fr: "Positionnement 1ère page Google sur \"Assurance Casablanca\" et requêtes cibles.",
        en: "Top 1st page Google ranking on \"Assurance Casablanca\" and key target keywords.",
        ar: "تصدر الصفحة الأولى في غوغل لكلمة \"تأمين الدار البيضاء\" والمنتجات المستهدفة."
    },
    rea_a3: {
        fr: "Bouton WhatsApp direct déclenchant des conversations qualifiées en moins de 10 minutes.",
        en: "Direct WhatsApp button initiating qualified conversations in under 10 minutes.",
        ar: "زر واتساب مباشر يتيح بدء محادثات مؤهلة مع المستشارين في أقل من 10 دقائق."
    },
    rea_a4: {
        fr: "100% de prospects exclusifs et propriétaires à l'agence (zéro lead revendu à des tiers).",
        en: "100% proprietary exclusive leads (zero resale to competing brokers).",
        ar: "بيانات عملاء حصرية 100% ملك للوكالة (بدون أي إعادة بيع للمنافسين)."
    },
    rea_pillars_badge: {
        fr: "Détails de la Solution",
        en: "Solution Blueprint",
        ar: "تفاصيل الحل المعتمد"
    },
    rea_pillars_title: {
        fr: "Ce qui a été Conçu & Déployé",
        en: "What Was Built & Deployed",
        ar: "ما تم تصميمه وتنفيذه للوكالة"
    },
    rea_pillars_sub: {
        fr: "Une architecture web robuste spécialement calibrée pour le secteur de l'assurance au Maroc.",
        en: "A robust web architecture specifically tailored for Morocco's insurance industry.",
        ar: "بنية رقمية متينة مصممة خصيصاً لقطاع التأمين بالمغرب."
    },
    rea_p1_title: {
        fr: "Site Web Haute Performance",
        en: "High-Performance Website",
        ar: "موقع ويب فائق الأداء"
    },
    rea_p1_desc: {
        fr: "Conception sur-mesure pour www.assuranceselomrani.com : temps de chargement < 1.2s, design épuré, navigation fluide et 100% optimisé smartphone.",
        en: "Custom architecture for www.assuranceselomrani.com: < 1.2s loading speed, sleek UI, mobile-first responsiveness.",
        ar: "تصميم مخصص للموقع www.assuranceselomrani.com بسرعة تحميل أقل من 1.2 ثانية وتوافق تام مع الهواتف الذكية."
    },
    rea_p2_title: {
        fr: "Tunnels de Devis par Produit",
        en: "Product-Specific Quote Funnels",
        ar: "مسارات تسعير مخصصة لكل منتج"
    },
    rea_p2_desc: {
        fr: "Formulaires interactifs spécifiques pour l'Auto (immatriculation, bonus), la Santé, l'Habitation et les Risques Professionnels.",
        en: "Tailored multi-step forms for Auto (registration, bonus), Health, Home, and Commercial policies.",
        ar: "نماذج تفاعلية مخصصة لتأمين السيارات، التأمين الصحي، السكن، وتأمينات الشركات."
    },
    rea_p3_title: {
        fr: "Tunnel WhatsApp Instantané",
        en: "Instant WhatsApp Funnel",
        ar: "تحويل مباشر عبر واتساب"
    },
    rea_p3_desc: {
        fr: "Intégration d'un bouton WhatsApp commercial pré-rempli pour éliminer la friction et transformer les visiteurs en conversations directes.",
        en: "Pre-filled commercial WhatsApp routing eliminating friction and driving immediate calls/chats.",
        ar: "ربط زر واتساب بنصوص مسبقة الإعداد لإزالة العوائق وبدء المحادثات التجارية فوراً."
    },
    rea_p4_title: {
        fr: "SEO Local Casablanca",
        en: "Local Casablanca SEO",
        ar: "تحسين محركات البحث المحلي بالبيضاء"
    },
    rea_p4_desc: {
        fr: "Optimisation on-page et Google Business Profile pour hisser le cabinet sur les premières positions des recherches locales.",
        en: "On-page optimization & Google Business Profile setup propelling the agency to top search spots.",
        ar: "تهيئة الموقع وملف غوغل التجاري لضمان تصدر الوكالة في نتائج البحث الجغرافي."
    },
    rea_p5_title: {
        fr: "Confiance & Rassurance",
        en: "Trust & Credibility",
        ar: "عوامل الثقة والمصداقية"
    },
    rea_p5_desc: {
        fr: "Mise en avant des agréments, de la marque partenaire AXA, des avis clients vérifiés et de la géolocalisation de l'agence.",
        en: "Prominent display of certifications, AXA partner branding, verified customer reviews, and map location.",
        ar: "إبراز التراخيص، علامة الشريك أكسا، آراء العملاء الموثقة وخريطة موقع الوكالة."
    },
    rea_p6_title: {
        fr: "Tracking & Pilotage ROI",
        en: "Analytics & ROI Tracking",
        ar: "تتبع الأداء وعائد الاستثمار"
    },
    rea_p6_desc: {
        fr: "Mesure en temps réel des clics d'appels, des messages WhatsApp générés et du coût par souscription de contrat.",
        en: "Live tracking of phone calls, generated WhatsApp leads, and acquisition cost per signed policy.",
        ar: "متابعة لحظية للنقرات، اتصالات واتساب، وتكلفة توقيع كل عقد تأميني."
    },
    rea_quote_text: {
        fr: "« Grâce à notre site www.assuranceselomrani.com et à la stratégie d'acquisition digitale déployée par ASSURLEAD, notre agence reçoit quotidiennement des demandes de devis qualifiées directement sur WhatsApp. Les clients apprécient la rapidité du site et la facilité de contact. C'est un véritable accélérateur pour notre portefeuille à Casablanca. »",
        en: "“Thanks to our website www.assuranceselomrani.com and the digital strategy deployed by ASSURLEAD, our agency receives daily qualified quote requests straight to WhatsApp. Clients love the speed of the site and easy contact. It has been a true growth accelerator for our Casablanca portfolio.”",
        ar: "«بفضل موقعنا www.assuranceselomrani.com وخطة الاستقطاب الرقمية التي طورتها ASSURLEAD، أصبحت وكالتنا تستقبل يومياً طلبات تسعير مؤهلة مباشرة عبر واتساب. سرعة الموقع وسهولة التواصل صنعت فارقاً حقيقياً في نمو محفظة عملائنا بالدار البيضاء.»"
    },
    rea_quote_author: {
        fr: "Direction du Cabinet",
        en: "Agency Management",
        ar: "إدارة الوكالة"
    },
    rea_quote_agency: {
        fr: "Cabinet Assurances El Omrani • Agent AXA",
        en: "Assurances El Omrani • AXA Agent",
        ar: "وكالة تأمينات العمراني • وكيل أكسا"
    },
    rea_cta_title: {
        fr: "Vous voulez le même système pour votre agence d'assurance ?",
        en: "Want the same acquisition system for your insurance agency?",
        ar: "هل ترغب في المنظومة ذاتها لوكالتك التأمينية بالمغرب؟"
    },
    rea_cta_desc: {
        fr: "Nous concevons et mettons en ligne votre site internet et vos tunnels d'acquisition d'assurance en 14 jours, avec des résultats mesurables dès le 1er mois.",
        en: "We design and deploy your custom insurance website and acquisition funnels in 14 days, with proven results in Month 1.",
        ar: "نقوم بتصميم وإطلاق موقع وكالتك ومسارات استقطاب العملاء في 14 يوماً فقط، مع نتائج ملموسة منذ الشهر الأول."
    },
    rea_cta_btn_wa: {
        fr: "Lancer mon Projet sur WhatsApp <i class=\"fab fa-whatsapp\"></i>",
        en: "Launch on WhatsApp <i class=\"fab fa-whatsapp\"></i>",
        ar: "ابدأ مشروع وكالتك عبر واتساب <i class=\"fab fa-whatsapp\"></i>"
    },
    rea_cta_btn_site: {
        fr: "Voir le site live : assuranceselomrani.com <i class=\"fas fa-external-link-alt\"></i>",
        en: "View live site: assuranceselomrani.com <i class=\"fas fa-external-link-alt\"></i>",
        ar: "زيارة الموقع المباشر: assuranceselomrani.com <i class=\"fas fa-external-link-alt\"></i>"
    },
    appr_badge: {
        fr: "NOTRE APPROCHE",
        en: "OUR APPROACH",
        ar: "نهجنا المبتكر"
    },
    appr_hero_title: {
        fr: "Nous transformons<br>votre visibilité<br><span class=\"neon\">en opportunités</span><br><span class=\"neon\">commerciales.</span>",
        en: "We transform<br>your visibility<br><span class=\"neon\">into commercial</span><br><span class=\"neon\">opportunities.</span>",
        ar: "نحوّل<br>حضورك الرقمي<br><span class=\"neon\">إلى فرص تجارية</span><br><span class=\"neon\">وعقود فعلية.</span>"
    },
    appr_hero_sub: {
        fr: "Une chaîne digitale complète pour capter, rassurer et convertir vos visiteurs en contrats réels.",
        en: "A complete digital pipeline to capture, reassure, and convert your visitors into real signed contracts.",
        ar: "منظومة رقمية متكاملة لجذب زوارك، بناء ثقتهم وتحويلهم إلى عقود تأمين فعلية."
    },
    appr_c1_title: {
        fr: "SITE WEB PROFESSIONNEL",
        en: "PROFESSIONAL WEBSITE",
        ar: "موقع إلكتروني احترافي"
    },
    appr_c1_desc: {
        fr: "Conception d'un site sur-mesure ultra-rapide, responsive mobile & desktop, valorisant votre expertise et maximisant vos conversions.",
        en: "Custom ultra-fast website tailored for mobile & desktop, highlighting your expertise and maximizing conversion rates.",
        ar: "تصميم موقع فائق السرعة ومتجاوب مع الهواتف والحواسيب، يبرز خبرتك ويعزز نسب التحويل."
    },
    appr_c2_title: {
        fr: "SEO LOCAL & RÉFÉRENCEMENT",
        en: "LOCAL SEO & RANKING",
        ar: "السيو المحلي والظهور"
    },
    appr_c2_desc: {
        fr: "Positionnement prioritaire sur les requêtes Google de votre zone géographique (Casablanca, Rabat, Tanger, Marrakech, etc.).",
        en: "Top Google ranking for high-intent queries in your specific city (Casablanca, Rabat, Tangier, Marrakech, etc.).",
        ar: "تصدر نتائج بحث جوجل في منطقتك الجغرافية (الدار البيضاء، الرباط، طنجة، مراكش وغيرها)."
    },
    appr_c3_title: {
        fr: "OPTIMISATION GOOGLE",
        en: "GOOGLE BUSINESS OPTIMIZATION",
        ar: "تحسين ملف جوجل للأعمال"
    },
    appr_c3_desc: {
        fr: "Fiche Google Business Profile vérifiée et optimisée pour capter les appels locaux et accumuler des avis 5 étoiles.",
        en: "Verified, optimized Google Business Profile to capture incoming local phone calls and build 5-star social proof.",
        ar: "توثيق وتحسين حساب جوجل بيزنس لجذب الاتصالات الهاتفية المحلية وحصد تقييمات 5 نجوم."
    },
    appr_c4_title: {
        fr: "WHATSAPP BUSINESS AUTOMATION",
        en: "WHATSAPP BUSINESS AUTOMATION",
        ar: "أتمتة واتساب للأعمال"
    },
    appr_c4_desc: {
        fr: "Intégration d'un tunnel direct WhatsApp pour engager immédiatement les prospects chauds sans friction.",
        en: "Direct WhatsApp funnel integration to immediately engage hot leads with zero friction.",
        ar: "دمج مسار واتساب فوري للتواصل مع العملاء المحتملين مباشرة دون أي تعقيد."
    },
    appr_c5_title: {
        fr: "LEAD GENERATION CIBLÉE",
        en: "TARGETED LEAD GENERATION",
        ar: "استقطاب عملاء مستهدفين"
    },
    appr_c5_desc: {
        fr: "Campagnes ultra-ciblées générant des demandes de devis exclusives et qualifiées prêtes pour vos conseillers.",
        en: "Ultra-targeted acquisition campaigns delivering exclusive, qualified quote requests ready for your brokers.",
        ar: "حملات تسويقية دقيقة تولد طلبات عروض أسعار حصرية ومؤهلة لفريق مستشاريك."
    },
    appr_c6_title: {
        fr: "STRATÉGIE DIGITALE & ROI",
        en: "DIGITAL STRATEGY & ROI",
        ar: "استراتيجية رقمية وعائد استثماري"
    },
    appr_c6_desc: {
        fr: "Accompagnement continu, pilotage du coût d'acquisition et garantie de performance commerciale.",
        en: "Continuous support, acquisition cost monitoring, and commercial performance guarantees.",
        ar: "مواكبة مستمرة، تحكم دقيق في تكلفة اكتساب العملاء وضمان المردودية التجارية."
    },
    appr_cta_badge: {
        fr: "<span class=\"badge-flag\">🇲🇦</span> Déploiement Clé en Main",
        en: "<span class=\"badge-flag\">🇲🇦</span> Turnkey Deployment",
        ar: "<span class=\"badge-flag\">🇲🇦</span> جاهز للتسليم والاستخدام"
    },
    appr_cta_title: {
        fr: "Prêt à activer votre écosystème d'acquisition ?",
        en: "Ready to activate your client acquisition ecosystem?",
        ar: "هل أنت مستعد لتفعيل منظومة الاستقطاب الخاصة بوكالتك؟"
    },
    appr_cta_desc: {
        fr: "Nos experts conçoivent et déploient l'ensemble de votre dispositif sous 14 jours, avec des résultats mesurables dès le premier mois.",
        en: "Our specialists design and deploy your full digital infrastructure within 14 days, with tangible results from month one.",
        ar: "خبراؤنا يصممون ويطلقون منظومتك الكاملة خلال 14 يوماً مع نتائج ملموسة من الشهر الأول."
    },
    appr_cta_whatsapp: {
        fr: "Lancer mon Projet sur WhatsApp <i class=\"fab fa-whatsapp\"></i>",
        en: "Start My Project on WhatsApp <i class=\"fab fa-whatsapp\"></i>",
        ar: "ابدأ مشروعي عبر واتساب <i class=\"fab fa-whatsapp\"></i>"
    },
    appr_cta_diag: {
        fr: "Consulter le Diagnostic de Visibilité <i class=\"fas fa-chart-line\"></i>",
        en: "View Visibility Diagnostic <i class=\"fas fa-chart-line\"></i>",
        ar: "اطّلع على تشخيص الرؤية الرقمية <i class=\"fas fa-chart-line\"></i>"
    },
    appr_trust_1: {
        fr: "Délai garanti 14 jours",
        en: "14-day guaranteed delivery",
        ar: "تسليم مضمون في 14 يوماً"
    },
    appr_trust_2: {
        fr: "Sans engagement de durée",
        en: "No long-term commitment",
        ar: "بدون أي التزام زمني"
    },
    appr_trust_3: {
        fr: "Assistance 7j/7 au Maroc",
        en: "7/7 Support in Morocco",
        ar: "مواكبة ودعم 7/7 في المغرب"
    },
    diag_nav_home: {
        fr: "<i class=\"fas fa-home\"></i> Accueil",
        en: "<i class=\"fas fa-home\"></i> Home",
        ar: "<i class=\"fas fa-home\"></i> الرئيسية"
    },
    diag_nav_cta: {
        fr: "Consultation Gratuite",
        en: "Free Consultation",
        ar: "استشارة مجانية"
    },
    diag_callout_badge: {
        fr: "DIAGNOSTIC DE VISIBILITÉ",
        en: "VISIBILITY DIAGNOSTIC",
        ar: "تشخيص الرؤية الرقمية"
    },
    diag_callout_title: {
        fr: "Pourquoi vos futurs clients ne vous trouvent pas ?",
        en: "Why your future clients aren't finding you?",
        ar: "لماذا لا يجدك عملاؤك المستقبليون؟"
    },
    diag_callout_desc: {
        fr: "Dans un marché où 91% des décisions d'achat commencent sur smartphone, l'absence de dispositif digital vous rend invisible. Consultez le diagnostic complet et découvrez les solutions.",
        en: "In a market where 91% of buying decisions begin on smartphones, lack of a digital setup makes you invisible. Check out the complete diagnostic and discover the solutions.",
        ar: "في سوق تبدأ فيه 91% من قرارات الشراء على الهاتف الذكي، فإن غياب المنظومة الرقمية يجعلك غير مرئي. اطلع على التشخيص الكامل واكتشف الحلول."
    },
    diag_callout_btn: {
        fr: "Consulter le Diagnostic <i class=\"fas fa-arrow-right\"></i>",
        en: "View Diagnostic <i class=\"fas fa-arrow-right\"></i>",
        ar: "عرض التشخيص <i class=\"fas fa-arrow-left\"></i>"
    },
    diag_page_badge: {
        fr: "DIAGNOSTIC DE VISIBILITÉ",
        en: "VISIBILITY DIAGNOSTIC",
        ar: "تشخيص الرؤية الرقمية"
    },
    diag_page_title: {
        fr: "Pourquoi vos futurs clients<br><span class=\"diag-highlight-red\">ne vous trouvent pas</span> <span class=\"diag-hero-qmark\">?</span>",
        en: "Why your future clients<br><span class=\"diag-highlight-red\">aren't finding you</span> <span class=\"diag-hero-qmark\">?</span>",
        ar: "لماذا عملاؤك المستقبليون<br><span class=\"diag-highlight-red\">لا يجدون وكالتك</span> <span class=\"diag-hero-qmark\">؟</span>"
    },
    diag_page_sub: {
        fr: "Dans un marché où 91% des décisions d'achat commencent sur smartphone, l'absence de dispositif digital vous rend invisible aux yeux de vos prospects qualifiés.",
        en: "In a market where 91% of buying decisions start on smartphones, the lack of a digital footprint makes you invisible to qualified prospects.",
        ar: "في سوق تبدأ فيه 91% من قرارات الشراء عبر الهاتف الذكي، فإن غياب المنظومة الرقمية يجعلك غير مرئي أمام عملائك المحتملين."
    },
    diag_c1_title: {
        fr: "PAS DE SITE PROFESSIONNEL",
        en: "NO PROFESSIONAL WEBSITE",
        ar: "غياب موقع إلكتروني احترافي"
    },
    diag_c1_desc: {
        fr: "Sans site web moderne, votre agence manque de crédibilité face à des clients exigeants qui comparent avant de décider.",
        en: "Without a modern website, your agency lacks credibility in front of demanding clients who compare before deciding.",
        ar: "بدون موقع إلكتروني عصري، تفتقر وكالتك للمصداقية أمام عملاء يبحثون ويقارنون قبل اتخاذ القرار."
    },
    diag_c2_title: {
        fr: "FAIBLE VISIBILITÉ GOOGLE",
        en: "LOW GOOGLE VISIBILITY",
        ar: "ضعف الظهور على جوجل"
    },
    diag_c2_desc: {
        fr: "Vos concurrents trustent la 1ère page et Google Maps pendant que vos prospects recherchent activement vos services.",
        en: "Your competitors dominate page 1 and Google Maps while your prospects are actively searching for your services.",
        ar: "منافسوك يستحوذون على الصفحة الأولى وجوجل مابس بينما يبحث عملاؤك بنشاط عن خدماتك."
    },
    diag_c3_title: {
        fr: "PEU DE PROSPECTS RÉGULIERS",
        en: "FEW REGULAR PROSPECTS",
        ar: "قلة العملاء المحتملين بانتظام"
    },
    diag_c3_desc: {
        fr: "Dépendance aléatoire au bouche-à-oreille sans flux maîtrisé de demandes entrantes semaine après semaine.",
        en: "Random dependency on word-of-mouth with no controlled incoming flow of requests week after week.",
        ar: "الاعتماد العشوائي على التوصيات الشفهية دون تدفق منتظم لطلبات عروض الأسعار أسبوعاً بعد أسبوع."
    },
    diag_c4_title: {
        fr: "PRÉSENCE DIGITALE INSUFFISANTE",
        en: "INSUFFICIENT DIGITAL PRESENCE",
        ar: "حضور رقمي غير كافٍ"
    },
    diag_c4_desc: {
        fr: "Absence de passerelle directe pour échanger en 1 clic (comme WhatsApp) et orienter le visiteur vers la signature.",
        en: "Lack of a direct 1-click bridge (like WhatsApp) to guide visitors straight to contract signing.",
        ar: "غياب قناة تواصل فورية بنقرة واحدة (مثل واتساب) لتوجيه الزائر نحو التوقيع السريع."
    },
    diag_c5_title: {
        fr: "PAS DE STRATÉGIE D'ACQUISITION",
        en: "NO ACQUISITION STRATEGY",
        ar: "غياب استراتيجية استقطاب"
    },
    diag_c5_desc: {
        fr: "Aucun système prédictible de génération de contacts qualifiés ni mesure claire du retour sur investissement.",
        en: "No predictable system for generating qualified leads or measuring return on investment.",
        ar: "انعدام نظام يمكن التنبؤ به لجلب العملاء المؤهلين وقياس العائد على الاستثمار بوضوح."
    },
    diag_alert_text: {
        fr: "Vos clients recherchent sur Internet avant de vous contacter. Faites en sorte qu'ils tombent sur vous.",
        en: "Your clients search the Internet before contacting you. Make sure they stumble upon you.",
        ar: "عملاؤك يبحثون على الإنترنت قبل الاتصال بك. تأكد من أنهم يجدونك أنت أولاً."
    },
    diag_cta_badge: {
        fr: "<span class=\"badge-flag\">🇲🇦</span> Audit Stratégique Personnalisé",
        en: "<span class=\"badge-flag\">🇲🇦</span> Personalized Strategic Audit",
        ar: "<span class=\"badge-flag\">🇲🇦</span> تدقيق استراتيجي مخصص"
    },
    diag_cta_title: {
        fr: "Prêt à inverser la tendance et capter vos futurs clients ?",
        en: "Ready to turn the tables and capture your future clients?",
        ar: "هل أنت مستعد لعكس المعادلة واستقطاب عملائك المستقبليين؟"
    },
    diag_cta_desc: {
        fr: "Ne laissez plus vos concurrents monopoliser les demandes de devis au Maroc. Bénéficiez d'une consultation de diagnostic personnalisée de 10 minutes offerte avec notre expert digital.",
        en: "Stop letting competitors monopolize incoming quote requests in Morocco. Enjoy a free 10-minute tailored visibility audit consultation with our digital expert.",
        ar: "لا تترك منافسيك يستحوذون على طلبات عروض الأسعار في المغرب. استفد من استشارة تشخيصية مجانية لمدة 10 دقائق مع خبيرنا الرقمي."
    },
    diag_cta_whatsapp: {
        fr: "Lancer mon Diagnostic Gratuit (10 min) <i class=\"fab fa-whatsapp\"></i>",
        en: "Start My Free Diagnostic (10 min) <i class=\"fab fa-whatsapp\"></i>",
        ar: "ابدأ تشخيصي المجاني (10 دقائق) <i class=\"fab fa-whatsapp\"></i>"
    },
    diag_cta_offers: {
        fr: "Découvrir nos solutions de création de sites <i class=\"fas fa-bolt\"></i>",
        en: "Explore our website creation solutions <i class=\"fas fa-bolt\"></i>",
        ar: "استكشف حلول إنشاء المواقع <i class=\"fas fa-bolt\"></i>"
    },
    diag_cta_home: {
        fr: "<i class=\"fas fa-arrow-left\"></i> Revenir à l'accueil du site",
        en: "<i class=\"fas fa-arrow-left\"></i> Back to main home",
        ar: "<i class=\"fas fa-arrow-right\"></i> العودة للصفحة الرئيسية"
    },
    diag_trust_1: {
        fr: "Audit sans engagement",
        en: "No obligation audit",
        ar: "تدقيق بدون أي التزام"
    },
    diag_trust_2: {
        fr: "Analyse concurrentielle locale",
        en: "Local competitive analysis",
        ar: "تحليل تنافسي محلي"
    },
    diag_trust_3: {
        fr: "Plan d'action chiffré",
        en: "Quantified action plan",
        ar: "خطة عمل مرقمة ومدروسة"
    },
    // Hero
    hero_badge: {
        fr: "<span class=\"badge-flag\">🇲🇦</span> Agence de Génération de Leads Organiques au Maroc <i class=\"fas fa-meteor shooting-icon\"></i>",
        en: "<span class=\"badge-flag\">🇲🇦</span> Organic Lead Generation Agency in Morocco <i class=\"fas fa-meteor shooting-icon\"></i>",
        ar: "<span class=\"badge-flag\">🇲🇦</span> وكالة استقطاب العملاء وتصدر غوغل بالمغرب <i class=\"fas fa-meteor shooting-icon\"></i>"
    },
    hero_title: {
        fr: "Prenez la 1ère place sur Google.<br><span class=\"neon\">Captez vos clients dès aujourd'hui.</span> <span class=\"morocco-flag-badge\" aria-label=\"Maroc\" title=\"Maroc\"><svg class=\"morocco-flag-svg\" viewBox=\"0 0 30 20\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><rect width=\"30\" height=\"20\" rx=\"3\" fill=\"#C1272D\"/><path d=\"M15,4.2 L18.53,14.85 L9.29,8.15 L20.71,8.15 L11.47,14.85 Z\" fill=\"none\" stroke=\"#00FF41\" stroke-width=\"1.3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg></span>",
        en: "Take #1 Rank on Google.<br><span class=\"neon\">Capture your clients starting today.</span> <span class=\"morocco-flag-badge\" aria-label=\"Morocco\" title=\"Morocco\"><svg class=\"morocco-flag-svg\" viewBox=\"0 0 30 20\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><rect width=\"30\" height=\"20\" rx=\"3\" fill=\"#C1272D\"/><path d=\"M15,4.2 L18.53,14.85 L9.29,8.15 L20.71,8.15 L11.47,14.85 Z\" fill=\"none\" stroke=\"#00FF41\" stroke-width=\"1.3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg></span>",
        ar: "تصدر المرتبة الأولى في غوغل.<br><span class=\"neon\">استقطب عملاءك ابتداءً من اليوم.</span> <span class=\"morocco-flag-badge\" aria-label=\"المغرب\" title=\"المغرب\"><svg class=\"morocco-flag-svg\" viewBox=\"0 0 30 20\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><rect width=\"30\" height=\"20\" rx=\"3\" fill=\"#C1272D\"/><path d=\"M15,4.2 L18.53,14.85 L9.29,8.15 L20.71,8.15 L11.47,14.85 Z\" fill=\"none\" stroke=\"#00FF41\" stroke-width=\"1.3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg></span>"
    },
    hero_paragraph: {
        fr: "Agence leader en création de site web à Casablanca et partout au Maroc. Nous concevons des sites internet ultra-performants et optimisés pour le SEO Google local afin de capter un flux continu de clients prêts à signer.",
        en: "Top agency for website creation in Casablanca and across Morocco. We build high-speed, SEO-engineered websites designed to rank #1 on Google and turn local search demand into qualified clients.",
        ar: "الوكالة الرائدة في إنشاء المواقع الإلكترونية بالدار البيضاء وكافة مدن المغرب. نبني مواقع فائقة السرعة ومتوافقة مع خوارزميات غوغل لتصدر نتائج البحث وتحويل الزوار لعملاء فعليين."
    },
    hero_btn_growth: {
        fr: "Demander un audit gratuit (15 min) <i class=\"fas fa-arrow-right\"></i>",
        en: "Get a Free SEO Audit (15 min) <i class=\"fas fa-arrow-right\"></i>",
        ar: "طلب تدقيق مجاني للظهور (15 دقيقة) <i class=\"fas fa-arrow-right\"></i>"
    },
    hero_btn_audit: {
        fr: "Voir comment ça fonctionne",
        en: "See how it works",
        ar: "اكتشف كيف يعمل نظامنا"
    },
    hero_partners_label: {
        fr: "Secteurs & Réseaux Accompagnés au Maroc",
        en: "Sectors & Networks in Morocco",
        ar: "القطاعات والشبكات المواكبة في المغرب"
    },
    // Dashboard Card
    dash_live_indicator: {
        fr: "Pipeline d'Acquisition Actif",
        en: "Active Acquisition Pipeline",
        ar: "مسار الاستقطاب النشط"
    },
    dash_leads_label: {
        fr: "Leads Qualifiés / Mois",
        en: "Qualified Leads / Month",
        ar: "عملاء مؤهلون / شهر"
    },
    dash_conv_label: {
        fr: "Taux de Contact",
        en: "Contact Rate",
        ar: "نسبة التواصل الفوري"
    },
    // Stats
    stat_ca: {
        fr: "Primes & CA Pilotés",
        en: "Managed Premiums & Revenue",
        ar: "أقساط ورقم معاملات مُدار"
    },
    stat_leads: {
        fr: "Leads Qualifiés / Mois en Moyenne",
        en: "Avg. Qualified Leads / Month",
        ar: "متوسط العملاء المؤهلين / شهر"
    },
    stat_contracts: {
        fr: "Contrats Signés / Mois par Agence",
        en: "Signed Contracts / Month / Agency",
        ar: "عقود موقعة شهرياً لكل وكالة"
    },
    // System Section (Funnel)
    sys_badge: {
        fr: "Notre Système Propriétaire",
        en: "Proprietary Acquisition Framework",
        ar: "نظامنا المبتكر للاستقطاب"
    },
    sys_title: {
        fr: "La Machine <span class=\"neon\">d'Acquisition Assurance.</span>",
        en: "The Insurance <span class=\"neon\">Acquisition Engine.</span>",
        ar: "محرك <span class=\"neon\">استقطاب عملاء التأمين.</span>"
    },
    sys_p: {
        fr: "Nous ne vendons pas des clics sans lendemain. Nous déployons un tunnel d'acquisition complet conçu spécifiquement pour le secteur de l'assurance au Maroc.",
        en: "We don't sell random clicks. We build an end-to-end acquisition funnel engineered specifically for Moroccan insurance agencies.",
        ar: "نحن لا نبيع نقرات عشوائية، بل نبني لك قمع استقطاب متكامل مخصص لسوق التأمين في المغرب."
    },
    sys_step1_title: {
        fr: "Google Search & Meta Ads",
        en: "Google Search & Meta Ads",
        ar: "إعلانات غوغل وميتا الدقيقة"
    },
    sys_step1_p: {
        fr: "Ciblage chirurgical des personnes cherchant activement un devis d'assurance (Auto, Santé, RC Pro, Flotte) dans votre ville.",
        en: "Surgical intent targeting of clients actively looking for insurance quotes (Auto, Health, Liability, Fleet) in your target area.",
        ar: "استهداف دقيق للمواطنين والشركات الذين يبحثون بنشاط عن عروض أسعار التأمين (سيارات، صحة، مخاطر مهنية) في مدينتك."
    },
    sys_step2_title: {
        fr: "Landing Pages Dédiées",
        en: "Dedicated Landing Pages",
        ar: "صفحات هبوط متخصصة"
    },
    sys_step2_p: {
        fr: "Tunnels de conversion ultra-rapides avec formulaire de devis simplifié en 2 minutes par produit d'assurance.",
        en: "Ultra-fast conversion tunnels with simplified 2-minute insurance quote forms per coverage line.",
        ar: "صفحات هبوط فائقة السرعة مع نموذج طلب تسعيرة مبسط في دقيقتين لكل نوع تأمين."
    },
    sys_step3_title: {
        fr: "Qualification Instantanée",
        en: "Instant Lead Qualification",
        ar: "فلترة وتأهيل فوري للعميل"
    },
    sys_step3_p: {
        fr: "Filtrage automatisé des coordonnées, vérification anti-doublons et validation des critères d'éligibilité du prospect.",
        en: "Automated phone/data validation, duplicate removal, and qualification against your policy criteria.",
        ar: "تحقق تلقائي من صحة أرقام الهواتف، إزالة التكرار والتأكد من مطابقة العميل لشروط وثيقة التأمين."
    },
    sys_step4_title: {
        fr: "Alerte CRM & Relance < 60s",
        en: "CRM Alert & Follow-up < 60s",
        ar: "إشعار CRM ومتابعة في أقل من 60 ثانية"
    },
    sys_step4_p: {
        fr: "Transmission instantanée sur le mobile de votre équipe commerciale avec relances WhatsApp pré-programmées.",
        en: "Instant dispatch to your sales team's mobile phone with automated WhatsApp follow-up triggers.",
        ar: "إرسال بيانات العميل فوراً إلى هاتف فريقك التجاري مع رسائل واتساب تفاعلية مجهزة ومؤتمتة."
    },
    sys_step5_title: {
        fr: "Signature & Mesure du CAC",
        en: "Closing & CAC Tracking",
        ar: "إبرام العقد وقياس تكلفة الاستقطاب"
    },
    sys_step5_p: {
        fr: "Émission du contrat d'assurance et suivi précis de votre coût par contrat signé pour maximiser votre rentabilité.",
        en: "Policy contract issuance with transparent tracking of your exact acquisition cost per signed contract.",
        ar: "توقيع وثيقة التأمين مع تتبع دقيق لتكلفة الحصول على كل عقد لضمان أعلى ربحية لوكالتك."
    },
    // Comparison Matrix & Difference
    diff_badge: {
        fr: "La Vraie Différence",
        en: "The Real Difference",
        ar: "الفرق الجوهري"
    },
    diff_title: {
        fr: "<span class=\"nowrap-phrase\">Site Vitrine Classique</span> <span class=\"nowrap-phrase\">vs <span class=\"neon\">Moteur d'Acquisition</span></span>",
        en: "<span class=\"nowrap-phrase\">Classic Showcase Site</span> <span class=\"nowrap-phrase\">vs <span class=\"neon\">Acquisition Engine</span></span>",
        ar: "<span class=\"nowrap-phrase\">الموقع التقليدي</span> <span class=\"nowrap-phrase\">مقابل <span class=\"neon\">محرك استقطاب العملاء</span></span>"
    },
    diff_p: {
        fr: "<span class=\"diff-sub-phrase\">Pourquoi 90% des sites web d'entreprises au Maroc ne génèrent aucun client</span> <span class=\"diff-sub-phrase\">— et comment notre architecture inverse l'équation.</span>",
        en: "<span class=\"diff-sub-phrase\">Why 90% of business websites in Morocco fail to generate clients</span> <span class=\"diff-sub-phrase\">— and how our architecture reverses the equation.</span>",
        ar: "<span class=\"diff-sub-phrase\">لماذا 90% من المواقع بالمغرب لا تجلب أي عميل</span> <span class=\"diff-sub-phrase\">— وكيف يقلب نظامنا المعادلة لصالحك.</span>"
    },
    methode_badge: {
        fr: "Processus Éprouvé",
        en: "Proven Process",
        ar: "منهجية مثبتة"
    },
    methode_title: {
        fr: "<span class=\"nowrap-phrase\">Notre Méthode d'Acquisition</span> <span class=\"nowrap-phrase neon\">en 4 Étapes.</span>",
        en: "<span class=\"nowrap-phrase\">Our Acquisition Method</span> <span class=\"nowrap-phrase neon\">in 4 Steps.</span>",
        ar: "<span class=\"nowrap-phrase\">منهجيتنا في الاستقطاب</span> <span class=\"nowrap-phrase neon\">في 4 خطوات.</span>"
    },
    methode_p: {
        fr: "Une démarche d'ingénierie web et de référencement naturel rigoureuse pour positionner votre entreprise face à ses futurs clients.",
        en: "A rigorous web engineering and organic SEO process to position your business in front of future clients.",
        ar: "هندسة رقمية دقيقة وتهيئة غوغل محكمة لوضع وكالتك أمام عملائك المستقبليين."
    },
    comp_classic_title: {
        fr: "Agence Web Classique",
        en: "Generic Web Agency",
        ar: "الوكالات التقليدية العامة"
    },
    comp_c1: {
        fr: "Crée un site vitrine passif sans focus acquisition",
        en: "Builds a passive showcase site with zero acquisition focus",
        ar: "تصنع موقعاً تقليدياً بدون تركيز على جلب مبيعات"
    },
    comp_c2: {
        fr: "Facture des clics sans suivre les contrats signés",
        en: "Bills for impressions/clicks with no signed contract accountability",
        ar: "تحاسبك على النقرات دون أي متابعة للعقود الموقعة"
    },
    comp_c3: {
        fr: "Aucune connaissance des règles du marché de l'assurance",
        en: "Zero understanding of Moroccan insurance regulations and products",
        ar: "عدم معرفة بقوانين وخصوصيات قطاع التأمين بالمغرب"
    },
    comp_c4: {
        fr: "Pas de CRM ni d'automatisation des relances WhatsApp",
        en: "No dedicated CRM or automated WhatsApp follow-up pipelines",
        ar: "غياب نظام CRM وأتمتة المتابعة عبر الواتساب"
    },
    comp_assurlead_title: {
        fr: "Le Système ASSURLEAD",
        en: "The ASSURLEAD Engine",
        ar: "نظام ASSURLEAD المتخصص"
    },
    comp_a1: {
        fr: "100% Spécialisé dans l'acquisition de courtiers & agences",
        en: "100% Specialized in broker & insurance agency customer acquisition",
        ar: "100% متخصص في جلب زبناء وكلاء ومكاتب التأمين"
    },
    comp_a2: {
        fr: "Leads qualifiés, vérifiés et exclusifs à votre agence",
        en: "Verified, qualified leads strictly 100% exclusive to your agency",
        ar: "عملاء مؤهلون ومحققون وحصريون لوكالتك فقط"
    },
    comp_a3: {
        fr: "Intégration CRM + Notification instantanée < 60 secondes",
        en: "CRM integration + Instant mobile alert in under 60 seconds",
        ar: "ربط CRM وإشعار فوري للفريق في أقل من 60 ثانية"
    },
    comp_a4: {
        fr: "Optimisation continue basée sur le Coût par Contrat réel",
        en: "Continuous optimization driven by Cost Per Signed Contract",
        ar: "تحسين مستمر مبني على تكلفة العقد الفعلي الموقع"
    },
    // ROI
    roi_badge: {
        fr: "Simulateur d'Acquisition 2026",
        en: "Acquisition Simulator 2026",
        ar: "حاسبة الأرباح والاستقطاب 2026"
    },
    roi_top_line: {
        fr: "Simulez en direct la",
        en: "Simulate live the",
        ar: "احسب بشكل فوري"
    },
    roi_title: {
        fr: "Rentabilité<br>de votre Agence",
        en: "Profitability<br>of your Agency",
        ar: "أرباح ومردودية<br>وكالتك"
    },
    roi_bottom_line: {
        fr: "sur chaque contrat signé",
        en: "on every signed policy",
        ar: "على كل عقد موقع"
    },
    roi_p: {
        fr: "Estimez vos volumes de leads qualifiés, devis émis et contrats signés selon votre budget publicitaire.",
        en: "Estimate your monthly qualified leads, quote volume, and signed insurance policies based on your ad spend.",
        ar: "احسب عدد العملاء المؤهلين، طلبات التسعير والعقود الموقعة بناءً على ميزانيتك الإعلانية."
    },
    roi_cta_btn: {
        fr: "Je demande un devis <i class=\"fas fa-arrow-right\"></i>",
        en: "Request a quote <i class=\"fas fa-arrow-right\"></i>",
        ar: "أطلب عرض سعر <i class=\"fas fa-arrow-right\"></i>"
    },
    roi_launch_btn: {
        fr: "<i class=\"fas fa-calculator\"></i> Lancer le Simulateur d'Acquisition <i class=\"fas fa-arrow-right\"></i>",
        en: "<i class=\"fas fa-calculator\"></i> Launch Acquisition Simulator <i class=\"fas fa-arrow-right\"></i>",
        ar: "<i class=\"fas fa-calculator\"></i> فتح حاسبة الأرباح والاستقطاب <i class=\"fas fa-arrow-left\"></i>"
    },
    roi_budget_label: {
        fr: "Budget Média Mensuel (Google/Meta Ads)",
        en: "Monthly Media Budget (Google/Meta Ads)",
        ar: "الميزانية الإعلانية الشهرية (غوغل وميتا)"
    },
    roi_conv_label: {
        fr: "Taux de Closing Commercial Estimé",
        en: "Estimated Sales Closing Rate",
        ar: "نسبة إقفال المبيعات وتوقيع العقود"
    },
    roi_leads_title: {
        fr: "Demandes de Devis (Leads)",
        en: "Quote Requests (Leads)",
        ar: "طلبات التسعيرة (Leads)"
    },
    roi_cost_title: {
        fr: "Coût par Lead Moyen",
        en: "Avg. Cost per Lead",
        ar: "متوسط تكلفة العميل"
    },
    roi_sales_title: {
        fr: "Contrats Signés Estimés",
        en: "Estimated Signed Policies",
        ar: "العقود الموقعة المتوقعة"
    },
    roi_basket_title: {
        fr: "Prime Moyenne / Panier",
        en: "Avg. Policy Premium",
        ar: "متوسط قسط التأمين"
    },
    roi_rev_title: {
        fr: "CA potentiel estimé",
        en: "Estimated Potential Revenue",
        ar: "رقم المعاملات المحتمل التقديري"
    },
    roi_tag: {
        fr: "ROI indicatif",
        en: "Indicative ROI",
        ar: "العائد الاستثماري التقديري"
    },
    roi_overlay_tag: {
        fr: "Simulation Temps Réel",
        en: "Real-time Simulation",
        ar: "محاكاة لحظية"
    },
    roi_status_text: {
        fr: "Rentabilité d'Acquisition Validée",
        en: "Acquisition ROI Validated",
        ar: "نموذج نمو عالي الربحية"
    },
    roi_disclaimer: {
        fr: '<i class="fas fa-info-circle"></i> Simulation indicative basée sur les paramètres renseignés. Les résultats réels varient selon le secteur, la zone, l\'offre, le budget publicitaire et le taux de conversion.',
        en: '<i class="fas fa-info-circle"></i> Indicative simulation based on the entered parameters. Actual results vary depending on the sector, area, offer, advertising budget, and conversion rate.',
        ar: '<i class="fas fa-info-circle"></i> محاكاة تقديرية مبنية على المعطيات المحددة. تختلف النتائج الفعلية حسب القطاع، المنطقة، العرض، الميزانية الإعلانية ونسبة التحويل.'
    },
    // Offers Header
    offers_badge: {
        fr: "Grille Tarifaire",
        en: "Pricing & Packages",
        ar: "الباقات والأسعار"
    },
    offers_title: {
        fr: "<span class=\"nowrap-phrase\">4 Formules Claires.</span> <span class=\"nowrap-phrase neon\">Zéro Frais Cachés.</span>",
        en: "<span class=\"nowrap-phrase\">4 Clear Tiers.</span> <span class=\"nowrap-phrase neon\">Zero Hidden Fees.</span>",
        ar: "<span class=\"nowrap-phrase\">4 باقات واضحة.</span> <span class=\"nowrap-phrase neon\">بدون أي مصاريف خفية.</span>"
    },
    offers_p: {
        fr: "Choisissez la formule adaptée à vos ambitions de croissance sur votre zone de chalandise.",
        en: "Select the ideal tier aligned with your growth targets across your target territory.",
        ar: "اختر الباقة المناسبة لطموحاتك وتوسع وكالتك في رقعتك الجغرافية."
    },
    // Promotional Banner (Offre Spéciale)
    special_offer_btn: {
        fr: "Profiter d'une offre à prix spécial",
        en: "Claim a Special Price Offer",
        ar: "الاستفادة من عرض بسعر خاص"
    },
    special_offer_deadline: {
        fr: "jusqu'au 31/10/2026",
        en: "until 31/10/2026",
        ar: "حتى 31/10/2026"
    },
    promo_badge: {
        fr: "OFFRE SPÉCIALE",
        en: "SPECIAL OFFER",
        ar: "عرض خاص"
    },
    promo_title: {
        fr: "CRÉATION DE SITES<br>INTERNET<br>PROFESSIONNELS",
        en: "PROFESSIONAL<br>WEBSITE<br>CREATION",
        ar: "إنشاء مواقع<br>إلكترونية<br>احترافية"
    },
    promo_desc: {
        fr: "Nous créons des sites modernes, ultra-rapides et pensés dès la première ligne de code pour inspirer confiance et convertir vos visiteurs en demandes de devis.",
        en: "We build modern, ultra-fast websites designed from the very first line of code to inspire trust and convert your visitors into quote requests.",
        ar: "نصمم مواقع عصرية، فائقة السرعة ومبرمجة من السطر الأول لبناء الثقة وتحويل زوارك إلى طلبات عروض أسعار فعلية."
    },
    promo_price_unit: {
        fr: "DH (Offre d'appel)",
        en: "DH (Intro Offer)",
        ar: "درهم (عرض انطلاق)"
    },
    promo_btn: {
        fr: "Profiter de l'offre <i class=\"fab fa-whatsapp\"></i>",
        en: "Claim This Offer <i class=\"fab fa-whatsapp\"></i>",
        ar: "الاستفادة من العرض <i class=\"fab fa-whatsapp\"></i>"
    },
    promo_f1: {
        fr: "Design UX/UI haute conversion",
        en: "High-converting UX/UI design",
        ar: "تصميم UX/UI عالي التحويل"
    },
    promo_f2: {
        fr: "Bouton WhatsApp commercial direct",
        en: "Direct commercial WhatsApp button",
        ar: "زر واتساب تجاري مباشر"
    },
    promo_f3: {
        fr: "Formulaire de devis interactif",
        en: "Interactive quote request form",
        ar: "نموذج طلب تسعيرة تفاعلي"
    },
    promo_f4: {
        fr: "100% Responsive smartphone & tablette",
        en: "100% Responsive smartphone & tablet",
        ar: "متوافق 100% مع الهواتف والأجهزة اللوحية"
    },
    promo_f5: {
        fr: "Vitesse de chargement &lt; 1.2s",
        en: "Loading speed &lt; 1.2s",
        ar: "سرعة تحميل أقل من 1.2 ثانية"
    },
    promo_f6: {
        fr: "Hébergement sécurisé SSL HTTPS",
        en: "Secure SSL HTTPS hosting",
        ar: "استضافة آمنة بشهادة SSL HTTPS"
    },
    // 1. 🚀 STARTER (2 000 DH)
    offer_starter_badge: {
        fr: "Essentiel",
        en: "Essential",
        ar: "الباقة الأساسية"
    },
    offer_starter_title: {
        fr: "🚀 STARTER",
        en: "🚀 STARTER",
        ar: "🚀 باقة الانطلاق (STARTER)"
    },
    offer_starter_f1: {
        fr: "Site professionnel",
        en: "Professional website",
        ar: "موقع إلكتروني احترافي"
    },
    offer_starter_f2: {
        fr: "Structure SEO",
        en: "SEO structure",
        ar: "بنية مهيأة لمحركات البحث"
    },
    offer_starter_f3: {
        fr: "WhatsApp direct",
        en: "Direct WhatsApp",
        ar: "زر واتساب مباشر"
    },
    offer_starter_f4: {
        fr: "Formulaire",
        en: "Quote form",
        ar: "استمارة طلب تسعيرة"
    },
    offer_starter_f5: {
        fr: "Google Maps",
        en: "Google Maps",
        ar: "تهيئة Google Maps"
    },
    offer_starter_btn: {
        fr: "Choisir Starter",
        en: "Choose Starter",
        ar: "اختيار باقة Starter"
    },

    // 2. 📈 GROWTH (4 500 DH)
    offer_growth_badge: {
        fr: "Recommandé • Plus Populaire",
        en: "Recommended • Most Popular",
        ar: "الأكثر طلباً • موصى به"
    },
    offer_growth_title: {
        fr: "📈 GROWTH",
        en: "📈 GROWTH",
        ar: "📈 باقة النمو (GROWTH)"
    },
    offer_growth_f1: {
        fr: "Site complet",
        en: "Complete website",
        ar: "موقع إلكتروني متكامل"
    },
    offer_growth_f2: {
        fr: "SEO local",
        en: "Local SEO",
        ar: "سيو محلي (Local SEO)"
    },
    offer_growth_f3: {
        fr: "Optimisation Google",
        en: "Google optimization",
        ar: "تحسين المعايير لغوغل"
    },
    offer_growth_f4: {
        fr: "Pages services",
        en: "Dedicated service pages",
        ar: "صفحات مخصصة للخدمات"
    },
    offer_growth_f5: {
        fr: "Conversion",
        en: "Conversion focus",
        ar: "مسارات تحويل الزوار"
    },
    offer_growth_btn: {
        fr: "Choisir Growth",
        en: "Choose Growth",
        ar: "اختيار باقة Growth"
    },

    // 3. 🔥 LEAD ENGINE (8 000 DH)
    offer_lead_engine_badge: {
        fr: "Moteur Actif",
        en: "Active Engine",
        ar: "محرك استقطاب نشط"
    },
    offer_lead_engine_title: {
        fr: "🔥 LEAD ENGINE",
        en: "🔥 LEAD ENGINE",
        ar: "🔥 محرك العملاء (LEAD ENGINE)"
    },
    offer_lead_engine_f1: {
        fr: "Site web performant",
        en: "High-performance website",
        ar: "موقع ويب عالي الأداء"
    },
    offer_lead_engine_f2: {
        fr: "Stratégie SEO organique",
        en: "Organic SEO strategy",
        ar: "استراتيجية سيو عضوي متقدمة"
    },
    offer_lead_engine_f3: {
        fr: "Contenu optimisé",
        en: "Optimized content",
        ar: "محتوى حصري ومحسن"
    },
    offer_lead_engine_f4: {
        fr: "SEO local",
        en: "Local SEO targeting",
        ar: "استهداف موضعي لسيو المدن"
    },
    offer_lead_engine_f5: {
        fr: "Suivi & pilotage",
        en: "Performance monitoring",
        ar: "متابعة دورية وقياس النتائج"
    },
    offer_lead_engine_btn: {
        fr: "Choisir Lead Engine",
        en: "Choose Lead Engine",
        ar: "اختيار باقة Lead Engine"
    },

    // 4. 🏆 ACQUISITION (12 000 DH+)
    offer_acquisition_badge: {
        fr: "Sur Mesure",
        en: "Bespoke System",
        ar: "نظام شامل ومخصص"
    },
    offer_acquisition_title: {
        fr: "🏆 ACQUISITION",
        en: "🏆 ACQUISITION",
        ar: "🏆 باقة الاستقطاب الشامل (ACQUISITION)"
    },
    offer_acquisition_f1: {
        fr: "Site sur mesure",
        en: "Custom bespoke website",
        ar: "موقع مخصص فائق الاحترافية"
    },
    offer_acquisition_f2: {
        fr: "Stratégie SEO avancée",
        en: "Advanced SEO strategy",
        ar: "استراتيجية سيو تنافسية موسعة"
    },
    offer_acquisition_f3: {
        fr: "Contenu stratégique",
        en: "Strategic content creation",
        ar: "صناعة محتوى استراتيجي"
    },
    offer_acquisition_f4: {
        fr: "Optimisation continue",
        en: "Continuous optimization",
        ar: "تحسين وتطوير فني وتقني مستمر"
    },
    offer_acquisition_f5: {
        fr: "Acquisition organique",
        en: "Organic lead acquisition",
        ar: "منظومة استقطاب عضوي مستدامة"
    },
    offer_acquisition_btn: {
        fr: "Choisir Acquisition",
        en: "Choose Acquisition",
        ar: "اختيار باقة Acquisition"
    },
    // Sectors / Multi-industry
    sec_badge: {
        fr: "Multi-Secteurs",
        en: "Cross-Industry",
        ar: "قطاعات متعددة"
    },
    sec_top_line: {
        fr: "Au-delà de l'assurance",
        en: "Beyond Insurance",
        ar: "إلى جانب قطاع التأمين"
    },
    sec_title: {
        fr: "Nous accompagnons<br>également",
        en: "We Also Scale<br>Other Key Sectors",
        ar: "نواكب ونطور<br>قطاعات رئيسية أخرى"
    },
    sec_bottom_line: {
        fr: "d'autres secteurs clés",
        en: "to drive sustainable digital growth",
        ar: "لتعزيز نموها الرقمي"
    },
    sec_p: {
        fr: "Notre expertise s'étend à d'autres secteurs clés pour propulser leur croissance digitale.",
        en: "Our customer acquisition expertise expands to other key industries to drive digital scale.",
        ar: "خبرتنا في استقطاب العملاء تمتد إلى قطاعات حيوية أخرى لمضاعفة مبيعاتها الرقمية."
    },
    sec_cta_btn: {
        fr: "Je demande un devis <i class=\"fas fa-arrow-right\"></i>",
        en: "Request a quote <i class=\"fas fa-arrow-right\"></i>",
        ar: "أطلب عرض سعر <i class=\"fas fa-arrow-right\"></i>"
    },
    sec_immobilier_title: {
        fr: "Immobilier",
        en: "Real Estate",
        ar: "العقارات"
    },
    sec_immobilier_p: {
        fr: "Acquisition de leads qualifiés pour les promoteurs et agents immobiliers.",
        en: "High-intent lead acquisition for developers and real estate brokers.",
        ar: "استقطاب مشترين ومستثمرين مؤهلين للمنعشين العقاريين والوكالات."
    },
    sec_restauration_title: {
        fr: "Restauration",
        en: "Hospitality & Dining",
        ar: "المطاعم والضيافة"
    },
    sec_restauration_p: {
        fr: "Système de réservation en ligne et visibilité locale accrue pour restaurants premium.",
        en: "Direct table reservation funnels and local dominance for premium dining.",
        ar: "أنظمة حجز طاولات إلكترونية وريادة الظهور المحلي للمطاعم المتميزة."
    },
    sec_sante_title: {
        fr: "Santé & Cliniques",
        en: "Healthcare & Clinics",
        ar: "الصحة والعيادات"
    },
    sec_sante_p: {
        fr: "Solutions d'acquisition de patients et de prise de rendez-vous pour cliniques.",
        en: "Qualified patient acquisition and automated booking for specialized clinics.",
        ar: "حلول حجز المواعيد واستقطاب المرضى للعيادات والمراكز الطبية."
    },
    sec_auto_title: {
        fr: "Automobile",
        en: "Automotive",
        ar: "قطاع السيارات"
    },
    sec_auto_p: {
        fr: "Génération de leads qualifiés pour concessionnaires, garages et services auto.",
        en: "Qualified buyer generation for dealerships, garages, and auto services.",
        ar: "توليد طلبات شراء واستفسارات مؤكدة لوكلاء وتجار السيارات ومراكز الصيانة."
    },
    // Case Study
    case_badge: {
        fr: "Preuve & Résultats Réels",
        en: "Proven Client Results",
        ar: "نتائج حقيقية موثقة"
    },
    case_title: {
        fr: "Étude de Cas : <span class=\"neon\">Assurances El Omrani.</span>",
        en: "Case Study: <span class=\"neon\">El Omrani Insurance.</span>",
        ar: "دراسة حالة: <span class=\"neon\">مؤسسة العمراني للتأمين.</span>"
    },
    case_p: {
        fr: "Comment un courtier d'assurance à Casablanca a structuré un flux prévisible de demandes de devis qualifiées chaque mois.",
        en: "How an insurance brokerage in Casablanca built a predictable monthly pipeline of qualified policy leads.",
        ar: "كيف استطاع وسيط تأمين بالدار البيضاء بناء تدفق مستمر للعملاء وطلبات التسعير كل شهر."
    },
    case_tag: {
        fr: "Cabinet d'Assurance • Casablanca",
        en: "Insurance Brokerage • Casablanca",
        ar: "مكتب تأمين • الدار البيضاء"
    },
    case_heading: {
        fr: "Passage d'un modèle passif à un moteur d'acquisition actif",
        en: "Transitioning from Passive Walk-ins to an Active Acquisition Engine",
        ar: "الانتقال من الانتظار التقليدي إلى محرك استقطاب نشط ومؤتمت"
    },
    case_challenge_title: {
        fr: "Le Défi Initial",
        en: "The Initial Challenge",
        ar: "التحدي السابق"
    },
    case_challenge_p: {
        fr: "Dépendance au passage piéton et au bouche-à-oreille local, avec une forte concurrence sur la zone de Casablanca. Aucun canal digital pour capter les automobilistes et professionnels au moment exact de leur recherche d'assurance.",
        en: "Over-reliance on local foot traffic and word-of-mouth amid aggressive competition in Casablanca. No digital infrastructure to capture motorists and businesses at the precise moment of intent.",
        ar: "الاعتماد الكامل على مرور المارة والتوصيات التقليدية وسط منافسة شرسة في الدار البيضاء، مع غياب منظومة رقمية لجذب السائقين والشركات عند رغبتهم في تجديد أو شراء التأمين."
    },
    case_solution_title: {
        fr: "La Solution ASSURLEAD",
        en: "The ASSURLEAD Solution",
        ar: "حل ASSURLEAD"
    },
    case_solution_p: {
        fr: "Déploiement d'un tunnel Google Search ultra-ciblé sur l'assurance auto & santé pro, landing page avec formulaire de tarification express en 2 minutes, et routage instantané des leads vers les conseillers via WhatsApp.",
        en: "Deployment of a high-intent Google Search funnel for auto & corporate health, 2-minute express quote landing pages, and instant WhatsApp lead routing to agency advisors.",
        ar: "إطلاق حملات بحث غوغل مستهدفة للسيارات والتغطية الصحية، صفحات هبوط بتسعير سريع في دقيقتين، وتوجيه فوري للعملاء نحو المستشارين عبر الواتساب."
    },
    case_s1: {
        fr: "Demandes de devis / mois",
        en: "Quote requests / month",
        ar: "طلب تسعيرة شهرياً"
    },
    case_s2: {
        fr: "Coût moyen par lead",
        en: "Average cost per lead",
        ar: "متوسط تكلفة العميل"
    },
    case_s3: {
        fr: "Contrats signés / mois",
        en: "Signed policies / month",
        ar: "عقد موقع شهرياً"
    },
    case_s4: {
        fr: "Temps de rappel moyen",
        en: "Average callback time",
        ar: "متوسط زمن إعادة الاتصال"
    },
    // Contact & Exclusivity
    contact_badge: {
        fr: "AUDIT STRATÉGIQUE OFFERT",
        en: "FREE STRATEGIC AUDIT",
        ar: "تدقيق استراتيجي مجاني"
    },
    contact_top_line: {
        fr: "Analysons votre",
        en: "Let's Analyze Your",
        ar: "دعنا نحلل"
    },
    contact_title: {
        fr: "Zone Commerciale.",
        en: "Commercial Territory.",
        ar: "منطقتك التجارية."
    },
    contact_bottom_line: {
        fr: "et votre potentiel de leads",
        en: "and your lead growth potential",
        ar: "وفرص استقطاب العقود"
    },
    contact_city_hint: {
        fr: "Cliquez sur votre ville pour échanger directement sur WhatsApp",
        en: "Click on your city to connect directly on WhatsApp",
        ar: "اضغط على مدينتك للتواصل الفوري معنا عبر واتساب"
    },
    contact_p: {
        fr: "Réservez votre audit d'acquisition de 15 minutes. Nous analysons les volumes de recherche d'assurance dans votre ville et vous présentons le potentiel de leads mensuel.",
        en: "Book your 15-minute acquisition audit. We examine local insurance search volumes in your city and map out your monthly lead pipeline.",
        ar: "احجز جلسة تدقيق مدتها 15 دقيقة لتحليل حجم البحث عن التأمين في مدينتك وتقدير عدد العقود الممكن استقطابها شهرياً."
    },
    contact_cta_btn: {
        fr: "Je demande mon audit <i class=\"fas fa-arrow-down\"></i>",
        en: "Claim My Free Audit <i class=\"fas fa-arrow-down\"></i>",
        ar: "أطلب تدقيقي المجاني <i class=\"fas fa-arrow-down\"></i>"
    },
    contact_excl_title: {
        fr: "Exclusivité Territoriale Garantie",
        en: "Guaranteed Territorial Exclusivity",
        ar: "حصرية جغرافية مضمونة"
    },
    contact_exclusivity: {
        fr: "Afin de garantir la performance de nos campagnes et d'éviter tout conflit d'intérêts, nous limitons strictement le nombre d'agences partenaires par zone géographique.",
        en: "To guarantee campaign performance and avoid conflicts of interest, we strictly limit partner agency intake per geographical area.",
        ar: "لضمان أقصى أداء للحملات ومنع أي تضارب للمصالح، نلتزم بحصر عدد محدود جداً من الوكالات الشريكة في كل منطقة جغرافية."
    },
    contact_email_label: {
        fr: "Email Dédié",
        en: "Dedicated Email",
        ar: "البريد الإلكتروني"
    },
    contact_phone_label: {
        fr: "Ligne Directe WhatsApp",
        en: "Direct WhatsApp Line",
        ar: "خط الواتساب المباشر"
    },
    // Form Questionnaire
    form_identity_label: {
        fr: "VOTRE IDENTITÉ",
        en: "YOUR IDENTITY",
        ar: "الاسم والنسب"
    },
    form_identity_placeholder: {
        fr: "VOTRE NOM ET PRÉNOM",
        en: "YOUR FULL NAME",
        ar: "اكتب اسمك الكامل هنا"
    },
    form_btn_next: {
        fr: "SUIVANT <i class=\"fas fa-chevron-right\"></i>",
        en: "NEXT <i class=\"fas fa-chevron-right\"></i>",
        ar: "التالي <i class=\"fas fa-chevron-right\"></i>"
    },
    form_contact_label: {
        fr: "COORDONNÉES PROFESSIONNELLES",
        en: "PROFESSIONAL CONTACT",
        ar: "بيانات التواصل المهنية"
    },
    form_contact_placeholder: {
        fr: "EMAIL PROFESSIONNEL",
        en: "BUSINESS EMAIL",
        ar: "البريد الإلكتروني المهني"
    },
    form_phone_placeholder: {
        fr: "NUMÉRO WHATSAPP / MOBILE",
        en: "WHATSAPP / MOBILE NUMBER",
        ar: "رقم الواتساب أو الهاتف"
    },
    form_btn_back: {
        fr: "RETOUR",
        en: "BACK",
        ar: "رجوع"
    },
    form_agency_label: {
        fr: "VOTRE AGENCE / VILLE",
        en: "YOUR AGENCY / CITY",
        ar: "اسم الوكالة والمدينة"
    },
    form_agency_placeholder: {
        fr: "NOM DU CABINET & VILLE (Ex: AXA Casablanca)",
        en: "AGENCY NAME & CITY (e.g. AXA Casablanca)",
        ar: "اسم المكتب أو الوكالة والمدينة (مثال: أكسا الدار البيضاء)"
    },
    form_goal_label: {
        fr: "OBJECTIF COMMERCIAL",
        en: "COMMERCIAL GOAL",
        ar: "الهدف التجاري والمنتجات"
    },
    form_goal_placeholder: {
        fr: "Produits ciblés (Auto, Santé, Entreprise) et objectifs de contrats mensuels...",
        en: "Target insurance lines (Auto, Health, Commercial) and monthly contract targets...",
        ar: "المنتجات المستهدفة (سيارات، صحة، شركات) وعدد العقود الشهرية المرجوة..."
    },
    form_btn_submit: {
        fr: "DEMANDER MON AUDIT <i class=\"fas fa-bolt\"></i>",
        en: "REQUEST MY AUDIT <i class=\"fas fa-bolt\"></i>",
        ar: "طلب التدقيق المجاني <i class=\"fas fa-bolt\"></i>"
    },
    // Footer
    footer_seo_title: {
        fr: "Expertise Digitale & Référencement au Maroc",
        en: "Digital Expertise & SEO in Morocco",
        ar: "الخبرة الرقمية وتحسين محركات البحث في المغرب"
    },
    seo_tag_casa: {
        fr: "Création site internet Casablanca",
        en: "Website Design Casablanca",
        ar: "إنشاء مواقع إلكترونية الدار البيضاء"
    },
    seo_tag_rabat: {
        fr: "Création site internet Rabat",
        en: "Website Design Rabat",
        ar: "إنشاء مواقع إلكترونية الرباط"
    },
    seo_tag_kech: {
        fr: "Création site internet Marrakech",
        en: "Website Design Marrakech",
        ar: "إنشاء مواقع إلكترونية مراكش"
    },
    seo_tag_tanger: {
        fr: "Création site internet Tanger",
        en: "Website Design Tangier",
        ar: "إنشاء مواقع إلكترونية طنجة"
    },
    seo_tag_agence: {
        fr: "Agence web Maroc",
        en: "Web Agency Morocco",
        ar: "وكالة ويب المغرب"
    },
    seo_tag_seo: {
        fr: "Référencement SEO Casablanca",
        en: "SEO Optimization Casablanca",
        ar: "تحسين محركات البحث سيو الدار البيضاء"
    },
    seo_tag_assur: {
        fr: "Création site internet agence assurance Maroc",
        en: "Insurance Agency Website Morocco",
        ar: "إنشاء مواقع لوكالات التأمين بالمغرب"
    },
    seo_tag_leads: {
        fr: "Génération de leads assurance Maroc",
        en: "Insurance Lead Generation Morocco",
        ar: "توليد عملاء محتملين للتأمين بالمغرب"
    },
    footer_copy: {
        fr: "ASSURLEAD - Création de sites internet et génération de leads au Maroc 🇲🇦",
        en: "ASSURLEAD - Website Creation & Lead Generation in Morocco 🇲🇦",
        ar: "ASSURLEAD - إنشاء المواقع الإلكترونية وتوليد العملاء المحتملين في المغرب 🇲🇦"
    },
    // Modal
    modal_badge: {
        fr: "Audit Stratégique d'Acquisition",
        en: "Strategic Acquisition Audit",
        ar: "تدقيق استراتيجي للاستقطاب"
    },
    modal_title: {
        fr: "Multipliez vos Devis <span class=\"neon\">grâce au SEO local.</span>",
        en: "Multiply Your Quotes <span class=\"neon\">With Local SEO.</span>",
        ar: "ضاعف عروض أسعارك <span class=\"neon\">بفضل السيو المحلي.</span>"
    },
    modal_p: {
        fr: "Réservez votre <strong>audit de visibilité Google gratuit</strong> pour découvrir le volume de recherches de prospects dans votre ville et déployer votre moteur d'acquisition organique.",
        en: "Book your <strong>free Google visibility audit</strong> to discover the exact search volume of prospects in your city and launch your organic acquisition engine.",
        ar: "احجز <strong>تدقيقك المجاني للظهور في غوغل</strong> لاكتشاف حجم طلبات العملاء في مدينتك وبناء محرك استقطاب عضوي متكامل."
    },
    modal_btn: {
        fr: "Réservez mon Audit Gratuit",
        en: "Book My Free Audit",
        ar: "حجز التدقيق المجاني الآن"
    },
    modal_timer: {
        fr: "Audit gratuit de 15 minutes, sur rendez-vous",
        en: "Free 15-minute audit, by appointment",
        ar: "تدقيق مجاني لمدة 15 دقيقة، بموعد مسبق"
    },
    // Chat & WhatsApp Widget
    chat_badge: {
        fr: "WhatsApp",
        en: "WhatsApp",
        ar: "واتساب"
    },
    // FAQ Section
    faq_badge: {
        fr: "FAQ Spécialisée",
        en: "Specialized FAQ",
        ar: "الأسئلة الشائعة"
    },
    faq_title: {
        fr: "Questions <span class=\"neon\">Fréquentes.</span>",
        en: "Frequently Asked <span class=\"neon\">Questions.</span>",
        ar: "الأسئلة <span class=\"neon\">الشائعة.</span>"
    },
    faq_p: {
        fr: "Tout ce que vous devez savoir sur notre système d'acquisition et nos engagements de performance.",
        en: "Everything you need to know about our specialized acquisition framework and performance commitments.",
        ar: "كل ما تحتاج معرفته عن نظام الاستقطاب وضمانات الأداء الخاصة بنا."
    },
    faq_q1: {
        fr: "Quelle est la différence entre ASSURLEAD et une agence web généraliste ?",
        en: "What is the difference between ASSURLEAD and a generic web agency?",
        ar: "ما هو الفرق بين ASSURLEAD ووكالة ويب عامة؟"
    },
    faq_a1: {
        fr: "Une agence généraliste vous vend des clics ou une maquette de site web sans se soucier des contrats signés. ASSURLEAD est 100% spécialisée dans l'assurance au Maroc : nous concevons les tunnels, qualifions les prospects, installons le CRM et optimisons le système jusqu'à la signature de la police d'assurance.",
        en: "A generic agency sells traffic or static templates with no regard for signed policies. ASSURLEAD is 100% dedicated to Moroccan insurance: we engineer funnels, qualify prospects, deploy CRMs, and optimize the entire path to signed contracts.",
        ar: "الوكالات العامة تبيعك مجرد نقرات أو تصاميم دون اهتمام بالعقود الموقعة. أما ASSURLEAD فمتخصصة 100% في قطاع التأمين بالمغرب: نصمم أقماع التحويل، نؤهل العملاء، نربط CRM ونحسن التكلفة حتى توقيع العقد النهائي."
    },
    faq_q2: {
        fr: "Qu'est-ce qu'un lead qualifié selon votre charte ?",
        en: "What defines a verified qualified lead?",
        ar: "ما هو تعريف العميل المؤهل (Lead Qualifié) لديكم؟"
    },
    faq_a2: {
        fr: "Un lead qualifié est un prospect ayant formulé une demande explicite (type de véhicule, date d'échéance ou besoin santé/pro), avec un numéro de téléphone marocain vérifié et situé dans votre zone géographique cible. Les faux numéros ou doublons sont automatiquement écartés.",
        en: "A qualified lead is a prospect who submitted an explicit request (vehicle details, renewal date, health/pro coverage), with a verified phone number located in your target territory.",
        ar: "العميل المؤهل هو شخص قدم طلباً صريحاً لتسعيرة (نوع المركبة، تاريخ التجديد، أو التغطية الصحية)، مع رقم هاتف مغربي مؤكد وضمن منطقتك الجغرافية المستهدفة."
    },
    faq_q3: {
        fr: "Les prospects générés sont-ils exclusifs à mon agence ?",
        en: "Are the generated leads strictly exclusive to my agency?",
        ar: "هل العملاء المتولدون حصريون لوكالتي فقط؟"
    },
    faq_a3: {
        fr: "Oui, à 100%. Contrairement aux plateformes de comparateurs qui revendent le même prospect à 4 ou 5 assureurs simultanément, chaque prospect généré par votre tunnel est strictement exclusif à votre agence et transmis directement à votre équipe.",
        en: "Yes, 100%. Unlike comparison platforms that resell the same prospect to 4 or 5 competitors, each lead generated by your funnel is completely exclusive to your agency.",
        ar: "نعم، 100%. على عكس منصات المقارنة التي تعيد بيع نفس الزبون لعدة شركات في نفس الوقت، كل عميل يطلبه قمعك هو حصري تماماً لوكالتك ويصل مباشرة إلى فريقك."
    },
    faq_q4: {
        fr: "Quel budget publicitaire mensuel minimum faut-il prévoir ?",
        en: "What minimum monthly advertising budget should be anticipated?",
        ar: "ما هي الميزانية الإعلانية الشهرية المقترحة للبداية؟"
    },
    faq_a4: {
        fr: "Nous recommandons un budget média de départ compris entre 2 000 et 4 000 DH par mois pour Google et Meta Ads. Ce budget est payé directement aux plateformes publicitaires et permet de générer entre 60 et 120 demandes de devis selon votre ville et le mix de produits ciblés.",
        en: "We recommend an initial monthly media spend between 2,000 and 4,000 MAD for Google and Meta Ads. This is paid directly to ad platforms and yields 60 to 120 qualified quote requests depending on the city and product mix.",
        ar: "نقترح ميزانية إعلانية أولية تتراوح بين 2,000 و 4,000 درهم شهرياً لإعلانات غوغل وميتا، وتدفع مباشرة للمنصات وتتيح استقطاب ما بين 60 إلى 120 طلب تسعيرة شهرياً."
    },
    faq_q5: {
        fr: "Pourquoi la création d'un site web à Casablanca nécessite-t-elle une approche SEO spécifique au Maroc ?",
        en: "Why does website creation in Casablanca require a Morocco-specific SEO strategy?",
        ar: "لماذا يتطلب إنشاء موقع إلكتروني بالدار البيضاء استراتيجية سيو خاصة بالمغرب؟"
    },
    faq_a5: {
        fr: "À Casablanca et au Maroc, plus de 85% des recherches s'effectuent sur smartphone, avec une attente d'interaction immédiate par WhatsApp ou téléphone. Un site web performant à Casablanca doit allier un chargement ultra-rapide (< 1s), un balisage Google Maps local (Maârif, Anfa, Sidi Maârouf, etc.) et des tunnels de conversion adaptés aux habitudes d'achat marocaines.",
        en: "In Casablanca and Morocco, over 85% of searches occur on smartphones, with an expectation of instant contact via WhatsApp or phone. A top-performing site in Casablanca requires lightning-fast loading (< 1s), local Google Maps markup, and conversion funnels tuned for Moroccan buying habits.",
        ar: "في الدار البيضاء والمغرب، أكثر من 85% من عمليات البحث تتم عبر الهواتف الذكية مع رغبة في التواصل الفوري عبر واتساب أو الهاتف. نجاح الموقع يتطلب سرعة خارقة (أقل من ثانية)، تهيئة جغرافية دقيقة في خرائط غوغل وتصميماً مخصصاً لسلوك المستهلك المغربي."
    },
    // Processus Funnel Translations
    proc_hero_badge: {
        fr: "PIPELINE COMMERCIAL & OPÉRATIONNEL",
        en: "COMMERCIAL & OPERATIONAL PIPELINE",
        ar: "مسار الاستقطاب التجاري والعملياتي"
    },
    proc_hero_title: {
        fr: "Le Tunnel Commercial en 9 Étapes <span class=\"neon\">d'AssurLead.</span>",
        en: "The 9-Step Acquisition Funnel <span class=\"neon\">by AssurLead.</span>",
        ar: "قمع الاستقطاب التجاري في 9 خطوات <span class=\"neon\">من أسورليد.</span>"
    },
    proc_hero_desc: {
        fr: "Prospection → Audit gratuit → Appel WhatsApp/téléphone → Proposition → 50 % d'acompte → Production → Mise en ligne → SEO → Abonnement mensuel.<br>Le modèle éprouvé qui transforme l'acquisition de courtiers d'assurance en système prévisible et pérenne.",
        en: "Prospecting → Free Audit → WhatsApp/Phone Call → Proposal → 50% Deposit → Production → Launch → SEO → Monthly Retainer.<br>The proven blueprint turning insurance broker acquisition into a predictable asset.",
        ar: "التنقيب ← التدقيق المجاني ← مكالمة واتساب/هاتف ← العرض التجاري ← دفعة 50% ← الإنتاج البرمجي ← الإطلاق ← السيو ← المتابعة الشهرية.<br>النموذج المجرب الذي يحول استقطاب العملاء إلى نظام متوقع ومستمر."
    },
    funnel_phase1_badge: {
        fr: "PHASE 1 : AMORÇAGE & QUALIFICATION",
        en: "PHASE 1: PRIMING & QUALIFICATION",
        ar: "المرحلة 1: الانطلاق والتأهيل"
    },
    funnel_phase2_badge: {
        fr: "PHASE 2 : ENGAGEMENT & PRODUCTION",
        en: "PHASE 2: COMMITMENT & PRODUCTION",
        ar: "المرحلة 2: الالتزام والإنتاج"
    },
    funnel_phase3_badge: {
        fr: "PHASE 3 : RÉSULTATS & PÉRENNITÉ",
        en: "PHASE 3: RESULTS & LONGEVITY",
        ar: "المرحلة 3: النتائج والاستمرارية"
    },
    funnel_s1_name: { fr: "Prospection", en: "Prospecting", ar: "التنقيب" },
    funnel_s1_tag: { fr: "Étape 01", en: "Step 01", ar: "الخطوة 01" },
    funnel_s1_title: { fr: "Prise de Contact Directe", en: "Direct Contact", ar: "التواصل المباشر" },
    funnel_s1_desc: { fr: "Identification des courtiers et agents généraux mal positionnés sur Google au Maroc.", en: "Identification of brokers and general agents poorly positioned on Google in Morocco.", ar: "تحديد الوسطاء والوكلاء العامين ذوي التموضع الضعيف على غوغل في المغرب." },
    funnel_s2_name: { fr: "Audit Gratuit", en: "Free Audit", ar: "تدقيق مجاني" },
    funnel_s2_tag: { fr: "Étape 02", en: "Step 02", ar: "الخطوة 02" },
    funnel_s2_title: { fr: "Audit de Visibilité 15 Min", en: "15-Min Visibility Audit", ar: "تدقيق الرؤية 15 دقيقة" },
    funnel_s2_desc: { fr: "Analyse en direct de votre positionnement, de vos concurrents locaux et des requêtes perdues.", en: "Live analysis of your ranking, local competitors, and lost search opportunities.", ar: "تحليل مباشر لموقعك ومنافسيك والفرص الضائعة في منطقتك." },
    funnel_s3_name: { fr: "Appel WhatsApp / Tél", en: "WhatsApp / Phone Call", ar: "مكالمة واتساب / هاتف" },
    funnel_s3_tag: { fr: "Étape 03", en: "Step 03", ar: "الخطوة 03" },
    funnel_s3_title: { fr: "Échange Stratégique", en: "Strategic Alignment", ar: "التبادل الاستراتيجي" },
    funnel_s3_desc: { fr: "Diagnostic des objectifs commerciaux, des branches cibles (auto, santé, pro) et du territoire.", en: "Assessment of commercial targets, key insurance lines (auto, health, pro), and territory.", ar: "تشخيص الأهداف التجارية والفروع المستهدفة ونطاق التغطية." },
    funnel_s4_name: { fr: "Proposition", en: "Proposal", ar: "العرض التجاري" },
    funnel_s4_tag: { fr: "Étape 04", en: "Step 04", ar: "الخطوة 04" },
    funnel_s4_title: { fr: "Offre Chiffrée & Clé en Main", en: "Turnkey Fixed Quote", ar: "عرض مفصل وشامل" },
    funnel_s4_desc: { fr: "Présentation de la formule adaptée (Starter, Growth, Lead Engine) sans frais cachés.", en: "Presentation of the best suited plan (Starter, Growth, Lead Engine) with no hidden fees.", ar: "تقديم الباقة المناسبة (Starter، Growth، Lead Engine) بكل شفافية." },
    funnel_s5_name: { fr: "50% Acompte", en: "50% Deposit", ar: "دفعة 50%" },
    funnel_s5_tag: { fr: "Étape 05", en: "Step 05", ar: "الخطوة 05" },
    funnel_s5_title: { fr: "Validation & Démarrage", en: "Validation & Kickoff", ar: "التأكيد والانطلاق" },
    funnel_s5_desc: { fr: "Sécurisation du créneau, signature du contrat d'engagement et versement de l'acompte.", en: "Slot reservation, mutual commitment agreement, and initiation deposit.", ar: "تثبيت الموعد وتوقيع العقد ودفع الدفعة الأولى للانطلاق." },
    funnel_s6_name: { fr: "Production", en: "Production", ar: "الإنتاج" },
    funnel_s6_tag: { fr: "Étape 06", en: "Step 06", ar: "الخطوة 06" },
    funnel_s6_title: { fr: "Développement & Rédaction", en: "Development & Copywriting", ar: "التطوير البرمجي والتحرير" },
    funnel_s6_desc: { fr: "Design responsive sur-mesure, rédaction persuasive orientée conversion et configuration technique.", en: "Custom responsive design, conversion copywriting, and technical setup.", ar: "تصميم متجاوب عصري، صياغة محتوى موجه للتحويل وتهيئة تقنية." },
    funnel_s7_name: { fr: "Mise en Ligne", en: "Deployment", ar: "الإطلاق" },
    funnel_s7_tag: { fr: "Étape 07", en: "Step 07", ar: "الخطوة 07" },
    funnel_s7_title: { fr: "Déploiement en 10-14 Jours", en: "Deployment in 10-14 Days", ar: "الإطلاق في 10-14 يوماً" },
    funnel_s7_desc: { fr: "Mise en production sur hébergement ultra-rapide avec domaine .ma ou .com et SSL actif.", en: "Live deployment on high-speed servers with .ma/.com domain and active SSL.", ar: "النشر على استضافة سريعة ونطاق .ma أو .com وتفعيل شهادة الأمان SSL." },
    funnel_s8_name: { fr: "SEO", en: "Local SEO", ar: "السيو المحلي" },
    funnel_s8_tag: { fr: "Étape 08", en: "Step 08", ar: "الخطوة 08" },
    funnel_s8_title: { fr: "Indexation & Google Business", en: "Indexing & Google Maps", ar: "الفهرسة وخرائط غوغل" },
    funnel_s8_desc: { fr: "Indexation 1ère page, balisage Schema.org LocalBusiness et optimisation de la fiche Maps.", en: "1st page indexing, Schema.org LocalBusiness markup, and Google Maps profile tuning.", ar: "الفهرسة في الصفحة الأولى وتهيئة بيانات Schema.org وحساب Google Maps." },
    funnel_s9_name: { fr: "Abonnement", en: "Maintenance", ar: "المتابعة الشهرية" },
    funnel_s9_tag: { fr: "Étape 09", en: "Step 09", ar: "الخطوة 09" },
    funnel_s9_title: { fr: "Suivi & Croissance Continue", en: "Continuous Growth & Monitoring", ar: "المتابعة والنمو المستمر" },
    funnel_s9_desc: { fr: "Maintenance technique, optimisation continue des conversions et assistance WhatsApp 7j/7.", en: "Technical maintenance, continuous CRO, and 7/7 priority WhatsApp support.", ar: "صيانة تقنية، تحسين مستمر لمعدلات التحويل ودعم واتساب 7 أيام في الأسبوع." },
    funnel_cta_title: {
        fr: "Prêt à enclencher le tunnel pour votre agence ?",
        en: "Ready to launch the acquisition funnel for your agency?",
        ar: "هل أنت مستعد لتفعيل مسار الاستقطاب لوكالتك؟"
    },
    funnel_cta_desc: {
        fr: "Démarrez par votre audit gratuit de 15 minutes pour vérifier le potentiel de votre zone géographique.",
        en: "Start with your free 15-minute audit to evaluate the potential of your local territory.",
        ar: "ابدأ بتدقيق مجاني لمدة 15 دقيقة للتحقق من إمكانات منطقتك الجغرافية."
    },
    funnel_cta_btn: {
        fr: "Réserver mon Audit Gratuit",
        en: "Book My Free Audit",
        ar: "حجز تدقيقي المجاني الآن"
    },
    projets_card_google_badge: {
        fr: "Positionnement Google",
        en: "Google Ranking",
        ar: "الترتيب على غوغل"
    }
};

// --- DYNAMIC TICKER MAP ---
const tickerTranslations = {
    title: {
        fr: "Nouveau Lead Qualifié",
        en: "New Verified Lead",
        ar: "عميل مؤكد جديد"
    },
    action: {
        fr: "vient de demander un devis",
        en: "just requested tag quote in",
        ar: "طلب للتو تسعيرة لتأمين"
    },
    products: {
        "Auto": { fr: "Auto", en: "Auto", ar: "السيارات" },
        "Santé": { fr: "Santé", en: "Health", ar: "الصحة" },
        "Habitation": { fr: "Habitation", en: "Home", ar: "السكن" },
        "Retraite": { fr: "Retraite", en: "Retirement", ar: "التقاعد" }
    },
    cities: {
        "Casablanca": { fr: "Casablanca", en: "Casablanca", ar: "الدار البيضاء" },
        "Rabat": { fr: "Rabat", en: "Rabat", ar: "الرباط" },
        "Marrakech": { fr: "Marrakech", en: "Marrakech", ar: "مراكش" },
        "Tanger": { fr: "Tanger", en: "Tangier", ar: "طنجة" },
        "Tangier": { fr: "Tanger", en: "Tangier", ar: "طنجة" },
        "Agadir": { fr: "Agadir", en: "Agadir", ar: "أكادير" }
    }
};

// --- CHATBOT WELLCOMES ---
const chatWelcomeMessages = {
    fr: "Bonjour ! Je suis Yacine, votre assistant IA. Comment puis-je vous aider à faire croître votre agence aujourd'hui ?",
    en: "Hello! I am Yacine, your digital strategic partner. How can I help maximize your incoming lead pipelines today?",
    ar: "مرحباً بك! أنا ياسين، مساعدك الذكي المخصص لشركاء التأمين. كيف يمكنني مساعدتك في مضاعفة مبيعاتك واستقطاب عملاء جدد اليوم؟"
};

const formSubmitAlert = {
    fr: "Merci ! Votre demande a été envoyée. Notre équipe vous recontactera sous 24h.",
    en: "Thank you! Your growth request has been securely logged. Our territory team will connect with you within 24 hours.",
    ar: "شكراً لك! تم تسجيل طلبك بنجاح. سيقوم فريقنا بموافاة حسابك والتواصل معك خلال الـ 24 ساعة القادمة."
};

const systemInstructions = {
    fr: `Tu es Yacine, l'assistant IA expert de l'agence d'acquisition digitale "AssurLead" au Maroc, spécialisée exclusivement dans l'assurance (courtiers, agents généraux).
    Ton persona : Empathique, Expert, Proactif, orienté résultats (coût par contrat signé).
    Ta mission : Aider les professionnels de l'assurance au Maroc à déployer leur système d'acquisition (Google Ads, Meta Ads, landing pages, qualification CRM WhatsApp).
    Nos offres :
    - STARTER (2 900 à 4 900 DH) : Landing page haute conversion + formulaire 2min + GA4/Pixel + bouton WhatsApp.
    - GROWTH (15 000 à 25 000 DH) : Système complet clé en main + Google Ads Search + Meta Ads + CRM alertes <60s + WhatsApp auto + Garantie 5 leads qualifiés min le 1er mois.
    - SCALE (4 000 à 8 000 DH/mois) : Pilotage et optimisation continue des campagnes + A/B testing + reporting bimensuel.
    Ta règle d'or : Sois précis, professionnel, et encourage la réservation de l'audit gratuit territorial de 15 minutes ou l'essai du simulateur ROI.
    Réponds en français de manière fluide, chaleureuse et professionnelle.`,
    en: `You are Yacine, the elite AI acquisition advisor at "AssurLead" in Morocco, specialized exclusively in insurance customer acquisition (brokers, agents).
    Your persona: Empathetic, highly expert, proactive, and focused on signed contract ROI.
    Our packages:
    - STARTER (2,900 to 4,900 MAD): High-converting landing page + 2-min quote form + GA4/Meta Pixel + WhatsApp CTA.
    - GROWTH (15,000 to 25,000 MAD): Turnkey acquisition system + Google Ads Search + Meta Ads + CRM alerts <60s + automated WhatsApp + 5 guaranteed leads min in Month 1.
    - SCALE (4,000 to 8,000 MAD/month): Continuous campaign management, A/B testing & CAC reduction.
    Always reply clearly, elegantly, and fluently in English.`,
    ar: `أنت ياسين، المستشار والمساعد الذكي الخبير لوكالة "AssurLead" المتخصصة حصرياً في استقطاب عملاء التأمين بالمغرب (وسطاء، وكلاء عامون).
    شخصيتك: ودود، خبير، استباقي ومهني يركز على تكلفة العقد النهائي الموقع.
    باقاتنا الرئيسية:
    - باقة STARTER (من 2,900 إلى 4,900 درهم): صفحة هبوط عالية التحويل + استمارة تسعير سريعة + تتبع Pixel + زر واتساب.
    - باقة GROWTH (من 15,000 إلى 25,000 درهم): نظام استقطاب متكامل + إعلانات غوغل وميتا + نظام CRM بإشعارات أقل من دقيقة + أتمتة الواتساب + ضمان 5 عملاء مؤهلين كحد أدنى.
    - باقة SCALE (من 4,000 إلى 8,000 درهم شهرياً): إدارة وتحسين مستمر للحملات وخفض تكلفة العقود الموقعة.
    أجب دائماً بلغة عربية راقية ومتقنة وشجع المستخدمين على طلب التدقيق المجاني لمنطقتهم.`
};

const multiLangSuggestions = {
    fr: {
        initial: ["Comment fonctionne le système ?", "Quels sont les tarifs ?", "Étude de cas El Omrani", "Simuler mon ROI"],
        pricing: ["Pack Starter", "Pack Growth (Recommandé)", "Audit gratuit 15min"],
        projects: ["Assurances El Omrani", "Garantie 5 leads", "Comment démarrer ?"],
        roisim: ["Calculer mon volume", "Taux de conversion ?", "Coût par lead (28 DH)"]
    },
    en: {
        initial: ["How does the system work?", "What are the rates?", "El Omrani Case Study", "Calculate my ROI"],
        pricing: ["Starter Tier", "Growth Tier (Recommended)", "Free 15-min audit"],
        projects: ["El Omrani Insurance", "5 Leads Guarantee", "How to begin?"],
        roisim: ["Calculate my revenue", "Conversion rate?", "Cost per lead (28 MAD)"]
    },
    ar: {
        initial: ["كيف يعمل النظام؟", "ما هي الأسعار والباقات؟", "دراسة حالة العمراني", "حساب أرباحي"],
        pricing: ["باقة Starter", "باقة Growth (الأكثر طلباً)", "تدقيق مجاني 15 دقيقة"],
        projects: ["تأمين العمراني", "ضمان 5 عملاء", "كيف نبدأ العمل؟"],
        roisim: ["احسب عائدي المالي", "معدل التحويل؟", "تكلفة العميل (28 درهم)"]
    }
};

const botThinkingMessages = {
    fr: "Yacine réfléchit...",
    en: "Yacine is thinking...",
    ar: "ياسين يفكر..."
};

const fullTextDictionary = {
  ", appel 1-clic et formulaire de qualification rapide en 3 champs.": {
    "en": ", 1-click call and fast 3-field qualification form.",
    "ar": "، واتصال بنقرة واحدة ونموذج تأهيل سريع من 3 حقول."
  },
  ", score Core Web Vitals vert, navigation mobile ultra-fluide.": {
    "en": ", green Core Web Vitals score, ultra-smooth mobile navigation.",
    "ar": "، تقييم أخضر في Core Web Vitals، وتصفح سلس للغاية على الهواتف."
  },
  "01 / AUDIT & SÉMANTIQUE": {
    "en": "01 / AUDIT & KEYWORD RESEARCH",
    "ar": "01 / التدقيق والكلمات المفتاحية"
  },
  "02 / ARCHITECTURE WEB": {
    "en": "02 / WEB ARCHITECTURE",
    "ar": "02 / هندسة وتصميم الموقع"
  },
  "03 / SEO ORGANIQUE": {
    "en": "03 / ORGANIC GOOGLE SEO",
    "ar": "03 / تحسين محركات البحث العضوي"
  },
  "04 / CONVERSION DIRECTE": {
    "en": "04 / DIRECT CONVERSION",
    "ar": "04 / التحويل المباشر للزبائن"
  },
  "1. Audit & Cadrage": {
    "en": "1. Audit & Scoping",
    "ar": "1. التدقيق والتأطير"
  },
  "1. Diagnostic & Stratégie": {
    "en": "1. Diagnostic & Strategy",
    "ar": "1. التشخيص والاستراتيجية"
  },
  "10-14j": {
    "en": "10-14 days",
    "ar": "10-14 يوماً"
  },
  "2. Développement Web": {
    "en": "2. Web Development",
    "ar": "2. التطوير البرمجي والتصميم"
  },
  "2. Ingénierie & Contenus": {
    "en": "2. Engineering & Content",
    "ar": "2. الهندسة وصياغة المحتوى"
  },
  "3 projets livrés": {
    "en": "3 Projects Delivered",
    "ar": "3 مشاريع منجزة"
  },
  "3. Livraison en 10 à 14 jours": {
    "en": "3. Delivery in 10 to 14 days",
    "ar": "3. التسليم خلال 10 إلى 14 يوماً"
  },
  "3. Livraison en 10-14 jours": {
    "en": "3. Delivery in 10-14 days",
    "ar": "3. التسليم خلال 10-14 يوماً"
  },
  "4. Acquisition & Suivi": {
    "en": "4. Acquisition & Follow-up",
    "ar": "4. جلب الزبائن والمتابعة"
  },
  "4. Mise en Route & Support": {
    "en": "4. Launch & Support",
    "ar": "4. إطلاق الموقع والدعم الفني"
  },
  ": un cabinet positionné en 1ère page Google recevant des devis chaque semaine.": {
    "en": ": an agency ranked on Google's 1st page receiving qualified quotes every week.",
    "ar": ": وكالة متصدرة للصفحة الأولى على غوغل تتلقى طلبات تسعير كل أسبوع."
  },
  "< 1.2s": {
    "en": "< 1.2s",
    "ar": "< 1.2 ثانية"
  },
  "ACQUISITION ACTIVE": {
    "en": "ACTIVE ACQUISITION",
    "ar": "استقطاب نشط للعملاء"
  },
  "Acquisition 100% Organique": {
    "en": "100% Organic Acquisition",
    "ar": "استقطاب عضوي 100%"
  },
  "Actif Durable": {
    "en": "Sustainable Asset",
    "ar": "أصل رقمي مستدام"
  },
  "Actif Propriétaire": {
    "en": "Proprietary Asset",
    "ar": "أصل ملكي حصري"
  },
  "Actif commercial pérenne": {
    "en": "Long-Term Commercial Asset",
    "ar": "أصل تجاري مستدام"
  },
  "Activation des canaux WhatsApp, accompagnement à la prise en main et suivi du positionnement local sur Casablanca.": {
    "en": "Activation of WhatsApp channels, handover onboarding, and tracking of local Casablanca search rankings.",
    "ar": "تفعيل قنوات واتساب، والمرافقة في بدء الاستخدام ومتابعة التموضع المحلي بالدار البيضاء."
  },
  "Agadir": {
    "en": "Agadir",
    "ar": "أكادير"
  },
  "Agence Immobilière Maarif": {
    "en": "Maarif Real Estate Agency",
    "ar": "وكالة عقارية بالمعاريف"
  },
  "Agence Immobilière Maarif Casablanca": {
    "en": "Maarif Casablanca Real Estate Agency",
    "ar": "وكالة عقارية بالمعاريف الدار البيضاء"
  },
  "Agro-industrie & Export Primeurs": {
    "en": "Agribusiness & Fresh Produce Export",
    "ar": "الصناعات الغذائية وتصدير البواكير"
  },
  "Analyse de vos concurrents à Casablanca, sélection des mots-clés stratégiques et définition de l'arborescence de votre site web.": {
    "en": "Competitor analysis in Casablanca, strategic keyword selection, and structural tree architecture definition.",
    "ar": "تحليل المنافسين بالدار البيضاء، واختيار الكلمات المفتاحية الاستراتيجية وتحديد هيكل الموقع."
  },
  "Architecture web optimisée pour smartphone et tablette": {
    "en": "Web architecture optimized for smartphones and tablets",
    "ar": "بنية برمجية مهيأة للهواتف الذكية والأجهزة اللوحية"
  },
  "Articulez votre dispositif avec nos pages piliers de": {
    "en": "Strengthen your system with our pillar pages on",
    "ar": "عزز منظومتك الرقمية مع صفحاتنا المرجعية في"
  },
  "Artisanat d'Art & Export": {
    "en": "Artisanal Crafts & International Export",
    "ar": "الصناعة التقليدية والتصدير الدولي"
  },
  "Assistance 7j/7 au Maroc": {
    "en": "7/7 Support in Morocco",
    "ar": "دعم فني 7/7 بالمغرب"
  },
  "Assurances El Omrani": {
    "en": "El Omrani Insurance",
    "ar": "تأمينات العمراني"
  },
  "Assurances Marrakech": {
    "en": "Marrakech Insurance",
    "ar": "تأمينات مراكش"
  },
  "Audit 100% offert de 15 min": {
    "en": "100% Free 15-min Audit",
    "ar": "تدقيق مجاني 100% لمدة 15 دقيقة"
  },
  "Audit SEO Gratuit": {
    "en": "Free SEO Audit",
    "ar": "تدقيق سيو مجاني"
  },
  "Audit WhatsApp": {
    "en": "WhatsApp Audit",
    "ar": "تدقيق عبر واتساب"
  },
  "Audit de Visibilité Google": {
    "en": "Google Visibility Audit",
    "ar": "تدقيق الرؤية على غوغل"
  },
  "Audit de Visibilité Gratuit": {
    "en": "Free Visibility Audit",
    "ar": "تدقيق مجاني للرؤية الرقمية"
  },
  "Audit gratuit de 15 minutes, sur rendez-vous": {
    "en": "Free 15-minute audit, by appointment",
    "ar": "تدقيق مجاني لمدة 15 دقيقة، بموعد مسبق"
  },
  "Autorité de Marque": {
    "en": "Brand Authority",
    "ar": "سلطة وموثوقية العلامة"
  },
  "Balisage & Siloing Local": {
    "en": "Local Siloing & Structured Markup",
    "ar": "التقسيم الموضوعي والبيانات المنظمة"
  },
  "Boutiques e-commerce pour coopératives et marques de cosmétiques bio vers les marchés européens et du Golfe.": {
    "en": "E-commerce stores for cooperatives and organic cosmetic brands targeting European and Gulf markets.",
    "ar": "متاجر إلكترونية للتعاونيات وعلامات مستحضرات التجميل الطبيعية نحو الأسواق الأوروبية والخليجية."
  },
  "Boutiques en ligne et vitrines pour faire rayonner la céramique, le cuir et les arts décoratifs de Fès auprès des acheteurs internationaux.": {
    "en": "Online stores and showcases to promote Fez ceramics, leatherwork, and decorative arts to international buyers.",
    "ar": "متاجر ومواقع للتعريف بفخار وخزف وجلد وفنون فاس التقليدية أمام المشترين الدوليين."
  },
  "Bénéficiez de notre expertise en": {
    "en": "Benefit from our expertise in",
    "ar": "استفد من خبرتنا المتخصصة في"
  },
  "CORE WEB VITALS EXCELLENTS": {
    "en": "EXCELLENT CORE WEB VITALS",
    "ar": "مؤشرات CORE WEB VITALS ممتازة"
  },
  "CORE WEB VITALS OPTIMISÉS": {
    "en": "OPTIMIZED CORE WEB VITALS",
    "ar": "تحسين كامل لمؤشرات CORE WEB VITALS"
  },
  "Captez les directeurs d'achats et partenaires logistiques au moment exact de leur recherche Google.": {
    "en": "Capture procurement managers and logistics partners the exact moment they search on Google.",
    "ar": "استقطب مدراء المشتريات وشركاء الخدمات اللوجستية في لحظة بحثهم على غوغل."
  },
  "Captez les visiteurs étrangers et les acheteurs B2B au moment décisif de leur décision.": {
    "en": "Capture international travelers and B2B buyers at the crucial decision-making moment.",
    "ar": "استقطب السياح الأجانب والمشترين من الشركات في اللحظة الحاسمة لاتخاذ القرار."
  },
  "Cas Assurances El Omrani": {
    "en": "El Omrani Insurance Case Study",
    "ar": "دراسة حالة تأمينات العمراني"
  },
  "Casablanca": {
    "en": "Casablanca",
    "ar": "الدار البيضاء"
  },
  "Casablanca, Maroc": {
    "en": "Casablanca, Morocco",
    "ar": "الدار البيضاء، المغرب"
  },
  "Catalogues de prestige pour agences immobilières et gestionnaires de biens à l'Hivernage, Guéliz et dans l'arrière-pays de l'Ourika.": {
    "en": "Prestige property portfolios for real estate agencies and property managers in Hivernage, Guéliz, and the Ourika valley.",
    "ar": "كتالوجات عقارية فاخرة للوكالات العقارية ومديري الأملاك في الحي الشتوي، جليز وأوريكا."
  },
  "Catalogues immobiliers sur Malabata, Gzenaya et la baie de Tanger pour investisseurs marocains résidant à l'étranger (MRE).": {
    "en": "Real estate catalogues across Malabata, Gzenaya, and Tangier Bay for Moroccan expatriates and foreign investors.",
    "ar": "كتالوجات عقارية في مالاباطا، جزناية وخليج طنجة للمستثمرين ومغاربة العالم."
  },
  "Chaque prospect qui remplit un formulaire sur votre site s'adresse exclusivement à votre cabinet : vous négociez sans guerre de prix destructrice.": {
    "en": "Every prospect submitting a form on your website contacts your agency exclusively: close deals without destructive price wars.",
    "ar": "كل عميل يملأ النموذج يتواصل حصرياً مع وكالتك: تفاوض براحة ودون حروب أسعار مدمرة."
  },
  "Chargement instantané, zéro script superflu et respect scrupuleux des critères techniques imposés par Google.": {
    "en": "Instant loading, zero unnecessary scripts, and rigorous compliance with technical criteria set by Google.",
    "ar": "تحميل فوري، صفر أكواد زائدة، والالتزام الصارم بالمعايير التقنية التي تفرضها غوغل."
  },
  "Ciblage précis des requêtes transactionnelles B2B sur la zone Tanger-Tétouan pour positionner votre entreprise devant les sous-traitants concurrents.": {
    "en": "Pinpoint targeting of B2B transactional searches in Tangier-Tetouan to rank ahead of competing subcontractors.",
    "ar": "استهداف دقيق للبحث التجاري للشركات بمنطقة طنجة-تطوان للتفوق على المنافسين."
  },
  "Ciblez les voyageurs européens préparant leurs vacances de surf et les importateurs recherchant des coopératives d'argan certifiées.": {
    "en": "Target European travelers planning surf holidays and importers seeking certified argan oil cooperatives.",
    "ar": "استهدف السياح الأوروبيين المخططين لرحلات ركوب الأمواج والمستوردين للتعاونيات المعتمدة."
  },
  "Complétez votre impact avec notre pôle en": {
    "en": "Boost your impact with our specialized hub in",
    "ar": "ضاعف حضورك مع قطاعنا المتخصص في"
  },
  "Compression sans perte de vos visuels haute définition pour respecter les Core Web Vitals tout en sublimant le charme marrakchi.": {
    "en": "Lossless compression of HD imagery to honor Core Web Vitals while showcasing Marrakech's visual charm.",
    "ar": "ضغط عالي الدقة للصور للحفاظ على سرعة Core Web Vitals مع إبراز الجاذبية المغربية."
  },
  "Conception de l'interface responsive, rédaction des contenus orientés conversion et intégration des données structurées Schema.org.": {
    "en": "Responsive interface design, conversion-focused copywriting, and integration of structured Schema.org markup.",
    "ar": "تصميم واجهة متجاوبة، صياغة محتوى موجه للتحويل، ودمج البيانات المنظمة Schema.org."
  },
  "Conception de l'interface responsive, rédaction des textes commerciaux en français, anglais ou arabe, et balisage Schema.org.": {
    "en": "Responsive interface design, commercial copywriting in French, English, or Arabic, and Schema.org markup.",
    "ar": "تصميم واجهات سريعة التجاوب، كتابة نصوص بيعية بالفرنسية والإنجليزية والعربية، وترميز سكيما."
  },
  "Configuration complète de votre nom de domaine .ma ou .com avec certificat SSL HTTPS et boîtes emails professionnelles incluses.": {
    "en": "Complete setup of your .ma or .com domain name with HTTPS SSL certificate and professional email accounts included.",
    "ar": "إعداد كامل لاسم النطاق .ma أو .com مع شهادة أمان SSL HTTPS وبريد إلكتروني مهني."
  },
  "Connectez votre visibilité avec notre pôle en": {
    "en": "Connect your visibility with our specialized hub in",
    "ar": "اربط حضورك الرقمي مع مركزنا في"
  },
  "Connectez votre visibilité rbatie à notre expertise en": {
    "en": "Connect your Rabat visibility with our expertise in",
    "ar": "اربط ظهورك في الرباط بخبرتنا المتقدمة في"
  },
  "Construisez un actif commercial pérenne au lieu de louer votre trafic à Google ou Facebook.": {
    "en": "Build a lasting commercial asset instead of renting your traffic from Google or Facebook ads.",
    "ar": "ابنِ أصلاً تجارياً دائماً بدلاً من استئجار الزيارات عبر إعلانات غوغل وفيسبوك."
  },
  "Consultation Courtage": {
    "en": "Brokerage Consultation",
    "ar": "استشارة وساطة التأمين"
  },
  "Consultation Gratuite": {
    "en": "Free Consultation",
    "ar": "استشارة مجانية"
  },
  "Consultez notre étude de cas": {
    "en": "Check our case study",
    "ar": "اطلع على دراسة الحالة"
  },
  "Contrôle qualité technique, validation sur smartphone, déploiement du certificat SSL et soumission à l'index Google Search Console.": {
    "en": "Technical quality check, smartphone validation, SSL deployment, and Google Search Console index submission.",
    "ar": "مراقبة جودة تقنية، اختبار على الهواتف، تثبيت شهادة SSL وإرسال الموقع لفهرسة غوغل."
  },
  "Conversion Mobile 1 Clic": {
    "en": "1-Click Mobile Conversion",
    "ar": "تحويل الزوار بنقرة واحدة"
  },
  "Critère Essentiel": {
    "en": "Essential Factor",
    "ar": "معيار أساسي"
  },
  "Création Site Casablanca": {
    "en": "Casablanca Website Creation",
    "ar": "إنشاء المواقع بالدار البيضاء"
  },
  "Création de pages de services dédiées, balisage Schema.org, maillage interne ciblé et synchronisation avec Google Business Profile.": {
    "en": "Dedicated service page creation, Schema.org tagging, targeted internal linking, and Google Business Profile sync.",
    "ar": "إنشاء صفحات خدمات متخصصة، ترميز سكيما، ربط داخلي ذكي ومزامنة ملف غوغل التجاري."
  },
  "Création site internet Agadir": {
    "en": "Website creation Agadir",
    "ar": "إنشاء مواقع الإنترنت بأكادير"
  },
  "Création site internet Fès": {
    "en": "Website creation Fez",
    "ar": "إنشاء مواقع الإنترنت بفاس"
  },
  "Création site web Agadir": {
    "en": "Website creation Agadir",
    "ar": "تصميم موقع ويب أكادير"
  },
  "Création site web Casablanca": {
    "en": "Website creation Casablanca",
    "ar": "تصميم موقع ويب الدار البيضاء"
  },
  "Création site web Fès": {
    "en": "Website creation Fez",
    "ar": "تصميم موقع ويب فاس"
  },
  "Création site web Maroc": {
    "en": "Website creation Morocco",
    "ar": "تصميم موقع ويب المغرب"
  },
  "Création site web Marrakech": {
    "en": "Website creation Marrakech",
    "ar": "تصميم موقع ويب مراكش"
  },
  "Création site web Rabat": {
    "en": "Website creation Rabat",
    "ar": "تصميم موقع ويب الرباط"
  },
  "Création site web Tanger": {
    "en": "Website creation Tangier",
    "ar": "تصميم موقع ويب طنجة"
  },
  "DH+": {
    "en": "MAD+",
    "ar": "درهم+"
  },
  "De l'analyse de votre marché à la livraison finale, un accompagnement rigoureux et transparent.": {
    "en": "From market analysis to final deployment, a rigorous and transparent process.",
    "ar": "من تحليل السوق إلى التسليم النهائي، مرافقة دقيقة وشفافة."
  },
  "Des tarifs clairs et accessibles pour accompagner les professionnels du Royaume à chaque palier de croissance.": {
    "en": "Transparent and accessible pricing supporting Moroccan professionals at every growth tier.",
    "ar": "أسعار واضحة ومدروسة لمواكبة المهنيين والشركات بالمملكة في كل مرحلة نمو."
  },
  "Deuxième Projet AssurLead • Septembre 2026": {
    "en": "Second AssurLead Project • September 2026",
    "ar": "المشروع الثاني لأسورليد • شتنبر 2026"
  },
  "Devis Courtage": {
    "en": "Brokerage Quote",
    "ar": "تسعيرة وساطة التأمين"
  },
  "Devis Gratuit Agadir": {
    "en": "Free Agadir Quote",
    "ar": "عرض سعر مجاني بأكادير"
  },
  "Devis Gratuit Casablanca": {
    "en": "Free Casablanca Quote",
    "ar": "عرض سعر مجاني بالدار البيضاء"
  },
  "Devis Gratuit Fès": {
    "en": "Free Fez Quote",
    "ar": "عرض سعر مجاني بفاس"
  },
  "Devis Gratuit Maroc": {
    "en": "Free Morocco Quote",
    "ar": "عرض سعر مجاني بالمغرب"
  },
  "Devis Gratuit Marrakech": {
    "en": "Free Marrakech Quote",
    "ar": "عرض سعر مجاني بمراكش"
  },
  "Devis Gratuit Rabat": {
    "en": "Free Rabat Quote",
    "ar": "عرض سعر مجاني بالرباط"
  },
  "Devis Gratuit Tanger": {
    "en": "Free Tangier Quote",
    "ar": "عرض سعر مجاني بطنجة"
  },
  "Devis WhatsApp": {
    "en": "WhatsApp Quote",
    "ar": "طلب تسعير عبر واتساب"
  },
  "Diagnostic": {
    "en": "Diagnostic",
    "ar": "التشخيص الرقمي"
  },
  "Diagnostic Gratuit": {
    "en": "Free Diagnostic",
    "ar": "تشخيص مجاني"
  },
  "Diagnostic de Visibilité": {
    "en": "Visibility Diagnostic",
    "ar": "تشخيص الرؤية الرقمية"
  },
  "Diagnostic en 48h": {
    "en": "Diagnostic within 48h",
    "ar": "تشخيص خلال 48 ساعة"
  },
  "Diagnostic en Ligne": {
    "en": "Online Diagnostic",
    "ar": "تشخيص فوري عبر الإنترنت"
  },
  "Dispositif clé en main à 8 000 DH ou formule sur-mesure à 12 000+ DH avec livraison en 14 jours et formation complète de votre équipe.": {
    "en": "Turnkey system at 8,000 MAD or custom package at 12,000+ MAD delivered in 14 days with full team onboarding.",
    "ar": "منظومة متكاملة بـ 8,000 درهم أو حلول مخصصة ابتداء من 12,000 درهم مع تسليم خلال 14 يوماً وتدريب الفريق."
  },
  "Dynamisez vos ventes à Agadir et dans le Souss": {
    "en": "Boost your sales in Agadir and the Souss region",
    "ar": "طور مبيعاتك في أكادير وسوس ماسة"
  },
  "Découvrez comment": {
    "en": "Discover how",
    "ar": "اكتشف كيف"
  },
  "Découvrir l'Offre Casablanca": {
    "en": "Discover Casablanca Offer",
    "ar": "اكتشف عرض الدار البيضاء"
  },
  "Découvrir l'Offre Maroc": {
    "en": "Discover Morocco Nationwide Offer",
    "ar": "اكتشف العرض الوطني الشامل"
  },
  "Délai garanti 10-14 jours": {
    "en": "Guaranteed 10-14 days turnaround",
    "ar": "مدة إنجاز مضمونة في 10-14 يوماً"
  },
  "Délai garanti 14 jours": {
    "en": "Guaranteed 14-day turnaround",
    "ar": "مدة إنجاز مضمونة في 14 يوماً"
  },
  "Dépense morte sans aucun retour sur investissement mesurable.": {
    "en": "Dead expense with zero measurable ROI.",
    "ar": "مصروف مهدور بدون أي عائد استثماري قابل للقياس."
  },
  "Déploiement d'un dispositif d'acquisition locale et responsive pour l'agence d'assurance à Marrakech.": {
    "en": "Deployment of local, mobile-responsive acquisition system for Marrakech insurance agency.",
    "ar": "إطلاق منظومة استقطاب محلية ومتجاوبة لوكالة التأمين بمراكش."
  },
  "Déploiement d'un moteur d'acquisition pour agence immobilière dans la métropole casablancaise.": {
    "en": "Deployment of client acquisition engine for real estate agency in Casablanca.",
    "ar": "إطلاق محرك استقطاب العملاء لوكالة عقارية بحاضرة الدار البيضاء."
  },
  "Déploiement de pages locales optimisées pour Casablanca, Rabat, Marrakech, Tanger, Fès et Agadir pour dominer votre secteur.": {
    "en": "Deployment of local pages optimized for Casablanca, Rabat, Marrakech, Tangier, Fez, and Agadir to dominate your market.",
    "ar": "إطلاق صفحات محلية محسنة للدار البيضاء، الرباط، مراكش، طنجة، فاس وأكادير لتصدر مجالك."
  },
  "Développement technique sur-mesure, respect strict des Core Web Vitals de Google, responsive mobile irréprochable et temps de réponse ultra-rapide (< 1.2s).": {
    "en": "Tailored technical coding, strict Google Core Web Vitals compliance, flawless mobile responsiveness, and ultra-fast speed (< 1.2s).",
    "ar": "تطوير برمجي متقدم، احترام صارم لمؤشرات غوغل، تجاوب مثالي وسرعة فائقة (< 1.2 ثانية)."
  },
  "Développez la présence en ligne de votre activité à Rabat": {
    "en": "Grow your business online presence in Rabat",
    "ar": "طور الحضور الرقمي لنشاطك التجاري بالرباط"
  },
  "Développez le portefeuille de votre cabinet d'assurance": {
    "en": "Expand your insurance agency's policy portfolio",
    "ar": "نمّ محفظة زبائن وكالة التأمين الخاصة بك"
  },
  "Développez vos opportunités d'affaires à Tanger": {
    "en": "Expand your business opportunities in Tangier",
    "ar": "طور فرص أعمالك وشراكاتك بطنجة"
  },
  "Exclusivité Absolue": {
    "en": "Absolute Exclusivity",
    "ar": "حصرية مطلقة"
  },
  "FORMULE GROWTH": {
    "en": "GROWTH PACKAGE",
    "ar": "باقة GROWTH"
  },
  "FORMULE STARTER": {
    "en": "STARTER PACKAGE",
    "ar": "باقة STARTER"
  },
  "Faites auditer votre site web à Casablanca": {
    "en": "Get your website audited in Casablanca",
    "ar": "احصل على تدقيق شامل لموقعك بالدار البيضاء"
  },
  "Faites rayonner votre établissement à Marrakech": {
    "en": "Promote your establishment across Marrakech",
    "ar": "أبرز مؤسستك وفندقك بمراكش"
  },
  "Fiche Google Maps abandonnée ou isolée du site web.": {
    "en": "Google Maps profile abandoned or disconnected from the website.",
    "ar": "ملف غوغل مابس مهمل أو غير متصل بالموقع الإلكتروني."
  },
  "Formation rapide à la gestion du site, raccordement WhatsApp et accompagnement au développement de votre visibilité nationale.": {
    "en": "Fast training on site management, WhatsApp integration, and coaching for national visibility expansion.",
    "ar": "تدريب سريع على إدارة الموقع، وربط واتساب ومرافقة في توسيع انتشارك على المستوى الوطني."
  },
  "Formulaire froid et complexe de 8 champs que personne ne remplit.": {
    "en": "Cold, complicated 8-field form that nobody bothers to complete.",
    "ar": "نموذج معقد من 8 حقول لا يقوم أحد بملئه."
  },
  "Formulaires spécialisés pour chantiers BTP, responsabilité civile exploitation et couverture des locaux professionnels.": {
    "en": "Specialized forms for construction sites, general liability, and commercial premises protection.",
    "ar": "نماذج متخصصة لأوراش البناء، المسؤولية المدنية وتأمين المقرات المهنية."
  },
  "Formule Lead Engine": {
    "en": "Lead Engine Package",
    "ar": "باقة Lead Engine"
  },
  "Fès": {
    "en": "Fez",
    "ar": "فاس"
  },
  "GOOGLE BUSINESS PROFILE": {
    "en": "GOOGLE BUSINESS PROFILE",
    "ar": "ملف GOOGLE BUSINESS PROFILE التجاري"
  },
  "Gage de Crédibilité": {
    "en": "Credibility Anchor",
    "ar": "رمز المصداقية والاحترافية"
  },
  "Google Maps & Local SEO": {
    "en": "Google Maps & Local SEO",
    "ar": "خرائط غوغل والسيو المحلي"
  },
  "Growth — 4 500 DH": {
    "en": "Growth — 4,500 MAD",
    "ar": "باقة Growth — 4,500 درهم"
  },
  "Génération de leads qualifiés": {
    "en": "Qualified Leads Generation",
    "ar": "جلب زبائن مؤهلين وجاهزين"
  },
  "Huile d'Argan & Produits du Terroir": {
    "en": "Argan Oil & Authentic Local Products",
    "ar": "زيت الأركان والمنتجات المجالية"
  },
  "HÉBERGEMENT & NOM DE DOMAINE": {
    "en": "HOSTING & DOMAIN NAME",
    "ar": "الاستضافة واسم النطاق"
  },
  "Hébergement & Nom de domaine inclus": {
    "en": "Hosting & Domain name included",
    "ar": "الاستضافة واسم النطاق مشمولان"
  },
  "Immobilier & Conciergeries de Luxe": {
    "en": "Luxury Real Estate & Concierge Services",
    "ar": "العقارات الفاخرة وخدمات الضيافة الراقية"
  },
  "Immobilier Balnéaire & Tourisme": {
    "en": "Seaside Real Estate & Tourism",
    "ar": "العقارات الساحلية والسياحة"
  },
  "Intégration de boutons d'appel et de discussion WhatsApp pré-remplis pour déclencher des conversations avec vos prospects chauds.": {
    "en": "Integration of pre-filled WhatsApp click-to-chat and call buttons to spark immediate conversations with hot leads.",
    "ar": "دمج أزرار اتصال ومحادثة واتساب مسبقة الإعداد لبدء محادثات فورية مع عملائك المهتمين."
  },
  "Intégration de points de contact sans friction : WhatsApp pré-rempli, appel téléphonique direct et formulaire de qualification rapide.": {
    "en": "Zero-friction contact channels: pre-filled WhatsApp, instant direct phone call, and 3-step qualification form.",
    "ar": "دمج قنوات تواصل بدون عوائق: واتساب مجهز، اتصال هاتفي مباشر ونموذج تأهيل سريع."
  },
  "Invisible sur les recherches locales. Les gens doivent déjà connaître votre nom.": {
    "en": "Invisible in local search. People must already know your exact business name.",
    "ar": "غير مرئي في نتائج البحث المحلية. يجب أن يعرف الناس اسمك مسبقاً للعثور عليك."
  },
  "Kénitra": {
    "en": "Kenitra",
    "ar": "القنيطرة"
  },
  "LE PLUS POPULAIRE": {
    "en": "MOST POPULAR",
    "ar": "الأكثر طلباً"
  },
  "LEAD ENGINE": {
    "en": "LEAD ENGINE",
    "ar": "محرك العملاء LEAD ENGINE"
  },
  "Laâyoune": {
    "en": "Laayoune",
    "ar": "العيون"
  },
  "Le référencement Google au cœur de votre attractivité dans le Souss": {
    "en": "Google SEO at the heart of your visibility across Souss",
    "ar": "سيو غوغل في صميم جاذبية مشروعك بسوس ماسة"
  },
  "Lead Engine — 8 000 DH": {
    "en": "Lead Engine — 8,000 MAD",
    "ar": "باقة Lead Engine — 8,000 درهم"
  },
  "Leads 100% exclusifs": {
    "en": "100% Exclusive Leads",
    "ar": "عملاء حصريون بنسبة 100%"
  },
  "Leads Assurance": {
    "en": "Insurance Leads",
    "ar": "عملاء التأمين"
  },
  "Leads Assurance Maroc": {
    "en": "Morocco Insurance Leads",
    "ar": "زبائن التأمين بالمغرب"
  },
  "Lenteur sur smartphone (> 3.5s), taux de rebond supérieur à 60%.": {
    "en": "Slow mobile speed (> 3.5s), bounce rate exceeding 60%.",
    "ar": "بطء التحميل على الهواتف (> 3.5 ثانية)، ومعدل ارتداد يتجاوز 60%."
  },
  "Les décideurs et résidents de Rabat recherchent leurs prestataires directement sur leur smartphone.": {
    "en": "Decision-makers and residents in Rabat search for their service providers directly on smartphones.",
    "ar": "يبحث أصحاب القرار وسكان الرباط عن مزودي الخدمات مباشرة عبر هواتفهم الذكية."
  },
  "Les visiteurs étrangers planifient leurs séjours à Fès plusieurs semaines à l'avance sur Google : apparaissez en tête des recherches stratégiques.": {
    "en": "International travelers plan their Fez stays weeks in advance on Google: rank at the top of strategic searches.",
    "ar": "يخطط الزوار الأجانب لرحلاتهم إلى فاس أسابيع مسبقاً عبر غوغل: تصدر نتائج البحث الاستراتيجية."
  },
  "Lorsque vous arrêtez le budget publicitaire Google Ads, vos visites s'arrêtent net. Le SEO naturel continue de vous amener des clients mois après mois.": {
    "en": "When you pause Google Ads budget, traffic vanishes immediately. Organic SEO keeps generating clients month after month.",
    "ar": "عندما توقف ميزانية إعلانات غوغل الممولة، تنقطع الزيارات فوراً. السيو العضوي يواصل جلب العملاء شهراً بعد شهر."
  },
  "MAILLAGE TERRITORIAL": {
    "en": "TERRITORIAL COVERAGE",
    "ar": "تغطية ترابية شاملة"
  },
  "Maillage National": {
    "en": "Nationwide Network",
    "ar": "شبكة وطنية شاملة"
  },
  "Marrakech": {
    "en": "Marrakech",
    "ar": "مراكش"
  },
  "Marrakech, Maroc": {
    "en": "Marrakech, Morocco",
    "ar": "مراكش، المغرب"
  },
  "Meknès": {
    "en": "Meknes",
    "ar": "مكناس"
  },
  "Mise en ligne avec certificat SSL, vérification de la vitesse mobile et déclaration de l'indexation sur Google Search Console.": {
    "en": "Deployment with SSL certificate, mobile speed audit, and index declaration on Google Search Console.",
    "ar": "إطلاق الموقع مع شهادة SSL، فحص سرعة الهواتف وإرسال الفهرسة لـ Google Search Console."
  },
  "Mise en ligne en 10 à 14 jours": {
    "en": "Launch in 10 to 14 days",
    "ar": "الإطلاق خلال 10 إلى 14 يوماً"
  },
  "Mohammedia": {
    "en": "Mohammedia",
    "ar": "المحمدية"
  },
  "Moteur d'Acquisition AssurLead": {
    "en": "AssurLead Acquisition Engine",
    "ar": "محرك استقطاب العملاء أسورليد"
  },
  "Moteur d'acquisition intensif, fonctionnalités e-commerce ou formulaires de devis avancés pour cabinets et PME casablancaises.": {
    "en": "Intensive acquisition engine, e-commerce capabilities or multi-step quote forms for Casablanca firms and SMEs.",
    "ar": "محرك استقطاب قوي، وميزات تجارة إلكترونية أو نماذج تسعير متطورة لمكاتب وشركات البيضاء."
  },
  "Mots-clés Industriels": {
    "en": "Industrial Keywords",
    "ar": "كلمات مفتاحية صناعية"
  },
  "Mots-clés locaux": {
    "en": "Local Keywords",
    "ar": "كلمات مفتاحية محلية"
  },
  "Multipliez vos Devis": {
    "en": "Multiply Your Quotes",
    "ar": "ضاعف طلبات التسعير والزبائن"
  },
  "Multirisque Pro & RC Décennale": {
    "en": "Business Multirisk & Decennial Liability",
    "ar": "التأمين المهني الشامل والمسؤولية العشرية"
  },
  "Méthode en 4 Étapes": {
    "en": "4-Step Methodology",
    "ar": "منهجية العمل في 4 خطوات"
  },
  "Méthodologie en 4 Étapes": {
    "en": "4-Step Methodology",
    "ar": "المنهجية في 4 مراحل"
  },
  "Ne gaspillez plus vos honoraires dans des coordonnées partagées avec 4 ou 5 courtiers concurrents.": {
    "en": "Stop wasting fees on shared lead databases sold to 4 or 5 competing brokers simultaneously.",
    "ar": "توقف عن إهدار أموالك في بيانات عملاء تباع في نفس الوقت لأربعة أو خمسة وسطاء منافسين."
  },
  "Nos Réalisations Clients": {
    "en": "Our Client Case Studies",
    "ar": "إنجازاتنا ومشاريع عملائنا"
  },
  "Notre Approche Digitale": {
    "en": "Our Digital Approach",
    "ar": "منهجيتنا الرقمية"
  },
  "Notre processus de création site web Casablanca": {
    "en": "Our website creation process in Casablanca",
    "ar": "مسار تصميم المواقع بالدار البيضاء"
  },
  "Notre processus de création site web au Maroc": {
    "en": "Our website creation process in Morocco",
    "ar": "مسار تصميم المواقع بالمغرب"
  },
  "Nous identifions les freins techniques et les opportunités de mots-clés de votre site actuel pour établir un plan de redressement immédiat.": {
    "en": "We pinpoint technical bottlenecks and keyword opportunities in your current website to craft an immediate recovery plan.",
    "ar": "نحدد العوائق التقنية وفرص الكلمات المفتاحية في موقعك الحالي لوضع خطة تطوير فورية."
  },
  "Nous étudions précisément les termes recherchés par vos clients sur Google dans votre ville pour identifier les opportunités de marché prioritaires.": {
    "en": "We analyze the exact terms searched by local buyers on Google in your city to pinpoint priority market opportunities.",
    "ar": "ندرس بدقة الكلمات التي يبحث عنها زباؤنك في مدينتك لتحديد أولويات السوق المربحة."
  },
  "OFFRE DE LANCEMENT": {
    "en": "LAUNCH OFFER",
    "ar": "عرض الإطلاق الحصري"
  },
  "Objectif Fondateur": {
    "en": "Foundational Goal",
    "ar": "الهدف الأساسي"
  },
  "Obtenez une proposition détaillée et un chiffrage précis sous 24 heures pour votre entreprise casablancaise.": {
    "en": "Receive a detailed proposal and accurate quote within 24 hours for your Casablanca business.",
    "ar": "احصل على عرض مفصل وتسعير دقيق خلال 24 ساعة لشركتك بالدار البيضاء."
  },
  "Offre d'appel à 1 500 DH (jusqu'au 31/10/2026), Starter à 2 000 DH, Growth à 4 500 DH et Lead Engine à 8 000 DH avec livraison en 10-14 jours.": {
    "en": "Entry offer at 1,500 MAD (valid until 10/31/2026), Starter at 2,000 MAD, Growth at 4,500 MAD, and Lead Engine at 8,000 MAD delivered in 10-14 days.",
    "ar": "عرض تمهيدي بـ 1,500 درهم (حتى 31/10/2026)، باقة Starter بـ 2,000 درهم، Growth بـ 4,500 درهم وLead Engine بـ 8,000 درهم مع تسليم في 10-14 يوماً."
  },
  "Offre d'appel à 1 500 DH (jusqu'au 31/10/2026), Starter à 2 000 DH, Growth à 4 500 DH et Lead Engine à 8 000 DH livrés en 10 à 14 jours.": {
    "en": "Entry offer at 1,500 MAD (until 10/31/2026), Starter at 2,000 MAD, Growth at 4,500 MAD, and Lead Engine at 8,000 MAD delivered in 10 to 14 days.",
    "ar": "عرض تمهيدي بـ 1,500 درهم (حتى 31/10/2026)، باقة Starter بـ 2,000 درهم، Growth بـ 4,500 درهم وLead Engine بـ 8,000 درهم مع تسليم خلال 10 إلى 14 يوماً."
  },
  "Offre d'appel à 1 500 DH (jusqu'au 31/10/2026), Starter à 2 000 DH, Growth à 4 500 DH et Lead Engine à 8 000 DH livrés en 10-14 jours.": {
    "en": "Entry offer at 1,500 MAD (until 10/31/2026), Starter at 2,000 MAD, Growth at 4,500 MAD, and Lead Engine at 8,000 MAD delivered in 10-14 days.",
    "ar": "عرض تمهيدي بـ 1,500 درهم (حتى 31/10/2026)، باقة Starter بـ 2,000 درهم، Growth بـ 4,500 درهم وLead Engine بـ 8,000 درهم مع تسليم في 10-14 يوماً."
  },
  "Offre valable jusqu'au 31/10/2026. Page de présentation soignée et responsive (n'inclut pas de SEO multi-villes ni de sous-pages de service).": {
    "en": "Offer valid until 10/31/2026. Polished, mobile-responsive showcase page (does not include multi-city SEO or sub-service pages).",
    "ar": "العرض سارٍ حتى 31/10/2026. صفحة تعريفية أنيقة ومتجاوبة (لا تشمل سيو المدن المتعددة أو صفحات الخدمات الفرعية)."
  },
  "Optimisation de votre présence sur Google Maps pour capter les requêtes à proximité immédiate dans la métropole casablancaise.": {
    "en": "Optimization of your presence on Google Maps to capture nearby searches across Casablanca metropolis.",
    "ar": "تهيئة تواجدك على خرائط غوغل لجذب طلبات البحث القريبة بحاضرة الدار البيضاء."
  },
  "Optimisation de votre présence sur les recherches de proximité (« riad médina marrakech », « restaurant guéliz ») pour capter les touristes sur place.": {
    "en": "Optimization for high-intent nearby queries ('riad medina marrakech', 'restaurant gueliz') capturing travelers on site.",
    "ar": "تهيئة الظهور في عمليات البحث القريبة ('رياض المدينة مراكش'، 'مطعم جليز') لجذب السياح المتواجدين."
  },
  "Oujda": {
    "en": "Oujda",
    "ar": "وجدة"
  },
  "PME & Parcs Industriels": {
    "en": "SMEs & Industrial Parks",
    "ar": "المقاولات الصغرى والمتوسطة والمناطق الصناعية"
  },
  "Parcours de Conversion": {
    "en": "Conversion Journey",
    "ar": "مسار التحويل الذكي"
  },
  "Parcours de contact WhatsApp direct et formulaires simplifiés": {
    "en": "Direct WhatsApp contact funnel and simplified intake forms",
    "ar": "مسار تواصل مباشر عبر واتساب ونماذج مبسطة"
  },
  "Performance pure": {
    "en": "Pure Performance",
    "ar": "أداء تقني فائق"
  },
  "Piliers du Déploiement :": {
    "en": "Deployment Pillars:",
    "ar": "ركائز التنفيذ والتطوير:"
  },
  "Plateformes modernes pour éditeurs de logiciels, cabinets de formation et sociétés de services numériques de Rabat-Salé.": {
    "en": "Modern web platforms for software vendors, training academies, and digital services firms in Rabat-Salé.",
    "ar": "منصات حديثة لشركات البرمجيات ومراكز التكوين وشركات الخدمات الرقمية بالرباط وسلا."
  },
  "Positionnement SEO organique": {
    "en": "Organic Google SEO Ranking",
    "ar": "تموضع سيو عضوي متصدر"
  },
  "Positionnement prioritaire dans le pack local de Casablanca (Anfa, Maarif, Sidi Maarouf) pour capter les décideurs en recherche immédiate.": {
    "en": "Priority local pack ranking across Casablanca (Anfa, Maarif, Sidi Maarouf) capturing active corporate decision-makers.",
    "ar": "تموضع ذو أولوية في الحزمة المحلية للبيضاء (أنفا، المعاريف، سيدي معروف) لاستقطاب أصحاب القرار فوراً."
  },
  "Positionnement pérenne sur Google Maroc (.ma) pour capter les requêtes d'achat nationales sans dépendre des enchères payantes.": {
    "en": "Durable ranking on Google Morocco (.ma) capturing national buyer intent without relying on paid advertising bids.",
    "ar": "تموضع دائم على غوغل المغرب (.ma) لجلب طلبات الشراء الوطنية دون الاعتماد على المزايدات الإعلانية."
  },
  "Positionnement stratégique sur les requêtes ciblées à Hay Riad, Agdal, Souissi et Hassan pour capter les opportunités locales.": {
    "en": "Strategic ranking for searches in Hay Riad, Agdal, Souissi, and Hassan to capture high-value local contracts.",
    "ar": "تموضع استراتيجي في حي الرياض، أكدال، السويسي وحسان لاقتناص الفرص والصفقات المحلية."
  },
  "Pourquoi créer votre propre canal plutôt que d'acheter des leads": {
    "en": "Why build your own client acquisition channel instead of buying shared leads",
    "ar": "لماذا تبني قناتك الخاصة بدلاً من شراء بيانات عملاء مشتركة"
  },
  "Pourquoi le SEO local à Marrakech transforme votre rentabilité": {
    "en": "Why local SEO in Marrakech transforms your profitability",
    "ar": "كيف يحول السيو المحلي بمراكش ربحية مشروعك"
  },
  "Pourquoi le SEO surpasse les campagnes sponsorisées classiques": {
    "en": "Why organic SEO outperforms standard sponsored ad campaigns",
    "ar": "لماذا يتفوق السيو العضوي على الإعلانات الممولة التقليدية"
  },
  "Pérennité Financière": {
    "en": "Financial Sustainability",
    "ar": "استدامة مالية طويلة الأمد"
  },
  "Rabat": {
    "en": "Rabat",
    "ar": "الرباط"
  },
  "Rassurance & Conformité": {
    "en": "Reassurance & Regulatory Compliance",
    "ar": "المصداقية والامتثال المهني"
  },
  "Recevez une proposition détaillée et un devis personnalisé sous 24 heures pour votre entreprise à Agadir ou Taghazout.": {
    "en": "Receive a detailed proposal and customized quote within 24 hours for your business in Agadir or Taghazout.",
    "ar": "احصل على مقترح مفصل وتسعير مخصص خلال 24 ساعة لشركتك بأكادير أو تغازوت."
  },
  "Recevez une proposition détaillée et un devis personnalisé sous 24 heures pour votre entreprise à Fès.": {
    "en": "Receive a detailed proposal and customized quote within 24 hours for your business in Fez.",
    "ar": "احصل على مقترح مفصل وتسعير مخصص خلال 24 ساعة لشركتك بفاس."
  },
  "Recevez une proposition détaillée et un devis personnalisé sous 24 heures pour votre entreprise à Rabat.": {
    "en": "Receive a detailed proposal and customized quote within 24 hours for your business in Rabat.",
    "ar": "احصل على مقترح مفصل وتسعير مخصص خلال 24 ساعة لشركتك بالرباط."
  },
  "Recevez une proposition détaillée et un devis personnalisé sous 24 heures pour votre entreprise à Tanger.": {
    "en": "Receive a detailed proposal and customized quote within 24 hours for your business in Tangier.",
    "ar": "احصل على مقترح مفصل وتسعير مخصص خلال 24 ساعة لشركتك بطنجة."
  },
  "Recevez une proposition détaillée et un devis personnalisé sous 24 heures pour votre projet à Marrakech.": {
    "en": "Receive a detailed proposal and customized quote within 24 hours for your project in Marrakech.",
    "ar": "احصل على مقترح مفصل وتسعير مخصص خلال 24 ساعة لمشروعك بمراكش."
  },
  "Recherche Touristique & B2B": {
    "en": "Tourism & B2B Search Engine Intent",
    "ar": "استقطاب الباحثين في السياحة والأعمال B2B"
  },
  "Recherche d'Intentions Locales": {
    "en": "Local Search Intent Targeting",
    "ar": "استهداف نوايا البحث المحلية"
  },
  "Recommandations concrètes": {
    "en": "Actionable recommendations",
    "ar": "توصيات عملية دقيقة"
  },
  "Restaurants & Excursions Désert": {
    "en": "Dining & Desert Excursions",
    "ar": "المطاعم والرحلات الصحراوية"
  },
  "Revenir à l'accueil du site": {
    "en": "Back to Home",
    "ar": "العودة إلى الصفحة الرئيسية"
  },
  "Routage instantané des demandes vers vos équipes commerciales avec messages pré-remplis pour zéro déperdition de prospects.": {
    "en": "Instant routing of inquiries to sales reps with pre-filled messages ensuring zero lead leakage.",
    "ar": "توجيه فوري لطلبات العملاء لفرق المبيعات مع رسائل مهيأة لمنع ضياع أي فرصة تجارية."
  },
  "RÉFÉRENCEMENT NATUREL GOOGLE": {
    "en": "GOOGLE ORGANIC SEO",
    "ar": "سيو غوغل العضوي الطبيعي"
  },
  "RÉFÉRENCEMENT NATUREL SEO": {
    "en": "ORGANIC SEO SEARCH",
    "ar": "تحسين محركات البحث العضوي"
  },
  "Réalisations & Études de Cas": {
    "en": "Portfolio & Case Studies",
    "ar": "الإنجازات ودراسات الحالة"
  },
  "Rédaction de contenus d'autorité répondant aux intentions transactionnelles concrètes des entreprises casablancaises.": {
    "en": "High-authority copywriting addressing the exact transactional intentions of Casablanca businesses.",
    "ar": "صياغة محتوى موثوق يجيب عن نوايا الشراء الفعلية لشركات الدار البيضاء."
  },
  "Référencement & Ventes": {
    "en": "SEO & Sales Growth",
    "ar": "السيو وتنمية المبيعات"
  },
  "Référencement Local": {
    "en": "Local SEO Optimization",
    "ar": "تحسين محركات البحث المحلي"
  },
  "Référencement SEO Casablanca": {
    "en": "Casablanca SEO Optimization",
    "ar": "سيو الدار البيضاء"
  },
  "Référencement local ciblé sur la zone de Marrakech": {
    "en": "Targeted local SEO across the Marrakech area",
    "ar": "سيو محلي مستهدف لمنطقة مراكش"
  },
  "Référencement local multi-quartiers (Maarif, Anfa, Gauthier)": {
    "en": "Multi-neighborhood local SEO (Maarif, Anfa, Gauthier)",
    "ar": "سيو محلي متعدد الأحياء (المعاريف، أنفا، غوتييه)"
  },
  "Réseau National": {
    "en": "National Network",
    "ar": "شبكة وطنية بالمملكة"
  },
  "Réserver mon Audit Gratuit": {
    "en": "Book My Free Audit",
    "ar": "حجز التدقيق المجاني"
  },
  "Réservez votre": {
    "en": "Book your",
    "ar": "احجز"
  },
  "SEO Hyper-Localisé": {
    "en": "Hyper-Local SEO",
    "ar": "سيو محلي فائق الدقة"
  },
  "SEO Local Google Maps": {
    "en": "Local SEO & Google Maps",
    "ar": "السيو المحلي وخرائط غوغل"
  },
  "SEO vs Publicité Payante": {
    "en": "SEO vs Paid Ads",
    "ar": "السيو مقابل الإعلانات الممولة"
  },
  "Sans engagement": {
    "en": "No commitment",
    "ar": "بدون أي التزام"
  },
  "Santé Complémentaire & Prévoyance": {
    "en": "Health Insurance & Protection Plans",
    "ar": "التأمين الصحي التكميلي والتغطيات"
  },
  "Santé, Cliniques & Praticiens": {
    "en": "Healthcare, Clinics & Medical Practitioners",
    "ar": "القطاع الصحي، المصحات والأطباء"
  },
  "Serveurs sécurisés, certificats HTTPS, sauvegardes automatiques et gestion clé en main de votre nom de domaine .ma ou .com.": {
    "en": "Secure servers, HTTPS certificates, automatic backups, and turnkey management of your .ma or .com domain.",
    "ar": "خوادم آمنة، شهادات HTTPS، نسخ احتياطي تلقائي وإدارة كاملة لاسم النطاق .ma أو .com."
  },
  "Simple brochure décorative sans intention commerciale active.": {
    "en": "Simple decorative brochure with zero active commercial intent.",
    "ar": "كتيب إلكتروني ديكوري بدون أي هدف بيعي نشط."
  },
  "Site Vitrine Traditionnel": {
    "en": "Traditional Showcase Site",
    "ar": "موقع تعريفي تقليدي"
  },
  "Site complet multipages avec référencement naturel local sur Casablanca, tunnels de conversion et optimisation Google Business Profile.": {
    "en": "Complete multi-page site with local Casablanca organic SEO, conversion funnels, and Google Business Profile optimization.",
    "ar": "موقع كامل متعدد الصفحات مع سيو محلي بالبيضاء، ومسارات تحويل وتحسين ملف غوغل التجاري."
  },
  "Site multipages complet avec stratégie de référencement naturel local Google, tunnels de capture WhatsApp et optimisation Google Business Profile.": {
    "en": "Complete multi-page website with Google local organic SEO strategy, WhatsApp capture funnels, and Google Business Profile optimization.",
    "ar": "موقع متعدد الصفحات مع استراتيجية سيو محلي على غوغل، ومسارات واتساب وتحسين ملف غوغل التجاري."
  },
  "Site professionnel 1 page clé en main, hébergement et nom de domaine inclus la 1ère année, responsive mobile et contact WhatsApp direct.": {
    "en": "Turnkey 1-page professional website, hosting and domain included for year 1, mobile-responsive with direct WhatsApp contact.",
    "ar": "موقع مهني متكامل من صفحة واحدة، استضافة واسم نطاق مجاناً للسنة الأولى، وتوافق تام مع الهواتف وواتساب."
  },
  "Site professionnel clé en main, hébergement et nom de domaine inclus la 1ère année, responsive mobile et contact WhatsApp.": {
    "en": "Turnkey professional website, hosting and domain included for year 1, mobile responsive, and WhatsApp contact.",
    "ar": "موقع مهني متكامل، استضافة واسم نطاق للسنة الأولى، تصميم متجاوب واتصال واتساب."
  },
  "Sites attractifs avec menus digitaux, circuits vers Agafay et galeries photos haute définition optimisées pour Google Images et Maps.": {
    "en": "Engaging websites with digital menus, Agafay tour booking, and high-definition galleries optimized for Google Images and Maps.",
    "ar": "مواقع جذابة مع قوائم رقمية، وحجوزات رحلات أ Agafay وصور عالية الجودة مهيأة لصور وخرائط غوغل."
  },
  "Sites institutionnels B2B pour les entreprises des zones de Bensouda, Sidi Brahim et de l'agglomération Fès-Meknès.": {
    "en": "B2B corporate websites for industrial firms in Bensouda, Sidi Brahim, and the Fez-Meknes urban hub.",
    "ar": "مواقع مؤسسية B2B لشركات مناطق بنسودة، سيدي إبراهيم وتجمع فاس-مكناس."
  },
  "Sites médicaux clairs avec modules de prise de contact pour centres spécialisés et cliniques privées de Rabat.": {
    "en": "Clear medical websites with booking intake modules for specialized healthcare clinics in Rabat.",
    "ar": "مواقع طبية واضحة مع وحدات اتصال للمراكز المتخصصة والمصحات الخاصة بالرباط."
  },
  "Sous-traitance Industrielle & Free Zones": {
    "en": "Industrial Subcontracting & Free Trade Zones",
    "ar": "المناولة الصناعية والمناطق الحرة"
  },
  "Starter — 2 000 DH": {
    "en": "Starter — 2,000 MAD",
    "ar": "باقة Starter — 2,000 درهم"
  },
  "Statut :": {
    "en": "Status:",
    "ar": "الحالة:"
  },
  "Stratégie Sémantique B2B": {
    "en": "B2B Semantic Strategy",
    "ar": "استراتيجية الكلمات المفتاحية B2B"
  },
  "Stratégie d'Acquisition": {
    "en": "Acquisition Strategy",
    "ar": "استراتيجية استقطاب العملاء"
  },
  "Structure sémantique HTML5, balisage Schema.org et mots-clés ciblés sur les quartiers de Casablanca (Anfa, Maarif, Sidi Maarouf).": {
    "en": "Semantic HTML5 architecture, Schema.org markup, and keywords targeted on Casablanca districts (Anfa, Maarif, Sidi Maarouf).",
    "ar": "بنية دلالية HTML5، ترميز سكيما، وكلمات مفتاحية مستهدفة لأحياء الدار البيضاء (أنفا، المعاريف، سيدي معروف)."
  },
  "Support 7j/7 au Maroc": {
    "en": "7/7 Support in Morocco",
    "ar": "دعم فني 7/7 بالمغرب"
  },
  "Synchronisation Google Business Profile": {
    "en": "Google Business Profile Synchronization",
    "ar": "مزامنة ملف غوغل التجاري Google Business"
  },
  "Synchronisation WhatsApp Business & suivi des demandes d'estimation": {
    "en": "WhatsApp Business sync & valuation inquiry tracking",
    "ar": "مزامنة واتساب للأعمال ومتابعة طلبات التقدير العقاري"
  },
  "Synergie Métropolitaine": {
    "en": "Metropolitan Synergy",
    "ar": "تكامل على مستوى الحواضر"
  },
  "Synergie Nationale": {
    "en": "National Synergy",
    "ar": "تكامل على الصعيد الوطني"
  },
  "Système d'acquisition actif en ligne. Fiches locales Google et campagnes d'indexation opérationnelles.": {
    "en": "Active online acquisition system. Operational local Google profiles and ongoing indexation campaigns.",
    "ar": "منظومة استقطاب نشطة عبر الإنترنت. بطاقات غوغل المحلية وفهرسة منتظمة."
  },
  "SÉCURITÉ & HÉBERGEMENT SSL": {
    "en": "SECURITY & SSL HOSTING",
    "ar": "الأمان واستضافة SSL"
  },
  "TUNNEL WHATSAPP BUSINESS": {
    "en": "WHATSAPP BUSINESS FUNNEL",
    "ar": "مسار واتساب للأعمال"
  },
  "Tanger": {
    "en": "Tangier",
    "ar": "طنجة"
  },
  "Tarifs Accessibles": {
    "en": "Accessible Pricing",
    "ar": "أسعار مناسبة ومدروسة"
  },
  "Tarifs Clairs & Accessibles": {
    "en": "Clear & Accessible Rates",
    "ar": "أسعار شفافة ومتاحة للجميع"
  },
  "Tarifs Garantis": {
    "en": "Guaranteed Pricing",
    "ar": "أسعار مضمونة وثابتة"
  },
  "Tarifs sans Surprise": {
    "en": "No-Surprise Pricing",
    "ar": "أسعار واضحة بدون مفاجآت"
  },
  "Technopolis & Startups B2B": {
    "en": "Technopolis & B2B Tech Startups",
    "ar": "تكنوبوليس والشركات الناشئة B2B"
  },
  "Temps de chargement < 1.2s": {
    "en": "Loading time < 1.2s",
    "ar": "سرعة التحميل أقل من 1.2 ثانية"
  },
  "Temps de chargement inférieur à 1 seconde sur smartphone": {
    "en": "Loading time under 1 second on mobile",
    "ar": "سرعة تحميل أقل من ثانية واحدة على الهواتف"
  },
  "Temps de chargement sous 1,2s et bouton WhatsApp direct pour supprimer toute friction dans la prise de contact commerciale.": {
    "en": "Loading speed under 1.2s and direct WhatsApp button eliminating all friction in customer outreach.",
    "ar": "سرعة تحميل تحت 1.2 ثانية وزر واتساب مباشر لإزالة كل حواجز التواصل التجاري."
  },
  "Toutes les garanties sur notre accompagnement dédié aux intermédiaires d'assurance.": {
    "en": "All guarantees on our dedicated growth support for insurance intermediaries.",
    "ar": "كافة الضمانات لمواكبة وسطاء ووكلاء التأمين."
  },
  "Toutes les informations clés pour réussir votre projet digital à Marrakech.": {
    "en": "Key insights to ensure the success of your digital project in Marrakech.",
    "ar": "المعلومات الأساسية لنجاح مشروعك الرقمي بمراكش."
  },
  "Toutes les informations nécessaires avant de démarrer votre projet web à Agadir.": {
    "en": "All essential information before kicking off your web project in Agadir.",
    "ar": "كافة المعلومات الضرورية قبل انطلاق مشروعك الرقمي بأكادير."
  },
  "Toutes les informations utiles pour réussir votre digitalisation à Tanger.": {
    "en": "Helpful insights to succeed in your digital transformation in Tangier.",
    "ar": "المعلومات المفيدة لنجاح رقمنة نشاطك بطنجة."
  },
  "Toutes les réalisations": {
    "en": "All Projects",
    "ar": "جميع الإنجازات"
  },
  "Trafic Chaud Intentionniste": {
    "en": "High-Intent Hot Traffic",
    "ar": "زيارات عالية النية والرغبة في الشراء"
  },
  "Transparence des résultats :": {
    "en": "Results Transparency:",
    "ar": "شفافية النتائج والأرقام:"
  },
  "Troisième Projet AssurLead • Octobre 2026": {
    "en": "Third AssurLead Project • October 2026",
    "ar": "المشروع الثالث لأسورليد • أكتوبر 2026"
  },
  "Tunnel WhatsApp direct": {
    "en": "Direct WhatsApp Funnel",
    "ar": "مسار واتساب المباشر"
  },
  "Tunnel de captation direct orienté mandats de vente, location et estimation": {
    "en": "Direct capture funnel geared towards sales mandates, rentals, and valuations",
    "ar": "مسار تحويل مباشر موجه لتوكيلات البيع، الكراء وطلبات التقدير"
  },
  "Tunnels WhatsApp & Devis": {
    "en": "WhatsApp Funnels & Quotes",
    "ar": "مسارات واتساب والتسعير الفوري"
  },
  "Tunnels ciblés pour mutuelles groupe des PME marocaines, régimes cadres et contrats d'épargne retraite défiscalisés.": {
    "en": "Targeted funnels for SME group health schemes, executive packages, and tax-advantaged retirement pensions.",
    "ar": "مسارات مخصصة للتأمين الصحي التكميلي للشركات، برامج الأطر وعقود التقاعد التكميلي المعفاة من الضرائب."
  },
  "Tétouan": {
    "en": "Tetouan",
    "ar": "تطوان"
  },
  "Un déroulé clair et sans mauvaise surprise, de la prise de contact à la mise en ligne opérationnelle.": {
    "en": "A clear, transparent roadmap from initial contact to operational launch.",
    "ar": "مراحل واضحة وخالية من المفاجآت، من أول تواصل حتى إطلاق الموقع."
  },
  "Un internaute qui tape « cabinet d'assurance Casablanca » a un besoin urgent : le taux de conversion SEO est 3 à 5 fois supérieur aux bannières passives.": {
    "en": "A user searching 'insurance agency Casablanca' has an immediate need: SEO conversion rates are 3 to 5 times higher than passive banner ads.",
    "ar": "المستخدم الذي يبحث عن 'وكالة تأمين بالدار البيضاء' لديه حاجة عاجلة: معدل تحويل السيو أكبر بـ 3 إلى 5 مرات من الإعلانات العشوائية."
  },
  "Un site chargé en moins de 1,2 seconde et adapté à tous les écrans rassure immédiatement vos clients et favorise le passage à l'action.": {
    "en": "A website loading under 1.2 seconds across all devices immediately reassures clients and drives action.",
    "ar": "موقع يفتح في أقل من 1.2 ثانية على كافة الشاشات يزرع الثقة الفورية ويحفز العملاء على الطلب."
  },
  "Un site soigné avec temps de chargement sous 1.2s renforce la réputation de votre cabinet auprès des partenaires institutionnels.": {
    "en": "A sleek website loading under 1.2s enhances your firm's credibility with institutional and corporate partners.",
    "ar": "موقع أنيق بسرعة تحميل تحت 1.2 ثانية يعزز سمعة ومكانة وكالتك أمام الشركاء والمؤسسات."
  },
  "Une grille tarifaire transparente pour tout le Maroc": {
    "en": "A transparent pricing grid across Morocco",
    "ar": "جدول أسعار شفاف وموحد لكافة مدن المغرب"
  },
  "Une visibilité Google pérenne pour capter les clients intentionnistes avant votre concurrence.": {
    "en": "Durable Google visibility to capture high-intent customers before competitors do.",
    "ar": "ظهور مستدام على غوغل لجلب العملاء المستعدين للشراء قبل منافسيك."
  },
  "Valorisation des garanties auto, santé et multirisques": {
    "en": "Highlighting auto, health, and multi-risk coverage benefits",
    "ar": "إبراز ضمانات تأمين السيارات، الصحة والتغطيات الشاملة"
  },
  "Valorisez votre savoir-faire fassi sur Internet": {
    "en": "Showcase your Fez heritage and craftsmanship on the web",
    "ar": "أبرز عراقة وجودة خبرات فاس على الإنترنت"
  },
  "Visibilité & Conversion": {
    "en": "Visibility & Conversion",
    "ar": "الرؤية والتحويل إلى مبيعات"
  },
  "Visibilité & Rentabilité": {
    "en": "Visibility & Profitability",
    "ar": "الظهور الرقمي والربحية"
  },
  "Visibilité Google": {
    "en": "Google Visibility",
    "ar": "الظهور على غوغل"
  },
  "Visibilité Internationale": {
    "en": "International Reach",
    "ar": "إشعاع وحضور دولي"
  },
  "Visibilité Stratégique": {
    "en": "Strategic Visibility",
    "ar": "ظهور استراتيجي مدروس"
  },
  "Vitesse & Code Optimisé": {
    "en": "Speed & Clean Code",
    "ar": "السرعة ونظافة الكود البرمجي"
  },
  "Vitesse & Esthétique": {
    "en": "Speed & Aesthetics",
    "ar": "السرعة والجمالية البصرية"
  },
  "Vitesse & Mobile": {
    "en": "Speed & Mobile First",
    "ar": "السرعة والتوافق مع الهواتف"
  },
  "Vitesse Mobile & Confiance": {
    "en": "Mobile Speed & Trust",
    "ar": "سرعة الهواتف وبناء الثقة"
  },
  "Vitesse Mobile Optimale": {
    "en": "Optimal Mobile Speed",
    "ar": "سرعة مثالية على الهواتف الذكية"
  },
  "Vitesse de chargement optimale, architecture épurée et conformité avec les critères algorithmiques stricts de Google.": {
    "en": "Optimal loading speed, sleek architecture, and full compliance with strict Google algorithm standards.",
    "ar": "سرعة تحميل مثالية، بنية تقنية نقية وتوافق كامل مع خوارزميات غوغل الصارمة."
  },
  "Vitrine Essentielle — 1 500 DH": {
    "en": "Essential Showcase — 1,500 MAD",
    "ar": "الواجهة الأساسية — 1,500 درهم"
  },
  "Vitrines B2B pour producteurs d'agrumes, primeurs, conserveurs et entreprises de l'Agropôle Souss-Massa.": {
    "en": "B2B web showcases for citrus growers, produce exporters, canners, and Souss-Massa Agropole firms.",
    "ar": "مواقع B2B لمنتجي الحوامض، البواكير، المعلبات ومقاولات القطب الزراعي بسوس ماسة."
  },
  "Vitrines institutionnelles valorisant les parcs machines, certifications ISO et capacités de production dans les zones TFZ et TAC.": {
    "en": "Corporate websites showcasing machinery fleets, ISO certifications, and industrial capacity in TFZ and TAC zones.",
    "ar": "مواقع مؤسسية تبرز الآلات، شهادات الأيزو ISO وطاقة الإنتاج في منطقتي TFZ وTAC."
  },
  "Votre site internet est votre premier commercial disponible 24h/24.": {
    "en": "Your website is your top sales executive working 24/7.",
    "ar": "موقعك الإلكتروني هو أفضل موظف مبيعات متاح 24/24 ساعة."
  },
  "Votre site valorise vos partenariats avec les grandes compagnies (AXA, Sanlam, Wafa, RMA) et assoit votre réputation d'intermédiaire agréé.": {
    "en": "Your website elevates partnerships with major insurers (AXA, Sanlam, Wafa, RMA) and consolidates your authorized broker standing.",
    "ar": "يبرز موقعك شراكاتك مع كبرى شركات التأمين (AXA، Sanlam، Wafa، RMA) ويرسخ مكانتك كوسيط معتمد."
  },
  "Véritable machine d'acquisition commerciale ou module e-commerce sécurisé pour entreprises ambitieuses au Maroc.": {
    "en": "True commercial acquisition engine or secure e-commerce hub for ambitious businesses in Morocco.",
    "ar": "محرك استقطاب تجاري حقيقي أو منصة تجارة إلكترونية آمنة للشركات الطموحة بالمغرب."
  },
  "WHATSAPP COMMERCIAL": {
    "en": "COMMERCIAL WHATSAPP",
    "ar": "واتساب التجاري المباشر"
  },
  "WhatsApp Agadir": {
    "en": "WhatsApp Agadir",
    "ar": "واتساب أكادير"
  },
  "WhatsApp Casablanca": {
    "en": "WhatsApp Casablanca",
    "ar": "واتساب الدار البيضاء"
  },
  "WhatsApp Fès": {
    "en": "WhatsApp Fez",
    "ar": "واتساب فاس"
  },
  "WhatsApp Maroc": {
    "en": "WhatsApp Morocco",
    "ar": "واتساب المغرب"
  },
  "WhatsApp Marrakech": {
    "en": "WhatsApp Marrakech",
    "ar": "واتساب مراكش"
  },
  "WhatsApp Rabat": {
    "en": "WhatsApp Rabat",
    "ar": "واتساب الرباط"
  },
  "WhatsApp SEO": {
    "en": "WhatsApp SEO",
    "ar": "سيو واتساب"
  },
  "WhatsApp Tanger": {
    "en": "WhatsApp Tangier",
    "ar": "واتساب طنجة"
  },
  "a automatisé ses cotations entrantes à Casablanca avec des retours sur investissement mesurables.": {
    "en": "automated inbound quote requests in Casablanca with measurable return on investment.",
    "ar": "قامت بأتمتة عروض الأسعار الواردة بالدار البيضاء مع عوائد استثمارية قابلة للقياس."
  },
  "audit de visibilité gratuit de 15 minutes": {
    "en": "free 15-minute visibility audit",
    "ar": "تدقيق مجاني للرؤية الرقمية مدته 15 دقيقة"
  },
  "avec balisage Schema.org LocalBusiness / ProfessionalService.": {
    "en": "with LocalBusiness / ProfessionalService Schema.org tagging.",
    "ar": "مع بيانات Schema.org المنظمة للمقاولات والخدمات المهنية."
  },
  "contact@assurleadcom.com": {
    "en": "contact@assurleadcom.com",
    "ar": "contact@assurleadcom.com"
  },
  "création de site web au Maroc": {
    "en": "website creation in Morocco",
    "ar": "إنشاء المواقع الإلكترونية بالمغرب"
  },
  "création de site web à Casablanca": {
    "en": "website creation in Casablanca",
    "ar": "إنشاء المواقع الإلكترونية بالدار البيضاء"
  },
  "création web au Maroc": {
    "en": "web design in Morocco",
    "ar": "تصميم المواقع بالمغرب"
  },
  "et de demandes de devis entrantes chaque semaine.": {
    "en": "and incoming quote requests every week.",
    "ar": "وطلبات تسعير واردة بشكل أسبوعي."
  },
  "et notre catalogue de": {
    "en": "and our catalogue of",
    "ar": "وكتالوجنا لـ"
  },
  "et notre couverture de": {
    "en": "and our coverage of",
    "ar": "وتغطيتنا لـ"
  },
  "et notre service global de": {
    "en": "and our global service of",
    "ar": "وخدمتنا الشاملة لـ"
  },
  "et notre service national de": {
    "en": "and our national service of",
    "ar": "وخدمتنا الوطنية لـ"
  },
  "grâce au SEO local.": {
    "en": "through local SEO.",
    "ar": "بفضل السيو المحلي."
  },
  "moteur d'acquisition de leads organiques": {
    "en": "organic lead generation engine",
    "ar": "محرك استقطاب عملاء عضوي"
  },
  "pour analyser votre présence sur Google et déployer un": {
    "en": "to analyze your Google presence and deploy a",
    "ar": "لتحليل حضورك على غوغل وإطلاق"
  },
  "pour votre activité au Maroc.": {
    "en": "for your business in Morocco.",
    "ar": "لنشاطك التجاري بالمغرب."
  },
  "qui attire des prospects en continu sans payer au clic.": {
    "en": "attracting prospects continuously without paying per click.",
    "ar": "يجلب عملاء مستمرين دون دفع مقابل كل نقرة."
  },
  "sur les recherches à forte intention d'achat (Casablanca, Rabat, Marrakech...).": {
    "en": "on high-intent commercial queries (Casablanca, Rabat, Marrakech...).",
    "ar": "في عمليات البحث ذات النية الشرائية العالية (الدار البيضاء، الرباط، مراكش...)."
  },
  "Échangeons par WhatsApp ou par téléphone sur vos objectifs de visibilité et recevez votre devis personnalisé en 24h.": {
    "en": "Let's connect via WhatsApp or phone regarding your goals and get your custom quote within 24 hours.",
    "ar": "تواصل معنا عبر واتساب أو الهاتف لمناقشة أهدافك واستلم عرضك المخصص في 24 ساعة."
  },
  "Échangeons sur vos branches prioritaires (santé, flotte, RC Pro) pour concevoir votre tunnel d'acquisition dédié.": {
    "en": "Let's review your core lines (health, motor fleet, professional liability) to build your dedicated client funnel.",
    "ar": "دعنا نناقش قطاعاتك ذات الأولوية (الصحة، أساطيل السيارات، التأمين المهني) لتصميم مسارك المخصص."
  },
  "Échanger sur un projet similaire": {
    "en": "Discuss a similar project",
    "ar": "ناقش مشروعاً مشابهاً"
  },
  "Étude de Cas El Omrani": {
    "en": "El Omrani Case Study",
    "ar": "دراسة حالة العمراني"
  },
  "Étude de votre positionnement au Maroc, sélection des intentions de recherche à forte rentabilité et cadrage de l'arborescence.": {
    "en": "Analysis of your positioning in Morocco, high-profit search query targeting, and sitemap structuring.",
    "ar": "دراسة تموضعك بالمغرب، واختيار الكلمات الأكثر ربحية وتأطير هيكل الموقع."
  },
  "Évaluez le potentiel de visibilité de votre entreprise sur Google en 15 minutes d'échange stratégique.": {
    "en": "Assess your business Google visibility potential in 15 minutes of strategic consultation.",
    "ar": "قيّم إمكانيات ظهور شركتك على غوغل خلال 15 دقيقة من التشاور الاستراتيجي."
  },
  "à l'issue de la première période d'indexation.": {
    "en": "upon completion of the initial indexation phase.",
    "ar": "مع اختتام فترة الفهرسة الأولى."
  },
  "— Flux continu sans payer au clic": {
    "en": "— Continuous flow without pay-per-click",
    "ar": "— تدفق مستمر دون دفع بالنقرة"
  },
  "Pourquoi le SEO à Tanger accélère vos opportunités B2B": {
    "en": "Why SEO in Tangier accelerates your B2B opportunities",
    "ar": "لماذا يسرّع السيو بطنجة فرص أعمالك مع الشركات B2B"
  },
  "Pourquoi le référencement Google à Rabat est un impératif": {
    "en": "Why Google SEO in Rabat is an absolute imperative",
    "ar": "لماذا يعد سيو غوغل بالرباط ضرورة حتمية للنجاح"
  },
  "Pourquoi une visibilité Google est capitale pour les professionnels de Fès": {
    "en": "Why Google visibility is essential for Fez businesses",
    "ar": "لماذا يعد الظهور على غوغل حاسماً للمهنيين بفاس"
  },
  "Preuve par les Faits": {
    "en": "Fact-Based Proof",
    "ar": "الإثبات بالأرقام والنتائج"
  },
  "Processus & Méthodologie": {
    "en": "Process & Methodology",
    "ar": "المسار والمنهجية"
  },
  "Projet livré en Octobre 2026": {
    "en": "Project delivered in October 2026",
    "ar": "مشروع منجز في أكتوبر 2026"
  },
  "Projet livré en Septembre 2026": {
    "en": "Project delivered in September 2026",
    "ar": "مشروع منجز في شتنبر 2026"
  },
  "Projet récemment déployé en septembre 2026. Volumes de trafic et conversions mensuelles :": {
    "en": "Project recently launched in September 2026. Monthly traffic volumes and conversions:",
    "ar": "مشروع أُطلق حديثاً في شتنبر 2026. حجم الزيارات والتحويلات الشهرية:"
  },
  "Prospects qualifiés": {
    "en": "Qualified prospects",
    "ar": "عملاء محتملون مؤهلون"
  },
  "Présentation claire de vos agréments légaux, garanties de service et références clients pour convaincre les directions d'achat européennes.": {
    "en": "Clear presentation of your legal authorizations, warranties, and client references to convince European procurement heads.",
    "ar": "عرض واضح للاعتمادات القانونية وضمانات الخدمة وتجارب العملاء لإقناع مسؤولي المشتريات الأوروبيين."
  }
};

document.addEventListener('DOMContentLoaded', () => {
    // --- MULTILINGUAL ENGINE ---

    const translateUntaggedElements = (lang) => {
        const candidates = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, button, strong, li, td, th');
        candidates.forEach(el => {
            if (el.hasAttribute('data-i18n')) return;
            if (el.children.length === 0) {
                const raw = el.textContent.trim();
                if (raw.length >= 3 && fullTextDictionary[raw]) {
                    if (!el.getAttribute('data-orig-text')) {
                        el.setAttribute('data-orig-text', raw);
                    }
                    const orig = el.getAttribute('data-orig-text');
                    if (lang === 'fr') {
                        el.textContent = orig;
                    } else if (fullTextDictionary[orig] && fullTextDictionary[orig][lang]) {
                        el.textContent = fullTextDictionary[orig][lang];
                    }
                }
            } else {
                for (let i = 0; i < el.childNodes.length; i++) {
                    const child = el.childNodes[i];
                    if (child.nodeType === Node.TEXT_NODE) {
                        const raw = child.nodeValue.trim();
                        if (raw.length >= 3 && fullTextDictionary[raw]) {
                            const attrName = 'data-orig-node-' + i;
                            if (!el.getAttribute(attrName)) {
                                el.setAttribute(attrName, raw);
                            }
                            const orig = el.getAttribute(attrName);
                            if (lang === 'fr') {
                                child.nodeValue = child.nodeValue.replace(child.nodeValue.trim(), orig);
                            } else if (fullTextDictionary[orig] && fullTextDictionary[orig][lang]) {
                                child.nodeValue = child.nodeValue.replace(child.nodeValue.trim(), fullTextDictionary[orig][lang]);
                            }
                        }
                    }
                }
            }
        });
    };

    const setLanguage = (lang) => {
        document.documentElement.lang = lang;
        if (lang === 'ar') {
            document.body.setAttribute('dir', 'rtl');
        } else {
            document.body.setAttribute('dir', 'ltr');
        }

        // 1. Translate elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key] && translations[key][lang]) {
                el.innerHTML = translations[key][lang];
            }
        });

        // 2. Translate elements with data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[key] && translations[key][lang]) {
                el.placeholder = translations[key][lang];
            }
        });

        // 2b. Translate untagged elements across all pages
        translateUntaggedElements(lang);

        // 3. Update current language button UI
        const btnTextMap = { fr: 'FR', en: 'EN', ar: 'العربية' };
        const btnSpan = document.querySelector('#lang-btn-current span');
        if (btnSpan) btnSpan.textContent = btnTextMap[lang] || lang.toUpperCase();

        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
        });

        // 4. Update dynamic offer prices
        const offerPrices = {
            starter: {
                fr: "2 000 <span>DH</span>",
                en: "2,000 <span>DH</span>",
                ar: "2 000 <span>درهم</span>"
            },
            growth: {
                fr: "4 500 <span>DH</span>",
                en: "4,500 <span>DH</span>",
                ar: "4 500 <span>درهم</span>"
            },
            lead_engine: {
                fr: "8 000 <span>DH</span>",
                en: "8,000 <span>DH</span>",
                ar: "8 000 <span>درهم</span>"
            },
            acquisition: {
                fr: "12 000 <span>DH+</span>",
                en: "12,000 <span>DH+</span>",
                ar: "12 000 <span>درهم+</span>"
            }
        };
        const keys = ['starter', 'growth', 'lead_engine', 'acquisition'];
        keys.forEach(k => {
            const el = document.getElementById(`offer_${k}_price`);
            if (el) {
                el.innerHTML = offerPrices[k][lang] || offerPrices[k].fr;
            }
        });

        const roiCostEl = document.getElementById('roi-cost-val');
        if (roiCostEl) {
            roiCostEl.innerText = lang === 'ar' ? '28 درهم' : '28 MAD';
        }
        const roiBasketEl = document.getElementById('roi-basket-val');
        if (roiBasketEl) {
            roiBasketEl.innerText = lang === 'ar' ? '2,800 درهم' : '2,800 MAD';
        }

        // 5. Update footer SEO tags dynamically
        const footerTagMap = {
            "Création site web Casablanca": { en: "Casablanca Website Creation", ar: "إنشاء المواقع بالدار البيضاء" },
            "Création site web Maroc": { en: "Morocco Website Creation", ar: "إنشاء المواقع بالمغرب" },
            "Création site web Rabat": { en: "Rabat Website Creation", ar: "إنشاء المواقع بالرباط" },
            "Création site web Marrakech": { en: "Marrakech Website Creation", ar: "إنشاء المواقع بمراكش" },
            "Création site web Tanger": { en: "Tangier Website Creation", ar: "إنشاء المواقع بطنجة" },
            "Création site web Fès": { en: "Fez Website Creation", ar: "إنشاء المواقع بفاس" },
            "Création site web Agadir": { en: "Agadir Website Creation", ar: "إنشاء المواقع بأكادير" },
            "Référencement SEO Casablanca": { en: "Casablanca Google SEO", ar: "سيو الدار البيضاء" },
            "Leads Assurance Maroc": { en: "Morocco Insurance Leads", ar: "عملاء التأمين بالمغرب" },
            "Réalisations & Études de Cas": { en: "Portfolio & Case Studies", ar: "الإنجازات ودراسات الحالة" },
            "Processus & Méthodologie": { en: "Process & Methodology", ar: "المسار والمنهجية" },
            "Diagnostic de Visibilité": { en: "Visibility Diagnostic", ar: "تشخيص الرؤية الرقمية" },
            "Notre Approche Digitale": { en: "Our Digital Approach", ar: "منهجيتنا الرقمية" }
        };
        document.querySelectorAll('.footer-seo-tags a span').forEach(span => {
            const txt = (span.getAttribute('data-orig-text') || span.textContent).trim();
            if (!span.getAttribute('data-orig-text')) {
                span.setAttribute('data-orig-text', txt);
            }
            if (lang === 'fr') {
                span.textContent = span.getAttribute('data-orig-text');
            } else if (footerTagMap[txt] && footerTagMap[txt][lang]) {
                span.textContent = footerTagMap[txt][lang];
            }
        });

        // 6. Update Page Title dynamically
        const pageTitleMap = {
            "Notre Processus": { en: "Our 9-Step Acquisition Funnel | ASSURLEAD", ar: "مسارنا التجاري في 9 خطوات | وكالة أسورليد" },
            "Casablanca": { en: "Website Creation in Casablanca | ASSURLEAD", ar: "إنشاء المواقع الإلكترونية في الدار البيضاء | أسورليد" },
            "Rabat": { en: "Website Creation in Rabat | ASSURLEAD", ar: "إنشاء المواقع في الرباط | أسورليد" },
            "Marrakech": { en: "Website Creation in Marrakech | ASSURLEAD", ar: "إنشاء المواقع في مراكش | أسورليد" },
            "Tanger": { en: "Website Creation in Tangier | ASSURLEAD", ar: "إنشاء المواقع في طنجة | أسورليد" },
            "Fès": { en: "Website Creation in Fez | ASSURLEAD", ar: "إنشاء المواقع في فاس | أسورليد" },
            "Agadir": { en: "Website Creation in Agadir | ASSURLEAD", ar: "إنشاء المواقع في أكادير | أسورليد" },
            "Maroc": { en: "Website Creation in Morocco | ASSURLEAD", ar: "إنشاء المواقع في المغرب | أسورليد" },
            "Référencement SEO": { en: "Google SEO in Casablanca | ASSURLEAD", ar: "السيو والتموضع على غوغل بالدار البيضاء | أسورليد" },
            "Génération de Leads": { en: "Insurance Leads in Morocco | ASSURLEAD", ar: "جلب عملاء التأمين في المغرب | أسورليد" },
            "Diagnostic": { en: "Google Visibility Diagnostic | ASSURLEAD", ar: "تشخيص الرؤية الرقمية على غوغل | أسورليد" },
            "Réalisations": { en: "Client Portfolio & Case Studies | ASSURLEAD", ar: "إنجازاتنا ودراسات الحالة | أسورليد" }
        };
        const curTitle = document.title;
        for (const [k, v] of Object.entries(pageTitleMap)) {
            if (curTitle.includes(k)) {
                if (lang === 'en') document.title = v.en;
                else if (lang === 'ar') document.title = v.ar;
                break;
            }
        }

        // Save selection
        localStorage.setItem('assurlead_lang', lang);
        
        // Trigger ROI calculation
        try {
            if (typeof updateROI === 'function') {
                updateROI();
            }
        } catch(e) {}

        // Trigger Ticker update
        try {
            if (typeof updateTickerDOM === 'function') {
                updateTickerDOM();
            }
        } catch(e) {}
    };

    // Toggle Language Dropdown
    const langBtn = document.getElementById('lang-btn-current');
    const langDropdown = document.getElementById('lang-dropdown');
    
    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('active');
        });
        
        document.addEventListener('click', () => {
            langDropdown.classList.remove('active');
        });
        
        langDropdown.querySelectorAll('.lang-option').forEach(opt => {
            opt.addEventListener('click', (e) => {
                const selectedLang = opt.getAttribute('data-lang');
                setLanguage(selectedLang);
                langDropdown.classList.remove('active');
            });
        });
    }

    // Load Saved Language
    const savedLang = localStorage.getItem('assurlead_lang') || 'fr';
    setTimeout(() => {
        setLanguage(savedLang);
    }, 100);

    // --- UTILS ---
    const setupResizeHandler = (container, camera, renderer) => {
        let animationFrameId = null;
        const observer = new ResizeObserver(() => {
            if (animationFrameId) {
                window.cancelAnimationFrame(animationFrameId);
            }
            animationFrameId = window.requestAnimationFrame(() => {
                if (!container) return;
                const width = container.clientWidth;
                const height = container.clientHeight;
                if (width === 0 || height === 0) return;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height, false);
            });
        });
        observer.observe(container);
        return observer;
    };

    // --- HERO & CONTACT 3D SCENES ---
    const init3DHeroStyle = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const geometry = new THREE.IcosahedronGeometry(2, 1);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x00ff00, 
            wireframe: true,
            emissive: 0x00ff00,
            emissiveIntensity: 0.8
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 500;
        const posArray = new Float32Array(particlesCount * 3);
        const randArray = new Float32Array(particlesCount);
        
        for(let i=0; i<particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }
        for(let i=0; i<particlesCount; i++) {
            randArray[i] = Math.random();
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({ size: 0.02, color: 0x00ff00 });
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        const light = new THREE.PointLight(0x00ff00, 100);
        light.position.set(5, 5, 5);
        scene.add(light);
        scene.add(new THREE.AmbientLight(0xffffff, 0.2));

        camera.position.z = 5;

        let frameId;
        function animate() {
            frameId = requestAnimationFrame(animate);
            mesh.rotation.x += 0.002;
            mesh.rotation.y += 0.003;
            particlesMesh.rotation.y += 0.001;
            renderer.render(scene, camera);
        }
        animate();

        setupResizeHandler(container, camera, renderer);
    };

    // --- 3D ROI SCENE ---
    let roiBar;
    let currencySymbols = [];
    const initROIScene = () => {
        const container = document.getElementById('roi-canvas-container');
        if (!container) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x050505);
        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Grid
        const grid = new THREE.GridHelper(20, 20, 0x00ff00, 0x111111);
        grid.position.y = -2;
        scene.add(grid);

        // Single Hexagonal Neon Pillar
        const hexSegments = 6;
        const outerGeometry = new THREE.CylinderGeometry(1.2, 1.2, 4, hexSegments);
        const innerGeometry = new THREE.CylinderGeometry(0.6, 0.6, 4, hexSegments);
        
        const outerMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x00ff00, 
            transparent: true, 
            opacity: 0.2,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const innerMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x00ff00, 
            emissive: 0x00ff00, 
            emissiveIntensity: 1
        });

        roiBar = new THREE.Group();
        const outerMesh = new THREE.Mesh(outerGeometry, outerMaterial);
        const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
        
        const wireframeGeometry = new THREE.EdgesGeometry(outerGeometry);
        const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.8 });
        const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
        
        roiBar.add(outerMesh);
        roiBar.add(innerMesh);
        roiBar.add(wireframe);
        
        roiBar.position.y = -2;
        roiBar.scale.y = 0.1;
        
        scene.add(roiBar);

        // Tornado Currency Symbols
        const createSymbolTexture = (text) => {
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, 128, 128);
            ctx.font = 'bold 80px Inter, sans-serif';
            ctx.fillStyle = '#00ff00';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 64, 64);
            return new THREE.CanvasTexture(canvas);
        };

        const madTexture = createSymbolTexture('MAD');
        const dollarTexture = createSymbolTexture('$');

        for (let i = 0; i < 40; i++) {
            const sprMat = new THREE.SpriteMaterial({ 
                map: i % 2 === 0 ? madTexture : dollarTexture,
                transparent: true,
                opacity: 0.8
            });
            const sprite = new THREE.Sprite(sprMat);
            
            const angle = Math.random() * Math.PI * 2;
            const radius = 2 + Math.random() * 4;
            const height = (Math.random() - 0.5) * 10;
            
            sprite.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
            sprite.scale.set(0.5, 0.5, 1);
            sprite.userData = {
                angle, radius,
                speed: 0.01 + Math.random() * 0.02,
                vSpeed: (Math.random() - 0.5) * 0.01
            };
            
            scene.add(sprite);
            currencySymbols.push(sprite);
        }

        const light = new THREE.PointLight(0x00ff00, 50);
        light.position.set(5, 5, 5);
        scene.add(light);
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));

        camera.position.set(0, 5, 12);
        camera.lookAt(0, 0, 0);

        function animate() {
            requestAnimationFrame(animate);
            currencySymbols.forEach(symbol => {
                symbol.userData.angle += symbol.userData.speed;
                symbol.position.x = Math.cos(symbol.userData.angle) * symbol.userData.radius;
                symbol.position.z = Math.sin(symbol.userData.angle) * symbol.userData.radius;
                symbol.position.y += symbol.userData.vSpeed;
                
                if (symbol.position.y > 5) symbol.position.y = -5;
                if (symbol.position.y < -5) symbol.position.y = 5;
            });
            renderer.render(scene, camera);
        }
        animate();

        setupResizeHandler(container, camera, renderer);
    };

    // ROI Calculator Logic
    const budgetInput = document.getElementById('budget-input');
    const convInput = document.getElementById('conv-input');
    const basketInput = document.getElementById('basket-input');
    const budgetVal = document.getElementById('budget-val');
    const convVal = document.getElementById('conv-val');
    const basketVal = document.getElementById('basket-val');
    const basketSummaryVal = document.getElementById('basket-summary-val');
    const revenueDisplay = document.getElementById('revenue-display');
    const roiDisplay = document.getElementById('roi-display');
    const leadsCount = document.getElementById('leads-count');
    const salesCount = document.getElementById('sales-count');
    const simWhatsappBtn = document.getElementById('sim-whatsapp-share');

    const updateROI = () => {
        if (!budgetInput || !convInput) return;
        const budget = parseInt(budgetInput.value);
        const conv = parseInt(convInput.value);
        const basket = basketInput ? parseInt(basketInput.value) : 2800;
        
        // Benchmark Assurance Maroc: CPL moyen ~28 MAD, Panier moyen (Prime) configurable
        const leads = Math.floor(budget / 28);
        const sales = Math.floor(leads * (conv / 100));
        const revenue = sales * basket;
        const roi = budget > 0 ? ((revenue - budget) / budget) * 100 : 0;

        const lang = localStorage.getItem('assurlead_lang') || 'fr';
        const currencySuffix = lang === 'ar' ? ' درهم' : ' MAD';

        if (budgetVal) budgetVal.innerText = budget.toLocaleString() + currencySuffix;
        if (convVal) convVal.innerText = conv + '%';
        if (basketVal) basketVal.innerText = basket.toLocaleString() + currencySuffix;
        if (basketSummaryVal) basketSummaryVal.innerText = basket.toLocaleString() + currencySuffix;
        if (revenueDisplay) revenueDisplay.innerText = Math.floor(revenue).toLocaleString() + currencySuffix;
        if (roiDisplay) roiDisplay.innerText = '+' + Math.floor(roi) + '%';
        
        if (leadsCount) leadsCount.innerText = leads.toLocaleString();
        if (salesCount) salesCount.innerText = sales.toLocaleString();

        // Update Dynamic WhatsApp message
        if (simWhatsappBtn) {
            const encodedMsg = encodeURIComponent(
                `Bonjour AssurLead, j'ai simulé mon acquisition en ligne :\n` +
                `• Budget Mensuel : ${budget.toLocaleString()} MAD\n` +
                `• Leads Qualifiés Estimés : ${leads.toLocaleString()} demandes\n` +
                `• Contrats Signés Estimés : ${sales.toLocaleString()}\n` +
                `• CA Potentiel : ${Math.floor(revenue).toLocaleString()} MAD (+${Math.floor(roi)}% ROI)\n\n` +
                `Je souhaite valider ce plan d'acquisition pour mon agence.`
            );
            simWhatsappBtn.href = `https://wa.me/212707573162?text=${encodedMsg}`;
        }

        // Update 3D Bar
        if (roiBar) {
            const targetHeight = Math.max(0.1, (revenue / 60000) * 3);
            roiBar.scale.y = targetHeight;
            roiBar.position.y = -2 + (targetHeight * 2); 
            
            // Update materials
            const outerMesh = roiBar.children[0];
            const innerMesh = roiBar.children[1];
            if (innerMesh && innerMesh.material) {
                innerMesh.material.emissiveIntensity = 0.5 + (targetHeight / 2);
            }
            if (outerMesh && outerMesh.material) {
                outerMesh.material.opacity = 0.1 + (targetHeight / 10);
            }
        }

        // Update Tornado Intensity
        if (currencySymbols.length > 0) {
            const intensity = Math.min(2, revenue / 30000);
            currencySymbols.forEach(symbol => {
                symbol.material.opacity = 0.3 + (intensity * 0.3);
                symbol.scale.set(0.3 + intensity * 0.2, 0.3 + intensity * 0.2, 1);
            });
        }
    };

    if (budgetInput) budgetInput.addEventListener('input', updateROI);
    if (convInput) convInput.addEventListener('input', updateROI);
    if (basketInput) basketInput.addEventListener('input', updateROI);
    // Initial run to populate values
    updateROI();

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // Mobile Menu
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                document.body.style.overflow = '';
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            });
        });
    }

    // Modal
    const modal = document.getElementById('cta-modal');
    const closeModal = document.getElementById('close-modal');
    if (modal && closeModal) {
        const showModal = () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
        const hideModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };
        closeModal.addEventListener('click', hideModal);
        modal.querySelector('.modal-backdrop').addEventListener('click', hideModal);

        let modalTriggered = false;
        const triggerModal = () => {
            if (!modalTriggered) {
                showModal();
                modalTriggered = true;
                window.removeEventListener('click', triggerModal);
            }
        };
        window.addEventListener('click', triggerModal);
        setTimeout(() => { if (!modalTriggered) showModal(); }, 8000);
    }

    // --- CONFETTI CELEBRATION ENGINE ---
    const triggerConfetti = () => {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '999999';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }, { once: true });

        const colors = [
            '#00ff41', // Neon Green
            '#003300', // Deep Brand Green
            '#ffffff', // Crisp White
            '#00ffff', // Electric Cyan
            '#10b981', // Emerald Green
            '#34d399'  // Pastel Mint Green
        ];

        const particles = [];
        const particleCount = 120;

        // Cannon 1: Bottom-Left shooting up-right
        for (let i = 0; i < particleCount / 2; i++) {
            particles.push({
                x: 0,
                y: height,
                angle: -Math.PI / 4 + (Math.random() - 0.5) * 0.4,
                speed: 14 + Math.random() * 14,
                gravity: 0.45,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 8,
                color: colors[Math.floor(Math.random() * colors.length)],
                width: 8 + Math.random() * 8,
                height: 12 + Math.random() * 12,
                opacity: 1,
                friction: 0.94
            });
        }

        // Cannon 2: Bottom-Right shooting up-left
        for (let i = 0; i < particleCount / 2; i++) {
            particles.push({
                x: width,
                y: height,
                angle: -3 * Math.PI / 4 + (Math.random() - 0.5) * 0.4,
                speed: 14 + Math.random() * 14,
                gravity: 0.45,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 8,
                color: colors[Math.floor(Math.random() * colors.length)],
                width: 8 + Math.random() * 8,
                height: 12 + Math.random() * 12,
                opacity: 1,
                friction: 0.94
            });
        }

        let animationFrameId;
        const update = () => {
            ctx.clearRect(0, 0, width, height);

            let activeParticles = 0;

            particles.forEach(p => {
                if (p.opacity <= 0) return;

                activeParticles++;

                // Physics update
                p.x += Math.cos(p.angle) * p.speed;
                p.y += Math.sin(p.angle) * p.speed;
                p.speed *= p.friction;
                p.y += p.gravity;
                p.rotation += p.rotationSpeed;

                // Fade out as they fall down
                if (p.y > height * 0.55) {
                    p.opacity -= 0.012;
                }

                if (p.opacity > 0) {
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation * Math.PI / 180);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.opacity;
                    ctx.shadowColor = p.color;
                    ctx.shadowBlur = 4;
                    ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
                    ctx.restore();
                }
            });

            if (activeParticles > 0) {
                animationFrameId = requestAnimationFrame(update);
            } else {
                cancelAnimationFrame(animationFrameId);
                canvas.remove();
            }
        };

        update();
    };

    // --- FORM HANDLING ---
    const initQuestionnaire = () => {
        const form = document.getElementById('questionnaire');
        if (!form) return;

        const steps = form.querySelectorAll('.form-step');
        const dots = document.querySelectorAll('.step-dot');
        let currentStep = 0;

        const updateSteps = () => {
            steps.forEach((s, i) => {
                const isActive = i === currentStep;
                s.classList.toggle('hidden', !isActive);
                if (isActive) {
                    s.classList.add('fade-in');
                    const firstInput = s.querySelector('input, textarea');
                    if (firstInput) firstInput.focus();
                }
            });
            dots.forEach((d, i) => d.classList.toggle('active', i <= currentStep));
        };

        const validateStep = () => {
            const inputs = steps[currentStep].querySelectorAll('input, textarea');
            let valid = true;
            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    valid = false;
                    input.classList.add('error-shake');
                    input.style.borderColor = 'var(--error-red, #ff4136)';
                    setTimeout(() => input.classList.remove('error-shake'), 500);
                } else {
                    input.style.borderColor = '';
                }
            });
            return valid;
        };

        form.querySelectorAll('.next-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (validateStep() && currentStep < steps.length - 1) {
                    currentStep++;
                    updateSteps();
                }
            });
        });

        form.querySelectorAll('.prev-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentStep > 0) {
                    currentStep--;
                    updateSteps();
                }
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!validateStep()) return;
            
            // Honeypot validation
            const honeyInput = form.querySelector('[name="_honey"]') || form.querySelector('[name="website"]');
            if (honeyInput && honeyInput.value.trim() !== "") {
                return; // Bot detected, quietly abort
            }

            const nameVal = (form.querySelector('[name="name"]')?.value || '').trim();
            const emailVal = (form.querySelector('[name="email"]')?.value || '').trim();
            const phoneVal = (form.querySelector('[name="phone"]')?.value || '').trim();
            const agencyVal = (form.querySelector('[name="agency"]')?.value || '').trim();
            const cityVal = (form.querySelector('[name="city"]')?.value || '').trim();
            const messageVal = (form.querySelector('[name="message"]')?.value || '').trim();

            // JS validation: phone format check
            const phoneInput = form.querySelector('[name="phone"]');
            const cleanPhone = phoneVal.replace(/[^0-9+]/g, '');
            if (cleanPhone.length < 8) {
                if (phoneInput) {
                    phoneInput.classList.add('error-shake');
                    phoneInput.style.borderColor = 'var(--error-red, #ff4136)';
                    setTimeout(() => phoneInput.classList.remove('error-shake'), 500);
                }
                return;
            }

            // Trigger visual feedback and redirect to WhatsApp with prefilled message
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                const lang = localStorage.getItem('assurlead_lang') || 'fr';
                const redirectText = {
                    fr: '<i class="fab fa-whatsapp"></i> REDIRECTION WHATSAPP...',
                    en: '<i class="fab fa-whatsapp"></i> REDIRECTING TO WHATSAPP...',
                    ar: '<i class="fab fa-whatsapp"></i> تحويل إلى واتساب...'
                };
                submitBtn.innerHTML = redirectText[lang] || redirectText.fr;
            }

            triggerConfetti();

            const waText = `*Nouvelle Demande de Contact (Formulaire)*%0A%0A` +
                           `👤 *Nom :* ${encodeURIComponent(nameVal)}%0A` +
                           `🏢 *Entreprise/Agence :* ${encodeURIComponent(agencyVal)}%0A` +
                           `📍 *Ville :* ${encodeURIComponent(cityVal || 'Non précisée')}%0A` +
                           `📱 *Tél :* ${encodeURIComponent(phoneVal)}%0A` +
                           `✉️ *Email :* ${encodeURIComponent(emailVal)}%0A` +
                           `💬 *Message :* ${encodeURIComponent(messageVal || 'Demande de renseignement')}`;

            setTimeout(() => {
                window.location.href = `https://wa.me/212707573162?text=${waText}`;
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            }, 600);
        });
    };

    // Projects Navigation -> Redirect to dedicated page
    document.querySelectorAll('a[href="#projets"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/realisations.html';
        });
    });

    // Dynamic Hero Dashboard
    const updateHeroDashboard = () => {
        const dashboard = document.querySelector('.hero-visual');
        if (!dashboard || dashboard.offsetParent === null) return;

        const bars = document.querySelectorAll('.chart .bar');
        const leadStat = document.querySelector('.stat-box .stat-val.neon');
        
        if (bars.length > 0) {
            bars.forEach(bar => {
                const height = Math.floor(Math.random() * 60) + 40;
                bar.style.height = height + '%';
            });
        }
        
        if (leadStat) {
            const current = parseInt(leadStat.textContent.replace('+', ''));
            const next = current + (Math.random() > 0.7 ? 1 : 0);
            leadStat.textContent = '+' + next;
        }
    };
    setInterval(updateHeroDashboard, 5000);

    // --- CHATBOT YACINE & CONTEXT ENGINE ---
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');
    const chatSuggestions = document.getElementById('chat-suggestions');

    // Context tracking for proactive suggestions
    let chatHistory = [];
    let userInteractions = {
        askedPricing: false,
        viewedROI: false,
        viewedProjects: false,
        isAgent: false
    };

    const showSuggestions = (type = 'initial') => {
        if (!chatSuggestions) return;
        chatSuggestions.innerHTML = '';
        
        const lang = localStorage.getItem('assurlead_lang') || 'fr';
        const activeSugs = multiLangSuggestions[lang] || multiLangSuggestions.fr;
        const list = activeSugs[type] || activeSugs.initial;
        
        list.forEach(text => {
            const btn = document.createElement('button');
            btn.className = 'suggestion-btn';
            btn.textContent = text;
            btn.onclick = () => {
                chatInput.value = text;
                handleChat();
            };
            chatSuggestions.appendChild(btn);
        });
        
        chatSuggestions.classList.remove('hidden');
    };

    if (chatToggle && chatWindow && chatClose) {
        chatToggle.addEventListener('click', () => {
            chatWindow.classList.toggle('hidden');
            if (!chatWindow.classList.contains('hidden')) {
                chatInput.focus();
                if (chatMessages.children.length === 0) {
                    const lang = localStorage.getItem('assurlead_lang') || 'fr';
                    const activeWelcome = chatWelcomeMessages[lang] || chatWelcomeMessages.fr;
                    addMessage(activeWelcome, 'bot');
                }
                showSuggestions('initial');
            }
        });

        chatClose.addEventListener('click', () => {
            chatWindow.classList.add('hidden');
        });
    }

    const addMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const handleChat = async () => {
        if (!chatInput) return;
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';
        chatHistory.push({ role: "user", parts: [{ text }] });
        chatSuggestions.classList.add('hidden');

        // Interaction Tracking for better AI context
        const lowerText = text.toLowerCase();
        if (/tarif|prix|mad|combien|coût|سعر|باقة/.test(lowerText)) userInteractions.askedPricing = true;
        if (/projet|exemple|réalisation|portfolio|مشروع/.test(lowerText)) userInteractions.viewedProjects = true;
        if (/roi|calcul|simulateur|prévision|أرباح/.test(lowerText)) userInteractions.viewedROI = true;

        const lang = localStorage.getItem('assurlead_lang') || 'fr';

        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'bot', 'loading');
        loadingDiv.textContent = botThinkingMessages[lang] || botThinkingMessages.fr;
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            let apiKey = null;

            // 1. Try URL parameters
            try {
                const urlParams = new URLSearchParams(window.location.search);
                apiKey = urlParams.get('api_key') || urlParams.get('gemini_api_key') || urlParams.get('apikey');
            } catch (e) {}

            // 2. Try localStorage
            if (!apiKey) {
                try {
                     apiKey = localStorage.getItem('VITE_GEMINI_API_KEY') || localStorage.getItem('GEMINI_API_KEY');
                } catch (e) {}
            }

            // 3. Try Vite import.meta.env
            if (!apiKey) {
                try {
                    apiKey = import.meta.env.VITE_GEMINI_API_KEY;
                } catch (e) {}
            }

            // 4. Try legacy process.env
            if (!apiKey) {
                try {
                     apiKey = process.env.GEMINI_API_KEY;
                } catch (e) {}
            }

            if (!apiKey) {
                const missingKeyErr = {
                    fr: "Clé API Gemini manquante. Veuillez configurer la variable d'environnement VITE_GEMINI_API_KEY, utiliser le localStorage ou joindre ?api_key=VOTRE_CLE à l'URL.",
                    en: "Gemini API Key is missing. Please configure VITE_GEMINI_API_KEY in your environment, use localStorage, or append ?api_key=YOUR_KEY to the url.",
                    ar: "مفتاح واجهة برمجة تطبيقات Gemini مفقود. يرجى تهيئة متغير البيئة VITE_GEMINI_API_KEY، أو استخدام التخزين المحلي، أو إضافة ?api_key=YOUR_KEY إلى عنوان URL."
                };
                throw new Error(missingKeyErr[lang] || missingKeyErr.fr);
            }

            const ai = new GoogleGenAI({ 
                apiKey: apiKey,
                httpOptions: {
                    headers: {
                        'User-Agent': 'aistudio-build'
                    }
                }
            });

            const activeInstructions = systemInstructions[lang] || systemInstructions.fr;

            const response = await ai.models.generateContent({
                model: "gemini-3.5-flash",
                contents: chatHistory,
                config: {
                    systemInstruction: `${activeInstructions}\nContexte additionnel : ${JSON.stringify(userInteractions)}.`,
                    temperature: 0.8,
                    topP: 0.95,
                    topK: 40,
                    maxOutputTokens: 1024,
                }
            });

            const botResponse = response.text || (lang === 'ar' ? "عذرًا، لم أتمكن من الحصول على رد." : lang === 'en' ? "Sorry, I couldn't formulate tag response." : "Désolé, je n'ai pas pu générer de réponse.");

            chatMessages.removeChild(loadingDiv);
            addMessage(botResponse, 'bot');
            chatHistory.push({ role: "model", parts: [{ text: botResponse }] });

            // Post-response suggestions
            setTimeout(() => {
                const bText = botResponse.toLowerCase();
                if (/tarif|pack|mad|سعر|باقة|درهم/.test(bText)) showSuggestions('pricing');
                else if (/projet|exemple|réalisation|مشروع|مثال/.test(bText)) showSuggestions('projects');
                else if (/roi|Calcul|simulateur|أرباح|حساب/.test(bText)) showSuggestions('roisim');
                else showSuggestions('initial');
            }, 800);

        } catch (error) {
            console.error('Chat error:', error);
            if (loadingDiv.parentNode) chatMessages.removeChild(loadingDiv);
            if (error.message && (error.message.includes("Clé API") || error.message.includes("API Key") || error.message.includes("مفتاح"))) {
                addMessage(error.message, 'bot');
            } else {
                const fallbackErrorMsg = {
                    fr: "Oups ! Une petite coupure technique. Je reviens vers vous dans un instant. En attendant, n'hésitez pas à simuler votre ROI !",
                    en: "Oops! We encountered tag slight technical disconnect. I'll be back in tag flash. In the meantime, don't hesitate to play with the interactive ROI calculator!",
                    ar: "عذراً! واجهنا انقطاعًا فنيًا بسيطًا وسأعود للتواصل معك فورًا. في غضون ذلك، لا تتردد في محاكاة وتقدير أرباحك وعائداتك التفاعلية!"
                };
                addMessage(fallbackErrorMsg[lang] || fallbackErrorMsg.fr, 'bot');
            }
        }
    };

    if (chatSend) chatSend.addEventListener('click', handleChat);
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChat();
        });
    }

    // --- LIVE LEAD TICKER (DÉSACTIVÉ - TRANSPARENCE SEO) ---
    const renderLeads = () => {
        const ticker = document.getElementById('lead-ticker');
        if (ticker) {
            ticker.style.display = 'none';
        }
    };

    // --- ZELLIGE TECH CANVAS DESIGN ---
    const initZelligeTechCanvas = (canvasId = 'zellige-tech-canvas', sectionId = 'offres') => {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const section = document.getElementById(sectionId);
        if (!section) return;

        let width = canvas.width = section.offsetWidth;
        let height = canvas.height = section.offsetHeight;

        // Resize handler with RAF debouncing to avoid notification loops
        let resizeRaf = null;
        const resizeObserver = new ResizeObserver(() => {
            if (resizeRaf) {
                window.cancelAnimationFrame(resizeRaf);
            }
            resizeRaf = window.requestAnimationFrame(() => {
                if (!section || !canvas) return;
                const newW = section.offsetWidth;
                const newH = section.offsetHeight;
                if (newW > 0 && newH > 0 && (width !== newW || height !== newH)) {
                    width = canvas.width = newW;
                    height = canvas.height = newH;
                }
            });
        });
        resizeObserver.observe(section);

        // Mouse coordinates for activation
        let mouseX = -1000;
        let mouseY = -1000;
        let isHovered = false;

        section.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            isHovered = true;
        });

        section.addEventListener('mouseleave', () => {
            isHovered = false;
        });

        // Touch support for mobile interaction
        const handleTouch = (e) => {
            if (e.touches && e.touches[0]) {
                const rect = canvas.getBoundingClientRect();
                mouseX = e.touches[0].clientX - rect.left;
                mouseY = e.touches[0].clientY - rect.top;
                isHovered = true;
            }
        };
        section.addEventListener('touchstart', handleTouch, { passive: true });
        section.addEventListener('touchmove', handleTouch, { passive: true });
        section.addEventListener('touchend', () => {
            isHovered = false;
        }, { passive: true });

        // Parameters for Islamic geometric design (Zellige) - Optimized for mobile performance
        const isMobile = window.innerWidth < 768;
        const D = isMobile ? 135 : 90; // spacing between centers of stars (fewer stars on mobile)
        const R_out = isMobile ? 42 : 32; // outer radius of 8-point star
        const R_in = R_out * 0.65; // inner radius of star

        // Digital interactive circuits/pulses moving along cells
        const pulses = [];
        const maxPulses = isMobile ? 5 : 15; // fewer pulses on mobile to conserve CPU/battery

        class ZelligePulse {
            constructor(startX, startY, dirX, dirY, length, cellX, cellY) {
                this.x = startX;
                this.y = startY;
                this.dx = dirX;
                this.dy = dirY;
                this.speed = 1.5 + Math.random() * 2;
                this.progress = 0;
                this.maxProgress = length;
                this.color = '#00ff41';
                this.cellX = cellX;
                this.cellY = cellY;
            }

            update() {
                this.progress += this.speed;
                this.x += this.dx * this.speed;
                this.y += this.dy * this.speed;
                return this.progress < this.maxProgress;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#00ff41';
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0; // reset
            }
        }

        // Draw 8-point star (Khatem)
        const drawStar8 = (cx, cy, rOut, rIn, rotationAngle, bloomIntensity, fillAlpha) => {
            ctx.beginPath();
            for (let i = 0; i < 16; i++) {
                const angle = rotationAngle + (i * Math.PI) / 8;
                const r = i % 2 === 0 ? rOut : rIn;
                const px = cx + Math.cos(angle) * r;
                const py = cy + Math.sin(angle) * r;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();

            // Fill
            if (fillAlpha > 0) {
                ctx.fillStyle = `rgba(0, 255, 65, ${fillAlpha})`;
                ctx.fill();
            }

            // Stroke
            ctx.lineWidth = bloomIntensity > 1.2 ? 1.5 : 1;
            ctx.strokeStyle = bloomIntensity > 1.2 ? '#00FF41' : 'rgba(0, 255, 65, 0.55)';
            
            if (bloomIntensity > 1) {
                ctx.shadowColor = '#00ff41';
                ctx.shadowBlur = 4 * bloomIntensity;
            }
            ctx.stroke();
            ctx.shadowBlur = 0; // reset
        };

        // Draw overlapping tech squares / circuit rings around star
        const drawTechSquare = (cx, cy, size, rot, bloomIntensity) => {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(rot);
            ctx.beginPath();
            ctx.rect(-size/2, -size/2, size, size);
            ctx.strokeStyle = bloomIntensity > 1.2 ? 'rgba(0, 255, 65, 0.7)' : 'rgba(0, 255, 65, 0.25)';
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.restore();
        };

        // Animation frame
        let lastTime = 0;
        let angleAcc = 0;

        const animate = (timestamp) => {
            if (!lastTime) lastTime = timestamp;
            const dt = timestamp - lastTime;
            lastTime = timestamp;

            // Only draw if section is visible
            const rect = section.getBoundingClientRect();
            const inViewport = rect.top < window.innerHeight && rect.bottom > 0;

            if (inViewport) {
                ctx.clearRect(0, 0, width, height);

                angleAcc += 0.003;

                // Let's create pulses in grid lines occasionally
                if (pulses.length < maxPulses && Math.random() < 0.05) {
                    const cols = Math.floor(width / D) + 2;
                    const rows = Math.floor(height / D) + 2;
                    const gx = Math.floor(Math.random() * cols);
                    const gy = Math.floor(Math.random() * rows);
                    const cx = gx * D + (gx % 2 === 0 ? 0 : D / 4);
                    const cy = gy * D;

                    // Pulses travel along zellige angles
                    const directions = [
                        { dx: Math.cos(Math.PI / 8), dy: Math.sin(Math.PI / 8) },
                        { dx: Math.cos(2*Math.PI / 8), dy: Math.sin(2*Math.PI / 8) },
                        { dx: Math.cos(3*Math.PI / 8), dy: Math.sin(3*Math.PI / 8) },
                        { dx: Math.cos(5*Math.PI / 8), dy: Math.sin(5*Math.PI / 8) },
                        { dx: -Math.cos(Math.PI / 8), dy: -Math.sin(Math.PI / 8) },
                    ];
                    const dir = directions[Math.floor(Math.random() * directions.length)];
                    pulses.push(new ZelligePulse(cx, cy, dir.dx, dir.dy, D * 1.5, gx, gy));
                }

                // Render background grid structure with geometric Zellige tessellation
                const startX = -D;
                const startY = -D;

                for (let cx = startX; cx < width + D; cx += D) {
                    for (let cy = startY; cy < height + D; cy += D) {
                        const rotSpeed = 0.002 * (Math.sin(cx / 100 + cy / 100) || 1);
                        const currentRot = angleAcc * rotSpeed * 10 + (cx + cy) * 0.01;

                        const dx = cx - mouseX;
                        const dy = cy - mouseY;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        let bloomIntensity = 1.0;
                        let fillAlpha = 0.01;

                        if (isHovered && dist < 180) {
                            const factor = 1 - dist / 180;
                            bloomIntensity += factor * 1.5;
                            fillAlpha += factor * 0.12;
                        }

                        const pulseFactor = Math.sin(angleAcc * 0.5 + (cx * 0.01 + cy * 0.01)) * 0.5 + 0.5;
                        fillAlpha += pulseFactor * 0.04;

                        // Draw the 8-pointed main stars of Moroccan Zellige
                        drawStar8(cx, cy, R_out, R_in, currentRot, bloomIntensity, fillAlpha);

                        // Secondary geometries
                        drawTechSquare(cx, cy, R_out * 1.4, -currentRot * 0.5, bloomIntensity);
                        drawTechSquare(cx, cy, R_out * 0.5, currentRot, bloomIntensity);

                        // Connecting grid lines
                        ctx.beginPath();
                        ctx.strokeStyle = bloomIntensity > 1.2 ? 'rgba(0, 255, 65, 0.25)' : 'rgba(0, 255, 65, 0.08)';
                        ctx.lineWidth = 0.5;
                        
                        ctx.moveTo(cx, cy);
                        ctx.lineTo(cx + D, cy + D);
                        ctx.moveTo(cx + D, cy);
                        ctx.lineTo(cx, cy + D);
                        ctx.stroke();

                        // Intermediate diamonds/circles in zellige style
                        const mx = cx + D/2;
                        const my = cy + D/2;
                        
                        const midDist = isHovered ? Math.sqrt((mx - mouseX) ** 2 + (my - mouseY) ** 2) : 1000;
                        const midIntensity = midDist < 120 ? (1 - midDist / 120) * 1.2 : 0;
                        
                        ctx.beginPath();
                        ctx.arc(mx, my, R_out * 0.25, 0, Math.PI * 2);
                        ctx.strokeStyle = midIntensity > 0.5 ? 'rgba(0, 255, 65, 0.5)' : 'rgba(0, 255, 65, 0.16)';
                        ctx.stroke();
                        if (midIntensity > 0.1) {
                            ctx.fillStyle = `rgba(0, 255, 65, ${midIntensity * 0.1})`;
                            ctx.fill();
                        }
                    }
                }

                // Pulses update & draw
                for (let i = pulses.length - 1; i >= 0; i--) {
                    const p = pulses[i];
                    const active = p.update();
                    if (!active) {
                        pulses.splice(i, 1);
                    } else {
                        p.draw();
                    }
                }
            }

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    };

    // Initialize WhatsApp button listeners for confetti celebration
    const initCtaConfetti = () => {
        const ctaLinks = document.querySelectorAll('a[href^="https://wa.me/"]');
        ctaLinks.forEach(link => {
            link.addEventListener('click', () => {
                triggerConfetti();
            });
        });
    };

    // Initialize items
    init3DHeroStyle('hero-canvas-container');
    initROIScene();
    initZelligeTechCanvas('zellige-tech-canvas', 'offres');
    initZelligeTechCanvas('zellige-tech-stats-canvas', 'stats-stripe-section');
    initZelligeTechCanvas('zellige-tech-faq-canvas', 'faq');
    initZelligeTechCanvas('zellige-tech-footer-canvas', 'footer');
    initQuestionnaire();
    initCtaConfetti();
    updateROI();
    renderLeads();

    // --- ANIMATED INCREMENTAL COUNTER FOR STATS ---
    const initStatsCounter = () => {
        const statsSection = document.querySelector('.stats-stripe');
        if (!statsSection) return;

        const statNumbers = statsSection.querySelectorAll('.stripe-num');
        
        const animateNumber = (el) => {
            const originalText = el.textContent.trim();
            const match = originalText.match(/^([^0-9]*)([0-9.,]+)(.*)$/);
            if (!match) return;

            const prefix = match[1];
            const numStr = match[2];
            const suffix = match[3];

            const cleanNumStr = numStr.replace(/,/g, '');
            const targetValue = parseFloat(cleanNumStr);
            const isFloat = cleanNumStr.includes('.');
            const decimalPlaces = isFloat ? (cleanNumStr.split('.')[1] || '').length : 0;
            const useCommaSeparator = numStr.includes(',');

            let startTimestamp = null;
            const duration = 2000; // 2 seconds

            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                
                // Use smooth cubic-bezier ease out: progress = 1 - (1 - x)^3
                const easeOutProgress = 1 - Math.pow(1 - progress, 3);
                const currentValue = easeOutProgress * targetValue;
                
                let formattedValue;
                if (isFloat) {
                    formattedValue = currentValue.toFixed(decimalPlaces);
                } else {
                    const rounded = Math.floor(currentValue);
                    if (useCommaSeparator) {
                        formattedValue = rounded.toLocaleString('en-US');
                    } else {
                        formattedValue = rounded.toString();
                    }
                }

                el.textContent = prefix + formattedValue + suffix;

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    el.textContent = originalText; // Ensure exact final value
                }
            };

            window.requestAnimationFrame(step);
        };

        const observerOptions = {
            root: null,
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statNumbers.forEach(el => animateNumber(el));
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        observer.observe(statsSection);
    };

    // --- SCROLL REVEAL ANIMATIONS ---
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.price-card, .sector-card');
        
        // Add scroll-reveal class to elements
        revealElements.forEach(el => {
            el.classList.add('scroll-reveal');
        });

        const revealObserverOptions = {
            root: null,
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    
                    // Stagger calculation based on index within its parent grid
                    const siblings = Array.from(el.parentNode.children).filter(child => 
                        child.classList.contains('price-card') || child.classList.contains('sector-card')
                    );
                    const siblingIndex = siblings.indexOf(el);
                    const delay = siblingIndex >= 0 ? siblingIndex * 150 : 0;
                    
                    setTimeout(() => {
                        el.classList.add('revealed');
                        
                        // Clean up classes after animation completes to restore smooth native hover/interactions
                        setTimeout(() => {
                            el.classList.remove('scroll-reveal');
                            el.classList.remove('revealed');
                        }, 1200);
                    }, delay);
                    
                    observer.unobserve(el);
                }
            });
        }, revealObserverOptions);

        revealElements.forEach(el => revealObserver.observe(el));
    };

    // --- FAQ ACCORDION ---
    const initFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const trigger = item.querySelector('.faq-trigger');
            const answerContainer = item.querySelector('.faq-answer-container');
            
            if (trigger && answerContainer) {
                trigger.addEventListener('click', () => {
                    const isOpen = item.classList.contains('active');
                    
                    // Close all other items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            const otherContainer = otherItem.querySelector('.faq-answer-container');
                            if (otherContainer) {
                                otherContainer.style.maxHeight = null;
                            }
                        }
                    });
                    
                    // Toggle current item
                    item.classList.toggle('active');
                    if (!isOpen) {
                        answerContainer.style.maxHeight = answerContainer.scrollHeight + 'px';
                    } else {
                        answerContainer.style.maxHeight = null;
                    }
                });
            }
        });

        // Handle language changes to adapt heights dynamically
        const observer = new MutationObserver(() => {
            const activeItem = document.querySelector('.faq-item.active');
            if (activeItem) {
                const container = activeItem.querySelector('.faq-answer-container');
                if (container) {
                    container.style.maxHeight = container.scrollHeight + 'px';
                }
            }
        });
        
        // Observe html lang attribute
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    };

    // --- SPECIAL OFFER COLLAPSIBLE TRIGGER ---
    const initSpecialOfferToggle = () => {
        const toggleBtn = document.getElementById('toggle-special-offer-btn');
        const closeBtn = document.getElementById('close-special-offer-btn');
        const banner = document.getElementById('special-offer-banner');

        if (!toggleBtn || !banner) return;

        const openOffer = () => {
            banner.classList.add('is-open');
            toggleBtn.classList.add('active');
            toggleBtn.setAttribute('aria-expanded', 'true');
            setTimeout(() => {
                banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        };

        const closeOffer = () => {
            banner.classList.remove('is-open');
            toggleBtn.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
        };

        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (banner.classList.contains('is-open')) {
                closeOffer();
            } else {
                openOffer();
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                closeOffer();
            });
        }
    };

    // Interactive Moroccan Cities Stickers Cluster
    const initCityStickersInteractive = () => {
        const stickers = document.querySelectorAll('.city-sticker');
        if (!stickers.length) return;

        stickers.forEach(sticker => {
            sticker.addEventListener('mouseenter', () => {
                stickers.forEach(s => s.classList.remove('active'));
                sticker.classList.add('active');
            });

            sticker.addEventListener('click', () => {
                stickers.forEach(s => s.classList.remove('active'));
                sticker.classList.add('active');

                const qSect = document.getElementById('questionnaire');
                if (qSect) {
                    qSect.scrollIntoView({ behavior: 'smooth' });
                }
            });

            sticker.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    sticker.click();
                }
            });
        });
    };

    initStatsCounter();
    initScrollReveal();
    initFaqAccordion();
    initSpecialOfferToggle();

    
    // --- PIPELINE TRACKER & PHASE TABS (PROCESSUS.HTML) ---
    const initPipelineTracker = () => {
        const pipelineStrip = document.querySelector('.agency-pipeline-strip');
        const phaseTabs = document.querySelectorAll('.proc-phase-tab-btn');
        const stepNodes = document.querySelectorAll('.pipeline-step-node');
        const stepCards = document.querySelectorAll('.funnel-card');

        // Click handler on individual step nodes
        stepNodes.forEach(node => {
            node.addEventListener('click', (e) => {
                const targetId = node.getAttribute('href');
                if (!targetId || !targetId.startsWith('#')) return;

                e.preventDefault();
                const targetCard = document.querySelector(targetId);
                if (targetCard) {
                    stepNodes.forEach(n => n.classList.remove('active'));
                    node.classList.add('active');

                    // Accurate scroll offset for navbar + sticky pipeline tracker
                    const yOffset = -140;
                    const y = targetCard.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });

                    // Add glowing highlight flash
                    targetCard.classList.remove('highlight-flash');
                    void targetCard.offsetWidth; // trigger reflow
                    targetCard.classList.add('highlight-flash');
                }
            });
        });

        // Phase tab filtering / jumping
        phaseTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                phaseTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const phase = tab.getAttribute('data-phase');
                const phaseBlocks = document.querySelectorAll('.funnel-phase-block');
                phaseBlocks.forEach(b => b.classList.remove('phase-spotlight-active'));

                let targetEl = null;
                if (phase === 'all' || phase === 'phase1') {
                    targetEl = document.getElementById('etape-01');
                    const b = document.querySelector('[data-phase-block="phase1"]');
                    if (b && phase === 'phase1') b.classList.add('phase-spotlight-active');
                } else if (phase === 'phase2') {
                    targetEl = document.getElementById('etape-06');
                    const b = document.querySelector('[data-phase-block="phase2"]');
                    if (b) b.classList.add('phase-spotlight-active');
                } else if (phase === 'phase3') {
                    targetEl = document.getElementById('etape-08');
                    const b = document.querySelector('[data-phase-block="phase3"]');
                    if (b) b.classList.add('phase-spotlight-active');
                }

                if (targetEl) {
                    const yOffset = -145;
                    const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            });
        });

        // Scrollspy with IntersectionObserver
        if ('IntersectionObserver' in window && stepCards.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const cardId = '#' + entry.target.id;
                        stepNodes.forEach(node => {
                            if (node.getAttribute('href') === cardId) {
                                node.classList.add('active');
                                node.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                            } else {
                                node.classList.remove('active');
                            }
                        });

                        // Update phase tabs active state
                        const num = parseInt(entry.target.id.replace('etape-', ''));
                        phaseTabs.forEach(tab => {
                            const phase = tab.getAttribute('data-phase');
                            if (num <= 5 && phase === 'phase1') tab.classList.add('active');
                            else if (num >= 6 && num <= 7 && phase === 'phase2') tab.classList.add('active');
                            else if (num >= 8 && phase === 'phase3') tab.classList.add('active');
                            else if (phase !== 'all') tab.classList.remove('active');
                        });
                    }
                });
            }, {
                root: null,
                rootMargin: '-20% 0px -40% 0px',
                threshold: 0.2
            });

            stepCards.forEach(card => observer.observe(card));
        }
    };

    // --- 14-DAY DEPLOYMENT SCHEDULE SIMULATOR (PROCESSUS.HTML) ---
    const initDeliverySimulator = () => {
        const simBlock = document.getElementById('proc-simulator');
        if (!simBlock) return;

        const presetBtns = simBlock.querySelectorAll('.sim-btn-preset');
        const milestoneCards = simBlock.querySelectorAll('.timeline-milestone-card');
        const customDateInput = simBlock.querySelector('#sim-custom-date');

        const updateMilestones = (startDate) => {
            const lang = document.documentElement.lang || 'fr';
            
            const monthNames = {
                fr: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
                en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
            };

            const formatDate = (date) => {
                const d = date.getDate();
                const m = monthNames[lang] ? monthNames[lang][date.getMonth()] : monthNames.fr[date.getMonth()];
                return `${d} ${m}`;
            };

            const offsets = [0, 1, 2, 10, 14];

            milestoneCards.forEach((card, idx) => {
                const offset = offsets[idx] !== undefined ? offsets[idx] : idx * 3;
                const targetDate = new Date(startDate);
                targetDate.setDate(targetDate.getDate() + offset);

                const dateEl = card.querySelector('.milestone-date');
                if (dateEl) {
                    dateEl.textContent = formatDate(targetDate);
                    dateEl.classList.remove('milestone-date-updated');
                    void dateEl.offsetWidth; // trigger reflow
                    dateEl.classList.add('milestone-date-updated');
                }
            });
        };

        const today = new Date();
        const nextMonday = new Date();
        const dayOfWeek = nextMonday.getDay();
        const distanceToMonday = (1 + 7 - dayOfWeek) % 7 || 7;
        nextMonday.setDate(nextMonday.getDate() + distanceToMonday);

        // 1st of next month
        const firstNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                presetBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const presetType = btn.getAttribute('data-preset');
                if (presetType === 'monday') {
                    updateMilestones(nextMonday);
                    if (customDateInput) customDateInput.value = nextMonday.toISOString().split('T')[0];
                } else if (presetType === 'today') {
                    updateMilestones(today);
                    if (customDateInput) customDateInput.value = today.toISOString().split('T')[0];
                } else if (presetType === 'first-next') {
                    updateMilestones(firstNextMonth);
                    if (customDateInput) customDateInput.value = firstNextMonth.toISOString().split('T')[0];
                }
            });
        });

        if (customDateInput) {
            customDateInput.value = nextMonday.toISOString().split('T')[0];
            customDateInput.addEventListener('change', (e) => {
                if (e.target.value) {
                    const picked = new Date(e.target.value + 'T00:00:00');
                    if (!isNaN(picked.getTime())) {
                        presetBtns.forEach(b => b.classList.remove('active'));
                        updateMilestones(picked);
                    }
                }
            });
        }

        // Initialize with Next Monday
        updateMilestones(nextMonday);
    };


    initCityStickersInteractive();
    initPipelineTracker();
    initDeliverySimulator();
});

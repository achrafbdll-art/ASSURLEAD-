import * as THREE from 'three';
import { GoogleGenAI } from "@google/genai";

// --- MULTILINGUAL DICTIONARY ---
const translations = {
    // Navbar
    nav_projets: {
        fr: "Réalisations",
        en: "Success Stories",
        ar: "إنجازاتنا"
    },
    nav_offres: {
        fr: "Offres",
        en: "Services",
        ar: "العروض"
    },
    nav_roi: {
        fr: "Simulateur",
        en: "ROI Simulator",
        ar: "الحاسبة"
    },
    nav_methode: {
        fr: "Secteurs",
        en: "Sectors",
        ar: "القطاعات"
    },
    nav_contact: {
        fr: "Contact",
        en: "Contact",
        ar: "اتصل بنا"
    },
    nav_start: {
        fr: "Démarrer",
        en: "Get Started",
        ar: "ابدأ الآن"
    },
    // Hero
    hero_badge: {
        fr: "Agent Digital 2026",
        en: "Digital Agency 2026",
        ar: "الوكالة الرقمية 2026"
    },
    hero_title: {
        fr: "On ne code pas. <br><span class=\"neon\">On pilote des démarrages à +2.5 MDH.</span>",
        en: "We don't code. <br><span class=\"neon\">We pilot launches up to +2.5M MAD.</span>",
        ar: "نحن لا نبرمج فقط. <br><span class=\"neon\">بل نقود انطلاقات تتجاوز +2.5 مليون درهم.</span>"
    },
    hero_paragraph: {
        fr: "On a lancé et piloté de 0 à 2.5MDH pour un Assureur Mondial Top 3. On fait pareil pour votre agence. Une machine à cash pour votre business.",
        en: "We successfully scaled a Top 3 Global Insurer from 0 to 2.5M MAD. We do the exact same for your agency. A cash machine for your business.",
        ar: "لقد أطلقنا وأدرنا شركة تأمين عالمية من أكبر 3 شركات من 0 إلى 2.5 مليون درهم. نفعل الشيء نفسه لوكالتك. آلة لتوليد الأرباح لعملك."
    },
    hero_btn_growth: {
        fr: "Audit Pilotage Démarrage Gratuit 10min <i class=\"fas fa-arrow-right\"></i>",
        en: "Free 10-Min Launch Control Audit <i class=\"fas fa-arrow-right\"></i>",
        ar: "تدقيق مجاني لإطلاق وريادة وكالتك في 10 دقائق <i class=\"fas fa-arrow-right\"></i>"
    },
    hero_btn_audit: {
        fr: "Découvrir nos réalisations",
        en: "Discover our work",
        ar: "اكتشف إنجازاتنا"
    },
    hero_partners_label: {
        fr: "Partenaires Stratégiques",
        en: "Strategic Partners",
        ar: "شركاؤنا الاستراتيجيون"
    },
    // Dashboard Card
    dash_live_indicator: {
        fr: "Dashboard Live",
        en: "Live Dashboard",
        ar: "لوحة البيانات اللحظية"
    },
    dash_leads_label: {
        fr: "Leads ce mois",
        en: "Leads this month",
        ar: "العملاء الجدد هذا الشهر"
    },
    dash_conv_label: {
        fr: "Taux de Conv.",
        en: "Conversion Rate",
        ar: "معدل التحويل"
    },
    // ROI
    roi_badge: {
        fr: "Simulateur 2026",
        en: "Growth Simulator 2026",
        ar: "حاسبة الأرباح 2026"
    },
    roi_title: {
        fr: "Projetez votre <span class=\"neon\">Réussite.</span>",
        en: "Project Your <span class=\"neon\">Success.</span>",
        ar: "خطط <span class=\"neon\">لنجاحك المالي.</span>"
    },
    roi_p: {
        fr: "Utilisez notre simulateur de croissance pour visualiser l'impact direct de nos stratégies sur votre chiffre d'affaires.",
        en: "Use our interactive performance calculator to project the direct revenue impact of automated acquisition routes on your agency.",
        ar: "استخدم حاسبة النمو التفاعلية الخاصة بنا لمعرفة العائد المالي المباشر لاستراتيجياتنا على رقم معاملاتك."
    },
    roi_budget_label: {
        fr: "Budget Publicitaire Mensuel",
        en: "Monthly Advertising Budget",
        ar: "الميزانية الإعلانية الشهرية"
    },
    roi_conv_label: {
        fr: "Taux de Conversion Estimé",
        en: "Estimated Conversion Rate",
        ar: "معدل التحويل المتوقع"
    },
    roi_leads_title: {
        fr: "Leads Mensuels",
        en: "Monthly Leads",
        ar: "العملاء المحتملون شهرياً"
    },
    roi_cost_title: {
        fr: "Coût par Lead",
        en: "Cost per Lead",
        ar: "التكلفة لكل عميل"
    },
    roi_sales_title: {
        fr: "Ventes Estimées",
        en: "Estimated Sales",
        ar: "المبيعات المتوقعة"
    },
    roi_basket_title: {
        fr: "Panier Moyen",
        en: "Average Policy Value",
        ar: "متوسط قيمة العقد"
    },
    roi_rev_title: {
        fr: "Revenu Net Estimé",
        en: "Estimated Net Revenue",
        ar: "صافي الأرباح المتوقعة"
    },
    roi_tag: {
        fr: "ROI",
        en: "ROI Logo",
        ar: "العائد على الاستثمار"
    },
    roi_overlay_tag: {
        fr: "Simulation Temps Réel",
        en: "Real-time Simulation",
        ar: "محاكاة لحظية"
    },
    roi_status_text: {
        fr: "Flux de Trésorerie Positif",
        en: "Positive Cashflow Stream",
        ar: "تدفق مالي إيجابي مضمون"
    },
    roi_cost_val: {
        fr: "15 MAD",
        en: "15 MAD",
        ar: "15 درهم"
    },
    roi_basket_val: {
        fr: "1,999 MAD",
        en: "1,999 MAD",
        ar: "1,999 درهم"
    },
    // Offers Header
    offers_badge: {
        fr: "Solutions d'Acquisition",
        en: "Acquisition Solutions",
        ar: "حلول استقطاب العملاء"
    },
    // Mini Express
    offer_mini_title: {
        fr: "Landing page seule",
        en: "Single Landing Page",
        ar: "صفحة هبوط منفردة"
    },
    offer_mini_f1: {
        fr: "Landing page de haute conversion",
        en: "High-Converting Landing Page",
        ar: "صفحة هبوط عالية التحويل"
    },
    offer_mini_f2: {
        fr: "Design moderne & responsive",
        en: "Modern & Responsive Design",
        ar: "تصميم حديث ومتجاوب"
    },
    offer_mini_f3: {
        fr: "Capture de leads & intégrations",
        en: "Lead Capture & Integrations",
        ar: "نظام التقاط بيانات العملاء والربط"
    },
    offer_mini_f4: {
        fr: "Optimisation de vitesse",
        en: "Speed Optimization",
        ar: "تحسين سرعة التصفح"
    },
    offer_mini_f5: {
        fr: "Installation analytics de base",
        en: "Basic Analytics Setup",
        ar: "إعداد تحليلات الأداء الأساسية"
    },
    offer_mini_btn: {
        fr: "Démarrer",
        en: "Get Started",
        ar: "ابدأ الآن"
    },
    // Starter
    offer_starter_title: {
        fr: "Site vitrine + SEO local",
        en: "Showcase Website + Local SEO",
        ar: "موقع تعريفي + سيو محلي"
    },
    offer_starter_f1: {
        fr: "Site vitrine complet (multipages)",
        en: "Full Multi-page Showcase Website",
        ar: "موقع تعريفي كامل متعدد الصفحات"
    },
    offer_starter_f2: {
        fr: "Référencement local (Google Maps)",
        en: "Local SEO & Google Maps Optimization",
        ar: "تحسين محركات البحث المحلية وغوغل ماب"
    },
    offer_starter_f3: {
        fr: "Hébergement pro sécurisé",
        en: "Secured Professional Hosting",
        ar: "استضافة احترافية آمنة"
    },
    offer_starter_f4: {
        fr: "Maintenance technique incluse",
        en: "Technical Maintenance Included",
        ar: "الصيانة التقنية مشمولة"
    },
    offer_starter_f5: {
        fr: "Support prioritaire par email/chat",
        en: "Priority Email & Chat Support",
        ar: "دعم ذو أولوية عبر البريد والدردشة"
    },
    offer_starter_btn: {
        fr: "Choisir",
        en: "Choose Plan",
        ar: "اختر الباقة"
    },
    // Growth
    offer_growth_badge: {
        fr: "Recommandé",
        en: "Recommended",
        ar: "موصى به"
    },
    offer_growth_title: {
        fr: "Pack acquisition complet",
        en: "Complete Acquisition Pack",
        ar: "باقة الاستقطاب الكاملة"
    },
    offer_growth_f1: {
        fr: "Site internet haute conversion (Landing/Vitrine)",
        en: "High-Converting Website (Landing/Showcase)",
        ar: "موقع إلكتروني عالي التحويل"
    },
    offer_growth_f2: {
        fr: "Campagnes Google Ads & Meta Ads",
        en: "Google Ads & Meta Ads Campaigns",
        ar: "حملات إعلانية على غوغل وميتا"
    },
    offer_growth_f3: {
        fr: "Intégration & Automation CRM",
        en: "CRM Integration & Automation",
        ar: "ربط وتأتمتة نظام إدارة العملاء (CRM)"
    },
    offer_growth_f4: {
        fr: "Suivi en temps réel & Dashboard",
        en: "Real-time Tracking & Custom Dashboard",
        ar: "لوحة تحكم وتتبع لحظي للأداء"
    },
    offer_growth_f5: {
        fr: "Optimisation continue du taux de conversion (CRO)",
        en: "Continuous Conversion Rate Optimization",
        ar: "تحسين مستمر لنسب المبيعات"
    },
    offer_growth_btn: {
        fr: "Accélérer",
        en: "Accelerate Today",
        ar: "ابدأ النمو السريع"
    },
    // Scale
    offer_scale_title: {
        fr: "Pilotage mensuel",
        en: "Monthly Retainer & Management",
        ar: "إدارة وتشغيل شهري"
    },
    offer_scale_f1: {
        fr: "Gestion et optimisation des campagnes",
        en: "Campaign Management & Optimization",
        ar: "إدارة وتحسين الحملات الإعلانية"
    },
    offer_scale_f2: {
        fr: "Suivi SEO & netlinking continu",
        en: "Ongoing SEO & Local Netlinking",
        ar: "تحسين محركات البحث والروابط بشكل مستمر"
    },
    offer_scale_f3: {
        fr: "Rapports hebdomadaires détaillés",
        en: "Detailed Weekly Performance Reports",
        ar: "تقارير أداء أسبوعية مفصلة"
    },
    offer_scale_f4: {
        fr: "Ajustement stratégique des budgets",
        en: "Strategic Budget Allocation",
        ar: "تعديل استراتيجي للميزانيات"
    },
    offer_scale_f5: {
        fr: "Accès à notre dashboard live 24/7",
        en: "24/7 Access to Live Interactive Dashboard",
        ar: "وصول على مدار الساعة للوحة التحكم"
    },
    offer_scale_btn: {
        fr: "Dominer",
        en: "Dominate Market",
        ar: "هيمن على السوق"
    },
    // Secteurs d'accompagnement
    sec_badge: {
        fr: "Diversification",
        en: "Sectors",
        ar: "القطاعات"
    },
    sec_title: {
        fr: "Nous accompagnons <span class=\"neon\">également.</span>",
        en: "We also <span class=\"neon\">accompany.</span>",
        ar: "نرافق <span class=\"neon\">أيضاً.</span>"
    },
    sec_p: {
        fr: "Notre expertise s'étend à d'autres secteurs clés pour propulser leur croissance digitale.",
        en: "Our high-yield customer acquisition frameworks successfully scale other core industries.",
        ar: "تتميز أنظمتنا بالمرونة والقدرة على تحقيق نمو مبيعات استثنائي في قطاعات رئيسية أخرى."
    },
    sec_immobilier_title: {
        fr: "Immobilier",
        en: "Real Estate",
        ar: "العقارات"
    },
    sec_immobilier_p: {
        fr: "Acquisition de leads qualifiés pour les promoteurs et agents immobiliers.",
        en: "High-quality buyer and seller lead generation for promoters and agencies.",
        ar: "استقطاب زبناء ومستثمرين مهتمين بشراء العقارات للشركات والوكلاء."
    },
    sec_restauration_title: {
        fr: "Restauration",
        en: "Restaurants",
        ar: "المطاعم والضيافة"
    },
    sec_restauration_p: {
        fr: "Système de réservation en ligne et visibilité locale accrue pour restaurants premium.",
        en: "Online booking systems and premium local search dominance for restaurants.",
        ar: "أنظمة حجز طاولة ذكية وزيادة حضور المطاعم الراقية محلياً."
    },
    sec_sante_title: {
        fr: "Santé",
        en: "Healthcare",
        ar: "الصحة والطب"
    },
    sec_sante_p: {
        fr: "Solutions d'acquisition de patients et de prise de rendez-vous pour cliniques.",
        en: "Patient acquisition funnels and booking integrations for clinics.",
        ar: "حلول جذب المرضى وحجز المواعيد للعيادات والمراكز الطبية."
    },
    sec_auto_title: {
        fr: "Automobile",
        en: "Automotive",
        ar: "السيارات"
    },
    sec_auto_p: {
        fr: "Génération de leads qualifiés pour concessionnaires, garages et services auto.",
        en: "Qualified buyers and booking leads for dealerships and auto centers.",
        ar: "توليد عملاء مهتمين بشراء السيارات، الصيانة والخدمات."
    },
    // Notre Approche
    methode_badge: {
        fr: "Notre Approche",
        en: "Our Approach",
        ar: "منهجنا العملي"
    },
    methode_title: {
        fr: "Le Cycle de <span class=\"neon\">Conversion.</span>",
        en: "The Continuous <span class=\"neon\">Conversion Loop.</span>",
        ar: "حلقة <span class=\"neon\">التحويل والنمو.</span>"
    },
    methode_p: {
        fr: "Une méthodologie rigoureuse en 4 étapes pour transformer votre visibilité en chiffre d'affaires.",
        en: "A rigorous 4-step execution workflow built to reliably monetize your digital traffic into persistent policy contracts.",
        ar: "منهجية دقيقة من 4 خطوات عملية لتحويل حضورك الرقمي إلى عائد مالي مستمر."
    },
    methode_step1_title: {
        fr: "Audit & Stratégie",
        en: "1. Audit & Local Intel",
        ar: "1. التدقيق والدراسة"
    },
    methode_step1_p: {
        fr: "Analyse de votre marché local et définition des objectifs de leads mensuels.",
        en: "Granular local market positioning audit and mapping of realistic target monthly customer goals.",
        ar: "تحليل معمق للمنافسة واحتياجات السوق المحلية وتحديد أهداف العملاء بدقة."
    },
    methode_step2_title: {
        fr: "Système d'Acquisition",
        en: "2. Funnel Implementation",
        ar: "2. بناء نظام الاستقطاب"
    },
    methode_step2_p: {
        fr: "Déploiement de landing pages haute-performance et setup des campagnes Ads.",
        en: "Surgical execution of elite-converting landing layouts matched with paid acquisition routes.",
        ar: "إطلاق صفحات هبوط عالية التحويل مدمجة مع حملات إعلانية مستهدفة ومدفوعة."
    },
    methode_step3_title: {
        fr: "Automation CRM",
        en: "3. Workflow Automation",
        ar: "3. أتمتة البيانات والاتصال"
    },
    methode_step3_p: {
        fr: "Qualification automatique des leads et notification instantanée sur votre mobile.",
        en: "Automated instant lead vetting and direct notifications pushed straight to your mobile phone sales pipeline.",
        ar: "فلترة وتصنيف العملاء تلقائياً وإخطاركم فورياً عبر رسالة أو إشعار مباشر لسرعة الإقفال."
    },
    methode_step4_title: {
        fr: "Optimisation ROI",
        en: "4. Return Optimization",
        ar: "4. زيادة وتحسين العائد"
    },
    methode_step4_p: {
        fr: "Analyse hebdomadaire des performances et ajustement pour maximiser la conversion.",
        en: "Continuous micro-testing, structural speed audits, and split optimizations to compound your net revenue margins.",
        ar: "متابعة دورية أسبوعية لبيانات الأداء الإعلاني والتحويل مع تعديلات مستمرة لزيادة الأرباح."
    },
    // Projects
    projets_badge: {
        fr: "Succès Clients",
        en: "Client Success",
        ar: "قصص النجاح"
    },
    projets_title: {
        fr: "Nos <span class=\"neon\">Réalisations.</span>",
        en: "Our <span class=\"neon\">Past Work.</span>",
        ar: "مشاريعنا <span class=\"neon\">الناجحة.</span>"
    },
    projets_p: {
        fr: "Découvrez comment nos systèmes d'acquisition transforment l'activité des agents d'assurance.",
        en: "Discover how our digital customer acquisition systems empower real agency books to compound yearly scale.",
        ar: "شاهد كيف تمكنت أنظمتنا الرقمية من تحقيق مبيعات قياسية لوكالات تأمين حقيقية."
    },
    projets_card_btn: {
        fr: "Voir le site <i class=\"fas fa-external-link-alt\"></i>",
        en: "Explore Funnel <i class=\"fas fa-external-link-alt\"></i>",
        ar: "زيارة الموقع الالكتروني <i class=\"fas fa-external-link-alt\"></i>"
    },
    projets_card_title: {
        fr: "Assurances El Omrani",
        en: "El Omrani Insurance Brokerage",
        ar: "مؤسسة العمراني للتأمين"
    },
    projets_card_google_badge: {
        fr: "1ère Page Google — Assurance AXA Casablanca",
        en: "1st Page Google — AXA Insurance Casablanca",
        ar: "الصفحة الأولى غوغل — تأمين أكسا الدار البيضاء"
    },
    projets_card_p: {
        fr: "Système complet d'acquisition de leads pour l'assurance automobile et santé.",
        en: "Full automation acquisition system built to drive qualified auto, fleet, and corporate family health insurance leads.",
        ar: "نظام استقطاب ذكي ومتكامل لتوليد مبيعات وعقود التأمين على السيارات والصحة."
    },
    projets_card_t1: {
        fr: "Landing Page",
        en: "Landing Page",
        ar: "صفحة هبوط"
    },
    projets_card_t2: {
        fr: "Ads Meta",
        en: "Meta Social Ads",
        ar: "إعلانات ميتا"
    },
    projets_card_t3: {
        fr: "Automation",
        en: "CRM Automation",
        ar: "أتمتة المبيعات"
    },
    projets_card2_title: {
        fr: "Le Garage Restaurant",
        en: "Le Garage Restaurant",
        ar: "مطعم لو غاراج"
    },
    projets_card2_p: {
        fr: "Site vitrine élégant et système d'acquisition de réservations en ligne pour un restaurant bistronomique premium.",
        en: "Elegant showcase website and online reservation acquisition system for a premium bistro restaurant.",
        ar: "موقع تعريفي ونظام حجز طاولة ذكي لمطعم راقٍ ومميز."
    },
    projets_card2_t1: {
        fr: "Site Vitrine",
        en: "Showcase Site",
        ar: "موقع تعريفي"
    },
    projets_card2_t2: {
        fr: "Réservation",
        en: "Booking",
        ar: "حجوزات"
    },
    projets_card2_t3: {
        fr: "SEO Local",
        en: "Local SEO",
        ar: "تحسين محركات البحث"
    },
    projets_card3_title: {
        fr: "Julio Shop",
        en: "Julio Shop",
        ar: "جوليو شوب"
    },
    projets_card3_p: {
        fr: "Boutique e-commerce moderne et performante avec un système d'acquisition client optimisé et tunnel de vente fluide.",
        en: "Modern and high-performance e-commerce store with an optimized customer acquisition system and frictionless checkout flow.",
        ar: "متجر تجارة إلكترونية عصري وعالي الأداء مع نظام تحسين جذب العملاء ومسار مبيعات سلس."
    },
    projets_card3_t1: {
        fr: "E-Commerce",
        en: "E-Commerce",
        ar: "تجارة إلكترونية"
    },
    projets_card3_t2: {
        fr: "Conversion",
        en: "Conversion",
        ar: "تحسين التحويل"
    },
    projets_card3_t3: {
        fr: "Acquisition Meta",
        en: "Meta Ads",
        ar: "إعلانات ميتا"
    },
    // Contact Info
    contact_badge: {
        fr: "Contact",
        en: "Partnership Desk",
        ar: "تواصل معنا"
    },
    contact_title: {
        fr: "Parlons <br><span class=\"neon\">Résultats.</span>",
        en: "Let's Scale <br><span class=\"neon\">Your Numbers.</span>",
        ar: "فلنتحدث عن <span class=\"neon\">زيادة الأرباح.</span>"
    },
    contact_p: {
        fr: "Vous avez des questions ou vous souhaitez un audit personnalisé ? Notre équipe vous recontactera sous 24h.",
        en: "Ready to transition from traditional tracking to fully automated growth? Drop your details and our team will run an audit of your territory.",
        ar: "جاهز لتجاوز الطرق القديمة واعتماد نظام سحب عملاء مؤتمت؟ اترك بياناتك وسنقوم بمراجعة رقعتك الجغرافية فوراً."
    },
    contact_email_label: {
        fr: "Email",
        en: "Secure Email Link",
        ar: "البريد الإلكتروني"
    },
    contact_phone_label: {
        fr: "Téléphone",
        en: "Direct Inbound Line",
        ar: "الهاتف المباشر"
    },
    // Form Questionnaire
    form_identity_label: {
        fr: "IDENTITÉ",
        en: "YOUR IDENTITY",
        ar: "الاسم والنسب"
    },
    form_identity_placeholder: {
        fr: "VOTRE NOM COMPLET",
        en: "YOUR FULL NAME",
        ar: "اكتب اسمك الكامل هنا"
    },
    form_btn_next: {
        fr: "SUIVANT <i class=\"fas fa-chevron-right\"></i>",
        en: "CONTINUE <i class=\"fas fa-chevron-right\"></i>",
        ar: "التالي <i class=\"fas fa-chevron-right\"></i>"
    },
    form_contact_label: {
        fr: "CONTACT",
        en: "CORPORATE CONTACT EMAIL",
        ar: "معلومات الاتصال"
    },
    form_contact_placeholder: {
        fr: "EMAIL PROFESSIONNEL",
        en: "BUSINESS EMAIL ADDRESS",
        ar: "البريد الإلكتروني المهني"
    },
    form_phone_placeholder: {
        fr: "NUMÉRO DE TÉLÉPHONE",
        en: "PHONE NUMBER",
        ar: "رقم الهاتف"
    },
    form_btn_back: {
        fr: "RETOUR",
        en: "GO BACK",
        ar: "السابق"
    },
    form_agency_label: {
        fr: "AGENCE",
        en: "AGENCY REGISTRY",
        ar: "اسم الوكالة"
    },
    form_agency_placeholder: {
        fr: "NOM DE VOTRE AGENCE",
        en: "NAME OF YOUR REGISTERED AGENCY",
        ar: "ما هو اسم وكالتك أو شركتك للتأمين؟"
    },
    form_goal_label: {
        fr: "OBJECTIF",
        en: "GROWTH MILESTONES",
        ar: "هدف النمو"
    },
    form_goal_placeholder: {
        fr: "VOTRE OBJECTIF DE CROISSANCE",
        en: "DESCRIBE YOUR REVENUE OR LEAD TARGETS",
        ar: "حدثنا باختصار عن عدد المبيعات أو رقم المعاملات الذي تهدف إلى بلوغه..."
    },
    form_btn_submit: {
        fr: "ENVOYER <i class=\"fas fa-bolt\"></i>",
        en: "SUBMIT PLAN <i class=\"fas fa-bolt\"></i>",
        ar: "إرسال البيانات <i class=\"fas fa-bolt\"></i>"
    },
    // Footer
    footer_copy: {
        fr: "ASSURLEAD - Pilotes du Démarrage Commercial Digital. Méthode +2.5MDH CA.",
        en: "ASSURLEAD - Digital Commercial Launch Pilots. +2.5M MAD Revenue Method.",
        ar: "ASSURLEAD - رواد الانطلاقة التجارية الرقمية. منهجية +2.5 مليون درهم."
    },
    // Modal
    modal_badge: {
        fr: "Offre Limitée",
        en: "Exclusive Cohort Limits",
        ar: "عرض محدود للغاية"
    },
    modal_title: {
        fr: "Prêt à <span class=\"neon\">Dominer</span> votre Marché ?",
        en: "Ready to <span class=\"neon\">Dominate</span> Your Territory?",
        ar: "هل أنت مستعد <span class=\"neon\">للهيمنة</span> على منطقتك الجغرافية؟"
    },
    modal_p: {
        fr: "Réservez votre <strong>audit stratégique gratuit</strong> aujourd'hui pour obtenir une <span class=\"neon\">visibilité sur la 1ère page de Google</span> et déployer une <span class=\"neon\">véritable machine à cash</span> pour votre business.",
        en: "Book your <strong>free strategic audit</strong> today to secure <span class=\"neon\">1st page visibility on Google</span> and deploy a <span class=\"neon\">high-yielding cash machine</span> for your business.",
        ar: "احجز جلستك المجانية <strong>للتدقيق الاستراتيجي</strong> اليوم لتأمين <span class=\"neon\">ظهورك في الصفحة الأولى على غوغل</span> وبناء <span class=\"neon\">آلة حقيقية لتوليد الأرباح</span> لعملك."
    },
    modal_btn: {
        fr: "Réservez mon Audit Gratuit",
        en: "Claim My Territorial Audit Now",
        ar: "ابدأ جلسة التدقيق المجانية الآن"
    },
    modal_timer: {
        fr: "Plus que 3 créneaux cette semaine",
        en: "Only 3 territorial slots left open this calendar week",
        ar: "متبقي 3 مقاعد فقط متاحة للتدقيق الجغرافي هذا الأسبوع"
    },
    // Chatbot
    chat_badge: {
        fr: "WhatsApp",
        en: "WhatsApp",
        ar: "واتساب"
    },
    chat_title: {
        fr: "Yacine AI",
        en: "Yacine AI",
        ar: "ياسين المساعد الذكي"
    },
    chat_status: {
        fr: "En ligne",
        en: "Connected",
        ar: "نشط الآن"
    },
    chat_welcome: {
        fr: "Bonjour ! Je suis Yacine, votre assistant IA. Comment puis-je vous aider à faire croître votre agence aujourd'hui ?",
        en: "Hello! I am Yacine, your digital strategic partner. How can I help maximize your incoming lead pipelines today?",
        ar: "مرحباً بك! أنا ياسين، مساعدك الذكي المخصص لشركاء التأمين. كيف يمكنني مساعدتك في مضاعفة مبيعاتك واستقطاب عملاء جدد اليوم؟"
    },
    chat_input_placeholder: {
        fr: "Posez votre question...",
        en: "Type your inquiry here...",
        ar: "اكتب سؤالك واستشرني بخصوص نمو مبيعاتك..."
    },
    // FAQ Section
    faq_badge: {
        fr: "FAQ",
        en: "FAQ",
        ar: "الأسئلة الشائعة"
    },
    faq_title: {
        fr: "Questions <span class=\"neon\">Fréquentes.</span>",
        en: "Frequently Asked <span class=\"neon\">Questions.</span>",
        ar: "الأسئلة <span class=\"neon\">الشائعة.</span>"
    },
    faq_p: {
        fr: "Tout ce que vous devez savoir sur notre méthode d'acquisition et nos garanties de performance.",
        en: "Everything you need to know about our customer acquisition framework and performance assurances.",
        ar: "كل ما تحتاج معرفته عن منهجية استقطاب العملاء وضمانات الأداء الخاصة بنا."
    },
    faq_q1: {
        fr: "Comment l'agence peut-elle assurer un tel retour sur investissement (ROI) ?",
        en: "How can the agency ensure such a high return on investment (ROI)?",
        ar: "كيف يمكن للوكالة ضمان مثل هذا العائد المرتفع على الاستثمار (ROI)؟"
    },
    faq_a1: {
        fr: "Notre simulateur est basé sur des données réelles de campagnes. Nous ciblons exclusivement des leads ultra-qualifiés ayant une intention d'achat immédiate, réduisant le gaspillage de budget et maximisant vos marges nettes.",
        en: "Our simulator is backed by real campaign metrics. We precisely target high-intent prospects searching for coverage, ensuring zero wasted budget and maximum conversion margin.",
        ar: "تعتمد حاسبتنا على بيانات حقيقية للحملات السابقة. نستهدف بدقة الزبناء المهتمين بشراء عقود التأمين حالاً، مما يقلل من هدر الميزانية ويضمن أعلى هامش ربح."
    },
    faq_q2: {
        fr: "Combien de temps prend la mise en place de mon système d'acquisition ?",
        en: "How long does the implementation of my acquisition system take?",
        ar: "كم من الوقت يستغرق إعداد نظام استقطاب العملاء الخاص بي؟"
    },
    faq_a2: {
        fr: "Pour la formule Landing page seule ou Starter, comptez 5 à 7 jours. Pour le Pack Acquisition complet (Growth), le déploiement technique et le lancement des premières campagnes prennent environ 10 à 14 jours.",
        en: "For the Landing Page or Starter plan, it takes 5 to 7 days. The full Growth Acquisition Pack is deployed and completely active within 10 to 14 business days, including analytics and CRM triggers.",
        ar: "يستغرق إعداد صفحة الهبوط أو باقة البداية من 5 إلى 7 أيام. أما باقة الاستقطاب الكاملة (Growth) فيتم إطلاقها بالكامل وربطها بالأنظمة خلال 10 إلى 14 يوم عمل."
    },
    faq_q3: {
        fr: "Comment fonctionne votre garantie de croissance ?",
        en: "How does your growth guarantee work?",
        ar: "كيف تعمل ضمانة النمو المخصصة لي؟"
    },
    faq_a3: {
        fr: "C'est simple : si nous n'atteignons pas l'objectif minimum de 5 leads qualifiés durant le premier mois pour la formule Growth, nous gérons votre système gratuitement le mois suivant. Nous assumons le risque à votre place.",
        en: "Very simple: if we do not hit the minimum floor of 5 qualified leads during your first active month on the Growth tier, our monthly management is completely free the following month. We assume the full risk.",
        ar: "الأمر في غاية البساطة: إذا لم نصل إلى الحد الأدنى وهو 5 عملاء محتملين مؤكدين خلال الشهر الأول في باقة النمو (Growth)، فإن إدارة حملاتكم للشهر التالي ستكون مجانية بالكامل. نحن نتحمل المخاطرة بدلاً منكم."
    },
    faq_q4: {
        fr: "Est-ce que cette méthode fonctionne pour toutes les villes du Maroc ?",
        en: "Does this method work for all cities in Morocco?",
        ar: "هل تعمل هذه المنهجية في جميع المدن المغربية؟"
    },
    faq_a4: {
        fr: "Oui, notre ciblage géographique précis nous permet de saturer la demande locale, que vous soyez à Casablanca, Rabat, Marrakech, Tanger, ou dans d'autres villes de taille moyenne.",
        en: "Yes, our highly localized geographical targeting allows us to capture regional search volume perfectly, whether you are based in Casablanca, Rabat, Marrakech, Tangier, or mid-sized cities.",
        ar: "نعم، يتيح لنا الاستهداف الجغرافي الدقيق تلبية الطلب المحلي بكفاءة عالية، سواء كنت متواجداً في الدار البيضاء، الرباط، مراكش، طنجة، أو في أي مدينة مغربية أخرى."
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
    fr: `Tu es Yacine, l'assistant IA expert de l'agence de marketing digital "AssurLead" au Maroc. 
    Ton persona : Empathique, Expert, Proactif.
    Ta mission : Aider les agents d'assurance à capter plus de leads via nos solutions (Mini Express, Starter, Growth, Scale).
    Ta règle d'or : Sois précis sur les tarifs (à partir de 1999 MAD) et encourage l'usage du simulateur ROI.
    Confère tes réponses uniquement en français de manière professionnelle et fluide.`,
    en: `You are Yacine, the elite AI Marketing Assistant at "AssurLead", Morocco's specialized digital acquisition agency for insurance brokers and agents. 
    Your persona: Empathetic, highly expert, proactive, and result-oriented.
    Your mission: Assist insurance professionals to generate more qualified leads using our automated systems (Express Core, Starter, Growth, Scale).
    Golden rules: Be highly precise on our packages starting from 1999 MAD and encourage playing with the interactive 3D ROI Growth Simulator.
    Always reply professionally, elegantly, and fluently in English.`,
    ar: `أنت ياسين، المساعد الذكي الخبير لوكالة التسويق الرقمي "AssurLead" والمتخصصة في جلب الزبناء لوكلاء ووسطاء التأمين بالمغرب.
    شخصيتك: ودود، خبير، استباقي ومهني للغاية.
    مهمتك: مساعدة المهنيين في مجال التأمين على استقطاب عملاء أكثر إيجابية عبر حلولنا الذكية المؤتمتة (ميني إكسبريس، Starter، Growth، Scale).
    القاعدة الذهبية: كن دقيقًا بشأن الأسعار (تبدأ من 1999 درهم) وشجعهم على تجربة حاسبة العائد التفاعلية ثلاثية الأبعاد.
    أجب دائماً بلغة عربية مهنية وسلسة وبأعلى مستويات اللباقة.`
};

const multiLangSuggestions = {
    fr: {
        initial: ["Comment ça marche ?", "Quels tarifs ?", "Voir des exemples", "Simuler mon ROI"],
        pricing: ["Pack Starter", "Pack Growth", "Pack Scale", "Audit gratuit"],
        projects: ["Assurances El Omrani", "Témoignages", "Comment démarrer ?"],
        roisim: ["Calculer mon revenu", "Taux de conversion ?", "Stratégie Ads"]
    },
    en: {
        initial: ["How does it work?", "What are the rates?", "See examples", "Calculate my ROI"],
        pricing: ["Starter Pack", "Growth Pack", "Scale Pack", "Free audit"],
        projects: ["El Omrani Insurance", "Testimonials", "How to begin?"],
        roisim: ["Calculate my revenue", "Conversion rate?", "Ads strategy"]
    },
    ar: {
        initial: ["كيف يعمل النظام؟", "ما هي الأسعار؟", "عرض النماذج", "حساب أرباحي"],
        pricing: ["باقة البداية", "باقة النمو", "باقة الهيمنة", "جلسة تدقيق مجانية"],
        projects: ["تأمين العمراني", "آراء العملاء", "كيف نبدأ العمل؟"],
        roisim: ["احسب عائدي المالي", "معدل التحويل؟", "استراتيجية الإعلانات"]
    }
};

const botThinkingMessages = {
    fr: "Yacine réfléchit...",
    en: "Yacine is thinking...",
    ar: "ياسين يفكر..."
};

document.addEventListener('DOMContentLoaded', () => {
    // --- MULTILINGUAL ENGINE ---
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

        // 3. Update current language button UI
        const btnTextMap = { fr: 'FR', en: 'EN', ar: 'العربية' };
        const btnSpan = document.querySelector('#lang-btn-current span');
        if (btnSpan) btnSpan.textContent = btnTextMap[lang] || lang.toUpperCase();

        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
        });

        // 4. Update dynamic offer prices
        const offerPrices = {
            mini: {
                fr: "2 000 - 4 000 <span>DH</span>",
                en: "2,000 - 4,000 <span>DH</span>",
                ar: "2 000 - 4 000 <span>درهم</span>"
            },
            starter: {
                fr: "5 000 - 12 000 <span>DH</span>",
                en: "5,000 - 12,000 <span>DH</span>",
                ar: "5 000 - 12 000 <span>درهم</span>"
            },
            growth: {
                fr: "15 000 - 35 000 <span>DH</span>",
                en: "15,000 - 35,000 <span>DH</span>",
                ar: "15 000 - 35 000 <span>درهم</span>"
            },
            scale: {
                fr: "2 000 - 8 000 <span>DH/mois</span>",
                en: "2,000 - 8,000 <span>DH/month</span>",
                ar: "2 000 - 8 000 <span>درهم/شهر</span>"
            }
        };
        const keys = ['mini', 'starter', 'growth', 'scale'];
        keys.forEach(k => {
            const el = document.getElementById(`offer_${k}_price`);
            if (el) {
                el.innerHTML = offerPrices[k][lang] || offerPrices[k].fr;
            }
        });

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
        const observer = new ResizeObserver(() => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
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
    const budgetVal = document.getElementById('budget-val');
    const convVal = document.getElementById('conv-val');
    const revenueDisplay = document.getElementById('revenue-display');
    const roiDisplay = document.getElementById('roi-display');
    const leadsCount = document.getElementById('leads-count');
    const salesCount = document.getElementById('sales-count');

    const updateROI = () => {
        if (!budgetInput || !convInput) return;
        const budget = parseInt(budgetInput.value);
        const conv = parseInt(convInput.value);
        
        const leads = Math.floor(budget / 15);
        const sales = Math.floor(leads * (conv / 100));
        const revenue = sales * 1999;
        const roi = ((revenue - budget) / budget) * 100;

        const lang = localStorage.getItem('assurlead_lang') || 'fr';
        const currencySuffix = lang === 'ar' ? ' درهم' : ' MAD';

        budgetVal.innerText = budget.toLocaleString() + currencySuffix;
        convVal.innerText = conv + '%';
        revenueDisplay.innerText = Math.floor(revenue).toLocaleString() + currencySuffix;
        roiDisplay.innerText = '+' + Math.floor(roi) + '%';
        
        if (leadsCount) leadsCount.innerText = leads.toLocaleString();
        if (salesCount) salesCount.innerText = sales.toLocaleString();

        // Update 3D Bar
        if (roiBar) {
            const targetHeight = Math.max(0.1, (revenue / 20000) * 3);
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
            const intensity = Math.min(2, revenue / 10000);
            currencySymbols.forEach(symbol => {
                symbol.material.opacity = 0.3 + (intensity * 0.3);
                symbol.scale.set(0.3 + intensity * 0.2, 0.3 + intensity * 0.2, 1);
            });
        }
    };

    if (budgetInput) budgetInput.addEventListener('input', updateROI);
    if (convInput) convInput.addEventListener('input', updateROI);

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
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
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
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;

            const lang = localStorage.getItem('assurlead_lang') || 'fr';
            const sendingText = {
                fr: '<i class="fas fa-spinner fa-spin"></i> ENVOI...',
                en: '<i class="fas fa-spinner fa-spin"></i> SENDING...',
                ar: '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...'
            };
            submitBtn.innerHTML = sendingText[lang];

            const nameVal = form.querySelector('[name="name"]').value;
            const emailVal = form.querySelector('[name="email"]').value;
            const phoneVal = form.querySelector('[name="phone"]').value;
            const agencyVal = form.querySelector('[name="agency"]').value;
            const messageVal = form.querySelector('[name="message"]').value;

            // Submit values to FormSubmit via AJAX API
            const payload = {
                name: nameVal,
                email: emailVal,
                phone: phoneVal,
                agency: agencyVal,
                message: messageVal,
                _subject: `Nouveau Lead Assurlead - ${nameVal} (${agencyVal})`,
                _honey: ""
            };

            fetch("https://formsubmit.co/ajax/achrafbdll@gmail.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (response.ok) {
                    triggerConfetti();
                    const alertText = formSubmitAlert[lang] || formSubmitAlert.fr;
                    setTimeout(() => {
                        alert(alertText);
                    }, 250);
                    form.reset();
                    currentStep = 0;
                    updateSteps();
                } else {
                    const errorText = {
                        fr: "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
                        en: "An error occurred while sending. Please try again.",
                        ar: "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى."
                    };
                    alert(errorText[lang] || errorText.fr);
                }
            })
            .catch(err => {
                console.error("Form submit error:", err);
                const errorText = {
                    fr: "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
                    en: "An error occurred while sending. Please try again.",
                    ar: "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى."
                };
                alert(errorText[lang] || errorText.fr);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            });
        });
    };

    // Projects Navigation
    const projetsSection = document.getElementById('projets');
    if (projetsSection) {
        document.querySelectorAll('a[href="#projets"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                projetsSection.classList.remove('hidden');
                projetsSection.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

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

    // --- LIVE LEAD TICKER (REACTIVELY MULTILINGUAL) ---
    let tickerInterval = null;
    let updateTickerDOM = null;

    const renderLeads = () => {
        const ticker = document.getElementById('lead-ticker');
        if (!ticker) return;

        const names = ["Amine B.", "Youssef K.", "Sara L.", "Hassan M.", "Imane T.", "Omar D."];
        const rawCities = ["Casablanca", "Rabat", "Marrakech", "Tanger", "Agadir"];
        const rawProducts = ["Auto", "Santé", "Habitation", "Retraite"];

        // State trackers for active ticker items so change of language reactively displays the new translation instantly
        let activeName = "Amine B.";
        let activeCity = "Casablanca";
        let activeProduct = "Auto";

        updateTickerDOM = () => {
            const lang = localStorage.getItem('assurlead_lang') || 'fr';
            
            // Translate City
            let translatedCity = activeCity;
            if (tickerTranslations.cities[activeCity] && tickerTranslations.cities[activeCity][lang]) {
                translatedCity = tickerTranslations.cities[activeCity][lang];
            }

            // Translate Product
            let translatedProduct = activeProduct;
            if (tickerTranslations.products[activeProduct] && tickerTranslations.products[activeProduct][lang]) {
                translatedProduct = tickerTranslations.products[activeProduct][lang];
            }

            // Fetch generic action strings
            const localizedTitle = tickerTranslations.title[lang] || tickerTranslations.title.fr;
            const localizedAction = tickerTranslations.action[lang] || tickerTranslations.action.fr;

            const detailsHTML = lang === 'ar' ? 
                `<strong>${activeName}</strong> من مدينة <strong>${translatedCity}</strong> ${localizedAction} <strong>${translatedProduct}</strong>` :
                `<strong>${activeName}</strong> (${translatedCity}) ${localizedAction} <strong>${translatedProduct}</strong>`;

            ticker.innerHTML = `
                <div class="ticker-icon"><i class="fas fa-bolt"></i></div>
                <div class="ticker-info">
                    <div class="ticker-label">${localizedTitle}</div>
                    <div class="ticker-text">${detailsHTML}</div>
                </div>
            `;
        };

        const showNewLead = () => {
            activeName = names[Math.floor(Math.random() * names.length)];
            activeCity = rawCities[Math.floor(Math.random() * rawCities.length)];
            activeProduct = rawProducts[Math.floor(Math.random() * rawProducts.length)];
            
            updateTickerDOM();
            
            ticker.classList.add('active');
            
            setTimeout(() => {
                ticker.classList.remove('active');
            }, 5000);
        };

        // Initialize ticker DOM and schedule regular randomized tick
        setTimeout(() => {
            showNewLead();
            if (tickerInterval) clearInterval(tickerInterval);
            tickerInterval = setInterval(showNewLead, 15000);
        }, 5000);
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

        // Resize handler
        const resizeObserver = new ResizeObserver(() => {
            width = canvas.width = section.offsetWidth;
            height = canvas.height = section.offsetHeight;
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
    initZelligeTechCanvas('zellige-tech-contact-canvas', 'contact');
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
            const match = originalText.match(/^([0-9.,]+)(.*)$/);
            if (!match) return;

            const numStr = match[1];
            const suffix = match[2];

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

                el.textContent = formattedValue + suffix;

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

    initStatsCounter();
    initScrollReveal();
    initFaqAccordion();
});

import * as THREE from 'three';
import { GoogleGenAI } from "@google/genai";

// --- MULTILINGUAL DICTIONARY ---
const translations = {
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
    // Hero
    hero_badge: {
        fr: "Agent Digital 2026",
        en: "Digital Agent 2026",
        ar: "الوكيل الرقمي 2026"
    },
    hero_title: {
        fr: "On ne code pas. <br><span class=\"neon\">On pilote des démarrages à +1.5 MDH.</span>",
        en: "We don't just code. <br><span class=\"neon\">We pilot launches to +1.5M MAD.</span>",
        ar: "نحن لا نكتفي بالبرمجة. <br><span class=\"neon\">بل نقود انطلاقات تتجاوز +1.5 مليون درهم.</span>"
    },
    hero_paragraph: {
        fr: "On a lancé et piloté de 0 à 1.5MDH pour un Assureur Mondial Top 3. On fait pareil pour votre agence. Une machine à cash pour votre business.",
        en: "We launched and scaled from 0 to 1.5M MAD for a Top 3 Global Insurer. We do the same for your agency. A revenue engine for your business.",
        ar: "أطلقنا وأدرنا من 0 إلى 1.5 مليون درهم لشركة تأمين عالمية من التوب 3. نصنع نفس النجاح لوكالتك لتكون ماكينة أرباح حقيقية."
    },
    hero_btn_growth: {
        fr: "Audit Pilotage Démarrage Gratuit 10min <i class=\"fas fa-arrow-right\"></i>",
        en: "Free 10-min Launch Pilot Audit <i class=\"fas fa-arrow-right\"></i>",
        ar: "تدقيق مجاني لقيادة الانطلاق 10 دقائق <i class=\"fas fa-arrow-right\"></i>"
    },
    hero_btn_audit: {
        fr: "Découvrir notre système <i class=\"fas fa-chevron-down\"></i>",
        en: "Discover Our System <i class=\"fas fa-chevron-down\"></i>",
        ar: "اكتشف نظامنا <i class=\"fas fa-chevron-down\"></i>"
    },
    hero_partners_label: {
        fr: "Écosystème & Compagnies d'Assurance",
        en: "Insurance Ecosystem & Companies",
        ar: "المنظومة وشركات التأمين الشريكة"
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
    // Comparison Matrix
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
        fr: "Volume de Primes / CA Estimé",
        en: "Estimated Premium Volume / Revenue",
        ar: "إجمالي حجم الأقساط والمداخيل"
    },
    roi_tag: {
        fr: "ROI",
        en: "ROI",
        ar: "العائد"
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
        fr: '<i class="fas fa-info-circle"></i> Simulation indicative basée sur les moyennes observées sur le marché de l\'assurance au Maroc. Les résultats réels varient selon le produit (Auto, Santé, Risques Pro), la ville, le budget média et la réactivité commerciale de votre équipe.',
        en: '<i class="fas fa-info-circle"></i> Indicative projection based on benchmark data in the Moroccan insurance market. Actual metrics vary with coverage lines, city, ad budget, and sales team response times.',
        ar: '<i class="fas fa-info-circle"></i> محاكاة تقديرية مبنية على مؤشرات سوق التأمين بالمغرب. النتائج الفعلية تتفاوت حسب نوع المنتجات، المدينة، الميزانية وسرعة تجاوب فريقك التجاري.'
    },
    // Offers Header
    offers_badge: {
        fr: "Grille Tarifaire",
        en: "Pricing & Packages",
        ar: "الباقات والأسعار"
    },
    offers_title: {
        fr: "3 Formules Simples. <span class=\"neon\">Zéro Frais Cachés.</span>",
        en: "3 Clear Tiers. <span class=\"neon\">Zero Hidden Fees.</span>",
        ar: "3 باقات واضحة. <span class=\"neon\">بدون أي مصاريف خفية.</span>"
    },
    offers_p: {
        fr: "Choisissez la formule adaptée à vos ambitions de croissance sur votre zone de chalandise.",
        en: "Select the ideal tier aligned with your growth targets across your target territory.",
        ar: "اختر الباقة المناسبة لطموحاتك وتوسع وكالتك في رقعتك الجغرافية."
    },
    // STARTER
    offer_starter_title: {
        fr: "STARTER",
        en: "STARTER",
        ar: "باقة البداية (STARTER)"
    },
    offer_starter_f1: {
        fr: "Landing page haute conversion (Auto ou Santé)",
        en: "High-converting landing page (Auto or Health)",
        ar: "صفحة هبوط عالية التحويل (تأمين السيارات أو الصحة)"
    },
    offer_starter_f2: {
        fr: "Formulaire de demande de devis en 2 minutes",
        en: "2-minute rapid insurance quote request form",
        ar: "استمارة طلب تسعيرة سريعة في دقيقتين"
    },
    offer_starter_f3: {
        fr: "Tracking Google Analytics 4 & Pixel Meta",
        en: "Google Analytics 4 & Meta Pixel event tracking",
        ar: "تتبع متقدم عبر Google Analytics 4 و Meta Pixel"
    },
    offer_starter_f4: {
        fr: "Bouton WhatsApp Business direct intégré",
        en: "Integrated Direct WhatsApp Business button",
        ar: "زر تواصل مباشر ومبرمج عبر واتساب بزنس"
    },
    offer_starter_f5: {
        fr: "Hébergement sécurisé & design 100% mobile",
        en: "Secured hosting & 100% mobile-first design",
        ar: "استضافة سريعة وتصميم متوافق 100% مع الهواتف"
    },
    offer_starter_btn: {
        fr: "Démarrer en Starter",
        en: "Start with Starter",
        ar: "ابدأ بباقة STARTER"
    },
    // GROWTH
    offer_growth_badge: {
        fr: "Recommandé • Pack Complet",
        en: "Recommended • Full Pack",
        ar: "الأكثر طلباً • الباقة الشاملة"
    },
    offer_growth_title: {
        fr: "GROWTH",
        en: "GROWTH",
        ar: "باقة النمو (GROWTH)"
    },
    offer_growth_f1: {
        fr: "Système complet d'acquisition d'assurance clé en main",
        en: "Complete turnkey insurance acquisition framework",
        ar: "نظام استقطاب وتوليد عملاء تأمين متكامل وجاهز"
    },
    offer_growth_f2: {
        fr: "Landing pages dédiées par produit & intention locale",
        en: "Dedicated landing pages per product & localized intent",
        ar: "صفحات هبوط متعددة مخصصة لكل منتج تأمين"
    },
    offer_growth_f3: {
        fr: "Setup campagnes Google Ads (Search) + Meta Ads",
        en: "Complete Google Ads (Search) + Meta Ads campaign setup",
        ar: "إعداد وإطلاق حملات إعلانية مستهدفة على غوغل وميتا"
    },
    offer_growth_f4: {
        fr: "CRM dédié avec alertes leads instantanées (< 60s)",
        en: "Dedicated CRM pipeline with instant lead alerts (< 60s)",
        ar: "نظام إدارة علاقات العملاء (CRM) مع إشعارات فورية أقل من دقيقة"
    },
    offer_growth_f5: {
        fr: "Automatisation des relances devis par WhatsApp",
        en: "Automated WhatsApp follow-up triggers for quote requests",
        ar: "أتمتة المتابعة والتذكير بعروض الأسعار عبر واتساب"
    },
    offer_growth_f6: {
        fr: "Dashboard en direct du Coût d'Acquisition par Contrat",
        en: "Live tracking dashboard of Cost Per Signed Contract",
        ar: "لوحة تحكم مباشرة لقياس تكلفة كل عقد موقع"
    },
    offer_growth_guarantee: {
        fr: "<strong>GARANTIE D'ENGAGEMENT :</strong> Minimum 5 leads qualifiés garantis durant le 1er mois (demande complète, coordonnées vérifiées, zone cible), sinon gestion offerte le mois suivant.",
        en: "<strong>COMMITMENT GUARANTEE:</strong> Minimum 5 qualified leads guaranteed in Month 1 (verified phone, complete details, target territory), or our management is 100% free the following month.",
        ar: "<strong>ضمان الالتزام والأداء:</strong> نضمن لك 5 عملاء مؤهلين كحد أدنى خلال الشهر الأول، وإلا فإن إدارة حملاتك للشهر الموالي مجانية بالكامل."
    },
    offer_growth_btn: {
        fr: "Déployer le Système Growth",
        en: "Deploy Growth Engine",
        ar: "إطلاق باقة GROWTH"
    },
    // SCALE
    offer_scale_title: {
        fr: "SCALE",
        en: "SCALE",
        ar: "باقة التوسع (SCALE)"
    },
    offer_scale_f1: {
        fr: "Pilotage & optimisation continue des campagnes Google & Meta",
        en: "Continuous management & optimization of Google & Meta campaigns",
        ar: "إدارة وتحسين مستمر لحملات إعلانات غوغل وميتا"
    },
    offer_scale_f2: {
        fr: "A/B testing continu des annonces et tunnels de conversion",
        en: "Ongoing A/B testing of creatives and conversion tunnels",
        ar: "اختبار وتطوير دوري لصفحات الهبوط والإعلانات (A/B Testing)"
    },
    offer_scale_f3: {
        fr: "Optimisation continue du coût par contrat signé",
        en: "Continuous optimization of Cost Per Signed Policy",
        ar: "خفض مستمر لتكلفة الحصول على كل عقد موقع"
    },
    offer_scale_f4: {
        fr: "Reporting bimensuel d'analyse de rentabilité",
        en: "Bi-monthly detailed profitability and ROI reports",
        ar: "تقارير نصف شهرية تفصيلية لتحليل العائد على الاستثمار"
    },
    offer_scale_f5: {
        fr: "Support prioritaire & ajustements stratégiques continus",
        en: "Priority direct support & continuous strategic scaling",
        ar: "دعم مخصص ذو أولوية وتوجيه استراتيجي دائم"
    },
    offer_scale_btn: {
        fr: "Passer à l'Échelle",
        en: "Scale Up Today",
        ar: "ابدأ باقة التوسع SCALE"
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
        fr: "Audit Stratégique Offert",
        en: "Free Strategic Audit",
        ar: "تدقيق استراتيجي مجاني"
    },
    contact_title: {
        fr: "Analysons votre <br><span class=\"neon\">Zone Commerciale.</span>",
        en: "Analyze Your <br><span class=\"neon\">Territory Potential.</span>",
        ar: "دعنا نحلل <span class=\"neon\">منطقتك التجارية.</span>"
    },
    contact_p: {
        fr: "Réservez votre audit d'acquisition de 15 minutes. Nous analysons les volumes de recherche d'assurance dans votre ville et vous présentons le potentiel de leads mensuel.",
        en: "Book your 15-minute acquisition audit. We examine local insurance search volumes in your city and map out your monthly lead pipeline.",
        ar: "احجز جلسة تدقيق مدتها 15 دقيقة لتحليل حجم البحث عن التأمين في مدينتك وتقدير عدد العقود الممكن استقطابها شهرياً."
    },
    contact_exclusivity: {
        fr: "<i class=\"fas fa-map-marker-alt\" style=\"color: var(--brand-neon); margin-right: 6px;\"></i> <strong>Politique d'Exclusivité Territoriale :</strong> Afin de garantir la performance de nos campagnes et d'éviter tout conflit d'intérêts, nous limitons le nombre d'agences partenaires par zone géographique.",
        en: "<i class=\"fas fa-map-marker-alt\" style=\"color: var(--brand-neon); margin-right: 6px;\"></i> <strong>Territorial Exclusivity Policy:</strong> To maximize campaign performance and prevent any conflict of interest, we strictly limit partner agency intake per geographical area.",
        ar: "<i class=\"fas fa-map-marker-alt\" style=\"color: var(--brand-neon); margin-right: 6px;\"></i> <strong>سياسة الحصرية الجغرافية:</strong> لضمان أقصى أداء للحملات ومنع تضارب المصالح، نلتزم بعدد محدد ومحدود من الشركاء في كل منطقة."
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
    footer_copy: {
        fr: "ASSURLEAD - Pilotes du Démarrage Commercial Digital. Méthode +1.5MDH CA.",
        en: "ASSURLEAD - Digital Commercial Launch Pilots. +1.5M MAD Revenue Method.",
        ar: "ASSURLEAD - رواد الإطلاق التجاري الرقمي. منهجية +1.5 مليون درهم."
    },
    // Modal
    modal_badge: {
        fr: "Audit Stratégique d'Acquisition",
        en: "Strategic Acquisition Audit",
        ar: "تدقيق استراتيجي للاستقطاب"
    },
    modal_title: {
        fr: "Multipliez vos Devis <span class=\"neon\">d'Assurance.</span>",
        en: "Multiply Your <span class=\"neon\">Insurance Quotes.</span>",
        ar: "ضاعف مبيعاتك <span class=\"neon\">وعقود التأمين.</span>"
    },
    modal_p: {
        fr: "Réservez votre <strong>audit d'acquisition gratuit</strong> pour découvrir le volume de prospects d'assurance prêts à souscrire dans votre ville et déployer votre machine à contrats.",
        en: "Book your <strong>free acquisition audit</strong> to discover the exact volume of high-intent insurance prospects in your city and launch your customer acquisition machine.",
        ar: "احجز <strong>تدقيقك المجاني</strong> لاكتشاف حجم العملاء المستعدين للاكتتاب في مدينتك وبناء منظومة استقطاب عقود فورية."
    },
    modal_btn: {
        fr: "Réservez mon Audit Gratuit",
        en: "Book My Free Audit",
        ar: "حجز التدقيق المجاني الآن"
    },
    modal_timer: {
        fr: "Exclusivité territoriale par zone géographique",
        en: "Strict territorial exclusivity per zone",
        ar: "حصرية جغرافية مشروطة لكل منطقة"
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
            starter: {
                fr: "2 900 - 4 900 <span>DH</span>",
                en: "2,900 - 4,900 <span>DH</span>",
                ar: "2 900 - 4 900 <span>درهم</span>"
            },
            growth: {
                fr: "15 000 - 25 000 <span>DH installation</span>",
                en: "15,000 - 25,000 <span>DH setup</span>",
                ar: "15 000 - 25 000 <span>درهم للإطلاق</span>"
            },
            scale: {
                fr: "4 000 - 8 000 <span>DH/mois</span>",
                en: "4,000 - 8,000 <span>DH/month</span>",
                ar: "4 000 - 8 000 <span>درهم/شهر</span>"
            }
        };
        const keys = ['starter', 'growth'];
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
        
        // Benchmark Assurance Maroc: CPL moyen ~28 MAD, Panier moyen (Prime) ~2,800 MAD
        const leads = Math.floor(budget / 28);
        const sales = Math.floor(leads * (conv / 100));
        const revenue = sales * 2800;
        const roi = budget > 0 ? ((revenue - budget) / budget) * 100 : 0;

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

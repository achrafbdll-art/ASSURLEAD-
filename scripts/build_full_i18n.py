# -*- coding: utf-8 -*-
"""
Generator to ensure 100% translation coverage across all HTML pages and script.js
"""
import re
import os

print("Preparing comprehensive translation dictionary and updater...")

# Translations mapping for city and common pages
CITY_COMMON_TRANSLATIONS = {
    # Nav additions
    "nav_home": {
        "fr": "Accueil",
        "en": "Home",
        "ar": "الرئيسية"
    },
    "nav_casablanca": {
        "fr": "Casablanca",
        "en": "Casablanca",
        "ar": "الدار البيضاء"
    },
    "nav_maroc": {
        "fr": "Maroc",
        "en": "Morocco",
        "ar": "المغرب"
    },
    "nav_processus": {
        "fr": "Processus",
        "en": "Process",
        "ar": "المسار"
    },
    "nav_realisations": {
        "fr": "Réalisations",
        "en": "Portfolio",
        "ar": "الإنجازات"
    },
    "nav_approche": {
        "fr": "Notre Approche",
        "en": "Our Approach",
        "ar": "منهجيتنا"
    },
    "nav_diagnostic": {
        "fr": "<span class=\"diag-pulse-dot\"></span> Diagnostic",
        "en": "<span class=\"diag-pulse-dot\"></span> Diagnostic",
        "ar": "<span class=\"diag-pulse-dot\"></span> التشخيص"
    },
    "nav_start": {
        "fr": "Audit Gratuit",
        "en": "Free Audit",
        "ar": "تدقيق مجاني"
    },
    "nav_consultation": {
        "fr": "Consultation Gratuite",
        "en": "Free Consultation",
        "ar": "استشارة مجانية"
    },
    "breadcrumb_back": {
        "fr": "<i class=\"fas fa-arrow-left\"></i> <span>Revenir à l'accueil du site</span>",
        "en": "<i class=\"fas fa-arrow-left\"></i> <span>Back to main home</span>",
        "ar": "<i class=\"fas fa-arrow-right\"></i> <span>العودة للصفحة الرئيسية</span>"
    },
    "chat_badge": {
        "fr": "WhatsApp",
        "en": "WhatsApp",
        "ar": "واتساب"
    },
    "footer_seo_title": {
        "fr": "Expertise Digitale & Référencement au Maroc",
        "en": "Digital Expertise & SEO in Morocco",
        "ar": "الخبرة الرقمية والتموضع على غوغل بالمغرب"
    },
    "footer_copy": {
        "fr": "ASSURLEAD COM — Agence de création de sites web professionnels & référencement SEO au Maroc 🇲🇦",
        "en": "ASSURLEAD COM — Professional Web Creation & SEO Agency in Morocco 🇲🇦",
        "ar": "أسورليد كوم — وكالة إنشاء المواقع الاحترافية والسيو في المغرب 🇲🇦"
    },

    # Funnel enhancements (processus.html)
    "funnel_step_01": { "fr": "ÉTAPE 01", "en": "STEP 01", "ar": "الخطوة 01" },
    "funnel_step_02": { "fr": "ÉTAPE 02", "en": "STEP 02", "ar": "الخطوة 02" },
    "funnel_step_03": { "fr": "ÉTAPE 03", "en": "STEP 03", "ar": "الخطوة 03" },
    "funnel_step_04": { "fr": "ÉTAPE 04", "en": "STEP 04", "ar": "الخطوة 04" },
    "funnel_step_05": { "fr": "ÉTAPE 05", "en": "STEP 05", "ar": "الخطوة 05" },
    "funnel_step_06": { "fr": "ÉTAPE 06", "en": "STEP 06", "ar": "الخطوة 06" },
    "funnel_step_07": { "fr": "ÉTAPE 07", "en": "STEP 07", "ar": "الخطوة 07" },
    "funnel_step_08": { "fr": "ÉTAPE 08", "en": "STEP 08", "ar": "الخطوة 08" },
    "funnel_step_09": { "fr": "ÉTAPE 09", "en": "STEP 09", "ar": "الخطوة 09" },
    "funnel_phase1_timing": { "fr": "Délais : 24 à 48 heures", "en": "Turnaround: 24 to 48 hours", "ar": "المدة: 24 إلى 48 ساعة" },
    "funnel_phase2_timing": { "fr": "Sprint garanti : 7 à 10 jours ouvrés", "en": "Guaranteed sprint: 7 to 10 business days", "ar": "إنجاز مضمون: 7 إلى 10 أيام عمل" },
    "funnel_phase3_timing": { "fr": "Modèle agence : mensuel récurrent sans engagement", "en": "Agency model: monthly retainer with no lock-in", "ar": "نموذج الوكالة: اشتراك شهري مستمر بدون التزام" },
    "funnel_flow_contract": { "fr": "Contractualisation & Verrouillage Territoire", "en": "Contracting & Territory Lock", "ar": "التعاقد وتثبيت المنطقة الحصرية" },
    "funnel_s2_offert": { "fr": "100% OFFERT", "en": "100% FREE", "ar": "100% مجاني" },
    "funnel_s2_cta": { "fr": "<i class=\"fab fa-whatsapp\"></i> Réserver cet Audit (Offert) <i class=\"fas fa-arrow-right\"></i>", "en": "<i class=\"fab fa-whatsapp\"></i> Book this Free Audit <i class=\"fas fa-arrow-right\"></i>", "ar": "<i class=\"fab fa-whatsapp\"></i> حجز هذا التدقيق (مجاناً) <i class=\"fas fa-arrow-left\"></i>" },
    "funnel_guar_title": { "fr": "<i class=\"fas fa-award neon\"></i> Pourquoi ce système fait d'AssurLead une vraie agence structurée ?", "en": "<i class=\"fas fa-award neon\"></i> Why does this system make AssurLead a truly structured agency?", "ar": "<i class=\"fas fa-award neon\"></i> لماذا يجعل هذا النظام من أسورليد وكالة حقيقية منظمة وموثوقة؟" },
    "funnel_g1_title": { "fr": "Exclusivité Territoriale", "en": "Territorial Exclusivity", "ar": "حصرية جغرافية تامة" },
    "funnel_g1_desc": { "fr": "Un seul courtier partenaire par zone géographique pour éviter tout conflit d'intérêts direct.", "en": "Only one partner broker per geographic territory to prevent direct conflict of interest.", "ar": "وسيط شريك واحد فقط لكل منطقة جغرافية لمنع أي تضارب مباشر في المصالح." },
    "funnel_g2_title": { "fr": "Contrat & Acompte 50%", "en": "Contract & 50% Deposit", "ar": "عقد قانوني ودفعة 50%" },
    "funnel_g2_desc": { "fr": "Un cadre juridique clair avec calendrier d'exécution strict et protection financière mutuelle.", "en": "Clear legal contract with rigorous execution milestones and mutual financial protection.", "ar": "إطار قانوني واضح بجدول زمني محدد وحماية مالية متبادلة للطرفين." },
    "funnel_g3_title": { "fr": "Sprint Industriel 7-10j", "en": "Industrial Sprint 7-10 Days", "ar": "إنتاج سريع في 7-10 أيام" },
    "funnel_g3_desc": { "fr": "Une chaîne de production normée, sans retard et validée selon les Core Web Vitals de Google.", "en": "Standardized production line delivered on time and validated on Google Core Web Vitals.", "ar": "خط إنتاج منظم دون أي تأخير ومطابق لمعايير الأداء والسرعة من جوجل." },
    "funnel_g4_title": { "fr": "Accompagnement MRR", "en": "Monthly Retainer & Growth", "ar": "متابعة شهرية مستمرة" },
    "funnel_g4_desc": { "fr": "Un abonnement mensuel transparent centré sur le coût par lead qualifié et le retour sur investissement.", "en": "Transparent monthly retainer focused on qualified lead cost and measurable ROI.", "ar": "اشتراك شهري شفاف يركز على تكلفة العميل المؤهل وتحقيق أعلى عائد على الاستثمار." },

    # Common KPI Cards
    "kpi_speed_val": { "fr": "< 1.2s", "en": "< 1.2s", "ar": "< 1.2ث" },
    "kpi_speed_title": { "fr": "Temps de Chargement", "en": "Loading Speed", "ar": "سرعة التحميل" },
    "kpi_speed_desc": { "fr": "Vitesse mobile ultra-rapide validée sur les Core Web Vitals de Google.", "en": "Ultra-fast mobile speed validated on Google Core Web Vitals.", "ar": "سرعة فائقة على الهواتف متوافقة مع معايير Google Core Web Vitals." },
    "kpi_delay_val": { "fr": "10 - 14j", "en": "10 - 14d", "ar": "10 - 14 يوماً" },
    "kpi_delay_title": { "fr": "Délai Garanti", "en": "Guaranteed Deadline", "ar": "مدة تسليم مضمونة" },
    "kpi_delay_desc": { "fr": "Livraison clé en main avec nom de domaine, hébergement SSL et SEO configuré.", "en": "Turnkey delivery with domain name, secure SSL hosting, and SEO setup.", "ar": "تسليم متكامل مع اسم النطاق واستضافة آمنة بشهادة SSL وتهيئة السيو." },
    "kpi_owner_val": { "fr": "100%", "en": "100%", "ar": "100%" },
    "kpi_owner_title": { "fr": "Propriété Exclusive", "en": "Exclusive Ownership", "ar": "ملكية حصرية كاملة" },
    "kpi_owner_desc": { "fr": "Code source et leads 100% propriétaires à votre entreprise, sans dépendance tierce.", "en": "Source code and customer leads 100% owned by your company, no vendor lock-in.", "ar": "الشفرة البرمجية وقاعدة بيانات العملاء ملك خالص لشركتك دون أي تبعية." },
    "kpi_whatsapp_val": { "fr": "1 clic", "en": "1 click", "ar": "نقرة واحدة" },
    "kpi_whatsapp_title": { "fr": "Tunnel WhatsApp", "en": "WhatsApp Funnel", "ar": "مسار واتساب مباشر" },
    "kpi_whatsapp_desc": { "fr": "Routage instantané des visiteurs vers vos commerciaux sans friction.", "en": "Instant frictionless routing of visitors straight to your sales advisors.", "ar": "توجيه فوري وسلس للزوار نحو فريق مبيعاتك بنقرة واحدة." },

    # Common Pillars / Process (4 Steps)
    "pillar_section_badge": { "fr": "Méthode en 4 Étapes", "en": "4-Step Process", "ar": "منهجية في 4 خطوات" },
    "pillar_1_title": { "fr": "1. Audit & Cadrage Stratégique", "en": "1. Audit & Strategic Scoping", "ar": "1. التدقيق والتأطير الاستراتيجي" },
    "pillar_1_desc": { "fr": "Analyse de vos cibles locales, des mots-clés recherchés au Maroc et définition de l'arborescence de votre site.", "en": "Analysis of your local target audience, high-intent Moroccan search queries, and site architecture mapping.", "ar": "تحليل جمهورك المستهدف، الكلمات المفتاحية الأكثر بحثاً في المغرب وتحديد هيكل الموقع." },
    "pillar_2_title": { "fr": "2. Design UI/UX & Rédaction", "en": "2. UI/UX Design & Copywriting", "ar": "2. تصميم عصري وصياغة مقنعة" },
    "pillar_2_desc": { "fr": "Création graphique sur-mesure aux couleurs de votre marque et rédaction persuasive orientée conversion de contacts.", "en": "Tailored brand visual design and persuasive copywriting focused on inbound lead conversion.", "ar": "تصميم مخصص يعكس هويتك وصياغة محتوى احترافي موجه لتحويل الزوار إلى زبائن." },
    "pillar_3_title": { "fr": "3. Livraison en 10-14 jours", "en": "3. Turnkey Delivery in 10-14 Days", "ar": "3. تسليم شامل في 10-14 يوماً" },
    "pillar_3_desc": { "fr": "Mise en ligne avec certificat SSL, vérification de la vitesse mobile et déclaration de l'indexation sur Google Search Console.", "en": "Production launch with SSL certificate, mobile speed checks, and Google Search Console indexing submission.", "ar": "الإطلاق مع شهادة أمان SSL، التحقق من سرعة الهواتف وطلب الأرشفة في Google Search Console." },
    "pillar_4_title": { "fr": "4. Acquisition & Suivi", "en": "4. Inbound Acquisition & Support", "ar": "4. الاستقطاب والمتابعة المستمرة" },
    "pillar_4_desc": { "fr": "Activation des canaux WhatsApp, accompagnement à la prise en main et suivi du positionnement local sur Google.", "en": "Activation of WhatsApp funnels, operational onboarding, and continuous monitoring of local Google rankings.", "ar": "تفعيل قنوات واتساب، التدريب على الاستخدام ومتابعة الترتيب المحلي على جوجل." },

    # Common Pricing Section
    "pricing_section_badge": { "fr": "Grille Tarifaire Transparente", "en": "Transparent Pricing Grid", "ar": "أسعار شفافة ومحددة" },
    "pricing_section_title": { "fr": "Des tarifs clairs et sans frais cachés", "en": "Clear Pricing With No Hidden Fees", "ar": "أسعار واضحة وبدون أي رسوم خفية" },
    "pricing_section_desc": { "fr": "Nos formules répondent aux besoins réels des entreprises du Maroc, du lancement au système d'acquisition complet.", "en": "Our plans fit the real needs of Moroccan businesses, from early launch to full-scale lead machines.", "ar": "باقاتنا تلبي الاحتياجات الحقيقية للشركات في المغرب، من الانطلاقة وحتى منظومة الاستقطاب المتكاملة." },
    "price_launch_badge": { "fr": "OFFRE DE LANCEMENT", "en": "LAUNCH OFFER", "ar": "عرض الإطلاق" },
    "price_p1_title": { "fr": "Vitrine Essentielle — 1 500 DH", "en": "Essential Showcase — 1,500 DH", "ar": "الموقع التعريفي الأساسي — 1500 درهم" },
    "price_p1_desc": { "fr": "Offre valable jusqu'au 31/10/2026. Idéale pour démarrer avec une page de présentation soignée (n'inclut pas de SEO avancé ni de pages services dédiées).", "en": "Offer valid until 31/10/2026. Ideal to start with a polished single landing page (excludes advanced SEO and dedicated service subpages).", "ar": "عرض ساري حتى 31/10/2026. مثالي للانطلاق بصفحة تعريفية أنيقة (لا يشمل السيو المتقدم أو صفحات فرعية متعددة)." },
    "price_starter_badge": { "fr": "FORMULE STARTER", "en": "STARTER PLAN", "ar": "باقة الانطلاق" },
    "price_p2_title": { "fr": "Starter — 2 000 DH", "en": "Starter — 2,000 DH", "ar": "باقة Starter — 2000 درهم" },
    "price_p2_desc": { "fr": "Site professionnel clé en main, hébergement et nom de domaine inclus la 1ère année, responsive mobile et contact WhatsApp.", "en": "Complete turnkey website, domain and hosting included for year 1, mobile responsive and direct WhatsApp button.", "ar": "موقع احترافي متكامل، الاستضافة والنطاق مجاناً للسنة الأولى، متجاوب مع الهواتف وزر واتساب مباشر." },
    "price_growth_badge": { "fr": "LE PLUS POPULAIRE", "en": "MOST POPULAR", "ar": "الأكثر طلباً" },
    "price_p3_title": { "fr": "Growth — 4 500 DH", "en": "Growth — 4,500 DH", "ar": "باقة Growth — 4500 درهم" },
    "price_p3_desc": { "fr": "Site complet multipages avec référencement naturel local sur Google, tunnels de conversion et optimisation Google Business Profile.", "en": "Complete multi-page site with local Google SEO, high-conversion funnels, and Google Business Profile setup.", "ar": "موقع متعدد الصفحات مع سيو محلي متقدم على جوجل، مسارات تحويل وتهيئة حساب Google Business Profile." },
    "price_lead_badge": { "fr": "ACQUISITION ACTIVE", "en": "ACTIVE ACQUISITION", "ar": "استقطاب مكثف" },
    "price_p4_title": { "fr": "Lead Engine — 8 000 DH", "en": "Lead Engine — 8,000 DH", "ar": "باقة Lead Engine — 8000 درهم" },
    "price_p4_desc": { "fr": "Moteur d'acquisition intensif, fonctionnalités e-commerce ou formulaires de devis avancés pour PME et cabinets ambitieux.", "en": "High-performance acquisition engine, e-commerce or advanced quote funnels for ambitious companies.", "ar": "منظومة استقطاب مكثفة، إمكانات تجارة إلكترونية أو استمارات تسعير متطورة للشركات الطموحة." },

    # Case study
    "case_callout_badge": { "fr": "<span class=\"badge-flag\">🇲🇦</span> Étude de Cas Réelle", "en": "<span class=\"badge-flag\">🇲🇦</span> Live Case Study", "ar": "<span class=\"badge-flag\">🇲🇦</span> دراسة حالة واقعية" },
    "case_callout_title": { "fr": "Cabinet Assurances El Omrani (AXA Casablanca)", "en": "Assurances El Omrani Broker (AXA Casablanca)", "ar": "مكتب التأمين العمراني (أكسا الدار البيضاء)" },
    "case_callout_desc": { "fr": "Déploiement du site www.assuranceselomrani.com : un moteur digital ultra-rapide générant des demandes de devis d'assurance en flux continu avec un positionnement en 1ère page Google.", "en": "Deployment of www.assuranceselomrani.com: an ultra-fast digital engine generating continuous quote requests with page 1 Google ranking.", "ar": "إطلاق موقع www.assuranceselomrani.com: منصة رقمية فائقة السرعة تجلب طلبات عروض أسعار متواصلة مع تصدر الصفحة الأولى على جوجل." },
    "case_callout_btn": { "fr": "<i class=\"fas fa-arrow-right\"></i> Lire l'étude de cas complète", "en": "<i class=\"fas fa-arrow-right\"></i> Read the full case study", "ar": "<i class=\"fas fa-arrow-left\"></i> قراءة دراسة الحالة الكاملة" },
    "case_stat_val": { "fr": "1ère Page", "en": "1st Page", "ar": "الصفحة الأولى" },
    "case_stat_label": { "fr": "Google SEO Maroc", "en": "Google SEO Morocco", "ar": "سيو جوجل المغرب" },
    "case_stat_sub": { "fr": "Résultats mesurables et canal de contact direct WhatsApp actif 24h/24.", "en": "Measurable results and direct active WhatsApp inquiry channel 24/7.", "ar": "نتائج ملموسة وقناة تواصل واتساب نشطة على مدار الساعة." },

    # Consultation CTA
    "consult_badge": { "fr": "<span class=\"badge-flag\">🇲🇦</span> Déploiement Clé en Main", "en": "<span class=\"badge-flag\">🇲🇦</span> Turnkey Deployment", "ar": "<span class=\"badge-flag\">🇲🇦</span> تنفيذ وتسليم شامل" },
    "consult_whatsapp_btn": { "fr": "<i class=\"fab fa-whatsapp\"></i> Devis Rapide sur WhatsApp", "en": "<i class=\"fab fa-whatsapp\"></i> Quick Quote on WhatsApp", "ar": "<i class=\"fab fa-whatsapp\"></i> طلب عرض سعر فوري عبر واتساب" },
    "consult_diag_btn": { "fr": "Consulter le Diagnostic de Visibilité <i class=\"fas fa-chart-line\"></i>", "en": "View Visibility Diagnostic <i class=\"fas fa-chart-line\"></i>", "ar": "الاطلاع على تشخيص الرؤية الرقمية <i class=\"fas fa-chart-line\"></i>" },
    "consult_trust_1": { "fr": "Délai garanti 7-10 jours", "en": "Guaranteed 7-10 day turnaround", "ar": "مدة تسليم مضمونة 7-10 أيام" },
    "consult_trust_2": { "fr": "Sans engagement de durée", "en": "No long-term commitment", "ar": "بدون أي التزام زمني" },
    "consult_trust_3": { "fr": "Paiement 50/50 sécurisé", "en": "Secure 50/50 payment", "ar": "دفع آمن 50/50 على مرحلتين" },

    # City-specific: CASABLANCA
    "casa_hero_badge": { "fr": "<span class=\"badge-flag\">🇲🇦</span> CASABLANCA & MÉTROPOLE ÉCONOMIQUE", "en": "<span class=\"badge-flag\">🇲🇦</span> CASABLANCA & ECONOMIC HUB", "ar": "<span class=\"badge-flag\">🇲🇦</span> الدار البيضاء والقطب الاقتصادي" },
    "casa_hero_title": { "fr": "Création de Site Web à Casablanca :<br><span class=\"neon\">Des Plateformes Conçues pour Capter des Clients</span>", "en": "Website Creation in Casablanca:<br><span class=\"neon\">High-Performance Platforms Built to Convert Leads</span>", "ar": "إنشاء المواقع الإلكترونية في الدار البيضاء:<br><span class=\"neon\">منصات مصممة خصيصاً لجلب العملاء</span>" },
    "casa_hero_sub": { "fr": "Vous recherchez une agence spécialisée en <strong>création site web Casablanca</strong> pour générer des contacts qualifiés plutôt qu'une simple carte de visite en ligne ? Dans la capitale économique du Maroc, votre présence sur Google décide de votre chiffre d'affaires : nous concevons des sites vitrines et e-commerce rapides, responsives et taillés pour transformer les recherches locales en opportunités commerciales réelles.", "en": "Looking for an agency specialized in <strong>website creation in Casablanca</strong> to generate qualified leads rather than a basic online business card? In Morocco's economic capital, your Google presence drives your revenue: we build fast, responsive showcase and e-commerce websites built to turn local searches into real business opportunities.", "ar": "هل تبحث عن وكالة متخصصة في <strong>إنشاء المواقع بالدار البيضاء</strong> لجلب عملاء مؤهلين بدلاً من مجرد بطاقة عمل بسيطة؟ في العاصمة الاقتصادية للمملكة، يحدد ظهورك على غوغل حجم مبيعاتك: نصمم مواقع تعريفية ومتاجر سريعة ومتجاوبة تحول عمليات البحث المحلية إلى صفقات حقيقية." },
    "casa_btn_whatsapp": { "fr": "<i class=\"fab fa-whatsapp\"></i> Devis Rapide sur WhatsApp", "en": "<i class=\"fab fa-whatsapp\"></i> Quick Quote on WhatsApp", "ar": "<i class=\"fab fa-whatsapp\"></i> عرض سعر فوري عبر واتساب" },
    "casa_btn_realisations": { "fr": "<i class=\"fas fa-check-circle\"></i> Voir nos Réalisations", "en": "<i class=\"fas fa-check-circle\"></i> View Portfolio", "ar": "<i class=\"fas fa-check-circle\"></i> مشاهدة أعمالنا" },
    "casa_btn_maroc": { "fr": "<i class=\"fas fa-globe\"></i> Offre Nationale Maroc", "en": "<i class=\"fas fa-globe\"></i> Morocco National Plan", "ar": "<i class=\"fas fa-globe\"></i> العرض الوطني للمغرب" },
    "casa_sec_badge": { "fr": "Architecture & Standards", "en": "Architecture & Standards", "ar": "المعايير والهندسة الرقمية" },
    "casa_sec_title": { "fr": "Ce que comprend la création de votre site internet à Casablanca", "en": "What Your Casablanca Website Package Includes", "ar": "ما يشمله إنشاء موقعك الإلكتروني في الدار البيضاء" },
    "casa_sec_desc": { "fr": "Chaque projet web combine rigueur d'ingénierie front-end et stratégie de référencement naturel local.", "en": "Every web project combines front-end engineering precision with aggressive local SEO strategy.", "ar": "يجمع كل مشروع بين دقة البرمجة العصرية واستراتيجية التموضع المحلي على محركات البحث." },
    "casa_c1_title": { "fr": "SITE VITRINE & RESPONSIVE", "en": "RESPONSIVE SHOWCASE SITE", "ar": "موقع تعريفي متجاوب" },
    "casa_c1_desc": { "fr": "Conception adaptée aux smartphones (91% du trafic à Casablanca), ergonomie fluide et valorisation de votre image de marque.", "en": "Optimized for mobile (91% of Casablanca web traffic), smooth ergonomics and strong brand elevation.", "ar": "تصميم مثالي للهواتف (91% من زيارات البيضاء عبر الجوال)، تجربة تصفح سلسة وإبراز لهويتك." },
    "casa_c2_title": { "fr": "RÉFÉRENCEMENT NATUREL SEO", "en": "LOCAL SEO RANKING", "ar": "التموضع الطبيعي سيو" },
    "casa_c2_desc": { "fr": "Structure sémantique HTML5, balisage Schema.org et mots-clés ciblés sur les quartiers de Casablanca (Anfa, Maarif, Sidi Maarouf).", "en": "HTML5 semantic markup, Schema.org tagging, and target keywords for Casablanca districts (Anfa, Maarif, Sidi Maarouf).", "ar": "هيكلة سيمانتيك HTML5، وسوم Schema.org واستهداف دقيق لأحياء الدار البيضاء (أنفا، المعاريف، سيدي معروف)." },
    "casa_c3_title": { "fr": "WHATSAPP COMMERCIAL", "en": "COMMERCIAL WHATSAPP", "ar": "واتساب تجاري مباشر" },
    "casa_c3_desc": { "fr": "Intégration de boutons d'appel et de discussion WhatsApp pré-remplis pour déclencher des conversations avec vos prospects chauds.", "en": "Integration of pre-filled WhatsApp click-to-chat buttons triggering immediate sales discussions with warm leads.", "ar": "دمج أزرار واتساب برسائل مجهزة مسبقاً لفتح محادثات فورية مع العملاء الجادين." },
    "casa_c4_title": { "fr": "HÉBERGEMENT & NOM DE DOMAINE", "en": "HOSTING & DOMAIN NAME", "ar": "الاستضافة واسم النطاق" },
    "casa_c4_desc": { "fr": "Configuration complète de votre nom de domaine .ma ou .com avec certificat SSL HTTPS et boîtes emails professionnelles incluses.", "en": "Full setup of your .ma or .com domain with secure HTTPS/SSL certificate and custom business email addresses.", "ar": "تهيئة كاملة لنطاقك .ma أو .com مع شهادة أمان SSL HTTPS وبريد إلكتروني مهني." },
    "casa_c5_title": { "fr": "GOOGLE BUSINESS PROFILE", "en": "GOOGLE BUSINESS PROFILE", "ar": "ملف GOOGLE BUSINESS" },
    "casa_c5_desc": { "fr": "Optimisation de votre présence sur Google Maps pour capter les requêtes à proximité immédiate dans la métropole casablancaise.", "en": "Optimization of your Google Maps listing to dominate local proximity searches across the Casablanca metropolis.", "ar": "تحسين تواجدك على خرائط جوجل لاستقطاب عمليات البحث القريبة في مختلف مناطق البيضاء." },
    "casa_c6_title": { "fr": "CORE WEB VITALS OPTIMISÉS", "en": "CORE WEB VITALS TUNED", "ar": "معايير CORE WEB VITALS" },
    "casa_c6_desc": { "fr": "Chargement instantané, zéro script superflu et respect scrupuleux des critères techniques imposés par Google.", "en": "Instant loading, zero bloatware scripts, and rigorous adherence to Google technical performance criteria.", "ar": "تحميل فوري في أجزاء من الثانية، بدون ملفات زائدة مع الالتزام الصارم بمعايير جوجل التقنية." },
    "casa_method_title": { "fr": "Notre processus de création site web Casablanca", "en": "Our Casablanca Website Creation Process", "ar": "مسار إنشاء المواقع في الدار البيضاء" },
    "casa_faq_badge": { "fr": "FAQ Spécialisée", "en": "Local FAQ", "ar": "الأسئلة الشائعة" },
    "casa_faq_title": { "fr": "Questions fréquentes sur la <span class=\"neon\">création site web Casablanca</span>", "en": "Frequently Asked Questions on <span class=\"neon\">Casablanca Website Creation</span>", "ar": "الأسئلة الشائعة حول <span class=\"neon\">إنشاء المواقع بالدار البيضاء</span>" },
    "casa_faq_sub": { "fr": "Toutes les réponses pour préparer votre projet web en toute sérénité.", "en": "All the answers you need to prepare your web project with peace of mind.", "ar": "كل الإجابات لتجهيز مشروعك الرقمي بكل ثقة واطمئنان." },
    "casa_faq_q1": { "fr": "Combien coûte la création d'un site web à Casablanca ?", "en": "How much does a website cost in Casablanca?", "ar": "كم تبلغ تكلفة إنشاء موقع إلكتروني في الدار البيضاء؟" },
    "casa_faq_a1": { "fr": "Chez ASSURLEAD, notre offre d'appel débute à 1 500 DH pour une page de présentation essentielle (valable jusqu'au 31/10/2026). Nos formules complètes s'échelonnent ensuite selon vos objectifs : Starter à 2 000 DH, Growth à 4 500 DH avec référencement naturel local, Lead Engine à 8 000 DH pour un moteur commercial avancé, et Formule Acquisition sur-mesure à partir de 12 000 DH.", "en": "At ASSURLEAD, our entry offer starts at 1,500 DH for an essential showcase page (valid until 31/10/2026). Our full plans scale based on your goals: Starter at 2,000 DH, Growth at 4,500 DH with local SEO, Lead Engine at 8,000 DH for advanced commercial lead engines, and custom Acquisition plans from 12,000 DH.", "ar": "في أسورليد، تبدأ عروضنا من 1500 درهم لصفحة تعريفية أساسية (سارية حتى 31/10/2026). وتتوزع باقاتنا المتكاملة حسب أهدافك: Starter بـ 2000 درهم، Growth بـ 4500 درهم مع سيو محلي، Lead Engine بـ 8000 درهم لمحرك تجاري متطور، وباقة الاستقطاب المخصصة ابتداءً من 12000 درهم." },
    "casa_faq_q2": { "fr": "Combien de temps faut-il pour livrer un site internet à Casablanca ?", "en": "How long does it take to deliver a website in Casablanca?", "ar": "كم يستغرق تسليم الموقع الإلكتروني في الدار البيضاء؟" },
    "casa_faq_a2": { "fr": "Notre délai moyen de livraison est de 10 à 14 jours ouvrés. Ce délai court est garanti grâce à notre méthodologie éprouvée et à notre chaîne de production sans intermédiaire.", "en": "Our average delivery time is 10 to 14 business days. This fast turnaround is guaranteed thanks to our tested methodology and direct production process.", "ar": "متوسط مدة التسليم لدينا هو 10 إلى 14 يوم عمل، بفضل منهجيتنا الدقيقة وفريقنا الداخلي المتخصص." },
    "casa_faq_q3": { "fr": "Pourquoi privilégier le référencement naturel local à Casablanca ?", "en": "Why prioritize local SEO in Casablanca?", "ar": "لماذا يجب التركيز على السيو المحلي في الدار البيضاء؟" },
    "casa_faq_a3": { "fr": "Casablanca concentre la plus forte concurrence digitale du Maroc. Être positionné en 1ère page Google sur des requêtes précises comme 'création site web Maarif' ou vos spécialités vous apporte des prospects chauds chaque semaine, sans dépendre du coût élevé de la publicité payante.", "en": "Casablanca holds Morocco's highest digital competition. Ranking on Google page 1 for targeted queries brings you warm inbound prospects every week without depending on costly paid ads.", "ar": "تضم الدار البيضاء المنافسة الرقمية الأكبر بالمغرب. التصدر في الصفحة الأولى على غوغل يجلب لك زبائن مؤهلين أسبوعياً بدون استنزاف ميزانيتك في الإعلانات المدفوعة." },
    "casa_cta_title": { "fr": "Prêt à lancer votre site web performant à Casablanca ?", "en": "Ready to launch a high-performing website in Casablanca?", "ar": "مستعد لإطلاق موقعك الإلكتروني الرائد بالدار البيضاء؟" },
    "casa_cta_desc": { "fr": "Contactez notre équipe dès aujourd'hui pour un diagnostic gratuit de 15 minutes et recevez un plan d'action chiffré.", "en": "Contact our team today for a free 15-minute diagnostic and receive a quantified action plan.", "ar": "تواصل مع فريقنا اليوم للاستفادة من تدقيق مجاني لمدة 15 دقيقة واستلام خطة عمل مفصلة." },

    # City-specific: RABAT
    "rabat_hero_badge": { "fr": "<span class=\"badge-flag\">🇲🇦</span> RABAT, HAY RIAD & AGDAL", "en": "<span class=\"badge-flag\">🇲🇦</span> RABAT, HAY RIAD & AGDAL", "ar": "<span class=\"badge-flag\">🇲🇦</span> الرباط، حي الرياض وأكدال" },
    "rabat_hero_title": { "fr": "Création de Site Web à Rabat :<br><span class=\"neon\">Autorité Institutionnelle & Leads Qualifiés</span>", "en": "Website Creation in Rabat:<br><span class=\"neon\">Institutional Authority & High-Value Leads</span>", "ar": "إنشاء المواقع الإلكترونية في الرباط:<br><span class=\"neon\">مصداقية مؤسسية واستقطاب زبائن نوعيين</span>" },
    "rabat_hero_sub": { "fr": "Vous recherchez une agence experte en <strong>création de site internet à Rabat</strong> pour asseoir votre notoriété auprès des décideurs de la capitale ? À Rabat, centre névralgique des ministères, ambassades, cabinets d'affaires à Hay Riad et entreprises innovantes de Technopolis, votre site web doit inspirer une confiance absolue. Nous concevons des plateformes rapides, élégantes et rigoureusement optimisées pour le référencement naturel Google.", "en": "Looking for an expert agency for <strong>website creation in Rabat</strong> to establish your authority with capital decision-makers? In Rabat, hub of ministries, embassies, business firms in Hay Riad, and tech startups in Technopolis, your website must inspire absolute trust. We craft fast, elegant platforms strictly tuned for Google organic SEO.", "ar": "هل تبحث عن وكالة خبيرة في <strong>إنشاء المواقع بالرباط</strong> لترسيخ مكانتك لدى صناع القرار في العاصمة؟ في الرباط، المركز الحيوي للوزارات والسفارات ومكاتب الأعمال بحي الرياض وشركات تكنوبوليس، يجب أن يعكس موقعك ثقة مطلقة. نصمم منصات أنيقة وسريعة ومتصدرة على غوغل." },
    "rabat_btn_whatsapp": { "fr": "<i class=\"fab fa-whatsapp\"></i> Devis Rabat sur WhatsApp", "en": "<i class=\"fab fa-whatsapp\"></i> Rabat Quote on WhatsApp", "ar": "<i class=\"fab fa-whatsapp\"></i> طلب عرض سعر بالرباط عبر واتساب" },
    "rabat_sec_badge": { "fr": "Écosystème Rbati", "en": "Rabat Business Ecosystem", "ar": "بيئة الأعمال بالرباط" },
    "rabat_sec_title": { "fr": "Des solutions calibrées pour les professionnels de Rabat", "en": "Solutions Tailored for Rabat Professionals", "ar": "حلول مدروسة للمهنيين والشركات بالرباط" },
    "rabat_sec_desc": { "fr": "Une expertise sectorielle adaptée aux exigences de la capitale du Royaume.", "en": "Sector expertise matched to the prestige and standards of the Kingdom's capital.", "ar": "خبرة قطاعية متماشية مع متطلبات ومعايير عاصمة المملكة." },
    "rabat_s1_title": { "fr": "Cabinets Juridiques & Conseils", "en": "Legal & Advisory Firms", "ar": "مكاتب الاستشارات والمحاماة" },
    "rabat_s1_desc": { "fr": "Vitrines institutionnelles sobres et statutaires pour avocats, notaires et experts-comptables de l'Agdal et Hay Riad.", "en": "Stately institutional showcases for lawyers, notaries, and chartered accountants in Agdal and Hay Riad.", "ar": "مواقع مؤسسية راقية للمحامين، الموثقين والخبراء المحاسبين في أكدال وحي الرياض." },
    "rabat_s2_title": { "fr": "Technopolis & Startups B2B", "en": "Technopolis & B2B Tech", "ar": "تكنوبوليس والشركات الناشئة B2B" },
    "rabat_s2_desc": { "fr": "Plateformes modernes pour éditeurs de logiciels, cabinets de formation et sociétés de services numériques de Rabat-Salé.", "en": "Modern platforms for software vendors, corporate training centers, and digital services firms in Rabat-Salé.", "ar": "منصات حديثة لشركات البرمجيات ومراكز التدريب وشركات الخدمات الرقمية برباط-سلا." },
    "rabat_s3_title": { "fr": "Santé, Cliniques & Praticiens", "en": "Healthcare & Private Clinics", "ar": "المصحات والمراكز الطبية" },
    "rabat_s3_desc": { "fr": "Sites médicaux clairs avec modules de prise de contact pour centres spécialisés et cliniques privées de Rabat.", "en": "Clear medical portals with patient contact funnels for private clinics and specialized centers in Rabat.", "ar": "مواقع طبية احترافية مع قنوات تواصل مباشرة للمصحات الخاصة والأطباء بالرباط." },
    "rabat_why_badge": { "fr": "Visibilité & Conversion", "en": "Visibility & Conversion", "ar": "الرؤية والتحويل" },
    "rabat_why_title": { "fr": "Pourquoi le référencement Google à Rabat est un impératif", "en": "Why Google SEO in Rabat Is a Strategic Imperative", "ar": "لماذا يعد تصدر غوغل في الرباط ضرورة استراتيجية" },
    "rabat_why_desc": { "fr": "Les décideurs et résidents de Rabat recherchent leurs prestataires directement sur leur smartphone.", "en": "Rabat decision-makers and residents search for trusted providers directly on mobile.", "ar": "يبحث صناع القرار وسكان الرباط عن مقدمي الخدمات مباشرة عبر هواتفهم الذكية." },
    "rabat_p1_title": { "fr": "SEO Hyper-Localisé", "en": "Hyper-Local SEO", "ar": "سيو محلي دقيق" },
    "rabat_p1_desc": { "fr": "Positionnement stratégique sur les requêtes ciblées à Hay Riad, Agdal, Souissi et Hassan pour capter les opportunités locales.", "en": "Strategic rankings on targeted searches in Hay Riad, Agdal, Souissi, and Hassan to capture high-value leads.", "ar": "تموضع استراتيجي في أحياء الرياض، أكدال، السويسي وحسان لجلب أفضل الفرص." },
    "rabat_p2_title": { "fr": "Gage de Crédibilité", "en": "Institutional Credibility", "ar": "مصداقية عالية" },
    "rabat_p2_desc": { "fr": "Un design épuré et rassurant qui convainc immédiatement les directeurs d'achats, ministères et partenaires institutionnels.", "en": "A refined, reassuring design that immediately convinces corporate buyers and institutions.", "ar": "تصميم أنيق ومطمئن يقنع مدراء المشتريات والمؤسسات الكبرى على الفور." },
    "rabat_p3_title": { "fr": "Synergie Métropolitaine", "en": "Metropolitan Synergy", "ar": "تكامل جهوي" },
    "rabat_p3_desc": { "fr": "Ciblage étendu à l'agglomération Rabat-Salé-Kénitra pour maximiser votre zone de chalandise commerciale.", "en": "Extended targeting across the Rabat-Salé-Kénitra urban hub to expand your client pool.", "ar": "استهداف موسع يشمل محور الرباط-سلا-القنيطرة لتوسيع نطاق عملائك." },
    "rabat_p4_title": { "fr": "Tarifs Garantis", "en": "Guaranteed Pricing", "ar": "أسعار مضمونة" },
    "rabat_p4_desc": { "fr": "Grille forfaitaire sans surprise : à partir de 1 500 DH pour l'offre vitrine jusqu'aux dispositifs complets d'acquisition.", "en": "Fixed transparent pricing: starting from 1,500 DH up to complete inbound acquisition systems.", "ar": "أسعار ثابتة بدون مفاجآت: ابتداءً من 1500 درهم للباقة التعريفية وصولاً لمنظومة الاستقطاب." },
    "rabat_faq_title": { "fr": "Questions fréquentes sur la <span class=\"neon\">création de site web à Rabat</span>", "en": "Frequently Asked Questions on <span class=\"neon\">Rabat Website Creation</span>", "ar": "الأسئلة الشائعة حول <span class=\"neon\">إنشاء المواقع في الرباط</span>" },
    "rabat_faq_q1": { "fr": "Pourquoi créer un site internet dédié à Rabat ?", "en": "Why build a site tailored for Rabat?", "ar": "لماذا يجب إنشاء موقع مخصص للرباط؟" },
    "rabat_faq_a1": { "fr": "La clientèle rbati recherche des prestataires sérieux, transparents et réactifs. Avoir un site web optimisé sur Rabat positionne votre entreprise comme un acteur de référence face aux institutions et grands comptes.", "en": "Rabat clients seek serious, responsive, transparent partners. A site optimized for Rabat positions your business as an authority for corporate and institutional accounts.", "ar": "يبحث عملاء الرباط عن شركاء يتسمون بالجدية والشفافية. يمنحك الموقع المصمم خصيصاً للرباط مكانة مرجعية أمام كبار العملاء." },
    "rabat_faq_q2": { "fr": "Combien de temps prend la conception d'un site à Rabat ?", "en": "How long does design take in Rabat?", "ar": "كم يستغرق تصميم الموقع بالرباط؟" },
    "rabat_faq_a2": { "fr": "Nous livrons votre site web clé en main en 10 à 14 jours ouvrés avec hébergement sécurisé HTTPS et nom de domaine inclus.", "en": "We deliver your turnkey website in 10 to 14 business days with secure HTTPS hosting and domain included.", "ar": "نسلم موقعك مكتملاً في 10 إلى 14 يوم عمل مع استضافة آمنة ونطاق مجاني." },
    "rabat_faq_q3": { "fr": "Puis-je cibler à la fois Rabat et d'autres villes du Maroc ?", "en": "Can I target both Rabat and other cities?", "ar": "هل يمكن استهداف الرباط ومدن مغربية أخرى معاً؟" },
    "rabat_faq_a3": { "fr": "Absolument. Nos architectures SEO prévoient des pages régionales et nationales pour capter des clients à Rabat, Casablanca, Marrakech ou partout au Maroc.", "en": "Absolutely. Our SEO architecture sets up local and national landing pages capturing clients in Rabat, Casablanca, Marrakech, or across Morocco.", "ar": "بالتأكيد. تتيح بنيتنا التقنية استهداف الرباط والدار البيضاء ومراكش ومختلف ربوع المملكة في آن واحد." },
    "rabat_cta_title": { "fr": "Prêt à asseoir votre autorité digitale à Rabat ?", "en": "Ready to build your digital authority in Rabat?", "ar": "مستعد لترسيخ حضورك الرقمي القوي في الرباط؟" },
    "rabat_cta_desc": { "fr": "Échangez en direct avec notre directeur d'acquisition sur WhatsApp et recevez une proposition chiffrée sous 24h.", "en": "Chat directly with our acquisition director on WhatsApp and receive a detailed quote within 24 hours.", "ar": "تواصل مباشرة مع مدير الاستقطاب عبر واتساب واستلم عرضاً مفصلاً خلال 24 ساعة." },

    # City-specific: MARRAKECH
    "kech_hero_badge": { "fr": "<span class=\"badge-flag\">🇲🇦</span> MARRAKECH, GUÉLIZ & HIVERNAGE", "en": "<span class=\"badge-flag\">🇲🇦</span> MARRAKECH, GUELIZ & HIVERNAGE", "ar": "<span class=\"badge-flag\">🇲🇦</span> مراكش، كليز والحي الشتوي" },
    "kech_hero_title": { "fr": "Création de Site Web à Marrakech :<br><span class=\"neon\">Élégance Visuelle & Réservations Directes</span>", "en": "Website Creation in Marrakech:<br><span class=\"neon\">Visual Elegance & Direct Online Bookings</span>", "ar": "إنشاء المواقع الإلكترونية في مراكش:<br><span class=\"neon\">أناقة بصرية وحجوزات مباشرة</span>" },
    "kech_hero_sub": { "fr": "Vous cherchez une agence spécialisée en <strong>création de site internet à Marrakech</strong> capable de refléter le standing exceptionnel de votre établissement ? À Marrakech, capitale touristique et carrefour du luxe, votre site web doit séduire instantanément une clientèle internationale et locale exigeante. Nous concevons des plateformes immersives, ultra-rapides et taillées pour générer des réservations et demandes directes sans commissions d'intermédiaires.", "en": "Seeking an agency specialized in <strong>website creation in Marrakech</strong> to reflect your venue's exceptional standards? In Marrakech, world capital of hospitality and luxury, your website must instantly charm discerning international and local clients. We craft immersive, ultra-fast platforms designed to drive direct bookings with zero commissions.", "ar": "هل تبحث عن وكالة خبيرة في <strong>إنشاء المواقع بمراكش</strong> تعكس المستوى الراقي لمشروعك؟ في عاصمة السياحة والضيافة، يجب أن يبهر موقعك الزوار الدوليين والمحليين من النظرة الأولى. نصمم منصات بصرية ساحرة وفائقة السرعة لتوليد حجوزات وطلبات مباشرة بدون عمولات وسيطة." },
    "kech_btn_whatsapp": { "fr": "<i class=\"fab fa-whatsapp\"></i> Devis Marrakech sur WhatsApp", "en": "<i class=\"fab fa-whatsapp\"></i> Marrakech Quote on WhatsApp", "ar": "<i class=\"fab fa-whatsapp\"></i> طلب عرض سعر بمراكش عبر واتساب" },
    "kech_sec_badge": { "fr": "Secteurs Clés Marrakech", "en": "Marrakech Key Sectors", "ar": "القطاعات الرائدة بمراكش" },
    "kech_sec_title": { "fr": "Des sites web conçus pour le rayonnement de Marrakech", "en": "Websites Built for Marrakech's Prestige", "ar": "مواقع مصممة لإشعاع مشاريع مراكش" },
    "kech_sec_desc": { "fr": "Une réponse digitale sur-mesure pour les acteurs de l'hôtellerie, de l'immobilier et des services haut de gamme.", "en": "Tailored digital execution for hospitality, luxury real estate, and premier lifestyle services.", "ar": "حلول رقمية راقية لقطاعات الفندقة، العقار والخدمات الممتازة." },
    "kech_s1_title": { "fr": "Riads, Hôtels & Maisons d'Hôtes", "en": "Riads, Hotels & Boutique Stays", "ar": "الرياضات، الفنادق ودور الضيافة" },
    "kech_s1_desc": { "fr": "Galeries immersives, intégration de moteurs de réservation directe et multilinguisme (FR, EN, AR) pour capter les voyageurs.", "en": "Immersive visual showcases, direct booking integration, and multilingual setups (FR, EN, AR) for global travelers.", "ar": "معارض صور جذابة، دمج محركات الحجز المباشر ودعم كامل للغات (فرنسية، إنجليزية، عربية)." },
    "kech_s2_title": { "fr": "Immobilier & Conciergeries de Luxe", "en": "Luxury Real Estate & Concierge", "ar": "العقارات الفاخرة وخدمات الكونسيرج" },
    "kech_s2_desc": { "fr": "Présentation haute définition de villas dans la Palmeraie, fiches biens détaillées et tunnel WhatsApp pour acheteurs fortunés.", "en": "High-definition villa portfolios in the Palmeraie, detailed property listings, and instant WhatsApp inquiry funnels.", "ar": "عرض عالي الدقة لفيلات النخيل، بطاقات عقارية مفصلة وقناة واتساب مباشرة للمستثمرين." },
    "kech_s3_title": { "fr": "Restaurants & Excursions Désert", "en": "Dining, Desert & Experiences", "ar": "المطاعم، رحلات الصحراء والأنشطة" },
    "kech_s3_desc": { "fr": "Menus interactifs, réservation de tables et programmes d'excursions vers Agafay ou l'Atlas avec paiement sécurisé.", "en": "Interactive menus, table booking, and excursion schedules to Agafay and Atlas with secure payments.", "ar": "قوائم طعام تفاعلية، حجز طاولات وجداول رحلات نحو أكافاي والأطلس مع خيارات دفع آمنة." },
    "kech_why_badge": { "fr": "SEO & Réservations Directes", "en": "SEO & Direct Sales", "ar": "السيو والحجوزات المباشرة" },
    "kech_why_title": { "fr": "Pourquoi un site performant à Marrakech change tout", "en": "Why a High-Performing Marrakech Website Changes Everything", "ar": "لماذا يحدث الموقع الاحترافي بمراكش فارقاً حاسماً" },
    "kech_why_desc": { "fr": "Échappez aux commissions étouffantes des plateformes tierces (Booking, Airbnb) et captez directement vos clients.", "en": "Bypass high commission fees from third-party platforms and capture your clients directly.", "ar": "تخلص من عمولات المنصات الوسيطة واستقطب زبائنك ومسافريك مباشرة." },
    "kech_p1_title": { "fr": "Réservation 100% Directe", "en": "100% Direct Bookings", "ar": "حجز مباشر 100%" },
    "kech_p1_desc": { "fr": "Gardez 100% de vos marges en convertissant vos visiteurs directement via WhatsApp ou formulaire dédié.", "en": "Retain 100% of your margins by converting web visitors directly via WhatsApp or booking forms.", "ar": "حافظ على كامل أرباحك بتحويل الزوار مباشرة عبر واتساب أو استمارات الحجز." },
    "kech_p2_title": { "fr": "Référencement International", "en": "International SEO", "ar": "سيو دولي ومحلي" },
    "kech_p2_desc": { "fr": "Positionnement sur Google pour les voyageurs préparant leur séjour à Marrakech depuis l'Europe, le Golfe ou les USA.", "en": "Rank on Google for travelers planning their Marrakech trip from Europe, the Gulf, or the Americas.", "ar": "تصدر نتائج غوغل للمسافرين الباحثين عن رحلات مراكش من أوروبا، الخليج وأمريكا." },
    "kech_p3_title": { "fr": "Vitesse Mobile Éclair", "en": "Lightning Mobile Speed", "ar": "سرعة تصفح فائقة" },
    "kech_p3_desc": { "fr": "Moins de 1.2s de chargement même en 4G, indispensable pour les touristes en mobilité dans la Médina.", "en": "Under 1.2s load speed on 4G, essential for tourists on the move across the Medina.", "ar": "تحميل في أقل من 1.2 ثانية على شبكات الهاتف، مثالي للسياح المتنقلين داخل المدينة." },
    "kech_p4_title": { "fr": "Image de Marque Distinguée", "en": "Distinctive Brand Prestige", "ar": "هوية بصرية استثنائية" },
    "kech_p4_desc": { "fr": "Une esthétique visuelle haut de gamme qui justifie vos tarifs et séduit une clientèle à fort pouvoir d'achat.", "en": "Premier visual aesthetics reinforcing premium pricing and attracting affluent clients.", "ar": "طابع بصري راقٍ يعكس فخامة خدماتك ويجذب عملاء ذوي قدرة شرائية عالية." },
    "kech_faq_title": { "fr": "Questions fréquentes sur la <span class=\"neon\">création de site web à Marrakech</span>", "en": "Frequently Asked Questions on <span class=\"neon\">Marrakech Website Creation</span>", "ar": "الأسئلة الشائعة حول <span class=\"neon\">إنشاء المواقع في مراكش</span>" },
    "kech_faq_q1": { "fr": "Le site sera-t-il disponible en plusieurs langues ?", "en": "Will the website be multilingual?", "ar": "هل سيكون الموقع متوفراً بعدة لغات؟" },
    "kech_faq_a1": { "fr": "Oui, nous configurons le multilinguisme complet (français, anglais, arabe ou autres) pour accueillir vos visiteurs internationaux sans aucune barrière.", "en": "Yes, we implement complete multilingual support (French, English, Arabic, etc.) to welcome international visitors seamlessly.", "ar": "نعم، نهيئ الموقع بجميع اللغات (فرنسية، إنجليزية، عربية وغيرها) لاستقبال زوارك الدوليين بسلاسة." },
    "kech_faq_q2": { "fr": "Puis-je intégrer des paiements par carte bancaire (CMI / Stripe) ?", "en": "Can I integrate credit card payments (CMI / Stripe)?", "ar": "هل يمكن دمج الدفع بالبطاقات البنكية (CMI / Stripe)؟" },
    "kech_faq_a2": { "fr": "Absolument. Nous intégrons les passerelles marocaines CMI ou internationales Stripe / PayPal selon votre modèle d'encaissement.", "en": "Absolutely. We integrate Moroccan CMI gateways or international Stripe/PayPal processors based on your needs.", "ar": "بالتأكيد، نقوم بدمج بوابات الدفع المغربية CMI أو الدولية Stripe وPayPal حسب رغبتك." },
    "kech_faq_q3": { "fr": "Quel est le délai de mise en ligne à Marrakech ?", "en": "What is the launch timeline in Marrakech?", "ar": "ما هي مدة الإطلاق بمراكش؟" },
    "kech_faq_a3": { "fr": "Votre site est prêt et opérationnel en 10 à 14 jours ouvrés avec hébergement sécurisé et nom de domaine inclus.", "en": "Your website goes live in 10 to 14 business days with secure hosting and custom domain included.", "ar": "يكون موقعك جاهزاً ومنشوراً بالكامل خلال 10 إلى 14 يوم عمل مع النطاق والاستضافة." },
    "kech_cta_title": { "fr": "Prêt à sublimer votre présence en ligne à Marrakech ?", "en": "Ready to elevate your online presence in Marrakech?", "ar": "مستعد للارتقاء بحضورك الرقمي في مراكش؟" },
    "kech_cta_desc": { "fr": "Contactez-nous pour un audit offert et découvrez comment capter des réservations directes dès le premier mois.", "en": "Contact us for a free audit and discover how to capture direct bookings from month one.", "ar": "تواصل معنا للاستفادة من تدقيق مجاني واكتشف كيف تجلب حجوزات مباشرة من الشهر الأول." },

    # City-specific: TANGER
    "tgr_hero_badge": { "fr": "<span class=\"badge-flag\">🇲🇦</span> TANGER, TANGER MED & FREE ZONES", "en": "<span class=\"badge-flag\">🇲🇦</span> TANGIER, TANGER MED & FREE ZONES", "ar": "<span class=\"badge-flag\">🇲🇦</span> طنجة، ميناء طنجة المتوسط والمناطق الحرة" },
    "tgr_hero_title": { "fr": "Création de Site Web à Tanger :<br><span class=\"neon\">Industrie, Logistique & Croissance B2B</span>", "en": "Website Creation in Tangier:<br><span class=\"neon\">Industry, Logistics & B2B Expansion</span>", "ar": "إنشاء المواقع الإلكترونية في طنجة:<br><span class=\"neon\">الصناعة، اللوجستيك ونمو أعمال B2B</span>" },
    "tgr_hero_sub": { "fr": "Vous recherchez une agence spécialisée en <strong>création de site web à Tanger</strong> pour accélérer vos contrats commerciaux et partenariats industriels ? Au carrefour de l'Europe et de l'Afrique, avec le géant Tanger Med, les zones franches automobiles et le dynamisme du détroit, votre entreprise doit projeter une stature internationale irréprochable. Nous concevons des plateformes robustes, bilingues et optimisées pour générer des consultations de décideurs B2B.", "en": "Looking for a specialized agency for <strong>website creation in Tangier</strong> to accelerate commercial contracts and industrial partnerships? At the crossroads of Europe and Africa, driven by Tanger Med, automotive free zones, and Strait trade, your business must project flawless global authority. We craft robust, bilingual platforms optimized to capture B2B inquiries.", "ar": "هل تبحث عن وكالة متخصصة في <strong>إنشاء المواقع بطنجة</strong> لتسريع عقودك وشراكاتك الصناعية؟ في بوابة المغرب نحو أوروبا وإفريقيا، ومع الزخم الاستثنائي لميناء طنجة المتوسط والمناطق الحرة، يجب أن يبرز موقعك مكانة دولية واثقة. نصمم منصات قوية ومزدوجة اللغة لجلب عقود B2B." },
    "tgr_btn_whatsapp": { "fr": "<i class=\"fab fa-whatsapp\"></i> Devis Tanger sur WhatsApp", "en": "<i class=\"fab fa-whatsapp\"></i> Tangier Quote on WhatsApp", "ar": "<i class=\"fab fa-whatsapp\"></i> طلب عرض سعر بطنجة عبر واتساب" },
    "tgr_sec_badge": { "fr": "Hub du Détroit", "en": "Strait Economic Hub", "ar": "قطب البوغاز الاقتصادي" },
    "tgr_sec_title": { "fr": "Des solutions digitales pour les leaders du Nord", "en": "Digital Solutions for Northern Morocco Leaders", "ar": "حلول رقمية رائدة لشركات الشمال" },
    "tgr_sec_desc": { "fr": "Accompagnement adapté aux entreprises de l'industrie, du transit et des services maritimes.", "en": "Strategic guidance tailored for industrial, freight, and maritime service companies.", "ar": "مواكبة موجهة لشركات الصناعة، الشحن والخدمات اللوجستية." },
    "tgr_s1_title": { "fr": "Logistique, Fret & Tanger Med", "en": "Logistics, Freight & Tanger Med", "ar": "اللوجستيك، الشحن وطنجة المتوسط" },
    "tgr_s1_desc": { "fr": "Catalogues de prestations de transit, formulaires de cotation fret et présentation multilingue (FR, EN, ES).", "en": "Freight forwarding service directories, quotation request tools, and multilingual execution (FR, EN, ES).", "ar": "عرض خدمات العبور والشحن، استمارات طلب تسعير لوجستي ودعم كامل للغات (فرنسية، إنجليزية، إسبانية)." },
    "tgr_s2_title": { "fr": "Sous-traitance Industrielle & Free Zones", "en": "Industrial Subcontracting & Free Zones", "ar": "المناولة الصناعية والمناطق الحرة" },
    "tgr_s2_desc": { "fr": "Vitrines B2B pour usines, équipementiers automobiles et ateliers certifiés ISO de la Tanger Automotive City.", "en": "B2B portals for factories, automotive suppliers, and ISO-certified workshops in Tanger Automotive City.", "ar": "مواقع B2B للمصانع، موردي قطاع السيارات والوحدات المعتمدة بمعايير ISO بمدينة صناعة السيارات." },
    "tgr_s3_title": { "fr": "Immobilier Balnéaire & Tourisme", "en": "Coastal Real Estate & Tourism", "ar": "العقار الساحلي والمشاريع السياحية" },
    "tgr_s3_desc": { "fr": "Sites modernes pour promoteurs, agences immobilières et résidences de standing sur la baie de Tanger.", "en": "Modern showcases for developers, real estate brokers, and premium residences along the Bay of Tangier.", "ar": "مواقع عصرية للمنعشين العقاريين ووكالات العقار والإقامات الراقية على خليج طنجة." },
    "tgr_why_badge": { "fr": "Avantage Concurrentiel", "en": "Competitive Edge", "ar": "أسبقية تنافسية" },
    "tgr_why_title": { "fr": "Pourquoi votre présence Google à Tanger est déterminante", "en": "Why Your Tangier Google Presence Is Decisive", "ar": "لماذا يعد حضورك على غوغل بطنجة أمراً حاسماً" },
    "tgr_why_desc": { "fr": "Les investisseurs et donneurs d'ordre européens vérifient votre sérieux sur le web avant toute signature.", "en": "European investors and contracting authorities check your digital authority before signing any deal.", "ar": "يتحقق المستثمرون والشركاء الدوليون من مصداقيتك عبر موقعك قبل توقيع أي عقد تجاري." },
    "tgr_p1_title": { "fr": "Bilinguisme International", "en": "International Multilingualism", "ar": "تعدد لغات دولي" },
    "tgr_p1_desc": { "fr": "Versions complètes en français, anglais et espagnol pour échanger sans friction avec les marchés voisins.", "en": "Full versions in French, English, and Spanish to communicate smoothly with European partners.", "ar": "نسخ متكاملة بالفرنسية والإنجليزية والإسبانية للتواصل السلس مع الشركاء الأجانب." },
    "tgr_p2_title": { "fr": "SEO B2B Ciblé", "en": "Targeted B2B SEO", "ar": "سيو B2B متخصص" },
    "tgr_p2_desc": { "fr": "Référencement sur les requêtes d'acheteurs industriels et logistiques recherchant des partenaires au Nord du Maroc.", "en": "Rank on queries from industrial and supply chain procurement managers seeking Northern Morocco partners.", "ar": "تموضع مدروس على كلمات مسؤولي المشتريات والخدمات اللوجستية الباحثين عن شركاء بالشمال." },
    "tgr_p3_title": { "fr": "Conformité & Sécurité", "en": "Security & Compliance", "ar": "أمان ومعايير معتمدة" },
    "tgr_p3_desc": { "fr": "Hébergement ultra-sécurisé, chiffrement HTTPS et conformité aux standards des multinationales.", "en": "High-security hosting, HTTPS encryption, and full compliance with corporate enterprise standards.", "ar": "استضافة عالية الأمان، تشفير كامل HTTPS وتوافق مع معايير الشركات العالمية." },
    "tgr_p4_title": { "fr": "Livraison en 10-14 jours", "en": "Turnkey in 10-14 Days", "ar": "تسليم في 10-14 يوماً" },
    "tgr_p4_desc": { "fr": "Déploiement rapide sans mobiliser excessivement vos équipes opérationnelles.", "en": "Rapid deployment without pulling your internal operational teams away from their core work.", "ar": "إطلاق سريع ومرن دون إثقال كاهل فرق عملك الداخلية." },
    "tgr_faq_title": { "fr": "Questions fréquentes sur la <span class=\"neon\">création de site web à Tanger</span>", "en": "Frequently Asked Questions on <span class=\"neon\">Tangier Website Creation</span>", "ar": "الأسئلة الشائعة حول <span class=\"neon\">إنشاء المواقع في طنجة</span>" },
    "tgr_faq_q1": { "fr": "Le site peut-il intégrer des demandes de devis complexes pour le B2B ?", "en": "Can the site handle complex B2B quote requests?", "ar": "هل يمكن للموقع استقبال طلبات تسعير B2B معقدة؟" },
    "tgr_faq_a1": { "fr": "Oui, nous concevons des formulaires de qualification sur-mesure avec upload de cahier des charges et notification instantanée par email et WhatsApp.", "en": "Yes, we build custom qualification forms with RFP file uploads and instant alerts via email and WhatsApp.", "ar": "نعم، نصمم استمارات مخصصة تسمح بإرفاق دفاتر التحملات مع إشعار فوري عبر البريد وواتساب." },
    "tgr_faq_q2": { "fr": "Comment assurez-vous le référencement naturel à Tanger ?", "en": "How do you ensure SEO in Tangier?", "ar": "كيف تضمنون التموضع على محركات البحث بطنجة؟" },
    "tgr_faq_a2": { "fr": "Nous ciblons les mots-clés stratégiques liés à votre industrie combinés à Tanger et sa région, avec balisage technique et optimisation Google Business Profile.", "en": "We target high-intent keywords linked to your sector combined with Tangier, reinforced with technical tagging and Google Business tuning.", "ar": "نستهدف الكلمات المفتاحية الاستراتيجية لقطاعك في طنجة والمنطقة مع تهيئة حساب خرائط غوغل." },
    "tgr_faq_q3": { "fr": "Proposez-vous une maintenance après la mise en ligne ?", "en": "Do you offer post-launch maintenance?", "ar": "هل تقدمون خدمة الصيانة بعد الإطلاق؟" },
    "tgr_faq_a3": { "fr": "Oui, notre abonnement mensuel agence couvre les sauvegardes, la sécurité, les mises à jour et le support prioritaire 7j/7.", "en": "Yes, our monthly agency retainer covers backups, security, updates, and 7/7 priority support.", "ar": "نعم، يشمل اشتراكنا الشهري النسخ الاحتياطي، الحماية، التحديثات والدعم الفني طيلة أيام الأسبوع." },
    "tgr_cta_title": { "fr": "Prêt à accélérer vos opportunités B2B à Tanger ?", "en": "Ready to accelerate your B2B opportunities in Tangier?", "ar": "مستعد لمضاعفة عقود B2B لشركتك في طنجة؟" },
    "tgr_cta_desc": { "fr": "Contactez notre équipe pour un audit gratuit de 15 minutes et recevez un plan d'action adapté à votre marché.", "en": "Contact our team for a free 15-minute audit and receive a customized roadmap for your market.", "ar": "تواصل مع فريقنا لتدقيق مجاني لمدة 15 دقيقة واستلم خطة عمل مخصصة لقطاعك." },

    # City-specific: FES
    "fes_hero_badge": { "fr": "<span class=\"badge-flag\">🇲🇦</span> FÈS, MÉDINA & PARCS INDUSTRIELS", "en": "<span class=\"badge-flag\">🇲🇦</span> FEZ, MEDINA & INDUSTRIAL PARKS", "ar": "<span class=\"badge-flag\">🇲🇦</span> فاس، المدينة العتيقة والمناطق الصناعية" },
    "fes_hero_title": { "fr": "Création de Site Web à Fès :<br><span class=\"neon\">Artisanat, Tourisme & Essor Industriel</span>", "en": "Website Creation in Fez:<br><span class=\"neon\">Artisanal Craft, Tourism & Industrial Growth</span>", "ar": "إنشاء المواقع الإلكترونية في فاس:<br><span class=\"neon\">الصناعة التقليدية، السياحة والنمو الاقتصادي</span>" },
    "fes_hero_sub": { "fr": "Vous cherchez une agence experte en <strong>création de site internet à Fès</strong> pour faire rayonner votre savoir-faire et capter de nouveaux marchés ? Capitale spirituelle et culturelle du Maroc, pôle mondial de l'artisanat d'art et métropole industrielle en pleine modernisation (parc Fès Shore, agroalimentaire, textile), Fès exige une présence digitale moderne et vendeuse. Nous concevons des sites vitrines et e-commerce élégants, rapides et pensés pour conquérir des clients au Maroc comme à l'international.", "en": "Looking for an expert agency for <strong>website creation in Fez</strong> to showcase your heritage and capture new markets? Spiritual and cultural capital, world capital of traditional craft, and modernizing industrial center (Fez Shore, agribusiness, textile), Fez demands a modern, high-converting digital presence. We build fast, elegant showcase and e-commerce websites designed to win clients locally and globally.", "ar": "هل تبحث عن وكالة خبيرة في <strong>إنشاء المواقع بفاس</strong> لإبراز خبرتك واستقطاب أسواق جديدة؟ كعاصمة علمية وتاريخية للمملكة ومركز عالمي للصناعة التقليدية وقطب صناعي متطور (فاس شور، الصناعات الغذائية والنسيج)، تحتاج مشاريع فاس لحضور رقمي مقنع وعصري. نصمم مواقع ومتاجر رقمية متألقة وسريعة." },
    "fes_btn_whatsapp": { "fr": "<i class=\"fab fa-whatsapp\"></i> Devis Fès sur WhatsApp", "en": "<i class=\"fab fa-whatsapp\"></i> Fez Quote on WhatsApp", "ar": "<i class=\"fab fa-whatsapp\"></i> طلب عرض سعر بفاس عبر واتساب" },
    "fes_sec_badge": { "fr": "Patrimoine & Dynamisme", "en": "Heritage & Dynamism", "ar": "الأصالة والتطور" },
    "fes_sec_title": { "fr": "Des plateformes web pensées pour l'économie fassie", "en": "Web Platforms Engineered for Fez's Economy", "ar": "منصات رقمية مصممة لاقتصاد فاس" },
    "fes_sec_desc": { "fr": "Valoriser le savoir-faire ancestral tout en activant des leviers commerciaux modernes.", "en": "Showcasing authentic mastery while activating modern digital sales funnels.", "ar": "إبراز المهارة العريقة مع تفعيل أحدث قنوات التجارة والاستقطاب الرقمي." },
    "fes_s1_title": { "fr": "Tourisme, Riads & Médina", "en": "Tourism, Riads & Medina", "ar": "السياحة، الرياضات والمدينة العتيقة" },
    "fes_s1_desc": { "fr": "Présentation raffinée des maisons d'hôtes de la Médina, modules de réservation directe et galeries immersives.", "en": "Refined showcases for Medina boutique riads, direct booking engines, and immersive photography.", "ar": "إبراز أنيق لدور الضيافة بالمدينة القديمة مع محركات حجز مباشر ومعارض صور ممتعة." },
    "fes_s2_title": { "fr": "Artisanat d'Art & Export", "en": "Artisanal Craft & Export", "ar": "الصناعة التقليدية والتصدير" },
    "fes_s2_desc": { "fr": "Boutiques e-commerce pour poterie, zellige, cuir et tapis avec expédition internationale et paiement sécurisé.", "en": "E-commerce stores for pottery, zellij, leather, and carpets with worldwide shipping and secure checkout.", "ar": "متاجر إلكترونية للفخار، الزليج، المصنوعات الجلدية والزرابي مع شحن دولي ودفع آمن." },
    "fes_s3_title": { "fr": "PME & Parcs Industriels", "en": "SMEs & Industrial Hubs", "ar": "المقاولات والمناطق الصناعية" },
    "fes_s3_desc": { "fr": "Sites vitrines institutionnels pour fabricants textiles, coopératives agroalimentaires et prestataires B2B de Fès-Meknès.", "en": "Corporate websites for textile producers, agribusiness cooperatives, and B2B providers across Fez-Meknes.", "ar": "مواقع تعريفية لمصانع النسيج، التعاونيات الفلاحية وشركات الخدمات بجهة فاس-مكناس." },
    "fes_why_badge": { "fr": "Expansion Commerciale", "en": "Business Expansion", "ar": "توسع تجاري" },
    "fes_why_title": { "fr": "Pourquoi investir dans un site professionnel à Fès", "en": "Why Invest in a Professional Website in Fez", "ar": "لماذا يعد الاستثمار في موقع احترافي بفاس خطوة رابحة" },
    "fes_why_desc": { "fr": "Dépassez les limites du marché local et vendez vos prestations partout au Maroc et à l'étranger.", "en": "Go beyond local borders and sell your products and services throughout Morocco and abroad.", "ar": "تجاوز الحدود الجغرافية الضيقة وبع منتجاتك وخدماتك في سائر مدن المغرب والعالم." },
    "fes_p1_title": { "fr": "Vente Sans Intermédiaire", "en": "Direct Direct Sales", "ar": "بيع مباشر بدون وسطاء" },
    "fes_p1_desc": { "fr": "Connectez vos acheteurs directement à vos équipes sans dépendre des courtiers ou intermédiaires coûteux.", "en": "Connect buyers directly to your team without paying commissions to third-party middlemen.", "ar": "اربط عملاءك بفريقك مباشرة دون دفع عمولات باهظة للوسطاء." },
    "fes_p2_title": { "fr": "Visibilité Google Fès & National", "en": "Google Fez & National SEO", "ar": "ظهور على غوغل محلياً ووطنياً" },
    "fes_p2_desc": { "fr": "Positionnez-vous sur les requêtes ciblées à Fès, Meknès et dans tout le Royaume.", "en": "Rank on targeted searches in Fez, Meknes, and nationwide across Morocco.", "ar": "تصدر نتائج البحث في فاس ومكناس ومختلف ربوع المملكة." },
    "fes_p3_title": { "fr": "Multilinguisme Intégré", "en": "Integrated Multilingualism", "ar": "دعم متكامل للغات" },
    "fes_p3_desc": { "fr": "Sites en français, anglais et arabe pour séduire touristes, acheteurs et partenaires internationaux.", "en": "French, English, and Arabic setups to welcome tourists, foreign buyers, and global partners.", "ar": "مواقع بالفرنسية، الإنجليزية والعربية لاستقبال السياح والمستوردين الدوليين." },
    "fes_p4_title": { "fr": "Tarifs Accessibles & Clairs", "en": "Transparent & Accessible Rates", "ar": "أسعار واضحة ومناسبة" },
    "fes_p4_desc": { "fr": "Des offres adaptées aux budgets des PME et artisans fassis, à partir de 1 500 DH.", "en": "Packages tailored for Fez SMEs and craftsmen budgets, starting from 1,500 DH.", "ar": "باقات مدروسة تناسب ميزانيات مقاولات وصناع فاس، ابتداءً من 1500 درهم." },
    "fes_faq_title": { "fr": "Questions fréquentes sur la <span class=\"neon\">création de site web à Fès</span>", "en": "Frequently Asked Questions on <span class=\"neon\">Fez Website Creation</span>", "ar": "الأسئلة الشائعة حول <span class=\"neon\">إنشاء المواقع في فاس</span>" },
    "fes_faq_q1": { "fr": "Est-il possible de vendre des produits d'artisanat en ligne ?", "en": "Is it possible to sell handicrafts online?", "ar": "هل يمكن بيع منتجات الصناعة التقليدية عبر الإنترنت؟" },
    "fes_faq_a1": { "fr": "Oui, nous concevons des boutiques e-commerce clé en main avec catalogue, paiement sécurisé et calcul des frais de livraison au Maroc et à l'international.", "en": "Yes, we build turnkey e-commerce stores with product catalogs, secure checkout, and local/international shipping fee calculation.", "ar": "نعم، نبني متاجر إلكترونية شاملة مع كتالوج للمنتجات، دفع آمن وحساب تلقائي لمصاريف الشحن." },
    "fes_faq_q2": { "fr": "Combien de temps faut-il pour concevoir un site à Fès ?", "en": "How long does design take in Fez?", "ar": "كم يستغرق تصميم الموقع بفاس؟" },
    "fes_faq_a2": { "fr": "La livraison est effectuée en 10 à 14 jours ouvrés avec hébergement sécurisé, nom de domaine et SEO inclus.", "en": "Delivery takes 10 to 14 business days with secure hosting, domain, and SEO included.", "ar": "يتم التسليم خلال 10 إلى 14 يوم عمل مع النطاق والاستضافة وتهيئة السيو." },
    "fes_faq_q3": { "fr": "Comment les clients me contacteront-ils ?", "en": "How will customers reach me?", "ar": "كيف سيتواصل معي الزبائن؟" },
    "fes_faq_a3": { "fr": "Via des boutons d'appel direct, un canal WhatsApp connecté en 1 clic et des formulaires de demande de devis reçus instantanément.", "en": "Via direct phone call buttons, 1-click WhatsApp links, and instant inquiry forms.", "ar": "عبر الاتصال الهاتفي المباشر، زر واتساب بنقرة واحدة واستمارات طلب عروض الأسعار." },
    "fes_cta_title": { "fr": "Prêt à faire rayonner votre activité à Fès ?", "en": "Ready to expand your business in Fez?", "ar": "مستعد لتوسيع نشاطك التجاري بفاس؟" },
    "fes_cta_desc": { "fr": "Demandez votre audit gratuit de 15 minutes et recevez un plan de développement digital sur-mesure.", "en": "Request your free 15-minute audit and receive a tailored digital growth plan.", "ar": "اطلب تدقيقك المجاني لمدة 15 دقيقة واستلم خطة تطوير رقمي مخصصة." },

    # City-specific: AGADIR
    "aga_hero_badge": { "fr": "<span class=\"badge-flag\">🇲🇦</span> AGADIR, SOUSS-MASSA & TAGHAZOUT", "en": "<span class=\"badge-flag\">🇲🇦</span> AGADIR, SOUSS-MASSA & TAGHAZOUT", "ar": "<span class=\"badge-flag\">🇲🇦</span> أكادير، سوس ماسة وتغازوت" },
    "aga_hero_title": { "fr": "Création de Site Web à Agadir :<br><span class=\"neon\">Tourisme Balnéaire, Terroir & Agro-industrie</span>", "en": "Website Creation in Agadir:<br><span class=\"neon\">Seaside Tourism, Local Terroir & Agribusiness</span>", "ar": "إنشاء المواقع الإلكترونية في أكادير:<br><span class=\"neon\">السياحة الشاطئية، المنتجات المجالية والفلاحة</span>" },
    "aga_hero_sub": { "fr": "Vous recherchez une agence spécialisée en <strong>création de site internet à Agadir</strong> pour attirer des clients locaux, des vacanciers et des acheteurs internationaux ? Au cœur de la région Souss-Massa, 1ère zone agroalimentaire du Maroc et destination phare du tourisme balnéaire et du surf (Taghazout Bay), votre présence en ligne est votre premier commercial. Nous développons des sites rapides, responsives et taillés pour transformer les visites en réservations et commandes fermes.", "en": "Looking for an expert agency in <strong>website creation in Agadir</strong> to attract local clients, holidaymakers, and international buyers? At the heart of Souss-Massa, Morocco's leading agribusiness zone and premier coastal tourism and surf hub (Taghazout Bay), your online presence is your top salesperson. We build fast, responsive websites engineered to turn visits into bookings and confirmed sales.", "ar": "هل تبحث عن وكالة خبيرة في <strong>إنشاء المواقع بأكادير</strong> لجلب زبائن محليين وسياح ومستوردين دوليين؟ في قلب جهة سوس ماسة، القطب الفلاحي الأول بالمملكة والوجهة العالمية للسياحة الشاطئية وركوب الأمواج (تغازوت)، يعتبر موقعك هو رجل مبيعاتك الأول. نصمم مواقع فائقة السرعة تحول الزيارات إلى حجوزات وصفقات مؤكدة." },
    "aga_btn_whatsapp": { "fr": "<i class=\"fab fa-whatsapp\"></i> Devis Agadir sur WhatsApp", "en": "<i class=\"fab fa-whatsapp\"></i> Agadir Quote on WhatsApp", "ar": "<i class=\"fab fa-whatsapp\"></i> طلب عرض سعر بأكادير عبر واتساب" },
    "aga_sec_badge": { "fr": "Pôle Souss-Massa", "en": "Souss-Massa Hub", "ar": "قطب سوس ماسة" },
    "aga_sec_title": { "fr": "Des solutions digitales pour les fleurons d'Agadir", "en": "Digital Solutions for Agadir Flagships", "ar": "حلول رقمية متطورة لقطاعات أكادير" },
    "aga_sec_desc": { "fr": "Une expertise web adaptée au tourisme, à l'export de produits du terroir et à l'agriculture.", "en": "Web expertise tailored for tourism, terroir product exports, and agribusiness.", "ar": "خبرة رقمية تواكب السياحة، تصدير المنتجات المحلية والقطاع الفلاحي." },
    "aga_s1_title": { "fr": "Tourisme, Surf Camps & Hôtels", "en": "Tourism, Surf Camps & Hotels", "ar": "السياحة، نوادي السورف والفنادق" },
    "aga_s1_desc": { "fr": "Plateformes immersives pour résidences hôtelières, surf houses de Taghazout et clubs nautiques avec réservation directe.", "en": "Immersive platforms for beachfront resorts, Taghazout surf camps, and water sports clubs with direct bookings.", "ar": "منصات جذابة للإقامات الفندقية، نوادي ركوب الأمواج بتغازوت والأنشطة البحرية مع حجز مباشر." },
    "aga_s2_title": { "fr": "Huile d'Argan & Produits du Terroir", "en": "Argan Oil & Terroir Products", "ar": "زيت أركان والمنتجات المجالية" },
    "aga_s2_desc": { "fr": "Boutiques en ligne pour coopératives féminines, marques cosmétiques et producteurs de miel et safran de Taroudant.", "en": "E-commerce stores for women's cooperatives, cosmetic brands, and organic honey & saffron producers.", "ar": "متاجر إلكترونية للتعاونيات النسوية، منتجات التجميل، العسل الحر والزعفران مع شحن دولي." },
    "aga_s3_title": { "fr": "Agro-industrie & Export Primeurs", "en": "Agribusiness & Fresh Produce Export", "ar": "الصناعات الفلاحية والتصدير" },
    "aga_s3_desc": { "fr": "Vitrines professionnelles bilingues pour stations de conditionnement, exportateurs d'agrumes et fournisseurs agricoles de Chtouka.", "en": "Bilingual enterprise portals for packing stations, citrus exporters, and agricultural suppliers in Chtouka.", "ar": "مواقع مؤسسية لمحطات التلفيف، مصدري الحوامض والبواكير وموردي المعدات الفلاحية باشتوكة." },
    "aga_why_badge": { "fr": "Impact Mesurable", "en": "Measurable Impact", "ar": "أثر ملموس" },
    "aga_why_title": { "fr": "Pourquoi un site optimisé à Agadir est un accélérateur", "en": "Why an Optimized Website in Agadir Accelerates Growth", "ar": "لماذا يعد الموقع الاحترافي بأكادير محركاً للنمو" },
    "aga_why_desc": { "fr": "Captez les clients qui recherchent vos services sur smartphone dès leur arrivée dans la région.", "en": "Capture customers searching on smartphones the moment they land in the region.", "ar": "استقطب الزوار الذين يبحثون عن خدماتك عبر هواتفهم بمجرد وصولهم للمنطقة." },
    "aga_p1_title": { "fr": "Réservation Sans Commission", "en": "Commission-Free Bookings", "ar": "حجوزات بدون عمولة" },
    "aga_p1_desc": { "fr": "Économisez les 15 à 25% prélevés par les plateformes de voyage en générant vos propres clients directs.", "en": "Save 15% to 25% taken by travel booking platforms by generating your own direct clients.", "ar": "وفر نسبة 15% إلى 25% التي تقتطعها منصات الحجز واستقبل زبائنك مباشرة." },
    "aga_p2_title": { "fr": "Visibilité Souss-Massa & Europe", "en": "Souss-Massa & European Reach", "ar": "ظهور في سوس وأوروبا" },
    "aga_p2_desc": { "fr": "Référencement auprès des internautes locaux et des voyageurs européens préparant leurs vacances au soleil.", "en": "SEO targeting local residents as well as European travelers planning sunny holidays.", "ar": "تموضع ممتاز أمام الزوار المحليين والمسافرين الأوروبيين الباحثين عن عطلات مشمسة." },
    "aga_p3_title": { "fr": "Tunnel WhatsApp Instantané", "en": "Instant WhatsApp Funnel", "ar": "تواصل فوري عبر واتساب" },
    "aga_p3_desc": { "fr": "Permettez à vos prospects de vous écrire en 1 clic pour vérifier les disponibilités ou demander un devis.", "en": "Let prospects message you with 1 click to check room availability or request customized quotes.", "ar": "مكن زوارك من مراسلتك بنقرة واحدة للاستفسار عن الحجوزات أو طلب عروض الأسعار." },
    "aga_p4_title": { "fr": "Mise en Ligne en 10-14 jours", "en": "Turnkey in 10-14 Days", "ar": "إطلاق سريع في 10-14 يوماً" },
    "aga_p4_desc": { "fr": "Un projet mené rapidement, sans retard et avec garantie de bon fonctionnement technique.", "en": "Fast project turnaround delivered on time with comprehensive technical warranty.", "ar": "مشروع ينجز في وقت قياسي مع ضمان الأداء التقني الكامل." },
    "aga_faq_title": { "fr": "Questions fréquentes sur la <span class=\"neon\">création de site web à Agadir</span>", "en": "Frequently Asked Questions on <span class=\"neon\">Agadir Website Creation</span>", "ar": "الأسئلة الشائعة حول <span class=\"neon\">إنشاء المواقع في أكادير</span>" },
    "aga_faq_q1": { "fr": "Mon site sera-t-il bien visible sur Google à Agadir et Taghazout ?", "en": "Will my site rank well on Google in Agadir and Taghazout?", "ar": "هل سيظهر موقعي بشكل ممتاز على غوغل بأكادير وتغازوت؟" },
    "aga_faq_a1": { "fr": "Oui, nous configurons un référencement naturel local ciblé sur Agadir, Taghazout, Tamraght et la région pour capter les recherches les plus lucratives.", "en": "Yes, we implement targeted local SEO for Agadir, Taghazout, Tamraght, and the broader region capturing high-intent searches.", "ar": "نعم، نهيئ سيو محلي دقيق يستهدف أكادير، تغازوت، تمراغت والجهة لاستقطاب الزيارات الأكثر قيمة." },
    "aga_faq_q2": { "fr": "Puis-je vendre mes produits cosmétiques ou bio en ligne ?", "en": "Can I sell cosmetics or organic products online?", "ar": "هل يمكن بيع مستحضرات التجميل أو المنتجات العضوية عبر الموقع؟" },
    "aga_faq_a2": { "fr": "Absolument. Nous intégrons une boutique e-commerce sécurisée avec paiement bancaire et suivi des commandes pour vos clients marocains et étrangers.", "en": "Absolutely. We build a secure e-commerce store with credit card payment and order tracking for local and global clients.", "ar": "بالتأكيد، نوفر متجراً إلكترونياً آمناً مع الدفع البنكي وتتبع الشحنات للمغرب والخارج." },
    "aga_faq_q3": { "fr": "Combien coûte un site web professionnel à Agadir ?", "en": "How much does a website cost in Agadir?", "ar": "كم تبلغ تكلفة موقع مهني في أكادير؟" },
    "aga_faq_a3": { "fr": "Notre offre démarre à 1 500 DH pour une vitrine essentielle, 2 000 DH pour la formule Starter, 4 500 DH pour la formule Growth avec SEO, et 8 000 DH pour un moteur d'acquisition complet.", "en": "Our packages start at 1,500 DH for essential showcases, 2,000 DH for Starter, 4,500 DH for Growth with SEO, and 8,000 DH for complete lead machines.", "ar": "تبدأ باقاتنا من 1500 درهم للموقع التعريفي، 2000 درهم لباقة Starter، 4500 درهم لباقة Growth مع السيو، و8000 درهم للمنظومة المتكاملة." },
    "aga_cta_title": { "fr": "Prêt à booster votre visibilité à Agadir ?", "en": "Ready to boost your visibility in Agadir?", "ar": "مستعد لمضاعفة زبائنك ومبيعاتك في أكادير؟" },
    "aga_cta_desc": { "fr": "Réservez votre audit offert de 15 minutes dès aujourd'hui et commencez à capter des clients qualifiés.", "en": "Book your free 15-minute audit today and start converting qualified clients.", "ar": "احجز تدقيقك المجاني لمدة 15 دقيقة اليوم وابدأ في تحويل الزوار إلى زبائن مؤكدين." },

    # Service-specific: REFERENCEMENT SEO CASABLANCA
    "seo_casa_hero_badge": { "fr": "<span class=\"badge-flag\">🇲🇦</span> RÉFÉRENCEMENT NATUREL GOOGLE CASABLANCA", "en": "<span class=\"badge-flag\">🇲🇦</span> GOOGLE SEO RANKING CASABLANCA", "ar": "<span class=\"badge-flag\">🇲🇦</span> سيو والتموضع على غوغل بالدار البيضاء" },
    "seo_casa_hero_title": { "fr": "Référencement SEO à Casablanca :<br><span class=\"neon\">Dominez la 1ère Page Google & Générez des Leads</span>", "en": "SEO Ranking in Casablanca:<br><span class=\"neon\">Dominate Page 1 on Google & Drive Inbound Leads</span>", "ar": "السيو وتحسين محركات البحث بالدار البيضاء:<br><span class=\"neon\">تصدر الصفحة الأولى على غوغل وضاعف مبيعاتك</span>" },
    "seo_casa_hero_sub": { "fr": "Vous voulez que votre entreprise apparaisse en 1ère position sur Google lorsque vos clients recherchent vos services à Casablanca ? Dans un environnement ultra-concurrentiel, le référencement naturel (SEO) est l'actif digital le plus rentable : il génère des prospects chauds 24h/24 sans dépendre du budget publicitaire payant. Nous déployons des stratégies sémantiques, techniques et locales pour positionner durablement votre site en tête des résultats.", "en": "Want your company to rank #1 on Google when clients search for your services in Casablanca? In a hyper-competitive market, organic SEO is your most profitable asset: delivering inbound leads 24/7 without burning paid ad budgets. We execute semantic, technical, and local strategies to position your business at the top of Google search.", "ar": "هل ترغب في ظهور شركتك في المرتبة الأولى على غوغل عندما يبحث عملاؤك عن خدماتك بالدار البيضاء؟ في بيئة تنافسية قوية، يعتبر السيو الاستثمار الأكثر ربحية: يجلب زبائن جادين 24/7 دون استنزاف ميزانية الإعلانات. ننفذ استراتيجيات برمجية وسيمانتيك لتصدر نتائج البحث بثبات." },
    "seo_casa_btn_whatsapp": { "fr": "<i class=\"fab fa-whatsapp\"></i> Audit SEO Casablanca sur WhatsApp", "en": "<i class=\"fab fa-whatsapp\"></i> Casablanca SEO Audit on WhatsApp", "ar": "<i class=\"fab fa-whatsapp\"></i> تدقيق سيو البيضاء عبر واتساب" },

    # Service-specific: GENERATION LEADS ASSURANCE MAROC
    "leads_hero_badge": { "fr": "<span class=\"badge-flag\">🇲🇦</span> ACQUISITION SPÉCIALISÉE ASSURANCE MAROC", "en": "<span class=\"badge-flag\">🇲🇦</span> SPECIALIZED INSURANCE ACQUISITION MOROCCO", "ar": "<span class=\"badge-flag\">🇲🇦</span> استقطاب عملاء التأمين بالمغرب" },
    "leads_hero_title": { "fr": "Génération de Leads Assurance au Maroc :<br><span class=\"neon\">Dispositifs d'Acquisition Exclusifs pour Cabinets</span>", "en": "Insurance Lead Generation in Morocco:<br><span class=\"neon\">Exclusive Acquisition Engines for Brokers</span>", "ar": "جلب عملاء التأمين في المغرب:<br><span class=\"neon\">منظومة استقطاب حصرية لوسطاء ووكلاء التأمين</span>" },
    "leads_hero_sub": { "fr": "Vous êtes courtier ou agent général d'assurance au Maroc et cherchez à multiplier vos demandes de devis qualifiées chaque semaine ? Finie la dépendance aléatoire au bouche-à-oreille : nous créons des plateformes web dédiées, positionnées en 1ère page Google sur vos branches stratégiques (auto, santé, multirisque pro, RC décennale), qui convertissent directement les recherches d'assurés en leads exclusifs sur votre WhatsApp commercial.", "en": "Are you an insurance broker or general agent in Morocco looking to scale qualified quote requests every week? End random reliance on word-of-mouth: we build dedicated web platforms, ranked on Google Page 1 across your core insurance lines (auto, health, commercial, professional liability), converting active searchers directly into exclusive WhatsApp leads.", "ar": "هل أنت وسيط أو وكيل عام للتأمين بالمغرب وتبحث عن مضاعفة طلبات عروض الأسعار المؤهلة أسبوعياً؟ وداعاً للاعتماد العشوائي على التوصيات: نبني منصات متخصصة تتصدر الصفحة الأولى على غوغل في فروعك الاستراتيجية (السيارات، الصحي، المهني، العشري) وتحول الباحثين إلى عملاء حصريين على واتساب." },
    "leads_btn_whatsapp": { "fr": "<i class=\"fab fa-whatsapp\"></i> Lancer mon Dispositif Leads sur WhatsApp", "en": "<i class=\"fab fa-whatsapp\"></i> Launch My Lead Engine on WhatsApp", "ar": "<i class=\"fab fa-whatsapp\"></i> إطلاق منظومة جلب العملاء عبر واتساب" },

    # National Page: CREATION SITE WEB MAROC
    "maroc_hero_badge": { "fr": "<span class=\"badge-flag\">🇲🇦</span> ROYAUME DU MAROC & COUVERTURE NATIONALE", "en": "<span class=\"badge-flag\">🇲🇦</span> KINGDOM OF MOROCCO & NATIONWIDE COVERAGE", "ar": "<span class=\"badge-flag\">🇲🇦</span> المملكة المغربية وتغطية وطنية شاملة" },
    "maroc_hero_title": { "fr": "Création de Site Web au Maroc :<br><span class=\"neon\">Votre Moteur d'Acquisition & de Visibilité Google</span>", "en": "Website Creation in Morocco:<br><span class=\"neon\">Your Inbound Acquisition & Google Visibility Engine</span>", "ar": "إنشاء المواقع الإلكترونية في المغرب:<br><span class=\"neon\">محركك المتكامل للاستقطاب والظهور على غوغل</span>" },
    "maroc_hero_sub": { "fr": "Vous cherchez une agence web au Maroc capable de transformer votre présence digitale en véritable levier de croissance commerciale ? Chez ASSURLEAD, nous ne créons pas de simples vitrines décoratives : nous bâtissons des dispositifs digitaux ultra-rapides, responsives et taillés pour dominer la 1ère page de Google sur Casablanca, Rabat, Marrakech, Tanger et l'ensemble du Royaume.", "en": "Looking for a web agency in Morocco capable of transforming your digital presence into a true revenue engine? At ASSURLEAD, we don't build decorative brochures: we engineer ultra-fast, responsive web platforms built to dominate Google's Page 1 across Casablanca, Rabat, Marrakech, Tangier, and nationwide.", "ar": "هل تبحث عن وكالة ويب بالمغرب تحول حضورك الرقمي إلى رافعة حقيقية لنمو مبيعاتك؟ في أسورليد، لا نصنع مجرد واجهات شكلية: نبني منصات رقمية فائقة السرعة ومتجاوبة مصممة لتصدر الصفحة الأولى على غوغل في الدار البيضاء، الرباط، مراكش، طنجة وسائر مدن المملكة." },
    "maroc_btn_whatsapp": { "fr": "<i class=\"fab fa-whatsapp\"></i> Devis National sur WhatsApp", "en": "<i class=\"fab fa-whatsapp\"></i> Morocco National Quote on WhatsApp", "ar": "<i class=\"fab fa-whatsapp\"></i> طلب عرض سعر وطني عبر واتساب" }
}

print(f"Total keys prepared: {len(CITY_COMMON_TRANSLATIONS)}")

# --- INJECT INTO SCRIPT.JS ---
with open('script.js', 'r', encoding='utf-8') as f:
    script_content = f.read()

# Find const translations = {
marker = 'const translations = {'
pos = script_content.find(marker)
if pos != -1:
    insert_pos = pos + len(marker)
    # Serialize new keys into JS format
    js_entries = []
    for k, v in CITY_COMMON_TRANSLATIONS.items():
        if f"{k}:" not in script_content:
            fr_val = json.dumps(v["fr"], ensure_ascii=False)
            en_val = json.dumps(v["en"], ensure_ascii=False)
            ar_val = json.dumps(v["ar"], ensure_ascii=False)
            js_entries.append(f"
    {k}: {{
        fr: {fr_val},
        en: {en_val},
        ar: {ar_val}
    }},")
    
    if js_entries:
        script_content = script_content[:insert_pos] + ''.join(js_entries) + script_content[insert_pos:]
        with open('script.js', 'w', encoding='utf-8') as f:
            f.write(script_content)
        print(f"Injected {len(js_entries)} new keys into script.js translations!")
    else:
        print("No new keys to inject into script.js.")

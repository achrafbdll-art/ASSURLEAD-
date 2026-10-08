import json, re

# Complete high quality translation map
# Every single string from all_strings.txt mapped to professional English & Arabic
dict_map = {
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
    }
}

# Verify how many strings from all_strings.txt are in dict_map
with open('scripts/all_strings.txt') as f:
    orig_strings = [l.strip() for l in f if l.strip()]

missing = [s for s in orig_strings if s not in dict_map]
print(f'Total in dict_map: {len(dict_map)}')
print(f'Missing from orig: {len(missing)}')
if missing:
    print('Sample missing:', missing[:10])

with open('scripts/full_dictionary.json', 'w', encoding='utf-8') as out:
    json.dump(dict_map, out, ensure_ascii=False, indent=2)

print('Saved scripts/full_dictionary.json successfully!')

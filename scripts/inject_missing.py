# -*- coding: utf-8 -*-
import json
import re

MISSING_TRANSLATIONS = {
    "aga_faq_badge": { "fr": "FAQ Spécialisée", "en": "Local FAQ", "ar": "الأسئلة الشائعة" },
    "casa_s1_desc": { "fr": "Conception adaptée aux smartphones (91% du trafic à Casablanca), ergonomie fluide et valorisation de votre image de marque.", "en": "Optimized for mobile (91% of Casablanca web traffic), smooth ergonomics and strong brand elevation.", "ar": "تصميم متوافق تماماً مع الهواتف الذكية وتجربة تصفح سلسة تعزز مكانة علامتك التجارية." },
    "casa_s1_title": { "fr": "SITE VITRINE & RESPONSIVE", "en": "RESPONSIVE SHOWCASE SITE", "ar": "موقع تعريفي متجاوب" },
    "maroc_cta_title": { "fr": "Prêt à lancer votre moteur d'acquisition au Maroc ?", "en": "Ready to launch your acquisition engine in Morocco?", "ar": "هل أنت مستعد لإطلاق منظومة الاستقطاب لمشروعك بالمغرب؟" },
    "maroc_s1_desc": { "fr": "Plateformes vitrines institutionnelles ou boutiques e-commerce à forte conversion conçues pour les entreprises marocaines.", "en": "High-conversion corporate showcase sites and e-commerce stores engineered for Moroccan businesses.", "ar": "مواقع تعريفية ومتاجر إلكترونية عالية التحويل مصممة خصيصاً للشركات المغربية." },
    "maroc_s1_title": { "fr": "SITE VITRINE & E-COMMERCE", "en": "SHOWCASE & E-COMMERCE SITE", "ar": "موقع تعريفي ومتجر إلكتروني" },
    "maroc_sec_badge": { "fr": "Envergure Nationale", "en": "Nationwide Reach", "ar": "تغطية وطنية شاملة" },
    "maroc_sec_desc": { "fr": "Des infrastructures web pensées pour couvrir l'ensemble du marché marocain et asseoir votre leadership.", "en": "Web infrastructure engineered to cover the whole Moroccan market and secure industry leadership.", "ar": "بنية رقمية متطورة لتغطية السوق المغربي بالكامل وترسيخ ريادتك في مجالك." },
    "maroc_sec_title": { "fr": "Ce que comprend la création de site web au Maroc", "en": "What Morocco Website Creation Includes", "ar": "ما يشمله إنشاء المواقع في المغرب" },
    "fes_faq_badge": { "fr": "FAQ Spécialisée", "en": "Local FAQ", "ar": "الأسئلة الشائعة" },
    "fes_faq_sub": { "fr": "Toutes les réponses pour préparer votre projet web en toute sérénité.", "en": "All the answers you need to prepare your web project with peace of mind.", "ar": "جميع الإجابات لتجهيز مشروعك الرقمي بكل اطمئنان." },
    "leads_faq_a1": { "fr": "Nous positionnons votre cabinet sur les requêtes à forte intention d'achat (devis assurance auto, mutuelle santé entreprise, etc.) et connectons chaque visiteur directement à votre WhatsApp commercial.", "en": "We rank your brokerage on high-intent search terms (auto insurance quote, business health insurance, etc.) routing every lead directly to your WhatsApp sales team.", "ar": "نضع وكالتك في صدارة الكلمات ذات نية الشراء العالية ونربط كل زائر بمستشارك التجاري عبر واتساب." },
    "leads_faq_a2": { "fr": "100% exclusifs. Les leads générés par votre plateforme n'appartiennent qu'à votre cabinet et ne sont jamais revendus à des tiers.", "en": "100% exclusive. Inbound leads generated on your platform belong only to your brokerage and are never resold.", "ar": "حصرية 100%. العملاء المتوافدون عبر موقعك ملك خاص لوكالتك ولا تتم مشاركتهم مع أي جهة أخرى." },
    "leads_faq_a3": { "fr": "Notre sprint de production livre votre dispositif complet en 10 à 14 jours ouvrés.", "en": "Our dedicated production sprint delivers your complete acquisition system in 10 to 14 business days.", "ar": "نسلم منظومتك التسويقية المتكاملة في مدة قياسية تتراوح بين 10 و14 يوم عمل." },
    "leads_faq_badge": { "fr": "FAQ Acquisition Assurance", "en": "Insurance Acquisition FAQ", "ar": "الأسئلة الشائعة لتأمين العملاء" },
    "leads_faq_q1": { "fr": "Comment AssurLead génère-t-il des leads d'assurance au Maroc ?", "en": "How does AssurLead generate insurance leads in Morocco?", "ar": "كيف تجلب أسورليد عملاء التأمين في المغرب؟" },
    "leads_faq_q2": { "fr": "Les prospects sont-ils exclusifs à mon cabinet ?", "en": "Are incoming leads exclusive to my agency?", "ar": "هل العملاء المتوافدون حصريون لوكالتي فقط؟" },
    "leads_faq_q3": { "fr": "Quel est le délai pour lancer mon dispositif ?", "en": "What is the launch timeline?", "ar": "كم تستغرق مدة إطلاق المنظومة؟" },
    "leads_faq_title": { "fr": "Questions fréquentes sur la <span class=\"neon\">génération de leads assurance</span>", "en": "Frequently Asked Questions on <span class=\"neon\">Insurance Lead Generation</span>", "ar": "الأسئلة الشائعة حول <span class=\"neon\">جلب عملاء التأمين</span>" },
    "leads_s1_desc": { "fr": "Capturez les contrats à haute valeur auprès des transporteurs, entreprises de BTP et gestionnaires de flottes au Maroc.", "en": "Capture high-value corporate policies from haulage firms, construction companies, and commercial fleet managers across Morocco.", "ar": "استقطب عقود التأمين الكبرى من شركات النقل والمقاولات ومديري أساطيل السيارات في المغرب." },
    "leads_s1_title": { "fr": "Flotte Automobile & Transport", "en": "Commercial Fleet & Transport", "ar": "أساطيل السيارات والنقل" },
    "leads_sec_badge": { "fr": "Branches Clés d'Assurance", "en": "Key Insurance Lines", "ar": "الفروع الاستراتيجية للتأمين" },
    "leads_sec_desc": { "fr": "Des tunnels de devis calibrés sur les polices les plus rentables du marché marocain.", "en": "Tailored quote funnels focused on the most profitable policies in the Moroccan market.", "ar": "مسارات عروض أسعار متخصصة تركز على الفروع الأكثر ربحية بالسوق المغربي." },
    "leads_sec_title": { "fr": "Les spécialités d'assurance à fort volume d'acquisition", "en": "High-Volume Acquisition Insurance Specialties", "ar": "تخصصات التأمين ذات الإقبال الكبير" },
    "kech_faq_badge": { "fr": "FAQ Spécialisée", "en": "Local FAQ", "ar": "الأسئلة الشائعة" },
    "funnel_s9_badge": { "fr": "RÉCURRENCE AGENCE", "en": "AGENCY RETAINER", "ar": "نموذج الوكالة المستمر" },
    "rabat_faq_badge": { "fr": "FAQ Spécialisée", "en": "Local FAQ", "ar": "الأسئلة الشائعة" },
    "rabat_faq_sub": { "fr": "Toutes les réponses pour préparer votre projet web en toute sérénité.", "en": "All the answers you need to prepare your web project with peace of mind.", "ar": "جميع الإجابات لتجهيز مشروعك الرقمي بكل اطمئنان." },
    "seo_casa_faq_a1": { "fr": "Le référencement naturel pérennise votre flux de prospects sans payer chaque clic. Une fois positionné en 1ère page Google, votre visibilité travaille pour vous 24h/24.", "en": "Organic SEO creates a continuous lead flow without paying per click. Once ranked on Page 1, your visibility generates business 24/7.", "ar": "يضمن السيو تدفقاً متواصلاً للعملاء دون الدفع مقابل كل نقرة، ويجعل ظهورك يعمل لصالحك على مدار الساعة." },
    "seo_casa_faq_a2": { "fr": "Les premiers résultats s'observent sous 3 à 6 semaines, avec une montée en puissance progressive de vos positions sur Casablanca.", "en": "Initial ranking gains appear within 3 to 6 weeks, scaling steadily across high-value Casablanca searches.", "ar": "تظهر أولى النتائج في غضون 3 إلى 6 أسابيع مع تصاعد مستمر في الترتيب بالدار البيضاء." },
    "seo_casa_faq_a3": { "fr": "Oui, nous configurons et dynamisons votre fiche Google Business Profile pour capter les appels et itinéraires locaux.", "en": "Yes, we tune and optimize your Google Business Profile to capture direct local phone calls and map requests.", "ar": "نعم، نقوم بتهيئة وتطوير حساب Google Business Profile لجلب الاتصالات وزيارات الزبائن." },
    "seo_casa_faq_badge": { "fr": "FAQ Référencement SEO", "en": "SEO FAQ", "ar": "الأسئلة الشائعة في السيو" },
    "seo_casa_faq_q1": { "fr": "Pourquoi le SEO est-il plus rentable que la publicité payante à Casablanca ?", "en": "Why is SEO more profitable than paid ads in Casablanca?", "ar": "لماذا يعتبر السيو أكثر ربحية من الإعلانات المدفوعة بالدار البيضاء؟" },
    "seo_casa_faq_q2": { "fr": "Combien de temps faut-il pour atteindre la 1ère page Google ?", "en": "How long does it take to reach Google Page 1?", "ar": "كم يستغرق الوصول إلى الصفحة الأولى على غوغل؟" },
    "seo_casa_faq_q3": { "fr": "Optimisez-vous aussi Google Maps à Casablanca ?", "en": "Do you also optimize Google Maps in Casablanca?", "ar": "هل تشمل الخدمة تحسين التواجد على خرائط جوجل بالدار البيضاء؟" },
    "seo_casa_faq_sub": { "fr": "Toutes les réponses pour comprendre la puissance du référencement naturel local.", "en": "All the answers to understand the power of local organic search ranking.", "ar": "كل الإجابات لفهم قوة التموضع الطبيعي المحلي على محركات البحث." },
    "seo_casa_faq_title": { "fr": "Questions fréquentes sur le <span class=\"neon\">référencement SEO à Casablanca</span>", "en": "Frequently Asked Questions on <span class=\"neon\">Casablanca Google SEO</span>", "ar": "الأسئلة الشائعة حول <span class=\"neon\">السيو في الدار البيضاء</span>" },
    "seo_casa_s1_desc": { "fr": "Optimisation des Core Web Vitals, balisage Schema.org LocalBusiness et architecture technique pour un crawl Google sans faille.", "en": "Core Web Vitals tuning, Schema.org LocalBusiness markup, and clean technical architecture for flawless Google crawling.", "ar": "تحسين سرعة Core Web Vitals، وسوم Schema.org وبنية تقنية تضمن أرشفة مثالية وسريعة من عناكب جوجل." },
    "seo_casa_s1_title": { "fr": "Audit Technique & Vitesse", "en": "Technical Audit & Speed", "ar": "التدقيق التقني والسرعة" },
    "seo_casa_sec_badge": { "fr": "Expertise SEO Casablanca", "en": "Casablanca SEO Expertise", "ar": "خبرة السيو بالدار البيضاء" },
    "seo_casa_sec_desc": { "fr": "Une méthodologie rigoureuse qui place votre site devant vos concurrents sur les mots-clés qui comptent.", "en": "A rigorous methodology positioning your site ahead of competitors on keywords that drive revenue.", "ar": "منهجية دقيقة تضع موقعك أمام جميع المنافسين على الكلمات المفتاحية الأكثر ربحية." },
    "seo_casa_sec_title": { "fr": "Notre méthode pour dominer la 1ère page Google à Casablanca", "en": "Our Method to Dominate Google Page 1 in Casablanca", "ar": "منهجيتنا لتصدر الصفحة الأولى على غوغل في الدار البيضاء" },
    "tgr_faq_badge": { "fr": "FAQ Spécialisée", "en": "Local FAQ", "ar": "الأسئلة الشائعة" }
}

with open('script.js', 'r', encoding='utf-8') as f:
    script_content = f.read()

marker = 'const translations = {'
pos = script_content.find(marker)
if pos == -1:
    print("Marker not found!")
    exit(1)

insert_pos = pos + len(marker)
js_entries = []

for k, v in MISSING_TRANSLATIONS.items():
    pattern = rf'\b{k}\s*:'
    if not re.search(pattern, script_content):
        fr_val = json.dumps(v["fr"], ensure_ascii=False)
        en_val = json.dumps(v["en"], ensure_ascii=False)
        ar_val = json.dumps(v["ar"], ensure_ascii=False)
        entry = f"\n    {k}: {{\n        fr: {fr_val},\n        en: {en_val},\n        ar: {ar_val}\n    }},"
        js_entries.append(entry)

if js_entries:
    script_content = script_content[:insert_pos] + ''.join(js_entries) + script_content[insert_pos:]
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(script_content)
    print(f"Successfully injected {len(js_entries)} missing keys into script.js!")
else:
    print("All keys already present.")

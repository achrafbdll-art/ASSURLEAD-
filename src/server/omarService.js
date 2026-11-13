import { GoogleGenAI } from '@google/genai';

/**
 * Knowledge Base & Context for Omar - Conseiller Commercial & Stratégique ASSURLEAD Maroc
 */
const OMAR_SYSTEM_INSTRUCTION = `Tu es Omar, le conseiller commercial expert et stratège en acquisition digitale chez ASSURLEAD au Maroc.
Ton persona : Chaleureux, dynamique, extrêmement compétent, pragmatique et 100% orienté action et retour sur investissement (ROI).
Ton rôle : Conseiller les dirigeants d'entreprises, courtiers et agents d'assurance, agences immobilières, professions libérales et PME au Maroc pour transformer leur présence en ligne en un véritable "Moteur d'Acquisition" générateur de devis, d'appels et de contrats signés.

RÈGLES D'OR DE TES RÉPONSES :
1. RÈGLE ABSOLUE : TOUTES TES RÉPONSES DOIVENT INCITER À L'ACTION IMMÉDIATE ("PASSER À L'ACTION").
   - Ne fais jamais de réponses purement théoriques ou passives.
   - Conclus TOUJOURS par une invitation claire, directe et rassurante à passer à l'action : réserver l'audit gratuit de 15 minutes, échanger en direct sur WhatsApp avec Omar (+212 707 573 162) ou lancer un appel téléphonique.
2. CONCISION & IMPACT :
   - Fais des réponses courtes, percutantes et bien aérées (3 à 6 phrases ou puces claires).
   - Utilise des chiffres concrets, des délais réels et cite le contexte marocain (Casablanca, Marrakech, Rabat, etc.).
3. RÉALISATIONS PHARES À CITER QUAND PERTINENT :
   - Cabinet Assurance Sechkili à Marrakech (www.assurancesechkili.com) : demandes de devis d'assurance en ligne 24h/24, concrétisations directes sur le web et flux continu d'appels téléphoniques qualifiés chaque semaine !
   - Cabinet Assurances El Omrani (AXA Casablanca - www.assuranceselomrani.com) : 1ère page Google, temps de chargement < 1.2s, tunnel WhatsApp direct.
   - Agence Immobilière Maarif Casablanca : moteur d'acquisition de mandats locaux.
4. NOS OFFRES CLAIRES :
   - Starter (2 000 DH + 100 DH/mois) : Site vitrine haute vitesse + SEO local + tunnel WhatsApp direct.
   - Growth (4 500 DH + 150 DH/mois) : Moteur d'acquisition complet + formulaires interactifs par produit + Google Maps synchronisé + Core Web Vitals < 1.2s.
   - Lead Engine (8 000 DH + 200 DH/mois) : Écosystème sur-mesure d'autorité + multi-tunnels de conversion + SEO multi-villes + suivi ROI.
   - Acquisition (12 000 DH+ + 200 DH/mois) : Dispositif complet sur-mesure, SEO avancé et contenu stratégique.
   - Frais de maintenance du site, hébergement & sécurité : entre 100 et 200 DH / mois (100 DH Starter, 150 DH Growth, 200 DH Lead Engine & Acquisition), incluant hébergement haute vitesse, certificat SSL/HTTPS, sauvegardes automatiques, mises à jour techniques et sécurité active.
   - Garanties : Délai 7-10 jours ouvrés garanti, sans engagement de durée, paiement 50/50 sécurisé, code propriétaire.
5. COORDONNÉES DIRECTES :
   - Téléphone & WhatsApp : +212 707 573 162
   - Audit de visibilité Google offert : 15 minutes, sans engagement, sur rendez-vous.
6. LANGUE : Réponds dans la même langue que l'utilisateur (français, arabe / darija, ou anglais) avec courtoisie, énergie et professionnalisme.`;

/**
 * Rule-based fallback response generator when GEMINI_API_KEY is not set or API fails
 */
export function getLocalOmarResponse(userMessage, lang = 'fr') {
  const q = (userMessage || '').toLowerCase().trim();

  // 0. Maintenance / Hébergement / Sécurité
  if (/maintenance|h[eé]bergement|ssl|s[eé]curit[eé]|sauvegarde|hosting|security|صيانة|استضافة|أمان/.test(q)) {
    if (lang === 'ar') {
      return {
        reply: `تتراوح مصاريف **صيانة الموقع، الاستضافة والأمان** لدينا بين **100 و 200 درهم / شهرياً** حسب الباقة المختارة:\n\n• **باقة Starter** : + 100 درهم / شهر\n• **باقة Growth** : + 150 درهم / شهر\n• **باقة Lead Engine و Acquisition** : + 200 درهم / شهر\n\n🛡️ يشمل هذا الاشتراك الشهري: استضافة فائقة السرعة، شهادة الأمان SSL/HTTPS، النسخ الاحتياطي التلقائي، التحديثات التقنية والحماية المستمرة للموقع.\n\nهل تود اختيار الباقة الأنسب لنشاطك عبر واتساب أو حجز تدقيق مجاني لمدة 15 دقيقة؟`,
        actions: [
          { label: "💬 تواصل عبر واتساب (+212 707 573 162)", type: "whatsapp", url: "https://wa.me/212707573162?text=Bonjour%20Omar%2C%20je%20souhaite%20des%20informations%20sur%20la%20maintenance%20(100-200%20DH%2Fmois)" },
          { label: "⚡ حجز تدقيق مجاني (15 دقيقة)", type: "modal" },
          { label: "📞 اتصال هاتفي مباشر", type: "call", url: "tel:+212707573162" }
        ]
      };
    }
    if (lang === 'en') {
      return {
        reply: `Our monthly **Website Maintenance, Hosting & Security** fee is clear and ranges from **100 to 200 MAD / month** depending on your plan:\n\n• **Starter**: + 100 MAD / month\n• **Growth**: + 150 MAD / month\n• **Lead Engine & Acquisition**: + 200 MAD / month\n\n🛡️ This covers high-speed hosting, SSL/HTTPS security certificate, automated backups, technical updates, and active security protection.\n\nWould you like to book a free 15-minute audit or message me directly on WhatsApp?`,
        actions: [
          { label: "💬 Chat with Omar on WhatsApp", type: "whatsapp", url: "https://wa.me/212707573162?text=Hello%20Omar%2C%20I%20would%20like%20details%20about%20the%20100-200%20MAD%20maintenance%20plan" },
          { label: "⚡ Book Free 15-min Audit", type: "modal" },
          { label: "📞 Call Omar directly", type: "call", url: "tel:+212707573162" }
        ]
      };
    }
    return {
      reply: `Nos **frais de maintenance, hébergement et sécurité** sont transparents et compris entre **100 et 200 DH / mois** selon votre formule :\n\n• **Starter** : + 100 DH / mois\n• **Growth** : + 150 DH / mois\n• **Lead Engine & Acquisition** : + 200 DH / mois\n\n🛡️ **Inclus chaque mois :** hébergement haute vitesse, certificat SSL/HTTPS, sauvegardes automatiques, mises à jour techniques et sécurité active 24/7.\n\n**Passons à l'action :** Souhaitez-vous que je vous recommande la formule idéale sur WhatsApp ou lors d'un audit gratuit de 15 minutes ?`,
      actions: [
        { label: "🟢 Échanger sur WhatsApp (+212 707 573 162)", type: "whatsapp", url: "https://wa.me/212707573162?text=Bonjour%20Omar%2C%20je%20souhaite%20des%20informations%20sur%20le%20forfait%20maintenance%20100-200%20DH%2Fmois" },
        { label: "⚡ Réserver mon Audit SEO Gratuit (15 min)", type: "modal" },
        { label: "📞 Appeler Omar directement", type: "call", url: "tel:+212707573162" }
      ]
    };
  }

  // 1. Tarifs / Prix / Budget
  if (/tarif|prix|combien|co[uû]t|budget|payer|formule|pack|devis|سعر|باقة|كم|ثمن|price|cost|how much/.test(q)) {
    if (lang === 'ar') {
      return {
        reply: `مرحباً بك! في ASSURLEAD نقدم باقات واضحة وشفافة بدون مصاريف خفية:\n\n• **باقة Starter (2 000 درهم + 100 درهم/شهر)** : موقع سريع وفائق الأداء + سيو محلي + ربط مباشر بالواتساب.\n• **باقة Growth (4 500 درهم + 150 درهم/شهر)** : محرك استقطاب متكامل + استمارات تسعير ذكية + مزامنة خرائط غوغل.\n• **باقة Lead Engine (8 000 درهم + 200 درهم/شهر)** : منظومة حصرية للشركات ومكاتب التأمين لتصدر غوغل في عدة مدن.\n• **باقة Acquisition (ابتداءً من 12 000 درهم + 200 درهم/شهر)** : منظومة استقطاب شاملة ومخصصة.\n\n🛡️ **مصاريف الصيانة، الاستضافة والأمان : 100 إلى 200 درهم / شهرياً** (استضافة عالية السرعة، شهادة SSL، نسخ احتياطي وحماية نشطة).\n⚡ **التسليم في 7 إلى 10 أيام مضمون**، وأداء بنسبة 50/50 وبدون أي التزام زمني.\n\nهل تفضل أن نقوم بتدقيق مجاني لموقعك الحالي، أم نتواصل مباشرة عبر واتساب لتحديد الباقة المناسبة؟`,
        actions: [
          { label: "💬 تواصل عبر واتساب (+212 707 573 162)", type: "whatsapp", url: "https://wa.me/212707573162?text=Bonjour%20Omar%2C%20je%20souhaite%20un%20devis%20pour%20mon%20projet" },
          { label: "⚡ حجز تدقيق مجاني (15 دقيقة)", type: "modal" },
          { label: "📞 اتصال هاتفي مباشر", type: "call", url: "tel:+212707573162" }
        ]
      };
    }
    if (lang === 'en') {
      return {
        reply: `Hello! At ASSURLEAD, we build websites specifically designed to generate clients with transparent pricing:\n\n• **Starter (2,000 MAD + 100 MAD/mo)**: High-speed site + local SEO + direct WhatsApp conversion funnel.\n• **Growth (4,500 MAD + 150 MAD/mo)**: Complete acquisition engine + product quote forms + Google Maps synchronization.\n• **Lead Engine (8,000 MAD + 200 MAD/mo)**: Bespoke authoritative system + multi-city SEO + ROI tracking.\n• **Acquisition (12,000+ MAD + 200 MAD/mo)**: Full custom organic acquisition ecosystem.\n\n🛡️ **Maintenance, Hosting & Security: 100 to 200 MAD / month** (high-speed hosting, SSL/HTTPS, automated backups, updates & active security).\n⚡ **Guaranteed 7-10 business days delivery**, secure 50/50 payment, and no long-term lock-in.\n\nShall we run a quick 15-minute free SEO audit for your business, or chat directly on WhatsApp?`,
        actions: [
          { label: "💬 Chat with Omar on WhatsApp", type: "whatsapp", url: "https://wa.me/212707573162?text=Hello%20Omar%2C%20I'd%20like%20a%20quote%20for%20my%20website%20project" },
          { label: "⚡ Book Free 15-min SEO Audit", type: "modal" },
          { label: "📞 Call Omar directly", type: "call", url: "tel:+212707573162" }
        ]
      };
    }
    return {
      reply: `Chez ASSURLEAD, nous ne vendons pas de simples vitrines passives, mais des **Moteurs d'Acquisition** avec un retour sur investissement rapide :\n\n• **Formule Starter (2 000 DH + 100 DH/mois)** : Site web ultra-rapide (< 1.2s), optimisé mobile, SEO local Google et tunnel WhatsApp direct.\n• **Formule Growth (4 500 DH + 150 DH/mois)** : Moteur complet avec tunnels de devis par produit, fiches Google Business synchronisées et réactivité maximale.\n• **Formule Lead Engine (8 000 DH + 200 DH/mois)** : Dispositif sur-mesure d'autorité, multi-villes et captation intensive de prospects qualifiés.\n• **Formule Acquisition (12 000 DH+ + 200 DH/mois)** : Écosystème complet sur-mesure.\n\n🛡️ **Maintenance, Hébergement & Sécurité : 100 à 200 DH / mois** (hébergement haute vitesse, SSL/HTTPS, sauvegardes automatiques, mises à jour et sécurité active).\n⚡ **Délai garanti 7 à 10 jours**, paiement 50/50 sécurisé et sans engagement de durée.\n\n**Passons à l'action :** Quel est votre secteur d'activité, ou souhaitez-vous que je vous fasse une simulation sur WhatsApp ?`,
      actions: [
        { label: "🟢 Lancer mon projet sur WhatsApp (+212 707 573 162)", type: "whatsapp", url: "https://wa.me/212707573162?text=Bonjour%20Omar%2C%20je%20souhaite%20un%20devis%20personnalis%C3%A9%20pour%20mon%20site%20web" },
        { label: "⚡ Réserver mon Audit SEO Gratuit (15 min)", type: "modal" },
        { label: "📞 Appeler Omar directement", type: "call", url: "tel:+212707573162" },
        { label: "📊 Voir nos réalisations en ligne", type: "link", url: "/realisations.html" }
      ]
    };
  }

  // 2. Assurance / Courtage / Agents d'assurance
  if (/assurance|courtier|courtage|axa|rma|sanlam|wafa|atlantasanad|sechkili|el omrani|sinistre|auto|sant[eé]|تأمين|مكتب تأمين|وسيط|insurance|broker/.test(q)) {
    if (lang === 'ar') {
      return {
        reply: `نحن متخصصون رواد في مجال التأمين بالمغرب! منصاتنا تتيح لوكالات التأمين تحصيل طلبات عروض أسعار حقيقية وإغلاق العقود مباشرة عبر الإنترنت.\n\n🏆 **نموذج حي وناجح :**\n• **Cabinet Assurance Sechkili بمراكش (www.assurancesechkili.com)** : يستقبل أسبوعياً طلبات عروض أسعار مؤهلة، concrétisations مباشرة عبر الويب وتدفق مستمر للمكالمات الهاتفية الهاتفية!\n• **Cabinet Assurances El Omrani بالدار البيضاء (www.assuranceselomrani.com)** : تصدر الصفحة الأولى على غوغل وربط فوري بالواتساب.\n\nهل ترغب في مضاعفة عقود التأمين بمكتبك؟ دعنا نطلق مشروعك هذا الأسبوع.`,
        actions: [
          { label: "🛡️ معاينة دراسة حالة مراكش (الشكيلي)", type: "link", url: "/realisation-sechkili.html" },
          { label: "💬 ناقش مشروع وكالتك عبر واتساب", type: "whatsapp", url: "https://wa.me/212707573162?text=Bonjour%20Omar%2C%20je%20suis%20courtier%20d'assurance%20et%20je%20souhaite%20un%20site%20comme%20assurancesechkili.com" },
          { label: "⚡ حجز تدقيق مجاني لوكالتك (15 دقيقة)", type: "modal" }
        ]
      };
    }
    return {
      reply: `L'assurance est notre cœur de métier historique ! Nous aidons les agents généraux et courtiers à capter des assurés en recherche active de contrats (Auto, Santé, Risques Pro, Habitation).\n\n🏆 **Preuves concrètes en ligne :**\n• **Cabinet Assurance Sechkili à Marrakech (www.assurancesechkili.com)** : Demandes de devis interactives 24h/24, concrétisations directes en ligne et flux soutenu d'appels téléphoniques entrants chaque semaine !\n• **Cabinet Assurances El Omrani (AXA Casablanca - www.assuranceselomrani.com)** : 1ère page Google sur Casablanca, chargement < 1.2s et tunnel de conversion WhatsApp direct.\n\n⚡ **Passez à l'action dès aujourd'hui :** Votre cabinet peut avoir son système opérationnel en 10 jours ouvrés avec résultats dès le 1er mois.`,
      actions: [
        { label: "🛡️ Voir l'étude détaillée Cabinet Sechkili (Marrakech)", type: "link", url: "/realisation-sechkili.html" },
        { label: "🟢 Déployer pour mon cabinet sur WhatsApp", type: "whatsapp", url: "https://wa.me/212707573162?text=Bonjour%20Omar%2C%20je%20dirige%20un%20cabinet%20d'assurance%20et%20je%20souhaite%20un%20moteur%20d'acquisition%20comme%20assurancesechkili.com" },
        { label: "⚡ Réserver mon Audit Spécial Assurance (15 min)", type: "modal" },
        { label: "📞 Échanger au téléphone (+212 707 573 162)", type: "call", url: "tel:+212707573162" }
      ]
    };
  }

  // 3. Référencement Google / SEO / 1ère Page
  if (/seo|r[eé]f[eé]rencement|google|visibilit[eé]|premi[eè]re page|position|mots[- ]cl[eé]s|سيو|غوغل|ظهور|ranking/.test(q)) {
    return {
      reply: `Un site sans référencement Google est invisible. 90% des internautes marocains ne dépassent jamais la 1ère page de résultats !\n\nNotre méthodologie en 3 leviers :\n1. **Ciblage sémantique local** : Positionnement sur les requêtes à forte intention d'achat dans votre ville (ex: devis assurance Casablanca, avocat Rabat, agence Marrakech).\n2. **Synchronisation Google Business Profile & Maps** : Fiches d'établissement optimisées générant des appels directs.\n3. **Score Core Web Vitals vert (< 1.2s)** : Google privilégie les sites ultra-rapides sans surcouche lourde.\n\n⚡ **Action immédiate recommandée :** Je vous offre un audit SEO complet de 15 minutes sur votre visibilité actuelle face à vos concurrents.`,
      actions: [
        { label: "⚡ Réserver mon Audit SEO Gratuit (15 min)", type: "modal" },
        { label: "🟢 Analyser mon positionnement sur WhatsApp", type: "whatsapp", url: "https://wa.me/212707573162?text=Bonjour%20Omar%2C%20je%20souhaite%20analyser%20la%20visibilit%C3%A9%20Google%20de%20mon%20entreprise" },
        { label: "📈 Voir notre méthode SEO détaillée", type: "link", url: "/referencement-seo-casablanca.html" }
      ]
    };
  }

  // 4. Villes : Casablanca, Marrakech, Rabat, Tanger, Fès, Agadir
  if (/casablanca|casa|rabat|marrakech|kech|tanger|f[eè]s|agadir|الدار البيضاء|الرباط|مراكش|طنجة|فاس|أكادير/.test(q)) {
    const cityMatch = q.match(/casablanca|casa|rabat|marrakech|kech|tanger|f[eè]s|agadir/i);
    const city = cityMatch ? cityMatch[0].toUpperCase() : "votre ville";
    return {
      reply: `Nous intervenons activement sur **${city}** et dans toutes les métropoles du Maroc !\n\nChaque ville a ses spécificités de recherche locale : vos prospects tapent quotidiennement vos services sur Google depuis leur smartphone. Nous configurons des fiches locales et un balisage géolocalisé pour que votre entreprise capte ces appels en priorité.\n\n⚡ **Passez à l'action :** Faisons le point sur le volume de recherches exact de votre activité sur ${city} lors d'un rapide audit de 15 minutes.`,
      actions: [
        { label: `📍 Développer ma visibilité à ${city} sur WhatsApp`, type: "whatsapp", url: `https://wa.me/212707573162?text=Bonjour%20Omar%2C%20je%20souhaite%20développer%20la%20visibilité%20de%20mon%20entreprise%20sur%20${encodeURIComponent(city)}` },
        { label: "⚡ Réserver mon Audit Territorial (15 min)", type: "modal" },
        { label: "📞 Appeler Omar (+212 707 573 162)", type: "call", url: "tel:+212707573162" }
      ]
    };
  }

  // 5. Délais & Garantie de livraison
  if (/d[eé]lai|temps|combien de temps|dur[eé]e|quand|garantie|livraison|وقت|مدة|تسليم|how long|time|delivery/.test(q)) {
    return {
      reply: `Nous savons que le temps, c'est du chiffre d'affaires. C'est pourquoi nos délais sont contractuels et garantis :\n\n• **Mise en ligne en 7 à 10 jours ouvrés** chrono.\n• **Paiement 50/50 sécurisé** : 50% au lancement, 50% à la livraison finale après votre validation.\n• **Sans engagement de durée** : vous êtes propriétaire à 100% de votre site, de votre nom de domaine et de votre code source.\n\n⚡ **Envie de démarrer cette semaine ?** Envoyez-moi un message sur WhatsApp pour bloquer votre créneau de développement.`,
      actions: [
        { label: "🚀 Bloquer mon créneau de lancement sur WhatsApp", type: "whatsapp", url: "https://wa.me/212707573162?text=Bonjour%20Omar%2C%20je%20souhaite%20d%C3%A9marrer%20mon%20site%20cette%20semaine" },
        { label: "⚡ Réserver l'Audit Préalable (15 min)", type: "modal" },
        { label: "📞 Appeler Omar (+212 707 573 162)", type: "call", url: "tel:+212707573162" }
      ]
    };
  }

  // 6. Contact direct / WhatsApp / Téléphone / Rendez-vous
  if (/contact|num[eé]ro|t[eé]l[eé]phone|whatsapp|rdv|rendez-vous|rencontrer|appeler|adresse|هاتف|واتساب|اتصال|call|phone/.test(q)) {
    return {
      reply: `Je suis joignable directement 7j/7 pour échanger sur vos objectifs et vous présenter les opportunités concrètes sur votre marché :\n\n• **WhatsApp direct :** +212 707 573 162 (réponse rapide en moins de 10 minutes)\n• **Téléphone :** +212 707 573 162\n• **Audit de visibilité Google offert :** 15 minutes en visio ou par téléphone, sans engagement.\n\n⚡ **Cliquez ci-dessous pour démarrer l'échange dès maintenant !**`,
      actions: [
        { label: "💬 Ouvrir la discussion WhatsApp (+212 707 573 162)", type: "whatsapp", url: "https://wa.me/212707573162?text=Bonjour%20Omar%2C%20je%20souhaite%20%C3%A9changer%20avec%20vous%20concernant%20mon%20projet%20web" },
        { label: "📞 Appeler Omar immédiatement", type: "call", url: "tel:+212707573162" },
        { label: "⚡ Réserver mon Audit Gratuit de 15 min", type: "modal" }
      ]
    };
  }

  // 7. Salutations / Présentation
  if (/bonjour|bonsoir|salut|salam|hello|hi|qui es[- ]tu|pr[eé]sente|c'est quoi|سلام|أهلا|مرحبا/.test(q)) {
    if (lang === 'ar') {
      return {
        reply: `أهلاً وسهلاً بك! أنا **عمر**، مستشار استقطاب العملاء وتطوير الأعمال لدى **ASSURLEAD** بالمغرب. 🇲🇦\n\nنساعد الشركات، مكاتب التأمين والمهن الحرة على تحويل مواقعهم إلى محركات حقيقية لجلب طلبات عروض الأسعار والزبائن عبر غوغل وواتساب.\n\nكيف يمكنني مساعدتك اليوم؟ يمكنك اختيار موضوع للبدء فوراً:`,
        actions: [
          { label: "💰 كم تكلفة الموقع؟", type: "prompt", text: "Quels sont vos tarifs pour un site web ?" },
          { label: "🛡️ مواقع وكالات التأمين (نموذج الشكيلي)", type: "link", url: "/realisation-sechkili.html" },
          { label: "⚡ حجز تدقيق مجاني لموقعي (15 دقيقة)", type: "modal" },
          { label: "💬 محادثة مباشرة عبر واتساب", type: "whatsapp", url: "https://wa.me/212707573162?text=Bonjour%20Omar%2C%20je%20d%C3%A9couvre%20ASSURLEAD%20et%20je%20souhaite%20des%20informations" }
        ]
      };
    }
    return {
      reply: `Bonjour et bienvenue ! Je suis **Omar**, conseiller commercial et expert acquisition digitale chez **ASSURLEAD** au Maroc. 🇲🇦\n\nNous concevons des sites web performants taillés pour capter des clients qualifiés et propulser votre entreprise en 1ère page Google (Casablanca, Marrakech, Rabat, Tanger, etc.).\n\n⚡ **Comment puis-je vous aider à accélérer votre activité aujourd'hui ?**`,
      actions: [
        { label: "💰 Combien coûte un site web ?", type: "prompt", text: "Combien coûte un site web chez AssurLead ?" },
        { label: "🛡️ Cas d'Assurance (Cabinet Sechkili Marrakech)", type: "link", url: "/realisation-sechkili.html" },
        { label: "⚡ Réserver mon Audit SEO Gratuit (15 min)", type: "modal" },
        { label: "🟢 Discuter directement sur WhatsApp", type: "whatsapp", url: "https://wa.me/212707573162?text=Bonjour%20Omar%2C%20je%20souhaite%20un%20%C3%A9change%20pour%20d%C3%A9velopper%20mon%20activit%C3%A9" }
      ]
    };
  }

  // 8. Réponse générale par défaut orientée action
  return {
    reply: `C'est une excellente question pour la croissance de votre entreprise au Maroc ! Chez ASSURLEAD, notre mission est simple : faire en sorte que votre site web ne soit plus une dépense passive, mais un **moteur commercial rentable** qui génère des devis et des appels qualifiés chaque semaine.\n\nNous nous occupons de tout de A à Z : design premium, vitesse extrême (< 1.2s), positionnement SEO 1ère page Google et tunnels de conversion WhatsApp.\n\n⚡ **Passons à l'action ensemble :** Je vous propose de faire le point lors d'un audit gratuit de 15 minutes ou d'en discuter directement sur WhatsApp.`,
    actions: [
      { label: "🟢 Échanger avec Omar sur WhatsApp (+212 707 573 162)", type: "whatsapp", url: `https://wa.me/212707573162?text=Bonjour%20Omar%2C%20j'ai%20une%20question%20concernant%20mon%20projet%20:%20${encodeURIComponent(userMessage.slice(0, 80))}` },
      { label: "⚡ Réserver mon Audit Gratuit de 15 min", type: "modal" },
      { label: "📞 Appeler Omar directement", type: "call", url: "tel:+212707573162" },
      { label: "📂 Découvrir nos réalisations en ligne", type: "link", url: "/realisations.html" }
    ]
  };
}

/**
 * Handle incoming Omar chat request with Gemini API or fallback
 */
export async function handleOmarChat({ message, history = [], lang = 'fr' }) {
  const rawKey = (process.env.GEMINI_API_KEY || '').trim();
  const isValidApiKey = Boolean(
    rawKey &&
    !rawKey.includes('your_gemini_api_key') &&
    !rawKey.includes('placeholder') &&
    rawKey.length > 25
  );

  if (isValidApiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey: rawKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      // Filter previous history to only valid alternating user/model turns without duplicating current message
      const formattedContents = [];
      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          const role = item?.role === 'user' ? 'user' : item?.role === 'model' ? 'model' : null;
          const textContent = (item?.parts?.[0]?.text || item?.text || '').trim();
          if (role && textContent && textContent !== message.trim()) {
            formattedContents.push({
              role,
              parts: [{ text: textContent }]
            });
          }
        }
      }
      formattedContents.push({ role: 'user', parts: [{ text: message }] });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI generation timeout')), 15000)
      );

      const response = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: formattedContents,
          config: {
            systemInstruction: OMAR_SYSTEM_INSTRUCTION,
            maxOutputTokens: 2048,
            temperature: 0.7
          }
        }),
        timeoutPromise
      ]);

      const replyText = response.text || '';
      if (replyText.trim().length > 0) {
        // Generate contextual action buttons based on content
        const lower = replyText.toLowerCase();
        const actions = [];

        actions.push({
          label: "🟢 Lancer mon projet sur WhatsApp (+212 707 573 162)",
          type: "whatsapp",
          url: `https://wa.me/212707573162?text=Bonjour%20Omar%2C%20je%20souhaite%20lancer%20mon%20projet%20avec%20ASSURLEAD`
        });
        actions.push({
          label: "⚡ Réserver mon Audit SEO Gratuit (15 min)",
          type: "modal"
        });

        if (/sechkili|marrakech|assurance|courtier|courtage/.test(lower)) {
          actions.push({
            label: "🛡️ Voir la réalisation Sechkili Marrakech",
            type: "link",
            url: "/realisation-sechkili.html"
          });
        } else {
          actions.push({
            label: "📂 Voir nos réalisations en ligne",
            type: "link",
            url: "/realisations.html"
          });
        }

        actions.push({
          label: "📞 Appeler Omar directement",
          type: "call",
          url: "tel:+212707573162"
        });

        return {
          reply: replyText,
          actions,
          source: 'gemini'
        };
      }
    } catch (err) {
      console.info('[Omar API] Request handled by local response engine:', err?.message || 'fallback');
    }
  }

  // Graceful local engine if no API key or on error
  const localResponse = getLocalOmarResponse(message, lang);
  return {
    ...localResponse,
    source: 'local'
  };
}

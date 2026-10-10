import json, re

new_translations = {
    "proc_kpi_1_val": { "fr": "14 Jours", "en": "14 Days", "ar": "14 يوماً" },
    "proc_kpi_1_label": { "fr": "Délai Clé en Main", "en": "Turnaround Time", "ar": "مدة الإنجاز الكامل" },
    "proc_kpi_1_desc": { "fr": "Sprint technique garanti de A à Z", "en": "Guaranteed technical sprint from A to Z", "ar": "سباق تقني مضمون من البداية للنهاية" },
    "proc_kpi_2_val": { "fr": "50% / 50%", "en": "50% / 50%", "ar": "50% / 50%" },
    "proc_kpi_2_label": { "fr": "Paiement Sécurisé", "en": "Milestone Payment", "ar": "دفع آمن ومجزأ" },
    "proc_kpi_2_desc": { "fr": "Acompte au cadrage, solde à la recette", "en": "Deposit at kickoff, balance upon sign-off", "ar": "تسبيق عند التأطير، والباقي عند المصادقة" },
    "proc_kpi_3_val": { "fr": "0 MAD", "en": "0 MAD", "ar": "0 درهم" },
    "proc_kpi_3_label": { "fr": "Coût par Clic", "en": "Cost per Click", "ar": "تكلفة النقرة" },
    "proc_kpi_3_desc": { "fr": "Trafic organique Google 100% propriétaire", "en": "100% proprietary organic Google traffic", "ar": "زيارات غوغل عضوية ملكك 100%" },
    "proc_kpi_4_val": { "fr": "100% Offert", "en": "100% Free", "ar": "100% مجاناً" },
    "proc_kpi_4_label": { "fr": "Audit Étape 02", "en": "Step 02 Audit", "ar": "تدقيق المرحلة 02" },
    "proc_kpi_4_desc": { "fr": "15 min d'échange direct sans engagement", "en": "15 min strategy call, zero commitment", "ar": "15 دقيقة تشخيص دون التزام" },

    "proc_tab_all": { "fr": "Toutes les 9 Étapes", "en": "All 9 Steps", "ar": "كافة الخطوات الـ 9" },
    "proc_tab_p1": { "fr": "Phase 1 : Cadrage (1 à 5)", "en": "Phase 1: Scoping (1 to 5)", "ar": "المرحلة 1: التأطير (1-5)" },
    "proc_tab_p2": { "fr": "Phase 2 : Sprint (6 & 7)", "en": "Phase 2: Sprint (6 & 7)", "ar": "المرحلة 2: التطوير (6-7)" },
    "proc_tab_p3": { "fr": "Phase 3 : Croissance (8 & 9)", "en": "Phase 3: Growth (8 & 9)", "ar": "المرحلة 3: النمو (8-9)" },

    "proc_deliv_label": { "fr": "Livrable :", "en": "Deliverable:", "ar": "المخرج :" },
    "proc_chan_label": { "fr": "Format :", "en": "Format:", "ar": "الصيغة :" },

    "funnel_s1_deliv": { "fr": "Cartographie sémantique des courtiers de votre ville", "en": "Semantic mapping of local insurance brokers", "ar": "خريطة دلالية لوسطاء التأمين بمدينتك" },
    "funnel_s1_chan": { "fr": "Google Maps, registre local & étude concurrentielle", "en": "Google Maps, local registry & competitor audit", "ar": "خرائط غوغل، السجل المحلي ودراسة المنافسين" },

    "funnel_s2_deliv": { "fr": "Rapport sémantique 5 pages & estimation de devis mensuels", "en": "5-page keyword report & monthly quote estimates", "ar": "تقرير سيو من 5 صفحات وتقدير طلبات التسعير" },
    "funnel_s2_chan": { "fr": "Échange direct 15 min en visio ou WhatsApp", "en": "15-min direct call via Video or WhatsApp", "ar": "محادثة مباشرة 15 دقيقة عبر واتساب أو مكالمة" },

    "funnel_s3_deliv": { "fr": "Verrouillage de votre zone exclusive & ciblage produits", "en": "Territory lock & priority product line selection", "ar": "حجز منطقتك الحصرية وتحديد المنتجات ذات الأولوية" },
    "funnel_s3_chan": { "fr": "Directeur d'acquisition dédié AssurLead", "en": "Dedicated AssurLead Acquisition Director", "ar": "مدير استقطاب مخصص من أسورليد" },

    "funnel_s4_deliv": { "fr": "Plan d'action chiffré sous 24h & contrat d'engagement", "en": "Quantified proposal under 24h & legal contract", "ar": "خطة عمل مسعرة خلال 24 ساعة وعقد رسمي" },
    "funnel_s4_chan": { "fr": "Formule Starter, Growth, Lead Engine ou Acquisition", "en": "Starter, Growth, Lead Engine or Custom Tier", "ar": "باقة Starter، Growth، Lead Engine أو المخصصة" },

    "funnel_s5_deliv": { "fr": "Facture officielle d'acompte 50% & créneau de production", "en": "50% deposit invoice & guaranteed production slot", "ar": "فاتورة رسمية لتسبيق 50% وحجز رسمي في جدول الإنتاج" },
    "funnel_s5_chan": { "fr": "Virement bancaire professionnel sécurisé", "en": "Secure commercial bank transfer", "ar": "تحويل بنكي مهني آمن" },

    "funnel_s6_deliv": { "fr": "Plateforme web sur-mesure validée Google Core Web Vitals", "en": "Custom web build verified on Google Core Web Vitals", "ar": "منصة ويب مخصصة موافقة لمعايير غوغل للسرعة" },
    "funnel_s6_chan": { "fr": "Sprint continu 7 à 10 jours ouvrés", "en": "Continuous 7 to 10 business day sprint", "ar": "سباق برمجي متواصل من 7 إلى 10 أيام عمل" },

    "funnel_s7_deliv": { "fr": "Domaine .ma/.com, certificat SSL HTTPS & validation finale", "en": ".ma/.com domain, HTTPS SSL & final client sign-off", "ar": "اسم النطاق .ma/.com، شهادة SSL والمصادقة النهائية" },
    "funnel_s7_chan": { "fr": "Tests en direct des formulaires et du bouton WhatsApp", "en": "Live testing of lead intake forms and WhatsApp", "ar": "اختبار حي ومباشر لنماذج التسعير وزر واتساب" },

    "funnel_s8_deliv": { "fr": "Balisage Schema.org LocalBusiness & indexation Google", "en": "Schema.org LocalBusiness markup & Google indexation", "ar": "ترميز سكيما للمؤسسات المحلية وفهرسة غوغل" },
    "funnel_s8_chan": { "fr": "Ciblage du Top 3 local sur les devis d'assurance", "en": "Targeting local Top 3 on insurance quotes", "ar": "استهداف المراتب الثلاث الأولى لطلبات التأمين" },

    "funnel_s9_deliv": { "fr": "Reporting mensuel de leads, maintenance & baisse du CAC", "en": "Monthly leads report, maintenance & CAC reduction", "ar": "تقرير شهري للعملاء، صيانة دورية وخفض تكلفة الاكتساب" },
    "funnel_s9_chan": { "fr": "Modèle récurrent sans engagement de durée", "en": "Recurring retainer with zero lock-in", "ar": "نموذج اشتراك مرن دون التزام طويل الأمد" },

    "proc_sim_badge": { "fr": "CALENDRIER ESTIMATIF", "en": "DEPLOYMENT TIMELINE", "ar": "الجدول الزمني التقديري" },
    "proc_sim_title": { "fr": "Simulateur de Calendrier de Déploiement en 14 Jours", "en": "14-Day Deployment Schedule Simulator", "ar": "محاكي جدول الإطلاق والتسليم خلال 14 يوماً" },
    "proc_sim_desc": { "fr": "Découvrez vos dates jalons clés selon votre jour de démarrage avec l'agence AssurLead.", "en": "Discover your key milestone dates based on your kickoff day with AssurLead.", "ar": "اكتشف المواعيد الدقيقة لكل مرحلة وفقاً ليوم انطلاق مشروعك مع وكالة أسورليد." },
    "proc_sim_btn_mon": { "fr": "Démarrer ce Lundi", "en": "Start This Monday", "ar": "البدء يوم الإثنين القادم" },
    "proc_sim_btn_today": { "fr": "Démarrer Aujourd'hui", "en": "Start Today", "ar": "البدء اليوم" },
    "proc_sim_btn_custom": { "fr": "Date Personnalisée", "en": "Custom Date", "ar": "تاريخ مخصص" },

    "proc_faq_badge": { "fr": "TRANSPARENCE TOTALE", "en": "COMPLETE TRANSPARENCY", "ar": "شفافية تامة" },
    "proc_faq_title": { "fr": "Questions Fréquentes sur notre Processus", "en": "Frequently Asked Questions About Our Process", "ar": "الأسئلة الشائعة حول مسار العمل والمنهجية" },
    "proc_faq_sub": { "fr": "Les réponses claires et contractuelles à toutes vos interrogations avant de réserver votre audit.", "en": "Clear and contractual answers to all your questions before booking your audit.", "ar": "إجابات واضحة ودقيقة على كافة تساؤلاتك قبل حجز تدقيقك المجاني." },

    "proc_faq_q1": { "fr": "Que comprend exactement l'audit gratuit de 15 minutes à l'étape 02 ?", "en": "What is included in the free 15-minute audit at Step 02?", "ar": "ماذا يشمل تحديداً التدقيق المجاني لمدة 15 دقيقة في المرحلة 02؟" },
    "proc_faq_a1": { "fr": "Nous analysons le volume exact de recherches de devis d'assurance sur votre ville (Auto, Santé, Risques Pro), le positionnement de vos concurrents directs et les failles de votre site actuel. Vous repartez avec des données chiffrées réelles, sans aucun engagement.", "en": "We analyze exact insurance quote search volumes in your city (Auto, Health, Commercial), competitor rankings, and technical flaws in your existing website. You receive concrete data with zero obligation.", "ar": "نقوم بتحليل دقيق لحجم عمليات البحث عن تسعيرات التأمين بمدينتك (السيارات، الصحة، الشركات)، ومواقع منافسيك ونقاط ضعف موقعك الحالي. ستحصل على أرقام واقعية دون أي التزام." },

    "proc_faq_q2": { "fr": "Pourquoi demandez-vous 50 % d'acompte à l'étape 05 ?", "en": "Why is a 50% deposit required at Step 05?", "ar": "لماذا تطلبون تسبيقاً بنسبة 50% في المرحلة 05؟" },
    "proc_faq_a2": { "fr": "Cet acompte formalise l'engagement mutuel et verrouille votre créneau exclusif dans notre calendrier de production. Dès réception, nos ingénieurs et rédacteurs démarrent immédiatement le sprint technique sans retard.", "en": "This deposit solidifies mutual commitment and secures your exclusive slot in our production schedule. Upon receipt, our engineers and copywriters initiate the sprint immediately without delay.", "ar": "يضفي هذا التسبيق الطابع الرسمي على الالتزام المتبادل ويحجز خانتك الحصرية في جدول الإنتاج. بمجرد التوصل به، ينطلق مهندسونا مباشرة في السباق البرمجي دون أي تأخير." },

    "proc_faq_q3": { "fr": "Comment est garantie mon exclusivité territoriale ?", "en": "How is my territorial exclusivity guaranteed?", "ar": "كيف يتم ضمان حصريتي الجغرافية؟" },
    "proc_faq_a3": { "fr": "Elle est inscrite noir sur blanc dans notre contrat d'agence : nous ne collaborons qu'avec un seul courtier ou cabinet d'assurance par zone géographique définie, évitant tout conflit d'intérêts direct.", "en": "It is written clearly into our agency contract: we only partner with one insurance broker per defined territory, eliminating direct conflicts of interest.", "ar": "يتم تضمينها بوضوح في عقد الوكالة: نحن نتعامل مع وسيط أو مكتب تأمين واحد فقط لكل منطقة جغرافية محددة، لتفادي أي تضارب مباشر في المصالح." },

    "proc_faq_q4": { "fr": "Que se passe-t-il si les délais de livraison ne sont pas respectés ?", "en": "What happens if delivery timelines are not met?", "ar": "ماذا يحدث إذا لم يتم احترام مواعيد التسليم؟" },
    "proc_faq_a4": { "fr": "Notre processus normé en sprint de 7 à 10 jours ouvrés garantit une livraison ponctuelle. En cas de dépassement imputable à notre agence, le premier mois d'abonnement SEO et maintenance vous est entièrement offert.", "en": "Our standardized 7-10 business day sprint guarantees timely launch. In the unlikely event of agency delay, your first month of SEO and maintenance retainer is completely free.", "ar": "منهجيتنا المحددة في سباق من 7 إلى 10 أيام عمل تضمن التسليم في الموعد. وفي حال حدوث أي تأخير من طرف الوكالة، نقدم لك الشهر الأول من صيانة وسيو مجاناً بالكامل." },

    "proc_faq_q5": { "fr": "Le site et les prospects m'appartiennent-ils réellement à 100 % ?", "en": "Do I own 100% of the website and generated leads?", "ar": "هل أملك الموقع والعملاء بنسبة 100% حقاً؟" },
    "proc_faq_a5": { "fr": "Oui, sans aucune exception. Vous êtes propriétaire exclusif du nom de domaine, du code source, de la base de données et de l'intégralité des devis entrants. Aucun système captif.", "en": "Yes, without exception. You hold 100% ownership of domain, codebase, database, and all inbound leads. Zero vendor lock-in.", "ar": "نعم، وبدون أي استثناء. أنت المالك الحصري والوحيد لاسم النطاق، الكود المصدري، قاعدة البيانات وكافة طلبات التسعير الواردة دون أي قيود." }
}

with open('script.js') as f:
    js = f.read()

# 1. Add new keys into translations object
trans_anchor = 'const translations = {'
trans_entries = '\n'.join([f"    {k}: {json.dumps(v, ensure_ascii=False)}," for k, v in new_translations.items()])
js = js.replace(trans_anchor, trans_anchor + '\n' + trans_entries, 1)

# 2. Add new interactive functions
new_pipeline_logic = '''
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

                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

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
                if (phase === 'all' || phase === 'phase1') {
                    const el = document.getElementById('etape-01');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else if (phase === 'phase2') {
                    const el = document.getElementById('etape-06');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else if (phase === 'phase3') {
                    const el = document.getElementById('etape-08');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                }
            });
        };

        const today = new Date();
        const nextMonday = new Date();
        const dayOfWeek = nextMonday.getDay();
        const distanceToMonday = (1 + 7 - dayOfWeek) % 7 || 7;
        nextMonday.setDate(nextMonday.getDate() + distanceToMonday);

        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                presetBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const presetType = btn.getAttribute('data-preset');
                if (presetType === 'monday') {
                    updateMilestones(nextMonday);
                } else if (presetType === 'today') {
                    updateMilestones(today);
                }
            });
        });

        // Initialize with Next Monday
        updateMilestones(nextMonday);
    };
'''

# Replace old pipeline tracker block in script.js
old_tracker_pattern = r'// --- PIPELINE TRACKER INTERACTIVITY \(PROCESSUS\.HTML\) ---.*?const initPipelineTracker = \(\) => \{.*?\n    \};\n'
js = re.sub(old_tracker_pattern, new_pipeline_logic + '\n', js, flags=re.DOTALL)

# Add initDeliverySimulator call in DOMContentLoaded
old_call = 'initPipelineTracker();'
new_call = 'initPipelineTracker();\n    initDeliverySimulator();'
if old_call in js and 'initDeliverySimulator();' not in js:
    js = js.replace(old_call, new_call, 1)

with open('script.js', 'w') as f:
    f.write(js)

print('Updated script.js successfully with new translations and simulator logic!')

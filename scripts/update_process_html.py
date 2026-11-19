with open('processus.html') as f:
    html = f.read()

# 1. Update Hero section to add KPI cards and phase quick-filter tabs
old_hero_close = '''                <p class="proc-hero-sub" data-i18n="proc_hero_desc">
                    Prospection → Audit gratuit → Appel WhatsApp/téléphone → Proposition → 50 % d'acompte → Production → Mise en ligne → SEO → Abonnement mensuel.<br>
                    Le modèle éprouvé qui transforme l'acquisition de courtiers d'assurance en système prévisible et pérenne.
                </p>
            </header>'''

new_hero_close = '''                <p class="proc-hero-sub" data-i18n="proc_hero_desc">
                    Prospection → Audit gratuit → Appel WhatsApp/téléphone → Proposition → 50 % d'acompte → Production → Mise en ligne → SEO → Abonnement mensuel.<br>
                    Le modèle éprouvé qui transforme l'acquisition de courtiers d'assurance en système prévisible et pérenne.
                </p>

                <!-- Hero Executive Summary KPI Strip -->
                <div class="proc-hero-stats">
                    <div class="proc-stat-card">
                        <div class="proc-stat-val" data-i18n="proc_kpi_1_val">14 Jours</div>
                        <div class="proc-stat-label" data-i18n="proc_kpi_1_label">Délai Clé en Main</div>
                        <p class="proc-stat-sub" data-i18n="proc_kpi_1_desc">Sprint technique garanti de A à Z</p>
                    </div>
                    <div class="proc-stat-card">
                        <div class="proc-stat-val" data-i18n="proc_kpi_2_val">50% / 50%</div>
                        <div class="proc-stat-label" data-i18n="proc_kpi_2_label">Paiement Sécurisé</div>
                        <p class="proc-stat-sub" data-i18n="proc_kpi_2_desc">Acompte au cadrage, solde à la recette</p>
                    </div>
                    <div class="proc-stat-card">
                        <div class="proc-stat-val" data-i18n="proc_kpi_3_val">0 MAD</div>
                        <div class="proc-stat-label" data-i18n="proc_kpi_3_label">Coût par Clic</div>
                        <p class="proc-stat-sub" data-i18n="proc_kpi_3_desc">Trafic organique Google 100% propriétaire</p>
                    </div>
                    <div class="proc-stat-card" style="border-color: rgba(0,255,65,0.35); background: linear-gradient(180deg, rgba(0,255,65,0.08) 0%, rgba(10,14,11,0.95) 100%);">
                        <div class="proc-stat-val" data-i18n="proc_kpi_4_val">100% Offert</div>
                        <div class="proc-stat-label" data-i18n="proc_kpi_4_label">Audit Étape 02</div>
                        <p class="proc-stat-sub" data-i18n="proc_kpi_4_desc">15 min d'échange direct sans engagement</p>
                    </div>
                </div>
            </header>

            <!-- Phase Quick-Filter Control Tabs -->
            <div class="proc-phase-tabs" role="tablist" aria-label="Filtrer les phases du tunnel">
                <button class="proc-phase-tab-btn active" data-phase="all" data-i18n="proc_tab_all">
                    <i class="fas fa-layer-group"></i> Toutes les 9 Étapes
                </button>
                <button class="proc-phase-tab-btn" data-phase="phase1" data-i18n="proc_tab_p1">
                    <i class="fas fa-handshake"></i> Phase 1 : Cadrage (1 à 5)
                </button>
                <button class="proc-phase-tab-btn" data-phase="phase2" data-i18n="proc_tab_p2">
                    <i class="fas fa-bolt"></i> Phase 2 : Sprint (6 & 7)
                </button>
                <button class="proc-phase-tab-btn" data-phase="phase3" data-i18n="proc_tab_p3">
                    <i class="fas fa-chart-line"></i> Phase 3 : Croissance (8 & 9)
                </button>
            </div>'''

if old_hero_close in html:
    html = html.replace(old_hero_close, new_hero_close, 1)
    print('Updated Hero section in processus.html')
else:
    print('Could not find old_hero_close')

# 2. Enrich Step 01
s1_old = '''                        <h3 class="funnel-card-title" data-i18n="funnel_s1_title">01. Prospection Ciblée</h3>
                        <p class="funnel-card-desc" data-i18n="funnel_s1_desc">Identification et qualification préliminaire des agences et courtiers d'assurance à fort potentiel sur votre zone (Casablanca, Rabat, Marrakech, Tanger...).</p>
                        <div class="funnel-card-tag"><i class="fas fa-bullseye"></i> <span data-i18n="funnel_s1_tag">Ciblage 100% Assurance</span></div>'''

s1_new = '''                        <h3 class="funnel-card-title" data-i18n="funnel_s1_title">01. Prospection Ciblée</h3>
                        <p class="funnel-card-desc" data-i18n="funnel_s1_desc">Identification et qualification préliminaire des agences et courtiers d'assurance à fort potentiel sur votre zone (Casablanca, Rabat, Marrakech, Tanger...).</p>
                        <div class="funnel-card-details">
                            <div class="funnel-detail-row">
                                <i class="fas fa-file-circle-check"></i>
                                <span><span class="funnel-detail-label" data-i18n="proc_deliv_label">Livrable :</span> <span class="funnel-detail-val" data-i18n="funnel_s1_deliv">Cartographie sémantique des courtiers de votre ville</span></span>
                            </div>
                            <div class="funnel-detail-row">
                                <i class="fas fa-crosshairs"></i>
                                <span><span class="funnel-detail-label" data-i18n="proc_chan_label">Format :</span> <span class="funnel-detail-val" data-i18n="funnel_s1_chan">Google Maps, registre local & étude concurrentielle</span></span>
                            </div>
                        </div>
                        <div class="funnel-card-tag"><i class="fas fa-bullseye"></i> <span data-i18n="funnel_s1_tag">Ciblage 100% Assurance</span></div>'''
html = html.replace(s1_old, s1_new, 1)

# Enrich Step 02
s2_old = '''                        <h3 class="funnel-card-title" data-i18n="funnel_s2_title">02. Audit Gratuit (15 min)</h3>
                        <p class="funnel-card-desc" data-i18n="funnel_s2_desc">Analyse sémantique complète offerte : volume réel de recherches locales de devis, positions des concurrents et potentiel d'acquisition immédiat.</p>
                        <div class="funnel-card-tag" style="background: rgba(0,255,65,0.15); border-color: rgba(0,255,65,0.35);"><i class="fas fa-gift"></i> <span data-i18n="funnel_s2_tag">100% Offert & Sans Engagement</span></div>'''

s2_new = '''                        <h3 class="funnel-card-title" data-i18n="funnel_s2_title">02. Audit Gratuit (15 min)</h3>
                        <p class="funnel-card-desc" data-i18n="funnel_s2_desc">Analyse sémantique complète offerte : volume réel de recherches locales de devis, positions des concurrents et potentiel d'acquisition immédiat.</p>
                        <div class="funnel-card-details">
                            <div class="funnel-detail-row">
                                <i class="fas fa-file-invoice"></i>
                                <span><span class="funnel-detail-label" data-i18n="proc_deliv_label">Livrable :</span> <span class="funnel-detail-val" data-i18n="funnel_s2_deliv">Rapport sémantique 5 pages & estimation de devis mensuels</span></span>
                            </div>
                            <div class="funnel-detail-row">
                                <i class="fas fa-clock"></i>
                                <span><span class="funnel-detail-label" data-i18n="proc_chan_label">Format :</span> <span class="funnel-detail-val" data-i18n="funnel_s2_chan">Échange direct 15 min en visio ou WhatsApp</span></span>
                            </div>
                        </div>
                        <div class="funnel-card-tag" style="background: rgba(0,255,65,0.15); border-color: rgba(0,255,65,0.35);"><i class="fas fa-gift"></i> <span data-i18n="funnel_s2_tag">100% Offert & Sans Engagement</span></div>'''
html = html.replace(s2_old, s2_new, 1)

# Enrich Step 03
s3_old = '''                        <h3 class="funnel-card-title" data-i18n="funnel_s3_title">03. Appel WhatsApp / Téléphone</h3>
                        <p class="funnel-card-desc" data-i18n="funnel_s3_desc">Échange direct de 15 min avec notre directeur d'acquisition pour débriefer l'audit, cerner vos objectifs de rentabilité et définir votre territoire exclusif.</p>
                        <div class="funnel-card-tag"><i class="fas fa-phone-volume"></i> <span data-i18n="funnel_s3_tag">Échange Direct 15 min</span></div>'''

s3_new = '''                        <h3 class="funnel-card-title" data-i18n="funnel_s3_title">03. Appel WhatsApp / Téléphone</h3>
                        <p class="funnel-card-desc" data-i18n="funnel_s3_desc">Échange direct de 15 min avec notre directeur d'acquisition pour débriefer l'audit, cerner vos objectifs de rentabilité et définir votre territoire exclusif.</p>
                        <div class="funnel-card-details">
                            <div class="funnel-detail-row">
                                <i class="fas fa-map-location-dot"></i>
                                <span><span class="funnel-detail-label" data-i18n="proc_deliv_label">Livrable :</span> <span class="funnel-detail-val" data-i18n="funnel_s3_deliv">Verrouillage de votre zone exclusive & ciblage produits</span></span>
                            </div>
                            <div class="funnel-detail-row">
                                <i class="fas fa-user-tie"></i>
                                <span><span class="funnel-detail-label" data-i18n="proc_chan_label">Format :</span> <span class="funnel-detail-val" data-i18n="funnel_s3_chan">Directeur d'acquisition dédié AssurLead</span></span>
                            </div>
                        </div>
                        <div class="funnel-card-tag"><i class="fas fa-phone-volume"></i> <span data-i18n="funnel_s3_tag">Échange Direct 15 min</span></div>'''
html = html.replace(s3_old, s3_new, 1)

# Enrich Step 04
s4_old = '''                        <h3 class="funnel-card-title" data-i18n="funnel_s4_title">04. Proposition Commerciale</h3>
                        <p class="funnel-card-desc" data-i18n="funnel_s4_desc">Remise sous 24h d'un plan d'action chiffré et transparent : sélection de votre formule (Starter, Growth, Lead Engine, Acquisition) et contrat d'engagement.</p>
                        <div class="funnel-card-tag"><i class="fas fa-file-contract"></i> <span data-i18n="funnel_s4_tag">Plan Chiffré sous 24h</span></div>'''

s4_new = '''                        <h3 class="funnel-card-title" data-i18n="funnel_s4_title">04. Proposition Commerciale</h3>
                        <p class="funnel-card-desc" data-i18n="funnel_s4_desc">Remise sous 24h d'un plan d'action chiffré et transparent : sélection de votre formule (Starter, Growth, Lead Engine, Acquisition) et contrat d'engagement.</p>
                        <div class="funnel-card-details">
                            <div class="funnel-detail-row">
                                <i class="fas fa-file-signature"></i>
                                <span><span class="funnel-detail-label" data-i18n="proc_deliv_label">Livrable :</span> <span class="funnel-detail-val" data-i18n="funnel_s4_deliv">Plan d'action chiffré sous 24h & contrat d'engagement</span></span>
                            </div>
                            <div class="funnel-detail-row">
                                <i class="fas fa-tags"></i>
                                <span><span class="funnel-detail-label" data-i18n="proc_chan_label">Format :</span> <span class="funnel-detail-val" data-i18n="funnel_s4_chan">Formule Starter, Growth, Lead Engine ou Acquisition</span></span>
                            </div>
                        </div>
                        <div class="funnel-card-tag"><i class="fas fa-file-contract"></i> <span data-i18n="funnel_s4_tag">Plan Chiffré sous 24h</span></div>'''
html = html.replace(s4_old, s4_new, 1)

# Enrich Step 05
s5_old = '''                        <h3 class="funnel-card-title" data-i18n="funnel_s5_title">05. 50 % d'Acompte</h3>
                        <p class="funnel-card-desc" data-i18n="funnel_s5_desc">Signature du contrat et règlement de l'acompte de 50%. Cette étape sécurise votre créneau dans le planning de l'agence et verrouille votre exclusivité territoriale.</p>
                        <div class="funnel-card-tag"><i class="fas fa-lock"></i> <span data-i18n="funnel_s5_tag">Exclusivité Territoriale Verrouillée</span></div>'''

s5_new = '''                        <h3 class="funnel-card-title" data-i18n="funnel_s5_title">05. 50 % d'Acompte</h3>
                        <p class="funnel-card-desc" data-i18n="funnel_s5_desc">Signature du contrat et règlement de l'acompte de 50%. Cette étape sécurise votre créneau dans le planning de l'agence et verrouille votre exclusivité territoriale.</p>
                        <div class="funnel-card-details">
                            <div class="funnel-detail-row">
                                <i class="fas fa-file-invoice-dollar"></i>
                                <span><span class="funnel-detail-label" data-i18n="proc_deliv_label">Livrable :</span> <span class="funnel-detail-val" data-i18n="funnel_s5_deliv">Facture officielle d'acompte 50% & créneau de production</span></span>
                            </div>
                            <div class="funnel-detail-row">
                                <i class="fas fa-shield-halved"></i>
                                <span><span class="funnel-detail-label" data-i18n="proc_chan_label">Format :</span> <span class="funnel-detail-val" data-i18n="funnel_s5_chan">Virement bancaire professionnel sécurisé</span></span>
                            </div>
                        </div>
                        <div class="funnel-card-tag"><i class="fas fa-lock"></i> <span data-i18n="funnel_s5_tag">Exclusivité Territoriale Verrouillée</span></div>'''
html = html.replace(s5_old, s5_new, 1)

# Enrich Step 06
s6_old = '''                        <h3 class="funnel-card-title" data-i18n="funnel_s6_title">06. Production & Intégration</h3>
                        <p class="funnel-card-desc" data-i18n="funnel_s6_desc">Développement technique en sprint (7 à 10 jours) : design UX/UI d'élite, vitesse &lt;1.2s, formulaires de qualification interactifs et intégration WhatsApp directe.</p>
                        <div class="funnel-card-tag"><i class="fas fa-bolt"></i> <span data-i18n="funnel_s6_tag">Sprint Dédié 7 à 10 Jours</span></div>'''

s6_new = '''                        <h3 class="funnel-card-title" data-i18n="funnel_s6_title">06. Production & Intégration</h3>
                        <p class="funnel-card-desc" data-i18n="funnel_s6_desc">Développement technique en sprint (7 à 10 jours) : design UX/UI d'élite, vitesse &lt;1.2s, formulaires de qualification interactifs et intégration WhatsApp directe.</p>
                        <div class="funnel-card-details">
                            <div class="funnel-detail-row">
                                <i class="fas fa-laptop-code"></i>
                                <span><span class="funnel-detail-label" data-i18n="proc_deliv_label">Livrable :</span> <span class="funnel-detail-val" data-i18n="funnel_s6_deliv">Plateforme web sur-mesure validée Google Core Web Vitals</span></span>
                            </div>
                            <div class="funnel-detail-row">
                                <i class="fas fa-gauge-high"></i>
                                <span><span class="funnel-detail-label" data-i18n="proc_chan_label">Format :</span> <span class="funnel-detail-val" data-i18n="funnel_s6_chan">Sprint continu 7 à 10 jours ouvrés</span></span>
                            </div>
                        </div>
                        <div class="funnel-card-tag"><i class="fas fa-bolt"></i> <span data-i18n="funnel_s6_tag">Sprint Dédié 7 à 10 Jours</span></div>'''
html = html.replace(s6_old, s6_new, 1)

# Enrich Step 07
s7_old = '''                        <h3 class="funnel-card-title" data-i18n="funnel_s7_title">07. Mise en Ligne & Recette</h3>
                        <p class="funnel-card-desc" data-i18n="funnel_s7_desc">Revue complète avec l'assureur, tests de transmission des devis, déploiement sur domaine sécurisé HTTPS/SSL et règlement du solde de 50%.</p>
                        <div class="funnel-card-tag"><i class="fas fa-globe"></i> <span data-i18n="funnel_s7_tag">Déploiement Certifié HTTPS</span></div>'''

s7_new = '''                        <h3 class="funnel-card-title" data-i18n="funnel_s7_title">07. Mise en Ligne & Recette</h3>
                        <p class="funnel-card-desc" data-i18n="funnel_s7_desc">Revue complète avec l'assureur, tests de transmission des devis, déploiement sur domaine sécurisé HTTPS/SSL et règlement du solde de 50%.</p>
                        <div class="funnel-card-details">
                            <div class="funnel-detail-row">
                                <i class="fas fa-certificate"></i>
                                <span><span class="funnel-detail-label" data-i18n="proc_deliv_label">Livrable :</span> <span class="funnel-detail-val" data-i18n="funnel_s7_deliv">Domaine .ma/.com, certificat SSL HTTPS & validation finale</span></span>
                            </div>
                            <div class="funnel-detail-row">
                                <i class="fas fa-check-double"></i>
                                <span><span class="funnel-detail-label" data-i18n="proc_chan_label">Format :</span> <span class="funnel-detail-val" data-i18n="funnel_s7_chan">Tests en direct des formulaires et du bouton WhatsApp</span></span>
                            </div>
                        </div>
                        <div class="funnel-card-tag"><i class="fas fa-globe"></i> <span data-i18n="funnel_s7_tag">Déploiement Certifié HTTPS</span></div>'''
html = html.replace(s7_old, s7_new, 1)

# Enrich Step 08
s8_old = '''                        <h3 class="funnel-card-title" data-i18n="funnel_s8_title">08. SEO & Visibilité Google</h3>
                        <p class="funnel-card-desc" data-i18n="funnel_s8_desc">Balisage Schema.org, siloing local, synchronisation Google Business Profile et indexation prioritaire pour capter le trafic organique d'acheteurs d'assurance.</p>
                        <div class="funnel-card-tag"><i class="fas fa-magnifying-glass"></i> <span data-i18n="funnel_s8_tag">1ères Positions Google Ciblées</span></div>'''

s8_new = '''                        <h3 class="funnel-card-title" data-i18n="funnel_s8_title">08. SEO & Visibilité Google</h3>
                        <p class="funnel-card-desc" data-i18n="funnel_s8_desc">Balisage Schema.org, siloing local, synchronisation Google Business Profile et indexation prioritaire pour capter le trafic organique d'acheteurs d'assurance.</p>
                        <div class="funnel-card-details">
                            <div class="funnel-detail-row">
                                <i class="fas fa-magnifying-glass-chart"></i>
                                <span><span class="funnel-detail-label" data-i18n="proc_deliv_label">Livrable :</span> <span class="funnel-detail-val" data-i18n="funnel_s8_deliv">Balisage Schema.org LocalBusiness & indexation Google</span></span>
                            </div>
                            <div class="funnel-detail-row">
                                <i class="fas fa-ranking-star"></i>
                                <span><span class="funnel-detail-label" data-i18n="proc_chan_label">Format :</span> <span class="funnel-detail-val" data-i18n="funnel_s8_chan">Ciblage du Top 3 local sur les devis d'assurance</span></span>
                            </div>
                        </div>
                        <div class="funnel-card-tag"><i class="fas fa-magnifying-glass"></i> <span data-i18n="funnel_s8_tag">1ères Positions Google Ciblées</span></div>'''
html = html.replace(s8_old, s8_new, 1)

# Enrich Step 09
s9_old = '''                        <h3 class="funnel-card-title" data-i18n="funnel_s9_title">09. Abonnement Mensuel</h3>
                        <p class="funnel-card-desc" data-i18n="funnel_s9_desc">Le modèle agence récurrent : maintenance technique, actualisation continue du SEO, optimisation du coût par prospect et reporting mensuel de performance.</p>
                        <div class="funnel-card-tag" style="color: #fbbf24; background: rgba(245,158,11,0.08); border-color: rgba(245,158,11,0.25);"><i class="fas fa-arrows-spin"></i> <span data-i18n="funnel_s9_tag">Pilotage Continu & Croissance MRR</span></div>'''

s9_new = '''                        <h3 class="funnel-card-title" data-i18n="funnel_s9_title">09. Abonnement Mensuel</h3>
                        <p class="funnel-card-desc" data-i18n="funnel_s9_desc">Le modèle agence récurrent : maintenance technique, actualisation continue du SEO, optimisation du coût par prospect et reporting mensuel de performance.</p>
                        <div class="funnel-card-details">
                            <div class="funnel-detail-row">
                                <i class="fas fa-chart-line" style="color: #fbbf24;"></i>
                                <span><span class="funnel-detail-label" data-i18n="proc_deliv_label">Livrable :</span> <span class="funnel-detail-val" data-i18n="funnel_s9_deliv">Reporting mensuel de leads, maintenance & baisse du CAC</span></span>
                            </div>
                            <div class="funnel-detail-row">
                                <i class="fas fa-arrows-rotate" style="color: #fbbf24;"></i>
                                <span><span class="funnel-detail-label" data-i18n="proc_chan_label">Format :</span> <span class="funnel-detail-val" data-i18n="funnel_s9_chan">Modèle récurrent sans engagement de durée</span></span>
                            </div>
                        </div>
                        <div class="funnel-card-tag" style="color: #fbbf24; background: rgba(245,158,11,0.08); border-color: rgba(245,158,11,0.25);"><i class="fas fa-arrows-spin"></i> <span data-i18n="funnel_s9_tag">Pilotage Continu & Croissance MRR</span></div>'''
html = html.replace(s9_old, s9_new, 1)

# 3. Add 14-Day Calendar Simulator and Process FAQ
sim_and_faq_code = '''
            <!-- 14-Day Delivery Calendar Simulator -->
            <div id="proc-simulator" class="proc-simulator-block">
                <div class="proc-simulator-header">
                    <span class="badge" data-i18n="proc_sim_badge">CALENDRIER ESTIMATIF</span>
                    <h2 class="proc-simulator-title" data-i18n="proc_sim_title">Simulateur de Calendrier de Déploiement en 14 Jours</h2>
                    <p class="proc-simulator-sub" data-i18n="proc_sim_desc">Découvrez vos dates jalons clés selon votre jour de démarrage avec l'agence AssurLead.</p>
                </div>

                <div class="proc-sim-controls">
                    <button class="sim-btn-preset active" data-preset="monday" data-i18n="proc_sim_btn_mon">
                        <i class="fas fa-calendar-check"></i> Démarrer ce Lundi
                    </button>
                    <button class="sim-btn-preset" data-preset="today" data-i18n="proc_sim_btn_today">
                        <i class="fas fa-bolt"></i> Démarrer Aujourd'hui
                    </button>
                </div>

                <div class="proc-timeline-track">
                    <div class="timeline-milestone-card">
                        <span class="milestone-day-badge">JOUR 0</span>
                        <div class="milestone-date">—</div>
                        <h4 class="milestone-name">Audit Gratuit 15 min</h4>
                        <p class="milestone-desc">Analyse sémantique complète des devis de votre ville.</p>
                    </div>

                    <div class="timeline-milestone-card">
                        <span class="milestone-day-badge">JOUR +1</span>
                        <div class="milestone-date">—</div>
                        <h4 class="milestone-name">Proposition Chiffrée</h4>
                        <p class="milestone-desc">Remise du plan d'action sous 24h & contrat d'engagement.</p>
                    </div>

                    <div class="timeline-milestone-card">
                        <span class="milestone-day-badge">JOUR +2</span>
                        <div class="milestone-date">—</div>
                        <h4 class="milestone-name">Acompte 50% & Cadrage</h4>
                        <p class="milestone-desc">Verrouillage de votre créneau de production et exclusivité.</p>
                    </div>

                    <div class="timeline-milestone-card">
                        <span class="milestone-day-badge">JOUR +10</span>
                        <div class="milestone-date">—</div>
                        <h4 class="milestone-name">Fin de Sprint Technique</h4>
                        <p class="milestone-desc">Site développé, responsive mobile & intégration WhatsApp.</p>
                    </div>

                    <div class="timeline-milestone-card" style="border-color: rgba(0, 255, 65, 0.45); background: rgba(0, 255, 65, 0.04);">
                        <span class="milestone-day-badge" style="background: var(--brand-neon); color: black;">JOUR +14</span>
                        <div class="milestone-date">—</div>
                        <h4 class="milestone-name">Mise en Ligne & SEO</h4>
                        <p class="milestone-desc">Déploiement HTTPS, déclaration Google Search Console & leads.</p>
                    </div>
                </div>
            </div>'''

# Insert simulator before Phase 3
phase3_anchor = '<!-- Phase 3 : Croissance & Récurrence (Étapes 08 à 09) -->'
if phase3_anchor in html:
    html = html.replace(phase3_anchor, sim_and_faq_code + '\n\n            ' + phase3_anchor, 1)
    print('Inserted simulator before Phase 3')
else:
    print('Could not find phase3_anchor')

# Insert Process FAQ before Consultation Callout Section
faq_code = '''
            <!-- Process FAQ Section -->
            <section id="proc-faq" class="proc-faq-section faq-section">
                <div class="section-header text-center" style="margin-bottom: 34px;">
                    <span class="badge" data-i18n="proc_faq_badge">TRANSPARENCE TOTALE</span>
                    <h2 class="section-title" data-i18n="proc_faq_title">Questions Fréquentes sur notre Processus</h2>
                    <p class="section-subtitle" data-i18n="proc_faq_sub">Les réponses claires et contractuelles à toutes vos interrogations avant de réserver votre audit.</p>
                </div>

                <div class="faq-list">
                    <div class="faq-item">
                        <button class="faq-trigger">
                            <span data-i18n="proc_faq_q1">Que comprend exactement l'audit gratuit de 15 minutes à l'étape 02 ?</span>
                            <span class="faq-icon"><i class="fas fa-plus"></i></span>
                        </button>
                        <div class="faq-answer-container">
                            <div class="faq-answer">
                                <p data-i18n="proc_faq_a1">Nous analysons le volume exact de recherches de devis d'assurance sur votre ville (Auto, Santé, Risques Pro), le positionnement de vos concurrents directs et les failles de votre site actuel. Vous repartez avec des données chiffrées réelles, sans aucun engagement.</p>
                            </div>
                        </div>
                    </div>

                    <div class="faq-item">
                        <button class="faq-trigger">
                            <span data-i18n="proc_faq_q2">Pourquoi demandez-vous 50 % d'acompte à l'étape 05 ?</span>
                            <span class="faq-icon"><i class="fas fa-plus"></i></span>
                        </button>
                        <div class="faq-answer-container">
                            <div class="faq-answer">
                                <p data-i18n="proc_faq_a2">Cet acompte formalise l'engagement mutuel et verrouille votre créneau exclusif dans notre calendrier de production. Dès réception, nos ingénieurs et rédacteurs démarrent immédiatement le sprint technique sans retard.</p>
                            </div>
                        </div>
                    </div>

                    <div class="faq-item">
                        <button class="faq-trigger">
                            <span data-i18n="proc_faq_q3">Comment est garantie mon exclusivité territoriale ?</span>
                            <span class="faq-icon"><i class="fas fa-plus"></i></span>
                        </button>
                        <div class="faq-answer-container">
                            <div class="faq-answer">
                                <p data-i18n="proc_faq_a3">Elle est inscrite noir sur blanc dans notre contrat d'agence : nous ne collaborons qu'avec un seul courtier ou cabinet d'assurance par zone géographique définie, évitant tout conflit d'intérêts direct.</p>
                            </div>
                        </div>
                    </div>

                    <div class="faq-item">
                        <button class="faq-trigger">
                            <span data-i18n="proc_faq_q4">Que se passe-t-il si les délais de livraison ne sont pas respectés ?</span>
                            <span class="faq-icon"><i class="fas fa-plus"></i></span>
                        </button>
                        <div class="faq-answer-container">
                            <div class="faq-answer">
                                <p data-i18n="proc_faq_a4">Notre processus normé en sprint de 7 à 10 jours ouvrés garantit une livraison ponctuelle. En cas de dépassement imputable à notre agence, le premier mois d'abonnement SEO et maintenance vous est entièrement offert.</p>
                            </div>
                        </div>
                    </div>

                    <div class="faq-item">
                        <button class="faq-trigger">
                            <span data-i18n="proc_faq_q5">Le site et les prospects m'appartiennent-ils réellement à 100 % ?</span>
                            <span class="faq-icon"><i class="fas fa-plus"></i></span>
                        </button>
                        <div class="faq-answer-container">
                            <div class="faq-answer">
                                <p data-i18n="proc_faq_a5">Oui, sans aucune exception. Vous êtes propriétaire exclusif du nom de domaine, du code source, de la base de données et de l'intégralité des devis entrants. Aucun système captif.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>'''

consultation_anchor = '<!-- Consultation Callout Section -->'
if consultation_anchor in html:
    html = html.replace(consultation_anchor, faq_code + '\n\n            ' + consultation_anchor, 1)
    print('Inserted FAQ section before Consultation')
else:
    print('Could not find consultation_anchor')

with open('processus.html', 'w') as f:
    f.write(html)

print('Updated processus.html successfully!')

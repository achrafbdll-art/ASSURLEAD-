# -*- coding: utf-8 -*-
import glob
import re

print("Applying data-i18n tags across all HTML files...")

# Common Navbar Replacements
def update_nav(html):
    # Standardize links
    html = re.sub(r'<a\s+href="/"([^>]*)>Accueil</a>', r'<a href="/\1 data-i18n="nav_home">Accueil</a>', html)
    html = re.sub(r'<a\s+href="/creation-site-web-casablanca\.html"([^>]*)>Casablanca</a>', r'<a href="/creation-site-web-casablanca.html"\1 data-i18n="nav_casablanca">Casablanca</a>', html)
    html = re.sub(r'<a\s+href="/creation-site-web-maroc\.html"([^>]*)>Maroc</a>', r'<a href="/creation-site-web-maroc.html"\1 data-i18n="nav_maroc">Maroc</a>', html)
    html = re.sub(r'<a\s+href="/realisations\.html"([^>]*)>Réalisations</a>', r'<a href="/realisations.html"\1 data-i18n="nav_realisations">Réalisations</a>', html)
    html = re.sub(r'<a\s+href="/processus\.html"([^>]*)>Processus</a>', r'<a href="/processus.html"\1 data-i18n="nav_processus">Processus</a>', html)
    html = re.sub(r'<a\s+href="/approche\.html"([^>]*)>Notre Approche</a>', r'<a href="/approche.html"\1 data-i18n="nav_approche">Notre Approche</a>', html)
    
    # Avoid duplicate data-i18n
    html = re.sub(r'data-i18n="([^"]+)"\s+data-i18n="([^"]+)"', r'data-i18n="\1"', html)
    return html

# Common Breadcrumb Replacements
def update_breadcrumbs(html):
    html = re.sub(
        r'<a\s+href="/"\s+class="diag-back-link">\s*<i\s+class="fas\s+fa-arrow-left"></i>\s*<span>Revenir à l\'accueil[^<]*</span>\s*</a>',
        r'<a href="/" class="diag-back-link" data-i18n="breadcrumb_back"><i class="fas fa-arrow-left"></i> <span>Revenir à l\'accueil du site</span></a>',
        html
    )
    return html

# Common KPI Cards Replacement
def update_kpis(html):
    kpi_block = '''<section class="realisation-kpi-grid" style="margin-bottom: 60px;">
                <div class="realisation-kpi-card">
                    <div class="realisation-kpi-val" data-i18n="kpi_speed_val">&lt; 1.2s</div>
                    <div class="realisation-kpi-title" data-i18n="kpi_speed_title">Temps de Chargement</div>
                    <p class="realisation-kpi-desc" data-i18n="kpi_speed_desc">Vitesse mobile ultra-rapide validée sur les Core Web Vitals de Google.</p>
                </div>
                <div class="realisation-kpi-card">
                    <div class="realisation-kpi-val" data-i18n="kpi_delay_val">10 - 14j</div>
                    <div class="realisation-kpi-title" data-i18n="kpi_delay_title">Délai Garanti</div>
                    <p class="realisation-kpi-desc" data-i18n="kpi_delay_desc">Livraison clé en main avec nom de domaine, hébergement SSL et SEO configuré.</p>
                </div>
                <div class="realisation-kpi-card">
                    <div class="realisation-kpi-val" data-i18n="kpi_owner_val">100%</div>
                    <div class="realisation-kpi-title" data-i18n="kpi_owner_title">Propriété Exclusive</div>
                    <p class="realisation-kpi-desc" data-i18n="kpi_owner_desc">Code source et leads 100% propriétaires à votre entreprise, sans dépendance tierce.</p>
                </div>
                <div class="realisation-kpi-card">
                    <div class="realisation-kpi-val" data-i18n="kpi_whatsapp_val">1 clic</div>
                    <div class="realisation-kpi-title" data-i18n="kpi_whatsapp_title">Tunnel WhatsApp</div>
                    <p class="realisation-kpi-desc" data-i18n="kpi_whatsapp_desc">Routage instantané des visiteurs vers vos commerciaux sans friction.</p>
                </div>
            </section>'''
    
    html = re.sub(r'<section\s+class="realisation-kpi-grid"[^>]*>.*?</section>', kpi_block, html, flags=re.DOTALL)
    return html

# Common Pillars (4 Steps) Replacement
def update_pillars(html):
    pillar_pattern = r'<div\s+class="realisation-section-header">\s*<span\s+class="badge">Méthode en 4 Étapes</span>\s*<h2>Notre processus[^<]*</h2>\s*</div>\s*<div\s+class="realisation-pillars-grid"[^>]*>.*?</div>\s*</div>'
    
    pillar_block = '''<div class="realisation-section-header">
                <span class="badge" data-i18n="pillar_section_badge">Méthode en 4 Étapes</span>
                <h2 data-i18n="pillar_section_title">Notre processus de création web au Maroc</h2>
            </div>

            <div class="realisation-pillars-grid" style="margin-bottom: 70px;">
                <div class="pillar-card">
                    <div class="pillar-icon-box"><i class="fas fa-clipboard-check"></i></div>
                    <h3 class="pillar-title" data-i18n="pillar_1_title">1. Audit & Cadrage Stratégique</h3>
                    <p class="pillar-desc" data-i18n="pillar_1_desc">Analyse de vos cibles locales, des mots-clés recherchés au Maroc et définition de l'arborescence de votre site.</p>
                </div>

                <div class="pillar-card">
                    <div class="pillar-icon-box"><i class="fas fa-palette"></i></div>
                    <h3 class="pillar-title" data-i18n="pillar_2_title">2. Design UI/UX & Rédaction</h3>
                    <p class="pillar-desc" data-i18n="pillar_2_desc">Création graphique sur-mesure aux couleurs de votre marque et rédaction persuasive orientée conversion de contacts.</p>
                </div>

                <div class="pillar-card">
                    <div class="pillar-icon-box"><i class="fas fa-rocket"></i></div>
                    <h3 class="pillar-title" data-i18n="pillar_3_title">3. Livraison en 10-14 jours</h3>
                    <p class="pillar-desc" data-i18n="pillar_3_desc">Mise en ligne avec certificat SSL, vérification de la vitesse mobile et déclaration de l'indexation sur Google Search Console.</p>
                </div>

                <div class="pillar-card">
                    <div class="pillar-icon-box"><i class="fas fa-chart-line"></i></div>
                    <h3 class="pillar-title" data-i18n="pillar_4_title">4. Acquisition & Suivi</h3>
                    <p class="pillar-desc" data-i18n="pillar_4_desc">Activation des canaux WhatsApp, accompagnement à la prise en main et suivi du positionnement local sur Google.</p>
                </div>
            </div>'''
    
    html = re.sub(pillar_pattern, pillar_block, html, flags=re.DOTALL)
    return html

# Common Pricing Summary Replacement
def update_pricing_summary(html):
    pricing_pattern = r'<div\s+class="realisation-section-header">\s*<span\s+class="badge">Grille Tarifaire Transparente</span>\s*<h2>Des tarifs clairs et sans frais cachés</h2>\s*<p>Nos formules répondent[^<]*</p>\s*</div>\s*<div\s+class="approche-cards-grid"[^>]*>.*?</div>\s*</div>'
    
    pricing_block = '''<div class="realisation-section-header">
                <span class="badge" data-i18n="pricing_section_badge">Grille Tarifaire Transparente</span>
                <h2 data-i18n="pricing_section_title">Des tarifs clairs et sans frais cachés</h2>
                <p data-i18n="pricing_section_desc">Nos formules répondent aux besoins réels des entreprises du Maroc, du lancement au système d'acquisition complet.</p>
            </div>

            <div class="approche-cards-grid" style="margin-bottom: 70px;">
                <div class="approche-card">
                    <div class="approche-card-body">
                        <div style="font-size: 11px; font-family: monospace; color: var(--brand-neon); margin-bottom: 6px;" data-i18n="price_launch_badge">OFFRE DE LANCEMENT</div>
                        <h3 class="approche-card-title" data-i18n="price_p1_title">Vitrine Essentielle — 1 500 DH</h3>
                        <p class="approche-card-desc" data-i18n="price_p1_desc">Offre valable jusqu'au 31/10/2026. Idéale pour démarrer avec une page de présentation soignée (n'inclut pas de SEO avancé ni de pages services dédiées).</p>
                    </div>
                </div>

                <div class="approche-card">
                    <div class="approche-card-body">
                        <div style="font-size: 11px; font-family: monospace; color: var(--brand-neon); margin-bottom: 6px;" data-i18n="price_starter_badge">FORMULE STARTER</div>
                        <h3 class="approche-card-title" data-i18n="price_p2_title">Starter — 2 000 DH</h3>
                        <p class="approche-card-desc" data-i18n="price_p2_desc">Site professionnel clé en main, hébergement et nom de domaine inclus la 1ère année, responsive mobile et contact WhatsApp.</p>
                    </div>
                </div>

                <div class="approche-card" style="border-color: rgba(0,255,65,0.4);">
                    <div class="approche-card-body">
                        <div style="font-size: 11px; font-family: monospace; color: var(--brand-neon); margin-bottom: 6px;" data-i18n="price_growth_badge">LE PLUS POPULAIRE</div>
                        <h3 class="approche-card-title" data-i18n="price_p3_title">Growth — 4 500 DH</h3>
                        <p class="approche-card-desc" data-i18n="price_p3_desc">Site complet multipages avec référencement naturel local sur Google, tunnels de conversion et optimisation Google Business Profile.</p>
                    </div>
                </div>

                <div class="approche-card">
                    <div class="approche-card-body">
                        <div style="font-size: 11px; font-family: monospace; color: var(--brand-neon); margin-bottom: 6px;" data-i18n="price_lead_badge">ACQUISITION ACTIVE</div>
                        <h3 class="approche-card-title" data-i18n="price_p4_title">Lead Engine — 8 000 DH</h3>
                        <p class="approche-card-desc" data-i18n="price_p4_desc">Moteur d'acquisition intensif, fonctionnalités e-commerce ou formulaires de devis avancés pour PME et cabinets ambitieux.</p>
                    </div>
                </div>
            </div>'''

    html = re.sub(pricing_pattern, pricing_block, html, flags=re.DOTALL)
    return html

# Common Case Study Replacement
def update_case_study(html):
    case_pattern = r'<section\s+style="margin-bottom:\s*70px;">\s*<div\s+class="project-card"[^>]*>.*?Cabinet Assurances El Omrani.*?</div>\s*</div>\s*</div>\s*</div>\s*</section>'
    
    case_block = '''<section style="margin-bottom: 70px;">
                <div class="project-card" style="background: #0d0d10; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden; padding: 28px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; align-items: center;">
                        <div>
                            <span class="badge" data-i18n="case_callout_badge"><span class="badge-flag">🇲🇦</span> Étude de Cas Réelle</span>
                            <h3 style="font-size: 22px; color: white; margin: 12px 0 8px 0;" data-i18n="case_callout_title">Cabinet Assurances El Omrani (AXA Casablanca)</h3>
                            <p style="font-size: 14px; color: var(--zinc-400); line-height: 1.6; margin-bottom: 16px;" data-i18n="case_callout_desc">
                                Déploiement du site <a href="https://www.assuranceselomrani.com" target="_blank" rel="noopener noreferrer" style="color: var(--brand-neon); text-decoration: underline;">www.assuranceselomrani.com</a> : un moteur digital ultra-rapide générant des demandes de devis d'assurance en flux continu avec un positionnement en 1ère page Google.
                            </p>
                            <a href="/realisations.html" class="btn btn-outline btn-sm" data-i18n="case_callout_btn">
                                <i class="fas fa-arrow-right"></i> Lire l'étude de cas complète
                            </a>
                        </div>
                        <div style="background: #141418; border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 24px; text-align: center;">
                            <div style="font-size: 32px; font-weight: 900; color: var(--brand-neon); margin-bottom: 4px;" data-i18n="case_stat_val">1ère Page</div>
                            <div style="font-size: 13px; color: white; font-weight: 700; margin-bottom: 10px;" data-i18n="case_stat_label">Google SEO Maroc</div>
                            <p style="font-size: 12px; color: var(--zinc-400);" data-i18n="case_stat_sub">Résultats mesurables et canal de contact direct WhatsApp actif 24h/24.</p>
                        </div>
                    </div>
                </div>
            </section>'''

    html = re.sub(case_pattern, case_block, html, flags=re.DOTALL)
    return html

# Common Consultation Replacement
def update_consultation(html):
    html = re.sub(r'<span\s+class="badge"><span\s+class="badge-flag">🇲🇦</span>\s*Déploiement Clé en Main</span>', r'<span class="badge" data-i18n="consult_badge"><span class="badge-flag">🇲🇦</span> Déploiement Clé en Main</span>', html)
    html = re.sub(r'<span\s+data-i18n="appr_trust_1">[^<]*</span>', r'<span data-i18n="consult_trust_1">Délai garanti 7-10 jours</span>', html)
    html = re.sub(r'<span\s+data-i18n="appr_trust_2">[^<]*</span>', r'<span data-i18n="consult_trust_2">Sans engagement de durée</span>', html)
    html = re.sub(r'<span\s+data-i18n="appr_trust_3">[^<]*</span>', r'<span data-i18n="consult_trust_3">Paiement 50/50 sécurisé</span>', html)
    html = re.sub(r'Devis Rapide sur WhatsApp</a>', r'<span data-i18n="consult_whatsapp_btn"><i class="fab fa-whatsapp"></i> Devis Rapide sur WhatsApp</span></a>', html)
    return html

# Common Footer Replacement
def update_footer(html):
    html = re.sub(r'<span\s+class="footer-seo-title">[^<]*</span>', r'<span class="footer-seo-title" data-i18n="footer_seo_title">Expertise Digitale & Référencement au Maroc</span>', html)
    html = re.sub(r'<p\s+class="footer-copy">[^<]*</p>', r'<p class="footer-copy" data-i18n="footer_copy">ASSURLEAD COM — Agence de création de sites web professionnels & référencement SEO au Maroc 🇲🇦</p>', html)
    return html

# Process each file
all_html = sorted(glob.glob('*.html'))
updated_count = 0

for filepath in all_html:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    orig = content
    content = update_nav(content)
    content = update_breadcrumbs(content)
    content = update_kpis(content)
    content = update_pillars(content)
    content = update_pricing_summary(content)
    content = update_case_study(content)
    content = update_consultation(content)
    content = update_footer(content)
    
    if content != orig:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        updated_count += 1
        print(f"Updated common sections with data-i18n in: {filepath}")

print(f"Finished updating common sections in {updated_count} files!")

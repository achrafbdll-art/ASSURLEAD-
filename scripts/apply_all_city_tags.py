# -*- coding: utf-8 -*-
import re

print("Applying specialized city and service page tags...")

PAGE_CONFIGS = {
    "creation-site-web-casablanca.html": "casa",
    "rabat.html": "rabat",
    "marrakech.html": "kech",
    "tanger.html": "tgr",
    "fes.html": "fes",
    "agadir.html": "aga",
    "creation-site-web-maroc.html": "maroc",
    "referencement-seo-casablanca.html": "seo_casa",
    "generation-leads-assurance-maroc.html": "leads",
}

for filename, prefix in PAGE_CONFIGS.items():
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        orig = content

        # 1. Hero Header
        content = re.sub(
            r'<div class="approche-badge-pill">',
            f'<div class="approche-badge-pill" data-i18n="{prefix}_hero_badge">',
            content
        )
        content = re.sub(
            r'<h1 class="approche-hero-title">',
            f'<h1 class="approche-hero-title" data-i18n="{prefix}_hero_title">',
            content
        )
        content = re.sub(
            r'<p class="approche-hero-sub">',
            f'<p class="approche-hero-sub" data-i18n="{prefix}_hero_sub">',
            content
        )

        # 2. Hero Action WhatsApp button
        content = re.sub(
            r'(<a\s+href="https://wa\.me/[^"]*"\s+target="_blank"[^>]*class="btn btn-primary diag-btn-main")>',
            rf'\1 data-i18n="{prefix}_btn_whatsapp">',
            content
        )

        # 3. Sector / Architecture Header
        sec_hdr = re.search(r'<div class="realisation-section-header">\s*<span class="badge">([^<]+)</span>\s*<h2>([^<]+)</h2>\s*<p>([^<]+)</p>\s*</div>', content)
        if sec_hdr:
            old_hdr = sec_hdr.group(0)
            b_txt, h_txt, p_txt = sec_hdr.group(1), sec_hdr.group(2), sec_hdr.group(3)
            new_hdr = f'''<div class="realisation-section-header">
                <span class="badge" data-i18n="{prefix}_sec_badge">{b_txt}</span>
                <h2 data-i18n="{prefix}_sec_title">{h_txt}</h2>
                <p data-i18n="{prefix}_sec_desc">{p_txt}</p>
            </div>'''
            content = content.replace(old_hdr, new_hdr, 1)

        # 4. Sector / Approche Cards (s1, s2, s3)
        cards_match = re.search(r'<div class="approche-cards-grid"[^>]*>.*?</div>\s*</div>', content, re.DOTALL)
        if cards_match:
            old_grid = cards_match.group(0)
            new_grid = old_grid
            for i in range(1, 4):
                new_grid = re.sub(
                    r'<h3 class="approche-card-title">(.*?)</h3>',
                    rf'<h3 class="approche-card-title" data-i18n="{prefix}_s{i}_title">\1</h3>',
                    new_grid,
                    count=1
                )
                new_grid = re.sub(
                    r'<p class="approche-card-desc">(.*?)</p>',
                    rf'<p class="approche-card-desc" data-i18n="{prefix}_s{i}_desc">\1</p>',
                    new_grid,
                    count=1
                )
            content = content.replace(old_grid, new_grid, 1)

        # 5. FAQ Header & Questions
        content = re.sub(
            r'<span class="badge">(FAQ[^<]*)</span>',
            rf'<span class="badge" data-i18n="{prefix}_faq_badge">\1</span>',
            content
        )
        content = re.sub(
            r'<h2 class="section-title">Questions fréquentes sur[^<]*(<span class="neon">[^<]+</span>)</h2>',
            rf'<h2 class="section-title" data-i18n="{prefix}_faq_title">Questions fréquentes sur la \1</h2>',
            content
        )
        content = re.sub(
            r'<p class="section-subtitle">Toutes les réponses[^<]*</p>',
            rf'<p class="section-subtitle" data-i18n="{prefix}_faq_sub">Toutes les réponses pour préparer votre projet web en toute sérénité.</p>',
            content
        )

        # FAQ items q1, q2, q3
        faq_items = re.findall(r'<div class="faq-item">.*?</div>\s*</div>\s*</div>', content, re.DOTALL)
        for idx, item in enumerate(faq_items[:3], 1):
            tagged_item = re.sub(
                r'<button class="faq-trigger">\s*<span>([^<]+)</span>',
                rf'<button class="faq-trigger"><span data-i18n="{prefix}_faq_q{idx}">\1</span>',
                item
            )
            tagged_item = re.sub(
                r'<div class="faq-answer">\s*<p>([^<]+)</p>',
                rf'<div class="faq-answer"><p data-i18n="{prefix}_faq_a{idx}">\1</p>',
                tagged_item
            )
            content = content.replace(item, tagged_item, 1)

        # 6. Consultation CTA Title & Desc
        content = re.sub(
            r'<h2(?![^>]*data-i18n)>Prêt à[^<]*</h2>',
            rf'<h2 data-i18n="{prefix}_cta_title">Prêt à développer votre visibilité ?</h2>',
            content
        )
        content = re.sub(
            r'<p(?![^>]*data-i18n)>(?:Contactez|Échangez|Demandez|Réservez)[^<]*</p>',
            rf'<p data-i18n="{prefix}_cta_desc">Contactez notre équipe dès aujourd\'hui pour un diagnostic gratuit de 15 minutes.</p>',
            content
        )

        # Avoid duplicates
        content = re.sub(r'data-i18n="([^"]+)"\s+data-i18n="([^"]+)"', r'data-i18n="\1"', content)

        if content != orig:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Tagged city-specific sections in: {filename}")
        else:
            print(f"No changes needed for: {filename}")
    except Exception as e:
        print(f"Error processing {filename}: {e}")

print("City tagging complete!")

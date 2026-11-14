import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const PILLAR_CARRIAGES = [
    {
        id: 'seo-optimisation',
        targetId: 'pillar-seo-optimisation',
        badge: '99 / 100',
        badgeSub: 'CORE VITALS',
        accent: '#00FF41',
        highlight: false,
        labels: {
            fr: {
                kicker: 'PÔLE 01 · PERFORMANCE',
                title: 'SEO OPTIMISATION',
                subtitle: 'Vitesse < 1.2s · Architecture Web · UX'
            },
            en: {
                kicker: 'PILLAR 01 · PERFORMANCE',
                title: 'SEO OPTIMIZATION',
                subtitle: 'Speed < 1.2s · Clean Code · Core Vitals'
            },
            ar: {
                kicker: 'المحور 01 · الأداء التقني',
                title: 'تحسين السيو SEO',
                subtitle: 'سرعة فائقة < 1.2ث · بنية ويب متقنة'
            }
        }
    },
    {
        id: 'referencement',
        targetId: 'pillar-referencement',
        badge: 'TOP 3',
        badgeSub: 'GOOGLE & MAPS',
        accent: '#00FF41',
        highlight: true,
        labels: {
            fr: {
                kicker: 'PÔLE 02 · VISIBILITÉ ORGANIQUE',
                title: 'RÉFÉRENCEMENT',
                subtitle: '1ère Page Google · Siloing · Autorité'
            },
            en: {
                kicker: 'PILLAR 02 · ORGANIC RANK',
                title: 'SEARCH RANKING',
                subtitle: 'Google Top 3 · Maps · Semantic SEO'
            },
            ar: {
                kicker: 'المحور 02 · الظهور العضوي',
                title: 'تصدر محركات البحث',
                subtitle: 'الصفحة الأولى جوجل · خرائط الأعمال'
            }
        }
    },
    {
        id: 'targeting-social',
        targetId: 'pillar-targeting-social',
        badge: 'ADS + ROI',
        badgeSub: 'RÉSEAUX SOCIAUX',
        accent: '#22ff66',
        highlight: false,
        labels: {
            fr: {
                kicker: 'PÔLE 03 · ACQUISITION CIBLÉE',
                title: 'TARGETING SOCIAL',
                subtitle: 'Réseaux Sociaux · Meta · LinkedIn · Leads'
            },
            en: {
                kicker: 'PILLAR 03 · PRECISION ADS',
                title: 'SOCIAL TARGETING',
                subtitle: 'Meta · LinkedIn · Retargeting Funnels'
            },
            ar: {
                kicker: 'المحور 03 · الاستهداف الدقيق',
                title: 'استهداف الشبكات',
                subtitle: 'ميتا · لينكدإن · استقطاب عملاء مؤهلين'
            }
        }
    },
    {
        id: 'geo-design',
        targetId: 'pillar-geo-design',
        badge: 'GEO 3D',
        badgeSub: 'IA & MAROC LOCAL',
        accent: '#00FF41',
        highlight: true,
        labels: {
            fr: {
                kicker: 'PÔLE 04 · GEO & EXPÉRIENCE 3D',
                title: 'GEO & DESIGN 3D',
                subtitle: 'Visibilité IA · Géo-Ciblage · WebGL Néon'
            },
            en: {
                kicker: 'PILLAR 04 · AI & SPATIAL',
                title: 'GEO & 3D DESIGN',
                subtitle: 'AI Search GEO · Local Cities · WebGL'
            },
            ar: {
                kicker: 'المحور 04 · الجغرافيا والذكاء',
                title: 'GEO والتصميم 3D',
                subtitle: 'الظهور بالذكاء الاصطناعي · المدن المغربية'
            }
        }
    }
];

// Pre-allocated math helpers (Zero GC inside render loop)
const _raycaster = new THREE.Raycaster();
_raycaster.layers.set(1);
const _pointer = new THREE.Vector2(-99, -99);
const _dummy = new THREE.Object3D();

function detectSoftwareGl() {
    try {
        const probe = document.createElement('canvas');
        const gl = probe.getContext('webgl2') || probe.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param) || '');
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch {
        return true;
    }
}

function isWebGLAvailable() {
    try {
        const c = document.createElement('canvas');
        return Boolean(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch {
        return false;
    }
}

function createCyberFloorTexture(maxAnisotropy) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#030805';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = 'rgba(0, 255, 65, 0.22)';
    ctx.lineWidth = 2;
    const step = 64;
    for (let i = 0; i <= 512; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
    }

    // Fine sub-grid
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 32; i < 512; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(32, 6);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = maxAnisotropy;
    tex.needsUpdate = true;
    return tex;
}

function createLocoPlaqueTexture(lang, maxAnisotropy) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#040d07';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, 'rgba(0, 255, 65, 0.34)');
    grad.addColorStop(0.5, 'rgba(0, 255, 65, 0.06)');
    grad.addColorStop(1, 'rgba(0, 255, 65, 0.28)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle HUD scanlines
    ctx.fillStyle = 'rgba(0, 255, 65, 0.06)';
    for (let y = 12; y < canvas.height; y += 16) {
        ctx.fillRect(14, y, canvas.width - 28, 2);
    }

    // Sci-fi chamfered double frame
    ctx.strokeStyle = '#00FF41';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(28, 10);
    ctx.lineTo(canvas.width - 10, 10);
    ctx.lineTo(canvas.width - 10, canvas.height - 28);
    ctx.lineTo(canvas.width - 28, canvas.height - 10);
    ctx.lineTo(10, canvas.height - 10);
    ctx.lineTo(10, 28);
    ctx.closePath();
    ctx.stroke();

    // Brand mark
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 58px Inter, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText('ASSUR', 44, 96);
    const wAssur = ctx.measureText('ASSUR').width;
    ctx.fillStyle = '#00FF41';
    ctx.fillText('LEAD', 44 + wAssur, 96);

    const sub =
        lang === 'ar'
            ? 'SEO · الشبكات الاجتماعية · GEO 3D'
            : lang === 'en'
              ? 'HYPER-CORE · SEO · SOCIAL · GEO 3D'
              : 'HYPER-CORE · SEO · RÉSEAUX · GEO 3D';

    ctx.fillStyle = '#d1fae5';
    ctx.font = '700 28px "JetBrains Mono", monospace';
    ctx.fillText(sub, 44, 174);

    // Futuristic telemetry speed chevrons
    ctx.fillStyle = '#00FF41';
    for (let i = 0; i < 4; i++) {
        const bx = 770 + i * 48;
        ctx.globalAlpha = 0.45 + i * 0.18;
        ctx.beginPath();
        ctx.moveTo(bx, 72);
        ctx.lineTo(bx + 28, 128);
        ctx.lineTo(bx, 184);
        ctx.lineTo(bx + 18, 184);
        ctx.lineTo(bx + 46, 128);
        ctx.lineTo(bx + 18, 72);
        ctx.closePath();
        ctx.fill();
    }
    ctx.globalAlpha = 1;

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = maxAnisotropy;
    texture.needsUpdate = true;
    return texture;
}

function drawCarriageBoardCanvas(canvas, pillar, lang) {
    const ctx = canvas.getContext('2d');
    const copy = pillar.labels[lang] || pillar.labels.fr;
    const accent = pillar.accent || '#00FF41';

    // Deep holographic glass backing
    ctx.fillStyle = pillar.highlight ? '#05150b' : '#050c08';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGrad.addColorStop(0, 'rgba(0, 255, 65, 0.28)');
    bgGrad.addColorStop(0.5, 'rgba(5, 16, 10, 0.22)');
    bgGrad.addColorStop(1, 'rgba(0, 255, 65, 0.24)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cyber HUD horizontal scanlines
    ctx.fillStyle = 'rgba(0, 255, 65, 0.055)';
    for (let y = 10; y < canvas.height; y += 14) {
        ctx.fillRect(12, y, canvas.width - 24, 2);
    }

    // Chamfered neon outer border
    ctx.strokeStyle = '#00FF41';
    ctx.lineWidth = pillar.highlight ? 7 : 5;
    ctx.beginPath();
    ctx.moveTo(28, 8);
    ctx.lineTo(canvas.width - 8, 8);
    ctx.lineTo(canvas.width - 8, canvas.height - 28);
    ctx.lineTo(canvas.width - 28, canvas.height - 8);
    ctx.lineTo(8, canvas.height - 8);
    ctx.lineTo(8, 28);
    ctx.closePath();
    ctx.stroke();

    // Glowing reticle corner brackets
    ctx.fillStyle = '#00FF41';
    ctx.fillRect(20, 16, 56, 5);
    ctx.fillRect(20, canvas.height - 21, 56, 5);

    // Top kicker
    ctx.fillStyle = accent;
    ctx.font = '800 25px "JetBrains Mono", Inter, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText(copy.kicker, 40, 52);

    // Main pillar title
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 54px Inter, system-ui, sans-serif';
    ctx.fillText(copy.title, 40, 126);

    // Subtitle line
    ctx.fillStyle = '#a7f3d0';
    ctx.font = '600 25px Inter, system-ui, sans-serif';
    ctx.fillText(copy.subtitle, 40, 198);

    // Right Chamfered Holographic Metric Pod
    const boxW = 312;
    const boxX = canvas.width - boxW - 30;
    ctx.fillStyle = 'rgba(0, 255, 65, 0.16)';
    ctx.beginPath();
    ctx.moveTo(boxX + 18, 38);
    ctx.lineTo(boxX + boxW, 38);
    ctx.lineTo(boxX + boxW, 200);
    ctx.lineTo(boxX + boxW - 18, 218);
    ctx.lineTo(boxX, 218);
    ctx.lineTo(boxX, 56);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#00FF41';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#00FF41';
    ctx.font = '900 48px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(pillar.badge, boxX + boxW / 2, 108);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 21px "JetBrains Mono", monospace';
    ctx.fillText(pillar.badgeSub, boxX + boxW / 2, 174);
}

function createCarriageBoardTexture(pillar, lang, maxAnisotropy) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    drawCarriageBoardCanvas(canvas, pillar, lang);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = maxAnisotropy;
    texture.needsUpdate = true;
    return { canvas, texture };
}

function init2DOfferTrainFallback(container, options = {}) {
    const { onSelectOffer } = options;
    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'train-2d-fallback';
    const itemsHtml = PILLAR_CARRIAGES.map(
        (p) => `
        <button type="button" class="train-2d-wagon ${p.highlight ? 'is-featured' : ''}" data-target="${p.targetId}">
            <span class="train-2d-title">${p.labels.fr.title}</span>
            <span class="train-2d-price">${p.badge}</span>
            <span class="train-2d-maint">${p.labels.fr.subtitle}</span>
        </button>`
    ).join('');

    wrapper.innerHTML = `
        <div class="train-2d-track">
            <div class="train-2d-marquee">
                <div class="train-2d-consist">
                    <div class="train-2d-loco">ASSUR<span>LEAD</span> 3D</div>
                    ${itemsHtml}
                </div>
                <div class="train-2d-consist" aria-hidden="true">
                    <div class="train-2d-loco">ASSUR<span>LEAD</span> 3D</div>
                    ${itemsHtml}
                </div>
            </div>
        </div>
    `;
    container.appendChild(wrapper);
    wrapper.querySelectorAll('.train-2d-wagon').forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            if (typeof onSelectOffer === 'function' && targetId) onSelectOffer(targetId);
        });
    });

    return {
        setLanguage: () => {},
        setPaused: () => {},
        isPaused: () => false,
        dispose: () => {
            container.innerHTML = '';
        }
    };
}

export function initOfferTrain3D(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    const {
        initialLang = 'fr',
        onHoverOffer = null,
        onSelectOffer = null,
        onPauseChange = null
    } = options;

    if (typeof THREE === 'undefined' || !isWebGLAvailable()) {
        return init2DOfferTrainFallback(container, options);
    }

    const isSoftwareGl = detectSoftwareGl();
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({
            antialias: !isSoftwareGl,
            alpha: true,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false
        });
    } catch {
        return init2DOfferTrainFallback(container, options);
    }

    if (!renderer || !renderer.domElement) {
        return init2DOfferTrainFallback(container, options);
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030805, 0.0145);

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 140);
    const aspect = width / height;

    // Cinematic low 3/4 sci-fi angle emphasizing 3D hyperloop depth & holographic beacons
    const camera = new THREE.PerspectiveCamera(36, aspect, 0.1, 150);
    const baseCamX = -1.85;
    const baseCamY = 1.44;
    const baseCamZ = aspect < 3.0 ? 11.8 : 9.35;
    camera.position.set(baseCamX, baseCamY, baseCamZ);
    camera.lookAt(0.55, 0.16, 0);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.28;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const maxAnisotropy = Math.min(renderer.capabilities.getMaxAnisotropy?.() || 1, 8);

    // Mandatory studio environment map for PBR reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRenderTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRenderTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // Futuristic 3-Point + Cyber Emerald Rim Rig
    const hemiLight = new THREE.HemisphereLight(0x86efac, 0x020604, 1.0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xf0fdf4, 2.45);
    keyLight.position.set(9, 14, 11);
    if (!isSoftwareGl) {
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        keyLight.shadow.camera.near = 1;
        keyLight.shadow.camera.far = 44;
        keyLight.shadow.camera.left = -28;
        keyLight.shadow.camera.right = 28;
        keyLight.shadow.camera.top = 7;
        keyLight.shadow.camera.bottom = -7;
        keyLight.shadow.bias = -0.0005;
        keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const neonRimLight = new THREE.DirectionalLight(0x00ff41, 2.8);
    neonRimLight.position.set(-11, 7, -8);
    scene.add(neonRimLight);

    const underBounceLight = new THREE.DirectionalLight(0x00ff41, 1.15);
    underBounceLight.position.set(3, -3, 8);
    scene.add(underBounceLight);

    // Futuristic Hyperloop Maglev Corridor
    const trackGroup = new THREE.Group();
    scene.add(trackGroup);

    const trackLength = 110;

    // Cybernetic perspective grid horizon floor below viaduct
    const cyberFloorTex = createCyberFloorTexture(maxAnisotropy);
    const cyberFloorMat = new THREE.MeshBasicMaterial({
        map: cyberFloorTex,
        transparent: true,
        opacity: 0.72,
        depthWrite: false
    });
    const cyberFloor = new THREE.Mesh(new THREE.PlaneGeometry(trackLength, 18), cyberFloorMat);
    cyberFloor.rotation.x = -Math.PI / 2;
    cyberFloor.position.set(0, -1.28, -2.5);
    trackGroup.add(cyberFloor);

    // Elevated obsidian maglev bridge deck
    const trackDeckMat = new THREE.MeshStandardMaterial({
        color: 0x070d0a,
        metalness: 0.58,
        roughness: 0.52
    });
    const trackDeck = new THREE.Mesh(new THREE.BoxGeometry(trackLength, 0.22, 3.6), trackDeckMat);
    trackDeck.position.set(0, -1.03, 0);
    trackDeck.receiveShadow = !isSoftwareGl;
    trackGroup.add(trackDeck);

    // Grounding shadow strip + additive plasma levitation glow
    const contactMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1
    });
    const contactStrip = new THREE.Mesh(new THREE.PlaneGeometry(trackLength, 1.45), contactMat);
    contactStrip.rotation.x = -Math.PI / 2;
    contactStrip.position.set(0, -0.91, 0);
    trackGroup.add(contactStrip);

    const neonFloorGlowMat = new THREE.MeshBasicMaterial({
        color: 0x00ff41,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const neonFloorGlow = new THREE.Mesh(new THREE.PlaneGeometry(trackLength, 2.55), neonFloorGlowMat);
    neonFloorGlow.rotation.x = -Math.PI / 2;
    neonFloorGlow.position.set(0, -0.905, 0);
    trackGroup.add(neonFloorGlow);

    // Instanced Angled Maglev Induction Coils (96 ties in 2 draw calls)
    const coilCount = 96;
    const coilShellGeo = new THREE.BoxGeometry(0.24, 0.08, 1.85);
    const coilShellMat = new THREE.MeshStandardMaterial({
        color: 0x13221a,
        metalness: 0.65,
        roughness: 0.42
    });
    const coilCoreGeo = new THREE.BoxGeometry(0.08, 0.095, 1.42);
    const neonGuideMat = new THREE.MeshStandardMaterial({
        color: 0x00ff41,
        emissive: 0x00ff41,
        emissiveIntensity: 2.55,
        roughness: 0.18,
        metalness: 0.1
    });

    const coilShellMesh = new THREE.InstancedMesh(coilShellGeo, coilShellMat, coilCount);
    const coilCoreMesh = new THREE.InstancedMesh(coilCoreGeo, neonGuideMat, coilCount);
    coilShellMesh.receiveShadow = !isSoftwareGl;

    for (let i = 0; i < coilCount; i++) {
        const cx = -trackLength / 2 + i * (trackLength / coilCount);
        _dummy.position.set(cx, -0.885, 0);
        _dummy.rotation.set(0, 0.14, 0);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();
        coilShellMesh.setMatrixAt(i, _dummy.matrix);

        _dummy.position.set(cx, -0.88, 0);
        _dummy.updateMatrix();
        coilCoreMesh.setMatrixAt(i, _dummy.matrix);
    }
    coilShellMesh.instanceMatrix.needsUpdate = true;
    coilCoreMesh.instanceMatrix.needsUpdate = true;
    coilShellMesh.computeBoundingSphere();
    coilCoreMesh.computeBoundingSphere();
    trackGroup.add(coilShellMesh, coilCoreMesh);

    // Twin Polished Maglev Chrome Rails + Quad Green Neon Laser Beams
    const railMat = new THREE.MeshStandardMaterial({
        color: 0xd1fae5,
        metalness: 0.96,
        roughness: 0.12
    });
    const railGeo = new THREE.BoxGeometry(trackLength, 0.08, 0.07);
    const frontRail = new THREE.Mesh(railGeo, railMat);
    frontRail.position.set(0, -0.81, 0.46);
    const rearRail = new THREE.Mesh(railGeo, railMat);
    rearRail.position.set(0, -0.81, -0.46);
    trackGroup.add(frontRail, rearRail);

    const neonGuideCenter = new THREE.Mesh(new THREE.BoxGeometry(trackLength, 0.04, 0.12), neonGuideMat);
    neonGuideCenter.position.set(0, -0.84, 0);
    const neonEdgeFront = new THREE.Mesh(new THREE.BoxGeometry(trackLength, 0.035, 0.06), neonGuideMat);
    neonEdgeFront.position.set(0, -0.9, 1.74);
    const neonEdgeRear = new THREE.Mesh(new THREE.BoxGeometry(trackLength, 0.035, 0.06), neonGuideMat);
    neonEdgeRear.position.set(0, -0.9, -1.74);
    trackGroup.add(neonGuideCenter, neonEdgeFront, neonEdgeRear);

    // Instanced Futuristic Cantilever Hyperloop Portal Ribs (20 arches in 4 draw calls)
    const archCount = 20;
    const archSpacing = trackLength / archCount;
    const strutGeo = new THREE.BoxGeometry(0.11, 2.05, 0.12);
    const archMat = new THREE.MeshStandardMaterial({
        color: 0x101c16,
        metalness: 0.88,
        roughness: 0.24
    });
    const archBeamGeo = new THREE.BoxGeometry(0.12, 0.09, 2.85);
    const archNeonTubeGeo = new THREE.BoxGeometry(0.055, 0.04, 2.65);
    const archSideNeonGeo = new THREE.BoxGeometry(0.055, 1.55, 0.05);

    const archStruts = new THREE.InstancedMesh(strutGeo, archMat, archCount);
    const archBeams = new THREE.InstancedMesh(archBeamGeo, archMat, archCount);
    const archNeonTops = new THREE.InstancedMesh(archNeonTubeGeo, neonGuideMat, archCount);
    const archNeonSides = new THREE.InstancedMesh(archSideNeonGeo, neonGuideMat, archCount);

    for (let i = 0; i < archCount; i++) {
        const px = -trackLength / 2 + 2.4 + i * archSpacing;
        // Slanted futuristic rear pylon strut
        _dummy.position.set(px, 0.04, -1.52);
        _dummy.rotation.set(0.18, 0, 0);
        _dummy.updateMatrix();
        archStruts.setMatrixAt(i, _dummy.matrix);

        // Cantilevered overhead wing beam
        _dummy.position.set(px, 1.04, -0.22);
        _dummy.rotation.set(0, 0, 0);
        _dummy.updateMatrix();
        archBeams.setMatrixAt(i, _dummy.matrix);

        // Glowing neon underside tube
        _dummy.position.set(px, 0.99, -0.22);
        _dummy.rotation.set(0, 0, 0);
        _dummy.updateMatrix();
        archNeonTops.setMatrixAt(i, _dummy.matrix);

        // Glowing neon spine strip on rear strut
        _dummy.position.set(px, -0.02, -1.44);
        _dummy.rotation.set(0.18, 0, 0);
        _dummy.updateMatrix();
        archNeonSides.setMatrixAt(i, _dummy.matrix);
    }
    archStruts.instanceMatrix.needsUpdate = true;
    archBeams.instanceMatrix.needsUpdate = true;
    archNeonTops.instanceMatrix.needsUpdate = true;
    archNeonSides.instanceMatrix.needsUpdate = true;
    archStruts.computeBoundingSphere();
    archBeams.computeBoundingSphere();
    archNeonTops.computeBoundingSphere();
    archNeonSides.computeBoundingSphere();
    trackGroup.add(archStruts, archBeams, archNeonTops, archNeonSides);

    // Instanced Volumetric 3D Data Photon Streaks (44 particles in 1 draw call)
    const particleCount = 44;
    const particleGeo = new THREE.BoxGeometry(0.45, 0.025, 0.025);
    const particleMat = new THREE.MeshBasicMaterial({
        color: 0x00ff41,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const particleMesh = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    const particleX = new Float32Array(particleCount);
    const particleY = new Float32Array(particleCount);
    const particleZ = new Float32Array(particleCount);
    const particleSpd = new Float32Array(particleCount);
    const particleScale = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        particleX[i] = -24 + ((i * 7.3) % 48);
        particleY[i] = -0.5 + ((i * 0.37) % 2.1);
        particleZ[i] = -3.8 + ((i * 1.13) % 5.4);
        particleSpd[i] = 2.6 + (i % 5) * 0.95;
        particleScale[i] = 0.65 + (i % 4) * 0.45;
    }
    trackGroup.add(particleMesh);

    // Shared Futuristic PBR + Green Neon Materials for Train Consist
    const bodyPaintMat = new THREE.MeshPhysicalMaterial({
        color: 0x070d0a,
        metalness: 0.92,
        roughness: 0.16,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05
    });
    const featuredBodyMat = new THREE.MeshPhysicalMaterial({
        color: 0x091c12,
        metalness: 0.94,
        roughness: 0.14,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04
    });
    const chromeTrimMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        metalness: 0.97,
        roughness: 0.1
    });
    const darkChassisMat = new THREE.MeshStandardMaterial({
        color: 0x050806,
        metalness: 0.65,
        roughness: 0.55
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x031a0e,
        metalness: 0.15,
        roughness: 0.04,
        clearcoat: 1.0,
        transmission: isSoftwareGl ? 0 : 0.48,
        transparent: true,
        opacity: isSoftwareGl ? 0.82 : 1
    });
    const neonEmissiveMat = new THREE.MeshStandardMaterial({
        color: 0x00ff41,
        emissive: 0x00ff41,
        emissiveIntensity: 3.0,
        roughness: 0.15
    });
    const headlightMat = new THREE.MeshStandardMaterial({
        color: 0xd1fae5,
        emissive: 0x00ff41,
        emissiveIntensity: 3.5
    });

    // Futuristic Mag-Rotor Turbine Rings (replace standard flat discs)
    const wheelRimGeo = new THREE.TorusGeometry(0.19, 0.045, 10, 24);
    const wheelHubGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.09, 12);
    wheelHubGeo.rotateX(Math.PI / 2);
    const wheelRimMat = new THREE.MeshStandardMaterial({
        color: 0xcbd5e1,
        metalness: 0.95,
        roughness: 0.15
    });

    // Holographic Wireframe Octahedron Geometry (shared across wagons)
    const holoGeo = new THREE.OctahedronGeometry(0.17, 0);
    const holoMat = new THREE.MeshBasicMaterial({
        color: 0x00ff41,
        wireframe: true,
        transparent: true,
        opacity: 0.88
    });

    const rotatingWheels = [];
    const holographicBeacons = [];
    const suspensionBodies = [];
    const interactiveProxies = [];
    const boardRecords = [];
    const carriageNeonMats = new Map();

    function buildMaglevBogie(xPos) {
        const bogie = new THREE.Group();
        bogie.position.set(xPos, -0.55, 0);

        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.14, 1.02), darkChassisMat);
        bogie.add(frame);

        // Hovering plasma repulsor neon pad underneath bogie
        const repulsorPad = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.045, 0.86), neonEmissiveMat);
        repulsorPad.position.set(0, -0.14, 0);
        bogie.add(repulsorPad);

        // Twin glowing side flux bars
        const bogieNeon = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.035, 1.06), neonEmissiveMat);
        bogieNeon.position.set(0, 0.02, 0);
        bogie.add(bogieNeon);

        const axleOffsets = [-0.38, 0.38];
        const zOffsets = [-0.47, 0.47];
        for (const ax of axleOffsets) {
            for (const az of zOffsets) {
                const rotorGroup = new THREE.Group();
                rotorGroup.position.set(ax, -0.02, az);
                const ring = new THREE.Mesh(wheelRimGeo, wheelRimMat);
                const core = new THREE.Mesh(wheelHubGeo, neonEmissiveMat);
                rotorGroup.add(ring, core);
                bogie.add(rotorGroup);
                rotatingWheels.push(rotorGroup);
            }
        }
        return bogie;
    }

    // Build Hyper-Futuristic Stealth Bullet Locomotive
    const trainGroup = new THREE.Group();
    scene.add(trainGroup);

    let currentLang = initialLang;
    const locoGroup = new THREE.Group();
    trainGroup.add(locoGroup);

    const locoShape = new THREE.Shape();
    locoShape.moveTo(-2.85, -0.44);
    locoShape.lineTo(2.92, -0.44);
    locoShape.lineTo(3.25, -0.24);
    locoShape.quadraticCurveTo(2.45, 0.42, 0.95, 0.74);
    locoShape.lineTo(-2.85, 0.74);
    locoShape.closePath();

    const locoBodyGeo = new THREE.ExtrudeGeometry(locoShape, {
        steps: 1,
        depth: 1.2,
        bevelEnabled: true,
        bevelThickness: 0.07,
        bevelSize: 0.055,
        bevelSegments: 4
    });
    locoBodyGeo.translate(0, 0, -0.6);

    const locoShell = new THREE.Group();
    locoGroup.add(locoShell);
    suspensionBodies.push(locoShell);

    const locoHull = new THREE.Mesh(locoBodyGeo, bodyPaintMat);
    locoHull.castShadow = !isSoftwareGl;
    locoShell.add(locoHull);

    // Chrome aerodynamic lower skirt + forward laser splitter blade
    const skirtMesh = new THREE.Mesh(new THREE.BoxGeometry(5.55, 0.13, 1.34), chromeTrimMat);
    skirtMesh.position.set(0.02, -0.46, 0);
    locoShell.add(skirtMesh);

    const noseSplitter = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.08, 1.3), neonEmissiveMat);
    noseSplitter.position.set(2.96, -0.41, 0);
    locoShell.add(noseSplitter);

    // Swept dorsal holographic stabilizer fin
    const dorsalFin = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.24, 0.07), chromeTrimMat);
    dorsalFin.position.set(-1.35, 0.9, 0);
    dorsalFin.rotation.z = 0.08;
    const dorsalFinNeon = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.045, 0.095), neonEmissiveMat);
    dorsalFinNeon.position.set(-1.35, 1.03, 0);
    dorsalFinNeon.rotation.z = 0.08;
    locoShell.add(dorsalFin, dorsalFinNeon);

    // Continuous neon top & lower flank energy conduits
    const locoTopNeon = new THREE.Mesh(new THREE.BoxGeometry(3.85, 0.04, 1.28), neonEmissiveMat);
    locoTopNeon.position.set(-0.92, 0.71, 0);
    const locoBottomNeon = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.065, 1.37), neonEmissiveMat);
    locoBottomNeon.position.set(-0.18, -0.28, 0);
    locoShell.add(locoTopNeon, locoBottomNeon);

    // Slatted glowing emerald plasma reactor vents along front nose flank
    for (let v = 0; v < 4; v++) {
        const vent = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.36, 1.34), neonEmissiveMat);
        vent.position.set(1.15 + v * 0.22, -0.02, 0);
        vent.rotation.z = -0.35;
        locoShell.add(vent);
    }

    // Sleek stealth cockpit canopy
    const canopyGeo = new THREE.BoxGeometry(1.55, 0.28, 1.16);
    const canopy = new THREE.Mesh(canopyGeo, glassMat);
    canopy.position.set(1.52, 0.37, 0);
    canopy.rotation.z = -0.38;
    locoShell.add(canopy);

    // Twin Laser Headlights + Volumetric Additive Plasma Cones
    const headlightGeo = new THREE.BoxGeometry(0.18, 0.09, 0.24);
    const hlFront = new THREE.Mesh(headlightGeo, headlightMat);
    hlFront.position.set(3.16, -0.22, 0.38);
    const hlRear = new THREE.Mesh(headlightGeo, headlightMat);
    hlRear.position.set(3.16, -0.22, -0.38);
    locoShell.add(hlFront, hlRear);

    const beamGeo = new THREE.ConeGeometry(0.72, 4.8, 18, 1, true);
    beamGeo.rotateZ(Math.PI / 2);
    const beamMat = new THREE.MeshBasicMaterial({
        color: 0x00ff41,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const lightBeam = new THREE.Mesh(beamGeo, beamMat);
    lightBeam.position.set(5.45, -0.22, 0);
    locoShell.add(lightBeam);

    // High-DPI Cyber Locomotive Plaque
    let locoPlaqueTexture = createLocoPlaqueTexture(currentLang, maxAnisotropy);
    const locoPlaqueMat = new THREE.MeshStandardMaterial({
        map: locoPlaqueTexture,
        roughness: 0.22,
        metalness: 0.16,
        emissive: 0x0a4a1f,
        emissiveIntensity: 0.8,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1
    });
    const locoPlaque = new THREE.Mesh(new THREE.PlaneGeometry(3.35, 0.76), locoPlaqueMat);
    locoPlaque.position.set(-0.92, 0.18, 0.69);
    locoShell.add(locoPlaque);

    locoGroup.add(buildMaglevBogie(-1.62), buildMaglevBogie(1.52));

    // Build 4 Futuristic Cyber-Pod Carriages
    const carriageSpacing = 5.48;
    const carriageLength = 4.92;
    const carriageShape = new THREE.Shape();
    carriageShape.moveTo(-carriageLength / 2, -0.44);
    carriageShape.lineTo(carriageLength / 2, -0.44);
    carriageShape.lineTo(carriageLength / 2 - 0.08, 0.6);
    carriageShape.lineTo(carriageLength / 2 - 0.24, 0.74);
    carriageShape.lineTo(-carriageLength / 2 + 0.24, 0.74);
    carriageShape.lineTo(-carriageLength / 2 + 0.08, 0.6);
    carriageShape.closePath();

    const carriageBodyGeo = new THREE.ExtrudeGeometry(carriageShape, {
        steps: 1,
        depth: 1.2,
        bevelEnabled: true,
        bevelThickness: 0.06,
        bevelSize: 0.05,
        bevelSegments: 3
    });
    carriageBodyGeo.translate(0, 0, -0.6);

    const couplerRingGeo = new THREE.TorusGeometry(0.46, 0.045, 8, 20);
    couplerRingGeo.rotateY(Math.PI / 2);
    const bellowsGeo = new THREE.BoxGeometry(0.56, 0.88, 0.86);
    const proxyGeo = new THREE.BoxGeometry(carriageLength, 1.65, 1.6);
    const proxyMat = new THREE.MeshBasicMaterial({ visible: false });

    PILLAR_CARRIAGES.forEach((pillar, idx) => {
        const centerX = -5.65 - idx * carriageSpacing;
        const carriageGroup = new THREE.Group();
        carriageGroup.position.set(centerX, 0, 0);
        trainGroup.add(carriageGroup);

        // Glowing plasma ring coupler connecting forward
        const coupler = new THREE.Mesh(bellowsGeo, darkChassisMat);
        coupler.position.set(carriageLength / 2 + 0.28, 0.12, 0);
        const couplerRing = new THREE.Mesh(couplerRingGeo, neonEmissiveMat);
        couplerRing.position.set(carriageLength / 2 + 0.28, 0.12, 0);
        carriageGroup.add(coupler, couplerRing);

        const cShell = new THREE.Group();
        carriageGroup.add(cShell);
        suspensionBodies.push(cShell);

        const hull = new THREE.Mesh(carriageBodyGeo, pillar.highlight ? featuredBodyMat : bodyPaintMat);
        hull.castShadow = !isSoftwareGl;
        cShell.add(hull);

        // Brushed titanium aero roof wing + lower skirt
        const cRoof = new THREE.Mesh(new THREE.BoxGeometry(carriageLength - 0.55, 0.08, 0.86), chromeTrimMat);
        cRoof.position.set(0, 0.84, 0);
        const cSkirt = new THREE.Mesh(new THREE.BoxGeometry(carriageLength - 0.12, 0.12, 1.32), chromeTrimMat);
        cSkirt.position.set(0, -0.46, 0);
        cShell.add(cRoof, cSkirt);

        // Per-carriage Neon Green material (amplifies on hover)
        const cNeonMat = new THREE.MeshStandardMaterial({
            color: pillar.accent,
            emissive: pillar.accent,
            emissiveIntensity: pillar.highlight ? 3.1 : 2.35,
            roughness: 0.16
        });
        carriageNeonMats.set(pillar.id, { mat: cNeonMat, baseIntensity: pillar.highlight ? 3.1 : 2.35 });

        // Top, bottom & angled corner neon light bars
        const cBottomStripe = new THREE.Mesh(new THREE.BoxGeometry(carriageLength - 0.04, 0.06, 1.36), cNeonMat);
        cBottomStripe.position.set(0, -0.34, 0);
        const cTopStripe = new THREE.Mesh(new THREE.BoxGeometry(carriageLength - 0.36, 0.04, 1.3), cNeonMat);
        cTopStripe.position.set(0, 0.69, 0);
        const cLeftRib = new THREE.Mesh(new THREE.BoxGeometry(0.055, 1.0, 1.35), cNeonMat);
        cLeftRib.position.set(-carriageLength / 2 + 0.16, 0.17, 0);
        const cRightRib = new THREE.Mesh(new THREE.BoxGeometry(0.055, 1.0, 1.35), cNeonMat);
        cRightRib.position.set(carriageLength / 2 - 0.16, 0.17, 0);
        cShell.add(cBottomStripe, cTopStripe, cLeftRib, cRightRib);

        // Panoramic upper glass strip
        const winBand = new THREE.Mesh(new THREE.BoxGeometry(carriageLength - 0.52, 0.18, 1.32), glassMat);
        winBand.position.set(0, 0.56, 0);
        cShell.add(winBand);

        // Floating 3D Wireframe Holographic Beacon rotating above each pod
        const holoBeacon = new THREE.Mesh(holoGeo, holoMat);
        holoBeacon.position.set(0, 1.12, 0);
        cShell.add(holoBeacon);
        holographicBeacons.push({ mesh: holoBeacon, id: pillar.id, phase: idx * 1.4 });

        // High-DPI Holographic Board
        const { canvas: boardCanvas, texture: boardTexture } = createCarriageBoardTexture(pillar, currentLang, maxAnisotropy);
        const boardMat = new THREE.MeshStandardMaterial({
            map: boardTexture,
            roughness: 0.2,
            metalness: 0.14,
            emissive: 0x093b1a,
            emissiveIntensity: 0.8,
            polygonOffset: true,
            polygonOffsetFactor: -1,
            polygonOffsetUnits: -1
        });
        const boardMesh = new THREE.Mesh(new THREE.PlaneGeometry(4.36, 0.9), boardMat);
        boardMesh.position.set(0, 0.08, 0.685);
        cShell.add(boardMesh);
        boardRecords.push({ offer: pillar, canvas: boardCanvas, texture: boardTexture, boardMat });

        // Futuristic maglev repulsor bogies
        carriageGroup.add(buildMaglevBogie(-1.55), buildMaglevBogie(1.55));

        // Raycast proxy (layer 1)
        const proxy = new THREE.Mesh(proxyGeo, proxyMat);
        proxy.position.set(0, 0.22, 0);
        proxy.layers.set(1);
        proxy.userData = { offer: pillar, index: idx };
        carriageGroup.add(proxy);
        interactiveProxies.push(proxy);
    });

    // Mount canvas inside container
    container.innerHTML = '';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    if (!isSoftwareGl) {
        renderer.compile(scene, camera);
    }

    // Animation & Interaction State
    let trainX = 4.5;
    let currentSpeed = prefersReducedMotion ? 1.15 : 3.45;
    let isPaused = false;
    let isHovered = false;
    let hoveredOfferId = null;
    let pointerNormX = 0;
    let pointerNormY = 0;
    let camTargetX = baseCamX;
    let camTargetY = baseCamY;
    let totalTravel = 0;
    let totalElapsed = 0;
    let isInViewport = true;
    let isTabVisible = !document.hidden;
    let disposed = false;
    let frameId = 0;
    let lastTime = performance.now();

    const getLoopBounds = () => {
        const halfW = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * camera.position.z * camera.aspect;
        const minX = -halfW - 4.8;
        const maxX = halfW + 27.8;
        return { minX, maxX };
    };

    const updateHoveredVisuals = (activeId) => {
        carriageNeonMats.forEach((entry, id) => {
            entry.mat.emissiveIntensity = id === activeId ? 4.6 : entry.baseIntensity;
        });
        boardRecords.forEach(({ offer, boardMat }) => {
            boardMat.emissiveIntensity = offer.id === activeId ? 1.3 : 0.8;
        });
    };

    const handlePointerMove = (e) => {
        const rect = renderer.domElement.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        _pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        _pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        pointerNormX = _pointer.x;
        pointerNormY = _pointer.y;

        _raycaster.setFromCamera(_pointer, camera);
        const hits = _raycaster.intersectObjects(interactiveProxies, false);
        if (hits.length > 0) {
            const hitOffer = hits[0].object.userData?.offer || null;
            isHovered = true;
            renderer.domElement.style.cursor = 'pointer';
            if (hitOffer && hoveredOfferId !== hitOffer.id) {
                hoveredOfferId = hitOffer.id;
                updateHoveredVisuals(hoveredOfferId);
                if (typeof onHoverOffer === 'function') onHoverOffer(hitOffer);
            }
        } else {
            isHovered = false;
            renderer.domElement.style.cursor = 'default';
            if (hoveredOfferId !== null) {
                hoveredOfferId = null;
                updateHoveredVisuals(null);
                if (typeof onHoverOffer === 'function') onHoverOffer(null);
            }
        }
    };

    const handlePointerLeave = () => {
        isHovered = false;
        pointerNormX = 0;
        pointerNormY = 0;
        renderer.domElement.style.cursor = 'default';
        if (hoveredOfferId !== null) {
            hoveredOfferId = null;
            updateHoveredVisuals(null);
            if (typeof onHoverOffer === 'function') onHoverOffer(null);
        }
    };

    const handleClick = (e) => {
        const rect = renderer.domElement.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        _pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        _pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        _raycaster.setFromCamera(_pointer, camera);
        const hits = _raycaster.intersectObjects(interactiveProxies, false);
        if (hits.length > 0) {
            const hitOffer = hits[0].object.userData?.offer;
            if (hitOffer && typeof onSelectOffer === 'function') {
                onSelectOffer(hitOffer.targetId);
            }
        }
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove, { passive: true });
    renderer.domElement.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    renderer.domElement.addEventListener('click', handleClick);

    function afterDraw(cb) {
        if (disposed) return;
        const gl = renderer.getContext();
        const sync = gl && gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
        if (!sync) {
            frameId = window.setTimeout(cb, 80);
            return;
        }
        gl.flush();
        const poll = () => {
            if (disposed) {
                gl.deleteSync(sync);
                return;
            }
            const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
            if (state === gl.UNSIGNALED) {
                frameId = window.setTimeout(poll, 5);
            } else {
                gl.deleteSync(sync);
                frameId = window.setTimeout(cb, 80);
            }
        };
        frameId = window.setTimeout(poll, 5);
    }

    let loopActive = false;
    function scheduleNextFrame() {
        if (disposed || !isInViewport || !isTabVisible) {
            loopActive = false;
            return;
        }
        loopActive = true;
        if (isSoftwareGl) {
            afterDraw(tick);
        } else {
            frameId = requestAnimationFrame(tick);
        }
    }

    function startLoop() {
        if (disposed || loopActive || !isInViewport || !isTabVisible) return;
        lastTime = performance.now();
        loopActive = true;
        if (isSoftwareGl) {
            frameId = window.setTimeout(tick, 16);
        } else {
            frameId = requestAnimationFrame(tick);
        }
    }

    function updateParticles(delta) {
        const speedFactor = isPaused ? 0.15 : 1.0;
        for (let i = 0; i < particleCount; i++) {
            particleX[i] -= particleSpd[i] * speedFactor * delta;
            if (particleX[i] < -26) particleX[i] = 26;
            _dummy.position.set(particleX[i], particleY[i], particleZ[i]);
            _dummy.rotation.set(0, 0, 0);
            _dummy.scale.set(particleScale[i], 1, 1);
            _dummy.updateMatrix();
            particleMesh.setMatrixAt(i, _dummy.matrix);
        }
        particleMesh.instanceMatrix.needsUpdate = true;
    }

    // Populate initial particle matrices before first render
    updateParticles(0);

    function tick() {
        if (disposed || !isInViewport || !isTabVisible) {
            loopActive = false;
            return;
        }
        const now = performance.now();
        const delta = Math.min((now - lastTime) / 1000, 0.08);
        lastTime = now;
        totalElapsed += delta;

        const baseTarget = prefersReducedMotion ? 1.15 : 3.45;
        const targetSpeed = isPaused ? 0 : isHovered ? 0.95 : baseTarget;
        currentSpeed = THREE.MathUtils.damp(currentSpeed, targetSpeed, 5.5, delta);

        const dx = currentSpeed * delta;
        trainX += dx;
        totalTravel += dx;

        const { minX, maxX } = getLoopBounds();
        if (trainX > maxX) {
            trainX = minX;
        }
        trainGroup.position.x = trainX;

        // Mag-rotor turbine spin (r = 0.19)
        const dTheta = dx / 0.19;
        for (let i = 0; i < rotatingWheels.length; i++) {
            rotatingWheels[i].rotation.z -= dTheta;
        }

        // Smooth maglev levitation wave
        for (let i = 0; i < suspensionBodies.length; i++) {
            suspensionBodies[i].position.y = Math.sin(totalElapsed * 3.1 + i * 1.1) * 0.012;
        }

        // Spin holographic 3D beacons above carriages
        for (let i = 0; i < holographicBeacons.length; i++) {
            const b = holographicBeacons[i];
            const spinMult = b.id === hoveredOfferId ? 3.2 : 1.0;
            b.mesh.rotation.y += delta * 1.65 * spinMult;
            b.mesh.rotation.x = Math.sin(totalElapsed * 1.8 + b.phase) * 0.25;
            b.mesh.position.y = 1.12 + Math.sin(totalElapsed * 2.8 + b.phase) * 0.04;
        }

        // Scroll floor cyber-grid subtly & stream 3D photon streaks
        if (!isPaused) {
            cyberFloorTex.offset.x = (cyberFloorTex.offset.x - dx * 0.04) % 1;
        }
        updateParticles(delta);

        // Smooth cinematic 3D camera parallax
        camTargetX = THREE.MathUtils.damp(camTargetX, baseCamX + pointerNormX * 0.55, 4.0, delta);
        camTargetY = THREE.MathUtils.damp(camTargetY, baseCamY + pointerNormY * 0.18, 4.0, delta);
        camera.position.x = camTargetX;
        camera.position.y = camTargetY;
        camera.lookAt(0.55 + (camTargetX - baseCamX) * 0.35, 0.16, 0);

        renderer.render(scene, camera);
        scheduleNextFrame();
    }

    let observer = null;
    if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(
            (entries) => {
                isInViewport = entries[0]?.isIntersecting ?? true;
                if (isInViewport) {
                    startLoop();
                } else {
                    cancelAnimationFrame(frameId);
                    clearTimeout(frameId);
                    loopActive = false;
                }
            },
            { threshold: 0.05 }
        );
        observer.observe(container);
    }

    const onVisibilityChange = () => {
        isTabVisible = !document.hidden;
        if (isTabVisible && isInViewport) {
            startLoop();
        } else {
            cancelAnimationFrame(frameId);
            clearTimeout(frameId);
            loopActive = false;
        }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    let resizeObserver = null;
    const handleResize = () => {
        if (disposed || !container) return;
        const newW = Math.max(container.clientWidth, 320);
        const newH = Math.max(container.clientHeight, 140);
        const newAspect = newW / newH;
        camera.aspect = newAspect;
        camera.position.z = newAspect < 3.0 ? 11.8 : 9.35;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
        renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
        if (isPaused) {
            renderer.render(scene, camera);
        }
    };

    if ('ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);
    } else {
        window.addEventListener('resize', handleResize);
    }

    const onContextLost = (event) => {
        event.preventDefault();
        disposed = true;
        cancelAnimationFrame(frameId);
        clearTimeout(frameId);
        init2DOfferTrainFallback(container, options);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost, false);

    // Draw initial frame immediately and start loop
    trainGroup.position.x = trainX;
    renderer.render(scene, camera);
    startLoop();

    return {
        setLanguage: (lang) => {
            if (!lang || lang === currentLang) return;
            currentLang = lang;
            const nextLocoTex = createLocoPlaqueTexture(lang, maxAnisotropy);
            locoPlaqueMat.map = nextLocoTex;
            locoPlaqueMat.needsUpdate = true;
            locoPlaqueTexture.dispose();
            locoPlaqueTexture = nextLocoTex;

            boardRecords.forEach(({ offer, canvas, texture }) => {
                drawCarriageBoardCanvas(canvas, offer, lang);
                texture.needsUpdate = true;
            });
            if (!loopActive) renderer.render(scene, camera);
        },
        setPaused: (paused) => {
            isPaused = Boolean(paused);
            if (typeof onPauseChange === 'function') onPauseChange(isPaused);
        },
        isPaused: () => isPaused,
        dispose: () => {
            disposed = true;
            cancelAnimationFrame(frameId);
            clearTimeout(frameId);
            observer?.disconnect();
            resizeObserver?.disconnect();
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            renderer.domElement.removeEventListener('pointermove', handlePointerMove);
            renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);
            renderer.domElement.removeEventListener('click', handleClick);
            renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
            scene.traverse((obj) => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) {
                    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
                    mats.forEach((m) => {
                        if (m.map) m.map.dispose();
                        m.dispose();
                    });
                }
            });
            cyberFloorTex.dispose();
            envRenderTarget.dispose();
            renderer.dispose();
        }
    };
}

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

// Zero-GC pre-allocated math utilities
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

function createQuantumGridTexture(maxAnisotropy) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#07170f';
    ctx.fillRect(0, 0, 512, 512);

    // Crisp luminous sci-fi grid lines
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.38)';
    ctx.lineWidth = 2.2;
    for (let i = 0; i <= 512; i += 64) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
    }

    // Bright glowing intersection nodes
    ctx.fillStyle = 'rgba(134, 255, 175, 0.85)';
    for (let x = 0; x <= 512; x += 64) {
        for (let y = 0; y <= 512; y += 64) {
            ctx.beginPath();
            ctx.arc(x, y, 3.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(34, 7);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = maxAnisotropy;
    tex.needsUpdate = true;
    return tex;
}

function createLocoPlaqueTexture(lang, maxAnisotropy) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 288;
    const ctx = canvas.getContext('2d');

    // Luminous high-contrast HUD card backdrop
    ctx.fillStyle = '#0c2919';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, 'rgba(0, 255, 65, 0.42)');
    grad.addColorStop(0.5, 'rgba(22, 68, 44, 0.32)');
    grad.addColorStop(1, 'rgba(0, 255, 65, 0.36)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Full luminous neon border
    ctx.strokeStyle = '#00FF41';
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 66px Inter, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText('ASSUR', 44, 108);
    const wAssur = ctx.measureText('ASSUR').width;
    ctx.fillStyle = '#00FF41';
    ctx.fillText('LEAD', 44 + wAssur, 108);

    const sub =
        lang === 'ar'
            ? 'مونورايل 3D · سيو · شبكات · GEO'
            : lang === 'en'
              ? 'QUANTUM MONORAIL · SEO · SOCIAL · GEO'
              : 'MONORAIL 3D · SEO · SOCIAL · GEO';

    ctx.fillStyle = '#ecfdf5';
    ctx.font = '700 28px "JetBrains Mono", monospace';
    ctx.fillText(sub, 44, 202);

    // Sleek ring telemetry emblem on right
    ctx.strokeStyle = '#00FF41';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(890, 144, 62, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(890, 144, 40, -0.6, Math.PI * 1.3);
    ctx.stroke();
    ctx.fillStyle = '#00FF41';
    ctx.font = '900 32px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('360°', 890, 146);

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

    ctx.fillStyle = pillar.highlight ? '#103822' : '#0b2919';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGrad.addColorStop(0, 'rgba(0, 255, 65, 0.36)');
    bgGrad.addColorStop(0.5, 'rgba(20, 62, 40, 0.28)');
    bgGrad.addColorStop(1, 'rgba(0, 255, 65, 0.42)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Full luminous outer card border + top/bottom thick neon bars
    ctx.strokeStyle = '#00FF41';
    ctx.lineWidth = 8;
    ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

    ctx.fillStyle = '#00FF41';
    ctx.fillRect(24, 12, canvas.width - 48, 8);
    ctx.fillRect(24, canvas.height - 20, canvas.width - 48, 8);

    // Left vertical glowing indicator bar
    ctx.fillRect(16, 40, 10, canvas.height - 80);

    // Top kicker
    ctx.fillStyle = accent;
    ctx.font = '800 30px "JetBrains Mono", Inter, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText(copy.kicker, 48, 68);

    // Main title (large & high-contrast)
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 66px Inter, system-ui, sans-serif';
    ctx.fillText(copy.title, 48, 162);

    // Subtitle
    ctx.fillStyle = '#ecfdf5';
    ctx.font = '700 29px Inter, system-ui, sans-serif';
    ctx.fillText(copy.subtitle, 48, 256);

    // Right Highlighted Metric Badge Card
    const cx = canvas.width - 178;
    const cy = 168;
    ctx.fillStyle = 'rgba(0, 255, 65, 0.22)';
    ctx.beginPath();
    ctx.roundRect?.(cx - 144, 52, 288, 232, 24);
    if (!ctx.roundRect) ctx.rect(cx - 144, 52, 288, 232);
    ctx.fill();
    ctx.strokeStyle = '#00FF41';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.fillStyle = '#00FF41';
    ctx.font = '900 54px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(pillar.badge, cx, cy - 24);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 24px "JetBrains Mono", monospace';
    ctx.fillText(pillar.badgeSub, cx, cy + 52);
}

function createCarriageBoardTexture(pillar, lang, maxAnisotropy) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 336;
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
                    <div class="train-2d-loco">ASSUR<span>LEAD</span> MONORAIL</div>
                    ${itemsHtml}
                </div>
                <div class="train-2d-consist" aria-hidden="true">
                    <div class="train-2d-loco">ASSUR<span>LEAD</span> MONORAIL</div>
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
    scene.fog = new THREE.FogExp2(0x071a10, 0.0085);

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 140);
    const aspect = width / height;

    // Closer Shinkansen Monorail framing so wagon cards are large & crystal-clear
    const camera = new THREE.PerspectiveCamera(36, aspect, 0.1, 150);
    const baseCamX = -1.35;
    const baseCamY = 1.46;
    const baseCamZ = aspect < 3.0 ? 9.35 : 7.4;
    camera.position.set(baseCamX, baseCamY, baseCamZ);
    camera.lookAt(0.45, 0.24, 0);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.48;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const maxAnisotropy = Math.min(renderer.capabilities.getMaxAnisotropy?.() || 1, 8);

    // Studio Reflection Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRenderTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRenderTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // Lighting Rig: Bright Studio Key + Front Fill + Mint Hemisphere + Emerald Rim
    const hemiLight = new THREE.HemisphereLight(0xe6fff0, 0x163826, 1.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.15);
    keyLight.position.set(8, 16, 12);
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

    const frontFillLight = new THREE.DirectionalLight(0xe2fbe9, 1.9);
    frontFillLight.position.set(-4, 4, 14);
    scene.add(frontFillLight);

    const neonRimLight = new THREE.DirectionalLight(0x00ff41, 3.3);
    neonRimLight.position.set(-12, 6.5, -8);
    scene.add(neonRimLight);

    const frontGlowLight = new THREE.DirectionalLight(0x34d399, 1.65);
    frontGlowLight.position.set(3, -1.5, 9);
    scene.add(frontGlowLight);

    // Central Elevated Monorail Guideway + Stargate Ring Portal Corridor
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    const trackLength = 114;

    // Quantum perspective grid horizon floor
    const gridTex = createQuantumGridTexture(maxAnisotropy);
    const gridFloorMat = new THREE.MeshBasicMaterial({
        map: gridTex,
        transparent: true,
        opacity: 0.9,
        depthWrite: false
    });
    const gridFloor = new THREE.Mesh(new THREE.PlaneGeometry(trackLength, 20), gridFloorMat);
    gridFloor.rotation.x = -Math.PI / 2;
    gridFloor.position.set(0, -1.36, -2.0);
    worldGroup.add(gridFloor);

    // Central Elevated Monorail Spine Beam (bright metallic gunmetal-emerald)
    const beamMat = new THREE.MeshPhysicalMaterial({
        color: 0x26382f,
        metalness: 0.78,
        roughness: 0.26,
        clearcoat: 0.85
    });
    const mainSpineBeam = new THREE.Mesh(new THREE.BoxGeometry(trackLength, 0.36, 0.62), beamMat);
    mainSpineBeam.position.set(0, -0.84, 0);
    mainSpineBeam.receiveShadow = !isSoftwareGl;
    worldGroup.add(mainSpineBeam);

    // Twin Polished Titanium Guide Rails embedded on monorail shoulders
    const chromeTrimMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        metalness: 0.92,
        roughness: 0.08
    });
    const spineCap = new THREE.Mesh(new THREE.BoxGeometry(trackLength, 0.07, 0.72), chromeTrimMat);
    spineCap.position.set(0, -0.64, 0);
    worldGroup.add(spineCap);

    // Glowing Green Neon Power Busbars running along both sides & bottom of monorail beam
    const neonEmissiveMat = new THREE.MeshStandardMaterial({
        color: 0x00ff41,
        emissive: 0x00ff41,
        emissiveIntensity: 3.3,
        roughness: 0.12
    });
    const frontBusbar = new THREE.Mesh(new THREE.BoxGeometry(trackLength, 0.045, 0.04), neonEmissiveMat);
    frontBusbar.position.set(0, -0.78, 0.325);
    const rearBusbar = new THREE.Mesh(new THREE.BoxGeometry(trackLength, 0.045, 0.04), neonEmissiveMat);
    rearBusbar.position.set(0, -0.78, -0.325);
    const underAuraMat = new THREE.MeshBasicMaterial({
        color: 0x00ff41,
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const underAuraPlane = new THREE.Mesh(new THREE.PlaneGeometry(trackLength, 2.3), underAuraMat);
    underAuraPlane.rotation.x = -Math.PI / 2;
    underAuraPlane.position.set(0, -1.34, 0);
    worldGroup.add(frontBusbar, rearBusbar, underAuraPlane);

    // Instanced Monorail Support Pillars + Glowing Stargate Ring Portals (18 rings in 3 draw calls!)
    const ringCount = 18;
    const ringSpacing = trackLength / ringCount;
    const pillarGeo = new THREE.CylinderGeometry(0.14, 0.22, 0.65, 10);
    const pillarMat = new THREE.MeshStandardMaterial({
        color: 0x2d4237,
        metalness: 0.8,
        roughness: 0.24
    });
    // Open Overhead Stargate Ring Arches (never cross in front of train cards!)
    const outerRingGeo = new THREE.TorusGeometry(2.08, 0.056, 10, 28, Math.PI * 1.16);
    outerRingGeo.rotateZ(-0.34);
    const innerNeonRingGeo = new THREE.TorusGeometry(1.96, 0.03, 8, 28, Math.PI * 1.16);
    innerNeonRingGeo.rotateZ(-0.34);

    const pillarInst = new THREE.InstancedMesh(pillarGeo, pillarMat, ringCount);
    const outerRingInst = new THREE.InstancedMesh(outerRingGeo, pillarMat, ringCount);
    const innerRingInst = new THREE.InstancedMesh(innerNeonRingGeo, neonEmissiveMat, ringCount);

    for (let i = 0; i < ringCount; i++) {
        const rx = -trackLength / 2 + 3.0 + i * ringSpacing;
        _dummy.position.set(rx, -1.12, 0);
        _dummy.rotation.set(0, 0, 0);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();
        pillarInst.setMatrixAt(i, _dummy.matrix);

        // Open overhead arch behind & above the train
        _dummy.position.set(rx, 0.28, 0);
        _dummy.rotation.set(0, Math.PI / 2, 0);
        _dummy.updateMatrix();
        outerRingInst.setMatrixAt(i, _dummy.matrix);
        innerRingInst.setMatrixAt(i, _dummy.matrix);
    }
    pillarInst.instanceMatrix.needsUpdate = true;
    outerRingInst.instanceMatrix.needsUpdate = true;
    innerRingInst.instanceMatrix.needsUpdate = true;
    pillarInst.computeBoundingSphere();
    outerRingInst.computeBoundingSphere();
    innerRingInst.computeBoundingSphere();
    worldGroup.add(pillarInst, outerRingInst, innerRingInst);

    // Instanced Neon Quantum Speed Streaks kept behind/above the train cards
    const streakCount = 46;
    const streakGeo = new THREE.BoxGeometry(0.65, 0.022, 0.022);
    const streakMat = new THREE.MeshBasicMaterial({
        color: 0x00ff41,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const streakMesh = new THREE.InstancedMesh(streakGeo, streakMat, streakCount);
    const streakX = new Float32Array(streakCount);
    const streakY = new Float32Array(streakCount);
    const streakZ = new Float32Array(streakCount);
    const streakSpd = new Float32Array(streakCount);
    const streakLen = new Float32Array(streakCount);

    for (let i = 0; i < streakCount; i++) {
        const angle = (i * 1.37) % Math.PI;
        const radius = 1.65 + (i % 4) * 0.35;
        streakX[i] = -26 + ((i * 6.9) % 52);
        streakY[i] = 0.75 + Math.sin(angle) * radius * 0.7;
        streakZ[i] = -0.6 - Math.abs(Math.cos(angle)) * radius;
        streakSpd[i] = 3.6 + (i % 5) * 1.1;
        streakLen[i] = 0.6 + (i % 4) * 0.45;
    }
    worldGroup.add(streakMesh);

    // Shared Bright Pearl-Silver, Slate-Titanium & Luminous Emerald Glass Materials
    const pearlTitaniumMat = new THREE.MeshPhysicalMaterial({
        color: 0xdbe7e1,
        metalness: 0.72,
        roughness: 0.18,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05
    });
    const deepObsidianMat = new THREE.MeshPhysicalMaterial({
        color: 0x3b4f44,
        metalness: 0.78,
        roughness: 0.25,
        clearcoat: 0.85
    });
    const glassDomeMat = new THREE.MeshPhysicalMaterial({
        color: 0x34d399,
        emissive: 0x064e3b,
        emissiveIntensity: 0.38,
        metalness: 0.1,
        roughness: 0.05,
        clearcoat: 1.0,
        transmission: isSoftwareGl ? 0 : 0.56,
        transparent: true,
        opacity: isSoftwareGl ? 0.82 : 1
    });
    const headlightMat = new THREE.MeshStandardMaterial({
        color: 0xecfdf5,
        emissive: 0x00ff41,
        emissiveIntensity: 4.0
    });

    // Counter-Rotating Monorail Gyro-Turbine Geometry
    const gyroRingGeo = new THREE.TorusGeometry(0.18, 0.032, 8, 22);
    const gyroCoreGeo = new THREE.OctahedronGeometry(0.09, 0);
    const holoDiamondGeo = new THREE.OctahedronGeometry(0.15, 0);
    const holoWireMat = new THREE.MeshBasicMaterial({
        color: 0x00ff41,
        wireframe: true,
        transparent: true,
        opacity: 0.92
    });

    const rotatingGyros = [];
    const floatingOrbs = [];
    const suspensionBodies = [];
    const interactiveProxies = [];
    const boardRecords = [];
    const carriageNeonMats = new Map();

    // Monorail Straddle Saddle + Spinning Gyro Turbines (replaces conventional wheels)
    function buildMonorailSaddlePod(xPos) {
        const pod = new THREE.Group();
        pod.position.set(xPos, -0.54, 0);

        // Straddle saddle clamping around the central monorail beam
        const leftClamp = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.34, 0.16), deepObsidianMat);
        leftClamp.position.set(0, -0.1, 0.43);
        const rightClamp = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.34, 0.16), deepObsidianMat);
        rightClamp.position.set(0, -0.1, -0.43);
        const topBridge = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.12, 0.96), chromeTrimMat);
        topBridge.position.set(0, 0.08, 0);
        pod.add(leftClamp, rightClamp, topBridge);

        // Glowing neon mag-lev cushion pads facing the beam
        const glowPadF = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.05, 0.06), neonEmissiveMat);
        glowPadF.position.set(0, -0.22, 0.44);
        const glowPadR = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.05, 0.06), neonEmissiveMat);
        glowPadR.position.set(0, -0.22, -0.44);
        pod.add(glowPadF, glowPadR);

        // Twin spinning magnetic gyro-turbines on front and rear straddle flanks
        for (const gx of [-0.34, 0.34]) {
            for (const gz of [-0.53, 0.53]) {
                const gyroGroup = new THREE.Group();
                gyroGroup.position.set(gx, -0.06, gz);
                const outerGyro = new THREE.Mesh(gyroRingGeo, chromeTrimMat);
                const innerGyro = new THREE.Mesh(gyroCoreGeo, neonEmissiveMat);
                gyroGroup.add(outerGyro, innerGyro);
                pod.add(gyroGroup);
                rotatingGyros.push(gyroGroup);
            }
        }
        return pod;
    }

    // Build Quantum Shinkansen Capsule Monorail Train
    const trainGroup = new THREE.Group();
    scene.add(trainGroup);

    let currentLang = initialLang;
    const locoGroup = new THREE.Group();
    trainGroup.add(locoGroup);

    const locoShell = new THREE.Group();
    locoGroup.add(locoShell);
    suspensionBodies.push(locoShell);

    // Cylindrical Capsule Rear Hull + Lathe-sculpted Aerodynamic Bullet Nose Cone!
    const locoCylinderGeo = new THREE.CylinderGeometry(0.66, 0.68, 3.3, 24, 1, false);
    locoCylinderGeo.rotateZ(Math.PI / 2);
    const locoHull = new THREE.Mesh(locoCylinderGeo, pearlTitaniumMat);
    locoHull.position.set(-1.15, 0.14, 0);
    locoHull.scale.set(1, 0.92, 1.06);
    locoHull.castShadow = !isSoftwareGl;
    locoShell.add(locoHull);

    // Sculpted Lathe Bullet Cone Nose (smooth Shinkansen curvature)
    const nosePoints = [
        new THREE.Vector2(0.01, 2.35),
        new THREE.Vector2(0.22, 2.05),
        new THREE.Vector2(0.42, 1.5),
        new THREE.Vector2(0.58, 0.8),
        new THREE.Vector2(0.67, 0.0)
    ];
    const noseGeo = new THREE.LatheGeometry(nosePoints, 24);
    noseGeo.rotateZ(-Math.PI / 2);
    const noseMesh = new THREE.Mesh(noseGeo, pearlTitaniumMat);
    noseMesh.position.set(0.5, 0.14, 0);
    noseMesh.scale.set(1, 0.92, 1.06);
    noseMesh.castShadow = !isSoftwareGl;
    locoShell.add(noseMesh);

    // Dark obsidian lower aerodynamic keel & side aero winglets
    const locoKeel = new THREE.Mesh(new THREE.BoxGeometry(5.1, 0.24, 1.38), deepObsidianMat);
    locoKeel.position.set(-0.25, -0.3, 0);
    locoShell.add(locoKeel);

    const wingGeo = new THREE.BoxGeometry(2.2, 0.06, 1.66);
    const frontWings = new THREE.Mesh(wingGeo, chromeTrimMat);
    frontWings.position.set(0.35, -0.26, 0);
    const wingNeonTrim = new THREE.Mesh(new THREE.BoxGeometry(2.26, 0.035, 1.7), neonEmissiveMat);
    wingNeonTrim.position.set(0.35, -0.22, 0);
    locoShell.add(frontWings, wingNeonTrim);

    // Panoramic Wrap-Around Smoked Glass Cockpit Visor Dome
    const visorGeo = new THREE.SphereGeometry(0.64, 24, 14, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const visor = new THREE.Mesh(visorGeo, glassDomeMat);
    visor.position.set(0.65, 0.2, 0);
    visor.scale.set(1.75, 0.82, 0.98);
    locoShell.add(visor);

    // Glowing Emerald Nose Ring Collar + Twin V-Optic Laser Headlights
    const collarRing = new THREE.Mesh(new THREE.TorusGeometry(0.67, 0.035, 10, 28), neonEmissiveMat);
    collarRing.rotation.y = Math.PI / 2;
    collarRing.scale.set(1.04, 0.9, 1);
    collarRing.position.set(0.5, 0.14, 0);
    locoShell.add(collarRing);

    const opticGeo = new THREE.BoxGeometry(0.45, 0.06, 0.16);
    const opticF = new THREE.Mesh(opticGeo, headlightMat);
    opticF.position.set(2.28, 0.02, 0.28);
    opticF.rotation.y = -0.28;
    const opticR = new THREE.Mesh(opticGeo, headlightMat);
    opticR.position.set(2.28, 0.02, -0.28);
    opticR.rotation.y = 0.28;
    locoShell.add(opticF, opticR);

    // Swept dorsal photon antenna fin + volumetric twin beam
    const fin = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.22, 0.06), chromeTrimMat);
    fin.position.set(-1.7, 0.82, 0);
    const finGlow = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.04, 0.09), neonEmissiveMat);
    finGlow.position.set(-1.7, 0.95, 0);
    locoShell.add(fin, finGlow);

    const beamGeo = new THREE.ConeGeometry(0.68, 4.6, 18, 1, true);
    beamGeo.rotateZ(Math.PI / 2);
    const headlightBeamMat = new THREE.MeshBasicMaterial({
        color: 0x00ff41,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const lightBeam = new THREE.Mesh(beamGeo, headlightBeamMat);
    lightBeam.position.set(5.1, -0.02, 0);
    locoShell.add(lightBeam);

    // Locomotive Holographic Side Plaque (self-illuminated & oversized for instant legibility)
    let locoPlaqueTexture = createLocoPlaqueTexture(currentLang, maxAnisotropy);
    const locoPlaqueMat = new THREE.MeshStandardMaterial({
        map: locoPlaqueTexture,
        emissiveMap: locoPlaqueTexture,
        emissive: 0xffffff,
        emissiveIntensity: 0.92,
        roughness: 0.22,
        metalness: 0.08,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1
    });
    const locoPlaque = new THREE.Mesh(new THREE.PlaneGeometry(3.35, 0.96), locoPlaqueMat);
    locoPlaque.position.set(-1.12, 0.24, 0.78);
    locoPlaque.rotation.x = -0.06;
    locoShell.add(locoPlaque);

    locoGroup.add(buildMonorailSaddlePod(-1.7), buildMonorailSaddlePod(1.05));

    // Build 4 Futuristic Capsule Glass-Dome Monorail Coaches
    const carriageSpacing = 5.55;
    const carriageLength = 4.82;
    const capsuleCylGeo = new THREE.CylinderGeometry(0.65, 0.67, carriageLength - 0.35, 24);
    capsuleCylGeo.rotateZ(Math.PI / 2);

    const capSphereGeo = new THREE.SphereGeometry(0.65, 20, 14);
    const orbCouplerGeo = new THREE.SphereGeometry(0.24, 16, 12);
    const couplerRingGeo = new THREE.TorusGeometry(0.42, 0.032, 8, 22);
    couplerRingGeo.rotateY(Math.PI / 2);

    const proxyGeo = new THREE.BoxGeometry(carriageLength, 2.1, 1.85);
    const proxyMat = new THREE.MeshBasicMaterial({ visible: false });

    PILLAR_CARRIAGES.forEach((pillar, idx) => {
        const centerX = -5.75 - idx * carriageSpacing;
        const carriageGroup = new THREE.Group();
        carriageGroup.position.set(centerX, 0, 0);
        trainGroup.add(carriageGroup);

        // Glowing Plasma Sphere + Dual Ring Magnetic Coupler (replaces accordion bellows)
        const orbCoupler = new THREE.Mesh(orbCouplerGeo, neonEmissiveMat);
        orbCoupler.position.set(carriageLength / 2 + 0.36, 0.12, 0);
        const cRing = new THREE.Mesh(couplerRingGeo, chromeTrimMat);
        cRing.position.set(carriageLength / 2 + 0.36, 0.12, 0);
        carriageGroup.add(orbCoupler, cRing);

        const cShell = new THREE.Group();
        carriageGroup.add(cShell);
        suspensionBodies.push(cShell);

        // Capsule body + rounded hemispherical end caps
        const capsuleMat = pillar.highlight ? pearlTitaniumMat : deepObsidianMat;
        const capsuleBody = new THREE.Mesh(capsuleCylGeo, capsuleMat);
        capsuleBody.position.set(0, 0.14, 0);
        capsuleBody.scale.set(1, 0.92, 1.06);
        capsuleBody.castShadow = !isSoftwareGl;

        const frontCap = new THREE.Mesh(capSphereGeo, capsuleMat);
        frontCap.position.set((carriageLength - 0.35) / 2, 0.14, 0);
        frontCap.scale.set(0.32, 0.92, 1.06);
        const rearCap = new THREE.Mesh(capSphereGeo, capsuleMat);
        rearCap.position.set(-(carriageLength - 0.35) / 2, 0.14, 0);
        rearCap.scale.set(0.32, 0.92, 1.06);
        cShell.add(capsuleBody, frontCap, rearCap);

        // Smoked Glass Skylight Canopy arching over upper half
        const roofDomeGeo = new THREE.CylinderGeometry(0.67, 0.67, carriageLength - 0.7, 20, 1, false, -Math.PI * 0.35, Math.PI * 0.7);
        roofDomeGeo.rotateZ(Math.PI / 2);
        roofDomeGeo.rotateX(Math.PI / 2);
        const roofDome = new THREE.Mesh(roofDomeGeo, glassDomeMat);
        roofDome.position.set(0, 0.24, 0);
        cShell.add(roofDome);

        // Lower titanium aero keel + flanking maglev fins
        const keel = new THREE.Mesh(new THREE.BoxGeometry(carriageLength - 0.25, 0.2, 1.34), deepObsidianMat);
        keel.position.set(0, -0.32, 0);
        const stabWing = new THREE.Mesh(new THREE.BoxGeometry(carriageLength - 0.9, 0.05, 1.56), chromeTrimMat);
        stabWing.position.set(0, -0.26, 0);
        cShell.add(keel, stabWing);

        // Per-carriage Neon Green material (brightens smoothly on hover)
        const cNeonMat = new THREE.MeshStandardMaterial({
            color: pillar.accent,
            emissive: pillar.accent,
            emissiveIntensity: pillar.highlight ? 3.2 : 2.4,
            roughness: 0.15
        });
        carriageNeonMats.set(pillar.id, { mat: cNeonMat, baseIntensity: pillar.highlight ? 3.2 : 2.4 });

        // Continuous neon wing trim + twin glowing capsule collar rings
        const wingNeon = new THREE.Mesh(new THREE.BoxGeometry(carriageLength - 0.85, 0.03, 1.6), cNeonMat);
        wingNeon.position.set(0, -0.22, 0);
        const collarF = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.028, 8, 26), cNeonMat);
        collarF.rotation.y = Math.PI / 2;
        collarF.scale.set(1.06, 0.92, 1);
        collarF.position.set(carriageLength / 2 - 0.28, 0.14, 0);
        const collarR = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.028, 8, 26), cNeonMat);
        collarR.rotation.y = Math.PI / 2;
        collarR.scale.set(1.06, 0.92, 1);
        collarR.position.set(-carriageLength / 2 + 0.28, 0.14, 0);
        cShell.add(wingNeon, collarF, collarR);

        // Spinning 3D Holographic Diamond Orb floating cleanly above taller card
        const holoOrb = new THREE.Mesh(holoDiamondGeo, holoWireMat);
        holoOrb.position.set(0, 1.42, 0);
        cShell.add(holoOrb);
        floatingOrbs.push({ mesh: holoOrb, id: pillar.id, phase: idx * 1.6 });

        // Prominent High-Visibility 3D Pillar Card (large, self-illuminated, angled to camera)
        const { canvas: boardCanvas, texture: boardTexture } = createCarriageBoardTexture(pillar, currentLang, maxAnisotropy);
        const boardMat = new THREE.MeshStandardMaterial({
            map: boardTexture,
            emissiveMap: boardTexture,
            emissive: 0xffffff,
            emissiveIntensity: 0.92,
            roughness: 0.2,
            metalness: 0.06,
            polygonOffset: true,
            polygonOffsetFactor: -1,
            polygonOffsetUnits: -1
        });
        const cardGroup = new THREE.Group();
        cardGroup.position.set(0, 0.34, 0.82);
        cardGroup.rotation.x = -0.07;

        const boardNeonEdge = new THREE.Mesh(new THREE.BoxGeometry(4.7, 1.54, 0.035), cNeonMat);
        boardNeonEdge.position.set(0, 0, -0.025);
        const boardFrame = new THREE.Mesh(new THREE.BoxGeometry(4.62, 1.48, 0.045), deepObsidianMat);
        boardFrame.position.set(0, 0, -0.01);
        const boardMesh = new THREE.Mesh(new THREE.PlaneGeometry(4.54, 1.42), boardMat);
        boardMesh.position.set(0, 0, 0.025);
        cardGroup.add(boardNeonEdge, boardFrame, boardMesh);
        cShell.add(cardGroup);
        boardRecords.push({ offer: pillar, canvas: boardCanvas, texture: boardTexture, boardMat });

        // Monorail Straddle Gyro Pods
        carriageGroup.add(buildMonorailSaddlePod(-1.5), buildMonorailSaddlePod(1.5));

        // Raycast proxy (layer 1)
        const proxy = new THREE.Mesh(proxyGeo, proxyMat);
        proxy.position.set(0, 0.2, 0);
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
    let trainX = 4.8;
    let currentSpeed = prefersReducedMotion ? 1.15 : 3.55;
    let isPaused = false;
    let isHovered = false;
    let hoveredOfferId = null;
    let pointerNormX = 0;
    let pointerNormY = 0;
    let camTargetX = baseCamX;
    let camTargetY = baseCamY;
    let totalElapsed = 0;
    let isInViewport = true;
    let isTabVisible = !document.hidden;
    let disposed = false;
    let frameId = 0;
    let lastTime = performance.now();

    const getLoopBounds = () => {
        const halfW = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * camera.position.z * camera.aspect;
        const minX = -halfW - 4.8;
        const maxX = halfW + 28.2;
        return { minX, maxX };
    };

    const updateHoveredVisuals = (activeId) => {
        carriageNeonMats.forEach((entry, id) => {
            entry.mat.emissiveIntensity = id === activeId ? 4.8 : entry.baseIntensity;
        });
        boardRecords.forEach(({ offer, boardMat }) => {
            boardMat.emissiveIntensity = offer.id === activeId ? 1.35 : 0.92;
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

    function updateStreaks(delta) {
        const speedFactor = isPaused ? 0.12 : 1.0;
        for (let i = 0; i < streakCount; i++) {
            streakX[i] -= streakSpd[i] * speedFactor * delta;
            if (streakX[i] < -26) streakX[i] = 26;
            _dummy.position.set(streakX[i], streakY[i], streakZ[i]);
            _dummy.rotation.set(0, 0, 0);
            _dummy.scale.set(streakLen[i], 1, 1);
            _dummy.updateMatrix();
            streakMesh.setMatrixAt(i, _dummy.matrix);
        }
        streakMesh.instanceMatrix.needsUpdate = true;
    }

    updateStreaks(0);

    function tick() {
        if (disposed || !isInViewport || !isTabVisible) {
            loopActive = false;
            return;
        }
        const now = performance.now();
        const delta = Math.min((now - lastTime) / 1000, 0.08);
        lastTime = now;
        totalElapsed += delta;

        const baseTarget = prefersReducedMotion ? 1.15 : 3.55;
        const targetSpeed = isPaused ? 0 : isHovered ? 0.95 : baseTarget;
        currentSpeed = THREE.MathUtils.damp(currentSpeed, targetSpeed, 5.5, delta);

        const dx = currentSpeed * delta;
        trainX += dx;

        const { minX, maxX } = getLoopBounds();
        if (trainX > maxX) {
            trainX = minX;
        }
        trainGroup.position.x = trainX;

        // Spin monorail gyro-turbines smoothly
        const dTheta = dx / 0.18;
        for (let i = 0; i < rotatingGyros.length; i++) {
            rotatingGyros[i].rotation.z -= dTheta;
        }

        // Smooth magnetic levitation float
        for (let i = 0; i < suspensionBodies.length; i++) {
            suspensionBodies[i].position.y = Math.sin(totalElapsed * 3.0 + i * 1.2) * 0.014;
        }

        // Spin holographic orbs above capsules
        for (let i = 0; i < floatingOrbs.length; i++) {
            const b = floatingOrbs[i];
            const mult = b.id === hoveredOfferId ? 3.4 : 1.0;
            b.mesh.rotation.y += delta * 1.8 * mult;
            b.mesh.rotation.z = Math.sin(totalElapsed * 1.6 + b.phase) * 0.22;
            b.mesh.position.y = 1.42 + Math.sin(totalElapsed * 2.9 + b.phase) * 0.04;
        }

        if (!isPaused) {
            gridTex.offset.x = (gridTex.offset.x - dx * 0.045) % 1;
        }
        updateStreaks(delta);

        // Smooth 3D parallax camera
        camTargetX = THREE.MathUtils.damp(camTargetX, baseCamX + pointerNormX * 0.58, 4.0, delta);
        camTargetY = THREE.MathUtils.damp(camTargetY, baseCamY + pointerNormY * 0.18, 4.0, delta);
        camera.position.x = camTargetX;
        camera.position.y = camTargetY;
        camera.lookAt(0.45 + (camTargetX - baseCamX) * 0.35, 0.24, 0);

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
        camera.position.z = newAspect < 3.0 ? 9.35 : 7.4;
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
            gridTex.dispose();
            envRenderTarget.dispose();
            renderer.dispose();
        }
    };
}

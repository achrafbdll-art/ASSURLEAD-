import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const FORMULAS = {
    starter: {
        id: 'starter',
        label: 'STARTER',
        setupCost: 2000,
        monthlyMaint: 100,
        baseTraffic: 420,
        trafficMaxMult: 3.1,
        baseConvRate: 0.024,
        convLift: 0.015,
        rampSpeed: 0.24,
        accentHex: 0x38bdf8,
        summary: 'Présence professionnelle & Google Maps local'
    },
    growth: {
        id: 'growth',
        label: 'GROWTH',
        setupCost: 4500,
        monthlyMaint: 150,
        baseTraffic: 680,
        trafficMaxMult: 4.4,
        baseConvRate: 0.032,
        convLift: 0.024,
        rampSpeed: 0.29,
        accentHex: 0x00ff41,
        summary: 'SEO local avancé + pages services + tunnels WhatsApp'
    },
    'lead-engine': {
        id: 'lead-engine',
        label: 'LEAD ENGINE',
        setupCost: 8000,
        monthlyMaint: 200,
        baseTraffic: 1050,
        trafficMaxMult: 5.8,
        baseConvRate: 0.039,
        convLift: 0.031,
        rampSpeed: 0.34,
        accentHex: 0x10b981,
        summary: 'Cocon sémantique organique + contenu métier + pilotage'
    },
    acquisition: {
        id: 'acquisition',
        label: 'ACQUISITION',
        setupCost: 12000,
        monthlyMaint: 200,
        baseTraffic: 1550,
        trafficMaxMult: 7.2,
        baseConvRate: 0.045,
        convLift: 0.037,
        rampSpeed: 0.39,
        accentHex: 0xf59e0b,
        summary: 'Domination régionale multi-requêtes & capture continue'
    }
};

const CITIES = {
    casablanca: { label: 'Casablanca', mult: 1.28 },
    rabat: { label: 'Rabat', mult: 1.12 },
    marrakech: { label: 'Marrakech', mult: 1.08 },
    tanger: { label: 'Tanger', mult: 1.05 },
    agadir: { label: 'Agadir', mult: 0.96 },
    fes: { label: 'Fès', mult: 0.94 }
};

const SECTORS = {
    assurance: { label: 'Assurance & Courtage', mult: 1.18, defaultDeal: 3800 },
    b2b: { label: 'Services B2B & Industrie', mult: 1.10, defaultDeal: 8500 },
    sante: { label: 'Santé & Cliniques', mult: 1.24, defaultDeal: 2600 },
    immo: { label: 'Immobilier & Architecture', mult: 1.04, defaultDeal: 14000 },
    conseil: { label: 'Cabinet Conseil & Juridique', mult: 1.08, defaultDeal: 6200 }
};

const MONTHS = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'];

function detectSoftwareWebGL() {
    try {
        const probe = document.createElement('canvas');
        const gl = probe.getContext('webgl2') || probe.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param) || '');
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch (_) {
        return true;
    }
}

function formatMAD(num) {
    return new Intl.NumberFormat('fr-MA').format(Math.round(num)) + ' DH';
}

function formatInt(num) {
    return new Intl.NumberFormat('fr-MA').format(Math.round(num));
}

function computeSeries(state) {
    const formula = FORMULAS[state.formula] || FORMULAS.growth;
    const city = CITIES[state.city] || CITIES.casablanca;
    const sector = SECTORS[state.sector] || SECTORS.assurance;
    const closingRate = state.closingRate / 100;
    const dealValue = state.dealValue;
    const horizon = state.horizon;

    const months = [];
    let cumRevenue = 0;
    let cumCost = formula.setupCost;
    let cumLeads = 0;
    let cumClients = 0;

    for (let i = 0; i < 12; i++) {
        const t = i / 11; // 0..1
        // S-curve compounding SEO + Maps + Conversion acceleration
        const growthCurve = 1 / (1 + Math.exp(-6.2 * (t - (0.44 - (formula.rampSpeed - 0.24) * 0.6))));
        const normalizedCurve = (growthCurve - 0.06) / 0.94;
        const clampedCurve = Math.max(0.08, Math.min(1, normalizedCurve));

        const marketFactor = city.mult * sector.mult;
        const baselineTraffic = Math.round(formula.baseTraffic * 0.42 * marketFactor * (1 + t * 0.08));
        const assurleadTraffic = Math.round(
            formula.baseTraffic * marketFactor * (1 + (formula.trafficMaxMult - 1) * clampedCurve)
        );

        const baselineLeads = Math.max(2, Math.round(baselineTraffic * 0.0085));
        const convRate = formula.baseConvRate + formula.convLift * Math.pow(clampedCurve, 0.85);
        const assurleadLeads = Math.max(baselineLeads + 2, Math.round(assurleadTraffic * convRate));
        const clients = Math.max(1, Math.round(assurleadLeads * closingRate * 10) / 10);
        const monthlyRevenue = Math.round(clients * dealValue);

        if (i < horizon) {
            cumLeads += assurleadLeads;
            cumClients += clients;
            cumRevenue += monthlyRevenue;
            cumCost += formula.monthlyMaint;
        }

        months.push({
            index: i,
            label: MONTHS[i],
            active: i < horizon,
            baselineTraffic,
            traffic: assurleadTraffic,
            baselineLeads,
            leads: assurleadLeads,
            convRatePct: (convRate * 100).toFixed(1),
            clients: Math.round(clients),
            revenue: monthlyRevenue
        });
    }

    const roiPct = cumCost > 0 ? Math.round(((cumRevenue - cumCost) / cumCost) * 100) : 0;
    const mLast = months[horizon - 1] || months[11];

    return {
        months,
        mLast,
        cumLeads,
        cumClients: Math.round(cumClients),
        cumRevenue,
        cumCost,
        roiPct,
        costPerLead: cumLeads > 0 ? Math.round(cumCost / cumLeads) : 0
    };
}

function createDeckTexture(isLight) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = isLight ? '#eef2f6' : '#0b100e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle architectural grid
    ctx.strokeStyle = isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(0, 255, 65, 0.08)';
    ctx.lineWidth = 1;
    const cols = 12;
    const padX = 68;
    const usableW = canvas.width - padX * 2;
    const stepX = usableW / (cols - 1);

    for (let i = 0; i < cols; i++) {
        const x = padX + i * stepX;
        ctx.beginPath();
        ctx.moveTo(x, 36);
        ctx.lineTo(x, canvas.height - 56);
        ctx.stroke();

        // Month labels near front lip
        ctx.fillStyle = isLight ? '#0f172a' : '#a1a1aa';
        ctx.font = '700 20px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(MONTHS[i], x, canvas.height - 20);
    }

    // Horizontal track lines for the 3 data rows
    const rowY = [130, 265, 385];
    const rowLabels = ['TRAFIC SEO', 'LEADS ASSURLEAD', 'BASE ACTUELLE'];
    const rowColors = isLight
        ? ['rgba(2, 132, 199, 0.35)', 'rgba(4, 120, 87, 0.45)', 'rgba(100, 116, 139, 0.25)']
        : ['rgba(56, 189, 248, 0.28)', 'rgba(0, 255, 65, 0.38)', 'rgba(161, 161, 170, 0.18)'];

    rowY.forEach((y, idx) => {
        ctx.strokeStyle = rowColors[idx];
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padX - 18, y);
        ctx.lineTo(canvas.width - padX + 18, y);
        ctx.stroke();

        ctx.fillStyle = isLight ? '#334155' : '#94a3b8';
        ctx.font = '700 13px "Inter", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(rowLabels[idx], 16, y - 10);
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

export function initRoi3DSimulator() {
    const mountEl = document.getElementById('roi3d-canvas-mount');
    if (!mountEl) return;

    const urlParams = new URLSearchParams(window.location.search);
    const paramFormula = (urlParams.get('formule') || '').toLowerCase();
    const initialFormula = FORMULAS[paramFormula] ? paramFormula : 'growth';

    const state = {
        formula: initialFormula,
        city: 'casablanca',
        sector: 'assurance',
        dealValue: 3800,
        closingRate: 25,
        horizon: 12,
        autoRotate: true,
        selectedMonth: 11,
        hoveredMonth: -1,
        replayBoost: 1
    };

    let simData = computeSeries(state);

    // DOM References
    const kpiTrafficEl = document.getElementById('roi3d-kpi-traffic');
    const kpiLeadsEl = document.getElementById('roi3d-kpi-leads');
    const kpiRevenueEl = document.getElementById('roi3d-kpi-revenue');
    const kpiRoiEl = document.getElementById('roi3d-kpi-roi');
    const waCtaEl = document.getElementById('roi3d-wa-cta');
    const tooltipEl = document.getElementById('roi3d-tooltip');
    const monthBadgeEl = document.getElementById('roi3d-active-month-readout');

    const formulaBtns = Array.from(document.querySelectorAll('[data-roi-formula]'));
    const citySelect = document.getElementById('roi3d-city');
    const sectorSelect = document.getElementById('roi3d-sector');
    const dealSlider = document.getElementById('roi3d-deal');
    const dealValEl = document.getElementById('roi3d-deal-val');
    const closingSlider = document.getElementById('roi3d-closing');
    const closingValEl = document.getElementById('roi3d-closing-val');
    const horizonBtns = Array.from(document.querySelectorAll('[data-roi-horizon]'));
    const cameraBtns = Array.from(document.querySelectorAll('[data-roi-cam]'));
    const autoRotateBtn = document.getElementById('roi3d-autorotate-btn');
    const replayBtn = document.getElementById('roi3d-replay-btn');
    const dockEl = document.getElementById('roi3d-dock');
    const dockToggleBtn = document.getElementById('roi3d-dock-toggle');

    const updateReadouts = () => {
        simData = computeSeries(state);
        const formula = FORMULAS[state.formula];
        const mEnd = simData.mLast;

        if (kpiTrafficEl) kpiTrafficEl.textContent = `${formatInt(mEnd.traffic)} / mois`;
        if (kpiLeadsEl) kpiLeadsEl.textContent = `${formatInt(mEnd.leads)} leads / mois`;
        if (kpiRevenueEl) kpiRevenueEl.textContent = formatMAD(simData.cumRevenue);
        if (kpiRoiEl) kpiRoiEl.textContent = `${simData.roiPct >= 0 ? '+' : ''}${formatInt(simData.roiPct)} %`;

        if (dealValEl) dealValEl.textContent = formatMAD(state.dealValue);
        if (closingValEl) closingValEl.textContent = `${state.closingRate} %`;

        const inspectIdx = state.hoveredMonth >= 0 ? state.hoveredMonth : state.selectedMonth;
        const mInfo = simData.months[Math.max(0, Math.min(11, inspectIdx))];
        if (monthBadgeEl && mInfo) {
            monthBadgeEl.innerHTML =
                `<strong>${mInfo.label} · ${formula.label}</strong> &nbsp;|&nbsp; ` +
                `Trafic: <span>${formatInt(mInfo.traffic)}</span> vis/mois &nbsp;•&nbsp; ` +
                `Leads AssurLead: <span class="neon-txt">${formatInt(mInfo.leads)}</span> (vs ${mInfo.baselineLeads} sans système) &nbsp;•&nbsp; ` +
                `CA mois: <span>${formatMAD(mInfo.revenue)}</span>`;
        }

        if (waCtaEl) {
            const msg =
                `Bonjour, j'ai simulé mon ROI 3D sur AssurLeadCom :\n` +
                `• Formule : ${formula.label} (${formatMAD(formula.setupCost)})\n` +
                `• Ville : ${CITIES[state.city].label} | Secteur : ${SECTORS[state.sector].label}\n` +
                `• Projection à ${state.horizon} mois : ${formatInt(mEnd.leads)} leads/mois, CA cumulé ${formatMAD(simData.cumRevenue)} (ROI +${simData.roiPct}%)\n` +
                `Je souhaite valider ce plan d'acquisition pour mon entreprise.`;
            waCtaEl.href = `https://wa.me/212707573162?text=${encodeURIComponent(msg)}`;
        }
    };

    // --- THREE.JS SCENE SETUP ---
    const isSoftwareGl = detectSoftwareWebGL();
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({
            antialias: !isSoftwareGl,
            powerPreference: 'high-performance',
            alpha: false
        });
    } catch (_) {
        mountEl.innerHTML = '<div class="roi3d-fallback-msg">Votre navigateur ne supporte pas WebGL pour la visualisation 3D.</div>';
        updateReadouts();
        return;
    }

    const width = Math.max(mountEl.clientWidth, 320);
    const height = Math.max(mountEl.clientHeight, 360);
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountEl.innerHTML = '';
    mountEl.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const isLightInit = document.body.classList.contains('theme-light');
    const bgDark = 0x070a09;
    const bgLight = 0xeff3f7;
    scene.background = new THREE.Color(isLightInit ? bgLight : bgDark);
    scene.fog = new THREE.FogExp2(isLightInit ? bgLight : bgDark, 0.032);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envRT = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(10.2, 7.6, 12.6);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.5, 0);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI / 2 - 0.06;
    controls.minDistance = 7.5;
    controls.maxDistance = 26;
    controls.autoRotate = state.autoRotate && !prefersReducedMotion && !isSoftwareGl;
    controls.autoRotateSpeed = 0.65;
    controls.update();

    // Studio Lighting (Warm key + cool hemisphere fill + emerald rim)
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x0b1510, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.35);
    keyLight.position.set(9, 15, 10);
    if (!isSoftwareGl) {
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.set(1024, 1024);
        keyLight.shadow.camera.left = -10;
        keyLight.shadow.camera.right = 10;
        keyLight.shadow.camera.top = 10;
        keyLight.shadow.camera.bottom = -10;
        keyLight.shadow.camera.near = 1;
        keyLight.shadow.camera.far = 36;
        keyLight.shadow.bias = -0.0005;
        keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00ff41, 1.25);
    rimLight.position.set(-10, 8, -9);
    scene.add(rimLight);

    // Chart Pedestal / Architectural Deck
    const deckGroup = new THREE.Group();
    scene.add(deckGroup);

    const deckWidth = 14.4;
    const deckDepth = 7.2;
    const deckGeo = new THREE.BoxGeometry(deckWidth, 0.34, deckDepth);
    const deckMat = new THREE.MeshStandardMaterial({
        color: isLightInit ? 0xdbe3ec : 0x101614,
        metalness: 0.45,
        roughness: 0.48
    });
    const deckMesh = new THREE.Mesh(deckGeo, deckMat);
    deckMesh.position.y = -0.17;
    deckMesh.receiveShadow = !isSoftwareGl;
    deckGroup.add(deckMesh);

    const trimGeo = new THREE.BoxGeometry(deckWidth + 0.14, 0.07, deckDepth + 0.14);
    const trimMat = new THREE.MeshStandardMaterial({
        color: 0x00ff41,
        emissive: 0x00ff41,
        emissiveIntensity: 0.25,
        metalness: 0.75,
        roughness: 0.22
    });
    const trimMesh = new THREE.Mesh(trimGeo, trimMat);
    trimMesh.position.y = -0.32;
    deckGroup.add(trimMesh);

    let deckTex = createDeckTexture(isLightInit);
    deckTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const plateGeo = new THREE.PlaneGeometry(deckWidth - 0.16, deckDepth - 0.16);
    const plateMat = new THREE.MeshStandardMaterial({
        map: deckTex,
        roughness: 0.58,
        metalness: 0.12,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1
    });
    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    plateMesh.rotation.x = -Math.PI / 2;
    plateMesh.position.y = 0.006;
    plateMesh.receiveShadow = !isSoftwareGl;
    deckGroup.add(plateMesh);

    // Reusable Shared Geometries & Materials
    const collarGeo = new THREE.CylinderGeometry(0.32, 0.36, 0.09, 18);
    const shaftGeo = new THREE.BoxGeometry(0.46, 1, 0.46);
    shaftGeo.translate(0, 0.5, 0); // bottom-center pivot at y = 0
    const crownGeo = new THREE.BoxGeometry(0.50, 0.07, 0.50);
    const baseGhostGeo = new THREE.BoxGeometry(0.34, 1, 0.34);
    baseGhostGeo.translate(0, 0.5, 0);
    const hitProxyGeo = new THREE.BoxGeometry(0.86, 5.8, 5.4);
    hitProxyGeo.translate(0, 2.9, 0);

    const collarMat = new THREE.MeshStandardMaterial({
        color: isLightInit ? 0x94a3b8 : 0x1e293b,
        metalness: 0.85,
        roughness: 0.28
    });
    const ghostMat = new THREE.MeshStandardMaterial({
        color: isLightInit ? 0x64748b : 0x52525b,
        metalness: 0.2,
        roughness: 0.72,
        transparent: true,
        opacity: 0.48
    });
    const hitProxyMat = new THREE.MeshBasicMaterial({ visible: false });

    const monthColumns = [];
    const hitProxies = [];

    for (let i = 0; i < 12; i++) {
        const x = -5.6 + i * (11.2 / 11);

        // 1. Back Row: Traffic Pillar (3-part composite: collar + shaft + crown)
        const trafficMat = new THREE.MeshStandardMaterial({
            color: 0x0284c7,
            emissive: 0x0369a1,
            emissiveIntensity: 0.22,
            metalness: 0.42,
            roughness: 0.26
        });
        const trafficCrownMat = new THREE.MeshStandardMaterial({
            color: 0x7dd3fc,
            emissive: 0x38bdf8,
            emissiveIntensity: 0.65,
            metalness: 0.8,
            roughness: 0.15
        });
        const trafficGroup = new THREE.Group();
        trafficGroup.position.set(x, 0.01, -1.65);

        const tCollar = new THREE.Mesh(collarGeo, collarMat);
        tCollar.position.y = 0.045;
        const tShaft = new THREE.Mesh(shaftGeo, trafficMat);
        tShaft.position.y = 0.09;
        tShaft.castShadow = !isSoftwareGl;
        const tCrown = new THREE.Mesh(crownGeo, trafficCrownMat);
        tCrown.position.y = 1.09;
        trafficGroup.add(tCollar, tShaft, tCrown);
        scene.add(trafficGroup);

        // 2. Center Row: AssurLead Qualified Leads Pillar (3-part composite)
        const leadMat = new THREE.MeshStandardMaterial({
            color: 0x059669,
            emissive: 0x00ff41,
            emissiveIntensity: 0.28,
            metalness: 0.36,
            roughness: 0.24
        });
        const leadCrownMat = new THREE.MeshStandardMaterial({
            color: 0x86efac,
            emissive: 0x00ff41,
            emissiveIntensity: 0.9,
            metalness: 0.82,
            roughness: 0.14
        });
        const leadGroup = new THREE.Group();
        leadGroup.position.set(x, 0.01, 0.15);

        const lCollar = new THREE.Mesh(collarGeo, collarMat);
        lCollar.position.y = 0.045;
        const lShaft = new THREE.Mesh(shaftGeo, leadMat);
        lShaft.position.y = 0.09;
        lShaft.castShadow = !isSoftwareGl;
        const lCrown = new THREE.Mesh(crownGeo, leadCrownMat);
        lCrown.position.y = 1.09;
        leadGroup.add(lCollar, lShaft, lCrown);
        scene.add(leadGroup);

        // 3. Front Row: Baseline Without AssurLead (Comparison Pillar)
        const ghostMesh = new THREE.Mesh(baseGhostGeo, ghostMat);
        ghostMesh.position.set(x, 0.01, 1.85);
        scene.add(ghostMesh);

        // 4. Invisible Proxy Column on Layer 1 for zero-cost raycasting
        const proxy = new THREE.Mesh(hitProxyGeo, hitProxyMat);
        proxy.position.set(x, 0, 0.1);
        proxy.layers.set(1);
        proxy.userData.monthIndex = i;
        scene.add(proxy);
        hitProxies.push(proxy);

        monthColumns.push({
            index: i,
            x,
            tShaft,
            tCrown,
            trafficMat,
            trafficCrownMat,
            lShaft,
            lCrown,
            leadMat,
            leadCrownMat,
            ghostMesh,
            curTHeight: 0.25,
            targetTHeight: 1.0,
            curLHeight: 0.2,
            targetLHeight: 0.8,
            curGHeight: 0.15,
            targetGHeight: 0.25
        });
    }

    // Spline Trajectory Tubes + Traveling Data Pulses
    const trafficTubeMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.2
    });
    const leadTubeMat = new THREE.MeshStandardMaterial({
        color: 0x00ff41,
        emissive: 0x00ff41,
        emissiveIntensity: 0.95,
        metalness: 0.5,
        roughness: 0.18
    });

    let trafficTubeMesh = null;
    let leadTubeMesh = null;
    let trafficCurve = null;
    let leadCurve = null;

    const pulseGeo = new THREE.SphereGeometry(0.11, 14, 14);
    const trafficPulse = new THREE.Mesh(pulseGeo, trafficTubeMat);
    const leadPulse = new THREE.Mesh(pulseGeo, leadTubeMat);
    scene.add(trafficPulse, leadPulse);

    const syncTargetsFromData = (replay = false) => {
        const maxTraffic = Math.max(...simData.months.map(m => m.traffic), 1200);
        const maxLeads = Math.max(...simData.months.map(m => m.leads), 40);

        monthColumns.forEach((col, i) => {
            const m = simData.months[i];
            col.targetTHeight = Math.max(0.28, (m.traffic / maxTraffic) * 4.35);
            col.targetLHeight = Math.max(0.24, (m.leads / maxLeads) * 3.85);
            col.targetGHeight = Math.max(0.14, (m.baselineLeads / maxLeads) * 3.85);

            if (replay) {
                col.curTHeight = 0.12;
                col.curLHeight = 0.10;
                col.curGHeight = 0.08;
            }
        });
    };

    const rebuildTubes = () => {
        const tPoints = monthColumns.map(col => new THREE.Vector3(col.x, col.curTHeight + 0.34, -1.65));
        const lPoints = monthColumns.map(col => new THREE.Vector3(col.x, col.curLHeight + 0.34, 0.15));

        trafficCurve = new THREE.CatmullRomCurve3(tPoints);
        leadCurve = new THREE.CatmullRomCurve3(lPoints);

        const nextTrafficGeo = new THREE.TubeGeometry(trafficCurve, 44, 0.036, 8, false);
        const nextLeadGeo = new THREE.TubeGeometry(leadCurve, 44, 0.042, 8, false);

        if (trafficTubeMesh) {
            trafficTubeMesh.geometry.dispose();
            trafficTubeMesh.geometry = nextTrafficGeo;
        } else {
            trafficTubeMesh = new THREE.Mesh(nextTrafficGeo, trafficTubeMat);
            scene.add(trafficTubeMesh);
        }

        if (leadTubeMesh) {
            leadTubeMesh.geometry.dispose();
            leadTubeMesh.geometry = nextLeadGeo;
        } else {
            leadTubeMesh = new THREE.Mesh(nextLeadGeo, leadTubeMat);
            scene.add(leadTubeMesh);
        }
    };

    syncTargetsFromData(true);
    rebuildTubes();

    // Camera Presets with Smooth Damping
    const CAMERA_PRESETS = {
        iso: { pos: new THREE.Vector3(10.2, 7.6, 12.6), target: new THREE.Vector3(0, 1.5, 0) },
        leads: { pos: new THREE.Vector3(0, 4.4, 13.8), target: new THREE.Vector3(0, 1.7, 0.1) },
        traffic: { pos: new THREE.Vector3(-12.2, 5.8, 7.5), target: new THREE.Vector3(0, 1.8, -0.5) },
        top: { pos: new THREE.Vector3(0.1, 14.5, 5.2), target: new THREE.Vector3(0, 0.5, 0) }
    };
    let activeCamPreset = null;
    controls.addEventListener('start', () => {
        activeCamPreset = null;
    });

    // Raycaster & Hover Tooltip
    const _raycaster = new THREE.Raycaster();
    _raycaster.layers.set(1);
    const _pointer = new THREE.Vector2(-9, -9);
    const _pulsePos = new THREE.Vector3();
    let lastRaycastMs = 0;

    const updateTooltip = (clientX, clientY, monthIdx) => {
        if (!tooltipEl) return;
        if (monthIdx < 0) {
            tooltipEl.classList.remove('is-visible');
            return;
        }
        const m = simData.months[monthIdx];
        const formula = FORMULAS[state.formula];
        const rect = mountEl.getBoundingClientRect();
        const relX = Math.min(Math.max(clientX - rect.left + 16, 12), Math.max(rect.width - 236, 12));
        const relY = Math.min(Math.max(clientY - rect.top - 14, 12), Math.max(rect.height - 150, 12));

        tooltipEl.style.transform = `translate3d(${relX.toFixed(0)}px, ${relY.toFixed(0)}px, 0)`;
        tooltipEl.innerHTML = `
            <div class="roi3d-tt-head"><span>${m.label} · ${formula.label}</span><span>Conv. ${m.convRatePct}%</span></div>
            <div class="roi3d-tt-row"><span>Trafic SEO / Maps</span><strong>${formatInt(m.traffic)} vis</strong></div>
            <div class="roi3d-tt-row"><span>Leads AssurLead</span><strong class="tt-neon">${formatInt(m.leads)} leads</strong></div>
            <div class="roi3d-tt-row"><span>Sans système</span><span>${m.baselineLeads} leads</span></div>
            <div class="roi3d-tt-row"><span>CA mensuel estimé</span><strong>${formatMAD(m.revenue)}</strong></div>
        `;
        tooltipEl.classList.add('is-visible');
    };

    const onPointerMove = (e) => {
        const now = performance.now();
        if (now - lastRaycastMs < 32) return;
        lastRaycastMs = now;

        const rect = renderer.domElement.getBoundingClientRect();
        _pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        _pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        _raycaster.setFromCamera(_pointer, camera);
        const hits = _raycaster.intersectObjects(hitProxies, false);

        if (hits.length > 0) {
            const idx = hits[0].object.userData.monthIndex;
            state.hoveredMonth = idx;
            renderer.domElement.style.cursor = 'pointer';
            updateTooltip(e.clientX, e.clientY, idx);
            updateReadouts();
        } else {
            if (state.hoveredMonth !== -1) {
                state.hoveredMonth = -1;
                renderer.domElement.style.cursor = 'grab';
                updateTooltip(0, 0, -1);
                updateReadouts();
            }
        }
    };

    const onPointerClick = (e) => {
        const rect = renderer.domElement.getBoundingClientRect();
        _pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        _pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        _raycaster.setFromCamera(_pointer, camera);
        const hits = _raycaster.intersectObjects(hitProxies, false);
        if (hits.length > 0) {
            state.selectedMonth = hits[0].object.userData.monthIndex;
            updateReadouts();
        }
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove, { passive: true });
    renderer.domElement.addEventListener('pointerleave', () => {
        state.hoveredMonth = -1;
        updateTooltip(0, 0, -1);
        updateReadouts();
    }, { passive: true });
    renderer.domElement.addEventListener('click', onPointerClick);

    // Sync Dark/Light Mode Theme dynamically
    const syncThemePalette = () => {
        const isLight = document.body.classList.contains('theme-light');
        const bgHex = isLight ? bgLight : bgDark;
        scene.background.setHex(bgHex);
        scene.fog.color.setHex(bgHex);
        deckMat.color.setHex(isLight ? 0xdbe3ec : 0x101614);
        collarMat.color.setHex(isLight ? 0x94a3b8 : 0x1e293b);
        ghostMat.color.setHex(isLight ? 0x64748b : 0x52525b);

        const nextTex = createDeckTexture(isLight);
        nextTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        if (deckTex) deckTex.dispose();
        deckTex = nextTex;
        plateMat.map = deckTex;
        plateMat.needsUpdate = true;
    };

    const themeObserver = new MutationObserver(() => syncThemePalette());
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // --- UI BINDINGS ---
    const setActiveFormulaUI = (fKey) => {
        formulaBtns.forEach(btn => {
            const active = btn.getAttribute('data-roi-formula') === fKey;
            btn.classList.toggle('active', active);
            btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
    };

    formulaBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const fKey = btn.getAttribute('data-roi-formula');
            if (!FORMULAS[fKey]) return;
            state.formula = fKey;
            setActiveFormulaUI(fKey);
            updateReadouts();
            syncTargetsFromData(false);
        });
    });

    if (citySelect) {
        citySelect.addEventListener('change', (e) => {
            state.city = e.target.value;
            updateReadouts();
            syncTargetsFromData(false);
        });
    }

    if (sectorSelect) {
        sectorSelect.addEventListener('change', (e) => {
            state.sector = e.target.value;
            const sec = SECTORS[state.sector];
            if (sec && dealSlider) {
                state.dealValue = sec.defaultDeal;
                dealSlider.value = String(sec.defaultDeal);
            }
            updateReadouts();
            syncTargetsFromData(false);
        });
    }

    if (dealSlider) {
        dealSlider.addEventListener('input', (e) => {
            state.dealValue = Number(e.target.value) || 3500;
            updateReadouts();
        });
    }

    if (closingSlider) {
        closingSlider.addEventListener('input', (e) => {
            state.closingRate = Number(e.target.value) || 25;
            updateReadouts();
        });
    }

    horizonBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const hVal = Number(btn.getAttribute('data-roi-horizon')) || 12;
            state.horizon = hVal;
            if (state.selectedMonth >= hVal) state.selectedMonth = hVal - 1;
            horizonBtns.forEach(b => b.classList.toggle('active', b === btn));
            updateReadouts();
            syncTargetsFromData(false);
        });
    });

    cameraBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const camKey = btn.getAttribute('data-roi-cam');
            if (!CAMERA_PRESETS[camKey]) return;
            activeCamPreset = CAMERA_PRESETS[camKey];
            cameraBtns.forEach(b => b.classList.toggle('active', b === btn));
        });
    });

    if (autoRotateBtn) {
        autoRotateBtn.addEventListener('click', () => {
            state.autoRotate = !state.autoRotate;
            controls.autoRotate = state.autoRotate && !prefersReducedMotion && !isSoftwareGl;
            autoRotateBtn.classList.toggle('active', state.autoRotate);
            autoRotateBtn.setAttribute('aria-pressed', state.autoRotate ? 'true' : 'false');
        });
    }

    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            syncTargetsFromData(true);
        });
    }

    if (dockEl && dockToggleBtn) {
        dockToggleBtn.addEventListener('click', () => {
            const collapsed = dockEl.classList.toggle('is-collapsed');
            dockToggleBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
            const lbl = dockToggleBtn.querySelector('span');
            if (lbl) lbl.textContent = collapsed ? 'Afficher les contrôles' : 'Masquer les contrôles';
        });
        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'h' && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement?.tagName || ''))) {
                dockToggleBtn.click();
            }
        });
    }

    setActiveFormulaUI(state.formula);
    updateReadouts();

    // --- ANIMATION LOOP WITH SOFTWARE-WEBGL PACING ---
    const clock = new THREE.Clock();
    let frameId = 0;
    let tubeRebuildAccumulator = 0;

    function afterDraw(cb) {
        const gl = renderer.getContext();
        if (!gl || typeof gl.fenceSync !== 'function') {
            frameId = window.setTimeout(cb, 80);
            return;
        }
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
            const st = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
            if (st === gl.UNSIGNALED) {
                frameId = window.setTimeout(poll, 5);
            } else {
                if (sync) gl.deleteSync(sync);
                frameId = window.setTimeout(cb, 80);
            }
        };
        frameId = window.setTimeout(poll, 5);
    }

    function tick() {
        if (document.hidden) {
            frameId = requestAnimationFrame(tick);
            return;
        }

        const dt = Math.min(clock.getDelta(), 0.05);
        const elapsed = clock.getElapsedTime();
        const formula = FORMULAS[state.formula] || FORMULAS.growth;
        const focusIdx = state.hoveredMonth >= 0 ? state.hoveredMonth : state.selectedMonth;

        // Smooth camera preset damping
        if (activeCamPreset) {
            camera.position.x = THREE.MathUtils.damp(camera.position.x, activeCamPreset.pos.x, 5.5, dt);
            camera.position.y = THREE.MathUtils.damp(camera.position.y, activeCamPreset.pos.y, 5.5, dt);
            camera.position.z = THREE.MathUtils.damp(camera.position.z, activeCamPreset.pos.z, 5.5, dt);
            controls.target.x = THREE.MathUtils.damp(controls.target.x, activeCamPreset.target.x, 5.5, dt);
            controls.target.y = THREE.MathUtils.damp(controls.target.y, activeCamPreset.target.y, 5.5, dt);
            controls.target.z = THREE.MathUtils.damp(controls.target.z, activeCamPreset.target.z, 5.5, dt);

            if (camera.position.distanceTo(activeCamPreset.pos) < 0.04) {
                activeCamPreset = null;
            }
        }

        controls.update();

        let needsTubeUpdate = false;
        const dampLambda = prefersReducedMotion ? 30 : 6.2;

        for (let i = 0; i < 12; i++) {
            const col = monthColumns[i];
            const isWithinHorizon = i < state.horizon;
            const isFocused = i === focusIdx;

            const prevT = col.curTHeight;
            const prevL = col.curLHeight;

            col.curTHeight = THREE.MathUtils.damp(col.curTHeight, col.targetTHeight, dampLambda, dt);
            col.curLHeight = THREE.MathUtils.damp(col.curLHeight, col.targetLHeight, dampLambda, dt);
            col.curGHeight = THREE.MathUtils.damp(col.curGHeight, col.targetGHeight, dampLambda, dt);

            if (Math.abs(col.curTHeight - prevT) > 0.004 || Math.abs(col.curLHeight - prevL) > 0.004) {
                needsTubeUpdate = true;
            }

            col.tShaft.scale.y = col.curTHeight;
            col.tCrown.position.y = col.curTHeight + 0.125;

            col.lShaft.scale.y = col.curLHeight;
            col.lCrown.position.y = col.curLHeight + 0.125;

            col.ghostMesh.scale.y = col.curGHeight;

            // Active / focused / out-of-horizon visual cue
            const pulseLift = isFocused && !prefersReducedMotion ? 1.07 + Math.sin(elapsed * 4.2) * 0.03 : 1.0;
            col.lShaft.scale.x = pulseLift;
            col.lShaft.scale.z = pulseLift;
            col.tShaft.scale.x = isFocused ? 1.06 : 1.0;
            col.tShaft.scale.z = isFocused ? 1.06 : 1.0;

            const leadEmissiveTarget = !isWithinHorizon ? 0.06 : (isFocused ? 0.85 : 0.28);
            const trafficEmissiveTarget = !isWithinHorizon ? 0.05 : (isFocused ? 0.65 : 0.22);

            col.leadMat.emissive.setHex(formula.accentHex);
            col.leadCrownMat.emissive.setHex(formula.accentHex);
            col.leadMat.emissiveIntensity = THREE.MathUtils.damp(col.leadMat.emissiveIntensity, leadEmissiveTarget, 8, dt);
            col.trafficMat.emissiveIntensity = THREE.MathUtils.damp(col.trafficMat.emissiveIntensity, trafficEmissiveTarget, 8, dt);
        }

        tubeRebuildAccumulator += dt;
        if (needsTubeUpdate && tubeRebuildAccumulator > 0.03) {
            tubeRebuildAccumulator = 0;
            rebuildTubes();
        }

        // Traveling signal pulses along the 3D trajectory curves
        if (trafficCurve && leadCurve && !prefersReducedMotion) {
            const pT = (elapsed * 0.24) % 1;
            const pL = (elapsed * 0.31 + 0.4) % 1;
            trafficCurve.getPointAt(pT, _pulsePos);
            trafficPulse.position.copy(_pulsePos);
            leadCurve.getPointAt(pL, _pulsePos);
            leadPulse.position.copy(_pulsePos);
        }

        renderer.render(scene, camera);

        if (isSoftwareGl) {
            afterDraw(tick);
        } else {
            frameId = requestAnimationFrame(tick);
        }
    }

    if (!isSoftwareGl) {
        renderer.compile(scene, camera);
    }
    tick();

    // Responsive Resize
    const onResize = () => {
        const w = Math.max(mountEl.clientWidth, 320);
        const h = Math.max(mountEl.clientHeight, 360);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mountEl);

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(frameId);
        clearTimeout(frameId);
        ro.disconnect();
        themeObserver.disconnect();
        controls.dispose();
        envRT.dispose();
        if (deckTex) deckTex.dispose();
        if (trafficTubeMesh) trafficTubeMesh.geometry.dispose();
        if (leadTubeMesh) leadTubeMesh.geometry.dispose();
        renderer.dispose();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initRoi3DSimulator();
});

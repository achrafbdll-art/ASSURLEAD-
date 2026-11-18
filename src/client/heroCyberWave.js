import * as THREE from 'three';

const _v3 = new THREE.Vector3();

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

function createGlowSpriteTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.25, 'rgba(180, 255, 140, 0.85)');
    grad.addColorStop(0.6, 'rgba(0, 255, 65, 0.25)');
    grad.addColorStop(1, 'rgba(0, 255, 65, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
}

export function initHeroCyberWave(containerOrId) {
    const container =
        typeof containerOrId === 'string'
            ? document.getElementById(containerOrId)
            : containerOrId;
    if (!container) return null;

    if (typeof THREE === 'undefined' || !isWebGLAvailable()) {
        return null;
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
        return null;
    }

    if (!renderer || !renderer.domElement) return null;

    const scene = new THREE.Scene();
    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 260);
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.55, 11.2);
    camera.lookAt(0, 0.1, 0);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);

    const waveGroup = new THREE.Group();
    scene.add(waveGroup);

    // 1. Multi-strand 3D Flowing Silk Wave Mesh (LineSegments grid along X/Z)
    const STRANDS = 24;
    const SEGMENTS = 100;
    const SPAN_X = 24;
    const SPAN_Z = 4.2;

    // Total line segments: horizontal strands + subtle cross-mesh ribs
    const horizSegCount = STRANDS * (SEGMENTS - 1);
    const crossEvery = 4;
    const crossCols = Math.floor(SEGMENTS / crossEvery);
    const crossSegCount = crossCols * (STRANDS - 1);
    const totalLineVerts = (horizSegCount + crossSegCount) * 2;

    const wavePositions = new Float32Array(totalLineVerts * 3);
    const waveColors = new Float32Array(totalLineVerts * 3);
    const waveGeo = new THREE.BufferGeometry();
    const wavePosAttr = new THREE.BufferAttribute(wavePositions, 3);
    wavePosAttr.setUsage(THREE.DynamicDrawUsage);
    const waveColAttr = new THREE.BufferAttribute(waveColors, 3);
    waveColAttr.setUsage(THREE.DynamicDrawUsage);
    waveGeo.setAttribute('position', wavePosAttr);
    waveGeo.setAttribute('color', waveColAttr);

    const waveMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.62,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const waveMesh = new THREE.LineSegments(waveGeo, waveMat);
    waveGroup.add(waveMesh);

    // Pre-computed strand grid buffer for fast wave evaluation + cross-rib indexing
    const gridX = new Float32Array(STRANDS * SEGMENTS);
    const gridY = new Float32Array(STRANDS * SEGMENTS);
    const gridZ = new Float32Array(STRANDS * SEGMENTS);
    const gridR = new Float32Array(STRANDS * SEGMENTS);
    const gridG = new Float32Array(STRANDS * SEGMENTS);
    const gridB = new Float32Array(STRANDS * SEGMENTS);

    for (let s = 0; s < STRANDS; s++) {
        const sNorm = s / (STRANDS - 1);
        const zBase = (sNorm - 0.5) * SPAN_Z;
        for (let i = 0; i < SEGMENTS; i++) {
            const idx = s * SEGMENTS + i;
            const u = i / (SEGMENTS - 1);
            gridX[idx] = (u - 0.5) * SPAN_X;
            gridZ[idx] = zBase;

            // Gradient from cool emerald-teal on left to vibrant lime/neon-green on right
            const rightBoost = Math.pow(u, 1.35);
            const coreGlow = 1.0 - Math.abs(sNorm - 0.5) * 1.45;
            const intensity = 0.24 + 0.62 * rightBoost + Math.max(0, coreGlow) * 0.25;
            gridR[idx] = (0.08 + 0.45 * rightBoost) * intensity;
            gridG[idx] = (0.72 + 0.28 * rightBoost) * intensity;
            gridB[idx] = (0.48 * (1 - rightBoost * 0.65) + 0.16 * rightBoost) * intensity;
        }
    }

    // 2. Shimmering Wave Mist Particles along ribbon flow
    const MIST_COUNT = 520;
    const mistBaseU = new Float32Array(MIST_COUNT);
    const mistBaseS = new Float32Array(MIST_COUNT);
    const mistJitterY = new Float32Array(MIST_COUNT);
    const mistJitterZ = new Float32Array(MIST_COUNT);
    const mistPositions = new Float32Array(MIST_COUNT * 3);
    const mistColors = new Float32Array(MIST_COUNT * 3);

    for (let i = 0; i < MIST_COUNT; i++) {
        // Bias particle density slightly toward the center/right rising crest
        const u = Math.pow(Math.random(), 0.72);
        mistBaseU[i] = u;
        mistBaseS[i] = Math.random();
        mistJitterY[i] = (Math.random() - 0.5) * 1.45;
        mistJitterZ[i] = (Math.random() - 0.5) * 1.6;

        const bright = 0.45 + 0.55 * u;
        mistColors[i * 3] = (0.35 + 0.55 * u) * bright;
        mistColors[i * 3 + 1] = 1.0 * bright;
        mistColors[i * 3 + 2] = (0.45 + 0.35 * (1 - u)) * bright;
    }

    const mistGeo = new THREE.BufferGeometry();
    const mistPosAttr = new THREE.BufferAttribute(mistPositions, 3);
    mistPosAttr.setUsage(THREE.DynamicDrawUsage);
    mistGeo.setAttribute('position', mistPosAttr);
    mistGeo.setAttribute('color', new THREE.BufferAttribute(mistColors, 3));

    const glowSprite = createGlowSpriteTexture();
    const mistMat = new THREE.PointsMaterial({
        size: 0.13,
        map: glowSprite,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const mistPoints = new THREE.Points(mistGeo, mistMat);
    waveGroup.add(mistPoints);

    // 3. 3D Plexus Constellation Network (glowing nodes + dynamic triangulation lines)
    const PLEXUS_NODES = 72;
    const MAX_PLEXUS_LINKS = 260;
    const plexusSeedX = new Float32Array(PLEXUS_NODES);
    const plexusSeedY = new Float32Array(PLEXUS_NODES);
    const plexusSeedZ = new Float32Array(PLEXUS_NODES);
    const plexusPhase = new Float32Array(PLEXUS_NODES);

    const nodePositions = new Float32Array(PLEXUS_NODES * 3);
    const nodeColors = new Float32Array(PLEXUS_NODES * 3);

    for (let i = 0; i < PLEXUS_NODES; i++) {
        // Focus plexus constellation more densely across center-right crest like reference
        const u = 0.2 + Math.pow(Math.random(), 0.7) * 0.82;
        plexusSeedX[i] = (u - 0.5) * SPAN_X;
        const slopeY = (u - 0.45) * 2.1;
        plexusSeedY[i] = slopeY + (Math.random() - 0.45) * 2.7;
        plexusSeedZ[i] = (Math.random() - 0.5) * 3.8;
        plexusPhase[i] = Math.random() * Math.PI * 2;

        const glow = 0.65 + Math.random() * 0.35;
        nodeColors[i * 3] = 0.62 * glow;
        nodeColors[i * 3 + 1] = 1.0 * glow;
        nodeColors[i * 3 + 2] = 0.45 * glow;
    }

    const nodeGeo = new THREE.BufferGeometry();
    const nodePosAttr = new THREE.BufferAttribute(nodePositions, 3);
    nodePosAttr.setUsage(THREE.DynamicDrawUsage);
    nodeGeo.setAttribute('position', nodePosAttr);
    nodeGeo.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));

    const nodeMat = new THREE.PointsMaterial({
        size: 0.24,
        map: glowSprite,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const plexusNodeMesh = new THREE.Points(nodeGeo, nodeMat);
    waveGroup.add(plexusNodeMesh);

    const linkPositions = new Float32Array(MAX_PLEXUS_LINKS * 2 * 3);
    const linkColors = new Float32Array(MAX_PLEXUS_LINKS * 2 * 3);
    const linkGeo = new THREE.BufferGeometry();
    const linkPosAttr = new THREE.BufferAttribute(linkPositions, 3);
    linkPosAttr.setUsage(THREE.DynamicDrawUsage);
    const linkColAttr = new THREE.BufferAttribute(linkColors, 3);
    linkColAttr.setUsage(THREE.DynamicDrawUsage);
    linkGeo.setAttribute('position', linkPosAttr);
    linkGeo.setAttribute('color', linkColAttr);

    const linkMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.48,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const plexusLinkMesh = new THREE.LineSegments(linkGeo, linkMat);
    waveGroup.add(plexusLinkMesh);

    container.innerHTML = '';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    if (!isSoftwareGl) {
        renderer.compile(scene, camera);
    }

    const hostSection = container.closest('.hero, section, header') || container.parentElement || window;
    let pointerNormX = 0;
    let pointerNormY = 0;
    let cursorWaveX = 3.0;
    let pointerActive = false;
    let elapsed = 0;
    let isInViewport = true;
    let isTabVisible = !document.hidden;
    let disposed = false;
    let loopActive = false;
    let frameId = 0;
    let lastTime = performance.now();

    const onPointerMove = (e) => {
        const rect = container.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        pointerNormX = THREE.MathUtils.clamp(((e.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
        pointerNormY = THREE.MathUtils.clamp(-((e.clientY - rect.top) / rect.height) * 2 + 1, -1, 1);
        cursorWaveX = pointerNormX * (SPAN_X * 0.48);
        pointerActive = true;
    };

    const onPointerLeave = () => {
        pointerActive = false;
    };

    hostSection.addEventListener('pointermove', onPointerMove, { passive: true });
    hostSection.addEventListener('pointerleave', onPointerLeave, { passive: true });

    function evalWaveY(x, sNorm, t) {
        // Upward diagonal sweep from left to right matching the cybernetic wave silhouette
        const u = (x + SPAN_X * 0.5) / SPAN_X;
        const diagonalLift = (u - 0.42) * 2.15;
        const primary = Math.sin(x * 0.48 - t * 1.15 + sNorm * 2.8) * (0.72 + 0.36 * u);
        const secondary = Math.cos(x * 0.85 + t * 0.82 - sNorm * 4.2) * 0.34;
        const twist = Math.sin(x * 0.26 + sNorm * 5.6 + t * 0.55) * 0.48;
        const cursorDist = x - cursorWaveX;
        const cursorBoost = pointerActive
            ? Math.exp(-cursorDist * cursorDist * 0.14) * Math.sin(t * 3.5 + sNorm * 2.2) * 0.42
            : 0;
        return diagonalLift + primary + secondary + twist + cursorBoost;
    }

    function updateSceneGeometry(t) {
        // 1. Update ribbon wave grid
        for (let s = 0; s < STRANDS; s++) {
            const sNorm = s / (STRANDS - 1);
            for (let i = 0; i < SEGMENTS; i++) {
                const idx = s * SEGMENTS + i;
                gridY[idx] = evalWaveY(gridX[idx], sNorm, t);
            }
        }

        let ptr = 0;
        // Horizontal wave strands
        for (let s = 0; s < STRANDS; s++) {
            for (let i = 0; i < SEGMENTS - 1; i++) {
                const a = s * SEGMENTS + i;
                const b = a + 1;

                wavePositions[ptr] = gridX[a];
                wavePositions[ptr + 1] = gridY[a];
                wavePositions[ptr + 2] = gridZ[a];
                wavePositions[ptr + 3] = gridX[b];
                wavePositions[ptr + 4] = gridY[b];
                wavePositions[ptr + 5] = gridZ[b];

                waveColors[ptr] = gridR[a];
                waveColors[ptr + 1] = gridG[a];
                waveColors[ptr + 2] = gridB[a];
                waveColors[ptr + 3] = gridR[b];
                waveColors[ptr + 4] = gridG[b];
                waveColors[ptr + 5] = gridB[b];
                ptr += 6;
            }
        }

        // Cross-mesh wireframe ribs
        for (let i = 0; i < SEGMENTS - (SEGMENTS % crossEvery); i += crossEvery) {
            if (Math.floor(i / crossEvery) >= crossCols) break;
            for (let s = 0; s < STRANDS - 1; s++) {
                const a = s * SEGMENTS + i;
                const b = (s + 1) * SEGMENTS + i;

                wavePositions[ptr] = gridX[a];
                wavePositions[ptr + 1] = gridY[a];
                wavePositions[ptr + 2] = gridZ[a];
                wavePositions[ptr + 3] = gridX[b];
                wavePositions[ptr + 4] = gridY[b];
                wavePositions[ptr + 5] = gridZ[b];

                waveColors[ptr] = gridR[a] * 0.45;
                waveColors[ptr + 1] = gridG[a] * 0.45;
                waveColors[ptr + 2] = gridB[a] * 0.45;
                waveColors[ptr + 3] = gridR[b] * 0.45;
                waveColors[ptr + 4] = gridG[b] * 0.45;
                waveColors[ptr + 5] = gridB[b] * 0.45;
                ptr += 6;
            }
        }
        wavePosAttr.needsUpdate = true;
        waveColAttr.needsUpdate = true;

        // 2. Update glowing mist particles flowing with the wave
        for (let i = 0; i < MIST_COUNT; i++) {
            const u = mistBaseU[i];
            const sNorm = mistBaseS[i];
            const x = (u - 0.5) * SPAN_X;
            const y = evalWaveY(x, sNorm, t) + mistJitterY[i] * (0.65 + 0.35 * Math.sin(t * 0.9 + i));
            const z = (sNorm - 0.5) * SPAN_Z + mistJitterZ[i];
            mistPositions[i * 3] = x;
            mistPositions[i * 3 + 1] = y;
            mistPositions[i * 3 + 2] = z;
        }
        mistPosAttr.needsUpdate = true;

        // 3. Update plexus constellation nodes & distance links
        for (let i = 0; i < PLEXUS_NODES; i++) {
            const ph = plexusPhase[i];
            nodePositions[i * 3] = plexusSeedX[i] + Math.sin(t * 0.55 + ph) * 0.42;
            nodePositions[i * 3 + 1] = plexusSeedY[i] + Math.cos(t * 0.65 + ph * 1.3) * 0.38;
            nodePositions[i * 3 + 2] = plexusSeedZ[i] + Math.sin(t * 0.45 + ph * 0.7) * 0.4;
        }
        nodePosAttr.needsUpdate = true;

        let linkCount = 0;
        const maxDistSq = 3.15 * 3.15;
        for (let i = 0; i < PLEXUS_NODES && linkCount < MAX_PLEXUS_LINKS; i++) {
            const ax = nodePositions[i * 3];
            const ay = nodePositions[i * 3 + 1];
            const az = nodePositions[i * 3 + 2];
            for (let j = i + 1; j < PLEXUS_NODES && linkCount < MAX_PLEXUS_LINKS; j++) {
                const bx = nodePositions[j * 3];
                const by = nodePositions[j * 3 + 1];
                const bz = nodePositions[j * 3 + 2];
                const dx = ax - bx;
                const dy = ay - by;
                const dz = az - bz;
                const d2 = dx * dx + dy * dy + dz * dz;
                if (d2 < maxDistSq) {
                    const fade = 1.0 - Math.sqrt(d2) / 3.15;
                    const o = linkCount * 6;
                    linkPositions[o] = ax;
                    linkPositions[o + 1] = ay;
                    linkPositions[o + 2] = az;
                    linkPositions[o + 3] = bx;
                    linkPositions[o + 4] = by;
                    linkPositions[o + 5] = bz;

                    const r = 0.25 * fade;
                    const g = 0.95 * fade;
                    const b = 0.42 * fade;
                    linkColors[o] = r;
                    linkColors[o + 1] = g;
                    linkColors[o + 2] = b;
                    linkColors[o + 3] = r;
                    linkColors[o + 4] = g;
                    linkColors[o + 5] = b;
                    linkCount++;
                }
            }
        }
        linkGeo.setDrawRange(0, linkCount * 2);
        linkPosAttr.needsUpdate = true;
        linkColAttr.needsUpdate = true;
    }

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

    function tick() {
        if (disposed || !isInViewport || !isTabVisible) {
            loopActive = false;
            return;
        }
        const now = performance.now();
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;

        const speed = prefersReducedMotion ? 0.3 : 0.85;
        elapsed += dt * speed;

        updateSceneGeometry(elapsed);

        const targetX = pointerActive ? pointerNormX * 0.45 : Math.sin(elapsed * 0.25) * 0.2;
        const targetY = pointerActive ? 0.55 + pointerNormY * 0.25 : 0.55;
        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 3.8, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 3.8, dt);
        _v3.set(camera.position.x * 0.3, 0.1, 0);
        camera.lookAt(_v3);

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
            { threshold: 0.02 }
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
        const newH = Math.max(container.clientHeight, 260);
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
        renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
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
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost, false);

    updateSceneGeometry(0);
    renderer.render(scene, camera);
    startLoop();

    return {
        dispose: () => {
            disposed = true;
            cancelAnimationFrame(frameId);
            clearTimeout(frameId);
            observer?.disconnect();
            resizeObserver?.disconnect();
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            hostSection.removeEventListener('pointermove', onPointerMove);
            hostSection.removeEventListener('pointerleave', onPointerLeave);
            renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
            waveGeo.dispose();
            waveMat.dispose();
            mistGeo.dispose();
            mistMat.dispose();
            nodeGeo.dispose();
            nodeMat.dispose();
            linkGeo.dispose();
            linkMat.dispose();
            glowSprite.dispose();
            renderer.dispose();
        }
    };
}

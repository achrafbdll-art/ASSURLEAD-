import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Zero-GC pre-allocated math objects
const _raycaster = new THREE.Raycaster();
const _pointer = new THREE.Vector2(0, 0);
const _groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const _hitPoint = new THREE.Vector3();
const _dummy = new THREE.Object3D();
const _color = new THREE.Color();
const _troughColor = new THREE.Color(0x0f1412);
const _crestColor = new THREE.Color(0x4f6158);
const _cursorNeonColor = new THREE.Color(0x00ff41);

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

export function initHeroViscousLiquid(containerId, fallbackFn) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    if (typeof THREE === 'undefined' || !isWebGLAvailable()) {
        if (typeof fallbackFn === 'function') fallbackFn(container);
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
        if (typeof fallbackFn === 'function') fallbackFn(container);
        return null;
    }

    if (!renderer || !renderer.domElement) {
        if (typeof fallbackFn === 'function') fallbackFn(container);
        return null;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.058);

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 320);
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 80);
    camera.position.set(0, 4.4, 7.6);
    camera.lookAt(0, -0.35, -0.8);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.28;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);

    // Studio Reflection Environment for wet viscous obsidian gloss
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRenderTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRenderTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // Lighting Rig: Dramatic back-rim for wave crest separation + interactive emerald cursor light
    const hemiLight = new THREE.HemisphereLight(0xbbf7d0, 0x050806, 0.9);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0xecfdf5, 2.7);
    rimLight.position.set(1.5, 9.5, -8.5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xa7f3d0, 1.35);
    fillLight.position.set(-7, 6.5, 5.5);
    scene.add(fillLight);

    const cursorLight = new THREE.PointLight(0x00ff41, 4.2, 9.5, 1.6);
    cursorLight.position.set(0, 1.8, 0);
    scene.add(cursorLight);

    // Viscous Liquid Bead Grid (64 x 34 = 2,176 tightly packed droplets in 1 draw call)
    const COLS = 64;
    const ROWS = 34;
    const TOTAL = COLS * ROWS;
    const SPACING_X = 0.34;
    const SPACING_Z = 0.34;
    const FIELD_W = (COLS - 1) * SPACING_X;
    const FIELD_D = (ROWS - 1) * SPACING_Z;

    const beadGeo = new THREE.SphereGeometry(0.245, 12, 9);
    const beadMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.84,
        roughness: 0.17,
        clearcoat: 1.0,
        clearcoatRoughness: 0.06
    });

    const beadMesh = new THREE.InstancedMesh(beadGeo, beadMat, TOTAL);
    beadMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    beadMesh.frustumCulled = false;

    const baseX = new Float32Array(TOTAL);
    const baseZ = new Float32Array(TOTAL);
    const waveH = new Float32Array(TOTAL);
    const waveV = new Float32Array(TOTAL);
    const rippleE = new Float32Array(TOTAL);

    for (let r = 0; r < ROWS; r++) {
        const z = (r / (ROWS - 1) - 0.5) * FIELD_D - 0.6;
        // Slight hexagonal brick offset on alternating rows for dense organic liquid packing
        const rowOffset = (r % 2) * (SPACING_X * 0.5);
        for (let c = 0; c < COLS; c++) {
            const idx = r * COLS + c;
            const x = (c / (COLS - 1) - 0.5) * FIELD_W + rowOffset;
            baseX[idx] = x;
            baseZ[idx] = z;

            _dummy.position.set(x, 0, z);
            _dummy.scale.set(1, 0.92, 1);
            _dummy.updateMatrix();
            beadMesh.setMatrixAt(idx, _dummy.matrix);
            beadMesh.setColorAt(idx, _troughColor);
        }
    }
    beadMesh.instanceMatrix.needsUpdate = true;
    if (beadMesh.instanceColor) beadMesh.instanceColor.needsUpdate = true;
    beadMesh.computeBoundingSphere();
    scene.add(beadMesh);

    container.innerHTML = '';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    if (!isSoftwareGl) {
        renderer.compile(scene, camera);
    }

    // Cursor tracking attached to parent section/hero so UI remains 100% clickable
    const hostSection = container.closest('.hero, section, header') || container.parentElement || window;
    let cursorActive = false;
    let targetWorldX = 0;
    let targetWorldZ = 0;
    let smoothWorldX = 0;
    let smoothWorldZ = 0;
    let prevWorldX = 0;
    let prevWorldZ = 0;
    let cursorSpeed = 0;
    let elapsed = 0;
    let isInViewport = true;
    let isTabVisible = !document.hidden;
    let disposed = false;
    let loopActive = false;
    let frameId = 0;
    let lastTime = performance.now();

    const projectPointer = (clientX, clientY) => {
        const rect = container.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        _pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        _pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
        _raycaster.setFromCamera(_pointer, camera);
        if (_raycaster.ray.intersectPlane(_groundPlane, _hitPoint)) {
            targetWorldX = THREE.MathUtils.clamp(_hitPoint.x, -FIELD_W * 0.55, FIELD_W * 0.55);
            targetWorldZ = THREE.MathUtils.clamp(_hitPoint.z, -FIELD_D * 0.55 - 0.6, FIELD_D * 0.55 - 0.6);
            cursorActive = true;
        }
    };

    const onPointerMove = (e) => {
        projectPointer(e.clientX, e.clientY);
    };

    const onPointerDown = (e) => {
        projectPointer(e.clientX, e.clientY);
        // Inject a tactile splash impulse on click/tap
        for (let r = 1; r < ROWS - 1; r++) {
            for (let c = 1; c < COLS - 1; c++) {
                const idx = r * COLS + c;
                const dx = baseX[idx] - targetWorldX;
                const dz = baseZ[idx] - targetWorldZ;
                const d2 = dx * dx + dz * dz;
                if (d2 < 3.6) {
                    const falloff = Math.exp(-d2 * 0.85);
                    waveV[idx] -= falloff * 3.4;
                    rippleE[idx] = Math.min(1, rippleE[idx] + falloff * 0.9);
                }
            }
        }
    };

    const onPointerLeave = () => {
        cursorActive = false;
    };

    hostSection.addEventListener('pointermove', onPointerMove, { passive: true });
    hostSection.addEventListener('pointerdown', onPointerDown, { passive: true });
    hostSection.addEventListener('pointerleave', onPointerLeave, { passive: true });

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

        const timeScale = prefersReducedMotion ? 0.35 : 1.0;
        elapsed += dt * timeScale;

        // Smooth viscous pointer follow
        if (!cursorActive) {
            // Gentle autonomous figure-8 viscous eddy when cursor is idle
            targetWorldX = Math.sin(elapsed * 0.42) * 4.5;
            targetWorldZ = Math.cos(elapsed * 0.31) * 1.8 - 0.6;
        }

        prevWorldX = smoothWorldX;
        prevWorldZ = smoothWorldZ;
        smoothWorldX = THREE.MathUtils.damp(smoothWorldX, targetWorldX, 7.5, dt);
        smoothWorldZ = THREE.MathUtils.damp(smoothWorldZ, targetWorldZ, 7.5, dt);

        const moveDist = Math.hypot(smoothWorldX - prevWorldX, smoothWorldZ - prevWorldZ);
        cursorSpeed = THREE.MathUtils.damp(cursorSpeed, Math.min(moveDist / Math.max(dt, 0.008), 18), 8.0, dt);

        cursorLight.position.x = smoothWorldX;
        cursorLight.position.z = smoothWorldZ;
        cursorLight.intensity = cursorActive ? 4.6 + Math.min(cursorSpeed * 0.35, 3.0) : 2.8;

        // Inject cursor wake into viscous fluid simulation
        const wakeStrength = cursorActive ? 1.35 + cursorSpeed * 0.38 : 0.45;
        const stepDt = Math.min(dt, 0.032);

        for (let r = 1; r < ROWS - 1; r++) {
            const rowOff = r * COLS;
            for (let c = 1; c < COLS - 1; c++) {
                const idx = rowOff + c;
                const avg =
                    (waveH[idx - 1] + waveH[idx + 1] + waveH[idx - COLS] + waveH[idx + COLS]) * 0.25;
                // Spring restoration + viscous Laplacian coupling
                const accel = (avg - waveH[idx]) * 46.0 - waveH[idx] * 5.2;
                waveV[idx] = (waveV[idx] + accel * stepDt) * 0.93;

                const dx = baseX[idx] - smoothWorldX;
                const dz = baseZ[idx] - smoothWorldZ;
                const distSq = dx * dx + dz * dz;
                if (distSq < 3.4) {
                    const influence = Math.exp(-distSq * 0.92);
                    waveV[idx] -= influence * wakeStrength * stepDt * 6.5;
                    rippleE[idx] = Math.min(1.0, rippleE[idx] + influence * (cursorActive ? 0.14 : 0.04));
                }
                rippleE[idx] *= 0.945;
            }
        }

        // Integrate height & combine with rolling viscous ocean swells
        for (let r = 0; r < ROWS; r++) {
            const rowOff = r * COLS;
            for (let c = 0; c < COLS; c++) {
                const idx = rowOff + c;
                waveH[idx] = THREE.MathUtils.clamp(waveH[idx] + waveV[idx] * stepDt, -0.85, 0.85);

                const x = baseX[idx];
                const z = baseZ[idx];
                const ambientSwell =
                    Math.sin(x * 0.42 + elapsed * 1.15) * Math.cos(z * 0.48 - elapsed * 0.85) * 0.32 +
                    Math.sin((x * 0.65 - z * 0.55) + elapsed * 1.45) * 0.17 +
                    Math.cos(x * 0.95 + z * 0.72 - elapsed * 0.95) * 0.09;

                const totalY = ambientSwell + waveH[idx];
                const stretch = 1.0 + Math.max(-0.18, totalY * 0.28);

                _dummy.position.set(x, totalY, z);
                _dummy.scale.set(1.0 + totalY * 0.08, stretch, 1.0 + totalY * 0.08);
                _dummy.updateMatrix();
                beadMesh.setMatrixAt(idx, _dummy.matrix);

                // Dark glossy obsidian troughs -> gleaming slate crests -> subtle neon cursor wake
                const crestFactor = THREE.MathUtils.clamp((totalY + 0.45) / 1.05, 0, 1);
                _color.copy(_troughColor).lerp(_crestColor, crestFactor * 0.75);
                if (rippleE[idx] > 0.01) {
                    _color.lerp(_cursorNeonColor, rippleE[idx] * (cursorActive ? 0.32 : 0.12));
                }
                beadMesh.setColorAt(idx, _color);
            }
        }

        beadMesh.instanceMatrix.needsUpdate = true;
        if (beadMesh.instanceColor) beadMesh.instanceColor.needsUpdate = true;

        renderer.render(scene, camera);
        scheduleNextFrame();
    }

    // Pause when hero scrolls out of view or tab is hidden
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
        const newH = Math.max(container.clientHeight, 320);
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
        if (typeof fallbackFn === 'function') fallbackFn(container);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost, false);

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
            hostSection.removeEventListener('pointerdown', onPointerDown);
            hostSection.removeEventListener('pointerleave', onPointerLeave);
            renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
            beadGeo.dispose();
            beadMat.dispose();
            envRenderTarget.dispose();
            renderer.dispose();
        }
    };
}

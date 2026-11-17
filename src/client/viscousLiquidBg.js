import * as THREE from 'three';

const _raycaster = new THREE.Raycaster();
const _pointer = new THREE.Vector2(0, 0);
const _groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const _hitPoint = new THREE.Vector3();
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

function init2DViscousFallback(container) {
    container.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.className = 'viscous-liquid-canvas';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return { dispose: () => {} };

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let curX = w * 0.5;
    let curY = h * 0.5;
    let smoothX = curX;
    let smoothY = curY;
    let disposed = false;
    let frameId = 0;

    const onResize = () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    };
    const onMove = (e) => {
        curX = e.clientX;
        curY = e.clientY;
    };
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });

    let t = 0;
    const render2D = () => {
        if (disposed || document.hidden) return;
        t += 0.025;
        smoothX += (curX - smoothX) * 0.12;
        smoothY += (curY - smoothY) * 0.12;

        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, w, h);

        const cols = 38;
        const rows = 24;
        const stepX = w / (cols - 1);
        const stepY = h / (rows - 1);

        for (let r = 0; r < rows; r++) {
            const offsetX = r % 2 === 0 ? 0 : stepX * 0.5;
            for (let c = 0; c < cols; c++) {
                const bx = c * stepX + offsetX;
                const by = r * stepY;
                const dx = bx - smoothX;
                const dy = by - smoothY;
                const dist = Math.hypot(dx, dy);
                const wave =
                    Math.sin(bx * 0.012 + t + Math.cos(by * 0.01 + t * 0.7)) * 0.5 +
                    Math.cos(dist * 0.028 - t * 2.2) * Math.exp(-dist * 0.0045) * 1.4;
                const rad = Math.max(4, (stepX * 0.34) * (0.85 + wave * 0.25));
                const lum = Math.min(255, Math.max(18, Math.floor(28 + wave * 28)));
                const neon = Math.exp(-dist * 0.0065);

                ctx.beginPath();
                ctx.arc(bx, by + wave * 6, rad, 0, Math.PI * 2);
                ctx.fillStyle = `rgb(${lum}, ${Math.min(255, lum + Math.floor(neon * 60))}, ${lum})`;
                ctx.fill();
            }
        }
        frameId = requestAnimationFrame(render2D);
    };

    const onVisibility = () => {
        if (!document.hidden && !disposed) {
            cancelAnimationFrame(frameId);
            frameId = requestAnimationFrame(render2D);
        }
    };
    document.addEventListener('visibilitychange', onVisibility);
    frameId = requestAnimationFrame(render2D);

    return {
        dispose: () => {
            disposed = true;
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('pointermove', onMove);
            document.removeEventListener('visibilitychange', onVisibility);
        }
    };
}

export function initViscousLiquidBg() {
    let container = document.getElementById('viscous-liquid-backdrop');
    if (!container) {
        container = document.createElement('div');
        container.id = 'viscous-liquid-backdrop';
        container.className = 'viscous-liquid-backdrop';
        container.setAttribute('aria-hidden', 'true');
        document.body.prepend(container);
    }

    if (typeof THREE === 'undefined' || !isWebGLAvailable()) {
        return init2DViscousFallback(container);
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
        return init2DViscousFallback(container);
    }

    if (!renderer || !renderer.domElement) {
        return init2DViscousFallback(container);
    }

    const width = Math.max(window.innerWidth, 320);
    const height = Math.max(window.innerHeight, 240);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(width, height);
    renderer.setClearColor(0x09090b, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 90);
    camera.position.set(0, 7.6, 10.6);
    camera.lookAt(0, -0.6, -1.6);

    // Dense hexagonal-staggered sea of 3D viscous ferrofluid beads (64 x 44 = 2,816 beads in 1 draw call)
    const cols = 64;
    const rows = 44;
    const count = cols * rows;
    const spanX = 34.0;
    const spanZ = 24.0;
    const stepX = spanX / (cols - 1);
    const stepZ = spanZ / (rows - 1);

    const beadGeo = new THREE.SphereGeometry(1, 10, 8);
    const maxRipples = 8;
    const ripples = Array.from({ length: maxRipples }, () => new THREE.Vector4(999, 999, -99, 0));

    const viscousMat = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uCursor: { value: new THREE.Vector2(999, 999) },
            uCursorDir: { value: new THREE.Vector2(0, 0) },
            uCursorSpeed: { value: 0 },
            uHoverBoost: { value: 0 },
            uMotionScale: { value: prefersReducedMotion ? 0.42 : 1.0 },
            uRipples: { value: ripples }
        },
        vertexShader: `
            uniform float uTime;
            uniform vec2 uCursor;
            uniform vec2 uCursorDir;
            uniform float uCursorSpeed;
            uniform float uHoverBoost;
            uniform float uMotionScale;
            uniform vec4 uRipples[8];

            varying vec3 vNormal;
            varying vec3 vViewPos;
            varying float vCrest;
            varying float vEnergy;
            varying float vDepth;

            void main() {
                vec3 instCenter = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
                float baseRadius = length(vec3(instanceMatrix[0][0], instanceMatrix[0][1], instanceMatrix[0][2]));

                float t = uTime * uMotionScale;
                vec2 p = instCenter.xz;

                // Multi-octave viscous ferrofluid swells
                float w1 = sin(p.x * 0.44 + t * 0.85 + cos(p.y * 0.36 + t * 0.55) * 1.45);
                float w2 = cos(p.y * 0.54 - t * 0.72 + sin(p.x * 0.38 - t * 0.48) * 1.25);
                float w3 = sin((p.x - p.y) * 0.62 + t * 1.05) * 0.45;
                float ambientH = (w1 * 0.5 + w2 * 0.44 + w3 * 0.24) * 0.85;

                // Direct viscous cursor wake & displacement depression/crest
                vec2 toCursor = p - uCursor;
                float dCur = length(toCursor);
                float cursorField = exp(-dCur * dCur * 0.16) * uHoverBoost;
                float wakeWave = cos(dCur * 2.15 - uTime * 3.6) * (0.48 + uCursorSpeed * 0.95);
                float cursorH = cursorField * wakeWave;

                // Viscous lateral drag in direction of cursor velocity
                vec2 viscousDrag = uCursorDir * (cursorField * 0.38);

                // Trailing damped viscous ring ripples
                float rippleH = 0.0;
                float rippleEnergy = 0.0;
                for (int i = 0; i < 8; i++) {
                    vec4 rp = uRipples[i];
                    float age = uTime - rp.z;
                    if (rp.w > 0.001 && age >= 0.0 && age < 4.5) {
                        float d = length(p - rp.xy);
                        float front = age * 3.35;
                        float band = exp(-pow(d - front, 2.0) * 0.42);
                        float ring = sin((d - front) * 3.5);
                        float decay = exp(-age * 1.15) * rp.w;
                        rippleH += band * ring * decay * 1.18;
                        rippleEnergy += band * decay;
                    }
                }

                float totalH = ambientH + cursorH + rippleH;
                float energy = clamp(cursorField * (0.55 + uCursorSpeed * 0.85) + rippleEnergy * 1.1, 0.0, 1.35);

                // Subtle bead dilation along crests & ripples
                float rScale = baseRadius * (0.94 + clamp(totalH * 0.18, -0.14, 0.28) + energy * 0.16);
                vec3 worldCenter = instCenter + vec3(viscousDrag.x, totalH, viscousDrag.y);
                vec3 displaced = worldCenter + position * rScale;

                vec4 mvPos = modelViewMatrix * vec4(displaced, 1.0);
                gl_Position = projectionMatrix * mvPos;

                vNormal = normalize(normalMatrix * normal);
                vViewPos = -mvPos.xyz;
                vCrest = clamp(totalH * 0.55 + 0.5, 0.0, 1.0);
                vEnergy = energy;
                vDepth = smoothstep(28.0, 7.5, -mvPos.z);
            }
        `,
        fragmentShader: `
            varying vec3 vNormal;
            varying vec3 vViewPos;
            varying float vCrest;
            varying float vEnergy;
            varying float vDepth;

            void main() {
                vec3 N = normalize(vNormal);
                vec3 V = normalize(vViewPos);

                // Primary studio key light + rear rim light for glossy ferrofluid bead look
                vec3 L1 = normalize(vec3(0.42, 0.85, 0.48));
                vec3 H1 = normalize(L1 + V);
                float diff1 = max(dot(N, L1), 0.0);
                float spec1 = pow(max(dot(N, H1), 0.0), 40.0);

                vec3 L2 = normalize(vec3(-0.55, 0.45, -0.7));
                vec3 H2 = normalize(L2 + V);
                float spec2 = pow(max(dot(N, H2), 0.0), 22.0);

                // Deep viscous dark obsidian/graphite base matching CodePen preview
                vec3 valleyCol = vec3(0.022, 0.025, 0.026);
                vec3 crestCol  = vec3(0.088, 0.098, 0.095);
                vec3 col = mix(valleyCol, crestCol, vCrest);

                // Diffuse shading on curved bead tops
                col += vec3(0.095, 0.105, 0.10) * pow(diff1, 1.35) * (0.45 + 0.55 * vCrest);

                // Glossy liquid specular gleam
                col += vec3(0.56, 0.62, 0.60) * spec1 * (0.35 + 0.65 * vCrest);
                col += vec3(0.18, 0.24, 0.21) * spec2 * 0.45;

                // Subtle ASSURLEAD emerald-neon sheen along cursor wake & ripples
                float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.8);
                vec3 neonTint = vec3(0.0, 1.0, 0.255);
                col += neonTint * (fresnel * (0.045 + vEnergy * 0.36) + spec1 * vEnergy * 0.42);

                // Seamless distance & deep background fade
                vec3 bgDeep = vec3(0.035, 0.035, 0.043);
                col = mix(bgDeep, col, vDepth);

                gl_FragColor = vec4(col, 1.0);
            }
        `,
        depthWrite: true,
        depthTest: true
    });

    const beadInst = new THREE.InstancedMesh(beadGeo, viscousMat, count);
    beadInst.frustumCulled = false;

    let idx = 0;
    for (let r = 0; r < rows; r++) {
        const z = -spanZ * 0.56 + r * stepZ;
        const rowShift = (r % 2) * (stepX * 0.5);
        for (let c = 0; c < cols; c++) {
            const x = -spanX * 0.5 + c * stepX + rowShift;
            const jitterR = 0.265 + (((c * 13 + r * 7) % 5) - 2) * 0.008;
            _dummy.position.set(x, 0, z);
            _dummy.rotation.set(0, 0, 0);
            _dummy.scale.setScalar(jitterR);
            _dummy.updateMatrix();
            beadInst.setMatrixAt(idx++, _dummy.matrix);
        }
    }
    beadInst.instanceMatrix.needsUpdate = true;
    scene.add(beadInst);

    container.innerHTML = '';
    renderer.domElement.className = 'viscous-liquid-canvas';
    container.appendChild(renderer.domElement);

    if (!isSoftwareGl) {
        renderer.compile(scene, camera);
    }

    // Cursor tracking & viscous ripple wake ring buffer
    let targetCurX = 0;
    let targetCurZ = 0;
    let smoothCurX = 0;
    let smoothCurZ = 0;
    let prevCurX = 0;
    let prevCurZ = 0;
    let smoothSpeed = 0;
    let smoothDirX = 0;
    let smoothDirZ = 0;
    let hoverBoost = 0;
    let targetHoverBoost = 0;
    let rippleIdx = 0;
    let lastRippleSpawn = 0;
    let elapsed = 0;
    let lastTime = performance.now();
    let frameId = 0;
    let disposed = false;
    let isTabVisible = !document.hidden;

    const projectPointerToSurface = (clientX, clientY) => {
        const w = window.innerWidth || 1;
        const h = window.innerHeight || 1;
        _pointer.x = (clientX / w) * 2 - 1;
        _pointer.y = -(clientY / h) * 2 + 1;
        _raycaster.setFromCamera(_pointer, camera);
        if (_raycaster.ray.intersectPlane(_groundPlane, _hitPoint)) {
            targetCurX = THREE.MathUtils.clamp(_hitPoint.x, -18, 18);
            targetCurZ = THREE.MathUtils.clamp(_hitPoint.z, -14, 11);
            targetHoverBoost = 1;
            return true;
        }
        return false;
    };

    const spawnRipple = (x, z, strength) => {
        ripples[rippleIdx].set(x, z, elapsed, strength);
        rippleIdx = (rippleIdx + 1) % maxRipples;
    };

    const onPointerMove = (e) => {
        if (!projectPointerToSurface(e.clientX, e.clientY)) return;
        const distMoved = Math.hypot(targetCurX - prevCurX, targetCurZ - prevCurZ);
        if (distMoved > 0.72 && elapsed - lastRippleSpawn > 0.065) {
            spawnRipple(targetCurX, targetCurZ, Math.min(1.0, 0.38 + distMoved * 0.25));
            lastRippleSpawn = elapsed;
        }
    };

    const onPointerDown = (e) => {
        if (projectPointerToSurface(e.clientX, e.clientY)) {
            spawnRipple(targetCurX, targetCurZ, 1.35);
        }
    };

    const onPointerLeave = () => {
        targetHoverBoost = 0;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave, { passive: true });

    const onResize = () => {
        if (disposed) return;
        const w = Math.max(window.innerWidth, 320);
        const h = Math.max(window.innerHeight, 240);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.75));
    };
    window.addEventListener('resize', onResize, { passive: true });

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
        if (disposed || !isTabVisible) return;
        if (isSoftwareGl) {
            afterDraw(tick);
        } else {
            frameId = requestAnimationFrame(tick);
        }
    }

    function tick() {
        if (disposed || !isTabVisible) return;
        const now = performance.now();
        const delta = Math.min((now - lastTime) / 1000, 0.08);
        lastTime = now;
        elapsed += delta;

        // Viscous spring-damped cursor follow (high viscosity = smooth, Syrupy lag)
        smoothCurX = THREE.MathUtils.damp(smoothCurX, targetCurX, 6.2, delta);
        smoothCurZ = THREE.MathUtils.damp(smoothCurZ, targetCurZ, 6.2, delta);

        const vx = (smoothCurX - prevCurX) / Math.max(delta, 0.008);
        const vz = (smoothCurZ - prevCurZ) / Math.max(delta, 0.008);
        prevCurX = smoothCurX;
        prevCurZ = smoothCurZ;

        const instSpeed = Math.min(Math.hypot(vx, vz) * 0.09, 1.2);
        smoothSpeed = THREE.MathUtils.damp(smoothSpeed, instSpeed, 4.5, delta);
        smoothDirX = THREE.MathUtils.damp(smoothDirX, THREE.MathUtils.clamp(vx * 0.06, -1, 1), 5.0, delta);
        smoothDirZ = THREE.MathUtils.damp(smoothDirZ, THREE.MathUtils.clamp(vz * 0.06, -1, 1), 5.0, delta);
        hoverBoost = THREE.MathUtils.damp(hoverBoost, targetHoverBoost, 3.2, delta);

        viscousMat.uniforms.uTime.value = elapsed;
        viscousMat.uniforms.uCursor.value.set(smoothCurX, smoothCurZ);
        viscousMat.uniforms.uCursorDir.value.set(smoothDirX, smoothDirZ);
        viscousMat.uniforms.uCursorSpeed.value = smoothSpeed;
        viscousMat.uniforms.uHoverBoost.value = hoverBoost;

        renderer.render(scene, camera);
        scheduleNextFrame();
    }

    const onVisibilityChange = () => {
        isTabVisible = !document.hidden;
        if (isTabVisible && !disposed) {
            lastTime = performance.now();
            scheduleNextFrame();
        } else {
            cancelAnimationFrame(frameId);
            clearTimeout(frameId);
        }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const onContextLost = (e) => {
        e.preventDefault();
        disposed = true;
        cancelAnimationFrame(frameId);
        clearTimeout(frameId);
        init2DViscousFallback(container);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost, false);

    renderer.render(scene, camera);
    scheduleNextFrame();

    return {
        dispose: () => {
            disposed = true;
            cancelAnimationFrame(frameId);
            clearTimeout(frameId);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('mouseleave', onPointerLeave);
            window.removeEventListener('resize', onResize);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
            beadGeo.dispose();
            viscousMat.dispose();
            renderer.dispose();
        }
    };
}

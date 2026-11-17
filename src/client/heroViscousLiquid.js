import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Zero-GC pre-allocated math objects
const _raycaster = new THREE.Raycaster();
const _pointer = new THREE.Vector2(0, 0);
const _groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const _hitPoint = new THREE.Vector3();
const _dummy = new THREE.Object3D();
const _color = new THREE.Color();
const _troughColor = new THREE.Color(0x161c19);
const _crestColor = new THREE.Color(0x52665c);
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

/**
 * Generates a crisp 2048x2048 (6x6 = 36 square tiles) procedural vector atlas
 * of major international brands & ASSURLEAD partner agencies inside the 3D bubbles.
 */
function createBrandAtlasTexture(maxAnisotropy) {
    const size = 2048;
    const cols = 6;
    const rows = 6;
    const tile = size / cols;
    const baseTile = 410;
    const tileScale = tile / baseTile;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, size, size);

    const drawLabel = (cx, y, text, color = '#f8fafc', fontSize = 40, maxWidth = 220) => {
        ctx.fillStyle = color;
        ctx.font = `800 ${fontSize}px Inter, system-ui, -apple-system, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, cx, y, maxWidth);
    };

    const drawTileBase = (cx, cy, accent = 'rgba(0, 255, 65, 0.25)') => {
        const grad = ctx.createRadialGradient(cx, cy - 30, 14, cx, cy, baseTile * 0.45);
        grad.addColorStop(0, 'rgba(30, 44, 38, 0.92)');
        grad.addColorStop(0.75, 'rgba(12, 18, 15, 0.96)');
        grad.addColorStop(1, 'rgba(6, 9, 8, 1)');
        ctx.fillStyle = grad;
        ctx.fillRect(cx - baseTile * 0.5, cy - baseTile * 0.5, baseTile, baseTile);

        ctx.strokeStyle = accent;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, baseTile * 0.4, 0, Math.PI * 2);
        ctx.stroke();
    };

    const brands = [
        // 0: Google
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(66, 133, 244, 0.45)');
            const r = 68;
            const y = cy - 28;
            ctx.lineWidth = 24;
            ctx.lineCap = 'butt';
            ctx.strokeStyle = '#EA4335';
            ctx.beginPath();
            ctx.arc(cx, y, r, -Math.PI * 0.78, -Math.PI * 0.16);
            ctx.stroke();
            ctx.strokeStyle = '#FBBC05';
            ctx.beginPath();
            ctx.arc(cx, y, r, Math.PI * 0.78, -Math.PI * 0.78);
            ctx.stroke();
            ctx.strokeStyle = '#34A853';
            ctx.beginPath();
            ctx.arc(cx, y, r, Math.PI * 0.16, Math.PI * 0.78);
            ctx.stroke();
            ctx.strokeStyle = '#4285F4';
            ctx.beginPath();
            ctx.arc(cx, y, r, -0.04, Math.PI * 0.2);
            ctx.stroke();
            ctx.fillStyle = '#4285F4';
            ctx.fillRect(cx - 4, y - 12, r + 14, 24);
            drawLabel(cx, cy + 92, 'Google', '#ffffff', 42);
        },
        // 1: Meta
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(0, 129, 251, 0.5)');
            const y = cy - 28;
            ctx.strokeStyle = '#0081FB';
            ctx.lineWidth = 19;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(cx - 22, y);
            ctx.bezierCurveTo(cx - 58, y - 62, cx - 102, y + 60, cx - 54, y + 48);
            ctx.bezierCurveTo(cx - 18, y + 40, cx + 18, y - 40, cx + 54, y - 48);
            ctx.bezierCurveTo(cx + 102, y - 60, cx + 58, y + 62, cx + 22, y);
            ctx.bezierCurveTo(cx + 2, y - 34, cx - 2, y + 34, cx - 22, y);
            ctx.stroke();
            drawLabel(cx, cy + 92, 'Meta', '#e0f2fe', 42);
        },
        // 2: Apple
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(226, 232, 240, 0.45)');
            const y = cy - 22;
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.moveTo(cx, y - 42);
            ctx.bezierCurveTo(cx + 38, y - 66, cx + 74, y - 24, cx + 58, y + 26);
            ctx.bezierCurveTo(cx + 46, y + 64, cx + 18, y + 72, cx, y + 58);
            ctx.bezierCurveTo(cx - 18, y + 72, cx - 46, y + 64, cx - 58, y + 26);
            ctx.bezierCurveTo(cx - 74, y - 24, cx - 38, y - 66, cx, y - 42);
            ctx.fill();
            // Bite cutout
            ctx.fillStyle = '#111815';
            ctx.beginPath();
            ctx.arc(cx + 62, y - 6, 26, 0, Math.PI * 2);
            ctx.fill();
            // Leaf
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.ellipse(cx + 12, y - 66, 18, 9, -0.75, 0, Math.PI * 2);
            ctx.fill();
            drawLabel(cx, cy + 94, 'Apple', '#ffffff', 42);
        },
        // 3: Microsoft
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(0, 164, 239, 0.45)');
            const s = 54;
            const g = 10;
            const y = cy - 30;
            ctx.fillStyle = '#F25022';
            ctx.fillRect(cx - s - g * 0.5, y - s - g * 0.5, s, s);
            ctx.fillStyle = '#7FBA00';
            ctx.fillRect(cx + g * 0.5, y - s - g * 0.5, s, s);
            ctx.fillStyle = '#00A4EF';
            ctx.fillRect(cx - s - g * 0.5, y + g * 0.5, s, s);
            ctx.fillStyle = '#FFB900';
            ctx.fillRect(cx + g * 0.5, y + g * 0.5, s, s);
            drawLabel(cx, cy + 92, 'Microsoft', '#ffffff', 38);
        },
        // 4: OpenAI
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(16, 185, 129, 0.5)');
            const y = cy - 28;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 10;
            for (let k = 0; k < 6; k++) {
                const a = (k * Math.PI) / 3;
                const px = cx + Math.cos(a) * 28;
                const py = y + Math.sin(a) * 28;
                ctx.beginPath();
                ctx.arc(px, py, 36, a - 0.5, a + Math.PI * 0.95);
                ctx.stroke();
            }
            drawLabel(cx, cy + 92, 'OpenAI', '#d1fae5', 42);
        },
        // 5: NVIDIA
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(118, 185, 0, 0.55)');
            const y = cy - 28;
            ctx.fillStyle = '#76B900';
            ctx.beginPath();
            ctx.roundRect?.(cx - 72, y - 50, 144, 100, 18);
            if (!ctx.roundRect) ctx.rect(cx - 72, y - 50, 144, 100);
            ctx.fill();
            ctx.strokeStyle = '#0a120d';
            ctx.lineWidth = 11;
            ctx.beginPath();
            ctx.ellipse(cx, y, 52, 30, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = '#0a120d';
            ctx.beginPath();
            ctx.arc(cx, y, 16, 0, Math.PI * 2);
            ctx.fill();
            drawLabel(cx, cy + 92, 'NVIDIA', '#bef264', 42);
        },
        // 6: Amazon
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(255, 153, 0, 0.5)');
            drawLabel(cx, cy - 36, 'amazon', '#ffffff', 54);
            ctx.strokeStyle = '#FF9900';
            ctx.lineWidth = 12;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(cx - 70, cy + 6);
            ctx.quadraticCurveTo(cx, cy + 44, cx + 68, cy + 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(cx + 50, cy - 4);
            ctx.lineTo(cx + 72, cy + 2);
            ctx.lineTo(cx + 60, cy + 22);
            ctx.stroke();
            drawLabel(cx, cy + 92, 'AMAZON', '#fed7aa', 34);
        },
        // 7: LinkedIn
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(10, 102, 194, 0.55)');
            const y = cy - 28;
            ctx.fillStyle = '#0A66C2';
            ctx.beginPath();
            ctx.roundRect?.(cx - 60, y - 60, 120, 120, 22);
            if (!ctx.roundRect) ctx.rect(cx - 60, y - 60, 120, 120);
            ctx.fill();
            drawLabel(cx, y + 4, 'in', '#ffffff', 82);
            drawLabel(cx, cy + 92, 'LinkedIn', '#bfdbfe', 40);
        },
        // 8: AXA
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(59, 130, 246, 0.5)');
            const y = cy - 28;
            ctx.fillStyle = '#1d4ed8';
            ctx.fillRect(cx - 74, y - 54, 148, 108);
            ctx.strokeStyle = '#FF1721';
            ctx.lineWidth = 14;
            ctx.beginPath();
            ctx.moveTo(cx - 18, y + 54);
            ctx.lineTo(cx + 62, y - 54);
            ctx.stroke();
            drawLabel(cx - 8, y + 6, 'AXA', '#ffffff', 54);
            drawLabel(cx, cy + 92, 'AXA GLOBAL', '#dbeafe', 34);
        },
        // 9: Allianz
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(56, 189, 248, 0.5)');
            const y = cy - 28;
            ctx.strokeStyle = '#38BDF8';
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.arc(cx, y, 56, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = '#38BDF8';
            ctx.fillRect(cx - 28, y - 34, 13, 68);
            ctx.fillRect(cx - 6, y - 40, 13, 80);
            ctx.fillRect(cx + 16, y - 34, 13, 68);
            drawLabel(cx, cy + 92, 'Allianz', '#e0f2fe', 42);
        },
        // 10: Stripe
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(99, 91, 255, 0.55)');
            const y = cy - 28;
            ctx.fillStyle = '#635BFF';
            ctx.beginPath();
            ctx.roundRect?.(cx - 74, y - 50, 148, 100, 20);
            if (!ctx.roundRect) ctx.rect(cx - 74, y - 50, 148, 100);
            ctx.fill();
            drawLabel(cx, y + 2, 'stripe', '#ffffff', 46);
            drawLabel(cx, cy + 92, 'Stripe', '#ddd6fe', 40);
        },
        // 11: Shopify
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(150, 191, 72, 0.55)');
            const y = cy - 22;
            ctx.fillStyle = '#96BF48';
            ctx.beginPath();
            ctx.moveTo(cx - 46, y - 46);
            ctx.lineTo(cx + 46, y - 46);
            ctx.lineTo(cx + 58, y + 54);
            ctx.lineTo(cx - 58, y + 54);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#d9f99d';
            ctx.lineWidth = 9;
            ctx.beginPath();
            ctx.arc(cx, y - 46, 22, Math.PI, 0);
            ctx.stroke();
            drawLabel(cx, y + 10, 'S', '#ffffff', 62);
            drawLabel(cx, cy + 92, 'Shopify', '#ecfccb', 40);
        },
        // 12: Tesla
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(239, 68, 68, 0.5)');
            const y = cy - 26;
            ctx.strokeStyle = '#E31937';
            ctx.lineWidth = 14;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(cx - 64, y - 42);
            ctx.quadraticCurveTo(cx, y - 58, cx + 64, y - 42);
            ctx.stroke();
            ctx.fillStyle = '#E31937';
            ctx.beginPath();
            ctx.moveTo(cx - 44, y - 34);
            ctx.lineTo(cx + 44, y - 34);
            ctx.lineTo(cx + 12, y - 16);
            ctx.lineTo(cx, y + 60);
            ctx.lineTo(cx - 12, y - 16);
            ctx.closePath();
            ctx.fill();
            drawLabel(cx, cy + 92, 'TESLA', '#fecaca', 40);
        },
        // 13: X
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(255, 255, 255, 0.45)');
            const y = cy - 28;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 16;
            ctx.lineCap = 'square';
            ctx.beginPath();
            ctx.moveTo(cx - 48, y - 50);
            ctx.lineTo(cx + 48, y + 50);
            ctx.moveTo(cx + 48, y - 50);
            ctx.lineTo(cx - 48, y + 50);
            ctx.stroke();
            drawLabel(cx, cy + 92, 'X CORP', '#e2e8f0', 36);
        },
        // 14: Adobe
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(255, 0, 0, 0.5)');
            const y = cy - 28;
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(cx - 62, y - 56, 124, 112);
            ctx.fillStyle = '#111815';
            ctx.beginPath();
            ctx.moveTo(cx, y - 32);
            ctx.lineTo(cx + 38, y + 56);
            ctx.lineTo(cx - 12, y + 56);
            ctx.lineTo(cx - 22, y + 32);
            ctx.lineTo(cx - 38, y + 56);
            ctx.closePath();
            ctx.fill();
            drawLabel(cx, cy + 92, 'Adobe', '#fecaca', 42);
        },
        // 15: HubSpot
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(255, 122, 89, 0.5)');
            const y = cy - 28;
            ctx.strokeStyle = '#FF7A59';
            ctx.lineWidth = 14;
            ctx.beginPath();
            ctx.arc(cx, y, 28, 0, Math.PI * 2);
            ctx.stroke();
            const spokes = [
                [0, -56],
                [52, 26],
                [-52, 26]
            ];
            spokes.forEach(([ox, oy]) => {
                ctx.beginPath();
                ctx.moveTo(cx, y);
                ctx.lineTo(cx + ox, y + oy);
                ctx.stroke();
                ctx.fillStyle = '#FF7A59';
                ctx.beginPath();
                ctx.arc(cx + ox, y + oy, 16, 0, Math.PI * 2);
                ctx.fill();
            });
            drawLabel(cx, cy + 92, 'HubSpot', '#fed7aa', 40);
        },
        // 16: Netflix
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(229, 9, 20, 0.5)');
            const y = cy - 28;
            ctx.fillStyle = '#B91C1C';
            ctx.fillRect(cx - 42, y - 56, 24, 112);
            ctx.fillRect(cx + 18, y - 56, 24, 112);
            ctx.fillStyle = '#E50914';
            ctx.beginPath();
            ctx.moveTo(cx - 42, y - 56);
            ctx.lineTo(cx - 18, y - 56);
            ctx.lineTo(cx + 42, y + 56);
            ctx.lineTo(cx + 18, y + 56);
            ctx.closePath();
            ctx.fill();
            drawLabel(cx, cy + 92, 'NETFLIX', '#fca5a5', 38);
        },
        // 17: Spotify
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(29, 185, 84, 0.55)');
            const y = cy - 28;
            ctx.fillStyle = '#1DB954';
            ctx.beginPath();
            ctx.arc(cx, y, 60, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#09120d';
            ctx.lineWidth = 10;
            ctx.lineCap = 'round';
            for (const [oy, rad, w] of [
                [-14, 72, 0.45],
                [6, 62, 0.42],
                [24, 52, 0.36]
            ]) {
                ctx.beginPath();
                ctx.arc(cx, y + oy + rad * 0.72, rad, -Math.PI * 0.5 - w, -Math.PI * 0.5 + w);
                ctx.stroke();
            }
            drawLabel(cx, cy + 92, 'Spotify', '#bbf7d0', 42);
        },
        // 18: PayPal
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(56, 189, 248, 0.5)');
            const y = cy - 28;
            drawLabel(cx - 14, y - 8, 'P', '#0284c7', 110);
            drawLabel(cx + 14, y + 12, 'P', '#38bdf8', 110);
            drawLabel(cx, cy + 92, 'PayPal', '#bae6fd', 42);
        },
        // 19: Visa
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(59, 130, 246, 0.5)');
            const y = cy - 26;
            ctx.fillStyle = '#1e3a8a';
            ctx.beginPath();
            ctx.roundRect?.(cx - 78, y - 42, 156, 84, 16);
            if (!ctx.roundRect) ctx.rect(cx - 78, y - 42, 156, 84);
            ctx.fill();
            ctx.fillStyle = '#F59E0B';
            ctx.fillRect(cx - 78, y + 32, 156, 10);
            drawLabel(cx, y - 2, 'VISA', '#ffffff', 54);
            drawLabel(cx, cy + 92, 'VISA', '#dbeafe', 38);
        },
        // 20: Mastercard
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(245, 158, 11, 0.5)');
            const y = cy - 28;
            ctx.fillStyle = '#EB001B';
            ctx.beginPath();
            ctx.arc(cx - 28, y, 48, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(247, 158, 27, 0.9)';
            ctx.beginPath();
            ctx.arc(cx + 28, y, 48, 0, Math.PI * 2);
            ctx.fill();
            drawLabel(cx, cy + 92, 'Mastercard', '#fde68a', 36);
        },
        // 21: Salesforce
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(0, 161, 224, 0.5)');
            const y = cy - 24;
            ctx.fillStyle = '#00A1E0';
            ctx.beginPath();
            ctx.arc(cx - 34, y + 4, 30, 0, Math.PI * 2);
            ctx.arc(cx - 8, y - 22, 36, 0, Math.PI * 2);
            ctx.arc(cx + 30, y - 10, 32, 0, Math.PI * 2);
            ctx.arc(cx + 42, y + 14, 24, 0, Math.PI * 2);
            ctx.fillRect(cx - 36, y + 4, 78, 30);
            ctx.fill();
            drawLabel(cx, cy + 92, 'Salesforce', '#bae6fd', 38);
        },
        // 22: YouTube
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(255, 0, 0, 0.5)');
            const y = cy - 28;
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.roundRect?.(cx - 72, y - 48, 144, 96, 26);
            if (!ctx.roundRect) ctx.rect(cx - 72, y - 48, 144, 96);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(cx - 18, y - 26);
            ctx.lineTo(cx + 30, y);
            ctx.lineTo(cx - 18, y + 26);
            ctx.closePath();
            ctx.fill();
            drawLabel(cx, cy + 92, 'YouTube', '#fecaca', 40);
        },
        // 23: TikTok
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(37, 244, 238, 0.5)');
            const y = cy - 28;
            ctx.font = '900 118px Inter, system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#25F4EE';
            ctx.fillText('♪', cx - 6, y - 4);
            ctx.fillStyle = '#FE2C55';
            ctx.fillText('♪', cx + 6, y + 4);
            ctx.fillStyle = '#ffffff';
            ctx.fillText('♪', cx, y);
            drawLabel(cx, cy + 92, 'TikTok', '#f8fafc', 42);
        },
        // 24: IBM
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(59, 130, 246, 0.5)');
            const y = cy - 28;
            drawLabel(cx, y, 'IBM', '#60A5FA', 78);
            ctx.fillStyle = '#0c120f';
            for (let s = -36; s <= 36; s += 16) {
                ctx.fillRect(cx - 86, y + s, 172, 5);
            }
            drawLabel(cx, cy + 92, 'IBM', '#bfdbfe', 40);
        },
        // 25: Assurances El Omrani (assuranceselomrani.com)
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(37, 99, 235, 0.6)');
            const y = cy - 34;
            ctx.fillStyle = '#1e3a8a';
            ctx.beginPath();
            ctx.moveTo(cx, y - 56);
            ctx.lineTo(cx + 58, y - 34);
            ctx.lineTo(cx + 52, y + 14);
            ctx.quadraticCurveTo(cx + 38, y + 50, cx, y + 62);
            ctx.quadraticCurveTo(cx - 38, y + 50, cx - 52, y + 14);
            ctx.lineTo(cx - 58, y - 34);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#60A5FA';
            ctx.lineWidth = 5;
            ctx.stroke();
            // Signature diagonal red bar
            ctx.strokeStyle = '#EF4444';
            ctx.lineWidth = 11;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(cx - 26, y + 36);
            ctx.lineTo(cx + 36, y - 32);
            ctx.stroke();
            drawLabel(cx - 4, y + 2, 'EO', '#ffffff', 46, 100);
            drawLabel(cx, cy + 56, 'EL OMRANI', '#ffffff', 30, 172);
            drawLabel(cx, cy + 90, 'ASSURANCES', '#93c5fd', 21, 160);
        },
        // 26: Assurance Sechkili (assurancesechkili.com)
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(0, 255, 65, 0.55)');
            const y = cy - 34;
            ctx.fillStyle = '#064e3b';
            ctx.beginPath();
            ctx.moveTo(cx, y - 58);
            ctx.lineTo(cx + 56, y - 32);
            ctx.lineTo(cx + 48, y + 16);
            ctx.quadraticCurveTo(cx + 34, y + 50, cx, y + 62);
            ctx.quadraticCurveTo(cx - 34, y + 50, cx - 48, y + 16);
            ctx.lineTo(cx - 56, y - 32);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#F59E0B';
            ctx.lineWidth = 6;
            ctx.stroke();
            ctx.strokeStyle = '#00FF41';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(cx, y, 32, 0, Math.PI * 2);
            ctx.stroke();
            drawLabel(cx, y + 3, 'S', '#00FF41', 54, 90);
            drawLabel(cx, cy + 56, 'SECHKILI', '#ffffff', 32, 172);
            drawLabel(cx, cy + 90, 'ASSURANCE', '#bef264', 21, 160);
        },
        // 27: Assurances Hay Saada (assuranceshaysaada)
        (cx, cy) => {
            drawTileBase(cx, cy, 'rgba(20, 184, 166, 0.6)');
            const y = cy - 34;
            ctx.fillStyle = '#0f766e';
            ctx.beginPath();
            ctx.roundRect?.(cx - 56, y - 52, 112, 106, 26);
            if (!ctx.roundRect) ctx.rect(cx - 56, y - 52, 112, 106);
            ctx.fill();
            ctx.strokeStyle = '#FBBF24';
            ctx.lineWidth = 5;
            ctx.stroke();
            // Sunrise arch accent
            ctx.strokeStyle = '#5eead4';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(cx, y + 26, 36, Math.PI * 1.15, -Math.PI * 0.15);
            ctx.stroke();
            drawLabel(cx, y - 2, 'HS', '#ffffff', 46, 100);
            drawLabel(cx, cy + 56, 'HAY SAADA', '#ffffff', 30, 172);
            drawLabel(cx, cy + 90, 'ASSURANCES', '#5eead4', 21, 160);
        }
    ];

    for (let idx = 0; idx < brands.length && idx < cols * rows; idx++) {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const cx = col * tile + tile * 0.5;
        const cy = row * tile + tile * 0.5;
        ctx.save();
        ctx.beginPath();
        ctx.rect(col * tile, row * tile, tile, tile);
        ctx.clip();
        ctx.translate(cx, cy);
        ctx.scale(tileScale, tileScale);
        brands[idx](0, 0);
        ctx.restore();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = maxAnisotropy;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
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
    scene.fog = new THREE.FogExp2(0x09090b, 0.048);

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 320);
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 80);
    camera.position.set(0, 4.4, 7.6);
    camera.lookAt(0, -0.35, -0.8);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.32;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);

    const maxAnisotropy = Math.min(renderer.capabilities.getMaxAnisotropy?.() || 1, 8);

    // Studio Reflection Environment for wet viscous obsidian gloss
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRenderTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRenderTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // Lighting Rig: Dramatic back-rim for wave crest separation + interactive emerald cursor light
    const hemiLight = new THREE.HemisphereLight(0xdcfce7, 0x060b08, 1.05);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0xecfdf5, 2.5);
    rimLight.position.set(1.5, 9.5, -8.5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xbbf7d0, 1.45);
    fillLight.position.set(-7, 6.5, 5.5);
    scene.add(fillLight);

    const cursorLight = new THREE.PointLight(0x00ff41, 4.4, 10.5, 1.55);
    cursorLight.position.set(0, 1.8, 0);
    scene.add(cursorLight);

    // Brand Logo Texture Atlas (25 international brands inside the bubbles)
    const brandAtlasTex = createBrandAtlasTexture(maxAnisotropy);

    // Compact Viscous Liquid Bubbles (54 x 28 = 1,512 dense bubbles with crisp international logos)
    const COLS = 54;
    const ROWS = 28;
    const TOTAL = COLS * ROWS;
    const SPACING_X = 0.4;
    const SPACING_Z = 0.39;
    const FIELD_W = (COLS - 1) * SPACING_X;
    const FIELD_D = (ROWS - 1) * SPACING_Z;

    const beadGeo = new THREE.SphereGeometry(0.275, 16, 12);
    const tileIndices = new Float32Array(TOTAL);
    let partnerCounter = 0;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const idx = r * COLS + c;
            // Distribute all 25 international brands + highlight Assurances El Omrani (25), Sechkili (26), Hay Saada (27)
            if ((r * 5 + c * 3) % 9 === 0) {
                tileIndices[idx] = 25 + (partnerCounter % 3);
                partnerCounter++;
            } else {
                tileIndices[idx] = (r * 7 + c * 3 + ((r * c) % 5)) % 25;
            }
        }
    }
    beadGeo.setAttribute('aTileIndex', new THREE.InstancedBufferAttribute(tileIndices, 1));

    const beadMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.72,
        roughness: 0.16,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05
    });
    beadMat.customProgramCacheKey = () => 'viscous-brand-bubbles-v2';
    beadMat.onBeforeCompile = (shader) => {
        shader.uniforms.uBrandAtlas = { value: brandAtlasTex };

        shader.vertexShader = shader.vertexShader
            .replace(
                '#include <common>',
                `#include <common>
                attribute float aTileIndex;
                varying float vTileIndex;
                varying vec3 vObjNormal;`
            )
            .replace(
                '#include <begin_vertex>',
                `#include <begin_vertex>
                vTileIndex = aTileIndex;
                vObjNormal = normalize(normal);`
            );

        shader.fragmentShader = shader.fragmentShader
            .replace(
                '#include <common>',
                `#include <common>
                uniform sampler2D uBrandAtlas;
                varying float vTileIndex;
                varying vec3 vObjNormal;`
            )
            .replace(
                '#include <map_fragment>',
                `#include <map_fragment>
                vec3 bFwd = normalize(vec3(0.0, 0.492, 0.870));
                vec3 bRight = vec3(1.0, 0.0, 0.0);
                vec3 bUp = normalize(cross(bFwd, bRight));
                vec3 nObj = normalize(vObjNormal);
                float bFacing = dot(nObj, bFwd);
                vec2 bCap = vec2(dot(nObj, bRight), dot(nObj, bUp));
                vec2 bUvLocal = clamp(bCap * 0.64 + 0.5, 0.03, 0.97);
                float bCol = mod(vTileIndex, 6.0);
                float bRow = floor(vTileIndex / 6.0);
                vec2 bAtlasUv = vec2((bCol + bUvLocal.x) / 6.0, (5.0 - bRow + bUvLocal.y) / 6.0);
                vec4 brandTexel = texture2D(uBrandAtlas, bAtlasUv);
                float logoMask = smoothstep(0.45, 0.34, length(bCap)) * smoothstep(0.16, 0.40, bFacing) * brandTexel.a;
                diffuseColor.rgb = mix(diffuseColor.rgb, brandTexel.rgb, logoMask * 0.92);`
            )
            .replace(
                '#include <emissivemap_fragment>',
                `#include <emissivemap_fragment>
                totalEmissiveRadiance += brandTexel.rgb * logoMask * 0.65;`
            );
    };

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
        // Hexagonal brick offset on alternating rows for dense liquid bubble packing
        const rowOffset = (r % 2) * (SPACING_X * 0.5);
        for (let c = 0; c < COLS; c++) {
            const idx = r * COLS + c;
            const x = (c / (COLS - 1) - 0.5) * FIELD_W + rowOffset;
            baseX[idx] = x;
            baseZ[idx] = z;

            _dummy.position.set(x, 0, z);
            _dummy.scale.set(1, 0.94, 1);
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
        for (let r = 1; r < ROWS - 1; r++) {
            for (let c = 1; c < COLS - 1; c++) {
                const idx = r * COLS + c;
                const dx = baseX[idx] - targetWorldX;
                const dz = baseZ[idx] - targetWorldZ;
                const d2 = dx * dx + dz * dz;
                if (d2 < 4.4) {
                    const falloff = Math.exp(-d2 * 0.68);
                    waveV[idx] -= falloff * 3.6;
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

        if (!cursorActive) {
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
        cursorLight.intensity = cursorActive ? 4.8 + Math.min(cursorSpeed * 0.35, 3.0) : 2.9;

        const wakeStrength = cursorActive ? 1.4 + cursorSpeed * 0.4 : 0.45;
        const stepDt = Math.min(dt, 0.032);

        for (let r = 1; r < ROWS - 1; r++) {
            const rowOff = r * COLS;
            for (let c = 1; c < COLS - 1; c++) {
                const idx = rowOff + c;
                const avg =
                    (waveH[idx - 1] + waveH[idx + 1] + waveH[idx - COLS] + waveH[idx + COLS]) * 0.25;
                const accel = (avg - waveH[idx]) * 44.0 - waveH[idx] * 5.0;
                waveV[idx] = (waveV[idx] + accel * stepDt) * 0.935;

                const dx = baseX[idx] - smoothWorldX;
                const dz = baseZ[idx] - smoothWorldZ;
                const distSq = dx * dx + dz * dz;
                if (distSq < 4.2) {
                    const influence = Math.exp(-distSq * 0.72);
                    waveV[idx] -= influence * wakeStrength * stepDt * 6.5;
                    rippleE[idx] = Math.min(1.0, rippleE[idx] + influence * (cursorActive ? 0.14 : 0.04));
                }
                rippleE[idx] *= 0.945;
            }
        }

        for (let r = 0; r < ROWS; r++) {
            const rowOff = r * COLS;
            for (let c = 0; c < COLS; c++) {
                const idx = rowOff + c;
                waveH[idx] = THREE.MathUtils.clamp(waveH[idx] + waveV[idx] * stepDt, -0.85, 0.85);

                const x = baseX[idx];
                const z = baseZ[idx];
                const ambientSwell =
                    Math.sin(x * 0.42 + elapsed * 1.15) * Math.cos(z * 0.48 - elapsed * 0.85) * 0.34 +
                    Math.sin((x * 0.65 - z * 0.55) + elapsed * 1.45) * 0.18 +
                    Math.cos(x * 0.95 + z * 0.72 - elapsed * 0.95) * 0.09;

                const totalY = ambientSwell + waveH[idx];
                const stretch = 1.0 + Math.max(-0.14, totalY * 0.22);

                _dummy.position.set(x, totalY, z);
                _dummy.scale.set(1.0 + totalY * 0.06, stretch, 1.0 + totalY * 0.06);
                _dummy.updateMatrix();
                beadMesh.setMatrixAt(idx, _dummy.matrix);

                const crestFactor = THREE.MathUtils.clamp((totalY + 0.45) / 1.05, 0, 1);
                _color.copy(_troughColor).lerp(_crestColor, crestFactor * 0.65);
                if (rippleE[idx] > 0.01) {
                    _color.lerp(_cursorNeonColor, rippleE[idx] * (cursorActive ? 0.28 : 0.1));
                }
                beadMesh.setColorAt(idx, _color);
            }
        }

        beadMesh.instanceMatrix.needsUpdate = true;
        if (beadMesh.instanceColor) beadMesh.instanceColor.needsUpdate = true;

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
            brandAtlasTex.dispose();
            beadGeo.dispose();
            beadMat.dispose();
            envRenderTarget.dispose();
            renderer.dispose();
        }
    };
}

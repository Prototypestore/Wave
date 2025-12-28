const canvas = document.getElementById('waves');
const ctx = canvas.getContext('2d');

let offset = 0;
let t = 0;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Layers with different bend multipliers for stronger S-motion
const layers = [
  { dark: '#241736', light: '#8a6bff', speed: 1.2, phase: Math.random() * Math.PI * 2, bendMultiplier: 2.0 }, // primary, strong S
  { dark: '#2f214a', light: '#9b7cff', speed: 1.5, phase: Math.random() * Math.PI * 2, bendMultiplier: 1.0 }, // secondary
  { dark: '#1f1538', light: '#7c63e6', speed: 1.7, phase: Math.random() * Math.PI * 2, bendMultiplier: 2.2 }, // primary, strong S
  { dark: '#3a2a5f', light: '#b08cff', speed: 1.3, phase: Math.random() * Math.PI * 2, bendMultiplier: 1.1 }, // secondary
];

function lerpColor(a, b, t) {
  const ar = parseInt(a.slice(1, 3), 16);
  const ag = parseInt(a.slice(3, 5), 16);
  const ab = parseInt(a.slice(5, 7), 16);

  const br = parseInt(b.slice(1, 3), 16);
  const bg = parseInt(b.slice(3, 5), 16);
  const bb = parseInt(b.slice(5, 7), 16);

  return `rgb(
    ${Math.round(ar + (br - ar) * t)},
    ${Math.round(ag + (bg - ag) * t)},
    ${Math.round(ab + (bb - ab) * t)}
  )`;
}

function drawWave(yBase, amp, wavelength, layer, offsetSpeed) {
  const width = canvas.width;

  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  ctx.lineTo(0, yBase);

  const count = Math.floor(width / wavelength) + 3;

  for (let i = 0; i < count; i++) {
    const x = i * wavelength - (offset * offsetSpeed % wavelength);

    // Random phase per tile for asynchronous motion
    const localPhase = layer.phase + i * 0.3;
    const bend = Math.sin(t * 0.008 * layer.speed + localPhase);

    // Outward/inward with stronger primary wave bend
    const bendX = bend > 0 ? bend * 200 * layer.bendMultiplier : bend * 120 * layer.bendMultiplier;

    // Color mapped to bend for depth illusion
    const depth = (bend + 1) / 2;
    const fill = lerpColor(layer.dark, layer.light, depth);

    const cp1x = x + wavelength * 0.25 + bendX;
    const cp1y = yBase + amp;
    const cp2x = x + wavelength * 0.75 - bendX;
    const cp2y = yBase - amp;
    const endX = x + wavelength;

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, yBase);
  }

  ctx.lineTo(width, canvas.height);
  ctx.closePath();

  // Gradient fill
  const grad = ctx.createLinearGradient(0, yBase - amp, 0, yBase + amp + 80);
  grad.addColorStop(0, lerpColor(layer.dark, layer.light, 0.5));
  grad.addColorStop(1, layer.dark);

  ctx.fillStyle = grad;
  ctx.fill();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  offset += 1.2; // slow horizontal drift
  t += 1;        // time for S-curve

  const block = 260;
  const repeats = Math.ceil(canvas.height / block) + 2;

  for (let r = 0; r < repeats; r++) {
    const y = r * block;

    drawWave(y + 90, 45, 520, layers[0], 1);
    drawWave(y + 130, 50, 500, layers[1], 1.15);
    drawWave(y + 170, 40, 540, layers[2], 0.9);
    drawWave(y + 210, 45, 530, layers[3], 1.05);
  }

  requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
resize();
animate();

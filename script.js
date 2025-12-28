const canvas = document.getElementById('waves');
const ctx = canvas.getContext('2d');

let offset = 0;
let t = 0;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

const layers = [
  { dark: '#241736', light: '#8a6bff', phase: 0 },
  { dark: '#2f214a', light: '#9b7cff', phase: Math.PI * 0.5 },
  { dark: '#1f1538', light: '#7c63e6', phase: Math.PI },
  { dark: '#3a2a5f', light: '#b08cff', phase: Math.PI * 1.5 },
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

function drawWave(yBase, amp, wavelength, layer, speedMul, bendSpeedMul) {
  const width = canvas.width;

  // Moderate S-curve motion
  const bend = Math.sin(t * 0.008 * bendSpeedMul + layer.phase);
  const bendX = bend * 140; // large, visible S-bend

  const depth = (bend + 1) / 2;
  const fill = lerpColor(layer.dark, layer.light, depth);

  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  ctx.lineTo(0, yBase);

  const count = Math.floor(width / wavelength) + 3;

  for (let i = 0; i < count; i++) {
    const x = i * wavelength - (offset * speedMul % wavelength);

    ctx.bezierCurveTo(
      x + wavelength * 0.25 + bendX,
      yBase + amp,
      x + wavelength * 0.75 - bendX,
      yBase - amp,
      x + wavelength,
      yBase
    );
  }

  ctx.lineTo(width, canvas.height);
  ctx.closePath();

  const grad = ctx.createLinearGradient(0, yBase - amp, 0, yBase + amp + 80);
  grad.addColorStop(0, fill);
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

    // Moderate bend speed for smooth S-motion
    drawWave(y + 90, 45, 520, layers[0], 1, 1.5);
    drawWave(y + 130, 50, 500, layers[1], 1.15, 1.2);
    drawWave(y + 170, 40, 540, layers[2], 0.9, 1.7);
    drawWave(y + 210, 45, 530, layers[3], 1.05, 1.4);
  }

  requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
resize();
animate();


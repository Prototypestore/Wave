const canvas = document.getElementById('waves');
const ctx = canvas.getContext('2d');

let offset = 0;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

const colors = [
  { start: '#2b1b43', end: '#6e4fb8' },
  { start: '#3a2b5e', end: '#7c5fd6' },
  { start: '#251a42', end: '#5a42a0' },
  { start: '#412f6d', end: '#9571c9' },
];

function drawWaveLayer(yBase, amplitude, wavelength, colorStart, colorEnd, shift) {
  const width = canvas.width;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  ctx.lineTo(0, yBase);

  const waveCount = Math.floor(width / wavelength) + 2;
  for (let i = 0; i < waveCount; i++) {
    const startX = i * wavelength - (shift % wavelength);
    const cp1x = startX + wavelength * 0.25;
    const cp1y = yBase + amplitude;
    const cp2x = startX + wavelength * 0.75;
    const cp2y = yBase - amplitude;
    const endX = startX + wavelength;

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, yBase);
  }

  ctx.lineTo(width, canvas.height);
  ctx.closePath();

  const gradient = ctx.createLinearGradient(0, yBase - amplitude, 0, yBase + amplitude + 40);
  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(1, colorEnd);

  ctx.fillStyle = gradient;
  ctx.fill();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  offset += 1.5;

  const waveBlockHeight = 250; // original 4-wave block height
  const repeatCount = Math.ceil(canvas.height / waveBlockHeight) + 1; // extra block for smooth looping

  for (let r = 0; r < repeatCount; r++) {
    const baseY = r * waveBlockHeight;

    // Draw the 4 waves exactly as original, vertically offset
    drawWaveLayer(baseY + 90, 45, 500, colors[0].start, colors[0].end, offset);
    drawWaveLayer(baseY + 130, 50, 480, colors[1].start, colors[1].end, offset * 1.2);
    drawWaveLayer(baseY + 170, 40, 530, colors[2].start, colors[2].end, offset * 0.9);
    drawWaveLayer(baseY + 210, 45, 520, colors[3].start, colors[3].end, offset * 1.1);
  }

  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  resize();
});

resize();
animate();

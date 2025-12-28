const canvas = document.getElementById('waves');
const ctx = canvas.getContext('2d');

// Resize canvas to full window width, fixed height 250
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = 250;
  drawWaves();
}

const colors = [
  { start: '#2b1b43', end: '#6e4fb8' },
  { start: '#3a2b5e', end: '#7c5fd6' },
  { start: '#251a42', end: '#5a42a0' },
  { start: '#412f6d', end: '#9571c9' },
];

// Use cubic Bézier curves for layered waves for smoothness and depth

function drawWaveLayer(yBase, amplitude, wavelength, colorStart, colorEnd) {
  const width = canvas.width;
  ctx.beginPath();

  // Start bottom-left
  ctx.moveTo(0, canvas.height);

  // Start wave at bottom left corner of wave line
  ctx.lineTo(0, yBase);

  // Create smooth wave with multiple bezier curves across the canvas width
  const waveCount = Math.floor(width / wavelength) + 2;

  for (let i = 0; i < waveCount; i++) {
    const startX = i * wavelength;
    const cp1x = startX + wavelength * 0.25;
    const cp1y = yBase + amplitude;
    const cp2x = startX + wavelength * 0.75;
    const cp2y = yBase - amplitude;
    const endX = startX + wavelength;

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, yBase);
  }

  // Close path down to bottom right corner
  ctx.lineTo(width, canvas.height);
  ctx.closePath();

  // Gradient fill top-to-bottom on the wave area
  const gradient = ctx.createLinearGradient(0, yBase - amplitude, 0, yBase + amplitude + 40);
  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(1, colorEnd);

  ctx.fillStyle = gradient;
  ctx.fill();
}

function drawWaves() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw layers from top (front) to bottom (back)
  drawWaveLayer(90, 45, 500, colors[0].start, colors[0].end);
  drawWaveLayer(130, 50, 480, colors[1].start, colors[1].end);
  drawWaveLayer(170, 40, 530, colors[2].start, colors[2].end);
  drawWaveLayer(210, 45, 520, colors[3].start, colors[3].end);
}

window.addEventListener('resize', resize);

resize();

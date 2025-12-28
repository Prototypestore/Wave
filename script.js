const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.9;
}
resize();
window.addEventListener('resize', resize);

// Colors
const darkColor = '#380f8a';
const lightColor = '#5e17eb';
const shimmerLight = '#ccb2ff';
const shimmerFull = '#ffffff';

// Multiple waves
const waveCount = 5; // number of overlapping waves
const animationPeriod = 8000;

const waves = [];
for (let i = 0; i < waveCount; i++) {
  const amplitude = 30 + i * 15; // different height
  const wavelength = canvas.width / (1.5 + i * 0.2);
  const cyclesPerMs = (i + 1) / animationPeriod;
  const speed = cyclesPerMs * 2 * Math.PI;
  waves.push({ amplitude, wavelength, speed, phase: 0 });
}

function getWaveHeight(x, t, wave) {
  return wave.amplitude * Math.sin((2 * Math.PI / wave.wavelength) * x + wave.phase + t * wave.speed);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function createGradient(x, y, width, height, shimmerPhase, opacity) {
  const grad = ctx.createLinearGradient(x, y, x + width, y + height);
  grad.addColorStop(0, `rgba(56,15,138,${opacity})`);
  grad.addColorStop(clamp(0.3 + shimmerPhase * 0.5, 0, 1), `rgba(94,23,235,${opacity})`);
  grad.addColorStop(clamp(0.45 + shimmerPhase * 0.5, 0, 1), `rgba(204,178,255,${opacity})`);
  grad.addColorStop(clamp(0.5 + shimmerPhase * 0.5, 0, 1), `rgba(255,255,255,${opacity})`);
  grad.addColorStop(clamp(0.55 + shimmerPhase * 0.5, 0, 1), `rgba(204,178,255,${opacity})`);
  grad.addColorStop(clamp(0.7 + shimmerPhase * 0.5, 0, 1), `rgba(94,23,235,${opacity})`);
  grad.addColorStop(1, `rgba(56,15,138,${opacity})`);
  return grad;
}

let startTime = null;
function draw(timestamp) {
  if (!startTime) startTime = timestamp;
  const elapsed = timestamp - startTime;
  const loopTime = elapsed % animationPeriod;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const shimmerPhase = (Math.sin((loopTime / animationPeriod) * 2 * Math.PI) + 1) / 2;
  const baseY = canvas.height / 2;
  const stepX = 2;

  // Draw each wave layer back-to-front
  waves.forEach((wave, index) => {
    ctx.beginPath();
    ctx.moveTo(0, baseY);

    for (let x = 0; x <= canvas.width; x += stepX) {
      const y = baseY + getWaveHeight(x, loopTime, wave);
      ctx.lineTo(x, y);
    }

    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();

    // Lower layers more transparent, front layers more visible
    const opacity = 0.2 + 0.15 * index;
    ctx.fillStyle = createGradient(0, baseY - wave.amplitude, canvas.width, wave.amplitude * 2, shimmerPhase, opacity);
    ctx.fill();
  });

  requestAnimationFrame(draw);
}

window.addEventListener('load', () => {
  resize();
  requestAnimationFrame(draw);
});

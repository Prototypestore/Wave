const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Wave configuration
const waveCount = 6;             // number of layers
const animationPeriod = 12000;   // 12 seconds for seamless loop
const baseY = canvas.height / 2;

// Initialize waves with different amplitude, wavelength, speed, phase
const waves = [];
for (let i = 0; i < waveCount; i++) {
  waves.push({
    amplitude: 30 + i * 12, 
    wavelength: canvas.width / (1.5 + i * 0.3), 
    speed: 0.02 + i * 0.004,           // horizontal diagonal speed
    verticalSpeed: 0.01 + i * 0.002,   // vertical folding speed
    phase: Math.random() * 2 * Math.PI,
    angle: Math.PI / 4 + i * 0.02,
  });
}

// Clamp helper
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Gradient function for lighter, transparent layers
function createGradient(x, y, width, height, shimmerPhase, opacity) {
  const grad = ctx.createLinearGradient(x, y, x + width, y + height);
  grad.addColorStop(0, `rgba(180,160,255,${opacity})`);
  grad.addColorStop(clamp(0.3 + shimmerPhase * 0.5, 0, 1), `rgba(210,190,255,${opacity})`);
  grad.addColorStop(clamp(0.45 + shimmerPhase * 0.5, 0, 1), `rgba(240,230,255,${opacity})`);
  grad.addColorStop(clamp(0.5 + shimmerPhase * 0.5, 0, 1), `rgba(255,255,255,${opacity})`);
  grad.addColorStop(clamp(0.55 + shimmerPhase * 0.5, 0, 1), `rgba(240,230,255,${opacity})`);
  grad.addColorStop(clamp(0.7 + shimmerPhase * 0.5, 0, 1), `rgba(210,190,255,${opacity})`);
  grad.addColorStop(1, `rgba(180,160,255,${opacity})`);
  return grad;
}

// Wave Y with diagonal folding motion
function getWaveY(x, t, wave) {
  const horizontalOffset = x + t * wave.speed * canvas.width;
  const foldOffset = Math.sin(t * wave.verticalSpeed * 2 * Math.PI + wave.phase) * wave.amplitude;
  return foldOffset + Math.sin((2 * Math.PI / wave.wavelength) * horizontalOffset + wave.phase) * wave.amplitude;
}

// Draw loop
let startTime = null;
function draw(timestamp) {
  if (!startTime) startTime = timestamp;
  const elapsed = timestamp - startTime;
  const loopTime = (elapsed % animationPeriod) / animationPeriod;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const shimmerPhase = (Math.sin(loopTime * 2 * Math.PI) + 1) / 2;

  const stepX = 2;

  waves.forEach((wave, index) => {
    ctx.beginPath();

    // Front layers move slightly faster diagonally for depth
    const dx = loopTime * canvas.width * wave.speed * (1 + index * 0.05);
    const dy = loopTime * canvas.height * wave.verticalSpeed * (1 + index * 0.02);

    ctx.moveTo(0, baseY);

    for (let x = 0; x <= canvas.width; x += stepX) {
      const y = baseY + getWaveY(x + dx, loopTime * animationPeriod, wave) + dy;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();

    // Layers: back layers more transparent, front layers more visible
    const opacity = 0.12 + 0.14 * (index + 1);

    ctx.fillStyle = createGradient(0, 0, canvas.width, canvas.height, shimmerPhase, opacity);
    ctx.fill();
  });

  requestAnimationFrame(draw);
}

// Start animation
window.addEventListener('load', () => {
  resize();
  requestAnimationFrame(draw);
});

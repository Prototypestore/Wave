constconst canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Colors
const darkColor = '#380f8a';
const lightColor = '#5e17eb';
const shimmerLight = '#ccb2ff';
const shimmerFull = '#ffffff';

// Wave settings
const waveCount = 6; // number of overlapping waves
const animationPeriod = 10000; // 10 seconds for perfect loop
const baseY = canvas.height / 2;

// Initialize waves
const waves = [];
for (let i = 0; i < waveCount; i++) {
  waves.push({
    amplitude: 40 + i * 10,
    wavelength: canvas.width / (1.5 + i * 0.3),
    speed: (0.02 + i * 0.005),  // horizontal diagonal speed
    verticalSpeed: (0.01 + i * 0.002), // vertical fold speed
    phase: Math.random() * 2 * Math.PI, // phase offset
    angle: Math.PI / 4 + i * 0.02,      // diagonal angle
  });
}

// Clamp gradient offsets
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function createGradient(x, y, width, height, shimmerPhase, opacity) {
  const grad = ctx.createLinearGradient(x, y, x + width, y + height);

  // Base wave layers (respect opacity)
  grad.addColorStop(0, `rgba(120,80,220,${opacity})`);        
  grad.addColorStop(clamp(0.3 + shimmerPhase * 0.5, 0, 1), `rgba(160,100,255,${opacity})`); 

  // Bolder shimmer layers (ignore opacity for max visibility)
  grad.addColorStop(clamp(0.45 + shimmerPhase * 0.5, 0, 1), `rgba(255,180,255,0.9)`); // shimmerLight
  grad.addColorStop(clamp(0.5 + shimmerPhase * 0.5, 0, 1), `rgba(255,255,255,1.0)`);   // shimmerFull (strongest)
  grad.addColorStop(clamp(0.55 + shimmerPhase * 0.5, 0, 1), `rgba(255,180,255,0.9)`); // shimmerLight

  // Back to base wave
  grad.addColorStop(clamp(0.7 + shimmerPhase * 0.5, 0, 1), `rgba(160,100,255,${opacity})`);
  grad.addColorStop(1, `rgba(120,80,220,${opacity})`);

  return grad;
}

// Wave height function with folding diagonal motion
function getWaveY(x, t, wave) {
  const horizontalOffset = x + t * wave.speed * canvas.width;  // diagonal movement
  const verticalOffset = Math.sin(t * wave.verticalSpeed * 2 * Math.PI + wave.phase) * wave.amplitude; // fold
  return verticalOffset + Math.sin((2 * Math.PI / wave.wavelength) * horizontalOffset + wave.phase) * wave.amplitude;
}

let startTime = null;
function draw(timestamp) {
  if (!startTime) startTime = timestamp;
  const elapsed = timestamp - startTime;
  const loopTime = (elapsed % animationPeriod) / animationPeriod; // normalized 0-1

  ctx.clearRect(0, 0, canvas.width, canvas.height);
 const shimmerPhase = (Math.sin(loopTime * 2 * Math.PI + index * 0.3) + 1) / 2;

  const stepX = 2;

  waves.forEach((wave, index) => {
    ctx.beginPath();
    ctx.moveTo(0, baseY);

    for (let x = 0; x <= canvas.width; x += stepX) {
      const y = baseY + getWaveY(x, loopTime * animationPeriod, wave) + loopTime * canvas.height * 0.05;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();

    const opacity = 0.1 + 0.15 * (index + 1); // back layers more subtle
    ctx.fillStyle = createGradient(0, 0, canvas.width, canvas.height, shimmerPhase, opacity);
    ctx.fill();
  });

  requestAnimationFrame(draw);
}

window.addEventListener('load', () => {
  resize();
  requestAnimationFrame(draw);
});

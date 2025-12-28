const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to window size (or adjust to fit)
function resize() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.9;
}
resize();
window.addEventListener('resize', resize);

// Colors from user
const darkColor = '#380f8a';
const lightColor = '#5e17eb';
const shimmerLight = '#ccb2ff';
const shimmerFull = '#ffffff';

// Wave parameters
const waveCount = 6;
const waveAmplitude = 40; // height of waves
const waveLength = canvas.width / 1.5;
const waveSpeed = 0.002; // slow movement speed

// We will use multiple sine waves summed to create a smooth surface
const waves = [];

for(let i = 0; i < waveCount; i++) {
  waves.push({
    amplitude: waveAmplitude * (0.5 + Math.random()),
    wavelength: waveLength * (0.5 + Math.random()),
    speed: waveSpeed * (0.5 + Math.random()),
    phase: Math.random() * 2 * Math.PI
  });
}

// Function to compute wave height at x, time t
function getWaveHeight(x, t) {
  let y = 0;
  for(let i = 0; i < waves.length; i++) {
    const w = waves[i];
    y += w.amplitude * Math.sin((2 * Math.PI / w.wavelength) * x + w.phase + t * w.speed * 2 * Math.PI);
  }
  return y / waves.length;
}

// Function to create a gradient fill style simulating shimmer and reflection
function createGradient(x, y, width, height, shimmerPhase) {
  const grad = ctx.createLinearGradient(x, y, x + width, y + height);

  // Gradient stops that move with shimmerPhase to simulate shimmer
  grad.addColorStop(0, darkColor);
  grad.addColorStop(0.3 + shimmerPhase * 0.5, lightColor);
  grad.addColorStop(0.45 + shimmerPhase * 0.5, shimmerLight);
  grad.addColorStop(0.5 + shimmerPhase * 0.5, shimmerFull);
  grad.addColorStop(0.55 + shimmerPhase * 0.5, shimmerLight);
  grad.addColorStop(0.7 + shimmerPhase * 0.5, lightColor);
  grad.addColorStop(1, darkColor);

  return grad;
}

// Main draw function
let time = 0;
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const shimmerPhase = (Math.sin(time * 0.001) + 1) / 2; // oscillates 0 to 1 slowly

  // Draw background smooth wavy surface with gradient shading
  const stepX = 2;
  const baseY = canvas.height / 2;

  ctx.beginPath();
  ctx.moveTo(0, baseY);

  for(let x = 0; x <= canvas.width; x += stepX) {
    const y = baseY + getWaveHeight(x, time);
    ctx.lineTo(x, y);
  }

  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();

  // Fill the waves with gradient
  const gradient = createGradient(0, baseY - waveAmplitude * 2, canvas.width, waveAmplitude * 4, shimmerPhase);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Draw a bright shimmer highlight moving across the waves
  const shimmerWidth = canvas.width / 5;
  const shimmerX = (time * 0.3) % (canvas.width + shimmerWidth) - shimmerWidth;

  const shimmerGradient = ctx.createLinearGradient(shimmerX, 0, shimmerX + shimmerWidth, 0);
  shimmerGradient.addColorStop(0, 'rgba(255,255,255,0)');
  shimmerGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
  shimmerGradient.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.fillStyle = shimmerGradient;

  ctx.beginPath();
  ctx.moveTo(0, baseY);

  for(let x = 0; x <= canvas.width; x += stepX) {
    const y = baseY + getWaveHeight(x, time);
    ctx.lineTo(x, y);
  }

  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();
  ctx.fill();

  time += 1;
  requestAnimationFrame(draw);
}

draw();

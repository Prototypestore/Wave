const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

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
const waveLengthBase = canvas.width / 1.5;

// Define a fixed animation period in milliseconds (e.g. 8000 ms = 8 seconds)
const animationPeriod = 8000;

// For perfect looping, pick wave wavelengths and speeds so phases align after animationPeriod
const waves = [];
for(let i = 0; i < waveCount; i++) {
  // Use fixed wavelengths spaced evenly
  const wavelength = waveLengthBase * (0.7 + i * 0.1);
  
  // Calculate speed so wave completes an integer number of cycles in animationPeriod
  // speed = cyclesPerMs * 2pi, so cyclesPerMs = n / animationPeriod
  // We pick n = i+1 cycles per animationPeriod for variety
  const cyclesPerMs = (i + 1) / animationPeriod;
  const speed = cyclesPerMs * 2 * Math.PI;

  // Fixed amplitude and phase (phase=0 to simplify looping)
  waves.push({
    amplitude: waveAmplitude * (0.5 + i / waveCount),
    wavelength: wavelength,
    speed: speed,
    phase: 0,
  });
}

// Compute wave height for x at time t (ms)
function getWaveHeight(x, t) {
  let y = 0;
  for(let i = 0; i < waves.length; i++) {
    const w = waves[i];
    y += w.amplitude * Math.sin((2 * Math.PI / w.wavelength) * x + w.phase + t * w.speed);
  }
  return y / waves.length;
}

function createGradient(x, y, width, height, shimmerPhase) {
  const grad = ctx.createLinearGradient(x, y, x + width, y + height);
  grad.addColorStop(0, darkColor);
  grad.addColorStop(0.3 + shimmerPhase * 0.5, lightColor);
  grad.addColorStop(0.45 + shimmerPhase * 0.5, shimmerLight);
  grad.addColorStop(0.5 + shimmerPhase * 0.5, shimmerFull);
  grad.addColorStop(0.55 + shimmerPhase * 0.5, shimmerLight);
  grad.addColorStop(0.7 + shimmerPhase * 0.5, lightColor);
  grad.addColorStop(1, darkColor);
  return grad;
}

let startTime = null;
function draw(timestamp) {
  if (!startTime) startTime = timestamp;
  const elapsed = timestamp - startTime;

  // Loop elapsed time between 0 and animationPeriod
  const loopTime = elapsed % animationPeriod;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const shimmerPhase = (Math.sin((loopTime / animationPeriod) * 2 * Math.PI) + 1) / 2;

  const stepX = 2;
  const baseY = canvas.height / 2;

  ctx.beginPath();
  ctx.moveTo(0, baseY);

  for(let x = 0; x <= canvas.width; x += stepX) {
    const y = baseY + getWaveHeight(x, loopTime);
    ctx.lineTo(x, y);
  }

  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();

  const gradient = createGradient(0, baseY - waveAmplitude * 2, canvas.width, waveAmplitude * 4, shimmerPhase);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Shimmer highlight moves exactly once per animationPeriod
  const shimmerWidth = canvas.width / 5;
  const shimmerX = (loopTime / animationPeriod) * (canvas.width + shimmerWidth) - shimmerWidth;

  const shimmerGradient = ctx.createLinearGradient(shimmerX, 0, shimmerX + shimmerWidth, 0);
  shimmerGradient.addColorStop(0, 'rgba(255,255,255,0)');
  shimmerGradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
  shimmerGradient.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.fillStyle = shimmerGradient;

  ctx.beginPath();
  ctx.moveTo(0, baseY);
  for(let x = 0; x <= canvas.width; x += stepX) {
    const y = baseY + getWaveHeight(x, loopTime);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();
  ctx.fill();

  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

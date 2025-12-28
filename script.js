const gradient = document.getElementById("waveGradient");
let pos = 0;

function animateShine() {
  pos += 0.02; // speed of shimmer
  if (pos > 100) pos = 0;

  gradient.setAttribute("y1", `${0 + pos/100}`);
  gradient.setAttribute("y2", `${1 + pos/100}`);

  requestAnimationFrame(animateShine);
}

animateShine();

const gradient = document.getElementById("shineGradient");
let pos = 0;

function animateShine() {
  pos += 0.025; // speed of shine (adjustable)
  if (pos > 100) pos = 0;

  // Wider gradient range for big waves for subtle, dimensional shimmer
  gradient.setAttribute("x1", `${pos - 80}%`);
  gradient.setAttribute("x2", `${pos + 80}%`);

  requestAnimationFrame(animateShine);
}

animateShine();

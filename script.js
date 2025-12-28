const gradient = document.getElementById("shineGradient");
let pos = 0;

function animateShine() {
  pos += 0.025; // slower shimmer for big waves
  if (pos > 100) pos = 0;

  // Wider gradient range for huge waves
  gradient.setAttribute("x1", `${pos - 80}%`);
  gradient.setAttribute("x2", `${pos + 80}%`);

  requestAnimationFrame(animateShine);
}

animateShine();

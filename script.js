const gradient = document.getElementById("shineGradient");
let pos = 0;

function animateShine() {
  pos += 0.05; // speed of shine
  if (pos > 100) pos = 0;

  gradient.setAttribute("x1", `${pos - 60}%`);
  gradient.setAttribute("x2", `${pos + 60}%`);

  requestAnimationFrame(animateShine);
}

animateShine();

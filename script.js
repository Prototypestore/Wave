 const gradient = document.getElementById("shineGradient");
  let pos = 0;

  function animateShine() {
    pos += 0.2; // speed of shine
    if (pos > 100) pos = 0;

    gradient.setAttribute("x1", `${pos - 50}%`);
    gradient.setAttribute("x2", `${pos + 50}%`);

    requestAnimationFrame(animateShine);
  }

  animateShine();

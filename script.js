// Animate shimmer in gradients for ripple effect
const gradients = ['waveGradient1', 'waveGradient2'];

gradients.forEach((id, i) => {
  const grad = document.getElementById(id);
  let offset = 0;

  function animateShimmer() {
    offset += 0.2 + i*0.1;
    if(offset > 100) offset = 0;

    for(let stop of grad.children){
      let currentOffset = parseFloat(stop.getAttribute('offset'));
      let newOffset = (currentOffset + 0.001 + i*0.0005) % 1;
      stop.setAttribute('offset', newOffset);
    }
    requestAnimationFrame(animateShimmer);
  }

  animateShimmer();
});


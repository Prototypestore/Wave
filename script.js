const gradients = ['grad1', 'grad2', 'grad3'];

gradients.forEach((id, i) => {
  const grad = document.getElementById(id);
  let offset = 0;
  function animate() {
    offset += 0.5 + i * 0.2;
    if (offset > 100) offset = 0;
    // Slightly shift stops offset for shimmer effect
    for (let stop of grad.children) {
      let currentOffset = parseFloat(stop.getAttribute('offset'));
      // Move offset slowly and wrap around
      let newOffset = (currentOffset + 0.002) % 1;
      stop.setAttribute('offset', newOffset);
    }
    requestAnimationFrame(animate);
  }
  animate();
});

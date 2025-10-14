
function playVideo() {
  const contenedor = document.querySelector('.video-container');

  if (!contenedor) {
    console.warn('video-container no encontrado');
    return;
  }

  const overlay = contenedor.querySelector('.video-overlay');
  const iframe = contenedor.querySelector('.video-iframe');

  if (!overlay || !iframe) {
    console.warn('Estructura de video incompleta');
    return;
  }

  overlay.addEventListener('click', function () {
    if (!iframe.src) {
      iframe.src = iframe.dataset.src;
    }
    contenedor.classList.add('playing');
  });
} 

playVideo();

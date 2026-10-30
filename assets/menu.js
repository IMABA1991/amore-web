// Menú lateral y barra que se esconde al bajar (solo celular)
(function () {
  var celu = window.matchMedia('(max-width: 700px)');
  var top = document.querySelector('.top');
  var btn = document.querySelector('.menu-btn');
  var panel = document.getElementById('menu-lateral');
  var velo = document.querySelector('.velo');
  if (!top || !btn || !panel || !velo) return;
  var cerrar = panel.querySelector('.cerrar');

  function abrir() {
    panel.classList.add('abierto'); velo.classList.add('abierto');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    cerrar.focus();
  }
  function cerrarMenu() {
    panel.classList.remove('abierto'); velo.classList.remove('abierto');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  btn.addEventListener('click', abrir);
  cerrar.addEventListener('click', function () { cerrarMenu(); btn.focus(); });
  velo.addEventListener('click', cerrarMenu);
  panel.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', cerrarMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarMenu(); });
  celu.addEventListener('change', function (e) { if (!e.matches) cerrarMenu(); });

  // Barra superior: se esconde al bajar y vuelve al subir
  var ultimo = window.scrollY, esperando = false;
  function revisar() {
    var y = window.scrollY;
    if (!celu.matches || panel.classList.contains('abierto')) { top.classList.remove('oculto'); }
    else if (y > ultimo + 6 && y > top.offsetHeight) { top.classList.add('oculto'); }
    else if (y < ultimo - 6 || y <= top.offsetHeight) { top.classList.remove('oculto'); }
    if (Math.abs(y - ultimo) > 6) ultimo = y;
    esperando = false;
  }
  window.addEventListener('scroll', function () {
    if (!esperando) { esperando = true; window.requestAnimationFrame(revisar); }
  }, { passive: true });
})();

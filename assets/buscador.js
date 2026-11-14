// Buscador de la página de Regalos: filtra productos por nombre y categoría
(function () {
  var input = document.getElementById('buscar');
  if (!input) return;
  var caja = input.closest('.buscador');
  var barra = input.closest('.buscador-barra');
  var borrar = caja.querySelector('.buscador-borrar');
  var estado = document.querySelector('.buscador-estado');
  var sinRes = document.getElementById('sin-resultados');
  var top = document.querySelector('.top');
  var intro = document.querySelector('.buscador-barra + section');

  // Palabras que la gente usa y no están en el nombre del producto
  var sinonimos = {
    botella: 'hoppy cantimplora', botellita: 'hoppy cantimplora', agua: 'hoppy cantimplora',
    vaso: 'chop copa', jarra: 'chop jarro', pocillo: 'taza', remera: 'remera', camiseta: 'camiseta',
    bolso: 'morral botinero rinonera bolsa', mochila: 'morral', cartera: 'morral bolsa',
    futbol: 'futbol botinero canilleras medias', pelota: 'futbol', club: 'futbol',
    bebe: 'body babero babita ajuar toallon', nene: 'nino', nena: 'nino',
    cuadro: 'portarretrato cuadro', foto: 'portarretrato', iman: 'iman', regalo: '',
    papa: 'papa', mama: 'mama', navidad: 'navidad', arbol: 'arbol'
  };

  function limpiar(t) {
    return (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ ]/g, ' ');
  }

  var secciones = [];
  document.querySelectorAll('main section[id]').forEach(function (sec) {
    var cards = sec.querySelectorAll('.card');
    if (!cards.length || !sec.querySelector('.card img')) return;
    var titulo = sec.querySelector('h2') ? sec.querySelector('h2').textContent : '';
    var items = [];
    cards.forEach(function (c) {
      var nombre = c.querySelector('span') ? c.querySelector('span').textContent : '';
      items.push({ el: c, texto: limpiar(nombre + ' ' + titulo) });
    });
    secciones.push({ el: sec, items: items });
  });

  function palabras(q) {
    return limpiar(q).split(/\s+/).filter(function (p) { return p.length > 1; });
  }
  function coincide(texto, p) {
    if (texto.indexOf(p) !== -1) return true;
    // plural simple: "tazas" encuentra "taza"
    if (p.length > 3 && p.slice(-1) === 's' && texto.indexOf(p.slice(0, -1)) !== -1) return true;
    var alt = sinonimos[p] || sinonimos[p.replace(/s$/, '')];
    if (alt) return alt.split(' ').some(function (a) { return a && texto.indexOf(a) !== -1; });
    return false;
  }

  function filtrar() {
    var q = input.value;
    var ps = palabras(q);
    borrar.hidden = !q;
    var total = 0;
    secciones.forEach(function (s) {
      var vis = 0;
      s.items.forEach(function (it) {
        var ok = !ps.length || ps.every(function (p) { return coincide(it.texto, p); });
        it.el.hidden = !ok;
        it.el.style.display = ok ? '' : 'none';
        if (ok) vis++;
      });
      s.el.hidden = vis === 0;
      total += vis;
    });
    // Mientras se busca, se oculta la presentación para ver los resultados enseguida
    if (intro) intro.style.display = ps.length ? 'none' : 'flex';
    // Si estaba más abajo, vuelve arriba para ver los resultados
    if (ps.length) {
      var y = barra.parentElement.getBoundingClientRect().top + window.scrollY;
      if (window.scrollY > y) window.scrollTo(0, y);
    }
    if (!ps.length) {
      estado.textContent = '';
      sinRes.hidden = true;
    } else {
      estado.textContent = total ? (total === 1 ? '1 producto encontrado' : total + ' productos encontrados') : '';
      sinRes.hidden = total > 0;
      if (!total) {
        sinRes.querySelector('.sin-resultados-texto').textContent = q.trim();
        sinRes.querySelector('.sin-resultados-wa').href = 'https://wa.me/5491155631332?text=' +
          encodeURIComponent('Hola! Vengo de la web. Estoy buscando: ' + q.trim() + '. ¿Lo hacen?');
      }
    }
  }

  var espera;
  input.addEventListener('input', function () { clearTimeout(espera); espera = setTimeout(filtrar, 120); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { input.blur(); }
    if (e.key === 'Escape') { input.value = ''; filtrar(); }
  });
  borrar.addEventListener('click', function () { input.value = ''; filtrar(); input.focus(); });

  // Al tocar una categoría, se limpia la búsqueda para que se vea todo
  document.querySelectorAll('nav[aria-label="Categorías"] a').forEach(function (a) {
    a.addEventListener('click', function () { if (input.value) { input.value = ''; filtrar(); } });
  });

  // En el celular la barra superior baja y sube: el buscador se acomoda debajo
  function acomodar() {
    var fija = top && getComputedStyle(top).position === 'sticky' && !top.classList.contains('oculto');
    barra.style.top = fija ? top.offsetHeight + 'px' : '0px';
  }
  if (top) new MutationObserver(acomodar).observe(top, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('resize', acomodar);
  acomodar();

  // Permite compartir una búsqueda: regalos.html?buscar=taza
  var inicial = new URLSearchParams(location.search).get('buscar');
  if (inicial) { input.value = inicial; filtrar(); }
})();

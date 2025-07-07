class SideMenu extends HTMLElement {
  //Detecta los cambios del atributo 'active'
  static get observedAttributes() {
    return ['active'];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    const prefix = this.caluclatePrefix();

    this.innerHTML = `
          <nav class="side-menu">
            <ul>
              <li><a href="${prefix}index.html" class="menu-item">Sobre mi</a></li>
              <li><a href="${prefix}pages/experiencia.html" class="menu-item">Experiencia</a></li>
              <li><a href="${prefix}pages/portafolio.html" class="menu-item">Portafolio</a></li>
              <li><a href="${prefix}pages/educacion.html" class="menu-item">Educacion</a></li>
              <li><a href="${prefix}pages/habilidades.html" class="menu-item">Habilidades</a></li>
              <li><a href="${prefix}pages/otrosProyectos.html"class="menu-item">Otros proyectos</a></li>
            </ul>
          </nav>`;

    this._updateActive();
  }

  //Calcula cuantas veces debe retroceder para llegar al root (en local y servidor). Asi puedo usar rutas """absolutas"""
  caluclatePrefix() {
    const isInPages = window.location.pathname.includes('/pages/');
    const isInProjectNotes = window.location.pathname.includes('/project-notes/');

    if (isInPages && isInProjectNotes) {
      return '../../';
    } else if (isInPages) {
      return '../';
    } else {
      return '';
    }
  }

  //Es una especie de listener por si algún js cambia el atributo 'active'
  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'active' && oldVal !== newVal) {
      this._updateActive();
    }
  }

  _updateActive() {
    // quitamos active de todas las opciones
    const options = this.querySelectorAll('a.menu-item');
    options.forEach(a => a.classList.remove('active'));

    // marcamos la que corresponde (1‑based)
    const i = parseInt(this.getAttribute('active'), 10);
    if (!isNaN(i) && i >= 0 && i <= options.length) {
      options[i - 1].classList.add('active');
    }
  }
}

customElements.define('side-menu', SideMenu);

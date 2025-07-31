class SideMenu extends HTMLElement {
  //Detecta los cambios del atributo 'active'
  static get observedAttributes() {
    return ['active'];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    const prefix = calculatePrefix();

    //Skill/habilidades esta invisible
    this.innerHTML = `
          <nav class="side-menu">
            <ul>
              <li><a href="${prefix}index.html" class="menu-item" searchText="sidemenu-1">Sobre mi</a></li>
              <li style="display:none"><a href="${prefix}pages/experiencia.html" class="menu-item" searchText="sidemenu-2">Experiencia</a></li>
              <li><a href="${prefix}pages/portafolio.html" class="menu-item" searchText="sidemenu-3">Portafolio</a></li>
              <li style="display:none"><a href="${prefix}pages/educacion.html" class="menu-item" searchText="sidemenu-4">Educacion</a></li>
              <li style="display:none"><a href="${prefix}pages/habilidades.html" class="menu-item" searchText="sidemenu-5">Habilidades</a></li>
              <li><a href="${prefix}pages/otros-proyectos.html"class="menu-item" searchText="sidemenu-6">Otros proyectos</a></li>
            </ul>
          </nav>`;

    updateActive(this);
  }



  //Es una especie de listener por si algún js cambia el atributo 'active'
  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'active' && oldVal !== newVal) {
      updateActive(this);
    }
  }
}
customElements.define('side-menu', SideMenu);




//Calcula cuantas veces debe retroceder para llegar al root (en local y servidor). Asi puedo usar rutas """absolutas"""
export function calculatePrefix() {
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

export function updateActive(elements) {
  // quitamos active de todas las opciones
  const options = elements.querySelectorAll('a.menu-item');
  options.forEach(a => a.classList.remove('active'));

  // marcamos la que corresponde (1‑based)
  const i = parseInt(elements.getAttribute('active'), 10);
  if (!isNaN(i) && i >= 0 && i <= options.length) {
    options[i - 1].classList.add('active');
  }
}



import { calculatePrefix } from './side-menu.js';
import { updateActive } from './side-menu.js';

//Se llama "main-header.js" WebComponent medio que te pide que no tenga
//el template sea de dos palabras para no cinfundirlo con un etiqueta común
class mainHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const prefix = calculatePrefix();

    this.innerHTML = `
    <div class="header-container">
      <div class="name-title">
        <h1>Diego Jiménez</h1>
        <span class="separator">|</span>
        <h2>Game Developer</h2>
      </div>
      <div class="language-selector">
        <span class="language" id="ES_text">ES</span>
        <label class="switch">
            <input type="checkbox" id="cambio-idioma">
            <span class="slider round"></span>
        </label>
        <span class="language active" id="EN_text">EN</span>
        <div class="burger-menu-icon"><i class="fa-solid fa-bars"></i>
            <nav class="burger-menu">
              <ul>
                <li><a href="${prefix}index.html" class="menu-item" searchText="sidemenu-1">Sobre mi</a></li>
                <li style="display:none"><a href="${prefix}pages/experiencia.html" class="menu-item" searchText="sidemenu-2">Experiencia</a></li>
                <li><a href="${prefix}pages/portafolio.html" class="menu-item" searchText="sidemenu-3">Portafolio</a></li>
                <li style="display:none"><a href="${prefix}pages/educacion.html" class="menu-item" searchText="sidemenu-4">Educacion</a></li>
                <li style="display:none"><a href="${prefix}pages/habilidades.html" class="menu-item" searchText="sidemenu-5">Habilidades</a></li>
                <li><a href="${prefix}pages/otros-proyectos.html"class="menu-item" searchText="sidemenu-6">Otros proyectos</a></li>
              </ul>
            </nav>
        </div>

      </div>
    </div>
    `
    //Listener para el menú hamburguesa
    const menuBurgerIcon = this.querySelector('.burger-menu-icon');
    const menuBurger = this.querySelector('.burger-menu');
    menuBurgerIcon.addEventListener('click', () => {
      menuBurger.classList.toggle('show');
    });
    updateActive(this);
  }

  //Es una especie de listener por si algún js cambia el atributo 'active'
  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'active' && oldVal !== newVal) {
      updateActive(this);
    }
  }

}

window.customElements.define('main-header', mainHeader);

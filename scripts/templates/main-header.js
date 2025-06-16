//Se llama "main-header.js" WebComponent medio que te pide que no tenga
//el template sea de dos palabras para no cinfundirlo con un etiqueta común

class mainHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
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
            </div>
    </div>
  `
  }

}


window.customElements.define('main-header', mainHeader);
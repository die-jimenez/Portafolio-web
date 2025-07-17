class mainFooter extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
    <div class="footer-container">
      <div class="info">
        <i class="fa-solid fa-square-envelope"></i>
           <a href="mailto:diegojimenez2010@gmail.com" target="_blank" searchText="mail"></a>
      </div>
      <div class="info">
        <i class="fa-brands fa-linkedin"></i>
        <a href="https://www.linkedin.com/in/die-jimenez" target="_blank" searchText="linkedin"></a>
      </div>
    </div>
  `
  }

}

window.customElements.define('main-footer', mainFooter);
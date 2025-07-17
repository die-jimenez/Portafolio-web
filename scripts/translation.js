// 1) Definimos la lista de sheets "comunes"
const COMMON_SHEETS = ['general'];

// Variable global donde guardamos todas las traducciones
const TRANSLATIONS = {};

// Calcula cuántas veces debe retroceder para llegar al root
function caluclatePrefix() {
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

// 2) Cargamos un JSON específico de una sheet
function loadJSONSheet(sheetName) {
  const prefix = caluclatePrefix();
  return fetch(`${prefix}data/translation/${sheetName}.json`)
    .then(res => {
      if (!res.ok) throw new Error(`No se encontró ${sheetName}.json`);
      return res.json();
    });
}

// 3) Convertimos el array de objetos a TRANSLATIONS[lang][key]
function addToTranslations(dataArray) {
  dataArray.forEach(item => {
    const key = item.key;
    Object.keys(item).forEach(lang => {
      if (lang === 'key') return;
      if (!TRANSLATIONS[lang]) TRANSLATIONS[lang] = {};
      TRANSLATIONS[lang][key] = item[lang];
    });
  });
}

// 4) Función para aplicar el idioma seleccionado al DOM
function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) {
    console.warn(`Idioma "${lang}" no encontrado.`);
    return;
  }

  document.querySelectorAll('[searchText]').forEach(el => {
    const key = el.getAttribute('searchText');
    const texto = TRANSLATIONS[lang][key];
    if (texto !== undefined) {
      el.innerHTML = texto;
    } else {
      console.warn(`Falta traducción para "${key}" en "${lang}"`);
    }
  });
}

// 5) Iniciamos después de cargar el DOM
document.addEventListener('DOMContentLoaded', () => {

  // Cargar las traducciones
  function loadTranslations() {
    let sheetSpecific = document.documentElement.getAttribute('searchText-sheet') ||
      document.body.getAttribute('searchText-sheet') || null;

    const toLoad = [...COMMON_SHEETS];
    if (sheetSpecific) toLoad.push(sheetSpecific);

    return Promise.all(toLoad.map(loadJSONSheet))
      .then(results => {
        results.forEach(addToTranslations);
        return true;
      });
  }

  // Configurar el cambio de idioma
  function setupLanguageSystem(currentLang) {
    const languageSwitch = document.getElementById('cambio-idioma');

    if (!languageSwitch) {
      console.error('Elemento #cambio-idioma no encontrado');
      return;
    }

    languageSwitch.checked = currentLang === 'EN';

    languageSwitch.addEventListener('change', function () {
      const newLang = this.checked ? 'EN' : 'ES';
      setLanguage(newLang);
      if (newLang === 'EN') {
        document.getElementById('EN_text')?.classList.add("active");
        document.getElementById('ES_text')?.classList.remove("active");
      } else {
        document.getElementById('ES_text')?.classList.add("active");
        document.getElementById('EN_text')?.classList.remove("active");
      }
      document.documentElement.setAttribute('lang', newLang);
      localStorage.setItem('language', newLang); // Guardar idioma
    });
  }

  // Secuencia: cargar traducciones > idioma inicial > configurar switch
  loadTranslations()
    .then(() => {
      const savedLang = localStorage.getItem('language') || 'EN';
      setLanguage(savedLang);
      document.documentElement.setAttribute('lang', savedLang);
      if (savedLang === 'EN') {
        document.getElementById('EN_text')?.classList.add("active");
        document.getElementById('ES_text')?.classList.remove("active");
      } else {
        document.getElementById('ES_text')?.classList.add("active");
        document.getElementById('EN_text')?.classList.remove("active");
      }
      setupLanguageSystem(savedLang);
    })
    .catch(err => {
      console.error('Error cargando traducciones:', err);
    });
});

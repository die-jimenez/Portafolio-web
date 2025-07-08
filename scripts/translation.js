// 1) Definimos la lista de sheets "comunes"
const COMMON_SHEETS = ['general'];

// Variable global donde guardamos todas las traducciones
const TRANSLATIONS = {};


//Calcula cuantas veces debe retroceder para llegar al root (en local y servidor). Asi puedo usar rutas """absolutas"""
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



// 2) Cargamos un JSON específico de una sheet (ej. "homepage", "contact")
function loadJSONSheet(sheetName) {
  const prefix = caluclatePrefix();
  return fetch(`${prefix}data/translation/${sheetName}.json`)
    .then(res => {
      if (!res.ok) throw new Error(`No se encontró ${sheetName}.json`);
      return res.json();
    });
}

// 3) Pasamos de un arreglo [{key,EN,ES,..},...] a TRANSLATIONS[lang][key]
function addToTranslations(dataArray) {
  dataArray.forEach(item => {
    // item = { key: "hp_title", EN: "...", ES: "...", ... }
    const key = item.key;
    Object.keys(item).forEach(lang => {
      if (lang === 'key') return;
      if (!TRANSLATIONS[lang]) TRANSLATIONS[lang] = {};
      TRANSLATIONS[lang][key] = item[lang];
    });
  });
}



// 5) Función para aplicar el idioma 'lang' al DOM
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

document.addEventListener('DOMContentLoaded', () => {
  // 1. Cargar las traducciones primero
  function loadTranslations() {
    let sheetSpecific = document.documentElement.getAttribute('searchText-sheet') ||
      document.body.getAttribute('searchText-sheet') ||
      null;

    const toLoad = [...COMMON_SHEETS];
    if (sheetSpecific) toLoad.push(sheetSpecific);

    return Promise.all(toLoad.map(loadJSONSheet))
      .then(results => {
        results.forEach(addToTranslations);
        return true; // Indicar que las traducciones están listas
      });
  };

  // 2. Configurar el sistema de idiomas después de cargar traducciones
  function setupLanguageSystem() {
    const languageSwitch = document.getElementById('cambio-idioma');

    // Verificar si existe el elemento
    if (!languageSwitch) {
      console.error('Elemento #cambio-idioma no encontrado');
      return;
    }

    // Estado inicial basado en el atributo lang del documento
    const currentLang = "EN";
    languageSwitch.checked = currentLang === 'EN';

    // Event handler
    languageSwitch.addEventListener('change', function () {
      const newLang = this.checked ? 'EN' : 'ES';
      setLanguage(newLang);
      //toggle elimina la clase si ya la tiene, y la agrega sino la tiene
      document.getElementById('EN_text').classList.toggle("active");
      document.getElementById('ES_text').classList.toggle("active");
      document.documentElement.setAttribute('lang', newLang);
    });
  };

  // 3. Secuencia correcta: primero cargar traducciones, luego configurar switch
  loadTranslations()
    .then(() => {
      // Establecer idioma inicial
      const defaultLang = 'EN';
      setLanguage(defaultLang);
      document.documentElement.setAttribute('lang', defaultLang);

      // Ahora configurar el switch
      setupLanguageSystem();
    })
    .catch(err => {
      console.error('Error cargando traducciones:', err);
    });
});




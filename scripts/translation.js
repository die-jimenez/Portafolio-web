// 1) Definimos la lista de sheets "comunes"
const COMMON_SHEETS = ['general'];

// Variable global donde guardamos todas las traducciones
const TRANSLATIONS = {};



// 2) Cargamos un JSON específico de una sheet (ej. "homepage", "contact")
function loadJSONSheet(sheetName) {
  return fetch(`/data/translation/${sheetName}.json`)
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
      el.innerText = texto;
    } else {
      console.warn(`Falta traducción para "${key}" en "${lang}"`);
    }
  });
}

// 6) Cuando cargue el DOM:
document.addEventListener('DOMContentLoaded', () => {
  // 6.1) Leemos el atributo del <html> o <body> que nos diga la sheet específica
  //      Primero probamos en <html>, si no existe, buscamos en <body>
  let sheetSpecific = document.documentElement.getAttribute('searchText-sheet');
  if (!sheetSpecific) {
    sheetSpecific = document.body.getAttribute('searchText-sheet');
  }

  // Si no hay atributo, asumimos que sólo cargamos “general”.
  if (!sheetSpecific) {
    sheetSpecific = null; 
  }

  // 6.2) Armamos un array de promesas para cargar JSONs:
  //      Siempre cargamos “general.json” + la sheet específica (si existe).
  const toLoad = [...COMMON_SHEETS];         // ej. ['general']
  if (sheetSpecific) {
    toLoad.push(sheetSpecific);             // ej. ['general','homepage']
  }

  // 6.3) Convertimos cada nombre en una promesa fetch:
  const promises = toLoad.map(name => loadJSONSheet(name));

  // 6.4) Esperamos a que termine de cargar todo
  Promise.all(promises)
    .then(results => {
      // “results” es un array de arreglos JSON: e.g. [ dataGeneral, dataHomepage ]
      results.forEach(jsonArray => {
        addToTranslations(jsonArray);
      });

      // 6.5) Establecemos un idioma inicial (p.ej. “EN”)
      const defaultLang = 'EN';
      setLanguage(defaultLang);

      // 6.6) Si tenés un <select id="selector-idioma">, lo vinculás:
      const selector = document.getElementById('selector-idioma');
      if (selector) {
        selector.value = defaultLang;
        selector.addEventListener('change', () => {
          setLanguage(selector.value);
        });
      }
    })
    .catch(err => {
      console.error('Error al cargar traducciones:', err);
    });
});

// Contenido editable del sitio.
// DEFAULT_CONTENT son los valores por defecto que se muestran mientras la
// administradora no haya guardado un texto propio desde /admin/content.
// CONTENT_SCHEMA describe los campos para generar el formulario del panel.

export const DEFAULT_SETTINGS = {
  instagram: "https://www.instagram.com/saberes.cientificos",
  youtube: "https://youtube.com/@saberes100tificos",
  telegram_community: "https://t.me/+D5zP8NCGARBjM2Yx",
  telegram_bot: "https://t.me/SaberesCientificos_bot",
  email: "saberes100tificos@gmail.com",
  google_form:
    "https://docs.google.com/forms/d/e/1FAIpQLSfSK73Ai_PIkyqtZz7pV4-w2pmS0gcdkF50qZQ3BJf0fg4Kjg/viewform",
};

export const DEFAULT_CONTENT = {
  hero: {
    badge: "Acercando la ciencia a la comunidad",
    title: "Un espacio para descubrir, preguntar y transformar más allá del aula.",
    subtitle:
      "Saberes Científicos combina divulgación, orientación vocacional y acompañamiento académico continuo. Somos estudiantes y egresados de la Universidad Simón Bolívar.",
  },
  quienes_somos: {
    title: "¿Quiénes somos?",
    intro:
      "Saberes Científicos es un proyecto de Servicio Comunitario adscrito a la Universidad Simón Bolívar.",
    mision:
      "Acercar la ciencia y la orientación académica a estudiantes de educación media, despertando su curiosidad y acompañándolos en su camino hacia la universidad.",
    objetivo:
      "Brindar divulgación científica, orientación vocacional y acompañamiento continuo a jóvenes de la comunidad.",
    adscripcion:
      "Somos un proyecto de Servicio Comunitario adscrito a la Universidad Simón Bolívar (USB).",
  },
  usb: {
    title: "La Universidad Simón Bolívar",
    resena:
      "La Universidad Simón Bolívar (USB) es una institución pública venezolana reconocida por su excelencia académica en ciencia, tecnología e ingeniería.",
    ubicacion: "Sede principal en Sartenejas, Baruta, estado Miranda, Venezuela.",
    historia:
      "Fundada en 1967, la USB se ha consolidado como una de las principales casas de estudio del país en formación científica y tecnológica.",
  },
  taller: {
    title: "Taller de orientación vocacional",
    descripcion:
      "Un espacio para ayudar a los estudiantes a descubrir sus intereses, conocer las opciones de carrera y tomar decisiones académicas con más confianza.",
  },
  tour: {
    title: "Tour científico",
    descripcion:
      "Recorridos y experiencias que acercan a los estudiantes al mundo de la ciencia: laboratorios, experimentos y conversaciones con investigadores.",
  },
  divulgacion: {
    title: "Divulgación",
    intro:
      "Artículos de divulgación científica pensados para despertar la curiosidad. Usa el buscador para filtrar por palabras.",
  },
  recursos: {
    title: "Recursos",
    intro: "Guías de estudio y enlaces a videos que se actualizan con el tiempo.",
  },
  orientacion: {
    title: "Orientación vocacional",
    intro:
      "Todo lo que necesitas saber sobre los mecanismos de ingreso a la USB y cómo elegir tu carrera.",
    test:
      "¿Dudas sobre la carrera a elegir? Realiza un breve test conversando con nuestro bot chatUSB.",
  },
  carreras: {
    title: "Carreras de la USB",
    intro:
      "Lista de carreras disponibles en la USB. Haz clic en cada una para abrir su pensum en PDF.",
  },
  contacto: {
    title: "Contáctanos y sé parte de la comunidad",
    intro:
      "Te acompañamos en cada paso del camino hacia la universidad. Escríbenos o únete a nuestra comunidad.",
  },
  blog: {
    title: "Blog",
    intro:
      "Todo nuestro contenido en un solo lugar, ordenado del más reciente al más antiguo. Usa el buscador para encontrar artículos de cualquier sección.",
  },
};

// Esquema para el formulario de /admin/content.
export const CONTENT_SCHEMA = [
  {
    key: "hero",
    label: "Inicio (portada)",
    fields: [
      { name: "badge", label: "Etiqueta superior", type: "text" },
      { name: "title", label: "Título principal", type: "textarea" },
      { name: "subtitle", label: "Subtítulo", type: "textarea" },
    ],
  },
  {
    key: "quienes_somos",
    label: "¿Quiénes somos?",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "intro", label: "Introducción", type: "textarea" },
      { name: "mision", label: "Misión", type: "textarea" },
      { name: "objetivo", label: "Nuestra Visión", type: "textarea" },
      { name: "adscripcion", label: "¿Qué hacemos?", type: "rich" },
    ],
  },
  {
    key: "usb",
    label: "Sobre la USB",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "resena", label: "Nuestra Casa de Estudios", type: "rich" },
      { name: "ubicacion", label: "Conexión con Saberes Científicos", type: "rich" },
      { name: "historia", label: "Vida Universitaria y Oportunidades", type: "rich" },
    ],
  },
  {
    key: "taller",
    label: "Taller de orientación vocacional",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "descripcion", label: "Descripción", type: "textarea" },
    ],
  },
  {
    key: "tour",
    label: "Tour científico",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "descripcion", label: "Descripción", type: "textarea" },
    ],
  },
  {
    key: "divulgacion",
    label: "Divulgación (intro)",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "intro", label: "Introducción", type: "textarea" },
    ],
  },
  {
    key: "recursos",
    label: "Recursos (intro)",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "intro", label: "Introducción", type: "textarea" },
    ],
  },
  {
    key: "orientacion",
    label: "Orientación vocacional (intro)",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "intro", label: "Introducción", type: "textarea" },
      { name: "test", label: "Texto del test/bot", type: "textarea" },
    ],
  },
  {
    key: "carreras",
    label: "Carreras (intro)",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "intro", label: "Introducción", type: "textarea" },
    ],
  },
  {
    key: "contacto",
    label: "Contacto (intro)",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "intro", label: "Introducción", type: "textarea" },
    ],
  },
  {
    key: "blog",
    label: "Blog (intro)",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "intro", label: "Introducción", type: "textarea" },
    ],
  },
];

export const SETTINGS_SCHEMA = [
  { name: "instagram", label: "Instagram (URL)" },
  { name: "youtube", label: "YouTube (URL)" },
  { name: "telegram_community", label: "Comunidad Telegram chatUSB (URL)" },
  { name: "telegram_bot", label: "Bot chatUSB de Telegram (URL)" },
  { name: "email", label: "Correo electrónico" },
  { name: "google_form", label: "Formulario de Servicio Comunitario (URL)" },
];

// Mezcla los valores guardados sobre los valores por defecto.
export function mergeContent(key, saved) {
  return { ...(DEFAULT_CONTENT[key] || {}), ...(saved || {}) };
}

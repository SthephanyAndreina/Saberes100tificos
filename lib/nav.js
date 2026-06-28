// Estructura del menú de navegación (8 botones de Mejoras.docx).
// Fuente única usada por el header del sitio.

export const NAV = [
  { label: "Inicio", href: "/" },
  {
    label: "Saberes Científicos",
    children: [
      { label: "¿Quiénes somos?", href: "/saberes-cientificos/quienes-somos" },
      { label: "Reseña de la USB", href: "/saberes-cientificos/usb" },
    ],
  },
  {
    label: "Actividades",
    children: [
      { label: "Taller de orientación vocacional", href: "/actividades/taller-orientacion-vocacional" },
      { label: "Tour científico", href: "/actividades/tour-cientifico" },
    ],
  },
  { label: "Divulgación", href: "/divulgacion" },
  { label: "Recursos", href: "/recursos" },
  {
    label: "Orientación Vocacional",
    children: [
      { label: "Artículos (#Ingreso a la USB)", href: "/orientacion-vocacional/articulos" },
      { label: "Carreras y pensum", href: "/orientacion-vocacional/carreras" },
    ],
  },
  { label: "Contáctanos", href: "/contacto" },
  { label: "Blog", href: "/blog" },
];

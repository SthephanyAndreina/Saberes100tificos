// Renderiza texto enriquecido (HTML de TipTap) admitiendo listas, negritas,
// enlaces, etc., con una tipografía compacta pensada para tarjetas y bloques.
// Es compatible con texto plano heredado: si el valor no tiene etiquetas HTML
// igualmente se muestra correctamente.
export default function RichContent({ html = "", style }) {
  return (
    <div
      className="rich-content"
      style={style}
      dangerouslySetInnerHTML={{ __html: html || "" }}
    />
  );
}

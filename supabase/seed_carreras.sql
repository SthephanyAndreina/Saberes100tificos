-- ============================================================================
-- Carreras de la USB con su pensum (generado desde public/pensum_carreras).
-- Ejecutar en Supabase: SQL Editor -> New query -> pegar todo -> Run.
-- Es idempotente: no duplica carreras si lo corres mas de una vez.
-- ============================================================================

insert into public.carreras (name, pensum_url, sort_order)
select v.name, v.url, v.ord
from (values
  ('Ingeniería Eléctrica', '/pensum_carreras/0100%20-%20Ingenier%C3%ADa%20El%C3%A9ctrica.pdf', 1),
  ('Ingeniería Mecánica', '/pensum_carreras/0200%20-%20Ingenier%C3%ADa%20Mec%C3%A1nica.pdf', 2),
  ('Ingeniería Química', '/pensum_carreras/0300%20-%20Ingenier%C3%ADa%20Qu%C3%ADmica.pdf', 3),
  ('Licenciatura en Química', '/pensum_carreras/0400%20-%20Licenciatura%20en%20Qu%C3%ADmica.pdf', 4),
  ('Licenciatura en Matemáticas', '/pensum_carreras/0500-0501-0502%20-%20Licenciatura%20en%20Matem%C3%A1ticas.pdf', 5),
  ('Ingeniería Electrónica', '/pensum_carreras/0600%20-%20Ingenier%C3%ADa%20Electr%C3%B3nica.pdf', 6),
  ('Arquitectura', '/pensum_carreras/0700%20-%20Arquitectura.pdf', 7),
  ('Ingeniería de Computación', '/pensum_carreras/0800%20-%20Ingenier%C3%ADa%20de%20Computaci%C3%B3n.pdf', 8),
  ('Licenciatura en Física', '/pensum_carreras/1000%20-%20Licenciatura%20en%20F%C3%ADsica.pdf', 9),
  ('Urbanismo', '/pensum_carreras/1100%20-%20Urbanismo.pdf', 10),
  ('Ingeniería Geofísica', '/pensum_carreras/1200%20-%20Ingenier%C3%ADa%20Geof%C3%ADsica.pdf', 11),
  ('Ingeniería de Materiales', '/pensum_carreras/1500%20-%20Ingenier%C3%ADa%20de%20Materiales.pdf', 12),
  ('Ingeniería de Producción', '/pensum_carreras/1700%20-%20Ingenier%C3%ADa%20de%20Producci%C3%B3n.pdf', 13),
  ('Ingeniería de Telecomunicaciones', '/pensum_carreras/1800%20-%20Ingenier%C3%ADa%20de%20Telecomunicaciones.pdf', 14),
  ('Licenciatura en Biología', '/pensum_carreras/1900%20-%20Licenciatura%20en%20Biolog%C3%ADa.pdf', 15),
  ('Licenciatura en Gestión de la Hospitalidad', '/pensum_carreras/3000%20-%20Licenciatura%20en%20Gesti%C3%B3n%20de%20la%20Hospitalidad.pdf', 16),
  ('Licenciatura en Comercio Internacional', '/pensum_carreras/3200%20-%20Licenciatura%20en%20Comercio%20Internacional.pdf', 17),
  ('Ingeniería de Mantenimiento', '/pensum_carreras/4000%20-%20Ingenier%C3%ADa%20de%20Mantenimiento.pdf', 18),
  ('TSU en Administración Aduanera', '/pensum_carreras/TSU%20en%20Administraci%C3%B3n%20Aduanera.pdf', 19),
  ('TSU en Administración Hotelera', '/pensum_carreras/TSU%20en%20Administraci%C3%B3n%20Hotelera.pdf', 20),
  ('TSU en Administración del Transporte', '/pensum_carreras/TSU%20en%20Administraci%C3%B3n%20del%20Transporte.pdf', 21),
  ('TSU en Administración del Turismo', '/pensum_carreras/TSU%20en%20Administraci%C3%B3n%20del%20Turismo.pdf', 22),
  ('TSU en Comercio Exterior', '/pensum_carreras/TSU%20en%20Comercio%20Exterior.pdf', 23),
  ('TSU en Mantenimiento Aeronáutico', '/pensum_carreras/TSU%20en%20Mantenimiento%20Aeron%C3%A1utico.pdf', 24),
  ('TSU en Organización Empresarial', '/pensum_carreras/TSU%20en%20Organizaci%C3%B3n%20Empresarial.pdf', 25),
  ('TSU en Tecnología Electrónica', '/pensum_carreras/TSU%20en%20Tecnolog%C3%ADa%20Electr%C3%B3nica.pdf', 26),
  ('TSU en Tecnología Eléctrica', '/pensum_carreras/TSU%20en%20Tecnolog%C3%ADa%20El%C3%A9ctrica.pdf', 27),
  ('TSU en Tecnología Mecánica', '/pensum_carreras/TSU%20en%20Tecnolog%C3%ADa%20Mec%C3%A1nica.pdf', 28)
) as v(name, url, ord)
where not exists (
  select 1 from public.carreras c where c.name = v.name
);

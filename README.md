# TechPods Mtr PWA

Aplicacion web progresiva para catalogo y administracion de productos tecnologicos.

## Stack

- HTML5, CSS3 y JavaScript Vanilla con modulos ES.
- Supabase Auth, PostgreSQL y Storage.
- Hosting estatico en Vercel.

## Puesta en marcha

1. Crea un proyecto en Supabase.
2. Ejecuta el script de [supabase/schema.sql](supabase/schema.sql) en el SQL Editor.
3. Crea un usuario administrador desde Supabase Auth.
4. En la tabla `profiles`, actualiza su rol:

```sql
update public.profiles
set role = 'administrador'
where id = 'UUID_DEL_USUARIO';
```

5. Edita [js/config/supabase.js](js/config/supabase.js) con tu `SUPABASE_URL` y `SUPABASE_ANON_KEY`.
6. Configura tu numero de WhatsApp en [js/config/app.js](js/config/app.js).
7. Despliega en Vercel importando este repositorio.

## Rutas

- `/` inicio.
- `/productos` catalogo.
- `/producto/:id` detalle de producto.
- `/contacto` contacto por WhatsApp.
- `/admin/login` login.
- `/admin/dashboard` dashboard.
- `/admin/productos` gestion.
- `/admin/productos/nuevo` crear producto.
- `/admin/productos/editar/:id` editar producto.

Las rutas dinamicas funcionan por las reglas de [vercel.json](vercel.json).

## Seguridad

- La lectura de productos activos es publica.
- La escritura, edicion, eliminacion e inventario quedan limitados por RLS a usuarios con rol `administrador`.
- El panel valida sesion y rol antes de mostrar datos.
- La key anonima de Supabase es publica por diseno; la seguridad real esta en RLS y policies de Storage.

## PWA

Incluye `manifest.json`, `service-worker.js`, pagina offline e iconos. En iPhone se instala desde Compartir > Agregar a pantalla de inicio. En Android el navegador mostrara el prompt de instalacion cuando cumpla los criterios.


# Guia de produccion - TechPods Mtr

## Arquitectura

El proyecto es una PWA estatica servida por Vercel. No requiere build ni framework.

- `index.html`, `productos/`, `producto/`, `contacto/`: area cliente.
- `admin/`: area administrativa protegida con Supabase Auth.
- `js/services/`: acceso a Supabase, Auth, productos y Storage.
- `js/components/`: componentes reutilizables de UI.
- `js/pages/`: controladores por pagina.
- `css/styles.css`: sistema visual responsive.
- `supabase/schema.sql`: base de datos, roles, RLS y Storage.
- `manifest.json` y `service-worker.js`: PWA.

## Supabase

1. Crea un proyecto en Supabase.
2. Ejecuta `supabase/schema.sql`.
3. Crea el usuario administrador en Authentication.
4. Promueve ese usuario:

```sql
update public.profiles
set role = 'administrador'
where email = 'admin@tudominio.com';
```

5. Confirma que el bucket `productos` existe y es publico.
6. Copia `Project URL` y `anon public key` en `js/config/supabase.js`.

## Seguridad

- La tabla `productos` no se expone al usuario anonimo.
- El cliente consulta la vista `catalogo_productos`, que no incluye `stock`.
- Las escrituras en productos y Storage requieren `role = 'administrador'`.
- RLS permanece activo en todas las tablas sensibles.
- No uses service role key en el frontend.
- Usa contrasenas robustas y activa MFA para cuentas admin si tu plan lo permite.

## Vercel

1. Sube el repositorio a GitHub/GitLab/Bitbucket.
2. Importa el proyecto en Vercel.
3. Framework preset: `Other`.
4. Build command: vacio.
5. Output directory: vacio o raiz del proyecto.
6. Deploy.

`vercel.json` configura rutas limpias y rewrites para:

- `/producto/:id`
- `/admin/productos/editar/:id`
- rutas admin sin `.html`

## PWA

La app incluye:

- Manifest con nombre, colores e iconos PNG.
- Service worker con cache offline.
- Pagina `/offline.html`.
- `theme-color`.
- `apple-touch-icon`.

Para iPhone, instalar desde Safari con Compartir > Agregar a pantalla de inicio.

## Operacion admin

El administrador puede:

- Crear, editar y eliminar productos.
- Gestionar stock.
- Subir imagenes al bucket `productos`.
- Marcar destacados.
- Gestionar promociones basicas con `precio_anterior` y estado destacado.

La tabla `promociones` queda creada para evolucionar hacia reglas promocionales mas avanzadas.

## Checklist antes de publicar

- Reemplazar `SUPABASE_CONFIG` con valores reales.
- Cambiar `whatsappNumber` en `js/config/app.js`.
- Probar login admin.
- Crear al menos un producto activo.
- Verificar instalacion PWA en Android y iPhone.
- Revisar dominio personalizado en Vercel.
- Configurar politicas de contrasena y confirmacion de email en Supabase.


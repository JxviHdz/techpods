import { supabase } from "./supabaseClient.js";

const TABLE = "productos";
const PUBLIC_VIEW = "catalogo_productos";
const PUBLIC_COLUMNS = "id,nombre,marca,modelo,categoria,descripcion,almacenamiento,ram,color,porcentaje_bateria,precio,precio_anterior,destacado,imagen,estado,created_at";
const ADMIN_COLUMNS = "id,nombre,marca,modelo,categoria,descripcion,almacenamiento,ram,color,porcentaje_bateria,precio,precio_anterior,stock,destacado,imagen,estado,created_at";

export async function getPublicProducts(filters = {}) {
  let query = supabase
    .from(PUBLIC_VIEW)
    .select(PUBLIC_COLUMNS)
    .eq("estado", "activo")
    .order("created_at", { ascending: false });

  if (filters.category) query = query.eq("categoria", filters.category);
  if (filters.featured) query = query.eq("destacado", true);
  if (filters.search) {
    const term = `%${filters.search.trim()}%`;
    query = query.or(`nombre.ilike.${term},marca.ilike.${term},modelo.ilike.${term},categoria.ilike.${term}`);
  }

  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getProductById(id, admin = false) {
  const { data, error } = await supabase
    .from(admin ? TABLE : PUBLIC_VIEW)
    .select(admin ? ADMIN_COLUMNS : PUBLIC_COLUMNS)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getAdminProducts() {
  const { data, error } = await supabase
    .from(TABLE)
    .select(ADMIN_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createProduct(payload) {
  const { data, error } = await supabase.from(TABLE).insert(payload).select(ADMIN_COLUMNS).single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id, payload) {
  const { data, error } = await supabase.from(TABLE).update(payload).eq("id", id).select(ADMIN_COLUMNS).single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id) {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}

export async function uploadProductImage(file) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `${crypto.randomUUID()}.${extension}`;
  const path = `productos/${fileName}`;

  const { error } = await supabase.storage.from("productos").upload(path, file, {
    cacheControl: "3600",
    upsert: false
  });

  if (error) throw error;
  const { data } = supabase.storage.from("productos").getPublicUrl(path);
  return data.publicUrl;
}

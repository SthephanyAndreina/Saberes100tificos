import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { DEFAULT_SETTINGS, DEFAULT_CONTENT, mergeContent } from "@/lib/content";

// Todas las consultas degradan con gracia: si Supabase no está configurado o
// falla, devuelven valores por defecto / listas vacías para que el sitio
// siempre se renderice.

export async function getSettings() {
  if (!isSupabaseConfigured) return DEFAULT_SETTINGS;
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("data")
      .eq("id", 1)
      .maybeSingle();
    return { ...DEFAULT_SETTINGS, ...(data?.data || {}) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function getContent(key) {
  if (!isSupabaseConfigured) return mergeContent(key, null);
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    return mergeContent(key, data?.value);
  } catch {
    return mergeContent(key, null);
  }
}

export async function getAllContent() {
  const result = {};
  for (const key of Object.keys(DEFAULT_CONTENT)) result[key] = DEFAULT_CONTENT[key];
  if (!isSupabaseConfigured) return result;
  try {
    const supabase = createClient();
    const { data } = await supabase.from("site_content").select("key, value");
    (data || []).forEach((row) => {
      result[row.key] = mergeContent(row.key, row.value);
    });
    return result;
  } catch {
    return result;
  }
}

export async function getCategories() {
  if (!isSupabaseConfigured) return [];
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    return data || [];
  } catch {
    return [];
  }
}

// Posts publicados. Filtros opcionales: categorySlug, limit.
export async function getPosts({ categorySlug, limit } = {}) {
  if (!isSupabaseConfigured) return [];
  try {
    const supabase = createClient();
    let query = supabase
      .from("posts")
      .select("*, category:categories(id, name, slug, color, section)")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false });

    if (categorySlug) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .maybeSingle();
      if (!cat) return [];
      query = query.eq("category_id", cat.id);
    }
    if (limit) query = query.limit(limit);

    const { data } = await query;
    return data || [];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug) {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("posts")
      .select("*, category:categories(id, name, slug, color, section)")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    return data || null;
  } catch {
    return null;
  }
}

export async function getGallery(key) {
  if (!isSupabaseConfigured) return { gallery: null, images: [] };
  try {
    const supabase = createClient();
    const { data: gallery } = await supabase
      .from("galleries")
      .select("*")
      .eq("key", key)
      .maybeSingle();
    if (!gallery) return { gallery: null, images: [] };
    const { data: images } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("gallery_id", gallery.id)
      .order("sort_order", { ascending: true });
    return { gallery, images: images || [] };
  } catch {
    return { gallery: null, images: [] };
  }
}

export async function getResources() {
  if (!isSupabaseConfigured) return [];
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("resources")
      .select("*")
      .order("sort_order", { ascending: true });
    return data || [];
  } catch {
    return [];
  }
}

export async function getCarreras() {
  if (!isSupabaseConfigured) return [];
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("carreras")
      .select("*")
      .order("sort_order", { ascending: true });
    return data || [];
  } catch {
    return [];
  }
}

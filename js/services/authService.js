import { supabase } from "./supabaseClient.js";

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getCurrentUserProfile() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,role,created_at")
    .eq("id", userData.user.id)
    .single();

  if (error) throw error;
  return data;
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    window.location.replace("/admin/login.html");
    return null;
  }

  const profile = await getCurrentUserProfile();
  if (profile?.role !== "administrador") {
    await signOut();
    window.location.replace("/admin/login.html");
    return null;
  }

  return profile;
}


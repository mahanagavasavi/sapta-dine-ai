import { supabase } from "./supabaseClient";

export async function getMenuItems() {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("id");
    console.log("SUPABASE MENU:", data)
  if (error) {
    throw error;
  }

  return data;
}


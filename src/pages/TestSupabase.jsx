import { useEffect } from "react";
import { supabase } from "../services/supabaseClient";

export default function TestSupabase() {
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*");

      console.log("DATA:", data);
      console.log("ERROR:", error);
    }

    testConnection();
  }, []);

  return (
    <div className="p-10 text-2xl">
      Testing Supabase Connection...
    </div>
  );
}
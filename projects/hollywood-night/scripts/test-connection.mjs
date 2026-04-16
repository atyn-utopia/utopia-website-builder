import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing env vars");
  process.exit(1);
}

const client = createClient(url, key, {
  auth: { persistSession: false },
  db: { schema: "hollywood" },
});

console.log("Testing hollywood.guests read...");
const { data, error } = await client.from("guests").select("*").limit(1);
if (error) {
  console.error("ERROR:", error.code ?? "", error.message);
  console.error("Hint:", error.hint ?? "—");
  process.exit(1);
}
console.log("OK — rows returned:", data?.length ?? 0);

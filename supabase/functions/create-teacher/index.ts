import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify caller is admin
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) throw new Error("Unauthorized");

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .single();

    if (!roleData) throw new Error("Only admins can create accounts");

    const { email, password, fullName, kindergartenId, role = "teacher" } = await req.json();

    if (!email || !password || !fullName || !kindergartenId) {
      throw new Error("Missing required fields: email, password, fullName, kindergartenId");
    }

    // Validate role
    const validRoles = ["teacher", "kg_admin"];
    if (!validRoles.includes(role)) {
      throw new Error("Invalid role. Must be 'teacher' or 'kg_admin'");
    }

    // Create the user
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (createError) throw createError;
    if (!newUser.user) throw new Error("Failed to create user");

    const userId = newUser.user.id;

    // Update profile with kindergarten_id
    await adminClient
      .from("profiles")
      .update({ kindergarten_id: kindergartenId })
      .eq("id", userId);

    // Assign role
    await adminClient
      .from("user_roles")
      .insert({ user_id: userId, role });

    return new Response(
      JSON.stringify({ success: true, userId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("create-teacher error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

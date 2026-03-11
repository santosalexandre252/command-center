import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Smarter fallback: Try Service Key first (for restricted buckets), fallback to Anon Key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function POST(request) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase keys not configured properly in .env.local" },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("gpx");
    const raceId = formData.get("raceId");

    if (!file || !raceId) return NextResponse.json({ error: "GPX file and race ID required" }, { status: 400 });
    if (!file.name.endsWith(".gpx")) return NextResponse.json({ error: "File must be a GPX file" }, { status: 400 });

    const fileName = `races/${raceId}/course.gpx`;
    const { data, error } = await supabase.storage
      .from("gpx-files")
      .upload(fileName, file, {
        contentType: "application/gpx+xml",
        upsert: true,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage.from("gpx-files").getPublicUrl(fileName);

    return NextResponse.json({ success: true, fileName, publicUrl: urlData.publicUrl });
  } catch (err) {
    console.error("GPX upload error:", err);
    return NextResponse.json({ error: "Failed to upload GPX file", details: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    if (!supabase) return NextResponse.json({ exists: false });

    const { searchParams } = new URL(request.url);
    const raceId = searchParams.get("raceId");

    if (!raceId) return NextResponse.json({ error: "Race ID required" }, { status: 400 });

    const fileName = `races/${raceId}/course.gpx`;
    const { data, error } = await supabase.storage.from("gpx-files").list(`races/${raceId}`);

    if (error || !data || data.length === 0) return NextResponse.json({ exists: false });

    const { data: urlData } = supabase.storage.from("gpx-files").getPublicUrl(fileName);

    return NextResponse.json({ exists: true, publicUrl: urlData.publicUrl });
  } catch (err) {
    console.error("GPX check error:", err);
    return NextResponse.json({ exists: false });
  }
}
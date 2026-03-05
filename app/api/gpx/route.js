import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Initialize Supabase client only if credentials are available
const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export async function POST(request) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      console.warn("Supabase not configured: GPX upload disabled");
      return NextResponse.json(
        { error: "GPX feature is not configured. Set SUPABASE_SERVICE_ROLE_KEY in environment variables." },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("gpx");
    const raceId = formData.get("raceId");

    if (!file || !raceId) {
      return NextResponse.json({ error: "GPX file and race ID required" }, { status: 400 });
    }

    // Validate file type
    if (!file.name.endsWith(".gpx")) {
      return NextResponse.json({ error: "File must be a GPX file" }, { status: 400 });
    }

    // Upload to Supabase Storage
    const fileName = `races/${raceId}/course.gpx`;
    const { data, error } = await supabase.storage
      .from("gpx-files")
      .upload(fileName, file, {
        contentType: "application/gpx+xml",
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json({ error: "Failed to upload GPX file", details: error.message }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("gpx-files")
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      fileName,
      publicUrl: urlData.publicUrl,
    });

  } catch (err) {
    console.error("GPX upload error:", err);
    return NextResponse.json(
      { error: "Failed to upload GPX file", details: err.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      console.warn("Supabase not configured: GPX feature disabled");
      return NextResponse.json({ exists: false });
    }

    const { searchParams } = new URL(request.url);
    const raceId = searchParams.get("raceId");

    if (!raceId) {
      return NextResponse.json({ error: "Race ID required" }, { status: 400 });
    }

    const fileName = `races/${raceId}/course.gpx`;

    // Check if file exists
    const { data, error } = await supabase.storage
      .from("gpx-files")
      .list(`races/${raceId}`);

    if (error) {
      // Bucket doesn't exist or access denied - treat as no file
      console.warn(`GPX bucket access issue for race ${raceId}:`, error.message);
      return NextResponse.json({ exists: false });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ exists: false });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("gpx-files")
      .getPublicUrl(fileName);

    return NextResponse.json({
      exists: true,
      publicUrl: urlData.publicUrl,
    });

  } catch (err) {
    console.error("GPX check error:", err);
    // Return gracefully - GPX is optional
    return NextResponse.json({ exists: false });
  }
}
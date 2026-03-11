import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "This route is deprecated. Please use the direct Supabase integration." },
    { status: 410 }
  );
}

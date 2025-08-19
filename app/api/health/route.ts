import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "API is healthy",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
}

export async function POST() {
  return NextResponse.json({
    message: "POST method working",
    timestamp: new Date().toISOString(),
  });
}

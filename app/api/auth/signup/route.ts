import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

// Common CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

// Handle OPTIONS (CORS Preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req: Request) {
  try {
    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid JSON format" }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new NextResponse(
        JSON.stringify({ message: "Name, email and password are required" }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ message: "Email already registered" }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword }]);

    if (error) {
      console.error("Signup error:", error);
      return new NextResponse(
        JSON.stringify({ message: "Error creating user" }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "User created successfully" }),
      {
        status: 201,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Internal Server Error",
        error:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

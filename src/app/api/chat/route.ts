import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { reply: "Please send a message." },
        { status: 400 }
      );
    }

    // 1️⃣ Query relevant product info
    const { data: products } = await supabase
      .from("products")
      .select("id, name")
      .limit(10);

    const productListText = products
      ?.map((p) => `• ${p.name} — /product/${p.id}`)
      .join("\n") || "No products available.";

    // 2️⃣ Build prompt
    const prompt = `
User query: "${message}"

Available products:
${productListText}

Please respond with relevant shoe product recommendations and include product page links (format links like /product/{id}).
`;

    // 3️⃣ Send to Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    // Extract text reply
    const replyText = response?.text ?? "Sorry, no results found.";

    return NextResponse.json({ reply: replyText });
  } catch (err) {
    console.error("Gemini chat error:", err);
    return NextResponse.json(
      { reply: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}

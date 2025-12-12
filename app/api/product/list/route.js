import connectDB from "@/lib/connectDB"; // ✅ use lib if that's where your db file is
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({}).lean(); // ✅ safer for JSON

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 } // ✅ proper error status
    );
  }
}

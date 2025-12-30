import connectDB from "@/config/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    await connectDB();

    const products = await Product.find({
      name: { $regex: query, $options: "i" }, // case-insensitive search
    });

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Search failed" },
      { status: 500 }
    );
  }
}

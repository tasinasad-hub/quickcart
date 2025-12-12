import connectDB from "@/config/db"; // or "@/lib/connectDB" if you're using that
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: "not authorized" },
        { status: 403 }
      );
    }

    await connectDB();

    const products = await Product.find({});

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}

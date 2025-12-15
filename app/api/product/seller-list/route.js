import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Order from "@/models/Order"; // ✅ Import Order model
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // ✅ Fetch orders and populate product + address
    const orders = await Order.find({})
      .populate("items.product")
      .populate("address");

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
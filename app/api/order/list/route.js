import connectDB from "../../../../config/db.js";
import Order from "../../../../models/Order.js";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectDB();

    // Fetch orders for this user
    const orders = await Order.find({ userId })
      .populate({
        path: "items.product",
        select: "name offerPrice images",
      })
      .populate("address"); // ✅ include address if your schema references it

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("API /order/list error:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}

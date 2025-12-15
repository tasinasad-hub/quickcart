import connectDB from "../../../../config/db.js";       // ✅ four levels up
import authSeller from "../../../../lib/authSeller.js"; // ✅ four levels up
import Order from "../../../../models/Order.js";        // ✅ four levels up
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

    const orders = await Order.find({})
      .populate({
        path: "items.product",
        select: "name userId",
      })
      .populate("address");

    const sellerOrders = orders.filter(order =>
      order.items.some(item => item.product?.userId === userId)
    );

    return NextResponse.json({ success: true, orders: sellerOrders });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

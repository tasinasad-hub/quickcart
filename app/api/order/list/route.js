import connectDB from "../../../../config/db.js";
import Order from "../../../../models/Order.js";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    await connectDB();

    const orders = await Order.find({ userId })
      .populate({
        path: "items.product",
        select: "name offerPrice images",
      });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

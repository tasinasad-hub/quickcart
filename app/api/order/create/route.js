import connectDB from "../../../config/db.js";        // ✅ relative path
import Order from "../../../models/Order.js";         // ✅ relative path
import Product from "../../../models/Product.js";     // ✅ relative path
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items } = await request.json();

    if (!userId || !address || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    await connectDB();

    // Calculate total amount
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({ success: false, message: "Product not found" });
      }
      amount += product.offerPrice * item.quantity;
    }

    const order = await Order.create({
      userId,
      address,
      items,
      amount,
      status: "Order Placed",
      date: new Date(),
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

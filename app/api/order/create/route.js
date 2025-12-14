import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User"; // ✅ Added import
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items } = await request.json();

    if (!address || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    // ✅ Calculate amount safely (instead of broken reduce)
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({ success: false, message: "Product not found" });
      }
      amount += product.offerPrice * item.quantity;
    }

    // ✅ Send event to Inngest
    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address,
        items,
        amount: amount + Math.floor(amount * 0.02), // add tax
        date: Date.now(), // ✅ fixed
      },
    });

    // ✅ Clear user cart
    const user = await User.findById(userId);
    if (user) {
      user.cartItems = {};
      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: "Order calculation complete",
      amount,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message });
  }
}

import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User"; // ✅ Added
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items } = await request.json();

    if (!address || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    // ✅ Use Promise.all + map
    const products = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) throw new Error("Product not found");
        return product.offerPrice * item.quantity;
      })
    );

    const amount = products.reduce((acc, val) => acc + val, 0);

    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address,
        items,
        amount: amount + Math.floor(amount * 0.02),
        date: Date.now(),
      },
    });

    const user = await User.findById(userId);
    if (user) {
      user.cartItems = {};
      await user.save();
    }

    return NextResponse.json({ success: true, message: "Order created successfully" });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}

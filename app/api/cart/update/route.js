import connectDB from '@/lib/connectDB'; // ✅ use your actual DB path
import User from '@/models/User';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
   
    const { userId } = getAuth(request);
   

    const { cartData } = await request.json();

    await connectDB();
    const user = await User.findById(userId);
    
    user.cartItems = cartData;
    await user.save();

    return NextResponse.json({ success: true, message: 'Cart updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

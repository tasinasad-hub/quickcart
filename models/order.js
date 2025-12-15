import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, ref: 'user', required: true }, // Clerk ID string
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
      quantity: { type: Number, required: true }
    }
  ],
  amount: { type: Number, required: true },
  address: { type: mongoose.Schema.Types.ObjectId, ref: 'address', required: true },
  status: { type: String, required: true, default: "Order Placed" },
  date: { type: Number, required: true },
});

const Order = mongoose.models.order || mongoose.model('order', orderSchema);

export default Order;

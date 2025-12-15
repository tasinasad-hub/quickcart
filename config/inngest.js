export const createUserOrder = inngest.createFunction(
  {
    id: "create-user-order",
    batchEvents: {
      maxSize: 5,
      timeout: "5s",
    },
  },
  { event: "order/created" },
  async ({ events }) => {
    // ✅ Import Order model dynamically
    const { default: Order } = await import("@/models/Order");

    // 🔍 Add the log here
    console.log("Order model loaded:", Order?.modelName);

    await connectDB();
    console.log("Connected to DB");

    console.log("Events received:", events);

    const orders = events.map((event) => ({
      userId: event.data.userId,
      items: event.data.items,
      amount: event.data.amount,
      address: event.data.address,
      date: event.data.date,
    }));

    await Order.insertMany(orders);
    console.log("Orders inserted:", orders.length);

    return { success: true, process: orders.length };
  }
);

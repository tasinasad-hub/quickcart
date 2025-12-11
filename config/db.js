import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // If already connected, return the cached connection
  if (cached.conn) {
    return cached.conn;
  }

  // If no promise yet, create one
  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, opts)
      .then((mongooseInstance) => mongooseInstance);
  }

  // Await the promise and cache the connection
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;


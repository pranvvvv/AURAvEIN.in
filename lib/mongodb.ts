import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

// Check if MongoDB URI is available
if (!uri) {
  console.warn("MONGODB_URI not found in environment variables. Database operations will be limited.");
  // Create a mock client that resolves to null
  clientPromise = Promise.resolve(null as any);
} else {
  if (process.env.NODE_ENV === "development") {
    if (!(global as any)._mongoClientPromise) {
      client = new MongoClient(uri, options);
      (global as any)._mongoClientPromise = client.connect();
    }
    clientPromise = (global as any)._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default clientPromise;

// For Mongoose-based code compatibility
export async function dbConnect() {
  // Dynamically import mongoose to avoid conflicts
  const mongoose = await import('mongoose');
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error('MONGODB_URI not set');
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(MONGODB_URI);
}